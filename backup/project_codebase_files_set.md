# .env.local
```local
# Database Configuration
DATABASE_URL="postgresql://luxeverse_user:StrongPass123@localhost:5432/luxeverse_db"

# Authentication
NEXTAUTH_SECRET="your-super-secret-jwt-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"

# Payment Processing
STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""

# Email
EMAIL_SERVER_HOST="smtp.resend.com"
EMAIL_SERVER_PORT="465"
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_FROM="noreply@luxeverse.ai"

# Algolia
NEXT_PUBLIC_ALGOLIA_APP_ID=""
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=""
ALGOLIA_ADMIN_KEY=""

# AI Services
OPENAI_API_KEY="sk-your-openai-api-key"

# Search & Analytics
ALGOLIA_APPLICATION_ID="your-algolia-app-id"
ALGOLIA_API_KEY="your-algolia-api-key"
ALGOLIA_SEARCH_KEY="your-algolia-search-key"

# Cache & Storage
UPSTASH_REDIS_REST_URL="your-upstash-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-redis-token"

AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_S3_BUCKET_NAME="your-s3-bucket-name"

# Email Service
RESEND_API_KEY="re_your-resend-api-key"

# Monitoring
SENTRY_DSN="your-sentry-dsn"

```

# package.json
```json
{
  "name": "luxeverse",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts",
    "test": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@prisma/client": "^6.12.0",
    "next": "^15.4.4",
    "prisma": "^6.12.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@types/node": "^24.1.0",
    "@types/react": "^19.1.8",
    "typescript": "^5.8.3"
  }
}

```

# tailwind.config.ts
```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config

```

# next.config.mjs
```mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.luxeverse.ai', 'images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig

```

# tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

```

# src/styles/globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}

```

# src/app/layout.tsx
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

# src/app/page.tsx
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

# src/app/api/auth/[...nextauth]/route.ts
```ts
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * NextAuth API route handler
 * Handles all authentication endpoints:
 * - /api/auth/signin
 * - /api/auth/signout
 * - /api/auth/callback/[provider]
 * - /api/auth/csrf
 * - /api/auth/session
 * - /api/auth/providers
 */
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

```

# src/app/api/auth/register/route.ts
```ts
// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { UserRole, MembershipTier } from '@prisma/client'

// Request validation schema
const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  marketingConsent: z.boolean().optional().default(false),
})

/**
 * Handle user registration
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = registerSchema.parse(body)
    
    const { name, email, password, marketingConsent } = validatedData

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    })

    if (existingUser) {
      return NextResponse.json(
        { 
          error: 'Account already exists',
          message: 'An account with this email address already exists. Please sign in instead.',
        },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await hash(password, 12)

    // Get client IP for audit log
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Create user with transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: 'CUSTOMER' as UserRole,
          membershipTier: 'PEARL' as MembershipTier,
          aiConsent: true,
          personalizationLevel: 5,
          preferredCurrency: 'USD',
          preferredLanguage: 'en',
          timezone: 'UTC',
          styleProfileCompleted: false,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          membershipTier: true,
          createdAt: true,
        },
      })

      // Create audit log for user creation
      await tx.auditLog.create({
        data: {
          userId: newUser.id,
          action: 'USER_REGISTERED',
          entityType: 'USER',
          entityId: newUser.id,
          newValues: {
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            membershipTier: newUser.membershipTier,
            marketingConsent,
          },
          ipAddress: clientIP,
          userAgent,
        },
      })

      // Create default wishlist
      await tx.wishlist.create({
        data: {
          userId: newUser.id,
          name: 'My Wishlist',
        },
      })

      // Award welcome bonus loyalty points
      await tx.loyaltyPoint.create({
        data: {
          userId: newUser.id,
          type: 'earned',
          points: 1000,
          balanceAfter: 1000,
          source: 'welcome_bonus',
          description: 'Welcome to LuxeVerse! Enjoy 1000 bonus points to start your luxury journey.',
        },
      })

      // Create initial style profile (empty but ready for completion)
      await tx.styleProfile.create({
        data: {
          userId: newUser.id,
          stylePersonas: [],
          favoriteColors: [],
          avoidedColors: [],
          preferredBrands: [],
          avoidedMaterials: [],
          prefersSustainable: false,
          prefersExclusive: false,
          earlyAdopterScore: 0.5,
          luxuryAffinityScore: 0.5,
        },
      })

      return newUser
    })

    // Send welcome email (async, don't wait for it)
    sendWelcomeEmail(result.email, result.name).catch(console.error)

    // Return success response (exclude sensitive data)
    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: {
          id: result.id,
          name: result.name,
          email: result.email,
          role: result.role,
          membershipTier: result.membershipTier,
        },
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {}
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          fieldErrors[err.path[0] as string] = err.message
        }
      })

      return NextResponse.json(
        {
          error: 'Validation failed',
          message: 'Please check your input and try again.',
          errors: fieldErrors,
        },
        { status: 400 }
      )
    }

    // Handle Prisma unique constraint errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        {
          error: 'Account already exists',
          message: 'An account with this email address already exists.',
        },
        { status: 409 }
      )
    }

    // Generic error response
    return NextResponse.json(
      {
        error: 'Registration failed',
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    )
  }
}

/**
 * Send welcome email to new user
 */
async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  try {
    // This would integrate with your email service (Resend, SendGrid, etc.)
    const emailData = {
      to: email,
      subject: 'Welcome to LuxeVerse - Your Luxury Journey Begins',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #FF006E, #00D9FF); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 2.5rem; font-weight: bold;">LuxeVerse</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9; font-size: 1.1rem;">Welcome to the future of luxury</p>
          </div>
          
          <div style="padding: 40px; background: #fafafa;">
            <h2 style="color: #333; margin-bottom: 20px;">Welcome, ${name}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Thank you for joining LuxeVerse, where luxury meets innovation. Your account has been created successfully, and you're now part of an exclusive community that values sophistication, quality, and personalized experiences.
            </p>
            
            <div style="background: linear-gradient(135deg, rgba(255, 0, 110, 0.1), rgba(0, 217, 255, 0.1)); padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">🎁 Welcome Bonus</h3>
              <p style="color: #666; margin-bottom: 0;">You've received <strong>1,000 loyalty points</strong> to start your luxury journey!</p>
            </div>
            
            <h3 style="color: #333; margin-top: 30px;">What's next?</h3>
            <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
              <li>Complete your style profile for personalized recommendations</li>
              <li>Explore our curated collections</li>
              <li>Experience AI-powered styling assistance</li>
              <li>Enjoy exclusive member benefits</li>
            </ul>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXTAUTH_URL}/welcome" style="display: inline-block; background: linear-gradient(135deg, #FF006E, #8B00FF); color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: 600;">
                Start Exploring
              </a>
            </div>
          </div>
          
          <div style="padding: 20px; text-align: center; background: #f0f0f0; color: #999; font-size: 0.9rem;">
            <p>Need help? Contact us at <a href="mailto:support@luxeverse.ai" style="color: #FF006E;">support@luxeverse.ai</a></p>
            <p style="margin-top: 10px;">
              <a href="${process.env.NEXTAUTH_URL}/unsubscribe" style="color: #999; text-decoration: underline;">Unsubscribe</a> |
              <a href="${process.env.NEXTAUTH_URL}/privacy" style="color: #999; text-decoration: underline; margin-left: 10px;">Privacy Policy</a>
            </p>
          </div>
        </div>
      `,
    }

    // Send email via your email service
    // await emailService.send(emailData)
    console.log('Welcome email would be sent to:', email)

  } catch (error) {
    console.error('Failed to send welcome email:', error)
    // Don't throw error - email failure shouldn't break registration
  }
}

