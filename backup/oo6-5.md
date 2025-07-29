# 🤖 LuxeVerse Quantum - Phase 6: AI & Advanced Features

## Phase 6: Complete Implementation Files

### 🧠 6.1 `/src/lib/openai.ts`
**Purpose**: OpenAI configuration with advanced utilities for all AI features

```typescript
import OpenAI from 'openai'
import { encoding_for_model } from 'tiktoken'

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 3,
  timeout: 30 * 1000, // 30 seconds
})

// Token counting utility
const encoder = encoding_for_model('gpt-4')

export function countTokens(text: string): number {
  return encoder.encode(text).length
}

// =============================================
// EMBEDDING FUNCTIONS
// =============================================

/**
 * Generate embeddings for text using OpenAI's embedding model
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: text.slice(0, 8000), // Limit input length
      dimensions: 1536,
    })
    
    return response.data[0]?.embedding || []
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw new Error('Failed to generate embedding')
  }
}

/**
 * Generate embeddings for multiple texts in batch
 */
export async function generateBatchEmbeddings(
  texts: string[]
): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-large',
      input: texts.map(text => text.slice(0, 8000)),
      dimensions: 1536,
    })
    
    return response.data.map(item => item.embedding)
  } catch (error) {
    console.error('Error generating batch embeddings:', error)
    throw new Error('Failed to generate batch embeddings')
  }
}

// =============================================
// RECOMMENDATION FUNCTIONS
// =============================================

/**
 * Generate personalized product recommendations based on user preferences
 */
export async function generateProductRecommendations(params: {
  userPreferences: string
  purchaseHistory: string[]
  currentTrends?: string[]
  excludeProducts?: string[]
  count?: number
}) {
  const { 
    userPreferences, 
    purchaseHistory, 
    currentTrends = [], 
    excludeProducts = [],
    count = 6 
  } = params

  try {
    const systemPrompt = `You are a luxury fashion AI assistant with deep knowledge of high-end brands, current trends, and personal styling. Your task is to recommend products that perfectly match the user's style and preferences.

Key considerations:
1. Focus on luxury and premium quality items
2. Consider the user's past purchases and style evolution
3. Balance between safe choices and exciting discoveries
4. Include both timeless pieces and trendy items
5. Ensure recommendations are cohesive and can work together`

    const userPrompt = `Based on the following information, recommend ${count} luxury products:

User Preferences:
${userPreferences}

Purchase History:
${purchaseHistory.slice(0, 10).join('\n')}

Current Trends to Consider:
${currentTrends.join(', ')}

Products to Exclude:
${excludeProducts.join(', ')}

Return a JSON object with the following structure:
{
  "recommendations": [
    {
      "category": "string",
      "style": "string",
      "priceRange": "string",
      "brand_suggestions": ["brand1", "brand2"],
      "colors": ["color1", "color2"],
      "occasion": "string",
      "reasoning": "string",
      "match_score": number (0-1)
    }
  ],
  "style_insights": "string",
  "trend_alignment": "string"
}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('No response from AI')

    return JSON.parse(content)
  } catch (error) {
    console.error('Error generating recommendations:', error)
    throw new Error('Failed to generate recommendations')
  }
}

// =============================================
// STYLE ANALYSIS FUNCTIONS
// =============================================

/**
 * Analyze user's style based on their interactions and preferences
 */
export async function analyzeUserStyle(params: {
  favoriteProducts: string[]
  styleQuizAnswers?: Record<string, any>
  demographics?: Record<string, any>
}) {
  const { favoriteProducts, styleQuizAnswers = {}, demographics = {} } = params

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a professional fashion stylist and trend analyst. Analyze the user\'s style preferences and create a comprehensive style profile.'
        },
        {
          role: 'user',
          content: `Analyze this user's style based on:

Favorite Products:
${favoriteProducts.join('\n')}

Style Quiz Answers:
${JSON.stringify(styleQuizAnswers, null, 2)}

Demographics:
${JSON.stringify(demographics, null, 2)}

Provide a JSON response with:
{
  "style_personas": ["persona1", "persona2", "persona3"],
  "color_palette": {
    "primary": ["color1", "color2"],
    "accent": ["color3", "color4"],
    "neutral": ["color5", "color6"]
  },
  "style_attributes": {
    "formality": "casual/smart-casual/formal",
    "aesthetic": "minimalist/maximalist/eclectic",
    "trend_adoption": "early/mainstream/classic"
  },
  "brand_affinity": ["brand1", "brand2", "brand3"],
  "style_description": "detailed paragraph",
  "style_advice": "personalized styling tips"
}`
        }
      ],
      temperature: 0.6,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('No response from AI')

    return JSON.parse(content)
  } catch (error) {
    console.error('Error analyzing style:', error)
    throw new Error('Failed to analyze user style')
  }
}

// =============================================
// PRODUCT DESCRIPTION ENHANCEMENT
// =============================================

/**
 * Enhance product descriptions with AI-generated luxury copy
 */
