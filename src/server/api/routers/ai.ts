import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { 
  createTRPCRouter, 
  publicProcedure, 
  protectedProcedure 
} from '@/server/api/trpc'
import { 
  generateEmbedding,
  generateProductRecommendations,
  analyzeUserStyle,
  enhanceProductDescription,
  analyzeProductImage,
  generateOutfitSuggestions,
  chatWithStyleAssistant,
  generateSizeRecommendation,
  analyzeFashionTrends,
  enhanceSearchQuery,
  findSimilarItems,
  openAIRateLimiter,
  withOpenAIErrorHandling,
} from '@/lib/openai'
import { redis } from '@/lib/redis'
import { ProductStatus } from '@prisma/client'

// Cache TTL constants (in seconds)
const CACHE_TTL = {
  RECOMMENDATIONS: 3600, // 1 hour
  STYLE_PROFILE: 86400, // 24 hours
  PRODUCT_DESCRIPTION: 604800, // 7 days
  OUTFIT_SUGGESTIONS: 3600, // 1 hour
  TRENDS: 86400, // 24 hours
  SEARCH: 3600, // 1 hour
}

export const aiRouter = createTRPCRouter({
  // =============================================
  // PERSONALIZED RECOMMENDATIONS
  // =============================================
  
  getPersonalizedRecommendations: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(12),
      category: z.string().optional(),
      priceRange: z.object({
        min: z.number().optional(),
        max: z.number().optional(),
      }).optional(),
      occasion: z.string().optional(),
      excludeIds: z.array(z.string()).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const cacheKey = `recommendations:${userId}:${JSON.stringify(input)}`
      
      // Check cache
      const cached = await redis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached as string)
      }

      // Get user's style profile and history
      const [styleProfile, purchaseHistory, recentViews] = await Promise.all([
        ctx.prisma.styleProfile.findUnique({
          where: { userId },
        }),
        ctx.prisma.order.findMany({
          where: { 
            userId,
            status: 'DELIVERED',
          },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        }),
        ctx.prisma.productView.findMany({
          where: { userId },
          include: {
            product: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
          distinct: ['productId'],
        }),
      ])

      if (!styleProfile) {
        // Return trending products if no style profile
        const trendingProducts = await ctx.prisma.product.findMany({
          where: {
            status: ProductStatus.ACTIVE,
            ...(input.category && { category: { slug: input.category } }),
            ...(input.priceRange?.min && { price: { gte: input.priceRange.min } }),
            ...(input.priceRange?.max && { price: { lte: input.priceRange.max } }),
            ...(input.excludeIds && { id: { notIn: input.excludeIds } }),
          },
          include: {
            media: {
              where: { isPrimary: true },
              take: 1,
            },
            brand: true,
            category: true,
            variants: {
              where: { isAvailable: true },
              take: 1,
            },
          },
          orderBy: [
            { wishlistCount: 'desc' },
            { viewCount: 'desc' },
          ],
          take: input.limit,
        })

        return {
          recommendations: trendingProducts,
          personalizationScore: 0,
          basedOn: 'trending',
        }
      }

      // Generate AI recommendations
      const userPreferences = `
        Style: ${styleProfile.stylePersonas.join(', ')}
        Colors: ${styleProfile.favoriteColors.join(', ')}
        Brands: ${styleProfile.preferredBrands.join(', ')}
        Budget: $${styleProfile.minPricePreference}-$${styleProfile.maxPricePreference}
        ${styleProfile.prefersSustainable ? 'Prefers sustainable options' : ''}
        ${styleProfile.prefersExclusive ? 'Prefers exclusive items' : ''}
      `

      const purchaseHistoryText = purchaseHistory
        .flatMap(order => order.items.map(item => item.product.name))
        .slice(0, 10)

      const aiRecommendations = await openAIRateLimiter.add(() =>
        withOpenAIErrorHandling(
          () => generateProductRecommendations({
            userPreferences,
            purchaseHistory: purchaseHistoryText,
            count: input.limit,
          }),
          null
        )
      )

      if (!aiRecommendations) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to generate recommendations',
        })
      }

      // Find matching products based on AI recommendations
      const recommendedProducts = await Promise.all(
        aiRecommendations.recommendations.map(async (rec: any) => {
          const products = await ctx.prisma.product.findMany({
            where: {
              status: ProductStatus.ACTIVE,
              category: {
                name: {
                  contains: rec.category,
                  mode: 'insensitive',
                },
              },
              ...(rec.brand_suggestions && {
                brand: {
                  name: {
                    in: rec.brand_suggestions,
                  },
                },
              }),
              ...(input.priceRange?.min && { price: { gte: input.priceRange.min } }),
              ...(input.priceRange?.max && { price: { lte: input.priceRange.max } }),
              ...(input.excludeIds && { id: { notIn: input.excludeIds } }),
            },
            include: {
              media: {
                where: { isPrimary: true },
                take: 1,
              },
              brand: true,
              category: true,
              variants: {
                where: { isAvailable: true },
                take: 1,
              },
            },
            orderBy: {
              wishlistCount: 'desc',
            },
            take: 3,
          })

          return products.map(product => ({
            ...product,
            recommendationReason: rec.reasoning,
            matchScore: rec.match_score,
          }))
        })
      ).then(results => results.flat())

      // If not enough AI recommendations, supplement with similar products
      if (recommendedProducts.length < input.limit && styleProfile.styleEmbedding) {
        const allProducts = await ctx.prisma.product.findMany({
          where: {
            status: ProductStatus.ACTIVE,
            productEmbedding: { not: null },
            id: { 
              notIn: [
                ...recommendedProducts.map(p => p.id),
                ...(input.excludeIds || []),
              ],
            },
          },
          include: {
            media: {
              where: { isPrimary: true },
              take: 1,
            },
            brand: true,
            category: true,
            variants: {
              where: { isAvailable: true },
              take: 1,
            },
          },
        })

        const similarProducts = findSimilarItems(
          styleProfile.styleEmbedding as any,
          allProducts.filter(p => p.productEmbedding) as any,
          input.limit - recommendedProducts.length
        )

        recommendedProducts.push(
          ...similarProducts.map(product => ({
            ...product,
            recommendationReason: 'Similar to your style preferences',
            matchScore: product.similarity,
          }))
        )
      }

      const result = {
        recommendations: recommendedProducts.slice(0, input.limit),
        personalizationScore: styleProfile ? 0.9 : 0.3,
        basedOn: 'ai_personalization',
        styleInsights: aiRecommendations.style_insights,
        trendAlignment: aiRecommendations.trend_alignment,
      }

      // Cache the results
      await redis.setex(
        cacheKey,
        CACHE_TTL.RECOMMENDATIONS,
        JSON.stringify(result)
      )

      return result
    }),

  // =============================================
  // VISUAL SEARCH
  // =============================================
  
  visualSearch: publicProcedure
    .input(z.object({
      imageUrl: z.string().url(),
      limit: z.number().min(1).max(50).default(20),
      priceRange: z.object({
        min: z.number().optional(),
        max: z.number().optional(),
      }).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const cacheKey = `visual_search:${input.imageUrl}`
      
      // Check cache
      const cached = await redis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached as string)
      }

      // Analyze image with AI
      const imageAnalysis = await openAIRateLimiter.add(() =>
        withOpenAIErrorHandling(
          () => analyzeProductImage(input.imageUrl),
          null
        )
      )

      if (!imageAnalysis) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to analyze image',
        })
      }

      // Search for similar products
      const searchConditions = {
        status: ProductStatus.ACTIVE,
        ...(imageAnalysis.category && {
          category: {
            name: {
              contains: imageAnalysis.category,
              mode: 'insensitive' as const,
            },
          },
        }),
        ...(imageAnalysis.colors?.length > 0 && {
          OR: imageAnalysis.colors.map((color: string) => ({
            colorAnalysis: {
              path: ['primary'],
              string_contains: color.toLowerCase(),
            },
          })),
        }),
        ...(input.priceRange?.min && { price: { gte: input.priceRange.min } }),
        ...(input.priceRange?.max && { price: { lte: input.priceRange.max } }),
      }

      const products = await ctx.prisma.product.findMany({
        where: searchConditions,
        include: {
          media: {
            where: { isPrimary: true },
            take: 1,
          },
          brand: true,
          category: true,
          variants: {
            where: { isAvailable: true },
            take: 1,
          },
        },
        take: input.limit * 2, // Get more to filter by embedding similarity
      })

      // If we have product embeddings, sort by similarity
      let sortedProducts = products
      if (products.length > 0 && products[0].productEmbedding) {
        // Generate embedding for the search query
        const searchText = `
          ${imageAnalysis.category} 
          ${imageAnalysis.style_attributes?.join(' ')} 
          ${imageAnalysis.colors?.join(' ')}
          ${imageAnalysis.materials?.join(' ')}
        `
        
        const searchEmbedding = await openAIRateLimiter.add(() =>
          generateEmbedding(searchText)
        )

        if (searchEmbedding) {
          const productsWithSimilarity = products
            .filter(p => p.productEmbedding)
            .map(product => ({
              ...product,
              similarity: cosineSimilarity(
                searchEmbedding,
                product.productEmbedding as any
              ),
            }))
            .sort((a, b) => b.similarity - a.similarity)

          sortedProducts = productsWithSimilarity
        }
      }

      const result = {
        products: sortedProducts.slice(0, input.limit),
        imageAnalysis,
        searchAttributes: {
          category: imageAnalysis.category,
          colors: imageAnalysis.colors,
          style: imageAnalysis.style_attributes,
          materials: imageAnalysis.materials,
        },
      }

      // Cache for 1 hour
      await redis.setex(
        cacheKey,
        CACHE_TTL.SEARCH,
        JSON.stringify(result)
      )

      return result
    }),

  // =============================================
  // STYLE PROFILE GENERATION
  // =============================================
  
  generateStyleProfile: protectedProcedure
    .input(z.object({
      quizAnswers: z.record(z.any()),
      favoriteProductIds: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      // Get user's favorite products if provided
      let favoriteProducts: string[] = []
      if (input.favoriteProductIds && input.favoriteProductIds.length > 0) {
        const products = await ctx.prisma.product.findMany({
          where: {
            id: { in: input.favoriteProductIds },
          },
          select: {
            name: true,
            category: { select: { name: true } },
            brand: { select: { name: true } },
          },
        })
        
        favoriteProducts = products.map(p => 
          `${p.name} by ${p.brand?.name || 'Unknown'} (${p.category.name})`
        )
      }

      // Get user demographics
      const user = await ctx.prisma.user.findUnique({
        where: { id: userId },
        select: {
          membershipTier: true,
          preferredCurrency: true,
          createdAt: true,
        },
      })

      // Generate style analysis with AI
      const styleAnalysis = await openAIRateLimiter.add(() =>
        withOpenAIErrorHandling(
          () => analyzeUserStyle({
            favoriteProducts,
            styleQuizAnswers: input.quizAnswers,
            demographics: {
              membershipTier: user?.membershipTier,
              currency: user?.preferredCurrency,
              accountAge: user ? 
                Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)) : 
                0,
            },
          }),
          null
        )
      )

      if (!styleAnalysis) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to generate style profile',
        })
      }

      // Generate embeddings for the style profile
      const styleText = `
        ${styleAnalysis.style_personas.join(' ')}
        ${styleAnalysis.style_description}
        ${styleAnalysis.brand_affinity.join(' ')}
      `
      
      const styleEmbedding = await openAIRateLimiter.add(() =>
        generateEmbedding(styleText)
      )

      // Extract price preferences from quiz answers
      const priceRange = input.quizAnswers.priceRange || { min: 0, max: 10000 }

      // Create or update style profile
      const styleProfile = await ctx.prisma.styleProfile.upsert({
        where: { userId },
        create: {
          userId,
          stylePersonas: styleAnalysis.style_personas,
          favoriteColors: styleAnalysis.color_palette.primary,
          avoidedColors: [],
          preferredBrands: styleAnalysis.brand_affinity,
          avoidedMaterials: [],
          minPricePreference: priceRange.min,
          maxPricePreference: priceRange.max,
          sweetSpotPrice: (priceRange.min + priceRange.max) / 2,
          prefersSustainable: input.quizAnswers.sustainability === 'important',
          prefersExclusive: input.quizAnswers.exclusivity === 'important',
          earlyAdopterScore: 
            styleAnalysis.style_attributes.trend_adoption === 'early' ? 0.8 : 0.5,
          luxuryAffinityScore: 
            user?.membershipTier === 'OBSIDIAN' ? 0.9 : 0.6,
          styleEmbedding: styleEmbedding as any,
          styleHistory: {
            analyses: [
              {
                date: new Date().toISOString(),
                analysis: styleAnalysis,
              },
            ],
          },
        },
        update: {
          stylePersonas: styleAnalysis.style_personas,
          favoriteColors: styleAnalysis.color_palette.primary,
          preferredBrands: styleAnalysis.brand_affinity,
          minPricePreference: priceRange.min,
          maxPricePreference: priceRange.max,
          sweetSpotPrice: (priceRange.min + priceRange.max) / 2,
          prefersSustainable: input.quizAnswers.sustainability === 'important',
          prefersExclusive: input.quizAnswers.exclusivity === 'important',
          styleEmbedding: styleEmbedding as any,
          styleHistory: {
            analyses: ctx.prisma.$queryRaw`
              jsonb_insert(
                COALESCE(style_history, '{"analyses": []}'),
                '{analyses, 0}',
                ${JSON.stringify({
                  date: new Date().toISOString(),
                  analysis: styleAnalysis,
                })}::jsonb
              )
            `,
          },
        },
      })

      // Update user's style profile completion flag
      await ctx.prisma.user.update({
        where: { id: userId },
        data: { styleProfileCompleted: true },
      })

      // Log AI interaction
      await ctx.prisma.aiInteraction.create({
        data: {
          userId,
          interactionType: 'STYLE_QUIZ',
          inputData: {
            quizAnswers: input.quizAnswers,
            favoriteProducts,
          },
          outputData: styleAnalysis,
          confidenceScore: 0.85,
        },
      })

      return {
        styleProfile,
        analysis: styleAnalysis,
      }
    }),

  // =============================================
  // OUTFIT SUGGESTIONS
  // =============================================
  
  generateOutfits: publicProcedure
    .input(z.object({
      productId: z.string(),
      occasion: z.string().optional(),
      season: z.string().optional(),
      limit: z.number().min(1).max(5).default(3),
    }))
    .query(async ({ ctx, input }) => {
      const cacheKey = `outfits:${input.productId}:${input.occasion}:${input.season}`
      
      // Check cache
      const cached = await redis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached as string)
      }

      // Get the base product
      const baseProduct = await ctx.prisma.product.findUnique({
        where: { id: input.productId },
        include: {
          category: true,
          brand: true,
        },
      })

      if (!baseProduct) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found',
        })
      }

      // Get user's style if authenticated
      let userStyle: string | undefined
      if (ctx.session?.user) {
        const styleProfile = await ctx.prisma.styleProfile.findUnique({
          where: { userId: ctx.session.user.id },
          select: { stylePersonas: true },
        })
        userStyle = styleProfile?.stylePersonas.join(', ')
      }

      // Generate outfit suggestions with AI
      const outfitSuggestions = await openAIRateLimiter.add(() =>
        withOpenAIErrorHandling(
          () => generateOutfitSuggestions({
            baseProduct: {
              name: baseProduct.name,
              category: baseProduct.category.name,
              color: (baseProduct.colorAnalysis as any)?.primary || 'neutral',
              style: baseProduct.styleTags[0] || 'versatile',
            },
            occasion: input.occasion,
            season: input.season,
            userStyle,
          }),
          null
        )
      )

      if (!outfitSuggestions) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to generate outfit suggestions',
        })
      }

      // Find matching products for each outfit
      const outfitsWithProducts = await Promise.all(
        outfitSuggestions.outfits.slice(0, input.limit).map(async (outfit: any) => {
          const outfitItems = await Promise.all(
            outfit.items.map(async (item: any) => {
              const products = await ctx.prisma.product.findMany({
                where: {
                  status: ProductStatus.ACTIVE,
                  category: {
                    name: {
                      contains: item.category,
                      mode: 'insensitive',
                    },
                  },
                  id: { not: input.productId }, // Exclude the base product
                },
                include: {
                  media: {
                    where: { isPrimary: true },
                    take: 1,
                  },
                  brand: true,
                  category: true,
                  variants: {
                    where: { isAvailable: true },
                    take: 1,
                  },
                },
                orderBy: {
                  wishlistCount: 'desc',
                },
                take: 3,
              })

              return {
                ...item,
                suggestedProducts: products,
              }
            })
          )

          return {
            ...outfit,
            items: outfitItems,
            baseProduct,
          }
        })
      )

      const result = {
        outfits: outfitsWithProducts,
        baseProduct,
      }

      // Cache for 1 hour
      await redis.setex(
        cacheKey,
        CACHE_TTL.OUTFIT_SUGGESTIONS,
        JSON.stringify(result)
      )

      return result
    }),

  // =============================================
  // AI CHAT ASSISTANT
  // =============================================
  
  chat: protectedProcedure
    .input(z.object({
      message: z.string().min(1).max(500),
      conversationId: z.string().optional(),
      context: z.object({
        currentPage: z.string().optional(),
        productId: z.string().optional(),
      }).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      // Get user's style profile for context
      const styleProfile = await ctx.prisma.styleProfile.findUnique({
        where: { userId },
        select: {
          stylePersonas: true,
          favoriteColors: true,
          preferredBrands: true,
        },
      })

      // Get recent products viewed for context
      const recentProducts = await ctx.prisma.productView.findMany({
        where: { userId },
        include: {
          product: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      })

      // Get conversation history if conversation ID provided
      let conversationHistory: Array<{ role: string; content: string }> = []
      if (input.conversationId) {
        // In a real implementation, you'd fetch from a conversation store
        // For now, we'll use a simple approach
      }

      // Generate AI response
      const response = await openAIRateLimiter.add(() =>
        withOpenAIErrorHandling(
          () => chatWithStyleAssistant({
            message: input.message,
            context: {
              userStyle: styleProfile?.stylePersonas.join(', '),
              recentProducts: recentProducts.map(v => v.product.name),
              currentPage: input.context?.currentPage,
            },
            conversationHistory,
          }),
          'I apologize, but I\'m having trouble processing your request. Please try again.'
        )
      )

      // Log the interaction
      await ctx.prisma.aiInteraction.create({
        data: {
          userId,
          interactionType: 'CHAT',
          inputData: {
            message: input.message,
            context: input.context,
          },
          outputData: {
            response,
          },
        },
      })

      return {
        response,
        conversationId: input.conversationId || `conv_${Date.now()}`,
      }
    }),

  // =============================================
  // SIZE RECOMMENDATIONS
  // =============================================
  
  getSizeRecommendation: protectedProcedure
    .input(z.object({
      productId: z.string(),
      variantId: z.string().optional(),
      measurements: z.record(z.number()).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      // Get product and brand information
      const product = await ctx.prisma.product.findUnique({
        where: { id: input.productId },
        include: {
          brand: true,
          category: true,
          variants: true,
        },
      })

      if (!product) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found',
        })
      }

      // Get user's size profile
      const sizeProfile = await ctx.prisma.sizeProfile.findUnique({
        where: { userId },
      })

      // Get previous purchases from the same brand
      const previousPurchases = await ctx.prisma.orderItem.findMany({
        where: {
          order: {
            userId,
            status: 'DELIVERED',
          },
          product: {
            brandId: product.brandId,
          },
        },
        include: {
          product: {
            select: {
              category: true,
            },
          },
          variant: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      })

      // Generate size recommendation with AI
      const recommendation = await openAIRateLimiter.add(() =>
        withOpenAIErrorHandling(
          () => generateSizeRecommendation({
            userMeasurements: input.measurements || 
              (sizeProfile?.measurements as Record<string, number>) || {},
            productCategory: product.category.name,
            brandName: product.brand?.name || 'Unknown',
            brandSizeChart: {}, // In real implementation, fetch from brand data
            previousPurchases: previousPurchases.map(item => ({
              brand: product.brand?.name || 'Unknown',
              size: item.variant?.size || 'Unknown',
              fit: 'perfect' as const, // In real implementation, get from reviews
            })),
          }),
          null
        )
      )

      if (!recommendation) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to generate size recommendation',
        })
      }

      // Save recommendation for future reference
      if (sizeProfile && input.variantId) {
        await ctx.prisma.sizeRecommendation.create({
          data: {
            sizeProfileId: sizeProfile.id,
            variantId: input.variantId,
            recommendedSize: recommendation.recommended_size,
            confidenceScore: recommendation.confidence_level === 'high' ? 0.9 :
                           recommendation.confidence_level === 'medium' ? 0.7 : 0.5,
            fitNotes: recommendation,
          },
        })
      }

      return recommendation
    }),

  // =============================================
  // TREND ANALYSIS
  // =============================================
  
  getTrendAnalysis: publicProcedure
    .input(z.object({
      categories: z.array(z.string()).optional(),
      priceRange: z.object({
        min: z.number().optional(),
        max: z.number().optional(),
      }).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const cacheKey = `trends:${JSON.stringify(input)}`
      
      // Check cache
      const cached = await redis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached as string)
      }

      // Get user interests if authenticated
      let userInterests: string[] = []
      if (ctx.session?.user) {
        const styleProfile = await ctx.prisma.styleProfile.findUnique({
          where: { userId: ctx.session.user.id },
          select: {
            stylePersonas: true,
            preferredBrands: true,
          },
        })
        
        if (styleProfile) {
          userInterests = [
            ...styleProfile.stylePersonas,
            ...styleProfile.preferredBrands,
          ]
        }
      }

      // Get current season based on date
      const month = new Date().getMonth()
      const currentSeason = 
        month >= 2 && month <= 4 ? 'Spring' :
        month >= 5 && month <= 7 ? 'Summer' :
        month >= 8 && month <= 10 ? 'Fall' : 'Winter'

      // Generate trend analysis with AI
      const trendAnalysis = await openAIRateLimiter.add(() =>
        withOpenAIErrorHandling(
          () => analyzeFashionTrends({
            userInterests: userInterests.length > 0 ? userInterests : 
              ['luxury fashion', 'contemporary style'],
            currentSeason,
            priceRange: input.priceRange,
          }),
          null
        )
      )

      if (!trendAnalysis) {
        // Return some default trends if AI fails
        return {
          trending_now: [],
          emerging_trends: [],
          timeless_pieces: [],
          personalized_recommendations: 'Unable to generate personalized trends',
          investment_pieces: [],
        }
      }

      // Find products matching the trends
      const trendingProducts = await Promise.all(
        trendAnalysis.trending_now.slice(0, 3).map(async (trend: any) => {
          const products = await ctx.prisma.product.findMany({
            where: {
              status: ProductStatus.ACTIVE,
              OR: [
                { styleTags: { hasSome: [trend.trend.toLowerCase()] } },
                { description: { contains: trend.trend, mode: 'insensitive' } },
              ],
              ...(input.categories && {
                category: { slug: { in: input.categories } },
              }),
              ...(input.priceRange?.min && { price: { gte: input.priceRange.min } }),
              ...(input.priceRange?.max && { price: { lte: input.priceRange.max } }),
            },
            include: {
              media: {
                where: { isPrimary: true },
                take: 1,
              },
              brand: true,
              category: true,
            },
            orderBy: [
              { featuredAt: 'desc' },
              { wishlistCount: 'desc' },
            ],
            take: 4,
          })

          return {
            ...trend,
            products,
          }
        })
      )

      const result = {
        ...trendAnalysis,
        trending_now: trendingProducts,
        lastUpdated: new Date().toISOString(),
      }

      // Cache for 24 hours
      await redis.setex(
        cacheKey,
        CACHE_TTL.TRENDS,
        JSON.stringify(result)
      )

      return result
    }),

  // =============================================
  // SEARCH ENHANCEMENT
  // =============================================
  
  enhanceSearch: publicProcedure
    .input(z.object({
      query: z.string().min(1).max(200),
    }))
    .mutation(async ({ ctx, input }) => {
      const cacheKey = `search_enhance:${input.query.toLowerCase()}`
      
      // Check cache
      const cached = await redis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached as string)
      }

      // Enhance search query with AI
      const enhancement = await openAIRateLimiter.add(() =>
        withOpenAIErrorHandling(
          () => enhanceSearchQuery(input.query),
          {
            enhanced_query: input.query,
            categories: [],
            brands: [],
            attributes: {},
            related_searches: [],
          }
        )
      )

      // Log search for analytics
      if (ctx.session?.user) {
        await ctx.prisma.searchLog.create({
          data: {
            userId: ctx.session.user.id,
            query: input.query,
            searchMethod: 'ai_enhanced',
          },
        })
      }

      // Cache for 1 hour
      await redis.setex(
        cacheKey,
        CACHE_TTL.SEARCH,
        JSON.stringify(enhancement)
      )

      return enhancement
    }),

  // =============================================
  // PRODUCT DESCRIPTION ENHANCEMENT
  // =============================================
  
  enhanceProductDescription: publicProcedure
    .input(z.object({
      productId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const cacheKey = `enhanced_desc:${input.productId}`
      
      // Check cache
      const cached = await redis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached as string)
      }

      // Get product details
      const product = await ctx.prisma.product.findUnique({
        where: { id: input.productId },
        include: {
          brand: true,
          category: true,
        },
      })

      if (!product) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found',
        })
      }

      // If already has AI description, return it
      if (product.aiDescription) {
        return {
          description: product.aiDescription,
          isEnhanced: true,
        }
      }

      // Enhance with AI
      const enhancement = await openAIRateLimiter.add(() =>
        withOpenAIErrorHandling(
          () => enhanceProductDescription({
            productName: product.name,
            basicDescription: product.description || '',
            category: product.category.name,
            brand: product.brand?.name || 'Luxury Brand',
            materials: (product.materials as any)?.list || [],
            features: product.styleTags,
          }),
          null
        )
      )

      if (!enhancement) {
        return {
          description: product.description,
          isEnhanced: false,
        }
      }

      // Save enhanced description
      await ctx.prisma.product.update({
        where: { id: input.productId },
        data: {
          aiDescription: enhancement.description,
        },
      })

      const result = {
        ...enhancement,
        isEnhanced: true,
      }

      // Cache for 7 days
      await redis.setex(
        cacheKey,
        CACHE_TTL.PRODUCT_DESCRIPTION,
        JSON.stringify(result)
      )

      return result
    }),

  // =============================================
  // SIMILAR PRODUCTS
  // =============================================
  
  getSimilarProducts: publicProcedure
    .input(z.object({
      productId: z.string(),
      limit: z.number().min(1).max(20).default(8),
    }))
    .query(async ({ ctx, input }) => {
      const cacheKey = `similar:${input.productId}:${input.limit}`
      
      // Check cache
      const cached = await redis.get(cacheKey)
      if (cached) {
        return JSON.parse(cached as string)
      }

      // Get the base product
      const baseProduct = await ctx.prisma.product.findUnique({
        where: { id: input.productId },
        include: {
          category: true,
          brand: true,
        },
      })

      if (!baseProduct) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found',
        })
      }

      let similarProducts = []

      // If product has embedding, use vector similarity
      if (baseProduct.productEmbedding) {
        const allProducts = await ctx.prisma.product.findMany({
          where: {
            status: ProductStatus.ACTIVE,
            id: { not: input.productId },
            productEmbedding: { not: null },
            category: {
              // Same parent category
              parentId: baseProduct.category.parentId,
            },
          },
          include: {
            media: {
              where: { isPrimary: true },
              take: 1,
            },
            brand: true,
            category: true,
            variants: {
              where: { isAvailable: true },
              take: 1,
            },
          },
        })

        similarProducts = findSimilarItems(
          baseProduct.productEmbedding as any,
          allProducts.filter(p => p.productEmbedding) as any,
          input.limit
        )
      } else {
        // Fallback to attribute-based similarity
        similarProducts = await ctx.prisma.product.findMany({
          where: {
            status: ProductStatus.ACTIVE,
            id: { not: input.productId },
            OR: [
              { categoryId: baseProduct.categoryId },
              { brandId: baseProduct.brandId },
              { styleTags: { hasSome: baseProduct.styleTags } },
            ],
          },
          include: {
            media: {
              where: { isPrimary: true },
              take: 1,
            },
            brand: true,
            category: true,
            variants: {
              where: { isAvailable: true },
              take: 1,
            },
          },
          orderBy: {
            wishlistCount: 'desc',
          },
          take: input.limit,
        })
      }

      const result = {
        baseProduct,
        similarProducts,
      }

      // Cache for 1 hour
      await redis.setex(
        cacheKey,
        CACHE_TTL.RECOMMENDATIONS,
        JSON.stringify(result)
      )

      return result
    }),
})

// Helper function for cosine similarity (imported from openai.ts)
function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have the same length')
  }

  let dotProduct = 0
  let magnitude1 = 0
  let magnitude2 = 0

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i]
    magnitude1 += vec1[i] * vec1[i]
    magnitude2 += vec2[i] * vec2[i]
  }

  magnitude1 = Math.sqrt(magnitude1)
  magnitude2 = Math.sqrt(magnitude2)

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0
  }

  return dotProduct / (magnitude1 * magnitude2)
}
