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
  runtimeContext: {
    symbolGroupId: 'symbol-group-1',
    strategyId: 'strategy-1',
    maxOpenPositions: 2,
    symbols: ['BTCUSDT'],
    strategy: baseStrategy,
  },
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

const createContext = (options?: {
  direction: 'LONG' | 'SHORT' | 'EXIT' | null;
  strategyInterval?: string;
  orchestrationResult?:
    | { status: 'opened'; orderId: string; positionId: string }
    | { status: 'ignored'; reason: 'already_open_same_side' | 'dedupe_inflight' };
}) => {
  const direction = options?.direction === undefined ? 'LONG' : options.direction;
  const orchestrationResult = options?.orchestrationResult ?? {
    status: 'opened' as const,
    orderId: 'o1',
    positionId: 'p1',
  };
  const bot = structuredClone(baseBot);
  bot.runtimeContext = {
    ...bot.runtimeContext,
    strategy: {
      ...bot.runtimeContext.strategy,
      strategyInterval: options?.strategyInterval ?? bot.runtimeContext.strategy.strategyInterval,
    },
  };
  const createSignal = vi.fn(async () => undefined);
  const orchestrateFn = vi.fn(async () => orchestrationResult);
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
      resolveRuntimeRoutesForEvent: () => [{ bot }],
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
        message: 'No trade decision after strategy merge',
        payload: expect.objectContaining({
          merge: expect.objectContaining({
            reason: 'no_votes',
          }),
        }),
      })
    );
  });

  it('records explicit PRETRADE_BLOCKED diagnostics when group max open positions is reached', async () => {
    const { context, createSignal, orchestrateFn, recordRuntimeEvent } = createContext({
      direction: 'LONG',
    });
    context.countOpenPositionsForBotAndSymbols = vi.fn(async () => 2);

    await processRuntimeFinalCandleDecision(baseEvent, context as any);

    expect(createSignal).not.toHaveBeenCalled();
    expect(orchestrateFn).not.toHaveBeenCalled();
    expect(recordRuntimeEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'PRETRADE_BLOCKED',
        level: 'WARN',
        message: 'Signal blocked because bot runtime context reached max open positions',
        payload: expect.objectContaining({
          reason: 'BOT_MAX_OPEN_POSITIONS_REACHED',
          openPositionsInBotScope: 2,
          maxOpenPositions: 2,
        }),
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

  it('persists runtime signal truth with the real candle interval instead of hardcoded 1m', async () => {
    const { context, createSignal } = createContext({
      direction: 'LONG',
      strategyInterval: '5m',
    });

    await processRuntimeFinalCandleDecision(
      {
        ...baseEvent,
        interval: '5m',
      },
      context as any
    );

    expect(createSignal).toHaveBeenCalledWith(
      expect.objectContaining({
        direction: 'LONG',
        timeframe: '5m',
        payload: expect.objectContaining({
          strategyInterval: '5m',
        }),
      })
    );
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

  it('records explicit PRETRADE_BLOCKED diagnostics when orchestration returns ignored result', async () => {
    const { context, orchestrateFn, recordRuntimeEvent } = createContext({
      direction: 'LONG',
      orchestrationResult: {
        status: 'ignored',
        reason: 'already_open_same_side',
      },
    });

    await processRuntimeFinalCandleDecision(baseEvent, context as any);

    expect(orchestrateFn).toHaveBeenCalledTimes(1);
    expect(recordRuntimeEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'PRETRADE_BLOCKED',
        level: 'WARN',
        message: 'Signal execution blocked by runtime orchestration guardrails',
        payload: expect.objectContaining({
          reason: 'already_open_same_side',
        }),
      })
    );
  });
});
