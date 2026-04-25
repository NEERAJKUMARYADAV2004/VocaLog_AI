import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 1. Setup the connection pool
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// 2. Setup the Prisma 7 adapter
const adapter = new PrismaPg(pool);

// 3. Initialize the client with the adapter
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;