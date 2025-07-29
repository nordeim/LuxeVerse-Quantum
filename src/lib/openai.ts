// src/lib/openai.ts
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

// [Rest of the file remains the same as the contributor's version, 
// just without the tiktoken import and encoding_for_model usage]
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
