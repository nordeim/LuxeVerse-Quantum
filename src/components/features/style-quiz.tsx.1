'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Icons } from '@/components/ui/icons'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface StyleQuizProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const quizQuestions = [
  {
    id: 'style_personality',
    question: 'Which best describes your style personality?',
    options: [
      { value: 'classic', label: 'Classic & Timeless', icon: Icons.crown },
      { value: 'trendy', label: 'Trendy & Fashion-Forward', icon: Icons.sparkles },
      { value: 'minimalist', label: 'Minimalist & Clean', icon: Icons.minimize },
      { value: 'eclectic', label: 'Eclectic & Bold', icon: Icons.zap },
    ],
  },
  {
    id: 'color_preference',
    question: 'What colors do you gravitate towards?',
    options: [
      { value: 'neutral', label: 'Neutrals (Black, White, Beige)', color: '#8B8B8B' },
      { value: 'earth', label: 'Earth Tones (Brown, Green, Rust)', color: '#8B4513' },
      { value: 'jewel', label: 'Jewel Tones (Emerald, Sapphire)', color: '#50C878' },
      { value: 'pastel', label: 'Pastels (Soft Pink, Blue)', color: '#FFB6C1' },
    ],
  },
  {
    id: 'occasion',
    question: 'What do you shop for most often?',
    options: [
      { value: 'work', label: 'Work & Professional', icon: Icons.briefcase },
      { value: 'casual', label: 'Casual & Everyday', icon: Icons.coffee },
      { value: 'evening', label: 'Evening & Special Events', icon: Icons.star },
      { value: 'mixed', label: 'A Mix of Everything', icon: Icons.layers },
    ],
  },
  {
    id: 'fit_preference',
    question: 'How do you prefer your clothes to fit?',
    options: [
      { value: 'fitted', label: 'Fitted & Tailored' },
      { value: 'relaxed', label: 'Relaxed & Comfortable' },
      { value: 'oversized', label: 'Oversized & Loose' },
      { value: 'varies', label: 'It Varies by Piece' },
    ],
  },
  {
    id: 'shopping_motivation',
    question: 'What motivates your purchases?',
    options: [
      { value: 'quality', label: 'Quality & Craftsmanship', icon: Icons.gem },
      { value: 'trends', label: 'Latest Trends', icon: Icons.trendingUp },
      { value: 'versatility', label: 'Versatility & Practicality', icon: Icons.repeat },
      { value: 'unique', label: 'Unique & Statement Pieces', icon: Icons.star },
    ],
  },
  {
    id: 'price_range',
    question: 'What\'s your typical budget per item?',
    options: [
      { value: { min: 0, max: 200 }, label: 'Under $200' },
      { value: { min: 200, max: 500 }, label: '$200 - $500' },
      { value: { min: 500, max: 1000 }, label: '$500 - $1,000' },
      { value: { min: 1000, max: 10000 }, label: '$1,000+' },
    ],
  },
  {
    id: 'sustainability',
    question: 'How important is sustainability to you?',
    options: [
      { value: 'very_important', label: 'Very Important', icon: Icons.leaf },
      { value: 'important', label: 'Somewhat Important' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'not_important', label: 'Not a Priority' },
    ],
  },
  {
    id: 'brand_preference',
    question: 'Do you have brand preferences?',
    options: [
      { value: 'luxury_only', label: 'Luxury Brands Only' },
      { value: 'mix_high_low', label: 'Mix of High & Low' },
      { value: 'emerging', label: 'Emerging Designers' },
      { value: 'no_preference', label: 'No Preference' },
    ],
  },
]

export function StyleQuiz({ open, onOpenChange }: StyleQuizProps) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const generateProfileMutation = api.ai.generateStyleProfile.useMutation({
    onSuccess: () => {
      toast({
        title: 'Style profile created!',
        description: 'Your personalized recommendations are ready.',
      })
      onOpenChange(false)
      router.push('/account/style-profile')
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create style profile',
        variant: 'destructive',
      })
    },
  })

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100
  const question = quizQuestions[currentQuestion]
  const isLastQuestion = currentQuestion === quizQuestions.length - 1

  const handleAnswer = (value: any) => {
    setAnswers({ ...answers, [question.id]: value })
    
    if (isLastQuestion) {
      // Submit the quiz
      generateProfileMutation.mutate({
        quizAnswers: { ...answers, [question.id]: value },
        favoriteProductIds: selectedProducts,
      })
    } else {
      // Go to next question
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSkip = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Discover Your Style</DialogTitle>
          <DialogDescription>
            Answer a few questions to get personalized recommendations
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{question.question}</h3>
            
            <RadioGroup
              value={answers[question.id]}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {question.options.map((option) => {
                const Icon = option.icon
                return (
                  <Label
                    key={option.value}
                    htmlFor={option.value}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors",
                      answers[question.id] === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    )}
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      className="sr-only"
                    />
                    
                    {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
                    
                    {option.color && (
                      <div
                        className="h-5 w-5 rounded-full border"
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                    
                    <span className="flex-1">{option.label}</span>
                    
                    {answers[question.id] === option.value && (
                      <Icons.check className="h-5 w-5 text-primary" />
                    )}
                  </Label>
                )
              })}
            </RadioGroup>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentQuestion === 0}
            >
              <Icons.chevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={handleSkip}
              >
                Skip Quiz
              </Button>
              
              {isLastQuestion && (
                <Button
                  onClick={() => handleAnswer(answers[question.id])}
                  disabled={!answers[question.id] || generateProfileMutation.isPending}
                >
                  {generateProfileMutation.isPending ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Creating Profile...
                    </>
                  ) : (
                    <>
                      Complete
                      <Icons.check className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