export async function enhanceProductDescription(params: {
  productName: string
  basicDescription: string
  category: string
  brand: string
  materials?: string[]
  features?: string[]
  targetAudience?: string
}) {
  const { 
    productName, 
    basicDescription, 
    category, 
    brand,
    materials = [],
    features = [],
    targetAudience = 'luxury consumers'
  } = params

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a luxury copywriter for high-end fashion and lifestyle brands. Create compelling, sophisticated product descriptions that evoke desire and emphasize quality, craftsmanship, and exclusivity. Use sensory language and storytelling.`
        },
        {
          role: 'user',
          content: `Enhance this product description:

Product: ${productName}
Brand: ${brand}
Category: ${category}
Basic Description: ${basicDescription}
Materials: ${materials.join(', ')}
Features: ${features.join(', ')}
Target Audience: ${targetAudience}

Create a JSON response with:
{
  "headline": "compelling product headline",
  "description": "2-3 paragraph luxury description",
  "key_features": ["feature1", "feature2", "feature3"],
  "style_notes": "how to style this product",
  "care_instructions": "care and maintenance tips",
  "brand_story": "brief brand heritage connection"
}`
        }
      ],
      temperature: 0.8,
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('No response from AI')

    return JSON.parse(content)
  } catch (error) {
    console.error('Error enhancing description:', error)
    throw new Error('Failed to enhance product description')
  }
}

// =============================================
// VISUAL SEARCH FUNCTIONS
// =============================================

/**
 * Analyze image and extract fashion attributes
 */
export async function analyzeProductImage(imageUrl: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a fashion expert who analyzes product images to extract detailed attributes for visual search and recommendations.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this fashion product image and extract:
1. Product category and subcategory
2. Colors (primary and secondary)
3. Style attributes
4. Materials/textures visible
5. Design details
6. Occasion/use case
7. Similar product keywords

Return a JSON object with all attributes.`
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
                detail: 'high'
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.3,
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('No response from AI')

    return JSON.parse(content)
  } catch (error) {
    console.error('Error analyzing image:', error)
    throw new Error('Failed to analyze product image')
  }
}

// =============================================
// OUTFIT GENERATION FUNCTIONS
// =============================================

/**
 * Generate complete outfit suggestions based on a base product
 */
export async function generateOutfitSuggestions(params: {
  baseProduct: {
    name: string
    category: string
    color: string
    style: string
  }
  occasion?: string
  season?: string
  budget?: { min: number; max: number }
  userStyle?: string
}) {
  const { baseProduct, occasion = 'versatile', season = 'all-season', budget, userStyle } = params

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a professional stylist creating complete outfit suggestions. Focus on creating cohesive, stylish looks that work well together.'
        },
        {
          role: 'user',
          content: `Create outfit suggestions for:

Base Product: ${baseProduct.name}
Category: ${baseProduct.category}
Color: ${baseProduct.color}
Style: ${baseProduct.style}
Occasion: ${occasion}
Season: ${season}
${budget ? `Budget Range: $${budget.min} - $${budget.max}` : ''}
${userStyle ? `User Style: ${userStyle}` : ''}

Suggest 3 complete outfits with:
{
  "outfits": [
    {
      "name": "outfit name",
      "description": "outfit description",
      "occasion": "specific occasion",
      "items": [
        {
          "category": "item category",
          "description": "item description",
          "color_suggestion": "color",
          "style_notes": "styling tips",
          "price_range": "price category"
        }
      ],
      "styling_tips": "how to wear this outfit",
      "alternative_options": "variations or substitutions"
    }
  ]
}`
        }
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('No response from AI')

    return JSON.parse(content)
  } catch (error) {
    console.error('Error generating outfits:', error)
    throw new Error('Failed to generate outfit suggestions')
  }
}

// =============================================
// CHAT & CONVERSATIONAL AI
// =============================================

/**
 * Handle conversational AI for style advice and product questions
 */
export async function chatWithStyleAssistant(params: {
  message: string
  context?: {
    userStyle?: string
    recentProducts?: string[]
    currentPage?: string
  }
  conversationHistory?: Array<{ role: string; content: string }>
}) {
  const { message, context = {}, conversationHistory = [] } = params

  try {
    const systemPrompt = `You are LuxeVerse's AI Style Assistant - a knowledgeable, friendly, and sophisticated fashion advisor. 

Your personality:
- Expert in luxury fashion and styling
- Warm and approachable, but professional
- Knowledgeable about trends, brands, and styling techniques
- Focused on helping users find perfect pieces for their style

Guidelines:
- Keep responses concise but helpful (2-3 paragraphs max)
- Always maintain a luxury brand voice
- Suggest specific actions when relevant
- Reference the user's style preferences when known
- Be encouraging and positive about their choices`

    const contextInfo = `
Current context:
- User style: ${context.userStyle || 'Not specified'}
- Recent interests: ${context.recentProducts?.join(', ') || 'None'}
- Current page: ${context.currentPage || 'Unknown'}`

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'assistant' as const, content: contextInfo },
      ...conversationHistory.slice(-5), // Keep last 5 messages for context
      { role: 'user' as const, content: message }
    ]

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    })

    return response.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response. Please try again.'
  } catch (error) {
    console.error('Error in chat:', error)
    throw new Error('Failed to process chat message')
  }
}

// =============================================
// SIZE RECOMMENDATION
// =============================================

/**
 * Generate size recommendations based on user measurements and brand sizing
 */
