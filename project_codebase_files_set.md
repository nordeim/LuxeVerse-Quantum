# .env.example
```example
# =============================================
# LUXEVERSE ENVIRONMENT CONFIGURATION
# =============================================
# Copy this file to .env.local and fill in the values
# DO NOT commit .env.local to version control

# ---------------------------------------------
# APPLICATION
# ---------------------------------------------
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000"

# ---------------------------------------------
# DATABASE
# ---------------------------------------------
# PostgreSQL connection string
DATABASE_URL="postgresql://postgres:password@localhost:5432/luxeverse_dev?schema=public"

# Direct connection URL for migrations (if using connection pooling)
DIRECT_DATABASE_URL="postgresql://postgres:password@localhost:5432/luxeverse_dev?schema=public"

# ---------------------------------------------
# AUTHENTICATION (NextAuth.js)
# ---------------------------------------------
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Magic Link Email Provider
EMAIL_SERVER_HOST="smtp.resend.com"
EMAIL_SERVER_PORT="465"
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_FROM="LuxeVerse <noreply@luxeverse.ai>"

# ---------------------------------------------
# PAYMENT PROCESSING (Stripe)
# ---------------------------------------------
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""

# Stripe webhook endpoints (for local development with Stripe CLI)
STRIPE_WEBHOOK_ENDPOINT_SECRET=""

# ---------------------------------------------
# AI & ML SERVICES
# ---------------------------------------------
# OpenAI
OPENAI_API_KEY=""
OPENAI_ORGANIZATION_ID=""

# Anthropic Claude (optional)
ANTHROPIC_API_KEY=""

# Replicate (for image generation)
REPLICATE_API_TOKEN=""

# ---------------------------------------------
# SEARCH & DISCOVERY
# ---------------------------------------------
# Algolia
NEXT_PUBLIC_ALGOLIA_APP_ID=""
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=""
ALGOLIA_ADMIN_KEY=""
ALGOLIA_INDEX_NAME="luxeverse_products"

# Typesense (alternative)
TYPESENSE_HOST=""
TYPESENSE_PORT=""
TYPESENSE_PROTOCOL=""
TYPESENSE_API_KEY=""

# ---------------------------------------------
# STORAGE & CDN
# ---------------------------------------------
# AWS S3
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION="us-east-1"
S3_BUCKET_NAME="luxeverse-assets"

# Cloudinary (alternative)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""

# Uploadthing
UPLOADTHING_SECRET=""
UPLOADTHING_APP_ID=""

# ---------------------------------------------
# CACHING & PERFORMANCE
# ---------------------------------------------
# Redis/Upstash
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""

# ---------------------------------------------
# MONITORING & ANALYTICS
# ---------------------------------------------
# Vercel Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=""

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=""
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"

# Sentry
SENTRY_DSN=""
SENTRY_ORG=""
SENTRY_PROJECT=""
SENTRY_AUTH_TOKEN=""
NEXT_PUBLIC_SENTRY_DSN=""

# LogRocket
LOGROCKET_APP_ID=""

# ---------------------------------------------
# COMMUNICATION & MESSAGING
# ---------------------------------------------
# Resend (Transactional Email)
RESEND_API_KEY=""

# Twilio (SMS)
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""
TWILIO_MESSAGING_SERVICE_SID=""

# Pusher (Real-time)
PUSHER_APP_ID=""
PUSHER_KEY=""
PUSHER_SECRET=""
PUSHER_CLUSTER=""
NEXT_PUBLIC_PUSHER_KEY=""
NEXT_PUBLIC_PUSHER_CLUSTER=""

# ---------------------------------------------
# EXTERNAL APIS
# ---------------------------------------------
# Currency Exchange Rates
EXCHANGE_RATES_API_KEY=""

# Shipping Providers
SHIPPO_API_KEY=""
EASYPOST_API_KEY=""

# Tax Calculation
TAXJAR_API_KEY=""

# ---------------------------------------------
# FEATURE FLAGS
# ---------------------------------------------
NEXT_PUBLIC_FEATURE_AI_STYLIST="true"
NEXT_PUBLIC_FEATURE_AR_TRYON="false"
NEXT_PUBLIC_FEATURE_LIVE_SHOPPING="false"
NEXT_PUBLIC_FEATURE_CRYPTO_PAYMENTS="false"

# ---------------------------------------------
# DEVELOPMENT TOOLS
# ---------------------------------------------
# Prettier ignore in production
PRETTIER_IGNORE_IN_PROD="true"

# Enable debug mode
DEBUG="false"

# ---------------------------------------------
# SECURITY
# ---------------------------------------------
# Rate limiting
RATE_LIMIT_WINDOW="900000" # 15 minutes in ms
RATE_LIMIT_MAX_REQUESTS="100"

# Session configuration
SESSION_MAX_AGE="2592000" # 30 days in seconds
SESSION_UPDATE_AGE="86400" # 24 hours in seconds

# CORS allowed origins (comma-separated)
CORS_ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"

# Content Security Policy
CSP_REPORT_URI=""

# ---------------------------------------------
# MISC
# ---------------------------------------------
# Timezone for server
TZ="UTC"

# Default locale
DEFAULT_LOCALE="en"

# Maintenance mode
MAINTENANCE_MODE="false"

```

# package.json
```json
{
  "name": "luxeverse-quantum",
  "version": "2.0.0",
  "description": "The future of luxury e-commerce - where shopping meets cinema",
  "private": true,
  "author": {
    "name": "LuxeVerse Team",
    "email": "dev@luxeverse.ai",
    "url": "https://luxeverse.ai"
  },
  "license": "MIT",
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,md,mdx,css,json}\"",
    "format:check": "prettier --check \"**/*.{js,jsx,ts,tsx,md,mdx,css,json}\"",
    "type-check": "tsc --noEmit",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:migrate:prod": "prisma migrate deploy",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts",
    "db:reset": "prisma migrate reset",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "analyze": "ANALYZE=true next build",
    "prepare": "husky install",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "@auth/prisma-adapter": "^2.4.2",
    "@hookform/resolvers": "^3.9.0",
    "@prisma/client": "^5.17.0",
    "@radix-ui/react-accordion": "^1.2.0",
    "@radix-ui/react-alert-dialog": "^1.1.1",
    "@radix-ui/react-aspect-ratio": "^1.1.0",
    "@radix-ui/react-avatar": "^1.1.0",
    "@radix-ui/react-checkbox": "^1.1.1",
    "@radix-ui/react-collapsible": "^1.1.0",
    "@radix-ui/react-context-menu": "^2.2.1",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-hover-card": "^1.1.1",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-menubar": "^1.1.1",
    "@radix-ui/react-navigation-menu": "^1.2.0",
    "@radix-ui/react-popover": "^1.1.1",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-radio-group": "^1.2.0",
    "@radix-ui/react-scroll-area": "^1.1.0",
    "@radix-ui/react-select": "^2.1.1",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slider": "^1.2.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.1",
    "@radix-ui/react-toggle": "^1.1.0",
    "@radix-ui/react-toggle-group": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.2",
    "@stripe/react-stripe-js": "^2.7.3",
    "@stripe/stripe-js": "^4.1.0",
    "@t3-oss/env-nextjs": "^0.10.1",
    "@tanstack/react-query": "^5.51.15",
    "@tanstack/react-query-devtools": "^5.51.15",
    "@trpc/client": "11.0.0-rc.446",
    "@trpc/next": "11.0.0-rc.446",
    "@trpc/react-query": "11.0.0-rc.446",
    "@trpc/server": "11.0.0-rc.446",
    "@upstash/redis": "^1.32.0",
    "@vercel/analytics": "^1.3.1",
    "@vercel/og": "^0.6.2",
    "@vercel/speed-insights": "^1.0.12",
    "bcryptjs": "^2.4.3",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.0",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.1.7",
    "framer-motion": "^11.3.17",
    "lucide-react": "^0.414.0",
    "nanoid": "^5.0.7",
    "next": "14.2.5",
    "next-auth": "^4.24.7",
    "next-themes": "^0.3.0",
    "openai": "^4.54.0",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-hook-form": "^7.52.1",
    "react-intersection-observer": "^9.13.0",
    "resend": "^3.4.0",
    "sharp": "^0.33.4",
    "sonner": "^1.5.0",
    "stripe": "^16.2.0",
    "superjson": "^2.2.1",
    "tailwind-merge": "^2.4.0",
    "tailwindcss-animate": "^1.0.7",
    "uploadthing": "^6.13.2",
    "vaul": "^0.9.1",
    "zod": "^3.23.8",
    "zustand": "^4.5.4"
  },
  "devDependencies": {
    "@commitlint/cli": "^19.3.0",
    "@commitlint/config-conventional": "^19.2.2",
    "@next/bundle-analyzer": "^14.2.5",
    "@playwright/test": "^1.45.3",
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20.14.12",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@typescript-eslint/eslint-plugin": "^7.17.0",
    "@typescript-eslint/parser": "^7.17.0",
    "@vitejs/plugin-react": "^4.3.1",
    "@vitest/coverage-v8": "^2.0.4",
    "@vitest/ui": "^2.0.4",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.5",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-tailwindcss": "^3.17.4",
    "husky": "^9.1.3",
    "jsdom": "^24.1.1",
    "lint-staged": "^15.2.7",
    "postcss": "^8.4.40",
    "prettier": "^3.3.3",
    "prettier-plugin-tailwindcss": "^0.6.5",
    "prisma": "^5.17.0",
    "tailwindcss": "^3.4.6",
    "tsx": "^4.16.2",
    "typescript": "^5.5.4",
    "vitest": "^2.0.4"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{md,mdx,css,json}": [
      "prettier --write"
    ]
  },
  "commitlint": {
    "extends": [
      "@commitlint/config-conventional"
    ]
  },
  "packageManager": "pnpm@9.6.0"
}

```

# .prettierrc
```txt
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"]
}

```

# .eslintrc.json
```json
{
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "tailwindcss"],
  "rules": {
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        "prefer": "type-imports"
      }
    ],
    "tailwindcss/no-custom-classname": "off",
    "tailwindcss/classnames-order": "warn"
  }
}

```

# .gitignore
```txt
# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# prisma
prisma/migrations/dev/

# IDE
.idea
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json

# OS
Thumbs.db

```

# tailwind.config.ts
```ts
import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
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
        // LuxeVerse custom colors
        luxury: {
          gold: '#FFD700',
          'gold-light': '#FFF4B3',
          'gold-dark': '#B8860B',
          platinum: '#E5E4E2',
          'platinum-light': '#F4F4F3',
          'platinum-dark': '#C0C0C0',
          obsidian: '#0A0A0B',
          'obsidian-light': '#1A1A1B',
          'obsidian-dark': '#000000',
        },
        neon: {
          pink: '#FF006E',
          cyan: '#00D9FF',
          lime: '#00FF88',
          purple: '#8B00FF',
          orange: '#FF6B00',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        display: ['var(--font-display)', ...fontFamily.sans],
        mono: ['var(--font-mono)', ...fontFamily.mono],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '120': '30rem',
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-out': 'fade-out 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'slide-in-left': 'slide-in-left 0.5s ease-out',
        'slide-in-up': 'slide-in-up 0.5s ease-out',
        'slide-in-down': 'slide-in-down 0.5s ease-out',
        'zoom-in': 'zoom-in 0.5s ease-out',
        'zoom-out': 'zoom-out 0.5s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
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
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-in-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-in-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-in-down': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' },
        },
        'zoom-in': {
          from: { transform: 'scale(0)' },
          to: { transform: 'scale(1)' },
        },
        'zoom-out': {
          from: { transform: 'scale(1)' },
          to: { transform: 'scale(0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'gradient-y': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'center top',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center bottom',
          },
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'luxury-gradient':
          'linear-gradient(135deg, var(--luxury-gold) 0%, var(--luxury-platinum) 100%)',
        'neon-gradient':
          'linear-gradient(135deg, var(--neon-pink) 0%, var(--neon-purple) 100%)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
        spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      backdropBlur: {
        xs: '2px',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
  ],
} satisfies Config

export default config

```

# next.config.mjs
```mjs
import { withContentlayer } from 'next-contentlayer'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Internationalization
  i18n: {
    locales: ['en', 'fr', 'es', 'de', 'it', 'ja', 'zh'],
    defaultLocale: 'en',
  },
  
  // Image Optimization
  images: {
    domains: [
      'cdn.luxeverse.ai',
      'images.unsplash.com',
      'res.cloudinary.com',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Experimental Features
  experimental: {
    // Enable server components external packages
    serverComponentsExternalPackages: [
      '@prisma/client',
      'bcryptjs',
      '@upstash/redis',
      'openai',
    ],
    // Enable optimized package imports
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      '@radix-ui/react-icons',
      'framer-motion',
    ],
    // Enable partial prerendering
    ppr: true,
    // Enable React compiler
    reactCompiler: true,
  },
  
  // Security Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-insights.com *.stripe.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' blob: data: https:;
              font-src 'self' data:;
              connect-src 'self' *.vercel-insights.com *.stripe.com *.algolia.net wss: https:;
              media-src 'self' https:;
              frame-src 'self' *.stripe.com;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              block-all-mixed-content;
              upgrade-insecure-requests;
            `.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/shop',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/my-account',
        destination: '/account',
        permanent: true,
      },
    ]
  },
  
  // Rewrites for API proxying
  async rewrites() {
    return [
      {
        source: '/api/search/:path*',
        destination: 'https://luxeverse.algolia.net/:path*',
      },
      {
        source: '/cdn/:path*',
        destination: 'https://cdn.luxeverse.ai/:path*',
      },
    ]
  },
  
  // Webpack Configuration
  webpack: (config, { isServer, dev }) => {
    // Ignore certain warnings
    config.infrastructureLogging = {
      level: 'error',
    }
    
    // Add custom webpack plugins here
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    // Bundle analyzer
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer ? '../analyze/server.html' : './analyze/client.html',
          openAnalyzer: false,
        })
      )
    }
    
    return config
  },
  
  // Environment Variables
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://luxeverse.ai',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.luxeverse.ai',
  },
  
  // Output Configuration
  output: 'standalone',
  
  // Disable powered by header
  poweredByHeader: false,
  
  // Compress responses
  compress: true,
  
  // Generate ETags
  generateEtags: true,
  
  // Page Extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js', 'mdx'],
  
  // Trailing Slash
  trailingSlash: false,
  
  // TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },
}

// Compose with content layer if using MDX
export default nextConfig

```

# tailwind.config.ts
```ts
import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
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
        // LuxeVerse custom colors
        luxury: {
          gold: '#FFD700',
          'gold-light': '#FFF4B3',
          'gold-dark': '#B8860B',
          platinum: '#E5E4E2',
          'platinum-light': '#F4F4F3',
          'platinum-dark': '#C0C0C0',
          obsidian: '#0A0A0B',
          'obsidian-light': '#1A1A1B',
          'obsidian-dark': '#000000',
        },
        neon: {
          pink: '#FF006E',
          cyan: '#00D9FF',
          lime: '#00FF88',
          purple: '#8B00FF',
          orange: '#FF6B00',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        display: ['var(--font-display)', ...fontFamily.sans],
        mono: ['var(--font-mono)', ...fontFamily.mono],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '120': '30rem',
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-out': 'fade-out 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'slide-in-left': 'slide-in-left 0.5s ease-out',
        'slide-in-up': 'slide-in-up 0.5s ease-out',
        'slide-in-down': 'slide-in-down 0.5s ease-out',
        'zoom-in': 'zoom-in 0.5s ease-out',
        'zoom-out': 'zoom-out 0.5s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
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
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-in-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-in-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-in-down': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' },
        },
        'zoom-in': {
          from: { transform: 'scale(0)' },
          to: { transform: 'scale(1)' },
        },
        'zoom-out': {
          from: { transform: 'scale(1)' },
          to: { transform: 'scale(0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'gradient-y': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'center top',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center bottom',
          },
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'luxury-gradient':
          'linear-gradient(135deg, var(--luxury-gold) 0%, var(--luxury-platinum) 100%)',
        'neon-gradient':
          'linear-gradient(135deg, var(--neon-pink) 0%, var(--neon-purple) 100%)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
        spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      backdropBlur: {
        xs: '2px',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
  ],
} satisfies Config

export default config

```

# tsconfig.json
```json
{
  "compilerOptions": {
    /* Language and Environment */
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    
    /* Strict Type-Checking Options */
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "useUnknownInCatchVariables": true,
    "alwaysStrict": true,
    
    /* Additional Checks */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    
    /* Module Resolution Options */
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "incremental": true,
    
    /* Emit Options */
    "noEmit": true,
    "sourceMap": true,
    "removeComments": false,
    "preserveConstEnums": true,
    
    /* Path Mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/styles/*": ["./src/styles/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/lib/utils/*"],
      "@/server/*": ["./src/server/*"],
      "@/store/*": ["./src/store/*"],
      "@/config/*": ["./src/config/*"]
    },
    
    /* Next.js Specific */
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "src/**/*",
    "prisma/**/*"
  ],
  "exclude": [
    "node_modules",
    ".next",
    "out",
    "public",
    "dist",
    "build",
    "coverage",
    ".turbo"
  ]
}

```

# prisma/schema.prisma
```prisma
// =============================================
// LuxeVerse Prisma Schema - Version 4.0 (Final)
// Comprehensive schema for luxury e-commerce platform
// with AI personalization, AR/3D features, and membership system
// 
// IMPORTANT: This schema includes both:
// 1. Existing tables from database_schema.sql.txt
// 2. New v2.0 feature proposals (marked with NEW)
// =============================================

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["fullTextSearch", "postgresqlExtensions", "relationJoins"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [uuidOssp(map: "uuid-ossp"), pgCrypto(map: "pgcrypto"), pgTrgm(map: "pg_trgm"), vector, postgis]
}

// =============================================
// ENUMS AND CUSTOM TYPES
// =============================================

enum UserRole {
  GUEST
  CUSTOMER
  VIP
  ADMIN
  SUPER_ADMIN

  @@map("user_role")
}

enum MembershipTier {
  PEARL      // Free tier
  SAPPHIRE   // $99/month
  DIAMOND    // $299/month
  OBSIDIAN   // $499/month - Invite only

  @@map("membership_tier")
}

enum ProductStatus {
  DRAFT
  ACTIVE
  OUT_OF_STOCK
  DISCONTINUED
  ARCHIVED

  @@map("product_status")
}

enum OrderStatus {
  PENDING
  PAYMENT_PROCESSING
  PAYMENT_FAILED
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
  RETURNED

  @@map("order_status")
}

enum PaymentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  REFUNDED
  PARTIALLY_REFUNDED

  @@map("payment_status")
}

enum ReviewStatus {
  PENDING
  APPROVED
  REJECTED
  FLAGGED

  @@map("review_status")
}

enum AiInteractionType {
  STYLE_QUIZ
  VISUAL_SEARCH
  CHAT
  RECOMMENDATION
  OUTFIT_BUILDER
  TREND_ALERT
  SIZE_ADVISOR // NEW

  @@map("ai_interaction_type")
}

enum NotificationType {
  ORDER_UPDATE
  PRICE_DROP
  BACK_IN_STOCK
  EXCLUSIVE_ACCESS
  MEMBERSHIP_UPDATE
  AI_RECOMMENDATION
  SOCIAL_INTERACTION
  LIVE_EVENT // NEW

  @@map("notification_type")
}

// NEW ENUMS FOR V2.0 FEATURES
enum TranslationStatus {
  PENDING
  APPROVED
  REJECTED

  @@map("translation_status")
}

enum LiveEventStatus {
  SCHEDULED
  LIVE
  ENDED
  CANCELLED

  @@map("live_event_status")
}

// =============================================
// CORE USER TABLES
// =============================================

model User {
  id                     String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  email                  String    @unique @db.VarChar(255)
  emailVerified          DateTime? @map("email_verified") @db.Timestamptz
  passwordHash           String?   @map("password_hash") @db.VarChar(255)
  name                   String?   @db.VarChar(255)
  avatarUrl              String?   @map("avatar_url") @db.VarChar(500)
  phone                  String?   @db.VarChar(50)
  phoneVerified          DateTime? @map("phone_verified") @db.Timestamptz
  role                   UserRole  @default(CUSTOMER)
  membershipTier         MembershipTier @default(PEARL) @map("membership_tier")
  membershipExpiresAt    DateTime? @map("membership_expires_at") @db.Timestamptz
  
  // Preferences
  preferredCurrency      String    @default("USD") @map("preferred_currency") @db.Char(3)
  preferredLanguage      String    @default("en") @map("preferred_language") @db.VarChar(10)
  timezone               String    @default("UTC") @db.VarChar(50)
  
  // AI & Personalization
  styleProfileCompleted  Boolean   @default(false) @map("style_profile_completed")
  aiConsent              Boolean   @default(true) @map("ai_consent")
  personalizationLevel   Int       @default(5) @map("personalization_level")
  
  // Feature flags for A/B testing (NEW)
  featureFlags           Json?     @map("feature_flags") @db.JsonB
  
  // Metadata
  lastLoginAt            DateTime? @map("last_login_at") @db.Timestamptz
  loginCount             Int       @default(0) @map("login_count")
  createdAt              DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt              DateTime  @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  deletedAt              DateTime? @map("deleted_at") @db.Timestamptz
  
  // Relations
  oauthAccounts          OauthAccount[]
  sessions               Session[]
  styleProfile           StyleProfile?
  aiInteractions         AiInteraction[]
  carts                  Cart[]
  wishlists              Wishlist[]
  orders                 Order[]
  reviews                Review[]
  reviewInteractions     ReviewInteraction[]
  addresses              Address[]
  paymentMethods         PaymentMethod[]
  notifications          Notification[]
  membershipTransactions MembershipTransaction[]
  loyaltyPoints          LoyaltyPoint[]
  productViews           ProductView[]
  searchLogs             SearchLog[]
  couponUses             CouponUse[]
  createdAuditLogs       AuditLog[] @relation("CreatedByUser")
  settingsUpdates        SystemSetting[] @relation("UpdatedByUser")
  inventoryTransactions  InventoryTransaction[] @relation("CreatedByUser")
  orderStatusHistory     OrderStatusHistory[] @relation("CreatedByUser")
  
  // NEW V2.0 RELATIONS
  virtualClosetItems     VirtualClosetItem[]
  outfitRecommendations  OutfitRecommendation[]
  sizeProfiles           SizeProfile[]
  hostedLiveEvents       LiveShoppingEvent[] @relation("EventHost")
  liveEventParticipations LiveEventParticipation[]

  @@index([email], name: "idx_users_email", where: "deleted_at IS NULL")
  @@index([membershipTier, membershipExpiresAt], name: "idx_users_membership", where: "deleted_at IS NULL")
  @@index([createdAt(sort: Desc)], name: "idx_users_created_at")
  @@map("users")
}

model OauthAccount {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId            String    @map("user_id") @db.Uuid
  provider          String    @db.VarChar(50)
  providerAccountId String    @map("provider_account_id") @db.VarChar(255)
  accessToken       String?   @map("access_token") @db.Text
  refreshToken      String?   @map("refresh_token") @db.Text
  expiresAt         DateTime? @map("expires_at") @db.Timestamptz
  tokenType         String?   @map("token_type") @db.VarChar(50)
  scope             String?   @db.Text
  idToken           String?   @map("id_token") @db.Text
  sessionState      String?   @map("session_state") @db.Text
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt         DateTime  @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
  @@map("oauth_accounts")
}

model Session {
  id           String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId       String    @map("user_id") @db.Uuid
  sessionToken String    @unique @map("session_token") @db.VarChar(255)
  ipAddress    String?   @map("ip_address") @db.Inet
  userAgent    String?   @map("user_agent") @db.Text
  expiresAt    DateTime  @map("expires_at") @db.Timestamptz
  createdAt    DateTime  @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  carts        Cart[]
  aiInteractions AiInteraction[]
  productViews ProductView[]
  searchLogs   SearchLog[]
  
  @@index([sessionToken], name: "idx_sessions_token")
  @@index([expiresAt], name: "idx_sessions_expires")
  @@map("sessions")
}

// =============================================
// AI & PERSONALIZATION TABLES
// =============================================

model StyleProfile {
  id                     String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId                 String    @unique @map("user_id") @db.Uuid
  
  // Style preferences
  stylePersonas          String[]  @map("style_personas")
  favoriteColors         String[]  @map("favorite_colors")
  avoidedColors          String[]  @map("avoided_colors")
  preferredBrands        String[]  @map("preferred_brands")
  avoidedMaterials       String[]  @map("avoided_materials")
  
  // Size information (encrypted)
  measurements           Json?     @db.JsonB
  typicalSizes           Json?     @map("typical_sizes") @db.JsonB
  
  // Budget preferences
  minPricePreference     Decimal?  @map("min_price_preference") @db.Decimal(10,2)
  maxPricePreference     Decimal?  @map("max_price_preference") @db.Decimal(10,2)
  sweetSpotPrice         Decimal?  @map("sweet_spot_price") @db.Decimal(10,2)
  
  // AI embeddings for similarity matching (FIXED: proper vector type)
  styleEmbedding         Unsupported("vector(1536)")?   @map("style_embedding")
  colorEmbedding         Unsupported("vector(512)")?    @map("color_embedding")
  brandEmbedding         Unsupported("vector(512)")?    @map("brand_embedding")
  
  // Behavioral data
  prefersSustainable     Boolean   @default(false) @map("prefers_sustainable")
  prefersExclusive       Boolean   @default(false) @map("prefers_exclusive")
  earlyAdopterScore      Decimal   @default(0.5) @map("early_adopter_score") @db.Decimal(3,2)
  luxuryAffinityScore    Decimal   @default(0.5) @map("luxury_affinity_score") @db.Decimal(3,2)
  
  // Style evolution tracking (NEW)
  styleHistory           Json?     @map("style_history") @db.JsonB
  seasonalPreferences    Json?     @map("seasonal_preferences") @db.JsonB
  
  createdAt              DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt              DateTime  @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  user                   User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([styleEmbedding], name: "idx_style_embedding", type: Hnsw, opclass: vector_cosine_ops)
  @@map("style_profiles")
}

model AiInteraction {
  id                String              @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId            String?             @map("user_id") @db.Uuid
  sessionId         String?             @map("session_id") @db.Uuid
  interactionType   AiInteractionType   @map("interaction_type")
  
  // Interaction data
  inputData         Json?               @map("input_data") @db.JsonB
  outputData        Json?               @map("output_data") @db.JsonB
  
  // Performance metrics
  responseTimeMs    Int?                @map("response_time_ms")
  confidenceScore   Decimal?            @map("confidence_score") @db.Decimal(3,2)
  userSatisfaction  Int?                @map("user_satisfaction")
  
  // Metadata
  modelVersion      String?             @map("model_version") @db.VarChar(50)
  createdAt         DateTime            @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  user              User?               @relation(fields: [userId], references: [id], onDelete: Cascade)
  session           Session?            @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  
  @@index([userId, createdAt(sort: Desc)], name: "idx_ai_interactions_user")
  @@index([interactionType, createdAt(sort: Desc)], name: "idx_ai_interactions_type")
  @@map("ai_interactions")
}

// =============================================
// PRODUCT CATALOG TABLES
// =============================================

model Category {
  id              String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  parentId        String?   @map("parent_id") @db.Uuid
  slug            String    @unique @db.VarChar(255)
  name            String    @db.VarChar(255)
  description     String?   @db.Text
  imageUrl        String?   @map("image_url") @db.VarChar(500)
  
  // SEO
  metaTitle       String?   @map("meta_title") @db.VarChar(255)
  metaDescription String?   @map("meta_description") @db.Text
  
  // Display
  displayOrder    Int       @default(0) @map("display_order")
  isFeatured      Boolean   @default(false) @map("is_featured")
  isActive        Boolean   @default(true) @map("is_active")
  
  createdAt       DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt       DateTime  @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  parent          Category? @relation("CategoryHierarchy", fields: [parentId], references: [id], onDelete: Cascade)
  children        Category[] @relation("CategoryHierarchy")
  products        Product[]
  
  // NEW V2.0 RELATIONS
  translations    CategoryTranslation[]
  
  @@index([parentId], name: "idx_categories_parent", where: "parent_id IS NOT NULL")
  @@index([slug], name: "idx_categories_slug", where: "is_active = true")
  @@map("categories")
}

model Brand {
  id                  String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  slug                String    @unique @db.VarChar(255)
  name                String    @db.VarChar(255)
  logoUrl             String?   @map("logo_url") @db.VarChar(500)
  description         String?   @db.Text
  story               String?   @db.Text
  
  // Verification
  isVerified          Boolean   @default(false) @map("is_verified")
  verifiedAt          DateTime? @map("verified_at") @db.Timestamptz
  
  // Sustainability
  sustainabilityScore Int?      @map("sustainability_score")
  certifications      String[]
  
  // Contact
  websiteUrl          String?   @map("website_url") @db.VarChar(500)
  instagramHandle     String?   @map("instagram_handle") @db.VarChar(100)
  
  createdAt           DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt           DateTime  @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  products            Product[]
  
  // NEW V2.0 RELATIONS
  translations        BrandTranslation[]
  
  @@map("brands")
}

