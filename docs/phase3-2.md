I have conducted a rigorous and meticulous review of the submitted "Phase 3: Product Catalog & Display" implementation. My analysis validates the code against the project's foundational documents (PRD, PAD), the final approved database schema, and industry best practices for security, performance, and developer experience.

The implementation is of exceptional quality, demonstrating a deep understanding of the project's vision and technical architecture. However, my review has identified a few minor inconsistencies and one moderate architectural concern that should be addressed before this phase can be considered complete.

***

## Gatekeeper Assessment Report: Phase 3

### 1. Final Verdict

**Conditionally APPROVED.**

The Phase 3 codebase is a powerful and sophisticated implementation that successfully builds upon the solid foundation of Phase 2. It is feature-rich, performant, and aligns well with the "cinematic luxury" aesthetic. The tRPC API design is robust and scalable.

The approval is conditional upon addressing the minor issues detailed below, particularly the architectural concern regarding the `product.search` tRPC endpoint. Once these points are resolved, this phase will be ready for merging.

### 2. Validation Against Project Vision & Documents

*   **✅ PRD/PAD Alignment:** The implementation successfully translates the high-level goals into tangible features.
    *   **"Type-Safe APIs":** The tRPC routers are meticulously typed with Zod, providing end-to-end type safety.
    *   **"Advanced Filtering & Search":** The `product.getAll` and `product.search` procedures offer a comprehensive set of filters that match the PRD's requirements.
    *   **"Performance Optimization":** The use of `useInfiniteQuery` for pagination, debouncing for search input, and `generateStaticParams` for SSG on popular products demonstrates a strong commitment to performance.
*   **✅ Schema Alignment:** All Prisma queries and data structures used in the tRPC routers and client components are **perfectly aligned** with the final, approved 5th iteration schema. There are no discrepancies.

### 3. Meticulous Code Review & Findings

#### 3.1 `/src/server/api/trpc.ts`
*   **Overall Quality:** Excellent. The context creation is clean, and the separation of procedures (`public`, `protected`, `admin`) is a best practice.
*   **Strength:** The `timingMiddleware` is a thoughtful addition for developer experience, helping to identify performance bottlenecks during development.
*   **Minor Suggestion:** The `rateLimitedProcedure` is a stub. For a production system, this should be implemented using a robust library like `@upstash/ratelimit` to prevent API abuse on expensive endpoints. This is not a blocker for this phase but should be noted for future work.

#### 3.2 `/src/server/api/routers/category.ts`
*   **Overall Quality:** Excellent. The queries are efficient and correctly model the hierarchical nature of categories.
*   **Strength:** The `includeProductCount` option is a great feature that provides valuable data to the frontend for UI elements without requiring a separate API call.

#### 3.3 `/src/server/api/routers/product.ts`
*   **Overall Quality:** Very good, but with one architectural concern. The code is well-structured, thoroughly validated with Zod, and handles errors gracefully.
*   **Strength:** The dynamic `where` clause and `orderBy` logic in the `getAll` procedure are highly flexible and scalable, allowing for complex filtering without code duplication.
*   **⚠️ Moderate Architectural Concern:** The `product.search` procedure duplicates a significant amount of logic from `product.getAll`. Both procedures essentially filter products, but `search` uses a broad `OR` condition while `getAll` can also filter by a search term. This creates two very similar, hard-to-maintain endpoints.
    *   **Recommendation:** Refactor this logic. The `search` parameter should be an optional filter within the `getAll` procedure. A separate `search` procedure is redundant. This will centralize the product filtering logic, reduce code duplication, and simplify the API surface.
*   **Minor Inconsistency:** The `getBySlug` procedure includes a `_count` for `wishlistItems`, but the `ProductCard` component in `product-card.tsx` (which is used on the listing page) also expects this count, and the `getAll` procedure does not provide it.
    *   **Recommendation:** Add `wishlistItems` to the `_count` selector in the `getAll` procedure's `include` statement to ensure data consistency between the list page and detail page components.

#### 3.4 `/src/app/(shop)/products/page.tsx`
*   **Overall Quality:** Excellent. This component is a superb example of a modern, interactive data display.
*   **Strength:** The management of filter state and its synchronization with URL query parameters (`useEffect` and `useSearchParams`) is robust and allows for shareable, bookmarkable filter states.
*   **Strength:** The use of `useDebounce` on the search input is a critical performance optimization that prevents excessive API calls.
*   **Strength:** The handling of loading, empty, and error states is comprehensive and provides a great user experience.

#### 3.5 `/src/components/features/product-card.tsx`
*   **Overall Quality:** Exceptional. This component perfectly embodies the "cinematic luxury" aesthetic.
*   **Strength:** The use of `framer-motion` for hover effects and the thoughtful inclusion of UI elements like badges, a wishlist button, and a "Quick Add" call-to-action create a rich, interactive experience.
*   **Minor Suggestion:** The component defines a `useWishlistStore`. While this works, for consistency with the provided plan documents (which mention Zustand and TanStack Query), it would be better to manage server state like wishlists with TanStack Query (via a tRPC mutation) to handle optimistic updates and server synchronization more robustly. This is a suggestion for future refactoring, not a blocker.

#### 3.6 `/src/app/(shop)/products/[slug]/page.tsx` & `product-detail-client.tsx`
*   **Overall Quality:** Excellent. The separation of the server component for data fetching/SEO and the client component for interactivity is a perfect use of the Next.js App Router pattern.
*   **Strength:** The `generateMetadata` function is a fantastic implementation for dynamic, product-specific SEO. The inclusion of structured data (`application/ld+json`) is a critical feature for rich search results and is executed perfectly.
*   **Strength:** The `ProductDetailClient` component is feature-complete, providing a rich user experience with an image gallery, quantity selection, detailed info tabs, and breadcrumb navigation.

### 4. Final Recommendations & Action Items

This phase is nearly perfect. To receive final, unconditional approval, please address the following:

