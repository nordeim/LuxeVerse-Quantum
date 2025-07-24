```markdown
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

```markdown
# 🚀 LuxeVerse - Comprehensive Execution Plan

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Development Prerequisites](#development-prerequisites)
3. [Project Structure](#project-structure)
4. [Phase 1: Foundation & Infrastructure](#phase-1-foundation--infrastructure)
5. [Phase 2: Authentication & User Management](#phase-2-authentication--user-management)
6. [Phase 3: Product Catalog & Display](#phase-3-product-catalog--display)
7. [Phase 4: Shopping Cart & Checkout](#phase-4-shopping-cart--checkout)
8. [Phase 5: User Dashboard & Orders](#phase-5-user-dashboard--orders)
9. [Phase 6: AI & Advanced Features](#phase-6-ai--advanced-features)
10. [Phase 7: Performance & Testing](#phase-7-performance--testing)
11. [Phase 8: Deployment & Launch](#phase-8-deployment--launch)

---

## 🎯 Project Overview

### Technology Stack Reminder
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5.5
- **Styling**: Tailwind CSS + Shadcn/UI
- **Database**: PostgreSQL with Prisma ORM
- **API**: tRPC for type-safe APIs
- **Authentication**: NextAuth.js
- **State Management**: Zustand + TanStack Query
- **Payments**: Stripe
- **Testing**: Vitest + Playwright

### Success Metrics
- Type coverage: 100%
- Test coverage: >90%
- Lighthouse score: >90
- Build time: <2 minutes
- TTFB: <200ms

---

## 🛠️ Development Prerequisites

### Required Tools
```bash
# Check versions
node --version  # Should be 20.x or higher
pnpm --version  # Should be 9.x or higher
git --version   # Should be 2.x or higher

# Install pnpm if needed
npm install -g pnpm

# Install development tools
pnpm add -g vercel prisma
```

### Environment Setup
```bash
# Clone repository (if exists) or create new
mkdir luxeverse && cd luxeverse

# Initialize project
pnpm init

# Copy environment template
cp .env.example .env.local
```

---

## 📁 Project Structure

```
luxeverse/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/             # React components
│   ├── server/                 # Backend logic
│   ├── lib/                    # Utilities
│   ├── hooks/                  # Custom React hooks
│   ├── store/                  # Zustand stores
│   ├── styles/                 # Global styles
│   └── types/                  # TypeScript types
├── prisma/                     # Database schema
├── public/                     # Static assets
├── tests/                      # Test files
└── [config files]              # Various configs
```

---

## Phase 1: Foundation & Infrastructure

### 🎯 Goals
- Set up Next.js project with TypeScript
- Configure development environment
- Establish database connection
- Set up basic routing structure
- Configure styling system

### 📅 Duration: 3 days

### 📋 Files to Create

#### 1.1 `/package.json`
**Purpose**: Define project dependencies and scripts

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
    "next": "14.2.5",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "@prisma/client": "5.16.1",
    "prisma": "5.16.1"
  },
  "devDependencies": {
    "@types/node": "20.14.0",
    "@types/react": "18.3.3",
    "typescript": "5.5.3"
  }
}
```

**Checklist**:
- [ ] Create package.json with all dependencies
- [ ] Run `pnpm install`
- [ ] Verify all packages installed correctly
- [ ] Test each script command

---

#### 1.2 `/tsconfig.json`
**Purpose**: TypeScript configuration for strict type checking

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

**Checklist**:
- [ ] Enable strict mode
- [ ] Configure path aliases
- [ ] Set appropriate target
- [ ] Test TypeScript compilation

---

#### 1.3 `/next.config.mjs`
**Purpose**: Next.js configuration for optimization and features

```javascript
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

**Checklist**:
- [ ] Configure image domains
- [ ] Set up security headers
- [ ] Enable strict mode
- [ ] Configure external packages

---

#### 1.4 `/.env.local`
**Purpose**: Environment variables for local development

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/luxeverse"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Stripe
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""

# Email
EMAIL_SERVER_HOST="smtp.resend.com"
EMAIL_SERVER_PORT="465"
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_FROM="noreply@luxeverse.ai"

# OpenAI
OPENAI_API_KEY=""

# Algolia
NEXT_PUBLIC_ALGOLIA_APP_ID=""
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=""
ALGOLIA_ADMIN_KEY=""
```

**Checklist**:
- [ ] Create .env.local file
- [ ] Add to .gitignore
- [ ] Set up local PostgreSQL
- [ ] Generate NEXTAUTH_SECRET
- [ ] Document required env vars

---

#### 1.5 `/prisma/schema.prisma`
**Purpose**: Database schema definition

```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["fullTextSearch"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  name          String?
  image         String?
  password      String?
  role          Role      @default(CUSTOMER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  orders        Order[]
  cart          Cart?
  addresses     Address[]
  reviews       Review[]
  wishlist      Wishlist?

  @@index([email])
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

enum Role {
  CUSTOMER
  ADMIN
}

model Product {
  id              String   @id @default(cuid())
  name            String
  slug            String   @unique
  description     String   @db.Text
  price           Decimal  @db.Decimal(10, 2)
  images          String[]
  sku             String   @unique
  inventory       Int      @default(0)
  categoryId      String
  status          ProductStatus @default(DRAFT)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  category        Category @relation(fields: [categoryId], references: [id])
  orderItems      OrderItem[]
  cartItems       CartItem[]
  reviews         Review[]
  wishlistItems   WishlistItem[]

  @@index([slug])
  @@index([categoryId])
  @@index([status])
}

model Category {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  image       String?
  parentId    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  parent      Category?  @relation("CategoryToCategory", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryToCategory")
  products    Product[]

  @@index([slug])
  @@index([parentId])
}

enum ProductStatus {
  DRAFT
  ACTIVE
  ARCHIVED
}
```

**Checklist**:
- [ ] Define all core models
- [ ] Set up relationships
- [ ] Add appropriate indexes
- [ ] Run `pnpm db:push`
- [ ] Verify schema in database

---

#### 1.6 `/src/lib/prisma.ts`
**Purpose**: Prisma client singleton for database connections

**Dependencies**: `@prisma/client`

**Exports**: 
- `prisma`: PrismaClient instance

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**Checklist**:
- [ ] Create singleton instance
- [ ] Configure logging
- [ ] Prevent multiple instances
- [ ] Export for use in app

---

#### 1.7 `/tailwind.config.ts`
**Purpose**: Tailwind CSS configuration with custom theme

```typescript
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

**Checklist**:
- [ ] Configure color system
- [ ] Set up responsive breakpoints
- [ ] Add custom animations
- [ ] Install required plugins

---

#### 1.8 `/src/styles/globals.css`
**Purpose**: Global styles and CSS variables

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

**Checklist**:
- [ ] Import Tailwind layers
- [ ] Define CSS variables
- [ ] Set up dark mode variables
- [ ] Add utility classes

---

#### 1.9 `/src/app/layout.tsx`
**Purpose**: Root layout with providers and global configuration

**Dependencies**: React, Next.js, Tailwind

**Exports**: Default root layout component

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'LuxeVerse - Luxury E-Commerce Experience',
  description: 'Experience the future of luxury shopping with AI-powered personalization',
  keywords: 'luxury, fashion, e-commerce, AI, personalization',
  authors: [{ name: 'LuxeVerse' }],
  openGraph: {
    title: 'LuxeVerse - Luxury E-Commerce Experience',
    description: 'Experience the future of luxury shopping',
    url: 'https://luxeverse.ai',
    siteName: 'LuxeVerse',
    images: [
      {
        url: 'https://luxeverse.ai/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

**Checklist**:
- [ ] Set up metadata
- [ ] Configure fonts
- [ ] Import global styles
- [ ] Add providers placeholder
- [ ] Set HTML attributes

---

#### 1.10 `/src/app/page.tsx`
**Purpose**: Homepage placeholder

```typescript
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Welcome to LuxeVerse</h1>
      <p className="mt-4 text-muted-foreground">
        The future of luxury e-commerce is being built...
      </p>
    </div>
  )
}
```

**Checklist**:
- [ ] Create basic structure
- [ ] Apply styling classes
- [ ] Ensure it renders
- [ ] Test responsive design

---

### Phase 1 Completion Checklist
- [ ] Project initialized with Next.js 14
- [ ] TypeScript configured with strict mode
- [ ] Database schema created and migrated
- [ ] Tailwind CSS configured with custom theme
- [ ] Basic routing structure in place
- [ ] Environment variables configured
- [ ] Development server running successfully
- [ ] No TypeScript errors
- [ ] Git repository initialized with .gitignore

---

## Phase 2: Authentication & User Management

### 🎯 Goals
- Implement NextAuth.js authentication
- Create login/register pages
- Set up user session management
- Implement protected routes
- Add user profile functionality

### 📅 Duration: 3 days

### 📋 Files to Create

#### 2.1 `/src/lib/auth.ts`
**Purpose**: NextAuth configuration with providers

**Dependencies**: `next-auth`, `@auth/prisma-adapter`, `bcryptjs`

**Exports**: 
- `authOptions`: NextAuth configuration
- `getServerAuthSession`: Server-side auth helper

```typescript
import { NextAuthOptions, getServerSession } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
}

export const getServerAuthSession = () => getServerSession(authOptions)
```

**Checklist**:
- [ ] Configure OAuth providers
- [ ] Set up credentials provider
- [ ] Configure JWT strategy
- [ ] Add callbacks for user data
- [ ] Set custom pages
- [ ] Test authentication flow

---

#### 2.2 `/src/app/api/auth/[...nextauth]/route.ts`
**Purpose**: NextAuth API route handler

**Dependencies**: `next-auth`, auth configuration

```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

**Checklist**:
- [ ] Create API route
- [ ] Export GET and POST handlers
- [ ] Test OAuth redirect
- [ ] Verify session creation

---

#### 2.3 `/src/middleware.ts`
**Purpose**: Protect routes and handle authentication redirects

**Dependencies**: `next-auth`, Next.js middleware

**Exports**: Default middleware function and config

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
                    request.nextUrl.pathname.startsWith('/register')

  // Redirect authenticated users away from auth pages
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/account', request.url))
  }

  // Protect account routes
  if (request.nextUrl.pathname.startsWith('/account') && !token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/account/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
}
```

**Checklist**:
- [ ] Configure protected routes
- [ ] Handle auth page redirects
- [ ] Implement role-based access
- [ ] Add callback URL handling
- [ ] Test middleware behavior

---

#### 2.4 `/src/components/providers/auth-provider.tsx`
**Purpose**: Client-side authentication provider

**Dependencies**: `next-auth/react`

**Exports**: AuthProvider component

```typescript
'use client'

import { SessionProvider } from 'next-auth/react'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider refetchInterval={5 * 60}>
      {children}
    </SessionProvider>
  )
}
```

**Checklist**:
- [ ] Create session provider wrapper
- [ ] Configure refetch interval
- [ ] Add to root layout
- [ ] Test session persistence

---

#### 2.5 `/src/app/(auth)/login/page.tsx`
**Purpose**: Login page with credentials and OAuth

**Dependencies**: React, NextAuth, UI components

```typescript
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import { toast } from '@/components/ui/use-toast'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/account'
  
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: 'Error',
          description: 'Invalid email or password',
          variant: 'destructive',
        })
      } else {
        router.push(callbackUrl)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = (provider: string) => {
    setIsLoading(true)
    signIn(provider, { callbackUrl })
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleOAuthSignIn('google')}
            disabled={isLoading}
          >
            <Icons.google className="mr-2 h-4 w-4" />
            Google
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
```

**Checklist**:
- [ ] Create form structure
- [ ] Add validation
- [ ] Implement credentials sign in
- [ ] Add OAuth buttons
- [ ] Handle errors gracefully
- [ ] Add loading states
- [ ] Style with Tailwind/Shadcn

---

#### 2.6 `/src/app/(auth)/register/page.tsx`
**Purpose**: Registration page for new users

**Dependencies**: React, API routes, UI components

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import { toast } from '@/components/ui/use-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      toast({
        title: 'Success',
        description: 'Account created successfully',
      })
      
      router.push('/login')
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Registration failed',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your details to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading}
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
```

**Checklist**:
- [ ] Create registration form
- [ ] Add password confirmation
- [ ] Validate form inputs
- [ ] Call registration API
- [ ] Handle success/error states
- [ ] Redirect to login

---

#### 2.7 `/src/app/api/auth/register/route.ts`
**Purpose**: API endpoint for user registration

**Dependencies**: Prisma, bcryptjs

```typescript
import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = registerSchema.parse(body)

    // Check if user exists
    const exists = await prisma.user.findUnique({
      where: { email },
    })

    if (exists) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**Checklist**:
- [ ] Validate input with Zod
- [ ] Check for existing user
- [ ] Hash password securely
- [ ] Create user in database
- [ ] Return appropriate response
- [ ] Handle errors properly

---

#### 2.8 `/src/hooks/use-session.ts`
**Purpose**: Custom hook for session management

**Dependencies**: next-auth/react

**Exports**: useSession hook with typed data

```typescript
import { useSession as useNextAuthSession } from 'next-auth/react'

export function useSession() {
  const session = useNextAuthSession()
  
  return {
    ...session,
    user: session.data?.user,
    isLoading: session.status === 'loading',
    isAuthenticated: session.status === 'authenticated',
  }
}
```

**Checklist**:
- [ ] Wrap NextAuth hook
- [ ] Add convenience properties
- [ ] Export typed interface
- [ ] Document usage

---

### Phase 2 Completion Checklist
- [ ] NextAuth configured with providers
- [ ] Login page functional
- [ ] Registration page functional
- [ ] Protected routes working
- [ ] Session management implemented
- [ ] OAuth providers tested
- [ ] Password hashing secure
- [ ] Error handling complete
- [ ] Loading states implemented

---

## Phase 3: Product Catalog & Display

### 🎯 Goals
- Create product listing page
- Implement product detail pages
- Add category filtering
- Set up product search
- Create product components

### 📅 Duration: 4 days

### 📋 Files to Create

#### 3.1 `/src/server/api/root.ts`
**Purpose**: tRPC router configuration

**Dependencies**: tRPC, routers

**Exports**: appRouter and type definitions

```typescript
import { createTRPCRouter } from '@/server/api/trpc'
import { productRouter } from '@/server/api/routers/product'
import { categoryRouter } from '@/server/api/routers/category'
import { userRouter } from '@/server/api/routers/user'

export const appRouter = createTRPCRouter({
  product: productRouter,
  category: categoryRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter
```

**Checklist**:
- [ ] Create root router
- [ ] Add sub-routers
- [ ] Export type definition
- [ ] Configure in app

---

#### 3.2 `/src/server/api/trpc.ts`
**Purpose**: tRPC initialization and context

**Dependencies**: tRPC, Prisma, NextAuth

**Exports**: Router creation functions and procedures

```typescript
import { initTRPC, TRPCError } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { getServerAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import superjson from 'superjson'
import { ZodError } from 'zod'

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts
  const session = await getServerAuthSession()

  return {
    session,
    prisma,
    req,
    res,
  }
}

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

export const createTRPCRouter = t.router

export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

export const adminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || ctx.session.user.role !== 'ADMIN') {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})
```

**Checklist**:
- [ ] Create context function
- [ ] Initialize tRPC
- [ ] Configure transformer
- [ ] Create procedure types
- [ ] Add auth middleware
- [ ] Export utilities

---

#### 3.3 `/src/server/api/routers/product.ts`
**Purpose**: Product-related API endpoints

**Dependencies**: tRPC, Prisma, Zod

**Exports**: productRouter with CRUD operations

```typescript
import { z } from 'zod'
import { createTRPCRouter, publicProcedure, adminProcedure } from '@/server/api/trpc'
import { TRPCError } from '@trpc/server'

export const productRouter = createTRPCRouter({
  // Get all products with pagination
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
        categoryId: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        sort: z.enum(['newest', 'price-asc', 'price-desc', 'name']).default('newest'),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, categoryId, minPrice, maxPrice, sort, search } = input

      const where = {
        status: 'ACTIVE' as const,
        ...(categoryId && { categoryId }),
        ...(minPrice !== undefined && { price: { gte: minPrice } }),
        ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }),
      }

      const orderBy = {
        newest: { createdAt: 'desc' as const },
        'price-asc': { price: 'asc' as const },
        'price-desc': { price: 'desc' as const },
        name: { name: 'asc' as const },
      }[sort]

      const products = await ctx.prisma.product.findMany({
        where,
        orderBy,
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          category: true,
        },
      })

      let nextCursor: string | undefined = undefined
      if (products.length > limit) {
        const nextItem = products.pop()
        nextCursor = nextItem!.id
      }

      return {
        products,
        nextCursor,
      }
    }),

  // Get single product by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.findUnique({
        where: { slug: input.slug },
        include: {
          category: true,
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      })

      if (!product) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found',
        })
      }

      return product
    }),

  // Create product (admin only)
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string(),
        price: z.number().positive(),
        images: z.array(z.string()).min(1),
        sku: z.string(),
        inventory: z.number().int().min(0),
        categoryId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.create({
        data: {
          ...input,
          status: 'ACTIVE',
        },
      })

      return product
    }),

  // Update product (admin only)
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        price: z.number().positive().optional(),
        images: z.array(z.string()).optional(),
        inventory: z.number().int().min(0).optional(),
        status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      const product = await ctx.prisma.product.update({
        where: { id },
        data,
      })

      return product
    }),
})
```

**Checklist**:
- [ ] Create pagination logic
- [ ] Add filtering options
- [ ] Implement search
- [ ] Add sorting
- [ ] Create CRUD operations
- [ ] Add authorization
- [ ] Include relations
- [ ] Handle errors

---

#### 3.4 `/src/app/(shop)/products/page.tsx`
**Purpose**: Product listing page with filters

**Dependencies**: React, tRPC, UI components

```typescript
'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { ProductCard } from '@/components/features/product-card'
import { ProductFilters } from '@/components/features/product-filters'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Icons } from '@/components/ui/icons'

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    categoryId: undefined as string | undefined,
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    sort: 'newest' as const,
  })

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    api.product.getAll.useInfiniteQuery(
      { limit: 20, ...filters },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    )

  const products = data?.pages.flatMap((page) => page.products) ?? []

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">All Products</h1>
        <p className="mt-2 text-muted-foreground">
          Discover our curated collection of luxury items
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <ProductFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        </aside>

        <main className="lg:col-span-3">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-96" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex h-96 flex-col items-center justify-center">
              <Icons.package className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg text-muted-foreground">
                No products found
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {hasNextPage && (
                <div className="mt-8 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
```

**Checklist**:
- [ ] Create layout structure
- [ ] Implement infinite scroll
- [ ] Add filter sidebar
- [ ] Handle loading states
- [ ] Display products grid
- [ ] Add empty state
- [ ] Make responsive
- [ ] Optimize performance

---

#### 3.5 `/src/components/features/product-card.tsx`
**Purpose**: Reusable product card component

**Dependencies**: React, Next.js Image, UI components

**Exports**: ProductCard component

```typescript
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@prisma/client'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { Icons } from '@/components/ui/icons'

interface ProductCardProps {
  product: Product & {
    category: { name: string }
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden">
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.images[0] || '/placeholder.png'}
            alt={product.name}
            width={400}
            height={400}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{product.category.name}</p>
        <h3 className="mt-1 font-medium line-clamp-2">
          <Link href={`/products/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 text-lg font-semibold">
          {formatPrice(product.price)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" size="sm">
          <Icons.shoppingBag className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
```

**Checklist**:
- [ ] Create card structure
- [ ] Add product image
- [ ] Display product info
- [ ] Add hover effects
- [ ] Include add to cart
- [ ] Make clickable
- [ ] Handle missing images
- [ ] Format pricing

---

#### 3.6 `/src/app/(shop)/products/[slug]/page.tsx`
**Purpose**: Product detail page

**Dependencies**: React, tRPC, UI components

```typescript
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Icons } from '@/components/ui/icons'
import { ProductImageGallery } from '@/components/features/product-image-gallery'
import { AddToCartButton } from '@/components/features/add-to-cart-button'
import { ProductReviews } from '@/components/features/product-reviews'

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await api.product.getBySlug.fetch({ slug: params.slug })

  if (!product) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Images */}
        <ProductImageGallery images={product.images} alt={product.name} />

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">
              {product.category.name}
            </p>
            <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
          </div>

          <div className="text-3xl font-bold">
            {formatPrice(product.price)}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Icons.truck className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Free shipping on orders over $100</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icons.shield className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">2-year warranty included</span>
            </div>
          </div>

          <div className="space-y-4">
            <AddToCartButton
              product={product}
              className="w-full"
              size="lg"
            />
            <Button variant="outline" className="w-full" size="lg">
              <Icons.heart className="mr-2 h-4 w-4" />
              Add to Wishlist
            </Button>
          </div>

          <Tabs defaultValue="description" className="mt-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({product.reviews.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <p className="text-muted-foreground">{product.description}</p>
            </TabsContent>
            <TabsContent value="details" className="mt-4">
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">SKU</dt>
                  <dd className="text-sm font-medium">{product.sku}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">
                    Availability
                  </dt>
                  <dd className="text-sm font-medium">
                    {product.inventory > 0 ? (
                      <span className="text-green-600">In Stock</span>
                    ) : (
                      <span className="text-red-600">Out of Stock</span>
                    )}
                  </dd>
                </div>
              </dl>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <ProductReviews reviews={product.reviews} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// Generate static params for SSG
export async function generateStaticParams() {
  // In production, you might want to limit this to popular products
  const products = await api.product.getAll.fetch({ limit: 100 })
  
  return products.products.map((product) => ({
    slug: product.slug,
  }))
}
```

**Checklist**:
- [ ] Create product layout
- [ ] Add image gallery
- [ ] Display product details
- [ ] Add to cart functionality
- [ ] Create tabs for info
- [ ] Show reviews
- [ ] Add wishlist button
- [ ] Implement SSG

---

### Phase 3 Completion Checklist
- [ ] tRPC configured and working
- [ ] Product API endpoints created
- [ ] Product listing page functional
- [ ] Product detail pages working
- [ ] Product search implemented
- [ ] Category filtering working
- [ ] Image gallery functional
- [ ] Product cards responsive
- [ ] Infinite scroll implemented

---

## Phase 4: Shopping Cart & Checkout

### 🎯 Goals
- Implement cart functionality
- Create checkout flow
- Integrate Stripe payments
- Add order confirmation
- Implement cart persistence

### 📅 Duration: 4 days

### 📋 Files to Create

#### 4.1 `/src/store/cart.store.ts`
**Purpose**: Zustand store for cart management

**Dependencies**: Zustand, Product types

**Exports**: useCartStore hook

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@prisma/client'

export interface CartItem {
  product: Product
  quantity: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  
  // Actions
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  
  // Computed
  getTotalPrice: () => number
  getTotalItems: () => number
  getItemQuantity: (productId: string) => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          )

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }

          return {
            items: [...state.items, { product, quantity }],
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + Number(item.product.price) * item.quantity,
          0
        )
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getItemQuantity: (productId) => {
        const item = get().items.find((item) => item.product.id === productId)
        return item?.quantity || 0
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
```

**Checklist**:
- [ ] Create cart interface
- [ ] Implement add/remove logic
- [ ] Add quantity updates
- [ ] Calculate totals
- [ ] Persist to localStorage
- [ ] Add cart toggle
- [ ] Export typed hook

---

#### 4.2 `/src/components/features/cart-drawer.tsx`
**Purpose**: Sliding cart drawer component

**Dependencies**: React, Zustand, UI components

**Exports**: CartDrawer component

```typescript
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Icons } from '@/components/ui/icons'
import { useCartStore } from '@/store/cart.store'
import { formatPrice } from '@/lib/utils'
import { CartItemCard } from './cart-item-card'

export function CartDrawer() {
  const { items, isOpen, toggleCart, getTotalPrice, getTotalItems } = useCartStore()

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({getTotalItems()})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <Icons.shoppingBag className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-medium">Your cart is empty</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Add items to get started
            </p>
            <Button className="mt-6" onClick={toggleCart}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItemCard key={item.product.id} item={item} />
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-6">
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-sm">{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Shipping</span>
                  <span className="text-sm">Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium">Total</span>
                  <span className="text-base font-medium">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Button className="w-full" size="lg" asChild>
                  <Link href="/checkout" onClick={toggleCart}>
                    Checkout
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={toggleCart}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
```

**Checklist**:
- [ ] Create drawer structure
- [ ] Display cart items
- [ ] Show totals
- [ ] Add empty state
- [ ] Implement checkout link
- [ ] Make scrollable
- [ ] Add close functionality

---

#### 4.3 `/src/app/(shop)/checkout/page.tsx`
**Purpose**: Multi-step checkout process

**Dependencies**: React, Stripe, tRPC

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/hooks/use-session'
import { useCartStore } from '@/store/cart.store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { CheckoutSteps } from '@/components/features/checkout-steps'
import { ShippingForm } from '@/components/features/checkout/shipping-form'
import { PaymentForm } from '@/components/features/checkout/payment-form'
import { OrderSummary } from '@/components/features/checkout/order-summary'
import { formatPrice } from '@/lib/utils'

type CheckoutStep = 'shipping' | 'payment' | 'confirmation'

export default function CheckoutPage() {
  const router = useRouter()
  const { user, isLoading: isSessionLoading } = useSession()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping')
  const [shippingData, setShippingData] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Redirect if cart is empty
  if (items.length === 0 && !isSessionLoading) {
    router.push('/products')
    return null
  }

  const handleShippingSubmit = (data: any) => {
    setShippingData(data)
    setCurrentStep('payment')
  }

  const handlePaymentSubmit = async (paymentMethod: any) => {
    setIsProcessing(true)
    
    try {
      // Create order in database
      // Process payment with Stripe
      // Clear cart
      clearCart()
      setCurrentStep('confirmation')
    } catch (error) {
      console.error('Payment failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container max-w-6xl py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CheckoutSteps currentStep={currentStep} />
          
          <Card className="mt-6 p-6">
            {currentStep === 'shipping' && (
              <ShippingForm
                onSubmit={handleShippingSubmit}
                defaultValues={shippingData}
              />
            )}
            
            {currentStep === 'payment' && (
              <PaymentForm
                onSubmit={handlePaymentSubmit}
                onBack={() => setCurrentStep('shipping')}
                isProcessing={isProcessing}
              />
            )}
            
            {currentStep === 'confirmation' && (
              <div className="text-center">
                <Icons.checkCircle className="mx-auto h-16 w-16 text-green-600" />
                <h2 className="mt-4 text-2xl font-bold">Order Confirmed!</h2>
                <p className="mt-2 text-muted-foreground">
                  Thank you for your purchase. You will receive an email confirmation shortly.
                </p>
                <Button className="mt-6" onClick={() => router.push('/account/orders')}>
                  View Orders
                </Button>
              </div>
            )}
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <OrderSummary items={items} total={getTotalPrice()} />
        </div>
      </div>
    </div>
  )
}
```

**Checklist**:
- [ ] Create step navigation
- [ ] Build shipping form
- [ ] Add payment form
- [ ] Show order summary
- [ ] Handle form submission
- [ ] Process payment
- [ ] Show confirmation
- [ ] Clear cart on success

---

#### 4.4 `/src/lib/stripe.ts`
**Purpose**: Stripe configuration and utilities

**Dependencies**: Stripe SDK

**Exports**: Stripe instance and helper functions

```typescript
import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'

// Client-side Stripe
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

// Server-side Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

// Helper to create payment intent
export async function createPaymentIntent(amount: number, currency = 'usd') {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
  })

  return paymentIntent
}

// Helper to create checkout session
export async function createCheckoutSession(items: any[], successUrl: string, cancelUrl: string) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          images: [item.product.images[0]],
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
  })

  return session
}
```

**Checklist**:
- [ ] Configure Stripe client
- [ ] Set up server instance
- [ ] Create payment intent helper
- [ ] Add checkout session helper
- [ ] Handle currency conversion
- [ ] Add error handling

---

#### 4.5 `/src/app/api/checkout/route.ts`
**Purpose**: API endpoint for creating checkout sessions

**Dependencies**: Stripe, authentication

```typescript
import { NextResponse } from 'next/server'
import { getServerAuthSession } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession()
    const body = await req.json()
    const { items, shippingAddress } = body

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Calculate total
    const total = items.reduce((sum: number, item: any) => {
      return sum + (item.product.price * item.quantity)
    }, 0)

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        email: session.user.email!,
        total,
        subtotal: total,
        tax: 0, // Calculate based on location
        shipping: 0, // Calculate based on method
        shippingAddress,
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    })

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: 'usd',
      metadata: {
        orderId: order.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
```

**Checklist**:
- [ ] Validate authentication
- [ ] Calculate order total
- [ ] Create order record
- [ ] Generate payment intent
- [ ] Add metadata
- [ ] Handle errors
- [ ] Return client secret

---

### Phase 4 Completion Checklist
- [ ] Cart store implemented
- [ ] Cart drawer functional
- [ ] Add to cart working
- [ ] Checkout flow complete
- [ ] Shipping form created
- [ ] Payment integration working
- [ ] Order creation successful
- [ ] Cart persistence working
- [ ] Mobile responsive

---

## Phase 5: User Dashboard & Orders

### 🎯 Goals
- Create user account dashboard
- Implement order history
- Add profile management
- Create wishlist functionality
- Build address book

### 📅 Duration: 3 days

### 📋 Files to Create

#### 5.1 `/src/app/account/layout.tsx`
**Purpose**: Account section layout with navigation

**Dependencies**: React, NextAuth

```typescript
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getServerAuthSession } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'

const accountNavItems = [
  {
    title: 'Overview',
    href: '/account',
    icon: Icons.home,
  },
  {
    title: 'Orders',
    href: '/account/orders',
    icon: Icons.package,
  },
  {
    title: 'Wishlist',
    href: '/account/wishlist',
    icon: Icons.heart,
  },
  {
    title: 'Addresses',
    href: '/account/addresses',
    icon: Icons.mapPin,
  },
  {
    title: 'Settings',
    href: '/account/settings',
    icon: Icons.settings,
  },
]

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerAuthSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="container py-8">
      <div className="grid gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <nav className="space-y-1">
            {accountNavItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="w-full justify-start"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </nav>
        </aside>
        <main className="lg:col-span-3">{children}</main>
      </div>
    </div>
  )
}
```

**Checklist**:
- [ ] Create layout structure
- [ ] Add navigation sidebar
- [ ] Protect with auth
- [ ] Make responsive
- [ ] Style active links

---

#### 5.2 `/src/app/account/page.tsx`
**Purpose**: Account overview dashboard

**Dependencies**: React, tRPC, NextAuth

```typescript
import { getServerAuthSession } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'

export default async function AccountPage() {
  const session = await getServerAuthSession()
  const stats = await api.user.getStats.fetch({ userId: session!.user.id })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {session!.user.name}</h1>
        <p className="text-muted-foreground">
          Manage your account and view your order history
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Icons.package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.ordersThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <Icons.creditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(stats.totalSpent)}
            </div>
            <p className="text-xs text-muted-foreground">
              Average order: {formatPrice(stats.averageOrderValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
            <Icons.heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.wishlistItems}</div>
            <p className="text-xs text-muted-foreground">
              {stats.wishlistItemsInStock} in stock
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your last 5 orders</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Recent orders list */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Quick action buttons */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

**Checklist**:
- [ ] Create dashboard layout
- [ ] Display user stats
- [ ] Show recent orders
- [ ] Add quick actions
- [ ] Make responsive
- [ ] Fetch real data

---

#### 5.3 `/src/app/account/orders/page.tsx`
**Purpose**: Order history with details

**Dependencies**: React, tRPC

```typescript
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { formatPrice, formatDate } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

const statusColors = {
  PENDING: 'bg-yellow-500',
  PROCESSING: 'bg-blue-500',
  SHIPPED: 'bg-purple-500',
  DELIVERED: 'bg-green-500',
  CANCELLED: 'bg-red-500',
  REFUNDED: 'bg-gray-500',
}

export default function OrdersPage() {
  const { data: orders, isLoading } = api.order.getUserOrders.useQuery()

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Icons.package className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            When you place an order, it will appear here
          </p>
          <Button className="mt-6" asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Order History</h1>
        <p className="text-muted-foreground">
          View and manage your past orders
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Order #{order.orderNumber}</CardTitle>
                  <CardDescription>
                    Placed on {formatDate(order.createdAt)}
                  </CardDescription>
                </div>
                <Badge className={statusColors[order.status]}>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} items
                    </p>
                    <p className="text-lg font-medium">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/account/orders/${order.id}`}>
                        View Details
                      </Link>
                    </Button>
                    {order.status === 'DELIVERED' && (
                      <Button variant="outline" size="sm">
                        <Icons.download className="mr-2 h-4 w-4" />
                        Invoice
                      </Button>
                    )}
                  </div>
                </div>

                {order.trackingNumber && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Icons.truck className="h-4 w-4" />
                    <span>Tracking: {order.trackingNumber}</span>
                  </div>
                )}

                <div className="flex space-x-4">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="h-16 w-16 overflow-hidden rounded bg-gray-100">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="flex h-16 w-16 items-center justify-center rounded bg-gray-100">
                      <span className="text-sm text-muted-foreground">
                        +{order.items.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

**Checklist**:
- [ ] Create orders list
- [ ] Show order details
- [ ] Add status badges
- [ ] Display order items
- [ ] Add action buttons
- [ ] Handle empty state
- [ ] Make responsive

---

### Phase 5 Completion Checklist
- [ ] Account layout created
- [ ] Dashboard overview working
- [ ] Order history implemented
- [ ] Order details page functional
- [ ] User stats displayed
- [ ] Navigation working
- [ ] Protected routes configured
- [ ] Mobile responsive

---

## Phase 6: AI & Advanced Features

### 🎯 Goals
- Integrate OpenAI for recommendations
- Implement visual search
- Add personalized homepage
- Create AI chat support
- Build recommendation engine

### 📅 Duration: 4 days

### 📋 Files to Create

#### 6.1 `/src/lib/openai.ts`
**Purpose**: OpenAI configuration and utilities

**Dependencies**: OpenAI SDK

**Exports**: OpenAI client and helper functions

```typescript
import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Generate product embeddings
export async function generateEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  })
  
  return response.data[0].embedding
}

// Generate product recommendations
export async function generateRecommendations(
  userPreferences: string,
  productHistory: string[]
) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are a luxury fashion advisor. Based on the user's preferences and purchase history, suggest products they might like. Return a JSON array of product characteristics.`,
      },
      {
        role: 'user',
        content: `User preferences: ${userPreferences}\nPurchase history: ${productHistory.join(', ')}`,
      },
    ],
    response_format: { type: 'json_object' },
  })
  
  return JSON.parse(response.choices[0].message.content || '{}')
}

