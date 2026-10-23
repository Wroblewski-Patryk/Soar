import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

config();
const runtimeUrl = process.env.DATABASE_URL;
const databaseUrl = process.env.TEST_DATABASE_URL
  ? new URL(process.env.TEST_DATABASE_URL)
  : runtimeUrl ? new URL(runtimeUrl) : null;
if (!databaseUrl || !['postgres:', 'postgresql:'].includes(databaseUrl.protocol)) {
  throw new Error('OrderFill preflight requires a PostgreSQL test database URL');
}
if (!process.env.TEST_DATABASE_URL) {
  if (!['localhost', '127.0.0.1', '[::1]'].includes(databaseUrl.hostname)) {
    throw new Error('OrderFill preflight requires explicit TEST_DATABASE_URL outside localhost');
  }
  databaseUrl.pathname += '_test';
}
if (!decodeURIComponent(databaseUrl.pathname.slice(1)).endsWith('_test') ||
    (runtimeUrl && databaseUrl.toString() === new URL(runtimeUrl).toString())) {
  throw new Error('OrderFill preflight requires a separate database ending in _test');
}
const prisma = new PrismaClient({ datasources: { db: { url: databaseUrl.toString() } } });
try {
  const groups = await prisma.$queryRaw`
    SELECT COUNT(*)::integer AS count FROM (
      SELECT 1 FROM "OrderFill"
      GROUP BY "orderId", "exchangeTradeId" HAVING COUNT(*) > 1
    ) AS duplicate_pairs
  `;
  const count = Number(groups[0]?.count ?? 0);
  if (count) {
    console.error(`OrderFill identity preflight FAIL: ${count} duplicate pair(s) require reviewed reconciliation.`);
    process.exitCode = 1;
  } else {
    console.log('OrderFill identity preflight PASS: no duplicate order/fill pairs.');
  }
} finally {
  await prisma.$disconnect();
}