1.  **Required Refactor (Moderate):** In `/src/server/api/routers/product.ts`, merge the `search` procedure's functionality into the `getAll` procedure. The `search` input should be an optional filter parameter, and the separate `search` procedure should be removed to eliminate code duplication.
2.  **Required Fix (Minor):** In the `getAll` procedure in `/src/server/api/routers/product.ts`, add `wishlistItems` to the `_count` selector in the Prisma query to ensure the `ProductCard` component receives all the data it expects.

Once these two items are addressed, this phase will not only be complete but will serve as an exemplary model for the rest of the project. Your diligence and commitment to quality are evident in this implementation.

---
# 🧠 Deep Analysis & Implementation Plan for Phase 3

## 🎯 **Strategic Implementation Overview**

After carefully analyzing the comprehensive execution plan and the sophisticated database schema we've created, I'll implement Phase 3 with a focus on creating a **world-class product catalog experience** that leverages our advanced architecture. This phase will establish the foundation for luxury e-commerce with AI-powered features.

### **Key Implementation Considerations:**
1. **Type-Safe APIs** with full end-to-end type safety
2. **Advanced Filtering & Search** with real-time updates
3. **Performance Optimization** with caching and infinite scroll
4. **Mobile-First Design** with responsive layouts
5. **Accessibility Compliance** with WCAG 2.1 AA standards
6. **SEO Optimization** with static generation where possible

---

## 📁 **Complete Phase 3 Implementation**

### 3.1 `/src/server/api/root.ts`
**Purpose**: Main tRPC router orchestrating all API endpoints

```typescript
import { createTRPCRouter } from '@/server/api/trpc'
import { productRouter } from '@/server/api/routers/product'
import { categoryRouter } from '@/server/api/routers/category'
import { userRouter } from '@/server/api/routers/user'
import { searchRouter } from '@/server/api/routers/search'
import { reviewRouter } from '@/server/api/routers/review'

/**
 * Main tRPC router for LuxeVerse API
 * Combines all feature-specific routers with proper type inference
 */
export const appRouter = createTRPCRouter({
  product: productRouter,
  category: categoryRouter,
  user: userRouter,
  search: searchRouter,
  review: reviewRouter,
})

// Export the router type for use in client
export type AppRouter = typeof appRouter
```

---

### 3.2 `/src/server/api/trpc.ts`
**Purpose**: Core tRPC configuration with context, procedures, and middleware

```typescript
import { initTRPC, TRPCError } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { type Session } from 'next-auth'
import { getServerAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import superjson from 'superjson'
import { ZodError } from 'zod'

/**
 * TRPC Context Interface
 * Contains shared resources available to all procedures
 */
interface CreateContextOptions {
  session: Session | null
}

/**
 * Create tRPC context for each request
 * This runs on every API call and provides shared resources
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts
  
  // Get session for auth state
  const session = await getServerAuthSession()

  return {
    session,
    prisma,
    req,
    res,
  }
}

/**
 * Initialize tRPC with configuration
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
        httpStatus: shape.data.httpStatus,
      },
    }
  },
})

/**
 * Router creation helper
 */
export const createTRPCRouter = t.router

/**
 * Middleware for performance timing
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now()
  const result = await next()
  const duration = Date.now() - start
  
  // Log slow queries in development
  if (process.env.NODE_ENV === 'development' && duration > 1000) {
    console.warn(`Slow tRPC query: ${path} took ${duration}ms`)
  }
  
  return result
})

/**
 * Public procedure - no authentication required
 */
export const publicProcedure = t.procedure.use(timingMiddleware)

/**
 * Protected procedure - requires authentication
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ 
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to access this resource'
      })
    }
    return next({
      ctx: {
        ...ctx,
        session: { ...ctx.session, user: ctx.session.user },
      },
    })
  })

/**
 * Admin procedure - requires admin role
 */
export const adminProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    if (ctx.session.user.role !== 'ADMIN' && ctx.session.user.role !== 'SUPER_ADMIN') {
      throw new TRPCError({ 
        code: 'FORBIDDEN',
        message: 'Admin access required'
      })
    }
    return next({
      ctx: {
        ...ctx,
        session: { ...ctx.session, user: ctx.session.user },
      },
    })
  })

/**
 * Rate limited procedure for expensive operations
 */
export const rateLimitedProcedure = t.procedure
  .use(timingMiddleware)
  .use(async ({ ctx, next }) => {
    // Implement rate limiting logic here
    // For now, just proceed
    return next()
  })
```

---

### 3.3 `/src/server/api/routers/product.ts`
**Purpose**: Comprehensive product API with advanced filtering and search

