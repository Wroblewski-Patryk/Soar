import { prisma } from '../../prisma/client';
import type { NormalizedBinanceAccountUpdateEvent } from
  '../exchange/binanceUserDataStream.types';
import { confirmedAccountSnapshotMatches, lockLivePosition,
  resolveLiveAccountUpdateScope } from './orders.exchangeAccountUpdateScope';

const normalizeSymbol = (symbol: string) => symbol.trim().toUpperCase().replace(/[/:]/g, '');

export const applyLiveExchangeAccountUpdateEvent = async (input: {
  userId: string;
  sourceApiKeyId?: string | null;
  event: NormalizedBinanceAccountUpdateEvent;
  afterInitialScopeRead?: () => Promise<void>;
}) => {
  let updatedPositions = 0;
  const eventAt = new Date(input.event.transactionTime ?? input.event.eventTime);
  for (const accountPosition of input.event.positions) {
    const symbol = normalizeSymbol(accountPosition.symbol);
    if (!symbol) continue;
    const side: 'LONG' | 'SHORT' = accountPosition.positionSide === 'LONG' ||
      accountPosition.positionSide === 'SHORT'
      ? accountPosition.positionSide
      : accountPosition.amount != null && accountPosition.amount < 0 ? 'SHORT' : 'LONG';
    const quantity = typeof accountPosition.amount === 'number' &&
      Number.isFinite(accountPosition.amount) ? Math.abs(accountPosition.amount) : null;
    const entryPrice = typeof accountPosition.entryPrice === 'number' &&
      Number.isFinite(accountPosition.entryPrice) ? accountPosition.entryPrice : null;
    const scope = { userId: input.userId, symbol, side,
      marketType: input.event.marketType, sourceApiKeyId: input.sourceApiKeyId ?? null };
    const initial = await resolveLiveAccountUpdateScope(scope);
    if (initial.length === 0) continue;
    await input.afterInitialScopeRead?.();
    updatedPositions += await prisma.$transaction(async (tx) => {
      await lockLivePosition(tx, input.userId, initial[0].id);
      // Recheck account binding, status and canonical values after the same
      // position-row lock that the DCA/CLOSE finalizer takes.
      const current = await resolveLiveAccountUpdateScope({ ...scope, client: tx });
      if (current.length !== 1 || current[0].id !== initial[0].id) return 0;
      const position = current[0];
      if (position.origin !== 'EXCHANGE_SYNC') {
        if ((quantity == null && entryPrice == null) ||
            (position.lastAccountSeenAt && eventAt <= position.lastAccountSeenAt) ||
            (position.lastExchangeSyncAt && eventAt < position.lastExchangeSyncAt)) return 0;
        const matches = confirmedAccountSnapshotMatches({
          quantity: position.quantity, entryPrice: position.entryPrice,
          lastAccountSeenAt: eventAt, lastAccountQuantity: quantity,
          lastAccountEntryPrice: entryPrice,
        });
        await tx.position.update({ where: { id: position.id }, data: {
          lastAccountSeenAt: eventAt, lastAccountQuantity: quantity,
          lastAccountEntryPrice: entryPrice,
          lastExchangeSeenAt: position.lastExchangeSeenAt &&
            position.lastExchangeSeenAt > eventAt ? position.lastExchangeSeenAt : eventAt,
          ...(matches ? {
            ...(position.continuityState === 'RECOVERING' ||
                position.continuityState === 'CONFIRMED' ? {
              continuityState: 'CONFIRMED', missingSince: null, missingSyncCount: 0,
            } : {}),
            ...(typeof accountPosition.unrealizedPnl === 'number' &&
                Number.isFinite(accountPosition.unrealizedPnl)
              ? { unrealizedPnl: accountPosition.unrealizedPnl } : {}),
          } : {
            continuityState: 'RECOVERING',
            missingSince: position.missingSince ?? eventAt,
            missingSyncCount: { increment: 1 },
          }),
        } });
        return 1;
      }
      if (quantity === 0) {
        await tx.position.update({ where: { id: position.id }, data: {
          syncState: 'DRIFT', continuityState: 'RECOVERING',
          unrealizedPnl: 0, missingSince: eventAt,
          lastExchangeSeenAt: eventAt, lastExchangeSyncAt: eventAt,
          missingSyncCount: { increment: 1 },
        } });
        return 1;
      }
      await tx.position.update({ where: { id: position.id }, data: {
        ...(quantity != null ? { quantity } : {}),
        ...(entryPrice != null ? { entryPrice } : {}),
        ...(typeof accountPosition.unrealizedPnl === 'number' &&
            Number.isFinite(accountPosition.unrealizedPnl)
          ? { unrealizedPnl: accountPosition.unrealizedPnl } : {}),
        lastExchangeSeenAt: eventAt, lastExchangeSyncAt: eventAt,
        missingSince: null, missingSyncCount: 0,
        continuityState: 'CONFIRMED',
      } });
      return 1;
    }, { timeout: 30_000, maxWait: 10_000 });
  }
  return { status: 'applied' as const, updatedPositions };
};
