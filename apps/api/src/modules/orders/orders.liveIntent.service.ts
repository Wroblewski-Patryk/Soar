import { createHash, randomBytes } from 'node:crypto';
import { Exchange, LiveOrderIntent, Order, Prisma } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { isAppErrorLike } from '../../lib/errors';
import type { ExchangeOrderFill } from '../exchange/exchangeData.types';
import type { OpenOrderDto } from './orders.types';
import { orderErrors } from './orders.errors';
import { lockExchangeOrderIdentity } from './orders.exchangeIdentityLock';
import { applyOrderFillLifecycleInTransaction } from './orders.lifecycle.service';
import { assertExistingGateLinkedOrderContractUnit, canReplayClosedGatePosition,
  resolveVerifiedGateLinkedPositionUnit } from './orders.positionScope';
import { writeRuntimeTradeTelemetry } from '../engine/runtimeTradeTelemetry.transaction';
import { resolveLiveExecutionApiKey } from '../exchange/exchangeAdapterBoundary.service';
import type { LiveExecutionCredentialBinding } from '../exchange/exchangeAdapterBoundary.service';

export type LiveBotContext = {
  id: string;
  exchange: Exchange;
  marketType: 'FUTURES' | 'SPOT';
  positionMode: 'ONE_WAY' | 'HEDGE';
  apiKeyId: string | null;
  walletId: string | null;
};

export type LiveOrderPayload = Omit<OpenOrderDto, 'clientOrderId'> & {
  positionId?: string | null;
  origin?: 'USER' | 'BOT';
  clientOrderId?: string | null;
  contractSize?: number;
  runtimeSessionId?: string;
  runtimeDedupeKey?: string | null;
};

export type LiveExecutionResult = {
  exchangeOrderId: string | null;
  status: 'OPEN' | 'FILLED';
  exchangeFilledQuantity?: number;
  exchangeAverageFillPrice?: number;
  fee?: number | null;
  feeSource?: 'ESTIMATED' | 'EXCHANGE_FILL';
  feePending?: boolean;
  feeCurrency?: string | null;
  effectiveFeeRate?: number | null;
  exchangeTradeId?: string | null;
  fills?: ExchangeOrderFill[];
};

type LiveOrderOperation = (params: {
  userId: string;
  bot: LiveBotContext;
  payload: LiveOrderPayload;
  credentialBinding: LiveExecutionCredentialBinding | null;
}) => Promise<LiveExecutionResult>;

export const resolveLiveClientOrderId = (input: string | null | undefined, exchange: Exchange) => {
  const source = input?.trim() || `soar_${randomBytes(16).toString('base64url')}`;
  // Gate's text field allows 28 bytes after t-. Hash the existing 29-byte
  // runtime ID deterministically so restart/retry uses the same venue ID.
  return exchange === 'GATEIO'
    ? (/^soar_[A-Za-z0-9_-]{22}$/.test(source)
        ? source
        : `soar_${createHash('sha256').update(source).digest('base64url').slice(0, 22)}`)
    : source;
};

export const fingerprintLiveOrderIntentPayload = (userId: string, bot: LiveBotContext, payload: LiveOrderPayload) =>
  createHash('sha256').update(JSON.stringify({
    userId,
    botId: payload.botId ?? null,
    walletId: payload.walletId ?? null,
    strategyId: payload.strategyId ?? null,
    positionId: payload.positionId ?? null,
    exchange: bot.exchange,
    marketType: bot.marketType,
    symbol: payload.symbol.toUpperCase(),
    side: payload.side,
    type: payload.type,
    quantity: payload.quantity,
    contractSize: payload.contractSize ?? null,
    price: payload.price ?? null,
    reduceOnly: payload.reduceOnly ?? false,
  })).digest('hex');

export type PreparedLiveOrderIntent = {
  intentId: string;
  clientOrderId: string;
  payload: LiveOrderPayload;
  created: boolean;
  existingOrder: Order | null;
  credentialBinding: LiveExecutionCredentialBinding | null;
};

