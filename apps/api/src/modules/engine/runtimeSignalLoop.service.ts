import { SignalDirection } from '@prisma/client';
import { metricsStore } from '../../observability/metrics';
import { normalizeSymbol } from '../../lib/symbols';
import { runtimeSignalLoopConfig } from '../../config/runtimeExecution';
import {
  MarketStreamEvent,
  StreamCandleEvent,
  StreamTickerEvent,
} from '../market-stream/binanceStream.types';
import {
  acquireMarketStreamWarmupLock,
  subscribeMarketStreamEvents,
} from '../market-stream/marketStreamFanout';
import { analyzePreTrade } from './preTrade.service';
import { orchestrateRuntimeSignal } from './executionOrchestrator.service';
import { runtimePositionAutomationService } from './runtimePositionAutomation.service';
import { getRuntimeTicker, upsertRuntimeTicker } from './runtimeTickerStore';
import { RuntimeSignalDecisionEngine } from './runtimeSignalDecisionEngine';
import { runtimeTopologyCacheService } from './runtimeTopologyCache.service';
import {
  RuntimeSignalMarketDataGateway,
  RuntimeCandle,
  RuntimeOrderBookSeries,
  RuntimeSignalWarmupLockHandle,
  RuntimeSignalWarmupLockInput,
} from './runtimeSignalMarketDataGateway';
import {
  resolveRuntimeReferenceBalance,
  resolveRuntimeWalletFundsExhausted,
} from './runtimeCapitalContext.service';
import { runtimeTelemetryService } from './runtimeTelemetry.service';
import { runtimeMetricsService } from './runtimeMetrics.service';
import { mergeRuntimeStrategyVotes, StrategyVote } from './runtimeSignalMerge';
import {
  validateRuntimeExchangeOrder,
  RuntimeExchangeOrderGuardResult,
} from './runtimeExchangeOrderGuard.service';
import {
  RuntimeSignalConditionLine,
  StrategyEvaluation,
} from './runtimeSignalEvaluationTypes';
import {
  ActiveBot,
  ActiveBotStrategy,
  deriveRuntimeGroupMaxOpenPositions,
  normalizeInterval,
  resolveRuntimeOrderQuantity,
  supportsRuntimeSignalLoopExchange,
  listActiveRuntimeBots,
  listRuntimeManagedExternalPositions,
  countOpenPositionsForBotAndSymbols,
  createRuntimeSignal,
} from './runtimeSignalLoopDefaults';
import { RuntimeSignalLoopSupervisor } from './runtimeSignalLoopSupervisor';
import { processRuntimeFinalCandleDecision } from './runtimeFinalCandleDecision.service';

export {
  deriveRuntimeGroupMaxOpenPositions,
  supportsRuntimeSignalLoopExchange,
} from './runtimeSignalLoopDefaults';

