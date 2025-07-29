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