// Durable boundary before any venue call. A retry of an existing client ID is
// lookup-only even if this process never reached submit after the first write.
export const persistOrReuseLiveOrderIntent = async (params: {
  userId: string;
  bot: LiveBotContext;
  payload: LiveOrderPayload;
  tx?: Prisma.TransactionClient;
  credentialBinding?: LiveExecutionCredentialBinding | null;
}): Promise<PreparedLiveOrderIntent> => {
  const { userId, bot, payload } = params;
  const db = params.tx ?? prisma;
  if (bot.exchange === 'GATEIO' && bot.marketType === 'FUTURES') {
    if (payload.botId !== bot.id || (payload.walletId ?? null) !== bot.walletId) {
      throw orderErrors.gatePositionScopeUnverified();
    }
    if (payload.reduceOnly === true && !payload.positionId) throw orderErrors.reduceOnlyPositionRequired();
    if (payload.positionId) {
      const allowClosedReplay = await canReplayClosedGatePosition({
        db, userId, positionId: payload.positionId,
        clientOrderId: payload.clientOrderId
          ? resolveLiveClientOrderId(payload.clientOrderId, bot.exchange) : null,
      });
      const saved = await resolveVerifiedGateLinkedPositionUnit({
        db, userId, positionId: payload.positionId, botId: payload.botId ?? null,
        walletId: payload.walletId ?? null, mode: payload.mode,
        symbol: payload.symbol, side: payload.side, quantity: payload.quantity,
        reduceOnly: payload.reduceOnly === true,
        allowClosedReplay,
      });
      if (payload.contractSize !== saved) throw orderErrors.gatePositionUnitUnsafe();
      const clientOrderId = payload.clientOrderId
        ? resolveLiveClientOrderId(payload.clientOrderId, bot.exchange) : null;
      const existingIntent = clientOrderId ? await db.liveOrderIntent.findUnique({
        where: { clientOrderId }, select: { id: true },
      }) : null;
      if (!existingIntent) await assertExistingGateLinkedOrderContractUnit({ db,
        userId, botId: payload.botId ?? null, positionId: payload.positionId,
        symbol: payload.symbol, contractSize: saved });
    } else {
      if (typeof payload.contractSize !== 'number' || !Number.isFinite(payload.contractSize)
        || payload.contractSize <= 0) throw orderErrors.entryContractUnitUnavailable();
      if (payload.contractSize !== 1) throw orderErrors.entryNonunitContractUnsupported();
    }
  }
  payload.clientOrderId = resolveLiveClientOrderId(payload.clientOrderId, bot.exchange);
  const payloadHash = fingerprintLiveOrderIntentPayload(userId, bot, payload);
  let createdIntent = false;
  let intent: LiveOrderIntent | null;
  const data = {
    userId,
    clientOrderId: payload.clientOrderId,
    payloadHash,
    apiKeyId: params.credentialBinding?.apiKeyId ?? null,
    apiKeyCredentialVersion: params.credentialBinding?.apiKeyCredentialVersion ?? null,
    payload: JSON.parse(JSON.stringify(payload)) as Prisma.InputJsonValue,
    exchange: bot.exchange,
    marketType: bot.marketType,
    symbol: payload.symbol.toUpperCase(),
  };
  if (params.tx) {
    // A unique-key exception aborts a PostgreSQL transaction. ON CONFLICT DO
    // NOTHING lets the caller safely compare an existing human intent in-place.
    const inserted = await db.liveOrderIntent.createMany({ data: [data], skipDuplicates: true });
    createdIntent = inserted.count === 1;
    intent = await db.liveOrderIntent.findUnique({ where: { clientOrderId: payload.clientOrderId } });
    if (!intent) throw orderErrors.liveIntentConflict();
  } else {
    try {
      intent = await prisma.liveOrderIntent.create({ data });
      createdIntent = true;
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
        throw error;
      }
      intent = await prisma.liveOrderIntent.findUnique({
        where: { clientOrderId: payload.clientOrderId },
      });
      if (!intent) throw error;
    }
  }
  const originalPayload = intent.payload && typeof intent.payload === 'object' && !Array.isArray(intent.payload)
    ? intent.payload as unknown as LiveOrderPayload
    : null;
  const retryPayload = !createdIntent && originalPayload ? {
    ...originalPayload,
    ...(originalPayload.origin === 'BOT' && payload.origin === 'BOT' ? {
      runtimeSessionId: originalPayload.runtimeSessionId ?? payload.runtimeSessionId,
      runtimeDedupeKey: originalPayload.runtimeDedupeKey ?? payload.runtimeDedupeKey,
    } : {}),
  } : payload;
  const runtimeVolatileOnly = originalPayload?.origin === 'BOT' && payload.origin === 'BOT' &&
    fingerprintLiveOrderIntentPayload(userId, bot, {
      ...payload, quantity: originalPayload.quantity, price: originalPayload.price,
    }) === intent.payloadHash;
  if (intent.userId !== userId || (intent.payloadHash !== payloadHash && !runtimeVolatileOnly)) {
    throw orderErrors.liveIntentConflict();
  }
  const existingOrder = await db.order.findUnique({ where: { id: intent.id } });
  return {
    intentId: intent.id, clientOrderId: intent.clientOrderId,
    payload: retryPayload, created: createdIntent, existingOrder,
    credentialBinding: intent.apiKeyId && intent.apiKeyCredentialVersion
      ? { apiKeyId: intent.apiKeyId,
          apiKeyCredentialVersion: intent.apiKeyCredentialVersion } : null,
  };
};

