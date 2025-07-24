# 🎯 Prisma Schema for LuxeVerse

I'll create a comprehensive Prisma schema that perfectly aligns with our SQL database design and supports all features in the PRD. Let me carefully plan and execute this critical foundation piece.

## Planning Approach

1. **Schema Organization**: Logical grouping with clear comments
2. **Type Safety**: Proper type mappings and constraints
3. **Relations**: Explicit relation definitions with proper cascading
4. **Indexes**: Performance-optimized queries
5. **Prisma Features**: Leverage Prisma-specific capabilities
6. **Future-Ready**: Support for AI vectors and advanced features

```prisma
// =============================================
// LuxeVerse Prisma Schema
// Version: 1.0
// Description: Comprehensive schema for luxury e-commerce platform
// with AI personalization, AR/3D features, and membership system
// =============================================

generator client {
  provider = "prisma-client-js"
  previewFeatures = ["fullTextSearch", "postgresqlExtensions", "multiSchema", "views"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  extensions = [uuid_ossp(map: "uuid-ossp"), pgcrypto, pg_trgm(map: "pg_trgm"), vector, postgis]
}

// =============================================
// ENUMS
// =============================================

enum UserRole {
  GUEST
  CUSTOMER
  VIP
  ADMIN
  SUPER_ADMIN
}

enum MembershipTier {
  PEARL      // Free tier
  SAPPHIRE   // $99/month
  DIAMOND    // $299/month
  OBSIDIAN   // $499/month - Invite only
}

enum ProductStatus {
  DRAFT
  ACTIVE
  OUT_OF_STOCK
  DISCONTINUED
  ARCHIVED
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
}

enum PaymentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  REFUNDED
  PARTIALLY_REFUNDED
}

enum ReviewStatus {
  PENDING
  APPROVED
  REJECTED
  FLAGGED
}

enum AIInteractionType {
  STYLE_QUIZ
  VISUAL_SEARCH
  CHAT
  RECOMMENDATION
  OUTFIT_BUILDER
  TREND_ALERT
}

enum NotificationType {
  ORDER_UPDATE
  PRICE_DROP
  BACK_IN_STOCK
  EXCLUSIVE_ACCESS
  MEMBERSHIP_UPDATE
  AI_RECOMMENDATION
  SOCIAL_INTERACTION
}

// =============================================
// USER MANAGEMENT MODELS
// =============================================

model User {
  id                String      @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  email             String      @unique @db.VarChar(255)
  emailVerified     DateTime?   @map("email_verified") @db.Timestamptz
  passwordHash      String?     @map("password_hash") @db.VarChar(255)
  name              String?     @db.VarChar(255)
  avatarUrl         String?     @map("avatar_url") @db.VarChar(500)
  phone             String?     @db.VarChar(50)
  phoneVerified     DateTime?   @map("phone_verified") @db.Timestamptz
  role              UserRole    @default(CUSTOMER)
  membershipTier    MembershipTier @default(PEARL) @map("membership_tier")
  membershipExpiresAt DateTime? @map("membership_expires_at") @db.Timestamptz
  
  // Preferences
  preferredCurrency String      @default("USD") @map("preferred_currency") @db.Char(3)
  preferredLanguage String      @default("en") @map("preferred_language") @db.VarChar(10)
  timezone          String      @default("UTC") @db.VarChar(50)
  
  // AI & Personalization
  styleProfileCompleted Boolean @default(false) @map("style_profile_completed")
  aiConsent         Boolean     @default(true) @map("ai_consent")
  personalizationLevel Int      @default(5) @map("personalization_level")
  
  // Metadata
  lastLoginAt       DateTime?   @map("last_login_at") @db.Timestamptz
  loginCount        Int         @default(0) @map("login_count")
  createdAt         DateTime    @default(now()) @map("created_at") @db.Timestamptz
  updatedAt         DateTime    @updatedAt @map("updated_at") @db.Timestamptz
  deletedAt         DateTime?   @map("deleted_at") @db.Timestamptz
  
  // Relations
  oauthAccounts     OAuthAccount[]
  sessions          Session[]
  orders            Order[]
  carts             Cart[]
  wishlists         Wishlist[]
  reviews           Review[]
  addresses         Address[]
  paymentMethods    PaymentMethod[]
  notifications     Notification[]
  styleProfile      StyleProfile?
  aiInteractions    AIInteraction[]
  searchLogs        SearchLog[]
  productViews      ProductView[]
  couponUses        CouponUse[]
  reviewInteractions ReviewInteraction[]
  membershipTransactions MembershipTransaction[]
  loyaltyPoints     LoyaltyPoint[]
  auditLogs         AuditLog[]
  
  @@index([email], name: "idx_users_email")
  @@index([membershipTier, membershipExpiresAt], name: "idx_users_membership")
  @@index([createdAt(sort: Desc)], name: "idx_users_created_at")
  @@map("users")
}

model OAuthAccount {
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
  updatedAt         DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
  @@map("oauth_accounts")
}

model Session {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId            String    @map("user_id") @db.Uuid
  sessionToken      String    @unique @map("session_token") @db.VarChar(255)
  ipAddress         String?   @map("ip_address") @db.Inet
  userAgent         String?   @map("user_agent") @db.Text
  expiresAt         DateTime  @map("expires_at") @db.Timestamptz
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  carts             Cart[]
  aiInteractions    AIInteraction[]
  searchLogs        SearchLog[]
  productViews      ProductView[]
  
  @@index([sessionToken], name: "idx_sessions_token")
  @@index([expiresAt], name: "idx_sessions_expires")
  @@map("sessions")
}

// =============================================
// AI & PERSONALIZATION MODELS
// =============================================

model StyleProfile {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId            String    @unique @map("user_id") @db.Uuid
  
  // Style preferences
  stylePersonas     String[]  @map("style_personas")
  favoriteColors    String[]  @map("favorite_colors")
  avoidedColors     String[]  @map("avoided_colors")
  preferredBrands   String[]  @map("preferred_brands")
  avoidedMaterials  String[]  @map("avoided_materials")
  
  // Size information (encrypted)
  measurements      Json?     @db.JsonB
  typicalSizes      Json?     @map("typical_sizes") @db.JsonB
  
  // Budget preferences
  minPricePreference Decimal? @map("min_price_preference") @db.Decimal(10, 2)
  maxPricePreference Decimal? @map("max_price_preference") @db.Decimal(10, 2)
  sweetSpotPrice    Decimal?  @map("sweet_spot_price") @db.Decimal(10, 2)
  
  // AI embeddings for similarity matching
  styleEmbedding    Unsupported("vector(1536)")? @map("style_embedding")
  colorEmbedding    Unsupported("vector(512)")?  @map("color_embedding")
  brandEmbedding    Unsupported("vector(512)")?  @map("brand_embedding")
  
  // Behavioral data
  prefersSustainable Boolean  @default(false) @map("prefers_sustainable")
  prefersExclusive  Boolean   @default(false) @map("prefers_exclusive")
  earlyAdopterScore Decimal   @default(0.5) @map("early_adopter_score") @db.Decimal(3, 2)
  luxuryAffinityScore Decimal @default(0.5) @map("luxury_affinity_score") @db.Decimal(3, 2)
  
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt         DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("style_profiles")
}

model AIInteraction {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId            String?   @map("user_id") @db.Uuid
  sessionId         String?   @map("session_id") @db.Uuid
  interactionType   AIInteractionType @map("interaction_type")
  
  // Interaction data
  inputData         Json      @map("input_data") @db.JsonB
  outputData        Json      @map("output_data") @db.JsonB
  
  // Performance metrics
  responseTimeMs    Int?      @map("response_time_ms")
  confidenceScore   Decimal?  @map("confidence_score") @db.Decimal(3, 2)
  userSatisfaction  Int?      @map("user_satisfaction")
  
  // Metadata
  modelVersion      String?   @map("model_version") @db.VarChar(50)
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  user              User?     @relation(fields: [userId], references: [id], onDelete: Cascade)
  session           Session?  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  
  @@index([userId, createdAt(sort: Desc)], name: "idx_ai_interactions_user")
  @@index([interactionType, createdAt(sort: Desc)], name: "idx_ai_interactions_type")
  @@map("ai_interactions")
}

// =============================================
// PRODUCT CATALOG MODELS
// =============================================

model Category {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  parentId          String?   @map("parent_id") @db.Uuid
  slug              String    @unique @db.VarChar(255)
  name              String    @db.VarChar(255)
  description       String?   @db.Text
  imageUrl          String?   @map("image_url") @db.VarChar(500)
  
  // SEO
  metaTitle         String?   @map("meta_title") @db.VarChar(255)
  metaDescription   String?   @map("meta_description") @db.Text
  
  // Display
  displayOrder      Int       @default(0) @map("display_order")
  isFeatured        Boolean   @default(false) @map("is_featured")
  isActive          Boolean   @default(true) @map("is_active")
  
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt         DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  
  // Self-relation for hierarchy
  parent            Category? @relation("CategoryHierarchy", fields: [parentId], references: [id], onDelete: Cascade)
  children          Category[] @relation("CategoryHierarchy")
  
  // Relations
  products          Product[]
  
  @@index([parentId], name: "idx_categories_parent")
  @@index([slug], name: "idx_categories_slug")
  @@map("categories")
}

model Brand {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  slug              String    @unique @db.VarChar(255)
  name              String    @db.VarChar(255)
  logoUrl           String?   @map("logo_url") @db.VarChar(500)
  description       String?   @db.Text
  story             String?   @db.Text
  
  // Verification
  isVerified        Boolean   @default(false) @map("is_verified")
  verifiedAt        DateTime? @map("verified_at") @db.Timestamptz
  
  // Sustainability
  sustainabilityScore Int?    @map("sustainability_score")
  certifications    String[]
  
  // Contact
  websiteUrl        String?   @map("website_url") @db.VarChar(500)
  instagramHandle   String?   @map("instagram_handle") @db.VarChar(100)
  
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt         DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  products          Product[]
  
  @@map("brands")
}

model Product {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  sku               String    @unique @db.VarChar(100)
  slug              String    @unique @db.VarChar(255)
  name              String    @db.VarChar(255)
  description       String?   @db.Text
  story             String?   @db.Text
  
  // Categorization
  categoryId        String    @map("category_id") @db.Uuid
  brandId           String?   @map("brand_id") @db.Uuid
  
  // Pricing
  price             Decimal   @db.Decimal(10, 2)
  compareAtPrice    Decimal?  @map("compare_at_price") @db.Decimal(10, 2)
  cost              Decimal?  @db.Decimal(10, 2)
  currency          String    @default("USD") @db.Char(3)
  
  // Status
  status            ProductStatus @default(DRAFT)
  publishedAt       DateTime? @map("published_at") @db.Timestamptz
  featuredAt        DateTime? @map("featured_at") @db.Timestamptz
  
  // AI features
  aiDescription     String?   @map("ai_description") @db.Text
  productEmbedding  Unsupported("vector(1536)")? @map("product_embedding")
  colorAnalysis     Json?     @map("color_analysis") @db.JsonB
  styleTags         String[]  @map("style_tags")
  
  // SEO
  metaTitle         String?   @map("meta_title") @db.VarChar(255)
  metaDescription   String?   @map("meta_description") @db.Text
  
  // Sustainability
  materials         Json?     @db.JsonB
  carbonFootprint   Decimal?  @map("carbon_footprint") @db.Decimal(10, 2)
  recyclable        Boolean   @default(false)
  
  // Metadata
  viewCount         Int       @default(0) @map("view_count")
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt         DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  deletedAt         DateTime? @map("deleted_at") @db.Timestamptz
  
  // Relations
  category          Category  @relation(fields: [categoryId], references: [id])
  brand             Brand?    @relation(fields: [brandId], references: [id])
  variants          ProductVariant[]
  media             ProductMedia[]
  collectionProducts CollectionProduct[]
  cartItems         CartItem[]
  wishlistItems     WishlistItem[]
  orderItems        OrderItem[]
  reviews           Review[]
  productViews      ProductView[]
  
  @@index([status, publishedAt(sort: Desc)], name: "idx_products_status")
  @@index([categoryId], name: "idx_products_category")
  @@index([brandId], name: "idx_products_brand")
  @@index([price], name: "idx_products_price")
  @@index([sku], name: "idx_products_sku")
  @@index([slug], name: "idx_products_slug")
  @@map("products")
}

model ProductVariant {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  productId         String    @map("product_id") @db.Uuid
  sku               String    @unique @db.VarChar(100)
  
  // Variant attributes
  size              String?   @db.VarChar(50)
  color             String?   @db.VarChar(100)
  material          String?   @db.VarChar(100)
  
  // Pricing (can override product price)
  price             Decimal?  @db.Decimal(10, 2)
  compareAtPrice    Decimal?  @map("compare_at_price") @db.Decimal(10, 2)
  
  // Inventory
  inventoryQuantity Int       @default(0) @map("inventory_quantity")
  inventoryReserved Int       @default(0) @map("inventory_reserved")
  lowStockThreshold Int       @default(5) @map("low_stock_threshold")
  
  // Weight and dimensions for shipping
  weightValue       Decimal?  @map("weight_value") @db.Decimal(10, 3)
  weightUnit        String    @default("kg") @map("weight_unit") @db.VarChar(10)
  dimensions        Json?     @db.JsonB
  
  // Status
  isAvailable       Boolean   @default(true) @map("is_available")
  availableAt       DateTime? @map("available_at") @db.Timestamptz
  
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt         DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  product           Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  media             ProductMedia[]
  cartItems         CartItem[]
  wishlistItems     WishlistItem[]
  orderItems        OrderItem[]
  inventoryTransactions InventoryTransaction[]
  
  @@index([productId], name: "idx_variants_product")
  @@index([inventoryQuantity], name: "idx_variants_inventory")
  @@map("product_variants")
}

model ProductMedia {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  productId         String    @map("product_id") @db.Uuid
  variantId         String?   @map("variant_id") @db.Uuid
  
  // Media details
  mediaType         String    @map("media_type") @db.VarChar(20)
  url               String    @db.VarChar(500)
  thumbnailUrl      String?   @map("thumbnail_url") @db.VarChar(500)
  
  // Image specific
  altText           String?   @map("alt_text") @db.VarChar(255)
  width             Int?
  height            Int?
  
  // Video specific
  durationSeconds   Int?      @map("duration_seconds")
  
  // 3D/AR specific
  modelFormat       String?   @map("model_format") @db.VarChar(20)
  fileSizeBytes     BigInt?   @map("file_size_bytes")
  
  // Organization
  displayOrder      Int       @default(0) @map("display_order")
  isPrimary         Boolean   @default(false) @map("is_primary")
  
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  product           Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  variant           ProductVariant? @relation(fields: [variantId], references: [id], onDelete: Cascade)
  
  @@index([productId, displayOrder], name: "idx_media_product")
  @@index([variantId], name: "idx_media_variant")
  @@map("product_media")
}

model Collection {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  slug              String    @unique @db.VarChar(255)
  name              String    @db.VarChar(255)
  description       String?   @db.Text
  
  // Visual design
  heroImageUrl      String?   @map("hero_image_url") @db.VarChar(500)
  heroVideoUrl      String?   @map("hero_video_url") @db.VarChar(500)
  colorTheme        Json?     @map("color_theme") @db.JsonB
  
  // Collection rules
  isManual          Boolean   @default(true) @map("is_manual")
  rules             Json?     @db.JsonB
  
  // Display
  isActive          Boolean   @default(true) @map("is_active")
  displayOrder      Int       @default(0) @map("display_order")
  featuredUntil     DateTime? @map("featured_until") @db.Timestamptz
  
  // SEO
  metaTitle         String?   @map("meta_title") @db.VarChar(255)
  metaDescription   String?   @map("meta_description") @db.Text
  
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt         DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  products          CollectionProduct[]
  
  @@map("collections")
}

model CollectionProduct {
  collectionId      String    @map("collection_id") @db.Uuid
  productId         String    @map("product_id") @db.Uuid
  displayOrder      Int       @default(0) @map("display_order")
  addedAt           DateTime  @default(now()) @map("added_at") @db.Timestamptz
  
  // Relations
  collection        Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)
  product           Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@id([collectionId, productId])
  @@index([collectionId, displayOrder], name: "idx_collection_products")
  @@map("collection_products")
}

// =============================================
// SHOPPING CART & WISHLIST MODELS
// =============================================

model Cart {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId            String?   @map("user_id") @db.Uuid
  sessionId         String?   @map("session_id") @db.Uuid
  
  // Cart state
  isAbandoned       Boolean   @default(false) @map("is_abandoned")
  abandonedAt       DateTime? @map("abandoned_at") @db.Timestamptz
  reminderSentAt    DateTime? @map("reminder_sent_at") @db.Timestamptz
  
  // Pricing snapshot
  currency          String    @default("USD") @db.Char(3)
  subtotal          Decimal   @default(0) @db.Decimal(10, 2)
  taxAmount         Decimal   @default(0) @map("tax_amount") @db.Decimal(10, 2)
  shippingAmount    Decimal   @default(0) @map("shipping_amount") @db.Decimal(10, 2)
  discountAmount    Decimal   @default(0) @map("discount_amount") @db.Decimal(10, 2)
  total             Decimal   @default(0) @db.Decimal(10, 2)
  
  // Applied codes
  couponCode        String?   @map("coupon_code") @db.VarChar(50)
  giftCardCodes     String[]  @map("gift_card_codes")
  
  expiresAt         DateTime  @default(dbgenerated("CURRENT_TIMESTAMP + INTERVAL '30 days'")) @map("expires_at") @db.Timestamptz
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt         DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  user              User?     @relation(fields: [userId], references: [id], onDelete: Cascade)
  session           Session?  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  items             CartItem[]
  
  @@index([userId], name: "idx_carts_user")
  @@index([sessionId], name: "idx_carts_session")
  @@index([isAbandoned, abandonedAt], name: "idx_carts_abandoned")
  @@map("carts")
}

model CartItem {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  cartId            String    @map("cart_id") @db.Uuid
  productId         String    @map("product_id") @db.Uuid
  variantId         String    @map("variant_id") @db.Uuid
  
  quantity          Int       @default(1)
  
  // Price at time of adding (for price protection)
  priceAtTime       Decimal   @map("price_at_time") @db.Decimal(10, 2)
  
  // Personalization
  personalization   Json?     @db.JsonB
  
  // AI recommendations
  addedFrom         String?   @map("added_from") @db.VarChar(50)
  recommendationScore Decimal? @map("recommendation_score") @db.Decimal(3, 2)
  
  addedAt           DateTime  @default(now()) @map("added_at") @db.Timestamptz
  updatedAt         DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  cart              Cart      @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product           Product   @relation(fields: [productId], references: [id])
  variant           ProductVariant @relation(fields: [variantId], references: [id])
  
  @@unique([cartId, variantId], name: "idx_cart_items_unique", map: "idx_cart_items_unique")
  @@index([cartId], name: "idx_cart_items_cart")
  @@map("cart_items")
}

model Wishlist {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId            String    @map("user_id") @db.Uuid
  name              String    @default("My Wishlist") @db.VarChar(255)
  isPublic          Boolean   @default(false) @map("is_public")
  shareToken        String?   @unique @map("share_token") @db.VarChar(100)
  
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt         DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  items             WishlistItem[]
  
  @@index([userId], name: "idx_wishlists_user")
  @@index([shareToken], name: "idx_wishlists_share")
  @@map("wishlists")
}

model WishlistItem {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  wishlistId        String    @map("wishlist_id") @db.Uuid
  productId         String    @map("product_id") @db.Uuid
  variantId         String?   @map("variant_id") @db.Uuid
  
  // Notifications
  notifyPriceDrop   Boolean   @default(true) @map("notify_price_drop")
  notifyBackInStock Boolean   @default(true) @map("notify_back_in_stock")
  
  // Tracking
  priceWhenAdded    Decimal?  @map("price_when_added") @db.Decimal(10, 2)
  notes             String?   @db.Text
  
  addedAt           DateTime  @default(now()) @map("added_at") @db.Timestamptz
  
  // Relations
  wishlist          Wishlist  @relation(fields: [wishlistId], references: [id], onDelete: Cascade)
  product           Product   @relation(fields: [productId], references: [id])
  variant           ProductVariant? @relation(fields: [variantId], references: [id])
  
  @@unique([wishlistId, productId, variantId])
  @@index([wishlistId], name: "idx_wishlist_items")
  @@map("wishlist_items")
}

// =============================================
// ORDER MANAGEMENT MODELS
// =============================================

model Order {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  orderNumber       String    @unique @map("order_number") @db.VarChar(20)
  userId            String    @map("user_id") @db.Uuid
  
  // Status
  status            OrderStatus @default(PENDING)
  paymentStatus     PaymentStatus @default(PENDING) @map("payment_status")
  
  // Customer info snapshot
  customerEmail     String    @map("customer_email") @db.VarChar(255)
  customerPhone     String?   @map("customer_phone") @db.VarChar(50)
  
  // Pricing
  currency          String    @default("USD") @db.Char(3)
  subtotal          Decimal   @db.Decimal(10, 2)
  taxAmount         Decimal   @default(0) @map("tax_amount") @db.Decimal(10, 2)
  shippingAmount    Decimal   @default(0) @map("shipping_amount") @db.Decimal(10, 2)
  discountAmount    Decimal   @default(0) @map("discount_amount") @db.Decimal(10, 2)
  total             Decimal   @db.Decimal(10, 2)
  
  // Shipping
  shippingMethod    String?   @map("shipping_method") @db.VarChar(100)
  shippingCarrier   String?   @map("shipping_carrier") @db.VarChar(100)
  trackingNumber    String?   @map("tracking_number") @db.VarChar(255)
  estimatedDelivery DateTime? @map("estimated_delivery") @db.Date
  deliveredAt       DateTime? @map("delivered_at") @db.Timestamptz
  
  // AI insights
  fraudScore        Decimal?  @map("fraud_score") @db.Decimal(3, 2)
  recommendationInfluence Decimal? @map("recommendation_influence") @db.Decimal(3, 2)
  
  // Metadata
  notes             String?   @db.Text
  adminNotes        String?   @map("admin_notes") @db.Text
  tags              String[]
  
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt         DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  cancelledAt       DateTime? @map("cancelled_at") @db.Timestamptz
  
  // Relations
  user              User      @relation(fields: [userId], references: [id])
  items             OrderItem[]
  statusHistory     OrderStatusHistory[]
  paymentTransactions PaymentTransaction[]
  couponUses        CouponUse[]
  loyaltyPoints     LoyaltyPoint[]
  
  @@index([userId, createdAt(sort: Desc)], name: "idx_orders_user")
  @@index([status, createdAt(sort: Desc)], name: "idx_orders_status")
  @@index([orderNumber], name: "idx_orders_number")
  @@index([createdAt(sort: Desc)], name: "idx_orders_created")
  @@map("orders")
}

model OrderItem {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  orderId           String    @map("order_id") @db.Uuid
  productId         String    @map("product_id") @db.Uuid
  variantId         String    @map("variant_id") @db.Uuid
  
  // Item details at time of order
  productName       String    @map("product_name") @db.VarChar(255)
  variantTitle      String?   @map("variant_title") @db.VarChar(255)
  sku               String    @db.VarChar(100)
  
  // Quantities and pricing
  quantity          Int
  unitPrice         Decimal   @map("unit_price") @db.Decimal(10, 2)
  totalPrice        Decimal   @map("total_price") @db.Decimal(10, 2)
  
  // Personalization
  personalization   Json?     @db.JsonB
  
  // Fulfillment
  fulfilledQuantity Int       @default(0) @map("fulfilled_quantity")
  returnedQuantity  Int       @default(0) @map("returned_quantity")
  refundedQuantity  Int       @default(0) @map("refunded_quantity")
  
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  order             Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product           Product   @relation(fields: [productId], references: [id])
  variant           ProductVariant @relation(fields: [variantId], references: [id])
  reviews           Review[]
  inventoryTransactions InventoryTransaction[]
  
  @@index([orderId], name: "idx_order_items_order")
  @@index([productId], name: "idx_order_items_product")
  @@map("order_items")
}

model OrderStatusHistory {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  orderId           String    @map("order_id") @db.Uuid
  status            OrderStatus
  notes             String?   @db.Text
  createdBy         String?   @map("created_by") @db.Uuid
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  order             Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  @@index([orderId, createdAt(sort: Desc)], name: "idx_order_status_history")
  @@map("order_status_history")
}

// =============================================
// PAYMENT & TRANSACTION MODELS
// =============================================

model PaymentMethod {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId            String    @map("user_id") @db.Uuid
  
  // Payment details
  type              String    @db.VarChar(50)
  provider          String    @db.VarChar(50)
  
  // Card specific (tokenized)
  cardBrand         String?   @map("card_brand") @db.VarChar(50)
  cardLast4         String?   @map("card_last4") @db.VarChar(4)
  cardExpMonth      Int?      @map("card_exp_month")
  cardExpYear       Int?      @map("card_exp_year")
  
  // Billing address
  billingAddressId  String?   @map("billing_address_id") @db.Uuid
  
  // Metadata
  isDefault         Boolean   @default(false) @map("is_default")
  providerCustomerId String?  @map("provider_customer_id") @db.VarChar(255)
  providerPaymentMethodId String? @map("provider_payment_method_id") @db.VarChar(255)
  
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt         DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  billingAddress    Address?  @relation(fields: [billingAddressId], references: [id])
  transactions      PaymentTransaction[]
  
  @@index([userId], name: "idx_payment_methods_user")
  @@map("payment_methods")
}

model PaymentTransaction {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  orderId           String    @map("order_id") @db.Uuid
  paymentMethodId   String?   @map("payment_method_id") @db.Uuid
  
  // Transaction details
  type              String    @db.VarChar(50)
  status            PaymentStatus
  
  // Amounts
  amount            Decimal   @db.Decimal(10, 2)
  currency          String    @default("USD") @db.Char(3)
  
  // Provider details
  provider          String    @db.VarChar(50)
  providerTransactionId String? @unique @map("provider_transaction_id") @db.VarChar(255)
  providerResponse  Json?     @map("provider_response") @db.JsonB
  
  // Metadata
  failureReason     String?   @map("failure_reason") @db.Text
  processedAt       DateTime? @map("processed_at") @db.Timestamptz
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  order             Order     @relation(fields: [orderId], references: [id])
  paymentMethod     PaymentMethod? @relation(fields: [paymentMethodId], references: [id])
  membershipTransactions MembershipTransaction[]
  
  @@index([orderId], name: "idx_payment_transactions_order")
  @@index([providerTransactionId], name: "idx_payment_transactions_provider")
  @@map("payment_transactions")
}

// =============================================
// USER INTERACTION MODELS
// =============================================

model Review {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  productId         String    @map("product_id") @db.Uuid
  userId            String    @map("user_id") @db.Uuid
  orderItemId       String?   @map("order_item_id") @db.Uuid
  
  // Review content
  rating            Int
  title             String?   @db.VarChar(255)
  content           String?   @db.Text
  
  // Review metadata
  isVerifiedPurchase Boolean  @default(false) @map("is_verified_purchase")
  helpfulCount      Int       @default(0) @map("helpful_count")
  notHelpfulCount   Int       @default(0) @map("not_helpful_count")
  
  // AI analysis
  sentimentScore    Decimal?  @map("sentiment_score") @db.Decimal(3, 2)
  qualityScore      Decimal?  @map("quality_score") @db.Decimal(3, 2)
  
  // Status
  status            ReviewStatus @default(PENDING)
  
  // Media
  mediaUrls         String[]  @map("media_urls")
  
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt         DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  product           Product   @relation(fields: [productId], references: [id])
  user              User      @relation(fields: [userId], references: [id])
  orderItem         OrderItem? @relation(fields: [orderItemId], references: [id])
  interactions      ReviewInteraction[]
  
  @@unique([productId, userId])
  @@index([productId, status, rating], name: "idx_reviews_product")
  @@index([userId], name: "idx_reviews_user")
  @@map("reviews")
}

model ReviewInteraction {
  userId            String    @map("user_id") @db.Uuid
  reviewId          String    @map("review_id") @db.Uuid
  isHelpful         Boolean   @map("is_helpful")
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  review            Review    @relation(fields: [reviewId], references: [id], onDelete: Cascade)
  
  @@id([userId, reviewId])
  @@map("review_interactions")
}

model Address {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId            String    @map("user_id") @db.Uuid
  
  // Address details
  type              String    @default("shipping") @db.VarChar(50)
  isDefault         Boolean   @default(false) @map("is_default")
  
  // Contact
  firstName         String    @map("first_name") @db.VarChar(100)
  lastName          String    @map("last_name") @db.VarChar(100)
  company           String?   @db.VarChar(100)
  phone             String?   @db.VarChar(50)
  
  // Address
  addressLine1      String    @map("address_line1") @db.VarChar(255)
  addressLine2      String?   @map("address_line2") @db.VarChar(255)
  city              String    @db.VarChar(100)
  stateProvince     String?   @map("state_province") @db.VarChar(100)
  postalCode        String?   @map("postal_code") @db.VarChar(20)
  countryCode       String    @map("country_code") @db.Char(2)
  
  // Geolocation (for distance calculations)
  coordinates       Unsupported("geography(Point, 4326)")?
  
  // Validation
  isValidated       Boolean   @default(false) @map("is_validated")
  validatedAt       DateTime? @map("validated_at") @db.Timestamptz
  
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt         DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  paymentMethods    PaymentMethod[]
  
  @@index([userId], name: "idx_addresses_user")
  @@map("addresses")
}

// =============================================
// ANALYTICS & TRACKING MODELS
// =============================================

model ProductView {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  productId         String    @map("product_id") @db.Uuid
  userId            String?   @map("user_id") @db.Uuid
  sessionId         String?   @map("session_id") @db.Uuid
  
  // View context
  source            String?   @db.VarChar(50)
  searchQuery       String?   @map("search_query") @db.Text
  recommendationId  String?   @map("recommendation_id") @db.Uuid
  
  // Engagement metrics
  viewDurationSeconds Int?    @map("view_duration_seconds")
  interactions      Json?     @db.JsonB
  
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  product           Product   @relation(fields: [productId], references: [id])
  user              User?     @relation(fields: [userId], references: [id])
  session           Session?  @relation(fields: [sessionId], references: [id])
  
  @@index([productId, createdAt(sort: Desc)], name: "idx_product_views_product")
  @@index([userId, createdAt(sort: Desc)], name: "idx_product_views_user")
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
  
  @@index([userId, createdAt(sort: Desc)], name: "idx_search_logs_user")
  @@map("search_logs")
}

// =============================================
// MARKETING & COMMUNICATIONS MODELS
// =============================================

model Coupon {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  code              String    @unique @db.VarChar(50)
  description       String?   @db.Text
  
  // Discount details
  discountType      String    @map("discount_type") @db.VarChar(20)
  discountValue     Decimal   @map("discount_value") @db.Decimal(10, 2)
  
  // Conditions
  minimumAmount     Decimal?  @map("minimum_amount") @db.Decimal(10, 2)
  applicableProducts String[] @map("applicable_products") @db.Uuid[]
  applicableCategories String[] @map("applicable_categories") @db.Uuid[]
  applicableBrands  String[]  @map("applicable_brands") @db.Uuid[]
  
  // Usage limits
  usageLimit        Int?      @map("usage_limit")
  usageCount        Int       @default(0) @map("usage_count")
  usageLimitPerUser Int?      @map("usage_limit_per_user")
  
  // Validity
  validFrom         DateTime  @default(now()) @map("valid_from") @db.Timestamptz
  validUntil        DateTime? @map("valid_until") @db.Timestamptz
  
  // Restrictions
  firstPurchaseOnly Boolean   @default(false) @map("first_purchase_only")
  membershipTiers   MembershipTier[] @map("membership_tiers")
  
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt         DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  uses              CouponUse[]
  
  @@index([code], name: "idx_coupons_code")
  @@map("coupons")
}

model CouponUse {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  couponId          String    @map("coupon_id") @db.Uuid
  userId            String    @map("user_id") @db.Uuid
  orderId           String    @map("order_id") @db.Uuid
  discountAmount    Decimal   @map("discount_amount") @db.Decimal(10, 2)
  usedAt            DateTime  @default(now()) @map("used_at") @db.Timestamptz
  
  // Relations
  coupon            Coupon    @relation(fields: [couponId], references: [id])
  user              User      @relation(fields: [userId], references: [id])
  order             Order     @relation(fields: [orderId], references: [id])
  
  @@unique([couponId, orderId])
  @@index([userId], name: "idx_coupon_uses_user")
  @@map("coupon_uses")
}

// =============================================
// NOTIFICATIONS & MESSAGING MODELS
// =============================================

model Notification {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId            String    @map("user_id") @db.Uuid
  
  type              NotificationType
  title             String    @db.VarChar(255)
  message           String    @db.Text
  
  // Related entities
  orderId           String?   @map("order_id") @db.Uuid
  productId         String?   @map("product_id") @db.Uuid
  
  // Delivery
  channels          String[]  @default(["{in_app}"])
  
  // Status
  isRead            Boolean   @default(false) @map("is_read")
  readAt            DateTime? @map("read_at") @db.Timestamptz
  
  // Actions
  actionUrl         String?   @map("action_url") @db.VarChar(500)
  actionLabel       String?   @map("action_label") @db.VarChar(100)
  
  expiresAt         DateTime? @map("expires_at") @db.Timestamptz
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId, isRead, createdAt(sort: Desc)], name: "idx_notifications_user")
  @@index([expiresAt], name: "idx_notifications_expires")
  @@map("notifications")
}

// =============================================
// MEMBERSHIP & LOYALTY MODELS
// =============================================

model MembershipTransaction {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId            String    @map("user_id") @db.Uuid
  
  // Transaction details
  type              String    @db.VarChar(50)
  fromTier          MembershipTier? @map("from_tier")
  toTier            MembershipTier @map("to_tier")
  
  // Billing
  amount            Decimal?  @db.Decimal(10, 2)
  currency          String    @default("USD") @db.Char(3)
  paymentTransactionId String? @map("payment_transaction_id") @db.Uuid
  
  // Validity
  startsAt          DateTime  @map("starts_at") @db.Timestamptz
  endsAt            DateTime? @map("ends_at") @db.Timestamptz
  
  // Metadata
  reason            String?   @db.Text
  
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  user              User      @relation(fields: [userId], references: [id])
  paymentTransaction PaymentTransaction? @relation(fields: [paymentTransactionId], references: [id])
  
  @@index([userId, createdAt(sort: Desc)], name: "idx_membership_transactions_user")
  @@map("membership_transactions")
}

model LoyaltyPoint {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId            String    @map("user_id") @db.Uuid
  
  // Transaction details
  type              String    @db.VarChar(50)
  points            Int
  balanceAfter      Int       @map("balance_after")
  
  // Source
  source            String?   @db.VarChar(50)
  orderId           String?   @map("order_id") @db.Uuid
  
  // Expiration
  expiresAt         DateTime? @map("expires_at") @db.Timestamptz
  
  // Metadata
  description       String?   @db.Text
  
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  user              User      @relation(fields: [userId], references: [id])
  order             Order?    @relation(fields: [orderId], references: [id])
  
  @@index([userId, createdAt(sort: Desc)], name: "idx_loyalty_points_user")
  @@index([expiresAt], name: "idx_loyalty_points_expires")
  @@map("loyalty_points")
}

// =============================================
// INVENTORY MANAGEMENT MODELS
// =============================================

model InventoryTransaction {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  variantId         String    @map("variant_id") @db.Uuid
  
  // Transaction details
  type              String    @db.VarChar(50)
  quantity          Int
  balanceAfter      Int       @map("balance_after")
  
  // Reference
  orderItemId       String?   @map("order_item_id") @db.Uuid
  
  // Metadata
  reason            String?   @db.Text
  createdBy         String?   @map("created_by") @db.Uuid
  
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  variant           ProductVariant @relation(fields: [variantId], references: [id])
  orderItem         OrderItem? @relation(fields: [orderItemId], references: [id])
  
  @@index([variantId, createdAt(sort: Desc)], name: "idx_inventory_transactions_variant")
  @@map("inventory_transactions")
}

// =============================================
// ADMIN & SYSTEM MODELS
// =============================================

model AuditLog {
  id                String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  userId            String?   @map("user_id") @db.Uuid
  
  // Action details
  action            String    @db.VarChar(100)
  entityType        String    @map("entity_type") @db.VarChar(50)
  entityId          String    @map("entity_id") @db.Uuid
  
  // Changes
  oldValues         Json?     @map("old_values") @db.JsonB
  newValues         Json?     @map("new_values") @db.JsonB
  
  // Context
  ipAddress         String?   @map("ip_address") @db.Inet
  userAgent         String?   @map("user_agent") @db.Text
  
  createdAt         DateTime  @default(now()) @map("created_at") @db.Timestamptz
  
  // Relations
  user              User?     @relation(fields: [userId], references: [id])
  
  @@index([userId, createdAt(sort: Desc)], name: "idx_audit_logs_user")
  @@index([entityType, entityId, createdAt(sort: Desc)], name: "idx_audit_logs_entity")
  @@index([createdAt(sort: Desc)], name: "idx_audit_logs_date")
  @@map("audit_logs")
}

model SystemSetting {
  key               String    @id @db.VarChar(100)
  value             Json      @db.JsonB
  description       String?   @db.Text
  updatedBy         String?   @map("updated_by") @db.Uuid
  updatedAt         DateTime  @default(now()) @map("updated_at") @db.Timestamptz
  
  @@map("system_settings")
}
```

