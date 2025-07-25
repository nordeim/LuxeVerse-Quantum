// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { UserRole, MembershipTier } from '@prisma/client'

// Request validation schema
const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  marketingConsent: z.boolean().optional().default(false),
})

/**
 * Handle user registration
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = registerSchema.parse(body)
    
    const { name, email, password, marketingConsent } = validatedData

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    })

    if (existingUser) {
      return NextResponse.json(
        { 
          error: 'Account already exists',
          message: 'An account with this email address already exists. Please sign in instead.',
        },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await hash(password, 12)

    // Get client IP for audit log
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Create user with transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: 'CUSTOMER' as UserRole,
          membershipTier: 'PEARL' as MembershipTier,
          aiConsent: true,
          personalizationLevel: 5,
          preferredCurrency: 'USD',
          preferredLanguage: 'en',
          timezone: 'UTC',
          styleProfileCompleted: false,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          membershipTier: true,
          createdAt: true,
        },
      })

      // Create audit log for user creation
      await tx.auditLog.create({
        data: {
          userId: newUser.id,
          action: 'USER_REGISTERED',
          entityType: 'USER',
          entityId: newUser.id,
          newValues: {
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            membershipTier: newUser.membershipTier,
            marketingConsent,
          },
          ipAddress: clientIP,
          userAgent,
        },
      })

      // Create default wishlist
      await tx.wishlist.create({
        data: {
          userId: newUser.id,
          name: 'My Wishlist',
        },
      })

      // Award welcome bonus loyalty points
      await tx.loyaltyPoint.create({
        data: {
          userId: newUser.id,
          type: 'earned',
          points: 1000,
          balanceAfter: 1000,
          source: 'welcome_bonus',
          description: 'Welcome to LuxeVerse! Enjoy 1000 bonus points to start your luxury journey.',
        },
      })

      // Create initial style profile (empty but ready for completion)
      await tx.styleProfile.create({
        data: {
          userId: newUser.id,
          stylePersonas: [],
          favoriteColors: [],
          avoidedColors: [],
          preferredBrands: [],
          avoidedMaterials: [],
          prefersSustainable: false,
          prefersExclusive: false,
          earlyAdopterScore: 0.5,
          luxuryAffinityScore: 0.5,
        },
      })

      return newUser
    })

    // Send welcome email (async, don't wait for it)
    sendWelcomeEmail(result.email, result.name).catch(console.error)

    // Return success response (exclude sensitive data)
    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: {
          id: result.id,
          name: result.name,
          email: result.email,
          role: result.role,
          membershipTier: result.membershipTier,
        },
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {}
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          fieldErrors[err.path[0] as string] = err.message
        }
      })

      return NextResponse.json(
        {
          error: 'Validation failed',
          message: 'Please check your input and try again.',
          errors: fieldErrors,
        },
        { status: 400 }
      )
    }

    // Handle Prisma unique constraint errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        {
          error: 'Account already exists',
          message: 'An account with this email address already exists.',
        },
        { status: 409 }
      )
    }

    // Generic error response
    return NextResponse.json(
      {
        error: 'Registration failed',
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    )
  }
}

/**
 * Send welcome email to new user
 */
async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  try {
    // This would integrate with your email service (Resend, SendGrid, etc.)
    const emailData = {
      to: email,
      subject: 'Welcome to LuxeVerse - Your Luxury Journey Begins',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #FF006E, #00D9FF); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 2.5rem; font-weight: bold;">LuxeVerse</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9; font-size: 1.1rem;">Welcome to the future of luxury</p>
          </div>
          
          <div style="padding: 40px; background: #fafafa;">
            <h2 style="color: #333; margin-bottom: 20px;">Welcome, ${name}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Thank you for joining LuxeVerse, where luxury meets innovation. Your account has been created successfully, and you're now part of an exclusive community that values sophistication, quality, and personalized experiences.
            </p>
            
            <div style="background: linear-gradient(135deg, rgba(255, 0, 110, 0.1), rgba(0, 217, 255, 0.1)); padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">🎁 Welcome Bonus</h3>
              <p style="color: #666; margin-bottom: 0;">You've received <strong>1,000 loyalty points</strong> to start your luxury journey!</p>
            </div>
            
            <h3 style="color: #333; margin-top: 30px;">What's next?</h3>
            <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
              <li>Complete your style profile for personalized recommendations</li>
              <li>Explore our curated collections</li>
              <li>Experience AI-powered styling assistance</li>
              <li>Enjoy exclusive member benefits</li>
            </ul>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXTAUTH_URL}/welcome" style="display: inline-block; background: linear-gradient(135deg, #FF006E, #8B00FF); color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: 600;">
                Start Exploring
              </a>
            </div>
          </div>
          
          <div style="padding: 20px; text-align: center; background: #f0f0f0; color: #999; font-size: 0.9rem;">
            <p>Need help? Contact us at <a href="mailto:support@luxeverse.ai" style="color: #FF006E;">support@luxeverse.ai</a></p>
            <p style="margin-top: 10px;">
              <a href="${process.env.NEXTAUTH_URL}/unsubscribe" style="color: #999; text-decoration: underline;">Unsubscribe</a> |
              <a href="${process.env.NEXTAUTH_URL}/privacy" style="color: #999; text-decoration: underline; margin-left: 10px;">Privacy Policy</a>
            </p>
          </div>
        </div>
      `,
    }

    // Send email via your email service
    // await emailService.send(emailData)
    console.log('Welcome email would be sent to:', email)

  } catch (error) {
    console.error('Failed to send welcome email:', error)
    // Don't throw error - email failure shouldn't break registration
  }
}

/**
 * Handle OPTIONS request for CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
