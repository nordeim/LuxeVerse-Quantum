// src/app/(shop)/checkout/success/order-success-content.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icons } from '@/components/ui/icons'
import { CartItemCard } from '@/components/features/cart/cart-item-card'
import { formatPrice, formatDate } from '@/lib/utils'

interface OrderSuccessContentProps {
  orderId?: string
  sessionId?: string
}

export function OrderSuccessContent({ orderId, sessionId }: OrderSuccessContentProps) {
  const router = useRouter()
  const [order, setOrder] = useState<any>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>()
  
  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        let orderData
        
        if (orderId) {
          orderData = await api.order.getById.query({ orderId })
        } else if (sessionId) {
          orderData = await api.order.getBySessionId.query({ sessionId })
        }
        
        if (orderData) {
          setOrder(orderData)
          
          // Trigger confetti animation
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500', '#FF6B00'],
          })
        } else {
          setError('Order not found')
        }
      } catch (err) {
        console.error('Failed to fetch order:', err)
        setError('Failed to load order details')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchOrder()
  }, [orderId, sessionId])
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-lg text-muted-foreground">Loading your order...</p>
        </div>
      </div>
    )
  }
  
  if (error || !order) {
    return (
      <div className="container max-w-2xl py-16">
        <Alert variant="destructive">
          <Icons.alertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || 'Something went wrong. Please contact support.'}
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <Button asChild>
            <Link href="/account/orders">View Orders</Link>
          </Button>
        </div>
      </div>
    )
  }
  
  const deliveryEstimate = new Date()
  deliveryEstimate.setDate(deliveryEstimate.getDate() + 7)
  
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success Header */}
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
            >
              <Icons.checkCircle className="h-12 w-12 text-green-600" />
            </motion.div>
            
            <h1 className="mb-2 text-3xl font-bold">Order Confirmed!</h1>
            <p className="text-lg text-muted-foreground">
              Thank you for your purchase, {order.shippingAddress.firstName}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Order #{order.orderNumber}
            </p>
          </div>
          
          {/* Order Summary Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                We've sent a confirmation email to {order.customerEmail}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Items */}
              <div>
                <h3 className="mb-4 font-medium">Items ({order.items.length})</h3>
                <div className="space-y-3">
                  {order.items.map((item: any) => (
                    <CartItemCard
                      key={item.id}
                      item={{
                        id: item.id,
                        productId: item.productId,
                        variantId: item.variantId,
                        product: {
                          name: item.productName,
                          slug: item.product?.slug || '',
                          media: item.product?.media,
                        },
                        variant: item.variant,
                        quantity: item.quantity,
                        price: item.unitPrice.toNumber(),
                      }}
                      editable={false}
                      showDetails={false}
                    />
                  ))}
                </div>
              </div>
              
              <Separator />
              
              {/* Delivery Information */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-medium">Delivery Address</h3>
                  <address className="text-sm text-muted-foreground not-italic">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                    {order.shippingAddress.addressLine1}<br />
                    {order.shippingAddress.addressLine2 && (
                      <>{order.shippingAddress.addressLine2}<br /></>
                    )}
                    {order.shippingAddress.city}, {order.shippingAddress.stateProvince} {order.shippingAddress.postalCode}<br />
                    {order.shippingAddress.countryCode}
                  </address>
                </div>
                
                <div>
                  <h3 className="mb-2 font-medium">Delivery Method</h3>
                  <p className="text-sm text-muted-foreground">
                    {order.shippingMethod}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Estimated delivery: {formatDate(deliveryEstimate)}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              {/* Payment Summary */}
              <div>
                <h3 className="mb-4 font-medium">Payment Summary</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd>{formatPrice(order.subtotal.toNumber())}</dd>
                  </div>
                  {order.discountAmount.toNumber() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <dt>Discount</dt>
                      <dd>-{formatPrice(order.discountAmount.toNumber())}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Tax</dt>
                    <dd>{formatPrice(order.taxAmount.toNumber())}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Shipping</dt>
                    <dd>{formatPrice(order.shippingAmount.toNumber())}</dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base font-medium">
                    <dt>Total</dt>
                    <dd>{formatPrice(order.total.toNumber())}</dd>
                  </div>
                </dl>
              </div>
            </CardContent>
          </Card>
          
          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icons.mail className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium">Check Your Email</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We've sent order details and tracking info
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icons.truck className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium">Track Your Order</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We'll notify you when your order ships
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icons.heart className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium">Share Your Style</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tag us @luxeverse to be featured
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Actions */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/account/orders">View Order Details</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
