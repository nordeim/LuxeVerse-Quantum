import { redirect } from 'next/navigation'
import { getServerAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Icons } from '@/components/ui/icons'
import { StyleQuizDialog } from '@/components/features/style-quiz-dialog'
import { StylePreferencesForm } from '@/components/features/style-preferences-form'

async function getStyleProfile(userId: string) {
  return await prisma.styleProfile.findUnique({
    where: { userId },
  })
}

export default async function StyleProfilePage() {
  const session = await getServerAuthSession()
  
  if (!session) {
    redirect('/login?callbackUrl=/account/style-profile')
  }

  const styleProfile = await getStyleProfile(session.user.id)
  const profileCompleteness = styleProfile ? calculateCompleteness(styleProfile) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Style Profile</h1>
          <p className="text-muted-foreground">
            Help our AI understand your unique style
          </p>
        </div>
        {!styleProfile && <StyleQuizDialog />}
      </div>

      {!styleProfile ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Icons.sparkles className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Create Your Style Profile</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Take a quick quiz to help us personalize your shopping experience
            </p>
            <StyleQuizDialog>
              <Button className="mt-6">
                <Icons.sparkles className="mr-2 h-4 w-4" />
                Take Style Quiz
              </Button>
            </StyleQuizDialog>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Profile Completeness */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Completeness</CardTitle>
              <CardDescription>
                The more complete your profile, the better our recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{profileCompleteness}% Complete</span>
                <span className="text-muted-foreground">
                  {profileCompleteness < 100 && 'Add more details for better matches'}
                </span>
              </div>
              <Progress value={profileCompleteness} />
            </CardContent>
          </Card>

          {/* Style Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Your Style Summary</CardTitle>
              <CardDescription>
                Based on your preferences and shopping history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Style Personas */}
              <div>
                <p className="text-sm font-medium mb-2">Style Personas</p>
                <div className="flex flex-wrap gap-2">
                  {styleProfile.stylePersonas.map((persona) => (
                    <Badge key={persona} variant="secondary">
                      {persona}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Favorite Colors */}
              <div>
                <p className="text-sm font-medium mb-2">Favorite Colors</p>
                <div className="flex flex-wrap gap-2">
                  {styleProfile.favoriteColors.map((color) => (
                    <div
                      key={color}
                      className="flex items-center gap-2 rounded-md border px-2 py-1"
                    >
                      <div
                        className="h-4 w-4 rounded-full border"
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                      <span className="text-sm">{color}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preferred Brands */}
              {styleProfile.preferredBrands.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Preferred Brands</p>
                  <div className="flex flex-wrap gap-2">
                    {styleProfile.preferredBrands.map((brand) => (
                      <Badge key={brand} variant="outline">
                        {brand}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div>
                <p className="text-sm font-medium mb-2">Typical Budget</p>
                <p className="text-sm text-muted-foreground">
                  ${styleProfile.minPricePreference} - ${styleProfile.maxPricePreference}
                  {styleProfile.sweetSpotPrice && (
                    <span> (Sweet spot: ${styleProfile.sweetSpotPrice})</span>
                  )}
                </p>
              </div>

              {/* Preferences */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  {styleProfile.prefersSustainable ? (
                    <Icons.checkCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Icons.xCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span>Sustainable Fashion</span>
                </div>
                <div className="flex items-center gap-2">
                  {styleProfile.prefersExclusive ? (
                    <Icons.checkCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Icons.xCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span>Exclusive Items</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Update Preferences</CardTitle>
              <CardDescription>
                Fine-tune your style profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StylePreferencesForm styleProfile={styleProfile} />
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle>AI Style Insights</CardTitle>
              <CardDescription>
                What we've learned about your style
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Early Adopter Score</p>
                  <Progress value={Number(styleProfile.earlyAdopterScore) * 100} />
                  <p className="text-xs text-muted-foreground">
                    {Number(styleProfile.earlyAdopterScore) > 0.7
                      ? 'You love trying new trends'
                      : Number(styleProfile.earlyAdopterScore) > 0.4
                      ? 'You balance trends with classics'
                      : 'You prefer timeless pieces'}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Luxury Affinity</p>
                  <Progress value={Number(styleProfile.luxuryAffinityScore) * 100} />
                  <p className="text-xs text-muted-foreground">
                    {Number(styleProfile.luxuryAffinityScore) > 0.7
                      ? 'You appreciate premium quality'
                      : Number(styleProfile.luxuryAffinityScore) > 0.4
                      ? 'You mix luxury with accessible pieces'
                      : 'You prioritize value and practicality'}
                  </p>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                <Icons.sparkles className="mr-2 h-4 w-4" />
                Get Personalized Style Report
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

function calculateCompleteness(profile: any): number {
  let score = 0
  const weights = {
    stylePersonas: 20,
    favoriteColors: 15,
    avoidedColors: 10,
    preferredBrands: 15,
    avoidedMaterials: 10,
    measurements: 15,
    pricePreferences: 15,
  }

  if (profile.stylePersonas.length > 0) score += weights.stylePersonas
  if (profile.favoriteColors.length > 0) score += weights.favoriteColors
  if (profile.avoidedColors.length > 0) score += weights.avoidedColors
  if (profile.preferredBrands.length > 0) score += weights.preferredBrands
  if (profile.avoidedMaterials.length > 0) score += weights.avoidedMaterials
  if (profile.measurements) score += weights.measurements
  if (profile.minPricePreference && profile.maxPricePreference) {
    score += weights.pricePreferences
  }

  return Math.round(score)
}