type RuntimeSignalLoopDeps = {
  subscribe: (
    handler: (event: MarketStreamEvent) => void | Promise<void>
  ) => Promise<() => Promise<void>>;
  listActiveBots: () => Promise<ActiveBot[]>;
  listRuntimeManagedExternalPositions: () => Promise<Array<{ userId: string; symbol: string }>>;
  countOpenPositionsForBotAndSymbols: (params: {
    userId: string;
    botId: string;
    symbols: string[];
  }) => Promise<number>;
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
  analyzePreTradeFn: typeof analyzePreTrade;
  orchestrateFn: typeof orchestrateRuntimeSignal;
  processPositionAutomation: (event: StreamTickerEvent) => Promise<void>;
  nowMs: () => number;
  ensureRuntimeSession?: (params: {
    userId: string;
    botId: string;
    mode: 'PAPER' | 'LIVE';
  }) => Promise<string>;
  closeRuntimeSession?: (params: {
    botId: string;
    status: 'COMPLETED' | 'FAILED' | 'CANCELED';
    stopReason?: string;
    errorMessage?: string;
  }) => Promise<void>;
  closeInactiveRuntimeSessions?: (activeBotIds: string[]) => Promise<void>;
  recordRuntimeEvent?: (params: {
    userId: string;
    botId: string;
    mode?: 'PAPER' | 'LIVE';
    sessionId?: string;
    eventType:
      | 'SESSION_STARTED'
      | 'SESSION_STOPPED'
      | 'HEARTBEAT'
      | 'SIGNAL_DECISION'
      | 'PRETRADE_BLOCKED'
      | 'ORDER_SUBMITTED'
      | 'ORDER_FILLED'
      | 'POSITION_OPENED'
      | 'POSITION_CLOSED'
      | 'DCA_EXECUTED'
      | 'ERROR';
    level?: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
    symbol?: string;
    botMarketGroupId?: string;
    strategyId?: string;
    signalDirection?: SignalDirection;
    message?: string;
    payload?: Record<string, unknown>;
    eventAt?: Date;
  }) => Promise<void>;
  upsertRuntimeSymbolStat?: (params: {
    userId: string;
    botId: string;
    mode?: 'PAPER' | 'LIVE';
    sessionId?: string;
    symbol: string;
    increments?: {
      totalSignals?: number;
      longEntries?: number;
      shortEntries?: number;
      exits?: number;
      dcaCount?: number;
      closedTrades?: number;
      winningTrades?: number;
      losingTrades?: number;
      realizedPnl?: number;
      grossProfit?: number;
      grossLoss?: number;
      feesPaid?: number;
    };
    lastPrice?: number;
    lastSignalAt?: Date;
    lastTradeAt?: Date;
    openPositionCount?: number;
    openPositionQty?: number;
  }) => Promise<void>;
  stallDetectorEnabled?: boolean;
  stallNoEventMs?: number;
  stallNoHeartbeatMs?: number;
  autoRestartEnabled?: boolean;
  autoRestartCooldownMs?: number;
  autoRestartMaxAttempts?: number;
  autoRestartWindowMs?: number;
  seriesQueueMaxPending?: number;
  warmupEnabled?: boolean;
  acquireWarmupLock?: (
    input: RuntimeSignalWarmupLockInput
  ) => Promise<RuntimeSignalWarmupLockHandle>;
  validateExchangeOrderFn?: (input: {
    exchange: ActiveBot['exchange'];
    marketType: ActiveBot['marketType'];
    symbol: string;
    quantity: number;
    price: number;
  }) => Promise<RuntimeExchangeOrderGuardResult>;
  listActiveBotsFromTopologyCache?: () => Promise<ActiveBot[]>;
  invalidateRuntimeTopologyCache?: () => void;
};

const defaultDeps: RuntimeSignalLoopDeps = {
  subscribe: subscribeMarketStreamEvents,
  listActiveBots: listActiveRuntimeBots,
  listRuntimeManagedExternalPositions,
  countOpenPositionsForBotAndSymbols,
  createSignal: createRuntimeSignal,
  analyzePreTradeFn: analyzePreTrade,
  orchestrateFn: orchestrateRuntimeSignal,
  processPositionAutomation: (event) => runtimePositionAutomationService.handleTickerEvent(event),
  nowMs: () => Date.now(),
  ensureRuntimeSession: (params) => runtimeTelemetryService.ensureRuntimeSession(params),
  closeRuntimeSession: (params) => runtimeTelemetryService.closeRuntimeSession(params),
  closeInactiveRuntimeSessions: (activeBotIds) =>
    runtimeTelemetryService.closeInactiveRuntimeSessions(activeBotIds),
  recordRuntimeEvent: (params) => runtimeTelemetryService.recordRuntimeEvent(params),
  upsertRuntimeSymbolStat: (params) => runtimeTelemetryService.upsertRuntimeSymbolStat(params),
  validateExchangeOrderFn: (params) => validateRuntimeExchangeOrder(params),
  listActiveBotsFromTopologyCache: () => runtimeTopologyCacheService.getActiveBots(),
  invalidateRuntimeTopologyCache: () => runtimeTopologyCacheService.invalidate(),
  acquireWarmupLock: (input) => acquireMarketStreamWarmupLock(input),
};

type RuntimeSignalRouteEntry = {
  bot: ActiveBot;
};