## 🎯 Key Features of This Schema

### 1. **Complete Type Safety**
- All enums match SQL schema exactly
- Proper field types with constraints
- UUID generation handled by PostgreSQL

### 2. **Advanced Prisma Features**
- Preview features enabled for full-text search and PostgreSQL extensions
- Vector type support for AI embeddings (using `Unsupported` type)
- PostGIS support for geolocation features

### 3. **Optimized Relations**
- Explicit relation definitions with proper cascading
- Self-referential relations (e.g., Category hierarchy)
- Many-to-many relations with explicit join tables

### 4. **Performance Indexes**
- All indexes from SQL schema recreated
- Composite indexes for common query patterns
- Proper sorting directions specified

### 5. **Database Compatibility**
- Field names use snake_case with `@map` directives
- Table names mapped to match SQL schema
- PostgreSQL-specific features preserved

### 6. **AI & Advanced Features**
- Vector embeddings for similarity search
- JSON fields for flexible data storage
- Support for AR/3D model metadata

### 7. **Security & Audit**
- Soft delete support with `deletedAt` fields
- Audit logging for compliance
- Encrypted fields notation in comments

This Prisma schema provides a complete, type-safe foundation for the LuxeVerse platform, supporting all features from the PRD while maintaining excellent developer experience and performance.
