// src/server/api/routers/product.ts
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { 
  createTRPCRouter, 
  publicProcedure, 
  protectedProcedure, 
  adminProcedure,
  rateLimitedProcedure,
  handleDatabaseError,
  createPaginatedResponse,
} from '@/server/api/trpc'
import { ProductStatus } from '@prisma/client'

// Input validation schemas
const productFiltersSchema = z.object({
  // Pagination
  limit: z.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
  
  // Filtering
  categoryId: z.string().uuid().optional(),
  brandId: z.string().uuid().optional(),
  collectionId: z.string().uuid().optional(),
  
  // Price filtering
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  currency: z.string().length(3).default('USD'),
  
  // Availability
  inStock: z.boolean().optional(),
  status: z.nativeEnum(ProductStatus).optional().default('ACTIVE'),
  
  // Search
  search: z.string().trim().optional(),
  tags: z.array(z.string()).optional(),
  
  // Sorting
  sortBy: z.enum([
    'newest',
    'oldest', 
    'price-asc',
    'price-desc',
    'name-asc',
    'name-desc',
    'popularity',
    'rating',
    'featured',
  ]).default('newest'),
  
  // Advanced filters
  sustainable: z.boolean().optional(),
  materials: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  
  // AI features
  similarTo: z.string().uuid().optional(), // Product ID for similarity search
  styleMatch: z.boolean().optional(), // Use user's style profile
})

const productCreateSchema = z.object({
  sku: z.string().min(1).max(100),
  slug: z.string().min(1).max(255),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  story: z.string().optional(),
  
  // Categorization
  categoryId: z.string().uuid(),
  brandId: z.string().uuid().optional(),
  
  // Pricing
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  cost: z.number().positive().optional(),
  currency: z.string().length(3).default('USD'),
  
  // Media
  images: z.array(z.string().url()).min(1),
  videos: z.array(z.string().url()).optional(),
  model3D: z.string().url().optional(),
  
  // Status
  status: z.nativeEnum(ProductStatus).default('DRAFT'),
  
  // SEO
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(500).optional(),
  
  // Sustainability
  materials: z.array(z.object({
    name: z.string(),
    percentage: z.number().min(0).max(100),
  })).optional(),
  carbonFootprint: z.number().positive().optional(),
  recyclable: z.boolean().default(false),
  
  // Variants
  variants: z.array(z.object({
    sku: z.string().min(1),
    size: z.string().optional(),
    color: z.string().optional(),
    material: z.string().optional(),
    price: z.number().positive().optional(),
    inventoryQuantity: z.number().int().min(0).default(0),
    weight: z.object({
      value: z.number().positive(),
      unit: z.enum(['kg', 'lb', 'g', 'oz']).default('kg'),
    }).optional(),
    dimensions: z.object({
      length: z.number().positive(),
      width: z.number().positive(),
      height: z.number().positive(),
      unit: z.enum(['cm', 'in', 'mm']).default('cm'),
    }).optional(),
  })).min(1),
  
  // Collections
  collectionIds: z.array(z.string().uuid()).optional(),
})