type RuntimeQueuedCandleEvent = {
  event: StreamCandleEvent;
  resolve: () => void;
  reject: (error: unknown) => void;
};

export class RuntimeSignalLoop {
  private unsubscribe: (() => Promise<void>) | null = null;
  private readonly processedDecisionWindows = new Map<string, number>();
  private readonly marketDataGateway = new RuntimeSignalMarketDataGateway({
    nowMs: () => this.deps.nowMs(),
    warmupEnabled: () => this.deps.warmupEnabled,
    acquireWarmupLock: (input) =>
      this.deps.acquireWarmupLock?.(input) ??
      Promise.resolve({
        acquired: true,
        release: async () => undefined,
      }),
  });
  private routedTopologyRef: ActiveBot[] | null = null;
  private readonly routeEntriesBySeriesKey = new Map<string, RuntimeSignalRouteEntry[]>();
  private readonly routeBotsByMarketKey = new Map<string, ActiveBot[]>();
  private readonly queuedCandleEventsBySeriesKey = new Map<string, RuntimeQueuedCandleEvent[]>();
  private readonly processingSeriesKeys = new Set<string>();
  private lastStreamEventAtMs: number | null = null;
  private lastSessionSyncSuccessAtMs: number | null = null;
  private lastKnownActiveBotIds = new Set<string>();
  private readonly supervisor = new RuntimeSignalLoopSupervisor({
    watchdogIntervalMs: runtimeSignalLoopConfig.sessionWatchdogIntervalMs,
    stallDetectorEnabled: () => this.isStallDetectorEnabled(),
    stallNoEventMs: () => this.resolveStallNoEventMs(),
    stallNoHeartbeatMs: () => this.resolveStallNoHeartbeatMs(),
    autoRestartEnabled: () => this.resolveAutoRestartEnabled(),
    autoRestartCooldownMs: () => this.resolveAutoRestartCooldownMs(),
    autoRestartMaxAttempts: () => this.resolveAutoRestartMaxAttempts(),
    autoRestartWindowMs: () => this.resolveAutoRestartWindowMs(),
    getIsRunning: () => this.isRunning(),
    getLastKnownActiveBotIds: () => Array.from(this.lastKnownActiveBotIds.values()),
    getLastStreamEventAtMs: () => this.lastStreamEventAtMs,
    getLastSessionSyncSuccessAtMs: () => this.lastSessionSyncSuccessAtMs,
    onWatchdogTick: async (now) => {
      const activeBots = await this.syncRuntimeSessions();
      this.lastSessionSyncSuccessAtMs = now;
      this.lastKnownActiveBotIds = new Set(activeBots.map((bot) => bot.id));
      return activeBots.map((bot) => bot.id);
    },
    onWatchdogError: (error) => {
      console.error('RuntimeSignalLoop session watchdog failed:', error);
      metricsStore.recordRuntimeExecutionError('runtime_watchdog_sync_failure');
    },
    onStall: async (reason, activeBotIds) => this.handleRuntimeStall(reason, activeBotIds),
    onAutoRestart: async () => this.start(),
    onAutoRestartError: (error, reason) => {
      console.error(`RuntimeSignalLoop auto-restart failed after ${reason}:`, error);
      metricsStore.recordRuntimeExecutionError('runtime_auto_restart_failure');
    },
    onAutoRestartMaxAttemptsGuard: () =>
      metricsStore.recordRuntimeExecutionError('runtime_restart_guard_max_attempts'),
  });

  private readonly decisionEngine = new RuntimeSignalDecisionEngine({
    getSeries: (marketType, symbol, interval) =>
      this.marketDataGateway.getSeries(marketType, symbol, interval),
    resolveFundingRateSeriesForCandles: (marketType, symbol, candles) =>
      this.marketDataGateway.resolveFundingRateSeriesForCandles(marketType, symbol, candles),
    resolveOpenInterestSeriesForCandles: (marketType, symbol, candles) =>
      this.marketDataGateway.resolveOpenInterestSeriesForCandles(marketType, symbol, candles),
    resolveOrderBookSeriesForCandles: (marketType, symbol, candles) =>
      this.marketDataGateway.resolveOrderBookSeriesForCandles(marketType, symbol, candles),
  });

