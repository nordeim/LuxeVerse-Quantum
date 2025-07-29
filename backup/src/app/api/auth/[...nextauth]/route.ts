// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * NextAuth API route handler
 * Handles all authentication endpoints:
 * - /api/auth/signin
 * - /api/auth/signout
 * - /api/auth/callback/[provider]
 * - /api/auth/csrf
 * - /api/auth/session
 * - /api/auth/providers
 */
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
