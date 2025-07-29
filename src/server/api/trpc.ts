// src/server/api/trpc.ts
/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */

import { initTRPC, TRPCError } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { type Session } from 'next-auth'
import superjson from 'superjson'
import { ZodError } from 'zod'

import { getServerAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkDatabaseConnection } from '@/lib/prisma'
import type { UserRole } from '@prisma/client'

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts

  // Get the session from the server using the getServerSession wrapper function
  const session = await getServerAuthSession()

  // Check database connection health
  const isDbConnected = await checkDatabaseConnection()
  if (!isDbConnected) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Database connection failed',
    })
  }

  return {
    session,
    prisma,
    req,
    res,
    // Add request metadata for logging/analytics
    metadata: {
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'],
      timestamp: new Date(),
    },
  }
}

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router

/**
 * Middleware for timing procedures
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now()

  const result = await next()

  const durationMs = Date.now() - start
  console.log(`[tRPC] ${path} took ${durationMs}ms`)

  return result
})

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(timingMiddleware)

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    return next({
      ctx: {
        // infers the `session` as non-nullable
        session: { ...ctx.session, user: ctx.session.user },
      },
    })
  })

/**
 * Admin procedure
 *
 * If you want a query or mutation to ONLY be accessible to users with admin role.
 */
export const adminProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    const userRole = ctx.session.user.role as UserRole
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      throw new TRPCError({ code: 'FORBIDDEN' })
    }

    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user },
      },
    })
  })

/**
 * VIP procedure
 *
 * For VIP-only features
 */
export const vipProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    const userRole = ctx.session.user.role as UserRole
    if (userRole !== 'VIP' && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      throw new TRPCError({ 
        code: 'FORBIDDEN',
        message: 'This feature is exclusive to VIP members',
      })
    }

    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user },
      },
    })
  })
