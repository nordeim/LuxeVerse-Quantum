// src/hooks/use-session.ts
'use client'

import { useSession as useNextAuthSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'

export function useSession() {
  const { data: session, status, update } = useNextAuthSession()
  const router = useRouter()
  
  // Computed properties
  const user = session?.user
  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated'
  const isUnauthenticated = status === 'unauthenticated'
  
  // Role checks
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'
  const isSuperAdmin = user?.role === 'SUPER_ADMIN'
  const isVIP = user?.membershipTier === 'DIAMOND' || user?.membershipTier === 'OBSIDIAN'
  const isPremiumMember = user?.membershipTier !== 'PEARL'
  
  // Helper to require authentication
  const requireAuth = useCallback((redirectUrl?: string) => {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', window.location.origin)
      if (redirectUrl) {
        loginUrl.searchParams.set('callbackUrl', redirectUrl)
      }
      router.push(loginUrl.toString())
      return false
    }
    return true
  }, [isAuthenticated, router])
  
  // Helper to require specific role
  const requireRole = useCallback((role: string | string[], redirectUrl = '/403') => {
    const roles = Array.isArray(role) ? role : [role]
    
    if (!user || !roles.includes(user.role)) {
      router.push(redirectUrl)
      return false
    }
    return true
  }, [user, router])
  
  // Helper to require membership tier
  const requireMembership = useCallback((tier: string | string[], redirectUrl = '/account/membership') => {
    const tiers = Array.isArray(tier) ? tier : [tier]
    
    if (!user || !tiers.includes(user.membershipTier)) {
      const url = new URL(redirectUrl, window.location.origin)
      url.searchParams.set('upgrade', 'true')
      router.push(url.toString())
      return false
    }
    return true
  }, [user, router])
  
  // Update user data
  const updateUser = useCallback(async (data: Partial<typeof user>) => {
    await update({
      ...session,
      user: {
        ...user,
        ...data,
      },
    })
  }, [session, user, update])
  
  // Memoized return value
  return useMemo(() => ({
    // Session data
    session,
    user,
    status,
    
    // Status helpers
    isLoading,
    isAuthenticated,
    isUnauthenticated,
    
    // Role helpers
    isAdmin,
    isSuperAdmin,
    isVIP,
    isPremiumMember,
    
    // Methods
    update,
    updateUser,
    requireAuth,
    requireRole,
    requireMembership,
  }), [
    session,
    user,
    status,
    isLoading,
    isAuthenticated,
    isUnauthenticated,
    isAdmin,
    isSuperAdmin,
    isVIP,
    isPremiumMember,
    update,
    updateUser,
    requireAuth,
    requireRole,
    requireMembership,
  ])
}

// Type export for use in components
export type UseSessionReturn = ReturnType<typeof useSession>
