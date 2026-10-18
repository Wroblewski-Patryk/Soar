import { Prisma } from '@prisma/client';
import { prisma } from '../../prisma/client';

export const resolveLiveAccountUpdateScope = async (input: {
  userId: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  marketType: 'FUTURES' | 'SPOT';
  sourceApiKeyId: string | null;
  client?: Prisma.TransactionClient;
}) => {
  if (!input.sourceApiKeyId) {
    console.warn(
      `[LiveExchangeAccountUpdate] user=${input.userId} symbol=${input.symbol} side=${input.side} marketType=${input.marketType} skipped: missing_source_api_key`
    );
    return [];
  }

  const candidates = await (input.client ?? prisma).position.findMany({
    where: {
      userId: input.userId,
      symbol: input.symbol,
      side: input.side,
      status: 'OPEN',
      syncState: 'IN_SYNC',
      OR: [
        {
          wallet: {
            mode: 'LIVE', exchange: 'BINANCE',
            marketType: input.marketType, apiKeyId: input.sourceApiKeyId,
          },
        },
        {
          bot: {
            mode: 'LIVE', exchange: 'BINANCE',
            marketType: input.marketType,
            OR: [
              { apiKeyId: input.sourceApiKeyId },
              { wallet: { apiKeyId: input.sourceApiKeyId } },
            ],
          },
        },
      ],
    },
    select: { id: true, origin: true, quantity: true, entryPrice: true,
      missingSince: true, missingSyncCount: true, continuityState: true,
      lastExchangeSeenAt: true, lastExchangeSyncAt: true,
      lastAccountSeenAt: true, lastAccountQuantity: true,
      lastAccountEntryPrice: true },
    orderBy: [{ openedAt: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }],
  });

  if (candidates.length <= 1) return candidates;
  console.warn(
    `[LiveExchangeAccountUpdate] user=${input.userId} symbol=${input.symbol} side=${input.side} marketType=${input.marketType} skipped: ambiguous_live_scope candidates=${candidates.length}`
  );
  return [];
};

export const matchesAccountSnapshot = (canonical: number, observed: number | null) =>
  observed == null || Math.abs(canonical - observed) <=
    1e-9 * Math.max(1, Math.abs(canonical), Math.abs(observed));

export const confirmedAccountSnapshotMatches = (input: {
  quantity: number; entryPrice: number;
  lastAccountSeenAt: Date | null; lastAccountQuantity: number | null;
  lastAccountEntryPrice: number | null;
}) => input.lastAccountSeenAt != null && input.lastAccountQuantity != null &&
  input.lastAccountEntryPrice != null &&
  matchesAccountSnapshot(input.quantity, input.lastAccountQuantity) &&
  matchesAccountSnapshot(input.entryPrice, input.lastAccountEntryPrice);

export const lockLivePosition = async (tx: Prisma.TransactionClient,
  userId: string, positionId: string) => {
  await tx.$queryRaw`SELECT "id" FROM "public"."Position"
    WHERE "id" = ${positionId} AND "userId" = ${userId} FOR UPDATE`;
};
