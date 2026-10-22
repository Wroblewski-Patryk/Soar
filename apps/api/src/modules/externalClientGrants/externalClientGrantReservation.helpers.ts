import { Prisma, PrismaClient } from '@prisma/client';

export class GrantReservationError extends Error {
  constructor(readonly code: string) { super(code); }
}
export const deny = (code: string): never => { throw new GrantReservationError(code); };

const decimalPattern = /^(?:0|[1-9]\d{0,11})(?:\.\d{1,8})?$/;
export const positiveDecimal = (value: string) => {
  if (!decimalPattern.test(value)) return deny('INVALID_COMMAND_PRECISION');
  const parsed = new Prisma.Decimal(value);
  if (parsed.lte(0)) return deny('INVALID_COMMAND_AMOUNT');
  return parsed;
};

export const mockAuditMetadata = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown> : null;
export const exactMockNumber = (value: number | null, expected: Prisma.Decimal.Value) =>
  value != null && Number.isFinite(value) && new Prisma.Decimal(value.toString()).eq(expected);

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
