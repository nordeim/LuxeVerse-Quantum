'use client'

import { useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Icons } from '@/components/ui/icons'
import { ProductCard } from '@/components/features/product-card'
import { cn } from '@/lib/utils'

interface AIRecommendationsProps {
  category?: string
  className?: string
  showPersonalizationScore?: boolean
}

export function AIRecommendations({ 
  category, 
  className,
  showPersonalizationScore = true,
}: AIRecommendationsProps) {
  const [selectedCategory, setSelectedCategory] = useState(category)
  
  const { data, isLoading, refetch } = api.ai.getPersonalizedRecommendations.useQuery({
    limit: 12,
    category: selectedCategory,
  })

  const categories = [
    { value: undefined, label: 'All Categories' },
    { value: 'bags', label: 'Bags' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'jewelry', label: 'Jewelry' },
    { value: 'watches', label: 'Watches' },
  ]

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.recommendations.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Icons.sparkles className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No recommendations yet</h3>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Complete your style profile to get personalized recommendations
          </p>
          <Button className="mt-6" asChild>
            <Link href="/account/style-profile">
              Create Style Profile
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Icons.sparkles className="h-5 w-5 text-primary" />
              AI Recommendations for You
            </CardTitle>
            <CardDescription>
              {data.basedOn === 'ai_personalization' 
                ? 'Personalized based on your unique style'
                : 'Trending items you might like'}
            </CardDescription>
          </div>
          {showPersonalizationScore && data.personalizationScore > 0 && (
            <div className="text-right">
              <div className="text-2xl font-bold">
                {Math.round(data.personalizationScore * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">Match Score</p>
            </div>
          )}
        </div>
        
        {/* Category Filter */}
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.value || 'all'}
              variant={selectedCategory === cat.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setSelectedCategory(cat.value)
                refetch()
              }}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        {data.styleInsights && (
          <div className="mb-6 rounded-lg bg-muted p-4">
            <p className="text-sm font-medium mb-1">Your Style Insights</p>
            <p className="text-sm text-muted-foreground">{data.styleInsights}</p>
          </div>
        )}
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.recommendations.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              {product.recommendationReason && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="group relative">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Icons.info className="h-4 w-4" />
                    </div>
                    <div className="absolute right-0 top-10 hidden w-64 rounded-md bg-popover p-3 text-sm shadow-lg group-hover:block">
                      <p className="font-medium mb-1">Why we recommend this</p>
                      <p className="text-muted-foreground">
                        {product.recommendationReason}
                      </p>
                      {product.matchScore && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-2 flex-1 rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${product.matchScore * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">
                            {Math.round(product.matchScore * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {product.isExclusive && (
                <Badge className="absolute top-2 left-2" variant="secondary">
                  Exclusive
                </Badge>
              )}
            </div>
          ))}
        </div>
        
        {data.trendAlignment && (
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Icons.trendingUp className="h-4 w-4" />
            <span>{data.trendAlignment}</span>
          </div>
        )}
        
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="gap-2"
          >
            <Icons.refresh className="h-4 w-4" />
            Refresh Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
