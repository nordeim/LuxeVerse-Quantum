# 🚀 LuxeVerse Quantum - V2 Execution Plan (Final)

## 🎯 Project Overview

This document outlines the comprehensive, phased execution plan for building LuxeVerse Quantum, a cinematic, AI-first luxury e-commerce platform. It serves as the definitive roadmap for developers, ensuring every implementation detail aligns with our core architectural principles and the final, approved V2 database schema.

### 🏛️ Architectural Principles

Every decision and line of code in this plan adheres to these foundational pillars:

1.  **Schema-Driven Development**: The **final V5 `prisma.schema.prisma`** is the immutable source of truth for our data model. All features and APIs are built to serve this schema.
2.  **Type-Safe from End-to-End**: We will leverage TypeScript, Prisma, and tRPC to ensure type safety from the database query to the final pixel rendered in the UI.
3.  **Experience-First Engineering**: Performance, cinematic animations (`Framer Motion`), and accessibility (`WCAG 2.1 AA`) are not afterthoughts; they are core requirements baked into every component.
4.  **Enterprise-Grade Security**: Every feature, especially authentication and payments, will be built with a zero-trust mindset, incorporating best practices for data protection and fraud prevention.
5.  **Developer Ergonomics**: We will use clean, reusable patterns (e.g., custom hooks, service layers, compound components) to create a codebase that is a joy to work in and easy to maintain.

---

## 🛠️ Development Prerequisites

### Required Tools
```bash
node --version  # >= 20.x
pnpm --version  # >= 9.x
git --version   # >= 2.x
```
### Environment Setup
```bash
# Clone the repository and install dependencies
git clone https://github.com/nordeim/LuxeVerse-Quantum.git
cd LuxeVerse-Quantum
pnpm install

# Copy environment template and populate with your keys
cp .env.example .env.local```
---

## 📁 Project Structure

```
luxeverse-quantum/
├── src/
│   ├── app/                    # Next.js App Router (feature-sliced)
│   ├── components/             # Reusable React components (UI, features)
│   ├── server/                 # Backend logic (tRPC routers, services)
│   ├── lib/                    # Shared utilities, configs, clients
│   ├── hooks/                  # Custom React hooks
│   ├── store/                  # Zustand client-side stores
│   ├── styles/                 # Global styles and themes
│   └── types/                  # Global TypeScript types
├── prisma/                     # Database schema, migrations, seed
├── public/                     # Static assets
├── tests/                      # Vitest & Playwright tests
└── [config files]              # next.config, tsconfig, etc.
```
---

## Phase 1: Foundation & V2 Schema Implementation

### 🎯 Goals
- Establish the project with the correct, final V5 `prisma.schema.prisma`.
- Configure all development tools, linters, and formatters.
- Implement the base styling system and root layout.
- Ensure the full database schema is pushed and the application runs successfully.

### 📅 Duration: 3 days

### 📋 Files to Create / Update

#### 1.1 `/package.json`
**Purpose**: Define all project dependencies and scripts for the full V2 scope.

```json
{
  "name": "luxeverse-quantum",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts",
    "test": "vitest",
    "test:e2e": "playwright test",
    "prepare": "husky install"
  },
  "dependencies": {
    "@auth/prisma-adapter": "^2.4.1",
    "@hookform/resolvers": "^3.9.0",
    "@prisma/client": "5.17.0",
    "@radix-ui/react-checkbox": "^1.1.1",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-scroll-area": "^1.1.0",
    "@radix-ui/react-select": "^2.1.1",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slider": "^1.2.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.1",
    "@stripe/react-stripe-js": "^2.7.3",
    "@stripe/stripe-js": "^4.1.0",
    "@t3-oss/env-nextjs": "^0.10.1",
    "@tanstack/react-query": "^5.51.1",
    "@trpc/client": "^11.0.0-rc.464",
    "@trpc/next": "^11.0.0-rc.464",
    "@trpc/react-query": "^11.0.0-rc.464",
    "@trpc/server": "^11.0.0-rc.464",
    "bcryptjs": "^2.4.3",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "framer-motion": "^11.3.8",
    "lucide-react": "^0.414.0",
    "nanoid": "^5.0.7",
    "next": "14.2.5",
    "next-auth": "^4.24.7",
    "next-themes": "^0.3.0",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-hook-form": "^7.52.1",
    "resend": "^3.4.0",
    "stripe": "^16.2.0",
    "superjson": "^2.2.1",
    "tailwind-merge": "^2.4.0",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.23.8",
    "zustand": "^4.5.4"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "20.14.10",
    "@types/react": "18.3.3",
    "@types/react-dom": "18.3.0",
    "eslint": "8.57.0",
    "eslint-config-next": "14.2.5",
    "husky": "^9.0.11",
    "postcss": "8.4.39",
    "prettier": "^3.3.3",
    "prettier-plugin-tailwindcss": "^0.6.5",
    "prisma": "5.17.0",
    "tailwindcss": "3.4.6",
    "tsx": "^4.16.2",
    "typescript": "5.5.3"
  }
}
```