  constructor(private readonly deps: RuntimeSignalLoopDeps = defaultDeps) {}

  private get candleSeries() {
    return this.marketDataGateway.getCandleSeriesStore();
  }

  private get fundingRatePoints() {
    return this.marketDataGateway.getFundingRatePointsStore();
  }

  private get openInterestPoints() {
    return this.marketDataGateway.getOpenInterestPointsStore();
  }

  private get orderBookPoints() {
    return this.marketDataGateway.getOrderBookPointsStore();
  }

  isRunning() {
    return this.unsubscribe !== null;
  }

  async start() {
    if (this.unsubscribe) return;
    this.supervisor.cancelPendingAutoRestartTimer();
    const activeBots = await this.syncRuntimeSessions();
    const now = Date.now();
    this.lastSessionSyncSuccessAtMs = now;
    this.lastStreamEventAtMs = now;
    this.lastKnownActiveBotIds = new Set(activeBots.map((bot) => bot.id));
    this.unsubscribe = await this.deps.subscribe(async (event) => {
      try {
        await this.handleEvent(event);
      } catch (error) {
        console.error('RuntimeSignalLoop event handler failed:', error);
        metricsStore.recordRuntimeExecutionError('runtime_event_handler_failure');
      }
    });
    this.supervisor.startWatchdog();
  }

  async stop() {
    this.supervisor.clearAutoRestartState();
    this.supervisor.stopWatchdog();
    if (!this.unsubscribe) return;
    const activeBots = await this.listActiveBotsDirectWithMetrics();
    await Promise.all(
      activeBots.map((bot) =>
        this.deps.closeRuntimeSession?.({
          botId: bot.id,
          status: 'CANCELED',
          stopReason: 'signal_loop_stopped',
        })
      )
    );
    await this.unsubscribe();
    this.unsubscribe = null;
    this.deps.invalidateRuntimeTopologyCache?.();
    this.clearRuntimeRoutingIndex();
    this.clearRuntimeSeriesEventQueues();
    this.lastStreamEventAtMs = null;
    this.lastSessionSyncSuccessAtMs = null;
    this.lastKnownActiveBotIds.clear();
  }

  private async syncRuntimeSessions() {
    const activeBots = await this.listActiveBotsDirectWithMetrics();
    await this.deps.closeInactiveRuntimeSessions?.(activeBots.map((bot) => bot.id));
    await Promise.all(
      activeBots.map((bot) =>
        this.deps.ensureRuntimeSession?.({
          userId: bot.userId,
          botId: bot.id,
          mode: bot.mode,
        })
      )
    );
    return activeBots;
  }

  private async listActiveBotsDirectWithMetrics() {
    return runtimeMetricsService.measureListActiveBots(async () => this.deps.listActiveBots());
  }

  private async listActiveBotsFromTopologyCacheWithMetrics() {
    const listActiveBotsFromTopologyCache = this.deps.listActiveBotsFromTopologyCache;
    if (!listActiveBotsFromTopologyCache) {
      const topology = await this.listActiveBotsDirectWithMetrics();
      this.rebuildRuntimeRoutingIndex(topology);
      return topology;
    }

    try {
      const topology = await runtimeMetricsService.measureListActiveBots(async () =>
        listActiveBotsFromTopologyCache()
      );
      this.rebuildRuntimeRoutingIndex(topology);
      return topology;
    } catch (error) {
      console.error('RuntimeSignalLoop topology cache read failed. Falling back to direct query.', error);
      metricsStore.recordRuntimeExecutionError('runtime_topology_cache_read_failure');
      const topology = await this.listActiveBotsDirectWithMetrics();
      this.rebuildRuntimeRoutingIndex(topology);
      return topology;
    }
  }

  private clearRuntimeRoutingIndex() {
    this.routedTopologyRef = null;
    this.routeEntriesBySeriesKey.clear();
    this.routeBotsByMarketKey.clear();
  }

