import { describe, expect, it, vi } from 'vitest';
import { processRuntimeFinalCandleDecision } from './runtimeFinalCandleDecision.service';

vi.mock('./runtimeCapitalContext.service', () => ({
  resolveRuntimeReferenceBalance: vi.fn(async () => 10_000),
  resolveRuntimeWalletFundsExhausted: vi.fn(async () => false),
}));

const baseStrategy = {
  strategyId: 'strategy-1',
  strategyInterval: '1m',
  strategyLeverage: 5,
  walletRisk: 10,
  strategyConfig: {
    open: {
      indicatorsLong: [],
      indicatorsShort: [],
    },
  },
  priority: 10,
  weight: 1,
};

const baseBot = {
  id: 'bot-1',
  userId: 'user-1',
  mode: 'PAPER' as const,
  exchange: 'BINANCE' as const,
  paperStartBalance: 1000,
  marketType: 'FUTURES' as const,
  walletId: 'wallet-1',
  marketGroups: [
    {
      id: 'group-1',
      symbolGroupId: 'symbol-group-1',
      executionOrder: 1,
      maxOpenPositions: 2,
      symbols: ['BTCUSDT'],
      strategies: [baseStrategy],
    },
  ],
};

const baseEvent = {
  type: 'candle' as const,
  exchange: 'BINANCE' as const,
  marketType: 'FUTURES' as const,
  symbol: 'BTCUSDT',
  interval: '1m',
  eventTime: 10_000,
  openTime: 0,
  closeTime: 59_000,
  open: 100,
  high: 101,
  low: 99,
  close: 100.5,
  volume: 1_000,
  isFinal: true as const,
};

const createContext = (options?: { direction: 'LONG' | 'SHORT' | 'EXIT' | null }) => {
  const direction = options?.direction === undefined ? 'LONG' : options.direction;
  const bot = structuredClone(baseBot);
  const group = bot.marketGroups[0];
  const createSignal = vi.fn(async () => undefined);
  const orchestrateFn = vi.fn(async () => ({ status: 'opened', orderId: 'o1', positionId: 'p1' }));
  const recordRuntimeEvent = vi.fn(async () => undefined);

  return {
    context: {
      nowMs: () => 1_000,
      minDirectionalScore: 1,
      runtimeSignalQuantity: 0.01,
      signalDecisionDedupeRetentionMs: 21_600_000,
      processedDecisionWindows: new Map<string, number>(),
      listActiveBotsFromTopologyCacheWithMetrics: async () => [bot],
      closeInactiveRuntimeSessions: async () => undefined,
      listRuntimeManagedExternalPositions: async () => [],
      resolveRuntimeRoutesForEvent: () => [{ bot, group }],
      ensureRuntimeSession: async () => 'runtime-session-1',
      recordRuntimeEvent,
      upsertRuntimeSymbolStat: async () => undefined,
      countOpenPositionsForBotAndSymbols: async () => 0,
      analyzePreTradeFn: async () => ({
        allowed: true,
        reasons: [],
        metrics: {},
      }),
      createSignal,
      evaluateStrategy: () => ({
        direction,
        conditionLines: [],
        indicatorSummary: null,
      }),
      orchestrateFn,
    },
    createSignal,
    orchestrateFn,
    recordRuntimeEvent,
  };
};

describe('runtimeFinalCandleDecision.service', () => {
  it('records no-trade decision when merged direction is null', async () => {
    const { context, createSignal, orchestrateFn, recordRuntimeEvent } = createContext({
      direction: null,
    });

    await processRuntimeFinalCandleDecision(baseEvent, context as any);

    expect(createSignal).not.toHaveBeenCalled();
    expect(orchestrateFn).not.toHaveBeenCalled();
    expect(recordRuntimeEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'SIGNAL_DECISION',
        level: 'DEBUG',
      })
    );
  });

  it('deduplicates duplicate final-candle decision windows across repeated calls', async () => {
    const { context, createSignal, orchestrateFn } = createContext({
      direction: 'LONG',
    });

    await processRuntimeFinalCandleDecision(baseEvent, context as any);
    await processRuntimeFinalCandleDecision(baseEvent, context as any);

    expect(createSignal).toHaveBeenCalledTimes(1);
    expect(orchestrateFn).toHaveBeenCalledTimes(1);
  });

  it('records EXIT as trace-only and skips orchestration execution', async () => {
    const { context, createSignal, orchestrateFn, recordRuntimeEvent } = createContext({
      direction: 'EXIT',
    });

    await processRuntimeFinalCandleDecision(baseEvent, context as any);

    expect(createSignal).toHaveBeenCalledWith(
      expect.objectContaining({
        direction: 'EXIT',
        payload: expect.objectContaining({
          strategyExitTraceOnly: true,
        }),
      }),
    );
    expect(orchestrateFn).not.toHaveBeenCalled();
    expect(recordRuntimeEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'SIGNAL_DECISION',
        message: 'Strategy EXIT signal recorded (trace-only)',
        payload: expect.objectContaining({
          strategyExitTraceOnly: true,
        }),
      }),
    );
  });
});
