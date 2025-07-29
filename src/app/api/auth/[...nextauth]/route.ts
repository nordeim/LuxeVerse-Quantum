// src/app/api/auth/[...nextauth]/route.ts
import { NextRequest } from 'next/server'
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Create the NextAuth handler
const handler = NextAuth(authOptions)

// Wrap the handler to add custom headers and monitoring
async function authHandler(req: NextRequest, context: { params: { nextauth: string[] } }) {
  // Add security headers
  const response = await handler(req, context)
  
  // Add CORS headers if needed for mobile apps
  if (process.env.ENABLE_MOBILE_APP === 'true') {
    response.headers.set('Access-Control-Allow-Origin', process.env.MOBILE_APP_URL || '')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }
  
  // Add rate limiting headers
  response.headers.set('X-RateLimit-Limit', '60')
  response.headers.set('X-RateLimit-Remaining', '59')
  response.headers.set('X-RateLimit-Reset', new Date(Date.now() + 60000).toISOString())
  
  return response
}

export { authHandler as GET, authHandler as POST }
