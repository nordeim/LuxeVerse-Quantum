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
