import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
try {
  const duplicateGroups = await prisma.$queryRaw`
    SELECT COUNT(*)::integer AS count FROM (
      SELECT 1 FROM "Order" WHERE "exchangeOrderId" IS NOT NULL
      GROUP BY "userId", "exchangeOrderId" HAVING COUNT(*) > 1
    ) AS duplicate_pairs
  `;
  const count = Number(duplicateGroups[0]?.count ?? 0);
  if (count > 0) {
    console.error(`LIVE order identity preflight FAIL: ${count} duplicate pair(s) require reviewed reconciliation.`);
    process.exitCode = 1;
  } else {
    console.log('LIVE order identity preflight PASS: no duplicate user/order pairs.');
  }
} finally {
  await prisma.$disconnect();
}
