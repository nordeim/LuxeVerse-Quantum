// src/app/(auth)/login/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'

// Form validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().default(false),
})

type LoginFormData = z.infer<typeof loginSchema>

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

const cardVariants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: { delay: 0.1, duration: 0.3 }
  },
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/account'
  const error = searchParams.get('error')
  
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: true,
    },
  })
  
  // Focus email field on mount
  useEffect(() => {
    setFocus('email')
  }, [setFocus])
  
  // Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    
    try {
      const result = await signIn('credentials', {
        email: data.email.toLowerCase(),
        password: data.password,
        redirect: false,
      })
      
      if (result?.error) {
        // Handle specific error types
        if (result.error === 'CredentialsSignin') {
          toast({
            title: 'Invalid credentials',
            description: 'Please check your email and password',
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
          })
        }
      } else {
        // Success - show welcome message
        toast({
          title: 'Welcome back!',
          description: 'Redirecting to your account...',
        })
        
        // Small delay for toast to be visible
        setTimeout(() => {
          router.push(callbackUrl)
          router.refresh()
        }, 1000)
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: 'Something went wrong',
        description: 'Please try again later',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle OAuth sign in
  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    setIsLoading(true)
    
    try {
      await signIn(provider, { 
        callbackUrl,
        redirect: true,
      })
    } catch (error) {
      console.error('OAuth error:', error)
      toast({
        title: 'Authentication failed',
        description: 'There was a problem signing in with ' + provider,
        variant: 'destructive',
      })
      setIsLoading(false)
    }
  }
  
  // Handle magic link sign in
  const handleMagicLink = async () => {
    const email = prompt('Enter your email for magic link sign in:')
    if (!email) return
    
    setIsLoading(true)
    
    try {
      const result = await signIn('email', {
        email: email.toLowerCase(),
        redirect: false,
        callbackUrl,
      })
      
      if (result?.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Check your email',
          description: 'We sent you a magic link to sign in',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send magic link',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <motion.div
      className="min-h-screen flex"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div 
          className="w-full max-w-md space-y-8"
          variants={cardVariants}
        >
          {/* Logo */}
          <div className="text-center">
            <Link href="/" className="inline-block">
              <h1 className="text-4xl font-bold tracking-tight">LUXEVERSE</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Luxury Redefined
              </p>
            </Link>
          </div>
          
          <Card className="border-0 shadow-2xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
              <CardDescription className="text-center">
                Sign in to access your exclusive account
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Error Alert */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert variant="destructive">
                      <Icons.alertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {error === 'OAuthAccountNotLinked'
                          ? 'This email is already associated with another sign-in method'
                          : 'Authentication failed. Please try again.'}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* OAuth Buttons */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full relative"
                  onClick={() => handleOAuthSignIn('google')}
                  disabled={isLoading}
                >
                  <Icons.google className="mr-2 h-4 w-4" />
                  Continue with Google
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full relative"
                  onClick={() => handleOAuthSignIn('apple')}
                  disabled={isLoading}
                >
                  <Icons.apple className="mr-2 h-4 w-4" />
                  Continue with Apple
                </Button>
              </div>
              
              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or sign in with email
                  </span>
                </div>
              </div>
              
              {/* Login Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Icons.mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-9"
                      disabled={isLoading}
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Icons.lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className="pl-9 pr-9"
                      disabled={isLoading}
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <Icons.eyeOff className="h-4 w-4" />
                      ) : (
                        <Icons.eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    {...register('rememberMe')}
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Remember me for 30 days
                  </Label>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading || isSubmitting}
                >
                  {isLoading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
              
              {/* Magic Link Option */}
              <div className="text-center">
                <button
                  onClick={handleMagicLink}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  disabled={isLoading}
                >
                  Sign in with magic link instead
                </button>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 pt-6">
              <div className="text-center text-sm">
                <span className="text-muted-foreground">New to LuxeVerse? </span>
                <Link href="/register" className="font-medium text-primary hover:underline">
                  Create an account
                </Link>
              </div>
              
              <p className="text-xs text-center text-muted-foreground">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="underline hover:text-primary">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline hover:text-primary">
                  Privacy Policy
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
      
      {/* Right side - Brand Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <Image
          src="/images/auth-luxury-bg.jpg"
          alt="Luxury fashion"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/20" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white text-center space-y-6 max-w-md">
            <motion.h2
              className="text-5xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Welcome to Luxury
            </motion.h2>
            <motion.p
              className="text-xl text-white/90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Experience exclusive collections, personalized recommendations, and 
              unparalleled service in the world of high fashion.
            </motion.p>
            <motion.div
              className="flex items-center justify-center space-x-6 pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm text-white/80">Luxury Items</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm text-white/80">Designer Brands</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-white/80">Concierge Service</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
