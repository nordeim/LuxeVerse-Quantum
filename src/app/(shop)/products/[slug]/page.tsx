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
