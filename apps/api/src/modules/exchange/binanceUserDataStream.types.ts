import { z } from 'zod';

export const BinanceUserDataStreamMarketTypeSchema = z.enum(['SPOT', 'FUTURES']);

export const BinanceListenKeyResponseSchema = z.object({
  listenKey: z.string().trim().min(1),
});

const numberFromUnknown = z
  .union([z.number(), z.string()])
  .transform((value) => Number(value));

const nullableNumberFromUnknown = z
  .union([z.number(), z.string(), z.null(), z.undefined()])
  .transform((value) => {
    if (value == null) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  });

export const BinanceFuturesOrderTradeUpdateSchema = z.object({
  e: z.literal('ORDER_TRADE_UPDATE'),
  E: z.number().int().nonnegative(),
  T: z.number().int().nonnegative().optional(),
  o: z.object({
    s: z.string().trim().min(1),
    S: z.string().trim().min(1),
    o: z.string().trim().min(1),
    X: z.string().trim().min(1),
    x: z.string().trim().min(1),
    i: z.union([z.number(), z.string()]).transform((value) => String(value)),
    c: z.string().trim().optional().nullable(),
    ap: nullableNumberFromUnknown.optional(),
    l: nullableNumberFromUnknown.optional(),
    z: nullableNumberFromUnknown.optional(),
    L: nullableNumberFromUnknown.optional(),
    n: nullableNumberFromUnknown.optional(),
    N: z.string().trim().optional().nullable(),
    t: z.union([z.number(), z.string()]).transform((value) => String(value)).optional(),
  }),
});

export const BinanceFuturesAccountUpdateSchema = z.object({
  e: z.literal('ACCOUNT_UPDATE'),
  E: z.number().int().nonnegative(),
  T: z.number().int().nonnegative().optional(),
  a: z.object({
    B: z.array(
      z.object({
        a: z.string().trim().min(1),
        wb: nullableNumberFromUnknown,
        cw: nullableNumberFromUnknown.optional(),
      })
    ),
    P: z.array(
      z.object({
        s: z.string().trim().min(1),
        pa: nullableNumberFromUnknown,
        ep: nullableNumberFromUnknown,
        up: nullableNumberFromUnknown.optional(),
        ps: z.string().trim().optional(),
      })
    ),
  }),
});

export const BinanceSpotExecutionReportSchema = z.object({
  e: z.literal('executionReport'),
  E: z.number().int().nonnegative(),
  T: z.number().int().nonnegative().optional(),
  s: z.string().trim().min(1),
  S: z.string().trim().min(1),
  o: z.string().trim().min(1),
  X: z.string().trim().min(1),
  x: z.string().trim().min(1),
  i: z.union([z.number(), z.string()]).transform((value) => String(value)),
  c: z.string().trim().optional().nullable(),
  Z: nullableNumberFromUnknown.optional(),
  z: nullableNumberFromUnknown.optional(),
  L: nullableNumberFromUnknown.optional(),
  l: nullableNumberFromUnknown.optional(),
  n: nullableNumberFromUnknown.optional(),
  N: z.string().trim().optional().nullable(),
  t: z.union([z.number(), z.string()]).transform((value) => String(value)).optional(),
});

export const BinanceSpotOutboundAccountPositionSchema = z.object({
  e: z.literal('outboundAccountPosition'),
  E: z.number().int().nonnegative(),
  B: z.array(
    z.object({
      a: z.string().trim().min(1),
      f: nullableNumberFromUnknown,
      l: nullableNumberFromUnknown,
    })
  ),
});

export type BinanceUserDataStreamMarketType = z.infer<
  typeof BinanceUserDataStreamMarketTypeSchema
>;
export type BinanceListenKeyResponse = z.infer<typeof BinanceListenKeyResponseSchema>;
export type BinanceFuturesOrderTradeUpdate = z.infer<
  typeof BinanceFuturesOrderTradeUpdateSchema
>;
export type BinanceFuturesAccountUpdate = z.infer<
  typeof BinanceFuturesAccountUpdateSchema
>;
export type BinanceSpotExecutionReport = z.infer<
  typeof BinanceSpotExecutionReportSchema
>;
export type BinanceSpotOutboundAccountPosition = z.infer<
  typeof BinanceSpotOutboundAccountPositionSchema
>;

export type NormalizedBinanceOrderTradeUpdateEvent = {
  eventType: 'ORDER_TRADE_UPDATE';
  marketType: BinanceUserDataStreamMarketType;
  eventTime: number;
  transactionTime: number | null;
  symbol: string;
  side: string;
  orderType: string;
  orderStatus: string;
  executionType: string;
  exchangeOrderId: string;
  clientOrderId: string | null;
  averagePrice: number | null;
  cumulativeFilledQuantity: number | null;
  lastFilledQuantity: number | null;
  lastFilledPrice: number | null;
  fee: number | null;
  feeCurrency: string | null;
  exchangeTradeId: string | null;
  raw: unknown;
};

export type NormalizedBinanceAccountUpdateEvent = {
  eventType: 'ACCOUNT_UPDATE';
  marketType: BinanceUserDataStreamMarketType;
  eventTime: number;
  transactionTime: number | null;
  balances: Array<{
    asset: string;
    walletBalance: number | null;
    crossWalletBalance: number | null;
    free: number | null;
    locked: number | null;
  }>;
  positions: Array<{
    symbol: string;
    amount: number | null;
    entryPrice: number | null;
    unrealizedPnl: number | null;
    positionSide: string | null;
  }>;
  raw: unknown;
};

export type NormalizedBinanceUserDataStreamEvent =
  | NormalizedBinanceOrderTradeUpdateEvent
  | NormalizedBinanceAccountUpdateEvent
  | {
      eventType: 'UNSUPPORTED';
      marketType: BinanceUserDataStreamMarketType;
      rawEventType: string | null;
      raw: unknown;
    };