/**
 * Handle OPTIONS request for CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

```

# src/app/(auth)/login/page.tsx
```tsx
// src/app/(auth)/login/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, AlertCircle, Mail, Lock, Chrome } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface LoginForm {
  email: string
  password: string
}

interface LoginErrors {
  email?: string
  password?: string
  general?: string
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/account'
  const error = searchParams.get('error')
  
  // Form state
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  })
  
  const [errors, setErrors] = useState<LoginErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isEmailLogin, setIsEmailLogin] = useState(false)

  // Handle URL errors
  useEffect(() => {
    if (error) {
      const errorMessages: Record<string, string> = {
        OAuthSignin: 'Error occurred during sign in. Please try again.',
        OAuthCallback: 'Error occurred during OAuth callback. Please try again.',
        OAuthCreateAccount: 'Could not create OAuth account. Please try again.',
        EmailCreateAccount: 'Could not create account. Please try again.',
        Callback: 'Error occurred during callback. Please try again.',
        OAuthAccountNotLinked: 'This email is already associated with another account.',
        EmailSignin: 'Check your email for the sign in link.',
        CredentialsSignin: 'Invalid email or password. Please check your credentials.',
        SessionRequired: 'Please sign in to access this page.',
        default: 'An unexpected error occurred. Please try again.',
      }
      
      setErrors({
        general: errorMessages[error] || errorMessages.default
      })
    }
  }, [error])

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation (only for credentials login)
    if (!isEmailLogin) {
      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      if (isEmailLogin) {
        // Magic link sign in
        const result = await signIn('email', {
          email: formData.email.toLowerCase().trim(),
          redirect: false,
          callbackUrl,
        })

        if (result?.error) {
          setErrors({ general: 'Failed to send magic link. Please try again.' })
        } else {
          // Redirect to verification page
          router.push(`/verify-request?email=${encodeURIComponent(formData.email)}`)
        }
      } else {
        // Credentials sign in
        const result = await signIn('credentials', {
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          redirect: false,
        })

        if (result?.error) {
          if (result.error === 'CredentialsSignin') {
            setErrors({ 
              general: 'Invalid email or password. Please check your credentials and try again.' 
            })
          } else {
            setErrors({ 
              general: 'Sign in failed. Please try again.' 
            })
          }
        } else if (result?.ok) {
          // Successful login - redirect
          router.push(callbackUrl)
          router.refresh() // Refresh to update session
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ 
        general: 'An unexpected error occurred. Please try again.' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle OAuth sign in
   */
  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true)
    setErrors({})

    try {
      await signIn(provider, { 
        callbackUrl,
        redirect: true,
      })
    } catch (error) {
      console.error(`${provider} sign in error:`, error)
      setErrors({ 
        general: `Failed to sign in with ${provider}. Please try again.` 
      })
      setIsLoading(false)
    }
  }

  /**
   * Update form data
   */
  const updateFormData = (field: keyof LoginForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Welcome back
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Sign in to your LuxeVerse account to continue your luxury journey
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Error Alert */}
          {errors.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-12 font-medium"
              onClick={() => handleOAuthSignIn('google')}
              disabled={isLoading}
            >
              <Chrome className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Login Method Toggle */}
          <div className="flex space-x-2">
            <Button
              type="button"
              variant={!isEmailLogin ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => setIsEmailLogin(false)}
            >
              <Lock className="mr-2 h-4 w-4" />
              Password
            </Button>
            <Button
              type="button"
              variant={isEmailLogin ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => setIsEmailLogin(true)}
            >
              <Mail className="mr-2 h-4 w-4" />
              Magic Link
            </Button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@luxeverse.ai"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                disabled={isLoading}
                className={cn(
                  "h-12",
                  errors.email && "border-red-500 focus:border-red-500"
                )}
                required
                autoComplete="email"
                autoFocus
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field (only for credentials login) */}
            {!isEmailLogin && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Link 
                    href="/reset-password" 
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    disabled={isLoading}
                    className={cn(
                      "h-12 pr-12",
                      errors.password && "border-red-500 focus:border-red-500"
                    )}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEmailLogin ? 'Sending magic link...' : 'Signing in...'}
                </>
              ) : (
                <>
                  {isEmailLogin ? 'Send magic link' : 'Sign in'}
                </>
              )}
            </Button>
          </form>

          {/* Email Login Info */}
          {isEmailLogin && (
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
              We'll send you a secure link to sign in instantly
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link 
              href="/register" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Create one now
            </Link>
          </div>
          <div className="text-xs text-center text-gray-500">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="underline">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline">Privacy Policy</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

```

# src/app/(auth)/register/page.tsx
```tsx
// src/app/(auth)/register/page.tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, AlertCircle, Check, Chrome, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

interface RegistrationForm {
  name: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
  marketingConsent: boolean
}

interface RegistrationErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  acceptTerms?: string
  general?: string
}

// Password strength indicator
const getPasswordStrength = (password: string): {
  score: number
  feedback: string[]
  isValid: boolean
} => {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('At least 8 characters')
  }

  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push('One lowercase letter')
  }

  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push('One uppercase letter')
  }

  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push('One number')
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1
  } else {
    feedback.push('One special character')
  }

  return {
    score,
    feedback,
    isValid: score >= 4,
  }
}

