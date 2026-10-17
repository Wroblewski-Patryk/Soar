import { createHash, randomBytes } from 'node:crypto';
import { Exchange, Order, Prisma } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { isAppErrorLike } from '../../lib/errors';
import type { ExchangeOrderFill } from '../exchange/exchangeData.types';
import type { OpenOrderDto } from './orders.types';
import { orderErrors } from './orders.errors';
import { lockExchangeOrderIdentity } from './orders.exchangeIdentityLock';
import { applyOrderFillLifecycleInTransaction } from './orders.lifecycle.service';

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
}) => Promise<LiveExecutionResult>;

const resolveLiveClientOrderId = (input: string | null | undefined, exchange: Exchange) => {
  const source = input?.trim() || `soar_${randomBytes(16).toString('base64url')}`;
  // Gate's text field allows 28 bytes after t-. Hash the existing 29-byte
  // runtime ID deterministically so restart/retry uses the same venue ID.
  return exchange === 'GATEIO'
    ? (/^soar_[A-Za-z0-9_-]{22}$/.test(source)
        ? source
        : `soar_${createHash('sha256').update(source).digest('base64url').slice(0, 22)}`)
    : source;
};

const liveIntentPayloadHash = (userId: string, bot: LiveBotContext, payload: LiveOrderPayload) =>
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
    price: payload.price ?? null,
    reduceOnly: payload.reduceOnly ?? false,
  })).digest('hex');

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
  const payloadHash = liveIntentPayloadHash(userId, bot, payload);
  let createdIntent = false;
  let intent;
  try {
    intent = await prisma.liveOrderIntent.create({
      data: {
        userId,
        clientOrderId: payload.clientOrderId,
        payloadHash,
        payload: JSON.parse(JSON.stringify(payload)) as Prisma.InputJsonValue,
        exchange: bot.exchange,
        marketType: bot.marketType,
        symbol: payload.symbol.toUpperCase(),
      },
    });
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
  const originalPayload = intent.payload && typeof intent.payload === 'object' && !Array.isArray(intent.payload)
    ? intent.payload as unknown as LiveOrderPayload
    : null;
  const retryPayload = !createdIntent && originalPayload ? originalPayload : payload;
  const runtimeVolatileOnly = originalPayload?.origin === 'BOT' && payload.origin === 'BOT' &&
    liveIntentPayloadHash(userId, bot, {
      ...payload, quantity: originalPayload.quantity, price: originalPayload.price,
    }) === intent.payloadHash;
  if (intent.userId !== userId || (intent.payloadHash !== payloadHash && !runtimeVolatileOnly)) {
    throw orderErrors.liveIntentConflict();
  }
  const existingOrder = await prisma.order.findUnique({ where: { id: intent.id } });
  if (existingOrder) return { existingOrder };

  let liveResult: LiveExecutionResult;
  if (createdIntent) {
    try {
      liveResult = await params.execute({ userId, bot, payload: retryPayload });
      if (!liveResult.exchangeOrderId) throw new Error('Exchange returned no order identity');
    } catch (error) {
      if (isAppErrorLike(error) && error.code.startsWith('LIVE_PRETRADE_')) {
        await prisma.liveOrderIntent.delete({ where: { id: intent.id } });
        throw error;
      }
      try {
        liveResult = await params.lookup({ userId, bot, payload: retryPayload });
        if (!liveResult.exchangeOrderId) throw new Error('Exchange lookup returned no order identity');
      } catch {
        throw orderErrors.liveExecutionUnknown({
          orderId: intent.id,
          clientOrderId: intent.clientOrderId,
        });
      }
    }
  } else {
    // An existing intent may have been sent before a crash. A lookup is the
    // only permitted recovery action, even when the venue says not found.
    try {
      liveResult = await params.lookup({ userId, bot, payload: retryPayload });
      if (!liveResult.exchangeOrderId) throw new Error('Exchange lookup returned no order identity');
    } catch {
      throw orderErrors.liveExecutionUnknown({
        orderId: intent.id,
        clientOrderId: intent.clientOrderId,
      });
    }
  }
  return { intentId: intent.id, liveResult, payload: retryPayload };
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

export const materializeLiveOrderInTransaction = async (params: {
  tx: Prisma.TransactionClient;
  order: Order;
  userId: string;
  payload: LiveOrderPayload;
  fillPrice: number | null;
  fillQuantity: number | null;
  applyFillLifecycle: boolean;
  fills: ExchangeOrderFill[];
  exchangeOrderId: string | null;
  now: Date;
}): Promise<Order> => {
  const { tx, order, userId, payload, fillPrice, fillQuantity, fills, exchangeOrderId, now } = params;
  const lifecycle = params.applyFillLifecycle
    ? await applyOrderFillLifecycleInTransaction(tx, {
        userId, orderId: order.id, mode: 'LIVE', fillPrice, fillQuantity, filledAt: now,
      })
    : null;
  const materializedOrder = lifecycle?.order ?? order;
  if (fills.length > 0) {
    await tx.orderFill.createMany({
      data: fills.map((fill) => ({
        userId,
        botId: payload.botId ?? null,
        strategyId: payload.strategyId ?? null,
        orderId: order.id,
        tradeId: null,
        positionId: materializedOrder.positionId ?? null,
        symbol: fill.symbol,
        side: payload.side,
        exchangeTradeId: fill.exchangeTradeId ?? `${exchangeOrderId ?? order.id}-${fill.executedAt?.toISOString() ?? 'na'}`,
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
  return materializedOrder;
};
