import { PrismaClient } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  prismaDirect: PrismaClient | undefined
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const adapterDirect = new PrismaPg({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL })

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })
export const prismaDirect = globalForPrisma.prismaDirect ?? new PrismaClient({ adapter: adapterDirect })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
  globalForPrisma.prismaDirect = prismaDirect
}
