// src/lib/auth.ts
import { NextAuthOptions, DefaultSession, getServerSession } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import { UserRole, MembershipTier } from '@prisma/client'
import { createTransport } from 'nodemailer'

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
    id: string
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

// Custom PrismaAdapter to handle our UUID-based schema
const customPrismaAdapter = () => {
  const adapter = PrismaAdapter(prisma)
  
  return {
    ...adapter,
    
    // Override createUser to handle our custom schema
    async createUser(user: any) {
      const newUser = await prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
          avatarUrl: user.image,
          emailVerified: user.emailVerified,
          role: 'CUSTOMER' as UserRole,
          membershipTier: 'PEARL' as MembershipTier,
          aiConsent: true,
          personalizationLevel: 5,
          preferredCurrency: 'USD',
          preferredLanguage: 'en',
          timezone: 'UTC',
        },
      })
      
      // Create audit log for user creation
      await prisma.auditLog.create({
        data: {
          userId: newUser.id,
          action: 'USER_CREATED',
          entityType: 'USER',
          entityId: newUser.id,
          newValues: { email: newUser.email, name: newUser.name },
        },
      })
      
      return {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        image: newUser.avatarUrl,
        emailVerified: newUser.emailVerified,
        role: newUser.role,
        membershipTier: newUser.membershipTier,
      }
    },

    // Override createSession to use our sessions table
    async createSession({ sessionToken, userId, expires }) {
      const session = await prisma.session.create({
        data: {
          sessionToken,
          userId,
          expiresAt: expires,
        },
      })
      
      return {
        sessionToken: session.sessionToken,
        userId: session.userId,
        expires: session.expiresAt,
      }
    },

    // Override getSessionAndUser to include our custom fields
    async getSessionAndUser(sessionToken: string) {
      const sessionAndUser = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      })
      
      if (!sessionAndUser) return null
      
      const { user, ...session } = sessionAndUser
      
      return {
        session: {
          sessionToken: session.sessionToken,
          userId: session.userId,
          expires: session.expiresAt,
        },
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatarUrl,
          emailVerified: user.emailVerified,
          role: user.role,
          membershipTier: user.membershipTier,
        },
      }
    },

    // Override updateUser to handle our schema
    async updateUser(user: any) {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          email: user.email,
          name: user.name,
          avatarUrl: user.image,
          emailVerified: user.emailVerified,
          updatedAt: new Date(),
        },
      })
      
      return {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        image: updatedUser.avatarUrl,
        emailVerified: updatedUser.emailVerified,
        role: updatedUser.role,
        membershipTier: updatedUser.membershipTier,
      }
    },

    // Override linkAccount for OAuth
    async linkAccount(account: any) {
      await prisma.oAuthAccount.create({
        data: {
          userId: account.userId,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at ? new Date(account.expires_at * 1000) : null,
          tokenType: account.token_type,
          scope: account.scope,
          idToken: account.id_token,
          sessionState: account.session_state,
        },
      })
      
      return account
    },
  }
}

// Email transport configuration
const createEmailTransport = () => {
  if (!process.env.EMAIL_SERVER_HOST) {
    console.warn('Email transport not configured')
    return null
  }
  
  return createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: process.env.EMAIL_SERVER_PORT === '465',
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })
}

