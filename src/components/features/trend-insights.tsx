'use client'

import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Icons } from '@/components/ui/icons'
import { ProductCard } from '@/components/features/product-card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface TrendInsightsProps {
  categories?: string[]
  className?: string
}

export function TrendInsights({ categories, className }: TrendInsightsProps) {
  const { data, isLoading } = api.ai.getTrendAnalysis.useQuery({
    categories,
  })

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return null
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Icons.trendingUp className="h-5 w-5" />
              Trend Insights
            </CardTitle>
            <CardDescription>
              AI-curated fashion trends and investment pieces
            </CardDescription>
          </div>
          {data.lastUpdated && (
            <p className="text-xs text-muted-foreground">
              Updated {new Date(data.lastUpdated).toLocaleDateString()}
            </p>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trending">Trending Now</TabsTrigger>
            <TabsTrigger value="emerging">Emerging</TabsTrigger>
            <TabsTrigger value="timeless">Timeless</TabsTrigger>
          </TabsList>
          
          {/* Trending Now */}
          <TabsContent value="trending" className="space-y-6">
            {data.trending_now.map((trend, index) => (
              <div key={index} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold">{trend.trend}</h4>
                    <Badge variant={trend.longevity === 'long-term' ? 'default' : 'secondary'}>
                      {trend.longevity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {trend.description}
                  </p>
                  
                  {/* Key Pieces */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-sm font-medium">Key pieces:</span>
                    {trend.key_pieces.map((piece) => (
                      <Badge key={piece} variant="outline">
                        {piece}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Leading Brands */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-sm font-medium">Leading brands:</span>
                    {trend.brands_leading.map((brand) => (
                      <Badge key={brand} variant="secondary">
                        {brand}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Product Carousel */}
                {trend.products && trend.products.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {trend.products.slice(0, 4).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </TabsContent>
          
          {/* Emerging Trends */}
          <TabsContent value="emerging" className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium mb-2">
                <Icons.eye className="inline h-4 w-4 mr-1" />
                Keep an eye on these upcoming trends:
              </p>
              <div className="flex flex-wrap gap-2">
                {data.emerging_trends.map((trend) => (
                  <Badge key={trend} variant="outline">
                    {trend}
                  </Badge>
                ))}
              </div>
            </div>
            
            {data.personalized_recommendations && (
              <div className="space-y-2">
                <h4 className="font-medium">For Your Style</h4>
                <p className="text-sm text-muted-foreground">
                  {data.personalized_recommendations}
                </p>
              </div>
            )}
          </TabsContent>
          
          {/* Timeless Pieces */}
          <TabsContent value="timeless" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Classic pieces that never go out of style:
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {data.timeless_pieces.map((piece) => (
                <div
                  key={piece}
                  className="flex items-center gap-2 rounded-lg border p-3"
                >
                  <Icons.checkCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">{piece}</span>
                </div>
              ))}
            </div>
            
            {/* Investment Pieces */}
            {data.investment_pieces.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-2">Worth the Investment</h4>
                <div className="space-y-2">
                  {data.investment_pieces.map((piece) => (
                    <div key={piece} className="flex items-center gap-2">
                      <Icons.gem className="h-4 w-4 text-primary" />
                      <span className="text-sm">{piece}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