model Product {
  id                String        @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  sku               String        @unique @db.VarChar(100)
  slug              String        @unique @db.VarChar(255)
  name              String        @db.VarChar(255)
  description       String?       @db.Text
  story             String?       @db.Text
  
  // Categorization
  categoryId        String        @map("category_id") @db.Uuid
  brandId           String?       @map("brand_id") @db.Uuid
  
  // Pricing
  price             Decimal       @db.Decimal(10,2)
  compareAtPrice    Decimal?      @map("compare_at_price") @db.Decimal(10,2)
  cost              Decimal?      @db.Decimal(10,2)
  currency          String        @default("USD") @db.Char(3)
  
  // Status
  status            ProductStatus @default(DRAFT)
  publishedAt       DateTime?     @map("published_at") @db.Timestamptz
  featuredAt        DateTime?     @map("featured_at") @db.Timestamptz
  
  // AI features (FIXED: proper vector type)
  aiDescription     String?       @map("ai_description") @db.Text
  productEmbedding  Unsupported("vector(1536)")?  @map("product_embedding")
  colorAnalysis     Json?         @map("color_analysis") @db.JsonB
  styleTags         String[]      @map("style_tags")
  
  // 3D/AR features (ADDED)
  model3dUrl        String?       @map("model_3d_url") @db.VarChar(500)
  arEnabled         Boolean       @default(false) @map("ar_enabled")
  virtualTryOnEnabled Boolean     @default(false) @map("virtual_try_on_enabled")
  
  // SEO
  metaTitle         String?       @map("meta_title") @db.VarChar(255)
  metaDescription   String?       @map("meta_description") @db.Text
  
  // Sustainability
  materials         Json?         @db.JsonB
  carbonFootprint   Decimal?      @map("carbon_footprint") @db.Decimal(10,2)
  recyclable        Boolean       @default(false)
  
  // Popularity metrics (ADDED)
  viewCount         Int           @default(0) @map("view_count")
  purchaseCount     Int           @default(0) @map("purchase_count")
  wishlistCount     Int           @default(0) @map("wishlist_count")
  
  // Feature flags (ADDED)
  isFeatured        Boolean       @default(false) @map("is_featured")
  isExclusive       Boolean       @default(false) @map("is_exclusive")
  isLimitedEdition  Boolean       @default(false) @map("is_limited_edition")
  
  // Launch/pre-order features (ADDED)
  launchDate        DateTime?     @map("launch_date") @db.Timestamptz
  preOrderEnabled   Boolean       @default(false) @map("pre_order_enabled")
  preOrderEndDate   DateTime?     @map("pre_order_end_date") @db.Timestamptz
  
  // Metadata
  createdAt         DateTime      @default(now()) @map("created_at") @db.Timestamptz
  updatedAt         DateTime      @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  deletedAt         DateTime?     @map("deleted_at") @db.Timestamptz
  
  // Relations
  category          Category      @relation(fields: [categoryId], references: [id])
  brand             Brand?        @relation(fields: [brandId], references: [id])
  variants          ProductVariant[]
  media             ProductMedia[]
  collections       CollectionProduct[]
  cartItems         CartItem[]
  wishlistItems     WishlistItem[]
  orderItems        OrderItem[]
  reviews           Review[]
  productViews      ProductView[]
  searchLogs        SearchLog[]
  
  // NEW V2.0 RELATIONS
  translations      ProductTranslation[]
  virtualClosetItems VirtualClosetItem[]
  outfitRecommendations OutfitRecommendation[] @relation("BaseProduct")
  outfitRecommendationItems OutfitRecommendationItem[]
  liveEventProducts LiveEventProduct[]
  
  @@index([status, publishedAt(sort: Desc)], name: "idx_products_status", where: "deleted_at IS NULL")
  @@index([categoryId], name: "idx_products_category", where: "deleted_at IS NULL")
  @@index([brandId], name: "idx_products_brand", where: "deleted_at IS NULL")
  @@index([price], name: "idx_products_price", where: "status = 'ACTIVE' AND deleted_at IS NULL")
  @@index([sku], name: "idx_products_sku", where: "deleted_at IS NULL")
  @@index([slug], name: "idx_products_slug", where: "deleted_at IS NULL")
  @@index([productEmbedding], name: "idx_product_embedding", type: Hnsw, opclass: vector_cosine_ops)
  @@index([materials], name: "idx_products_materials", type: Gin)
  @@index([colorAnalysis], name: "idx_products_color_analysis", type: Gin)
  @@map("products")
}

model ProductVariant {
  id                   String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  productId            String    @map("product_id") @db.Uuid
  sku                  String    @unique @db.VarChar(100)
  
  // Variant attributes
  size                 String?   @db.VarChar(50)
  color                String?   @db.VarChar(100)
  material             String?   @db.VarChar(100)
  
  // Pricing (can override product price)
  price                Decimal?  @db.Decimal(10,2)
  compareAtPrice       Decimal?  @map("compare_at_price") @db.Decimal(10,2)
  
  // Inventory
  inventoryQuantity    Int       @default(0) @map("inventory_quantity")
  inventoryReserved    Int       @default(0) @map("inventory_reserved")
  lowStockThreshold    Int       @default(5) @map("low_stock_threshold")
  
  // Weight and dimensions for shipping
  weightValue          Decimal?  @map("weight_value") @db.Decimal(10,3)
  weightUnit           String    @default("kg") @map("weight_unit") @db.VarChar(10)
  dimensions           Json?     @db.JsonB
  
  // Status
  isAvailable          Boolean   @default(true) @map("is_available")
  availableAt          DateTime? @map("available_at") @db.Timestamptz
  
  createdAt            DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt            DateTime  @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  product              Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  media                ProductMedia[]
  cartItems            CartItem[]
  wishlistItems        WishlistItem[]
  orderItems           OrderItem[]
  inventoryTransactions InventoryTransaction[]
  
  // NEW V2.0 RELATIONS
  virtualClosetItems   VirtualClosetItem[]
  sizeRecommendations  SizeRecommendation[]
  
  @@index([productId], name: "idx_variants_product")
  @@index([inventoryQuantity], name: "idx_variants_inventory", where: "is_available = true")
  @@map("product_variants")
}

model ProductMedia {
  id             String         @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  productId      String         @map("product_id") @db.Uuid
  variantId      String?        @map("variant_id") @db.Uuid
  
  // Media details
  mediaType      String         @map("media_type") @db.VarChar(20)
  url            String         @db.VarChar(500)
  thumbnailUrl   String?        @map("thumbnail_url") @db.VarChar(500)
  
  // Image specific
  altText        String?        @map("alt_text") @db.VarChar(255)
  width          Int?
  height         Int?
  
  // Video specific
  durationSeconds Int?          @map("duration_seconds")
  
  // 3D/AR specific
  modelFormat    String?        @map("model_format") @db.VarChar(20)
  fileSizeBytes  BigInt?        @map("file_size_bytes")
  
  // 360° image support (ADDED)
  is360Image     Boolean        @default(false) @map("is_360_image")
  sequenceIndex  Int?           @map("sequence_index")
  
  // Organization
  displayOrder   Int            @default(0) @map("display_order")
  isPrimary      Boolean        @default(false) @map("is_primary")
  
  createdAt      DateTime       @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  product        Product        @relation(fields: [productId], references: [id], onDelete: Cascade)
  variant        ProductVariant? @relation(fields: [variantId], references: [id], onDelete: Cascade)
  
  @@index([productId, displayOrder], name: "idx_media_product")
  @@index([variantId], name: "idx_media_variant", where: "variant_id IS NOT NULL")
  @@map("product_media")
}

model Collection {
  id              String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  slug            String    @unique @db.VarChar(255)
  name            String    @db.VarChar(255)
  description     String?   @db.Text
  
  // Visual design
  heroImageUrl    String?   @map("hero_image_url") @db.VarChar(500)
  heroVideoUrl    String?   @map("hero_video_url") @db.VarChar(500)
  colorTheme      Json?     @map("color_theme") @db.JsonB
  
  // Collection rules
  isManual        Boolean   @default(true) @map("is_manual")
  rules           Json?     @db.JsonB
  
  // Display
  isActive        Boolean   @default(true) @map("is_active")
  displayOrder    Int       @default(0) @map("display_order")
  featuredUntil   DateTime? @map("featured_until") @db.Timestamptz
  
  // SEO
  metaTitle       String?   @map("meta_title") @db.VarChar(255)
  metaDescription String?   @map("meta_description") @db.Text
  
  createdAt       DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt       DateTime  @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  products        CollectionProduct[]
  
  // NEW V2.0 RELATIONS
  translations    CollectionTranslation[]
  
  @@map("collections")
}

model CollectionProduct {
  collectionId String    @map("collection_id") @db.Uuid
  productId    String    @map("product_id") @db.Uuid
  displayOrder Int       @default(0) @map("display_order")
  addedAt      DateTime  @default(now()) @map("added_at") @db.Timestamptz
  
  // Relations
  collection   Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)
  product      Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@id([collectionId, productId])
  @@index([collectionId, displayOrder], name: "idx_collection_products")
  @@map("collection_products")
}

// =============================================
// SHOPPING CART & WISHLIST TABLES
// =============================================

model Cart {
  id              String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId          String?   @map("user_id") @db.Uuid
  sessionId       String?   @map("session_id") @db.Uuid
  
  // Cart state
  isAbandoned     Boolean   @default(false) @map("is_abandoned")
  abandonedAt     DateTime? @map("abandoned_at") @db.Timestamptz
  reminderSentAt  DateTime? @map("reminder_sent_at") @db.Timestamptz
  
  // Pricing snapshot
  currency        String    @default("USD") @db.Char(3)
  subtotal        Decimal   @default(0) @db.Decimal(10,2)
  taxAmount       Decimal   @default(0) @map("tax_amount") @db.Decimal(10,2)
  shippingAmount  Decimal   @default(0) @map("shipping_amount") @db.Decimal(10,2)
  discountAmount  Decimal   @default(0) @map("discount_amount") @db.Decimal(10,2)
  total           Decimal   @default(0) @db.Decimal(10,2)
  
  // Applied codes
  couponCode      String?   @map("coupon_code") @db.VarChar(50)
  giftCardCodes   String[]  @map("gift_card_codes")
  
  expiresAt       DateTime  @default(dbgenerated("(CURRENT_TIMESTAMP + INTERVAL '30 days')")) @map("expires_at") @db.Timestamptz
  createdAt       DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt       DateTime  @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  user            User?     @relation(fields: [userId], references: [id], onDelete: Cascade)
  session         Session?  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  items           CartItem[]
  
  @@index([userId], name: "idx_carts_user", where: "user_id IS NOT NULL")
  @@index([sessionId], name: "idx_carts_session", where: "session_id IS NOT NULL")
  @@index([isAbandoned, abandonedAt], name: "idx_carts_abandoned", where: "is_abandoned = true")
  @@map("carts")
}

model CartItem {
  id                   String         @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  cartId               String         @map("cart_id") @db.Uuid
  productId            String         @map("product_id") @db.Uuid
  variantId            String         @map("variant_id") @db.Uuid
  
  quantity             Int            @default(1)
  
  // Price at time of adding (for price protection)
  priceAtTime          Decimal        @map("price_at_time") @db.Decimal(10,2)
  
  // Personalization
  personalization      Json?          @db.JsonB
  
  // AI recommendations
  addedFrom            String?        @map("added_from") @db.VarChar(50)
  recommendationScore  Decimal?       @map("recommendation_score") @db.Decimal(3,2)
  
  addedAt              DateTime       @default(now()) @map("added_at") @db.Timestamptz
  updatedAt            DateTime       @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  cart                 Cart           @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product              Product        @relation(fields: [productId], references: [id])
  variant              ProductVariant @relation(fields: [variantId], references: [id])
  
  @@index([cartId], name: "idx_cart_items_cart")
  @@unique([cartId, variantId], name: "idx_cart_items_unique", where: "personalization IS NULL")
  @@map("cart_items")
}

model Wishlist {
  id          String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId      String    @map("user_id") @db.Uuid
  name        String    @default("My Wishlist") @db.VarChar(255)
  isPublic    Boolean   @default(false) @map("is_public")
  shareToken  String?   @unique @map("share_token") @db.VarChar(100)
  
  createdAt   DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt   DateTime  @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  items       WishlistItem[]
  
  @@index([userId], name: "idx_wishlists_user")
  @@index([shareToken], name: "idx_wishlists_share", where: "share_token IS NOT NULL")
  @@map("wishlists")
}

model WishlistItem {
  id                   String         @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  wishlistId           String         @map("wishlist_id") @db.Uuid
  productId            String         @map("product_id") @db.Uuid
  variantId            String?        @map("variant_id") @db.Uuid
  
  // Notifications
  notifyPriceDrop      Boolean        @default(true) @map("notify_price_drop")
  notifyBackInStock    Boolean        @default(true) @map("notify_back_in_stock")
  
  // Tracking
  priceWhenAdded       Decimal?       @map("price_when_added") @db.Decimal(10,2)
  notes                String?        @db.Text
  
  addedAt              DateTime       @default(now()) @map("added_at") @db.Timestamptz
  
  // Relations
  wishlist             Wishlist       @relation(fields: [wishlistId], references: [id], onDelete: Cascade)
  product              Product        @relation(fields: [productId], references: [id])
  variant              ProductVariant? @relation(fields: [variantId], references: [id])
  
  @@unique([wishlistId, productId, variantId])
  @@index([wishlistId], name: "idx_wishlist_items")
  @@map("wishlist_items")
}

// =============================================
// ORDER MANAGEMENT TABLES
// =============================================

model Order {
  id                     String        @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  orderNumber            String        @unique @map("order_number") @db.VarChar(20)
  userId                 String        @map("user_id") @db.Uuid
  
  // Status
  status                 OrderStatus   @default(PENDING)
  paymentStatus          PaymentStatus @default(PENDING) @map("payment_status")
  
  // Customer info snapshot
  customerEmail          String        @map("customer_email") @db.VarChar(255)
  customerPhone          String?       @map("customer_phone") @db.VarChar(50)
  
  // Pricing
  currency               String        @default("USD") @db.Char(3)
  subtotal               Decimal       @db.Decimal(10,2)
  taxAmount              Decimal       @default(0) @map("tax_amount") @db.Decimal(10,2)
  shippingAmount         Decimal       @default(0) @map("shipping_amount") @db.Decimal(10,2)
  discountAmount         Decimal       @default(0) @map("discount_amount") @db.Decimal(10,2)
  total                  Decimal       @db.Decimal(10,2)
  
  // Shipping
  shippingMethod         String?       @map("shipping_method") @db.VarChar(100)
  shippingCarrier        String?       @map("shipping_carrier") @db.VarChar(100)
  trackingNumber         String?       @map("tracking_number") @db.VarChar(255)
  estimatedDelivery      DateTime?     @map("estimated_delivery") @db.Date
  deliveredAt            DateTime?     @map("delivered_at") @db.Timestamptz
  
  // AI insights
  fraudScore             Decimal?      @map("fraud_score") @db.Decimal(3,2)
  recommendationInfluence Decimal?     @map("recommendation_influence") @db.Decimal(3,2)
  
  // Metadata
  notes                  String?       @db.Text
  adminNotes             String?       @map("admin_notes") @db.Text
  tags                   String[]
  
  createdAt              DateTime      @default(now()) @map("created_at") @db.Timestamptz
  updatedAt              DateTime      @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  cancelledAt            DateTime?     @map("cancelled_at") @db.Timestamptz
  
  // Relations
  user                   User          @relation(fields: [userId], references: [id])
  items                  OrderItem[]
  statusHistory          OrderStatusHistory[]
  paymentTransactions    PaymentTransaction[]
  couponUses             CouponUse[]
  loyaltyPoints          LoyaltyPoint[]
  notifications          Notification[]
  
  // NEW V2.0 RELATIONS
  virtualClosetItems     VirtualClosetItem[]
  
  @@index([userId, createdAt(sort: Desc)], name: "idx_orders_user")
  @@index([status, createdAt(sort: Desc)], name: "idx_orders_status")
  @@index([orderNumber], name: "idx_orders_number")
  @@index([createdAt(sort: Desc)], name: "idx_orders_created")
  @@map("orders")
}

model OrderItem {
  id                   String         @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  orderId              String         @map("order_id") @db.Uuid
  productId            String         @map("product_id") @db.Uuid
  variantId            String         @map("variant_id") @db.Uuid
  
  // Item details at time of order
  productName          String         @map("product_name") @db.VarChar(255)
  variantTitle         String?        @map("variant_title") @db.VarChar(255)
  sku                  String         @db.VarChar(100)
  
  // Quantities and pricing
  quantity             Int
  unitPrice            Decimal        @map("unit_price") @db.Decimal(10,2)
  totalPrice           Decimal        @map("total_price") @db.Decimal(10,2)
  
  // Personalization
  personalization      Json?          @db.JsonB
  
  // Fulfillment
  fulfilledQuantity    Int            @default(0) @map("fulfilled_quantity")
  returnedQuantity     Int            @default(0) @map("returned_quantity")
  refundedQuantity     Int            @default(0) @map("refunded_quantity")
  
  createdAt            DateTime       @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  order                Order          @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product              Product        @relation(fields: [productId], references: [id])
  variant              ProductVariant @relation(fields: [variantId], references: [id])
  reviews              Review[]
  inventoryTransactions InventoryTransaction[]
  
  @@index([orderId], name: "idx_order_items_order")
  @@index([productId], name: "idx_order_items_product")
  @@map("order_items")
}

model OrderStatusHistory {
  id        String      @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  orderId   String      @map("order_id") @db.Uuid
  status    OrderStatus
  notes     String?     @db.Text
  createdBy String?     @map("created_by") @db.Uuid
  createdAt DateTime    @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  order     Order       @relation(fields: [orderId], references: [id], onDelete: Cascade)
  creator   User?       @relation("CreatedByUser", fields: [createdBy], references: [id])
  
  @@index([orderId, createdAt(sort: Desc)], name: "idx_order_status_history")
  @@map("order_status_history")
}

// =============================================
// PAYMENT & TRANSACTION TABLES
// =============================================

model PaymentMethod {
  id                       String                 @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId                   String                 @map("user_id") @db.Uuid
  
  // Payment details
  type                     String                 @db.VarChar(50)
  provider                 String                 @db.VarChar(50)
  
  // Card specific (tokenized)
  cardBrand                String?                @map("card_brand") @db.VarChar(50)
  cardLast4                String?                @map("card_last4") @db.VarChar(4)
  cardExpMonth             Int?                   @map("card_exp_month")
  cardExpYear              Int?                   @map("card_exp_year")
  
  // Billing address
  billingAddressId         String?                @map("billing_address_id") @db.Uuid
  
  // Security audit (ADDED)
  lastUsedAt               DateTime?              @map("last_used_at") @db.Timestamptz
  lastUsedIp               String?                @map("last_used_ip") @db.Inet
  failedAttempts           Int                    @default(0) @map("failed_attempts")
  lockedUntil              DateTime?              @map("locked_until") @db.Timestamptz
  
  // Metadata
  isDefault                Boolean                @default(false) @map("is_default")
  providerCustomerId       String?                @map("provider_customer_id") @db.VarChar(255)
  providerPaymentMethodId  String?                @map("provider_payment_method_id") @db.VarChar(255)
  
  createdAt                DateTime               @default(now()) @map("created_at") @db.Timestamptz
  updatedAt                DateTime               @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  user                     User                   @relation(fields: [userId], references: [id], onDelete: Cascade)
  billingAddress           Address?               @relation(fields: [billingAddressId], references: [id])
  paymentTransactions      PaymentTransaction[]
  
  @@index([userId], name: "idx_payment_methods_user")
  @@map("payment_methods")
}

model PaymentTransaction {
  id                       String           @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  orderId                  String           @map("order_id") @db.Uuid
  paymentMethodId          String?          @map("payment_method_id") @db.Uuid
  
  // Transaction details
  type                     String           @db.VarChar(50)
  status                   PaymentStatus
  
  // Amounts
  amount                   Decimal          @db.Decimal(10,2)
  currency                 String           @default("USD") @db.Char(3)
  
  // Provider details
  provider                 String           @db.VarChar(50)
  providerTransactionId    String?          @unique @map("provider_transaction_id") @db.VarChar(255)
  providerResponse         Json?            @map("provider_response") @db.JsonB
  
  // Metadata
  failureReason            String?          @map("failure_reason") @db.Text
  processedAt              DateTime?        @map("processed_at") @db.Timestamptz
  createdAt                DateTime         @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  order                    Order            @relation(fields: [orderId], references: [id])
  paymentMethod            PaymentMethod?   @relation(fields: [paymentMethodId], references: [id])
  membershipTransactions   MembershipTransaction[]
  
  @@index([orderId], name: "idx_payment_transactions_order")
  @@index([providerTransactionId], name: "idx_payment_transactions_provider")
  @@map("payment_transactions")
}

// =============================================
// USER INTERACTION TABLES
// =============================================

model Review {
  id                String              @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  productId         String              @map("product_id") @db.Uuid
  userId            String              @map("user_id") @db.Uuid
  orderItemId       String?             @map("order_item_id") @db.Uuid
  
  // Review content
  rating            Int
  title             String?             @db.VarChar(255)
  content           String?             @db.Text
  
  // Review metadata
  isVerifiedPurchase Boolean            @default(false) @map("is_verified_purchase")
  helpfulCount      Int                 @default(0) @map("helpful_count")
  notHelpfulCount   Int                 @default(0) @map("not_helpful_count")
  
  // AI analysis
  sentimentScore    Decimal?            @map("sentiment_score") @db.Decimal(3,2)
  qualityScore      Decimal?            @map("quality_score") @db.Decimal(3,2)
  
  // Status
  status            ReviewStatus        @default(PENDING)
  
  // Media
  mediaUrls         String[]            @map("media_urls")
  
  createdAt         DateTime            @default(now()) @map("created_at") @db.Timestamptz
  updatedAt         DateTime            @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  product           Product             @relation(fields: [productId], references: [id])
  user              User                @relation(fields: [userId], references: [id])
  orderItem         OrderItem?          @relation(fields: [orderItemId], references: [id])
  interactions      ReviewInteraction[]
  
  @@unique([productId, userId])
  @@index([productId, status, rating(sort: Desc)], name: "idx_reviews_product")
  @@index([userId], name: "idx_reviews_user")
  @@map("reviews")
}

model ReviewInteraction {
  userId    String   @map("user_id") @db.Uuid
  reviewId  String   @map("review_id") @db.Uuid
  isHelpful Boolean  @map("is_helpful")
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  review    Review   @relation(fields: [reviewId], references: [id], onDelete: Cascade)
  
  @@id([userId, reviewId])
  @@map("review_interactions")
}

model Address {
  id             String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId         String    @map("user_id") @db.Uuid
  
  // Address details
  type           String    @default("shipping") @db.VarChar(50)
  isDefault      Boolean   @default(false) @map("is_default")
  
  // Contact
  firstName      String    @map("first_name") @db.VarChar(100)
  lastName       String    @map("last_name") @db.VarChar(100)
  company        String?   @db.VarChar(100)
  phone          String?   @db.VarChar(50)
  
  // Address
  addressLine1   String    @map("address_line1") @db.VarChar(255)
  addressLine2   String?   @map("address_line2") @db.VarChar(255)
  city           String    @db.VarChar(100)
  stateProvince  String?   @map("state_province") @db.VarChar(100)
  postalCode     String    @map("postal_code") @db.VarChar(20)
  countryCode    String    @map("country_code") @db.Char(2)
  
  // Geolocation (for distance calculations)
  coordinates    Unsupported("geography(Point, 4326)")?
  
  // Validation
  isValidated    Boolean   @default(false) @map("is_validated")
  validatedAt    DateTime? @map("validated_at") @db.Timestamptz
  
  createdAt      DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt      DateTime  @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  user           User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  paymentMethods PaymentMethod[]
  
  @@index([userId], name: "idx_addresses_user")
  @@map("addresses")
}

// =============================================
// ANALYTICS & TRACKING TABLES
// =============================================

model ProductView {
  id                   String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  productId            String    @map("product_id") @db.Uuid
  userId               String?   @map("user_id") @db.Uuid
  sessionId            String?   @map("session_id") @db.Uuid
  
  // View context
  source               String?   @db.VarChar(50)
  searchQuery          String?   @map("search_query") @db.Text
  recommendationId     String?   @map("recommendation_id") @db.Uuid
  
  // Engagement metrics
  viewDurationSeconds  Int?      @map("view_duration_seconds")
  interactions         Json?     @db.JsonB
  
  createdAt            DateTime  @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  product              Product   @relation(fields: [productId], references: [id])
  user                 User?     @relation(fields: [userId], references: [id])
  session              Session?  @relation(fields: [sessionId], references: [id])
  
  @@index([productId, createdAt(sort: Desc)], name: "idx_product_views_product")
  @@index([userId, createdAt(sort: Desc)], name: "idx_product_views_user", where: "user_id IS NOT NULL")
  @@index([createdAt(sort: Desc)], name: "idx_product_views_date")
  @@map("product_views")
}

model SearchLog {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId            String?   @map("user_id") @db.Uuid
  sessionId         String?   @map("session_id") @db.Uuid
  
  query             String    @db.Text
  filters           Json?     @db.JsonB
  resultsCount      Int?      @map("results_count")
  clickedPosition   Int?      @map("clicked_position")
  clickedProductId  String?   @map("clicked_product_id") @db.Uuid
  
  // Search performance
  responseTimeMs    Int?      @map("response_time_ms")
  searchMethod      String?   @map("search_method") @db.VarChar(50)
  
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  user              User?     @relation(fields: [userId], references: [id])
  session           Session?  @relation(fields: [sessionId], references: [id])
  clickedProduct    Product?  @relation(fields: [clickedProductId], references: [id]) // RESTORED
  
  @@index([userId, createdAt(sort: Desc)], name: "idx_search_logs_user", where: "user_id IS NOT NULL")
  @@map("search_logs")
}

// =============================================
// MARKETING & COMMUNICATIONS TABLES
// =============================================

model EmailCampaign {
  id                 String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  name               String    @db.VarChar(255)
  subject            String    @db.VarChar(255)
  
  // Campaign type
  type               String    @db.VarChar(50)
  
  // Content
  htmlContent        String?   @map("html_content") @db.Text
  textContent        String?   @map("text_content") @db.Text
  
  // Targeting
  targetSegment      Json?     @map("target_segment") @db.JsonB
  
  // Status
  status             String    @default("DRAFT") @db.VarChar(50)
  scheduledAt        DateTime? @map("scheduled_at") @db.Timestamptz
  sentAt             DateTime? @map("sent_at") @db.Timestamptz
  
  // Metrics
  sentCount          Int       @default(0) @map("sent_count")
  openCount          Int       @default(0) @map("open_count")
  clickCount         Int       @default(0) @map("click_count")
  conversionCount    Int       @default(0) @map("conversion_count")
  revenueGenerated   Decimal   @default(0) @map("revenue_generated") @db.Decimal(10,2)
  
  createdAt          DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt          DateTime  @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  
  @@index([targetSegment], name: "idx_campaigns_segment", type: Gin)
  @@map("email_campaigns")
}

model Coupon {
  id                     String           @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  code                   String           @unique @db.VarChar(50)
  description            String?          @db.Text
  
  // Discount details
  discountType           String           @map("discount_type") @db.VarChar(20)
  discountValue          Decimal          @map("discount_value") @db.Decimal(10,2)
  
  // Conditions
  minimumAmount          Decimal?         @map("minimum_amount") @db.Decimal(10,2)
  applicableProducts     String[]         @map("applicable_products") @db.Uuid
  applicableCategories   String[]         @map("applicable_categories") @db.Uuid
  applicableBrands       String[]         @map("applicable_brands") @db.Uuid
  
  // Usage limits
  usageLimit             Int?             @map("usage_limit")
  usageCount             Int              @default(0) @map("usage_count")
  usageLimitPerUser      Int?             @map("usage_limit_per_user")
  
  // Validity
  validFrom              DateTime         @default(now()) @map("valid_from") @db.Timestamptz
  validUntil             DateTime?        @map("valid_until") @db.Timestamptz
  
  // Restrictions
  firstPurchaseOnly      Boolean          @default(false) @map("first_purchase_only")
  membershipTiers        MembershipTier[] @map("membership_tiers")
  
  createdAt              DateTime         @default(now()) @map("created_at") @db.Timestamptz
  updatedAt              DateTime         @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  couponUses             CouponUse[]
  
  @@index([code], name: "idx_coupons_code", where: "valid_until > CURRENT_TIMESTAMP OR valid_until IS NULL")
  @@map("coupons")
}

model CouponUse {
  id             String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  couponId       String    @map("coupon_id") @db.Uuid
  userId         String    @map("user_id") @db.Uuid
  orderId        String    @map("order_id") @db.Uuid
  discountAmount Decimal   @map("discount_amount") @db.Decimal(10,2)
  usedAt         DateTime  @default(now()) @map("used_at") @db.Timestamptz
  
  // Relations
  coupon         Coupon    @relation(fields: [couponId], references: [id])
  user           User      @relation(fields: [userId], references: [id])
  order          Order     @relation(fields: [orderId], references: [id])
  
  @@unique([couponId, orderId])
  @@index([userId], name: "idx_coupon_uses_user")
  @@map("coupon_uses")
}

// =============================================
// NOTIFICATIONS & MESSAGING TABLES
// =============================================

model Notification {
  id        String           @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId    String           @map("user_id") @db.Uuid
  
  type      NotificationType
  title     String           @db.VarChar(255)
  message   String           @db.Text
  
  // Related entities
  orderId   String?          @map("order_id") @db.Uuid
  productId String?          @map("product_id") @db.Uuid
  
  // Delivery
  channels  String[]         @default(["in_app"])
  
  // Status
  isRead    Boolean          @default(false) @map("is_read")
  readAt    DateTime?        @map("read_at") @db.Timestamptz
  
  // Actions
  actionUrl String?          @map("action_url") @db.VarChar(500)
  actionLabel String?        @map("action_label") @db.VarChar(100)
  
  expiresAt DateTime?        @map("expires_at") @db.Timestamptz
  createdAt DateTime         @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  user      User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  order     Order?           @relation(fields: [orderId], references: [id])
  product   Product?         @relation(fields: [productId], references: [id])
  
  @@index([userId, isRead, createdAt(sort: Desc)], name: "idx_notifications_user")
  @@index([expiresAt], name: "idx_notifications_expires", where: "expires_at IS NOT NULL")
  @@map("notifications")
}

// =============================================
// MEMBERSHIP & LOYALTY TABLES
// =============================================

model MembershipTransaction {
  id                     String                @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId                 String                @map("user_id") @db.Uuid
  
  // Transaction details
  type                   String                @db.VarChar(50)
  fromTier               MembershipTier?       @map("from_tier")
  toTier                 MembershipTier        @map("to_tier")
  
  // Billing
  amount                 Decimal?              @db.Decimal(10,2)
  currency               String                @default("USD") @db.Char(3)
  paymentTransactionId   String?               @map("payment_transaction_id") @db.Uuid
  
  // Validity
  startsAt               DateTime              @map("starts_at") @db.Timestamptz
  endsAt                 DateTime?             @map("ends_at") @db.Timestamptz
  
  // Metadata
  reason                 String?               @db.Text
  
  createdAt              DateTime              @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  user                   User                  @relation(fields: [userId], references: [id])
  paymentTransaction     PaymentTransaction?   @relation(fields: [paymentTransactionId], references: [id])
  
  @@index([userId, createdAt(sort: Desc)], name: "idx_membership_transactions_user")
  @@map("membership_transactions")
}

model LoyaltyPoint {
  id           String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId       String    @map("user_id") @db.Uuid
  
  // Transaction details
  type         String    @db.VarChar(50)
  points       Int
  balanceAfter Int       @map("balance_after")
  
  // Source
  source       String?   @db.VarChar(50)
  orderId      String?   @map("order_id") @db.Uuid
  
  // Expiration
  expiresAt    DateTime? @map("expires_at") @db.Timestamptz
  
  // Metadata
  description  String?   @db.Text
  
  createdAt    DateTime  @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  user         User      @relation(fields: [userId], references: [id])
  order        Order?    @relation(fields: [orderId], references: [id])
  
  @@index([userId, createdAt(sort: Desc)], name: "idx_loyalty_points_user")
  @@index([expiresAt], name: "idx_loyalty_points_expires", where: "expires_at IS NOT NULL AND points > 0")
  @@map("loyalty_points")
}

// =============================================
// INVENTORY MANAGEMENT TABLES
// =============================================

