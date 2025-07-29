// src/components/features/cart/cart-drawer.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Icons } from '@/components/ui/icons'
import { useCartStore, useCartItems, useCartTotal, useIsCartOpen, useCartActions } from '@/store/cart.store'
import { formatPrice, cn } from '@/lib/utils'
import { CartItemCard } from './cart-item-card'
import { CartRecommendations } from './cart-recommendations'
import { toast } from 'sonner'

export function CartDrawer() {
  const router = useRouter()
  const items = useCartItems()
  const total = useCartTotal()
  const isOpen = useIsCartOpen()
  const { closeCart } = useCartActions()
  const {
    subtotal,
    discountAmount,
    taxAmount,
    shippingAmount,
    freeShippingThreshold,
    isEligibleForFreeShipping,
    applyDiscount,
    isLoading,
  } = useCartStore()
  
  const [discountCode, setDiscountCode] = useState('')
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false)
  
  // Calculate progress to free shipping
  const freeShippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100)
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal)
  
  // Handle discount code submission
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return
    
    setIsApplyingDiscount(true)
    try {
      await applyDiscount(discountCode.trim())
      setDiscountCode('')
    } catch (error) {
      // Error handled in store
    } finally {
      setIsApplyingDiscount(false)
    }
  }
  
  // Handle checkout navigation
  const handleCheckout = async () => {
    const isStockValid = await useCartStore.getState().validateStock()
    
    if (!isStockValid) {
      toast.error('Some items are out of stock', {
        description: 'Please review your cart before proceeding',
      })
      return
    }
    
    closeCart()
    router.push('/checkout')
  }
  
  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent 
        className="flex w-full flex-col sm:max-w-lg"
        side="right"
      >
        <SheetHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold">Shopping Cart</SheetTitle>
            <Badge variant="secondary" className="ml-2">
              {items.reduce((sum, item) => sum + item.quantity, 0)} items
            </Badge>
          </div>
          
          {/* Free Shipping Progress */}
          {!isEligibleForFreeShipping() && subtotal > 0 && (
            <div className="space-y-2 rounded-lg bg-secondary/50 p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Icons.truck className="h-4 w-4" />
                  Free shipping
                </span>
                <span className="font-medium">
                  {formatPrice(freeShippingRemaining)} away
                </span>
              </div>
              <Progress value={freeShippingProgress} className="h-2" />
            </div>
          )}
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center space-y-4">
            <div className="relative h-32 w-32">
              <Icons.shoppingBag className="h-full w-full text-muted-foreground/20" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Add some luxury items to get started
              </p>
            </div>
            <Button asChild className="mt-4">
              <Link href="/products" onClick={closeCart}>
                Continue Shopping
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                      }}
                    >
                      <CartItemCard item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              {/* Cart Recommendations */}
              <div className="border-t pt-6">
                <CartRecommendations />
              </div>
            </ScrollArea>

            <div className="space-y-4 border-t pt-6">
              {/* Discount Code */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Discount code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyDiscount()}
                    disabled={isApplyingDiscount}
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyDiscount}
                    disabled={!discountCode.trim() || isApplyingDiscount}
                  >
                    {isApplyingDiscount ? (
                      <Icons.spinner className="h-4 w-4 animate-spin" />
                    ) : (
                      'Apply'
                    )}
                  </Button>
                </div>
                
                {/* Applied Discounts */}
                {useCartStore.getState().discounts.length > 0 && (
                  <div className="space-y-1">
                    {useCartStore.getState().discounts.map((discount) => (
                      <div
                        key={discount.code}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="flex items-center gap-2">
                          <Icons.tag className="h-3 w-3" />
                          {discount.code}
                        </span>
                        <button
                          onClick={() => useCartStore.getState().removeDiscount(discount.code)}
                          className="text-destructive hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <Separator />
              
              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Icons.tag className="h-3 w-3" />
                      Discount
                    </span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatPrice(taxAmount)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {shippingAmount === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      formatPrice(shippingAmount)
                    )}
                  </span>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between text-base font-medium">
                  <span>Total</span>
                  <span className="text-lg">{formatPrice(total)}</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="space-y-2">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isLoading || items.length === 0}
                >
                  {isLoading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Checkout
                      <Icons.arrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={closeCart}
                >
                  Continue Shopping
                </Button>
                
                {/* Security Badges */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <Icons.shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Secure Checkout
                  </span>
                  <Icons.lock className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
