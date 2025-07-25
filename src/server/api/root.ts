// src/server/api/root.ts
import { createTRPCRouter } from '@/server/api/trpc'
import { productRouter } from '@/server/api/routers/product'
import { categoryRouter } from '@/server/api/routers/category'
import { brandRouter } from '@/server/api/routers/brand'
import { collectionRouter } from '@/server/api/routers/collection'
import { searchRouter } from '@/server/api/routers/search'
import { userRouter } from '@/server/api/routers/user'
import { cartRouter } from '@/server/api/routers/cart'
import { wishlistRouter } from '@/server/api/routers/wishlist'
import { orderRouter } from '@/server/api/routers/order'
import { aiRouter } from '@/server/api/routers/ai'
import { analyticsRouter } from '@/server/api/routers/analytics'
import { adminRouter } from '@/server/api/routers/admin'

/**
 * This is the primary router for your server.
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  // Core e-commerce routers
  product: productRouter,
  category: categoryRouter,
  brand: brandRouter,
  collection: collectionRouter,
  search: searchRouter,
  
  // User-related routers
  user: userRouter,
  cart: cartRouter,
  wishlist: wishlistRouter,
  order: orderRouter,
  
  // AI and personalization
  ai: aiRouter,
  
  // Analytics and tracking
  analytics: analyticsRouter,
  
  // Admin functionality
  admin: adminRouter,
})

// Export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.product.getAll();
 */
export { createCallerFactory } from '@/server/api/trpc'

/**
 * Helper to get typed API caller
 */
export function createCaller(ctx: any) {
  return appRouter.createCaller(ctx)
}