  private buildRuntimeMarketKey(exchange: ActiveBot['exchange'], marketType: ActiveBot['marketType']) {
    return `${exchange}|${marketType}`;
  }

  private buildRuntimeSeriesRouteKey(input: {
    marketKey: string;
    symbol: string;
    interval: string;
  }) {
    return `${input.marketKey}|${input.symbol}|${input.interval}`;
  }

  private buildRuntimeSeriesEventKey(event: StreamCandleEvent) {
    const symbolKey = normalizeSymbol(event.symbol);
    const intervalKey = normalizeInterval(event.interval);
    return `${event.exchange}|${event.marketType}|${symbolKey}|${intervalKey}`;
  }

  private resolveSeriesQueueMaxPending() {
    if (Number.isFinite(this.deps.seriesQueueMaxPending as number)) {
      return Math.max(1, Math.floor(this.deps.seriesQueueMaxPending as number));
    }
    return runtimeSignalLoopConfig.seriesQueueMaxPending;
  }

  private clearRuntimeSeriesEventQueues() {
    for (const queue of this.queuedCandleEventsBySeriesKey.values()) {
      for (const queuedEvent of queue) {
        queuedEvent.resolve();
      }
    }
    this.queuedCandleEventsBySeriesKey.clear();
    this.processingSeriesKeys.clear();
  }

  private dequeueQueuedRuntimeCandleEvent(seriesKey: string) {
    const queue = this.queuedCandleEventsBySeriesKey.get(seriesKey);
    const next = queue?.shift();
    if (!queue || queue.length === 0) {
      this.queuedCandleEventsBySeriesKey.delete(seriesKey);
    }
    return next ?? null;
  }

  private enqueueFinalCandleEvent(event: StreamCandleEvent) {
    const seriesKey = this.buildRuntimeSeriesEventKey(event);
    return new Promise<void>((resolve, reject) => {
      const queuedEvent: RuntimeQueuedCandleEvent = { event, resolve, reject };
      if (!this.processingSeriesKeys.has(seriesKey)) {
        this.processingSeriesKeys.add(seriesKey);
        void this.drainRuntimeSeriesQueue(seriesKey, queuedEvent);
        return;
      }

      const queue = this.queuedCandleEventsBySeriesKey.get(seriesKey) ?? [];
      const maxPending = this.resolveSeriesQueueMaxPending();
      if (queue.length >= maxPending) {
        const droppedEvent = queue.shift();
        droppedEvent?.resolve();
        metricsStore.recordRuntimeExecutionError('runtime_series_queue_overflow');
      }
      queue.push(queuedEvent);
      this.queuedCandleEventsBySeriesKey.set(seriesKey, queue);
    });
  }

  private async drainRuntimeSeriesQueue(seriesKey: string, initialEvent: RuntimeQueuedCandleEvent) {
    let current: RuntimeQueuedCandleEvent | null = initialEvent;
    try {
      while (current) {
        try {
          await this.handleCandleEvent(current.event);
          current.resolve();
        } catch (error) {
          current.reject(error);
          console.error('RuntimeSignalLoop candle processing failed:', error);
          metricsStore.recordRuntimeExecutionError('runtime_candle_handler_failure');
        }
        current = this.dequeueQueuedRuntimeCandleEvent(seriesKey);
      }
    } finally {
      this.processingSeriesKeys.delete(seriesKey);
      const nextQueuedEvent = this.dequeueQueuedRuntimeCandleEvent(seriesKey);
      if (nextQueuedEvent) {
        this.processingSeriesKeys.add(seriesKey);
        void this.drainRuntimeSeriesQueue(seriesKey, nextQueuedEvent);
      }
    }
  }

