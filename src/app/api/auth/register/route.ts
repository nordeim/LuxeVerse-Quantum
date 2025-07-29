// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'
import { sendEmail } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'

// Input validation schema
const registerSchema = z.object({
  email: z.string().email().transform(str => str.toLowerCase()),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, 'Password must contain uppercase')
    .regex(/[a-z]/, 'Password must contain lowercase')
    .regex(/[0-9]/, 'Password must contain number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain special character'),
  name: z.string().min(2).max(100),
  phone: z.string().optional(),
  preferences: z.object({
    currency: z.string().default('USD'),
    newsletter: z.boolean().default(true),
    smsNotifications: z.boolean().default(false),
  }).optional(),
})

// Rate limiter instance
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting
    const identifier = req.ip ?? 'anonymous'
    const { success } = await limiter.check(identifier, 5) // 5 requests per minute
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      )
    }
    
    // Parse and validate request body
    const body = await req.json()
    const validatedData = registerSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: { id: true },
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }
    
    // Hash password with high cost factor
    const hashedPassword = await hash(validatedData.password, 12)
    
    // Generate verification token
    const verificationToken = nanoid(32)
    
    // Create user with transaction
    const user = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          email: validatedData.email,
          passwordHash: hashedPassword,
          name: validatedData.name,
          phone: validatedData.phone,
          preferredCurrency: validatedData.preferences?.currency || 'USD',
          role: 'CUSTOMER',
          membershipTier: 'PEARL', // Start with free tier
        },
      })
      
      // Create style profile
      await tx.styleProfile.create({
        data: {
          userId: newUser.id,
          stylePersonas: [],
          favoriteColors: [],
          preferredBrands: [],
          avoidedMaterials: [],
          avoidedColors: [],
        },
      })
      
      // Create default wishlist
      await tx.wishlist.create({
        data: {
          userId: newUser.id,
          name: 'My Wishlist',
          isPublic: false,
          shareToken: nanoid(10),
        },
      })
      
      // Grant welcome bonus
      await tx.loyaltyPoint.create({
        data: {
          userId: newUser.id,
          type: 'WELCOME_BONUS',
          points: 500,
          balanceAfter: 500,
          description: 'Welcome to LuxeVerse!',
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      })
      
      // Create welcome notification
      await tx.notification.create({
        data: {
          userId: newUser.id,
          type: 'MEMBERSHIP_UPDATE',
          title: 'Welcome to LuxeVerse!',
          message: 'Your luxury journey begins here. Explore our exclusive collections and enjoy 500 bonus points.',
          actionUrl: '/products',
          actionLabel: 'Start Shopping',
        },
      })
      
      // Log registration event
      await tx.auditLog.create({
        data: {
          userId: newUser.id,
          action: 'USER_REGISTERED',
          entityType: 'user',
          entityId: newUser.id,
          metadata: {
            source: 'web',
            preferences: validatedData.preferences,
          },
        },
      })
      
      return newUser
    })
    
    // Send welcome email
    await sendEmail({
      to: user.email,
      subject: 'Welcome to LuxeVerse - Your Journey Begins',
      template: 'welcome',
      data: {
        name: user.name,
        verificationToken,
        loyaltyPoints: 500,
      },
    })
    
    // Return success response
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      message: 'Account created successfully. Please check your email to verify your account.',
    })
  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid input',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      )
    }
    
    // Generic error response
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
}
