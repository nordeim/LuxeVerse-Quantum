// src/components/features/products/product-card.tsx
'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Product } from '@prisma/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { useCartStore } from '@/store/cart.store'
import { useWishlistStore } from '@/store/wishlist.store'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ProductCardProps {
  product: Product & {
    category: {
      id: string
      name: string
      slug: string
    }
    brand?: {
      id: string
      name: string
      slug: string
      isVerified: boolean
    } | null
    media: Array<{
      url: string
      altText: string | null
    }>
    rating?: number
    reviewCount?: number
    wishlistCount?: number
  }
  viewMode?: 'grid' | 'list'
  priority?: boolean
  className?: string
}

export function ProductCard({ 
  product, 
  viewMode = 'grid', 
  priority = false,
  className 
}: ProductCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  
  const addToCart = useCartStore((state) => state.addItem)
  const toggleWishlist = useWishlistStore((state) => state.toggleItem)
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id))

  // Calculate discount percentage
  const discountPercentage = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice.toNumber() - product.price.toNumber()) /
          product.compareAtPrice.toNumber()) *
          100
      )
    : 0

  // Handle quick add to cart
  const handleQuickAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      
      // Add to cart with default variant
      addToCart({
        productId: product.id,
        quantity: 1,
        price: product.price.toNumber(),
      })
      
      toast.success('Added to cart', {
        description: product.name,
        action: {
          label: 'View Cart',
          onClick: () => {
            // Open cart drawer
            useCartStore.getState().openCart()
          },
        },
      })
    },
    [addToCart, product]
  )

  // Handle wishlist toggle
  const handleWishlistToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      
      toggleWishlist(product.id)
      
      if (isInWishlist) {
        toast.success('Removed from wishlist')
      } else {
        toast.success('Added to wishlist', {
          description: product.name,
        })
      }
    },
    [toggleWishlist, product, isInWishlist]
  )

  // Image cycling on hover
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (product.media.length <= 1) return
      
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const width = rect.width
      const percentage = x / width
      const index = Math.floor(percentage * product.media.length)
      
      setCurrentImageIndex(Math.min(index, product.media.length - 1))
    },
    [product.media.length]
  )

  const handleMouseLeave = useCallback(() => {
    setCurrentImageIndex(0)
  }, [])

  // List view layout
  if (viewMode === 'list') {
    return (
      <Card className={cn('group overflow-hidden', className)}>
        <Link href={`/products/${product.slug}`} className="flex gap-6 p-4">
          <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg">
            <Image
              src={product.media[0]?.url || '/placeholder.png'}
              alt={product.media[0]?.altText || product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="128px"
            />
            {discountPercentage > 0 && (
              <Badge className="absolute left-2 top-2 bg-red-500">
                -{discountPercentage}%
              </Badge>
            )}
          </div>
          
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {product.brand?.name || product.category.name}
                  </p>
                  <h3 className="mt-1 font-medium">{product.name}</h3>
                  {product.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {product.description}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      {formatPrice(product.price.toNumber())}
                    </p>
                    {product.compareAtPrice && (
                      <p className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.compareAtPrice.toNumber())}
                      </p>
                    )}
                  </div>
                  
                  {product.rating && product.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Icons.star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{product.rating.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">
                        ({product.reviewCount})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleQuickAddToCart}
                className="flex-1"
              >
                <Icons.shoppingBag className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleWishlistToggle}
              >
                <Icons.heart
                  className={cn(
                    'h-4 w-4',
                    isInWishlist && 'fill-current text-red-500'
                  )}
                />
              </Button>
            </div>
          </div>
        </Link>
      </Card>
    )
  }

  // Grid view layout (default)
  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-300 hover:shadow-xl',
        className
      )}
    >
      <Link href={`/products/${product.slug}`}>
        {/* Image Container */}
        <div
          className="relative aspect-[3/4] overflow-hidden bg-gray-100"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <Image
            src={product.media[currentImageIndex]?.url || '/placeholder.png'}
            alt={product.media[currentImageIndex]?.altText || product.name}
            fill
            className={cn(
              'object-cover transition-all duration-500',
              isImageLoading ? 'blur-lg' : 'blur-0',
              'group-hover:scale-105'
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            onLoad={() => setIsImageLoading(false)}
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {discountPercentage > 0 && (
              <Badge className="bg-red-500 text-white">
                -{discountPercentage}%
              </Badge>
            )}
            {product.isExclusive && (
              <Badge className="bg-luxury-gold text-luxury-obsidian">
                Exclusive
              </Badge>
            )}
            {product.isLimitedEdition && (
              <Badge variant="outline" className="border-white bg-black/50 text-white">
                Limited Edition
              </Badge>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <Button
              size="sm"
              className="flex-1 bg-white text-black hover:bg-gray-100"
              onClick={handleQuickAddToCart}
            >
              <Icons.shoppingBag className="mr-2 h-4 w-4" />
              Quick Add
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="bg-white text-black hover:bg-gray-100"
              onClick={handleWishlistToggle}
            >
              <Icons.heart
                className={cn(
                  'h-4 w-4',
                  isInWishlist && 'fill-current text-red-500'
                )}
              />
            </Button>
          </div>
          
          {/* Image dots indicator */}
          {product.media.length > 1 && (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              {product.media.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'h-1 w-1 rounded-full bg-white transition-all',
                    index === currentImageIndex ? 'w-4' : 'opacity-50'
                  )}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          {/* Brand/Category */}
          <p className="text-xs text-muted-foreground">
            {product.brand?.name || product.category.name}
            {product.brand?.isVerified && (
              <Icons.verified className="ml-1 inline h-3 w-3 text-blue-500" />
            )}
          </p>
          
          {/* Product Name */}
          <h3 className="mt-1 line-clamp-2 text-sm font-medium transition-colors group-hover:text-primary">
            {product.name}
          </h3>
          
          {/* Rating */}
          {product.rating && product.rating > 0 && (
            <div className="mt-2 flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Icons.star
                    key={i}
                    className={cn(
                      'h-3 w-3',
                      i < Math.floor(product.rating!)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount})
              </span>
            </div>
          )}
          
          {/* Price */}
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-lg font-semibold">
              {formatPrice(product.price.toNumber())}
            </p>
            {product.compareAtPrice && (
              <p className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice.toNumber())}
              </p>
            )}
          </div>
          
          {/* Additional Info */}
          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            {product.wishlistCount && product.wishlistCount > 0 && (
              <span className="flex items-center gap-1">
                <Icons.heart className="h-3 w-3" />
                {product.wishlistCount}
              </span>
            )}
            {product.recyclable && (
              <span className="flex items-center gap-1">
                <Icons.leaf className="h-3 w-3 text-green-600" />
                Sustainable
              </span>
            )}
          </div>
        </div>
      </Link>
    </Card>
  )
}