  private rebuildRuntimeRoutingIndex(topology: ActiveBot[]) {
    if (this.routedTopologyRef === topology) return;
    this.clearRuntimeRoutingIndex();
    this.routedTopologyRef = topology;

    for (const bot of topology) {
      const marketKey = this.buildRuntimeMarketKey(bot.exchange, bot.marketType);
      const marketBots = this.routeBotsByMarketKey.get(marketKey);
      if (marketBots) {
        marketBots.push(bot);
      } else {
        this.routeBotsByMarketKey.set(marketKey, [bot]);
      }

      const runtimeContext = bot.runtimeContext;
      if (!runtimeContext) continue;

      const symbolKeys = runtimeContext.symbols
        .map((symbol) => normalizeSymbol(symbol))
        .filter((symbol): symbol is string => symbol.length > 0);
      const intervalKey = runtimeContext.strategy.strategyInterval
        ? normalizeInterval(runtimeContext.strategy.strategyInterval)
        : '*';

      if (symbolKeys.length === 0) {
        continue;
      }

      for (const symbolKey of symbolKeys) {
        const routeKey = this.buildRuntimeSeriesRouteKey({
          marketKey,
          symbol: symbolKey,
          interval: intervalKey,
        });
        const routeEntries = this.routeEntriesBySeriesKey.get(routeKey);
        if (routeEntries) {
          routeEntries.push({ bot });
        } else {
          this.routeEntriesBySeriesKey.set(routeKey, [{ bot }]);
        }
      }
    }

    for (const [marketKey, marketBots] of this.routeBotsByMarketKey.entries()) {
      this.routeBotsByMarketKey.set(
        marketKey,
        [...marketBots].sort((left, right) => left.id.localeCompare(right.id))
      );
    }

    for (const [routeKey, routeEntries] of this.routeEntriesBySeriesKey.entries()) {
      this.routeEntriesBySeriesKey.set(
        routeKey,
        [...routeEntries].sort((left, right) => {
          return left.bot.id.localeCompare(right.bot.id);
        })
      );
    }
  }

  private resolveRuntimeRoutesForEvent(event: StreamCandleEvent, topology: ActiveBot[]) {
    if (this.routedTopologyRef !== topology) {
      this.rebuildRuntimeRoutingIndex(topology);
    }

    const marketKey = this.buildRuntimeMarketKey(event.exchange, event.marketType);
    if (!this.routeBotsByMarketKey.has(marketKey)) return [];
    const symbolKey = normalizeSymbol(event.symbol);
    if (!symbolKey) return [];
    const intervalKey = normalizeInterval(event.interval);
    const candidateRouteKeys = [
      this.buildRuntimeSeriesRouteKey({
        marketKey,
        symbol: symbolKey,
        interval: intervalKey,
      }),
      this.buildRuntimeSeriesRouteKey({
        marketKey,
        symbol: symbolKey,
        interval: '*',
      }),
      this.buildRuntimeSeriesRouteKey({
        marketKey,
        symbol: '*',
        interval: intervalKey,
      }),
      this.buildRuntimeSeriesRouteKey({
        marketKey,
        symbol: '*',
        interval: '*',
      }),
    ];
    const seenRouteKeys = new Set<string>();
    const resolvedRoutes: RuntimeSignalRouteEntry[] = [];

    for (const routeKey of candidateRouteKeys) {
      const routeEntries = this.routeEntriesBySeriesKey.get(routeKey);
      if (!routeEntries?.length) continue;
      for (const routeEntry of routeEntries) {
        const dedupeKey = routeEntry.bot.id;
        if (seenRouteKeys.has(dedupeKey)) continue;
        seenRouteKeys.add(dedupeKey);
        resolvedRoutes.push(routeEntry);
      }
    }

    return resolvedRoutes;
  }

  private async handleRuntimeStall(
    reason: 'runtime_stall_no_event' | 'runtime_stall_no_heartbeat',
    activeBotIds: string[]
  ) {
    if (!this.unsubscribe) return;
    console.error(`RuntimeSignalLoop stall detected: ${reason}. Restart requested.`);
    metricsStore.recordRuntimeRestart(reason);
    if (reason === 'runtime_stall_no_heartbeat') {
      await Promise.all(
        activeBotIds.map((botId) =>
          this.deps.closeRuntimeSession?.({
            botId,
            status: 'CANCELED',
            stopReason: reason,
          })
        )
      );
    }
    await this.unsubscribe();
    this.unsubscribe = null;
    this.supervisor.stopWatchdog();
    this.processedDecisionWindows.clear();
    this.deps.invalidateRuntimeTopologyCache?.();
    this.clearRuntimeRoutingIndex();
    this.clearRuntimeSeriesEventQueues();
    this.lastStreamEventAtMs = null;
    this.lastSessionSyncSuccessAtMs = null;
    this.lastKnownActiveBotIds.clear();
    this.supervisor.scheduleAutoRestart(reason);
  }

