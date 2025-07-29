// File: src/lib/openai.ts
import OpenAI from 'openai'

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 3,
  timeout: 30 * 1000, // 30 seconds
})

// Simple token estimation (more accurate would require tiktoken on server-side only)
export function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4)
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
