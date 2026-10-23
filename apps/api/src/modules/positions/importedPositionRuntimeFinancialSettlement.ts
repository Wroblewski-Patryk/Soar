import { Prisma } from '@prisma/client';
import { prisma } from '../../prisma/client';

type Settlement = { realizedPnl: number; feesPaid: number };

const readSettlement = (value: unknown): Settlement | null => {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  return typeof record.realizedPnl === 'number' && Number.isFinite(record.realizedPnl) &&
    typeof record.feesPaid === 'number' && Number.isFinite(record.feesPaid)
    ? { realizedPnl: record.realizedPnl, feesPaid: record.feesPaid } : null;
};

export const settleImportedRuntimeCloseFinancials = async (input: {
  tx: Prisma.TransactionClient;
  userId: string;
  positionId: string;
  symbol: string;
  realizedPnl: number;
  exitFees: number;
}) => {
  const { tx } = input;
  const events = await tx.botRuntimeEvent.findMany({
    where: {
      userId: input.userId, eventType: 'POSITION_CLOSED',
      payload: { path: ['positionId'], equals: input.positionId },
    },
    select: { id: true },
  });
  if (events.length === 0) return;
  if (events.length !== 1) throw new Error('Ambiguous imported runtime close settlement event');

  await tx.$queryRaw(Prisma.sql`SELECT "id" FROM "BotRuntimeEvent" WHERE "id" = ${events[0].id} FOR UPDATE`);
  const event = await tx.botRuntimeEvent.findUniqueOrThrow({ where: { id: events[0].id } });
  const payload = event.payload && typeof event.payload === 'object' && !Array.isArray(event.payload)
    ? event.payload as Record<string, unknown> : {};
  const previous = readSettlement(payload.financialSettlement);
  if (payload.financialPnlPending !== true && !previous) return;
  const priorPnl = previous?.realizedPnl ?? 0;
  const priorFees = previous?.feesPaid ?? 0;
  const priorProfit = priorPnl >= 0 && previous ? priorPnl : 0;
  const priorLoss = priorPnl < 0 && previous ? Math.abs(priorPnl) : 0;
  const nextProfit = input.realizedPnl >= 0 ? input.realizedPnl : 0;
  const nextLoss = input.realizedPnl < 0 ? Math.abs(input.realizedPnl) : 0;
  const deltaPnl = input.realizedPnl - priorPnl;
  const deltaFees = input.exitFees - priorFees;
  const deltaWins = (input.realizedPnl >= 0 ? 1 : 0) - (previous && priorPnl >= 0 ? 1 : 0);
  const deltaLosses = (input.realizedPnl < 0 ? 1 : 0) - (previous && priorPnl < 0 ? 1 : 0);
  if (deltaPnl !== 0 || deltaFees !== 0 || deltaWins !== 0 || deltaLosses !== 0) {
    await tx.botRuntimeSymbolStat.upsert({
      where: { sessionId_symbol: { sessionId: event.sessionId, symbol: input.symbol } },
      create: {
        userId: event.userId, botId: event.botId, sessionId: event.sessionId,
        symbol: input.symbol, realizedPnl: input.realizedPnl,
        grossProfit: nextProfit, grossLoss: nextLoss,
        winningTrades: input.realizedPnl >= 0 ? 1 : 0,
        losingTrades: input.realizedPnl < 0 ? 1 : 0,
        feesPaid: input.exitFees, lastTradeAt: event.eventAt,
      },
      update: {
        realizedPnl: { increment: deltaPnl },
        grossProfit: { increment: nextProfit - priorProfit },
        grossLoss: { increment: nextLoss - priorLoss },
        winningTrades: { increment: deltaWins },
        losingTrades: { increment: deltaLosses },
        feesPaid: { increment: deltaFees },
      },
    });
  }
  await tx.botRuntimeEvent.update({
    where: { id: event.id },
    data: { payload: {
      ...payload,
      financialPnlPending: false,
      financialSettlement: { realizedPnl: input.realizedPnl, feesPaid: input.exitFees },
    } as Prisma.InputJsonValue },
  });
};

/** Handles a fill reconciliation that completed before the runtime close event was written. */
export const reconcileRuntimeCloseFinancials = async (input: {
  userId: string;
  positionId: string;
}) => prisma.$transaction(async (tx) => {
  const position = await tx.position.findFirst({
    where: { id: input.positionId, userId: input.userId, status: 'CLOSED' },
    select: { realizedPnl: true, symbol: true },
  });
  if (!position || position.realizedPnl == null || !Number.isFinite(position.realizedPnl)) return;
  const closeTrades = await tx.trade.findMany({
    where: { userId: input.userId, positionId: input.positionId, lifecycleAction: 'CLOSE' },
    select: { fee: true, feePending: true },
  });
  if (closeTrades.length !== 1 || closeTrades[0].feePending || closeTrades[0].fee == null) return;
  await settleImportedRuntimeCloseFinancials({
    tx, userId: input.userId, positionId: input.positionId,
    symbol: position.symbol, realizedPnl: position.realizedPnl,
    exitFees: closeTrades[0].fee,
  });
}, { timeout: 30_000 });
