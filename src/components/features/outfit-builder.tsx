'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Icons } from '@/components/ui/icons'
import { ProductCard } from '@/components/features/product-card'
import { formatPrice } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface OutfitBuilderProps {
  productId: string
  productName: string
  productImage?: string
}

export function OutfitBuilder({ productId, productName, productImage }: OutfitBuilderProps) {
  const [occasion, setOccasion] = useState<string>()
  const [season, setSeason] = useState<string>()

  const { data, isLoading, refetch } = api.ai.generateOutfits.useQuery({
    productId,
    occasion,
    season,
  })

  const occasions = [
    { value: 'casual', label: 'Casual Day' },
    { value: 'office', label: 'Office' },
    { value: 'evening', label: 'Evening Out' },
    { value: 'formal', label: 'Formal Event' },
    { value: 'weekend', label: 'Weekend' },
  ]

  const seasons = [
    { value: 'spring', label: 'Spring' },
    { value: 'summer', label: 'Summer' },
    { value: 'fall', label: 'Fall' },
    { value: 'winter', label: 'Winter' },
  ]

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icons.sparkles className="h-5 w-5" />
          Complete the Look
        </CardTitle>
        <CardDescription>
          AI-curated outfit suggestions featuring {productName}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Select value={occasion} onValueChange={setOccasion}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select occasion" />
            </SelectTrigger>
            <SelectContent>
              {occasions.map((occ) => (
                <SelectItem key={occ.value} value={occ.value}>
                  {occ.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={season} onValueChange={setSeason}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
          >
            <Icons.refresh className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Outfit Suggestions */}
        {data?.outfits && data.outfits.length > 0 ? (
          <Tabs defaultValue="0" className="w-full">
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${data.outfits.length}, 1fr)` }}>
              {data.outfits.map((_, index) => (
                <TabsTrigger key={index} value={index.toString()}>
                  Look {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {data.outfits.map((outfit, index) => (
              <TabsContent key={index} value={index.toString()} className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold">{outfit.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {outfit.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="secondary">{outfit.occasion}</Badge>
                    {outfit.items.length > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {outfit.items.length + 1} pieces
                      </span>
                    )}
                  </div>
                </div>

                {/* Base Product */}
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium mb-2">Starting with:</p>
                  <div className="flex items-center gap-4">
                    {productImage && (
                      <img
                        src={productImage}
                        alt={productName}
                        className="h-20 w-20 rounded-md object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium">{productName}</p>
                      <p className="text-sm text-muted-foreground">Your selected item</p>
                    </div>
                  </div>
                </div>

                {/* Suggested Items */}
                <div className="space-y-4">
                  {outfit.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.category}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {item.color_suggestion}
                        </Badge>
                      </div>
                      
                      {item.suggestedProducts && item.suggestedProducts.length > 0 && (
                        <div className="grid gap-4 sm:grid-cols-3">
                          {item.suggestedProducts.slice(0, 3).map((product) => (
                            <ProductCard
                              key={product.id}
                              product={product}
                              className="h-full"
                            />
                          ))}
                        </div>
                      )}
                      
                      {item.style_notes && (
                        <p className="text-sm text-muted-foreground italic">
                          💡 {item.style_notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Styling Tips */}
                {outfit.styling_tips && (
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <p className="text-sm font-medium mb-2">Styling Tips:</p>
                      <p className="text-sm text-muted-foreground">
                        {outfit.styling_tips}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Alternative Options */}
                {outfit.alternative_options && (
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium">Alternative options:</p>
                    <p>{outfit.alternative_options}</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-8">
            <Icons.sparkles className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="mt-4 text-muted-foreground">
              Select occasion and season to see outfit suggestions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
