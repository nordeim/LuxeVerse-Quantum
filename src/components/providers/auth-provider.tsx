// src/components/providers/auth-provider.tsx
'use client'

import { SessionProvider } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  
  useEffect(() => {
    // Hide loading screen after initial render
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <SessionProvider
      refetchInterval={5 * 60} // Refetch session every 5 minutes
      refetchOnWindowFocus={true}
      refetchWhenOffline={false}
    >
      {isLoading && pathname !== '/' ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
          <div className="space-y-4 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            <p className="text-sm text-muted-foreground animate-pulse">
              Preparing your luxury experience...
            </p>
          </div>
        </div>
      ) : (
        children
      )}
    </SessionProvider>
  )
}
