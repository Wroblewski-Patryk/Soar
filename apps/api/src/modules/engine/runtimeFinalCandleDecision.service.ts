import { SignalDirection } from '@prisma/client';
import { metricsStore } from '../../observability/metrics';
import { normalizeSymbol } from '../../lib/symbols';
import { StreamCandleEvent } from '../market-stream/binanceStream.types';
import { resolveRuntimeReferenceBalance, resolveRuntimeWalletFundsExhausted } from './runtimeCapitalContext.service';
import { runtimeMetricsService } from './runtimeMetrics.service';
import { mergeRuntimeStrategyVotes, StrategyVote } from './runtimeSignalMerge';
import { ActiveBot, ActiveBotStrategy, resolveRuntimeOrderQuantity } from './runtimeSignalLoopDefaults';
import { normalizeInterval } from './runtimeSignalLoopDefaults';
import { RuntimeSignalConditionLine, StrategyEvaluation } from './runtimeSignalEvaluationTypes';
import { RuntimeExchangeOrderGuardResult } from './runtimeExchangeOrderGuard.service';

type RuntimeSignalRouteEntry = {
  bot: ActiveBot;
};

type RuntimeFinalCandleDecisionContext = {
  nowMs: () => number;
  minDirectionalScore: number;
  runtimeSignalQuantity: number;
  signalDecisionDedupeRetentionMs: number;
  processedDecisionWindows: Map<string, number>;
  listActiveBotsFromTopologyCacheWithMetrics: () => Promise<ActiveBot[]>;
  closeInactiveRuntimeSessions?: (activeBotIds: string[]) => Promise<void> | void;
  listRuntimeManagedExternalPositions: () => Promise<
    Array<{ userId: string; symbol: string; botId?: string | null; walletId?: string | null }>
  >;
  resolveRuntimeRoutesForEvent: (
    event: StreamCandleEvent,
    topology: ActiveBot[]
  ) => RuntimeSignalRouteEntry[];
  ensureRuntimeSession?: (params: {
    userId: string;
    botId: string;
    mode: 'PAPER' | 'LIVE';
  }) => Promise<string | undefined> | string | undefined;
  recordRuntimeEvent?: (params: Record<string, unknown>) => Promise<void> | void;
  upsertRuntimeSymbolStat?: (params: Record<string, unknown>) => Promise<void> | void;
  countOpenPositionsForBotAndSymbols: (params: {
    userId: string;
    botId: string;
    symbols: string[];
  }) => Promise<number>;
  analyzePreTradeFn: (params: {
    userId: string;
    botId: string;
    symbol: string;
    mode: 'PAPER' | 'LIVE';
    marketType: 'FUTURES' | 'SPOT';
  }) => Promise<{
    allowed: boolean;
    reasons: unknown[];
    metrics: Record<string, unknown> | null | undefined;
  }>;
  createSignal: (params: {
    userId: string;
    botId?: string;
    strategyId?: string;
    symbol: string;
    timeframe: string;
    direction: SignalDirection;
    confidence: number;
    payload: Record<string, unknown>;
  }) => Promise<void>;
  validateExchangeOrderFn?: (input: {
    exchange: ActiveBot['exchange'];
    marketType: ActiveBot['marketType'];
    symbol: string;
    quantity: number;
    price: number;
  }) =>
    | Promise<RuntimeExchangeOrderGuardResult | undefined>
    | RuntimeExchangeOrderGuardResult
    | undefined;
  evaluateStrategy: (input: {
    marketType: 'FUTURES' | 'SPOT';
    symbol: string;
    strategy: ActiveBotStrategy;
    decisionOpenTime: number;
  }) => StrategyEvaluation;
  orchestrateFn: (params: Record<string, unknown>) => Promise<unknown>;
};