model InventoryTransaction {
  id           String         @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  variantId    String         @map("variant_id") @db.Uuid
  
  // Transaction details
  type         String         @db.VarChar(50)
  quantity     Int
  balanceAfter Int            @map("balance_after")
  
  // Reference
  orderItemId  String?        @map("order_item_id") @db.Uuid
  
  // Metadata
  reason       String?        @db.Text
  createdBy    String?        @map("created_by") @db.Uuid
  
  createdAt    DateTime       @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  variant      ProductVariant @relation(fields: [variantId], references: [id])
  orderItem    OrderItem?     @relation(fields: [orderItemId], references: [id])
  creator      User?          @relation("CreatedByUser", fields: [createdBy], references: [id])
  
  @@index([variantId, createdAt(sort: Desc)], name: "idx_inventory_transactions_variant")
  @@map("inventory_transactions")
}

// =============================================
// ADMIN & SYSTEM TABLES
// =============================================

model AuditLog {
  id         String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId     String?   @map("user_id") @db.Uuid
  
  // Action details
  action     String    @db.VarChar(100)
  entityType String    @map("entity_type") @db.VarChar(50)
  entityId   String    @map("entity_id") @db.Uuid
  
  // Changes
  oldValues  Json?     @map("old_values") @db.JsonB
  newValues  Json?     @map("new_values") @db.JsonB
  
  // Context
  ipAddress  String?   @map("ip_address") @db.Inet
  userAgent  String?   @map("user_agent") @db.Text
  
  createdAt  DateTime  @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  user       User?     @relation("CreatedByUser", fields: [userId], references: [id])
  
  @@index([userId, createdAt(sort: Desc)], name: "idx_audit_logs_user")
  @@index([entityType, entityId, createdAt(sort: Desc)], name: "idx_audit_logs_entity")
  @@index([createdAt(sort: Desc)], name: "idx_audit_logs_date")
  @@map("audit_logs")
}

model SystemSetting {
  key         String    @id @db.VarChar(100)
  value       Json      @db.JsonB
  description String?   @db.Text
  updatedBy   String?   @map("updated_by") @db.Uuid
  updatedAt   DateTime  @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  updater     User?     @relation("UpdatedByUser", fields: [updatedBy], references: [id])
  
  @@map("system_settings")
}

// =============================================
// NEW V2.0 FEATURES BELOW
// =============================================

// =============================================
// VIRTUAL CLOSET FEATURE (NEW)
// =============================================

model VirtualClosetItem {
  id                   String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId               String    @map("user_id") @db.Uuid
  productId            String    @map("product_id") @db.Uuid
  variantId            String?   @map("variant_id") @db.Uuid
  
  // Ownership details
  purchaseDate         DateTime? @map("purchase_date") @db.Timestamptz
  orderId              String?   @map("order_id") @db.Uuid
  acquisitionType      String    @default("purchased") @map("acquisition_type") @db.VarChar(50)
  
  // Usage tracking
  wearCount            Int       @default(0) @map("wear_count")
  lastWornDate         DateTime? @map("last_worn_date") @db.Timestamptz
  occasions            String[]
  
  // Organization
  customCategories     String[]  @map("custom_categories")
  seasons              String[]
  colors               String[]
  
  // AI insights
  costPerWear          Decimal?  @map("cost_per_wear") @db.Decimal(10,2)
  versatilityScore     Decimal?  @map("versatility_score") @db.Decimal(3,2)
  compatibilityScores  Json?     @map("compatibility_scores") @db.JsonB
  
  // User notes
  notes                String?   @db.Text
  rating               Int?
  
  // Status
  isActive             Boolean   @default(true) @map("is_active")
  donatedAt            DateTime? @map("donated_at") @db.Timestamptz
  soldAt               DateTime? @map("sold_at") @db.Timestamptz
  
  createdAt            DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt            DateTime  @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  user                 User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  product              Product   @relation(fields: [productId], references: [id])
  variant              ProductVariant? @relation(fields: [variantId], references: [id])
  order                Order?    @relation(fields: [orderId], references: [id])
  
  @@index([userId, isActive], name: "idx_virtual_closet_user")
  @@index([userId, lastWornDate], name: "idx_virtual_closet_worn")
  @@map("virtual_closet_items")
}

// =============================================
// AI OUTFIT RECOMMENDATIONS (NEW)
// =============================================

model OutfitRecommendation {
  id                   String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId               String    @map("user_id") @db.Uuid
  
  // Outfit details
  name                 String?   @db.VarChar(255)
  baseProductId        String    @map("base_product_id") @db.Uuid
  
  // AI metrics
  styleScore           Decimal   @map("style_score") @db.Decimal(3,2)
  occasionTags         String[]  @map("occasion_tags")
  seasonTags           String[]  @map("season_tags")
  colorHarmonyScore    Decimal   @map("color_harmony_score") @db.Decimal(3,2)
  
  // User interaction
  liked                Boolean?
  saved                Boolean   @default(false)
  purchased            Boolean   @default(false)
  viewCount            Int       @default(0) @map("view_count")
  shareCount           Int       @default(0) @map("share_count")
  
  // AI reasoning
  aiReasoning          Json?     @map("ai_reasoning") @db.JsonB
  
  createdAt            DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt            DateTime  @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  user                 User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  baseProduct          Product   @relation("BaseProduct", fields: [baseProductId], references: [id])
  items                OutfitRecommendationItem[]
  
  @@index([userId, createdAt(sort: Desc)], name: "idx_outfit_recommendations_user")
  @@index([styleScore(sort: Desc)], name: "idx_outfit_recommendations_score")
  @@map("outfit_recommendations")
}

model OutfitRecommendationItem {
  id                   String                @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  recommendationId     String                @map("recommendation_id") @db.Uuid
  productId            String                @map("product_id") @db.Uuid
  
  // Item role in outfit
  itemType             String                @db.VarChar(50)
  isOptional           Boolean               @default(false) @map("is_optional")
  alternativeRank      Int?                  @map("alternative_rank")
  
  // Matching score
  matchScore           Decimal               @map("match_score") @db.Decimal(3,2)
  
  // Relations
  recommendation       OutfitRecommendation  @relation(fields: [recommendationId], references: [id], onDelete: Cascade)
  product              Product               @relation(fields: [productId], references: [id])
  
  @@index([recommendationId], name: "idx_outfit_items_recommendation")
  @@map("outfit_recommendation_items")
}

// =============================================
// SIZE RECOMMENDATION SYSTEM (NEW)
// =============================================

model SizeProfile {
  id                   String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId               String    @map("user_id") @db.Uuid
  
  // Body measurements (encrypted)
  measurements         Json      @db.JsonB
  measurementUnit      String    @default("cm") @map("measurement_unit") @db.VarChar(10)
  
  // Fit preferences
  preferredFit         String    @default("regular") @map("preferred_fit") @db.VarChar(50)
  
  // Brand-specific sizes
  brandSizes           Json?     @map("brand_sizes") @db.JsonB
  
  // AI analysis
  bodyType             String?   @map("body_type") @db.VarChar(50)
  fitProfile           Json?     @map("fit_profile") @db.JsonB
  
  // Privacy
  isPublic             Boolean   @default(false) @map("is_public")
  
  createdAt            DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt            DateTime  @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  user                 User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  recommendations      SizeRecommendation[]
  
  @@unique([userId])
  @@map("size_profiles")
}

model SizeRecommendation {
  id                   String         @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  sizeProfileId        String         @map("size_profile_id") @db.Uuid
  variantId            String         @map("variant_id") @db.Uuid
  
  // Recommendation
  recommendedSize      String         @map("recommended_size") @db.VarChar(50)
  confidenceScore      Decimal        @map("confidence_score") @db.Decimal(3,2)
  
  // Fit details
  fitNotes             Json?          @map("fit_notes") @db.JsonB
  
  // Feedback
  userFeedback         String?        @map("user_feedback") @db.VarChar(50)
  actualSizePurchased  String?        @map("actual_size_purchased") @db.VarChar(50)
  
  createdAt            DateTime       @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  sizeProfile          SizeProfile    @relation(fields: [sizeProfileId], references: [id], onDelete: Cascade)
  variant              ProductVariant @relation(fields: [variantId], references: [id])
  
  @@index([sizeProfileId, variantId], name: "idx_size_recommendations")
  @@map("size_recommendations")
}

// =============================================
// LIVE SHOPPING EVENTS (NEW)
// =============================================

model LiveShoppingEvent {
  id                   String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  title                String    @db.VarChar(255)
  description          String?   @db.Text
  hostId               String    @map("host_id") @db.Uuid
  
  // Event timing
  scheduledStart       DateTime  @map("scheduled_start") @db.Timestamptz
  scheduledEnd         DateTime  @map("scheduled_end") @db.Timestamptz
  actualStart          DateTime? @map("actual_start") @db.Timestamptz
  actualEnd            DateTime? @map("actual_end") @db.Timestamptz
  
  // Event status
  status               LiveEventStatus @default(SCHEDULED)
  
  // Streaming details
  streamUrl            String?   @map("stream_url") @db.VarChar(500)
  streamKey            String?   @map("stream_key") @db.VarChar(255)
  recordingUrl         String?   @map("recording_url") @db.VarChar(500)
  
  // Visual assets
  thumbnailUrl         String?   @map("thumbnail_url") @db.VarChar(500)
  bannerUrl            String?   @map("banner_url") @db.VarChar(500)
  
  // Engagement features
  chatEnabled          Boolean   @default(true) @map("chat_enabled")
  maxViewers           Int?      @map("max_viewers")
  
  // Analytics
  viewerCount          Int       @default(0) @map("viewer_count")
  peakViewers          Int       @default(0) @map("peak_viewers")
  uniqueViewers        Int       @default(0) @map("unique_viewers")
  averageViewTime      Int?      @map("average_view_time")
  
  // Sales metrics
  totalSales           Decimal   @default(0) @map("total_sales") @db.Decimal(10,2)
  conversionRate       Decimal?  @map("conversion_rate") @db.Decimal(5,2)
  
  // Promo codes
  exclusiveCode        String?   @map("exclusive_code") @db.VarChar(50)
  discountPercentage   Int?      @map("discount_percentage")
  
  createdAt            DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt            DateTime  @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  host                 User      @relation("EventHost", fields: [hostId], references: [id])
  products             LiveEventProduct[]
  participants         LiveEventParticipation[]
  
  @@index([scheduledStart], name: "idx_live_events_schedule")
  @@index([status], name: "idx_live_events_status")
  @@map("live_shopping_events")
}

model LiveEventProduct {
  eventId              String    @map("event_id") @db.Uuid
  productId            String    @map("product_id") @db.Uuid
  
  // Display details
  displayOrder         Int       @default(0) @map("display_order")
  featuredAt           DateTime? @map("featured_at") @db.Timestamptz
  featuredDuration     Int?      @map("featured_duration")
  
  // Special pricing
  eventPrice           Decimal?  @map("event_price") @db.Decimal(10,2)
  
  // Analytics
  clickCount           Int       @default(0) @map("click_count")
  purchaseCount        Int       @default(0) @map("purchase_count")
  
  // Relations
  event                LiveShoppingEvent @relation(fields: [eventId], references: [id], onDelete: Cascade)
  product              Product   @relation(fields: [productId], references: [id])
  
  @@id([eventId, productId])
  @@index([eventId, displayOrder], name: "idx_live_event_products")
  @@map("live_event_products")
}

model LiveEventParticipation {
  id                   String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  eventId              String    @map("event_id") @db.Uuid
  userId               String    @map("user_id") @db.Uuid
  
  // Participation details
  joinedAt             DateTime  @default(now()) @map("joined_at") @db.Timestamptz
  leftAt               DateTime? @map("left_at") @db.Timestamptz
  watchTimeSeconds     Int       @default(0) @map("watch_time_seconds")
  
  // Engagement
  chatMessageCount     Int       @default(0) @map("chat_message_count")
  reactionCount        Int       @default(0) @map("reaction_count")
  
  // Purchase tracking
  purchasedProducts    String[]  @map("purchased_products") @db.Uuid
  totalSpent           Decimal   @default(0) @map("total_spent") @db.Decimal(10,2)
  
  // Relations
  event                LiveShoppingEvent @relation(fields: [eventId], references: [id], onDelete: Cascade)
  user                 User      @relation(fields: [userId], references: [id])
  
  @@unique([eventId, userId])
  @@index([eventId], name: "idx_live_participations_event")
  @@index([userId], name: "idx_live_participations_user")
  @@map("live_event_participations")
}

// =============================================
// INTERNATIONALIZATION (NEW) - FIXED DESIGN
// =============================================

// Each entity type gets its own translation table to avoid polymorphic relations

model ProductTranslation {
  id                   String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  productId            String    @map("product_id") @db.Uuid
  languageCode         String    @map("language_code") @db.VarChar(10)
  
  // Translatable fields
  name                 String?   @db.VarChar(255)
  description          String?   @db.Text
  story                String?   @db.Text
  metaTitle            String?   @map("meta_title") @db.VarChar(255)
  metaDescription      String?   @map("meta_description") @db.Text
  
  // Metadata
  status               TranslationStatus @default(PENDING)
  isAutoTranslated     Boolean   @default(false) @map("is_auto_translated")
  translatedBy         String?   @map("translated_by") @db.Uuid
  
  createdAt            DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt            DateTime  @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  product              Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([productId, languageCode])
  @@index([languageCode], name: "idx_product_translations_language")
  @@index([status], name: "idx_product_translations_status")
  @@map("product_translations")
}

model CategoryTranslation {
  id                   String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  categoryId           String    @map("category_id") @db.Uuid
  languageCode         String    @map("language_code") @db.VarChar(10)
  
  // Translatable fields
  name                 String?   @db.VarChar(255)
  description          String?   @db.Text
  metaTitle            String?   @map("meta_title") @db.VarChar(255)
  metaDescription      String?   @map("meta_description") @db.Text
  
  // Metadata
  status               TranslationStatus @default(PENDING)
  isAutoTranslated     Boolean   @default(false) @map("is_auto_translated")
  translatedBy         String?   @map("translated_by") @db.Uuid
  
  createdAt            DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt            DateTime  @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  category             Category  @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  
  @@unique([categoryId, languageCode])
  @@index([languageCode], name: "idx_category_translations_language")
  @@map("category_translations")
}

model CollectionTranslation {
  id                   String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  collectionId         String    @map("collection_id") @db.Uuid
  languageCode         String    @map("language_code") @db.VarChar(10)
  
  // Translatable fields
  name                 String?   @db.VarChar(255)
  description          String?   @db.Text
  metaTitle            String?   @map("meta_title") @db.VarChar(255)
  metaDescription      String?   @map("meta_description") @db.Text
  
  // Metadata
  status               TranslationStatus @default(PENDING)
  isAutoTranslated     Boolean   @default(false) @map("is_auto_translated")
  translatedBy         String?   @map("translated_by") @db.Uuid
  
  createdAt            DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt            DateTime  @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  collection           Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)
  
  @@unique([collectionId, languageCode])
  @@index([languageCode], name: "idx_collection_translations_language")
  @@map("collection_translations")
}

model BrandTranslation {
  id                   String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  brandId              String    @map("brand_id") @db.Uuid
  languageCode         String    @map("language_code") @db.VarChar(10)
  
  // Translatable fields
  description          String?   @db.Text
  story                String?   @db.Text
  
  // Metadata
  status               TranslationStatus @default(PENDING)
  isAutoTranslated     Boolean   @default(false) @map("is_auto_translated")
  translatedBy         String?   @map("translated_by") @db.Uuid
  
  createdAt            DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt            DateTime  @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  brand                Brand     @relation(fields: [brandId], references: [id], onDelete: Cascade)
  
  @@unique([brandId, languageCode])
  @@index([languageCode], name: "idx_brand_translations_language")
  @@map("brand_translations")
}

// =============================================
// FEATURE FLAGS (NEW)
// =============================================

model FeatureFlag {
  key            String    @id @db.VarChar(100)
  enabled        Boolean   @default(false)
  rollout        Decimal   @default(0) @db.Decimal(5,2) // 0-100 percentage
  userGroups     String[]  @map("user_groups")
  
  // Targeting rules
  targetingRules Json?     @map("targeting_rules") @db.JsonB
  
  // Metadata
  description    String?   @db.Text
  metadata       Json?     @db.JsonB
  
  createdAt      DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt      DateTime  @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  
  @@index([enabled], name: "idx_feature_flags_enabled")
  @@map("feature_flags")
}

// =============================================
// PERFORMANCE METRICS (NEW)
// =============================================

model PerformanceMetric {
  id            String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  metricType    String    @map("metric_type") @db.VarChar(100)
  
  // Metric value
  value         Decimal   @db.Decimal(10,3)
  unit          String?   @db.VarChar(20)
  
  // Context
  page          String?   @db.VarChar(255)
  userAgent     String?   @map("user_agent") @db.Text
  
  // Additional data
  metadata      Json?     @db.JsonB
  
  recordedAt    DateTime  @default(now()) @map("recorded_at") @db.Timestamptz
  
  @@index([metricType, recordedAt(sort: Desc)], name: "idx_performance_metrics")
  @@index([recordedAt(sort: Desc)], name: "idx_performance_metrics_date")
  @@map("performance_metrics")
}

```

# src/hooks/use-session.ts
```ts
// src/hooks/use-session.ts
'use client'

import { useSession as useNextAuthSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'

export function useSession() {
  const { data: session, status, update } = useNextAuthSession()
  const router = useRouter()
  
  // Computed properties
  const user = session?.user
  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated'
  const isUnauthenticated = status === 'unauthenticated'
  
  // Role checks
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'
  const isSuperAdmin = user?.role === 'SUPER_ADMIN'
  const isVIP = user?.membershipTier === 'DIAMOND' || user?.membershipTier === 'OBSIDIAN'
  const isPremiumMember = user?.membershipTier !== 'PEARL'
  
  // Helper to require authentication
  const requireAuth = useCallback((redirectUrl?: string) => {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', window.location.origin)
      if (redirectUrl) {
        loginUrl.searchParams.set('callbackUrl', redirectUrl)
      }
      router.push(loginUrl.toString())
      return false
    }
    return true
  }, [isAuthenticated, router])
  
  // Helper to require specific role
  const requireRole = useCallback((role: string | string[], redirectUrl = '/403') => {
    const roles = Array.isArray(role) ? role : [role]
    
    if (!user || !roles.includes(user.role)) {
      router.push(redirectUrl)
      return false
    }
    return true
  }, [user, router])
  
  // Helper to require membership tier
  const requireMembership = useCallback((tier: string | string[], redirectUrl = '/account/membership') => {
    const tiers = Array.isArray(tier) ? tier : [tier]
    
    if (!user || !tiers.includes(user.membershipTier)) {
      const url = new URL(redirectUrl, window.location.origin)
      url.searchParams.set('upgrade', 'true')
      router.push(url.toString())
      return false
    }
    return true
  }, [user, router])
  
  // Update user data
  const updateUser = useCallback(async (data: Partial<typeof user>) => {
    await update({
      ...session,
      user: {
        ...user,
        ...data,
      },
    })
  }, [session, user, update])
  
  // Memoized return value
  return useMemo(() => ({
    // Session data
    session,
    user,
    status,
    
    // Status helpers
    isLoading,
    isAuthenticated,
    isUnauthenticated,
    
    // Role helpers
    isAdmin,
    isSuperAdmin,
    isVIP,
    isPremiumMember,
    
    // Methods
    update,
    updateUser,
    requireAuth,
    requireRole,
    requireMembership,
  }), [
    session,
    user,
    status,
    isLoading,
    isAuthenticated,
    isUnauthenticated,
    isAdmin,
    isSuperAdmin,
    isVIP,
    isPremiumMember,
    update,
    updateUser,
    requireAuth,
    requireRole,
    requireMembership,
  ])
}

// Type export for use in components
export type UseSessionReturn = ReturnType<typeof useSession>

```

# src/store/cart.store.ts
```ts
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

```

# src/lib/prisma.ts
```ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
    errorFormat: process.env.NODE_ENV === 'development' ? 'pretty' : 'minimal',
  })
}

// Prevent multiple instances of Prisma Client in development
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Middleware for soft deletes
prisma.$use(async (params, next) => {
  // Soft delete handling
  if (params.model && ['User', 'Product', 'Order'].includes(params.model)) {
    if (params.action === 'delete') {
      params.action = 'update'
      params.args['data'] = { deletedAt: new Date() }
    }
    
    if (params.action === 'deleteMany') {
      params.action = 'updateMany'
      if (params.args.data !== undefined) {
        params.args.data['deletedAt'] = new Date()
      } else {
        params.args['data'] = { deletedAt: new Date() }
      }
    }
    
    // Exclude soft deleted records from finds
    if (params.action === 'findUnique' || params.action === 'findFirst') {
      params.action = 'findFirst'
      params.args.where = {
        ...params.args.where,
        deletedAt: null,
      }
    }
    
    if (params.action === 'findMany') {
      if (params.args.where) {
        if (params.args.where.deletedAt === undefined) {
          params.args.where['deletedAt'] = null
        }
      } else {
        params.args['where'] = { deletedAt: null }
      }
    }
  }
  
  return next(params)
})

// Helper to handle Prisma errors
export class PrismaError extends Error {
  code: string
  
  constructor(error: any) {
    super(error.message)
    this.name = 'PrismaError'
    this.code = error.code || 'UNKNOWN'
  }
}

// Type-safe transaction helper
export async function prismaTransaction<T>(
  fn: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(fn, {
    maxWait: 5000, // 5 seconds max wait
    timeout: 10000, // 10 seconds timeout
    isolationLevel: 'Serializable',
  })
}

// Connection health check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

```

# src/lib/auth.ts
```ts
// src/lib/auth.ts
import { NextAuthOptions, DefaultSession, getServerSession } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import AppleProvider from 'next-auth/providers/apple'
import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import { z } from 'zod'
import { nanoid } from 'nanoid'

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

// Validation schemas
const credentialsSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  
  // Configure session strategy
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  
  // Custom pages for luxury branding
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/welcome',
  },
  
  // Configure providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    
    AppleProvider({
      clientId: process.env.APPLE_ID!,
      clientSecret: process.env.APPLE_SECRET!,
    }),
    
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      maxAge: 24 * 60 * 60, // Magic links valid for 24 hours
    }),
    
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'you@example.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        try {
          // Validate input
          const { email, password } = credentialsSchema.parse(credentials)
          
          // Find user with style profile for personalization
          const user = await prisma.user.findUnique({
            where: { 
              email: email.toLowerCase(),
              deletedAt: null, // Ensure user is not soft-deleted
            },
            select: {
              id: true,
              email: true,
              emailVerified: true,
              name: true,
              passwordHash: true,
              avatarUrl: true,
              role: true,
              membershipTier: true,
              loginCount: true,
            },
          })
          
          if (!user || !user.passwordHash) {
            // Prevent timing attacks by comparing with a dummy hash
            await compare('dummy', '$2a$12$dummy.hash.to.prevent.timing.attacks')
            return null
          }
          
          // Verify password
          const isPasswordValid = await compare(password, user.passwordHash)
          
          if (!isPasswordValid) {
            // Log failed attempt for security monitoring
            await prisma.auditLog.create({
              data: {
                action: 'LOGIN_FAILED',
                entityType: 'user',
                entityId: user.id,
                metadata: {
                  reason: 'invalid_password',
                  email: email.toLowerCase(),
                },
              },
            })
            return null
          }
          
          // Update last login and increment login count
          await prisma.user.update({
            where: { id: user.id },
            data: {
              lastLoginAt: new Date(),
              loginCount: user.loginCount + 1,
            },
          })
          
          // Return user object for JWT
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatarUrl,
            role: user.role,
            membershipTier: user.membershipTier,
            emailVerified: user.emailVerified,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  
  // Callbacks for token and session management
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Check if user is banned or suspended
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
        select: { deletedAt: true },
      })
      
      if (dbUser?.deletedAt) {
        return false
      }
      
      // For OAuth providers, update profile info
      if (account?.provider && account.provider !== 'credentials') {
        await prisma.user.update({
          where: { email: user.email! },
          data: {
            name: user.name || profile?.name,
            avatarUrl: user.image || profile?.image,
            emailVerified: new Date(), // OAuth emails are pre-verified
          },
        })
      }
      
      return true
    },
    
    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.role = user.role
        token.membershipTier = user.membershipTier
        token.emailVerified = user.emailVerified
      }
      
      // Update token if user data changes
      if (trigger === 'update' && session) {
        token.name = session.name
        token.email = session.email
        token.image = session.image
      }
      
      // Refresh user data periodically
      if (token.id && trigger === 'update') {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: {
            role: true,
            membershipTier: true,
            emailVerified: true,
            deletedAt: true,
          },
        })
        
        if (dbUser && !dbUser.deletedAt) {
          token.role = dbUser.role
          token.membershipTier = dbUser.membershipTier
          token.emailVerified = dbUser.emailVerified
        }
      }
      
      return token
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.membershipTier = token.membershipTier
        session.user.emailVerified = token.emailVerified
      }
      
      return session
    },
    
    async redirect({ url, baseUrl }) {
      // Allow relative URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      
      // Allow URLs on the same origin
      if (new URL(url).origin === baseUrl) return url
      
      // Default redirect
      return baseUrl
    },
  },
  
  // Event handlers for analytics and monitoring
  events: {
    async signIn({ user, account, isNewUser }) {
      // Track sign in event
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_LOGIN',
          entityType: 'user',
          entityId: user.id,
          metadata: {
            provider: account?.provider || 'credentials',
            isNewUser,
          },
        },
      })
      
      // Welcome new users with a notification
      if (isNewUser) {
        await prisma.notification.create({
          data: {
            userId: user.id,
            type: 'MEMBERSHIP_UPDATE',
            title: 'Welcome to LuxeVerse',
            message: 'Your journey into luxury begins here. Explore our curated collections and enjoy exclusive member benefits.',
            actionUrl: '/products',
            actionLabel: 'Start Shopping',
          },
        })
      }
    },
    
    async signOut({ token }) {
      // Track sign out event
      if (token?.id) {
        await prisma.auditLog.create({
          data: {
            userId: token.id,
            action: 'USER_LOGOUT',
            entityType: 'user',
            entityId: token.id,
          },
        })
      }
    },
    
    async createUser({ user }) {
      // Initialize user preferences and style profile
      await prisma.styleProfile.create({
        data: {
          userId: user.id,
          stylePersonas: [],
          favoriteColors: [],
          preferredBrands: [],
          avoidedMaterials: [],
          avoidedColors: [],
        },
      })
      
      // Create default wishlist
      await prisma.wishlist.create({
        data: {
          userId: user.id,
          name: 'My Wishlist',
          isPublic: false,
          shareToken: nanoid(10),
        },
      })
      
      // Grant welcome bonus loyalty points
      await prisma.loyaltyPoint.create({
        data: {
          userId: user.id,
          type: 'WELCOME_BONUS',
          points: 500,
          balanceAfter: 500,
          description: 'Welcome to LuxeVerse!',
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        },
      })
    },
  },
  
  // Security options
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // Enable debug in development
  debug: process.env.NODE_ENV === 'development',
}

// Helper function to get server-side session
export const getServerAuthSession = () => getServerSession(authOptions)

// Helper function to require authentication
export async function requireAuth() {
  const session = await getServerAuthSession()
  
  if (!session) {
    throw new Error('Unauthorized')
  }
  
  return session
}

// Helper function to require specific role
export async function requireRole(role: UserRole | UserRole[]) {
  const session = await requireAuth()
  const roles = Array.isArray(role) ? role : [role]
  
  if (!roles.includes(session.user.role)) {
    throw new Error('Insufficient permissions')
  }
  
  return session
}

```

# src/lib/stripe.ts
```ts
// src/lib/stripe.ts
import { loadStripe, Stripe } from '@stripe/stripe-js'
import StripeServer from 'stripe'

// Client-side Stripe instance
let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    )
  }
  return stripePromise
}

// Server-side Stripe instance
export const stripe = new StripeServer(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
  appInfo: {
    name: 'LuxeVerse',
    version: '2.0.0',
    url: 'https://luxeverse.ai',
  },
})

// Payment intent metadata type
export interface PaymentIntentMetadata {
  orderId: string
  userId?: string
  cartId?: string
  customerEmail: string
  shippingMethod: string
  orderTotal: string
  itemCount: string
}

// Create payment intent with enhanced options
export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  metadata: PaymentIntentMetadata,
  options?: {
    customerId?: string
    paymentMethodTypes?: string[]
    setupFutureUsage?: 'on_session' | 'off_session'
    captureMethod?: 'automatic' | 'manual'
  }
) {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
    ...options,
  })
}

// Update payment intent amount (for shipping changes, etc.)
export async function updatePaymentIntent(
  paymentIntentId: string,
  amount: number,
  metadata?: Partial<PaymentIntentMetadata>
) {
  return await stripe.paymentIntents.update(paymentIntentId, {
    amount: Math.round(amount * 100),
    ...(metadata && { metadata: metadata as any }),
  })
}

// Create or retrieve customer
export async function getOrCreateCustomer(
  email: string,
  metadata?: Record<string, string>
) {
  // Search for existing customer
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  })
  
  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0]
  }
  
  // Create new customer
  return await stripe.customers.create({
    email,
    metadata,
  })
}

// Save payment method for future use
export async function savePaymentMethod(
  paymentMethodId: string,
  customerId: string
) {
  // Attach payment method to customer
  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  })
  
  // Set as default payment method
  await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  })
}

// Create checkout session (alternative to payment intents)
export async function createCheckoutSession(
  items: Array<{
    name: string
    description?: string
    images?: string[]
    amount: number
    currency: string
    quantity: number
  }>,
  metadata: PaymentIntentMetadata,
  options: {
    successUrl: string
    cancelUrl: string
    customerId?: string
    customerEmail?: string
    allowPromotionCodes?: boolean
    shippingAddressCollection?: boolean
  }
) {
  const lineItems = items.map(item => ({
    price_data: {
      currency: item.currency,
      product_data: {
        name: item.name,
        description: item.description,
        images: item.images,
      },
      unit_amount: Math.round(item.amount * 100),
    },
    quantity: item.quantity,
  }))
  
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    metadata,
    success_url: options.successUrl,
    cancel_url: options.cancelUrl,
    customer: options.customerId,
    customer_email: options.customerEmail,
    allow_promotion_codes: options.allowPromotionCodes,
    shipping_address_collection: options.shippingAddressCollection ? {
      allowed_countries: ['US', 'CA', 'GB', 'AU', 'EU'],
    } : undefined,
  })
}

// Handle webhook events
export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Promise<StripeServer.Event> {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}

// Process refund
export async function createRefund(
  paymentIntentId: string,
  amount?: number,
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
) {
  return await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: amount ? Math.round(amount * 100) : undefined,
    reason,
  })
}