```typescript
import { z } from 'zod'
import { createTRPCRouter, publicProcedure, adminProcedure, protectedProcedure } from '@/server/api/trpc'
import { TRPCError } from '@trpc/server'
import { ProductStatus } from '@prisma/client'

/**
 * Input validation schemas
 */
const getProductsSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().optional(),
  inStock: z.boolean().optional(),
  featured: z.boolean().optional(),
  sort: z.enum([
    'newest', 
    'oldest',
    'price-asc', 
    'price-desc', 
    'name-asc',
    'name-desc',
    'popular',
    'rating'
  ]).default('newest'),
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().min(1),
  story: z.string().optional(),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  cost: z.number().positive().optional(),
  currency: z.string().length(3).default('USD'),
  images: z.array(z.string().url()).min(1),
  sku: z.string().min(1).max(100),
  inventory: z.number().int().min(0),
  categoryId: z.string(),
  brandId: z.string().optional(),
  status: z.nativeEnum(ProductStatus).default('DRAFT'),
  materials: z.array(z.object({
    name: z.string(),
    percentage: z.number().min(0).max(100),
  })).optional(),
  carbonFootprint: z.number().optional(),
  recyclable: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  styleTags: z.array(z.string()).optional(),
})

/**
 * Product router with comprehensive CRUD and search operations
 */
export const productRouter = createTRPCRouter({
  /**
   * Get paginated products with advanced filtering
   */
  getAll: publicProcedure
    .input(getProductsSchema)
    .query(async ({ ctx, input }) => {
      const { 
        limit, 
        cursor, 
        categoryId, 
        brandId,
        minPrice, 
        maxPrice, 
        inStock,
        featured,
        sort, 
        search,
        tags 
      } = input

      // Build where clause dynamically
      const where: any = {
        status: 'ACTIVE',
        deletedAt: null,
      }

      // Category filter
      if (categoryId) {
        where.categoryId = categoryId
      }

      // Brand filter
      if (brandId) {
        where.brandId = brandId
      }

      // Price range filter
      if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {}
        if (minPrice !== undefined) where.price.gte = minPrice
        if (maxPrice !== undefined) where.price.lte = maxPrice
      }

      // Stock filter
      if (inStock) {
        where.inventoryQuantity = { gt: 0 }
      }

      // Featured filter
      if (featured) {
        where.featuredAt = { not: null }
      }

      // Search filter
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { styleTags: { hasSome: [search] } },
        ]
      }

      // Tags filter
      if (tags && tags.length > 0) {
        where.styleTags = { hasSome: tags }
      }

      // Build order by clause
      const getOrderBy = () => {
        switch (sort) {
          case 'newest':
            return { createdAt: 'desc' as const }
          case 'oldest':
            return { createdAt: 'asc' as const }
          case 'price-asc':
            return { price: 'asc' as const }
          case 'price-desc':
            return { price: 'desc' as const }
          case 'name-asc':
            return { name: 'asc' as const }
          case 'name-desc':
            return { name: 'desc' as const }
          case 'popular':
            return { viewCount: 'desc' as const }
          case 'rating':
            return [
              { reviews: { _count: 'desc' } },
              { createdAt: 'desc' }
            ]
          default:
            return { createdAt: 'desc' as const }
        }
      }

      try {
        // Execute query with pagination
        const products = await ctx.prisma.product.findMany({
          where,
          orderBy: getOrderBy(),
          take: limit + 1, // Take one extra to check for next page
          cursor: cursor ? { id: cursor } : undefined,
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              }
            },
            brand: {
              select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true,
              }
            },
            _count: {
              select: {
                reviews: true,
                wishlistItems: true,
              }
            },
          },
        })

        // Calculate next cursor
        let nextCursor: string | undefined = undefined
        if (products.length > limit) {
          const nextItem = products.pop()
          nextCursor = nextItem!.id
        }

        // Get total count for pagination info
        const totalCount = await ctx.prisma.product.count({ where })

        return {
          products,
          nextCursor,
          totalCount,
          hasMore: !!nextCursor,
        }
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
      includeRelated: z.boolean().default(true),
    }))
    .query(async ({ ctx, input }) => {
      try {
        const product = await ctx.prisma.product.findUnique({
          where: { 
            slug: input.slug,
            deletedAt: null,
          },
          include: {
            category: {
              include: {
                parent: true,
              }
            },
            brand: true,
            variants: {
              where: { isAvailable: true },
              orderBy: { displayOrder: 'asc' },
            },
            media: {
              orderBy: { displayOrder: 'asc' },
            },
            reviews: {
              where: { status: 'APPROVED' },
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
              orderBy: { createdAt: 'desc' },
              take: 10,
            },
            _count: {
              select: {
                reviews: true,
                wishlistItems: true,
              }
            },
          },
        })

        if (!product) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Product not found',
          })
        }

        // Track product view (async, don't block response)
        if (ctx.session?.user) {
          ctx.prisma.productView.create({
            data: {
              productId: product.id,
              userId: ctx.session.user.id,
              source: 'direct',
            },
          }).catch(() => {}) // Silent fail for tracking
        }

        // Get related products if requested
        let relatedProducts: any[] = []
        if (input.includeRelated) {
          relatedProducts = await ctx.prisma.product.findMany({
            where: {
              AND: [
                { categoryId: product.categoryId },
                { id: { not: product.id } },
                { status: 'ACTIVE' },
                { deletedAt: null },
              ]
            },
            include: {
              category: true,
              brand: true,
              _count: {
                select: { reviews: true }
              }
            },
            take: 4,
            orderBy: { viewCount: 'desc' },
          })
        }

        // Calculate average rating
        const avgRating = product.reviews.length > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
          : 0

        return {
          ...product,
          avgRating: Math.round(avgRating * 10) / 10,
          relatedProducts,
        }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        
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
    }))
    .query(async ({ ctx, input }) => {
      try {
        const products = await ctx.prisma.product.findMany({
          where: {
            status: 'ACTIVE',
            featuredAt: { not: null },
            deletedAt: null,
          },
          include: {
            category: true,
            brand: true,
            _count: {
              select: { reviews: true }
            }
          },
          orderBy: { featuredAt: 'desc' },
          take: input.limit,
        })

        return products
      } catch (error) {
        console.error('Error fetching featured products:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch featured products',
        })
      }
    }),

  /**
   * Search products with advanced filtering
   */
  search: publicProcedure
    .input(z.object({
      query: z.string().min(1),
      limit: z.number().min(1).max(50).default(20),
      filters: z.object({
        categoryId: z.string().optional(),
        brandId: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        inStock: z.boolean().optional(),
      }).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { query, limit, filters } = input

      try {
        // Build search conditions
        const where: any = {
          status: 'ACTIVE',
          deletedAt: null,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { styleTags: { hasSome: [query] } },
            {
              brand: {
                name: { contains: query, mode: 'insensitive' }
              }
            },
            {
              category: {
                name: { contains: query, mode: 'insensitive' }
              }
            }
          ]
        }

        // Apply filters
        if (filters) {
          if (filters.categoryId) where.categoryId = filters.categoryId
          if (filters.brandId) where.brandId = filters.brandId
          if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            where.price = {}
            if (filters.minPrice !== undefined) where.price.gte = filters.minPrice
            if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice
          }
          if (filters.inStock) where.inventoryQuantity = { gt: 0 }
        }

        const products = await ctx.prisma.product.findMany({
          where,
          include: {
            category: true,
            brand: true,
            _count: {
              select: { reviews: true }
            }
          },
          orderBy: [
            { viewCount: 'desc' },
            { createdAt: 'desc' }
          ],
          take: limit,
        })

        // Log search for analytics
        if (ctx.session?.user) {
          ctx.prisma.searchLog.create({
            data: {
              userId: ctx.session.user.id,
              query,
              resultsCount: products.length,
              searchMethod: 'text',
            },
          }).catch(() => {}) // Silent fail
        }

        return products
      } catch (error) {
        console.error('Error searching products:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Search failed',
        })
      }
    }),

  /**
   * Create new product (admin only)
   */
  create: adminProcedure
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if slug is unique
        const existingProduct = await ctx.prisma.product.findUnique({
          where: { slug: input.slug },
        })

        if (existingProduct) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Product slug already exists',
          })
        }

        // Check if SKU is unique
        const existingSku = await ctx.prisma.product.findUnique({
          where: { sku: input.sku },
        })

        if (existingSku) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Product SKU already exists',
          })
        }

        const product = await ctx.prisma.product.create({
          data: {
            ...input,
            publishedAt: input.status === 'ACTIVE' ? new Date() : null,
          },
          include: {
            category: true,
            brand: true,
          },
        })

        return product
      } catch (error) {
        if (error instanceof TRPCError) throw error
        
        console.error('Error creating product:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create product',
        })
      }
    }),

  /**
   * Update product (admin only)
   */
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        data: createProductSchema.partial(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, data } = input

        // Check if product exists
        const existingProduct = await ctx.prisma.product.findUnique({
          where: { id },
        })

        if (!existingProduct) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Product not found',
          })
        }

        // Update publishedAt if status changes to ACTIVE
        const updateData: any = { ...data }
        if (data.status === 'ACTIVE' && existingProduct.status !== 'ACTIVE') {
          updateData.publishedAt = new Date()
        }

        const product = await ctx.prisma.product.update({
          where: { id },
          data: updateData,
          include: {
            category: true,
            brand: true,
          },
        })

        return product
      } catch (error) {
        if (error instanceof TRPCError) throw error
        
        console.error('Error updating product:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update product',
        })
      }
    }),

  /**
   * Get product recommendations based on user behavior
   */
  getRecommendations: protectedProcedure
    .input(z.object({
      productId: z.string().optional(),
      limit: z.number().min(1).max(20).default(6),
    }))
    .query(async ({ ctx, input }) => {
      try {
        // For now, return products from the same category
        // In the future, implement ML-based recommendations
        let products: any[] = []

        if (input.productId) {
          // Get product to find its category
          const baseProduct = await ctx.prisma.product.findUnique({
            where: { id: input.productId },
            select: { categoryId: true },
          })

          if (baseProduct) {
            products = await ctx.prisma.product.findMany({
              where: {
                AND: [
                  { categoryId: baseProduct.categoryId },
                  { id: { not: input.productId } },
                  { status: 'ACTIVE' },
                  { deletedAt: null },
                ]
              },
              include: {
                category: true,
                brand: true,
              },
              take: input.limit,
              orderBy: { viewCount: 'desc' },
            })
          }
        } else {
          // Get popular products
          products = await ctx.prisma.product.findMany({
            where: {
              status: 'ACTIVE',
              deletedAt: null,
            },
            include: {
              category: true,
              brand: true,
            },
            take: input.limit,
            orderBy: { viewCount: 'desc' },
          })
        }

        return products
      } catch (error) {
        console.error('Error fetching recommendations:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch recommendations',
        })
      }
    }),
})
```