export const authOptions: NextAuthOptions = {
  adapter: customPrismaAdapter(),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/login',
    signUp: '/register',
    error: '/login',
    verifyRequest: '/verify-request',
    newUser: '/welcome',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM || 'noreply@luxeverse.ai',
      async sendVerificationRequest({ identifier: email, url, provider }) {
        const transport = createEmailTransport()
        if (!transport) return
        
        const { host } = new URL(url)
        
        await transport.sendMail({
          to: email,
          from: provider.from,
          subject: `Sign in to ${host}`,
          text: `Sign in to ${host}\n${url}\n\n`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #FF006E, #00D9FF); padding: 40px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 2rem;">LuxeVerse</h1>
                <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your luxury experience awaits</p>
              </div>
              <div style="padding: 40px; background: #fafafa;">
                <h2 style="color: #333; margin-bottom: 20px;">Sign in to continue</h2>
                <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
                  Click the button below to securely sign in to your LuxeVerse account:
                </p>
                <div style="text-align: center;">
                  <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #FF006E, #8B00FF); color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: 600;">
                    Sign In to LuxeVerse
                  </a>
                </div>
                <p style="color: #999; font-size: 0.9rem; margin-top: 30px; text-align: center;">
                  This link will expire in 24 hours. If you didn't request this, please ignore this email.
                </p>
              </div>
            </div>
          `,
        })
      },
    }),
    
    CredentialsProvider({
      id: 'credentials',
      name: 'Email and Password',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'you@luxeverse.ai',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: '••••••••',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password')
        }

        // Find user in database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
          include: {
            _count: {
              select: { loyaltyPoints: true },
            },
          },
        })

        if (!user || !user.passwordHash) {
          throw new Error('No account found with this email')
        }

        // Verify password
        const isPasswordValid = await compare(credentials.password, user.passwordHash)
        if (!isPasswordValid) {
          throw new Error('Invalid password')
        }

        // Update login count and last login
        await prisma.user.update({
          where: { id: user.id },
          data: {
            lastLoginAt: new Date(),
            loginCount: { increment: 1 },
          },
        })

        // Create audit log
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: 'USER_LOGIN',
            entityType: 'USER',
            entityId: user.id,
          },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatarUrl,
          role: user.role,
          membershipTier: user.membershipTier,
          emailVerified: user.emailVerified,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.role = user.role
        token.membershipTier = user.membershipTier
        token.emailVerified = user.emailVerified
      }

      // Handle token refresh or updates
      if (trigger === 'update' && session) {
        // Update token with new session data
        if (session.name) token.name = session.name
        if (session.email) token.email = session.email
      }

      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.membershipTier = token.membershipTier
        session.user.emailVerified = token.emailVerified
      }

      return session
    },

    async signIn({ user, account, profile, email, credentials }) {
      // For OAuth providers, ensure email is verified
      if (account?.provider === 'google') {
        return true
      }

      // For credentials, user is already validated in authorize
      if (account?.provider === 'credentials') {
        return true
      }

      // For email provider, allow sign in
      if (account?.provider === 'email') {
        return true
      }

      return true
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      
      return baseUrl
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`User ${user.email} signed in via ${account?.provider}`)
      
      // Track login in analytics
      if (user.id) {
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: 'USER_SIGNIN',
            entityType: 'USER',
            entityId: user.id,
            newValues: {
              provider: account?.provider,
              isNewUser,
            },
          },
        }).catch(console.error)
      }
    },

    async signOut({ session, token }) {
      console.log(`User signed out`)
      
      if (session?.user?.id) {
        await prisma.auditLog.create({
          data: {
            userId: session.user.id,
            action: 'USER_SIGNOUT',
            entityType: 'USER',
            entityId: session.user.id,
          },
        }).catch(console.error)
      }
    },

    async createUser({ user }) {
      console.log(`New user created: ${user.email}`)
      
      // Initialize user data
      if (user.id) {
        // Create default wishlist
        await prisma.wishlist.create({
          data: {
            userId: user.id,
            name: 'My Wishlist',
          },
        }).catch(console.error)

        // Award welcome bonus points
        await prisma.loyaltyPoint.create({
          data: {
            userId: user.id,
            type: 'earned',
            points: 1000,
            balanceAfter: 1000,
            source: 'welcome_bonus',
            description: 'Welcome to LuxeVerse! Enjoy 1000 bonus points.',
          },
        }).catch(console.error)
      }
    },
  },
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      console.error(`NextAuth Error: ${code}`, metadata)
    },
    warn(code) {
      console.warn(`NextAuth Warning: ${code}`)
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`NextAuth Debug: ${code}`, metadata)
      }
    },
  },
}

/**
 * Helper function to get server-side session
 */
export const getServerAuthSession = () => getServerSession(authOptions)

/**
 * Helper function to require authentication on server
 */
export const requireAuth = async () => {
  const session = await getServerAuthSession()
  if (!session) {
    throw new Error('Authentication required')
  }
  return session
}

/**
 * Helper function to require specific role
 */
export const requireRole = async (requiredRole: UserRole) => {
  const session = await requireAuth()
  if (session.user.role !== requiredRole && session.user.role !== 'SUPER_ADMIN') {
    throw new Error(`${requiredRole} role required`)
  }
  return session
}

/**
 * Helper function to require admin role
 */
export const requireAdmin = async () => {
  const session = await requireAuth()
  if (!['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    throw new Error('Admin role required')
  }
  return session
}