// Subscription management (for future features)
export async function createSubscription(
  customerId: string,
  priceId: string,
  options?: {
    trialPeriodDays?: number
    metadata?: Record<string, string>
    coupon?: string
  }
) {
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
    ...options,
  })
}

// Validate discount code
export async function validateCoupon(code: string) {
  try {
    const coupon = await stripe.coupons.retrieve(code)
    
    if (!coupon.valid) {
      throw new Error('Coupon is not valid')
    }
    
    return {
      id: coupon.id,
      type: coupon.percent_off ? 'percentage' : 'fixed',
      value: coupon.percent_off || coupon.amount_off! / 100,
      currency: coupon.currency,
      duration: coupon.duration,
      valid: coupon.valid,
    }
  } catch (error) {
    throw new Error('Invalid coupon code')
  }
}

// Calculate application fee (for marketplace features)
export function calculateApplicationFee(amount: number, feePercentage: number = 10) {
  return Math.round(amount * (feePercentage / 100))
}

// Format amount for display
export function formatStripeAmount(amount: number, currency: string = 'usd') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}

```

# src/styles/globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ============================================= */
/* CSS VARIABLES & THEME CONFIGURATION           */
/* ============================================= */

@layer base {
  :root {
    /* Background & Foreground */
    --background: 0 0% 100%;
    --foreground: 224 71.4% 4.1%;
    
    /* Card */
    --card: 0 0% 100%;
    --card-foreground: 224 71.4% 4.1%;
    
    /* Popover */
    --popover: 0 0% 100%;
    --popover-foreground: 224 71.4% 4.1%;
    
    /* Primary */
    --primary: 220.9 39.3% 11%;
    --primary-foreground: 210 20% 98%;
    
    /* Secondary */
    --secondary: 220 14.3% 95.9%;
    --secondary-foreground: 220.9 39.3% 11%;
    
    /* Muted */
    --muted: 220 14.3% 95.9%;
    --muted-foreground: 220 8.9% 46.1%;
    
    /* Accent */
    --accent: 220 14.3% 95.9%;
    --accent-foreground: 220.9 39.3% 11%;
    
    /* Destructive */
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 20% 98%;
    
    /* Border, Input, Ring */
    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 224 71.4% 4.1%;
    
    /* Radius */
    --radius: 0.5rem;
    
    /* LuxeVerse Custom Colors */
    --luxury-gold: 51 100% 50%;
    --luxury-gold-light: 51 100% 85%;
    --luxury-gold-dark: 43 100% 35%;
    --luxury-platinum: 60 2% 89%;
    --luxury-platinum-light: 60 2% 95%;
    --luxury-platinum-dark: 0 0% 75%;
    --luxury-obsidian: 240 3% 4%;
    --luxury-obsidian-light: 240 3% 10%;
    --luxury-obsidian-dark: 0 0% 0%;
    
    /* Neon Colors */
    --neon-pink: 340 100% 50%;
    --neon-cyan: 190 100% 50%;
    --neon-lime: 150 100% 50%;
    --neon-purple: 270 100% 50%;
    --neon-orange: 25 100% 50%;
  }
  
  .dark {
    /* Background & Foreground */
    --background: 224 71.4% 4.1%;
    --foreground: 210 20% 98%;
    
    /* Card */
    --card: 224 71.4% 4.1%;
    --card-foreground: 210 20% 98%;
    
    /* Popover */
    --popover: 224 71.4% 4.1%;
    --popover-foreground: 210 20% 98%;
    
    /* Primary */
    --primary: 210 20% 98%;
    --primary-foreground: 220.9 39.3% 11%;
    
    /* Secondary */
    --secondary: 215 27.9% 16.9%;
    --secondary-foreground: 210 20% 98%;
    
    /* Muted */
    --muted: 215 27.9% 16.9%;
    --muted-foreground: 217.9 10.6% 64.9%;
    
    /* Accent */
    --accent: 215 27.9% 16.9%;
    --accent-foreground: 210 20% 98%;
    
    /* Destructive */
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 20% 98%;
    
    /* Border, Input, Ring */
    --border: 215 27.9% 16.9%;
    --input: 215 27.9% 16.9%;
    --ring: 216 12.2% 83.9%;
  }
}

/* ============================================= */
/* BASE STYLES                                   */
/* ============================================= */

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    @apply scroll-m-20 tracking-tight;
  }
  
  h1 {
    @apply text-4xl font-extrabold lg:text-5xl;
  }
  
  h2 {
    @apply text-3xl font-semibold;
  }
  
  h3 {
    @apply text-2xl font-semibold;
  }
  
  h4 {
    @apply text-xl font-semibold;
  }
  
  p {
    @apply leading-7 [&:not(:first-child)]:mt-6;
  }
  
  /* Links */
  a {
    @apply transition-colors hover:text-primary;
  }
  
  /* Code */
  code {
    @apply relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold;
  }
  
  /* Blockquote */
  blockquote {
    @apply mt-6 border-l-2 pl-6 italic;
  }
  
  /* Lists */
  ul {
    @apply my-6 ml-6 list-disc [&>li]:mt-2;
  }
  
  /* Tables */
  table {
    @apply w-full;
  }
  
  tr {
    @apply m-0 border-t p-0 even:bg-muted;
  }
  
  th {
    @apply border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right;
  }
  
  td {
    @apply border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right;
  }
}

/* ============================================= */
/* COMPONENT STYLES                              */
/* ============================================= */

@layer components {
  /* Container */
  .container {
    @apply mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8;
  }
  
  /* Buttons */
  .btn-luxury {
    @apply relative overflow-hidden bg-gradient-to-r from-luxury-gold to-luxury-gold-light 
           text-luxury-obsidian font-semibold transition-all duration-300 
           hover:from-luxury-gold-light hover:to-luxury-gold hover:shadow-xl;
  }
  
  .btn-neon {
    @apply relative overflow-hidden bg-gradient-to-r from-neon-pink to-neon-purple 
           text-white font-semibold transition-all duration-300 
           hover:shadow-[0_0_20px_rgba(255,0,110,0.5)] hover:scale-105;
  }
  
  /* Cards */
  .card-luxury {
    @apply relative overflow-hidden rounded-lg border border-luxury-gold/20 
           bg-gradient-to-br from-luxury-obsidian to-luxury-obsidian-light 
           p-6 shadow-xl backdrop-blur-sm;
  }
  
  /* Gradients */
  .gradient-luxury {
    @apply bg-gradient-to-r from-luxury-gold via-luxury-platinum to-luxury-gold bg-clip-text text-transparent;
  }
  
  .gradient-neon {
    @apply bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-clip-text text-transparent;
  }
  
  /* Glass Effect */
  .glass {
    @apply backdrop-blur-md bg-white/10 border border-white/20 shadow-xl;
  }
  
  .glass-dark {
    @apply backdrop-blur-md bg-black/10 border border-black/20 shadow-xl;
  }
  
  /* Loading States */
  .skeleton {
    @apply animate-pulse rounded-md bg-muted;
  }
  
  .shimmer {
    @apply relative overflow-hidden before:absolute before:inset-0 
           before:-translate-x-full before:animate-shimmer 
           before:bg-gradient-to-r before:from-transparent 
           before:via-white/10 before:to-transparent;
  }
  
  /* Focus States */
  .focus-ring {
    @apply focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background;
  }
  
  /* Scrollbar */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: hsl(var(--luxury-gold)) hsl(var(--luxury-obsidian));
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    @apply bg-luxury-obsidian;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-luxury-gold rounded-full;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    @apply bg-luxury-gold-light;
  }
}

/* ============================================= */
/* UTILITY STYLES                                */
/* ============================================= */

@layer utilities {
  /* Text Balance */
  .text-balance {
    text-wrap: balance;
  }
  
  /* Gradient Animation */
  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient-xy 15s ease infinite;
  }
  
  /* Perspective */
  .perspective-1000 {
    perspective: 1000px;
  }
  
  .preserve-3d {
    transform-style: preserve-3d;
  }
  
  /* Mask */
  .mask-gradient-to-b {
    mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
  }
  
  .mask-gradient-to-t {
    mask-image: linear-gradient(to top, black 0%, transparent 100%);
    -webkit-mask-image: linear-gradient(to top, black 0%, transparent 100%);
  }
  
  /* Selection */
  .selection-luxury::selection {
    @apply bg-luxury-gold text-luxury-obsidian;
  }
  
  .selection-neon::selection {
    @apply bg-neon-pink text-white;
  }
  
  /* No Scrollbar */
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  /* Debug */
  .debug-red {
    @apply border border-red-500;
  }
  
  .debug-blue {
    @apply border border-blue-500;
  }
  
  .debug-green {
    @apply border border-green-500;
  }
}

/* ============================================= */
/* ANIMATIONS                                    */
/* ============================================= */

@layer utilities {
  /* Entrance Animations */
  .animate-in {
    animation-name: enter;
    animation-duration: 0.5s;
    animation-fill-mode: both;
  }
  
  @keyframes enter {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Hover Effects */
  .hover-lift {
    @apply transition-transform duration-300 hover:-translate-y-1;
  }
  
  .hover-grow {
    @apply transition-transform duration-300 hover:scale-105;
  }
  
  .hover-shrink {
    @apply transition-transform duration-300 hover:scale-95;
  }
  
  /* Glow Effects */
  .glow-luxury {
    @apply hover:shadow-[0_0_20px_rgba(255,215,0,0.3)];
  }
  
  .glow-neon-pink {
    @apply hover:shadow-[0_0_20px_rgba(255,0,110,0.5)];
  }
  
  .glow-neon-cyan {
    @apply hover:shadow-[0_0_20px_rgba(0,217,255,0.5)];
  }
}

/* ============================================= */
/* RESPONSIVE UTILITIES                          */
/* ============================================= */

@layer utilities {
  /* Safe Area Insets */
  .safe-top {
    padding-top: env(safe-area-inset-top);
  }
  
  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  .safe-left {
    padding-left: env(safe-area-inset-left);
  }
  
  .safe-right {
    padding-right: env(safe-area-inset-right);
  }
}

/* ============================================= */
/* PRINT STYLES                                  */
/* ============================================= */

@media print {
  body {
    @apply text-black bg-white;
  }
  
  .no-print {
    display: none !important;
  }
  
  a {
    @apply text-black underline;
  }
  
  a[href^="http"]:after {
    content: " (" attr(href) ")";
  }
}

```

# src/server/api/trpc.ts
```ts
// src/server/api/trpc.ts
/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */

import { initTRPC, TRPCError } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { type Session } from 'next-auth'
import superjson from 'superjson'
import { ZodError } from 'zod'

import { getServerAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkDatabaseConnection } from '@/lib/prisma'
import type { UserRole } from '@prisma/client'

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts

  // Get the session from the server using the getServerSession wrapper function
  const session = await getServerAuthSession()

  // Check database connection health
  const isDbConnected = await checkDatabaseConnection()
  if (!isDbConnected) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Database connection failed',
    })
  }

  return {
    session,
    prisma,
    req,
    res,
    // Add request metadata for logging/analytics
    metadata: {
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'],
      timestamp: new Date(),
    },
  }
}

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router

/**
 * Middleware for timing procedures
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now()

  const result = await next()

  const durationMs = Date.now() - start
  console.log(`[tRPC] ${path} took ${durationMs}ms`)

  return result
})

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(timingMiddleware)

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    return next({
      ctx: {
        // infers the `session` as non-nullable
        session: { ...ctx.session, user: ctx.session.user },
      },
    })
  })

/**
 * Admin procedure
 *
 * If you want a query or mutation to ONLY be accessible to users with admin role.
 */
export const adminProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    const userRole = ctx.session.user.role as UserRole
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      throw new TRPCError({ code: 'FORBIDDEN' })
    }

    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user },
      },
    })
  })

/**
 * VIP procedure
 *
 * For VIP-only features
 */
export const vipProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    const userRole = ctx.session.user.role as UserRole
    if (userRole !== 'VIP' && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      throw new TRPCError({ 
        code: 'FORBIDDEN',
        message: 'This feature is exclusive to VIP members',
      })
    }

    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user },
      },
    })
  })

```

# src/server/api/routers/cart.ts
```ts
// src/server/api/routers/cart.ts
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from '@/server/api/trpc'
import { stripe, validateCoupon } from '@/lib/stripe'
import { nanoid } from 'nanoid'

export const cartRouter = createTRPCRouter({
  /**
   * Sync cart with server
   */
  sync: publicProcedure
    .input(
      z.object({
        cartId: z.string().optional(),
        items: z.array(
          z.object({
            productId: z.string().uuid(),
            variantId: z.string().uuid().optional(),
            quantity: z.number().positive(),
            personalizations: z.record(z.any()).optional(),
          })
        ),
        discountCodes: z.array(z.string()).optional(),
        giftCardCodes: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let cart
      
      // Find or create cart
      if (input.cartId) {
        cart = await ctx.prisma.cart.findUnique({
          where: { id: input.cartId },
          include: { items: true },
        })
      }
      
      if (!cart) {
        // Create new cart
        cart = await ctx.prisma.cart.create({
          data: {
            id: nanoid(),
            userId: ctx.session?.user?.id,
            sessionId: ctx.session?.id,
            items: {
              create: [],
            },
          },
          include: { items: true },
        })
      }
      
      // Update cart items
      // First, remove all existing items
      await ctx.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      })
      
      // Then add new items
      const cartItems = await Promise.all(
        input.items.map(async (item) => {
          // Get product and variant info
          const product = await ctx.prisma.product.findUnique({
            where: { id: item.productId },
            select: {
              id: true,
              price: true,
              compareAtPrice: true,
            },
          })
          
          if (!product) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: `Product ${item.productId} not found`,
            })
          }
          
          let price = product.price
          let compareAtPrice = product.compareAtPrice
          
          if (item.variantId) {
            const variant = await ctx.prisma.productVariant.findUnique({
              where: { id: item.variantId },
              select: {
                price: true,
                compareAtPrice: true,
              },
            })
            
            if (variant) {
              price = variant.price || price
              compareAtPrice = variant.compareAtPrice || compareAtPrice
            }
          }
          
          return ctx.prisma.cartItem.create({
            data: {
              cartId: cart.id,
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              priceAtTime: price,
              personalization: item.personalizations,
            },
          })
        })
      )
      
      // Update cart totals
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.priceAtTime.toNumber() * item.quantity,
        0
      )
      
      await ctx.prisma.cart.update({
        where: { id: cart.id },
        data: {
          subtotal,
          total: subtotal, // Will be recalculated with tax/shipping
          couponCode: input.discountCodes?.[0],
          giftCardCodes: input.giftCardCodes || [],
        },
      })
      
      return cart
    }),

  /**
   * Validate stock availability
   */
  validateStock: publicProcedure
    .input(
      z.array(
        z.object({
          productId: z.string().uuid(),
          variantId: z.string().uuid().optional(),
          quantity: z.number().positive(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const stockStatus = await Promise.all(
        input.map(async (item) => {
          if (item.variantId) {
            const variant = await ctx.prisma.productVariant.findUnique({
              where: { id: item.variantId },
              select: {
                inventoryQuantity: true,
                inventoryReserved: true,
                isAvailable: true,
              },
            })
            
            if (!variant || !variant.isAvailable) {
              return {
                productId: item.productId,
                variantId: item.variantId,
                inStock: false,
                availableQuantity: 0,
              }
            }
            
            const available = variant.inventoryQuantity - variant.inventoryReserved
            
            return {
              productId: item.productId,
              variantId: item.variantId,
              inStock: available >= item.quantity,
              availableQuantity: available,
            }
          }
          
          // Check product-level stock
          const product = await ctx.prisma.product.findUnique({
            where: { id: item.productId },
            select: {
              variants: {
                select: {
                  inventoryQuantity: true,
                  inventoryReserved: true,
                },
              },
            },
          })
          
          if (!product) {
            return {
              productId: item.productId,
              inStock: false,
              availableQuantity: 0,
            }
          }
          
          const totalAvailable = product.variants.reduce(
            (sum, v) => sum + v.inventoryQuantity - v.inventoryReserved,
            0
          )
          
          return {
            productId: item.productId,
            inStock: totalAvailable >= item.quantity,
            availableQuantity: totalAvailable,
          }
        })
      )
      
      return stockStatus
    }),

  /**
   * Validate discount code
   */
  validateDiscount: publicProcedure
    .input(
      z.object({
        code: z.string(),
        subtotal: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Check database first
        const coupon = await ctx.prisma.coupon.findUnique({
          where: { code: input.code.toUpperCase() },
          select: {
            id: true,
            code: true,
            discountType: true,
            discountValue: true,
            minimumAmount: true,
            validFrom: true,
            validUntil: true,
            usageLimit: true,
            usageCount: true,
            usageLimitPerUser: true,
            firstPurchaseOnly: true,
            membershipTiers: true,
          },
        })
        
        if (!coupon) {
          // Try Stripe as fallback
          const stripeCoupon = await validateCoupon(input.code)
          
          return {
            code: input.code,
            type: stripeCoupon.type as 'percentage' | 'fixed',
            value: stripeCoupon.value,
          }
        }
        
        // Validate coupon rules
        const now = new Date()
        
        if (coupon.validFrom && coupon.validFrom > now) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Coupon is not yet valid',
          })
        }
        
        if (coupon.validUntil && coupon.validUntil < now) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Coupon has expired',
          })
        }
        
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Coupon usage limit reached',
          })
        }
        
        if (coupon.minimumAmount && input.subtotal) {
          if (input.subtotal < coupon.minimumAmount.toNumber()) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: `Minimum order amount of ${coupon.minimumAmount} required`,
            })
          }
        }
        
        // Check user-specific rules
        if (ctx.session?.user) {
          if (coupon.firstPurchaseOnly) {
            const orderCount = await ctx.prisma.order.count({
              where: { userId: ctx.session.user.id },
            })
            
            if (orderCount > 0) {
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Coupon is only valid for first purchase',
              })
            }
          }
          
          if (coupon.usageLimitPerUser) {
            const userUsageCount = await ctx.prisma.couponUse.count({
              where: {
                couponId: coupon.id,
                userId: ctx.session.user.id,
              },
            })
            
            if (userUsageCount >= coupon.usageLimitPerUser) {
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'You have already used this coupon',
              })
            }
          }
          
          // Check membership tier requirements
          if (coupon.membershipTiers.length > 0) {
            const user = await ctx.prisma.user.findUnique({
              where: { id: ctx.session.user.id },
              select: { membershipTier: true },
            })
            
            if (!user || !coupon.membershipTiers.includes(user.membershipTier)) {
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Coupon is not valid for your membership tier',
              })
            }
          }
        }
        
        return {
          code: coupon.code,
          type: coupon.discountType as 'percentage' | 'fixed',
          value: coupon.discountValue.toNumber(),
          minimumAmount: coupon.minimumAmount?.toNumber(),
        }
        
      } catch (error) {
        if (error instanceof TRPCError) throw error
        
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid discount code',
        })
      }
    }),

  /**
   * Validate gift card
   */
  validateGiftCard: publicProcedure
    .input(
      z.object({
        code: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // In a real implementation, you would have a gift card system
      // For now, we'll return a mock response
      
      // Mock gift card validation
      if (input.code.startsWith('GIFT')) {
        return {
          code: input.code,
          balance: 50, // $50 gift card
          currency: 'USD',
        }
      }
      
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid gift card',
      })
    }),

  /**
   * Merge guest cart with user cart after login
   */
  mergeGuestCart: protectedProcedure
    .input(
      z.object({
        guestCartId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get guest cart
      const guestCart = await ctx.prisma.cart.findUnique({
        where: { id: input.guestCartId },
        include: { items: true },
      })
      
      if (!guestCart) {
        return { success: false }
      }
      
      // Get or create user cart
      let userCart = await ctx.prisma.cart.findFirst({
        where: {
          userId: input.userId,
          isAbandoned: false,
        },
        include: { items: true },
      })
      
      if (!userCart) {
        // Transfer guest cart to user
        userCart = await ctx.prisma.cart.update({
          where: { id: guestCart.id },
          data: { userId: input.userId },
          include: { items: true },
        })
      } else {
        // Merge items
        const existingProductIds = new Set(
          userCart.items.map(item => `${item.productId}-${item.variantId}`)
        )
        
        const itemsToAdd = guestCart.items.filter(
          item => !existingProductIds.has(`${item.productId}-${item.variantId}`)
        )
        
        if (itemsToAdd.length > 0) {
          await ctx.prisma.cartItem.createMany({
            data: itemsToAdd.map(item => ({
              cartId: userCart!.id,
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              priceAtTime: item.priceAtTime,
              personalization: item.personalization,
            })),
          })
        }
        
        // Delete guest cart
        await ctx.prisma.cart.delete({
          where: { id: guestCart.id },
        })
      }
      
      return { success: true, cartId: userCart.id }
    }),

  /**
   * Get estimated shipping rates
   */
  getShippingRates: publicProcedure
    .input(
      z.object({
        countryCode: z.string().length(2),
        stateProvince: z.string().optional(),
        postalCode: z.string().optional(),
        items: z.array(
          z.object({
            weight: z.number().optional(),
            dimensions: z.object({
              length: z.number(),
              width: z.number(),
              height: z.number(),
            }).optional(),
          })
        ).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // In a real implementation, you would integrate with shipping carriers
      // For now, return mock rates
      
      const rates = [
        {
          id: 'standard',
          name: 'Standard Shipping',
          description: '5-7 business days',
          price: 10,
          estimatedDays: { min: 5, max: 7 },
        },
        {
          id: 'express',
          name: 'Express Shipping',
          description: '2-3 business days',
          price: 25,
          estimatedDays: { min: 2, max: 3 },
        },
        {
          id: 'overnight',
          name: 'Overnight Shipping',
          description: 'Next business day',
          price: 40,
          estimatedDays: { min: 1, max: 1 },
        },
      ]
      
      // Free shipping for orders over threshold
      if (ctx.session?.user) {
        const cart = await ctx.prisma.cart.findFirst({
          where: {
            userId: ctx.session.user.id,
            isAbandoned: false,
          },
          select: { subtotal: true },
        })
        
        if (cart && cart.subtotal.toNumber() >= 100) {
          rates[0].price = 0 // Free standard shipping
        }
      }
      
      return rates
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
} from '@/server/api/trpc'
import { Prisma } from '@prisma/client'

// Input validation schemas
const productFilterSchema = z.object({
  categoryId: z.string().uuid().optional(),
  categorySlug: z.string().optional(),
  brandId: z.string().uuid().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  inStock: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  materials: z.array(z.string()).optional(),
  sustainable: z.boolean().optional(),
  featured: z.boolean().optional(),
  exclusive: z.boolean().optional(),
  search: z.string().optional(),
})

const productSortSchema = z.enum([
  'newest',
  'oldest',
  'price-asc',
  'price-desc',
  'name-asc',
  'name-desc',
  'popular',
  'rating',
  'relevance',
])

export const productRouter = createTRPCRouter({
  /**
   * Get all products with advanced filtering, sorting, and pagination
   */
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().uuid().optional(),
        filters: productFilterSchema.optional(),
        sort: productSortSchema.default('newest'),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, filters = {}, sort } = input

      // Build where clause
      const where: Prisma.ProductWhereInput = {
        status: 'ACTIVE',
        deletedAt: null,
      }

      // Category filter (by ID or slug)
      if (filters.categoryId) {
        where.categoryId = filters.categoryId
      } else if (filters.categorySlug) {
        where.category = { slug: filters.categorySlug }
      }

      // Brand filter
      if (filters.brandId) {
        where.brandId = filters.brandId
      }

      // Price range filter
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        where.price = {}
        if (filters.minPrice !== undefined) {
          where.price.gte = filters.minPrice
        }
        if (filters.maxPrice !== undefined) {
          where.price.lte = filters.maxPrice
        }
      }

      // Stock filter
      if (filters.inStock === true) {
        where.variants = {
          some: {
            inventoryQuantity: { gt: 0 },
            isAvailable: true,
          },
        }
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        where.styleTags = {
          hasSome: filters.tags,
        }
      }

      // Materials filter (using JSON query)
      if (filters.materials && filters.materials.length > 0) {
        where.materials = {
          path: ['$[*].type'],
          array_contains: filters.materials,
        }
      }

      // Sustainability filter
      if (filters.sustainable === true) {
        where.AND = [
          ...(Array.isArray(where.AND) ? where.AND : []),
          {
            OR: [
              { recyclable: true },
              { materials: { path: ['$[*].sustainable'], equals: true } },
            ],
          },
        ]
      }

      // Featured filter
      if (filters.featured === true) {
        where.isFeatured = true
      }

      // Exclusive filter
      if (filters.exclusive === true) {
        where.isExclusive = true
      }

      // Search filter (name, description, tags)
      if (filters.search) {
        const searchTerms = filters.search.toLowerCase().split(' ')
        where.OR = searchTerms.map(term => ({
          OR: [
            { name: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } },
            { styleTags: { has: term } },
          ],
        }))
      }

      // Build orderBy clause
      const orderBy: Prisma.ProductOrderByWithRelationInput = (() => {
        switch (sort) {
          case 'newest':
            return { publishedAt: 'desc' }
          case 'oldest':
            return { publishedAt: 'asc' }
          case 'price-asc':
            return { price: 'asc' }
          case 'price-desc':
            return { price: 'desc' }
          case 'name-asc':
            return { name: 'asc' }
          case 'name-desc':
            return { name: 'desc' }
          case 'popular':
            return { purchaseCount: 'desc' }
          case 'rating':
            // Sort by average rating (computed field)
            return { reviews: { _count: 'desc' } }
          case 'relevance':
          default:
            // For relevance, we'll use a combination of factors
            return { viewCount: 'desc' }
        }
      })()

      // Execute query with cursor pagination
      const products = await ctx.prisma.product.findMany({
        where,
        orderBy,
        take: limit + 1, // Take one extra to determine if there's a next page
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
              isVerified: true,
            },
          },
          media: {
            where: { isPrimary: true },
            take: 1,
            select: {
              url: true,
              altText: true,
            },
          },
          variants: {
            select: {
              id: true,
              price: true,
              inventoryQuantity: true,
            },
          },
          _count: {
            select: {
              reviews: true,
              wishlistItems: true,
            },
          },
        },
      })

      // Calculate aggregate data for filters
      const aggregates = await ctx.prisma.product.aggregate({
        where: {
          status: 'ACTIVE',
          deletedAt: null,
          ...(filters.categoryId && { categoryId: filters.categoryId }),
        },
        _min: { price: true },
        _max: { price: true },
        _count: true,
      })

      // Determine next cursor
      let nextCursor: string | undefined = undefined
      if (products.length > limit) {
        const nextItem = products.pop()
        nextCursor = nextItem!.id
      }

      // Calculate average ratings
      const productsWithRatings = await Promise.all(
        products.map(async (product) => {
          const avgRating = await ctx.prisma.review.aggregate({
            where: { productId: product.id, status: 'APPROVED' },
            _avg: { rating: true },
          })

          return {
            ...product,
            rating: avgRating._avg.rating || 0,
            reviewCount: product._count.reviews,
            wishlistCount: product._count.wishlistItems,
          }
        })
      )

      return {
        products: productsWithRatings,
        nextCursor,
        hasMore: !!nextCursor,
        aggregates: {
          totalCount: aggregates._count,
          priceRange: {
            min: aggregates._min.price || 0,
            max: aggregates._max.price || 0,
          },
        },
      }
    }),

  /**
   * Get single product by slug with all details
   */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.findFirst({
        where: {
          slug: input.slug,
          status: 'ACTIVE',
          deletedAt: null,
        },
        include: {
          category: true,
          brand: true,
          media: {
            orderBy: { displayOrder: 'asc' },
          },
          variants: {
            where: { isAvailable: true },
            include: {
              media: true,
            },
            orderBy: [
              { inventoryQuantity: 'desc' },
              { price: 'asc' },
            ],
          },
          collections: {
            include: {
              collection: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          reviews: {
            where: { status: 'APPROVED' },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                },
              },
              interactions: true,
            },
            orderBy: [
              { helpfulCount: 'desc' },
              { createdAt: 'desc' },
            ],
            take: 10,
          },
          _count: {
            select: {
              reviews: {
                where: { status: 'APPROVED' },
              },
              orderItems: true,
              wishlistItems: true,
            },
          },
        },
      })

      if (!product) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found',
        })
      }

      // Track product view (fire and forget)
      if (ctx.session?.user) {
        ctx.prisma.productView.create({
          data: {
            productId: product.id,
            userId: ctx.session.user.id,
            sessionId: ctx.session.id,
            source: 'product_page',
          },
        }).catch(console.error)
      }

      // Increment view count
      ctx.prisma.product.update({
        where: { id: product.id },
        data: { viewCount: { increment: 1 } },
      }).catch(console.error)

      // Calculate average rating
      const avgRating = await ctx.prisma.review.aggregate({
        where: { productId: product.id, status: 'APPROVED' },
        _avg: { rating: true },
      })

      // Get size chart if applicable
      let sizeChart = null
      if (product.category.slug === 'clothing' || product.category.slug === 'shoes') {
        // In a real app, you'd have a proper size chart system
        sizeChart = {
          metric: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
          imperial: ['0-2', '4-6', '8-10', '12-14', '16-18', '20-22'],
        }
      }

      return {
        ...product,
        rating: avgRating._avg.rating || 0,
        reviewCount: product._count.reviews,
        purchaseCount: product._count.orderItems,
        wishlistCount: product._count.wishlistItems,
        sizeChart,
      }
    }),

  /**
   * Get related products using AI similarity
   */
  getRelated: publicProcedure
    .input(
      z.object({
        productId: z.string().uuid(),
        limit: z.number().min(1).max(20).default(8),
      })
    )
    .query(async ({ ctx, input }) => {
      const { productId, limit } = input

      // Get the source product
      const sourceProduct = await ctx.prisma.product.findUnique({
        where: { id: productId },
        select: {
          categoryId: true,
          brandId: true,
          price: true,
          styleTags: true,
        },
      })

      if (!sourceProduct) {
        return { products: [] }
      }

      // Find related products based on multiple factors
      const relatedProducts = await ctx.prisma.product.findMany({
        where: {
          id: { not: productId },
          status: 'ACTIVE',
          deletedAt: null,
          OR: [
            // Same category
            { categoryId: sourceProduct.categoryId },
            // Same brand
            ...(sourceProduct.brandId ? [{ brandId: sourceProduct.brandId }] : []),
            // Similar price range (±30%)
            {
              price: {
                gte: sourceProduct.price.toNumber() * 0.7,
                lte: sourceProduct.price.toNumber() * 1.3,
              },
            },
            // Shared tags
            ...(sourceProduct.styleTags.length > 0
              ? [{ styleTags: { hasSome: sourceProduct.styleTags } }]
              : []),
          ],
        },
        take: limit * 2, // Take more to allow for scoring
        include: {
          category: true,
          brand: true,
          media: {
            where: { isPrimary: true },
            take: 1,
          },
          _count: {
            select: { reviews: true },
          },
        },
      })

      // Score products by relevance
      const scoredProducts = relatedProducts.map(product => {
        let score = 0

        // Category match (highest weight)
        if (product.categoryId === sourceProduct.categoryId) score += 10

        // Brand match
        if (product.brandId === sourceProduct.brandId) score += 5

        // Price similarity (inverse of price difference)
        const priceDiff = Math.abs(
          product.price.toNumber() - sourceProduct.price.toNumber()
        )
        const priceScore = Math.max(0, 5 - priceDiff / sourceProduct.price.toNumber())
        score += priceScore

        // Tag overlap
        const tagOverlap = product.styleTags.filter(tag =>
          sourceProduct.styleTags.includes(tag)
        ).length
        score += tagOverlap * 2

        return { ...product, score }
      })

      // Sort by score and take the top products
      const topProducts = scoredProducts
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ score, ...product }) => product)

      return { products: topProducts }
    }),

  /**
   * Get featured products for homepage
   */
  getFeatured: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).default(8),
      })
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.prisma.product.findMany({
        where: {
          status: 'ACTIVE',
          isFeatured: true,
          deletedAt: null,
          featuredAt: { not: null },
        },
        orderBy: { featuredAt: 'desc' },
        take: input.limit,
        include: {
          category: true,
          brand: true,
          media: {
            where: { isPrimary: true },
            take: 1,
          },
          _count: {
            select: { reviews: true },
          },
        },
      })

      return { products }
    }),

  /**
   * Get trending products based on recent activity
   */
  getTrending: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).default(8),
        timeframe: z.enum(['day', 'week', 'month']).default('week'),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, timeframe } = input

      // Calculate date threshold
      const dateThreshold = new Date()
      switch (timeframe) {
        case 'day':
          dateThreshold.setDate(dateThreshold.getDate() - 1)
          break
        case 'week':
          dateThreshold.setDate(dateThreshold.getDate() - 7)
          break
        case 'month':
          dateThreshold.setMonth(dateThreshold.getMonth() - 1)
          break
      }

      // Get products with recent activity
      const trendingProducts = await ctx.prisma.product.findMany({
        where: {
          status: 'ACTIVE',
          deletedAt: null,
          OR: [
            {
              productViews: {
                some: {
                  createdAt: { gte: dateThreshold },
                },
              },
            },
            {
              orderItems: {
                some: {
                  createdAt: { gte: dateThreshold },
                },
              },
            },
            {
              wishlistItems: {
                some: {
                  addedAt: { gte: dateThreshold },
                },
              },
            },
          ],
        },
        orderBy: [
          { viewCount: 'desc' },
          { purchaseCount: 'desc' },
        ],
        take: limit,
        include: {
          category: true,
          brand: true,
          media: {
            where: { isPrimary: true },
            take: 1,
          },
          _count: {
            select: {
              reviews: true,
              productViews: {
                where: {
                  createdAt: { gte: dateThreshold },
                },
              },
            },
          },
        },
      })

      return { products: trendingProducts }
    }),

  /**
   * Admin: Create new product
   */
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        slug: z.string().min(1).max(255),
        description: z.string().optional(),
        story: z.string().optional(),
        categoryId: z.string().uuid(),
        brandId: z.string().uuid().optional(),
        price: z.number().positive(),
        compareAtPrice: z.number().positive().optional(),
        cost: z.number().positive().optional(),
        sku: z.string().min(1).max(100),
        status: z.enum(['DRAFT', 'ACTIVE']).default('DRAFT'),
        metaTitle: z.string().max(255).optional(),
        metaDescription: z.string().optional(),
        styleTags: z.array(z.string()).default([]),
        materials: z.any().optional(), // JSON
        isFeatured: z.boolean().default(false),
        isExclusive: z.boolean().default(false),
        recyclable: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if slug is unique
      const existingProduct = await ctx.prisma.product.findUnique({
        where: { slug: input.slug },
      })

      if (existingProduct) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A product with this slug already exists',
        })
      }

      const product = await ctx.prisma.product.create({
        data: {
          ...input,
          publishedAt: input.status === 'ACTIVE' ? new Date() : null,
          featuredAt: input.isFeatured ? new Date() : null,
        },
      })

      return product
    }),

  /**
   * Admin: Update product
   */
  update: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).max(255).optional(),
        slug: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        story: z.string().optional(),
        categoryId: z.string().uuid().optional(),
        brandId: z.string().uuid().optional().nullable(),
        price: z.number().positive().optional(),
        compareAtPrice: z.number().positive().optional().nullable(),
        cost: z.number().positive().optional().nullable(),
        status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional(),
        metaTitle: z.string().max(255).optional().nullable(),
        metaDescription: z.string().optional().nullable(),
        styleTags: z.array(z.string()).optional(),
        materials: z.any().optional(),
        isFeatured: z.boolean().optional(),
        isExclusive: z.boolean().optional(),
        recyclable: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input

      // If slug is being updated, check uniqueness
      if (updateData.slug) {
        const existingProduct = await ctx.prisma.product.findFirst({
          where: {
            slug: updateData.slug,
            id: { not: id },
          },
        })

        if (existingProduct) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'A product with this slug already exists',
          })
        }
      }

      // Handle status changes
      const currentProduct = await ctx.prisma.product.findUnique({
        where: { id },
        select: { status: true },
      })

      if (!currentProduct) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found',
        })
      }

      // Set publishedAt if changing to ACTIVE
      if (updateData.status === 'ACTIVE' && currentProduct.status !== 'ACTIVE') {
        (updateData as any).publishedAt = new Date()
      }

      // Set featuredAt if featuring
      if (updateData.isFeatured === true) {
        (updateData as any).featuredAt = new Date()
      } else if (updateData.isFeatured === false) {
        (updateData as any).featuredAt = null
      }

      const product = await ctx.prisma.product.update({
        where: { id },
        data: updateData,
      })

      return product
    }),

  /**
   * Admin: Delete product (soft delete)
   */
  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      // Soft delete by setting deletedAt
      const product = await ctx.prisma.product.update({
        where: { id: input.id },
        data: {
          deletedAt: new Date(),
          status: 'ARCHIVED',
        },
      })

      return { success: true, product }
    }),
})

```