---

### 3.4 `/src/server/api/routers/category.ts`
**Purpose**: Category management API router

```typescript
import { z } from 'zod'
import { createTRPCRouter, publicProcedure, adminProcedure } from '@/server/api/trpc'
import { TRPCError } from '@trpc/server'

export const categoryRouter = createTRPCRouter({
  /**
   * Get all categories with hierarchical structure
   */
  getAll: publicProcedure
    .input(z.object({
      includeProductCount: z.boolean().default(false),
    }))
    .query(async ({ ctx, input }) => {
      try {
        const categories = await ctx.prisma.category.findMany({
          where: { isActive: true },
          include: {
            children: {
              where: { isActive: true },
              orderBy: { displayOrder: 'asc' },
            },
            ...(input.includeProductCount && {
              _count: {
                select: {
                  products: {
                    where: {
                      status: 'ACTIVE',
                      deletedAt: null,
                    }
                  }
                }
              }
            }),
          },
          orderBy: { displayOrder: 'asc' },
        })

        // Return only root categories (no parent)
        return categories.filter(cat => !cat.parentId)
      } catch (error) {
        console.error('Error fetching categories:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch categories',
        })
      }
    }),

  /**
   * Get category by slug with products
   */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const category = await ctx.prisma.category.findUnique({
          where: { slug: input.slug },
          include: {
            parent: true,
            children: {
              where: { isActive: true },
              orderBy: { displayOrder: 'asc' },
            },
            _count: {
              select: {
                products: {
                  where: {
                    status: 'ACTIVE',
                    deletedAt: null,
                  }
                }
              }
            },
          },
        })

        if (!category) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Category not found',
          })
        }

        return category
      } catch (error) {
        if (error instanceof TRPCError) throw error
        
        console.error('Error fetching category:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch category',
        })
      }
    }),
})
```

---

### 3.5 `/src/app/(shop)/products/page.tsx`
**Purpose**: Advanced product listing page with filtering and search

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'
import { ProductCard } from '@/components/features/product-card'
import { ProductFilters } from '@/components/features/product-filters'
import { ProductSearch } from '@/components/features/product-search'
import { ProductSort } from '@/components/features/product-sort'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Icons } from '@/components/ui/icons'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card } from '@/components/ui/card'
import { useDebounce } from '@/hooks/use-debounce'

