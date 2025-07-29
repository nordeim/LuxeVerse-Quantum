import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getServerAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Icons } from '@/components/ui/icons'
import { formatPrice, formatDate, cn } from '@/lib/utils'

async function getOrder(orderId: string, userId: string) {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              media: {
                where: { isPrimary: true },
                take: 1,
              },
              brand: true,
            },
          },
          variant: true,
        },
      },
      statusHistory: {
        orderBy: { createdAt: 'asc' },
        include: {
          creator: {
            select: {
              name: true,
              role: true,
            },
          },
        },
      },
      paymentTransactions: {
        orderBy: { createdAt: 'desc' },
      },
      couponUses: {
        include: {
          coupon: true,
        },
      },
    },
  })

  return order
}

interface OrderDetailPageProps {
  params: {
    orderId: string
  }
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await getServerAuthSession()
  
  if (!session) {
    redirect(`/login?callbackUrl=/account/orders/${params.orderId}`)
  }

  const order = await getOrder(params.orderId, session.user.id)

  if (!order) {
    notFound()
  }

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    PAYMENT_PROCESSING: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    PAYMENT_FAILED: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    CONFIRMED: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
    PROCESSING: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    SHIPPED: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400',
    DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    CANCELLED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    REFUNDED: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    RETURNED: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
  } as const

  const shippingAddress = order.shippingAddress as any
  const billingAddress = order.billingAddress as any

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/account" className="hover:text-foreground">
              Account
            </Link>
            <Icons.chevronRight className="h-4 w-4" />
            <Link href="/account/orders" className="hover:text-foreground">
              Orders
            </Link>
            <Icons.chevronRight className="h-4 w-4" />
            <span>#{order.orderNumber}</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Order #{order.orderNumber}
          </h1>
          <p className="text-muted-foreground">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <Badge variant="secondary" className={cn('border-0', statusColors[order.status])}>
          {order.status.replace(/_/g, ' ')}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>
                {order.items.length} {order.items.length === 1 ? 'item' : 'items'} in this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-md bg-muted">
                      {item.product.media[0] ? (
                        <img
                          src={item.product.media[0].thumbnailUrl || item.product.media[0].url}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Icons.package className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="font-medium hover:underline"
                          >
                            {item.productName}
                          </Link>
                          {item.product.brand && (
                            <p className="text-sm text-muted-foreground">
                              by {item.product.brand.name}
                            </p>
                          )}
                          {item.variantTitle && (
                            <p className="text-sm text-muted-foreground">
                              {item.variantTitle}
                            </p>
                          )}
                        </div>
                        <p className="font-medium">
                          {formatPrice(item.totalPrice)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>SKU: {item.sku}</span>
                        <span>Qty: {item.quantity}</span>
                        <span>{formatPrice(item.unitPrice)} each</span>
                      </div>
                      {item.personalization && (
                        <div className="mt-2 rounded-md bg-muted p-2 text-sm">
                          <p className="font-medium">Personalization:</p>
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(item.personalization, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
              <CardDescription>
                Track the progress of your order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.statusHistory.map((history, index) => (
                  <div key={history.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-full',
                          index === 0
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        <Icons.check className="h-4 w-4" />
                      </div>
                      {index < order.statusHistory.length - 1 && (
                        <div className="mt-2 h-full w-px bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <p className="font-medium">
                        {history.status.replace(/_/g, ' ')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(history.createdAt, true)}
                      </p>
                      {history.notes && (
                        <p className="mt-1 text-sm">{history.notes}</p>
                      )}
                      {history.creator && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          by {history.creator.name} ({history.creator.role})
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-green-600">
                      -{formatPrice(order.discountAmount)}
                    </span>
                  </div>
                )}
                {order.couponUses.length > 0 && (
                  <div className="space-y-1">
                    {order.couponUses.map((couponUse) => (
                      <div key={couponUse.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Coupon ({couponUse.coupon.code})
                        </span>
                        <span className="text-green-600">
                          -{formatPrice(couponUse.discountAmount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {order.shippingAmount > 0
                      ? formatPrice(order.shippingAmount)
                      : 'Free'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatPrice(order.taxAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>

              {/* Payment Information */}
              <Separator />
              <div className="space-y-2">
                <p className="font-medium">Payment Information</p>
                {order.paymentTransactions.map((transaction) => (
                  <div key={transaction.id} className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {transaction.type}
                      </span>
                      <Badge
                        variant={
                          transaction.status === 'COMPLETED'
                            ? 'default'
                            : transaction.status === 'FAILED'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                    {transaction.processedAt && (
                      <p className="text-xs text-muted-foreground">
                        {formatDate(transaction.processedAt, true)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Delivery Address</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {shippingAddress.firstName} {shippingAddress.lastName}
                  {shippingAddress.company && (
                    <><br />{shippingAddress.company}</>
                  )}
                  <br />
                  {shippingAddress.addressLine1}
                  {shippingAddress.addressLine2 && (
                    <><br />{shippingAddress.addressLine2}</>
                  )}
                  <br />
                  {shippingAddress.city}, {shippingAddress.stateProvince} {shippingAddress.postalCode}
                  <br />
                  {shippingAddress.countryCode}
                </p>
              </div>

              {order.shippingMethod && (
                <div>
                  <p className="text-sm font-medium">Shipping Method</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {order.shippingMethod}
                  </p>
                </div>
              )}

              {order.trackingNumber && (
                <div>
                  <p className="text-sm font-medium">Tracking Number</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {order.trackingNumber}
                  </p>
                  {order.shippingCarrier && (
                    <Button
                      variant="link"
                      size="sm"
                      className="mt-1 h-auto p-0"
                      asChild
                    >
                      <a
                        href={`https://track.example.com/${order.trackingNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Track with {order.shippingCarrier}
                        <Icons.externalLink className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {order.status === 'DELIVERED' && (
                <>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/account/orders/${order.id}/invoice`}>
                      <Icons.download className="mr-2 h-4 w-4" />
                      Download Invoice
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/account/orders/${order.id}/return`}>
                      <Icons.arrowLeft className="mr-2 h-4 w-4" />
                      Return Items
                    </Link>
                  </Button>
                </>
              )}
              {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/account/orders/${order.id}/cancel`}>
                    <Icons.x className="mr-2 h-4 w-4" />
                    Cancel Order
                  </Link>
                </Button>
              )}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/support">
                  <Icons.helpCircle className="mr-2 h-4 w-4" />
                  Get Help
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