export const executeDurableLiveOrder = async (params: {
  userId: string;
  bot: LiveBotContext;
  payload: LiveOrderPayload;
  execute: LiveOrderOperation;
  lookup: LiveOrderOperation;
}): Promise<
  | { existingOrder: Order; intentId?: never; liveResult?: never; payload?: never }
  | { existingOrder?: never; intentId: string; liveResult: LiveExecutionResult; payload: LiveOrderPayload }
> => {
  const { userId, bot, payload } = params;
  payload.clientOrderId = resolveLiveClientOrderId(payload.clientOrderId, bot.exchange);
  const existing = await prisma.liveOrderIntent.findUnique({
    where: { clientOrderId: payload.clientOrderId }, select: { id: true },
  });
  let credentialBinding: LiveExecutionCredentialBinding | null = null;
  if (!existing) {
    const key = await resolveLiveExecutionApiKey({ userId, bot });
    if (!Number.isInteger(key.credentialVersion) || (key.credentialVersion ?? 0) <= 0) {
      throw orderErrors.liveExecutionFailed();
    }
    credentialBinding = { apiKeyId: key.id,
      apiKeyCredentialVersion: key.credentialVersion! };
  }
  const prepared = await persistOrReuseLiveOrderIntent({ userId, bot, payload,
    credentialBinding });
  if (prepared.existingOrder) return { existingOrder: prepared.existingOrder };

  let liveResult: LiveExecutionResult;
  if (prepared.created) {
    try {
      liveResult = await params.execute({ userId, bot, payload: prepared.payload,
        credentialBinding: prepared.credentialBinding });
      if (!liveResult.exchangeOrderId) throw new Error('Exchange returned no order identity');
    } catch (error) {
      if (isAppErrorLike(error) && error.code.startsWith('LIVE_PRETRADE_')) {
        await prisma.liveOrderIntent.delete({ where: { id: prepared.intentId } });
        throw error;
      }
      try {
        liveResult = await params.lookup({ userId, bot, payload: prepared.payload,
          credentialBinding: prepared.credentialBinding });
        if (!liveResult.exchangeOrderId) throw new Error('Exchange lookup returned no order identity');
      } catch {
        throw orderErrors.liveExecutionUnknown({
          orderId: prepared.intentId,
          clientOrderId: prepared.clientOrderId,
        });
      }
    }
  } else {
    // An existing intent may have been sent before a crash. A lookup is the
    // only permitted recovery action, even when the venue says not found.
    try {
      liveResult = await params.lookup({ userId, bot, payload: prepared.payload,
        credentialBinding: prepared.credentialBinding });
      if (!liveResult.exchangeOrderId) throw new Error('Exchange lookup returned no order identity');
    } catch {
      throw orderErrors.liveExecutionUnknown({
        orderId: prepared.intentId,
        clientOrderId: prepared.clientOrderId,
      });
    }
  }
  return { intentId: prepared.intentId, liveResult, payload: prepared.payload };
};