---

#### 1.2 `/prisma/schema.prisma`
**Purpose**: The single source of truth for our entire database. **This is the final, approved V5 schema.**

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

---

#### 1.3 `/src/lib/prisma.ts`
**Purpose**: Prisma client singleton for database connections.

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---
#### 1.4 `/src/app/layout.tsx`
**Purpose**: Root layout providing all necessary context providers.

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { AuthProvider } from '@/components/providers/auth-provider'
import { TRPCProvider } from '@/components/providers/trpc-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { CartDrawer } from '@/components/features/cart-drawer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'LuxeVerse - The Future of Luxury',
  description: 'Experience the future of luxury shopping with AI-powered personalization.',
  // ... other metadata
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <TRPCProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
            >
              {children}
              <CartDrawer />
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </TRPCProvider>
      </body>
    </html>
  )
}
```---

## Phase 2: Authentication & User Core

### 🎯 Goals
- Implement the approved, high-quality authentication system.
- Build out the core user account pages (Settings, Profile).
- Ensure all user-related data initializations (StyleProfile, Wishlist, etc.) are functioning.

### 📅 Duration: 4 days

### ✅ Key Deliverables
- [x] Multi-provider authentication (OAuth, Credentials, Email).
- [x] Secure registration with atomic user creation.
- [x] Advanced middleware for role-based access control.
- [x] Cinematic and accessible login/register UI.
- [x] Enhanced `useSession` hook for developer ergonomics.

### ⚙️ Core Implementation
*(This phase implements the previously approved, gold-standard authentication code. The files listed below should contain that exact code.)*

- **`/src/lib/auth.ts`**: The comprehensive NextAuth configuration.
- **`/src/app/api/auth/[...nextauth]/route.ts`**: The NextAuth API route handler.
- **`/src/middleware.ts`**: The advanced security and routing middleware.
- **`/src/components/providers/auth-provider.tsx`**: The client-side session provider.
- **`/src/app/(auth)/login/page.tsx`**: The cinematic login page.
- **`/src/app/(auth)/register/page.tsx`**: The multi-step registration page.
- **`/src/app/api/auth/register/route.ts`**: The secure registration API endpoint.
- **`/src/hooks/use-session.ts`**: The enhanced `useSession` hook.

---

## Phase 3: Product Catalog & Display

### 🎯 Goals
- Implement the approved product catalog API and UI.
- Ensure advanced filtering, sorting, and searching are fully functional.
- Build out brand and collection pages.
- Optimize for performance and SEO.

### 📅 Duration: 5 days

### ✅ Key Deliverables
- [x] Unified tRPC endpoint for products with advanced filtering.
- [x] Hierarchical category API.
- [x] Interactive product listing page with infinite scroll.
- [x] SEO-optimized product detail page with static generation.
- [x] Sophisticated `ProductCard` component with hover effects and quick actions.

### ⚙️ Core Implementation
*(This phase implements the previously approved product catalog code, incorporating the required refactoring.)*

- **`/src/server/api/routers/product.ts`**: The refactored, unified product API endpoint (merging `search` into `getAll`).
- **`/src/server/api/routers/category.ts`**: The category API endpoint.
- **`/src/app/(shop)/products/page.tsx`**: The main product listing page.
- **`/src/app/(shop)/products/[slug]/page.tsx`**: The product detail page.
- **`/src/components/features/product-card.tsx`**: The interactive product card.
- **`/src/components/features/product-filters.tsx`**: The filtering component.

---
## Phase 4: Cart & Checkout

### 🎯 Goals
- Implement the approved, enterprise-grade cart and checkout system.
- Integrate Stripe for secure payment processing.
- Ensure atomic order creation and inventory management.
- Provide a seamless, mobile-first checkout experience.

### 📅 Duration: 4 days

### ✅ Key Deliverables
- [x] Advanced Zustand cart store with persistence and AI features.
- [x] Sophisticated cart drawer UI with recommendations.
- [x] Secure, multi-step checkout flow with client and server-side validation.
- [x] Comprehensive Stripe service layer for payments.
- [x] Transactional checkout API with inventory reservation and rollback logic.

### ⚙️ Core Implementation
*(This phase implements the previously approved, gold-standard cart and checkout code.)*

- **`/src/store/cart.store.ts`**: The advanced Zustand cart store.
- **`/src/components/features/cart-drawer.tsx`**: The sophisticated cart drawer UI.
- **`/src/app/(shop)/checkout/page.tsx`**: The multi-step checkout flow orchestrator.
- **`/src/lib/stripe.ts`**: The comprehensive Stripe service layer.
- **`/src/app/api/checkout/route.ts`**: The secure, transactional checkout API endpoint.

---

## Phase 5: Post-Purchase & User Dashboard

### 🎯 Goals
- Build the user account dashboard layout and navigation.
- Implement a detailed order history and order details page.
- Allow users to submit and view product reviews.
- Create UI for managing addresses and payment methods.

### 📅 Duration: 4 days

### ✅ Key Deliverables
- [x] Protected `/account` area with a consistent layout.
- [x] tRPC router for fetching user-specific data (orders, reviews).
- [x] Order history page with pagination.
- [x] Order detail page with status tracking.
- [x] Form for submitting a new product review.

### ⚙️ Core Implementation Files

#### 5.1 `/src/server/api/routers/order.ts`

```typescript
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