export async function generateSizeRecommendation(params: {
  userMeasurements?: Record<string, number>
  productCategory: string
  brandName: string
  brandSizeChart?: Record<string, any>
  previousPurchases?: Array<{
    brand: string
    size: string
    fit: 'too small' | 'perfect' | 'too large'
  }>
}) {
  const { 
    userMeasurements = {}, 
    productCategory, 
    brandName, 
    brandSizeChart = {},
    previousPurchases = []
  } = params

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a fit specialist who helps customers find the perfect size. Consider body measurements, brand-specific sizing, and fit preferences.'
        },
        {
          role: 'user',
          content: `Recommend the best size for:

Product Category: ${productCategory}
Brand: ${brandName}
User Measurements: ${JSON.stringify(userMeasurements)}
Brand Size Chart: ${JSON.stringify(brandSizeChart)}
Previous Purchases: ${JSON.stringify(previousPurchases)}

Return JSON with:
{
  "recommended_size": "size",
  "confidence_level": "high/medium/low",
  "fit_notes": "how it will fit",
  "size_comparison": "compared to other brands",
  "alternative_sizes": ["size1", "size2"],
  "measurement_tips": "advice for best fit"
}`
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('No response from AI')

    return JSON.parse(content)
  } catch (error) {
    console.error('Error generating size recommendation:', error)
    throw new Error('Failed to generate size recommendation')
  }
}

// =============================================
// TREND ANALYSIS
// =============================================

/**
 * Analyze current fashion trends and provide insights
 */
export async function analyzeFashionTrends(params: {
  userInterests: string[]
  currentSeason: string
  priceRange?: { min: number; max: number }
}) {
  const { userInterests, currentSeason, priceRange } = params

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a fashion trend analyst providing insights on current and upcoming trends in luxury fashion.'
        },
        {
          role: 'user',
          content: `Analyze trends for:

User Interests: ${userInterests.join(', ')}
Season: ${currentSeason}
${priceRange ? `Budget: $${priceRange.min} - $${priceRange.max}` : ''}

Provide trend analysis with:
{
  "trending_now": [
    {
      "trend": "trend name",
      "description": "trend description",
      "key_pieces": ["item1", "item2"],
      "brands_leading": ["brand1", "brand2"],
      "longevity": "short-term/long-term"
    }
  ],
  "emerging_trends": ["trend1", "trend2"],
  "timeless_pieces": ["classic1", "classic2"],
  "personalized_recommendations": "based on user interests",
  "investment_pieces": ["worth investing in"]
}`
        }
      ],
      temperature: 0.6,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('No response from AI')

    return JSON.parse(content)
  } catch (error) {
    console.error('Error analyzing trends:', error)
    throw new Error('Failed to analyze fashion trends')
  }
}

// =============================================
// SEARCH QUERY ENHANCEMENT
// =============================================

/**
 * Enhance search queries with AI to improve results
 */
export async function enhanceSearchQuery(query: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a search query optimizer for a luxury fashion e-commerce site. Expand and improve search queries to help users find what they\'re looking for.'
        },
        {
          role: 'user',
          content: `Enhance this search query: "${query}"

Return JSON with:
{
  "enhanced_query": "improved search terms",
  "categories": ["relevant categories"],
  "brands": ["relevant brands"],
  "attributes": {
    "colors": ["colors"],
    "materials": ["materials"],
    "styles": ["styles"],
    "occasions": ["occasions"]
  },
  "price_indicator": "budget/mid-range/luxury/ultra-luxury",
  "related_searches": ["suggestion1", "suggestion2"]
}`
        }
      ],
      temperature: 0.3,
      max_tokens: 300,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error('No response from AI')

    return JSON.parse(content)
  } catch (error) {
    console.error('Error enhancing search query:', error)
    // Return basic enhancement if AI fails
    return {
      enhanced_query: query,
      categories: [],
      brands: [],
      attributes: {},
      related_searches: []
    }
  }
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(vec1: number[], vec2: number[]): number {
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

/**
 * Find most similar items based on embeddings
 */
export function findSimilarItems<T extends { embedding: number[] }>(
  targetEmbedding: number[],
  items: T[],
  topK: number = 10
): Array<T & { similarity: number }> {
  const similarities = items.map(item => ({
    ...item,
    similarity: cosineSimilarity(targetEmbedding, item.embedding)
  }))

  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK)
}

/**
 * Rate limit helper for AI API calls
 */
export class RateLimiter {
  private queue: Array<() => Promise<any>> = []
  private processing = false
  private lastCall = 0
  private minInterval: number

  constructor(callsPerMinute: number = 60) {
    this.minInterval = 60000 / callsPerMinute
  }

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
      
      if (!this.processing) {
        this.process()
      }
    })
  }

  private async process() {
    this.processing = true
    
    while (this.queue.length > 0) {
      const now = Date.now()
      const timeSinceLastCall = now - this.lastCall
      
      if (timeSinceLastCall < this.minInterval) {
        await new Promise(resolve => 
          setTimeout(resolve, this.minInterval - timeSinceLastCall)
        )
      }
      
      const fn = this.queue.shift()
      if (fn) {
        this.lastCall = Date.now()
        await fn()
      }
    }
    
    this.processing = false
  }
}

// Create a rate limiter instance for OpenAI calls
export const openAIRateLimiter = new RateLimiter(60) // 60 calls per minute

// =============================================
// ERROR HANDLING
// =============================================

export class OpenAIError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'OpenAIError'
  }
}

/**
 * Wrap OpenAI calls with proper error handling
 */
