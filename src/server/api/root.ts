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
 */
export const appRouter = createTRPCRouter({
  product: productRouter,
  category: categoryRouter,
  collection: collectionRouter,
  user: userRouter,
  cart: cartRouter,
  order: orderRouter,
  ai: aiRouter,
  search: searchRouter,
  review: reviewRouter,
  wishlist: wishlistRouter,
})

// Export type definition of API
export type AppRouter = typeof appRouter
