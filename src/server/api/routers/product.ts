// src/server/api/routers/product.ts
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from '@/server/api/trpc'
import { Prisma } from '@prisma/client'

// Input validation schemas
const productFilterSchema = z.object({
  categoryId: z.string().uuid().optional(),
  categorySlug: z.string().optional(),
  brandId: z.string().uuid().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  inStock: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  materials: z.array(z.string()).optional(),
  sustainable: z.boolean().optional(),
  featured: z.boolean().optional(),
  exclusive: z.boolean().optional(),
  search: z.string().optional(),
})

const productSortSchema = z.enum([
  'newest',
  'oldest',
  'price-asc',
  'price-desc',
  'name-asc',
  'name-desc',
  'popular',
  'rating',
  'relevance',
])

export const productRouter = createTRPCRouter({
  /**
   * Get all products with advanced filtering, sorting, and pagination
   */
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().uuid().optional(),
        filters: productFilterSchema.optional(),
        sort: productSortSchema.default('newest'),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, filters = {}, sort } = input

      // Build where clause
      const where: Prisma.ProductWhereInput = {
        status: 'ACTIVE',
        deletedAt: null,
      }

      // Category filter (by ID or slug)
      if (filters.categoryId) {
        where.categoryId = filters.categoryId
      } else if (filters.categorySlug) {
        where.category = { slug: filters.categorySlug }
      }

      // Brand filter
      if (filters.brandId) {
        where.brandId = filters.brandId
      }

      // Price range filter
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        where.price = {}
        if (filters.minPrice !== undefined) {
          where.price.gte = filters.minPrice
        }
        if (filters.maxPrice !== undefined) {
          where.price.lte = filters.maxPrice
        }
      }

      // Stock filter
      if (filters.inStock === true) {
        where.variants = {
          some: {
            inventoryQuantity: { gt: 0 },
            isAvailable: true,
          },
        }
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        where.styleTags = {
          hasSome: filters.tags,
        }
      }

      // Materials filter (using JSON query)
      if (filters.materials && filters.materials.length > 0) {
        where.materials = {
          path: ['$[*].type'],
          array_contains: filters.materials,
        }
      }

      // Sustainability filter
      if (filters.sustainable === true) {
        where.AND = [
          ...(Array.isArray(where.AND) ? where.AND : []),
          {
            OR: [
              { recyclable: true },
              { materials: { path: ['$[*].sustainable'], equals: true } },
            ],
          },
        ]
      }

      // Featured filter
      if (filters.featured === true) {
        where.isFeatured = true
      }

      // Exclusive filter
      if (filters.exclusive === true) {
        where.isExclusive = true
      }

      // Search filter (name, description, tags)
      if (filters.search) {
        const searchTerms = filters.search.toLowerCase().split(' ')
        where.OR = searchTerms.map(term => ({
          OR: [
            { name: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } },
            { styleTags: { has: term } },
          ],
        }))
      }

      // Build orderBy clause
      const orderBy: Prisma.ProductOrderByWithRelationInput = (() => {
        switch (sort) {
          case 'newest':
            return { publishedAt: 'desc' }
          case 'oldest':
            return { publishedAt: 'asc' }
          case 'price-asc':
            return { price: 'asc' }
          case 'price-desc':
            return { price: 'desc' }
          case 'name-asc':
            return { name: 'asc' }
          case 'name-desc':
            return { name: 'desc' }
          case 'popular':
            return { purchaseCount: 'desc' }
          case 'rating':
            // Sort by average rating (computed field)
            return { reviews: { _count: 'desc' } }
          case 'relevance':
          default:
            // For relevance, we'll use a combination of factors
            return { viewCount: 'desc' }
        }
      })()

      // Execute query with cursor pagination
      const products = await ctx.prisma.product.findMany({
        where,
        orderBy,
        take: limit + 1, // Take one extra to determine if there's a next page
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
              isVerified: true,
            },
          },
          media: {
            where: { isPrimary: true },
            take: 1,
            select: {
              url: true,
              altText: true,
            },
          },
          variants: {
            select: {
              id: true,
              price: true,
              inventoryQuantity: true,
            },
          },
          _count: {
            select: {
              reviews: true,
              wishlistItems: true,
            },
          },
        },
      })

      // Calculate aggregate data for filters
      const aggregates = await ctx.prisma.product.aggregate({
        where: {
          status: 'ACTIVE',
          deletedAt: null,
          ...(filters.categoryId && { categoryId: filters.categoryId }),
        },
        _min: { price: true },
        _max: { price: true },
        _count: true,
      })

      // Determine next cursor
      let nextCursor: string | undefined = undefined
      if (products.length > limit) {
        const nextItem = products.pop()
        nextCursor = nextItem!.id
      }

      // Calculate average ratings
      const productsWithRatings = await Promise.all(
        products.map(async (product) => {
          const avgRating = await ctx.prisma.review.aggregate({
            where: { productId: product.id, status: 'APPROVED' },
            _avg: { rating: true },
          })

          return {
            ...product,
            rating: avgRating._avg.rating || 0,
            reviewCount: product._count.reviews,
            wishlistCount: product._count.wishlistItems,
          }
        })
      )

      return {
        products: productsWithRatings,
        nextCursor,
        hasMore: !!nextCursor,
        aggregates: {
          totalCount: aggregates._count,
          priceRange: {
            min: aggregates._min.price || 0,
            max: aggregates._max.price || 0,
          },
        },
      }
    }),

  /**
   * Get single product by slug with all details
   */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.findFirst({
        where: {
          slug: input.slug,
          status: 'ACTIVE',
          deletedAt: null,
        },
        include: {
          category: true,
          brand: true,
          media: {
            orderBy: { displayOrder: 'asc' },
          },
          variants: {
            where: { isAvailable: true },
            include: {
              media: true,
            },
            orderBy: [
              { inventoryQuantity: 'desc' },
              { price: 'asc' },
            ],
          },
          collections: {
            include: {
              collection: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          reviews: {
            where: { status: 'APPROVED' },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                },
              },
              interactions: true,
            },
            orderBy: [
              { helpfulCount: 'desc' },
              { createdAt: 'desc' },
            ],
            take: 10,
          },
          _count: {
            select: {
              reviews: {
                where: { status: 'APPROVED' },
              },
              orderItems: true,
              wishlistItems: true,
            },
          },
        },
      })

      if (!product) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found',
        })
      }

      // Track product view (fire and forget)
      if (ctx.session?.user) {
        ctx.prisma.productView.create({
          data: {
            productId: product.id,
            userId: ctx.session.user.id,
            sessionId: ctx.session.id,
            source: 'product_page',
          },
        }).catch(console.error)
      }

      // Increment view count
      ctx.prisma.product.update({
        where: { id: product.id },
        data: { viewCount: { increment: 1 } },
      }).catch(console.error)

      // Calculate average rating
      const avgRating = await ctx.prisma.review.aggregate({
        where: { productId: product.id, status: 'APPROVED' },
        _avg: { rating: true },
      })

      // Get size chart if applicable
      let sizeChart = null
      if (product.category.slug === 'clothing' || product.category.slug === 'shoes') {
        // In a real app, you'd have a proper size chart system
        sizeChart = {
          metric: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
          imperial: ['0-2', '4-6', '8-10', '12-14', '16-18', '20-22'],
        }
      }

      return {
        ...product,
        rating: avgRating._avg.rating || 0,
        reviewCount: product._count.reviews,
        purchaseCount: product._count.orderItems,
        wishlistCount: product._count.wishlistItems,
        sizeChart,
      }
    }),

  /**
   * Get related products using AI similarity
   */
  getRelated: publicProcedure
    .input(
      z.object({
        productId: z.string().uuid(),
        limit: z.number().min(1).max(20).default(8),
      })
    )
    .query(async ({ ctx, input }) => {
      const { productId, limit } = input

      // Get the source product
      const sourceProduct = await ctx.prisma.product.findUnique({
        where: { id: productId },
        select: {
          categoryId: true,
          brandId: true,
          price: true,
          styleTags: true,
        },
      })

      if (!sourceProduct) {
        return { products: [] }
      }

      // Find related products based on multiple factors
      const relatedProducts = await ctx.prisma.product.findMany({
        where: {
          id: { not: productId },
          status: 'ACTIVE',
          deletedAt: null,
          OR: [
            // Same category
            { categoryId: sourceProduct.categoryId },
            // Same brand
            ...(sourceProduct.brandId ? [{ brandId: sourceProduct.brandId }] : []),
            // Similar price range (±30%)
            {
              price: {
                gte: sourceProduct.price.toNumber() * 0.7,
                lte: sourceProduct.price.toNumber() * 1.3,
              },
            },
            // Shared tags
            ...(sourceProduct.styleTags.length > 0
              ? [{ styleTags: { hasSome: sourceProduct.styleTags } }]
              : []),
          ],
        },
        take: limit * 2, // Take more to allow for scoring
        include: {
          category: true,
          brand: true,
          media: {
            where: { isPrimary: true },
            take: 1,
          },
          _count: {
            select: { reviews: true },
          },
        },
      })

      // Score products by relevance
      const scoredProducts = relatedProducts.map(product => {
        let score = 0

        // Category match (highest weight)
        if (product.categoryId === sourceProduct.categoryId) score += 10

        // Brand match
        if (product.brandId === sourceProduct.brandId) score += 5

        // Price similarity (inverse of price difference)
        const priceDiff = Math.abs(
          product.price.toNumber() - sourceProduct.price.toNumber()
        )
        const priceScore = Math.max(0, 5 - priceDiff / sourceProduct.price.toNumber())
        score += priceScore

        // Tag overlap
        const tagOverlap = product.styleTags.filter(tag =>
          sourceProduct.styleTags.includes(tag)
        ).length
        score += tagOverlap * 2

        return { ...product, score }
      })

      // Sort by score and take the top products
      const topProducts = scoredProducts
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ score, ...product }) => product)

      return { products: topProducts }
    }),

  /**
   * Get featured products for homepage
   */
  getFeatured: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).default(8),
      })
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.prisma.product.findMany({
        where: {
          status: 'ACTIVE',
          isFeatured: true,
          deletedAt: null,
          featuredAt: { not: null },
        },
        orderBy: { featuredAt: 'desc' },
        take: input.limit,
        include: {
          category: true,
          brand: true,
          media: {
            where: { isPrimary: true },
            take: 1,
          },
          _count: {
            select: { reviews: true },
          },
        },
      })

      return { products }
    }),

  /**
   * Get trending products based on recent activity
   */
  getTrending: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).default(8),
        timeframe: z.enum(['day', 'week', 'month']).default('week'),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, timeframe } = input

      // Calculate date threshold
      const dateThreshold = new Date()
      switch (timeframe) {
        case 'day':
          dateThreshold.setDate(dateThreshold.getDate() - 1)
          break
        case 'week':
          dateThreshold.setDate(dateThreshold.getDate() - 7)
          break
        case 'month':
          dateThreshold.setMonth(dateThreshold.getMonth() - 1)
          break
      }

      // Get products with recent activity
      const trendingProducts = await ctx.prisma.product.findMany({
        where: {
          status: 'ACTIVE',
          deletedAt: null,
          OR: [
            {
              productViews: {
                some: {
                  createdAt: { gte: dateThreshold },
                },
              },
            },
            {
              orderItems: {
                some: {
                  createdAt: { gte: dateThreshold },
                },
              },
            },
            {
              wishlistItems: {
                some: {
                  addedAt: { gte: dateThreshold },
                },
              },
            },
          ],
        },
        orderBy: [
          { viewCount: 'desc' },
          { purchaseCount: 'desc' },
        ],
        take: limit,
        include: {
          category: true,
          brand: true,
          media: {
            where: { isPrimary: true },
            take: 1,
          },
          _count: {
            select: {
              reviews: true,
              productViews: {
                where: {
                  createdAt: { gte: dateThreshold },
                },
              },
            },
          },
        },
      })

      return { products: trendingProducts }
    }),

  /**
   * Admin: Create new product
   */
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        slug: z.string().min(1).max(255),
        description: z.string().optional(),
        story: z.string().optional(),
        categoryId: z.string().uuid(),
        brandId: z.string().uuid().optional(),
        price: z.number().positive(),
        compareAtPrice: z.number().positive().optional(),
        cost: z.number().positive().optional(),
        sku: z.string().min(1).max(100),
        status: z.enum(['DRAFT', 'ACTIVE']).default('DRAFT'),
        metaTitle: z.string().max(255).optional(),
        metaDescription: z.string().optional(),
        styleTags: z.array(z.string()).default([]),
        materials: z.any().optional(), // JSON
        isFeatured: z.boolean().default(false),
        isExclusive: z.boolean().default(false),
        recyclable: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if slug is unique
      const existingProduct = await ctx.prisma.product.findUnique({
        where: { slug: input.slug },
      })

      if (existingProduct) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A product with this slug already exists',
        })
      }

      const product = await ctx.prisma.product.create({
        data: {
          ...input,
          publishedAt: input.status === 'ACTIVE' ? new Date() : null,
          featuredAt: input.isFeatured ? new Date() : null,
        },
      })

      return product
    }),

  /**
   * Admin: Update product
   */
  update: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).max(255).optional(),
        slug: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        story: z.string().optional(),
        categoryId: z.string().uuid().optional(),
        brandId: z.string().uuid().optional().nullable(),
        price: z.number().positive().optional(),
        compareAtPrice: z.number().positive().optional().nullable(),
        cost: z.number().positive().optional().nullable(),
        status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional(),
        metaTitle: z.string().max(255).optional().nullable(),
        metaDescription: z.string().optional().nullable(),
        styleTags: z.array(z.string()).optional(),
        materials: z.any().optional(),
        isFeatured: z.boolean().optional(),
        isExclusive: z.boolean().optional(),
        recyclable: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input

      // If slug is being updated, check uniqueness
      if (updateData.slug) {
        const existingProduct = await ctx.prisma.product.findFirst({
          where: {
            slug: updateData.slug,
            id: { not: id },
          },
        })

        if (existingProduct) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'A product with this slug already exists',
          })
        }
      }

      // Handle status changes
      const currentProduct = await ctx.prisma.product.findUnique({
        where: { id },
        select: { status: true },
      })

      if (!currentProduct) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found',
        })
      }

      // Set publishedAt if changing to ACTIVE
      if (updateData.status === 'ACTIVE' && currentProduct.status !== 'ACTIVE') {
        (updateData as any).publishedAt = new Date()
      }

      // Set featuredAt if featuring
      if (updateData.isFeatured === true) {
        (updateData as any).featuredAt = new Date()
      } else if (updateData.isFeatured === false) {
        (updateData as any).featuredAt = null
      }

      const product = await ctx.prisma.product.update({
        where: { id },
        data: updateData,
      })

      return product
    }),

  /**
   * Admin: Delete product (soft delete)
   */
  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Soft delete by setting deletedAt
      const product = await ctx.prisma.product.update({
        where: { id: input.id },
        data: {
          deletedAt: new Date(),
          status: 'ARCHIVED',
        },
      })

      return { success: true, product }
    }),
})