  private isStallDetectorEnabled() {
    if (typeof this.deps.stallDetectorEnabled === 'boolean') return this.deps.stallDetectorEnabled;
    return runtimeSignalLoopConfig.stallDetectorEnabled;
  }

  private resolveStallNoEventMs() {
    if (Number.isFinite(this.deps.stallNoEventMs as number)) {
      return Math.max(10_000, this.deps.stallNoEventMs as number);
    }
    return runtimeSignalLoopConfig.stallNoEventMs;
  }

  private resolveStallNoHeartbeatMs() {
    if (Number.isFinite(this.deps.stallNoHeartbeatMs as number)) {
      return Math.max(10_000, this.deps.stallNoHeartbeatMs as number);
    }
    return runtimeSignalLoopConfig.stallNoHeartbeatMs;
  }

  private resolveAutoRestartEnabled() {
    if (typeof this.deps.autoRestartEnabled === 'boolean') return this.deps.autoRestartEnabled;
    return runtimeSignalLoopConfig.autoRestartEnabled;
  }

  private resolveAutoRestartCooldownMs() {
    if (Number.isFinite(this.deps.autoRestartCooldownMs as number)) {
      return Math.max(1_000, this.deps.autoRestartCooldownMs as number);
    }
    return runtimeSignalLoopConfig.autoRestartCooldownMs;
  }

  private resolveAutoRestartMaxAttempts() {
    if (Number.isFinite(this.deps.autoRestartMaxAttempts as number)) {
      return Math.max(1, Math.floor(this.deps.autoRestartMaxAttempts as number));
    }
    return runtimeSignalLoopConfig.autoRestartMaxAttempts;
  }

  private resolveAutoRestartWindowMs() {
    const minWindow = this.resolveAutoRestartCooldownMs();
    if (Number.isFinite(this.deps.autoRestartWindowMs as number)) {
      return Math.max(minWindow, this.deps.autoRestartWindowMs as number);
    }
    return Math.max(minWindow, runtimeSignalLoopConfig.autoRestartWindowMs);
  }

  async processTickerEvent(event: StreamTickerEvent) {
    await this.handleTickerEvent(event);
  }

  async processCandleEvent(event: StreamCandleEvent) {
    await this.handleCandleEvent(event);
  }

  private async handleEvent(event: MarketStreamEvent) {
    const now = Date.now();
    this.lastStreamEventAtMs = now;
    metricsStore.recordRuntimeSignalLag(now - event.eventTime);
    if (event.type === 'candle') {
      if (event.isFinal) {
        await this.enqueueFinalCandleEvent(event);
        return;
      }
      await this.handleCandleEvent(event);
      return;
    }
    if (event.type === 'ticker') {
      await this.handleTickerEvent(event);
    }
  }

