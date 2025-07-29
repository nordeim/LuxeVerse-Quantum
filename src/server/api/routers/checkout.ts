// src/server/api/routers/checkout.ts
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from '@/server/api/trpc'
import { 
  createPaymentIntent, 
  getOrCreateCustomer,
  PaymentIntentMetadata 
} from '@/lib/stripe'
import { nanoid } from 'nanoid'
import { OrderStatus, PaymentStatus } from '@prisma/client'
import { sendOrderConfirmationEmail } from '@/lib/email'

export const checkoutRouter = createTRPCRouter({
  /**
   * Create payment intent and order
   */
  createIntent: publicProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.string().uuid(),
            variantId: z.string().uuid().optional(),
            quantity: z.number().positive(),
            price: z.number().positive(),
          })
        ),
        shippingAddress: z.object({
          firstName: z.string(),
          lastName: z.string(),
          company: z.string().optional(),
          addressLine1: z.string(),
          addressLine2: z.string().optional(),
          city: z.string(),
          stateProvince: z.string().optional(),
          postalCode: z.string(),
          countryCode: z.string().length(2),
          phone: z.string().optional(),
        }),
        billingAddress: z.object({
          firstName: z.string(),
          lastName: z.string(),
          company: z.string().optional(),
          addressLine1: z.string(),
          addressLine2: z.string().optional(),
          city: z.string(),
          stateProvince: z.string().optional(),
          postalCode: z.string(),
          countryCode: z.string().length(2),
          phone: z.string().optional(),
        }),
        shippingMethod: z.object({
          id: z.string(),
          name: z.string(),
          description: z.string(),
          price: z.number(),
          estimatedDays: z.object({
            min: z.number(),
            max: z.number(),
          }),
        }),
        email: z.string().email(),
        notes: z.string().optional(),
        discountCodes: z.array(z.string()).optional(),
        giftCardCodes: z.array(z.string()).optional(),
        saveAddress: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Use the same logic as in the API route
      // This allows both tRPC and REST API access
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.error || 'Failed to create payment intent',
        })
      }
      
      return response.json()
    }),

  /**
   * Update shipping method
   */
  updateShipping: publicProcedure
    .input(
      z.object({
        orderId: z.string().uuid(),
        shippingMethod: z.object({
          id: z.string(),
          name: z.string(),
          description: z.string(),
          price: z.number(),
          estimatedDays: z.object({
            min: z.number(),
            max: z.number(),
          }),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Use the same logic as in the API route
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/checkout`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.error || 'Failed to update shipping',
        })
      }
      
      return response.json()
    }),

  /**
   * Calculate tax
   */
  calculateTax: publicProcedure
    .input(
      z.object({
        subtotal: z.number(),
        shippingAddress: z.object({
          countryCode: z.string().length(2),
          stateProvince: z.string().optional(),
          postalCode: z.string(),
        }),
      })
    )
    .query(async ({ input }) => {
      // In a real implementation, use a tax service like TaxJar or Avalara
      // For now, use simple tax calculation
      
      let taxRate = 0
      
      // US tax rates by state (simplified)
      if (input.shippingAddress.countryCode === 'US') {
        const stateTaxRates: Record<string, number> = {
          'CA': 0.0875, // California
          'NY': 0.08,   // New York
          'TX': 0.0625, // Texas
          'FL': 0.06,   // Florida
          // Add more states as needed
        }
        
        taxRate = stateTaxRates[input.shippingAddress.stateProvince || ''] || 0.05
      } else {
        // International orders - simplified VAT
        taxRate = 0.20 // 20% VAT
      }
      
      const taxAmount = input.subtotal * taxRate
      
      return {
        taxRate,
        taxAmount,
        taxableAmount: input.subtotal,
      }
    }),

  /**
   * Validate checkout data
   */
  validate: publicProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.string().uuid(),
            variantId: z.string().uuid().optional(),
            quantity: z.number().positive(),
          })
        ),
        email: z.string().email(),
      })
    )
    .query(async ({ ctx, input }) => {
      const errors: string[] = []
      
      // Validate email
      if (ctx.session?.user) {
        // For logged-in users, check if email matches
        if (ctx.session.user.email !== input.email) {
          errors.push('Email does not match your account')
        }
      }
      
      // Validate items
      for (const item of input.items) {
        if (item.variantId) {
          const variant = await ctx.prisma.productVariant.findUnique({
            where: { id: item.variantId },
            include: { product: true },
          })
          
          if (!variant) {
            errors.push(`Product variant not found`)
            continue
          }
          
          if (!variant.isAvailable) {
            errors.push(`${variant.product.name} (${variant.size}) is not available`)
          }
          
          const available = variant.inventoryQuantity - variant.inventoryReserved
          if (available < item.quantity) {
            errors.push(
              `${variant.product.name} (${variant.size}) - only ${available} available`
            )
          }
        } else {
          const product = await ctx.prisma.product.findUnique({
            where: { id: item.productId },
          })
          
          if (!product) {
            errors.push(`Product not found`)
          } else if (product.status !== 'ACTIVE') {
            errors.push(`${product.name} is not available`)
          }
        }
      }
      
      return {
        valid: errors.length === 0,
        errors,
      }
    }),

  /**
   * Get express checkout data (Apple Pay, Google Pay)
   */
  getExpressCheckoutData: publicProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.string().uuid(),
            variantId: z.string().uuid().optional(),
            quantity: z.number().positive(),
          })
        ),
      })
    )
    .query(async ({ ctx, input }) => {
      // Calculate totals for express checkout
      let subtotal = 0
      const displayItems = []
      
      for (const item of input.items) {
        let product
        let price
        let name
        
        if (item.variantId) {
          const variant = await ctx.prisma.productVariant.findUnique({
            where: { id: item.variantId },
            include: { product: true },
          })
          
          if (!variant) continue
          
          product = variant.product
          price = variant.price || variant.product.price
          name = `${variant.product.name} ${variant.size ? `(${variant.size})` : ''}`
        } else {
          product = await ctx.prisma.product.findUnique({
            where: { id: item.productId },
          })
          
          if (!product) continue
          
          price = product.price
          name = product.name
        }
        
        const itemTotal = price.toNumber() * item.quantity
        subtotal += itemTotal
        
        displayItems.push({
          label: `${name} x ${item.quantity}`,
          amount: Math.round(itemTotal * 100),
        })
      }
      
      // Add tax and shipping estimates
      const taxAmount = subtotal * 0.08 // 8% estimated tax
      const shippingAmount = subtotal >= 100 ? 0 : 10 // Free shipping over $100
      const total = subtotal + taxAmount + shippingAmount
      
      displayItems.push(
        {
          label: 'Tax',
          amount: Math.round(taxAmount * 100),
        },
        {
          label: 'Shipping',
          amount: Math.round(shippingAmount * 100),
        }
      )
      
      return {
        displayItems,
        total: {
          label: 'LuxeVerse',
          amount: Math.round(total * 100),
        },
        shippingOptions: [
          {
            id: 'standard',
            label: 'Standard Shipping',
            detail: '5-7 business days',
            amount: subtotal >= 100 ? 0 : 1000, // $10 or free
          },
          {
            id: 'express',
            label: 'Express Shipping',
            detail: '2-3 business days',
            amount: 2500, // $25
          },
        ],
        merchantCapabilities: ['supports3DS'],
        supportedNetworks: ['amex', 'discover', 'masterCard', 'visa'],
        countryCode: 'US',
        currencyCode: 'USD',
        requiredBillingContactFields: ['postalAddress', 'email', 'phone'],
        requiredShippingContactFields: ['postalAddress', 'email', 'phone'],
      }
    }),
})
