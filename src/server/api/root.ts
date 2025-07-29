// src/server/api/root.ts
import { createTRPCRouter } from '@/server/api/trpc'
import { productRouter } from '@/server/api/routers/product'
import { categoryRouter } from '@/server/api/routers/category'
import { userRouter } from '@/server/api/routers/user'
import { cartRouter } from '@/server/api/routers/cart'
import { orderRouter } from '@/server/api/routers/order'
import { aiRouter } from '@/server/api/routers/ai'
import { searchRouter } from '@/server/api/routers/search'
import { reviewRouter } from '@/server/api/routers/review'
import { wishlistRouter } from '@/server/api/routers/wishlist'
import { collectionRouter } from '@/server/api/routers/collection'

/**
 * This is the primary router for your server.
 * 
 * All routers added in /api/routers should be manually added here.
 * 
 * @see https://trpc.io/docs/router
 */
export const appRouter = createTRPCRouter({
  /**
   * Product management endpoints
   * - Browse products with filters
   * - Get product details
   * - Manage inventory (admin)
   */
  product: productRouter,

  /**
   * Category management endpoints
   * - Browse categories
   * - Get category hierarchy
   * - Manage categories (admin)
   */
  category: categoryRouter,

  /**
   * Collection management endpoints
   * - Browse curated collections
   * - Get collection products
   * - Manage collections (admin)
   */
  collection: collectionRouter,

  /**
   * User account endpoints
   * - Profile management
   * - Preferences
   * - Account settings
   */
  user: userRouter,

  /**
   * Shopping cart endpoints
   * - Add/remove items
   * - Update quantities
   * - Apply discounts
   */
  cart: cartRouter,

  /**
   * Order management endpoints
   * - Create orders
   * - Track orders
   * - Order history
   */
  order: orderRouter,

  /**
   * AI-powered features endpoints
   * - Personalized recommendations
   * - Visual search
   * - Style profiling
   * - Outfit suggestions
   * - Size recommendations
   * - Trend analysis
   * - AI chat assistant
   */
  ai: aiRouter,

  /**
   * Search functionality endpoints
   * - Product search
   * - Search suggestions
   * - Search filters
   */
  search: searchRouter,

  /**
   * Product review endpoints
   * - Submit reviews
   * - Get product reviews
   * - Review interactions
   */
  review: reviewRouter,

  /**
   * Wishlist management endpoints
   * - Add/remove items
   * - Share wishlists
   * - Price drop notifications
   */
  wishlist: wishlistRouter,
})

/**
 * Export type definition of API
 * This type is used on the client to add type safety to the tRPC client
 */
export type AppRouter = typeof appRouter

/**
 * Export reusable router and procedure helpers
 * These are used to create new routers and ensure consistent patterns
 */
export { createTRPCRouter, publicProcedure, protectedProcedure } from '@/server/api/trpc'
