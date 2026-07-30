import { env } from '@lumos/env/database';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from './generated/prisma/client';

const prismaSingleton = () => {
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
  return new PrismaClient({ adapter });
};

type PrismaSingleton = ReturnType<typeof prismaSingleton>;

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaSingleton;
};

export const prisma = globalForPrisma.prisma ?? prismaSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
