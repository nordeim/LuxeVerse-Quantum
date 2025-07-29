// src/store/cart.store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { subscribeWithSelector } from 'zustand/middleware'
import { Product, ProductVariant } from '@prisma/client'
import { api } from '@/lib/api'
import { toast } from 'sonner'

export interface CartItem {
  id: string // Unique cart item ID
  productId: string
  variantId?: string
  product: Partial<Product> & {
    name: string
    slug: string
    media?: Array<{ url: string; altText?: string | null }>
  }
  variant?: Partial<ProductVariant> & {
    size?: string | null
    color?: string | null
  }
  quantity: number
  price: number
  compareAtPrice?: number
  personalizations?: Record<string, any>
  addedAt: Date
  metadata?: Record<string, any>
}

interface CartDiscount {
  code: string
  type: 'percentage' | 'fixed'
  value: number
  applicableToItems?: string[] // Item IDs
  minimumAmount?: number
  expiresAt?: Date
}

interface CartState {
  // State
  items: CartItem[]
  isOpen: boolean
  isLoading: boolean
  discounts: CartDiscount[]
  giftCards: string[]
  
  // Computed values
  subtotal: number
  discountAmount: number
  taxAmount: number
  shippingAmount: number
  total: number
  itemCount: number
  
  // Settings
  currency: string
  taxRate: number
  freeShippingThreshold: number
  
  // Session
  cartId?: string
  lastSynced?: Date
  
  // Actions
  addItem: (params: {
    productId: string
    variantId?: string
    quantity?: number
    price: number
    compareAtPrice?: number
    product: CartItem['product']
    variant?: CartItem['variant']
    personalizations?: Record<string, any>
    metadata?: Record<string, any>
  }) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  
  // Cart UI
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  
  // Discounts
  applyDiscount: (code: string) => Promise<void>
  removeDiscount: (code: string) => void
  applyGiftCard: (code: string) => Promise<void>
  removeGiftCard: (code: string) => void
  
  // Sync
  syncCart: () => Promise<void>
  mergeGuestCart: (userId: string) => Promise<void>
  
  // Calculations
  calculateTotals: () => void
  getItemSubtotal: (item: CartItem) => number
  getItemDiscount: (item: CartItem) => number
  isEligibleForFreeShipping: () => boolean
  
  // Utilities
  findItem: (productId: string, variantId?: string) => CartItem | undefined
  getItemCount: () => number
  validateStock: () => Promise<boolean>
  estimateDelivery: () => { min: Date; max: Date }
}

// Utility to generate cart item ID
const generateCartItemId = (productId: string, variantId?: string, personalizations?: Record<string, any>) => {
  const base = `${productId}-${variantId || 'default'}`
  if (personalizations && Object.keys(personalizations).length > 0) {
    const personalizationHash = JSON.stringify(personalizations)
    return `${base}-${Buffer.from(personalizationHash).toString('base64').slice(0, 8)}`
  }
  return base
}

