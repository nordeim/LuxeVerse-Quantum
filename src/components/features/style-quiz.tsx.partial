// src/components/features/style-quiz.tsx
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
          {
