// src/app/(shop)/checkout/page.tsx
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getServerAuthSession } from '@/lib/auth'
import { CheckoutForm } from './checkout-form'

export const metadata: Metadata = {
  title: 'Checkout | LuxeVerse',
  description: 'Complete your luxury purchase securely',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function CheckoutPage() {
  // For guest checkout, we'll handle auth in the client component
  const session = await getServerAuthSession()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <CheckoutForm session={session} />
    </div>
  )
}
