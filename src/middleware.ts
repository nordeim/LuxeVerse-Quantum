// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Define route configurations
const routeConfig = {
  // Public routes that don't require authentication
  public: [
    '/',
    '/products',
    '/products/[slug]',
    '/collections',
    '/collections/[slug]',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ],
  
  // Auth routes that should redirect if already authenticated
  auth: ['/login', '/register', '/forgot-password', '/reset-password'],
  
  // Protected routes requiring authentication
  protected: [
    '/account',
    '/account/orders',
    '/account/wishlist',
    '/account/addresses',
    '/account/settings',
    '/checkout',
  ],
  
  // Admin routes requiring admin role
  admin: ['/admin', '/admin/*'],
  
  // VIP routes requiring VIP membership
  vip: ['/vip', '/vip/*', '/exclusive-collections'],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for API routes (except auth), static files, and images
  if (
    pathname.startsWith('/api/') && !pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp)$/)
  ) {
    return NextResponse.next()
  }
  
  // Get the user's token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })
  
  // Check if the route is an auth page
  const isAuthPage = routeConfig.auth.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  // Check if the route is protected
  const isProtectedRoute = routeConfig.protected.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  // Check if the route is admin-only
  const isAdminRoute = routeConfig.admin.some(route => 
    pathname === route || 
    (route.endsWith('/*') && pathname.startsWith(route.slice(0, -2)))
  )
  
  // Check if the route is VIP-only
  const isVipRoute = routeConfig.vip.some(route => 
    pathname === route || 
    (route.endsWith('/*') && pathname.startsWith(route.slice(0, -2)))
  )
  
  // Create response
  const response = NextResponse.next()
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Handle auth pages (redirect if already authenticated)
  if (isAuthPage && token) {
    const redirectUrl = request.nextUrl.searchParams.get('callbackUrl') || '/account'
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }
  
  // Handle protected routes
  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }
  
  // Handle admin routes
  if (isAdminRoute) {
    if (!token || token.role !== 'ADMIN' && token.role !== 'SUPER_ADMIN') {
      // Log unauthorized access attempt
      console.warn(`Unauthorized admin access attempt: ${pathname} by ${token?.email || 'anonymous'}`)
      return NextResponse.redirect(new URL('/403', request.url))
    }
  }
  
  // Handle VIP routes
  if (isVipRoute) {
    if (!token || (token.membershipTier !== 'DIAMOND' && token.membershipTier !== 'OBSIDIAN')) {
      // Redirect to membership upgrade page
      const url = new URL('/account/membership', request.url)
      url.searchParams.set('upgrade', 'true')
      url.searchParams.set('returnUrl', pathname)
      return NextResponse.redirect(url)
    }
  }
  
  // Add user context to headers for server components
  if (token) {
    response.headers.set('x-user-id', token.id)
    response.headers.set('x-user-role', token.role)
    response.headers.set('x-user-tier', token.membershipTier)
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