type RuntimeOrchestrationResult =
  | {
      status: 'opened';
      orderId: string;
      positionId: string;
    }
  | {
      status: 'submitted';
      orderId: string;
    }
  | {
      status: 'closed';
      orderId: string;
      positionId: string;
    }
  | {
      status: 'ignored';
      reason:
        | 'no_open_position'
        | 'no_flip_with_open_position'
        | 'already_open_same_side'
        | 'manual_managed_symbol'
        | 'dedupe_inflight'
        | 'dedupe_reused';
    };

type RuntimeOrchestrationIgnoredReason = Extract<RuntimeOrchestrationResult, { status: 'ignored' }>['reason'];

const asRuntimeOrchestrationResult = (value: unknown): RuntimeOrchestrationResult | null => {
  if (!value || typeof value !== 'object') return null;
  const parsed = value as Partial<RuntimeOrchestrationResult>;
  if (parsed.status === 'submitted') {
    if (typeof parsed.orderId !== 'string') return null;
    return {
      status: 'submitted',
      orderId: parsed.orderId,
    };
  }
  if (parsed.status === 'opened' || parsed.status === 'closed') {
    if (typeof parsed.orderId !== 'string' || typeof parsed.positionId !== 'string') return null;
    return {
      status: parsed.status,
      orderId: parsed.orderId,
      positionId: parsed.positionId,
    };
  }
  if (parsed.status === 'ignored' && typeof parsed.reason === 'string') {
    return {
      status: 'ignored',
      reason: parsed.reason as RuntimeOrchestrationIgnoredReason,
    };
  }
  return null;
};

const strategyMatchesCandleInterval = (strategyInterval: string | null | undefined, candleInterval: string) => {
  if (!strategyInterval) return true;
  return normalizeInterval(strategyInterval) === normalizeInterval(candleInterval);
};

const candleConfidence = (event: StreamCandleEvent) => {
  if (!Number.isFinite(event.open) || event.open === 0) return 0;
  const percentMove = Math.abs((event.close - event.open) / event.open);
  return Math.max(0, Math.min(1, percentMove));
};

const buildDecisionWindowKey = (input: {
  botId: string;
  symbolGroupId: string;
  symbol: string;
  interval: string;
  openTime: number;
  closeTime: number;
}) =>
  [
    input.botId,
    input.symbolGroupId,
    normalizeSymbol(input.symbol),
    normalizeInterval(input.interval),
    String(input.openTime),
    String(input.closeTime),
  ].join('|');

const pruneDecisionWindowDedup = (
  processedDecisionWindows: Map<string, number>,
  now: number,
  signalDecisionDedupeRetentionMs: number
) => {
  if (!Number.isFinite(signalDecisionDedupeRetentionMs) || signalDecisionDedupeRetentionMs <= 0) {
    return;
  }
  for (const [key, processedAt] of processedDecisionWindows.entries()) {
    if (now - processedAt > signalDecisionDedupeRetentionMs) {
      processedDecisionWindows.delete(key);
    }
  }
};

