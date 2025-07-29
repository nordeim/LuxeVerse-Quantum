// src/app/(shop)/checkout/success/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { OrderSuccessContent } from './order-success-content'

export const metadata: Metadata = {
  title: 'Order Confirmed | LuxeVerse',
  description: 'Thank you for your order',
  robots: {
    index: false,
    follow: false,
  },
}

interface OrderSuccessPageProps {
  searchParams: {
    order?: string
    session_id?: string // For Stripe Checkout
  }
}

export default function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const orderId = searchParams.order
  const sessionId = searchParams.session_id
  
  if (!orderId && !sessionId) {
    notFound()
  }
  
  return (
    <Suspense fallback={<OrderSuccessLoading />}>
      <OrderSuccessContent orderId={orderId} sessionId={sessionId} />
    </Suspense>
  )
}

function OrderSuccessLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-lg text-muted-foreground">Loading your order...</p>
      </div>
    </div>
  )
}
