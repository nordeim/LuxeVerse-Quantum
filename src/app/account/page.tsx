import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getServerAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Icons } from '@/components/ui/icons'
import { formatPrice, formatDate } from '@/lib/utils'

async function getUserDashboardData(userId: string) {
  // Parallel queries for better performance
  const [
    orderStats,
    wishlistCount,
    addressCount,
    paymentMethodCount,
    recentOrders,
    recentlyViewed,
    loyaltyPoints,
  ] = await Promise.all([
    // Order statistics
    prisma.order.aggregate({
      where: { userId },
      _count: true,
      _sum: { total: true },
      _avg: { total: true },
    }),
    
    // Wishlist count
    prisma.wishlistItem.count({
      where: { wishlist: { userId } },
    }),
    
    // Address count
    prisma.address.count({
      where: { userId },
    }),
    
    // Payment method count
    prisma.paymentMethod.count({
      where: { userId },
    }),
    
    // Recent orders
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
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
      },
    }),
    
    // Recently viewed products
    prisma.productView.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 6,
      distinct: ['productId'],
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
    }),
    
    // Loyalty points
    prisma.loyaltyPoint.aggregate({
      where: { 
        userId,
        expiresAt: { gte: new Date() },
      },
      _sum: { points: true },
    }),
  ])

  // Calculate current month's orders
  const currentMonth = new Date()
  currentMonth.setDate(1)
  currentMonth.setHours(0, 0, 0, 0)
  
  const ordersThisMonth = await prisma.order.count({
    where: {
      userId,
      createdAt: { gte: currentMonth },
    },
  })

  return {
    totalOrders: orderStats._count,
    totalSpent: orderStats._sum.total || 0,
    averageOrderValue: orderStats._avg.total || 0,
    ordersThisMonth,
    wishlistCount,
    addressCount,
    paymentMethodCount,
    recentOrders,
    recentlyViewed,
    loyaltyPoints: loyaltyPoints._sum.points || 0,
  }
}

export default async function AccountDashboardPage() {
  const session = await getServerAuthSession()
  
  if (!session) {
    redirect('/login?callbackUrl=/account')
  }

  const dashboardData = await getUserDashboardData(session.user.id)

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {session.user.name}
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your account activity
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Icons.package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.ordersThisMonth > 0 && (
                <>+{dashboardData.ordersThisMonth} this month</>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <Icons.dollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(dashboardData.totalSpent)}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg: {formatPrice(dashboardData.averageOrderValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loyalty Points</CardTitle>
            <Icons.gem className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.loyaltyPoints.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {session.user.membershipTier} tier benefits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
            <Icons.heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.wishlistCount}</div>
            <p className="text-xs text-muted-foreground">
              Ready to purchase
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Membership Status */}
      <Card>
        <CardHeader>
          <CardTitle>Membership Status</CardTitle>
          <CardDescription>
            Your current membership tier and benefits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user.membershipTier} Member
              </p>
              <p className="text-sm text-muted-foreground">
                {session.user.membershipExpiresAt
                  ? `Expires ${formatDate(session.user.membershipExpiresAt)}`
                  : 'Lifetime membership'}
              </p>
            </div>
            <Badge variant="secondary" className="capitalize">
              {session.user.membershipTier}
            </Badge>
          </div>
          <Progress value={65} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Spend {formatPrice(5000)} more to reach Diamond tier
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Orders */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Your latest purchases
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/account/orders">
                  View all
                  <Icons.arrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {dashboardData.recentOrders.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-center">
                <div>
                  <Icons.package className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">No orders yet</p>
                  <Button className="mt-4" size="sm" asChild>
                    <Link href="/products">Start Shopping</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center space-x-4">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div
                          key={item.id}
                          className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-background"
                          style={{ zIndex: 3 - idx }}
                        >
                          {item.product.media[0] ? (
                            <img
                              src={item.product.media[0].thumbnailUrl || item.product.media[0].url}
                              alt={item.productName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-muted">
                              <Icons.package className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Order #{order.orderNumber}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatPrice(order.total)}</p>
                      <Badge variant="secondary" className="mt-1">
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/account/orders">
                <Icons.package className="mr-2 h-4 w-4" />
                Track Orders
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/account/addresses">
                <Icons.mapPin className="mr-2 h-4 w-4" />
                Manage Addresses
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/account/payment-methods">
                <Icons.creditCard className="mr-2 h-4 w-4" />
                Payment Methods
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/account/style-profile">
                <Icons.sparkles className="mr-2 h-4 w-4" />
                Update Style Profile
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/support">
                <Icons.helpCircle className="mr-2 h-4 w-4" />
                Get Support
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recently Viewed */}
      {dashboardData.recentlyViewed.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recently Viewed</CardTitle>
                <CardDescription>
                  Continue where you left off
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/products">
                  Browse all
                  <Icons.arrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
              {dashboardData.recentlyViewed.map((view) => (
                <Link
                  key={view.id}
                  href={`/products/${view.product.slug}`}
                  className="group space-y-2"
                >
                  <div className="aspect-square overflow-hidden rounded-md bg-muted">
                    {view.product.media[0] ? (
                      <img
                        src={view.product.media[0].thumbnailUrl || view.product.media[0].url}
                        alt={view.product.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Icons.package className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium line-clamp-1 group-hover:underline">
                      {view.product.name}
                    </p>
                    <p className="text-sm font-medium">{formatPrice(view.product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