export const processRuntimeFinalCandleDecision = async (
  event: StreamCandleEvent,
  context: RuntimeFinalCandleDecisionContext
) => {
  const bots = await context.listActiveBotsFromTopologyCacheWithMetrics();
  await context.closeInactiveRuntimeSessions?.(bots.map((bot) => bot.id));
  const managedExternalSymbolKeys = new Set<string>();
  try {
    const managedExternalPositions = await context.listRuntimeManagedExternalPositions();
    for (const position of managedExternalPositions) {
      const normalizedSymbol = normalizeSymbol(position.symbol);
      if (!normalizedSymbol) continue;
      if (!position.botId) continue;
      managedExternalSymbolKeys.add(`${position.userId}:${position.botId}:${normalizedSymbol}`);
    }
  } catch (error) {
    console.error('RuntimeSignalLoop managed external positions lookup failed:', error);
    metricsStore.recordRuntimeExecutionError('runtime_external_positions_lookup_failure');
  }
  const runtimeRoutes = context.resolveRuntimeRoutesForEvent(event, bots);
  if (runtimeRoutes.length === 0) {
    const marketScopedBots = bots.filter(
      (bot) => bot.exchange === event.exchange && bot.marketType === event.marketType
    );
    await Promise.all(
      marketScopedBots.map(async (bot) => {
        const runtimeContext = bot.runtimeContext;
        if (
          !runtimeContext ||
          runtimeContext.symbols.length > 0 ||
          !(runtimeContext.strategies ?? [runtimeContext.strategy]).some((strategy) =>
            strategyMatchesCandleInterval(strategy.strategyInterval, event.interval)
          )
        ) {
          return;
        }
        const sessionId = await context.ensureRuntimeSession?.({
          userId: bot.userId,
          botId: bot.id,
          mode: bot.mode,
        });
        await context.recordRuntimeEvent?.({
          userId: bot.userId,
          botId: bot.id,
          mode: bot.mode,
          sessionId,
          eventType: 'SIGNAL_DECISION',
          level: 'DEBUG',
          symbol: event.symbol,
          strategyId: runtimeContext.strategyId,
          message: 'Runtime bot context has no routable symbols configured',
          payload: {
            reason: 'EMPTY_SYMBOL_SCOPE',
            symbolGroupId: runtimeContext.symbolGroupId,
            strategyIntervals: (runtimeContext.strategies ?? [runtimeContext.strategy]).map(
              (strategy) => strategy.strategyInterval ?? '*'
            ),
          },
          eventAt: new Date(event.eventTime),
        });
      })
    );
    return;
  }
  runtimeMetricsService.recordEligibleGroupsCount(runtimeRoutes.length);
  const runtimeSessionByBotId = new Map<string, string | undefined>();

  await Promise.all(
    runtimeRoutes.map(async ({ bot }) => {
      const runtimeContext = bot.runtimeContext;
      if (!runtimeContext) return;
      if (!runtimeSessionByBotId.has(bot.id)) {
        const ensuredSessionId = await context.ensureRuntimeSession?.({
          userId: bot.userId,
          botId: bot.id,
          mode: bot.mode,
        });
        runtimeSessionByBotId.set(bot.id, ensuredSessionId);
      }
      const sessionId = runtimeSessionByBotId.get(bot.id);

      const groupEvalStartedAt = context.nowMs();
      const strategyAnalysisById: Record<
        string,
        { conditionLines: RuntimeSignalConditionLine[]; indicatorSummary: string | null }
      > = {};
      const runtimeStrategies = runtimeContext.strategies ?? [runtimeContext.strategy];
      const eligibleStrategies = runtimeStrategies.filter((strategy) =>
        strategyMatchesCandleInterval(strategy.strategyInterval, event.interval)
      );
      const strategyVotes: StrategyVote[] = eligibleStrategies
        .map((strategy) => {
          const evaluation = context.evaluateStrategy({
            marketType: bot.marketType,
            symbol: event.symbol,
            strategy,
            decisionOpenTime: event.openTime,
          });
          strategyAnalysisById[strategy.strategyId] = {
            conditionLines: evaluation.conditionLines,
            indicatorSummary: evaluation.indicatorSummary,
          };
          const direction = evaluation.direction;
          if (!direction) return null;
          return {
            strategyId: strategy.strategyId,
            direction,
            priority: strategy.priority ?? 100,
            weight: strategy.weight ?? 1,
          } satisfies StrategyVote;
        })
        .filter((vote): vote is StrategyVote => Boolean(vote));

      const merged = mergeRuntimeStrategyVotes({
        strategies: eligibleStrategies,
        votes: strategyVotes,
        minDirectionalScore: context.minDirectionalScore,
      });
      const direction = merged.direction;
      if (!direction) {
        await context.recordRuntimeEvent?.({
          userId: bot.userId,
          botId: bot.id,
          mode: bot.mode,
          sessionId,
          eventType: 'SIGNAL_DECISION',
          level: 'DEBUG',
          symbol: event.symbol,
          strategyId: merged.strategyId ?? runtimeContext.strategyId,
          message: 'No trade decision after strategy merge',
          payload: {
            merge: merged.metadata,
            analysis: {
              byStrategy: strategyAnalysisById,
            },
          },
          eventAt: new Date(event.eventTime),
        });
        metricsStore.recordRuntimeMergeOutcome('NO_TRADE');
        metricsStore.recordRuntimeGroupEvaluation(context.nowMs() - groupEvalStartedAt);
        return;
      }

      const now = context.nowMs();
      pruneDecisionWindowDedup(
        context.processedDecisionWindows,
        now,
        context.signalDecisionDedupeRetentionMs
      );
      const decisionWindowKey = buildDecisionWindowKey({
        botId: bot.id,
        symbolGroupId: runtimeContext.symbolGroupId,
        symbol: event.symbol,
        interval: event.interval,
        openTime: event.openTime,
        closeTime: event.closeTime,
      });
      if (context.processedDecisionWindows.has(decisionWindowKey)) {
        metricsStore.recordRuntimeGroupEvaluation(context.nowMs() - groupEvalStartedAt);
        return;
      }
      context.processedDecisionWindows.set(decisionWindowKey, now);

      if (direction === 'LONG' || direction === 'SHORT') {
        const managedExternalKey = `${bot.userId}:${bot.id}:${normalizeSymbol(event.symbol)}`;
        if (managedExternalSymbolKeys.has(managedExternalKey)) {
          await context.recordRuntimeEvent?.({
            userId: bot.userId,
            botId: bot.id,
            mode: bot.mode,
            sessionId,
            eventType: 'PRETRADE_BLOCKED',
            level: 'WARN',
            symbol: event.symbol,
            strategyId: merged.strategyId,
            signalDirection: direction,
            message: 'Signal blocked due to managed external position on symbol',
            payload: {
              reason: 'EXTERNAL_POSITION_ALREADY_OPEN',
              symbolGroupId: runtimeContext.symbolGroupId,
            },
            eventAt: new Date(event.eventTime),
          });
          metricsStore.recordRuntimeMergeOutcome('NO_TRADE');
          metricsStore.recordRuntimeGroupEvaluation(context.nowMs() - groupEvalStartedAt);
          return;
        }

        const openPositionsInBotScope = await context.countOpenPositionsForBotAndSymbols({
          userId: bot.userId,
          botId: bot.id,
          symbols: runtimeContext.symbols,
        });
        if (openPositionsInBotScope >= runtimeContext.maxOpenPositions) {
          await context.recordRuntimeEvent?.({
            userId: bot.userId,
            botId: bot.id,
            mode: bot.mode,
            sessionId,
            eventType: 'PRETRADE_BLOCKED',
            level: 'WARN',
            symbol: event.symbol,
            strategyId: merged.strategyId,
            signalDirection: direction,
            message: 'Signal blocked because bot runtime context reached max open positions',
            payload: {
              reason: 'BOT_MAX_OPEN_POSITIONS_REACHED',
              openPositionsInBotScope,
              maxOpenPositions: runtimeContext.maxOpenPositions,
              symbolGroupId: runtimeContext.symbolGroupId,
              runtimeSymbols: runtimeContext.symbols,
            },
            eventAt: new Date(event.eventTime),
          });
          metricsStore.recordRuntimeMergeOutcome('NO_TRADE');
          metricsStore.recordRuntimeGroupEvaluation(context.nowMs() - groupEvalStartedAt);
          return;
        }

        const preTradeDecision = await context.analyzePreTradeFn({
          userId: bot.userId,
          botId: bot.id,
          symbol: event.symbol,
          mode: bot.mode,
          marketType: event.marketType,
        });
        if (!preTradeDecision.allowed) {
          await context.recordRuntimeEvent?.({
            userId: bot.userId,
            botId: bot.id,
            mode: bot.mode,
            sessionId,
            eventType: 'PRETRADE_BLOCKED',
            level: 'WARN',
            symbol: event.symbol,
            strategyId: merged.strategyId,
            signalDirection: direction,
            message: 'Pre-trade guard blocked execution',
            payload: {
              reasons: preTradeDecision.reasons,
              metrics: preTradeDecision.metrics,
            },
            eventAt: new Date(event.eventTime),
          });
          metricsStore.recordRuntimeMergeOutcome('NO_TRADE');
          metricsStore.recordRuntimeGroupEvaluation(context.nowMs() - groupEvalStartedAt);
          return;
        }
      }

      const strategyExitTraceOnly = direction === 'EXIT';
      const signalEventAt = new Date(event.eventTime);
      await context.createSignal({
        userId: bot.userId,
        botId: bot.id,
        strategyId: merged.strategyId,
        symbol: event.symbol,
        timeframe: normalizeInterval(event.interval),
        direction,
        confidence: candleConfidence(event),
        payload: {
          source: 'market_stream.candle_final',
          symbolGroupId: runtimeContext.symbolGroupId,
          strategyDriven: true,
          strategyInterval: event.interval,
          merge: merged.metadata,
          strategyExitTraceOnly,
          botRuntimeContext: {
            maxOpenPositions: runtimeContext.maxOpenPositions,
          },
          eventTime: event.eventTime,
          candle: {
            interval: event.interval,
            openTime: event.openTime,
            closeTime: event.closeTime,
            open: event.open,
            high: event.high,
            low: event.low,
            close: event.close,
            volume: event.volume,
          },
        },
      });
      await context.recordRuntimeEvent?.({
        userId: bot.userId,
        botId: bot.id,
        mode: bot.mode,
        sessionId,
        eventType: 'SIGNAL_DECISION',
        level: 'INFO',
        symbol: event.symbol,
        strategyId: merged.strategyId,
        signalDirection: direction,
        message: strategyExitTraceOnly
          ? 'Strategy EXIT signal recorded (trace-only)'
          : 'Strategy signal accepted for execution',
        payload: {
          merge: merged.metadata,
          strategyExitTraceOnly,
          analysis: {
            byStrategy: strategyAnalysisById,
          },
        },
        eventAt: signalEventAt,
      });
      await context.upsertRuntimeSymbolStat?.({
        userId: bot.userId,
        botId: bot.id,
        mode: bot.mode,
        sessionId,
        symbol: event.symbol,
        increments: {
          totalSignals: 1,
          ...(direction === 'LONG'
            ? { longEntries: 1 }
            : direction === 'SHORT'
              ? { shortEntries: 1 }
              : { exits: 1 }),
        },
        lastPrice: event.close,
        lastSignalAt: signalEventAt,
      });

      if (strategyExitTraceOnly) {
        metricsStore.recordRuntimeMergeOutcome('NO_TRADE');
        metricsStore.recordRuntimeGroupEvaluation(context.nowMs() - groupEvalStartedAt);
        return;
      }

      const selectedStrategy =
        runtimeStrategies.find((strategy) => strategy.strategyId === merged.strategyId) ??
        undefined;
      const referenceBalance = await resolveRuntimeReferenceBalance({
        userId: bot.userId,
        botId: bot.id,
        walletId: bot.walletId,
        mode: bot.mode,
        exchange: bot.exchange,
        marketType: bot.marketType,
        paperStartBalance: bot.paperStartBalance,
        nowMs: context.nowMs(),
      });
      const orderQuantity = resolveRuntimeOrderQuantity({
        strategy: selectedStrategy,
        price: event.close,
        marketType: bot.marketType,
        referenceBalance,
        runtimeSignalQuantity: context.runtimeSignalQuantity,
      });
      const leverage = Math.max(1, selectedStrategy?.strategyLeverage ?? 1);
      if (bot.mode === 'LIVE') {
        const exchangeOrderValidation = await context.validateExchangeOrderFn?.({
          exchange: bot.exchange,
          marketType: bot.marketType,
          symbol: event.symbol,
          quantity: orderQuantity,
          price: event.close,
        });

        if (exchangeOrderValidation && !exchangeOrderValidation.allowed) {
          await context.recordRuntimeEvent?.({
            userId: bot.userId,
            botId: bot.id,
            mode: bot.mode,
            sessionId,
            eventType: 'PRETRADE_BLOCKED',
            level: 'WARN',
            symbol: event.symbol,
            strategyId: merged.strategyId,
            signalDirection: direction,
            message: `Signal blocked for ${event.symbol} due to exchange order constraints`,
            payload: {
              reason: 'EXCHANGE_MIN_ORDER_CONSTRAINT',
              symbolGroupId: runtimeContext.symbolGroupId,
              constraintReason: exchangeOrderValidation.reason,
              quantity: orderQuantity,
              markPrice: event.close,
              leverage,
              exchange: bot.exchange,
              marketType: bot.marketType,
              details: exchangeOrderValidation.details,
            },
            eventAt: signalEventAt,
          });
          metricsStore.recordRuntimeMergeOutcome('NO_TRADE');
          metricsStore.recordRuntimeGroupEvaluation(context.nowMs() - groupEvalStartedAt);
          return;
        }
      }

      const insufficientWalletFunds = await resolveRuntimeWalletFundsExhausted({
        userId: bot.userId,
        botId: bot.id,
        walletId: bot.walletId,
        mode: bot.mode,
        exchange: bot.exchange,
        marketType: bot.marketType,
        paperStartBalance: bot.paperStartBalance,
        markPrice: event.close,
        addedQuantity: orderQuantity,
        leverage,
        nowMs: context.nowMs(),
      });
      if (insufficientWalletFunds) {
        await context.recordRuntimeEvent?.({
          userId: bot.userId,
          botId: bot.id,
          mode: bot.mode,
          sessionId,
          eventType: 'PRETRADE_BLOCKED',
          level: 'WARN',
          symbol: event.symbol,
          strategyId: merged.strategyId,
          signalDirection: direction,
          message: `Signal blocked for ${event.symbol} due to insufficient wallet budget`,
          payload: {
            reason: 'WALLET_INSUFFICIENT_FUNDS',
            symbolGroupId: runtimeContext.symbolGroupId,
            quantity: orderQuantity,
            markPrice: event.close,
            leverage,
          },
          eventAt: signalEventAt,
        });
        metricsStore.recordRuntimeMergeOutcome('NO_TRADE');
        metricsStore.recordRuntimeGroupEvaluation(context.nowMs() - groupEvalStartedAt);
        return;
      }

      const orchestrationResultRaw = await context.orchestrateFn({
        userId: bot.userId,
        botId: bot.id,
        walletId: bot.walletId ?? undefined,
        botMarketGroupId: runtimeContext.symbolGroupId,
        runtimeSessionId: sessionId,
        symbol: event.symbol,
        direction,
        strategyId: merged.strategyId,
        strategyLeverage: leverage,
        strategyInterval: event.interval,
        quantity: orderQuantity,
        markPrice: event.close,
        mode: bot.mode,
        candleOpenTime: event.openTime,
        candleCloseTime: event.closeTime,
      });
      const orchestrationResult = asRuntimeOrchestrationResult(orchestrationResultRaw);
      if (orchestrationResult?.status === 'ignored') {
        await context.recordRuntimeEvent?.({
          userId: bot.userId,
          botId: bot.id,
          mode: bot.mode,
          sessionId,
          eventType: 'PRETRADE_BLOCKED',
          level: 'WARN',
          symbol: event.symbol,
          strategyId: merged.strategyId,
          signalDirection: direction,
          message: 'Signal execution blocked by runtime orchestration guardrails',
          payload: {
            reason: orchestrationResult.reason,
            symbolGroupId: runtimeContext.symbolGroupId,
            merge: merged.metadata,
          },
          eventAt: signalEventAt,
        });
      }
      metricsStore.recordRuntimeMergeOutcome(direction);
      metricsStore.recordRuntimeGroupEvaluation(context.nowMs() - groupEvalStartedAt);
    })
  );
};