// AI-powered product descriptions
export async function enhanceProductDescription(
  productName: string,
  basicDescription: string
) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a luxury copywriter. Enhance the product description to be more compelling and luxurious while keeping it concise.',
      },
      {
        role: 'user',
        content: `Product: ${productName}\nBasic description: ${basicDescription}`,
      },
    ],
    max_tokens: 200,
  })
  
  return response.choices[0].message.content
}
```

**Checklist**:
- [ ] Configure OpenAI client
- [ ] Create embedding function
- [ ] Add recommendation logic
- [ ] Implement description enhancement
- [ ] Handle API errors
- [ ] Add rate limiting

---

#### 6.2 `/src/server/api/routers/ai.ts`
**Purpose**: AI-powered API endpoints

**Dependencies**: tRPC, OpenAI, Prisma

```typescript
import { z } from 'zod'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '@/server/api/trpc'
import { generateEmbedding, generateRecommendations } from '@/lib/openai'
import { TRPCError } from '@trpc/server'

export const aiRouter = createTRPCRouter({
  // Get personalized recommendations
  getRecommendations: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).default(6),
      })
    )
    .query(async ({ ctx, input }) => {
      // Get user's purchase history and preferences
      const userProfile = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          orders: {
            include: {
              items: {
                include: {
                  product: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      })

      if (!userProfile) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      // Extract product history
      const productHistory = userProfile.orders
        .flatMap((order) => order.items.map((item) => item.product.name))
        
      // Generate recommendations
      const recommendations = await generateRecommendations(
        'luxury fashion enthusiast',
        productHistory
      )

      // Find similar products in database
      const products = await ctx.prisma.$queryRaw`
        SELECT * FROM products
        WHERE status = 'ACTIVE'
        ORDER BY RANDOM()
        LIMIT ${input.limit}
      `

      return products
    }),

  // Visual search
  visualSearch: publicProcedure
    .input(
      z.object({
        imageUrl: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // In a real implementation, you would:
      // 1. Process the image with a vision model
      // 2. Extract features/embeddings
      // 3. Search for similar products
      
      // For now, return mock results
      const products = await ctx.prisma.product.findMany({
        where: { status: 'ACTIVE' },
        take: 6,
        orderBy: { createdAt: 'desc' },
      })

      return products
    }),

  // Generate style profile
  generateStyleProfile: protectedProcedure
    .input(
      z.object({
        preferences: z.object({
          styles: z.array(z.string()),
          colors: z.array(z.string()),
          brands: z.array(z.string()),
          priceRange: z.object({
            min: z.number(),
            max: z.number(),
          }),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Generate embedding for preferences
      const preferenceText = `
        Styles: ${input.preferences.styles.join(', ')}
        Colors: ${input.preferences.colors.join(', ')}
        Brands: ${input.preferences.brands.join(', ')}
        Budget: $${input.preferences.priceRange.min}-$${input.preferences.priceRange.max}
      `
      
      const embedding = await generateEmbedding(preferenceText)
      
      // Save to user profile
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          styleProfile: {
            upsert: {
              create: {
                ...input.preferences,
                embedding,
              },
              update: {
                ...input.preferences,
                embedding,
              },
            },
          },
        },
      })

      return { success: true }
    }),
})
```

**Checklist**:
- [ ] Create recommendation endpoint
- [ ] Implement visual search
- [ ] Add style profile generation
- [ ] Handle user preferences
- [ ] Integrate with OpenAI
- [ ] Add error handling

---

#### 6.3 `/src/components/features/ai-recommendations.tsx`
**Purpose**: AI recommendation display component

**Dependencies**: React, tRPC

```typescript
'use client'

import { api } from '@/lib/api'
import { ProductCard } from '@/components/features/product-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Icons } from '@/components/ui/icons'

export function AIRecommendations() {
  const { data: recommendations, isLoading } = api.ai.getRecommendations.useQuery({
    limit: 6,
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended for You</CardTitle>
          <CardDescription>
            AI-powered suggestions based on your style
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!recommendations || recommendations.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Icons.sparkles className="h-5 w-5" />
          <CardTitle>Recommended for You</CardTitle>
        </div>
        <CardDescription>
          Personalized suggestions based on your unique style
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

**Checklist**:
- [ ] Create recommendation layout
- [ ] Fetch AI suggestions
- [ ] Display product cards
- [ ] Add loading state
- [ ] Handle empty state
- [ ] Make responsive

---

### Phase 6 Completion Checklist
- [ ] OpenAI integrated
- [ ] Recommendation API working
- [ ] Visual search implemented
- [ ] Style profiles created
- [ ] AI components built
- [ ] Personalization functional
- [ ] Error handling complete

---

## Phase 7: Performance & Testing

### 🎯 Goals
- Optimize bundle size
- Implement caching strategies
- Add comprehensive tests
- Optimize images
- Improve Core Web Vitals

### 📅 Duration: 3 days

### 📋 Files to Create

#### 7.1 `/tests/setup.ts`
**Purpose**: Test environment setup

```typescript
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => '/',
}))

// Mock Next Auth
vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
  }),
  signIn: vi.fn(),
  signOut: vi.fn(),
}))

// Setup global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))
```

**Checklist**:
- [ ] Configure test environment
- [ ] Mock Next.js APIs
- [ ] Mock authentication
- [ ] Setup global utilities
- [ ] Configure test database

---

#### 7.2 `/tests/e2e/checkout.spec.ts`
**Purpose**: E2E checkout flow test

```typescript
import { test, expect } from '@playwright/test'

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Add product to cart
    await page.goto('/products')
    await page.click('[data-testid="product-card"]:first-child button')
    await page.waitForSelector('[data-testid="cart-count"]')
  })

  test('should complete checkout process', async ({ page }) => {
    // Go to checkout
    await page.click('[data-testid="cart-button"]')
    await page.click('text=Checkout')
    
    // Fill shipping info
    await page.fill('[name="name"]', 'John Doe')
    await page.fill('[name="email"]', 'john@example.com')
    await page.fill('[name="address"]', '123 Main St')
    await page.fill('[name="city"]', 'New York')
    await page.fill('[name="zipCode"]', '10001')
    
    await page.click('text=Continue to Payment')
    
    // Fill payment info (using Stripe test card)
    const stripeFrame = page.frameLocator('iframe[title="Secure payment input frame"]')
    await stripeFrame.locator('[placeholder="Card number"]').fill('4242424242424242')
    await stripeFrame.locator('[placeholder="MM / YY"]').fill('12/25')
    await stripeFrame.locator('[placeholder="CVC"]').fill('123')
    
    // Complete order
    await page.click('text=Place Order')
    
    // Verify confirmation
    await expect(page.locator('text=Order Confirmed')).toBeVisible()
  })

  test('should show validation errors', async ({ page }) => {
    await page.goto('/checkout')
    await page.click('text=Continue to Payment')
    
    await expect(page.locator('text=Name is required')).toBeVisible()
    await expect(page.locator('text=Email is required')).toBeVisible()
  })
})
```

**Checklist**:
- [ ] Test happy path
- [ ] Test validation
- [ ] Test error states
- [ ] Test mobile view
- [ ] Test guest checkout

---

#### 7.3 `/src/lib/performance.ts`
**Purpose**: Performance monitoring utilities

```typescript
export function reportWebVitals(metric: any) {
  if (metric.label === 'web-vital') {
    console.log(metric)
    
    // Send to analytics
    if (window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      })
    }
  }
}

// Image optimization helper
export function getOptimizedImageUrl(
  src: string,
  width: number,
  quality = 75
): string {
  // If using Cloudinary or similar service
  if (src.includes('cloudinary')) {
    return src.replace('/upload/', `/upload/w_${width},q_${quality}/`)
  }
  
  return src
}

// Lazy load images with blur placeholder
export function getImagePlaceholder(src: string): string {
  // Generate low-quality placeholder
  return getOptimizedImageUrl(src, 20, 10)
}
```

**Checklist**:
- [ ] Add Web Vitals tracking
- [ ] Create image helpers
- [ ] Add performance monitoring
- [ ] Implement lazy loading
- [ ] Add analytics integration

---

### Phase 7 Completion Checklist
- [ ] Test environment configured
- [ ] Unit tests written
- [ ] E2E tests passing
- [ ] Performance optimized
- [ ] Bundle size reduced
- [ ] Images optimized
- [ ] Caching implemented
- [ ] Monitoring configured

---

## Phase 8: Deployment & Launch

### 🎯 Goals
- Deploy to Vercel
- Configure production environment
- Set up monitoring
- Configure domains
- Launch preparation

### 📅 Duration: 2 days

### 📋 Files to Create

#### 8.1 `/vercel.json`
**Purpose**: Vercel deployment configuration

```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "regions": ["iad1"],
  "functions": {
    "src/app/api/trpc/[trpc]/route.ts": {
      "maxDuration": 30
    }
  },
  "crons": [
    {
      "path": "/api/cron/update-inventory",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

**Checklist**:
- [ ] Configure build commands
- [ ] Set function timeouts
- [ ] Add cron jobs
- [ ] Configure regions
- [ ] Set environment variables

---

#### 8.2 `/scripts/seed.ts`
**Purpose**: Database seeding script

```typescript
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@luxeverse.ai' },
    update: {},
    create: {
      email: 'admin@luxeverse.ai',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Watches',
        slug: 'watches',
        description: 'Luxury timepieces',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Jewelry',
        slug: 'jewelry',
        description: 'Fine jewelry and accessories',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Bags',
        slug: 'bags',
        description: 'Designer bags and luggage',
      },
    }),
  ])

  // Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Luxury Chronograph Watch',
        slug: 'luxury-chronograph-watch',
        description: 'Swiss-made automatic chronograph with leather strap',
        price: 12500,
        images: ['/images/watch-1.jpg'],
        sku: 'WATCH001',
        inventory: 5,
        categoryId: categories[0].id,
        status: 'ACTIVE',
      },
    }),
    // Add more products...
  ])

  console.log({ admin, categories, products })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