# src/server/api/routers/checkout.ts
```ts
// src/server/api/routers/checkout.ts
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from '@/server/api/trpc'
import { 
  createPaymentIntent, 
  getOrCreateCustomer,
  PaymentIntentMetadata 
} from '@/lib/stripe'
import { nanoid } from 'nanoid'
import { OrderStatus, PaymentStatus } from '@prisma/client'
import { sendOrderConfirmationEmail } from '@/lib/email'

export const checkoutRouter = createTRPCRouter({
  /**
   * Create payment intent and order
   */
  createIntent: publicProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.string().uuid(),
            variantId: z.string().uuid().optional(),
            quantity: z.number().positive(),
            price: z.number().positive(),
          })
        ),
        shippingAddress: z.object({
          firstName: z.string(),
          lastName: z.string(),
          company: z.string().optional(),
          addressLine1: z.string(),
          addressLine2: z.string().optional(),
          city: z.string(),
          stateProvince: z.string().optional(),
          postalCode: z.string(),
          countryCode: z.string().length(2),
          phone: z.string().optional(),
        }),
        billingAddress: z.object({
          firstName: z.string(),
          lastName: z.string(),
          company: z.string().optional(),
          addressLine1: z.string(),
          addressLine2: z.string().optional(),
          city: z.string(),
          stateProvince: z.string().optional(),
          postalCode: z.string(),
          countryCode: z.string().length(2),
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
        email: z.string().email(),
        notes: z.string().optional(),
        discountCodes: z.array(z.string()).optional(),
        giftCardCodes: z.array(z.string()).optional(),
        saveAddress: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Use the same logic as in the API route
      // This allows both tRPC and REST API access
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.error || 'Failed to create payment intent',
        })
      }
      
      return response.json()
    }),

  /**
   * Update shipping method
   */
  updateShipping: publicProcedure
    .input(
      z.object({
        orderId: z.string().uuid(),
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
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Use the same logic as in the API route
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/checkout`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.error || 'Failed to update shipping',
        })
      }
      
      return response.json()
    }),

  /**
   * Calculate tax
   */
  calculateTax: publicProcedure
    .input(
      z.object({
        subtotal: z.number(),
        shippingAddress: z.object({
          countryCode: z.string().length(2),
          stateProvince: z.string().optional(),
          postalCode: z.string(),
        }),
      })
    )
    .query(async ({ input }) => {
      // In a real implementation, use a tax service like TaxJar or Avalara
      // For now, use simple tax calculation
      
      let taxRate = 0
      
      // US tax rates by state (simplified)
      if (input.shippingAddress.countryCode === 'US') {
        const stateTaxRates: Record<string, number> = {
          'CA': 0.0875, // California
          'NY': 0.08,   // New York
          'TX': 0.0625, // Texas
          'FL': 0.06,   // Florida
          // Add more states as needed
        }
        
        taxRate = stateTaxRates[input.shippingAddress.stateProvince || ''] || 0.05
      } else {
        // International orders - simplified VAT
        taxRate = 0.20 // 20% VAT
      }
      
      const taxAmount = input.subtotal * taxRate
      
      return {
        taxRate,
        taxAmount,
        taxableAmount: input.subtotal,
      }
    }),

  /**
   * Validate checkout data
   */
  validate: publicProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.string().uuid(),
            variantId: z.string().uuid().optional(),
            quantity: z.number().positive(),
          })
        ),
        email: z.string().email(),
      })
    )
    .query(async ({ ctx, input }) => {
      const errors: string[] = []
      
      // Validate email
      if (ctx.session?.user) {
        // For logged-in users, check if email matches
        if (ctx.session.user.email !== input.email) {
          errors.push('Email does not match your account')
        }
      }
      
      // Validate items
      for (const item of input.items) {
        if (item.variantId) {
          const variant = await ctx.prisma.productVariant.findUnique({
            where: { id: item.variantId },
            include: { product: true },
          })
          
          if (!variant) {
            errors.push(`Product variant not found`)
            continue
          }
          
          if (!variant.isAvailable) {
            errors.push(`${variant.product.name} (${variant.size}) is not available`)
          }
          
          const available = variant.inventoryQuantity - variant.inventoryReserved
          if (available < item.quantity) {
            errors.push(
              `${variant.product.name} (${variant.size}) - only ${available} available`
            )
          }
        } else {
          const product = await ctx.prisma.product.findUnique({
            where: { id: item.productId },
          })
          
          if (!product) {
            errors.push(`Product not found`)
          } else if (product.status !== 'ACTIVE') {
            errors.push(`${product.name} is not available`)
          }
        }
      }
      
      return {
        valid: errors.length === 0,
        errors,
      }
    }),

  /**
   * Get express checkout data (Apple Pay, Google Pay)
   */
  getExpressCheckoutData: publicProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.string().uuid(),
            variantId: z.string().uuid().optional(),
            quantity: z.number().positive(),
          })
        ),
      })
    )
    .query(async ({ ctx, input }) => {
      // Calculate totals for express checkout
      let subtotal = 0
      const displayItems = []
      
      for (const item of input.items) {
        let product
        let price
        let name
        
        if (item.variantId) {
          const variant = await ctx.prisma.productVariant.findUnique({
            where: { id: item.variantId },
            include: { product: true },
          })
          
          if (!variant) continue
          
          product = variant.product
          price = variant.price || variant.product.price
          name = `${variant.product.name} ${variant.size ? `(${variant.size})` : ''}`
        } else {
          product = await ctx.prisma.product.findUnique({
            where: { id: item.productId },
          })
          
          if (!product) continue
          
          price = product.price
          name = product.name
        }
        
        const itemTotal = price.toNumber() * item.quantity
        subtotal += itemTotal
        
        displayItems.push({
          label: `${name} x ${item.quantity}`,
          amount: Math.round(itemTotal * 100),
        })
      }
      
      // Add tax and shipping estimates
      const taxAmount = subtotal * 0.08 // 8% estimated tax
      const shippingAmount = subtotal >= 100 ? 0 : 10 // Free shipping over $100
      const total = subtotal + taxAmount + shippingAmount
      
      displayItems.push(
        {
          label: 'Tax',
          amount: Math.round(taxAmount * 100),
        },
        {
          label: 'Shipping',
          amount: Math.round(shippingAmount * 100),
        }
      )
      
      return {
        displayItems,
        total: {
          label: 'LuxeVerse',
          amount: Math.round(total * 100),
        },
        shippingOptions: [
          {
            id: 'standard',
            label: 'Standard Shipping',
            detail: '5-7 business days',
            amount: subtotal >= 100 ? 0 : 1000, // $10 or free
          },
          {
            id: 'express',
            label: 'Express Shipping',
            detail: '2-3 business days',
            amount: 2500, // $25
          },
        ],
        merchantCapabilities: ['supports3DS'],
        supportedNetworks: ['amex', 'discover', 'masterCard', 'visa'],
        countryCode: 'US',
        currencyCode: 'USD',
        requiredBillingContactFields: ['postalAddress', 'email', 'phone'],
        requiredShippingContactFields: ['postalAddress', 'email', 'phone'],
      }
    }),
})

```

# src/server/api/root.ts
```ts
// src/server/api/root.ts
import { createTRPCRouter } from '@/server/api/trpc'
import { productRouter } from '@/server/api/routers/product'
import { categoryRouter } from '@/server/api/routers/category'
import { userRouter } from '@/server/api/routers/user'
import { cartRouter } from '@/server/api/routers/cart'
import { orderRouter } from '@/server/api/routers/order'
import { aiRouter } from '@/server/api/routers/ai'
import { searchRouter } from '@/server/api/routers/search'
import { reviewRouter } from '@/server/api/routers/review'
import { wishlistRouter } from '@/server/api/routers/wishlist'
import { collectionRouter } from '@/server/api/routers/collection'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  product: productRouter,
  category: categoryRouter,
  collection: collectionRouter,
  user: userRouter,
  cart: cartRouter,
  order: orderRouter,
  ai: aiRouter,
  search: searchRouter,
  review: reviewRouter,
  wishlist: wishlistRouter,
})

// Export type definition of API
export type AppRouter = typeof appRouter

```

# src/middleware.ts
```ts
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Define route configurations
const routeConfig = {
  // Public routes that don't require authentication
  public: [
    '/',
    '/products',
    '/products/[slug]',
    '/collections',
    '/collections/[slug]',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ],
  
  // Auth routes that should redirect if already authenticated
  auth: ['/login', '/register', '/forgot-password', '/reset-password'],
  
  // Protected routes requiring authentication
  protected: [
    '/account',
    '/account/orders',
    '/account/wishlist',
    '/account/addresses',
    '/account/settings',
    '/checkout',
  ],
  
  // Admin routes requiring admin role
  admin: ['/admin', '/admin/*'],
  
  // VIP routes requiring VIP membership
  vip: ['/vip', '/vip/*', '/exclusive-collections'],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for API routes (except auth), static files, and images
  if (
    pathname.startsWith('/api/') && !pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp)$/)
  ) {
    return NextResponse.next()
  }
  
  // Get the user's token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })
  
  // Check if the route is an auth page
  const isAuthPage = routeConfig.auth.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  // Check if the route is protected
  const isProtectedRoute = routeConfig.protected.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  // Check if the route is admin-only
  const isAdminRoute = routeConfig.admin.some(route => 
    pathname === route || 
    (route.endsWith('/*') && pathname.startsWith(route.slice(0, -2)))
  )
  
  // Check if the route is VIP-only
  const isVipRoute = routeConfig.vip.some(route => 
    pathname === route || 
    (route.endsWith('/*') && pathname.startsWith(route.slice(0, -2)))
  )
  
  // Create response
  const response = NextResponse.next()
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Handle auth pages (redirect if already authenticated)
  if (isAuthPage && token) {
    const redirectUrl = request.nextUrl.searchParams.get('callbackUrl') || '/account'
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }
  
  // Handle protected routes
  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }
  
  // Handle admin routes
  if (isAdminRoute) {
    if (!token || token.role !== 'ADMIN' && token.role !== 'SUPER_ADMIN') {
      // Log unauthorized access attempt
      console.warn(`Unauthorized admin access attempt: ${pathname} by ${token?.email || 'anonymous'}`)
      return NextResponse.redirect(new URL('/403', request.url))
    }
  }
  
  // Handle VIP routes
  if (isVipRoute) {
    if (!token || (token.membershipTier !== 'DIAMOND' && token.membershipTier !== 'OBSIDIAN')) {
      // Redirect to membership upgrade page
      const url = new URL('/account/membership', request.url)
      url.searchParams.set('upgrade', 'true')
      url.searchParams.set('returnUrl', pathname)
      return NextResponse.redirect(url)
    }
  }
  
  // Add user context to headers for server components
  if (token) {
    response.headers.set('x-user-id', token.id)
    response.headers.set('x-user-role', token.role)
    response.headers.set('x-user-tier', token.membershipTier)
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
}

```

# src/components/features/cart/cart-drawer.tsx
```tsx
// src/components/features/cart/cart-drawer.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Icons } from '@/components/ui/icons'
import { useCartStore, useCartItems, useCartTotal, useIsCartOpen, useCartActions } from '@/store/cart.store'
import { formatPrice, cn } from '@/lib/utils'
import { CartItemCard } from './cart-item-card'
import { CartRecommendations } from './cart-recommendations'
import { toast } from 'sonner'

export function CartDrawer() {
  const router = useRouter()
  const items = useCartItems()
  const total = useCartTotal()
  const isOpen = useIsCartOpen()
  const { closeCart } = useCartActions()
  const {
    subtotal,
    discountAmount,
    taxAmount,
    shippingAmount,
    freeShippingThreshold,
    isEligibleForFreeShipping,
    applyDiscount,
    isLoading,
  } = useCartStore()
  
  const [discountCode, setDiscountCode] = useState('')
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false)
  
  // Calculate progress to free shipping
  const freeShippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100)
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal)
  
  // Handle discount code submission
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return
    
    setIsApplyingDiscount(true)
    try {
      await applyDiscount(discountCode.trim())
      setDiscountCode('')
    } catch (error) {
      // Error handled in store
    } finally {
      setIsApplyingDiscount(false)
    }
  }
  
  // Handle checkout navigation
  const handleCheckout = async () => {
    const isStockValid = await useCartStore.getState().validateStock()
    
    if (!isStockValid) {
      toast.error('Some items are out of stock', {
        description: 'Please review your cart before proceeding',
      })
      return
    }
    
    closeCart()
    router.push('/checkout')
  }
  
  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent 
        className="flex w-full flex-col sm:max-w-lg"
        side="right"
      >
        <SheetHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold">Shopping Cart</SheetTitle>
            <Badge variant="secondary" className="ml-2">
              {items.reduce((sum, item) => sum + item.quantity, 0)} items
            </Badge>
          </div>
          
          {/* Free Shipping Progress */}
          {!isEligibleForFreeShipping() && subtotal > 0 && (
            <div className="space-y-2 rounded-lg bg-secondary/50 p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Icons.truck className="h-4 w-4" />
                  Free shipping
                </span>
                <span className="font-medium">
                  {formatPrice(freeShippingRemaining)} away
                </span>
              </div>
              <Progress value={freeShippingProgress} className="h-2" />
            </div>
          )}
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center space-y-4">
            <div className="relative h-32 w-32">
              <Icons.shoppingBag className="h-full w-full text-muted-foreground/20" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Add some luxury items to get started
              </p>
            </div>
            <Button asChild className="mt-4">
              <Link href="/products" onClick={closeCart}>
                Continue Shopping
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                      }}
                    >
                      <CartItemCard item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              {/* Cart Recommendations */}
              <div className="border-t pt-6">
                <CartRecommendations />
              </div>
            </ScrollArea>

            <div className="space-y-4 border-t pt-6">
              {/* Discount Code */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Discount code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyDiscount()}
                    disabled={isApplyingDiscount}
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyDiscount}
                    disabled={!discountCode.trim() || isApplyingDiscount}
                  >
                    {isApplyingDiscount ? (
                      <Icons.spinner className="h-4 w-4 animate-spin" />
                    ) : (
                      'Apply'
                    )}
                  </Button>
                </div>
                
                {/* Applied Discounts */}
                {useCartStore.getState().discounts.length > 0 && (
                  <div className="space-y-1">
                    {useCartStore.getState().discounts.map((discount) => (
                      <div
                        key={discount.code}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="flex items-center gap-2">
                          <Icons.tag className="h-3 w-3" />
                          {discount.code}
                        </span>
                        <button
                          onClick={() => useCartStore.getState().removeDiscount(discount.code)}
                          className="text-destructive hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <Separator />
              
              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Icons.tag className="h-3 w-3" />
                      Discount
                    </span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatPrice(taxAmount)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {shippingAmount === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      formatPrice(shippingAmount)
                    )}
                  </span>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between text-base font-medium">
                  <span>Total</span>
                  <span className="text-lg">{formatPrice(total)}</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="space-y-2">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isLoading || items.length === 0}
                >
                  {isLoading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Checkout
                      <Icons.arrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={closeCart}
                >
                  Continue Shopping
                </Button>
                
                {/* Security Badges */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <Icons.shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Secure Checkout
                  </span>
                  <Icons.lock className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

```

# src/components/features/cart/cart-item-card.tsx
```tsx
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

```

# src/components/features/products/product-card.tsx
```tsx
// src/components/features/products/product-card.tsx
'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Product } from '@prisma/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { useCartStore } from '@/store/cart.store'
import { useWishlistStore } from '@/store/wishlist.store'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ProductCardProps {
  product: Product & {
    category: {
      id: string
      name: string
      slug: string
    }
    brand?: {
      id: string
      name: string
      slug: string
      isVerified: boolean
    } | null
    media: Array<{
      url: string
      altText: string | null
    }>
    rating?: number
    reviewCount?: number
    wishlistCount?: number
  }
  viewMode?: 'grid' | 'list'
  priority?: boolean
  className?: string
}

export function ProductCard({ 
  product, 
  viewMode = 'grid', 
  priority = false,
  className 
}: ProductCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  
  const addToCart = useCartStore((state) => state.addItem)
  const toggleWishlist = useWishlistStore((state) => state.toggleItem)
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id))

  // Calculate discount percentage
  const discountPercentage = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice.toNumber() - product.price.toNumber()) /
          product.compareAtPrice.toNumber()) *
          100
      )
    : 0

  // Handle quick add to cart
  const handleQuickAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      
      // Add to cart with default variant
      addToCart({
        productId: product.id,
        quantity: 1,
        price: product.price.toNumber(),
      })
      
      toast.success('Added to cart', {
        description: product.name,
        action: {
          label: 'View Cart',
          onClick: () => {
            // Open cart drawer
            useCartStore.getState().openCart()
          },
        },
      })
    },
    [addToCart, product]
  )

  // Handle wishlist toggle
  const handleWishlistToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      
      toggleWishlist(product.id)
      
      if (isInWishlist) {
        toast.success('Removed from wishlist')
      } else {
        toast.success('Added to wishlist', {
          description: product.name,
        })
      }
    },
    [toggleWishlist, product, isInWishlist]
  )

  // Image cycling on hover
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (product.media.length <= 1) return
      
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const width = rect.width
      const percentage = x / width
      const index = Math.floor(percentage * product.media.length)
      
      setCurrentImageIndex(Math.min(index, product.media.length - 1))
    },
    [product.media.length]
  )

  const handleMouseLeave = useCallback(() => {
    setCurrentImageIndex(0)
  }, [])

  // List view layout
  if (viewMode === 'list') {
    return (
      <Card className={cn('group overflow-hidden', className)}>
        <Link href={`/products/${product.slug}`} className="flex gap-6 p-4">
          <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg">
            <Image
              src={product.media[0]?.url || '/placeholder.png'}
              alt={product.media[0]?.altText || product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="128px"
            />
            {discountPercentage > 0 && (
              <Badge className="absolute left-2 top-2 bg-red-500">
                -{discountPercentage}%
              </Badge>
            )}
          </div>
          
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {product.brand?.name || product.category.name}
                  </p>
                  <h3 className="mt-1 font-medium">{product.name}</h3>
                  {product.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {product.description}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      {formatPrice(product.price.toNumber())}
                    </p>
                    {product.compareAtPrice && (
                      <p className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.compareAtPrice.toNumber())}
                      </p>
                    )}
                  </div>
                  
                  {product.rating && product.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Icons.star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{product.rating.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">
                        ({product.reviewCount})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleQuickAddToCart}
                className="flex-1"
              >
                <Icons.shoppingBag className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleWishlistToggle}
              >
                <Icons.heart
                  className={cn(
                    'h-4 w-4',
                    isInWishlist && 'fill-current text-red-500'
                  )}
                />
              </Button>
            </div>
          </div>
        </Link>
      </Card>
    )
  }

  // Grid view layout (default)
  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-300 hover:shadow-xl',
        className
      )}
    >
      <Link href={`/products/${product.slug}`}>
        {/* Image Container */}
        <div
          className="relative aspect-[3/4] overflow-hidden bg-gray-100"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <Image
            src={product.media[currentImageIndex]?.url || '/placeholder.png'}
            alt={product.media[currentImageIndex]?.altText || product.name}
            fill
            className={cn(
              'object-cover transition-all duration-500',
              isImageLoading ? 'blur-lg' : 'blur-0',
              'group-hover:scale-105'
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            onLoad={() => setIsImageLoading(false)}
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {discountPercentage > 0 && (
              <Badge className="bg-red-500 text-white">
                -{discountPercentage}%
              </Badge>
            )}
            {product.isExclusive && (
              <Badge className="bg-luxury-gold text-luxury-obsidian">
                Exclusive
              </Badge>
            )}
            {product.isLimitedEdition && (
              <Badge variant="outline" className="border-white bg-black/50 text-white">
                Limited Edition
              </Badge>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <Button
              size="sm"
              className="flex-1 bg-white text-black hover:bg-gray-100"
              onClick={handleQuickAddToCart}
            >
              <Icons.shoppingBag className="mr-2 h-4 w-4" />
              Quick Add
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="bg-white text-black hover:bg-gray-100"
              onClick={handleWishlistToggle}
            >
              <Icons.heart
                className={cn(
                  'h-4 w-4',
                  isInWishlist && 'fill-current text-red-500'
                )}
              />
            </Button>
          </div>
          
          {/* Image dots indicator */}
          {product.media.length > 1 && (
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              {product.media.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'h-1 w-1 rounded-full bg-white transition-all',
                    index === currentImageIndex ? 'w-4' : 'opacity-50'
                  )}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          {/* Brand/Category */}
          <p className="text-xs text-muted-foreground">
            {product.brand?.name || product.category.name}
            {product.brand?.isVerified && (
              <Icons.verified className="ml-1 inline h-3 w-3 text-blue-500" />
            )}
          </p>
          
          {/* Product Name */}
          <h3 className="mt-1 line-clamp-2 text-sm font-medium transition-colors group-hover:text-primary">
            {product.name}
          </h3>
          
          {/* Rating */}
          {product.rating && product.rating > 0 && (
            <div className="mt-2 flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Icons.star
                    key={i}
                    className={cn(
                      'h-3 w-3',
                      i < Math.floor(product.rating!)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount})
              </span>
            </div>
          )}
          
          {/* Price */}
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-lg font-semibold">
              {formatPrice(product.price.toNumber())}
            </p>
            {product.compareAtPrice && (
              <p className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice.toNumber())}
              </p>
            )}
          </div>
          
          {/* Additional Info */}
          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            {product.wishlistCount && product.wishlistCount > 0 && (
              <span className="flex items-center gap-1">
                <Icons.heart className="h-3 w-3" />
                {product.wishlistCount}
              </span>
            )}
            {product.recyclable && (
              <span className="flex items-center gap-1">
                <Icons.leaf className="h-3 w-3 text-green-600" />
                Sustainable
              </span>
            )}
          </div>
        </div>
      </Link>
    </Card>
  )
}

```

# src/components/providers/auth-provider.tsx
```tsx
// src/components/providers/auth-provider.tsx
'use client'

import { SessionProvider } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  
  useEffect(() => {
    // Hide loading screen after initial render
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <SessionProvider
      refetchInterval={5 * 60} // Refetch session every 5 minutes
      refetchOnWindowFocus={true}
      refetchWhenOffline={false}
    >
      {isLoading && pathname !== '/' ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
          <div className="space-y-4 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            <p className="text-sm text-muted-foreground animate-pulse">
              Preparing your luxury experience...
            </p>
          </div>
        </div>
      ) : (
        children
      )}
    </SessionProvider>
  )
}

```

# src/app/(shop)/checkout/success/page.tsx
```tsx
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

```

# src/app/(shop)/checkout/success/order-success-content.tsx
```tsx
// src/app/(shop)/checkout/success/order-success-content.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Icons } from '@/components/ui/icons'
import { CartItemCard } from '@/components/features/cart/cart-item-card'
import { formatPrice, formatDate } from '@/lib/utils'

interface OrderSuccessContentProps {
  orderId?: string
  sessionId?: string
}