export async function withOpenAIErrorHandling<T>(
  fn: () => Promise<T>,
  fallback?: T
): Promise<T> {
  try {
    return await fn()
  } catch (error: any) {
    console.error('OpenAI API Error:', error)
    
    if (error.response?.status === 429) {
      throw new OpenAIError('Rate limit exceeded', 'RATE_LIMIT', 429)
    }
    
    if (error.response?.status === 401) {
      throw new OpenAIError('Invalid API key', 'UNAUTHORIZED', 401)
    }
    
    if (error.response?.status === 503) {
      throw new OpenAIError('Service unavailable', 'SERVICE_UNAVAILABLE', 503)
    }
    
    if (fallback !== undefined) {
      return fallback
    }
    
    throw new OpenAIError(
      error.message || 'Unknown error occurred',
      'UNKNOWN',
      error.response?.status
    )
  }
}
```

---

### 🤖 6.2 `/src/server/api/routers/ai.ts`
**Purpose**: Comprehensive AI-powered API endpoints

```typescript
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
```

---

### 🎯 6.3 `/src/components/features/ai-recommendations.tsx`
**Purpose**: Dynamic AI recommendation display component

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Icons } from '@/components/ui/icons'
import { ProductCard } from '@/components/features/product-card'
import { cn } from '@/lib/utils'

interface AIRecommendationsProps {
  category?: string
  className?: string
  showPersonalizationScore?: boolean
}

export function AIRecommendations({ 
  category, 
  className,
  showPersonalizationScore = true,
}: AIRecommendationsProps) {
  const [selectedCategory, setSelectedCategory] = useState(category)
  
  const { data, isLoading, refetch } = api.ai.getPersonalizedRecommendations.useQuery({
    limit: 12,
    category: selectedCategory,
  })

  const categories = [
    { value: undefined, label: 'All Categories' },
    { value: 'bags', label: 'Bags' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'jewelry', label: 'Jewelry' },
    { value: 'watches', label: 'Watches' },
  ]

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.recommendations.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Icons.sparkles className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No recommendations yet</h3>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Complete your style profile to get personalized recommendations
          </p>
          <Button className="mt-6" asChild>
            <Link href="/account/style-profile">
              Create Style Profile
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Icons.sparkles className="h-5 w-5 text-primary" />
              AI Recommendations for You
            </CardTitle>
            <CardDescription>
              {data.basedOn === 'ai_personalization' 
                ? 'Personalized based on your unique style'
                : 'Trending items you might like'}
            </CardDescription>
          </div>
          {showPersonalizationScore && data.personalizationScore > 0 && (
            <div className="text-right">
              <div className="text-2xl font-bold">
                {Math.round(data.personalizationScore * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">Match Score</p>
            </div>
          )}
        </div>
        
        {/* Category Filter */}
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.value || 'all'}
              variant={selectedCategory === cat.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setSelectedCategory(cat.value)
                refetch()
              }}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        {data.styleInsights && (
          <div className="mb-6 rounded-lg bg-muted p-4">
            <p className="text-sm font-medium mb-1">Your Style Insights</p>
            <p className="text-sm text-muted-foreground">{data.styleInsights}</p>
          </div>
        )}
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.recommendations.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              {product.recommendationReason && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="group relative">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Icons.info className="h-4 w-4" />
                    </div>
                    <div className="absolute right-0 top-10 hidden w-64 rounded-md bg-popover p-3 text-sm shadow-lg group-hover:block">
                      <p className="font-medium mb-1">Why we recommend this</p>
                      <p className="text-muted-foreground">
                        {product.recommendationReason}
                      </p>
                      {product.matchScore && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-2 flex-1 rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${product.matchScore * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">
                            {Math.round(product.matchScore * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {product.isExclusive && (
                <Badge className="absolute top-2 left-2" variant="secondary">
                  Exclusive
                </Badge>
              )}
            </div>
          ))}
        </div>
        
        {data.trendAlignment && (
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Icons.trendingUp className="h-4 w-4" />
            <span>{data.trendAlignment}</span>
          </div>
        )}
        
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="gap-2"
          >
            <Icons.refresh className="h-4 w-4" />
            Refresh Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

---

### 🔍 6.4 `/src/components/features/visual-search.tsx`
**Purpose**: Visual search component with image upload

```tsx
'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface VisualSearchProps {
  children?: React.ReactNode
  className?: string
}

