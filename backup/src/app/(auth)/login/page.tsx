// src/app/(auth)/login/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, AlertCircle, Mail, Lock, Chrome } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface LoginForm {
  email: string
  password: string
}

interface LoginErrors {
  email?: string
  password?: string
  general?: string
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/account'
  const error = searchParams.get('error')
  
  // Form state
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  })
  
  const [errors, setErrors] = useState<LoginErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isEmailLogin, setIsEmailLogin] = useState(false)

  // Handle URL errors
  useEffect(() => {
    if (error) {
      const errorMessages: Record<string, string> = {
        OAuthSignin: 'Error occurred during sign in. Please try again.',
        OAuthCallback: 'Error occurred during OAuth callback. Please try again.',
        OAuthCreateAccount: 'Could not create OAuth account. Please try again.',
        EmailCreateAccount: 'Could not create account. Please try again.',
        Callback: 'Error occurred during callback. Please try again.',
        OAuthAccountNotLinked: 'This email is already associated with another account.',
        EmailSignin: 'Check your email for the sign in link.',
        CredentialsSignin: 'Invalid email or password. Please check your credentials.',
        SessionRequired: 'Please sign in to access this page.',
        default: 'An unexpected error occurred. Please try again.',
      }
      
      setErrors({
        general: errorMessages[error] || errorMessages.default
      })
    }
  }, [error])

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation (only for credentials login)
    if (!isEmailLogin) {
      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      if (isEmailLogin) {
        // Magic link sign in
        const result = await signIn('email', {
          email: formData.email.toLowerCase().trim(),
          redirect: false,
          callbackUrl,
        })

        if (result?.error) {
          setErrors({ general: 'Failed to send magic link. Please try again.' })
        } else {
          // Redirect to verification page
          router.push(`/verify-request?email=${encodeURIComponent(formData.email)}`)
        }
      } else {
        // Credentials sign in
        const result = await signIn('credentials', {
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          redirect: false,
        })

        if (result?.error) {
          if (result.error === 'CredentialsSignin') {
            setErrors({ 
              general: 'Invalid email or password. Please check your credentials and try again.' 
            })
          } else {
            setErrors({ 
              general: 'Sign in failed. Please try again.' 
            })
          }
        } else if (result?.ok) {
          // Successful login - redirect
          router.push(callbackUrl)
          router.refresh() // Refresh to update session
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ 
        general: 'An unexpected error occurred. Please try again.' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle OAuth sign in
   */
  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true)
    setErrors({})

    try {
      await signIn(provider, { 
        callbackUrl,
        redirect: true,
      })
    } catch (error) {
      console.error(`${provider} sign in error:`, error)
      setErrors({ 
        general: `Failed to sign in with ${provider}. Please try again.` 
      })
      setIsLoading(false)
    }
  }

  /**
   * Update form data
   */
  const updateFormData = (field: keyof LoginForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Welcome back
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Sign in to your LuxeVerse account to continue your luxury journey
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Error Alert */}
          {errors.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full h-12 font-medium"
              onClick={() => handleOAuthSignIn('google')}
              disabled={isLoading}
            >
              <Chrome className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Login Method Toggle */}
          <div className="flex space-x-2">
            <Button
              type="button"
              variant={!isEmailLogin ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => setIsEmailLogin(false)}
            >
              <Lock className="mr-2 h-4 w-4" />
              Password
            </Button>
            <Button
              type="button"
              variant={isEmailLogin ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => setIsEmailLogin(true)}
            >
              <Mail className="mr-2 h-4 w-4" />
              Magic Link
            </Button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@luxeverse.ai"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                disabled={isLoading}
                className={cn(
                  "h-12",
                  errors.email && "border-red-500 focus:border-red-500"
                )}
                required
                autoComplete="email"
                autoFocus
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field (only for credentials login) */}
            {!isEmailLogin && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Link 
                    href="/reset-password" 
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    disabled={isLoading}
                    className={cn(
                      "h-12 pr-12",
                      errors.password && "border-red-500 focus:border-red-500"
                    )}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEmailLogin ? 'Sending magic link...' : 'Signing in...'}
                </>
              ) : (
                <>
                  {isEmailLogin ? 'Send magic link' : 'Sign in'}
                </>
              )}
            </Button>
          </form>

          {/* Email Login Info */}
          {isEmailLogin && (
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
              We'll send you a secure link to sign in instantly
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link 
              href="/register" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Create one now
            </Link>
          </div>
          <div className="text-xs text-center text-gray-500">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="underline">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline">Privacy Policy</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
