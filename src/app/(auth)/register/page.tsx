// src/app/(auth)/register/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'
import { toast } from '@/components/ui/use-toast'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Registration schema with progressive validation
const registrationSchema = z.object({
  // Step 1: Account details
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  
  // Step 2: Personal information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  
  // Step 3: Preferences
  preferredCurrency: z.string().default('USD'),
  newsletter: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  
  // Terms
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
  ageConfirmation: z.boolean().refine(val => val === true, {
    message: 'You must be 18 or older to create an account',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type RegistrationFormData = z.infer<typeof registrationSchema>

// Registration steps
const steps = [
  { id: 'account', name: 'Account', description: 'Create your login credentials' },
  { id: 'personal', name: 'Personal', description: 'Tell us about yourself' },
  { id: 'preferences', name: 'Preferences', description: 'Customize your experience' },
]

export default function RegisterPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
    setValue,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange',
    defaultValues: {
      preferredCurrency: 'USD',
      newsletter: true,
      smsNotifications: false,
    },
  })
  
  const password = watch('password')
  
  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0)
      return
    }
    
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 12.5
    if (/[^A-Za-z0-9]/.test(password)) strength += 12.5
    
    setPasswordStrength(strength)
  }, [password])
  
  // Validate current step before proceeding
  const validateStep = async () => {
    const stepFields = {
      0: ['email', 'password', 'confirmPassword'],
      1: ['firstName', 'lastName'],
      2: ['agreeToTerms', 'ageConfirmation'],
    }
    
    const fieldsToValidate = stepFields[currentStep as keyof typeof stepFields] || []
    const result = await trigger(fieldsToValidate as any)
    
    return result
  }
  
  const handleNext = async () => {
    const isStepValid = await validateStep()
    
    if (isStepValid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
    }
  }
  
  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }
  
  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email.toLowerCase(),
          password: data.password,
          name: `${data.firstName} ${data.lastName}`,
          phone: data.phone,
          preferences: {
            currency: data.preferredCurrency,
            newsletter: data.newsletter,
            smsNotifications: data.smsNotifications,
          },
        }),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Registration failed')
      }
      
      // Show success message
      toast({
        title: 'Welcome to LuxeVerse!',
        description: 'Your account has been created successfully.',
      })
      
      // Auto-login or redirect to login
      setTimeout(() => {
        router.push('/login?registered=true')
      }, 1500)
    } catch (error) {
      console.error('Registration error:', error)
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-red-500'
    if (passwordStrength < 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }
  
  const getPasswordStrengthText = () => {
    if (passwordStrength < 50) return 'Weak'
    if (passwordStrength < 75) return 'Moderate'
    return 'Strong'
  }
  
  return (
    <div className="min-h-screen flex">
      {/* Left side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-lg space-y-8">
          {/* Logo */}
          <div className="text-center">
            <Link href="/" className="inline-block">
              <h1 className="text-4xl font-bold tracking-tight">LUXEVERSE</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Begin Your Luxury Journey
              </p>
            </Link>
          </div>
          
          <Card className="border-0 shadow-2xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center">Create Account</CardTitle>
              <CardDescription className="text-center">
                Join the exclusive world of luxury fashion
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex-1 text-center ${
                        index !== steps.length - 1 ? 'relative' : ''
                      }`}
                    >
                      <div
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors ${
                          index <= currentStep
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-muted-foreground text-muted-foreground'
                        }`}
                      >
                        {index < currentStep ? (
                          <Icons.check className="h-4 w-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <p className="mt-1 text-xs">{step.name}</p>
                    </div>
                  ))}
                </div>
                <Progress value={(currentStep + 1) / steps.length * 100} className="h-2" />
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <AnimatePresence mode="wait">
                  {/* Step 1: Account Details */}
                  {currentStep === 0 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          {...register('email')}
                          disabled={isLoading}
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            {...register('password')}
                            disabled={isLoading}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? (
                              <Icons.eyeOff className="h-4 w-4" />
                            ) : (
                              <Icons.eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {password && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span>Password strength:</span>
                              <span className={`font-medium ${
                                passwordStrength >= 75 ? 'text-green-600' : 
                                passwordStrength >= 50 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {getPasswordStrengthText()}
                              </span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all ${getPasswordStrengthColor()}`}
                                style={{ width: `${passwordStrength}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {errors.password && (
                          <p className="text-sm text-destructive">{errors.password.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type={showPassword ? 'text' : 'password'}
                          {...register('confirmPassword')}
                          disabled={isLoading}
                        />
                        {errors.confirmPassword && (
                          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Step 2: Personal Information */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            {...register('firstName')}
                            disabled={isLoading}
                          />
                          {errors.firstName && (
                            <p className="text-sm text-destructive">{errors.firstName.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            {...register('lastName')}
                            disabled={isLoading}
                          />
                          {errors.lastName && (
                            <p className="text-sm text-destructive">{errors.lastName.message}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          Phone Number <span className="text-muted-foreground">(Optional)</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          {...register('phone')}
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">
                          Date of Birth <span className="text-muted-foreground">(Optional)</span>
                        </Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          {...register('dateOfBirth')}
                          disabled={isLoading}
                        />
                        <p className="text-xs text-muted-foreground">
                          We'll use this to send you a special birthday surprise
                        </p>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Step 3: Preferences */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="preferredCurrency">Preferred Currency</Label>
                        <Select
                          defaultValue="USD"
                          onValueChange={(value) => setValue('preferredCurrency', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">GBP - British Pound</SelectItem>
                            <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                            <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="newsletter"
                            {...register('newsletter')}
                          />
                          <div className="space-y-1">
                            <Label htmlFor="newsletter" className="font-normal cursor-pointer">
                              Email Newsletter
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Receive exclusive offers, new collection previews, and style insights
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="smsNotifications"
                            {...register('smsNotifications')}
                          />
                          <div className="space-y-1">
                            <Label htmlFor="smsNotifications" className="font-normal cursor-pointer">
                              SMS Notifications
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Get order updates and exclusive early access via text
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="agreeToTerms"
                            {...register('agreeToTerms')}
                          />
                          <Label htmlFor="agreeToTerms" className="font-normal cursor-pointer text-sm">
                            I agree to the{' '}
                            <Link href="/terms" className="text-primary hover:underline">
                              Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-primary hover:underline">
                              Privacy Policy
                            </Link>
                          </Label>
                        </div>
                        {errors.agreeToTerms && (
                          <p className="text-sm text-destructive">{errors.agreeToTerms.message}</p>
                        )}
                        
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="ageConfirmation"
                            {...register('ageConfirmation')}
                          />
                          <Label htmlFor="ageConfirmation" className="font-normal cursor-pointer text-sm">
                            I confirm that I am 18 years of age or older
                          </Label>
                        </div>
                        {errors.ageConfirmation && (
                          <p className="text-sm text-destructive">{errors.ageConfirmation.message}</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 0 || isLoading}
                  >
                    <Icons.arrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  
                  {currentStep < steps.length - 1 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={isLoading}
                    >
                      Next
                      <Icons.arrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading || !isValid}
                    >
                      {isLoading ? (
                        <>
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <Icons.check className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 pt-6">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or sign up with
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => signIn('google')} disabled={isLoading}>
                  <Icons.google className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button variant="outline" onClick={() => signIn('apple')} disabled={isLoading}>
                  <Icons.apple className="mr-2 h-4 w-4" />
                  Apple
                </Button>
              </div>
              
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Right side - Lifestyle Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <Image
          src="/images/register-luxury-bg.jpg"
          alt="Luxury lifestyle"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/30" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white text-center space-y-8 max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-5xl font-bold tracking-tight">
                Join the Elite
              </h2>
              <p className="text-xl text-white/90">
                Unlock access to exclusive collections, personalized styling services, 
                and members-only events.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-4">
                <h3 className="text-2xl font-semibold">Member Benefits</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-center space-x-3">
                    <Icons.check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span>Early access to new collections</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Icons.check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span>Personal styling consultations</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Icons.check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span>Exclusive member pricing</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Icons.check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span>Free shipping & returns</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Icons.check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span>VIP customer support</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