export default function RegisterPage() {
  const router = useRouter()
  
  // Form state
  const [formData, setFormData] = useState<RegistrationForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    marketingConsent: false,
  })
  
  const [errors, setErrors] = useState<RegistrationErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const newErrors: RegistrationErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name must be less than 100 characters'
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    const passwordStrength = getPasswordStrength(formData.password)
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (!passwordStrength.isValid) {
      newErrors.password = `Password must include: ${passwordStrength.feedback.join(', ')}`
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Terms acceptance validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      // Call registration API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          marketingConsent: formData.marketingConsent,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          setErrors({ email: 'An account with this email already exists' })
        } else if (data.errors) {
          // Handle validation errors from server
          setErrors(data.errors)
        } else {
          setErrors({ general: data.error || 'Registration failed. Please try again.' })
        }
        return
      }

      // Registration successful - automatically sign in
      const signInResult = await signIn('credentials', {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        redirect: false,
      })

      if (signInResult?.ok) {
        // Redirect to welcome page
        router.push('/welcome')
      } else {
        // Registration successful but auto-login failed
        router.push('/login?message=Registration successful. Please sign in.')
      }

    } catch (error) {
      console.error('Registration error:', error)
      setErrors({ 
        general: 'An unexpected error occurred. Please try again.' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle OAuth sign up
   */
  const handleOAuthSignUp = async (provider: string) => {
    setIsLoading(true)
    setErrors({})

    try {
      await signIn(provider, { 
        callbackUrl: '/welcome',
        redirect: true,
      })
    } catch (error) {
      console.error(`${provider} sign up error:`, error)
      setErrors({ 
        general: `Failed to sign up with ${provider}. Please try again.` 
      })
      setIsLoading(false)
    }
  }

  /**
   * Update form data
   */
  const updateFormData = (field: keyof RegistrationForm, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field-specific error when user starts typing
    if (errors[field as keyof RegistrationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  // Get password strength for display
  const passwordStrength = formData.password ? getPasswordStrength(formData.password) : null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <UserPlus className="text-white h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Join LuxeVerse
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Create your account and discover the future of luxury shopping
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Error Alert */}
          {errors.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-12 font-medium"
              onClick={() => handleOAuthSignUp('google')}
              disabled={isLoading}
            >
              <Chrome className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">
                Or create account with email
              </span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                disabled={isLoading}
                className={cn(
                  "h-12",
                  errors.name && "border-red-500 focus:border-red-500"
                )}
                required
                autoComplete="name"
                autoFocus
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@luxeverse.ai"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                disabled={isLoading}
                className={cn(
                  "h-12",
                  errors.email && "border-red-500 focus:border-red-500"
                )}
                required
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  disabled={isLoading}
                  className={cn(
                    "h-12 pr-12",
                    errors.password && "border-red-500 focus:border-red-500"
                  )}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && passwordStrength && (
                <div className="space-y-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={cn(
                          "h-1 flex-1 rounded-full",
                          passwordStrength.score >= level
                            ? passwordStrength.score <= 2
                              ? "bg-red-500"
                              : passwordStrength.score <= 3
                              ? "bg-yellow-500"
                              : "bg-green-500"
                            : "bg-gray-200"
                        )}
                      />
                    ))}
                  </div>
                  {!passwordStrength.isValid && (
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>Password must include:</p>
                      <ul className="space-y-1">
                        {passwordStrength.feedback.map((item, index) => (
                          <li key={index} className="flex items-center text-xs">
                            <div className="w-3 h-3 mr-2 rounded-full border border-gray-300" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                  disabled={isLoading}
                  className={cn(
                    "h-12 pr-12",
                    errors.confirmPassword && "border-red-500 focus:border-red-500",
                    formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && "border-green-500"
                  )}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <div className="absolute inset-y-0 right-10 flex items-center">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => updateFormData('acceptTerms', checked as boolean)}
                  disabled={isLoading}
                  className="mt-1"
                />
                <Label htmlFor="acceptTerms" className="text-sm leading-5">
                  I agree to the{' '}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-500 underline">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-500 underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-red-600">{errors.acceptTerms}</p>
              )}

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="marketingConsent"
                  checked={formData.marketingConsent}
                  onCheckedChange={(checked) => updateFormData('marketingConsent', checked as boolean)}
                  disabled={isLoading}
                  className="mt-1"
                />
                <Label htmlFor="marketingConsent" className="text-sm leading-5 text-gray-600">
                  I'd like to receive emails about new products, exclusive offers, and style inspiration
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

```

# src/components/providers/auth-provider.tsx
```tsx
// src/components/providers/auth-provider.tsx
'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

interface AuthProviderProps {
  children: ReactNode
  session?: any
}

/**
 * Authentication provider component
 * Wraps the app with NextAuth SessionProvider
 */
export function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    <SessionProvider 
      session={session}
      refetchInterval={5 * 60} // Refetch session every 5 minutes
      refetchOnWindowFocus={true} // Refetch when window gains focus
      refetchWhenOffline={false} // Don't refetch when offline
    >
      {children}
    </SessionProvider>
  )
}

/**
 * Hook to check if user has specific role
 */
export function useRequireRole(requiredRole: string) {
  // This will be implemented in the custom hook file
  return true
}

/**
 * Hook to check if user has admin privileges
 */
export function useRequireAdmin() {
  // This will be implemented in the custom hook file
  return true
}

```

# src/components/features/product-card.tsx
```tsx
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

```

# src/components/features/product-filters.tsx
```tsx
// src/components/features/product-filters.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'

interface ProductFiltersProps {
  className?: string
  onFiltersChange?: (filters: any) => void
}

interface FilterState {
  categoryIds: string[]
  brandIds: string[]
  priceRange: [number, number]
  inStock: boolean
  sustainable: boolean
  materials: string[]
  colors: string[]
  sizes: string[]
}

const DEFAULT_FILTERS: FilterState = {
  categoryIds: [],
  brandIds: [],
  priceRange: [0, 10000],
  inStock: false,
  sustainable: false,
  materials: [],
  colors: [],
  sizes: [],
}

export function ProductFilters({ className, onFiltersChange }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['category', 'price', 'availability'])
  )

  // Fetch filter options
  const { data: categories } = api.category.getAll.useQuery({
    includeProductCount: true,
  })

  const { data: brands } = api.brand.getAll.useQuery()

  // Available filter options
  const materialOptions = [
    'Cotton', 'Silk', 'Wool', 'Leather', 'Cashmere', 'Linen', 'Denim',
    'Polyester', 'Nylon', 'Spandex', 'Organic Cotton', 'Recycled Materials'
  ]

  const colorOptions = [
    'Black', 'White', 'Gray', 'Navy', 'Beige', 'Brown', 'Red', 'Pink',
    'Purple', 'Blue', 'Green', 'Yellow', 'Orange', 'Gold', 'Silver'
  ]

  const sizeOptions = [
    'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10', '11', '12'
  ]

  // Initialize filters from URL params
  useEffect(() => {
    const urlFilters: Partial<FilterState> = {}
    
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      urlFilters.categoryIds = [categoryParam]
    }
    
    const brandParam = searchParams.get('brand')
    if (brandParam) {
      urlFilters.brandIds = [brandParam]
    }
    
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    if (minPrice || maxPrice) {
      urlFilters.priceRange = [
        minPrice ? parseInt(minPrice) : 0,
        maxPrice ? parseInt(maxPrice) : 10000
      ]
    }
    
    const inStock = searchParams.get('inStock')
    if (inStock) {
      urlFilters.inStock = inStock === 'true'
    }
    
    const sustainable = searchParams.get('sustainable')
    if (sustainable) {
      urlFilters.sustainable = sustainable === 'true'
    }

    setFilters(prev => ({ ...prev, ...urlFilters }))
  }, [searchParams])

  // Update URL when filters change
  const updateURL = (newFilters: FilterState) => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Clear existing filter params
    params.delete('category')
    params.delete('brand')
    params.delete('minPrice')
    params.delete('maxPrice')
    params.delete('inStock')
    params.delete('sustainable')
    
    // Add new filter params
    if (newFilters.categoryIds.length > 0) {
      params.set('category', newFilters.categoryIds[0])
    }
    
    if (newFilters.brandIds.length > 0) {
      params.set('brand', newFilters.brandIds[0])
    }
    
    if (newFilters.priceRange[0] > 0) {
      params.set('minPrice', newFilters.priceRange[0].toString())
    }
    
    if (newFilters.priceRange[1] < 10000) {
      params.set('maxPrice', newFilters.priceRange[1].toString())
    }
    
    if (newFilters.inStock) {
      params.set('inStock', 'true')
    }
    
    if (newFilters.sustainable) {
      params.set('sustainable', 'true')
    }
    
    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    updateURL(newFilters)
    onFiltersChange?.(newFilters)
  }

  // Toggle array filter
  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    const currentArray = filters[key] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    
    handleFilterChange(key, newArray)
  }

  // Clear all filters
  const clearAllFilters = () => {
    setFilters(DEFAULT_FILTERS)
    router.push(window.location.pathname, { scroll: false })
    onFiltersChange?.(DEFAULT_FILTERS)
  }

  // Check if filters are active
  const hasActiveFilters = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS)

  // Toggle section expansion
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-sm"
            >
              Clear All
            </Button>
          )}
        </div>
        
        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-3">
            {filters.categoryIds.map(categoryId => {
              const category = categories?.find(c => c.id === categoryId)
              return category ? (
                <Badge key={categoryId} variant="secondary" className="text-xs">
                  {category.name}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => toggleArrayFilter('categoryIds', categoryId)}
                  />
                </Badge>
              ) : null
            })}
            
            {filters.brandIds.map(brandId => {
              const brand = brands?.find(b => b.id === brandId)
              return brand ? (
                <Badge key={brandId} variant="secondary" className="text-xs">
                  {brand.name}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => toggleArrayFilter('brandIds', brandId)}
                  />
                </Badge>
              ) : null
            })}
            
            {filters.inStock && (
              <Badge variant="secondary" className="text-xs">
                In Stock
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer" 
                  onClick={() => handleFilterChange('inStock', false)}
                />
              </Badge>
            )}
            
            {filters.sustainable && (
              <Badge variant="secondary" className="text-xs">
                Sustainable
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer" 
                  onClick={() => handleFilterChange('sustainable', false)}
                />
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Categories */}
        <Collapsible 
          open={expandedSections.has('category')}
          onOpenChange={() => toggleSection('category')}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
            <h4 className="font-medium">Categories</h4>
            {expandedSections.has('category') ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            {categories?.map(category => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={filters.categoryIds.includes(category.id)}
                  onCheckedChange={() => toggleArrayFilter('categoryIds', category.id)}
                />
                <Label 
                  htmlFor={`category-${category.id}`}
                  className="text-sm flex-1 cursor-pointer"
                >
                  {category.name}
                  {category._count?.products && (
                    <span className="text-gray-500 ml-1">
                      ({category._count.products})
                    </span>
                  )}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Brands */}
        <Collapsible 
          open={expandedSections.has('brand')}
          onOpenChange={() => toggleSection('brand')}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
            <h4 className="font-medium">Brands</h4>
            {expandedSections.has('brand') ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            {brands?.slice(0, 10).map(brand => (
              <div key={brand.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand.id}`}
                  checked={filters.brandIds.includes(brand.id)}
                  onCheckedChange={() => toggleArrayFilter('brandIds', brand.id)}
                />
                <Label 
                  htmlFor={`brand-${brand.id}`}
                  className="text-sm flex-1 cursor-pointer flex items-center gap-2"
                >
                  {brand.name}
                  {brand.isVerified && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Price Range */}
        <Collapsible 
          open={expandedSections.has('price')}
          onOpenChange={() => toggleSection('price')}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
            <h4 className="font-medium">Price Range</h4>
            {expandedSections.has('price') ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-3">
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => handleFilterChange('priceRange', value)}
                max={10000}
                min={0}
                step={50}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Availability */}
        <Collapsible 
          open={expandedSections.has('availability')}
          onOpenChange={() => toggleSection('availability')}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
            <h4 className="font-medium">Availability</h4>
            {expandedSections.has('availability') ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={filters.inStock}
                onCheckedChange={(checked) => handleFilterChange('inStock', checked)}
              />
              <Label htmlFor="in-stock" className="text-sm cursor-pointer">
                In Stock Only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sustainable"
                checked={filters.sustainable}
                onCheckedChange={(checked) => handleFilterChange('sustainable', checked)}
              />
              <Label htmlFor="sustainable" className="text-sm cursor-pointer">
                Sustainable Products
              </Label>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Materials */}
        <Collapsible 
          open={expandedSections.has('materials')}
          onOpenChange={() => toggleSection('materials')}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
            <h4 className="font-medium">Materials</h4>
            {expandedSections.has('materials') ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            <div className="grid grid-cols-2 gap-2">
              {materialOptions.map(material => (
                <div key={material} className="flex items-center space-x-2">
                  <Checkbox
                    id={`material-${material}`}
                    checked={filters.materials.includes(material)}
                    onCheckedChange={() => toggleArrayFilter('materials', material)}
                  />
                  <Label 
                    htmlFor={`material-${material}`}
                    className="text-xs cursor-pointer"
                  >
                    {material}
                  </Label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Colors */}
        <Collapsible 
          open={expandedSections.has('colors')}
          onOpenChange={() => toggleSection('colors')}
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
            <h4 className="font-medium">Colors</h4>
            {expandedSections.has('colors') ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="grid grid-cols-5 gap-2">
              {colorOptions.map(color => (
                <div 
                  key={color}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 cursor-pointer transition-all",
                    filters.colors.includes(color) 
                      ? "border-black scale-110" 
                      : "border-gray-300 hover:border-gray-400"
                  )}
                  style={{ backgroundColor: color.toLowerCase() }}
                  onClick={() => toggleArrayFilter('colors', color)}
                  title={color}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}

```

# src/hooks/use-session.ts
```ts
// src/hooks/use-session.ts
'use client'

import { useSession as useNextAuthSession } from 'next-auth/react'
import { UserRole, MembershipTier } from '@prisma/client'

/**
 * Extended session data interface
 */
interface ExtendedUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role: UserRole
  membershipTier: MembershipTier
  emailVerified: Date | null
}

interface ExtendedSession {
  user: ExtendedUser
  expires: string
}

/**
 * Custom hook for session management with enhanced type safety and utilities
 */
export function useSession() {
  const session = useNextAuthSession()
  
  return {
    // Core session data
    data: session.data as ExtendedSession | null,
    status: session.status,
    
    // Convenience properties
    user: session.data?.user as ExtendedUser | undefined,
    isLoading: session.status === 'loading',
    isAuthenticated: session.status === 'authenticated',
    isUnauthenticated: session.status === 'unauthenticated',
    
    // Update session
    update: session.update,
  }
}

/**
 * Hook to check if user is authenticated
 */
export function useAuth() {
  const { data, isLoading, isAuthenticated } = useSession()
  
  return {
    user: data?.user,
    isLoading,
    isAuthenticated,
    isGuest: !isAuthenticated && !isLoading,
  }
}

/**
 * Hook to check user role
 */
export function useRole() {
  const { user } = useAuth()
  
  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false
    
    if (Array.isArray(role)) {
      return role.includes(user.role)
    }
    
    return user.role === role
  }
  
  const isAdmin = (): boolean => {
    return hasRole(['ADMIN', 'SUPER_ADMIN'])
  }
  
  const isCustomer = (): boolean => {
    return hasRole(['CUSTOMER', 'VIP'])
  }
  
  const isVIP = (): boolean => {
    return hasRole('VIP') || isAdmin()
  }
  
  return {
    role: user?.role,
    hasRole,
    isAdmin: isAdmin(),
    isCustomer: isCustomer(),
    isVIP: isVIP(),
    isSuperAdmin: hasRole('SUPER_ADMIN'),
  }
}

/**
 * Hook to check membership tier
 */
export function useMembership() {
  const { user } = useAuth()
  
  const hasTier = (tier: MembershipTier | MembershipTier[]): boolean => {
    if (!user) return false
    
    if (Array.isArray(tier)) {
      return tier.includes(user.membershipTier)
    }
    
    return user.membershipTier === tier
  }
  
  const getTierLevel = (): number => {
    if (!user) return 0
    
    const tierLevels: Record<MembershipTier, number> = {
      PEARL: 1,
      SAPPHIRE: 2,
      DIAMOND: 3,
      OBSIDIAN: 4,
    }
    
    return tierLevels[user.membershipTier] || 0
  }
  
  const hasMinimumTier = (minimumTier: MembershipTier): boolean => {
    const userLevel = getTierLevel()
    const minimumLevel = getTierLevel()
    
    return userLevel >= minimumLevel
  }
  
  return {
    tier: user?.membershipTier,
    tierLevel: getTierLevel(),
    hasTier,
    hasMinimumTier,
    isPearl: hasTier('PEARL'),
    isSapphire: hasTier('SAPPHIRE'),
    isDiamond: hasTier('DIAMOND'),
    isObsidian: hasTier('OBSIDIAN'),
    isPremium: hasTier(['SAPPHIRE', 'DIAMOND', 'OBSIDIAN']),
  }
}

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useSession()
  
  if (!isLoading && !isAuthenticated) {
    // In a real app, you might want to redirect here
    // For now, we'll just return the auth state
    console.warn('Authentication required')
  }
  
  return { isAuthenticated, isLoading }
}

/**
 * Hook to require specific role
 */
export function useRequireRole(requiredRole: UserRole | UserRole[]) {
  const { user, isLoading, isAuthenticated } = useSession()
  
  const hasRequiredRole = (): boolean => {
    if (!user) return false
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role)
    }
    
    return user.role === requiredRole || user.role === 'SUPER_ADMIN'
  }
  
  const hasPermission = hasRequiredRole()
  
  if (!isLoading && (!isAuthenticated || !hasPermission)) {
    console.warn(`Role ${requiredRole} required`)
  }
  
  return {
    hasPermission,
    isLoading,
    isAuthenticated,
    userRole: user?.role,
  }
}

/**
 * Hook to require admin role
 */
export function useRequireAdmin() {
  return useRequireRole(['ADMIN', 'SUPER_ADMIN'])
}

/**
 * Hook for session utilities
 */
export function useSessionUtils() {
  const { user, isAuthenticated } = useSession()
  
  const getUserDisplayName = (): string => {
    if (!user) return 'Guest'
    return user.name || user.email?.split('@')[0] || 'User'
  }
  
  const getUserInitials = (): string => {
    if (!user?.name) return 'U'
    
    const names = user.name.split(' ')
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase()
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
  }
  
  const isEmailVerified = (): boolean => {
    return user?.emailVerified !== null
  }
  
  return {
    getUserDisplayName,
    getUserInitials,
    isEmailVerified,
    isAuthenticated,
  }
}

```

# src/server/api/trpc.ts
```ts
// src/server/api/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { type NextRequest } from 'next/server'
import { getServerAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import superjson from 'superjson'
import { ZodError } from 'zod'

/**
 * Create tRPC context
 * This is called for every tRPC request
 */
export const createTRPCContext = async (
  opts: CreateNextContextOptions | { req: NextRequest }
) => {
  const { req } = opts
  
  // Get the session from the request
  const session = await getServerAuthSession()
  
  // Get client IP and user agent for analytics
  const clientIP = req.headers.get?.('x-forwarded-for') || 
                   req.headers.get?.('x-real-ip') || 
                   'unknown'
  
  const userAgent = req.headers.get?.('user-agent') || 'unknown'
  
  return {
    session,
    prisma,
    req,
    clientIP,
    userAgent,
    // Add any other context data needed
  }
}

type Context = Awaited<ReturnType<typeof createTRPCContext>>

/**
 * Initialize tRPC with context
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
        httpStatus: shape.data.httpStatus,
      },
    }
  },
})

/**
 * Create a server-side caller
 */
export const createCallerFactory = t.createCallerFactory

/**
 * Base router and procedures
 */
export const createTRPCRouter = t.router
export const mergeRouters = t.mergeRouters

/**
 * Public procedure - no authentication required
 */
export const publicProcedure = t.procedure.use(async ({ ctx, next }) => {
  // Add performance timing
  const start = Date.now()
  
  const result = await next()
  
  const duration = Date.now() - start
  
  // Log slow queries in development
  if (process.env.NODE_ENV === 'development' && duration > 1000) {
    console.warn(`Slow tRPC query: ${duration}ms`)
  }
  
  return result
})

/**
 * Protected procedure - requires authentication
 */
export const protectedProcedure = t.procedure
  .use(async ({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ 
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to access this resource',
      })
    }
    
    return next({
      ctx: {
        ...ctx,
        session: { ...ctx.session, user: ctx.session.user },
      },
    })
  })

/**
 * Admin procedure - requires admin role
 */
export const adminProcedure = protectedProcedure
  .use(async ({ ctx, next }) => {
    const userRole = ctx.session.user.role as UserRole
    
    if (!['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
      throw new TRPCError({ 
        code: 'FORBIDDEN',
        message: 'Admin access required',
      })
    }
    
    return next({
      ctx: {
        ...ctx,
        session: { ...ctx.session, user: ctx.session.user },
      },
    })
  })

/**
 * VIP procedure - requires VIP or higher role
 */
export const vipProcedure = protectedProcedure
  .use(async ({ ctx, next }) => {
    const userRole = ctx.session.user.role as UserRole
    
    if (!['VIP', 'ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
      throw new TRPCError({ 
        code: 'FORBIDDEN',
        message: 'VIP access required',
      })
    }
    
    return next()
  })

/**
 * Rate limited procedure - for expensive operations
 */
export const rateLimitedProcedure = publicProcedure
  .use(async ({ ctx, next }) => {
    // Simple in-memory rate limiting (in production, use Redis)
    const key = `rate_limit:${ctx.clientIP}`
    
    // For now, just proceed (implement proper rate limiting in production)
    return next()
  })

/**
 * Cached procedure - for frequently accessed data
 */
export const cachedProcedure = publicProcedure
  .use(async ({ ctx, next }) => {
    // Add caching logic here if needed
    return next()
  })

/**
 * Analytics procedure - tracks usage
 */
export const analyticsProcedure = t.procedure
  .use(async ({ ctx, next, path, type }) => {
    // Track API usage
    const start = Date.now()
    
    try {
      const result = await next()
      
      // Log successful requests in development
      if (process.env.NODE_ENV === 'development') {
        const duration = Date.now() - start
        console.log(`tRPC ${type} ${path}: ${duration}ms`)
      }
      
      return result
    } catch (error) {
      // Log errors
      console.error(`tRPC ${type} ${path} error:`, error)
      throw error
    }
  })

/**
 * Helper to create input schema validation
 */
export function createInputSchema<T>(schema: T) {
  return schema
}

/**
 * Helper to create paginated responses
 */
export function createPaginatedResponse<T>(
  items: T[],
  cursor: string | null,
  hasMore: boolean
) {
  return {
    items,
    nextCursor: cursor,
    hasMore,
  }
}

/**
 * Helper to handle database errors
 */
export function handleDatabaseError(error: unknown): never {
  console.error('Database error:', error)
  
  if (error instanceof Error) {
    if (error.message.includes('Unique constraint')) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Resource already exists',
      })
    }
    
    if (error.message.includes('Foreign key constraint')) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Referenced resource not found',
      })
    }
  }
  
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Database operation failed',
  })
}

```

# src/server/api/root.ts
```ts
// src/server/api/root.ts
import { createTRPCRouter } from '@/server/api/trpc'
import { productRouter } from '@/server/api/routers/product'
import { categoryRouter } from '@/server/api/routers/category'
import { brandRouter } from '@/server/api/routers/brand'
import { collectionRouter } from '@/server/api/routers/collection'
import { searchRouter } from '@/server/api/routers/search'
import { userRouter } from '@/server/api/routers/user'
import { cartRouter } from '@/server/api/routers/cart'
import { wishlistRouter } from '@/server/api/routers/wishlist'
import { orderRouter } from '@/server/api/routers/order'
import { aiRouter } from '@/server/api/routers/ai'
import { analyticsRouter } from '@/server/api/routers/analytics'
import { adminRouter } from '@/server/api/routers/admin'

/**
 * This is the primary router for your server.
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  // Core e-commerce routers
  product: productRouter,
  category: categoryRouter,
  brand: brandRouter,
  collection: collectionRouter,
  search: searchRouter,
  
  // User-related routers
  user: userRouter,
  cart: cartRouter,
  wishlist: wishlistRouter,
  order: orderRouter,
  
  // AI and personalization
  ai: aiRouter,
  
  // Analytics and tracking
  analytics: analyticsRouter,
  
  // Admin functionality
  admin: adminRouter,
})

// Export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.product.getAll();
 */
export { createCallerFactory } from '@/server/api/trpc'

/**
 * Helper to get typed API caller
 */
export function createCaller(ctx: any) {
  return appRouter.createCaller(ctx)
}

```

# src/server/api/routers/category.ts
```ts
// src/server/api/routers/category.ts
import { z } from 'zod'
import { createTRPCRouter, publicProcedure, adminProcedure } from '@/server/api/trpc'

export const categoryRouter = createTRPCRouter({
  /**
   * Get all categories with hierarchy
   */
  getAll: publicProcedure
    .input(z.object({
      includeProductCount: z.boolean().default(false),
    }))
    .query(async ({ ctx, input }) => {
      const categories = await ctx.prisma.category.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          displayOrder: 'asc',
        },
        include: {
          children: {
            where: {
              isActive: true,
            },
            orderBy: {
              displayOrder: 'asc',
            },
            include: input.includeProductCount ? {
              _count: {
                select: {
                  products: {
                    where: {
                      status: 'ACTIVE',
                      deletedAt: null,
                    },
                  },
                },
              },
            } : undefined,
          },
          _count: input.includeProductCount ? {
            select: {
              products: {
                where: {
                  status: 'ACTIVE',
                  deletedAt: null,
                },
              },
            },
          } : undefined,
        },
      })

      return categories
    }),

  /**
   * Get category by slug
   */
  getBySlug: publicProcedure
    .input(z.object({
      slug: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.prisma.category.findUnique({
        where: {
          slug: input.slug,
          isActive: true,
        },
        include: {
          parent: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          children: {
            where: {
              isActive: true,
            },
            orderBy: {
              displayOrder: 'asc',
            },
          },
          _count: {
            select: {
              products: {
                where: {
                  status: 'ACTIVE',
                  deletedAt: null,
                },
              },
            },
          },
        },
      })

      if (!category) {
        throw new Error('Category not found')
      }

      return category
    }),
})

```

# src/server/api/routers/product.ts
```ts
// src/server/api/routers/product.ts
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { 
  createTRPCRouter, 
  publicProcedure, 
  protectedProcedure, 
  adminProcedure,
  rateLimitedProcedure,
  handleDatabaseError,
  createPaginatedResponse,
} from '@/server/api/trpc'
import { ProductStatus } from '@prisma/client'

// Input validation schemas
const productFiltersSchema = z.object({
  // Pagination
  limit: z.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
  
  // Filtering
  categoryId: z.string().uuid().optional(),
  brandId: z.string().uuid().optional(),
  collectionId: z.string().uuid().optional(),
  
  // Price filtering
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  currency: z.string().length(3).default('USD'),
  
  // Availability
  inStock: z.boolean().optional(),
  status: z.nativeEnum(ProductStatus).optional().default('ACTIVE'),
  
  // Search
  search: z.string().trim().optional(),
  tags: z.array(z.string()).optional(),
  
  // Sorting
  sortBy: z.enum([
    'newest',
    'oldest', 
    'price-asc',
    'price-desc',
    'name-asc',
    'name-desc',
    'popularity',
    'rating',
    'featured',
  ]).default('newest'),
  
  // Advanced filters
  sustainable: z.boolean().optional(),
  materials: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  
  // AI features
  similarTo: z.string().uuid().optional(), // Product ID for similarity search
  styleMatch: z.boolean().optional(), // Use user's style profile
})

const productCreateSchema = z.object({
  sku: z.string().min(1).max(100),
  slug: z.string().min(1).max(255),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  story: z.string().optional(),
  
  // Categorization
  categoryId: z.string().uuid(),
  brandId: z.string().uuid().optional(),
  
  // Pricing
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  cost: z.number().positive().optional(),
  currency: z.string().length(3).default('USD'),
  
  // Media
  images: z.array(z.string().url()).min(1),
  videos: z.array(z.string().url()).optional(),
  model3D: z.string().url().optional(),
  
  // Status
  status: z.nativeEnum(ProductStatus).default('DRAFT'),
  
  // SEO
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(500).optional(),
  
  // Sustainability
  materials: z.array(z.object({
    name: z.string(),
    percentage: z.number().min(0).max(100),
  })).optional(),
  carbonFootprint: z.number().positive().optional(),
  recyclable: z.boolean().default(false),
  
  // Variants
  variants: z.array(z.object({
    sku: z.string().min(1),
    size: z.string().optional(),
    color: z.string().optional(),
    material: z.string().optional(),
    price: z.number().positive().optional(),
    inventoryQuantity: z.number().int().min(0).default(0),
    weight: z.object({
      value: z.number().positive(),
      unit: z.enum(['kg', 'lb', 'g', 'oz']).default('kg'),
    }).optional(),
    dimensions: z.object({
      length: z.number().positive(),
      width: z.number().positive(),
      height: z.number().positive(),
      unit: z.enum(['cm', 'in', 'mm']).default('cm'),
    }).optional(),
  })).min(1),
  
  // Collections
  collectionIds: z.array(z.string().uuid()).optional(),
})

export const productRouter = createTRPCRouter({
  /**
   * Get all products with advanced filtering and pagination
   */
  getAll: publicProcedure
    .input(productFiltersSchema)
    .query(async ({ ctx, input }) => {
      try {
        const {
          limit,
          cursor,
          categoryId,
          brandId,
          collectionId,
          minPrice,
          maxPrice,
          currency,
          inStock,
          status,
          search,
          tags,
          sortBy,
          sustainable,
          materials,
          colors,
          sizes,
          similarTo,
          styleMatch,
        } = input

        // Build where clause
        const where: any = {
          status,
          deletedAt: null,
        }

        // Category filtering
        if (categoryId) {
          where.categoryId = categoryId
        }

        // Brand filtering
        if (brandId) {
          where.brandId = brandId
        }

        // Collection filtering
        if (collectionId) {
          where.collections = {
            some: {
              collectionId,
            },
          }
        }

        // Price filtering
        if (minPrice !== undefined || maxPrice !== undefined) {
          where.price = {}
          if (minPrice !== undefined) where.price.gte = minPrice
          if (maxPrice !== undefined) where.price.lte = maxPrice
        }

        // Search functionality
        if (search) {
          where.OR = [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              styleTags: {
                hasSome: search.split(' '),
              },
            },
          ]
        }

        // Tag filtering
        if (tags && tags.length > 0) {
          where.styleTags = {
            hassome: tags,
          }
        }

        // Stock filtering
        if (inStock) {
          where.variants = {
            some: {
              inventoryQuantity: {
                gt: 0,
              },
              isAvailable: true,
            },
          }
        }

        // Sustainability filtering
        if (sustainable) {
          where.recyclable = true
        }

        // Material filtering
        if (materials && materials.length > 0) {
          where.materials = {
            some: {
              path: ['name'],
              in: materials,
            },
          }
        }

        // Color filtering (requires variants)
        if (colors && colors.length > 0) {
          where.variants = {
            some: {
              color: {
                in: colors,
              },
            },
          }
        }

        // Size filtering (requires variants)
        if (sizes && sizes.length > 0) {
          where.variants = {
            some: {
              size: {
                in: sizes,
              },
            },
          }
        }

        // Build orderBy clause
        let orderBy: any = {}
        switch (sortBy) {
          case 'newest':
            orderBy = { createdAt: 'desc' }
            break
          case 'oldest':
            orderBy = { createdAt: 'asc' }
            break
          case 'price-asc':
            orderBy = { price: 'asc' }
            break
          case 'price-desc':
            orderBy = { price: 'desc' }
            break
          case 'name-asc':
            orderBy = { name: 'asc' }
            break
          case 'name-desc':
            orderBy = { name: 'desc' }
            break
          case 'popularity':
            orderBy = { viewCount: 'desc' }
            break
          case 'featured':
            orderBy = { featuredAt: 'desc' }
            break
          default:
            orderBy = { createdAt: 'desc' }
        }

        // Execute query with pagination
        const products = await ctx.prisma.product.findMany({
          where,
          orderBy,
          take: limit + 1, // Take one extra to determine if there are more
          cursor: cursor ? { id: cursor } : undefined,
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            brand: {
              select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true,
                isVerified: true,
              },
            },
            variants: {
              where: {
                isAvailable: true,
              },
              orderBy: {
                price: 'asc',
              },
              take: 5, // Limit variants for performance
              select: {
                id: true,
                sku: true,
                size: true,
                color: true,
                price: true,
                inventoryQuantity: true,
              },
            },
            media: {
              where: {
                mediaType: 'image',
              },
              orderBy: {
                displayOrder: 'asc',
              },
              take: 3, // Limit images for performance
              select: {
                id: true,
                url: true,
                thumbnailUrl: true,
                altText: true,
                isPrimary: true,
              },
            },
            _count: {
              select: {
                reviews: true,
                productViews: true,
              },
            },
          },
        })

        // Determine if there are more results
        let hasMore = false
        let nextCursor: string | undefined = undefined

        if (products.length > limit) {
          hasMore = true
          const nextItem = products.pop()
          nextCursor = nextItem!.id
        }

        // Calculate average rating for each product
        const productsWithRating = await Promise.all(
          products.map(async (product) => {
            const avgRating = await ctx.prisma.review.aggregate({
              where: {
                productId: product.id,
                status: 'APPROVED',
              },
              _avg: {
                rating: true,
              },
            })

            return {
              ...product,
              averageRating: avgRating._avg.rating || 0,
              reviewCount: product._count.reviews,
              viewCount: product._count.productViews,
            }
          })
        )

        return createPaginatedResponse(productsWithRating, nextCursor, hasMore)
      } catch (error) {
        console.error('Error fetching products:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch products',
        })
      }
    }),

  /**
   * Get single product by slug with full details
   */
  getBySlug: publicProcedure
    .input(z.object({ 
      slug: z.string(),
      trackView: z.boolean().default(true),
    }))
    .query(async ({ ctx, input }) => {
      try {
        const { slug, trackView } = input

        const product = await ctx.prisma.product.findUnique({
          where: { 
            slug,
            deletedAt: null,
          },
          include: {
            category: {
              include: {
                parent: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
            brand: {
              select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true,
                description: true,
                story: true,
                isVerified: true,
                sustainabilityScore: true,
                certifications: true,
                websiteUrl: true,
                instagramHandle: true,
              },
            },
            variants: {
              where: {
                isAvailable: true,
              },
              orderBy: [
                { price: 'asc' },
                { size: 'asc' },
              ],
              include: {
                media: {
                  orderBy: {
                    displayOrder: 'asc',
                  },
                },
              },
            },
            media: {
              orderBy: {
                displayOrder: 'asc',
              },
            },
            collections: {
              include: {
                collection: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    description: true,
                    heroImageUrl: true,
                  },
                },
              },
            },
            reviews: {
              where: {
                status: 'APPROVED',
              },
              orderBy: {
                createdAt: 'desc',
              },
              take: 10,
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
                  },
                },
              },
            },
            _count: {
              select: {
                reviews: {
                  where: {
                    status: 'APPROVED',
                  },
                },
                productViews: true,
              },
            },
          },
        })

        if (!product || product.status !== 'ACTIVE') {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Product not found',
          })
        }

        // Track product view if requested and user is present
        if (trackView) {
          // Don't await this - fire and forget
          ctx.prisma.productView.create({
            data: {
              userId: ctx.session?.user?.id,
              sessionId: ctx.session ? undefined : 'anonymous', // Handle anonymous users
              source: 'product_page',
              createdAt: new Date(),
            },
          }).catch(console.error)

          // Increment view count
          ctx.prisma.product.update({
            where: { id: product.id },
            data: {
              viewCount: {
                increment: 1,
              },
            },
          }).catch(console.error)
        }

        // Calculate average rating
        const avgRating = await ctx.prisma.review.aggregate({
          where: {
            productId: product.id,
            status: 'APPROVED',
          },
          _avg: {
            rating: true,
          },
        })

        // Get related products (same category)
        const relatedProducts = await ctx.prisma.product.findMany({
          where: {
            categoryId: product.categoryId,
            id: {
              not: product.id,
            },
            status: 'ACTIVE',
            deletedAt: null,
          },
          take: 6,
          orderBy: {
            viewCount: 'desc',
          },
          include: {
            brand: {
              select: {
                name: true,
                logoUrl: true,
              },
            },
            media: {
              where: {
                isPrimary: true,
                mediaType: 'image',
              },
              take: 1,
            },
            variants: {
              orderBy: {
                price: 'asc',
              },
              take: 1,
            },
          },
        })

        return {
          ...product,
          averageRating: avgRating._avg.rating || 0,
          reviewCount: product._count.reviews,
          totalViews: product._count.productViews,
          relatedProducts,
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        
        console.error('Error fetching product:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch product',
        })
      }
    }),

  /**
   * Get featured products for homepage
   */
  getFeatured: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(20).default(8),
      categoryId: z.string().uuid().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { limit, categoryId } = input

      const where: any = {
        status: 'ACTIVE',
        deletedAt: null,
        featuredAt: {
          not: null,
        },
      }

      if (categoryId) {
        where.categoryId = categoryId
      }

      const products = await ctx.prisma.product.findMany({
        where,
        orderBy: {
          featuredAt: 'desc',
        },
        take: limit,
        include: {
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
          brand: {
            select: {
              name: true,
              logoUrl: true,
              isVerified: true,
            },
          },
          media: {
            where: {
              isPrimary: true,
              mediaType: 'image',
            },
            take: 1,
          },
          variants: {
            orderBy: {
              price: 'asc',
            },
            take: 1,
          },
        },
      })

      return products
    }),

  /**
   * Get trending products based on recent views and purchases
   */
  getTrending: rateLimitedProcedure
    .input(z.object({
      limit: z.number().min(1).max(20).default(8),
      timeframe: z.enum(['24h', '7d', '30d']).default('7d'),
    }))
    .query(async ({ ctx, input }) => {
      const { limit, timeframe } = input

      // Calculate date threshold based on timeframe
      const now = new Date()
      let dateThreshold: Date

      switch (timeframe) {
        case '24h':
          dateThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000)
          break
        case '7d':
          dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case '30d':
          dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
      }

      // Get products with most views/purchases in timeframe
      const trendingProducts = await ctx.prisma.product.findMany({
        where: {
          status: 'ACTIVE',
          deletedAt: null,
          productViews: {
            some: {
              createdAt: {
                gte: dateThreshold,
              },
            },
          },
        },
        include: {
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
          brand: {
            select: {
              name: true,
              logoUrl: true,
              isVerified: true,
            },
          },
          media: {
            where: {
              isPrimary: true,
              mediaType: 'image',
            },
            take: 1,
          },
          variants: {
            orderBy: {
              price: 'asc',
            },
            take: 1,
          },
          _count: {
            select: {
              productViews: {
                where: {
                  createdAt: {
                    gte: dateThreshold,
                  },
                },
              },
            },
          },
        },
        orderBy: {
          viewCount: 'desc',
        },
        take: limit,
      })

      return trendingProducts
    }),

  /**
   * Create a new product (admin only)
   */
  create: adminProcedure
    .input(productCreateSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.prisma.$transaction(async (tx) => {
          // Create the product
          const product = await tx.product.create({
            data: {
              sku: input.sku,
              slug: input.slug,
              name: input.name,
              description: input.description,
              story: input.story,
              categoryId: input.categoryId,
              brandId: input.brandId,
              price: input.price,
              compareAtPrice: input.compareAtPrice,
              cost: input.cost,
              currency: input.currency,
              status: input.status,
              metaTitle: input.metaTitle,
              metaDescription: input.metaDescription,
              materials: input.materials || [],
              carbonFootprint: input.carbonFootprint,
              recyclable: input.recyclable,
            },
          })

          // Create product media
          if (input.images.length > 0) {
            const mediaData = input.images.map((url, index) => ({
              productId: product.id,
              mediaType: 'image' as const,
              url,
              displayOrder: index,
              isPrimary: index === 0,
            }))

            await tx.productMedia.createMany({
              data: mediaData,
            })
          }

          // Create product variants
          const variantData = input.variants.map((variant) => ({
            productId: product.id,
            sku: variant.sku,
            size: variant.size,
            color: variant.color,
            material: variant.material,
            price: variant.price,
            inventoryQuantity: variant.inventoryQuantity,
            weightValue: variant.weight?.value,
            weightUnit: variant.weight?.unit,
            dimensions: variant.dimensions,
          }))

          await tx.productVariant.createMany({
            data: variantData,
          })

          // Add to collections if specified
          if (input.collectionIds && input.collectionIds.length > 0) {
            const collectionData = input.collectionIds.map((collectionId) => ({
              productId: product.id,
              collectionId,
            }))

            await tx.collectionProduct.createMany({
              data: collectionData,
            })
          }

          // Create audit log
          await tx.auditLog.create({
            data: {
              userId: ctx.session.user.id,
              action: 'PRODUCT_CREATED',
              entityType: 'PRODUCT',
              entityId: product.id,
              newValues: {
                name: product.name,
                sku: product.sku,
                price: product.price,
              },
            },
          })

          return product
        })

        return result
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  /**
   * Update product (admin only)
   */
  update: adminProcedure
    .input(z.object({
      id: z.string().uuid(),
      data: productCreateSchema.partial(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, data } = input

        const product = await ctx.prisma.product.update({
          where: { id },
          data: {
            ...data,
            updatedAt: new Date(),
          },
        })

        // Create audit log
        await ctx.prisma.auditLog.create({
          data: {
            userId: ctx.session.user.id,
            action: 'PRODUCT_UPDATED',
            entityType: 'PRODUCT',
            entityId: product.id,
            newValues: data,
          },
        })

        return product
      } catch (error) {
        handleDatabaseError(error)
      }
    }),

  /**
   * Delete product (admin only)
   */
  delete: adminProcedure
    .input(z.object({
      id: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Soft delete
        const product = await ctx.prisma.product.update({
          where: { id: input.id },
          data: {
            deletedAt: new Date(),
            status: 'ARCHIVED',
          },
        })

        // Create audit log
        await ctx.prisma.auditLog.create({
          data: {
            userId: ctx.session.user.id,
            action: 'PRODUCT_DELETED',
            entityType: 'PRODUCT',
            entityId: product.id,
          },
        })

        return { success: true }
      } catch (error) {
        handleDatabaseError(error)
      }
    }),
})

```

# src/server/api/routers/search.ts
```ts
// src/server/api/routers/search.ts
import { z } from 'zod'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '@/server/api/trpc'

export const searchRouter = createTRPCRouter({
  /**
   * Search products with advanced filtering
   */
  products: publicProcedure
    .input(z.object({
      query: z.string().trim().min(1),
      limit: z.number().min(1).max(50).default(20),
      filters: z.object({
        categoryId: z.string().uuid().optional(),
        brandId: z.string().uuid().optional(),
        minPrice: z.number().min(0).optional(),
        maxPrice: z.number().min(0).optional(),
        inStock: z.boolean().optional(),
      }).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { query, limit, filters } = input

      // Log search for analytics
      if (ctx.session?.user) {
        ctx.prisma.searchLog.create({
          data: {
            userId: ctx.session.user.id,
            query,
            filters: filters || {},
          },
        }).catch(console.error)
      }

      // Build search conditions
      const where: any = {
        status: 'ACTIVE',
        deletedAt: null,
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            styleTags: {
              hasSome: query.split(' '),
            },
          },
        ],
      }

      // Apply filters
      if (filters) {
        if (filters.categoryId) {
          where.categoryId = filters.categoryId
        }
        if (filters.brandId) {
          where.brandId = filters.brandId
        }
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
          where.price = {}
          if (filters.minPrice !== undefined) where.price.gte = filters.minPrice
          if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice
        }
        if (filters.inStock) {
          where.variants = {
            some: {
              inventoryQuantity: { gt: 0 },
              isAvailable: true,
            },
          }
        }
      }

      const products = await ctx.prisma.product.findMany({
        where,
        take: limit,
        orderBy: [
          { viewCount: 'desc' },
          { createdAt: 'desc' },
        ],
        include: {
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
          brand: {
            select: {
              name: true,
              logoUrl: true,
              isVerified: true,
            },
          },
          media: {
            where: {
              isPrimary: true,
              mediaType: 'image',
            },
            take: 1,
          },
          variants: {
            orderBy: {
              price: 'asc',
            },
            take: 1,
          },
        },
      })

      return products
    }),

  /**
   * Get search suggestions
   */
  suggestions: publicProcedure
    .input(z.object({
      query: z.string().trim().min(1),
      limit: z.number().min(1).max(10).default(5),
    }))
    .query(async ({ ctx, input }) => {
      const { query, limit } = input

      // Get product name suggestions
      const productSuggestions = await ctx.prisma.product.findMany({
        where: {
          status: 'ACTIVE',
          deletedAt: null,
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        select: {
          name: true,
          slug: true,
        },
        take: limit,
        orderBy: {
          viewCount: 'desc',
        },
      })

      // Get brand suggestions
      const brandSuggestions = await ctx.prisma.brand.findMany({
        where: {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        select: {
          name: true,
          slug: true,
        },
        take: 3,
      })

      // Get category suggestions
      const categorySuggestions = await ctx.prisma.category.findMany({
        where: {
          isActive: true,
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        select: {
          name: true,
          slug: true,
        },
        take: 3,
      })

      return {
        products: productSuggestions,
        brands: brandSuggestions,
        categories: categorySuggestions,
      }
    }),
})

```

# src/middleware.ts
```ts
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { UserRole } from '@prisma/client'

// Define route patterns and their required permissions
const routeConfig = {
  // Public routes (no authentication required)
  public: [
    '/',
    '/products',
    '/collections',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/api/products',
    '/api/collections',
    '/api/search',
  ],
  
  // Authentication routes (redirect if already authenticated)
  auth: ['/login', '/register', '/verify-request', '/reset-password'],
  
  // Protected routes (authentication required)
  protected: [
    '/account',
    '/checkout',
    '/orders',
    '/wishlist',
    '/profile',
    '/settings',
  ],
  
  // Admin routes (admin role required)
  admin: ['/admin'],
  
  // API routes that require authentication
  apiProtected: [
    '/api/account',
    '/api/orders',
    '/api/wishlist',
    '/api/cart',
    '/api/checkout',
    '/api/user',
  ],
  
  // API routes that require admin role
  apiAdmin: ['/api/admin'],
}

/**
 * Check if a path matches any pattern in an array
 */
function matchesPattern(path: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    if (pattern.endsWith('*')) {
      return path.startsWith(pattern.slice(0, -1))
    }
    return path === pattern || path.startsWith(pattern + '/')
  })
}

/**
 * Get route type for the given pathname
 */
function getRouteType(pathname: string): {
  type: 'public' | 'auth' | 'protected' | 'admin' | 'apiProtected' | 'apiAdmin'
  requiresAuth: boolean
  requiredRole?: UserRole
} {
  // Check admin routes first (most restrictive)
  if (matchesPattern(pathname, routeConfig.admin)) {
    return { type: 'admin', requiresAuth: true, requiredRole: 'ADMIN' }
  }
  
  if (matchesPattern(pathname, routeConfig.apiAdmin)) {
    return { type: 'apiAdmin', requiresAuth: true, requiredRole: 'ADMIN' }
  }
  
  // Check protected routes
  if (matchesPattern(pathname, routeConfig.protected)) {
    return { type: 'protected', requiresAuth: true }
  }
  
  if (matchesPattern(pathname, routeConfig.apiProtected)) {
    return { type: 'apiProtected', requiresAuth: true }
  }
  
  // Check auth routes
  if (matchesPattern(pathname, routeConfig.auth)) {
    return { type: 'auth', requiresAuth: false }
  }
  
  // Default to public
  return { type: 'public', requiresAuth: false }
}

/**
 * Main middleware function
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip middleware for static files, API routes we don't want to protect, etc.
  if (
    pathname.includes('/_next/') ||
    pathname.includes('/favicon.ico') ||
    pathname.includes('/api/auth/') ||
    pathname.includes('/api/webhooks/') ||
    pathname.includes('/api/health') ||
    pathname.includes('/api/public/')
  ) {
    return NextResponse.next()
  }
  
  // Get authentication token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })
  
  // Determine route requirements
  const routeInfo = getRouteType(pathname)
  
  // Handle authentication routes
  if (routeInfo.type === 'auth') {
    // Redirect authenticated users away from auth pages
    if (token) {
      const redirectUrl = request.nextUrl.searchParams.get('callbackUrl') || '/account'
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }
    return NextResponse.next()
  }
  
  // Handle routes that require authentication
  if (routeInfo.requiresAuth) {
    if (!token) {
      // Not authenticated - redirect to login
      const loginUrl = new URL('/login', request.url)
      
      // For API routes, return JSON error
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Authentication required', code: 'AUTH_REQUIRED' },
          { status: 401 }
        )
      }
      
      // For page routes, redirect to login with callback
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // Check role requirements
    if (routeInfo.requiredRole) {
      const userRole = token.role as UserRole
      
      // Super admin can access everything
      if (userRole !== 'SUPER_ADMIN') {
        // Check specific role requirements
        if (routeInfo.requiredRole === 'ADMIN' && !['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
          // For API routes, return JSON error
          if (pathname.startsWith('/api/')) {
            return NextResponse.json(
              { error: 'Insufficient permissions', code: 'FORBIDDEN' },
              { status: 403 }
            )
          }
          
          // For page routes, redirect to unauthorized page
          return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
      }
    }
  }
  
  // Add security headers
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // CSP for enhanced security
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://maps.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https: http:",
    "media-src 'self' blob: https:",
    "connect-src 'self' https: wss:",
    "frame-src 'self' https://js.stripe.com https://www.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)
  
  // Add user info to headers for server components (if authenticated)
  if (token) {
    response.headers.set('x-user-id', token.id)
    response.headers.set('x-user-role', token.role)
    response.headers.set('x-user-tier', token.membershipTier)
  }
  
  return response
}

/**
 * Configure which routes to run middleware on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}

```

# src/lib/api.ts
```ts
// src/lib/api.ts
import { createTRPCReact } from '@trpc/react-query'
import { type AppRouter } from '@/server/api/root'

/**
 * A set of type-safe react-query hooks for your tRPC API.
 */
export const api = createTRPCReact<AppRouter>()

```

# src/lib/prisma.ts
```ts
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

// Prevent multiple Prisma clients in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
  
  // Datasource configuration
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  
  // Error formatting
  errorFormat: 'pretty',
  
  // Connection pool settings for performance
  // These will be automatically configured in production
})

// Prevent hot reload from creating new instances
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

/**
 * Helper function to safely execute database operations
 */
export async function withDatabase<T>(
  operation: (db: PrismaClient) => Promise<T>
): Promise<T> {
  try {
    return await operation(prisma)
  } catch (error) {
    console.error('Database operation failed:', error)
    throw error
  }
}

/**
 * Helper function for database health check
 */
export async function isDatabaseHealthy(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch {
    return false
  }
}

/**
 * Helper function to get database metrics
 */
export async function getDatabaseMetrics() {
  try {
    const [userCount, productCount, orderCount] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
    ])
    
    return {
      users: userCount,
      products: productCount,
      orders: orderCount,
      healthy: true,
    }
  } catch (error) {
    return {
      users: 0,
      products: 0,
      orders: 0,
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

```

# src/lib/trpc.ts
```ts
// src/lib/trpc.ts
import { httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'
import superjson from 'superjson'

import { type AppRouter } from '@/server/api/root'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '' // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}

/**
 * A set of type-safe react-query hooks for your tRPC API.
 */
export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      /**
       * Transformer used for data de-serialization from the server.
       */
      transformer: superjson,

      /**
       * Links used to determine request flow from client to server.
       */
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          headers() {
            // Include auth headers if needed
            return {}
          },
        }),
      ],

      /**
       * React Query options
       */
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: (failureCount, error: any) => {
              // Don't retry on 4xx errors
              if (error?.data?.httpStatus >= 400 && error?.data?.httpStatus < 500) {
                return false
              }
              // Retry up to 3 times for other errors
              return failureCount < 3
            },
          },
          mutations: {
            retry: false,
          },
        },
      },
    }
  },
  /**
   * Whether tRPC should await queries when server rendering pages.
   */
  ssr: false,
})

/**
 * Inference helper for inputs.
 */
export type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helper for outputs.
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>

```

# src/lib/auth.ts
```ts
// src/lib/auth.ts
import { NextAuthOptions, DefaultSession, getServerSession } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import { UserRole, MembershipTier } from '@prisma/client'
import { createTransport } from 'nodemailer'

// Extend the built-in session types
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: UserRole
      membershipTier: MembershipTier
      emailVerified: Date | null
    } & DefaultSession['user']
  }

  interface User {
    id: string
    role: UserRole
    membershipTier: MembershipTier
    emailVerified: Date | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
    membershipTier: MembershipTier
    emailVerified: Date | null
  }
}

// Custom PrismaAdapter to handle our UUID-based schema
const customPrismaAdapter = () => {
  const adapter = PrismaAdapter(prisma)
  
  return {
    ...adapter,
    
    // Override createUser to handle our custom schema
    async createUser(user: any) {
      const newUser = await prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
          avatarUrl: user.image,
          emailVerified: user.emailVerified,
          role: 'CUSTOMER' as UserRole,
          membershipTier: 'PEARL' as MembershipTier,
          aiConsent: true,
          personalizationLevel: 5,
          preferredCurrency: 'USD',
          preferredLanguage: 'en',
          timezone: 'UTC',
        },
      })
      
      // Create audit log for user creation
      await prisma.auditLog.create({
        data: {
          userId: newUser.id,
          action: 'USER_CREATED',
          entityType: 'USER',
          entityId: newUser.id,
          newValues: { email: newUser.email, name: newUser.name },
        },
      })
      
      return {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        image: newUser.avatarUrl,
        emailVerified: newUser.emailVerified,
        role: newUser.role,
        membershipTier: newUser.membershipTier,
      }
    },

    // Override createSession to use our sessions table
    async createSession({ sessionToken, userId, expires }) {
      const session = await prisma.session.create({
        data: {
          sessionToken,
          userId,
          expiresAt: expires,
        },
      })
      
      return {
        sessionToken: session.sessionToken,
        userId: session.userId,
        expires: session.expiresAt,
      }
    },

    // Override getSessionAndUser to include our custom fields
    async getSessionAndUser(sessionToken: string) {
      const sessionAndUser = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      })
      
      if (!sessionAndUser) return null
      
      const { user, ...session } = sessionAndUser
      
      return {
        session: {
          sessionToken: session.sessionToken,
          userId: session.userId,
          expires: session.expiresAt,
        },
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatarUrl,
          emailVerified: user.emailVerified,
          role: user.role,
          membershipTier: user.membershipTier,
        },
      }
    },

    // Override updateUser to handle our schema
    async updateUser(user: any) {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          email: user.email,
          name: user.name,
          avatarUrl: user.image,
          emailVerified: user.emailVerified,
          updatedAt: new Date(),
        },
      })
      
      return {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        image: updatedUser.avatarUrl,
        emailVerified: updatedUser.emailVerified,
        role: updatedUser.role,
        membershipTier: updatedUser.membershipTier,
      }
    },

    // Override linkAccount for OAuth
    async linkAccount(account: any) {
      await prisma.oAuthAccount.create({
        data: {
          userId: account.userId,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at ? new Date(account.expires_at * 1000) : null,
          tokenType: account.token_type,
          scope: account.scope,
          idToken: account.id_token,
          sessionState: account.session_state,
        },
      })
      
      return account
    },
  }
}

// Email transport configuration
const createEmailTransport = () => {
  if (!process.env.EMAIL_SERVER_HOST) {
    console.warn('Email transport not configured')
    return null
  }
  
  return createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: process.env.EMAIL_SERVER_PORT === '465',
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })
}

export const authOptions: NextAuthOptions = {
  adapter: customPrismaAdapter(),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/login',
    signUp: '/register',
    error: '/login',
    verifyRequest: '/verify-request',
    newUser: '/welcome',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM || 'noreply@luxeverse.ai',
      async sendVerificationRequest({ identifier: email, url, provider }) {
        const transport = createEmailTransport()
        if (!transport) return
        
        const { host } = new URL(url)
        
        await transport.sendMail({
          to: email,
          from: provider.from,
          subject: `Sign in to ${host}`,
          text: `Sign in to ${host}\n${url}\n\n`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #FF006E, #00D9FF); padding: 40px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 2rem;">LuxeVerse</h1>
                <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your luxury experience awaits</p>
              </div>
              <div style="padding: 40px; background: #fafafa;">
                <h2 style="color: #333; margin-bottom: 20px;">Sign in to continue</h2>
                <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                  Click the button below to securely sign in to your LuxeVerse account:
                </p>
                <div style="text-align: center;">
                  <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #FF006E, #8B00FF); color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: 600;">
                    Sign In to LuxeVerse
                  </a>
                </div>
                <p style="color: #999; font-size: 0.9rem; margin-top: 30px; text-align: center;">
                  This link will expire in 24 hours. If you didn't request this, please ignore this email.
                </p>
              </div>
            </div>
          `,
        })
      },
    }),
    
    CredentialsProvider({
      id: 'credentials',
      name: 'Email and Password',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'you@luxeverse.ai',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: '••••••••',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password')
        }

        // Find user in database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
          include: {
            _count: {
              select: { loyaltyPoints: true },
            },
          },
        })

        if (!user || !user.passwordHash) {
          throw new Error('No account found with this email')
        }

        // Verify password
        const isPasswordValid = await compare(credentials.password, user.passwordHash)
        if (!isPasswordValid) {
          throw new Error('Invalid password')
        }

        // Update login count and last login
        await prisma.user.update({
          where: { id: user.id },
          data: {
            lastLoginAt: new Date(),
            loginCount: { increment: 1 },
          },
        })

        // Create audit log
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: 'USER_LOGIN',
            entityType: 'USER',
            entityId: user.id,
          },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatarUrl,
          role: user.role,
          membershipTier: user.membershipTier,
          emailVerified: user.emailVerified,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.role = user.role
        token.membershipTier = user.membershipTier
        token.emailVerified = user.emailVerified
      }

      // Handle token refresh or updates
      if (trigger === 'update' && session) {
        // Update token with new session data
        if (session.name) token.name = session.name
        if (session.email) token.email = session.email
      }

      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.membershipTier = token.membershipTier
        session.user.emailVerified = token.emailVerified
      }

      return session
    },

    async signIn({ user, account, profile, email, credentials }) {
      // For OAuth providers, ensure email is verified
      if (account?.provider === 'google') {
        return true
      }

      // For credentials, user is already validated in authorize
      if (account?.provider === 'credentials') {
        return true
      }

      // For email provider, allow sign in
      if (account?.provider === 'email') {
        return true
      }

      return true
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      
      return baseUrl
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`User ${user.email} signed in via ${account?.provider}`)
      
      // Track login in analytics
      if (user.id) {
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: 'USER_SIGNIN',
            entityType: 'USER',
            entityId: user.id,
            newValues: {
              provider: account?.provider,
              isNewUser,
            },
          },
        }).catch(console.error)
      }
    },

    async signOut({ session, token }) {
      console.log(`User signed out`)
      
      if (session?.user?.id) {
        await prisma.auditLog.create({
          data: {
            userId: session.user.id,
            action: 'USER_SIGNOUT',
            entityType: 'USER',
            entityId: session.user.id,
          },
        }).catch(console.error)
      }
    },

    async createUser({ user }) {
      console.log(`New user created: ${user.email}`)
      
      // Initialize user data
      if (user.id) {
        // Create default wishlist
        await prisma.wishlist.create({
          data: {
            userId: user.id,
            name: 'My Wishlist',
          },
        }).catch(console.error)

        // Award welcome bonus points
        await prisma.loyaltyPoint.create({
          data: {
            userId: user.id,
            type: 'earned',
            points: 1000,
            balanceAfter: 1000,
            source: 'welcome_bonus',
            description: 'Welcome to LuxeVerse! Enjoy 1000 bonus points.',
          },
        }).catch(console.error)
      }
    },
  },
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      console.error(`NextAuth Error: ${code}`, metadata)
    },
    warn(code) {
      console.warn(`NextAuth Warning: ${code}`)
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`NextAuth Debug: ${code}`, metadata)
      }
    },
  },
}

/**
 * Helper function to get server-side session
 */
export const getServerAuthSession = () => getServerSession(authOptions)

/**
 * Helper function to require authentication on server
 */
export const requireAuth = async () => {
  const session = await getServerAuthSession()
  if (!session) {
    throw new Error('Authentication required')
  }
  return session
}

/**
 * Helper function to require specific role
 */
export const requireRole = async (requiredRole: UserRole) => {
  const session = await requireAuth()
  if (session.user.role !== requiredRole && session.user.role !== 'SUPER_ADMIN') {
    throw new Error(`${requiredRole} role required`)
  }
  return session
}

/**
 * Helper function to require admin role
 */
export const requireAdmin = async () => {
  const session = await requireAuth()
  if (!['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    throw new Error('Admin role required')
  }
  return session
}

```

