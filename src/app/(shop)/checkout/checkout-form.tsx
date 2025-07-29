// src/app/(shop)/checkout/checkout-form.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Session } from 'next-auth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '@/lib/api'
import { useCartStore, useCartItems, useCartTotal } from '@/store/cart.store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { CheckoutSteps } from '@/components/features/checkout/checkout-steps'
import { OrderSummary } from '@/components/features/checkout/order-summary'
import { PaymentForm } from '@/components/features/checkout/payment-form'
import { AddressForm } from '@/components/features/checkout/address-form'
import { GuestCheckoutForm } from '@/components/features/checkout/guest-checkout-form'
import { ShippingMethods } from '@/components/features/checkout/shipping-methods'
import { formatPrice, cn } from '@/lib/utils'
import { toast } from 'sonner'

// Stripe initialization
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Form schemas
const checkoutSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  shippingAddress: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    company: z.string().optional(),
    addressLine1: z.string().min(1, 'Address is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    stateProvince: z.string().min(1, 'State/Province is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    countryCode: z.string().length(2, 'Country code must be 2 characters'),
    phone: z.string().min(1, 'Phone number is required'),
  }),
  billingAddress: z.object({
    sameAsShipping: z.boolean(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    company: z.string().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    stateProvince: z.string().optional(),
    postalCode: z.string().optional(),
    countryCode: z.string().optional(),
    phone: z.string().optional(),
  }),
  shippingMethod: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    estimatedDays: z.object({
      min: z.number(),
      max: z.number(),
    }),
  }),
  saveInfo: z.boolean().default(false),
  notes: z.string().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

interface CheckoutFormProps {
  session: Session | null
}

type CheckoutStep = 'information' | 'shipping' | 'payment'

