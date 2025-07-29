'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/lib/utils'

interface SizeRecommendationProps {
  productId: string
  variants: Array<{
    id: string
    size?: string | null
    inventoryQuantity: number
  }>
  category: string
  brand?: string
}

export function SizeRecommendation({ 
  productId, 
  variants, 
  category,
  brand = 'Unknown'
}: SizeRecommendationProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>()
  const [showMeasurements, setShowMeasurements] = useState(false)
  const [measurements, setMeasurements] = useState<Record<string, number>>({})

  const { data, isLoading, refetch } = api.ai.getSizeRecommendation.useQuery({
    productId,
    variantId: selectedVariantId,
    measurements: Object.keys(measurements).length > 0 ? measurements : undefined,
  })

  const confidenceColors = {
    high: 'text-green-600 bg-green-50',
    medium: 'text-yellow-600 bg-yellow-50',
    low: 'text-red-600 bg-red-50',
  }

  const measurementFields = {
    tops: ['chest', 'waist', 'length'],
    bottoms: ['waist', 'hips', 'inseam'],
    shoes: ['footLength'],
    accessories: [],
  }

  const getCategoryType = () => {
    const lowerCategory = category.toLowerCase()
    if (lowerCategory.includes('shirt') || lowerCategory.includes('jacket') || lowerCategory.includes('top')) {
      return 'tops'
    }
    if (lowerCategory.includes('pant') || lowerCategory.includes('skirt') || lowerCategory.includes('short')) {
      return 'bottoms'
    }
    if (lowerCategory.includes('shoe') || lowerCategory.includes('boot')) {
      return 'shoes'
    }
    return 'accessories'
  }

  const categoryType = getCategoryType()
  const fields = measurementFields[categoryType as keyof typeof measurementFields]

  // Filter variants with sizes
  const sizedVariants = variants.filter(v => v.size)

  if (sizedVariants.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icons.ruler className="h-5 w-5" />
          Find Your Size
        </CardTitle>
        <CardDescription>
          AI-powered size recommendations for {brand}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Size Selector */}
        <div className="space-y-2">
          <Label>Available Sizes</Label>
          <div className="flex flex-wrap gap-2">
            {sizedVariants.map((variant) => (
              <Button
                key={variant.id}
                variant={selectedVariantId === variant.id ? 'default' : 'outline'}
                size="sm"
                disabled={variant.inventoryQuantity === 0}
                onClick={() => setSelectedVariantId(variant.id)}
                className="relative"
              >
                {variant.size}
                {variant.inventoryQuantity === 0 && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-md bg-background/80">
                    <Icons.x className="h-4 w-4" />
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Recommendation Display */}
        {data && (
          <div className="space-y-4">
            {/* Recommended Size */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Recommended Size</p>
                  <p className="text-2xl font-bold">{data.recommended_size}</p>
                </div>
                <Badge 
                  className={cn(
                    'ml-2',
                    confidenceColors[data.confidence_level as keyof typeof confidenceColors]
                  )}
                >
                  {data.confidence_level} confidence
                </Badge>
              </div>
              
              {data.fit_notes && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {data.fit_notes}
                </p>
              )}
            </div>

            {/* Alternative Sizes */}
            {data.alternative_sizes && data.alternative_sizes.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Alternative Options</p>
                <div className="flex gap-2">
                  {data.alternative_sizes.map((size) => (
                    <Badge key={size} variant="secondary">
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Size Comparison */}
            {data.size_comparison && (
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm">
                  <span className="font-medium">Compared to other brands:</span>{' '}
                  {data.size_comparison}
                </p>
              </div>
            )}

            {/* Measurement Tips */}
            {data.measurement_tips && (
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Measurement Tips:</p>
                <p>{data.measurement_tips}</p>
              </div>
            )}
          </div>
        )}

        {/* Measurements Input */}
        {fields.length > 0 && (
          <Dialog open={showMeasurements} onOpenChange={setShowMeasurements}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Icons.ruler className="mr-2 h-4 w-4" />
                Add Your Measurements
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Your Measurements</DialogTitle>
                <DialogDescription>
                  Enter your measurements for a more accurate size recommendation
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <Tabs defaultValue="cm">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="cm">Centimeters</TabsTrigger>
                    <TabsTrigger value="in">Inches</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="cm" className="space-y-4">
                    {fields.map((field) => (
                      <div key={field} className="space-y-2">
                        <Label htmlFor={field} className="capitalize">
                          {field} (cm)
                        </Label>
                        <Input
                          id={field}
                          type="number"
                          value={measurements[field] || ''}
                          onChange={(e) => setMeasurements({
                            ...measurements,
                            [field]: parseFloat(e.target.value)
                          })}
                        />
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="in" className="space-y-4">
                    {fields.map((field) => (
                      <div key={field} className="space-y-2">
                        <Label htmlFor={`${field}-in`} className="capitalize">
                          {field} (inches)
                        </Label>
                        <Input
                          id={`${field}-in`}
                          type="number"
                          value={measurements[field] ? (measurements[field] / 2.54).toFixed(1) : ''}
                          onChange={(e) => setMeasurements({
                            ...measurements,
                            [field]: parseFloat(e.target.value) * 2.54
                          })}
                        />
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
                
                <Button
                  className="w-full"
                  onClick={() => {
                    refetch()
                    setShowMeasurements(false)
                  }}
                >
                  Get Recommendation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Size Guide Link */}
        <Button variant="link" className="w-full">
          View {brand} Size Chart
          <Icons.externalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
