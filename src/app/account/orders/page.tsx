import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getServerAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Icons } from '@/components/ui/icons'
import { formatPrice, formatDate } from '@/lib/utils'
import { OrdersListSkeleton } from '@/components/skeletons/orders-skeleton'

// Status badge color mapping
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

async function getOrders(userId: string, status?: string, search?: string) {
  const where = {
    userId,
    ...(status && status !== 'all' && { status }),
    ...(search && {
      OR: [
        { orderNumber: { contains: search, mode: 'insensitive' as const } },
        { items: { some: { productName: { contains: search, mode: 'insensitive' as const } } } },
      ],
    }),
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: {
            include: {
              media: {
                where: { isPrimary: true },
                take: 1,
              },
            },
          },
        },
      },
      statusHistory: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  })

  return orders
}

interface OrdersPageProps {
  searchParams?: {
    status?: string
    search?: string
  }
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const session = await getServerAuthSession()
  
  if (!session) {
    redirect('/login?callbackUrl=/account/orders')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
        <p className="text-muted-foreground">
          View and manage your orders
        </p>
      </div>

      <Suspense fallback={<OrdersListSkeleton />}>
        <OrdersList
          userId={session.user.id}
          status={searchParams?.status}
          search={searchParams?.search}
        />
      </Suspense>
    </div>
  )
}

async function OrdersList({
  userId,
  status,
  search,
}: {
  userId: string
  status?: string
  search?: string
}) {
  const orders = await getOrders(userId, status, search)

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs defaultValue={status || 'all'} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-4 sm:w-auto">
            <TabsTrigger value="all" asChild>
              <Link href="/account/orders">All</Link>
            </TabsTrigger>
            <TabsTrigger value="PROCESSING" asChild>
              <Link href="/account/orders?status=PROCESSING">Active</Link>
            </TabsTrigger>
            <TabsTrigger value="DELIVERED" asChild>
              <Link href="/account/orders?status=DELIVERED">Delivered</Link>
            </TabsTrigger>
            <TabsTrigger value="CANCELLED" asChild>
              <Link href="/account/orders?status=CANCELLED">Cancelled</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <form method="get" action="/account/orders" className="flex gap-2">
          <Input
            type="search"
            name="search"
            placeholder="Search orders..."
            defaultValue={search}
            className="w-full sm:w-64"
          />
          {status && <input type="hidden" name="status" value={status} />}
          <Button type="submit" size="icon" variant="secondary">
            <Icons.search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Icons.package className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No orders found</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {search
                ? 'Try adjusting your search terms'
                : status && status !== 'all'
                ? 'No orders with this status'
                : 'When you place an order, it will appear here'}
            </p>
            <Button className="mt-6" asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">
                        Order #{order.orderNumber}
                      </CardTitle>
                      <Badge variant="secondary" className={cn('border-0', statusColors[order.status])}>
                        {order.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <CardDescription>
                      Placed on {formatDate(order.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {order.trackingNumber && order.status === 'SHIPPED' && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={`https://track.example.com/${order.trackingNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Icons.truck className="mr-2 h-4 w-4" />
                          Track Package
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/account/orders/${order.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items Preview */}
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 4).map((item, idx) => (
                        <div
                          key={item.id}
                          className="relative h-16 w-16 overflow-hidden rounded-md border bg-background"
                          style={{ zIndex: 4 - idx }}
                        >
                          {item.product.media[0] ? (
                            <img
                              src={item.product.media[0].thumbnailUrl || item.product.media[0].url}
                              alt={item.productName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-muted">
                              <Icons.package className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-md border bg-muted text-sm font-medium">
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                      <p className="text-sm">
                        {order.items.slice(0, 2).map(item => item.productName).join(', ')}
                        {order.items.length > 2 && `, and ${order.items.length - 2} more`}
                      </p>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="grid grid-cols-2 gap-4 text-sm sm:flex sm:gap-6">
                      <div>
                        <p className="text-muted-foreground">Total</p>
                        <p className="font-medium">{formatPrice(order.total)}</p>
                      </div>
                      {order.shippingMethod && (
                        <div>
                          <p className="text-muted-foreground">Shipping</p>
                          <p className="font-medium">{order.shippingMethod}</p>
                        </div>
                      )}
                      {order.estimatedDelivery && (
                        <div>
                          <p className="text-muted-foreground">Est. Delivery</p>
                          <p className="font-medium">{formatDate(order.estimatedDelivery)}</p>
                        </div>
                      )}
                    </div>

                    {/* Order Actions */}
                    <div className="flex gap-2">
                      {order.status === 'DELIVERED' && (
                        <>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/account/orders/${order.id}/invoice`}>
                              <Icons.download className="mr-2 h-4 w-4" />
                              Invoice
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/account/orders/${order.id}/return`}>
                              Return
                            </Link>
                          </Button>
                        </>
                      )}
                      {(order.status === 'PENDING' || order.status === 'CONFIRMED') && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/account/orders/${order.id}/cancel`}>
                            Cancel Order
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
