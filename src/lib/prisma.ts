import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined;
}

export const prisma = globalThis.__prismaClient ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prismaClient = prisma;
}