export function OrderSuccessContent({ orderId, sessionId }: OrderSuccessContentProps) {
  const router = useRouter()
  const [order, setOrder] = useState<any>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>()
  
  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        let orderData
        
        if (orderId) {
          orderData = await api.order.getById.query({ orderId })
        } else if (sessionId) {
          orderData = await api.order.getBySessionId.query({ sessionId })
        }
        
        if (orderData) {
          setOrder(orderData)
          
          // Trigger confetti animation
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500', '#FF6B00'],
          })
        } else {
          setError('Order not found')
        }
      } catch (err) {
        console.error('Failed to fetch order:', err)
        setError('Failed to load order details')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchOrder()
  }, [orderId, sessionId])
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-lg text-muted-foreground">Loading your order...</p>
        </div>
      </div>
    )
  }
  
  if (error || !order) {
    return (
      <div className="container max-w-2xl py-16">
        <Alert variant="destructive">
          <Icons.alertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || 'Something went wrong. Please contact support.'}
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <Button asChild>
            <Link href="/account/orders">View Orders</Link>
          </Button>
        </div>
      </div>
    )
  }
  
  const deliveryEstimate = new Date()
  deliveryEstimate.setDate(deliveryEstimate.getDate() + 7)
  
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success Header */}
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
            >
              <Icons.checkCircle className="h-12 w-12 text-green-600" />
            </motion.div>
            
            <h1 className="mb-2 text-3xl font-bold">Order Confirmed!</h1>
            <p className="text-lg text-muted-foreground">
              Thank you for your purchase, {order.shippingAddress.firstName}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Order #{order.orderNumber}
            </p>
          </div>
          
          {/* Order Summary Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                We've sent a confirmation email to {order.customerEmail}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Items */}
              <div>
                <h3 className="mb-4 font-medium">Items ({order.items.length})</h3>
                <div className="space-y-3">
                  {order.items.map((item: any) => (
                    <CartItemCard
                      key={item.id}
                      item={{
                        id: item.id,
                        productId: item.productId,
                        variantId: item.variantId,
                        product: {
                          name: item.productName,
                          slug: item.product?.slug || '',
                          media: item.product?.media,
                        },
                        variant: item.variant,
                        quantity: item.quantity,
                        price: item.unitPrice.toNumber(),
                      }}
                      editable={false}
                      showDetails={false}
                    />
                  ))}
                </div>
              </div>
              
              <Separator />
              
              {/* Delivery Information */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-medium">Delivery Address</h3>
                  <address className="text-sm text-muted-foreground not-italic">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                    {order.shippingAddress.addressLine1}<br />
                    {order.shippingAddress.addressLine2 && (
                      <>{order.shippingAddress.addressLine2}<br /></>
                    )}
                    {order.shippingAddress.city}, {order.shippingAddress.stateProvince} {order.shippingAddress.postalCode}<br />
                    {order.shippingAddress.countryCode}
                  </address>
                </div>
                
                <div>
                  <h3 className="mb-2 font-medium">Delivery Method</h3>
                  <p className="text-sm text-muted-foreground">
                    {order.shippingMethod}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Estimated delivery: {formatDate(deliveryEstimate)}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              {/* Payment Summary */}
              <div>
                <h3 className="mb-4 font-medium">Payment Summary</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd>{formatPrice(order.subtotal.toNumber())}</dd>
                  </div>
                  {order.discountAmount.toNumber() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <dt>Discount</dt>
                      <dd>-{formatPrice(order.discountAmount.toNumber())}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Tax</dt>
                    <dd>{formatPrice(order.taxAmount.toNumber())}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Shipping</dt>
                    <dd>{formatPrice(order.shippingAmount.toNumber())}</dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base font-medium">
                    <dt>Total</dt>
                    <dd>{formatPrice(order.total.toNumber())}</dd>
                  </div>
                </dl>
              </div>
            </CardContent>
          </Card>
          
          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icons.mail className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium">Check Your Email</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We've sent order details and tracking info
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icons.truck className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium">Track Your Order</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We'll notify you when your order ships
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icons.heart className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium">Share Your Style</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tag us @luxeverse to be featured
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Actions */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/account/orders">View Order Details</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

```

# src/app/(shop)/checkout/checkout-form.tsx
```tsx
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

```

# src/app/(shop)/checkout/page.tsx
```tsx
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

```

# src/app/(shop)/products/page.tsx
```tsx
// src/app/(shop)/products/page.tsx
import { Suspense } from 'react'
import { Metadata } from 'next'
import { ProductsPageContent } from './products-page-content'
import { ProductsPageSkeleton } from './products-page-skeleton'

export const metadata: Metadata = {
  title: 'Luxury Collection | LuxeVerse',
  description: 'Explore our curated collection of luxury fashion, accessories, and lifestyle products.',
  openGraph: {
    title: 'Luxury Collection | LuxeVerse',
    description: 'Discover exceptional pieces from world-renowned luxury brands.',
    images: ['/og/products.jpg'],
  },
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <Suspense fallback={<ProductsPageSkeleton />}>
      <ProductsPageContent searchParams={searchParams} />
    </Suspense>
  )
}

// Separate client component file: products-page-content.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '@/lib/api'
import { ProductCard } from '@/components/features/products/product-card'
import { ProductFilters } from '@/components/features/products/product-filters'
import { ProductSort } from '@/components/features/products/product-sort'
import { ProductGridSkeleton } from '@/components/features/products/product-grid-skeleton'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Icons } from '@/components/ui/icons'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ProductSortSchema } from '@/types/product'

const PRODUCTS_PER_PAGE = 24

interface ProductsPageContentProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export function ProductsPageContent({ searchParams }: ProductsPageContentProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParamsObj = useSearchParams()
  
  // Parse filters from URL
  const [filters, setFilters] = useState(() => ({
    categorySlug: searchParams.category as string | undefined,
    brandId: searchParams.brand as string | undefined,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    inStock: searchParams.inStock === 'true',
    tags: searchParams.tags
      ? Array.isArray(searchParams.tags)
        ? searchParams.tags
        : [searchParams.tags]
      : undefined,
    sustainable: searchParams.sustainable === 'true',
    featured: searchParams.featured === 'true',
    exclusive: searchParams.exclusive === 'true',
    search: searchParams.q as string | undefined,
  }))
  
  const [sort, setSort] = useState<ProductSortSchema>(
    (searchParams.sort as ProductSortSchema) || 'newest'
  )
  
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Fetch products with infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = api.product.getAll.useInfiniteQuery(
    {
      limit: PRODUCTS_PER_PAGE,
      filters,
      sort,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    }
  )

  // Update URL when filters change
  const updateURL = useCallback((newFilters: typeof filters, newSort: typeof sort) => {
    const params = new URLSearchParams()
    
    // Add filters to params
    if (newFilters.categorySlug) params.set('category', newFilters.categorySlug)
    if (newFilters.brandId) params.set('brand', newFilters.brandId)
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice.toString())
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice.toString())
    if (newFilters.inStock) params.set('inStock', 'true')
    if (newFilters.tags?.length) {
      newFilters.tags.forEach(tag => params.append('tags', tag))
    }
    if (newFilters.sustainable) params.set('sustainable', 'true')
    if (newFilters.featured) params.set('featured', 'true')
    if (newFilters.exclusive) params.set('exclusive', 'true')
    if (newFilters.search) params.set('q', newFilters.search)
    if (newSort !== 'newest') params.set('sort', newSort)
    
    const url = params.toString() ? `${pathname}?${params.toString()}` : pathname
    router.push(url, { scroll: false })
  }, [pathname, router])

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters)
    updateURL(newFilters, sort)
  }, [sort, updateURL])

  // Handle sort change
  const handleSortChange = useCallback((newSort: ProductSortSchema) => {
    setSort(newSort)
    updateURL(filters, newSort)
  }, [filters, updateURL])

  // Clear all filters
  const clearFilters = useCallback(() => {
    const clearedFilters = {
      categorySlug: undefined,
      brandId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      inStock: false,
      tags: undefined,
      sustainable: false,
      featured: false,
      exclusive: false,
      search: undefined,
    }
    setFilters(clearedFilters)
    setSort('newest')
    router.push(pathname)
  }, [pathname, router])

  // Flatten pages data
  const products = data?.pages.flatMap((page) => page.products) ?? []
  const totalCount = data?.pages[0]?.aggregates.totalCount ?? 0
  const priceRange = data?.pages[0]?.aggregates.priceRange

  // Active filter count
  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== undefined && value !== false && 
    (Array.isArray(value) ? value.length > 0 : true)
  ).length

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[400px] overflow-hidden bg-luxury-obsidian">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
        <div className="relative z-10 flex h-full items-center justify-center text-center">
          <div className="container">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl font-display font-bold tracking-tight text-white md:text-7xl"
            >
              Luxury Collection
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 text-lg text-white/80 md:text-xl"
            >
              Curated pieces from the world's finest brands
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-8">
        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <Icons.filter className="mr-2 h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-md">
                <ProductFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  priceRange={priceRange}
                  onClose={() => setIsFilterOpen(false)}
                />
              </SheetContent>
            </Sheet>

            <p className="text-sm text-muted-foreground">
              {totalCount} {totalCount === 1 ? 'product' : 'products'}
            </p>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-2">
                <AnimatePresence>
                  {filters.categorySlug && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Badge variant="secondary">
                        Category: {filters.categorySlug}
                        <button
                          onClick={() => handleFiltersChange({ ...filters, categorySlug: undefined })}
                          className="ml-1 hover:text-destructive"
                        >
                          <Icons.x className="h-3 w-3" />
                        </button>
                      </Badge>
                    </motion.div>
                  )}
                  {filters.search && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Badge variant="secondary">
                        Search: {filters.search}
                        <button
                          onClick={() => handleFiltersChange({ ...filters, search: undefined })}
                          className="ml-1 hover:text-destructive"
                        >
                          <Icons.x className="h-3 w-3" />
                        </button>
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-6 px-2 text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <ProductSort sort={sort} onSortChange={handleSortChange} />
            
            {/* View Mode Toggle */}
            <div className="hidden items-center gap-1 rounded-md border p-1 lg:flex">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-7 w-7"
                onClick={() => setViewMode('grid')}
              >
                <Icons.grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-7 w-7"
                onClick={() => setViewMode('list')}
              >
                <Icons.list className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Filters Sidebar (Desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <ProductFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                priceRange={priceRange}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            {isLoading ? (
              <ProductGridSkeleton count={12} viewMode={viewMode} />
            ) : isError ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center">
                <Icons.alertCircle className="h-12 w-12 text-destructive" />
                <p className="mt-4 text-lg font-medium">Something went wrong</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Unable to load products. Please try again.
                </p>
                <Button onClick={() => refetch()} className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : products.length === 0 ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center">
                <Icons.package className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium">No products found</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearFilters} variant="outline" className="mt-4">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <motion.div
                  className={cn(
                    'grid gap-6',
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                      : 'grid-cols-1'
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <AnimatePresence mode="popLayout">
                    {products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{
                          duration: 0.4,
                          delay: index * 0.05,
                        }}
                      >
                        <ProductCard
                          product={product}
                          viewMode={viewMode}
                          priority={index < 6}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Load More */}
                {hasNextPage && (
                  <div className="mt-12 flex justify-center">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="min-w-[200px]"
                    >
                      {isFetchingNextPage ? (
                        <>
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          Load More
                          <Icons.arrowDown className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Loading indicator for infinite scroll */}
                {isFetchingNextPage && (
                  <div className="mt-8 flex justify-center">
                    <Icons.spinner className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

```

# src/app/(shop)/products/[slug]/product-detail-client.tsx
```tsx
// src/app/(shop)/products/[slug]/product-detail-client.tsx
'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { Product, ProductVariant, Review } from '@prisma/client'
import { api } from '@/lib/api'
import { useCartStore } from '@/store/cart.store'
import { useWishlistStore } from '@/store/wishlist.store'
import { useRecentlyViewedStore } from '@/store/recently-viewed.store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Icons } from '@/components/ui/icons'
import { ProductImageGallery } from '@/components/features/products/product-image-gallery'
import { ProductReviews } from '@/components/features/products/product-reviews'
import { SizeGuide } from '@/components/features/products/size-guide'
import { ShareDialog } from '@/components/features/products/share-dialog'
import { ProductCard } from '@/components/features/products/product-card'
import { AIStyleAdvisor } from '@/components/features/ai/ai-style-advisor'
import { ARTryOn } from '@/components/features/ar/ar-try-on'
import { formatPrice, cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ProductDetailClientProps {
  product: Product & {
    category: any
    brand: any
    media: any[]
    variants: ProductVariant[]
    reviews: Review[]
    collections: any[]
    sizeChart: any
    rating: number
    reviewCount: number
    purchaseCount: number
    wishlistCount: number
  }
  relatedProducts: any[]
}

export function ProductDetailClient({ 
  product, 
  relatedProducts 
}: ProductDetailClientProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants[0] || null
  )
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [showARTryOn, setShowARTryOn] = useState(false)
  const [showAIAdvisor, setShowAIAdvisor] = useState(false)
  
  const addToCart = useCartStore((state) => state.addItem)
  const toggleWishlist = useWishlistStore((state) => state.toggleItem)
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id))
  const addToRecentlyViewed = useRecentlyViewedStore((state) => state.addItem)

  // Track product view
  useEffect(() => {
    addToRecentlyViewed(product)
  }, [product, addToRecentlyViewed])

  // Calculate discount
  const currentPrice = selectedVariant?.price || product.price
  const comparePrice = selectedVariant?.compareAtPrice || product.compareAtPrice
  const discountPercentage = comparePrice
    ? Math.round(((comparePrice.toNumber() - currentPrice.toNumber()) / comparePrice.toNumber()) * 100)
    : 0

  // Check availability
  const isInStock = selectedVariant
    ? selectedVariant.inventoryQuantity > 0
    : product.variants.some(v => v.inventoryQuantity > 0)

  const maxQuantity = selectedVariant?.inventoryQuantity || 10

  // Handle add to cart
  const handleAddToCart = useCallback(async () => {
    if (!selectedVariant) {
      toast.error('Please select a variant')
      return
    }

    setIsLoading(true)
    try {
      addToCart({
        productId: product.id,
        variantId: selectedVariant.id,
        quantity,
        price: currentPrice.toNumber(),
      })
      
      toast.success('Added to cart', {
        description: `${product.name} (${selectedVariant.size})`,
        action: {
          label: 'View Cart',
          onClick: () => useCartStore.getState().openCart(),
        },
      })
    } catch (error) {
      toast.error('Failed to add to cart')
    } finally {
      setIsLoading(false)
    }
  }, [selectedVariant, quantity, addToCart, product, currentPrice])

  // Handle buy now
  const handleBuyNow = useCallback(async () => {
    await handleAddToCart()
    router.push('/checkout')
  }, [handleAddToCart, router])

  // Handle wishlist
  const handleWishlistToggle = useCallback(() => {
    toggleWishlist(product.id, selectedVariant?.id)
    
    if (isInWishlist) {
      toast.success('Removed from wishlist')
    } else {
      toast.success('Added to wishlist', {
        description: product.name,
      })
    }
  }, [toggleWishlist, product, selectedVariant, isInWishlist])

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="container py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground">Home</a>
          <Icons.chevronRight className="h-4 w-4" />
          <a href="/products" className="hover:text-foreground">Products</a>
          <Icons.chevronRight className="h-4 w-4" />
          <a href={`/products?category=${product.category.slug}`} className="hover:text-foreground">
            {product.category.name}
          </a>
          <Icons.chevronRight className="h-4 w-4" />
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="container pb-16">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Images */}
          <div className="relative">
            <ProductImageGallery
              images={product.media}
              productName={product.name}
              has360View={product.media.some(m => m.is360Image)}
              hasARView={product.arEnabled}
              onARClick={() => setShowARTryOn(true)}
            />
            
            {/* Badges */}
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {discountPercentage > 0 && (
                <Badge className="bg-red-500 text-white">
                  -{discountPercentage}%
                </Badge>
              )}
              {product.isExclusive && (
                <Badge className="bg-luxury-gold text-luxury-obsidian">
                  Exclusive
                </Badge>
              )}
              {product.isLimitedEdition && (
                <Badge variant="outline" className="border-white bg-black/50 text-white">
                  Limited Edition
                </Badge>
              )}
              {product.recyclable && (
                <Badge className="bg-green-600 text-white">
                  <Icons.leaf className="mr-1 h-3 w-3" />
                  Sustainable
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Header */}
            <div>
              {product.brand && (
                <div className="flex items-center gap-2">
                  <a 
                    href={`/products?brand=${product.brand.id}`}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    {product.brand.name}
                  </a>
                  {product.brand.isVerified && (
                    <Icons.verified className="h-4 w-4 text-blue-500" />
                  )}
                </div>
              )}
              
              <h1 className="mt-2 text-3xl font-bold tracking-tight lg:text-4xl">
                {product.name}
              </h1>
              
              {/* Rating */}
              {product.rating > 0 && (
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Icons.star
                          key={i}
                          className={cn(
                            'h-5 w-5',
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          )}
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-medium">{product.rating.toFixed(1)}</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'}
                  </button>
                  <span className="text-sm text-muted-foreground">
                    {product.purchaseCount} sold
                  </span>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold">
                {formatPrice(currentPrice.toNumber())}
              </span>
              {comparePrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(comparePrice.toNumber())}
                </span>
              )}
            </div>

            {/* Variants */}
            {product.variants.length > 0 && (
              <div className="mt-6 space-y-4">
                {/* Size selector */}
                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Size</Label>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => setShowSizeGuide(true)}
                      className="h-auto p-0"
                    >
                      <Icons.ruler className="mr-1 h-3 w-3" />
                      Size Guide
                    </Button>
                  </div>
                  <RadioGroup
                    value={selectedVariant?.id}
                    onValueChange={(value) => {
                      const variant = product.variants.find(v => v.id === value)
                      setSelectedVariant(variant || null)
                    }}
                    className="mt-3 flex flex-wrap gap-3"
                  >
                    {product.variants.map((variant) => (
                      <div key={variant.id}>
                        <RadioGroupItem
                          value={variant.id}
                          id={variant.id}
                          className="peer sr-only"
                          disabled={variant.inventoryQuantity === 0}
                        />
                        <Label
                          htmlFor={variant.id}
                          className={cn(
                            'flex cursor-pointer items-center justify-center rounded-md border-2 px-4 py-2 text-sm font-medium transition-all',
                            'hover:border-primary',
                            'peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground',
                            variant.inventoryQuantity === 0 && 'cursor-not-allowed opacity-50'
                          )}
                        >
                          {variant.size}
                          {variant.inventoryQuantity === 0 && (
                            <span className="ml-2 text-xs">(Out of stock)</span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Color selector if applicable */}
                {/* Add color variant selector here if needed */}
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6">
              <Label className="text-base font-medium">Quantity</Label>
              <div className="mt-3 flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Icons.minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  disabled={quantity >= maxQuantity}
                >
                  <Icons.plus className="h-4 w-4" />
                </Button>
                {selectedVariant && selectedVariant.inventoryQuantity <= 5 && (
                  <span className="text-sm text-orange-600">
                    Only {selectedVariant.inventoryQuantity} left in stock
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3">
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!isInStock || !selectedVariant || isLoading}
                >
                  {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Icons.shoppingBag className="mr-2 h-4 w-4" />
                  )}
                  {isInStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleWishlistToggle}
                >
                  <Icons.heart
                    className={cn(
                      'h-4 w-4',
                      isInWishlist && 'fill-current text-red-500'
                    )}
                  />
                </Button>
                <ShareDialog product={product} />
              </div>
              
              <Button
                size="lg"
                variant="secondary"
                className="w-full"
                onClick={handleBuyNow}
                disabled={!isInStock || !selectedVariant || isLoading}
              >
                Buy Now
              </Button>

              {/* AI Features */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAIAdvisor(true)}
                >
                  <Icons.sparkles className="mr-2 h-4 w-4" />
                  AI Style Advisor
                </Button>
                {product.arEnabled && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowARTryOn(true)}
                  >
                    <Icons.camera className="mr-2 h-4 w-4" />
                    AR Try-On
                  </Button>
                )}
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Icons.truck className="h-5 w-5 text-muted-foreground" />
                <span>Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Icons.shield className="h-5 w-5 text-muted-foreground" />
                <span>Authenticity guaranteed</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Icons.refresh className="h-5 w-5 text-muted-foreground" />
                <span>30-day returns</span>
              </div>
              {product.carbonFootprint && (
                <div className="flex items-center gap-3 text-sm">
                  <Icons.leaf className="h-5 w-5 text-green-600" />
                  <span>Carbon neutral shipping</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({product.reviewCount})
              </TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div className="prose prose-gray max-w-none">
                <p className="text-lg leading-relaxed">{product.description}</p>
                {product.story && (
                  <>
                    <h3 className="mt-8 text-xl font-semibold">The Story</h3>
                    <p className="leading-relaxed">{product.story}</p>
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="mt-6">
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="font-medium text-muted-foreground">SKU</dt>
                  <dd className="mt-1">{product.sku}</dd>
                </div>
                {product.brand && (
                  <div>
                    <dt className="font-medium text-muted-foreground">Brand</dt>
                    <dd className="mt-1">{product.brand.name}</dd>
                  </div>
                )}
                <div>
                  <dt className="font-medium text-muted-foreground">Category</dt>
                  <dd className="mt-1">{product.category.name}</dd>
                </div>
                {product.materials && (
                  <div>
                    <dt className="font-medium text-muted-foreground">Materials</dt>
                    <dd className="mt-1">
                      {/* Parse and display materials from JSON */}
                      Premium materials
                    </dd>
                  </div>
                )}
                {product.carbonFootprint && (
                  <div>
                    <dt className="font-medium text-muted-foreground">Carbon Footprint</dt>
                    <dd className="mt-1">{product.carbonFootprint} kg CO2</dd>
                  </div>
                )}
                {product.styleTags.length > 0 && (
                  <div className="sm:col-span-2">
                    <dt className="font-medium text-muted-foreground">Style Tags</dt>
                    <dd className="mt-2 flex flex-wrap gap-2">
                      {product.styleTags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <ProductReviews
                productId={product.id}
                reviews={product.reviews}
                rating={product.rating}
                reviewCount={product.reviewCount}
              />
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Shipping Options</h3>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <li>• Standard Shipping (5-7 business days): $10</li>
                    <li>• Express Shipping (2-3 business days): $25</li>
                    <li>• Next Day Delivery: $40</li>
                    <li>• Free shipping on orders over $100</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium">Returns & Exchanges</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We accept returns within 30 days of delivery. Items must be unworn, 
                    unwashed, and in original condition with all tags attached.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold">You May Also Like</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showSizeGuide && (
          <SizeGuide
            category={product.category.slug}
            sizeChart={product.sizeChart}
            onClose={() => setShowSizeGuide(false)}
          />
        )}
        
        {showARTryOn && product.arEnabled && (
          <ARTryOn
            product={product}
            variant={selectedVariant}
            onClose={() => setShowARTryOn(false)}
          />
        )}
        
        {showAIAdvisor && (
          <AIStyleAdvisor
            product={product}
            onClose={() => setShowAIAdvisor(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

```

# src/app/(shop)/products/[slug]/page.tsx
```tsx
// src/app/(shop)/products/[slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { api } from '@/lib/api/server'
import { ProductDetailClient } from './product-detail-client'

// Cache the product fetch
const getProduct = cache(async (slug: string) => {
  try {
    return await api.product.getBySlug.fetch({ slug })
  } catch (error) {
    return null
  }
})

interface ProductPageProps {
  params: {
    slug: string
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug)
  
  if (!product) {
    return {
      title: 'Product Not Found | LuxeVerse',
    }
  }

  return {
    title: `${product.name} | ${product.brand?.name || product.category.name} | LuxeVerse`,
    description: product.metaDescription || product.description || `Shop ${product.name} from our luxury collection.`,
    keywords: product.styleTags.join(', '),
    openGraph: {
      title: product.name,
      description: product.description || '',
      images: product.media.map(m => ({
        url: m.url,
        alt: m.altText || product.name,
      })),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description || '',
      images: product.media[0]?.url ? [product.media[0].url] : undefined,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  // Fetch related products in parallel
  const relatedProductsPromise = api.product.getRelated.fetch({
    productId: product.id,
    limit: 8,
  })

  const relatedProducts = await relatedProductsPromise

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts.products}
    />
  )
}

// Static params generation for popular products
export async function generateStaticParams() {
  // In production, you'd want to limit this to your most popular products
  const products = await api.product.getFeatured.fetch({ limit: 50 })
  
  return products.products.map((product) => ({
    slug: product.slug,
  }))
}

```

# src/app/page.tsx
```tsx
import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// This will be replaced with actual components in later phases
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-luxury-obsidian">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-luxury-obsidian via-luxury-obsidian-light to-luxury-obsidian opacity-50" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-neon-pink/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-neon-cyan/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-neon-purple/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-4000" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 gradient-luxury animate-in">
          LuxeVerse
        </h1>
        <p className="text-xl md:text-2xl text-luxury-platinum mb-8 max-w-2xl mx-auto animate-in animation-delay-200">
          Where Luxury Meets Intelligence. Where Shopping Becomes Cinema.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in animation-delay-400">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-md btn-luxury hover-lift focus-ring"
          >
            Explore Collection
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-md border border-luxury-gold text-luxury-gold hover:bg-luxury-gold/10 hover-lift focus-ring"
          >
            Our Story
          </Link>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-luxury-platinum"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      title: 'AI Personal Stylist',
      description:
        'Get personalized recommendations powered by advanced AI that understands your unique style.',
      icon: '🤖',
    },
    {
      title: 'Virtual Try-On',
      description:
        'See how items look on you with our AR-powered virtual fitting room.',
      icon: '👗',
    },
    {
      title: 'Sustainable Luxury',
      description:
        'Shop consciously with our curated selection of sustainable and ethical brands.',
      icon: '🌱',
    },
    {
      title: 'Exclusive Access',
      description:
        'Be the first to access limited editions and designer collaborations.',
      icon: '✨',
    },
  ]
  
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-16">
          Redefining Luxury E-Commerce
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card-luxury hover-lift text-center p-8 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-luxury-gold">
                {feature.title}
              </h3>
              <p className="text-luxury-platinum-light">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-luxury-obsidian to-luxury-obsidian-light">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 gradient-neon">
          Ready to Experience the Future?
        </h2>
        <p className="text-xl text-luxury-platinum mb-8 max-w-2xl mx-auto">
          Join thousands of fashion-forward individuals who have discovered a new
          way to shop luxury.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-md btn-neon hover-grow focus-ring"
        >
          Get Started
        </Link>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <main id="main-content" className="flex-1">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </Suspense>
    </main>
  )
}

```

# src/app/api/checkout/route.ts
```ts
// src/app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { 
  stripe, 
  createPaymentIntent, 
  getOrCreateCustomer,
  PaymentIntentMetadata 
} from '@/lib/stripe'
import { nanoid } from 'nanoid'
import { OrderStatus, PaymentStatus } from '@prisma/client'

// Request validation schema
const createIntentSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    variantId: z.string().uuid().optional(),
    quantity: z.number().positive(),
    price: z.number().positive(),
  })),
  shippingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    company: z.string().optional(),
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    city: z.string(),
    stateProvince: z.string().optional(),
    postalCode: z.string(),
    countryCode: z.string().length(2),
    phone: z.string().optional(),
  }),
  billingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    company: z.string().optional(),
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    city: z.string(),
    stateProvince: z.string().optional(),
    postalCode: z.string(),
    countryCode: z.string().length(2),
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
  email: z.string().email(),
  notes: z.string().optional(),
  discountCodes: z.array(z.string()).optional(),
  giftCardCodes: z.array(z.string()).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerAuthSession()
    const body = await req.json()
    
    // Validate request
    const validatedData = createIntentSchema.parse(body)
    
    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Validate stock availability
      for (const item of validatedData.items) {
        if (item.variantId) {
          const variant = await tx.productVariant.findUnique({
            where: { id: item.variantId },
            select: { 
              inventoryQuantity: true, 
              inventoryReserved: true,
              isAvailable: true,
            },
          })
          
          if (!variant || !variant.isAvailable) {
            throw new Error(`Product variant ${item.variantId} is not available`)
          }
          
          const availableQty = variant.inventoryQuantity - variant.inventoryReserved
          if (availableQty < item.quantity) {
            throw new Error(`Insufficient stock for variant ${item.variantId}`)
          }
          
          // Reserve inventory
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              inventoryReserved: {
                increment: item.quantity,
              },
            },
          })
        }
      }
      
      // Calculate totals
      let subtotal = 0
      const orderItems = []
      
      for (const item of validatedData.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { name: true, sku: true },
        })
        
        if (!product) {
          throw new Error(`Product ${item.productId} not found`)
        }
        
        const itemTotal = item.price * item.quantity
        subtotal += itemTotal
        
        orderItems.push({
          productId: item.productId,
          variantId: item.variantId,
          productName: product.name,
          sku: product.sku,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: itemTotal,
        })
      }
      
      // Apply discounts
      let discountAmount = 0
      if (validatedData.discountCodes?.length) {
        // Validate and apply discount codes
        for (const code of validatedData.discountCodes) {
          const coupon = await tx.coupon.findUnique({
            where: { code },
            select: {
              id: true,
              discountType: true,
              discountValue: true,
              minimumAmount: true,
              validUntil: true,
              usageLimit: true,
              usageCount: true,
            },
          })
          
          if (!coupon) continue
          
          // Validate coupon
          if (coupon.validUntil && coupon.validUntil < new Date()) continue
          if (coupon.minimumAmount && subtotal < coupon.minimumAmount.toNumber()) continue
          if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) continue
          
          // Calculate discount
          if (coupon.discountType === 'percentage') {
            discountAmount += subtotal * (coupon.discountValue.toNumber() / 100)
          } else {
            discountAmount += coupon.discountValue.toNumber()
          }
        }
      }
      
      // Calculate tax (simplified - in production, use a tax service)
      const taxRate = 0.08 // 8% tax
      const taxableAmount = Math.max(0, subtotal - discountAmount)
      const taxAmount = taxableAmount * taxRate
      
      // Shipping cost
      const shippingAmount = validatedData.shippingMethod.price
      
      // Final total
      const total = taxableAmount + taxAmount + shippingAmount
      
      // Create order
      const orderNumber = `LUX${nanoid(10).toUpperCase()}`
      
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: session?.user?.id || validatedData.email, // Use email for guest orders
          status: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          customerEmail: validatedData.email,
          customerPhone: validatedData.shippingAddress.phone,
          currency: 'USD',
          subtotal,
          taxAmount,
          shippingAmount,
          discountAmount,
          total,
          shippingMethod: validatedData.shippingMethod.name,
          shippingAddress: validatedData.shippingAddress as any,
          billingAddress: validatedData.billingAddress as any,
          notes: validatedData.notes,
          metadata: {
            shippingMethodDetails: validatedData.shippingMethod,
            discountCodes: validatedData.discountCodes,
            giftCardCodes: validatedData.giftCardCodes,
          },
          items: {
            create: orderItems,
          },
        },
        include: {
          items: true,
        },
      })
      
      // Create or retrieve Stripe customer
      let customerId: string | undefined
      if (session?.user?.email || validatedData.email) {
        const customer = await getOrCreateCustomer(
          session?.user?.email || validatedData.email,
          {
            userId: session?.user?.id || 'guest',
            name: `${validatedData.shippingAddress.firstName} ${validatedData.shippingAddress.lastName}`,
          }
        )
        customerId = customer.id
      }
      
      // Create payment intent
      const metadata: PaymentIntentMetadata = {
        orderId: order.id,
        userId: session?.user?.id,
        customerEmail: validatedData.email,
        shippingMethod: validatedData.shippingMethod.name,
        orderTotal: total.toFixed(2),
        itemCount: validatedData.items.reduce((sum, item) => sum + item.quantity, 0).toString(),
      }
      
      const paymentIntent = await createPaymentIntent(
        total,
        'usd',
        metadata,
        {
          customerId,
          setupFutureUsage: session?.user ? 'on_session' : undefined,
        }
      )
      
      // Update order with payment intent ID
      await tx.order.update({
        where: { id: order.id },
        data: {
          paymentIntentId: paymentIntent.id,
        },
      })
      
      // Record coupon usage
      if (validatedData.discountCodes?.length && session?.user) {
        for (const code of validatedData.discountCodes) {
          const coupon = await tx.coupon.findUnique({
            where: { code },
            select: { id: true },
          })
          
          if (coupon) {
            await tx.couponUse.create({
              data: {
                couponId: coupon.id,
                userId: session.user.id,
                orderId: order.id,
                discountAmount,
              },
            })
            
            await tx.coupon.update({
              where: { id: coupon.id },
              data: { usageCount: { increment: 1 } },
            })
          }
        }
      }
      
      // Log order creation
      if (session?.user) {
        await tx.auditLog.create({
          data: {
            userId: session.user.id,
            action: 'order.created',
            entityType: 'order',
            entityId: order.id,
            metadata: {
              orderNumber,
              total,
              itemCount: orderItems.length,
            },
          },
        })
      }
      
      return {
        order,
        paymentIntent,
      }
    })
    
    return NextResponse.json({
      orderId: result.order.id,
      orderNumber: result.order.orderNumber,
      clientSecret: result.paymentIntent.client_secret,
      amount: result.order.total.toNumber(),
    })
    
  } catch (error) {
    console.error('Checkout error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

// Update payment intent (for shipping changes, etc.)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerAuthSession()
    const body = await req.json()
    
    const { orderId, shippingMethod } = body
    
    if (!orderId || !shippingMethod) {
      return NextResponse.json(
        { error: 'Order ID and shipping method are required' },
        { status: 400 }
      )
    }
    
    // Get order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        userId: true,
        paymentIntentId: true,
        subtotal: true,
        taxAmount: true,
        discountAmount: true,
      },
    })
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }
    
    // Verify ownership
    if (order.userId !== session?.user?.id && order.userId !== body.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }
    
    // Calculate new total
    const taxableAmount = Math.max(0, order.subtotal.toNumber() - order.discountAmount.toNumber())
    const newTotal = taxableAmount + order.taxAmount.toNumber() + shippingMethod.price
    
    // Update order
    await prisma.order.update({
      where: { id: orderId },
      data: {
        shippingAmount: shippingMethod.price,
        shippingMethod: shippingMethod.name,
        total: newTotal,
        metadata: {
          shippingMethodDetails: shippingMethod,
        },
      },
    })
    
    // Update payment intent if exists
    if (order.paymentIntentId) {
      await stripe.paymentIntents.update(order.paymentIntentId, {
        amount: Math.round(newTotal * 100),
        metadata: {
          shippingMethod: shippingMethod.name,
          orderTotal: newTotal.toFixed(2),
        },
      })
    }
    
    return NextResponse.json({
      success: true,
      newTotal,
    })
    
  } catch (error) {
    console.error('Update order error:', error)
    
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

```

# src/app/api/auth/[...nextauth]/route.ts
```ts
// src/app/api/auth/[...nextauth]/route.ts
import { NextRequest } from 'next/server'
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Create the NextAuth handler
const handler = NextAuth(authOptions)

// Wrap the handler to add custom headers and monitoring
async function authHandler(req: NextRequest, context: { params: { nextauth: string[] } }) {
  // Add security headers
  const response = await handler(req, context)
  
  // Add CORS headers if needed for mobile apps
  if (process.env.ENABLE_MOBILE_APP === 'true') {
    response.headers.set('Access-Control-Allow-Origin', process.env.MOBILE_APP_URL || '')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }
  
  // Add rate limiting headers
  response.headers.set('X-RateLimit-Limit', '60')
  response.headers.set('X-RateLimit-Remaining', '59')
  response.headers.set('X-RateLimit-Reset', new Date(Date.now() + 60000).toISOString())
  
  return response
}

export { authHandler as GET, authHandler as POST }

```

# src/app/api/auth/register/route.ts
```ts
// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'
import { sendEmail } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'

// Input validation schema
const registerSchema = z.object({
  email: z.string().email().transform(str => str.toLowerCase()),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, 'Password must contain uppercase')
    .regex(/[a-z]/, 'Password must contain lowercase')
    .regex(/[0-9]/, 'Password must contain number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain special character'),
  name: z.string().min(2).max(100),
  phone: z.string().optional(),
  preferences: z.object({
    currency: z.string().default('USD'),
    newsletter: z.boolean().default(true),
    smsNotifications: z.boolean().default(false),
  }).optional(),
})