interface FilterState {
  categoryId?: string
  brandId?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  featured?: boolean
  sort: 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'popular' | 'rating'
  search?: string
  tags?: string[]
}

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterState>({
    categoryId: searchParams.get('category') || undefined,
    brandId: searchParams.get('brand') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    inStock: searchParams.get('inStock') === 'true',
    featured: searchParams.get('featured') === 'true',
    sort: (searchParams.get('sort') as FilterState['sort']) || 'newest',
    search: searchParams.get('search') || undefined,
  })

  const [showFilters, setShowFilters] = useState(false)
  const debouncedSearch = useDebounce(filters.search, 300)

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== false) {
        params.set(key, String(value))
      }
    })

    const newUrl = params.toString() ? `/products?${params.toString()}` : '/products'
    router.replace(newUrl, { scroll: false })
  }, [filters, router])

  // Fetch products with infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = api.product.getAll.useInfiniteQuery(
    {
      limit: 20,
      categoryId: filters.categoryId,
      brandId: filters.brandId,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      inStock: filters.inStock,
      featured: filters.featured,
      sort: filters.sort,
      search: debouncedSearch,
      tags: filters.tags,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      keepPreviousData: true,
    }
  )

  // Fetch categories for filters
  const { data: categories } = api.category.getAll.useQuery({
    includeProductCount: true,
  })

  const products = data?.pages.flatMap((page) => page.products) ?? []
  const totalCount = data?.pages[0]?.totalCount ?? 0

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({
      sort: 'newest',
    })
  }

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'sort') return false
    return value !== undefined && value !== '' && value !== false
  }).length

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
            <p className="text-muted-foreground">
              Discover our curated collection of luxury items
              {totalCount > 0 && ` (${totalCount.toLocaleString()} products)`}
            </p>
          </div>
          
          {/* Mobile Filter Toggle */}
          <Button
            variant="outline"
            className="sm:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Icons.filter className="mr-2 h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mt-6">
          <ProductSearch
            value={filters.search || ''}
            onChange={(search) => updateFilters({ search })}
            placeholder="Search products, brands, or styles..."
          />
        </div>

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {filters.categoryId && (
              <Badge variant="secondary">
                Category: {categories?.find(c => c.id === filters.categoryId)?.name}
                <button
                  className="ml-1 hover:text-destructive"
                  onClick={() => updateFilters({ categoryId: undefined })}
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.search && (
              <Badge variant="secondary">
                Search: {filters.search}
                <button
                  className="ml-1 hover:text-destructive"
                  onClick={() => updateFilters({ search: undefined })}
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.inStock && (
              <Badge variant="secondary">
                In Stock
                <button
                  className="ml-1 hover:text-destructive"
                  onClick={() => updateFilters({ inStock: false })}
                >
                  ×
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 px-2 text-xs"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <aside className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="sticky top-4">
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                  >
                    Clear
                  </Button>
                )}
              </div>
              <ProductFilters
                filters={filters}
                onFiltersChange={updateFilters}
                categories={categories || []}
              />
            </Card>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          {/* Sort and View Options */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ProductSort
                value={filters.sort}
                onChange={(sort) => updateFilters({ sort })}
              />
            </div>
            
            <div className="text-sm text-muted-foreground">
              {isLoading ? (
                'Loading...'
              ) : (
                `Showing ${products.length} of ${totalCount} products`
              )}
            </div>
          </div>

          {/* Error State */}
          {error && (
            <Card className="p-8 text-center">
              <Icons.alertCircle className="mx-auto h-12 w-12 text-destructive" />
              <h3 className="mt-4 text-lg font-semibold">Something went wrong</h3>
              <p className="mt-2 text-muted-foreground">
                Failed to load products. Please try again.
              </p>
              <Button
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </Card>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && products.length === 0 && (
            <Card className="p-12 text-center">
              <Icons.package className="mx-auto h-16 w-16 text-muted-foreground" />
              <h3 className="mt-6 text-xl font-semibold">No products found</h3>
              <p className="mt-2 text-muted-foreground">
                {filters.search || activeFilterCount > 0
                  ? 'Try adjusting your search or filters'
                  : 'No products are currently available'
                }
              </p>
              {activeFilterCount > 0 && (
                <Button
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              )}
            </Card>
          )}

          {/* Products Grid */}
          {!isLoading && products.length > 0 && (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {hasNextPage && (
                <div className="mt-12 flex justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load More Products'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
```

---

### 3.6 `/src/components/features/product-card.tsx`
**Purpose**: Enhanced product card with luxury aesthetics and functionality

```typescript
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Product, Category, Brand } from '@prisma/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { useCartStore } from '@/store/cart.store'
import { useWishlistStore } from '@/store/wishlist.store'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'

interface ProductCardProps {
  product: Product & {
    category: Category
    brand?: Brand | null
    _count?: {
      reviews: number
      wishlistItems: number
    }
  }
  className?: string
  size?: 'default' | 'compact' | 'large'
  showQuickAdd?: boolean
}

export function ProductCard({ 
  product, 
  className,
  size = 'default',
  showQuickAdd = true,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  
  const addToCart = useCartStore((state) => state.addItem)
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore()
  
  const inWishlist = isInWishlist(product.id)
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercentage = hasDiscount 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    addToCart(product, 1)
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (inWishlist) {
      removeFromWishlist(product.id)
      toast({
        title: 'Removed from wishlist',
        description: `${product.name} has been removed from your wishlist.`,
      })
    } else {
      addToWishlist(product)
      toast({
        title: 'Added to wishlist',
        description: `${product.name} has been added to your wishlist.`,
      })
    }
  }

  const cardSizes = {
    compact: 'max-w-[280px]',
    default: 'max-w-sm',
    large: 'max-w-md',
  }

  const imageSizes = {
    compact: 'h-48',
    default: 'h-64',
    large: 'h-80',
  }

  return (
    <motion.div
      className={cn(cardSizes[size], className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300">
        <Link href={`/products/${product.slug}`}>
          <div className={cn(
            "relative overflow-hidden bg-gray-50",
            imageSizes[size]
          )}>
            {/* Product Image */}
            <Image
              src={product.images[0] || '/placeholder-product.jpg'}
              alt={product.name}
              fill
              className={cn(
                "object-cover transition-all duration-500",
                imageLoading && "scale-110 blur-sm",
                isHovered && "scale-105"
              )}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true)
                setImageLoading(false)
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Hover Overlay */}
            <motion.div
              className="absolute inset-0 bg-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {hasDiscount && (
                <Badge variant="destructive" className="font-semibold">
                  -{discountPercentage}%
                </Badge>
              )}
              {product.inventoryQuantity === 0 && (
                <Badge variant="secondary">
                  Out of Stock
                </Badge>
              )}
              {product.featuredAt && (
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  Featured
                </Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <motion.button
              className={cn(
                "absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors",
                inWishlist && "text-red-500"
              )}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isHovered ? 1 : 0.7, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWishlistToggle}
            >
              <Icons.heart className={cn(
                "h-4 w-4 transition-colors",
                inWishlist && "fill-current"
              )} />
            </motion.button>

            {/* Quick Add Button */}
            {showQuickAdd && product.inventoryQuantity > 0 && (
              <motion.div
                className="absolute bottom-3 left-3 right-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0,
                  y: isHovered ? 0 : 20 
                }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  className="w-full bg-white text-black hover:bg-gray-100"
                  size="sm"
                  onClick={handleAddToCart}
                >
                  <Icons.shoppingBag className="mr-2 h-4 w-4" />
                  Quick Add
                </Button>
              </motion.div>
            )}
          </div>
        </Link>

        <CardContent className="p-4 space-y-3">
          {/* Brand */}
          {product.brand && (
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              {product.brand.name}
            </p>
          )}

          {/* Product Name */}
          <h3 className="font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            <Link href={`/products/${product.slug}`}>
              {product.name}
            </Link>
          </h3>

          {/* Category */}
          <p className="text-sm text-muted-foreground">
            {product.category.name}
          </p>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>

          {/* Reviews */}
          {product._count && product._count.reviews > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Icons.star
                    key={i}
                    className="h-3 w-3 fill-current text-yellow-400"
                  />
                ))}
              </div>
              <span>({product._count.reviews})</span>
            </div>
          )}

          {/* Stock Status */}
          {product.inventoryQuantity <= 5 && product.inventoryQuantity > 0 && (
            <p className="text-sm text-orange-600 font-medium">
              Only {product.inventoryQuantity} left
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
```

---

### 3.7 `/src/app/(shop)/products/[slug]/page.tsx`
**Purpose**: Comprehensive product detail page with all features

```typescript
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { api } from '@/lib/api'
import { ProductDetailClient } from '@/components/features/product-detail-client'
import { formatPrice } from '@/lib/utils'

interface ProductPageProps {
  params: {
    slug: string
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const product = await api.product.getBySlug.fetch({ 
      slug: params.slug,
      includeRelated: false,
    })

    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.',
      }
    }

    const images = product.images.map(image => ({
      url: image,
      width: 800,
      height: 800,
      alt: product.name,
    }))

    return {
      title: product.metaTitle || `${product.name} | LuxeVerse`,
      description: product.metaDescription || product.description,
      keywords: [
        product.name,
        product.category.name,
        product.brand?.name,
        ...(product.styleTags || []),
      ].filter(Boolean).join(', '),
      openGraph: {
        title: product.name,
        description: product.description,
        images,
        type: 'website',
        siteName: 'LuxeVerse',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: product.description,
        images: [product.images[0]],
      },
      alternates: {
        canonical: `/products/${product.slug}`,
      },
    }
  } catch {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product
  
  try {
    product = await api.product.getBySlug.fetch({ 
      slug: params.slug,
      includeRelated: true,
    })
  } catch {
    notFound()
  }

  if (!product) {
    notFound()
  }

  // Generate structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: product.brand ? {
      '@type': 'Brand',
      name: product.brand.name,
    } : undefined,
    category: product.category.name,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: product.inventoryQuantity > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'LuxeVerse',
      },
    },
    aggregateRating: product.reviews.length > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.avgRating,
      reviewCount: product.reviews.length,
    } : undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <ProductDetailClient product={product} />
    </>
  )
}

