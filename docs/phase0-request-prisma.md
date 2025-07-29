awesome job! please use the same rigorous and meticulous approach to very carefully and systematically review the database schema design in the sql file attached here. use line by line comparison to fully and very deeply understand the database design and structure, then put on your deep-thinking hat to deeply and thoroughly explore the best implementation option to create an accurate and complete `prisma/schema.prisma` file to fully and faithfully represent the original design in the sql form below. please plan very carefully how your will create a complete representation in your carefully implemented `prisma/schema.prisma`. remember to use line by line comparison so as not to miss (omit) any part of the database schema represented by the sql script below.

```sql
-- =============================================
-- LuxeVerse Database Schema for PostgreSQL
-- Version: 1.0
-- Description: Comprehensive schema for luxury e-commerce platform
-- with AI personalization, AR/3D features, and membership system
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "vector"; -- For AI embeddings
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For location-based features

-- =============================================
-- ENUMS AND CUSTOM TYPES
-- =============================================

-- User roles enum
CREATE TYPE user_role AS ENUM (
    'GUEST',
    'CUSTOMER',
    'VIP',
    'ADMIN',
    'SUPER_ADMIN'
);

-- Membership tiers
CREATE TYPE membership_tier AS ENUM (
    'PEARL',      -- Free tier
    'SAPPHIRE',   -- $99/month
    'DIAMOND',    -- $299/month
    'OBSIDIAN'    -- $499/month - Invite only
);

-- Product status
CREATE TYPE product_status AS ENUM (
    'DRAFT',
    'ACTIVE',
    'OUT_OF_STOCK',
    'DISCONTINUED',
    'ARCHIVED'
);

-- Order status
CREATE TYPE order_status AS ENUM (
    'PENDING',
    'PAYMENT_PROCESSING',
    'PAYMENT_FAILED',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED',
    'RETURNED'
);

-- Payment status
CREATE TYPE payment_status AS ENUM (
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED',
    'REFUNDED',
    'PARTIALLY_REFUNDED'
);

-- Review status
CREATE TYPE review_status AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'FLAGGED'
);

-- AI interaction types
CREATE TYPE ai_interaction_type AS ENUM (
    'STYLE_QUIZ',
    'VISUAL_SEARCH',
    'CHAT',
    'RECOMMENDATION',
    'OUTFIT_BUILDER',
    'TREND_ALERT'
);

-- Notification types
CREATE TYPE notification_type AS ENUM (
    'ORDER_UPDATE',
    'PRICE_DROP',
    'BACK_IN_STOCK',
    'EXCLUSIVE_ACCESS',
    'MEMBERSHIP_UPDATE',
    'AI_RECOMMENDATION',
    'SOCIAL_INTERACTION'
);

-- =============================================
-- CORE USER TABLES
-- =============================================

-- Users table - Core user information
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified TIMESTAMP WITH TIME ZONE,
    password_hash VARCHAR(255), -- NULL for OAuth users
    name VARCHAR(255),
    avatar_url VARCHAR(500),
    phone VARCHAR(50),
    phone_verified TIMESTAMP WITH TIME ZONE,
    role user_role DEFAULT 'CUSTOMER' NOT NULL,
    membership_tier membership_tier DEFAULT 'PEARL' NOT NULL,
    membership_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Preferences
    preferred_currency CHAR(3) DEFAULT 'USD',
    preferred_language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    
    -- AI & Personalization
    style_profile_completed BOOLEAN DEFAULT FALSE,
    ai_consent BOOLEAN DEFAULT TRUE,
    personalization_level INTEGER DEFAULT 5 CHECK (personalization_level >= 0 AND personalization_level <= 10),
    
    -- Metadata
    last_login_at TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE, -- Soft delete
    
    -- Indexes
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes for users
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_membership ON users(membership_tier, membership_expires_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- OAuth accounts for social login
CREATE TABLE oauth_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- google, facebook, apple
    provider_account_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    token_type VARCHAR(50),
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(provider, provider_account_id)
);

-- User sessions for auth
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Index for cleanup
    CONSTRAINT session_expiry CHECK (expires_at > created_at)
);

CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);

-- =============================================
-- AI & PERSONALIZATION TABLES
-- =============================================

-- Style profiles for AI personalization
CREATE TABLE style_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Style preferences
    style_personas TEXT[], -- ['minimalist', 'bold', 'classic', 'avant-garde']
    favorite_colors TEXT[], -- ['black', 'navy', 'burgundy']
    avoided_colors TEXT[],
    preferred_brands TEXT[],
    avoided_materials TEXT[], -- ['fur', 'exotic_leather']
    
    -- Size information (encrypted)
    measurements JSONB, -- Encrypted JSON with body measurements
    typical_sizes JSONB, -- {tops: 'M', bottoms: '32', shoes: '10'}
    
    -- Budget preferences
    min_price_preference DECIMAL(10,2),
    max_price_preference DECIMAL(10,2),
    sweet_spot_price DECIMAL(10,2), -- AI-determined optimal price point
    
    -- AI embeddings for similarity matching
    style_embedding vector(1536), -- OpenAI embedding dimension
    color_embedding vector(512),
    brand_embedding vector(512),
    
    -- Behavioral data
    prefers_sustainable BOOLEAN DEFAULT FALSE,
    prefers_exclusive BOOLEAN DEFAULT FALSE,
    early_adopter_score DECIMAL(3,2) DEFAULT 0.5, -- 0-1 score
    luxury_affinity_score DECIMAL(3,2) DEFAULT 0.5, -- 0-1 score
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create vector indexes for AI similarity search
CREATE INDEX idx_style_embedding ON style_profiles USING ivfflat (style_embedding vector_cosine_ops);
CREATE INDEX idx_color_embedding ON style_profiles USING ivfflat (color_embedding vector_cosine_ops);

-- AI interaction history
CREATE TABLE ai_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    interaction_type ai_interaction_type NOT NULL,
    
    -- Interaction data
    input_data JSONB, -- User input (query, image URL, preferences)
    output_data JSONB, -- AI response (recommendations, analysis)
    
    -- Performance metrics
    response_time_ms INTEGER,
    confidence_score DECIMAL(3,2), -- 0-1 confidence in response
    user_satisfaction INTEGER CHECK (user_satisfaction >= 1 AND user_satisfaction <= 5),
    
    -- Metadata
    model_version VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_interactions_user ON ai_interactions(user_id, created_at DESC);
CREATE INDEX idx_ai_interactions_type ON ai_interactions(interaction_type, created_at DESC);

-- =============================================
-- PRODUCT CATALOG TABLES
-- =============================================

-- Categories with hierarchical structure
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    -- Display
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_parent ON categories(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX idx_categories_slug ON categories(slug) WHERE is_active = TRUE;

-- Brands/Designers
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    description TEXT,
    story TEXT, -- Brand storytelling
    
    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Sustainability
    sustainability_score INTEGER CHECK (sustainability_score >= 0 AND sustainability_score <= 100),
    certifications TEXT[],
    
    -- Contact
    website_url VARCHAR(500),
    instagram_handle VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Main products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    story TEXT, -- Product storytelling for luxury feel
    
    -- Categorization
    category_id UUID NOT NULL REFERENCES categories(id),
    brand_id UUID REFERENCES brands(id),
    
    -- Pricing
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    compare_at_price DECIMAL(10,2) CHECK (compare_at_price >= price),
    cost DECIMAL(10,2), -- For margin calculations
    currency CHAR(3) DEFAULT 'USD',
    
    -- Status
    status product_status DEFAULT 'DRAFT' NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    featured_at TIMESTAMP WITH TIME ZONE, -- When product was featured
    
    -- AI features
    ai_description TEXT, -- AI-enhanced description
    product_embedding vector(1536), -- For similarity search
    color_analysis JSONB, -- {primary: '#000000', secondary: '#FFFFFF', accent: '#FF006E'}
    style_tags TEXT[], -- AI-generated style tags
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    -- Sustainability
    materials JSONB, -- [{name: 'Organic Cotton', percentage: 80}, ...]
    carbon_footprint DECIMAL(10,2), -- In kg CO2
    recyclable BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for products
CREATE INDEX idx_products_status ON products(status, published_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_category ON products(category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_brand ON products(brand_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_price ON products(price) WHERE status = 'ACTIVE' AND deleted_at IS NULL;
CREATE INDEX idx_products_sku ON products(sku) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_slug ON products(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_embedding ON products USING ivfflat (product_embedding vector_cosine_ops);

-- Product variants (size, color combinations)
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    
    -- Variant attributes
    size VARCHAR(50),
    color VARCHAR(100),
    material VARCHAR(100),
    
    -- Pricing (can override product price)
    price DECIMAL(10,2),
    compare_at_price DECIMAL(10,2),
    
    -- Inventory
    inventory_quantity INTEGER DEFAULT 0,
    inventory_reserved INTEGER DEFAULT 0, -- Reserved by pending orders
    low_stock_threshold INTEGER DEFAULT 5,
    
    -- Weight and dimensions for shipping
    weight_value DECIMAL(10,3),
    weight_unit VARCHAR(10) DEFAULT 'kg',
    dimensions JSONB, -- {length: 10, width: 5, height: 3, unit: 'cm'}
    
    -- Status
    is_available BOOLEAN DEFAULT TRUE,
    available_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_inventory ON product_variants(inventory_quantity) WHERE is_available = TRUE;

-- Product media (images, videos, 3D models)
CREATE TABLE product_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    
    -- Media details
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'video', '3d_model', 'ar_model')),
    url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    
    -- Image specific
    alt_text VARCHAR(255),
    width INTEGER,
    height INTEGER,
    
    -- Video specific
    duration_seconds INTEGER,
    
    -- 3D/AR specific
    model_format VARCHAR(20), -- 'gltf', 'usdz', 'glb'
    file_size_bytes BIGINT,
    
    -- Organization
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_media_product ON product_media(product_id, display_order);
CREATE INDEX idx_media_variant ON product_media(variant_id) WHERE variant_id IS NOT NULL;

-- Product collections for curated experiences
CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Visual design
    hero_image_url VARCHAR(500),
    hero_video_url VARCHAR(500),
    color_theme JSONB, -- {primary: '#FF006E', secondary: '#00D9FF'}
    
    -- Collection rules
    is_manual BOOLEAN DEFAULT TRUE, -- Manual vs automatic
    rules JSONB, -- For automatic collections: {brand: 'Gucci', min_price: 1000}
    
    -- Display
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    featured_until TIMESTAMP WITH TIME ZONE,
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Many-to-many relationship for products in collections
CREATE TABLE collection_products (
    collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (collection_id, product_id)
);

CREATE INDEX idx_collection_products ON collection_products(collection_id, display_order);

-- =============================================
-- SHOPPING CART & WISHLIST TABLES
-- =============================================

-- Shopping carts (persistent)
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    
    -- Cart state
    is_abandoned BOOLEAN DEFAULT FALSE,
    abandoned_at TIMESTAMP WITH TIME ZONE,
    reminder_sent_at TIMESTAMP WITH TIME ZONE,
    
    -- Pricing snapshot
    currency CHAR(3) DEFAULT 'USD',
    subtotal DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) DEFAULT 0,
    
    -- Applied codes
    coupon_code VARCHAR(50),
    gift_card_codes TEXT[],
    
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT cart_user_or_session CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

CREATE INDEX idx_carts_user ON carts(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_carts_session ON carts(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX idx_carts_abandoned ON carts(is_abandoned, abandoned_at) WHERE is_abandoned = TRUE;

-- Cart items
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    variant_id UUID NOT NULL REFERENCES product_variants(id),
    
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    
    -- Price at time of adding (for price protection)
    price_at_time DECIMAL(10,2) NOT NULL,
    
    -- Personalization
    personalization JSONB, -- {engraving: 'JD', gift_wrap: true, note: 'Happy Birthday'}
    
    -- AI recommendations
    added_from VARCHAR(50), -- 'search', 'recommendation', 'collection', 'ai_stylist'
    recommendation_score DECIMAL(3,2), -- If added from AI recommendation
    
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE UNIQUE INDEX idx_cart_items_unique ON cart_items(cart_id, variant_id) WHERE personalization IS NULL;

-- Wishlists
CREATE TABLE wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) DEFAULT 'My Wishlist',
    is_public BOOLEAN DEFAULT FALSE,
    share_token VARCHAR(100) UNIQUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wishlists_user ON wishlists(user_id);
CREATE INDEX idx_wishlists_share ON wishlists(share_token) WHERE share_token IS NOT NULL;

-- Wishlist items
CREATE TABLE wishlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wishlist_id UUID NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    variant_id UUID REFERENCES product_variants(id),
    
    -- Notifications
    notify_price_drop BOOLEAN DEFAULT TRUE,
    notify_back_in_stock BOOLEAN DEFAULT TRUE,
    
    -- Tracking
    price_when_added DECIMAL(10,2),
    notes TEXT,
    
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(wishlist_id, product_id, variant_id)
);

CREATE INDEX idx_wishlist_items ON wishlist_items(wishlist_id);

-- =============================================
-- ORDER MANAGEMENT TABLES
-- =============================================

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Status
    status order_status DEFAULT 'PENDING' NOT NULL,
    payment_status payment_status DEFAULT 'PENDING' NOT NULL,
    
    -- Customer info snapshot
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    
    -- Pricing
    currency CHAR(3) DEFAULT 'USD',
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    
    -- Shipping
    shipping_method VARCHAR(100),
    shipping_carrier VARCHAR(100),
    tracking_number VARCHAR(255),
    estimated_delivery DATE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    
    -- AI insights
    fraud_score DECIMAL(3,2), -- 0-1, from fraud detection
    recommendation_influence DECIMAL(3,2), -- How much AI influenced this order
    
    -- Metadata
    notes TEXT,
    admin_notes TEXT,
    tags TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_orders_user ON orders(user_id, created_at DESC);
CREATE INDEX idx_orders_status ON orders(status, created_at DESC);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Order items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    variant_id UUID NOT NULL REFERENCES product_variants(id),
    
    -- Item details at time of order
    product_name VARCHAR(255) NOT NULL,
    variant_title VARCHAR(255),
    sku VARCHAR(100) NOT NULL,
    
    -- Quantities and pricing
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    
    -- Personalization
    personalization JSONB,
    
    -- Fulfillment
    fulfilled_quantity INTEGER DEFAULT 0,
    returned_quantity INTEGER DEFAULT 0,
    refunded_quantity INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Order status history
CREATE TABLE order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status order_status NOT NULL,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_status_history ON order_status_history(order_id, created_at DESC);

-- =============================================
-- PAYMENT & TRANSACTION TABLES
-- =============================================

-- Payment methods
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Payment details
    type VARCHAR(50) NOT NULL, -- 'card', 'paypal', 'apple_pay', 'crypto'
    provider VARCHAR(50) NOT NULL, -- 'stripe', 'paypal', 'coinbase'
    
    -- Card specific (tokenized)
    card_brand VARCHAR(50),
    card_last4 VARCHAR(4),
    card_exp_month INTEGER,
    card_exp_year INTEGER,
    
    -- Billing address
    billing_address_id UUID REFERENCES addresses(id),
    
    -- Metadata
    is_default BOOLEAN DEFAULT FALSE,
    provider_customer_id VARCHAR(255), -- Stripe customer ID, etc.
    provider_payment_method_id VARCHAR(255), -- Stripe payment method ID
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payment_methods_user ON payment_methods(user_id);

-- Payment transactions
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id),
    payment_method_id UUID REFERENCES payment_methods(id),
    
    -- Transaction details
    type VARCHAR(50) NOT NULL, -- 'charge', 'refund', 'partial_refund'
    status payment_status NOT NULL,
    
    -- Amounts
    amount DECIMAL(10,2) NOT NULL,
    currency CHAR(3) DEFAULT 'USD',
    
    -- Provider details
    provider VARCHAR(50) NOT NULL,
    provider_transaction_id VARCHAR(255) UNIQUE,
    provider_response JSONB, -- Full response from provider
    
    -- Metadata
    failure_reason TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payment_transactions_order ON payment_transactions(order_id);
CREATE INDEX idx_payment_transactions_provider ON payment_transactions(provider_transaction_id);

-- =============================================
-- USER INTERACTION TABLES
-- =============================================

-- Product reviews
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id),
    user_id UUID NOT NULL REFERENCES users(id),
    order_item_id UUID REFERENCES order_items(id),
    
    -- Review content
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    content TEXT,
    
    -- Review metadata
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    not_helpful_count INTEGER DEFAULT 0,
    
    -- AI analysis
    sentiment_score DECIMAL(3,2), -- -1 to 1
    quality_score DECIMAL(3,2), -- 0 to 1, review quality
    
    -- Status
    status review_status DEFAULT 'PENDING',
    
    -- Media
    media_urls TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(product_id, user_id)
);

CREATE INDEX idx_reviews_product ON reviews(product_id, status, rating DESC);
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- Review interactions
CREATE TABLE review_interactions (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    is_helpful BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (user_id, review_id)
);

-- User addresses
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Address details
    type VARCHAR(50) DEFAULT 'shipping', -- 'shipping', 'billing'
    is_default BOOLEAN DEFAULT FALSE,
    
    -- Contact
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company VARCHAR(100),
    phone VARCHAR(50),
    
    -- Address
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country_code CHAR(2) NOT NULL,
    
    -- Geolocation (for distance calculations)
    coordinates GEOGRAPHY(POINT, 4326),
    
    -- Validation
    is_validated BOOLEAN DEFAULT FALSE,
    validated_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_addresses_user ON addresses(user_id);
CREATE INDEX idx_addresses_geo ON addresses USING GIST(coordinates);

-- =============================================
-- ANALYTICS & TRACKING TABLES
-- =============================================

-- Product views
CREATE TABLE product_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id),
    user_id UUID REFERENCES users(id),
    session_id UUID REFERENCES sessions(id),
    
    -- View context
    source VARCHAR(50), -- 'search', 'category', 'recommendation', 'direct'
    search_query TEXT,
    recommendation_id UUID,
    
    -- Engagement metrics
    view_duration_seconds INTEGER,
    interactions JSONB, -- {zoomed: true, viewed_3d: false, played_video: true}
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_views_product ON product_views(product_id, created_at DESC);
CREATE INDEX idx_product_views_user ON product_views(user_id, created_at DESC) WHERE user_id IS NOT NULL;
CREATE INDEX idx_product_views_date ON product_views(created_at DESC);

-- Search logs for improving search
CREATE TABLE search_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    session_id UUID REFERENCES sessions(id),
    
    query TEXT NOT NULL,
    filters JSONB, -- Applied filters
    results_count INTEGER,
    clicked_position INTEGER, -- Which result was clicked (if any)
    clicked_product_id UUID REFERENCES products(id),
    
    -- Search performance
    response_time_ms INTEGER,
    search_method VARCHAR(50), -- 'text', 'visual', 'voice'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_search_logs_query ON search_logs USING gin(to_tsvector('english', query));
CREATE INDEX idx_search_logs_user ON search_logs(user_id, created_at DESC) WHERE user_id IS NOT NULL;

-- =============================================
-- MARKETING & COMMUNICATIONS TABLES
-- =============================================

-- Email campaigns
CREATE TABLE email_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    
    -- Campaign type
    type VARCHAR(50) NOT NULL, -- 'promotional', 'transactional', 'newsletter'
    
    -- Content
    html_content TEXT,
    text_content TEXT,
    
    -- Targeting
    target_segment JSONB, -- {tier: 'SAPPHIRE', min_purchases: 5}
    
    -- Status
    status VARCHAR(50) DEFAULT 'DRAFT', -- 'DRAFT', 'SCHEDULED', 'SENT'
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    
    -- Metrics
    sent_count INTEGER DEFAULT 0,
    open_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    revenue_generated DECIMAL(10,2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Coupons and discounts
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    
    -- Discount details
    discount_type VARCHAR(20) NOT NULL, -- 'percentage', 'fixed_amount', 'free_shipping'
    discount_value DECIMAL(10,2) NOT NULL,
    
    -- Conditions
    minimum_amount DECIMAL(10,2),
    applicable_products UUID[], -- Product IDs
    applicable_categories UUID[], -- Category IDs
    applicable_brands UUID[], -- Brand IDs
    
    -- Usage limits
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    usage_limit_per_user INTEGER,
    
    -- Validity
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP WITH TIME ZONE,
    
    -- Restrictions
    first_purchase_only BOOLEAN DEFAULT FALSE,
    membership_tiers membership_tier[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_coupons_code ON coupons(code) WHERE valid_until > CURRENT_TIMESTAMP OR valid_until IS NULL;

-- Coupon usage tracking
CREATE TABLE coupon_uses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coupon_id UUID NOT NULL REFERENCES coupons(id),
    user_id UUID NOT NULL REFERENCES users(id),
    order_id UUID NOT NULL REFERENCES orders(id),
    discount_amount DECIMAL(10,2) NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(coupon_id, order_id)
);

CREATE INDEX idx_coupon_uses_user ON coupon_uses(user_id);

-- =============================================
-- NOTIFICATIONS & MESSAGING TABLES
-- =============================================

-- User notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Related entities
    order_id UUID REFERENCES orders(id),
    product_id UUID REFERENCES products(id),
    
    -- Delivery
    channels TEXT[] DEFAULT '{in_app}', -- 'in_app', 'email', 'push', 'sms'
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Actions
    action_url VARCHAR(500),
    action_label VARCHAR(100),
    
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_notifications_expires ON notifications(expires_at) WHERE expires_at IS NOT NULL;

-- =============================================
-- MEMBERSHIP & LOYALTY TABLES
-- =============================================

-- Membership transactions
CREATE TABLE membership_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Transaction details
    type VARCHAR(50) NOT NULL, -- 'upgrade', 'downgrade', 'renewal', 'cancellation'
    from_tier membership_tier,
    to_tier membership_tier NOT NULL,
    
    -- Billing
    amount DECIMAL(10,2),
    currency CHAR(3) DEFAULT 'USD',
    payment_transaction_id UUID REFERENCES payment_transactions(id),
    
    -- Validity
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ends_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_membership_transactions_user ON membership_transactions(user_id, created_at DESC);

-- Loyalty points
CREATE TABLE loyalty_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Transaction details
    type VARCHAR(50) NOT NULL, -- 'earned', 'redeemed', 'expired', 'bonus'
    points INTEGER NOT NULL, -- Positive for earned, negative for redeemed
    balance_after INTEGER NOT NULL,
    
    -- Source
    source VARCHAR(50), -- 'purchase', 'review', 'referral', 'bonus'
    order_id UUID REFERENCES orders(id),
    
    -- Expiration
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    description TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_loyalty_points_user ON loyalty_points(user_id, created_at DESC);
CREATE INDEX idx_loyalty_points_expires ON loyalty_points(expires_at) WHERE expires_at IS NOT NULL AND points > 0;

-- =============================================
-- INVENTORY MANAGEMENT TABLES
-- =============================================

-- Inventory transactions
CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_id UUID NOT NULL REFERENCES product_variants(id),
    
    -- Transaction details
    type VARCHAR(50) NOT NULL, -- 'adjustment', 'sale', 'return', 'restock'
    quantity INTEGER NOT NULL, -- Positive for increase, negative for decrease
    balance_after INTEGER NOT NULL,
    
    -- Reference
    order_item_id UUID REFERENCES order_items(id),
    
    -- Metadata
    reason TEXT,
    created_by UUID REFERENCES users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventory_transactions_variant ON inventory_transactions(variant_id, created_at DESC);

-- =============================================
-- ADMIN & SYSTEM TABLES
-- =============================================

-- Audit log for compliance
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    
    -- Action details
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    
    -- Changes
    old_values JSONB,
    new_values JSONB,
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id, created_at DESC);
CREATE INDEX idx_audit_logs_date ON audit_logs(created_at DESC);

-- System settings
CREATE TABLE system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update product view count
CREATE OR REPLACE FUNCTION increment_product_view_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products 
    SET view_count = view_count + 1 
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER increment_view_count AFTER INSERT ON product_views
    FOR EACH ROW EXECUTE FUNCTION increment_product_view_count();

-- Function to update cart totals
CREATE OR REPLACE FUNCTION update_cart_totals()
RETURNS TRIGGER AS $$
DECLARE
    cart_subtotal DECIMAL(10,2);
BEGIN
    -- Calculate new subtotal
    SELECT COALESCE(SUM(quantity * price_at_time), 0)
    INTO cart_subtotal
    FROM cart_items
    WHERE cart_id = COALESCE(NEW.cart_id, OLD.cart_id);
    
    -- Update cart
    UPDATE carts
    SET 
        subtotal = cart_subtotal,
        total = cart_subtotal + tax_amount + shipping_amount - discount_amount,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = COALESCE(NEW.cart_id, OLD.cart_id);
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cart_on_item_change
AFTER INSERT OR UPDATE OR DELETE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_cart_totals();

-- Function to check inventory before order
CREATE OR REPLACE FUNCTION check_inventory_availability()
RETURNS TRIGGER AS $$
DECLARE
    available_qty INTEGER;
BEGIN
    SELECT inventory_quantity - inventory_reserved
    INTO available_qty
    FROM product_variants
    WHERE id = NEW.variant_id;
    
    IF available_qty < NEW.quantity THEN
        RAISE EXCEPTION 'Insufficient inventory for variant %', NEW.variant_id;
    END IF;
    
    -- Reserve inventory
    UPDATE product_variants
    SET inventory_reserved = inventory_reserved + NEW.quantity
    WHERE id = NEW.variant_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER check_inventory_before_order
BEFORE INSERT ON order_items
    FOR EACH ROW EXECUTE FUNCTION check_inventory_availability();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    last_number INTEGER;
    new_number VARCHAR(20);
BEGIN
    -- Get the last order number for today
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 10) AS INTEGER)), 0)
    INTO last_number
    FROM orders
    WHERE DATE(created_at) = CURRENT_DATE
    AND order_number LIKE 'LX' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '%';
    
    -- Generate new number: LX20240724001
    new_number := 'LX' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || LPAD((last_number + 1)::TEXT, 3, '0');
    
    NEW.order_number := new_number;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_order_number_trigger
BEFORE INSERT ON orders
    FOR EACH ROW 
    WHEN (NEW.order_number IS NULL)
    EXECUTE FUNCTION generate_order_number();

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Full text search indexes
CREATE INDEX idx_products_search ON products USING gin(
    to_tsvector('english', 
        COALESCE(name, '') || ' ' || 
        COALESCE(description, '') || ' ' || 
        COALESCE(array_to_string(style_tags, ' '), '')
    )
);

CREATE INDEX idx_brands_search ON brands USING gin(
    to_tsvector('english', name || ' ' || COALESCE(description, ''))
);

-- Composite indexes for common queries
CREATE INDEX idx_orders_user_status ON orders(user_id, status, created_at DESC);
CREATE INDEX idx_products_featured ON products(featured_at DESC) WHERE featured_at IS NOT NULL AND status = 'ACTIVE';
CREATE INDEX idx_cart_items_product_variant ON cart_items(product_id, variant_id);

-- =============================================
-- INITIAL DATA / SEED DATA
-- =============================================

-- Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
    ('site_name', '"LuxeVerse"', 'Site name'),
    ('currency', '"USD"', 'Default currency'),
    ('tax_rate', '0.08', 'Default tax rate'),
    ('free_shipping_threshold', '100', 'Free shipping minimum'),
    ('ai_recommendations_enabled', 'true', 'Enable AI recommendations'),
    ('ar_enabled', 'true', 'Enable AR features'),
    ('loyalty_points_per_dollar', '10', 'Points earned per dollar spent');

-- Insert membership tier benefits (as JSON in settings)
INSERT INTO system_settings (key, value, description) VALUES
    ('membership_benefits', '{
        "PEARL": {
            "name": "Pearl",
            "price": 0,
            "benefits": ["Free shipping", "Birthday rewards", "Early sale access"]
        },
        "SAPPHIRE": {
            "name": "Sapphire",
            "price": 99,
            "benefits": ["15% rewards", "Personal shopper", "VIP support", "Exclusive events"]
        },
        "DIAMOND": {
            "name": "Diamond",
            "price": 299,
            "benefits": ["20% rewards", "Concierge service", "Private sales", "Free returns"]
        },
        "OBSIDIAN": {
            "name": "Obsidian",
            "price": 499,
            "benefits": ["25% rewards", "White glove service", "First access", "Investment advisory"]
        }
    }', 'Membership tier configuration');

-- Create materialized view for product recommendations
CREATE MATERIALIZED VIEW product_recommendations AS
SELECT 
    p1.id as product_id,
    p2.id as recommended_product_id,
    p1.product_embedding <=> p2.product_embedding as similarity_score
FROM products p1
CROSS JOIN products p2
WHERE p1.id != p2.id
    AND p1.status = 'ACTIVE'
    AND p2.status = 'ACTIVE'
    AND p1.product_embedding IS NOT NULL
    AND p2.product_embedding IS NOT NULL
ORDER BY p1.id, similarity_score
LIMIT 10;

CREATE INDEX idx_product_recommendations ON product_recommendations(product_id, similarity_score);

-- =============================================
-- PERMISSIONS (Example for multi-tenant setup)
-- =============================================

-- Create roles
CREATE ROLE luxeverse_app;
CREATE ROLE luxeverse_admin;
CREATE ROLE luxeverse_readonly;

-- Grant permissions
GRANT CONNECT ON DATABASE luxeverse TO luxeverse_app, luxeverse_admin, luxeverse_readonly;
GRANT USAGE ON SCHEMA public TO luxeverse_app, luxeverse_admin, luxeverse_readonly;

-- App permissions (read/write for app operations)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO luxeverse_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO luxeverse_app;

-- Admin permissions (full access)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO luxeverse_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO luxeverse_admin;

-- Read-only permissions
GRANT SELECT ON ALL TABLES IN SCHEMA public TO luxeverse_readonly;

-- =============================================
-- MAINTENANCE QUERIES
-- =============================================

-- Query to clean up expired sessions
-- Run daily via cron job
/*
DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP;
*/

-- Query to identify abandoned carts
-- Run hourly
/*
UPDATE carts 
SET is_abandoned = TRUE, abandoned_at = CURRENT_TIMESTAMP
WHERE updated_at < CURRENT_TIMESTAMP - INTERVAL '3 hours'
    AND is_abandoned = FALSE
    AND user_id IS NOT NULL;
*/

-- Query to expire unused loyalty points
-- Run monthly
/*
UPDATE loyalty_points
SET type = 'expired', points = -points, balance_after = 0
WHERE expires_at < CURRENT_TIMESTAMP
    AND type = 'earned'
    AND points > 0;
*/
```