// Rate limiter instance
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting
    const identifier = req.ip ?? 'anonymous'
    const { success } = await limiter.check(identifier, 5) // 5 requests per minute
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      )
    }
    
    // Parse and validate request body
    const body = await req.json()
    const validatedData = registerSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: { id: true },
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }
    
    // Hash password with high cost factor
    const hashedPassword = await hash(validatedData.password, 12)
    
    // Generate verification token
    const verificationToken = nanoid(32)
    
    // Create user with transaction
    const user = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          email: validatedData.email,
          passwordHash: hashedPassword,
          name: validatedData.name,
          phone: validatedData.phone,
          preferredCurrency: validatedData.preferences?.currency || 'USD',
          role: 'CUSTOMER',
          membershipTier: 'PEARL', // Start with free tier
        },
      })
      
      // Create style profile
      await tx.styleProfile.create({
        data: {
          userId: newUser.id,
          stylePersonas: [],
          favoriteColors: [],
          preferredBrands: [],
          avoidedMaterials: [],
          avoidedColors: [],
        },
      })
      
      // Create default wishlist
      await tx.wishlist.create({
        data: {
          userId: newUser.id,
          name: 'My Wishlist',
          isPublic: false,
          shareToken: nanoid(10),
        },
      })
      
      // Grant welcome bonus
      await tx.loyaltyPoint.create({
        data: {
          userId: newUser.id,
          type: 'WELCOME_BONUS',
          points: 500,
          balanceAfter: 500,
          description: 'Welcome to LuxeVerse!',
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      })
      
      // Create welcome notification
      await tx.notification.create({
        data: {
          userId: newUser.id,
          type: 'MEMBERSHIP_UPDATE',
          title: 'Welcome to LuxeVerse!',
          message: 'Your luxury journey begins here. Explore our exclusive collections and enjoy 500 bonus points.',
          actionUrl: '/products',
          actionLabel: 'Start Shopping',
        },
      })
      
      // Log registration event
      await tx.auditLog.create({
        data: {
          userId: newUser.id,
          action: 'USER_REGISTERED',
          entityType: 'user',
          entityId: newUser.id,
          metadata: {
            source: 'web',
            preferences: validatedData.preferences,
          },
        },
      })
      
      return newUser
    })
    
    // Send welcome email
    await sendEmail({
      to: user.email,
      subject: 'Welcome to LuxeVerse - Your Journey Begins',
      template: 'welcome',
      data: {
        name: user.name,
        verificationToken,
        loyaltyPoints: 500,
      },
    })
    
    // Return success response
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      message: 'Account created successfully. Please check your email to verify your account.',
    })
  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid input',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      )
    }
    
    // Generic error response
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
}

```

# src/app/layout.tsx
```tsx
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

```

# src/app/(auth)/login/page.tsx
```tsx
// src/app/(auth)/login/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import { toast } from '@/components/ui/use-toast'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'

// Form validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().default(false),
})

type LoginFormData = z.infer<typeof loginSchema>

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