  private async handleCandleEvent(event: StreamCandleEvent) {
    if (!event.isFinal) return;
    await this.marketDataGateway.ingestCandleEvent(event);
    await this.processPositionAutomationFallbackFromCandle(event);
    await processRuntimeFinalCandleDecision(event, {
      nowMs: () => this.deps.nowMs(),
      minDirectionalScore: runtimeSignalLoopConfig.minDirectionalScore,
      runtimeSignalQuantity: runtimeSignalLoopConfig.signalQuantity,
      signalDecisionDedupeRetentionMs: runtimeSignalLoopConfig.signalDecisionDedupeRetentionMs,
      processedDecisionWindows: this.processedDecisionWindows,
      listActiveBotsFromTopologyCacheWithMetrics: () => this.listActiveBotsFromTopologyCacheWithMetrics(),
      closeInactiveRuntimeSessions: async (activeBotIds) => {
        await this.deps.closeInactiveRuntimeSessions?.(activeBotIds);
      },
      listRuntimeManagedExternalPositions: () => this.deps.listRuntimeManagedExternalPositions(),
      resolveRuntimeRoutesForEvent: (candle, topology) => this.resolveRuntimeRoutesForEvent(candle, topology),
      ensureRuntimeSession: async (params) => this.deps.ensureRuntimeSession?.(params),
      recordRuntimeEvent: async (params) => {
        await this.deps.recordRuntimeEvent?.(params as any);
      },
      upsertRuntimeSymbolStat: async (params) => {
        await this.deps.upsertRuntimeSymbolStat?.(params as any);
      },
      countOpenPositionsForBotAndSymbols: (params) => this.deps.countOpenPositionsForBotAndSymbols(params),
      analyzePreTradeFn: (params) => this.deps.analyzePreTradeFn(params),
      createSignal: (params) => this.deps.createSignal(params),
      validateExchangeOrderFn: async (input) => this.deps.validateExchangeOrderFn?.(input),
      evaluateStrategy: (input) => this.evaluateStrategy(input),
      orchestrateFn: async (params) => this.deps.orchestrateFn(params as any),
    });
  }

  getRecentCloses(input: {
    marketType: 'FUTURES' | 'SPOT';
    symbol: string;
    interval?: string | null;
    limit?: number;
  }) {
    return this.marketDataGateway.getRecentCloses(input);
  }

  getSeries(input: {
    marketType: 'FUTURES' | 'SPOT';
    symbol: string;
    interval?: string | null;
  }): RuntimeCandle[] | null {
    return this.marketDataGateway.getSeries(input.marketType, input.symbol, input.interval);
  }

  resolveFundingRateSeriesForCandles(input: {
    marketType: 'FUTURES' | 'SPOT';
    symbol: string;
    candles: RuntimeCandle[];
  }) {
    return this.marketDataGateway.resolveFundingRateSeriesForCandles(
      input.marketType,
      input.symbol,
      input.candles
    );
  }

  resolveOpenInterestSeriesForCandles(input: {
    marketType: 'FUTURES' | 'SPOT';
    symbol: string;
    candles: RuntimeCandle[];
  }) {
    return this.marketDataGateway.resolveOpenInterestSeriesForCandles(
      input.marketType,
      input.symbol,
      input.candles
    );
  }

  resolveOrderBookSeriesForCandles(input: {
    marketType: 'FUTURES' | 'SPOT';
    symbol: string;
    candles: RuntimeCandle[];
  }): RuntimeOrderBookSeries | null {
    return this.marketDataGateway.resolveOrderBookSeriesForCandles(
      input.marketType,
      input.symbol,
      input.candles
    );
  }

  private evaluateStrategy(input: {
    marketType: 'FUTURES' | 'SPOT';
    symbol: string;
    strategy: ActiveBotStrategy;
    decisionOpenTime: number;
  }): StrategyEvaluation {
    return this.decisionEngine.evaluateStrategy(input);
  }

  private async handleTickerEvent(event: StreamTickerEvent) {
    upsertRuntimeTicker(event);
    await this.deps.processPositionAutomation(event);
  }

  private async processPositionAutomationFallbackFromCandle(event: StreamCandleEvent) {
    const latestTicker = getRuntimeTicker(event.symbol, {
      exchange: event.exchange,
      marketType: event.marketType,
    });
    const tickerIsFresh =
      latestTicker &&
      Math.abs(event.eventTime - latestTicker.eventTime) <= runtimeSignalLoopConfig.tickerFreshnessFallbackMs;
    if (tickerIsFresh) return;
    await this.deps.processPositionAutomation({
      type: 'ticker',
      exchange: event.exchange,
      marketType: event.marketType,
      symbol: event.symbol,
      eventTime: event.eventTime,
      lastPrice: event.close,
      priceChangePercent24h: 0,
    });
  }
}

export const runtimeSignalLoop = new RuntimeSignalLoop();
