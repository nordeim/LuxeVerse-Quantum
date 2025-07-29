// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { 
  stripe, 
  createPaymentIntent, 
  getOrCreateCustomer,
  PaymentIntentMetadata 
} from '@/lib/stripe'
import { nanoid } from 'nanoid'
import { OrderStatus, PaymentStatus } from '@prisma/client'

// Request validation schema
const createIntentSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    variantId: z.string().uuid().optional(),
    quantity: z.number().positive(),
    price: z.number().positive(),
  })),
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
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerAuthSession()
    const body = await req.json()
    
    // Validate request
    const validatedData = createIntentSchema.parse(body)
    
    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Validate stock availability
      for (const item of validatedData.items) {
        if (item.variantId) {
          const variant = await tx.productVariant.findUnique({
            where: { id: item.variantId },
            select: { 
              inventoryQuantity: true, 
              inventoryReserved: true,
              isAvailable: true,
            },
          })
          
          if (!variant || !variant.isAvailable) {
            throw new Error(`Product variant ${item.variantId} is not available`)
          }
          
          const availableQty = variant.inventoryQuantity - variant.inventoryReserved
          if (availableQty < item.quantity) {
            throw new Error(`Insufficient stock for variant ${item.variantId}`)
          }
          
          // Reserve inventory
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              inventoryReserved: {
                increment: item.quantity,
              },
            },
          })
        }
      }
      
      // Calculate totals
      let subtotal = 0
      const orderItems = []
      
      for (const item of validatedData.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { name: true, sku: true },
        })
        
        if (!product) {
          throw new Error(`Product ${item.productId} not found`)
        }
        
        const itemTotal = item.price * item.quantity
        subtotal += itemTotal
        
        orderItems.push({
          productId: item.productId,
          variantId: item.variantId,
          productName: product.name,
          sku: product.sku,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: itemTotal,
        })
      }
      
      // Apply discounts
      let discountAmount = 0
      if (validatedData.discountCodes?.length) {
        // Validate and apply discount codes
        for (const code of validatedData.discountCodes) {
          const coupon = await tx.coupon.findUnique({
            where: { code },
            select: {
              id: true,
              discountType: true,
              discountValue: true,
              minimumAmount: true,
              validUntil: true,
              usageLimit: true,
              usageCount: true,
            },
          })
          
          if (!coupon) continue
          
          // Validate coupon
          if (coupon.validUntil && coupon.validUntil < new Date()) continue
          if (coupon.minimumAmount && subtotal < coupon.minimumAmount.toNumber()) continue
          if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) continue
          
          // Calculate discount
          if (coupon.discountType === 'percentage') {
            discountAmount += subtotal * (coupon.discountValue.toNumber() / 100)
          } else {
            discountAmount += coupon.discountValue.toNumber()
          }
        }
      }
      
      // Calculate tax (simplified - in production, use a tax service)
      const taxRate = 0.08 // 8% tax
      const taxableAmount = Math.max(0, subtotal - discountAmount)
      const taxAmount = taxableAmount * taxRate
      
      // Shipping cost
      const shippingAmount = validatedData.shippingMethod.price
      
      // Final total
      const total = taxableAmount + taxAmount + shippingAmount
      
      // Create order
      const orderNumber = `LUX${nanoid(10).toUpperCase()}`
      
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: session?.user?.id || validatedData.email, // Use email for guest orders
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          customerEmail: validatedData.email,
          customerPhone: validatedData.shippingAddress.phone,
          currency: 'USD',
          subtotal,
          taxAmount,
          shippingAmount,
          discountAmount,
          total,
          shippingMethod: validatedData.shippingMethod.name,
          shippingAddress: validatedData.shippingAddress as any,
          billingAddress: validatedData.billingAddress as any,
          notes: validatedData.notes,
          metadata: {
            shippingMethodDetails: validatedData.shippingMethod,
            discountCodes: validatedData.discountCodes,
            giftCardCodes: validatedData.giftCardCodes,
          },
          items: {
            create: orderItems,
          },
        },
        include: {
          items: true,
        },
      })
      
      // Create or retrieve Stripe customer
      let customerId: string | undefined
      if (session?.user?.email || validatedData.email) {
        const customer = await getOrCreateCustomer(
          session?.user?.email || validatedData.email,
          {
            userId: session?.user?.id || 'guest',
            name: `${validatedData.shippingAddress.firstName} ${validatedData.shippingAddress.lastName}`,
          }
        )
        customerId = customer.id
      }
      
      // Create payment intent
      const metadata: PaymentIntentMetadata = {
        orderId: order.id,
        userId: session?.user?.id,
        customerEmail: validatedData.email,
        shippingMethod: validatedData.shippingMethod.name,
        orderTotal: total.toFixed(2),
        itemCount: validatedData.items.reduce((sum, item) => sum + item.quantity, 0).toString(),
      }
      
      const paymentIntent = await createPaymentIntent(
        total,
        'usd',
        metadata,
        {
          customerId,
          setupFutureUsage: session?.user ? 'on_session' : undefined,
        }
      )
      
      // Update order with payment intent ID
      await tx.order.update({
        where: { id: order.id },
        data: {
          paymentIntentId: paymentIntent.id,
        },
      })
      
      // Record coupon usage
      if (validatedData.discountCodes?.length && session?.user) {
        for (const code of validatedData.discountCodes) {
          const coupon = await tx.coupon.findUnique({
            where: { code },
            select: { id: true },
          })
          
          if (coupon) {
            await tx.couponUse.create({
              data: {
                couponId: coupon.id,
                userId: session.user.id,
                orderId: order.id,
                discountAmount,
              },
            })
            
            await tx.coupon.update({
              where: { id: coupon.id },
              data: { usageCount: { increment: 1 } },
            })
          }
        }
      }
      
      // Log order creation
      if (session?.user) {
        await tx.auditLog.create({
          data: {
            userId: session.user.id,
            action: 'order.created',
            entityType: 'order',
            entityId: order.id,
            metadata: {
              orderNumber,
              total,
              itemCount: orderItems.length,
            },
          },
        })
      }
      
      return {
        order,
        paymentIntent,
      }
    })
    
    return NextResponse.json({
      orderId: result.order.id,
      orderNumber: result.order.orderNumber,
      clientSecret: result.paymentIntent.client_secret,
      amount: result.order.total.toNumber(),
    })
    
  } catch (error) {
    console.error('Checkout error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

// Update payment intent (for shipping changes, etc.)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerAuthSession()
    const body = await req.json()
    
    const { orderId, shippingMethod } = body
    
    if (!orderId || !shippingMethod) {
      return NextResponse.json(
        { error: 'Order ID and shipping method are required' },
        { status: 400 }
      )
    }
    
    // Get order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        userId: true,
        paymentIntentId: true,
        subtotal: true,
        taxAmount: true,
        discountAmount: true,
      },
    })
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // Verify ownership
    if (order.userId !== session?.user?.id && order.userId !== body.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    // Calculate new total
    const taxableAmount = Math.max(0, order.subtotal.toNumber() - order.discountAmount.toNumber())
    const newTotal = taxableAmount + order.taxAmount.toNumber() + shippingMethod.price
    
    // Update order
    await prisma.order.update({
      where: { id: orderId },
      data: {
        shippingAmount: shippingMethod.price,
        shippingMethod: shippingMethod.name,
        total: newTotal,
        metadata: {
          shippingMethodDetails: shippingMethod,
        },
      },
    })
    
    // Update payment intent if exists
    if (order.paymentIntentId) {
      await stripe.paymentIntents.update(order.paymentIntentId, {
        amount: Math.round(newTotal * 100),
        metadata: {
          shippingMethod: shippingMethod.name,
          orderTotal: newTotal.toFixed(2),
        },
      })
    }
    
    return NextResponse.json({
      success: true,
      newTotal,
    })
    
  } catch (error) {
    console.error('Update order error:', error)
    
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