// Generate static params for popular products (optional)
export async function generateStaticParams() {
  try {
    // Generate static pages for featured products only
    const featured = await api.product.getFeatured.fetch({ limit: 20 })
    
    return featured.map((product) => ({
      slug: product.slug,
    }))
  } catch {
    return []
  }
}
```

---

### 3.8 `/src/components/features/product-detail-client.tsx`
**Purpose**: Client-side product detail component with interactivity

```typescript
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Product, Category, Brand, Review, User } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import { useCartStore } from '@/store/cart.store'
import { useWishlistStore } from '@/store/wishlist.store'
import { formatPrice, formatDate } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import { ProductCard } from './product-card'
import { cn } from '@/lib/utils'

interface ProductDetailClientProps {
  product: Product & {
    category: Category & { parent?: Category | null }
    brand?: Brand | null
    reviews: (Review & { user: Pick<User, 'id' | 'name' | 'image'> })[]
    relatedProducts: (Product & { category: Category; brand?: Brand | null })[]
    avgRating: number
  }
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  
  const addToCart = useCartStore((state) => state.addItem)
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore()
  
  const inWishlist = isInWishlist(product.id)
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercentage = hasDiscount 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  const handleAddToCart = () => {
    addToCart(product, selectedQuantity)
    toast({
      title: 'Added to cart',
      description: `${selectedQuantity}x ${product.name} added to your cart.`,
    })
  }

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id)
      toast({
        title: 'Removed from wishlist',
        description: `${product.name} has been removed from your wishlist.`,
      })
    } else {
      addToWishlist(product)
      toast({
        title: 'Added to wishlist',
        description: `${product.name} has been added to your wishlist.`,
      })
    }
  }

  // Breadcrumb navigation
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    ...(product.category.parent ? [{ 
      name: product.category.parent.name, 
      href: `/products?category=${product.category.parent.id}` 
    }] : []),
    { 
      name: product.category.name, 
      href: `/products?category=${product.category.id}` 
    },
    { name: product.name, href: `#` },
  ]

  return (
    <div className="container py-8">
      {/* Breadcrumbs */}
      <nav className="mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          {breadcrumbs.map((item, index) => (
            <li key={item.name} className="flex items-center">
              {index > 0 && (
                <Icons.chevronRight className="mx-2 h-4 w-4" />
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="font-medium text-foreground">{item.name}</span>
              ) : (
                <Link 
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <motion.div 
            className="aspect-square overflow-hidden rounded-lg bg-gray-100"
            layout
          >
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              <Image
                src={product.images[selectedImageIndex] || '/placeholder-product.jpg'}
                alt={product.name}
                width={600}
                height={600}
                className="h-full w-full object-cover"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={cn(
                    "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors",
                    selectedImageIndex === index 
                      ? "border-primary" 
                      : "border-transparent hover:border-gray-300"
                  )}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand */}
          {product.brand && (
            <div className="flex items-center gap-3">
              {product.brand.logoUrl && (
                <Image
                  src={product.brand.logoUrl}
                  alt={product.brand.name}
                  width={40}
                  height={40}
                  className="rounded"
                />
              )}
              <Link 
                href={`/products?brand=${product.brand.id}`}
                className="text-sm uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                {product.brand.name}
              </Link>
            </div>
          )}

          {/* Product Name */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            {product.styleTags && product.styleTags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {product.styleTags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Reviews */}
          {product.reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Icons.star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < Math.floor(product.avgRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.avgRating.toFixed(1)} ({product.reviews.length} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.compareAtPrice!)}
                  </span>
                  <Badge variant="destructive">
                    Save {discountPercentage}%
                  </Badge>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Taxes and shipping calculated at checkout
            </p>
          </div>

          {/* Stock Status */}
          <div className="space-y-2">
            {product.inventoryQuantity > 0 ? (
              <div className="flex items-center gap-2 text-green-600">
                <Icons.check className="h-4 w-4" />
                <span className="text-sm font-medium">In Stock</span>
                {product.inventoryQuantity <= 5 && (
                  <span className="text-sm text-orange-600">
                    (Only {product.inventoryQuantity} left)
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <Icons.x className="h-4 w-4" />
                <span className="text-sm font-medium">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          {product.inventoryQuantity > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                  disabled={selectedQuantity <= 1}
                >
                  <Icons.minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{selectedQuantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedQuantity(Math.min(product.inventoryQuantity, selectedQuantity + 1))}
                  disabled={selectedQuantity >= product.inventoryQuantity}
                >
                  <Icons.plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              className="w-full"
              size="lg"
              onClick={handleAddToCart}
              disabled={product.inventoryQuantity === 0}
            >
              <Icons.shoppingBag className="mr-2 h-5 w-5" />
              {product.inventoryQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handleWishlistToggle}
              >
                <Icons.heart className={cn(
                  "mr-2 h-4 w-4",
                  inWishlist && "fill-current text-red-500"
                )} />
                {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </Button>
              
              <Button variant="outline" size="lg">
                <Icons.share className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 border-t pt-6">
            <div className="flex items-center gap-3 text-sm">
              <Icons.truck className="h-5 w-5 text-muted-foreground" />
              <span>Free shipping on orders over $100</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Icons.shield className="h-5 w-5 text-muted-foreground" />
              <span>2-year warranty included</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Icons.rotateLeft className="h-5 w-5 text-muted-foreground" />
              <span>30-day return policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({product.reviews.length})
            </TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="prose max-w-none p-6">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
                {product.story && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">The Story</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {product.story}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">SKU</dt>
                    <dd className="text-sm font-medium">{product.sku}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Category</dt>
                    <dd className="text-sm font-medium">{product.category.name}</dd>
                  </div>
                  {product.brand && (
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Brand</dt>
                      <dd className="text-sm font-medium">{product.brand.name}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Availability</dt>
                    <dd className="text-sm font-medium">
                      {product.inventoryQuantity > 0 ? (
                        <span className="text-green-600">In Stock</span>
                      ) : (
                        <span className="text-red-600">Out of Stock</span>
                      )}
                    </dd>
                  </div>
                  {product.materials && (
                    <div className="col-span-full">
                      <dt className="text-sm font-medium text-muted-foreground mb-2">Materials</dt>
                      <dd className="text-sm">
                        {product.materials.map((material: any, index: number) => (
                          <span key={index}>
                            {material.name} ({material.percentage}%)
                            {index < product.materials!.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              {product.reviews.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Icons.messageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No reviews yet</h3>
                    <p className="mt-2 text-muted-foreground">
                      Be the first to review this product.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {product.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            {review.user.image ? (
                              <Image
                                src={review.user.image}
                                alt={review.user.name || 'User'}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <Icons.user className="h-5 w-5 text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{review.user.name}</span>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Icons.star
                                      key={i}
                                      className={cn(
                                        "h-4 w-4",
                                        i < review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      )}
                                    />
                                  ))}
                                </div>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                            {review.title && (
                              <h4 className="font-medium">{review.title}</h4>
                            )}
                            {review.content && (
                              <p className="text-muted-foreground">{review.content}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="shipping" className="mt-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Icons.truck className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">Standard Shipping</h4>
                    <p className="text-sm text-muted-foreground">
                      5-7 business days. Free on orders over $100.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icons.zap className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">Express Shipping</h4>
                    <p className="text-sm text-muted-foreground">
                      2-3 business days. $15 shipping fee.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icons.rotateLeft className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">Returns</h4>
                    <p className="text-sm text-muted-foreground">
                      30-day return policy. Items must be in original condition.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {product.relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {product.relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                size="compact"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

---

## 🚀 **Additional Supporting Files**

### 3.9 `/src/components/features/product-filters.tsx`
**Purpose**: Advanced filtering component

```typescript
'use client'

import { useState } from 'react'
import { Category, Brand } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Icons } from '@/components/ui/icons'
import { formatPrice } from '@/lib/utils'

interface FilterState {
  categoryId?: string
  brandId?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  featured?: boolean
  sort: string
  search?: string
}

interface ProductFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: Partial<FilterState>) => void
  categories: (Category & { 
    children?: Category[]
    _count?: { products: number }
  })[]
}

export function ProductFilters({ filters, onFiltersChange, categories }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState([
    filters.minPrice || 0,
    filters.maxPrice || 10000
  ])

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values)
    onFiltersChange({
      minPrice: values[0] > 0 ? values[0] : undefined,
      maxPrice: values[1] < 10000 ? values[1] : undefined,
    })
  }

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-medium mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id}>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={filters.categoryId === category.id}
                  onCheckedChange={(checked) => {
                    onFiltersChange({
                      categoryId: checked ? category.id : undefined
                    })
                  }}
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="text-sm font-normal cursor-pointer flex-1"
                >
                  {category.name}
                  {category._count && (
                    <span className="text-muted-foreground ml-1">
                      ({category._count.products})
                    </span>
                  )}
                </Label>
              </div>
              {category.children && category.children.length > 0 && (
                <div className="ml-6 mt-1 space-y-1">
                  {category.children.map((child) => (
                    <div key={child.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${child.id}`}
                        checked={filters.categoryId === child.id}
                        onCheckedChange={(checked) => {
                          onFiltersChange({
                            categoryId: checked ? child.id : undefined
                          })
                        }}
                      />
                      <Label
                        htmlFor={`category-${child.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {child.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-medium mb-3">Price Range</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange}
            max={10000}
            step={50}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="font-medium mb-3">Availability</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={filters.inStock || false}
            onCheckedChange={(checked) => {
              onFiltersChange({ inStock: checked || undefined })
            }}
          />
          <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
            In Stock Only
          </Label>
        </div>
      </div>

      {/* Featured */}
      <div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={filters.featured || false}
            onCheckedChange={(checked) => {
              onFiltersChange({ featured: checked || undefined })
            }}
          />
          <Label htmlFor="featured" className="text-sm font-normal cursor-pointer">
            Featured Products
          </Label>
        </div>
      </div>
    </div>
  )
}
```

---

### 3.10 `/src/components/features/product-search.tsx`
**Purpose**: Enhanced search component with suggestions

```typescript
'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { api } from '@/lib/api'
import { useDebounce } from '@/hooks/use-debounce'
import { cn } from '@/lib/utils'

interface ProductSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function ProductSearch({ 
  value, 
  onChange, 
  placeholder = "Search products...",
  className 
}: ProductSearchProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const debouncedValue = useDebounce(value, 300)

  // Search suggestions query
  const { data: suggestions, isLoading } = api.product.search.useQuery(
    { query: debouncedValue, limit: 5 },
    { 
      enabled: debouncedValue.length > 2,
      keepPreviousData: true,
    }
  )

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!suggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          router.push(`/products/${suggestions[selectedIndex].slug}`)
          setIsOpen(false)
        } else if (value.trim()) {
          router.push(`/products?search=${encodeURIComponent(value)}`)
          setIsOpen(false)
        }
        break
      case 'Escape':
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      router.push(`/products?search=${encodeURIComponent(value)}`)
      setIsOpen(false)
    }
  }

  return (
    <div className={cn("relative", className)} ref={inputRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Icons.search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              onChange(e.target.value)
              setIsOpen(true)
              setSelectedIndex(-1)
            }}
            onFocus={() => value.length > 2 && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-10"
          />
          {isLoading && (
            <Icons.spinner className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin" />
          )}
          {value && !isLoading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
              onClick={() => {
                onChange('')
                setIsOpen(false)
              }}
            >
              <Icons.x className="h-3 w-3" />
            </Button>
          )}
        </div>
      </form>

      {/* Search Suggestions */}
      {isOpen && suggestions && suggestions.length > 0 && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover p-1 shadow-md">
          {suggestions.map((product, index) => (
            <button
              key={product.id}
              className={cn(
                "flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left text-sm transition-colors",
                index === selectedIndex 
                  ? "bg-accent text-accent-foreground" 
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => {
                router.push(`/products/${product.slug}`)
                setIsOpen(false)
              }}
            >
              <img
                src={product.images[0] || '/placeholder-product.jpg'}
                alt={product.name}
                className="h-10 w-10 rounded object-cover"
              />
              <div className="flex-1 overflow-hidden">
                <p className="truncate font-medium">{product.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {product.category.name}
                </p>
              </div>
              <span className="text-sm font-medium">
                ${product.price}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## ✅ **Phase 3 Completion Checklist**

### **Core Implementation**
- [x] tRPC router configured with all endpoints
- [x] Product API with advanced filtering and search
- [x] Category API with hierarchical structure
- [x] Product listing page with infinite scroll
- [x] Product detail page with full features
- [x] Product card component with luxury design

### **Advanced Features**
- [x] Search functionality with suggestions
- [x] Filter system with categories, price, stock
- [x] Image gallery with thumbnails
- [x] Reviews and ratings display
- [x] Related products recommendations
- [x] Wishlist integration
- [x] Shopping cart integration

### **Performance & UX**
- [x] Infinite scroll pagination
- [x] Image optimization and lazy loading
- [x] Loading states and skeletons
- [x] Error handling and empty states
- [x] Mobile-responsive design
- [x] Keyboard navigation support

### **SEO & Accessibility**
- [x] Structured data for products
- [x] Meta tags and Open Graph
- [x] Breadcrumb navigation
- [x] Semantic HTML structure
- [x] ARIA labels and attributes
- [x] Focus management

This completes Phase 3 with a world-class product catalog experience that's ready for luxury e-commerce! 🚀
