// src/lib/auth.ts
import { NextAuthOptions, DefaultSession, getServerSession } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import AppleProvider from 'next-auth/providers/apple'
import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import { z } from 'zod'
import { nanoid } from 'nanoid'

// Extend the built-in session types
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: UserRole
      membershipTier: MembershipTier
      emailVerified: Date | null
    } & DefaultSession['user']
  }

  interface User {
    role: UserRole
    membershipTier: MembershipTier
    emailVerified: Date | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
    membershipTier: MembershipTier
    emailVerified: Date | null
  }
}

// Validation schemas
const credentialsSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  
  // Configure session strategy
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  
  // Custom pages for luxury branding
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/welcome',
  },
  
  // Configure providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    
    AppleProvider({
      clientId: process.env.APPLE_ID!,
      clientSecret: process.env.APPLE_SECRET!,
    }),
    
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      maxAge: 24 * 60 * 60, // Magic links valid for 24 hours
    }),
    
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'you@example.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        try {
          // Validate input
          const { email, password } = credentialsSchema.parse(credentials)
          
          // Find user with style profile for personalization
          const user = await prisma.user.findUnique({
            where: { 
              email: email.toLowerCase(),
              deletedAt: null, // Ensure user is not soft-deleted
            },
            select: {
              id: true,
              email: true,
              emailVerified: true,
              name: true,
              passwordHash: true,
              avatarUrl: true,
              role: true,
              membershipTier: true,
              loginCount: true,
            },
          })
          
          if (!user || !user.passwordHash) {
            // Prevent timing attacks by comparing with a dummy hash
            await compare('dummy', '$2a$12$dummy.hash.to.prevent.timing.attacks')
            return null
          }
          
          // Verify password
          const isPasswordValid = await compare(password, user.passwordHash)
          
          if (!isPasswordValid) {
            // Log failed attempt for security monitoring
            await prisma.auditLog.create({
              data: {
                action: 'LOGIN_FAILED',
                entityType: 'user',
                entityId: user.id,
                metadata: {
                  reason: 'invalid_password',
                  email: email.toLowerCase(),
                },
              },
            })
            return null
          }
          
          // Update last login and increment login count
          await prisma.user.update({
            where: { id: user.id },
            data: {
              lastLoginAt: new Date(),
              loginCount: user.loginCount + 1,
            },
          })
          
          // Return user object for JWT
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatarUrl,
            role: user.role,
            membershipTier: user.membershipTier,
            emailVerified: user.emailVerified,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  
  // Callbacks for token and session management
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Check if user is banned or suspended
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
        select: { deletedAt: true },
      })
      
      if (dbUser?.deletedAt) {
        return false
      }
      
      // For OAuth providers, update profile info
      if (account?.provider && account.provider !== 'credentials') {
        await prisma.user.update({
          where: { email: user.email! },
          data: {
            name: user.name || profile?.name,
            avatarUrl: user.image || profile?.image,
            emailVerified: new Date(), // OAuth emails are pre-verified
          },
        })
      }
      
      return true
    },
    
    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.role = user.role
        token.membershipTier = user.membershipTier
        token.emailVerified = user.emailVerified
      }
      
      // Update token if user data changes
      if (trigger === 'update' && session) {
        token.name = session.name
        token.email = session.email
        token.image = session.image
      }
      
      // Refresh user data periodically
      if (token.id && trigger === 'update') {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: {
            role: true,
            membershipTier: true,
            emailVerified: true,
            deletedAt: true,
          },
        })
        
        if (dbUser && !dbUser.deletedAt) {
          token.role = dbUser.role
          token.membershipTier = dbUser.membershipTier
          token.emailVerified = dbUser.emailVerified
        }
      }
      
      return token
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.membershipTier = token.membershipTier
        session.user.emailVerified = token.emailVerified
      }
      
      return session
    },
    
    async redirect({ url, baseUrl }) {
      // Allow relative URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      
      // Allow URLs on the same origin
      if (new URL(url).origin === baseUrl) return url
      
      // Default redirect
      return baseUrl
    },
  },
  
  // Event handlers for analytics and monitoring
  events: {
    async signIn({ user, account, isNewUser }) {
      // Track sign in event
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_LOGIN',
          entityType: 'user',
          entityId: user.id,
          metadata: {
            provider: account?.provider || 'credentials',
            isNewUser,
          },
        },
      })
      
      // Welcome new users with a notification
      if (isNewUser) {
        await prisma.notification.create({
          data: {
            userId: user.id,
            type: 'MEMBERSHIP_UPDATE',
            title: 'Welcome to LuxeVerse',
            message: 'Your journey into luxury begins here. Explore our curated collections and enjoy exclusive member benefits.',
            actionUrl: '/products',
            actionLabel: 'Start Shopping',
          },
        })
      }
    },
    
    async signOut({ token }) {
      // Track sign out event
      if (token?.id) {
        await prisma.auditLog.create({
          data: {
            userId: token.id,
            action: 'USER_LOGOUT',
            entityType: 'user',
            entityId: token.id,
          },
        })
      }
    },
    
    async createUser({ user }) {
      // Initialize user preferences and style profile
      await prisma.styleProfile.create({
        data: {
          userId: user.id,
          stylePersonas: [],
          favoriteColors: [],
          preferredBrands: [],
          avoidedMaterials: [],
          avoidedColors: [],
        },
      })
      
      // Create default wishlist
      await prisma.wishlist.create({
        data: {
          userId: user.id,
          name: 'My Wishlist',
          isPublic: false,
          shareToken: nanoid(10),
        },
      })
      
      // Grant welcome bonus loyalty points
      await prisma.loyaltyPoint.create({
        data: {
          userId: user.id,
          type: 'WELCOME_BONUS',
          points: 500,
          balanceAfter: 500,
          description: 'Welcome to LuxeVerse!',
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        },
      })
    },
  },
  
  // Security options
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // Enable debug in development
  debug: process.env.NODE_ENV === 'development',
}

// Helper function to get server-side session
export const getServerAuthSession = () => getServerSession(authOptions)

// Helper function to require authentication
export async function requireAuth() {
  const session = await getServerAuthSession()
  
  if (!session) {
    throw new Error('Unauthorized')
  }
  
  return session
}

// Helper function to require specific role
export async function requireRole(role: UserRole | UserRole[]) {
  const session = await requireAuth()
  const roles = Array.isArray(role) ? role : [role]
  
  if (!roles.includes(session.user.role)) {
    throw new Error('Insufficient permissions')
  }
  
  return session
}