export const productRouter = createTRPCRouter({
  /**
   * Get all products with advanced filtering and pagination
   */
  getAll: publicProcedure
    .input(productFiltersSchema)
    .query(async ({ ctx, input }) => {
      try {
        const {
          limit,
          cursor,
          categoryId,
          brandId,
          collectionId,
          minPrice,
          maxPrice,
          currency,
          inStock,
          status,
          search,
          tags,
          sortBy,
          sustainable,
          materials,
          colors,
          sizes,
          similarTo,
          styleMatch,
        } = input

        // Build where clause
        const where: any = {
          status,
          deletedAt: null,
        }

        // Category filtering
        if (categoryId) {
          where.categoryId = categoryId
        }

        // Brand filtering
        if (brandId) {
          where.brandId = brandId
        }

        // Collection filtering
        if (collectionId) {
          where.collections = {
            some: {
              collectionId,
            },
          }
        }

        // Price filtering
        if (minPrice !== undefined || maxPrice !== undefined) {
          where.price = {}
          if (minPrice !== undefined) where.price.gte = minPrice
          if (maxPrice !== undefined) where.price.lte = maxPrice
        }

        // Search functionality
        if (search) {
          where.OR = [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              styleTags: {
                hasSome: search.split(' '),
              },
            },
          ]
        }

        // Tag filtering
        if (tags && tags.length > 0) {
          where.styleTags = {
            hassome: tags,
          }
        }

        // Stock filtering
        if (inStock) {
          where.variants = {
            some: {
              inventoryQuantity: {
                gt: 0,
              },
              isAvailable: true,
            },
          }
        }

        // Sustainability filtering
        if (sustainable) {
          where.recyclable = true
        }

        // Material filtering
        if (materials && materials.length > 0) {
          where.materials = {
            some: {
              path: ['name'],
              in: materials,
            },
          }
        }

        // Color filtering (requires variants)
        if (colors && colors.length > 0) {
          where.variants = {
            some: {
              color: {
                in: colors,
              },
            },
          }
        }

        // Size filtering (requires variants)
        if (sizes && sizes.length > 0) {
          where.variants = {
            some: {
              size: {
                in: sizes,
              },
            },
          }
        }

        // Build orderBy clause
        let orderBy: any = {}
        switch (sortBy) {
          case 'newest':
            orderBy = { createdAt: 'desc' }
            break
          case 'oldest':
            orderBy = { createdAt: 'asc' }
            break
          case 'price-asc':
            orderBy = { price: 'asc' }
            break
          case 'price-desc':
            orderBy = { price: 'desc' }
            break
          case 'name-asc':
            orderBy = { name: 'asc' }
            break
          case 'name-desc':
            orderBy = { name: 'desc' }
            break
          case 'popularity':
            orderBy = { viewCount: 'desc' }
            break
          case 'featured':
            orderBy = { featuredAt: 'desc' }
            break
          default:
            orderBy = { createdAt: 'desc' }
        }

        // Execute query with pagination
        const products = await ctx.prisma.product.findMany({
          where,
          orderBy,
          take: limit + 1, // Take one extra to determine if there are more
          cursor: cursor ? { id: cursor } : undefined,
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            brand: {
              select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true,
                isVerified: true,
              },
            },
            variants: {
              where: {
                isAvailable: true,
              },
              orderBy: {
                price: 'asc',
              },
              take: 5, // Limit variants for performance
              select: {
                id: true,
                sku: true,
                size: true,
                color: true,
                price: true,
                inventoryQuantity: true,
              },
            },
            media: {
              where: {
                mediaType: 'image',
              },
              orderBy: {
                displayOrder: 'asc',
              },
              take: 3, // Limit images for performance
              select: {
                id: true,
                url: true,
                thumbnailUrl: true,
                altText: true,
                isPrimary: true,
              },
            },
            _count: {
              select: {
                reviews: true,
                productViews: true,
              },
            },
          },
        })

        // Determine if there are more results
        let hasMore = false
        let nextCursor: string | undefined = undefined

        if (products.length > limit) {
          hasMore = true
          const nextItem = products.pop()
          nextCursor = nextItem!.id
        }

        // Calculate average rating for each product
        const productsWithRating = await Promise.all(
          products.map(async (product) => {
            const avgRating = await ctx.prisma.review.aggregate({
              where: {
                productId: product.id,
                status: 'APPROVED',
              },
              _avg: {
                rating: true,
              },
            })

            return {
              ...product,
              averageRating: avgRating._avg.rating || 0,
              reviewCount: product._count.reviews,
              viewCount: product._count.productViews,
            }
          })
        )

        return createPaginatedResponse(productsWithRating, nextCursor, hasMore)
      } catch (error) {
        console.error('Error fetching products:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch products',
        })
      }
    }),

  /**
   * Get single product by slug with full details
   */
  getBySlug: publicProcedure
    .input(z.object({ 
      slug: z.string(),
      trackView: z.boolean().default(true),
    }))
    .query(async ({ ctx, input }) => {
      try {
        const { slug, trackView } = input

        const product = await ctx.prisma.product.findUnique({
          where: { 
            slug,
            deletedAt: null,
          },
          include: {
            category: {
              include: {
                parent: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
            brand: {
              select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true,
                description: true,
                story: true,
                isVerified: true,
                sustainabilityScore: true,
                certifications: true,
                websiteUrl: true,
                instagramHandle: true,
              },
            },
            variants: {
              where: {
                isAvailable: true,
              },
              orderBy: [
                { price: 'asc' },
                { size: 'asc' },
              ],
              include: {
                media: {
                  orderBy: {
                    displayOrder: 'asc',
                  },
                },
              },
            },
            media: {
              orderBy: {
                displayOrder: 'asc',
              },
            },
            collections: {
              include: {
                collection: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    description: true,
                    heroImageUrl: true,
                  },
                },
              },
            },
            reviews: {
              where: {
                status: 'APPROVED',
              },
              orderBy: {
                createdAt: 'desc',
              },
              take: 10,
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
                  },
                },
              },
            },
            _count: {
              select: {
                reviews: {
                  where: {
                    status: 'APPROVED',
                  },
                },
                productViews: true,
              },
            },
          },
        })

        if (!product || product.status !== 'ACTIVE') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Product not found',
          })
        }

        // Track product view if requested and user is present
        if (trackView) {
          // Don't await this - fire and forget
          ctx.prisma.productView.create({
            data: {
              userId: ctx.session?.user?.id,
              sessionId: ctx.session ? undefined : 'anonymous', // Handle anonymous users
              source: 'product_page',
              createdAt: new Date(),
            },
          }).catch(console.error)

          // Increment view count
          ctx.prisma.product.update({
            where: { id: product.id },
            data: {
              viewCount: {
                increment: 1,
              },
            },
          }).catch(console.error)
        }

        // Calculate average rating
        const avgRating = await ctx.prisma.review.aggregate({
          where: {
            productId: product.id,
            status: 'APPROVED',
          },
          _avg: {
            rating: true,
          },
        })

        // Get related products (same category)
        const relatedProducts = await ctx.prisma.product.findMany({
          where: {
            categoryId: product.categoryId,
            id: {
              not: product.id,
            },
            status: 'ACTIVE',
            deletedAt: null,
          },
          take: 6,
          orderBy: {
            viewCount: 'desc',
          },
          include: {
            brand: {
              select: {
                name: true,
                logoUrl: true,
              },
            },
            media: {
              where: {
                isPrimary: true,
                mediaType: 'image',
              },
              take: 1,
            },
            variants: {
              orderBy: {
                price: 'asc',
              },
              take: 1,
            },
          },
        })

        return {
          ...product,
          averageRating: avgRating._avg.rating || 0,
          reviewCount: product._count.reviews,
          totalViews: product._count.productViews,
          relatedProducts,
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        
        console.error('Error fetching product:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch product',
        })
      }
    }),

  /**
   * Get featured products for homepage
   */
  getFeatured: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(20).default(8),
      categoryId: z.string().uuid().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { limit, categoryId } = input

      const where: any = {
        status: 'ACTIVE',
        deletedAt: null,
        featuredAt: {
          not: null,
        },
      }

      if (categoryId) {
        where.categoryId = categoryId
      }

      const products = await ctx.prisma.product.findMany({
        where,
        orderBy: {
          featuredAt: 'desc',
        },
        take: limit,
        include: {
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
          brand: {
            select: {
              name: true,
              logoUrl: true,
              isVerified: true,
            },
          },
          media: {
            where: {
              isPrimary: true,
              mediaType: 'image',
            },
            take: 1,
          },
          variants: {
            orderBy: {
              price: 'asc',
            },
            take: 1,
          },
        },
      })

      return products
    }),

  /**
   * Get trending products based on recent views and purchases
   */
  getTrending: rateLimitedProcedure
    .input(z.object({
      limit: z.number().min(1).max(20).default(8),
      timeframe: z.enum(['24h', '7d', '30d']).default('7d'),
    }))
    .query(async ({ ctx, input }) => {
      const { limit, timeframe } = input

      // Calculate date threshold based on timeframe
      const now = new Date()
      let dateThreshold: Date

      switch (timeframe) {
        case '24h':
          dateThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000)
          break
        case '7d':
          dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case '30d':
          dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
      }

      // Get products with most views/purchases in timeframe
      const trendingProducts = await ctx.prisma.product.findMany({
        where: {
          status: 'ACTIVE',
          deletedAt: null,
          productViews: {
            some: {
              createdAt: {
                gte: dateThreshold,
              },
            },
          },
        },
        include: {
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
          brand: {
            select: {
              name: true,
              logoUrl: true,
              isVerified: true,
            },
          },
          media: {
            where: {
              isPrimary: true,
              mediaType: 'image',
            },
            take: 1,
          },
          variants: {
            orderBy: {
              price: 'asc',
            },
            take: 1,
          },
          _count: {
            select: {
              productViews: {
                where: {
                  createdAt: {
                    gte: dateThreshold,
                  },
                },
              },
            },
          },
        },
        orderBy: {
          viewCount: 'desc',
        },
        take: limit,
      })

      return trendingProducts
    }),

  /**
   * Create a new product (admin only)
   */
  create: adminProcedure
    .input(productCreateSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.prisma.$transaction(async (tx) => {
          // Create the product
          const product = await tx.product.create({
            data: {
              sku: input.sku,
              slug: input.slug,
              name: input.name,
              description: input.description,
              story: input.story,
              categoryId: input.categoryId,
              brandId: input.brandId,
              price: input.price,
              compareAtPrice: input.compareAtPrice,
              cost: input.cost,
              currency: input.currency,
              status: input.status,
              metaTitle: input.metaTitle,
              metaDescription: input.metaDescription,
              materials: input.materials || [],
              carbonFootprint: input.carbonFootprint,
              recyclable: input.recyclable,
            },
          })

          // Create product media
          if (input.images.length > 0) {
            const mediaData = input.images.map((url, index) => ({
              productId: product.id,
              mediaType: 'image' as const,
              url,
              displayOrder: index,
              isPrimary: index === 0,
            }))

            await tx.productMedia.createMany({
              data: mediaData,
            })
          }

          // Create product variants
          const variantData = input.variants.map((variant) => ({
            productId: product.id,
            sku: variant.sku,
            size: variant.size,
            color: variant.color,
            material: variant.material,
            price: variant.price,
            inventoryQuantity: variant.inventoryQuantity,
            weightValue: variant.weight?.value,
            weightUnit: variant.weight?.unit,
            dimensions: variant.dimensions,
          }))

          await tx.productVariant.createMany({
            data: variantData,
          })

          // Add to collections if specified
          if (input.collectionIds && input.collectionIds.length > 0) {
            const collectionData = input.collectionIds.map((collectionId) => ({
              productId: product.id,
              collectionId,
            }))

            await tx.collectionProduct.createMany({
              data: collectionData,
            })
          }

          // Create audit log
          await tx.auditLog.create({
            data: {
              userId: ctx.session.user.id,
              action: 'PRODUCT_CREATED',
              entityType: 'PRODUCT',
              entityId: product.id,
              newValues: {
                name: product.name,
                sku: product.sku,
                price: product.price,
              },
            },
          })

          return product
        })

        return result
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  /**
   * Update product (admin only)
   */
  update: adminProcedure
    .input(z.object({
      id: z.string().uuid(),
      data: productCreateSchema.partial(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, data } = input

        const product = await ctx.prisma.product.update({
          where: { id },
          data: {
            ...data,
            updatedAt: new Date(),
          },
        })

        // Create audit log
        await ctx.prisma.auditLog.create({
          data: {
            userId: ctx.session.user.id,
            action: 'PRODUCT_UPDATED',
            entityType: 'PRODUCT',
            entityId: product.id,
            newValues: data,
          },
        })

        return product
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  /**
   * Delete product (admin only)
   */
  delete: adminProcedure
    .input(z.object({
      id: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Soft delete
        const product = await ctx.prisma.product.update({
          where: { id: input.id },
          data: {
            deletedAt: new Date(),
            status: 'ARCHIVED',
          },
        })

        // Create audit log
        await ctx.prisma.auditLog.create({
          data: {
            userId: ctx.session.user.id,
            action: 'PRODUCT_DELETED',
            entityType: 'PRODUCT',
            entityId: product.id,
          },
        })

        return { success: true }
      } catch (error) {
        handleDatabaseError(error)
      }
    }),
})
