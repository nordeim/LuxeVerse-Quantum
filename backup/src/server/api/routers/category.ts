// src/server/api/routers/category.ts
import { z } from 'zod'
import { createTRPCRouter, publicProcedure, adminProcedure } from '@/server/api/trpc'

export const categoryRouter = createTRPCRouter({
  /**
   * Get all categories with hierarchy
   */
  getAll: publicProcedure
    .input(z.object({
      includeProductCount: z.boolean().default(false),
    }))
    .query(async ({ ctx, input }) => {
      const categories = await ctx.prisma.category.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          displayOrder: 'asc',
        },
        include: {
          children: {
            where: {
              isActive: true,
            },
            orderBy: {
              displayOrder: 'asc',
            },
            include: input.includeProductCount ? {
              _count: {
                select: {
                  products: {
                    where: {
                      status: 'ACTIVE',
                      deletedAt: null,
                    },
                  },
                },
              },
            } : undefined,
          },
          _count: input.includeProductCount ? {
            select: {
              products: {
                where: {
                  status: 'ACTIVE',
                  deletedAt: null,
                },
              },
            },
          } : undefined,
        },
      })

      return categories
    }),

  /**
   * Get category by slug
   */
  getBySlug: publicProcedure
    .input(z.object({
      slug: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.prisma.category.findUnique({
        where: {
          slug: input.slug,
          isActive: true,
        },
        include: {
          parent: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          children: {
            where: {
              isActive: true,
            },
            orderBy: {
              displayOrder: 'asc',
            },
          },
          _count: {
            select: {
              products: {
                where: {
                  status: 'ACTIVE',
                  deletedAt: null,
                },
              },
            },
          },
        },
      })

      if (!category) {
        throw new Error('Category not found')
      }

      return category
    }),
})
