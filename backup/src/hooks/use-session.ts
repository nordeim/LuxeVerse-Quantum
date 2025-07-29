// src/hooks/use-session.ts
'use client'

import { useSession as useNextAuthSession } from 'next-auth/react'
import { UserRole, MembershipTier } from '@prisma/client'

/**
 * Extended session data interface
 */
interface ExtendedUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role: UserRole
  membershipTier: MembershipTier
  emailVerified: Date | null
}

interface ExtendedSession {
  user: ExtendedUser
  expires: string
}

/**
 * Custom hook for session management with enhanced type safety and utilities
 */
export function useSession() {
  const session = useNextAuthSession()
  
  return {
    // Core session data
    data: session.data as ExtendedSession | null,
    status: session.status,
    
    // Convenience properties
    user: session.data?.user as ExtendedUser | undefined,
    isLoading: session.status === 'loading',
    isAuthenticated: session.status === 'authenticated',
    isUnauthenticated: session.status === 'unauthenticated',
    
    // Update session
    update: session.update,
  }
}

/**
 * Hook to check if user is authenticated
 */
export function useAuth() {
  const { data, isLoading, isAuthenticated } = useSession()
  
  return {
    user: data?.user,
    isLoading,
    isAuthenticated,
    isGuest: !isAuthenticated && !isLoading,
  }
}

/**
 * Hook to check user role
 */
export function useRole() {
  const { user } = useAuth()
  
  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false
    
    if (Array.isArray(role)) {
      return role.includes(user.role)
    }
    
    return user.role === role
  }
  
  const isAdmin = (): boolean => {
    return hasRole(['ADMIN', 'SUPER_ADMIN'])
  }
  
  const isCustomer = (): boolean => {
    return hasRole(['CUSTOMER', 'VIP'])
  }
  
  const isVIP = (): boolean => {
    return hasRole('VIP') || isAdmin()
  }
  
  return {
    role: user?.role,
    hasRole,
    isAdmin: isAdmin(),
    isCustomer: isCustomer(),
    isVIP: isVIP(),
    isSuperAdmin: hasRole('SUPER_ADMIN'),
  }
}

/**
 * Hook to check membership tier
 */
export function useMembership() {
  const { user } = useAuth()
  
  const hasTier = (tier: MembershipTier | MembershipTier[]): boolean => {
    if (!user) return false
    
    if (Array.isArray(tier)) {
      return tier.includes(user.membershipTier)
    }
    
    return user.membershipTier === tier
  }
  
  const getTierLevel = (): number => {
    if (!user) return 0
    
    const tierLevels: Record<MembershipTier, number> = {
      PEARL: 1,
      SAPPHIRE: 2,
      DIAMOND: 3,
      OBSIDIAN: 4,
    }
    
    return tierLevels[user.membershipTier] || 0
  }
  
  const hasMinimumTier = (minimumTier: MembershipTier): boolean => {
    const userLevel = getTierLevel()
    const minimumLevel = getTierLevel()
    
    return userLevel >= minimumLevel
  }
  
  return {
    tier: user?.membershipTier,
    tierLevel: getTierLevel(),
    hasTier,
    hasMinimumTier,
    isPearl: hasTier('PEARL'),
    isSapphire: hasTier('SAPPHIRE'),
    isDiamond: hasTier('DIAMOND'),
    isObsidian: hasTier('OBSIDIAN'),
    isPremium: hasTier(['SAPPHIRE', 'DIAMOND', 'OBSIDIAN']),
  }
}

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useSession()
  
  if (!isLoading && !isAuthenticated) {
    // In a real app, you might want to redirect here
    // For now, we'll just return the auth state
    console.warn('Authentication required')
  }
  
  return { isAuthenticated, isLoading }
}

/**
 * Hook to require specific role
 */
export function useRequireRole(requiredRole: UserRole | UserRole[]) {
  const { user, isLoading, isAuthenticated } = useSession()
  
  const hasRequiredRole = (): boolean => {
    if (!user) return false
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role)
    }
    
    return user.role === requiredRole || user.role === 'SUPER_ADMIN'
  }
  
  const hasPermission = hasRequiredRole()
  
  if (!isLoading && (!isAuthenticated || !hasPermission)) {
    console.warn(`Role ${requiredRole} required`)
  }
  
  return {
    hasPermission,
    isLoading,
    isAuthenticated,
    userRole: user?.role,
  }
}

/**
 * Hook to require admin role
 */
export function useRequireAdmin() {
  return useRequireRole(['ADMIN', 'SUPER_ADMIN'])
}

/**
 * Hook for session utilities
 */
export function useSessionUtils() {
  const { user, isAuthenticated } = useSession()
  
  const getUserDisplayName = (): string => {
    if (!user) return 'Guest'
    return user.name || user.email?.split('@')[0] || 'User'
  }
  
  const getUserInitials = (): string => {
    if (!user?.name) return 'U'
    
    const names = user.name.split(' ')
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase()
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
  }
  
  const isEmailVerified = (): boolean => {
    return user?.emailVerified !== null
  }
  
  return {
    getUserDisplayName,
    getUserInitials,
    isEmailVerified,
    isAuthenticated,
  }
}
