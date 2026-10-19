import { createHash } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import type { LiveExecutionResult } from '../orders/orders.liveIntent.service';

const fillSchema = z.strictObject({
  exchangeTradeId: z.string(), exchangeOrderId: z.string(),
  symbol: z.string(), side: z.enum(['BUY', 'SELL']),
  price: z.number().finite().positive(), quantity: z.number().finite().positive(),
  notional: z.number().finite().positive(), feeCost: z.literal(0.05),
  feeCurrency: z.literal('USDT'), feeRate: z.literal(0.001),
  executedAt: z.literal('1970-01-01T00:00:00.000Z'),
  source: z.literal('createOrder'), raw: z.strictObject({ mock: z.literal(true) }),
});
const resultSchema = z.strictObject({
  version: z.literal(1), clientOrderId: z.string(), exchangeOrderId: z.string(),
  status: z.literal('FILLED'), exchangeFilledQuantity: z.number().finite().positive(),
  exchangeAverageFillPrice: z.number().finite().positive(),
  fills: z.tuple([fillSchema]),
});
type Snapshot = z.infer<typeof resultSchema>;
type Scope = { clientOrderId: string; exchange: string;
  symbol: string; side: 'BUY' | 'SELL'; quantity: string; limitPrice: string };
const eq = (actual: number, expected: string) => new Prisma.Decimal(actual.toString()).eq(expected);
export const mockNotionalRepresentable = (scope: Scope) => {
  const exact = new Prisma.Decimal(scope.quantity).mul(scope.limitPrice);
  return new Prisma.Decimal(exact.toNumber().toString()).eq(exact);
};

export const hashMockResult = (snapshot: Snapshot) =>
  createHash('sha256').update(JSON.stringify(snapshot), 'utf8').digest('hex');

// Internal retry for a serializable, lookup-only transaction. Each attempt
// starts a fresh readback; no mock transport or allowance writer is retried.
export const retryMockFinalizationConflict = async <T>(operation: () => Promise<T>): Promise<T> => {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try { return await operation(); } catch (error) {
      if ((error as { code?: unknown })?.code !== 'P2034' || attempt === 2) throw error;
    }
  }
  throw new Error('Mock finalization retry exhausted');
};

// The snapshot contains the actual returned result. Expected fixed values only
// validate its identity; they cannot stand in for a missing durable snapshot.
export const decodeMockResult = (value: unknown, scope: Scope):
  { snapshot: Snapshot; result: LiveExecutionResult } | null => {
  if (scope.exchange !== 'BINANCE' && scope.exchange !== 'GATEIO') return null;
  const parsed = resultSchema.safeParse(value);
  if (!parsed.success) return null;
  const snapshot = parsed.data;
  const fill = snapshot.fills[0];
  const orderId = `mock-${scope.exchange.toLowerCase()}-${scope.clientOrderId}`;
  if (snapshot.clientOrderId !== scope.clientOrderId || snapshot.exchangeOrderId !== orderId ||
      fill.exchangeOrderId !== orderId || fill.exchangeTradeId !== `mock-fill-${scope.clientOrderId}` ||
      fill.symbol !== scope.symbol || fill.side !== scope.side ||
      !eq(snapshot.exchangeFilledQuantity, scope.quantity) ||
      !eq(snapshot.exchangeAverageFillPrice, scope.limitPrice) ||
      !eq(fill.quantity, scope.quantity) || !eq(fill.price, scope.limitPrice) ||
      !eq(fill.notional, new Prisma.Decimal(scope.quantity).mul(scope.limitPrice).toString())) return null;
  return { snapshot, result: {
    exchangeOrderId: snapshot.exchangeOrderId, status: snapshot.status,
    exchangeFilledQuantity: snapshot.exchangeFilledQuantity,
    exchangeAverageFillPrice: snapshot.exchangeAverageFillPrice,
    fills: [{ ...fill, executedAt: new Date(fill.executedAt) }],
  } };
};

export const captureMockResult = (result: LiveExecutionResult, scope: Scope) => {
  const fill = result.fills?.[0];
  if (result.fills?.length !== 1 || !fill || !fill.executedAt) return null;
  const candidate = {
    version: 1, clientOrderId: scope.clientOrderId,
    exchangeOrderId: result.exchangeOrderId, status: result.status,
    exchangeFilledQuantity: result.exchangeFilledQuantity,
    exchangeAverageFillPrice: result.exchangeAverageFillPrice,
    fills: [{ ...fill, executedAt: fill.executedAt.toISOString() }],
  };
  return decodeMockResult(candidate, scope);
};
