// src/components/features/cart/cart-item-card.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CartItem, useCartActions } from '@/store/cart.store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { formatPrice, cn } from '@/lib/utils'
import { toast } from 'sonner'

interface CartItemCardProps {
  item: CartItem
  showDetails?: boolean
  editable?: boolean
}

export function CartItemCard({ 
  item, 
  showDetails = true,
  editable = true 
}: CartItemCardProps) {
  const { updateQuantity, removeItem } = useCartActions()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  
  // Calculate savings
  const savings = item.compareAtPrice 
    ? (item.compareAtPrice - item.price) * item.quantity
    : 0
  
  const handleQuantityChange = async (newQuantity: string) => {
    const quantity = parseInt(newQuantity, 10)
    if (isNaN(quantity) || quantity < 1) return
    
    setIsUpdating(true)
    try {
      await updateQuantity(item.id, quantity)
    } finally {
      setIsUpdating(false)
    }
  }
  
  const handleRemove = async () => {
    setIsRemoving(true)
    try {
      await removeItem(item.id)
    } finally {
      setIsRemoving(false)
    }
  }
  
  return (
    <motion.div
      className={cn(
        'group relative overflow-hidden rounded-lg border bg-card',
        isRemoving && 'opacity-50'
      )}
      whileHover={{ scale: editable ? 1.01 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex gap-4 p-4">
        {/* Product Image */}
        <Link
          href={`/products/${item.product.slug}`}
          className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100"
        >
          <Image
            src={item.product.media?.[0]?.url || '/placeholder.png'}
            alt={item.product.media?.[0]?.altText || item.product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="96px"
          />
          {savings > 0 && (
            <Badge className="absolute right-1 top-1 bg-red-500 text-white">
              Sale
            </Badge>
          )}
        </Link>
        
        {/* Product Details */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <Link
              href={`/products/${item.product.slug}`}
              className="line-clamp-2 text-sm font-medium hover:underline"
            >
              {item.product.name}
            </Link>
            
            {showDetails && (
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                {item.variant?.size && (
                  <span>Size: {item.variant.size}</span>
                )}
                {item.variant?.color && (
                  <span>Color: {item.variant.color}</span>
                )}
                {item.personalizations && Object.entries(item.personalizations).map(([key, value]) => (
                  <span key={key}>
                    {key}: {value}
                  </span>
                ))}
              </div>
            )}
            
            {/* Price */}
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-sm font-medium">
                {formatPrice(item.price)}
              </span>
              {item.compareAtPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(item.compareAtPrice)}
                </span>
              )}
            </div>
          </div>
          
          {/* Quantity and Actions */}
          {editable ? (
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Select
                  value={item.quantity.toString()}
                  onValueChange={handleQuantityChange}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="h-8 w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(10)].map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  disabled={isRemoving}
                >
                  {isRemoving ? (
                    <Icons.spinner className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icons.trash className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-medium">
                  {formatPrice(item.price * item.quantity)}
                </p>
                {savings > 0 && (
                  <p className="text-xs text-green-600">
                    Save {formatPrice(savings)}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Qty: {item.quantity}
              </span>
              <span className="text-sm font-medium">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Loading overlay */}
      {(isUpdating || isRemoving) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-background/50"
        >
          <Icons.spinner className="h-6 w-6 animate-spin" />
        </motion.div>
      )}
    </motion.div>
  )
}
