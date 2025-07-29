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