export function CheckoutForm({ session }: CheckoutFormProps) {
  const router = useRouter()
  const items = useCartItems()
  const total = useCartTotal()
  const { clearCart, validateStock } = useCartStore()
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('information')
  const [isProcessing, setIsProcessing] = useState(false)
  const [clientSecret, setClientSecret] = useState<string>()
  const [orderId, setOrderId] = useState<string>()
  const [savedAddresses, setSavedAddresses] = useState<any[]>([])
  
  // Initialize form
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: session?.user?.email || '',
      shippingAddress: {
        countryCode: 'US',
      },
      billingAddress: {
        sameAsShipping: true,
      },
      saveInfo: false,
    },
  })
  
  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      router.push('/products')
    }
  }, [items.length, isProcessing, router])
  
  // Load saved addresses for logged-in users
  useEffect(() => {
    if (session?.user) {
      api.user.getAddresses.query().then((addresses) => {
        setSavedAddresses(addresses)
        // Pre-fill with default address
        const defaultAddress = addresses.find(a => a.isDefault)
        if (defaultAddress) {
          form.setValue('shippingAddress', {
            firstName: defaultAddress.firstName,
            lastName: defaultAddress.lastName,
            company: defaultAddress.company || '',
            addressLine1: defaultAddress.addressLine1,
            addressLine2: defaultAddress.addressLine2 || '',
            city: defaultAddress.city,
            stateProvince: defaultAddress.stateProvince || '',
            postalCode: defaultAddress.postalCode,
            countryCode: defaultAddress.countryCode,
            phone: defaultAddress.phone || '',
          })
        }
      })
    }
  }, [session, form])
  
  // Handle step navigation
  const handleNextStep = useCallback(async () => {
    let fieldsToValidate: (keyof CheckoutFormData)[] = []
    
    switch (currentStep) {
      case 'information':
        fieldsToValidate = ['email', 'shippingAddress']
        break
      case 'shipping':
        fieldsToValidate = ['shippingMethod']
        break
    }
    
    const isValid = await form.trigger(fieldsToValidate)
    if (!isValid) return
    
    if (currentStep === 'information') {
      setCurrentStep('shipping')
    } else if (currentStep === 'shipping') {
      // Validate stock before payment
      const stockValid = await validateStock()
      if (!stockValid) {
        toast.error('Some items are out of stock')
        return
      }
      
      // Create payment intent
      await createPaymentIntent()
      setCurrentStep('payment')
    }
  }, [currentStep, form, validateStock])
  
  const handlePreviousStep = useCallback(() => {
    if (currentStep === 'payment') {
      setCurrentStep('shipping')
    } else if (currentStep === 'shipping') {
      setCurrentStep('information')
    }
  }, [currentStep])
  
  // Create payment intent
  const createPaymentIntent = async () => {
    setIsProcessing(true)
    
    try {
      const formData = form.getValues()
      
      const response = await api.checkout.createIntent.mutate({
        items: items.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.billingAddress.sameAsShipping 
          ? formData.shippingAddress 
          : formData.billingAddress,
        shippingMethod: formData.shippingMethod,
        email: formData.email,
        notes: formData.notes,
      })
      
      setClientSecret(response.clientSecret)
      setOrderId(response.orderId)
    } catch (error: any) {
      toast.error(error.message || 'Failed to initialize payment')
      setIsProcessing(false)
    }
  }
  
  // Handle successful payment
  const handlePaymentSuccess = async () => {
    setIsProcessing(true)
    
    try {
      // Clear cart
      await clearCart()
      
      // Redirect to success page
      router.push(`/checkout/success?order=${orderId}`)
    } catch (error) {
      console.error('Error completing order:', error)
      toast.error('Order completed but there was an error. Please contact support.')
    }
  }
  
  // Calculate totals
  const { subtotal, discountAmount, taxAmount, shippingAmount } = useCartStore()
  const shippingMethod = form.watch('shippingMethod')
  const finalShipping = shippingMethod?.price || shippingAmount
  const finalTotal = subtotal - discountAmount + taxAmount + finalShipping
  
  if (items.length === 0 && !isProcessing) {
    return null
  }
  
  return (
    <div className="container max-w-7xl py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="mt-2 text-muted-foreground">
          Complete your purchase securely
        </p>
      </div>
      
      {/* Checkout Steps */}
      <CheckoutSteps currentStep={currentStep} className="mb-8" />
      
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Form {...form}>
            <form className="space-y-6">
              <AnimatePresence mode="wait">
                {currentStep === 'information' && (
                  <motion.div
                    key="information"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                        <CardDescription>
                          We'll use this email to send you order updates
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Email field */}
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="your@email.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Guest checkout option */}
                        {!session && (
                          <Alert>
                            <Icons.info className="h-4 w-4" />
                            <AlertDescription>
                              <Link href="/login" className="font-medium underline">
                                Sign in
                              </Link>{' '}
                              for faster checkout and order tracking
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        <Separator />
                        
                        {/* Shipping Address */}
                        <div>
                          <h3 className="mb-4 font-medium">Shipping Address</h3>
                          
                          {/* Saved addresses */}
                          {savedAddresses.length > 0 && (
                            <div className="mb-4">
                              <Label>Use saved address</Label>
                              <RadioGroup
                                onValueChange={(addressId) => {
                                  const address = savedAddresses.find(a => a.id === addressId)
                                  if (address) {
                                    form.setValue('shippingAddress', {
                                      firstName: address.firstName,
                                      lastName: address.lastName,
                                      company: address.company || '',
                                      addressLine1: address.addressLine1,
                                      addressLine2: address.addressLine2 || '',
                                      city: address.city,
                                      stateProvince: address.stateProvince || '',
                                      postalCode: address.postalCode,
                                      countryCode: address.countryCode,
                                      phone: address.phone || '',
                                    })
                                  }
                                }}
                                className="mt-2 space-y-2"
                              >
                                {savedAddresses.map((address) => (
                                  <div key={address.id} className="flex items-center space-x-2">
                                    <RadioGroupItem value={address.id} />
                                    <Label className="flex-1 cursor-pointer font-normal">
                                      <span className="font-medium">
                                        {address.firstName} {address.lastName}
                                      </span>
                                      {address.isDefault && (
                                        <Badge variant="secondary" className="ml-2">
                                          Default
                                        </Badge>
                                      )}
                                      <br />
                                      <span className="text-sm text-muted-foreground">
                                        {address.addressLine1}, {address.city}, {address.stateProvince} {address.postalCode}
                                      </span>
                                    </Label>
                                  </div>
                                ))}
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="new" />
                                  <Label className="cursor-pointer font-normal">
                                    Use a different address
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                          )}
                          
                          <AddressForm
                            control={form.control}
                            prefix="shippingAddress"
                          />
                          
                          {session && (
                            <FormField
                              control={form.control}
                              name="saveInfo"
                              render={({ field }) => (
                                <FormItem className="mt-4 flex items-center space-x-2">
                                  <FormControl>
                                    <input
                                      type="checkbox"
                                      checked={field.value}
                                      onChange={field.onChange}
                                      className="h-4 w-4 rounded border-gray-300"
                                    />
                                  </FormControl>
                                  <FormLabel className="cursor-pointer font-normal">
                                    Save this address for future orders
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
                
                {currentStep === 'shipping' && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Shipping Method</CardTitle>
                        <CardDescription>
                          Choose how you'd like to receive your order
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <FormField
                          control={form.control}
                          name="shippingMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <ShippingMethods
                                  value={field.value}
                                  onChange={field.onChange}
                                  address={form.getValues('shippingAddress')}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Separator className="my-6" />
                        
                        {/* Billing Address */}
                        <div>
                          <h3 className="mb-4 font-medium">Billing Address</h3>
                          
                          <FormField
                            control={form.control}
                            name="billingAddress.sameAsShipping"
                            render={({ field }) => (
                              <FormItem className="mb-4">
                                <FormControl>
                                  <label className="flex cursor-pointer items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      checked={field.value}
                                      onChange={field.onChange}
                                      className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <span>Same as shipping address</span>
                                  </label>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          {!form.watch('billingAddress.sameAsShipping') && (
                            <AddressForm
                              control={form.control}
                              prefix="billingAddress"
                            />
                          )}
                        </div>
                        
                        <Separator className="my-6" />
                        
                        {/* Order Notes */}
                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Order Notes (Optional)</FormLabel>
                              <FormControl>
                                <textarea
                                  className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                  placeholder="Any special instructions for your order..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
                
                {currentStep === 'payment' && clientSecret && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Payment</CardTitle>
                        <CardDescription>
                          Complete your purchase securely
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                          <PaymentForm
                            clientSecret={clientSecret}
                            orderId={orderId!}
                            onSuccess={handlePaymentSuccess}
                          />
                        </Elements>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Navigation */}
              <div className="flex justify-between">
                {currentStep !== 'information' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviousStep}
                    disabled={isProcessing}
                  >
                    <Icons.chevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}
                
                {currentStep !== 'payment' && (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    disabled={isProcessing}
                    className={cn(
                      currentStep === 'information' && 'ml-auto'
                    )}
                  >
                    Continue
                    <Icons.chevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              discount={discountAmount}
              tax={taxAmount}
              shipping={finalShipping}
              total={finalTotal}
            />
            
            {/* Security badges */}
            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Icons.shield className="h-4 w-4" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Icons.lock className="h-4 w-4" />
                <span>Encrypted</span>
              </div>
              <div className="flex items-center gap-1">
                <Icons.creditCard className="h-4 w-4" />
                <span>PCI Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
