import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getServerAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { formatDate } from '@/lib/utils'
import { EditReviewDialog } from '@/components/features/edit-review-dialog'
import { DeleteReviewDialog } from '@/components/features/delete-review-dialog'

async function getUserReviews(userId: string) {
  return await prisma.review.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          media: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      },
      orderItem: {
        include: {
          order: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

async function getPendingReviews(userId: string) {
  // Get delivered orders with unreviewed items
  const deliveredOrders = await prisma.order.findMany({
    where: {
      userId,
      status: 'DELIVERED',
      deliveredAt: {
        gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
      },
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
            },
          },
          reviews: true,
        },
      },
    },
  })

  // Filter items without reviews
  const pendingItems = deliveredOrders.flatMap(order =>
    order.items
      .filter(item => item.reviews.length === 0)
      .map(item => ({
        ...item,
        order,
      }))
  )

  return pendingItems
}

export default async function ReviewsPage() {
  const session = await getServerAuthSession()
  
  if (!session) {
    redirect('/login?callbackUrl=/account/reviews')
  }

  const [reviews, pendingReviews] = await Promise.all([
    getUserReviews(session.user.id),
    getPendingReviews(session.user.id),
  ])

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    FLAGGED: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
  } as const

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Reviews</h1>
        <p className="text-muted-foreground">
          Share your experiences with products you've purchased
        </p>
      </div>

      {/* Pending Reviews */}
      {pendingReviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Awaiting Your Review</CardTitle>
            <CardDescription>
              Help others by reviewing your recent purchases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingReviews.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-md bg-muted">
                    {item.product.media[0] ? (
                      <img
                        src={item.product.media[0].thumbnailUrl || item.product.media[0].url}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Icons.package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium line-clamp-1">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      Delivered {formatDate(item.order.deliveredAt!)}
                    </p>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/products/${item.product.slug}#write-review`}>
                      Write Review
                    </Link>
                  </Button>
                </div>
              ))}
              {pendingReviews.length > 3 && (
                <p className="text-center text-sm text-muted-foreground">
                  And {pendingReviews.length - 3} more items awaiting review
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* User's Reviews */}
      {reviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Icons.star className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No reviews yet</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Once you review products, they'll appear here
            </p>
            {pendingReviews.length === 0 && (
              <Button className="mt-6" asChild>
                <Link href="/account/orders">View Orders</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-md bg-muted">
                      {review.product.media[0] ? (
                        <img
                          src={review.product.media[0].thumbnailUrl || review.product.media[0].url}
                          alt={review.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Icons.package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Link
                        href={`/products/${review.product.slug}`}
                        className="font-medium hover:underline"
                      >
                        {review.product.name}
                      </Link>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Icons.star
                              key={i}
                              className={cn(
                                'h-4 w-4',
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted-foreground'
                              )}
                            />
                          ))}
                        </div>
                        <Badge variant="secondary" className={cn('border-0', statusColors[review.status])}>
                          {review.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <EditReviewDialog review={review} />
                    <DeleteReviewDialog reviewId={review.id} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {review.title && (
                  <h4 className="font-medium">{review.title}</h4>
                )}
                {review.content && (
                  <p className="text-sm text-muted-foreground">{review.content}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{formatDate(review.createdAt)}</span>
                  {review.isVerifiedPurchase && (
                    <div className="flex items-center gap-1">
                      <Icons.checkCircle className="h-3 w-3" />
                      <span>Verified Purchase</span>
                    </div>
                  )}
                  {review.helpfulCount > 0 && (
                    <span>{review.helpfulCount} found helpful</span>
                  )}
                </div>
                {review.mediaUrls.length > 0 && (
                  <div className="flex gap-2">
                    {review.mediaUrls.map((url, idx) => (
                      <div
                        key={idx}
                        className="h-20 w-20 overflow-hidden rounded-md bg-muted"
                      >
                        <img
                          src={url}
                          alt={`Review image ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
