// src/server/api/routers/cart.ts
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from '@/server/api/trpc'
import { stripe, validateCoupon } from '@/lib/stripe'
import { nanoid } from 'nanoid'

export const cartRouter = createTRPCRouter({
  /**
   * Sync cart with server
   */
  sync: publicProcedure
    .input(
      z.object({
        cartId: z.string().optional(),
        items: z.array(
          z.object({
            productId: z.string().uuid(),
            variantId: z.string().uuid().optional(),
            quantity: z.number().positive(),
            personalizations: z.record(z.any()).optional(),
          })
        ),
        discountCodes: z.array(z.string()).optional(),
        giftCardCodes: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let cart
      
      // Find or create cart
      if (input.cartId) {
        cart = await ctx.prisma.cart.findUnique({
          where: { id: input.cartId },
          include: { items: true },
        })
      }
      
      if (!cart) {
        // Create new cart
        cart = await ctx.prisma.cart.create({
          data: {
            id: nanoid(),
            userId: ctx.session?.user?.id,
            sessionId: ctx.session?.id,
            items: {
              create: [],
            },
          },
          include: { items: true },
        })
      }
      
      // Update cart items
      // First, remove all existing items
      await ctx.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      })
      
      // Then add new items
      const cartItems = await Promise.all(
        input.items.map(async (item) => {
          // Get product and variant info
          const product = await ctx.prisma.product.findUnique({
            where: { id: item.productId },
            select: {
              id: true,
              price: true,
              compareAtPrice: true,
            },
          })
          
          if (!product) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: `Product ${item.productId} not found`,
            })
          }
          
          let price = product.price
          let compareAtPrice = product.compareAtPrice
          
          if (item.variantId) {
            const variant = await ctx.prisma.productVariant.findUnique({
              where: { id: item.variantId },
              select: {
                price: true,
                compareAtPrice: true,
              },
            })
            
            if (variant) {
              price = variant.price || price
              compareAtPrice = variant.compareAtPrice || compareAtPrice
            }
          }
          
          return ctx.prisma.cartItem.create({
            data: {
              cartId: cart.id,
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              priceAtTime: price,
              personalization: item.personalizations,
            },
          })
        })
      )
      
      // Update cart totals
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.priceAtTime.toNumber() * item.quantity,
        0
      )
      
      await ctx.prisma.cart.update({
        where: { id: cart.id },
        data: {
          subtotal,
          total: subtotal, // Will be recalculated with tax/shipping
          couponCode: input.discountCodes?.[0],
          giftCardCodes: input.giftCardCodes || [],
        },
      })
      
      return cart
    }),

  /**
   * Validate stock availability
   */
  validateStock: publicProcedure
    .input(
      z.array(
        z.object({
          productId: z.string().uuid(),
          variantId: z.string().uuid().optional(),
          quantity: z.number().positive(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const stockStatus = await Promise.all(
        input.map(async (item) => {
          if (item.variantId) {
            const variant = await ctx.prisma.productVariant.findUnique({
              where: { id: item.variantId },
              select: {
                inventoryQuantity: true,
                inventoryReserved: true,
                isAvailable: true,
              },
            })
            
            if (!variant || !variant.isAvailable) {
              return {
                productId: item.productId,
                variantId: item.variantId,
                inStock: false,
                availableQuantity: 0,
              }
            }
            
            const available = variant.inventoryQuantity - variant.inventoryReserved
            
            return {
              productId: item.productId,
              variantId: item.variantId,
              inStock: available >= item.quantity,
              availableQuantity: available,
            }
          }
          
          // Check product-level stock
          const product = await ctx.prisma.product.findUnique({
            where: { id: item.productId },
            select: {
              variants: {
                select: {
                  inventoryQuantity: true,
                  inventoryReserved: true,
                },
              },
            },
          })
          
          if (!product) {
            return {
              productId: item.productId,
              inStock: false,
              availableQuantity: 0,
            }
          }
          
          const totalAvailable = product.variants.reduce(
            (sum, v) => sum + v.inventoryQuantity - v.inventoryReserved,
            0
          )
          
          return {
            productId: item.productId,
            inStock: totalAvailable >= item.quantity,
            availableQuantity: totalAvailable,
          }
        })
      )
      
      return stockStatus
    }),

  /**
   * Validate discount code
   */
  validateDiscount: publicProcedure
    .input(
      z.object({
        code: z.string(),
        subtotal: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Check database first
        const coupon = await ctx.prisma.coupon.findUnique({
          where: { code: input.code.toUpperCase() },
          select: {
            id: true,
            code: true,
            discountType: true,
            discountValue: true,
            minimumAmount: true,
            validFrom: true,
            validUntil: true,
            usageLimit: true,
            usageCount: true,
            usageLimitPerUser: true,
            firstPurchaseOnly: true,
            membershipTiers: true,
          },
        })
        
        if (!coupon) {
          // Try Stripe as fallback
          const stripeCoupon = await validateCoupon(input.code)
          
          return {
            code: input.code,
            type: stripeCoupon.type as 'percentage' | 'fixed',
            value: stripeCoupon.value,
          }
        }
        
        // Validate coupon rules
        const now = new Date()
        
        if (coupon.validFrom && coupon.validFrom > now) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Coupon is not yet valid',
          })
        }
        
        if (coupon.validUntil && coupon.validUntil < now) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Coupon has expired',
          })
        }
        
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Coupon usage limit reached',
          })
        }
        
        if (coupon.minimumAmount && input.subtotal) {
          if (input.subtotal < coupon.minimumAmount.toNumber()) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: `Minimum order amount of ${coupon.minimumAmount} required`,
            })
          }
        }
        
        // Check user-specific rules
        if (ctx.session?.user) {
          if (coupon.firstPurchaseOnly) {
            const orderCount = await ctx.prisma.order.count({
              where: { userId: ctx.session.user.id },
            })
            
            if (orderCount > 0) {
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Coupon is only valid for first purchase',
              })
            }
          }
          
          if (coupon.usageLimitPerUser) {
            const userUsageCount = await ctx.prisma.couponUse.count({
              where: {
                couponId: coupon.id,
                userId: ctx.session.user.id,
              },
            })
            
            if (userUsageCount >= coupon.usageLimitPerUser) {
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'You have already used this coupon',
              })
            }
          }
          
          // Check membership tier requirements
          if (coupon.membershipTiers.length > 0) {
            const user = await ctx.prisma.user.findUnique({
              where: { id: ctx.session.user.id },
              select: { membershipTier: true },
            })
            
            if (!user || !coupon.membershipTiers.includes(user.membershipTier)) {
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Coupon is not valid for your membership tier',
              })
            }
          }
        }
        
        return {
          code: coupon.code,
          type: coupon.discountType as 'percentage' | 'fixed',
          value: coupon.discountValue.toNumber(),
          minimumAmount: coupon.minimumAmount?.toNumber(),
        }
        
      } catch (error) {
        if (error instanceof TRPCError) throw error
        
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid discount code',
        })
      }
    }),

  /**
   * Validate gift card
   */
  validateGiftCard: publicProcedure
    .input(
      z.object({
        code: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // In a real implementation, you would have a gift card system
      // For now, we'll return a mock response
      
      // Mock gift card validation
      if (input.code.startsWith('GIFT')) {
        return {
          code: input.code,
          balance: 50, // $50 gift card
          currency: 'USD',
        }
      }
      
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid gift card',
      })
    }),

  /**
   * Merge guest cart with user cart after login
   */
  mergeGuestCart: protectedProcedure
    .input(
      z.object({
        guestCartId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get guest cart
      const guestCart = await ctx.prisma.cart.findUnique({
        where: { id: input.guestCartId },
        include: { items: true },
      })
      
      if (!guestCart) {
        return { success: false }
      }
      
      // Get or create user cart
      let userCart = await ctx.prisma.cart.findFirst({
        where: {
          userId: input.userId,
          isAbandoned: false,
        },
        include: { items: true },
      })
      
      if (!userCart) {
        // Transfer guest cart to user
        userCart = await ctx.prisma.cart.update({
          where: { id: guestCart.id },
          data: { userId: input.userId },
          include: { items: true },
        })
      } else {
        // Merge items
        const existingProductIds = new Set(
          userCart.items.map(item => `${item.productId}-${item.variantId}`)
        )
        
        const itemsToAdd = guestCart.items.filter(
          item => !existingProductIds.has(`${item.productId}-${item.variantId}`)
        )
        
        if (itemsToAdd.length > 0) {
          await ctx.prisma.cartItem.createMany({
            data: itemsToAdd.map(item => ({
              cartId: userCart!.id,
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              priceAtTime: item.priceAtTime,
              personalization: item.personalization,
            })),
          })
        }
        
        // Delete guest cart
        await ctx.prisma.cart.delete({
          where: { id: guestCart.id },
        })
      }
      
      return { success: true, cartId: userCart.id }
    }),

  /**
   * Get estimated shipping rates
   */
  getShippingRates: publicProcedure
    .input(
      z.object({
        countryCode: z.string().length(2),
        stateProvince: z.string().optional(),
        postalCode: z.string().optional(),
        items: z.array(
          z.object({
            weight: z.number().optional(),
            dimensions: z.object({
              length: z.number(),
              width: z.number(),
              height: z.number(),
            }).optional(),
          })
        ).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // In a real implementation, you would integrate with shipping carriers
      // For now, return mock rates
      
      const rates = [
        {
          id: 'standard',
          name: 'Standard Shipping',
          description: '5-7 business days',
          price: 10,
          estimatedDays: { min: 5, max: 7 },
        },
        {
          id: 'express',
          name: 'Express Shipping',
          description: '2-3 business days',
          price: 25,
          estimatedDays: { min: 2, max: 3 },
        },
        {
          id: 'overnight',
          name: 'Overnight Shipping',
          description: 'Next business day',
          price: 40,
          estimatedDays: { min: 1, max: 1 },
        },
      ]
      
      // Free shipping for orders over threshold
      if (ctx.session?.user) {
        const cart = await ctx.prisma.cart.findFirst({
          where: {
            userId: ctx.session.user.id,
            isAbandoned: false,
          },
          select: { subtotal: true },
        })
        
        if (cart && cart.subtotal.toNumber() >= 100) {
          rates[0].price = 0 // Free standard shipping
        }
      }
      
      return rates
    }),
})
