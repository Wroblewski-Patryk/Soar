import { Prisma } from '@prisma/client';

// Both LIVE submission and exchange snapshot import take this transaction lock
// before checking and creating a local row for the same exchange identity.
export const lockExchangeOrderIdentity = async (
  tx: Prisma.TransactionClient,
  userId: string,
  exchangeOrderId: string
) => {
  await tx.$queryRaw`SELECT 1 AS locked FROM (SELECT pg_advisory_xact_lock(hashtext(${userId}), hashtext(${exchangeOrderId}))) AS acquired`;
};
