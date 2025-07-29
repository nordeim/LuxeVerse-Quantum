// src/app/(shop)/products/[slug]/product-detail-client.tsx
'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { Product, ProductVariant, Review } from '@prisma/client'
import { api } from '@/lib/api'
import { useCartStore } from '@/store/cart.store'
import { useWishlistStore } from '@/store/wishlist.store'
import { useRecentlyViewedStore } from '@/store/recently-viewed.store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Icons } from '@/components/ui/icons'
import { ProductImageGallery } from '@/components/features/products/product-image-gallery'
import { ProductReviews } from '@/components/features/products/product-reviews'
import { SizeGuide } from '@/components/features/products/size-guide'
import { ShareDialog } from '@/components/features/products/share-dialog'
import { ProductCard } from '@/components/features/products/product-card'
import { AIStyleAdvisor } from '@/components/features/ai/ai-style-advisor'
import { ARTryOn } from '@/components/features/ar/ar-try-on'
import { formatPrice, cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ProductDetailClientProps {
  product: Product & {
    category: any
    brand: any
    media: any[]
    variants: ProductVariant[]
    reviews: Review[]
    collections: any[]
    sizeChart: any
    rating: number
    reviewCount: number
    purchaseCount: number
    wishlistCount: number
  }
  relatedProducts: any[]
}

export function ProductDetailClient({ 
  product, 
  relatedProducts 
}: ProductDetailClientProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants[0] || null
  )
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [showARTryOn, setShowARTryOn] = useState(false)
  const [showAIAdvisor, setShowAIAdvisor] = useState(false)
  
  const addToCart = useCartStore((state) => state.addItem)
  const toggleWishlist = useWishlistStore((state) => state.toggleItem)
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id))
  const addToRecentlyViewed = useRecentlyViewedStore((state) => state.addItem)

  // Track product view
  useEffect(() => {
    addToRecentlyViewed(product)
  }, [product, addToRecentlyViewed])

  // Calculate discount
  const currentPrice = selectedVariant?.price || product.price
  const comparePrice = selectedVariant?.compareAtPrice || product.compareAtPrice
  const discountPercentage = comparePrice
    ? Math.round(((comparePrice.toNumber() - currentPrice.toNumber()) / comparePrice.toNumber()) * 100)
    : 0

  // Check availability
  const isInStock = selectedVariant
    ? selectedVariant.inventoryQuantity > 0
    : product.variants.some(v => v.inventoryQuantity > 0)

  const maxQuantity = selectedVariant?.inventoryQuantity || 10

  // Handle add to cart
  const handleAddToCart = useCallback(async () => {
    if (!selectedVariant) {
      toast.error('Please select a variant')
      return
    }

    setIsLoading(true)
    try {
      addToCart({
        productId: product.id,
        variantId: selectedVariant.id,
        quantity,
        price: currentPrice.toNumber(),
      })
      
      toast.success('Added to cart', {
        description: `${product.name} (${selectedVariant.size})`,
        action: {
          label: 'View Cart',
          onClick: () => useCartStore.getState().openCart(),
        },
      })
    } catch (error) {
      toast.error('Failed to add to cart')
    } finally {
      setIsLoading(false)
    }
  }, [selectedVariant, quantity, addToCart, product, currentPrice])

  // Handle buy now
  const handleBuyNow = useCallback(async () => {
    await handleAddToCart()
    router.push('/checkout')
  }, [handleAddToCart, router])

  // Handle wishlist
  const handleWishlistToggle = useCallback(() => {
    toggleWishlist(product.id, selectedVariant?.id)
    
    if (isInWishlist) {
      toast.success('Removed from wishlist')
    } else {
      toast.success('Added to wishlist', {
        description: product.name,
      })
    }
  }, [toggleWishlist, product, selectedVariant, isInWishlist])

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="container py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground">Home</a>
          <Icons.chevronRight className="h-4 w-4" />
          <a href="/products" className="hover:text-foreground">Products</a>
          <Icons.chevronRight className="h-4 w-4" />
          <a href={`/products?category=${product.category.slug}`} className="hover:text-foreground">
            {product.category.name}
          </a>
          <Icons.chevronRight className="h-4 w-4" />
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="container pb-16">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Images */}
          <div className="relative">
            <ProductImageGallery
              images={product.media}
              productName={product.name}
              has360View={product.media.some(m => m.is360Image)}
              hasARView={product.arEnabled}
              onARClick={() => setShowARTryOn(true)}
            />
            
            {/* Badges */}
            <div className="absolute left-4 top-4 flex flex-col gap-2">
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
              {product.recyclable && (
                <Badge className="bg-green-600 text-white">
                  <Icons.leaf className="mr-1 h-3 w-3" />
                  Sustainable
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Header */}
            <div>
              {product.brand && (
                <div className="flex items-center gap-2">
                  <a 
                    href={`/products?brand=${product.brand.id}`}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    {product.brand.name}
                  </a>
                  {product.brand.isVerified && (
                    <Icons.verified className="h-4 w-4 text-blue-500" />
                  )}
                </div>
              )}
              
              <h1 className="mt-2 text-3xl font-bold tracking-tight lg:text-4xl">
                {product.name}
              </h1>
              
              {/* Rating */}
              {product.rating > 0 && (
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Icons.star
                          key={i}
                          className={cn(
                            'h-5 w-5',
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          )}
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-medium">{product.rating.toFixed(1)}</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'}
                  </button>
                  <span className="text-sm text-muted-foreground">
                    {product.purchaseCount} sold
                  </span>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold">
                {formatPrice(currentPrice.toNumber())}
              </span>
              {comparePrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(comparePrice.toNumber())}
                </span>
              )}
            </div>

            {/* Variants */}
            {product.variants.length > 0 && (
              <div className="mt-6 space-y-4">
                {/* Size selector */}
                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Size</Label>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => setShowSizeGuide(true)}
                      className="h-auto p-0"
                    >
                      <Icons.ruler className="mr-1 h-3 w-3" />
                      Size Guide
                    </Button>
                  </div>
                  <RadioGroup
                    value={selectedVariant?.id}
                    onValueChange={(value) => {
                      const variant = product.variants.find(v => v.id === value)
                      setSelectedVariant(variant || null)
                    }}
                    className="mt-3 flex flex-wrap gap-3"
                  >
                    {product.variants.map((variant) => (
                      <div key={variant.id}>
                        <RadioGroupItem
                          value={variant.id}
                          id={variant.id}
                          className="peer sr-only"
                          disabled={variant.inventoryQuantity === 0}
                        />
                        <Label
                          htmlFor={variant.id}
                          className={cn(
                            'flex cursor-pointer items-center justify-center rounded-md border-2 px-4 py-2 text-sm font-medium transition-all',
                            'hover:border-primary',
                            'peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground',
                            variant.inventoryQuantity === 0 && 'cursor-not-allowed opacity-50'
                          )}
                        >
                          {variant.size}
                          {variant.inventoryQuantity === 0 && (
                            <span className="ml-2 text-xs">(Out of stock)</span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Color selector if applicable */}
                {/* Add color variant selector here if needed */}
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6">
              <Label className="text-base font-medium">Quantity</Label>
              <div className="mt-3 flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Icons.minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  disabled={quantity >= maxQuantity}
                >
                  <Icons.plus className="h-4 w-4" />
                </Button>
                {selectedVariant && selectedVariant.inventoryQuantity <= 5 && (
                  <span className="text-sm text-orange-600">
                    Only {selectedVariant.inventoryQuantity} left in stock
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3">
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!isInStock || !selectedVariant || isLoading}
                >
                  {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Icons.shoppingBag className="mr-2 h-4 w-4" />
                  )}
                  {isInStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button
                  size="lg"
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
                <ShareDialog product={product} />
              </div>
              
              <Button
                size="lg"
                variant="secondary"
                className="w-full"
                onClick={handleBuyNow}
                disabled={!isInStock || !selectedVariant || isLoading}
              >
                Buy Now
              </Button>

              {/* AI Features */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAIAdvisor(true)}
                >
                  <Icons.sparkles className="mr-2 h-4 w-4" />
                  AI Style Advisor
                </Button>
                {product.arEnabled && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowARTryOn(true)}
                  >
                    <Icons.camera className="mr-2 h-4 w-4" />
                    AR Try-On
                  </Button>
                )}
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Icons.truck className="h-5 w-5 text-muted-foreground" />
                <span>Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Icons.shield className="h-5 w-5 text-muted-foreground" />
                <span>Authenticity guaranteed</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Icons.refresh className="h-5 w-5 text-muted-foreground" />
                <span>30-day returns</span>
              </div>
              {product.carbonFootprint && (
                <div className="flex items-center gap-3 text-sm">
                  <Icons.leaf className="h-5 w-5 text-green-600" />
                  <span>Carbon neutral shipping</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({product.reviewCount})
              </TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div className="prose prose-gray max-w-none">
                <p className="text-lg leading-relaxed">{product.description}</p>
                {product.story && (
                  <>
                    <h3 className="mt-8 text-xl font-semibold">The Story</h3>
                    <p className="leading-relaxed">{product.story}</p>
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="mt-6">
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="font-medium text-muted-foreground">SKU</dt>
                  <dd className="mt-1">{product.sku}</dd>
                </div>
                {product.brand && (
                  <div>
                    <dt className="font-medium text-muted-foreground">Brand</dt>
                    <dd className="mt-1">{product.brand.name}</dd>
                  </div>
                )}
                <div>
                  <dt className="font-medium text-muted-foreground">Category</dt>
                  <dd className="mt-1">{product.category.name}</dd>
                </div>
                {product.materials && (
                  <div>
                    <dt className="font-medium text-muted-foreground">Materials</dt>
                    <dd className="mt-1">
                      {/* Parse and display materials from JSON */}
                      Premium materials
                    </dd>
                  </div>
                )}
                {product.carbonFootprint && (
                  <div>
                    <dt className="font-medium text-muted-foreground">Carbon Footprint</dt>
                    <dd className="mt-1">{product.carbonFootprint} kg CO2</dd>
                  </div>
                )}
                {product.styleTags.length > 0 && (
                  <div className="sm:col-span-2">
                    <dt className="font-medium text-muted-foreground">Style Tags</dt>
                    <dd className="mt-2 flex flex-wrap gap-2">
                      {product.styleTags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <ProductReviews
                productId={product.id}
                reviews={product.reviews}
                rating={product.rating}
                reviewCount={product.reviewCount}
              />
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Shipping Options</h3>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <li>• Standard Shipping (5-7 business days): $10</li>
                    <li>• Express Shipping (2-3 business days): $25</li>
                    <li>• Next Day Delivery: $40</li>
                    <li>• Free shipping on orders over $100</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium">Returns & Exchanges</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We accept returns within 30 days of delivery. Items must be unworn, 
                    unwashed, and in original condition with all tags attached.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold">You May Also Like</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showSizeGuide && (
          <SizeGuide
            category={product.category.slug}
            sizeChart={product.sizeChart}
            onClose={() => setShowSizeGuide(false)}
          />
        )}
        
        {showARTryOn && product.arEnabled && (
          <ARTryOn
            product={product}
            variant={selectedVariant}
            onClose={() => setShowARTryOn(false)}
          />
        )}
        
        {showAIAdvisor && (
          <AIStyleAdvisor
            product={product}
            onClose={() => setShowAIAdvisor(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
