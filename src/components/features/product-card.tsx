// src/components/features/product-card.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Eye, Star, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-session'
import type { RouterOutputs } from '@/lib/api'

type Product = RouterOutputs['product']['getAll']['items'][0]

interface ProductCardProps {
  product: Product
  className?: string
  showQuickActions?: boolean
  showBrand?: boolean
  showRating?: boolean
  showAITags?: boolean
  priority?: boolean
}

export function ProductCard({
  product,
  className,
  showQuickActions = true,
  showBrand = true,
  showRating = true,
  showAITags = true,
  priority = false,
}: ProductCardProps) {
  const { isAuthenticated } = useAuth()
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // Get primary image
  const primaryImage = product.media.find(media => media.isPrimary) || product.media[0]
  const hasMultipleImages = product.media.length > 1

  // Get price range from variants
  const prices = product.variants.map(v => v.price || product.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const priceRange = minPrice !== maxPrice

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: product.currency || 'USD',
    }).format(price)
  }

  // Handle wishlist toggle
  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      // Show login modal or redirect
      return
    }

    setIsWishlisted(!isWishlisted)
    // TODO: Call API to toggle wishlist
  }

  // Handle quick add to cart
  const handleQuickAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // TODO: Call API to add to cart with default variant
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("group relative", className)}
    >
      <Card 
        className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 bg-white/50 backdrop-blur-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Link href={`/products/${product.slug}`}>
            {primaryImage ? (
              <>
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.altText || product.name}
                  fill
                  className={cn(
                    "object-cover transition-all duration-700 group-hover:scale-110",
                    imageLoaded ? "opacity-100" : "opacity-0"
                  )}
                  priority={priority}
                  onLoad={() => setImageLoaded(true)}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Second image on hover */}
                {hasMultipleImages && (
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={product.media[1].url}
                          alt={product.media[1].altText || product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
          </Link>

          {/* Product Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <Badge variant="destructive" className="text-xs font-medium">
                Sale
              </Badge>
            )}
            {product.recyclable && (
              <Badge variant="secondary" className="text-xs font-medium bg-green-100 text-green-800">
                Eco
              </Badge>
            )}
            {product.brand?.isVerified && (
              <Badge variant="secondary" className="text-xs font-medium bg-blue-100 text-blue-800">
                ✓ Verified
              </Badge>
            )}
          </div>

          {/* AI Tags */}
          {showAITags && product.styleTags && product.styleTags.length > 0 && (
            <div className="absolute top-3 right-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1.5"
              >
                <Sparkles className="w-3 h-3 text-white" />
              </motion.div>
            </div>
          )}

          {/* Quick Actions */}
          {showQuickActions && (
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-3 left-3 right-3 flex gap-2"
                >
                  <Button
                    size="sm"
                    onClick={handleQuickAddToCart}
                    className="flex-1 bg-black hover:bg-gray-800 text-white"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Quick Add
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleWishlistToggle}
                    className={cn(
                      "bg-white/90 border-white/20",
                      isWishlisted && "bg-red-50 border-red-200 text-red-600"
                    )}
                  >
                    <Heart 
                      className={cn(
                        "w-4 h-4",
                        isWishlisted && "fill-current"
                      )} 
                    />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/90 border-white/20"
                    asChild
                  >
                    <Link href={`/products/${product.slug}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* View Count Indicator */}
          {product.viewCount > 100 && (
            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              {product.viewCount > 1000 
                ? `${Math.floor(product.viewCount / 1000)}k views`
                : `${product.viewCount} views`
              }
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Brand */}
          {showBrand && product.brand && (
            <div className="flex items-center gap-2">
              {product.brand.logoUrl && (
                <Image
                  src={product.brand.logoUrl}
                  alt={product.brand.name}
                  width={20}
                  height={20}
                  className="object-contain"
                />
              )}
              <span className="text-xs text-gray-600 font-medium uppercase tracking-wide">
                {product.brand.name}
              </span>
              {product.brand.isVerified && (
                <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
          )}

          {/* Product Name */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-gray-700 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          {showRating && product.averageRating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-3 h-3",
                      i < Math.floor(product.averageRating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">
                {product.averageRating.toFixed(1)} ({product.reviewCount})
              </span>
            </div>
          )}

          {/* AI Style Tags */}
          {showAITags && product.styleTags && product.styleTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.styleTags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0"
                >
                  {tag}
                </Badge>
              ))}
              {product.styleTags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.styleTags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Price */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-900">
                {priceRange 
                  ? `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
                  : formatPrice(product.price)
                }
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
            
            {/* Variants Info */}
            {product.variants.length > 1 && (
              <p className="text-xs text-gray-600">
                {product.variants.length} variants available
              </p>
            )}
            
            {/* Stock Status */}
            {product.variants.some(v => v.inventoryQuantity > 0) ? (
              <p className="text-xs text-green-600 font-medium">In Stock</p>
            ) : (
              <p className="text-xs text-red-600 font-medium">Out of Stock</p>
            )}
          </div>

          {/* Category */}
          <Link 
            href={`/products?category=${product.category.slug}`}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            {product.category.name}
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/**
 * Product Card Skeleton for loading states
 */
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
        <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2" />
      </div>
    </div>
  )
}
