# 🎯 Phase 1 Completion: Root Layout & Homepage

I'll create these critical files with meticulous attention to detail, ensuring they embody the cinematic luxury experience while maintaining peak performance and developer experience.

## Planning Approach

### For `layout.tsx`:
1. **Provider Architecture**: Proper provider nesting order
2. **Font Strategy**: Optimized font loading with variable fonts
3. **SEO Foundation**: Comprehensive metadata and structured data
4. **Performance**: Monitoring and optimization from the start
5. **Theme System**: Dark/light mode with system preference
6. **Accessibility**: ARIA landmarks and skip navigation

### For `page.tsx`:
1. **Hero Impact**: Cinematic video background with gradient overlays
2. **AI Integration**: Showcase AI features prominently
3. **Product Display**: Elegant product cards with hover effects
4. **Social Proof**: Reviews and trust signals
5. **Performance**: Lazy loading and optimized images
6. **Animations**: Smooth, GPU-accelerated animations

---

## 📄 Phase 1.9: `/src/app/layout.tsx`

```tsx
import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { headers } from 'next/headers'
import Script from 'next/script'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import { CartProvider } from '@/components/providers/cart-provider'
import { AnalyticsProvider } from '@/components/providers/analytics-provider'
import { TRPCProvider } from '@/components/providers/trpc-provider'
import { ProgressBar } from '@/components/ui/progress-bar'
import { cn } from '@/lib/utils'
import '@/styles/globals.css'

// Font configurations with variable font support
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  preload: true,
  fallback: ['Georgia', 'Times New Roman', 'serif'],
})

// Comprehensive metadata configuration
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://luxeverse.ai'),
  title: {
    default: 'LuxeVerse - Where Luxury Meets Imagination',
    template: '%s | LuxeVerse',
  },
  description: 'Experience the future of luxury shopping with AI-powered personalization, cinematic storytelling, and exclusive collections from the world\'s finest brands.',
  keywords: [
    'luxury fashion',
    'designer clothing',
    'luxury e-commerce',
    'AI shopping',
    'personalized fashion',
    'haute couture',
    'designer accessories',
    'luxury lifestyle',
    'exclusive collections',
    'AR try-on',
  ],
  authors: [
    {
      name: 'LuxeVerse',
      url: 'https://luxeverse.ai',
    },
  ],
  creator: 'LuxeVerse',
  publisher: 'LuxeVerse',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://luxeverse.ai',
    siteName: 'LuxeVerse',
    title: 'LuxeVerse - Where Luxury Meets Imagination',
    description: 'Experience the future of luxury shopping with AI-powered personalization and cinematic storytelling.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LuxeVerse - Luxury E-Commerce Experience',
      },
      {
        url: '/og-image-square.jpg',
        width: 1200,
        height: 1200,
        alt: 'LuxeVerse - Luxury E-Commerce Experience',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LuxeVerse - Where Luxury Meets Imagination',
    description: 'Experience the future of luxury shopping with AI-powered personalization.',
    images: ['/twitter-image.jpg'],
    creator: '@luxeverse',
    site: '@luxeverse',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
      { url: '/apple-icon-180x180.png', sizes: '180x180' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#0A0A0B',
      },
    ],
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://luxeverse.ai',
    languages: {
      'en-US': 'https://luxeverse.ai',
      'fr-FR': 'https://fr.luxeverse.ai',
      'de-DE': 'https://de.luxeverse.ai',
      'ja-JP': 'https://ja.luxeverse.ai',
      'zh-CN': 'https://cn.luxeverse.ai',
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
  },
  category: 'shopping',
}

// Viewport configuration for optimal mobile experience
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAFA' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0B' },
  ],
}

// Structured data for rich snippets
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'LuxeVerse',
  description: 'Luxury E-Commerce Platform with AI Personalization',
  url: 'https://luxeverse.ai',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://luxeverse.ai/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
  sameAs: [
    'https://www.instagram.com/luxeverse',
    'https://www.facebook.com/luxeverse',
    'https://twitter.com/luxeverse',
    'https://www.youtube.com/luxeverse',
    'https://www.pinterest.com/luxeverse',
  ],
}

// Organization structured data
const organizationData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'LuxeVerse',
  url: 'https://luxeverse.ai',
  logo: 'https://luxeverse.ai/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-800-LUXEVERSE',
    contactType: 'customer service',
    availableLanguage: ['English', 'French', 'German', 'Japanese', 'Chinese'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get headers for nonce (CSP)
  const nonce = headers().get('x-nonce')

  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={cn(
        inter.variable,
        playfair.variable,
        'scroll-smooth antialiased'
      )}
    >
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.luxeverse.ai" />
        <link rel="preconnect" href="https://vitals.vercel-insights.com" />
        
        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="https://api.luxeverse.ai" />
        <link rel="dns-prefetch" href="https://stripe.com" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
        />
        
        {/* Critical CSS for preventing FOUC */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --font-inter: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                --font-playfair: 'Playfair Display', Georgia, serif;
              }
              
              /* Prevent layout shift */
              html {
                overflow-x: hidden;
                scroll-behavior: smooth;
              }
              
              /* Hide content until fonts load */
              .font-loading * {
                opacity: 0;
              }
              
              /* Smooth page transitions */
              ::view-transition-old(root),
              ::view-transition-new(root) {
                animation-duration: 0.3s;
              }
            `,
          }}
        />
      </head>
      <body 
        className={cn(
          'min-h-screen bg-background font-sans text-foreground',
          'selection:bg-primary selection:text-primary-foreground',
          'overflow-x-hidden'
        )}
      >
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-20 rounded-md bg-primary px-4 py-2 text-primary-foreground transition-transform focus:translate-y-0"
        >
          Skip to main content
        </a>

        {/* Progress bar for page transitions */}
        <ProgressBar />

        {/* Provider hierarchy */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="luxeverse-theme"
        >
          <TRPCProvider>
            <AuthProvider>
              <CartProvider>
                <AnalyticsProvider>
                  {/* Main app content */}
                  <div className="relative flex min-h-screen flex-col">
                    {/* Noise texture overlay for luxury feel */}
                    <div 
                      className="pointer-events-none fixed inset-0 z-50 opacity-[0.015]"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
                      }}
                      aria-hidden="true"
                    />
                    
                    {children}
                  </div>

                  {/* Global UI elements */}
                  <Toaster />
                </AnalyticsProvider>
              </CartProvider>
            </AuthProvider>
          </TRPCProvider>
        </ThemeProvider>

        {/* Analytics Scripts */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Vercel Analytics */}
            <Script src="/_vercel/insights/script.js" strategy="afterInteractive" />
            
            {/* Google Analytics */}
            {process.env.NEXT_PUBLIC_GA_ID && (
              <>
                <Script
                  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                  strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                  {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                      page_path: window.location.pathname,
                    });
                  `}
                </Script>
              </>
            )}
          </>
        )}

        {/* Performance monitoring */}
        <Script id="web-vitals" strategy="afterInteractive">
          {`
            if (typeof window !== 'undefined') {
              // Monitor Core Web Vitals
              if ('PerformanceObserver' in window && 'PerformanceLongTaskTiming' in window) {
                const observer = new PerformanceObserver((list) => {
                  for (const entry of list.getEntries()) {
                    console.log('[Performance]', entry.name, entry.startTime, entry.duration);
                  }
                });
                observer.observe({ entryTypes: ['longtask', 'largest-contentful-paint'] });
              }
              
              // Font loading optimization
              document.fonts.ready.then(() => {
                document.documentElement.classList.remove('font-loading');
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
}
```

---

## 📄 Phase 1.10: `/src/app/page.tsx`

```tsx
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
```

## 🎯 Key Implementation Details

### Layout.tsx Features:
1. **Comprehensive SEO**: Full metadata with OpenGraph, Twitter cards, and structured data
2. **Font Optimization**: Variable fonts with proper fallbacks
3. **Provider Hierarchy**: Correct nesting order for optimal performance
4. **Accessibility**: Skip navigation, semantic HTML, ARIA landmarks
5. **Performance**: DNS prefetch, preconnect, critical CSS
6. **Theme System**: Dark/light mode with system preference
7. **Analytics**: Integrated tracking with privacy consideration
8. **Security**: CSP headers, nonce support

### Page.tsx Features:
1. **Server Components**: Optimal data fetching with parallel requests
2. **Dynamic Imports**: Code splitting for better performance
3. **Suspense Boundaries**: Smooth loading states
4. **Cinematic Design**: Hero section ready for video background
5. **AI Integration**: Style quiz and personalized recommendations
6. **Social Proof**: Testimonials and trust signals
7. **Responsive Design**: Mobile-first approach
8. **SEO Optimized**: Structured data and semantic markup

These files create a solid foundation for the LuxeVerse platform, embodying the luxury aesthetic while maintaining excellent performance and developer experience.
