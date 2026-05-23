import { describe, expect, it, vi } from 'vitest';
import { processRuntimeFinalCandleDecision } from './runtimeFinalCandleDecision.service';
import { resolveRuntimeWalletFundsExhausted } from './runtimeCapitalContext.service';

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

const baseBot: {
  id: string;
  userId: string;
  mode: 'PAPER' | 'LIVE';
  exchange: 'BINANCE';
  paperStartBalance: number;
  marketType: 'FUTURES' | 'SPOT';
  walletId: string;
  runtimeContext: {
    symbolGroupId: string;
    strategyId: string;
    maxOpenPositions: number;
    symbols: string[];
    strategy: typeof baseStrategy;
  };
} = {
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
  direction?: 'LONG' | 'SHORT' | 'EXIT' | null;
  strategyInterval?: string;
  orchestrationResult?:
    | { status: 'opened'; orderId: string; positionId: string }
    | { status: 'submitted'; orderId: string }
    | { status: 'ignored'; reason: 'already_open_same_side' | 'dedupe_inflight' };
  botOverrides?: Partial<typeof baseBot>;
}) => {
  const direction = options?.direction === undefined ? 'LONG' : options.direction;
  const orchestrationResult = options?.orchestrationResult ?? {
    status: 'opened' as const,
    orderId: 'o1',
    positionId: 'p1',
  };
  const bot = structuredClone(baseBot);
  Object.assign(bot, options?.botOverrides ?? {});
  bot.runtimeContext = {
    ...bot.runtimeContext,
    ...(options?.botOverrides?.runtimeContext ?? {}),
    strategy: {
      ...bot.runtimeContext.strategy,
      ...options?.botOverrides?.runtimeContext?.strategy,
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
      listRuntimeManagedExternalPositions: async (): Promise<
        Array<{ userId: string; symbol: string; botId?: string | null; walletId?: string | null }>
      > => [],
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

  it('sizes LIVE derivative orders with contract size before orchestration', async () => {
    const walletFundsGuard = resolveRuntimeWalletFundsExhausted as ReturnType<typeof vi.fn>;
    walletFundsGuard.mockClear();
    const { context, orchestrateFn } = createContext({
      botOverrides: {
        mode: 'LIVE',
        exchange: 'GATEIO' as 'BINANCE',
      },
    });
    (context as any).resolveExchangeOrderRulesFn = vi.fn(async () => ({
      minQuantity: 1,
      minNotional: null,
      quantityStep: 1,
      contractSize: 10,
    }));

    await processRuntimeFinalCandleDecision(baseEvent, context as any);

    expect(orchestrateFn).toHaveBeenCalledWith(
      expect.objectContaining({
        quantity: expect.closeTo(4.97512438, 8),
        markPrice: 100.5,
        mode: 'LIVE',
      })
    );
    expect(walletFundsGuard).toHaveBeenCalledWith(
      expect.objectContaining({
        addedQuantity: expect.closeTo(4.97512438, 8),
        contractSize: 10,
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

  it('passes LIVE kill-switch flags into pre-trade and blocks before orchestration', async () => {
    const { context, createSignal, orchestrateFn, recordRuntimeEvent } = createContext({
      direction: 'LONG',
      botOverrides: {
        mode: 'LIVE',
      },
    });
    const analyzePreTradeFn = vi.fn(async () => ({
      allowed: false,
      reasons: ['global_kill_switch_enabled', 'emergency_stop_enabled'],
      metrics: {},
    }));
    (context as any).liveGlobalKillSwitch = true;
    (context as any).liveEmergencyStop = true;
    (context as any).analyzePreTradeFn = analyzePreTradeFn;

    await processRuntimeFinalCandleDecision(baseEvent, context as any);

    expect(analyzePreTradeFn).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'LIVE',
        globalKillSwitch: true,
        emergencyStop: true,
      })
    );
    expect(createSignal).not.toHaveBeenCalled();
    expect(orchestrateFn).not.toHaveBeenCalled();
    expect(recordRuntimeEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'PRETRADE_BLOCKED',
        message: 'Pre-trade guard blocked execution',
        payload: expect.objectContaining({
          reasons: ['global_kill_switch_enabled', 'emergency_stop_enabled'],
        }),
      })
    );
  });

  it('does not pass LIVE kill-switch flags into PAPER pre-trade', async () => {
    const { context } = createContext({
      direction: 'LONG',
    });
    const analyzePreTradeFn = vi.fn(async () => ({
      allowed: true,
      reasons: [],
      metrics: {},
    }));
    (context as any).liveGlobalKillSwitch = true;
    (context as any).liveEmergencyStop = true;
    (context as any).analyzePreTradeFn = analyzePreTradeFn;

    await processRuntimeFinalCandleDecision(baseEvent, context as any);

    expect(analyzePreTradeFn).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'PAPER',
        globalKillSwitch: false,
        emergencyStop: false,
      })
    );
  });

  it('does not block a bot when a managed external position belongs to another bot on the same symbol', async () => {
    const { context, createSignal, orchestrateFn, recordRuntimeEvent } = createContext({
      direction: 'LONG',
    });
    context.listRuntimeManagedExternalPositions = vi.fn(async () => [
      {
        userId: 'user-1',
        botId: 'other-bot',
        walletId: 'wallet-other',
        symbol: 'BTCUSDT',
      },
    ]);

    await processRuntimeFinalCandleDecision(baseEvent, context as any);

    expect(createSignal).toHaveBeenCalledTimes(1);
    expect(orchestrateFn).toHaveBeenCalledTimes(1);
    expect(recordRuntimeEvent).not.toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'PRETRADE_BLOCKED',
        payload: expect.objectContaining({
          reason: 'EXTERNAL_POSITION_ALREADY_OPEN',
        }),
      })
    );
  });

  it('blocks only the bot that owns a managed external position on the signal symbol', async () => {
    const { context, createSignal, orchestrateFn, recordRuntimeEvent } = createContext({
      direction: 'LONG',
    });
    context.listRuntimeManagedExternalPositions = vi.fn(async () => [
      {
        userId: 'user-1',
        botId: 'bot-1',
        walletId: 'wallet-1',
        symbol: 'BTCUSDT',
      },
    ]);

    await processRuntimeFinalCandleDecision(baseEvent, context as any);

    expect(createSignal).not.toHaveBeenCalled();
    expect(orchestrateFn).not.toHaveBeenCalled();
    expect(recordRuntimeEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        botId: 'bot-1',
        eventType: 'PRETRADE_BLOCKED',
        payload: expect.objectContaining({
          reason: 'EXTERNAL_POSITION_ALREADY_OPEN',
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

  it('keeps signal-driven LIVE execution explicit as submitted while preserving exact runtime context', async () => {
    const { context, createSignal, orchestrateFn, recordRuntimeEvent } = createContext({
      direction: 'LONG',
      orchestrationResult: {
        status: 'submitted',
        orderId: 'live-order-1',
      },
      botOverrides: {
        mode: 'LIVE',
        walletId: 'wallet-live-1',
        marketType: 'FUTURES',
        runtimeContext: {
          symbolGroupId: 'symbol-group-live-1',
          strategyId: 'strategy-live-1',
          maxOpenPositions: 2,
          symbols: ['BTCUSDT'],
          strategy: {
            ...baseStrategy,
            strategyId: 'strategy-live-1',
            strategyInterval: '5m',
            strategyLeverage: 12,
            walletRisk: 7.5,
          },
        },
      },
      strategyInterval: '5m',
    });

    await processRuntimeFinalCandleDecision(
      {
        ...baseEvent,
        interval: '5m',
        openTime: 300_000,
        closeTime: 599_000,
        close: 63_500,
      },
      context as any
    );

    expect(createSignal).toHaveBeenCalledWith(
      expect.objectContaining({
        symbol: 'BTCUSDT',
        timeframe: '5m',
        direction: 'LONG',
        payload: expect.objectContaining({
          strategyInterval: '5m',
        }),
      })
    );
    expect(orchestrateFn).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        botId: 'bot-1',
        walletId: 'wallet-live-1',
        botMarketGroupId: 'symbol-group-live-1',
        runtimeSessionId: 'runtime-session-1',
        symbol: 'BTCUSDT',
        direction: 'LONG',
        strategyId: 'strategy-live-1',
        strategyLeverage: 12,
        strategyInterval: '5m',
        quantity: expect.any(Number),
        markPrice: 63_500,
        mode: 'LIVE',
        candleOpenTime: 300_000,
        candleCloseTime: 599_000,
      })
    );
    expect(recordRuntimeEvent).not.toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'PRETRADE_BLOCKED',
      })
    );
  });
});
