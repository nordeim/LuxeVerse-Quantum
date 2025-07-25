// src/server/api/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { type NextRequest } from 'next/server'
import { getServerAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import superjson from 'superjson'
import { ZodError } from 'zod'

/**
 * Create tRPC context
 * This is called for every tRPC request
 */
export const createTRPCContext = async (
  opts: CreateNextContextOptions | { req: NextRequest }
) => {
  const { req } = opts
  
  // Get the session from the request
  const session = await getServerAuthSession()
  
  // Get client IP and user agent for analytics
  const clientIP = req.headers.get?.('x-forwarded-for') || 
                   req.headers.get?.('x-real-ip') || 
                   'unknown'
  
  const userAgent = req.headers.get?.('user-agent') || 'unknown'
  
  return {
    session,
    prisma,
    req,
    clientIP,
    userAgent,
    // Add any other context data needed
  }
}

type Context = Awaited<ReturnType<typeof createTRPCContext>>

/**
 * Initialize tRPC with context
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
        httpStatus: shape.data.httpStatus,
      },
    }
  },
})

/**
 * Create a server-side caller
 */
export const createCallerFactory = t.createCallerFactory

/**
 * Base router and procedures
 */
export const createTRPCRouter = t.router
export const mergeRouters = t.mergeRouters

/**
 * Public procedure - no authentication required
 */
export const publicProcedure = t.procedure.use(async ({ ctx, next }) => {
  // Add performance timing
  const start = Date.now()
  
  const result = await next()
  
  const duration = Date.now() - start
  
  // Log slow queries in development
  if (process.env.NODE_ENV === 'development' && duration > 1000) {
    console.warn(`Slow tRPC query: ${duration}ms`)
  }
  
  return result
})

/**
 * Protected procedure - requires authentication
 */
export const protectedProcedure = t.procedure
  .use(async ({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ 
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to access this resource',
      })
    }
    
    return next({
      ctx: {
        ...ctx,
        session: { ...ctx.session, user: ctx.session.user },
      },
    })
  })

/**
 * Admin procedure - requires admin role
 */
export const adminProcedure = protectedProcedure
  .use(async ({ ctx, next }) => {
    const userRole = ctx.session.user.role as UserRole
    
    if (!['ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
      throw new TRPCError({ 
        code: 'FORBIDDEN',
        message: 'Admin access required',
      })
    }
    
    return next({
      ctx: {
        ...ctx,
        session: { ...ctx.session, user: ctx.session.user },
      },
    })
  })

/**
 * VIP procedure - requires VIP or higher role
 */
export const vipProcedure = protectedProcedure
  .use(async ({ ctx, next }) => {
    const userRole = ctx.session.user.role as UserRole
    
    if (!['VIP', 'ADMIN', 'SUPER_ADMIN'].includes(userRole)) {
      throw new TRPCError({ 
        code: 'FORBIDDEN',
        message: 'VIP access required',
      })
    }
    
    return next()
  })

/**
 * Rate limited procedure - for expensive operations
 */
export const rateLimitedProcedure = publicProcedure
  .use(async ({ ctx, next }) => {
    // Simple in-memory rate limiting (in production, use Redis)
    const key = `rate_limit:${ctx.clientIP}`
    
    // For now, just proceed (implement proper rate limiting in production)
    return next()
  })

/**
 * Cached procedure - for frequently accessed data
 */
export const cachedProcedure = publicProcedure
  .use(async ({ ctx, next }) => {
    // Add caching logic here if needed
    return next()
  })

/**
 * Analytics procedure - tracks usage
 */
export const analyticsProcedure = t.procedure
  .use(async ({ ctx, next, path, type }) => {
    // Track API usage
    const start = Date.now()
    
    try {
      const result = await next()
      
      // Log successful requests in development
      if (process.env.NODE_ENV === 'development') {
        const duration = Date.now() - start
        console.log(`tRPC ${type} ${path}: ${duration}ms`)
      }
      
      return result
    } catch (error) {
      // Log errors
      console.error(`tRPC ${type} ${path} error:`, error)
      throw error
    }
  })

/**
 * Helper to create input schema validation
 */
export function createInputSchema<T>(schema: T) {
  return schema
}

/**
 * Helper to create paginated responses
 */
export function createPaginatedResponse<T>(
  items: T[],
  cursor: string | null,
  hasMore: boolean
) {
  return {
    items,
    nextCursor: cursor,
    hasMore,
  }
}

/**
 * Helper to handle database errors
 */
export function handleDatabaseError(error: unknown): never {
  console.error('Database error:', error)
  
  if (error instanceof Error) {
    if (error.message.includes('Unique constraint')) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Resource already exists',
      })
    }
    
    if (error.message.includes('Foreign key constraint')) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Referenced resource not found',
      })
    }
  }
  
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Database operation failed',
  })
}