**Checklist**:
- [ ] Create admin user
- [ ] Seed categories
- [ ] Add sample products
- [ ] Test data integrity
- [ ] Add to package.json scripts

---

### Final Launch Checklist

#### Technical Requirements
- [ ] All tests passing (>90% coverage)
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Lighthouse score >90
- [ ] Security headers configured
- [ ] SSL certificate active
- [ ] Monitoring configured
- [ ] Error tracking enabled
- [ ] Analytics implemented
- [ ] Backup strategy in place

#### Business Requirements
- [ ] Privacy policy added
- [ ] Terms of service added
- [ ] Cookie consent implemented
- [ ] Payment processing tested
- [ ] Email notifications working
- [ ] Admin panel functional
- [ ] SEO meta tags configured
- [ ] Sitemap generated
- [ ] Social media tags added
- [ ] Documentation complete

#### Performance Checklist
- [ ] Images optimized
- [ ] Code splitting implemented
- [ ] Caching configured
- [ ] CDN enabled
- [ ] Database indexed
- [ ] API rate limiting
- [ ] Bundle size <200KB
- [ ] First paint <1.5s
- [ ] TTI <3.5s
- [ ] Zero CLS

---

## 🎉 Congratulations!

You've successfully built LuxeVerse - a modern, AI-powered luxury e-commerce platform. The codebase is now:

- **Type-safe** with TypeScript throughout
- **Performant** with optimized loading and caching
- **Secure** with proper authentication and authorization
- **Scalable** with proper architecture patterns
- **Tested** with comprehensive test coverage
- **Production-ready** for deployment

### Next Steps

1. **Deploy to Production**: Use Vercel CLI or GitHub integration
2. **Monitor Performance**: Set up alerts for key metrics
3. **Gather Feedback**: Launch beta program
4. **Iterate**: Continuously improve based on user feedback

Remember to keep your dependencies updated and monitor security advisories. Good luck with your launch! 🚀
```
