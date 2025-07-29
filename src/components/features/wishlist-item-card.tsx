'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart.store'
import { api } from '@/lib/api'
import { toast } from '@/hooks/use-toast'

interface WishlistItemCardProps {
  item: any // Replace with proper type
  wishlistId: string
}

export function WishlistItemCard({ item, wishlistId }: WishlistItemCardProps) {
  const [isRemoving, setIsRemoving] = useState(false)
  const { addItem } = useCartStore()
  const utils = api.useContext()

  const handleRemove = async () => {
    setIsRemoving(true)
    try {
      await api.wishlist.removeItem.mutate({
        wishlistId,
        itemId: item.id,
      })
      
      await utils.wishlist.getItems.invalidate()
      
      toast({
        title: 'Removed from wishlist',
        description: `${item.product.name} has been removed from your wishlist.`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove item from wishlist.',
        variant: 'destructive',
      })
    } finally {
      setIsRemoving(false)
    }
  }

  const handleAddToCart = () => {
    const variant = item.variant || item.product.variants[0]
    if (variant && variant.inventoryQuantity > 0) {
      addItem({
        ...item.product,
        selectedVariant: variant,
      })
      toast({
        title: 'Added to cart',
        description: `${item.product.name} has been added to your cart.`,
      })
    }
  }

  const isInStock = item.variant 
    ? item.variant.inventoryQuantity > 0
    : item.product.variants.some((v: any) => v.inventoryQuantity > 0)

  const currentPrice = item.variant?.price || item.product.price
  const comparePrice = item.product.compareAtPrice
  const isOnSale = comparePrice && comparePrice > currentPrice

  return (
    <Card className="group overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link href={`/products/${item.product.slug}`}>
          {item.product.media[0] ? (
            <img
              src={item.product.media[0].url}
              alt={item.product.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Icons.package className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </Link>
        <Button
          size="icon"
          variant="secondary"
          className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={handleRemove}
          disabled={isRemoving}
        >
          {isRemoving ? (
            <Icons.spinner className="h-4 w-4 animate-spin" />
          ) : (
            <Icons.x className="h-4 w-4" />
          )}
        </Button>
        {isOnSale && (
          <Badge className="absolute left-2 top-2" variant="destructive">
            Sale
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div>
            <Link
              href={`/products/${item.product.slug}`}
              className="font-medium hover:underline line-clamp-2"
            >
              {item.product.name}
            </Link>
            {item.product.brand && (
              <p className="text-sm text-muted-foreground">
                {item.product.brand.name}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="font-semibold">{formatPrice(currentPrice)}</p>
            {isOnSale && (
              <p className="text-sm text-muted-foreground line-through">
                {formatPrice(comparePrice)}
              </p>
            )}
          </div>
          {item.variant && (
            <p className="text-sm text-muted-foreground">
              {item.variant.size && `Size: ${item.variant.size}`}
              {item.variant.color && ` • Color: ${item.variant.color}`}
            </p>
          )}
          <div className="flex items-center justify-between pt-2">
            <Badge variant={isInStock ? 'secondary' : 'outline'}>
              {isInStock ? 'In Stock' : 'Out of Stock'}
            </Badge>
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={!isInStock}
            >
              <Icons.shoppingBag className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
