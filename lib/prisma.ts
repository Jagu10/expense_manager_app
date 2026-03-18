import { PrismaClient } from './generated/prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma || new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_4eP7qIQoOGXw@ep-raspy-tree-amfebhob-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 