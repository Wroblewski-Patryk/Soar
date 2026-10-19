import { Prisma, PrismaClient } from '@prisma/client';

export class GrantReservationError extends Error {
  constructor(readonly code: string) { super(code); }
}
export const deny = (code: string): never => { throw new GrantReservationError(code); };

export const representableNumber = (value: string) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || !new Prisma.Decimal(numeric.toString()).eq(value)) {
    return deny('INTENT_AMOUNT_NOT_REPRESENTABLE');
  }
  return numeric;
};

export const hasAtomicIntentBinding = async (
  db: PrismaClient | Prisma.TransactionClient, reservationId: string, intentId: string,
) => {
  const audit = await db.log.findFirst({ where: {
    entityType: 'ExternalClientGrantReservation', entityId: reservationId,
    action: 'EXTERNAL_CLIENT_GRANT_RESERVED',
  }, select: { metadata: true } });
  const metadata = audit?.metadata;
  return metadata && typeof metadata === 'object' && !Array.isArray(metadata) &&
    (metadata as Record<string, unknown>).boundIntentId === intentId;
};