// Create the store
export const useCartStore = create<CartState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial state
        items: [],
        isOpen: false,
        isLoading: false,
        discounts: [],
        giftCards: [],
        
        // Computed values (will be calculated)
        subtotal: 0,
        discountAmount: 0,
        taxAmount: 0,
        shippingAmount: 0,
        total: 0,
        itemCount: 0,
        
        // Settings
        currency: 'USD',
        taxRate: 0.08, // 8% default tax rate
        freeShippingThreshold: 100,
        
        // Actions
        addItem: async (params) => {
          set({ isLoading: true })
          
          try {
            const { 
              productId, 
              variantId, 
              quantity = 1, 
              price,
              compareAtPrice,
              product,
              variant,
              personalizations,
              metadata
            } = params
            
            const itemId = generateCartItemId(productId, variantId, personalizations)
            const existingItem = get().findItem(productId, variantId)
            
            if (existingItem && !personalizations) {
              // Update quantity if item exists and no personalizations
              await get().updateQuantity(existingItem.id, existingItem.quantity + quantity)
            } else {
              // Add new item
              const newItem: CartItem = {
                id: itemId,
                productId,
                variantId,
                product,
                variant,
                quantity,
                price,
                compareAtPrice,
                personalizations,
                addedAt: new Date(),
                metadata,
              }
              
              set(state => ({
                items: [...state.items, newItem],
              }))
              
              // Sync with server if user is logged in
              await get().syncCart()
              
              toast.success('Added to cart', {
                description: `${product.name} ${variant?.size ? `(${variant.size})` : ''}`,
                action: {
                  label: 'View Cart',
                  onClick: () => get().openCart(),
                },
              })
            }
            
            get().calculateTotals()
          } catch (error) {
            console.error('Failed to add item to cart:', error)
            toast.error('Failed to add item to cart')
          } finally {
            set({ isLoading: false })
          }
        },
        
        updateQuantity: async (itemId, quantity) => {
          if (quantity <= 0) {
            await get().removeItem(itemId)
            return
          }
          
          set({ isLoading: true })
          
          try {
            set(state => ({
              items: state.items.map(item =>
                item.id === itemId ? { ...item, quantity } : item
              ),
            }))
            
            await get().syncCart()
            get().calculateTotals()
          } catch (error) {
            console.error('Failed to update quantity:', error)
            toast.error('Failed to update quantity')
          } finally {
            set({ isLoading: false })
          }
        },
        
        removeItem: async (itemId) => {
          set({ isLoading: true })
          
          try {
            const item = get().items.find(i => i.id === itemId)
            
            set(state => ({
              items: state.items.filter(item => item.id !== itemId),
            }))
            
            await get().syncCart()
            get().calculateTotals()
            
            if (item) {
              toast.success('Removed from cart', {
                description: item.product.name,
                action: {
                  label: 'Undo',
                  onClick: async () => {
                    // Re-add the item
                    await get().addItem({
                      productId: item.productId,
                      variantId: item.variantId,
                      quantity: item.quantity,
                      price: item.price,
                      compareAtPrice: item.compareAtPrice,
                      product: item.product,
                      variant: item.variant,
                      personalizations: item.personalizations,
                      metadata: item.metadata,
                    })
                  },
                },
              })
            }
          } catch (error) {
            console.error('Failed to remove item:', error)
            toast.error('Failed to remove item')
          } finally {
            set({ isLoading: false })
          }
        },
        
        clearCart: async () => {
          set({ isLoading: true })
          
          try {
            set({
              items: [],
              discounts: [],
              giftCards: [],
            })
            
            await get().syncCart()
            get().calculateTotals()
            
            toast.success('Cart cleared')
          } catch (error) {
            console.error('Failed to clear cart:', error)
            toast.error('Failed to clear cart')
          } finally {
            set({ isLoading: false })
          }
        },
        
        // Cart UI
        openCart: () => set({ isOpen: true }),
        closeCart: () => set({ isOpen: false }),
        toggleCart: () => set(state => ({ isOpen: !state.isOpen })),
        
        // Discounts
        applyDiscount: async (code) => {
          set({ isLoading: true })
          
          try {
            // Validate discount code with API
            const discount = await api.cart.validateDiscount.mutate({ code })
            
            if (discount) {
              set(state => ({
                discounts: [...state.discounts, discount],
              }))
              
              get().calculateTotals()
              toast.success('Discount applied', {
                description: `${discount.value}${discount.type === 'percentage' ? '%' : ''} off`,
              })
            }
          } catch (error: any) {
            toast.error(error.message || 'Invalid discount code')
          } finally {
            set({ isLoading: false })
          }
        },
        
        removeDiscount: (code) => {
          set(state => ({
            discounts: state.discounts.filter(d => d.code !== code),
          }))
          get().calculateTotals()
        },
        
        applyGiftCard: async (code) => {
          set({ isLoading: true })
          
          try {
            // Validate gift card with API
            const giftCard = await api.cart.validateGiftCard.mutate({ code })
            
            if (giftCard) {
              set(state => ({
                giftCards: [...state.giftCards, code],
              }))
              
              get().calculateTotals()
              toast.success('Gift card applied', {
                description: `$${giftCard.balance} available`,
              })
            }
          } catch (error: any) {
            toast.error(error.message || 'Invalid gift card')
          } finally {
            set({ isLoading: false })
          }
        },
        
        removeGiftCard: (code) => {
          set(state => ({
            giftCards: state.giftCards.filter(gc => gc !== code),
          }))
          get().calculateTotals()
        },
        
        // Sync
        syncCart: async () => {
          try {
            const { items, discounts, giftCards } = get()
            
            // Only sync if we have a cart ID or items
            if (items.length === 0 && !get().cartId) return
            
            const syncedCart = await api.cart.sync.mutate({
              cartId: get().cartId,
              items: items.map(item => ({
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                personalizations: item.personalizations,
              })),
              discountCodes: discounts.map(d => d.code),
              giftCardCodes: giftCards,
            })
            
            set({
              cartId: syncedCart.id,
              lastSynced: new Date(),
            })
          } catch (error) {
            console.error('Failed to sync cart:', error)
          }
        },
        
        mergeGuestCart: async (userId) => {
          try {
            const { cartId } = get()
            if (!cartId) return
            
            await api.cart.mergeGuestCart.mutate({
              guestCartId: cartId,
              userId,
            })
            
            // Refresh cart
            await get().syncCart()
          } catch (error) {
            console.error('Failed to merge guest cart:', error)
          }
        },
        
        // Calculations
        calculateTotals: () => {
          const state = get()
          const { items, discounts, taxRate } = state
          
          // Calculate subtotal
          const subtotal = items.reduce((sum, item) => {
            return sum + get().getItemSubtotal(item)
          }, 0)
          
          // Calculate discounts
          let discountAmount = 0
          discounts.forEach(discount => {
            if (discount.minimumAmount && subtotal < discount.minimumAmount) {
              return
            }
            
            if (discount.type === 'percentage') {
              discountAmount += subtotal * (discount.value / 100)
            } else {
              discountAmount += discount.value
            }
          })
          
          // Calculate shipping
          const shippingAmount = get().isEligibleForFreeShipping() ? 0 : 10
          
          // Calculate tax (on subtotal - discount)
          const taxableAmount = Math.max(0, subtotal - discountAmount)
          const taxAmount = taxableAmount * taxRate
          
          // Calculate total
          const total = taxableAmount + taxAmount + shippingAmount
          
          // Update state
          set({
            subtotal,
            discountAmount,
            taxAmount,
            shippingAmount,
            total: Math.max(0, total),
            itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
          })
        },
        
        getItemSubtotal: (item) => {
          return item.price * item.quantity
        },
        
        getItemDiscount: (item) => {
          if (!item.compareAtPrice) return 0
          return (item.compareAtPrice - item.price) * item.quantity
        },
        
        isEligibleForFreeShipping: () => {
          const { subtotal, freeShippingThreshold } = get()
          return subtotal >= freeShippingThreshold
        },
        
        // Utilities
        findItem: (productId, variantId) => {
          return get().items.find(item => 
            item.productId === productId && 
            (!variantId || item.variantId === variantId)
          )
        },
        
        getItemCount: () => {
          return get().items.reduce((sum, item) => sum + item.quantity, 0)
        },
        
        validateStock: async () => {
          const { items } = get()
          
          try {
            const stockStatus = await api.cart.validateStock.mutate({
              items: items.map(item => ({
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
              })),
            })
            
            const outOfStockItems = stockStatus.filter(status => !status.inStock)
            
            if (outOfStockItems.length > 0) {
              outOfStockItems.forEach(status => {
                const item = items.find(i => 
                  i.productId === status.productId && 
                  i.variantId === status.variantId
                )
                
                if (item) {
                  toast.error(`${item.product.name} is out of stock`, {
                    description: status.availableQuantity 
                      ? `Only ${status.availableQuantity} available`
                      : 'This item is no longer available',
                  })
                }
              })
              
              return false
            }
            
            return true
          } catch (error) {
            console.error('Failed to validate stock:', error)
            return false
          }
        },
        
        estimateDelivery: () => {
          const today = new Date()
          const minDays = 5 // Standard shipping
          const maxDays = 7
          
          const min = new Date(today)
          min.setDate(min.getDate() + minDays)
          
          const max = new Date(today)
          max.setDate(max.getDate() + maxDays)
          
          return { min, max }
        },
      }),
      {
        name: 'luxeverse-cart',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          items: state.items,
          discounts: state.discounts,
          giftCards: state.giftCards,
          cartId: state.cartId,
        }),
        onRehydrateStorage: () => (state) => {
          // Recalculate totals after rehydration
          state?.calculateTotals()
        },
      }
    )
  )
)

// Subscribe to changes and recalculate totals
useCartStore.subscribe(
  (state) => state.items,
  () => useCartStore.getState().calculateTotals()
)

// Cart selectors for performance
export const useCartItems = () => useCartStore(state => state.items)
export const useCartItemCount = () => useCartStore(state => state.itemCount)
export const useCartTotal = () => useCartStore(state => state.total)
export const useIsCartOpen = () => useCartStore(state => state.isOpen)
export const useCartActions = () => useCartStore(state => ({
  addItem: state.addItem,
  removeItem: state.removeItem,
  updateQuantity: state.updateQuantity,
  openCart: state.openCart,
  closeCart: state.closeCart,
  toggleCart: state.toggleCart,
}))
