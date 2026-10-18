import { Order, Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../../prisma/client';
import type { NormalizedBinanceOrderTradeUpdateEvent } from '../exchange/binanceUserDataStream.types';
import { lookupLiveFillCandidate, resolveLiveFillCredentials,
  type LiveFillLookupResult } from '../exchange/liveFillLookup.service';
import type { CcxtFuturesOrderFill, CcxtFuturesOrderResult } from '../exchange/ccxtFuturesConnector.types';
import type { LiveFillCandidate } from './orders.liveFillCandidates.service';
import { applyLiveExchangeOrderTradeUpdateInTransaction,
  invalidateRuntimePositionStateAfterExchangeClose,
  syncRuntimeDcaStateFromExchangeFill } from './orders.exchangeEvents.service';
import { lockExchangeOrderIdentity } from './orders.exchangeIdentityLock';
import { resolveLiveFillTradeIds } from './orders.liveIntent.service';

type RecoveryResult =
  | { kind: 'APPLIED'; orderId: string; status: Order['status']; fillCount: number }
  | { kind: 'UNKNOWN'; reason: string; orderId: string };

class RecoveryUnknown extends Error {
  constructor(readonly reason: string) { super(reason); }
}
const unknown = (reason: string): never => { throw new RecoveryUnknown(reason); };
const positive = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;
const normalizeSymbol = (value: string) => value.split(':')[0].toUpperCase().replace(/[^A-Z0-9]/g, '');
const quantityMatches = (left: number, right: number, count: number) =>
  Math.abs(left - right) <= 16 * Number.EPSILON *
    Math.max(Math.abs(left), Math.abs(right)) * Math.max(1, count);

const readSubmission = (intent: { payload: Prisma.JsonValue | null }, candidate: LiveFillCandidate) => {
  const payload = intent.payload && typeof intent.payload === 'object' && !Array.isArray(intent.payload)
    ? intent.payload as Record<string, unknown> : null;
  if (!payload || payload.mode !== 'LIVE' ||
      payload.symbol !== candidate.symbol || payload.side !== candidate.side ||
      !positive(payload.quantity) || payload.quantity !== candidate.quantity ||
      (payload.type !== 'MARKET' && payload.type !== 'LIMIT') ||
      (payload.origin != null && payload.origin !== 'BOT' && payload.origin !== 'USER')) {
    return unknown('INTENT_PAYLOAD_INVALID');
  }
  const optionalId = (value: unknown) => typeof value === 'string' && value ? value : null;
  if (optionalId(payload.botId) !== candidate.botId ||
      optionalId(payload.walletId) !== candidate.walletId) return unknown('INTENT_PAYLOAD_CHANGED');
  return {
    botId: optionalId(payload.botId), walletId: optionalId(payload.walletId),
    strategyId: optionalId(payload.strategyId), positionId: optionalId(payload.positionId),
    runtimeDedupeKey: optionalId(payload.runtimeDedupeKey),
    origin: payload.origin === 'BOT' ? 'BOT' as const : 'USER' as const,
    type: payload.type as 'MARKET' | 'LIMIT',
    side: payload.side as 'BUY' | 'SELL', quantity: payload.quantity as number,
    price: positive(payload.price) ? payload.price : null,
  };
};

const prepareSnapshot = (candidate: LiveFillCandidate, order: CcxtFuturesOrderResult) => {
  if (!order.id || !positive(candidate.quantity) || candidate.side == null ||
      !order.symbol || normalizeSymbol(order.symbol) !== normalizeSymbol(candidate.symbol) ||
      (order.side && order.side.toUpperCase() !== candidate.side) ||
      typeof order.filled !== 'number' || !Number.isFinite(order.filled) ||
      order.filled < 0 || order.filled > candidate.quantity &&
        !quantityMatches(order.filled, candidate.quantity, 1)) return unknown('VENUE_SNAPSHOT_INVALID');
  const rawStatus = order.status?.toLowerCase() ?? '';
  const terminal = rawStatus === 'closed' || rawStatus === 'filled';
  const canceled = ['canceled', 'cancelled', 'expired', 'rejected'].includes(rawStatus);
  if (!terminal && !canceled && rawStatus !== 'open' && rawStatus !== 'new') {
    return unknown('VENUE_STATUS_UNKNOWN');
  }
  if (terminal && !quantityMatches(order.filled, candidate.quantity, 1)) {
    return unknown('VENUE_FILLED_QUANTITY_INCOMPLETE');
  }
  const fills = order.fills ?? [];
  if (order.filled > 0 && fills.length === 0) return unknown('VENUE_FILLS_MISSING');
  let total = 0;
  let notional = 0;
  let feeCurrency: string | null = null;
  for (const fill of fills) {
    if (!positive(fill.quantity) || !positive(fill.price) ||
        normalizeSymbol(fill.symbol) !== normalizeSymbol(candidate.symbol) ||
        (fill.side && fill.side.toUpperCase() !== candidate.side) ||
        (fill.exchangeOrderId && fill.exchangeOrderId !== order.id) ||
        (fill.feeCost != null && !Number.isFinite(fill.feeCost))) {
      return unknown('VENUE_FILL_INVALID');
    }
    if (fill.feeCost != null && fill.feeCost !== 0 && !fill.feeCurrency) {
      return unknown('VENUE_FEE_CURRENCY_UNKNOWN');
    }
    if (fill.feeCost != null && fill.feeCurrency) {
      if (feeCurrency && feeCurrency !== fill.feeCurrency) return unknown('VENUE_FEE_CURRENCY_MIXED');
      feeCurrency = fill.feeCurrency;
    }
    total += fill.quantity;
    notional += fill.quantity * fill.price;
  }
  if (!quantityMatches(total, order.filled, fills.length)) return unknown('VENUE_FILL_SUM_MISMATCH');
  const ids = resolveLiveFillTradeIds(fills, candidate.symbol, candidate.side);
  const byId = new Map<string, CcxtFuturesOrderFill>();
  for (const [index, fill] of fills.entries()) {
    const prior = byId.get(ids[index]);
    if (prior && (prior.quantity !== fill.quantity || prior.price !== fill.price ||
        prior.feeCost !== fill.feeCost)) return unknown('VENUE_FILL_ID_AMBIGUOUS');
    byId.set(ids[index], fill);
  }
  if (byId.size !== fills.length) return unknown('VENUE_FILL_ID_AMBIGUOUS');
  const ordered = fills.map((fill, index) => ({ ...fill, exchangeTradeId: ids[index] }))
    .sort((left, right) => (left.executedAt?.getTime() ?? 0) - (right.executedAt?.getTime() ?? 0) ||
      left.exchangeTradeId!.localeCompare(right.exchangeTradeId!));
  return { fills: ordered, filledQuantity: order.filled,
    averagePrice: total > 0 ? notional / total : null,
    finalStatus: terminal ? 'FILLED' as const : canceled ? 'CANCELED' as const :
      total > 0 ? 'PARTIALLY_FILLED' as const : 'OPEN' as const };
};

const createOrderFromIntent = async (
  tx: Prisma.TransactionClient,
  candidate: LiveFillCandidate,
  result: Extract<LiveFillLookupResult, { kind: 'FOUND' }>
) => {
  const intent = await tx.liveOrderIntent.findUnique({ where: { id: candidate.intentId! } });
  if (!intent) return unknown('INTENT_MISSING');
  const submission = readSubmission(intent, candidate);
  if (submission.positionId) {
    const position = await tx.position.findFirst({ where: {
      id: submission.positionId, userId: candidate.userId, status: 'OPEN', syncState: 'IN_SYNC',
      botId: submission.botId, walletId: submission.walletId,
    } });
    if (!position || position.symbol !== candidate.symbol) return unknown('POSITION_SCOPE_CHANGED');
  }
  return tx.order.create({ data: {
    id: intent.id, userId: candidate.userId, botId: submission.botId,
    walletId: submission.walletId, strategyId: submission.strategyId,
    positionId: submission.positionId, origin: submission.origin,
    symbol: candidate.symbol, side: submission.side, type: submission.type,
    status: 'OPEN', quantity: submission.quantity, price: submission.price,
    filledQuantity: 0, fee: null, feeSource: 'ESTIMATED', feePending: true,
    exchangeOrderId: result.order.id, submittedAt: intent.createdAt,
  } });
};

const settleDedupeInTransaction = async (tx: Prisma.TransactionClient, order: Order,
  candidate: LiveFillCandidate, eventAt: Date) => {
  const trades = await tx.trade.findMany({ where: { userId: order.userId, orderId: order.id,
    lifecycleAction: { in: ['OPEN', 'DCA', 'CLOSE'] } }, select: { lifecycleAction: true } });
  if (order.status === 'FILLED' && (trades.length !== 1 || !order.positionId)) {
    return unknown('LIFECYCLE_AMBIGUOUS');
  }
  if (trades.length !== 1 || !order.positionId) return;
  const action = trades[0].lifecycleAction as 'OPEN' | 'DCA' | 'CLOSE';
  const dedupe = await tx.runtimeExecutionDedupe.findMany({ where: {
    userId: order.userId, orderId: order.id,
  } });
  if (dedupe.some((row) => row.botId !== order.botId || row.commandType !== action)) {
    return unknown('DEDUPE_SCOPE_CONFLICT');
  }
  const intent = candidate.intentId ? await tx.liveOrderIntent.findUnique({
    where: { id: candidate.intentId }, select: { payload: true },
  }) : null;
  const payload = intent?.payload && typeof intent.payload === 'object' && !Array.isArray(intent.payload)
    ? intent.payload as Record<string, unknown> : null;
  const runtimeDedupeKey = typeof payload?.runtimeDedupeKey === 'string'
    ? payload.runtimeDedupeKey : null;
  if (runtimeDedupeKey && !dedupe.some((row) => row.dedupeKey === runtimeDedupeKey)) {
    const pending = await tx.runtimeExecutionDedupe.findUnique({ where: { dedupeKey: runtimeDedupeKey } });
    if (pending && (pending.userId !== order.userId || pending.botId !== order.botId ||
        pending.commandType !== action ||
        (pending.orderId && pending.orderId !== order.id))) return unknown('DEDUPE_SCOPE_CONFLICT');
    if (pending) dedupe.push(pending);
  }
  if (dedupe.length > 1) return unknown('DEDUPE_AMBIGUOUS');
  for (const row of dedupe) {
    await tx.runtimeExecutionDedupe.update({ where: { id: row.id }, data: {
      status: 'SUCCEEDED', orderId: order.id, positionId: order.positionId,
      errorClass: null, lastSeenAt: eventAt,
    } });
  }
};

export const recoverLiveFillCandidateOnce = async (input: {
  candidate: LiveFillCandidate;
  lookup?: typeof lookupLiveFillCandidate;
  client?: PrismaClient;
  afterEventApplied?: (index: number) => Promise<void>;
  afterCoreCommit?: () => Promise<void>;
}): Promise<RecoveryResult> => {
  const lookup = await (input.lookup ?? lookupLiveFillCandidate)(input.candidate);
  if (lookup.kind === 'UNKNOWN') return { kind: 'UNKNOWN', reason: lookup.reason,
    orderId: input.candidate.orderId };
  const candidate = input.candidate;
  if (lookup.candidate.orderId !== candidate.orderId ||
      lookup.candidate.userId !== candidate.userId ||
      lookup.candidate.clientOrderId !== candidate.clientOrderId) {
    return { kind: 'UNKNOWN', reason: 'CANDIDATE_CHANGED',
    orderId: candidate.orderId };
  }
  let snapshot: ReturnType<typeof prepareSnapshot>;
  try { snapshot = prepareSnapshot(candidate, lookup.order); }
  catch (error) {
    if (error instanceof RecoveryUnknown) return { kind: 'UNKNOWN', reason: error.reason,
      orderId: candidate.orderId };
    throw error;
  }
  if (snapshot.fills.length === 0 && snapshot.finalStatus !== 'OPEN') {
    return { kind: 'UNKNOWN', reason: 'VENUE_TERMINAL_WITHOUT_FILLS',
      orderId: candidate.orderId };
  }
  try {
    const committed = await (input.client ?? prisma).$transaction(async (tx) => {
      const credentials = await resolveLiveFillCredentials(candidate, tx);
      if (credentials.kind !== 'OK' || credentials.apiKeyId !== lookup.apiKeyId) {
        return unknown('ACCOUNT_PROVENANCE_CHANGED');
      }
      await lockExchangeOrderIdentity(tx, candidate.userId, lookup.order.id);
      const identityConflict = await tx.order.findFirst({ where: {
        userId: candidate.userId, exchangeOrderId: lookup.order.id, id: { not: candidate.orderId },
      } });
      if (identityConflict) return unknown('EXCHANGE_ORDER_ID_CONFLICT');
      let order = await tx.order.findUnique({ where: { id: candidate.orderId } });
      if (order && (order.userId !== candidate.userId || order.symbol !== candidate.symbol ||
          order.side !== candidate.side || order.botId !== candidate.botId ||
          order.walletId !== candidate.walletId || order.origin === 'EXCHANGE_SYNC' ||
          order.quantity !== candidate.quantity ||
          order.exchangeOrderId !== lookup.order.id ||
          order.syncState !== 'IN_SYNC' ||
          order.filledQuantity > snapshot.filledQuantity &&
            !quantityMatches(order.filledQuantity, snapshot.filledQuantity, snapshot.fills.length) ||
          order.status === 'FILLED' && snapshot.finalStatus !== 'FILLED')) {
        return unknown('LOCAL_ORDER_CHANGED');
      }
      if (order?.status === 'FILLED') {
        const lifecycleTrades = await tx.trade.findMany({ where: {
          userId: candidate.userId, orderId: order.id,
          lifecycleAction: { in: ['OPEN', 'DCA', 'CLOSE'] },
        }, select: { id: true } });
        // Older partial writes cannot prove whether Position was already
        // advanced. Never infer a missing lifecycle effect from Order alone.
        if (lifecycleTrades.length !== 1) return unknown('LEGACY_LIFECYCLE_AMBIGUOUS');
      }
      if (!order) order = await createOrderFromIntent(tx, candidate, lookup);
      const localFills = await tx.orderFill.findMany({ where: { orderId: order.id } });
      const venueFills = new Map(snapshot.fills.map((fill) => [fill.exchangeTradeId, fill]));
      for (const local of localFills) {
        const venue = venueFills.get(local.exchangeTradeId);
        if (!venue || local.userId !== candidate.userId ||
            local.symbol !== candidate.symbol || local.side !== candidate.side ||
            !quantityMatches(local.quantity, venue.quantity, 1) ||
            !quantityMatches(local.price, venue.price, 1) ||
            (local.feeCost != null && venue.feeCost != null &&
              !quantityMatches(local.feeCost, venue.feeCost, 1)) ||
            (local.feeCurrency && venue.feeCurrency &&
              local.feeCurrency !== venue.feeCurrency)) {
          return unknown('LOCAL_FILL_CONFLICT');
        }
      }
      if (snapshot.fills.length === 0) {
        return { result: { kind: 'APPLIED' as const, orderId: order.id,
          status: order.status, fillCount: 0 }, cacheEffect: null };
      }
      let cumulative = 0;
      let cacheEffect:
        | { kind: 'DCA'; input: Parameters<typeof syncRuntimeDcaStateFromExchangeFill>[0] }
        | { kind: 'CLOSE'; positionId: string }
        | null = null;
      for (const [index, fill] of snapshot.fills.entries()) {
        cumulative += fill.quantity;
        const last = index === snapshot.fills.length - 1;
        const status = last ? snapshot.finalStatus : 'PARTIALLY_FILLED';
        const eventAt = fill.executedAt ?? new Date();
        const event: NormalizedBinanceOrderTradeUpdateEvent = {
          eventType: 'ORDER_TRADE_UPDATE', marketType: candidate.marketType!,
          eventTime: eventAt.getTime(), transactionTime: eventAt.getTime(),
          symbol: candidate.symbol, side: candidate.side!, orderType: order.type,
          orderStatus: status, executionType: 'TRADE',
          exchangeOrderId: lookup.order.id, clientOrderId: candidate.clientOrderId,
          averagePrice: snapshot.averagePrice, cumulativeFilledQuantity: cumulative,
          lastFilledQuantity: fill.quantity, lastFilledPrice: fill.price,
          fee: fill.feeCost, feeCurrency: fill.feeCurrency,
          exchangeTradeId: fill.exchangeTradeId, raw: fill.raw,
        };
        const applied = await applyLiveExchangeOrderTradeUpdateInTransaction(tx, {
          userId: candidate.userId, event, sourceExchange: candidate.exchange!, snapshotRecovery: true,
        });
        if (applied.status !== 'applied' || applied.orderId !== order.id) {
          return unknown('EVENT_FINALIZATION_REJECTED');
        }
        if ('dcaSync' in applied && applied.dcaSync) {
          cacheEffect = { kind: 'DCA', input: applied.dcaSync };
        } else if ('closedPositionId' in applied && applied.closedPositionId) {
          cacheEffect = { kind: 'CLOSE', positionId: applied.closedPositionId };
        }
        await input.afterEventApplied?.(index);
      }
      order = await tx.order.findUniqueOrThrow({ where: { id: order.id } });
      if (order.status !== snapshot.finalStatus &&
          !(snapshot.finalStatus === 'PARTIALLY_FILLED' && order.status === 'OPEN')) {
        return unknown('ORDER_STATUS_MISMATCH');
      }
      await settleDedupeInTransaction(tx, order, candidate, new Date());
      return { result: { kind: 'APPLIED' as const, orderId: order.id,
        status: order.status, fillCount: snapshot.fills.length }, cacheEffect };
    }, { timeout: 30_000, maxWait: 10_000 });
    await input.afterCoreCommit?.();
    if (committed.cacheEffect?.kind === 'DCA' &&
        !await syncRuntimeDcaStateFromExchangeFill(committed.cacheEffect.input)) {
      throw new Error('RUNTIME_STATE_SYNC_PENDING');
    }
    if (committed.cacheEffect?.kind === 'CLOSE' &&
        !await invalidateRuntimePositionStateAfterExchangeClose(committed.cacheEffect.positionId)) {
      throw new Error('RUNTIME_STATE_SYNC_PENDING');
    }
    return committed.result;
  } catch (error) {
    if (error instanceof RecoveryUnknown) return { kind: 'UNKNOWN', reason: error.reason,
      orderId: candidate.orderId };
    throw error;
  }
};