export const createOrderForLiveIntent = async (params: {
  userId: string;
  exchangeOrderId: string | null;
  intentId: string | null;
  clientOrderId: string | null | undefined;
  data: Prisma.OrderUncheckedCreateInput;
  materialize?: (tx: Prisma.TransactionClient, order: Order) => Promise<Order>;
}): Promise<{ order: Order; reused: boolean }> => {
  const { userId, exchangeOrderId, intentId, clientOrderId, data, materialize } = params;
  try {
    if (!intentId) {
      return { order: await prisma.order.create({ data }), reused: false };
    }
    if (!exchangeOrderId || !materialize) {
      throw orderErrors.liveExecutionUnknown({ orderId: intentId, clientOrderId: clientOrderId ?? '' });
    }
    return await prisma.$transaction(async (tx) => {
      await lockExchangeOrderIdentity(tx, userId, exchangeOrderId);
      const existing = await tx.order.findFirst({ where: { userId, exchangeOrderId } });
      if (existing) {
        if (existing.id !== intentId) {
          // Snapshot import won the race. Keep the intent unresolved instead
          // of creating another local order for the exchange identity.
          throw orderErrors.liveExecutionUnknown({
            orderId: intentId,
            clientOrderId: clientOrderId ?? '',
          });
        }
        return { order: existing, reused: true };
      }
      const created = await tx.order.create({ data });
      return { order: await materialize(tx, created), reused: false };
    });
  } catch (error) {
    if (intentId && error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const existing = await prisma.order.findUnique({ where: { id: intentId } });
      if (existing) return { order: existing, reused: true };
      if (exchangeOrderId && await prisma.order.findFirst({ where: { userId, exchangeOrderId } })) {
        throw orderErrors.liveExecutionUnknown({
          orderId: intentId,
          clientOrderId: clientOrderId ?? '',
        });
      }
    }
    if (intentId) {
      throw orderErrors.liveExecutionUnknown({
        orderId: intentId,
        clientOrderId: clientOrderId ?? '',
      });
    }
    throw error;
  }
};

export const resolveLiveFillTradeIds = (
  fills: ExchangeOrderFill[],
  symbol: string,
  side: LiveOrderPayload['side']
): string[] => {
  const fallbackOccurrences = new Map<string, number>();
  return fills.map((fill) => {
    if (fill.exchangeTradeId?.trim()) return fill.exchangeTradeId;
    // Fees, timestamps and adapter row order may change during a lookup retry.
    // Identical economic fills use an occurrence number so each row persists.
    const fingerprint = createHash('sha256').update(JSON.stringify([
      symbol.toUpperCase(), side, fill.price, fill.quantity,
    ])).digest('hex');
    const occurrence = (fallbackOccurrences.get(fingerprint) ?? 0) + 1;
    fallbackOccurrences.set(fingerprint, occurrence);
    return `soar-fill-${fingerprint}-${occurrence}`;
  });
};

