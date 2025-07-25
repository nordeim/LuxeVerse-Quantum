// src/lib/api.ts
import { createTRPCReact } from '@trpc/react-query'
import { type AppRouter } from '@/server/api/root'

/**
 * A set of type-safe react-query hooks for your tRPC API.
 */
export const api = createTRPCReact<AppRouter>()
