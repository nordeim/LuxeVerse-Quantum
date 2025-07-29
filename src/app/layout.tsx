import type { Metadata, Viewport } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import localFont from 'next/font/local'
import { headers } from 'next/headers'
import '@/styles/globals.css'

// Font configurations
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

const monoFont = localFont({
  src: '../fonts/JetBrainsMono-Regular.woff2',
  variable: '--font-mono',
  display: 'swap',
})

// Metadata configuration
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://luxeverse.ai'
  ),
  title: {
    default: 'LuxeVerse - Luxury E-Commerce Redefined',
    template: '%s | LuxeVerse',
  },
  description:
    'Experience the future of luxury shopping with AI-powered personalization, cinematic visuals, and sustainable fashion.',
  keywords: [
    'luxury fashion',
    'designer clothing',
    'high-end accessories',
    'AI personal stylist',
    'sustainable luxury',
    'virtual try-on',
    'exclusive collections',
    'premium e-commerce',
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
    title: 'LuxeVerse - Luxury E-Commerce Redefined',
    description:
      'Experience the future of luxury shopping with AI-powered personalization.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LuxeVerse - Luxury E-Commerce',
      },
      {
        url: '/og-image-square.jpg',
        width: 600,
        height: 600,
        alt: 'LuxeVerse',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LuxeVerse - Luxury E-Commerce Redefined',
    description:
      'Experience the future of luxury shopping with AI-powered personalization.',
    creator: '@luxeverse',
    images: ['/twitter-image.jpg'],
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
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
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
      'en-US': 'https://luxeverse.ai/en-US',
      'fr-FR': 'https://luxeverse.ai/fr-FR',
      'es-ES': 'https://luxeverse.ai/es-ES',
      'de-DE': 'https://luxeverse.ai/de-DE',
      'it-IT': 'https://luxeverse.ai/it-IT',
      'ja-JP': 'https://luxeverse.ai/ja-JP',
      'zh-CN': 'https://luxeverse.ai/zh-CN',
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-site-verification-code',
  },
  category: 'shopping',
}

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0B' },
  ],
}

// Root layout component
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
      className={`${inter.variable} ${fraunces.variable} ${monoFont.variable}`}
    >
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://cdn.luxeverse.ai" />
        <link rel="preconnect" href="https://api.luxeverse.ai" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://cdn.luxeverse.ai" />
        <link rel="dns-prefetch" href="https://api.luxeverse.ai" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />
        
        {/* Preload critical assets */}
        <link
          rel="preload"
          href="/fonts/JetBrainsMono-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* PWA */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LuxeVerse" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Microsoft */}
        <meta name="msapplication-TileColor" content="#0A0A0B" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Schema.org markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'LuxeVerse',
              description:
                'Luxury e-commerce platform with AI-powered personalization',
              url: 'https://luxeverse.ai',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://luxeverse.ai/search?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
          nonce={nonce || undefined}
        />
      </head>
      <body
        className={`${inter.className} font-sans antialiased selection-luxury`}
      >
        {/* Skip to content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Skip to content
        </a>
        
        {/* Main app */}
        <div className="relative flex min-h-screen flex-col">
          {/* Providers will be added here in Phase 2 */}
          {children}
        </div>
        
        {/* Portal root for modals */}
        <div id="portal-root" />
      </body>
    </html>
  )
}