export function VisualSearch({ children, className }: VisualSearchProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  
  const visualSearchMutation = api.ai.visualSearch.useMutation({
    onSuccess: (data) => {
      // Store results in session storage
      sessionStorage.setItem('visualSearchResults', JSON.stringify(data))
      // Navigate to search results page
      router.push('/search?mode=visual')
      setOpen(false)
    },
    onError: (error) => {
      toast({
        title: 'Search failed',
        description: error.message || 'Failed to search for similar products',
        variant: 'destructive',
      })
    },
  })

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please upload an image file',
        variant: 'destructive',
      })
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    // In a real app, upload to cloud storage first
    // For demo, we'll use a data URL
    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })

    setImageUrl(dataUrl)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleSearch = () => {
    if (!imageUrl) {
      toast({
        title: 'No image',
        description: 'Please upload or provide an image URL',
        variant: 'destructive',
      })
      return
    }

    visualSearchMutation.mutate({ imageUrl })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className={className}>
            <Icons.camera className="mr-2 h-4 w-4" />
            Visual Search
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Visual Search</DialogTitle>
          <DialogDescription>
            Upload an image or provide a URL to find similar products
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Upload Area */}
          <Card
            className={cn(
              'border-2 border-dashed transition-colors',
              isDragging && 'border-primary bg-primary/5'
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <CardContent className="flex flex-col items-center justify-center p-12">
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-64 rounded-lg object-contain"
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -right-2 -top-2"
                    onClick={() => {
                      setPreviewUrl('')
                      setImageUrl('')
                    }}
                  >
                    <Icons.x className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Icons.upload className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-center text-sm text-muted-foreground">
                    Drag and drop an image here, or click to browse
                  </p>
                  <Button
                    variant="secondary"
                    className="mt-4"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose File
                  </Button>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleFileUpload(file)
                      }
                    }}
                  />
                </>
              )}
            </CardContent>
          </Card>

          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="image-url">Or paste an image URL</Label>
            <div className="flex gap-2">
              <Input
                id="image-url"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value)
                  setPreviewUrl(e.target.value)
                }}
              />
              <Button
                variant="outline"
                onClick={() => {
                  if (imageUrl && imageUrl.startsWith('http')) {
                    setPreviewUrl(imageUrl)
                  }
                }}
              >
                Preview
              </Button>
            </div>
          </div>

          {/* Search Tips */}
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">Tips for best results:</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• Use clear, well-lit images</li>
              <li>• Focus on a single product</li>
              <li>• Avoid busy backgrounds</li>
              <li>• Show the full item when possible</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={visualSearchMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSearch}
              disabled={!imageUrl || visualSearchMutation.isPending}
            >
              {visualSearchMutation.isPending ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Icons.search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

---

### 💬 6.5 `/src/components/features/ai-chat-assistant.tsx`
**Purpose**: AI-powered chat assistant component

```tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { useSession } from '@/hooks/use-session'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIChatAssistantProps {
  className?: string
  context?: {
    currentPage?: string
    productId?: string
  }
}

export function AIChatAssistant({ className, context }: AIChatAssistantProps) {
  const { user } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your personal style assistant. How can I help you find the perfect luxury pieces today?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [conversationId, setConversationId] = useState<string>()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const chatMutation = api.ai.chat.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        },
      ])
      setConversationId(data.conversationId)
    },
  })

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')

    chatMutation.mutate({
      message: userMessage.content,
      conversationId,
      context,
    })
  }

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const suggestedQuestions = [
    'What\'s trending this season?',
    'Help me find a gift',
    'What matches with this?',
    'Show me sustainable options',
  ]

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={cn(
          'fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg',
          isOpen && 'hidden',
          className
        )}
      >
        <Icons.messageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Window */}
      <Card
        className={cn(
          'fixed bottom-6 right-6 w-96 transition-all',
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none',
          className
        )}
        style={{ height: '600px' }}
      >
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle className="flex items-center gap-2">
            <Icons.sparkles className="h-5 w-5 text-primary" />
            AI Style Assistant
          </CardTitle>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsOpen(false)}
          >
            <Icons.x className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex h-full flex-col p-0" style={{ height: 'calc(100% - 73px)' }}>
          {/* Messages */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' && 'justify-end'
                  )}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/ai-assistant-avatar.png" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg px-4 py-2',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="mt-1 text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatarUrl || undefined} />
                      <AvatarFallback>
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {chatMutation.isPending && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg bg-muted px-4 py-2">
                    <Icons.ellipsis className="h-4 w-4 animate-pulse" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="border-t p-4">
              <p className="mb-2 text-xs text-muted-foreground">
                Try asking:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question) => (
                  <Button
                    key={question}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInput(question)
                      handleSend()
                    }}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-2"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about style..."
                disabled={chatMutation.isPending}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || chatMutation.isPending}
              >
                <Icons.send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
```

---

### 👗 6.6 `/src/components/features/outfit-builder.tsx`
**Purpose**: AI-powered outfit suggestion component

```tsx
'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Icons } from '@/components/ui/icons'
import { ProductCard } from '@/components/features/product-card'
import { formatPrice } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface OutfitBuilderProps {
  productId: string
  productName: string
  productImage?: string
}

export function OutfitBuilder({ productId, productName, productImage }: OutfitBuilderProps) {
  const [occasion, setOccasion] = useState<string>()
  const [season, setSeason] = useState<string>()

  const { data, isLoading, refetch } = api.ai.generateOutfits.useQuery({
    productId,
    occasion,
    season,
  })

  const occasions = [
    { value: 'casual', label: 'Casual Day' },
    { value: 'office', label: 'Office' },
    { value: 'evening', label: 'Evening Out' },
    { value: 'formal', label: 'Formal Event' },
    { value: 'weekend', label: 'Weekend' },
  ]

  const seasons = [
    { value: 'spring', label: 'Spring' },
    { value: 'summer', label: 'Summer' },
    { value: 'fall', label: 'Fall' },
    { value: 'winter', label: 'Winter' },
  ]

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icons.sparkles className="h-5 w-5" />
          Complete the Look
        </CardTitle>
        <CardDescription>
          AI-curated outfit suggestions featuring {productName}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Select value={occasion} onValueChange={setOccasion}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select occasion" />
            </SelectTrigger>
            <SelectContent>
              {occasions.map((occ) => (
                <SelectItem key={occ.value} value={occ.value}>
                  {occ.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={season} onValueChange={setSeason}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
          >
            <Icons.refresh className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Outfit Suggestions */}
        {data?.outfits && data.outfits.length > 0 ? (
          <Tabs defaultValue="0" className="w-full">
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${data.outfits.length}, 1fr)` }}>
              {data.outfits.map((_, index) => (
                <TabsTrigger key={index} value={index.toString()}>
                  Look {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {data.outfits.map((outfit, index) => (
              <TabsContent key={index} value={index.toString()} className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold">{outfit.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {outfit.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="secondary">{outfit.occasion}</Badge>
                    {outfit.items.length > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {outfit.items.length + 1} pieces
                      </span>
                    )}
                  </div>
                </div>

                {/* Base Product */}
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium mb-2">Starting with:</p>
                  <div className="flex items-center gap-4">
                    {productImage && (
                      <img
                        src={productImage}
                        alt={productName}
                        className="h-20 w-20 rounded-md object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium">{productName}</p>
                      <p className="text-sm text-muted-foreground">Your selected item</p>
                    </div>
                  </div>
                </div>

                {/* Suggested Items */}
                <div className="space-y-4">
                  {outfit.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.category}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {item.color_suggestion}
                        </Badge>
                      </div>
                      
                      {item.suggestedProducts && item.suggestedProducts.length > 0 && (
                        <div className="grid gap-4 sm:grid-cols-3">
                          {item.suggestedProducts.slice(0, 3).map((product) => (
                            <ProductCard
                              key={product.id}
                              product={product}
                              className="h-full"
                            />
                          ))}
                        </div>
                      )}
                      
                      {item.style_notes && (
                        <p className="text-sm text-muted-foreground italic">
                          💡 {item.style_notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Styling Tips */}
                {outfit.styling_tips && (
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <p className="text-sm font-medium mb-2">Styling Tips:</p>
                      <p className="text-sm text-muted-foreground">
                        {outfit.styling_tips}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Alternative Options */}
                {outfit.alternative_options && (
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium">Alternative options:</p>
                    <p>{outfit.alternative_options}</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-8">
            <Icons.sparkles className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="mt-4 text-muted-foreground">
              Select occasion and season to see outfit suggestions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

---

### 📏 6.7 `/src/components/features/size-recommendation.tsx`
**Purpose**: AI-powered size recommendation component

```tsx
'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'

interface SizeRecommendationProps {
  productId: string
  variants: Array<{
    id: string
    size?: string | null
    inventoryQuantity: number
  }>
  category: string
  brand?: string
}

export function SizeRecommendation({ 
  productId, 
  variants, 
  category,
  brand = 'Unknown'
}: SizeRecommendationProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>()
  const [showMeasurements, setShowMeasurements] = useState(false)
  const [measurements, setMeasurements] = useState<Record<string, number>>({})

  const { data, isLoading, refetch } = api.ai.getSizeRecommendation.useQuery({
    productId,
    variantId: selectedVariantId,
    measurements: Object.keys(measurements).length > 0 ? measurements : undefined,
  })

  const confidenceColors = {
    high: 'text-green-600 bg-green-50',
    medium: 'text-yellow-600 bg-yellow-50',
    low: 'text-red-600 bg-red-50',
  }

  const measurementFields = {
    tops: ['chest', 'waist', 'length'],
    bottoms: ['waist', 'hips', 'inseam'],
    shoes: ['footLength'],
    accessories: [],
  }

  const getCategoryType = () => {
    const lowerCategory = category.toLowerCase()
    if (lowerCategory.includes('shirt') || lowerCategory.includes('jacket') || lowerCategory.includes('top')) {
      return 'tops'
    }
    if (lowerCategory.includes('pant') || lowerCategory.includes('skirt') || lowerCategory.includes('short')) {
      return 'bottoms'
    }
    if (lowerCategory.includes('shoe') || lowerCategory.includes('boot')) {
      return 'shoes'
    }
    return 'accessories'
  }

  const categoryType = getCategoryType()
  const fields = measurementFields[categoryType as keyof typeof measurementFields]

  // Filter variants with sizes
  const sizedVariants = variants.filter(v => v.size)

  if (sizedVariants.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icons.ruler className="h-5 w-5" />
          Find Your Size
        </CardTitle>
        <CardDescription>
          AI-powered size recommendations for {brand}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Size Selector */}
        <div className="space-y-2">
          <Label>Available Sizes</Label>
          <div className="flex flex-wrap gap-2">
            {sizedVariants.map((variant) => (
              <Button
                key={variant.id}
                variant={selectedVariantId === variant.id ? 'default' : 'outline'}
                size="sm"
                disabled={variant.inventoryQuantity === 0}
                onClick={() => setSelectedVariantId(variant.id)}
                className="relative"
              >
                {variant.size}
                {variant.inventoryQuantity === 0 && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-md bg-background/80">
                    <Icons.x className="h-4 w-4" />
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Recommendation Display */}
        {data && (
          <div className="space-y-4">
            {/* Recommended Size */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Recommended Size</p>
                  <p className="text-2xl font-bold">{data.recommended_size}</p>
                </div>
                <Badge 
                  className={cn(
                    'ml-2',
                    confidenceColors[data.confidence_level as keyof typeof confidenceColors]
                  )}
                >
                  {data.confidence_level} confidence
                </Badge>
              </div>
              
              {data.fit_notes && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {data.fit_notes}
                </p>
              )}
            </div>

            {/* Alternative Sizes */}
            {data.alternative_sizes && data.alternative_sizes.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Alternative Options</p>
                <div className="flex gap-2">
                  {data.alternative_sizes.map((size) => (
                    <Badge key={size} variant="secondary">
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Size Comparison */}
            {data.size_comparison && (
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm">
                  <span className="font-medium">Compared to other brands:</span>{' '}
                  {data.size_comparison}
                </p>
              </div>
            )}

            {/* Measurement Tips */}
            {data.measurement_tips && (
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Measurement Tips:</p>
                <p>{data.measurement_tips}</p>
              </div>
            )}
          </div>
        )}

        {/* Measurements Input */}
        {fields.length > 0 && (
          <Dialog open={showMeasurements} onOpenChange={setShowMeasurements}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Icons.ruler className="mr-2 h-4 w-4" />
                Add Your Measurements
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Your Measurements</DialogTitle>
                <DialogDescription>
                  Enter your measurements for a more accurate size recommendation
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <Tabs defaultValue="cm">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="cm">Centimeters</TabsTrigger>
                    <TabsTrigger value="in">Inches</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="cm" className="space-y-4">
                    {fields.map((field) => (
                      <div key={field} className="space-y-2">
                        <Label htmlFor={field} className="capitalize">
                          {field} (cm)
                        </Label>
                        <Input
                          id={field}
                          type="number"
                          value={measurements[field] || ''}
                          onChange={(e) => setMeasurements({
                            ...measurements,
                            [field]: parseFloat(e.target.value)
                          })}
                        />
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="in" className="space-y-4">
                    {fields.map((field) => (
                      <div key={field} className="space-y-2">
                        <Label htmlFor={`${field}-in`} className="capitalize">
                          {field} (inches)
                        </Label>
                        <Input
                          id={`${field}-in`}
                          type="number"
                          value={measurements[field] ? (measurements[field] / 2.54).toFixed(1) : ''}
                          onChange={(e) => setMeasurements({
                            ...measurements,
                            [field]: parseFloat(e.target.value) * 2.54
                          })}
                        />
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
                
                <Button
                  className="w-full"
                  onClick={() => {
                    refetch()
                    setShowMeasurements(false)
                  }}
                >
                  Get Recommendation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Size Guide Link */}
        <Button variant="link" className="w-full">
          View {brand} Size Chart
          <Icons.externalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
```

---

### 📈 6.8 `/src/components/features/trend-insights.tsx`
**Purpose**: AI-generated fashion trend insights

```tsx
'use client'

import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Icons } from '@/components/ui/icons'
import { ProductCard } from '@/components/features/product-card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface TrendInsightsProps {
  categories?: string[]
  className?: string
}

export function TrendInsights({ categories, className }: TrendInsightsProps) {
  const { data, isLoading } = api.ai.getTrendAnalysis.useQuery({
    categories,
  })

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return null
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Icons.trendingUp className="h-5 w-5" />
              Trend Insights
            </CardTitle>
            <CardDescription>
              AI-curated fashion trends and investment pieces
            </CardDescription>
          </div>
          {data.lastUpdated && (
            <p className="text-xs text-muted-foreground">
              Updated {new Date(data.lastUpdated).toLocaleDateString()}
            </p>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trending">Trending Now</TabsTrigger>
            <TabsTrigger value="emerging">Emerging</TabsTrigger>
            <TabsTrigger value="timeless">Timeless</TabsTrigger>
          </TabsList>
          
          {/* Trending Now */}
          <TabsContent value="trending" className="space-y-6">
            {data.trending_now.map((trend, index) => (
              <div key={index} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold">{trend.trend}</h4>
                    <Badge variant={trend.longevity === 'long-term' ? 'default' : 'secondary'}>
                      {trend.longevity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {trend.description}
                  </p>
                  
                  {/* Key Pieces */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-sm font-medium">Key pieces:</span>
                    {trend.key_pieces.map((piece) => (
                      <Badge key={piece} variant="outline">
                        {piece}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Leading Brands */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-sm font-medium">Leading brands:</span>
                    {trend.brands_leading.map((brand) => (
                      <Badge key={brand} variant="secondary">
                        {brand}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Product Carousel */}
                {trend.products && trend.products.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {trend.products.slice(0, 4).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </TabsContent>
          
          {/* Emerging Trends */}
          <TabsContent value="emerging" className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium mb-2">
                <Icons.eye className="inline h-4 w-4 mr-1" />
                Keep an eye on these upcoming trends:
              </p>
              <div className="flex flex-wrap gap-2">
                {data.emerging_trends.map((trend) => (
                  <Badge key={trend} variant="outline">
                    {trend}
                  </Badge>
                ))}
              </div>
            </div>
            
            {data.personalized_recommendations && (
              <div className="space-y-2">
                <h4 className="font-medium">For Your Style</h4>
                <p className="text-sm text-muted-foreground">
                  {data.personalized_recommendations}
                </p>
              </div>
            )}
          </TabsContent>
          
          {/* Timeless Pieces */}
          <TabsContent value="timeless" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Classic pieces that never go out of style:
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {data.timeless_pieces.map((piece) => (
                <div
                  key={piece}
                  className="flex items-center gap-2 rounded-lg border p-3"
                >
                  <Icons.checkCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">{piece}</span>
                </div>
              ))}
            </div>
            
            {/* Investment Pieces */}
            {data.investment_pieces.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-2">Worth the Investment</h4>
                <div className="space-y-2">
                  {data.investment_pieces.map((piece) => (
                    <div key={piece} className="flex items-center gap-2">
                      <Icons.gem className="h-4 w-4 text-primary" />
                      <span className="text-sm">{piece}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
```

---

### 🎨 6.9 `/src/components/features/style-quiz.tsx`
**Purpose**: Interactive style quiz for AI profile generation

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Icons } from '@/components/ui/icons'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface StyleQuizProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const quizQuestions = [
  {
    id: 'style_personality',
    question: 'Which best describes your style personality?',
    options: [
      { value: 'classic', label: 'Classic & Timeless', icon: Icons.crown },
      { value: 'trendy', label: 'Trendy & Fashion-Forward', icon: Icons.sparkles },
      { value: 'minimalist', label: 'Minimalist & Clean', icon: Icons.minimize },
      { value: 'eclectic', label: 'Eclectic & Bold', icon: Icons.zap },
    ],
  },
  {
    id: 'color_preference',
    question: 'What colors do you gravitate towards?',
    options: [
      { value: 'neutral', label: 'Neutrals (Black, White, Beige)', color: '#8B8B8B' },
      { value: 'earth', label: 'Earth Tones (Brown, Green, Rust)', color: '#8B4513' },
      { value: 'jewel', label: 'Jewel Tones (Emerald, Sapphire)', color: '#50C878' },
      { value: 'pastel', label: 'Pastels (Soft Pink, Blue)', color: '#FFB6C1' },
    ],
  },
  {
    id: 'occasion',
    question: 'What do you shop for most often?',
    options: [
      { value: 'work', label: 'Work & Professional', icon: Icons.briefcase },
      { value: 'casual', label: 'Casual & Everyday', icon: Icons.coffee },
      { value: 'evening', label: 'Evening & Special Events', icon: Icons.star },
      { value: 'mixed', label: 'A Mix of Everything', icon: Icons.layers },
    ],
  },
  {
    id: 'fit_preference',
    question: 'How do you prefer your clothes to fit?',
    options: [
      { value: 'fitted', label: 'Fitted & Tailored' },
      { value: 'relaxed', label: 'Relaxed & Comfortable' },
      { value: 'oversized', label: 'Oversized & Loose' },
      { value: 'varies', label: 'It Varies by Piece' },
    ],
  },
  {
    id: 'shopping_motivation',
    question: 'What motivates your purchases?',
    options: [
      { value: 'quality', label: 'Quality & Craftsmanship', icon: Icons.gem },
      { value: 'trends', label: 'Latest Trends', icon: Icons.trendingUp },
      { value: 'versatility', label: 'Versatility & Practicality', icon: Icons.repeat },
      { value: 'unique', label: 'Unique & Statement Pieces', icon: Icons.star },
    ],
  },
  {
    id: 'price_range',
    question: 'What\'s your typical budget per item?',
    options: [
      { value: { min: 0, max: 200 }, label: 'Under $200' },
      { value: { min: 200, max: 500 }, label: '$200 - $500' },
      { value: { min: 500, max: 1000 }, label: '$500 - $1,000' },
      { value: { min: 1000, max: 10000 }, label: '$1,000+' },
    ],
  },
  {
    id: 'sustainability',
    question: 'How important is sustainability to you?',
    options: [
      { value: 'very_important', label: 'Very Important', icon: Icons.leaf },
      { value: 'important', label: 'Somewhat Important' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'not_important', label: 'Not a Priority' },
    ],
  },
  {
    id: 'brand_preference',
    question: 'Do you have brand preferences?',
    options: [
      { value: 'luxury_only', label: 'Luxury Brands Only' },
      { value: 'mix_high_low', label: 'Mix of High & Low' },
      { value: 'emerging', label: 'Emerging Designers' },
      { value: 'no_preference', label: 'No Preference' },
    ],
  },
]

export function StyleQuiz({ open, onOpenChange }: StyleQuizProps) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const generateProfileMutation = api.ai.generateStyleProfile.useMutation({
    onSuccess: () => {
      toast({
        title: 'Style profile created!',
        description: 'Your personalized recommendations are ready.',
      })
      onOpenChange(false)
      router.push('/account/style-profile')
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create style profile',
        variant: 'destructive',
      })
    },
  })

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100
  const question = quizQuestions[currentQuestion]
  const isLastQuestion = currentQuestion === quizQuestions.length - 1

  const handleAnswer = (value: any) => {
    setAnswers({ ...answers, [question.id]: value })
    
    if (isLastQuestion) {
      // Submit the quiz
      generateProfileMutation.mutate({
        quizAnswers: { ...answers, [question.id]: value },
        favoriteProductIds: selectedProducts,
      })
    } else {
      // Go to next question
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Discover Your Style</DialogTitle>
          <DialogDescription>
            Answer a few questions to get personalized recommendations
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {
