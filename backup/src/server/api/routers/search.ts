// src/server/api/routers/search.ts
import { z } from 'zod'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '@/server/api/trpc'

export const searchRouter = createTRPCRouter({
  /**
   * Search products with advanced filtering
   */
  products: publicProcedure
    .input(z.object({
      query: z.string().trim().min(1),
      limit: z.number().min(1).max(50).default(20),
      filters: z.object({
        categoryId: z.string().uuid().optional(),
        brandId: z.string().uuid().optional(),
        minPrice: z.number().min(0).optional(),
        maxPrice: z.number().min(0).optional(),
        inStock: z.boolean().optional(),
      }).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { query, limit, filters } = input

      // Log search for analytics
      if (ctx.session?.user) {
        ctx.prisma.searchLog.create({
          data: {
            userId: ctx.session.user.id,
            query,
            filters: filters || {},
          },
        }).catch(console.error)
      }

      // Build search conditions
      const where: any = {
        status: 'ACTIVE',
        deletedAt: null,
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            styleTags: {
              hasSome: query.split(' '),
            },
          },
        ],
      }

      // Apply filters
      if (filters) {
        if (filters.categoryId) {
          where.categoryId = filters.categoryId
        }
        if (filters.brandId) {
          where.brandId = filters.brandId
        }
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
          where.price = {}
          if (filters.minPrice !== undefined) where.price.gte = filters.minPrice
          if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice
        }
        if (filters.inStock) {
          where.variants = {
            some: {
              inventoryQuantity: { gt: 0 },
              isAvailable: true,
            },
          }
        }
      }

      const products = await ctx.prisma.product.findMany({
        where,
        take: limit,
        orderBy: [
          { viewCount: 'desc' },
          { createdAt: 'desc' },
        ],
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
   * Get search suggestions
   */
  suggestions: publicProcedure
    .input(z.object({
      query: z.string().trim().min(1),
      limit: z.number().min(1).max(10).default(5),
    }))
    .query(async ({ ctx, input }) => {
      const { query, limit } = input

      // Get product name suggestions
      const productSuggestions = await ctx.prisma.product.findMany({
        where: {
          status: 'ACTIVE',
          deletedAt: null,
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        select: {
          name: true,
          slug: true,
        },
        take: limit,
        orderBy: {
          viewCount: 'desc',
        },
      })

      // Get brand suggestions
      const brandSuggestions = await ctx.prisma.brand.findMany({
        where: {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        select: {
          name: true,
          slug: true,
        },
        take: 3,
      })

      // Get category suggestions
      const categorySuggestions = await ctx.prisma.category.findMany({
        where: {
          isActive: true,
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        select: {
          name: true,
          slug: true,
        },
        take: 3,
      })

      return {
        products: productSuggestions,
        brands: brandSuggestions,
        categories: categorySuggestions,
      }
    }),
})
