// src/components/providers/auth-provider.tsx
'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

interface AuthProviderProps {
  children: ReactNode
  session?: any
}

/**
 * Authentication provider component
 * Wraps the app with NextAuth SessionProvider
 */
export function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    <SessionProvider 
      session={session}
      refetchInterval={5 * 60} // Refetch session every 5 minutes
      refetchOnWindowFocus={true} // Refetch when window gains focus
      refetchWhenOffline={false} // Don't refetch when offline
    >
      {children}
    </SessionProvider>
  )
}

/**
 * Hook to check if user has specific role
 */
export function useRequireRole(requiredRole: string) {
  // This will be implemented in the custom hook file
  return true
}

/**
 * Hook to check if user has admin privileges
 */
export function useRequireAdmin() {
  // This will be implemented in the custom hook file
  return true
}
