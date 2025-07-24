import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { ChevronRight, Sparkles, Shield, Truck, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { HeroSection } from '@/components/home/hero-section'
import { FeaturedProducts } from '@/components/home/featured-products'
import { CollectionShowcase } from '@/components/home/collection-showcase'
import { TrustSignals } from '@/components/home/trust-signals'
import { NewsletterSignup } from '@/components/home/newsletter-signup'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

// Dynamic imports for performance
const AIStyleQuiz = dynamic(() => import('@/components/home/ai-style-quiz'), {
  loading: () => <div className="h-96 animate-pulse bg-muted" />,
})

const MembershipBenefits = dynamic(() => import('@/components/home/membership-benefits'), {
  loading: () => <div className="h-96 animate-pulse bg-muted" />,
})

const TestimonialCarousel = dynamic(() => import('@/components/home/testimonial-carousel'), {
  loading: () => <div className="h-64 animate-pulse bg-muted" />,
})

// Page metadata
export const metadata: Metadata = {
  title: 'Welcome to LuxeVerse - Luxury Fashion Redefined',
  description: 'Discover curated luxury fashion with AI-powered personalization. Shop exclusive collections from the world\'s finest designers.',
  openGraph: {
    title: 'LuxeVerse - Where Luxury Meets Imagination',
    description: 'Experience the future of luxury shopping',
    images: ['/og-home.jpg'],
  },
}

// Structured data for homepage
const homePageStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'LuxeVerse Homepage',
  description: 'Luxury e-commerce platform with AI personalization',
  url: 'https://luxeverse.ai',
  mainEntity: {
    '@type': 'Store',
    name: 'LuxeVerse',
    image: 'https://luxeverse.ai/logo.png',
    priceRange: '$$$',
    servesCuisine: 'Luxury Fashion',
    acceptsReservations: false,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
  },
}

// Prefetch critical data
async function getHomePageData() {
  const [featuredProducts, collections, testimonials] = await Promise.all([
    api.product.getFeatured.fetch({ limit: 8 }),
    api.collection.getFeatured.fetch({ limit: 3 }),
    api.testimonial.getRecent.fetch({ limit: 6 }),
  ])

  return {
    featuredProducts,
    collections,
    testimonials,
  }
}

export default async function HomePage() {
  // Fetch data server-side for optimal performance
  const { featuredProducts, collections, testimonials } = await getHomePageData()

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageStructuredData) }}
      />

      <main id="main-content" className="flex-1">
        {/* Hero Section with Video Background */}
        <HeroSection />

        {/* Trust Signals Bar */}
        <section className="border-y bg-muted/30">
          <div className="container py-6">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="flex items-center justify-center gap-3">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Free Global Shipping</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Authenticity Guaranteed</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Secure Payments</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">AI Personal Stylist</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mb-12 text-center">
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="mr-1 h-3 w-3" />
                AI Curated
              </Badge>
              <h2 className="font-playfair text-4xl font-bold tracking-tight md:text-5xl">
                Featured Collections
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Handpicked by our AI stylist based on current trends
              </p>
            </div>

            <Suspense fallback={<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-96 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>}>
              <FeaturedProducts products={featuredProducts} />
            </Suspense>

            <div className="mt-12 text-center">
              <Button size="lg" variant="outline" asChild>
                <Link href="/products">
                  View All Products
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* AI Style Quiz CTA */}
        <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 py-16">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h2 className="font-playfair text-3xl font-bold tracking-tight md:text-4xl">
                Discover Your Style DNA
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Take our AI-powered style quiz and receive personalized recommendations
                tailored to your unique aesthetic preferences.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Suspense fallback={<Button size="lg" disabled>Loading...</Button>}>
                  <AIStyleQuiz />
                </Suspense>
              </div>
            </div>
          </div>
        </section>

        {/* Collection Showcase */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="font-playfair text-4xl font-bold tracking-tight md:text-5xl">
                Curated Collections
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Explore our themed collections crafted by world-renowned stylists
              </p>
            </div>

            <Suspense fallback={<div className="grid gap-8 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-96 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>}>
              <CollectionShowcase collections={collections} />
            </Suspense>
          </div>
        </section>

        {/* Membership Benefits */}
        <section className="border-y bg-muted/30 py-16 md:py-24">
          <div className="container">
            <div className="mb-12 text-center">
              <Badge variant="secondary" className="mb-4">
                Exclusive Access
              </Badge>
              <h2 className="font-playfair text-4xl font-bold tracking-tight md:text-5xl">
                LuxeVerse Membership
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join our exclusive community and unlock premium benefits
              </p>
            </div>

            <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-muted" />}>
              <MembershipBenefits />
            </Suspense>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="font-playfair text-4xl font-bold tracking-tight md:text-5xl">
                What Our Members Say
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join thousands of satisfied luxury shoppers
              </p>
            </div>

            <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-muted" />}>
              <TestimonialCarousel testimonials={testimonials} />
            </Suspense>
          </div>
        </section>

        {/* Trust Signals Grid */}
        <section className="border-t py-16">
          <div className="container">
            <TrustSignals />
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="bg-primary py-16 text-primary-foreground">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-playfair text-3xl font-bold tracking-tight md:text-4xl">
                Stay in the Loop
              </h2>
              <p className="mt-4 text-lg opacity-90">
                Get exclusive access to new collections, member-only sales, and style tips
                from our AI fashion experts.
              </p>
              <div className="mt-8">
                <NewsletterSignup />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