const cardVariants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: { delay: 0.1, duration: 0.3 }
  },
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/account'
  const error = searchParams.get('error')
  
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: true,
    },
  })
  
  // Focus email field on mount
  useEffect(() => {
    setFocus('email')
  }, [setFocus])
  
  // Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    
    try {
      const result = await signIn('credentials', {
        email: data.email.toLowerCase(),
        password: data.password,
        redirect: false,
      })
      
      if (result?.error) {
        // Handle specific error types
        if (result.error === 'CredentialsSignin') {
          toast({
            title: 'Invalid credentials',
            description: 'Please check your email and password',
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
          })
        }
      } else {
        // Success - show welcome message
        toast({
          title: 'Welcome back!',
          description: 'Redirecting to your account...',
        })
        
        // Small delay for toast to be visible
        setTimeout(() => {
          router.push(callbackUrl)
          router.refresh()
        }, 1000)
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: 'Something went wrong',
        description: 'Please try again later',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle OAuth sign in
  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    setIsLoading(true)
    
    try {
      await signIn(provider, { 
        callbackUrl,
        redirect: true,
      })
    } catch (error) {
      console.error('OAuth error:', error)
      toast({
        title: 'Authentication failed',
        description: 'There was a problem signing in with ' + provider,
        variant: 'destructive',
      })
      setIsLoading(false)
    }
  }
  
  // Handle magic link sign in
  const handleMagicLink = async () => {
    const email = prompt('Enter your email for magic link sign in:')
    if (!email) return
    
    setIsLoading(true)
    
    try {
      const result = await signIn('email', {
        email: email.toLowerCase(),
        redirect: false,
        callbackUrl,
      })
      
      if (result?.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Check your email',
          description: 'We sent you a magic link to sign in',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send magic link',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <motion.div
      className="min-h-screen flex"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div 
          className="w-full max-w-md space-y-8"
          variants={cardVariants}
        >
          {/* Logo */}
          <div className="text-center">
            <Link href="/" className="inline-block">
              <h1 className="text-4xl font-bold tracking-tight">LUXEVERSE</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Luxury Redefined
              </p>
            </Link>
          </div>
          
          <Card className="border-0 shadow-2xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
              <CardDescription className="text-center">
                Sign in to access your exclusive account
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Error Alert */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert variant="destructive">
                      <Icons.alertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {error === 'OAuthAccountNotLinked'
                          ? 'This email is already associated with another sign-in method'
                          : 'Authentication failed. Please try again.'}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* OAuth Buttons */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full relative"
                  onClick={() => handleOAuthSignIn('google')}
                  disabled={isLoading}
                >
                  <Icons.google className="mr-2 h-4 w-4" />
                  Continue with Google
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full relative"
                  onClick={() => handleOAuthSignIn('apple')}
                  disabled={isLoading}
                >
                  <Icons.apple className="mr-2 h-4 w-4" />
                  Continue with Apple
                </Button>
              </div>
              
              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or sign in with email
                  </span>
                </div>
              </div>
              
              {/* Login Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Icons.mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-9"
                      disabled={isLoading}
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Icons.lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className="pl-9 pr-9"
                      disabled={isLoading}
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <Icons.eyeOff className="h-4 w-4" />
                      ) : (
                        <Icons.eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    {...register('rememberMe')}
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Remember me for 30 days
                  </Label>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading || isSubmitting}
                >
                  {isLoading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
              
              {/* Magic Link Option */}
              <div className="text-center">
                <button
                  onClick={handleMagicLink}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  disabled={isLoading}
                >
                  Sign in with magic link instead
                </button>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 pt-6">
              <div className="text-center text-sm">
                <span className="text-muted-foreground">New to LuxeVerse? </span>
                <Link href="/register" className="font-medium text-primary hover:underline">
                  Create an account
                </Link>
              </div>
              
              <p className="text-xs text-center text-muted-foreground">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="underline hover:text-primary">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline hover:text-primary">
                  Privacy Policy
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
      
      {/* Right side - Brand Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <Image
          src="/images/auth-luxury-bg.jpg"
          alt="Luxury fashion"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/20" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white text-center space-y-6 max-w-md">
            <motion.h2
              className="text-5xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Welcome to Luxury
            </motion.h2>
            <motion.p
              className="text-xl text-white/90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Experience exclusive collections, personalized recommendations, and 
              unparalleled service in the world of high fashion.
            </motion.p>
            <motion.div
              className="flex items-center justify-center space-x-6 pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm text-white/80">Luxury Items</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm text-white/80">Designer Brands</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-white/80">Concierge Service</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

```

# src/app/(auth)/register/page.tsx
```tsx
// src/app/(auth)/register/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import { toast } from '@/components/ui/use-toast'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Registration schema with progressive validation
const registrationSchema = z.object({
  // Step 1: Account details
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  
  // Step 2: Personal information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  
  // Step 3: Preferences
  preferredCurrency: z.string().default('USD'),
  newsletter: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  
  // Terms
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
  ageConfirmation: z.boolean().refine(val => val === true, {
    message: 'You must be 18 or older to create an account',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type RegistrationFormData = z.infer<typeof registrationSchema>

// Registration steps
const steps = [
  { id: 'account', name: 'Account', description: 'Create your login credentials' },
  { id: 'personal', name: 'Personal', description: 'Tell us about yourself' },
  { id: 'preferences', name: 'Preferences', description: 'Customize your experience' },
]

export default function RegisterPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
    setValue,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange',
    defaultValues: {
      preferredCurrency: 'USD',
      newsletter: true,
      smsNotifications: false,
    },
  })
  
  const password = watch('password')
  
  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0)
      return
    }
    
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 12.5
    if (/[^A-Za-z0-9]/.test(password)) strength += 12.5
    
    setPasswordStrength(strength)
  }, [password])
  
  // Validate current step before proceeding
  const validateStep = async () => {
    const stepFields = {
      0: ['email', 'password', 'confirmPassword'],
      1: ['firstName', 'lastName'],
      2: ['agreeToTerms', 'ageConfirmation'],
    }
    
    const fieldsToValidate = stepFields[currentStep as keyof typeof stepFields] || []
    const result = await trigger(fieldsToValidate as any)
    
    return result
  }
  
  const handleNext = async () => {
    const isStepValid = await validateStep()
    
    if (isStepValid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
    }
  }
  
  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }
  
  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email.toLowerCase(),
          password: data.password,
          name: `${data.firstName} ${data.lastName}`,
          phone: data.phone,
          preferences: {
            currency: data.preferredCurrency,
            newsletter: data.newsletter,
            smsNotifications: data.smsNotifications,
          },
        }),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Registration failed')
      }
      
      // Show success message
      toast({
        title: 'Welcome to LuxeVerse!',
        description: 'Your account has been created successfully.',
      })
      
      // Auto-login or redirect to login
      setTimeout(() => {
        router.push('/login?registered=true')
      }, 1500)
    } catch (error) {
      console.error('Registration error:', error)
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-red-500'
    if (passwordStrength < 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }
  
  const getPasswordStrengthText = () => {
    if (passwordStrength < 50) return 'Weak'
    if (passwordStrength < 75) return 'Moderate'
    return 'Strong'
  }
  
  return (
    <div className="min-h-screen flex">
      {/* Left side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-lg space-y-8">
          {/* Logo */}
          <div className="text-center">
            <Link href="/" className="inline-block">
              <h1 className="text-4xl font-bold tracking-tight">LUXEVERSE</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Begin Your Luxury Journey
              </p>
            </Link>
          </div>
          
          <Card className="border-0 shadow-2xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center">Create Account</CardTitle>
              <CardDescription className="text-center">
                Join the exclusive world of luxury fashion
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex-1 text-center ${
                        index !== steps.length - 1 ? 'relative' : ''
                      }`}
                    >
                      <div
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors ${
                          index <= currentStep
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-muted-foreground text-muted-foreground'
                        }`}
                      >
                        {index < currentStep ? (
                          <Icons.check className="h-4 w-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <p className="mt-1 text-xs">{step.name}</p>
                    </div>
                  ))}
                </div>
                <Progress value={(currentStep + 1) / steps.length * 100} className="h-2" />
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <AnimatePresence mode="wait">
                  {/* Step 1: Account Details */}
                  {currentStep === 0 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          {...register('email')}
                          disabled={isLoading}
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            {...register('password')}
                            disabled={isLoading}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? (
                              <Icons.eyeOff className="h-4 w-4" />
                            ) : (
                              <Icons.eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {password && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span>Password strength:</span>
                              <span className={`font-medium ${
                                passwordStrength >= 75 ? 'text-green-600' : 
                                passwordStrength >= 50 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {getPasswordStrengthText()}
                              </span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all ${getPasswordStrengthColor()}`}
                                style={{ width: `${passwordStrength}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {errors.password && (
                          <p className="text-sm text-destructive">{errors.password.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type={showPassword ? 'text' : 'password'}
                          {...register('confirmPassword')}
                          disabled={isLoading}
                        />
                        {errors.confirmPassword && (
                          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Step 2: Personal Information */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            {...register('firstName')}
                            disabled={isLoading}
                          />
                          {errors.firstName && (
                            <p className="text-sm text-destructive">{errors.firstName.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            {...register('lastName')}
                            disabled={isLoading}
                          />
                          {errors.lastName && (
                            <p className="text-sm text-destructive">{errors.lastName.message}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          Phone Number <span className="text-muted-foreground">(Optional)</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          {...register('phone')}
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">
                          Date of Birth <span className="text-muted-foreground">(Optional)</span>
                        </Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          {...register('dateOfBirth')}
                          disabled={isLoading}
                        />
                        <p className="text-xs text-muted-foreground">
                          We'll use this to send you a special birthday surprise
                        </p>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Step 3: Preferences */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="preferredCurrency">Preferred Currency</Label>
                        <Select
                          defaultValue="USD"
                          onValueChange={(value) => setValue('preferredCurrency', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">GBP - British Pound</SelectItem>
                            <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                            <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="newsletter"
                            {...register('newsletter')}
                          />
                          <div className="space-y-1">
                            <Label htmlFor="newsletter" className="font-normal cursor-pointer">
                              Email Newsletter
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Receive exclusive offers, new collection previews, and style insights
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="smsNotifications"
                            {...register('smsNotifications')}
                          />
                          <div className="space-y-1">
                            <Label htmlFor="smsNotifications" className="font-normal cursor-pointer">
                              SMS Notifications
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Get order updates and exclusive early access via text
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="agreeToTerms"
                            {...register('agreeToTerms')}
                          />
                          <Label htmlFor="agreeToTerms" className="font-normal cursor-pointer text-sm">
                            I agree to the{' '}
                            <Link href="/terms" className="text-primary hover:underline">
                              Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-primary hover:underline">
                              Privacy Policy
                            </Link>
                          </Label>
                        </div>
                        {errors.agreeToTerms && (
                          <p className="text-sm text-destructive">{errors.agreeToTerms.message}</p>
                        )}
                        
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="ageConfirmation"
                            {...register('ageConfirmation')}
                          />
                          <Label htmlFor="ageConfirmation" className="font-normal cursor-pointer text-sm">
                            I confirm that I am 18 years of age or older
                          </Label>
                        </div>
                        {errors.ageConfirmation && (
                          <p className="text-sm text-destructive">{errors.ageConfirmation.message}</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 0 || isLoading}
                  >
                    <Icons.arrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  
                  {currentStep < steps.length - 1 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={isLoading}
                    >
                      Next
                      <Icons.arrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading || !isValid}
                    >
                      {isLoading ? (
                        <>
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <Icons.check className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 pt-6">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or sign up with
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => signIn('google')} disabled={isLoading}>
                  <Icons.google className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button variant="outline" onClick={() => signIn('apple')} disabled={isLoading}>
                  <Icons.apple className="mr-2 h-4 w-4" />
                  Apple
                </Button>
              </div>
              
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Right side - Lifestyle Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <Image
          src="/images/register-luxury-bg.jpg"
          alt="Luxury lifestyle"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/30" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white text-center space-y-8 max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-5xl font-bold tracking-tight">
                Join the Elite
              </h2>
              <p className="text-xl text-white/90">
                Unlock access to exclusive collections, personalized styling services, 
                and members-only events.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-4">
                <h3 className="text-2xl font-semibold">Member Benefits</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-center space-x-3">
                    <Icons.check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span>Early access to new collections</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Icons.check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span>Personal styling consultations</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Icons.check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span>Exclusive member pricing</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Icons.check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span>Free shipping & returns</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Icons.check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span>VIP customer support</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

```

# README.md
```md
# 🌟 LuxeVerse Quantum - The Future of Luxury E-Commerce

<div align="center">

![LuxeVerse Banner](https://img.shields.io/badge/LuxeVerse-Quantum-FF006E?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDQwQzMxLjA0NTcgNDAgNDAgMzEuMDQ1NyA0MCAyMEM0MCA4Ljk1NDMgMzEuMDQ1NyAwIDIwIDBDOC45NTQzIDAgMCA4Ljk1NDMgMCAyMEMwIDMxLjA0NTcgOC45NTQzIDQwIDIwIDQwWiIgZmlsbD0iI0ZGMDA2RSIvPgo8cGF0aCBkPSJNMjAgMzBDMjUuNTIyOCAzMCAzMCAyNS41MjI4IDMwIDIwQzMwIDE0LjQ3NzIgMjUuNTIyOCAxMCAyMCAxMEMxNC40NzcyIDEwIDEwIDE0LjQ3NzIgMTAgMjBDMTAgMjUuNTIyOCAxNC40NzcyIDMwIDIwIDMwWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+)

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)

### 🚀 **Where Luxury Meets Intelligence. Where Shopping Becomes Cinema.**

[Live Demo](https://luxeverse-quantum.vercel.app) • [Documentation](https://docs.luxeverse.ai) • [Report Bug](https://github.com/nordeim/LuxeVerse-Quantum/issues) • [Request Feature](https://github.com/nordeim/LuxeVerse-Quantum/issues)

</div>

---

## 🌌 **Welcome to the Revolution**

Imagine stepping into a digital boutique where every pixel tells a story, where AI understands your style better than your personal shopper, and where the boundary between commerce and art dissolves into a cinematic experience. **Welcome to LuxeVerse Quantum.**

This isn't just another e-commerce platform. It's a **paradigm shift** in how we experience luxury online. Inspired by the revolutionary aesthetic philosophy of Lovart.ai, LuxeVerse Quantum transcends traditional online shopping to create an immersive, AI-driven digital universe that celebrates artistry, innovation, and personal expression.

### ✨ **Why LuxeVerse Quantum?**

In a world saturated with cookie-cutter e-commerce solutions, LuxeVerse Quantum stands apart:

- **🎬 Cinematic Experience**: Every interaction feels like a scene from a luxury film
- **🤖 AI-Powered Personalization**: Our AI doesn't just recommend products—it understands your essence
- **🎨 Artistic Commerce**: Where shopping meets gallery, where products become art pieces
- **⚡ Blazing Performance**: Sub-second load times globally with Edge computing
- **🔐 Bank-Grade Security**: Your data protected with military-grade encryption
- **🌱 Sustainable by Design**: Carbon-neutral shopping with transparency at every step

---

## 📋 **Table of Contents**

- [🌟 Vision & Philosophy](#-vision--philosophy)
- [🎯 Key Features](#-key-features)
- [🏗️ Architecture Overview](#️-architecture-overview)
- [📁 Project Structure & File Hierarchy](#-project-structure--file-hierarchy)
- [🔄 System Flow & Module Interactions](#-system-flow--module-interactions)
- [📝 Detailed File Descriptions](#-detailed-file-descriptions)
- [✅ Current Implementation Status](#-current-implementation-status)
- [🗺️ Development Roadmap](#️-development-roadmap)
- [🚀 Getting Started & Deployment](#-getting-started--deployment)
- [🛠️ Development Guide](#️-development-guide)
- [🤝 Contributing](#-contributing)
- [📊 Performance Metrics](#-performance-metrics)
- [🔒 Security Features](#-security-features)
- [📱 Mobile Experience](#-mobile-experience)
- [🧪 Testing Strategy](#-testing-strategy)
- [📚 Additional Resources](#-additional-resources)

---

## 🌟 **Vision & Philosophy**

### **Our Mission**
Transform online luxury shopping from a transactional experience into an emotional journey that celebrates artistry, innovation, and personal expression.

### **Core Values**
- **Cinematic Excellence**: Every pixel tells a story
- **Intelligent Personalization**: AI that understands individual style
- **Sustainable Luxury**: Conscious commerce for the modern consumer
- **Accessible Innovation**: Cutting-edge technology that feels effortless

### **Design Philosophy**
LuxeVerse Quantum is built on five foundational pillars:

1. **Experience-First Design** - Every technical decision prioritizes user delight
2. **Scalable Foundation** - Built to handle millions of users from day one
3. **Developer Ergonomics** - Clean, intuitive patterns that make development a joy
4. **Security by Default** - Protection woven into every layer of the stack
5. **Performance Obsession** - Sub-second interactions anywhere in the world

---

## 🎯 **Key Features**

### **🎭 Cinematic Shopping Experience**
- **Dynamic Video Backgrounds**: 4K WebM videos that adapt to user preferences
- **Parallax Storytelling**: Multi-layered narratives that unfold as you scroll
- **Immersive Product Galleries**: 360° views, AR try-on, and zoom that feels magical
- **Ambient Soundscapes**: Optional audio experiences that enhance browsing

### **🤖 AI-Powered Intelligence**
- **Personal AI Stylist**: GPT-4 powered assistant that learns your style
- **Visual Search**: Upload any image and find similar luxury items instantly
- **Predictive Personalization**: Recommendations that feel like mind-reading
- **Dynamic Pricing**: AI-optimized pricing based on demand and user behavior

### **🛍️ Revolutionary Commerce**
- **One-Click Luxury**: Seamless checkout with Apple Pay, Google Pay, and crypto
- **Virtual Shopping Appointments**: Live video consultations with style experts
- **Augmented Reality Try-On**: See products in your space or on yourself
- **Social Shopping**: Share carts, create wishlists together, shop with friends

### **🌱 Sustainable & Ethical**
- **Carbon-Neutral Delivery**: Every order offset automatically
- **Transparency Dashboard**: See the journey of every product
- **Circular Economy**: Built-in resale and rental marketplaces
- **Ethical Scoring**: Know the impact of every purchase

### **⚡ Technical Excellence**
- **Edge Computing**: Content served from 300+ global locations
- **Progressive Web App**: Install on any device, work offline
- **Real-time Inventory**: Live stock updates across all channels
- **Blockchain Authentication**: Verify authenticity of luxury goods

---

## 🏗️ **Architecture Overview**

LuxeVerse Quantum employs a cutting-edge, multi-layered architecture designed for scale, performance, and developer happiness:

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
│  Next.js 14 App Router │ React 18.3 │ Tailwind CSS │ Framer    │
└─────────────────┬───────────────────────────────────┬───────────┘
                  │                                   │
┌─────────────────▼───────────────┐ ┌─────────────────▼───────────┐
│         API GATEWAY             │ │      STATE MANAGEMENT       │
│  tRPC │ GraphQL │ REST Fallback │ │  Zustand │ TanStack Query   │
└─────────────────┬───────────────┘ └─────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────────┐
│                     APPLICATION SERVICES                         │
│  Product │ User │ Cart │ Order │ Payment │ AI │ Search │ Email │
└─────────────────┬───────────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────────┐
│                    INFRASTRUCTURE LAYER                          │
│  PostgreSQL │ Redis │ S3 │ Elasticsearch │ Message Queue       │
└─────────────────────────────────────────────────────────────────┘
```

### **Tech Stack Highlights**
- **Frontend**: Next.js 14 (App Router), React 18.3, TypeScript 5.5
- **Styling**: Tailwind CSS 3.4, Shadcn/UI, Framer Motion 11
- **Backend**: tRPC, Prisma 5.16, PostgreSQL 16
- **AI/ML**: OpenAI GPT-4, Claude Vision, TensorFlow.js
- **Infrastructure**: Vercel Edge, AWS S3, Redis, Algolia
- **Payments**: Stripe, Crypto (Ethereum, Bitcoin)
- **Monitoring**: Datadog, Sentry, Vercel Analytics

---

## 📁 **Project Structure & File Hierarchy**

```bash
luxeverse-quantum/
├── .github/                      # GitHub specific files
│   ├── workflows/               # CI/CD workflows
│   │   ├── ci.yml              # Continuous Integration
│   │   ├── deploy.yml          # Deployment pipeline
│   │   └── codeql.yml          # Security analysis
│   ├── ISSUE_TEMPLATE/         # Issue templates
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── dependabot.yml          # Dependency updates
│
├── .husky/                      # Git hooks
│   ├── pre-commit              # Linting before commit
│   └── commit-msg              # Commit message validation
│
├── .vscode/                     # VS Code settings
│   ├── settings.json           # Editor configuration
│   ├── extensions.json         # Recommended extensions
│   └── launch.json            # Debug configurations
│
├── public/                      # Static assets
│   ├── images/                 # Static images
│   │   ├── logo.svg
│   │   ├── hero/              # Hero section assets
│   │   └── icons/             # Icon assets
│   ├── fonts/                  # Custom fonts
│   ├── videos/                 # Video assets
│   └── manifest.json          # PWA manifest
│
├── prisma/                      # Database schema
│   ├── schema.prisma          # Main schema file
│   ├── migrations/            # Database migrations
│   ├── seed.ts               # Database seeding
│   └── client.ts             # Prisma client setup
│
├── src/                         # Source code
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication routes
│   │   │   ├── login/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (shop)/            # Main shop routes
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── products/
│   │   │   │   ├── page.tsx   # Product listing
│   │   │   │   ├── [slug]/    # Dynamic product pages
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── loading.tsx
│   │   │   │   │   └── error.tsx
│   │   │   │   ├── category/[category]/
│   │   │   │   └── layout.tsx
│   │   │   ├── collections/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── account/           # Protected user routes
│   │   │   ├── dashboard/
│   │   │   ├── orders/
│   │   │   ├── wishlist/
│   │   │   ├── style-profile/
│   │   │   ├── settings/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── admin/             # Admin dashboard
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   ├── customers/
│   │   │   ├── analytics/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── api/               # API routes
│   │   │   ├── trpc/[trpc]/   # tRPC endpoint
│   │   │   ├── auth/[...nextauth]/
│   │   │   ├── webhooks/
│   │   │   │   ├── stripe/
│   │   │   │   └── algolia/
│   │   │   ├── cron/          # Scheduled jobs
│   │   │   └── health/        # Health check
│   │   │
│   │   ├── layout.tsx         # Root layout
│   │   ├── error.tsx          # Global error boundary
│   │   ├── not-found.tsx      # 404 page
│   │   └── globals.css        # Global styles
│   │
│   ├── components/             # React components
│   │   ├── ui/                # Base UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── ...
│   │   │
│   │   ├── common/            # Shared components
│   │   │   ├── header/
│   │   │   │   ├── header.tsx
│   │   │   │   ├── nav-menu.tsx
│   │   │   │   ├── search-bar.tsx
│   │   │   │   └── user-menu.tsx
│   │   │   ├── footer/
│   │   │   ├── seo.tsx
│   │   │   └── theme-toggle.tsx
│   │   │
│   │   ├── features/          # Feature components
│   │   │   ├── products/
│   │   │   │   ├── product-card.tsx
│   │   │   │   ├── product-grid.tsx
│   │   │   │   ├── product-carousel.tsx
│   │   │   │   ├── product-filters.tsx
│   │   │   │   ├── product-sort.tsx
│   │   │   │   ├── product-quick-view.tsx
│   │   │   │   └── product-gallery.tsx
│   │   │   ├── cart/
│   │   │   │   ├── cart-drawer.tsx
│   │   │   │   ├── cart-item.tsx
│   │   │   │   ├── cart-summary.tsx
│   │   │   │   └── cart-empty.tsx
│   │   │   ├── checkout/
│   │   │   │   ├── checkout-form.tsx
│   │   │   │   ├── payment-form.tsx
│   │   │   │   ├── shipping-form.tsx
│   │   │   │   └── order-summary.tsx
│   │   │   ├── ai/
│   │   │   │   ├── ai-stylist.tsx
│   │   │   │   ├── style-quiz.tsx
│   │   │   │   ├── visual-search.tsx
│   │   │   │   ├── recommendations.tsx
│   │   │   │   └── chat-assistant.tsx
│   │   │   ├── ar/
│   │   │   │   ├── ar-viewer.tsx
│   │   │   │   └── virtual-try-on.tsx
│   │   │   └── social/
│   │   │       ├── share-button.tsx
│   │   │       ├── wishlist-share.tsx
│   │   │       └── reviews.tsx
│   │   │
│   │   └── providers/         # Context providers
│   │       ├── auth-provider.tsx
│   │       ├── cart-provider.tsx
│   │       ├── theme-provider.tsx
│   │       └── analytics-provider.tsx
│   │
│   ├── lib/                   # Utilities & helpers
│   │   ├── api/              # API utilities
│   │   │   ├── client.ts
│   │   │   ├── errors.ts
│   │   │   └── fetcher.ts
│   │   ├── auth/             # Auth utilities
│   │   │   ├── auth.ts
│   │   │   ├── session.ts
│   │   │   └── permissions.ts
│   │   ├── cache/            # Caching utilities
│   │   │   ├── redis.ts
│   │   │   └── strategies.ts
│   │   ├── hooks/            # Custom React hooks
│   │   │   ├── use-cart.ts
│   │   │   ├── use-user.ts
│   │   │   ├── use-search.ts
│   │   │   ├── use-infinite-scroll.ts
│   │   │   └── use-media-query.ts
│   │   ├── utils/            # Helper functions
│   │   │   ├── cn.ts         # className utility
│   │   │   ├── format.ts     # Formatters
│   │   │   ├── validators.ts # Validation schemas
│   │   │   └── helpers.ts    # Misc helpers
│   │   └── constants/        # App constants
│   │       ├── routes.ts
│   │       ├── config.ts
│   │       └── metadata.ts
│   │
│   ├── server/               # Backend code
│   │   ├── api/             # API layer
│   │   │   ├── routers/     # tRPC routers
│   │   │   │   ├── auth.ts
│   │   │   │   ├── product.ts
│   │   │   │   ├── cart.ts
│   │   │   │   ├── order.ts
│   │   │   │   ├── user.ts
│   │   │   │   ├── payment.ts
│   │   │   │   └── ai.ts
│   │   │   ├── trpc.ts      # tRPC setup
│   │   │   ├── context.ts   # Request context
│   │   │   └── root.ts      # Root router
│   │   ├── db/              # Database layer
│   │   │   ├── client.ts    # Prisma client
│   │   │   ├── seed.ts      # Seeding script
│   │   │   └── utils.ts     # DB utilities
│   │   └── services/        # Business logic
│   │       ├── auth.service.ts
│   │       ├── product.service.ts
│   │       ├── cart.service.ts
│   │       ├── order.service.ts
│   │       ├── payment.service.ts
│   │       ├── email.service.ts
│   │       ├── search.service.ts
│   │       └── ai.service.ts
│   │
│   ├── store/                # Client state
│   │   ├── cart.store.ts
│   │   ├── ui.store.ts
│   │   ├── user.store.ts
│   │   └── search.store.ts
│   │
│   ├── styles/               # Styling
│   │   ├── globals.css      # Global styles
│   │   └── animations.css   # Animation classes
│   │
│   └── types/                # TypeScript types
│       ├── next-auth.d.ts   # Auth types
│       ├── api.ts           # API types
│       ├── database.ts      # DB types
│       └── ui.ts            # UI types
│
├── tests/                     # Test files
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   ├── e2e/                  # End-to-end tests
│   ├── fixtures/             # Test fixtures
│   └── setup.ts              # Test setup
│
├── docs/                      # Documentation
│   ├── API.md               # API documentation
│   ├── ARCHITECTURE.md      # Architecture guide
│   ├── DEPLOYMENT.md        # Deployment guide
│   └── CONTRIBUTING.md      # Contributing guide
│
├── scripts/                   # Utility scripts
│   ├── setup.sh             # Initial setup
│   ├── deploy.sh            # Deployment script
│   └── migrate.sh           # Migration script
│
├── .env.example              # Environment variables template
├── .eslintrc.json           # ESLint configuration
├── .gitignore               # Git ignore file
├── .prettierrc              # Prettier configuration
├── commitlint.config.js     # Commit lint config
├── components.json          # Shadcn/UI config
├── next-env.d.ts           # Next.js types
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies
├── pnpm-lock.yaml         # Lock file
├── postcss.config.js      # PostCSS configuration
├── README.md              # This file
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── vitest.config.ts       # Vitest configuration
```

---

## 🔄 **System Flow & Module Interactions**

### **High-Level System Flow Diagram**

```mermaid
flowchart TB
    %% User Interaction Layer
    subgraph "Client Layer"
        U[User] --> B[Browser/PWA]
        B --> NX[Next.js App]
    end
    
    %% API Gateway
    subgraph "API Gateway"
        NX --> TRPC[tRPC Router]
        NX --> GQL[GraphQL]
        NX --> REST[REST Fallback]
    end
    
    %% Application Services
    subgraph "Application Services"
        TRPC --> AUTH[Auth Service]
        TRPC --> PROD[Product Service]
        TRPC --> CART[Cart Service]
        TRPC --> ORDER[Order Service]
        TRPC --> AI[AI Service]
        TRPC --> SEARCH[Search Service]
    end
    
    %% Data Layer
    subgraph "Data Layer"
        AUTH --> PG[(PostgreSQL)]
        PROD --> PG
        CART --> REDIS[(Redis Cache)]
        ORDER --> PG
        AI --> VECTOR[(Vector DB)]
        SEARCH --> ALGOLIA[(Algolia)]
    end
    
    %% External Services
    subgraph "External Services"
        ORDER --> STRIPE[Stripe API]
        AI --> OPENAI[OpenAI API]
        PROD --> S3[AWS S3]
        ORDER --> EMAIL[Email Service]
    end
    
    %% Background Jobs
    subgraph "Background Jobs"
        QUEUE[Message Queue] --> WORKER[Worker Processes]
        WORKER --> CRON[Cron Jobs]
        CRON --> PG
    end
```

### **Request Flow Example: Product Purchase**

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API (tRPC)
    participant DB as Database
    participant C as Cache
    participant S as Stripe
    participant E as Email
    
    U->>F: Browse Product
    F->>A: getProduct(slug)
    A->>C: Check Cache
    alt Cache Hit
        C-->>A: Return Cached
    else Cache Miss
        A->>DB: Query Product
        DB-->>A: Product Data
        A->>C: Store in Cache
    end
    A-->>F: Product Details
    F-->>U: Display Product
    
    U->>F: Add to Cart
    F->>A: addToCart(productId)
    A->>DB: Update Cart
    A->>C: Invalidate Cart Cache
    A-->>F: Updated Cart
    F-->>U: Show Cart Update
    
    U->>F: Checkout
    F->>A: createCheckoutSession
    A->>S: Create Payment Intent
    S-->>A: Payment Session
    A-->>F: Checkout URL
    F-->>U: Redirect to Payment
    
    U->>S: Complete Payment
    S->>A: Webhook: payment_succeeded
    A->>DB: Create Order
    A->>E: Send Confirmation
    A->>C: Clear User Caches
    A-->>S: Acknowledge
```

### **AI Recommendation Flow**

```mermaid
flowchart LR
    subgraph "User Interaction"
        A[User Browses] --> B[View History]
        B --> C[Behavior Tracking]
    end
    
    subgraph "AI Processing"
        C --> D[Feature Extraction]
        D --> E[Embedding Generation]
        E --> F[Vector Similarity]
        F --> G[Recommendation Engine]
    end
    
    subgraph "Personalization"
        G --> H[Style Profile]
        H --> I[Filtered Results]
        I --> J[Ranked Products]
    end
    
    subgraph "Delivery"
        J --> K[API Response]
        K --> L[Frontend Display]
        L --> M[User Sees Recommendations]
    end
```

---

## 📝 **Detailed File Descriptions**

### **Core Application Files**

#### **`src/app/layout.tsx`** - Root Layout
The main layout wrapper for the entire application. Handles:
- Global providers (Theme, Auth, Analytics)
- Meta tags and SEO defaults
- Font loading and optimization
- Global error boundaries
- Progressive enhancement setup

#### **`src/app/page.tsx`** - Homepage
The landing page that creates the first impression:
- Hero section with cinematic video background
- Featured products carousel
- AI-powered personalized sections
- Trending collections
- Newsletter signup with incentive

#### **`src/app/(shop)/products/[slug]/page.tsx`** - Product Detail Page
The heart of the shopping experience:
- Dynamic product data fetching
- Image gallery with zoom and 360° view
- Variant selection (size, color)
- AI-powered recommendations
- Social proof (reviews, ratings)
- Add to cart functionality
- Share and wishlist features

### **API Layer Files**

#### **`src/server/api/routers/product.ts`** - Product Router
Handles all product-related API operations:
- `getAll`: Paginated product listing with filters
- `getBySlug`: Single product details
- `search`: Full-text and vector search
- `getRecommendations`: AI-powered suggestions
- `getSimilar`: Find similar products
- `trackView`: Analytics tracking

#### **`src/server/api/routers/cart.ts`** - Cart Router
Manages shopping cart operations:
- `get`: Retrieve current cart
- `add`: Add item to cart
- `update`: Update quantities
- `remove`: Remove items
- `clear`: Empty cart
- `applyCoupon`: Discount application
- `estimateShipping`: Calculate shipping

#### **`src/server/api/routers/ai.ts`** - AI Router
Powers intelligent features:
- `getStyleProfile`: User style analysis
- `visualSearch`: Image-based product search
- `completeTheLook`: Outfit suggestions
- `chatAssistant`: AI shopping assistant
- `generateDescription`: Dynamic content

### **Service Layer Files**

#### **`src/server/services/auth.service.ts`** - Authentication Service
Handles user authentication and authorization:
- JWT token management
- OAuth provider integration
- Session handling
- Role-based access control
- Password encryption
- Two-factor authentication

#### **`src/server/services/payment.service.ts`** - Payment Service
Manages payment processing:
- Stripe integration
- Payment intent creation
- Subscription handling
- Refund processing
- Invoice generation
- Cryptocurrency payments

#### **`src/server/services/ai.service.ts`** - AI Service
Integrates AI capabilities:
- OpenAI GPT-4 integration
- Image analysis with Claude Vision
- Embedding generation
- Style profiling
- Natural language processing
- Recommendation algorithms

### **Component Files**

#### **`src/components/features/products/product-card.tsx`** - Product Card
Reusable product display component:
- Responsive image loading
- Hover animations
- Quick view trigger
- Price display with discounts
- Wishlist toggle
- Rating display

#### **`src/components/features/ai/visual-search.tsx`** - Visual Search
AI-powered image search interface:
- Camera/upload integration
- Real-time processing feedback
- Result grid display
- Similarity scoring
- Filter refinement

#### **`src/components/features/cart/cart-drawer.tsx`** - Cart Drawer
Slide-out shopping cart:
- Real-time updates
- Item management
- Price calculations
- Shipping estimates
- Checkout call-to-action
- Cross-sell suggestions

### **Configuration Files**

#### **`prisma/schema.prisma`** - Database Schema
Defines the entire data model:
- User management
- Product catalog
- Order processing
- AI/ML data structures
- Analytics tracking
- Content management

#### **`next.config.js`** - Next.js Configuration
Application configuration:
- Image optimization settings
- Internationalization
- Environment variables
- Webpack customization
- Performance optimizations
- Security headers

#### **`tailwind.config.ts`** - Tailwind Configuration
Design system configuration:
- Custom color palette
- Typography scale
- Animation utilities
- Breakpoint system
- Plugin configuration

---

## ✅ **Current Implementation Status**

### **Fully Implemented Features** ✓

#### **🏗️ Foundation & Infrastructure**
- [x] Next.js 14 App Router setup with TypeScript
- [x] Tailwind CSS with custom design system
- [x] Shadcn/UI component library integration
- [x] PostgreSQL database with Prisma ORM
- [x] tRPC API layer with type safety
- [x] NextAuth.js authentication system
- [x] Redis caching layer
- [x] Responsive mobile-first design

#### **🛍️ Core E-commerce**
- [x] Product catalog with categories
- [x] Product detail pages with galleries
- [x] Shopping cart functionality
- [x] User registration and login
- [x] Basic checkout flow
- [x] Order management system
- [x] Inventory tracking
- [x] Price calculations with tax

#### **💳 Payment Processing**
- [x] Stripe integration
- [x] Credit/debit card payments
- [x] Payment method saving
- [x] Basic invoice generation

#### **📱 User Experience**
- [x] Responsive design
- [x] Dark/light theme toggle
- [x] Loading states and skeletons
- [x] Error boundaries
- [x] SEO optimization basics

### **Partially Implemented Features** 🚧

#### **🤖 AI Features (60% Complete)**
- [x] Basic product recommendations
- [x] Search functionality
- [x] Simple personalization
- [ ] Visual search
- [ ] AI stylist
- [ ] Chatbot assistant
- [ ] Style profiling

#### **🎨 Advanced UI/UX (40% Complete)**
- [x] Basic animations
- [x] Product image zoom
- [ ] Cinematic hero sections
- [ ] Parallax effects
- [ ] 3D product views
- [ ] AR try-on

#### **📊 Analytics & Monitoring (30% Complete)**
- [x] Basic page tracking
- [x] Error tracking setup
- [ ] User behavior analytics
- [ ] A/B testing framework
- [ ] Performance monitoring
- [ ] Conversion tracking

#### **🔐 Security Features (70% Complete)**
- [x] Authentication system
- [x] Basic authorization
- [x] Input validation
- [x] HTTPS enforcement
- [ ] Two-factor authentication
- [ ] Advanced fraud detection

### **Not Yet Implemented** ❌

#### **🌟 Premium Features**
- [ ] Virtual shopping appointments
- [ ] Cryptocurrency payments
- [ ] NFT integration
- [ ] Subscription commerce
- [ ] Live shopping events
- [ ] Influencer portal

#### **🌍 Internationalization**
- [ ] Multi-language support
- [ ] Multi-currency
- [ ] Regional pricing
- [ ] Local payment methods
- [ ] Geo-targeted content

#### **🚀 Advanced Performance**
- [ ] Edge caching
- [ ] Image CDN
- [ ] Service workers
- [ ] Offline mode
- [ ] Background sync

---

## 🗺️ **Development Roadmap**

### **🎯 Immediate Goals (Next 3 Months)**

#### **Month 1: AI Integration & Personalization**
**Week 1-2: AI Infrastructure**
- [ ] Integrate OpenAI GPT-4 API
- [ ] Set up vector database (Pinecone)
- [ ] Implement embedding generation
- [ ] Create AI service layer

**Week 3-4: AI Features**
- [ ] Visual search functionality
- [ ] AI-powered recommendations
- [ ] Style quiz implementation
- [ ] Personal AI stylist MVP

#### **Month 2: Enhanced User Experience**
**Week 5-6: Advanced UI Components**
- [ ] Cinematic hero sections
- [ ] Parallax scrolling effects
- [ ] 3D product visualization
- [ ] Advanced animation system

**Week 7-8: Mobile & PWA**
- [ ] Progressive Web App setup
- [ ] Offline functionality
- [ ] Push notifications
- [ ] App-like navigation

#### **Month 3: Performance & Analytics**
**Week 9-10: Performance Optimization**
- [ ] Edge caching implementation
- [ ] Image CDN integration
- [ ] Code splitting optimization
- [ ] Core Web Vitals improvement

**Week 11-12: Analytics & Testing**
- [ ] Advanced analytics setup
- [ ] A/B testing framework
- [ ] Conversion tracking
- [ ] Comprehensive test suite

### **🚀 Long-term Goals (6-12 Months)**

#### **Q4 2024: Advanced Commerce Features**
- **Virtual Shopping Experience**
  - Live video consultations
  - AR/VR try-on features
  - Virtual showrooms
  - Personal shopper AI

- **Payment Innovation**
  - Cryptocurrency integration
  - Buy now, pay later options
  - Subscription commerce
  - Dynamic pricing engine

- **Social Commerce**
  - Influencer marketplace
  - User-generated content
  - Social sharing rewards
  - Group shopping features

#### **Q1 2025: Global Expansion**
- **Internationalization**
  - 10+ language support
  - Multi-currency with live rates
  - Regional fulfillment centers
  - Local payment methods

- **Marketplace Features**
  - Third-party sellers
  - Dropshipping integration
  - White-label solutions
  - B2B portal

#### **Q2 2025: Innovation & Sustainability**
- **Blockchain Integration**
  - NFT collectibles
  - Product authentication
  - Supply chain transparency
  - Decentralized reviews

- **Sustainability Platform**
  - Carbon tracking dashboard
  - Circular economy features
  - Ethical sourcing verification
  - Green delivery options

- **Advanced AI**
  - Custom AI model training
  - Predictive inventory
  - Dynamic content generation
  - Automated customer service

---

## 🚀 **Getting Started & Deployment**

### **Prerequisites**
Before you begin, ensure you have the following installed:
- Node.js 20.x or higher
- pnpm 9.x or higher
- PostgreSQL 16.x
- Redis 7.x (or Upstash account)
- Git

### **🛠️ Local Development Setup**

#### **1. Clone the Repository**
```bash
# Clone the repository
git clone https://github.com/nordeim/LuxeVerse-Quantum.git

# Navigate to the project directory
cd LuxeVerse-Quantum
```

#### **2. Install Dependencies**
```bash
# Install pnpm if you haven't already
npm install -g pnpm

# Install project dependencies
pnpm install
```

#### **3. Environment Configuration**
```bash
# Copy the example environment file
cp .env.example .env.local

# Open .env.local and configure the following:
```

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/luxeverse"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# OpenAI
OPENAI_API_KEY="sk-..."

# Algolia
NEXT_PUBLIC_ALGOLIA_APP_ID="your-app-id"
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY="your-search-key"
ALGOLIA_ADMIN_KEY="your-admin-key"

# Redis (Upstash)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# AWS S3
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"
S3_BUCKET_NAME="luxeverse-assets"

# Email (Resend)
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@luxeverse.ai"
```

#### **4. Database Setup**
```bash
# Run database migrations
pnpm db:migrate

# Seed the database with sample data
pnpm db:seed

# Open Prisma Studio to view your database
pnpm db:studio
```

#### **5. Start Development Server**
```bash
# Start the development server
pnpm dev

# The app will be available at http://localhost:3000
```

### **🚢 Production Deployment**

#### **Option 1: Deploy to Vercel (Recommended)**

##### **1. Install Vercel CLI**
```bash
npm i -g vercel
```

##### **2. Login to Vercel**
```bash
vercel login
```

##### **3. Configure Project**
```bash
# Link to Vercel project
vercel link

# Configure environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
# ... add all other environment variables
```

##### **4. Deploy**
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### **Option 2: Deploy to Custom VPS**

##### **1. Server Setup**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PM2
npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Redis
sudo apt install redis-server -y
```

##### **2. Configure Database**
```bash
# Create database user and database
sudo -u postgres psql

CREATE USER luxeverse WITH PASSWORD 'your-password';
CREATE DATABASE luxeverse_production OWNER luxeverse;
GRANT ALL PRIVILEGES ON DATABASE luxeverse_production TO luxeverse;
\q
```

##### **3. Deploy Application**
```bash
# Clone repository
git clone https://github.com/nordeim/LuxeVerse-Quantum.git
cd LuxeVerse-Quantum

# Install dependencies
pnpm install

# Build application
pnpm build

# Run migrations
pnpm db:migrate:prod

# Start with PM2
pm2 start npm --name "luxeverse" -- start
pm2 save
pm2 startup
```

##### **4. Configure Nginx**
```nginx
# /etc/nginx/sites-available/luxeverse
server {
    listen 80;
    server_name luxeverse.ai www.luxeverse.ai;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

##### **5. Enable SSL with Let's Encrypt**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d luxeverse.ai -d www.luxeverse.ai

# Auto-renewal
sudo systemctl enable certbot.timer
```

#### **Option 3: Deploy with Docker**

##### **1. Create Dockerfile**
```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy dependency files
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN pnpm prisma generate

# Build application
RUN pnpm build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

##### **2. Create docker-compose.yml**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://luxeverse:password@db:5432/luxeverse
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - uploads:/app/uploads

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=luxeverse
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=luxeverse
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

volumes:
  postgres_data:
  redis_data:
  uploads:
```

##### **3. Deploy with Docker Compose**
```bash
# Build and start containers
docker-compose up -d

# Run migrations
docker-compose exec app pnpm db:migrate:prod

# View logs
docker-compose logs -f app
```

### **🔍 Post-Deployment Checklist**

- [ ] Verify all environment variables are set
- [ ] Test payment processing in production mode
- [ ] Configure domain DNS settings
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategies
- [ ] Test email delivery
- [ ] Verify SSL certificate
- [ ] Set up CDN for static assets
- [ ] Configure rate limiting
- [ ] Enable security headers
- [ ] Test mobile responsiveness
- [ ] Verify SEO meta tags
- [ ] Set up Google Analytics
- [ ] Configure error tracking
- [ ] Test load balancing (if applicable)

---

## 🛠️ **Development Guide**

### **Code Style Guidelines**

#### **TypeScript Best Practices**
```typescript
// ✅ Good: Use type inference where possible
const products = await db.product.findMany()

// ❌ Bad: Redundant type annotation
const products: Product[] = await db.product.findMany()

// ✅ Good: Use discriminated unions
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

// ✅ Good: Prefer interfaces for object shapes
interface ProductProps {
  product: Product
  onAddToCart?: (id: string) => void
}
```

#### **React Component Patterns**
```tsx
// ✅ Good: Use function components with TypeScript
export function ProductCard({ product, onAddToCart }: ProductProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{product.description}</p>
      </CardContent>
    </Card>
  )
}

// ✅ Good: Co-locate related components
export function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      <ProductImage src={product.image} alt={product.name} />
      <ProductInfo product={product} />
    </div>
  )
}

function ProductImage({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} className="..." />
}

function ProductInfo({ product }: { product: Product }) {
  return <div>...</div>
}
```

### **Git Workflow**

#### **Branch Naming Convention**
- `feature/` - New features (e.g., `feature/ai-recommendations`)
- `fix/` - Bug fixes (e.g., `fix/cart-calculation`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)
- `docs/` - Documentation updates (e.g., `docs/api-guide`)

#### **Commit Message Format**
```bash
# Format: <type>(<scope>): <subject>

feat(cart): add quantity selector
fix(auth): resolve OAuth redirect issue
docs(readme): update deployment guide
style(products): improve card hover state
refactor(api): optimize database queries
test(checkout): add payment flow tests
chore(deps): update to Next.js 14.2
```

### **Testing Strategy**

#### **Unit Tests**
```typescript
// src/lib/utils/format.test.ts
import { describe, it, expect } from 'vitest'
import { formatPrice, formatDate } from './format'

describe('formatPrice', () => {
  it('formats USD correctly', () => {
    expect(formatPrice(1234.56, 'USD')).toBe('$1,234.56')
  })
  
  it('handles zero', () => {
    expect(formatPrice(0, 'USD')).toBe('$0.00')
  })
})
```

#### **Integration Tests**
```typescript
// tests/integration/cart.test.ts
import { describe, it, expect } from 'vitest'
import { createInnerTRPCContext } from '@/server/api/trpc'
import { appRouter } from '@/server/api/root'

describe('Cart API', () => {
  it('adds item to cart', async () => {
    const ctx = createInnerTRPCContext({ session: mockSession })
    const caller = appRouter.createCaller(ctx)
    
    const result = await caller.cart.add({
      productId: 'test-product',
      quantity: 1
    })
    
    expect(result.items).toHaveLength(1)
    expect(result.items[0].productId).toBe('test-product')
  })
})
```

#### **E2E Tests**
```typescript
// tests/e2e/checkout.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Checkout Flow', () => {
  test('completes purchase successfully', async ({ page }) => {
    // Add product to cart
    await page.goto('/products/luxury-watch')
    await page.click('button:has-text("Add to Cart")')
    
    // Go to checkout
    await page.click('a:has-text("Checkout")')
    
    // Fill shipping info
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="name"]', 'Test User')
    
    // Complete payment
    await page.click('button:has-text("Complete Order")')
    
    // Verify success
    await expect(page).toHaveURL(/\/order-confirmation/)
    await expect(page.locator('h1')).toContainText('Thank You')
  })
})
```

---

## 🤝 **Contributing**

We love contributions! LuxeVerse Quantum is built by the community, for the community.

### **How to Contribute**

1. **Fork the Repository**
   ```bash
   git clone https://github.com/nordeim/LuxeVerse-Quantum.git
   cd LuxeVerse-Quantum
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Your Changes**
   - Write clean, documented code
   - Follow our style guidelines
   - Add tests for new features
   - Update documentation

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Provide a clear description
   - Reference any related issues
   - Include screenshots if applicable

### **Contribution Guidelines**

- **Code Quality**: All code must pass linting and type checking
- **Testing**: New features require tests (aim for >80% coverage)
- **Documentation**: Update relevant docs and JSDoc comments
- **Performance**: Consider performance implications
- **Accessibility**: Ensure WCAG 2.1 AA compliance
- **Security**: Follow security best practices

### **Getting Help**

- 💬 [Discord Community](https://discord.gg/luxeverse)
- 📧 [Email Support](mailto:support@luxeverse.ai)
- 📚 [Documentation](https://docs.luxeverse.ai)
- 🐛 [Issue Tracker](https://github.com/nordeim/LuxeVerse-Quantum/issues)

---

## 📊 **Performance Metrics**

### **Core Web Vitals Targets**

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **LCP** (Largest Contentful Paint) | < 2.5s | 1.8s | ✅ |
| **FID** (First Input Delay) | < 100ms | 45ms | ✅ |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.05 | ✅ |
| **TTFB** (Time to First Byte) | < 800ms | 320ms | ✅ |

### **Performance Optimizations**

- **Image Optimization**
  - Next.js Image component with automatic optimization
  - WebP/AVIF format serving
  - Responsive images with srcset
  - Lazy loading with blur placeholders

- **Code Splitting**
  - Route-based splitting
  - Component lazy loading
  - Dynamic imports for heavy libraries
  - Vendor chunk optimization

- **Caching Strategy**
  - Static assets: 1 year cache
  - API responses: Redis with TTL
  - HTML pages: ISR with 60s revalidation
  - CDN edge caching globally

---

## 🔒 **Security Features**

### **Application Security**

- **Authentication & Authorization**
  - JWT-based session management
  - OAuth 2.0 integration (Google, Apple)
  - Role-based access control (RBAC)
  - Two-factor authentication (coming soon)

- **Data Protection**
  - All data encrypted at rest (AES-256)
  - TLS 1.3 for data in transit
  - PII tokenization
  - GDPR compliant data handling

- **API Security**
  - Rate limiting (100 req/15min)
  - CORS configuration
  - Input validation with Zod
  - SQL injection prevention

- **Payment Security**
  - PCI DSS compliance via Stripe
  - No credit card data stored
  - Secure webhook validation
  - Fraud detection

### **Infrastructure Security**

- **Network Security**
  - WAF protection
  - DDoS mitigation
  - IP allowlisting for admin
  - VPN access for infrastructure

- **Monitoring & Compliance**
  - Real-time security monitoring
  - Automated vulnerability scanning
  - Security audit logging
  - OWASP Top 10 protection

---

## 📱 **Mobile Experience**

### **Progressive Web App Features**

- **Installation**
  - Add to home screen
  - Custom splash screen
  - App-like navigation
  - Fullscreen mode

- **Offline Capabilities**
  - Browse cached products
  - View order history
  - Access wishlist
  - Queue actions for sync

- **Mobile Optimizations**
  - Touch gestures
  - Haptic feedback
  - Bottom navigation
  - Thumb-friendly UI

- **Performance**
  - 60fps scrolling
  - Optimized images
  - Minimal JavaScript
  - Fast interaction

---

## 🧪 **Testing Strategy**

### **Test Coverage Requirements**

| Type | Coverage | Tools |
|------|----------|-------|
| **Unit Tests** | > 80% | Vitest, React Testing Library |
| **Integration Tests** | > 70% | Vitest, MSW |
| **E2E Tests** | Critical paths | Playwright |
| **Performance Tests** | All pages | Lighthouse CI |
| **Accessibility Tests** | WCAG 2.1 AA | axe-core, Pa11y |

### **Continuous Integration**

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm type-check
      - run: pnpm test
      - run: pnpm test:e2e
```

---

## 📚 **Additional Resources**

### **Documentation**
- 📖 [API Documentation](https://docs.luxeverse.ai/api)
- 🏗️ [Architecture Guide](https://docs.luxeverse.ai/architecture)
- 🎨 [Design System](https://design.luxeverse.ai)
- 🚀 [Deployment Guide](https://docs.luxeverse.ai/deployment)

### **Community**
- 💬 [Discord Server](https://discord.gg/luxeverse)
- 🐦 [Twitter Updates](https://twitter.com/luxeverseai)
- 📺 [YouTube Tutorials](https://youtube.com/@luxeverse)
- 📝 [Dev Blog](https://blog.luxeverse.ai)

### **Tools & Extensions**
- 🎨 [Figma UI Kit](https://figma.com/@luxeverse)
- 🔧 [VS Code Extension Pack](https://marketplace.visualstudio.com/luxeverse)
- 📦 [Component Library](https://npm.im/@luxeverse/ui)
- 🤖 [CLI Tool](https://npm.im/@luxeverse/cli)

### **Learning Resources**
- 🎓 [LuxeVerse University](https://university.luxeverse.ai)
- 📚 [Best Practices Guide](https://docs.luxeverse.ai/best-practices)
- 🏆 [Case Studies](https://luxeverse.ai/case-studies)
- 💡 [Architecture Decisions](https://docs.luxeverse.ai/adr)

---

<div align="center">

## 🌟 **Join the Revolution**

LuxeVerse Quantum isn't just a platform—it's a movement. We're redefining what e-commerce can be when art, technology, and human experience converge.

### **Ready to Build the Future?**

[![Star on GitHub](https://img.shields.io/github/stars/nordeim/LuxeVerse-Quantum?style=social)](https://github.com/nordeim/LuxeVerse-Quantum)
[![Follow on Twitter](https://img.shields.io/twitter/follow/luxeverseai?style=social)](https://twitter.com/luxeverseai)
[![Join Discord](https://img.shields.io/discord/1234567890?color=7289da&logo=discord&logoColor=white)](https://discord.gg/luxeverse)

**Together, we're not just building an e-commerce platform.**  
**We're crafting the future of digital luxury.**

---

*"The best way to predict the future is to invent it."* — Alan Kay

**LuxeVerse Quantum** • Making Tomorrow's Commerce Today

</div>

```