export const orderRouter = createTRPCRouter({
  getHistory: protectedProcedure
    .input(z.object({
      limit: z.number().default(10),
      cursor: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const orders = await ctx.prisma.order.findMany({
        where: { userId: ctx.session.user.id },
        orderBy: { createdAt: 'desc' },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        include: {
          items: {
            include: { product: true, variant: true }
          }
        }
      })
      
      let nextCursor: string | undefined = undefined
      if (orders.length > input.limit) {
        nextCursor = orders.pop()!.id
      }
      
      return { orders, nextCursor }
    }),
    
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const order = await ctx.prisma.order.findFirst({
        where: { id: input.id, userId: ctx.session.user.id },
        include: {
          items: {
            include: { product: true, variant: true }
          },
          statusHistory: {
            orderBy: { createdAt: 'desc' }
          }
        }
      })
      if (!order) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' })
      }
      return order
    }),
})
```

---

#### 5.2 `/src/app/(account)/account/orders/page.tsx`

```typescript
'use client'

import Link from 'next/link'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatDate } from '@/lib/utils'
import { Icons } from '@/components/ui/icons'

export default function OrdersPage() {
  const { data, isLoading, fetchNextPage, hasNextPage } = api.order.getHistory.useInfiniteQuery(
    { limit: 10 },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  )

  const orders = data?.pages.flatMap(page => page.orders) ?? []

  // ... Loading and Empty states ...

  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>View and track your past orders.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <h3 className="font-semibold">Order #{order.orderNumber}</h3>
                <p className="text-sm text-muted-foreground">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <Badge>{order.status}</Badge>
            </CardHeader>
            <CardContent>
              {/* ... Order item details ... */}
              <div className="flex justify-between items-center mt-4">
                <p className="font-semibold">{formatPrice(order.total)}</p>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/account/orders/${order.id}`}>View Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {hasNextPage && (
          <Button onClick={() => fetchNextPage()} variant="outline" className="w-full">
            Load More
          </Button>
        )}
      </CardContent>
    </div>
  )
}
```

---

## Phase 6: AI Personalization Engine

### 🎯 Goals
- Implement the user Style Profile, including an onboarding quiz.
- Build the AI recommendation engine using vector embeddings.
- Create UI for displaying personalized product recommendations.

### 📅 Duration: 5 days

### ✅ Key Deliverables
- [ ] A multi-step style quiz to populate the `StyleProfile` model.
- [ ] tRPC endpoint to save style preferences and generate embeddings.
- [ ] tRPC endpoint (`ai.getRecommendations`) that performs vector similarity search.
- [ ] A reusable `AIRecommendations` component.

### ⚙️ Core Implementation Files

#### 6.1 `/src/server/api/routers/ai.ts`

```typescript
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'
// Assume an 'openai' or similar embedding service is configured in '@/lib/ai'
import { generateEmbedding } from '@/lib/ai' 

export const aiRouter = createTRPCRouter({
  saveStyleProfile: protectedProcedure
    .input(z.object({
      stylePersonas: z.array(z.string()),
      favoriteColors: z.array(z.string()),
      preferredBrands: z.array(z.string()),
      // ... other fields from StyleProfile
    }))
    .mutation(async ({ ctx, input }) => {
      const preferenceText = `Styles: ${input.stylePersonas.join(', ')}. Colors: ${input.favoriteColors.join(', ')}. Brands: ${input.preferredBrands.join(', ')}.`;
      const embedding = await generateEmbedding(preferenceText);

      return ctx.prisma.styleProfile.upsert({
        where: { userId: ctx.session.user.id },
        create: { ...input, userId: ctx.session.user.id, styleEmbedding: embedding },
        update: { ...input, styleEmbedding: embedding },
      });
    }),

  getRecommendations: protectedProcedure
    .input(z.object({ limit: z.number().default(8) }))
    .query(async ({ ctx, input }) => {
      const styleProfile = await ctx.prisma.styleProfile.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!styleProfile?.styleEmbedding) {
        // Fallback to most popular products if no style profile
        return ctx.prisma.product.findMany({
          where: { status: 'ACTIVE', deletedAt: null },
          orderBy: { purchaseCount: 'desc' },
          take: input.limit,
        });
      }

      const embedding = styleProfile.styleEmbedding as unknown as number[];
      const products = await ctx.prisma.$queryRaw`
        SELECT
          p.*,
          1 - (p.product_embedding <=> ${embedding}::vector) as similarity
        FROM products p
        WHERE p.status = 'ACTIVE' AND p.deleted_at IS NULL
        ORDER BY similarity DESC
        LIMIT ${input.limit};
      `;
      
      return products;
    }),
});
```
---

## Phase 7: Advanced Commerce (V2 Features)

### 🎯 Goals
- Implement the Virtual Closet feature.
- Build the Live Shopping Event functionality.
- Integrate the Internationalization (Translation) system.

### 📅 Duration: 6 days

### ✅ Key Deliverables
- [ ] `VirtualClosetItem` model integration with order history.
- [ ] UI for users to view and manage their virtual closet.
- [ ] `LiveShoppingEvent` creation and display.
- [ ] Real-time interaction features for live events (e.g., chat, featured products).
- [ ] `*Translation` models integrated into product/category fetching logic.

---

## Phase 8: Admin & Operations

### 🎯 Goals
- Build a secure admin dashboard.
- Implement management interfaces for products, orders, users, and content.
- Provide analytics and reporting for business insights.

### 📅 Duration: 5 days

---

## Phase 9: Performance, Testing & QA

### 🎯 Goals
- Achieve >90% test coverage across the application.
- Conduct thorough performance optimization (Lighthouse >95).
- Perform security and accessibility audits.

### 📅 Duration: 4 days

---

## Phase 10: Launch & Post-Launch

### 🎯 Goals
- Deploy the application to a production environment on Vercel.
- Configure monitoring, alerting, and logging.
- Execute the final launch checklist.

### 📅 Duration: 2 days
