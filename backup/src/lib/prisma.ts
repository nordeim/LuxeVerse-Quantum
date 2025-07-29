// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

// Prevent multiple Prisma clients in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
  
  // Datasource configuration
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  
  // Error formatting
  errorFormat: 'pretty',
  
  // Connection pool settings for performance
  // These will be automatically configured in production
})

// Prevent hot reload from creating new instances
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

/**
 * Helper function to safely execute database operations
 */
export async function withDatabase<T>(
  operation: (db: PrismaClient) => Promise<T>
): Promise<T> {
  try {
    return await operation(prisma)
  } catch (error) {
    console.error('Database operation failed:', error)
    throw error
  }
}

/**
 * Helper function for database health check
 */
export async function isDatabaseHealthy(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch {
    return false
  }
}

/**
 * Helper function to get database metrics
 */
export async function getDatabaseMetrics() {
  try {
    const [userCount, productCount, orderCount] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
    ])
    
    return {
      users: userCount,
      products: productCount,
      orders: orderCount,
      healthy: true,
    }
  } catch (error) {
    return {
      users: 0,
      products: 0,
      orders: 0,
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
