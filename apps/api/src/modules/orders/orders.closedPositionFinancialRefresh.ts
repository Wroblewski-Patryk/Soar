import { Prisma } from '@prisma/client';

import { settleImportedRuntimeCloseFinancials } from '../positions/importedPositionRuntimeFinancialSettlement';
import { resolveKnownEntryFeesInTransaction } from './orders.exchangeEventFinalization.service';

export const computeCloseRealizedPnl = async (input: {
  tx: Prisma.TransactionClient;
  userId: string;
  positionId: string;
  positionSide: 'LONG' | 'SHORT';
  entryPrice: number;
  closePrice: number;
  closeQuantity: number;
  contractSize: number | null;
  exitFee: number;
  exitFeePending: boolean;
  imported: boolean;
}) => {
  if (input.contractSize != null && input.contractSize !== 1) return null;
  const entryLegSide = input.positionSide === 'LONG' ? 'BUY' : 'SELL';
  const entryFees = await resolveKnownEntryFeesInTransaction(input.tx, {
    userId: input.userId, positionId: input.positionId,
    entrySide: entryLegSide, imported: input.imported,
  });
  if (entryFees == null || input.exitFeePending) return null;
  const grossPnl = input.positionSide === 'LONG'
    ? (input.closePrice - input.entryPrice) * input.closeQuantity
    : (input.entryPrice - input.closePrice) * input.closeQuantity;
  return grossPnl - entryFees - input.exitFee;
};

/** Recomputes a closed position when an OPEN/DCA order gains canonical fee truth. */
export const refreshClosedPositionPnlAfterEntryFee = async (input: {
  tx: Prisma.TransactionClient;
  userId: string;
  orderId: string;
}) => {
  const order = await input.tx.order.findFirst({
    where: { id: input.orderId, userId: input.userId },
    select: { fee: true, feePending: true, feeSource: true },
  });
  if (!order || order.feePending || order.feeSource !== 'EXCHANGE_FILL' || order.fee == null) return;
  const entryTrades = await input.tx.trade.findMany({
    where: { userId: input.userId, orderId: input.orderId, lifecycleAction: { in: ['OPEN', 'DCA'] },
      feePending: false, feeSource: 'EXCHANGE_FILL', positionId: { not: null } },
    select: { positionId: true },
  });
  const positionIds = [...new Set(entryTrades.map((trade) => trade.positionId).filter((id): id is string => id != null))];
  for (const positionId of positionIds) {
    await input.tx.$queryRaw(Prisma.sql`SELECT "id" FROM "Position" WHERE "id" = ${positionId} FOR UPDATE`);
    const position = await input.tx.position.findFirst({
      where: { id: positionId, userId: input.userId, status: 'CLOSED' },
      select: { side: true, entryPrice: true, origin: true, contractSize: true },
    });
    if (!position) continue;
    const closeTrades = await input.tx.trade.findMany({
      where: { userId: input.userId, positionId, lifecycleAction: 'CLOSE' },
      select: { id: true, symbol: true, price: true, quantity: true, fee: true,
        feeSource: true, order: { select: { feePending: true, feeSource: true } } },
    });
    if (closeTrades.length !== 1) continue;
    const close = closeTrades[0];
    const canonicalExitFee = close.fee != null && close.feeSource === 'EXCHANGE_FILL' &&
      close.order?.feeSource === 'EXCHANGE_FILL' && close.order.feePending === false;
    if (!canonicalExitFee) continue;
    const realizedPnl = await computeCloseRealizedPnl({
      tx: input.tx, userId: input.userId, positionId,
      positionSide: position.side, entryPrice: position.entryPrice,
      closePrice: close.price, closeQuantity: close.quantity,
      contractSize: position.contractSize,
      exitFee: close.fee!, exitFeePending: false, imported: position.origin === 'EXCHANGE_SYNC',
    });
    if (realizedPnl == null) continue;
    await input.tx.trade.update({ where: { id: close.id }, data: { realizedPnl, feePending: false } });
    await input.tx.position.update({ where: { id: positionId }, data: { realizedPnl } });
    await settleImportedRuntimeCloseFinancials({
      tx: input.tx, userId: input.userId, positionId,
      symbol: close.symbol, realizedPnl, exitFees: close.fee!,
    });
  }
};
