import { PrismaClient } from '@prisma/client';
import { resolvePrismaDatabaseUrl } from './databaseUrl';

const datasourceUrl = resolvePrismaDatabaseUrl(process.env.DATABASE_URL);

export const prisma = new PrismaClient(
  datasourceUrl
    ? {
        datasources: {
          db: { url: datasourceUrl },
        },
      }
    : undefined,
);
