// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { UserRole } from '@prisma/client'

// Define route patterns and their required permissions
const routeConfig = {
  // Public routes (no authentication required)
  public: [
    '/',
    '/products',
    '/collections',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/api/products',
    '/api/collections',
    '/api/search',
  ],
  
  // Authentication routes (redirect if already authenticated)
  auth: ['/login', '/register', '/verify-request', '/reset-password'],
  
  // Protected routes (authentication required)
  protected: [
    '/account',
    '/checkout',
    '/orders',
    '/wishlist',
    '/profile',
    '/settings',
  ],
  
  // Admin routes (admin role required)
  admin: ['/admin'],
  
  // API routes that require authentication
  apiProtected: [
    '/api/account',
    '/api/orders',
    '/api/wishlist',
    '/api/cart',
    '/api/checkout',
    '/api/user',
  ],
  
  // API routes that require admin role
  apiAdmin: ['/api/admin'],
}

/**
 * Check if a path matches any pattern in an array
 */
function matchesPattern(path: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    if (pattern.endsWith('*')) {
      return path.startsWith(pattern.slice(0, -1))
    }
    return path === pattern || path.startsWith(pattern + '/')
  })
}

/**
 * Get route type for the given pathname
 */
function getRouteType(pathname: string): {
  type: 'public' | 'auth' | 'protected' | 'admin' | 'apiProtected' | 'apiAdmin'
  requiresAuth: boolean
  requiredRole?: UserRole
} {
  // Check admin routes first (most restrictive)
  if (matchesPattern(pathname, routeConfig.admin)) {
    return { type: 'admin', requiresAuth: true, requiredRole: 'ADMIN' }
  }
  
  if (matchesPattern(pathname, routeConfig.apiAdmin)) {
    return { type: 'apiAdmin', requiresAuth: true, requiredRole: 'ADMIN' }
  }
  
  // Check protected routes
  if (matchesPattern(pathname, routeConfig.protected)) {
    return { type: 'protected', requiresAuth: true }
  }
  
  if (matchesPattern(pathname, routeConfig.apiProtected)) {
    return { type: 'apiProtected', requiresAuth: true }
  }
  
  // Check auth routes
  if (matchesPattern(pathname, routeConfig.auth)) {
    return { type: 'auth', requiresAuth: false }
  }
  
  // Default to public
  return { type: 'public', requiresAuth: false }
}

/**
 * Main middleware function
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip middleware for static files, API routes we don't want to protect, etc.
  if (
    pathname.includes('/_next/') ||
    pathname.includes('/favicon.ico') ||
    pathname.includes('/api/auth/') ||
    pathname.includes('/api/webhooks/') ||
    pathname.includes('/api/health') ||
    pathname.includes('/api/public/')
  ) {
    return NextResponse.next()
  }
  
  // Get authentication token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })
  
  // Determine route requirements
  const routeInfo = getRouteType(pathname)
  
  // Handle authentication routes
  if (routeInfo.type === 'auth') {
    // Redirect authenticated users away from auth pages
    if (token) {
      const redirectUrl = request.nextUrl.searchParams.get('callbackUrl') || '/account'
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }
    return NextResponse.next()
  }
  
  // Handle routes that require authentication
  if (routeInfo.requiresAuth) {
    if (!token) {
      // Not authenticated - redirect to login
      const loginUrl = new URL('/login', request.url)
      
      // For API routes, return JSON error
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Authentication required', code: 'AUTH_REQUIRED' },
          { status: 401 }
        )
      }
      
      // For page routes, redirect to login with callback
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // Check role requirements
    if (routeInfo.requiredRole) {
      const userRole = token.role as UserRole
      
      // Super admin can access everything
      if (userRole !== 'SUPER_ADMIN') {
        // Check specific role requirements
        if (routeInfo.requiredRole === 'ADMIN' && !['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
          // For API routes, return JSON error
          if (pathname.startsWith('/api/')) {
            return NextResponse.json(
              { error: 'Insufficient permissions', code: 'FORBIDDEN' },
              { status: 403 }
            )
          }
          
          // For page routes, redirect to unauthorized page
          return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
      }
    }
  }
  
  // Add security headers
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // CSP for enhanced security
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://maps.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https: http:",
    "media-src 'self' blob: https:",
    "connect-src 'self' https: wss:",
    "frame-src 'self' https://js.stripe.com https://www.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)
  
  // Add user info to headers for server components (if authenticated)
  if (token) {
    response.headers.set('x-user-id', token.id)
    response.headers.set('x-user-role', token.role)
    response.headers.set('x-user-tier', token.membershipTier)
  }
  
  return response
}

/**
 * Configure which routes to run middleware on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
