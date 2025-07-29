import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getServerAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { formatPrice } from '@/lib/utils'
import { WishlistItemCard } from '@/components/features/wishlist-item-card'
import { ShareWishlistDialog } from '@/components/features/share-wishlist-dialog'

async function getWishlist(userId: string) {
  const wishlist = await prisma.wishlist.findFirst({
    where: { userId },
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
              variants: {
                where: { isAvailable: true },
                orderBy: { price: 'asc' },
                take: 1,
              },
            },
          },
          variant: true,
        },
        orderBy: { addedAt: 'desc' },
      },
    },
  })

  // Create default wishlist if it doesn't exist
  if (!wishlist) {
    return await prisma.wishlist.create({
      data: {
        userId,
        name: 'My Wishlist',
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                media: true,
                brand: true,
                variants: true,
              },
            },
            variant: true,
          },
        },
      },
    })
  }

  return wishlist
}

export default async function WishlistPage() {
  const session = await getServerAuthSession()
  
  if (!session) {
    redirect('/login?callbackUrl=/account/wishlist')
  }

  const wishlist = await getWishlist(session.user.id)

  // Calculate stats
  const totalValue = wishlist.items.reduce((sum, item) => {
    const price = item.variant?.price || item.product.price
    return sum + Number(price)
  }, 0)

  const itemsInStock = wishlist.items.filter(item => {
    const variant = item.variant || item.product.variants[0]
    return variant && variant.inventoryQuantity > 0
  }).length

  const itemsOnSale = wishlist.items.filter(item => 
    item.product.compareAtPrice && item.product.compareAtPrice > item.product.price
  ).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
          <p className="text-muted-foreground">
            Save items for later and track price changes
          </p>
        </div>
        <ShareWishlistDialog wishlist={wishlist} />
      </div>

      {/* Wishlist Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Icons.heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wishlist.items.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Icons.dollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalValue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <Icons.checkCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itemsInStock}</div>
            <p className="text-xs text-muted-foreground">
              Ready to purchase
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Sale</CardTitle>
            <Icons.tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itemsOnSale}</div>
            <p className="text-xs text-muted-foreground">
              Price reduced
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Wishlist Items */}
      {wishlist.items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Icons.heart className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Your wishlist is empty</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Save items you love to purchase later
            </p>
            <Button className="mt-6" asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {wishlist.items.length} {wishlist.items.length === 1 ? 'item' : 'items'} saved
            </p>
            <Button variant="outline" size="sm">
              <Icons.shoppingBag className="mr-2 h-4 w-4" />
              Add All to Cart
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wishlist.items.map((item) => (
              <WishlistItemCard
                key={item.id}
                item={item}
                wishlistId={wishlist.id}
              />
            ))}
          </div>
        </>
      )}

      {/* Recommendations */}
      {wishlist.items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>You Might Also Like</CardTitle>
            <CardDescription>
              Based on items in your wishlist
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Add AI recommendations component here */}
            <p className="text-sm text-muted-foreground">
              Recommendations coming soon...
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
