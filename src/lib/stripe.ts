// src/lib/stripe.ts
import { loadStripe, Stripe } from '@stripe/stripe-js'
import StripeServer from 'stripe'

// Client-side Stripe instance
let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    )
  }
  return stripePromise
}

// Server-side Stripe instance
export const stripe = new StripeServer(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
  appInfo: {
    name: 'LuxeVerse',
    version: '2.0.0',
    url: 'https://luxeverse.ai',
  },
})

// Payment intent metadata type
export interface PaymentIntentMetadata {
  orderId: string
  userId?: string
  cartId?: string
  customerEmail: string
  shippingMethod: string
  orderTotal: string
  itemCount: string
}

// Create payment intent with enhanced options
export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  metadata: PaymentIntentMetadata,
  options?: {
    customerId?: string
    paymentMethodTypes?: string[]
    setupFutureUsage?: 'on_session' | 'off_session'
    captureMethod?: 'automatic' | 'manual'
  }
) {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
    ...options,
  })
}

// Update payment intent amount (for shipping changes, etc.)
export async function updatePaymentIntent(
  paymentIntentId: string,
  amount: number,
  metadata?: Partial<PaymentIntentMetadata>
) {
  return await stripe.paymentIntents.update(paymentIntentId, {
    amount: Math.round(amount * 100),
    ...(metadata && { metadata: metadata as any }),
  })
}

// Create or retrieve customer
export async function getOrCreateCustomer(
  email: string,
  metadata?: Record<string, string>
) {
  // Search for existing customer
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  })
  
  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0]
  }
  
  // Create new customer
  return await stripe.customers.create({
    email,
    metadata,
  })
}

// Save payment method for future use
export async function savePaymentMethod(
  paymentMethodId: string,
  customerId: string
) {
  // Attach payment method to customer
  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  })
  
  // Set as default payment method
  await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  })
}

// Create checkout session (alternative to payment intents)
export async function createCheckoutSession(
  items: Array<{
    name: string
    description?: string
    images?: string[]
    amount: number
    currency: string
    quantity: number
  }>,
  metadata: PaymentIntentMetadata,
  options: {
    successUrl: string
    cancelUrl: string
    customerId?: string
    customerEmail?: string
    allowPromotionCodes?: boolean
    shippingAddressCollection?: boolean
  }
) {
  const lineItems = items.map(item => ({
    price_data: {
      currency: item.currency,
      product_data: {
        name: item.name,
        description: item.description,
        images: item.images,
      },
      unit_amount: Math.round(item.amount * 100),
    },
    quantity: item.quantity,
  }))
  
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    metadata,
    success_url: options.successUrl,
    cancel_url: options.cancelUrl,
    customer: options.customerId,
    customer_email: options.customerEmail,
    allow_promotion_codes: options.allowPromotionCodes,
    shipping_address_collection: options.shippingAddressCollection ? {
      allowed_countries: ['US', 'CA', 'GB', 'AU', 'EU'],
    } : undefined,
  })
}

// Handle webhook events
export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Promise<StripeServer.Event> {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}

// Process refund
export async function createRefund(
  paymentIntentId: string,
  amount?: number,
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
) {
  return await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount ? Math.round(amount * 100) : undefined,
    reason,
  })
}

// Subscription management (for future features)
export async function createSubscription(
  customerId: string,
  priceId: string,
  options?: {
    trialPeriodDays?: number
    metadata?: Record<string, string>
    coupon?: string
  }
) {
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
    ...options,
  })
}

// Validate discount code
export async function validateCoupon(code: string) {
  try {
    const coupon = await stripe.coupons.retrieve(code)
    
    if (!coupon.valid) {
      throw new Error('Coupon is not valid')
    }
    
    return {
      id: coupon.id,
      type: coupon.percent_off ? 'percentage' : 'fixed',
      value: coupon.percent_off || coupon.amount_off! / 100,
      currency: coupon.currency,
      duration: coupon.duration,
      valid: coupon.valid,
    }
  } catch (error) {
    throw new Error('Invalid coupon code')
  }
}

// Calculate application fee (for marketplace features)
export function calculateApplicationFee(amount: number, feePercentage: number = 10) {
  return Math.round(amount * (feePercentage / 100))
}

// Format amount for display
export function formatStripeAmount(amount: number, currency: string = 'usd') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}