export const materializeLiveOrderInTransaction = async (params: {
  tx: Prisma.TransactionClient;
  order: Order;
  userId: string;
  payload: LiveOrderPayload;
  fillPrice: number | null;
  fillQuantity: number | null;
  applyFillLifecycle: boolean;
  fills: ExchangeOrderFill[];
  now: Date;
  afterPositionWrite?: () => Promise<void>;
  onNewPositionCreated?: (positionId: string) => void;
}): Promise<Order> => {
  const { tx, order, userId, payload, fillPrice, fillQuantity, fills, now } = params;
  if (order.status === 'FILLED' && order.botId && order.origin === 'BOT' &&
      !payload.positionId && payload.clientOrderId?.startsWith('soar_') &&
      !payload.runtimeSessionId) {
    throw new Error('Runtime OPEN session missing from filled intent');
  }
  const lifecycle = params.applyFillLifecycle
    ? await applyOrderFillLifecycleInTransaction(tx, {
        userId, orderId: order.id, mode: 'LIVE', fillPrice, fillQuantity, filledAt: now,
      })
    : null;
  if (lifecycle && 'createdPosition' in lifecycle && lifecycle.createdPosition &&
      lifecycle.positionId) params.onNewPositionCreated?.(lifecycle.positionId);
  const materializedOrder = lifecycle?.order ?? order;
  if (fills.length > 0) {
    const exchangeTradeIds = resolveLiveFillTradeIds(fills, payload.symbol, payload.side);
    await tx.orderFill.createMany({
      data: fills.map((fill, index) => ({
        userId,
        botId: payload.botId ?? null,
        strategyId: payload.strategyId ?? null,
        orderId: order.id,
        tradeId: null,
        positionId: materializedOrder.positionId ?? null,
        symbol: fill.symbol,
        side: payload.side,
        exchangeTradeId: exchangeTradeIds[index],
        price: fill.price,
        quantity: fill.quantity,
        notional: fill.notional,
        feeCost: typeof fill.feeCost === 'number' ? fill.feeCost : null,
        feeCurrency: fill.feeCurrency,
        feeRate: fill.feeRate,
        executedAt: fill.executedAt ?? now,
        raw: (fill.raw ?? {}) as Prisma.InputJsonValue,
      })),
    });
  }
  if (materializedOrder.status === 'FILLED' && materializedOrder.positionId &&
      materializedOrder.botId && materializedOrder.origin === 'BOT' &&
      !payload.positionId && payload.runtimeSessionId &&
      payload.clientOrderId?.startsWith('soar_')) {
    await params.afterPositionWrite?.();
    const executionPrice = materializedOrder.averageFillPrice ?? fillPrice;
    const executionQuantity = materializedOrder.filledQuantity;
    if (executionPrice == null || !Number.isFinite(executionPrice) || executionPrice <= 0 ||
        !Number.isFinite(executionQuantity) || executionQuantity <= 0) {
      throw new Error('Runtime OPEN fill has no valid execution price or quantity');
    }
    const position = await tx.position.findUniqueOrThrow({
      where: { id: materializedOrder.positionId }, select: { quantity: true },
    });
    const session = await tx.botRuntimeSession.findFirst({
      where: { id: payload.runtimeSessionId, userId,
        botId: materializedOrder.botId, mode: 'LIVE' }, select: { id: true },
    });
    if (!session) throw new Error('Runtime OPEN session does not match bot and user');
    const existingTrades = await tx.trade.findMany({
      where: { userId, orderId: order.id, lifecycleAction: 'OPEN' }, select: { id: true },
    });
    if (existingTrades.length > 0) throw new Error('Runtime OPEN trade already materialized before order creation');
    await tx.trade.create({ data: {
      userId, botId: materializedOrder.botId, walletId: materializedOrder.walletId,
      strategyId: materializedOrder.strategyId, orderId: order.id,
      positionId: materializedOrder.positionId, symbol: materializedOrder.symbol,
      side: materializedOrder.side, lifecycleAction: 'OPEN',
      price: executionPrice, quantity: executionQuantity,
      fee: materializedOrder.feeSource === 'EXCHANGE_FILL' && !materializedOrder.feePending
        ? materializedOrder.fee : null,
      feeSource: materializedOrder.feeSource,
      feePending: materializedOrder.feePending || materializedOrder.fee == null ||
        materializedOrder.feeSource !== 'EXCHANGE_FILL',
      feeCurrency: materializedOrder.feeCurrency,
      effectiveFeeRate: materializedOrder.effectiveFeeRate,
      exchangeTradeId: materializedOrder.exchangeTradeId,
      realizedPnl: 0, origin: materializedOrder.origin,
      managementMode: materializedOrder.managementMode, executionMode: 'LIVE',
    } });
    await writeRuntimeTradeTelemetry({
      tx, userId, botId: materializedOrder.botId,
      sessionId: payload.runtimeSessionId, orderId: order.id,
      positionId: materializedOrder.positionId, symbol: materializedOrder.symbol,
      strategyId: materializedOrder.strategyId,
      direction: materializedOrder.side === 'BUY' ? 'LONG' : 'SHORT',
      eventType: 'POSITION_OPENED', eventAt: now, price: executionPrice,
      positionQty: position.quantity,
    });
    if (payload.runtimeDedupeKey) {
      const updated = await tx.runtimeExecutionDedupe.updateMany({
        where: { dedupeKey: payload.runtimeDedupeKey, userId,
          botId: materializedOrder.botId, commandType: 'OPEN' },
        data: { status: 'SUCCEEDED', orderId: order.id,
          positionId: materializedOrder.positionId, errorClass: null,
          lastSeenAt: now },
      });
      if (updated.count !== 1) throw new Error('Runtime OPEN dedupe does not match bot and user');
    }
  }
  return materializedOrder;
};
