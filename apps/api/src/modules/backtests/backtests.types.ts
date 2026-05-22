import { BacktestStatus } from '@prisma/client';
import { z } from 'zod';

const QueryBooleanSchema = z.preprocess((value) => {
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1') return true;
    if (normalized === 'false' || normalized === '0') return false;
  }
  return value;
}, z.boolean());

const DateTimeSchema = z.preprocess((value) => {
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return value;
}, z.date());

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null;

const countConfiguredStrategies = (value: unknown) => {
  if (!Array.isArray(value)) return 0;
  return value.filter((item) => {
    if (typeof item === 'string') return item.trim().length > 0;
    const row = asRecord(item);
    if (!row) return false;
    if (row.isEnabled === false) return false;
    return typeof row.strategyId === 'string' && row.strategyId.trim().length > 0;
  }).length;
};

export const hasUnsupportedMultiStrategyBacktestSeed = (seedConfig: unknown) => {
  const seed = asRecord(seedConfig);
  if (!seed) return false;

  const contextSnapshot = asRecord(seed.contextSnapshot);
  const marketGroupSnapshot =
    asRecord(contextSnapshot?.marketGroup) ??
    asRecord(contextSnapshot?.botMarketGroup) ??
    asRecord(seed.marketGroup) ??
    asRecord(seed.botMarketGroup);

  return [
    seed.strategyIds,
    seed.strategyLinks,
    contextSnapshot?.strategyIds,
    contextSnapshot?.strategyLinks,
    marketGroupSnapshot?.strategyIds,
    marketGroupSnapshot?.strategyLinks,
  ].some((value) => countConfiguredStrategies(value) > 1);
};

export const CreateBacktestRunSchema = z.object({
  name: z.string().trim().min(1),
  symbol: z.string().trim().min(1).optional(),
  timeframe: z.string().trim().min(1),
  strategyId: z.string().trim().min(1).optional(),
  marketUniverseId: z.string().uuid().optional(),
  startAt: DateTimeSchema.optional(),
  endAt: DateTimeSchema.optional(),
  seedConfig: z.any().optional(),
  notes: z.string().trim().optional(),
}).superRefine((value, ctx) => {
  if (!value.symbol && !value.marketUniverseId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Provide symbol or marketUniverseId',
      path: ['symbol'],
    });
  }
  if ((value.startAt && !value.endAt) || (!value.startAt && value.endAt)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Provide both startAt and endAt',
      path: ['startAt'],
    });
  }
  if (value.startAt && value.endAt && value.startAt.getTime() >= value.endAt.getTime()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'startAt must be earlier than endAt',
      path: ['startAt'],
    });
  }
  if (hasUnsupportedMultiStrategyBacktestSeed(value.seedConfig)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Multi-strategy backtests require the runtime signal merge contract and are not supported by the single-strategy backtest path',
      path: ['seedConfig'],
    });
  }
});

export const ListBacktestRunsQuerySchema = z.object({
  status: z.nativeEnum(BacktestStatus).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

export const ListBacktestTradesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(5000).default(1000),
});

export const GetBacktestTimelineQuerySchema = z.object({
  symbol: z.string().trim().min(1),
  cursor: z.coerce.number().int().min(0).default(0),
  chunkSize: z.coerce.number().int().min(50).max(10000).default(300),
  replayContext: z.enum(['isolated', 'portfolio']).default('isolated'),
  includeCandles: QueryBooleanSchema.default(true),
  includeIndicators: QueryBooleanSchema.default(true),
  includeEvents: QueryBooleanSchema.default(true),
});

export type CreateBacktestRunDto = z.infer<typeof CreateBacktestRunSchema>;
export type ListBacktestRunsQuery = z.infer<typeof ListBacktestRunsQuerySchema>;
export type ListBacktestTradesQuery = z.infer<typeof ListBacktestTradesQuerySchema>;
export type GetBacktestTimelineQuery = z.infer<typeof GetBacktestTimelineQuerySchema>;
