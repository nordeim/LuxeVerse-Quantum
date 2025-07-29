import { Redis } from '@upstash/redis'

// Create Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Helper functions for common operations
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key)
      return data as T
    } catch (error) {
      console.error('Redis get error:', error)
      return null
    }
  },

  async set(key: string, value: any, expirationInSeconds?: number): Promise<void> {
    try {
      if (expirationInSeconds) {
        await redis.setex(key, expirationInSeconds, JSON.stringify(value))
      } else {
        await redis.set(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error('Redis set error:', error)
    }
  },

  async delete(key: string): Promise<void> {
    try {
      await redis.del(key)
    } catch (error) {
      console.error('Redis delete error:', error)
    }
  },

  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key)
      return result === 1
    } catch (error) {
      console.error('Redis exists error:', error)
      return false
    }
  },

  async increment(key: string, amount = 1): Promise<number | null> {
    try {
      const result = await redis.incrby(key, amount)
      return result
    } catch (error) {
      console.error('Redis increment error:', error)
      return null
    }
  },

  async expire(key: string, seconds: number): Promise<void> {
    try {
      await redis.expire(key, seconds)
    } catch (error) {
      console.error('Redis expire error:', error)
    }
  },
}

// Key generators for consistent naming
export const cacheKeys = {
  // AI recommendations
  recommendations: (userId: string, params: any) => 
    `recommendations:${userId}:${JSON.stringify(params)}`,
  
  // Visual search
  visualSearch: (imageUrl: string) => 
    `visual_search:${imageUrl}`,
  
  // Outfit suggestions
  outfits: (productId: string, occasion?: string, season?: string) => 
    `outfits:${productId}:${occasion || 'all'}:${season || 'all'}`,
  
  // Product descriptions
  productDescription: (productId: string) => 
    `enhanced_desc:${productId}`,
  
  // Trends
  trends: (params: any) => 
    `trends:${JSON.stringify(params)}`,
  
  // Similar products
  similarProducts: (productId: string, limit: number) => 
    `similar:${productId}:${limit}`,
  
  // User style profile
  styleProfile: (userId: string) => 
    `style_profile:${userId}`,
  
  // Rate limiting
  rateLimit: (key: string, userId: string) => 
    `rate_limit:${key}:${userId}`,
}
