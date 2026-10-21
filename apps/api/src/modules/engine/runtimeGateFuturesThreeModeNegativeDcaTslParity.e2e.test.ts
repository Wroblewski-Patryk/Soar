import { createHash, randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { resolve as resolvePath } from 'node:path';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { app } from '../../index';
import { prisma } from '../../prisma/client';
import { createClaimedBacktestRunJob } from '../backtests/backtestClaimedRun';
import { simulateInterleavedPortfolio } from '../backtests/backtestPortfolioSimulation.service';
import { ensureSubscriptionCatalog, setActiveSubscriptionForUser } from '../subscriptions/subscriptions.service';
import { parseStrategySignalRules } from './strategySignalEvaluator';
import { RuntimeSignalLoop } from './runtimeSignalLoop.service';
import { listActiveRuntimeBots } from './runtimeSignalLoopDefaults';
import { RuntimeSignalDecisionEngine } from './runtimeSignalDecisionEngine';
import { executeRuntimeDca, RuntimePositionAutomationService } from './runtimePositionAutomation.service';
import { loadDurableDcaProgress } from './runtimeDurableDcaProgress';
import { runtimePositionStateStore } from './runtimePositionState.store';
import { processRuntimeFinalCandleDecision } from './runtimeFinalCandleDecision.service';
import { resolveRuntimeDcaFundsExhausted } from './runtimeCapitalContext.service';
import { clearRuntimeSignalMarketDataStore } from './runtimeSignalMarketDataGateway';
import { clearRuntimeTickerStore, upsertRuntimeTicker } from './runtimeTickerStore';

// The venue fill, balance and symbol-rule seams are synthetic. The signal evaluator,
// LIVE decision, intent/order/fill transaction path and position lifecycle remain real.
const venue = vi.hoisted(() => ({ submits: [] as string[], lookups: [] as string[] }));
vi.mock('../exchange/exchangeAdapterBoundary.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../exchange/exchangeAdapterBoundary.service')>();
  const unexpected = async () => { throw new Error('unexpected real exchange transport'); };
  return { ...actual, submitLiveOrderThroughBoundary: unexpected,
    lookupLiveOrderThroughBoundary: unexpected,
    cancelLiveOrderThroughBoundary: unexpected,
    fetchSupportedExchangePositionsRaw: unexpected,
    fetchSupportedExchangeOpenOrdersRaw: unexpected,
    fetchSupportedExchangeTradeHistoryRaw: unexpected,
    fetchSupportedExchangeWalletCashflowHistoryRaw: unexpected,
    fetchSupportedExchangeBalanceRaw: async (input: { exchange: string; marketType: string }) => {
      if (input.exchange !== 'GATEIO' || input.marketType !== 'FUTURES')
        throw new Error('unexpected exchange balance lookup');
      return { total: { USDT: 1000 }, free: { USDT: 900 } };
    } };
});
vi.mock('../exchange/exchangeConnectorFactory.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../exchange/exchangeConnectorFactory.service')>();
  return { ...actual, createPublicExchangeConnector: () => {
    throw new Error('unexpected public exchange transport');
  } };
});
vi.mock('../exchange/exchangePublicMarketData.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../exchange/exchangePublicMarketData.service')>();
  const unexpected = async () => { throw new Error('unexpected public market transport'); };
  return { ...actual,
    fetchExchangePublicTickerSnapshot: unexpected,
    fetchExchangePublicRecentCandles: unexpected,
    fetchExchangePublicFundingRateHistory: unexpected,
    fetchExchangePublicOpenInterestHistory: unexpected,
    fetchExchangePublicOrderBookSnapshot: unexpected,
  };
});
vi.mock('../exchange/exchangeSymbolRules.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../exchange/exchangeSymbolRules.service')>();
  return { ...actual, getExchangeSymbolRules: async (input: {
    exchange: string; marketType: string; symbol: string;
  }) => {
    if (input.exchange !== 'GATEIO' || input.marketType !== 'FUTURES' ||
        input.symbol !== 'BTCUSDT') throw new Error('unexpected symbol-rule lookup');
    return { minQuantity: 1, minNotional: 5,
      quantityStep: 1, priceStep: 0.01, contractSize: 1 };
  } };
});
vi.mock('../orders/orders.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../orders/orders.service')>();
  return { ...actual,
    openOrder: (userId: string, payload: Parameters<typeof actual.openOrder>[1]) =>
      actual.openOrder(userId, payload, {
        executeLiveOrder: async ({ payload: order }) => {
          const id = order.clientOrderId;
          if (!id || order.mode !== 'LIVE' || !order.price || order.quantity <= 0)
            throw new Error('internal LIVE fixture requires an identified priced order');
          const notional = order.price * order.quantity * syntheticRules.contractSize;
          if (!Number.isInteger(order.quantity) || order.quantity < syntheticRules.minAmount ||
              notional < syntheticRules.minNotional)
            throw new Error('synthetic Gate unit-contract amount or minimum not executable');
          if (venue.submits.includes(id)) throw new Error('duplicate venue submit');
          venue.submits.push(id);
          const hash = createHash('sha256').update(id).digest('hex').slice(0, 20);
          const exchangeOrderId = `mock-gateio-futures-${hash}`;
          const exchangeTradeId = `mock-fill-${hash}`;
          const fee = notional * 0.0004;
          return { exchangeOrderId, status: 'FILLED' as const,
            exchangeFilledQuantity: order.quantity, exchangeAverageFillPrice: order.price,
            fee, feeSource: 'EXCHANGE_FILL' as const, feePending: false,
            feeCurrency: 'USDT', exchangeTradeId,
            fills: [{ exchangeTradeId, exchangeOrderId, symbol: order.symbol,
              side: order.side, price: order.price, quantity: order.quantity,
              notional, feeCost: fee, feeCurrency: 'USDT', feeRate: 0.0004,
              executedAt: new Date(), source: 'createOrder' as const, raw: { fixture: true } }],
          };
        },
        lookupLiveOrder: async ({ payload: order }) => {
          venue.lookups.push(order.clientOrderId ?? '');
          throw new Error('unexpected venue lookup after confirmed fill');
        },
      }),
  };
});

const enabled = process.env.RUN_GATE_FUTURES_FULL_SIGNAL_THREE_MODE_PROOF === '1';
const stage = process.env.GATE_FUTURES_FULL_SIGNAL_THREE_MODE_STAGE;
if (enabled && stage !== 'open' && stage !== 'resume')
  throw new Error('Three-mode parity proof requires open or resume stage');
const proofIt = enabled && stage === 'open' ? it : it.skip;
const resumeIt = enabled && stage === 'resume' ? it : it.skip;
const symbol = 'BTCUSDT';
const leverage = 1;
const feeRate = 0.0004;
const initialBalance = 1000;
const walletRisk = 10;
const strategyConfig = {
  open: { direction: 'long', noMatchAction: 'EXIT',
    indicatorsLong: [{ name: 'MOMENTUM', condition: '>', value: 0, params: { period: 2 } }],
    indicatorsShort: [] },
  close: { mode: 'advanced', tp: 99, sl: 99,
    ttp: [], tsl: [{ percent: -50, arm: 25 }, { percent: -25, arm: 12 }] },
  additional: { dcaEnabled: true, dcaMode: 'advanced', dcaSizingBasis: 'usdt_contribution_v1',
    dcaTimes: 1, dcaLevels: [{ percent: -70, multiplier: 1 }],
    orderType: 'MARKET', marginMode: 'ISOLATED' },
};
const syntheticRules = { minAmount: 1, minNotional: 5,
  amountPrecision: 1, amountPrecisionMode: 'TICK_SIZE' as const, contractSize: 1 };
const prices = [99, 100, 100, 49, 57, 25, 24.99, 20];

const checkFinalNoSignalCandle = async (index: number, baseTime: number,
  expectedBotIds: string[]) => {
  const candles = prices.slice(0, index + 1).map((price, candleIndex) => {
    const openTime = baseTime + candleIndex * 60_000;
    return { openTime, closeTime: openTime + 59_999,
      open: price, high: price, low: price, close: price, volume: 1_000 };
  });
  const engine = new RuntimeSignalDecisionEngine({
    getSeries: () => candles,
    resolveFundingRateSeriesForCandles: () => null,
    resolveOpenInterestSeriesForCandles: () => null,
    resolveOrderBookSeriesForCandles: () => null,
  });
  const topology = (await listActiveRuntimeBots()).filter((bot) =>
    expectedBotIds.includes(bot.id));
  expect(topology.map((bot) => bot.id).sort()).toEqual([...expectedBotIds].sort());
  const decisions: Array<'LONG' | 'SHORT' | 'EXIT' | null> = [];
  await processRuntimeFinalCandleDecision({ type: 'candle', exchange: 'GATEIO',
    marketType: 'FUTURES', symbol, interval: '1m', eventTime: candles[index].closeTime,
    ...candles[index], isFinal: true }, {
    nowMs: Date.now, minDirectionalScore: 1, runtimeSignalQuantity: 1,
    signalDecisionDedupeRetentionMs: 21_600_000, processedDecisionWindows: new Map(),
    listActiveBotsFromTopologyCacheWithMetrics: async () => topology,
    listRuntimeManagedExternalPositions: async () => [],
    resolveRuntimeRoutesForEvent: (_event, bots) => bots.map((bot) => ({ bot })),
    countOpenPositionsForBotAndSymbols: async ({ botId }) =>
      prisma.position.count({ where: { botId, status: 'OPEN' } }),
    analyzePreTradeFn: async () => { throw new Error('pretrade on no-signal candle'); },
    createSignal: async () => { throw new Error('signal on no-signal candle'); },
    evaluateStrategy: (input) => {
      const evaluation = engine.evaluateStrategy(input);
      decisions.push(evaluation.direction);
      return evaluation;
    },
    orchestrateFn: async () => { throw new Error('order on no-signal candle'); },
  });
  expect(decisions).toEqual([null, null]);
};

const resumeBothInFreshProcess = (paperPositionId: string, livePositionId: string,
  baseTime: number) =>
  new Promise<void>((resolve, reject) => {
    const runtimeUrl = new URL(process.env.DATABASE_URL ?? '');
    runtimeUrl.pathname = '/postgres';
    const child = spawn(process.execPath, [
      resolvePath(process.cwd(), 'node_modules/vitest/vitest.mjs'), 'run',
      'src/modules/engine/runtimeGateFuturesThreeModeNegativeDcaTslParity.e2e.test.ts',
      '-t', 'resumes PAPER and mock LIVE from shared Redis', '--reporter=dot',
    ], {
      cwd: process.cwd(),
      env: { ...process.env, NODE_ENV: 'test', DATABASE_URL: runtimeUrl.toString(),
        TEST_DATABASE_URL: process.env.DATABASE_URL,
        GATE_FUTURES_FULL_SIGNAL_THREE_MODE_STAGE: 'resume',
        GATE_THREE_MODE_PAPER_POSITION_ID: paperPositionId,
        GATE_THREE_MODE_LIVE_POSITION_ID: livePositionId,
        GATE_THREE_MODE_OPEN_PID: String(process.pid),
        GATE_THREE_MODE_BASE_TIME: String(baseTime) },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let output = '';
    const timeout = setTimeout(() => child.kill(), 30_000);
    child.stdout.on('data', (chunk: Buffer) => { output += chunk.toString(); });
    child.stderr.on('data', (chunk: Buffer) => { output += chunk.toString(); });
    child.on('error', reject);
    child.on('close', (code) => {
      clearTimeout(timeout);
      if (code === 0 && /Tests\s+1 passed/.test(output)) resolve();
      else reject(new Error(`Three-mode resume process exited ${code}: ${output}`));
    });
  });

describe('BACKTEST/PAPER/Gate.io FUTURES internal mock LIVE full signal and position parity', () => {
  proofIt('evaluates one shared signal tape and persists HOLD, DCA and TSL across three modes', async () => {
    const databaseUrl = new URL(process.env.DATABASE_URL ?? '');
    if (databaseUrl.pathname.slice(1) !== 'soar_position_parity_008_test' ||
        databaseUrl.hostname !== '127.0.0.1' || !databaseUrl.port ||
        databaseUrl.port === '5432') {
      throw new Error('Position parity proof requires its own local soar_position_parity_008_test database');
    }
    const redisUrl = new URL(process.env.REDIS_URL ?? '');
    if (redisUrl.hostname !== '127.0.0.1' || !redisUrl.port || redisUrl.port === '6379') {
      throw new Error('Position parity proof requires its own local Redis port');
    }
    if (await prisma.user.count() !== 0) {
      throw new Error('Position parity proof requires an empty disposable user dataset');
    }
    const previousPaperFeeRate = process.env.RUNTIME_PAPER_TAKER_FEE_RATE;
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.RUNTIME_PAPER_TAKER_FEE_RATE = String(feeRate);
    clearRuntimeTickerStore();
    clearRuntimeSignalMarketDataStore();
    const loop = new RuntimeSignalLoop();
    let botId: string | undefined;
    let positionId: string | undefined;
    let liveBotId: string | undefined;
    let livePositionId: string | undefined;
    try {
      const agent = request.agent(app);
      const email = `position-parity-${randomUUID()}@example.test`;
      expect((await agent.post('/auth/register').send({ email, password: 'test1234' })).status)
        .toBe(201);
      const user = await prisma.user.findUniqueOrThrow({ where: { email } });
      await ensureSubscriptionCatalog(prisma);
      await setActiveSubscriptionForUser(prisma, {
        userId: user.id, planCode: 'PROFESSIONAL', source: 'ADMIN_OVERRIDE',
        metadata: { reason: 'isolated-three-mode-parity-proof' },
      });
      const strategyResponse = await agent.post('/dashboard/strategies').send({
        name: 'BACKTEST/PAPER/mock LIVE parity cycle', interval: '1m', leverage, walletRisk,
        config: strategyConfig,
      });
      expect(strategyResponse.status).toBe(201);
      const strategyId = strategyResponse.body.id as string;
      const persistedStrategy = await prisma.strategy.findUniqueOrThrow({
        where: { id: strategyId },
      });
      const universe = await prisma.marketUniverse.create({ data: {
        userId: user.id, name: 'Parity universe', exchange: 'GATEIO', marketType: 'FUTURES',
        baseCurrency: 'USDT', whitelist: [], blacklist: [],
      } });
      const group = await prisma.symbolGroup.create({ data: {
        userId: user.id, marketUniverseId: universe.id,
        name: 'Parity symbols', symbols: [symbol],
      } });
      const wallet = await prisma.wallet.create({ data: {
        userId: user.id, name: 'Parity PAPER wallet', mode: 'PAPER',
        exchange: 'GATEIO', marketType: 'FUTURES', baseCurrency: 'USDT',
        paperInitialBalance: initialBalance,
      } });
      const botResponse = await agent.post('/dashboard/bots').send({
        name: 'Parity PAPER bot', walletId: wallet.id, strategyId,
        marketGroupId: group.id, isActive: true, liveOptIn: false,
        consentTextVersion: null,
      });
      expect(botResponse.status).toBe(201);
      botId = botResponse.body.id as string;

      vi.stubGlobal('fetch', async () => { throw new Error('unexpected network transport'); });
      process.env.NODE_ENV = 'development';
      const key = await prisma.apiKey.create({ data: { userId: user.id,
        label: 'local synthetic only', exchange: 'GATEIO',
        apiKey: 'local-fake-only', apiSecret: 'local-fake-only' } });
      const liveWallet = await prisma.wallet.create({ data: { userId: user.id,
        name: 'Three-mode internal LIVE wallet', mode: 'LIVE', exchange: 'GATEIO',
        marketType: 'FUTURES', baseCurrency: 'USDT', apiKeyId: key.id } });
      const liveUniverse = await prisma.marketUniverse.create({ data: { userId: user.id,
        name: 'Three-mode LIVE universe', exchange: 'GATEIO', marketType: 'FUTURES',
        baseCurrency: 'USDT', whitelist: [symbol], blacklist: [] } });
      const liveGroup = await prisma.symbolGroup.create({ data: { userId: user.id,
        marketUniverseId: liveUniverse.id, name: 'Three-mode LIVE symbols', symbols: [symbol] } });
      const liveBot = await prisma.bot.create({ data: { userId: user.id,
        name: 'Three-mode internal LIVE bot', mode: 'LIVE', exchange: 'GATEIO',
        marketType: 'FUTURES', positionMode: 'ONE_WAY', apiKeyId: key.id,
        isActive: true, liveOptIn: true, consentTextVersion: 'mvp-v1',
        maxOpenPositions: 1, walletId: liveWallet.id, strategyId,
        symbolGroupId: liveGroup.id } });
      liveBotId = liveBot.id;
      const assignment = await prisma.botMarketGroup.create({ data: { userId: user.id,
        botId: liveBot.id, symbolGroupId: liveGroup.id, lifecycleStatus: 'ACTIVE',
        executionOrder: 1, maxOpenPositions: 1, isEnabled: true } });
      await prisma.marketGroupStrategyLink.create({ data: { userId: user.id,
        botId: liveBot.id, botMarketGroupId: assignment.id, strategyId } });
      const activeTopology = await listActiveRuntimeBots();
      expect(activeTopology.map((bot) => bot.id)).toContain(liveBot.id);
      expect(activeTopology.find((bot) => bot.id === liveBot.id)?.runtimeContext?.symbols)
        .toContain(symbol);
      const baseTime = Date.now();
      // Both runtime bots evaluate every final candle from the same saved strategy.
      // BACKTEST uses the same indexed close prices as historical fill marks.
      const candlesFor = (prices: number[]) => Array.from({ length: 100 }, (_, index) => {
        const price = prices[index] ?? prices.at(-1)!;
        const openTime = baseTime + index * 60_000;
        return { openTime, closeTime: openTime + 59_999,
          open: price, high: price, low: price, close: price, volume: 1_000 };
      });
      const emitCandle = (index: number, price: number) => {
        const openTime = baseTime + index * 60_000;
        return loop.processCandleEvent({
          type: 'candle', exchange: 'GATEIO', marketType: 'FUTURES', symbol,
          interval: '1m', eventTime: openTime + 59_999, openTime,
          closeTime: openTime + 59_999, open: price, high: price,
          low: price, close: price, volume: 1_000, isFinal: true,
        });
      };
      await emitCandle(0, prices[0]);
      await emitCandle(1, prices[1]);
      await emitCandle(2, prices[2]);
      await loop.processTickerEvent({ type: 'ticker', exchange: 'GATEIO',
        marketType: 'FUTURES', symbol, eventTime: baseTime + 2 * 60_000 + 59_999,
        lastPrice: prices[2], priceChangePercent24h: 1 });
      const opened = await prisma.position.findFirstOrThrow({
        where: { botId, symbol, status: 'OPEN' },
      });
      positionId = opened.id;
      expect(opened.entryPrice * opened.quantity / leverage).toBeCloseTo(100, 4);
      await emitCandle(3, prices[3]);
      expect((await prisma.position.findUniqueOrThrow({ where: { id: opened.id } })).status)
        .toBe('OPEN');
      expect(await prisma.signal.count({ where: { botId, symbol, direction: 'EXIT' } })).toBe(0);

      const liveOpened = await prisma.position.findFirstOrThrow({
        where: { botId: liveBot.id, symbol, status: 'OPEN' },
      });
      const liveEntry = { positionId: liveOpened.id };
      livePositionId = liveEntry.positionId;
      expect(liveOpened.entryPrice * liveOpened.quantity / leverage).toBeCloseTo(100, 4);
      for (const ownedBotId of [botId, liveBot.id]) {
        const entrySignals = await prisma.signal.findMany({
          where: { botId: ownedBotId, direction: 'LONG' },
        });
        expect(entrySignals).toHaveLength(1);
        expect(entrySignals[0].strategyId).toBe(strategyId);
        const payload = entrySignals[0].payload as { candle?: { openTime?: number };
          strategyDriven?: boolean };
        expect(payload.strategyDriven).toBe(true);
        expect(payload.candle?.openTime).toBe(baseTime + 2 * 60_000);
        expect(await prisma.signal.count({ where: { botId: ownedBotId, direction: 'EXIT' } }))
          .toBe(0);
        expect(await prisma.position.count({ where: { botId: ownedBotId, status: 'OPEN' } }))
          .toBe(1);
      }

      const createAutomation = () => new RuntimePositionAutomationService({
        getCanonicalPositionState: async (id) => {
          const position = await prisma.position.findUnique({ where: { id } });
          return position ? { quantity: position.quantity, averageEntryPrice: position.entryPrice }
            : null;
        },
        getDurableDcaProgress: (input) => loadDurableDcaProgress(input),
        // Only external symbol metadata is synthetic; executeRuntimeDca keeps the real policy/fill path.
        executeDca: (input) => executeRuntimeDca(input, { getOrderRules: async () => syntheticRules,
          resolveFundsExhausted: (context) => resolveRuntimeDcaFundsExhausted(context) }),
        resolveLifecyclePrice: ({ fallbackPrice }) => fallbackPrice,
      });
      const send = async (service: RuntimePositionAutomationService, index: number, price: number) => {
        const event = { type: 'ticker' as const, exchange: 'GATEIO' as const,
          marketType: 'FUTURES', symbol, eventTime: baseTime + index * 60_000 + 59_999,
          lastPrice: price, priceChangePercent24h: 0 } as const;
        await service.handleTickerEvent(event);
        upsertRuntimeTicker(event);
      };
      // Exercise the shared Redis tracker across process restart, as production does.
      const firstService = createAutomation();
      await send(firstService, 3, prices[3]);
      expect((await prisma.position.findUniqueOrThrow({ where: { id: opened.id } })).status)
        .toBe('OPEN');
      const armed = await runtimePositionStateStore.getPositionRuntimeState(opened.id);
      expect(armed?.trailingLossActiveLevelIndex).toBe(0);
      expect(armed?.trailingLossLimitPercent).toBeCloseTo(-0.76, 5);
      await send(firstService, 4, prices[4]);
      await emitCandle(4, prices[4]);
      expect((await prisma.position.findUniqueOrThrow({ where: { id: opened.id } })).status)
        .toBe('OPEN');
      expect((await runtimePositionStateStore.getPositionRuntimeState(opened.id))
        ?.trailingLossLimitPercent).toBeCloseTo(-0.68, 5);
      await send(firstService, 5, prices[5]);
      await emitCandle(5, prices[5]);
      const afterDca = await prisma.position.findUniqueOrThrow({ where: { id: opened.id } });
      expect(afterDca.status).toBe('OPEN');
      expect(afterDca.quantity).toBeGreaterThan(opened.quantity);
      expect(afterDca.entryPrice).toBeLessThan(opened.entryPrice);
      const afterDcaProtection = await runtimePositionStateStore.getPositionRuntimeState(opened.id);
      expect(afterDcaProtection?.trailingLossActiveLevelIndex).toBe(0);
      expect(afterDcaProtection?.trailingLossLimitPercent).toBeCloseTo(-0.2, 5);
      expect(afterDca.entryPrice * (1 + afterDcaProtection!.trailingLossLimitPercent!))
        .toBeCloseTo(32, 6);
      expect(await prisma.trade.count({ where: { positionId: opened.id, lifecycleAction: 'DCA' } }))
        .toBe(1);
      expect(await prisma.trade.count({ where: { positionId: opened.id, lifecycleAction: 'CLOSE' } }))
        .toBe(0);
      const liveAfterDca = await prisma.position.findUniqueOrThrow({
        where: { id: liveEntry.positionId },
      });
      expect(liveAfterDca.status).toBe('OPEN');
      expect(liveAfterDca.quantity).toBeCloseTo(afterDca.quantity, 7);
      expect(liveAfterDca.entryPrice).toBeCloseTo(afterDca.entryPrice, 6);
      const liveProtection = await runtimePositionStateStore.getTrustedPositionRuntimeState(
        liveEntry.positionId);
      expect(liveProtection?.trailingLossActiveLevelIndex).toBe(0);
      expect(liveAfterDca.entryPrice * (1 + liveProtection!.trailingLossLimitPercent!))
        .toBeCloseTo(32, 6);
      expect(await prisma.trade.count({ where: { positionId: liveEntry.positionId,
        lifecycleAction: 'CLOSE' } })).toBe(0);
      expect(await prisma.runtimeExecutionDedupe.count({ where: { botId: liveBot.id,
        commandType: 'DCA', status: 'SUCCEEDED' } })).toBe(1);
      const liveBeforeOrders = await prisma.order.findMany({ where: {
        positionId: liveEntry.positionId }, orderBy: { createdAt: 'asc' } });
      const liveBeforeFills = await prisma.orderFill.findMany({ where: {
        orderId: { in: liveBeforeOrders.map((order) => order.id) } } });
      expect(liveBeforeOrders).toHaveLength(2);
      expect(liveBeforeFills).toHaveLength(2);
      expect(liveBeforeFills.map((fill) => fill.price).sort((a, b) => b - a))
        .toEqual([prices[2], prices[5]]);
      expect(venue.submits).toHaveLength(2);
      expect(venue.lookups).toHaveLength(0);
      for (const ownedBotId of [botId, liveBot.id]) {
        for (const index of [3, 5]) {
          expect(await prisma.botRuntimeEvent.count({ where: {
            botId: ownedBotId, eventType: 'SIGNAL_DECISION',
            message: 'No trade decision after strategy merge',
            eventAt: new Date(baseTime + index * 60_000 + 59_999),
          } })).toBe(1);
        }
      }

      await resumeBothInFreshProcess(opened.id, liveEntry.positionId, baseTime);
      const paperClosed = await prisma.position.findUniqueOrThrow({ where: { id: opened.id } });
      expect(paperClosed.status).toBe('CLOSED');
      expect(paperClosed.closeReason).toBe('TSL');
      expect(await prisma.position.count({ where: { botId } })).toBe(1);
      expect(await prisma.signal.count({ where: { botId, symbol, direction: 'EXIT' } })).toBe(0);
      for (const ownedBotId of [botId, liveBot.id]) {
        expect(await prisma.signal.count({ where: { botId: ownedBotId, direction: 'LONG' } }))
          .toBe(1);
        expect(await prisma.signal.count({ where: { botId: ownedBotId, direction: 'EXIT' } }))
          .toBe(0);
      }
      const paperTrades = await prisma.trade.findMany({ where: { positionId: opened.id } });
      const paperOrders = await prisma.order.findMany({ where: { positionId: opened.id } });
      expect(paperOrders).toHaveLength(3);
      expect(paperOrders.every((order) => order.status === 'FILLED')).toBe(true);
      expect(new Set(paperOrders.map((order) => order.id)).size).toBe(3);
      const paperEntry = paperTrades.filter((trade) => trade.lifecycleAction === 'OPEN');
      const paperAdds = paperTrades.filter((trade) => trade.lifecycleAction === 'DCA')
        .sort((a, b) => a.executedAt.getTime() - b.executedAt.getTime());
      const paperCloses = paperTrades.filter((trade) => trade.lifecycleAction === 'CLOSE');
      expect([paperEntry.length, paperAdds.length, paperCloses.length]).toEqual([1, 1, 1]);
      expect([paperEntry[0].price, ...paperAdds.map((trade) => trade.price),
        paperCloses[0].price]).toEqual([prices[2], prices[5], prices[6]]);
      expect([...paperTrades].sort((a, b) => a.executedAt.getTime() - b.executedAt.getTime())
        .map((trade) => trade.lifecycleAction)).toEqual(['OPEN', 'DCA', 'CLOSE']);
      expect(paperCloses[0].closeReason).toBe('TSL');
      const paperBasis = [paperEntry[0], ...paperAdds];
      expect(paperBasis.map((trade) => trade.quantity)).toEqual([1, 4]);
      const paperQuantity = paperBasis.reduce((sum, trade) => sum + trade.quantity, 0);
      const paperAverage = paperBasis.reduce((sum, trade) => sum + trade.price * trade.quantity, 0)
        / paperQuantity;
      expect(paperClosed.quantity).toBeCloseTo(paperQuantity, 7);
      expect(paperClosed.entryPrice).toBeCloseTo(paperAverage, 7);
      const paperContributions = paperBasis.map((trade) => trade.price * trade.quantity / leverage);
      paperContributions.forEach((amount, index) => expect(amount)
        .toBeCloseTo([100, 100][index], 4));
      const paperFees = paperTrades.reduce((sum, trade) => sum + (trade.fee ?? 0), 0);
      expect(paperFees).toBeGreaterThan(0);
      paperTrades.forEach((trade) => expect(trade.fee).toBeGreaterThan(0));
      const expectedFees = paperTrades.reduce((sum, trade) =>
        sum + trade.price * trade.quantity * feeRate, 0);
      expect(paperFees).toBeCloseTo(expectedFees, 6);
      const paperGross = (paperCloses[0].price - paperAverage) * paperQuantity;
      expect(paperClosed.realizedPnl).toBeCloseTo(paperGross - paperFees, 5);

      const liveClosed = await prisma.position.findUniqueOrThrow({
        where: { id: liveEntry.positionId },
      });
      expect(liveClosed).toMatchObject({ status: 'CLOSED', closeReason: 'TSL',
        closeInitiator: 'BOT_APP' });
      const liveOrders = await prisma.order.findMany({ where: {
        positionId: liveEntry.positionId }, orderBy: { createdAt: 'asc' } });
      const liveTrades = await prisma.trade.findMany({ where: {
        positionId: liveEntry.positionId }, orderBy: { executedAt: 'asc' } });
      const liveIntents = await prisma.liveOrderIntent.findMany({ where: {
        id: { in: liveOrders.map((order) => order.id) } } });
      const liveFills = await prisma.orderFill.findMany({ where: {
        orderId: { in: liveOrders.map((order) => order.id) } } });
      expect([liveOrders.length, liveTrades.length, liveIntents.length, liveFills.length])
        .toEqual([3, 3, 3, 3]);
      expect(liveTrades.map((trade) => trade.lifecycleAction)).toEqual(['OPEN', 'DCA', 'CLOSE']);
      expect(liveTrades[2].closeReason).toBe('TSL');
      expect(new Set(liveIntents.map((intent) => intent.clientOrderId)).size).toBe(3);
      expect(liveOrders.every((order) => order.status === 'FILLED' &&
        order.feeSource === 'EXCHANGE_FILL' && !order.feePending &&
        order.exchangeOrderId)).toBe(true);
      const liveLifecycleFills = liveTrades.map((trade) => {
        const fill = liveFills.find((candidate) => candidate.orderId === trade.orderId);
        expect(fill).toBeDefined();
        return fill!;
      });
      expect(liveLifecycleFills.map((fill) => fill.price))
        .toEqual([prices[2], prices[5], prices[6]]);
      expect(liveLifecycleFills.map((fill) => fill.quantity)).toEqual([1, 4, 5]);
      expect(liveFills.every((fill) => Number.isInteger(fill.quantity) &&
        fill.quantity >= syntheticRules.minAmount &&
        fill.notional >= syntheticRules.minNotional)).toBe(true);
      expect(liveIntents.every((intent) => intent.exchange === 'GATEIO' &&
        intent.marketType === 'FUTURES')).toBe(true);
      liveFills.forEach((fill) => expect(fill.feeCost)
        .toBeCloseTo(fill.price * fill.quantity * feeRate, 8));
      const liveGross = liveLifecycleFills[2].notional - liveLifecycleFills[0].notional -
        liveLifecycleFills[1].notional;
      const liveFees = liveFills.reduce((sum, fill) => sum + (fill.feeCost ?? 0), 0);
      expect(liveClosed.realizedPnl).toBeCloseTo(liveGross - liveFees, 6);
      expect(liveClosed.quantity).toBeCloseTo(paperClosed.quantity, 7);
      expect(liveClosed.entryPrice).toBeCloseTo(paperClosed.entryPrice, 6);
      expect(liveFees).toBeCloseTo(paperFees, 6);
      expect(liveClosed.realizedPnl).toBeCloseTo(paperClosed.realizedPnl ?? NaN, 5);

      const candles = candlesFor(prices);
      const run = await prisma.backtestRun.create({ data: {
        userId: user.id, strategyId, name: 'Parity BACKTEST run', symbol, timeframe: '1m',
        seedConfig: { symbols: [symbol], marketType: 'FUTURES', leverage,
          marginMode: 'ISOLATED', initialBalance, maxCandles: 100,
          feeRate, slippageRate: 0,
          contextSnapshot: { strategy: { id: strategyId, walletRisk,
            config: persistedStrategy.config } } },
      } });
      const deps = {
        findBacktestRunById: (id: string) => prisma.backtestRun.findUnique({ where: { id } }),
        uniqueSorted: (values: string[]) => [...new Set(values)].sort(),
        computeAdaptiveMaxCandles: () => 100,
        resolveIndicatorWarmupCandles: () => 0,
        normalizeWalletRiskPercent: (value: number) => value,
        parseStrategySignalRules,
        findOwnedStrategySignalConfig: async () => null,
        fetchKlines: async () => candles,
        fetchSupplementalSeries: async () => ({ fundingRates: [], openInterest: [], orderBook: [] }),
        simulateInterleavedPortfolio,
        computeSourceWindowMs: () => 100 * 60_000,
        maxDrawdownFromPnlSeries: () => 0,
      };
      await createClaimedBacktestRunJob(deps)(run.id);
      const backtestRun = await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } });
      const backtestTrades = await prisma.backtestTrade.findMany({ where: { backtestRunId: run.id } });
      const backtestReports = await prisma.backtestReport.findMany({ where: { backtestRunId: run.id } });
      const backtestFills = await prisma.backtestContribution.findMany({
        where: { backtestRunId: run.id }, orderBy: { addSequence: 'asc' },
      });
      expect(backtestRun.status).toBe('COMPLETED');
      expect(backtestTrades).toHaveLength(1);
      expect(backtestReports).toHaveLength(1);
      expect(backtestReports[0].totalTrades).toBe(1);
      expect(backtestFills.map((fill) => [fill.kind, fill.candleIndex]))
        .toEqual([['ENTRY', 2], ['DCA', 5]]);
      expect(backtestTrades[0].exitReason).toBe('TSL');
      expect(backtestTrades[0].fee).toBeGreaterThan(0);
      expect(backtestTrades[0].closedAt.getTime()).toBe(candles[6].closeTime);
      const metrics = backtestReports[0].metrics as {
        lifecycleEventCounts: Record<string, number>;
        positionContributionUsdtTotal: number;
        runLifecycle: { reportReady: boolean };
      };
      expect(metrics.runLifecycle.reportReady).toBe(true);
      expect(metrics.positionContributionUsdtTotal).toBeCloseTo(200, 6);
      expect(metrics.lifecycleEventCounts).toMatchObject({ ENTRY: 1, DCA: 1,
        EXIT: 0, SL: 0, TP: 0, TTP: 0, TSL: 1 });
      backtestFills.forEach((fill, index) => {
        expect(fill.contributionUsdt).toBeCloseTo(paperContributions[index], 4);
        expect(fill.quantity).toBeCloseTo(paperBasis[index].quantity, 6);
        expect(fill.price).toBeCloseTo(paperBasis[index].price, 6);
      });
      expect(backtestTrades[0].quantity).toBeCloseTo(paperQuantity, 6);
      expect(paperCloses[0].quantity).toBeCloseTo(paperQuantity, 6);
      // This tape gives integer Gate unit contracts in PAPER, BACKTEST and LIVE.
      expect(backtestTrades[0].entryPrice).toBeCloseTo(paperAverage, 4);
      expect(backtestTrades[0].exitPrice).toBeCloseTo(paperCloses[0].price, 6);
      expect(backtestTrades[0].fee).toBeCloseTo(paperFees, 5);
      expect(backtestTrades[0].pnl + (backtestTrades[0].fee ?? 0)).toBeCloseTo(paperGross, 5);
      expect(backtestTrades[0].pnl).toBeCloseTo(paperClosed.realizedPnl ?? NaN, 5);
      expect(backtestReports[0].netPnl).toBeCloseTo(paperClosed.realizedPnl ?? NaN, 5);
      expect(backtestTrades[0].fee).toBeCloseTo(0.12998, 5);
      expect(backtestReports[0].netPnl).toBeCloseTo(-75.17998, 5);
      backtestFills.forEach((fill, index) => {
        expect(fill.contributionUsdt).toBeCloseTo(liveLifecycleFills[index].notional, 5);
        expect(fill.quantity).toBeCloseTo(liveLifecycleFills[index].quantity, 7);
        expect(fill.price).toBeCloseTo(liveLifecycleFills[index].price, 7);
      });
      expect(backtestTrades[0].quantity).toBeCloseTo(liveClosed.quantity, 7);
      expect(backtestTrades[0].entryPrice).toBeCloseTo(liveClosed.entryPrice, 6);
      expect(backtestTrades[0].exitPrice).toBeCloseTo(liveLifecycleFills[2].price, 7);
      expect(backtestTrades[0].fee).toBeCloseTo(liveFees, 5);
      expect(backtestReports[0].netPnl).toBeCloseTo(liveClosed.realizedPnl ?? NaN, 5);

      await runtimePositionStateStore.deletePositionRuntimeState(opened.id);
      await send(createAutomation(), 7, prices[7]);
      await createClaimedBacktestRunJob(deps)(run.id);
      expect(await prisma.position.findUniqueOrThrow({ where: { id: opened.id } }))
        .toEqual(paperClosed);
      expect(await prisma.trade.findMany({ where: { positionId: opened.id } }))
        .toEqual(paperTrades);
      expect(await prisma.order.findMany({ where: { positionId: opened.id } }))
        .toEqual(paperOrders);
      expect(await prisma.position.findUniqueOrThrow({ where: { id: liveEntry.positionId } }))
        .toEqual(liveClosed);
      expect(await prisma.order.findMany({ where: { positionId: liveEntry.positionId },
        orderBy: { createdAt: 'asc' } })).toEqual(liveOrders);
      expect(await prisma.trade.findMany({ where: { positionId: liveEntry.positionId },
        orderBy: { executedAt: 'asc' } })).toEqual(liveTrades);
      expect(await prisma.liveOrderIntent.findMany({ where: {
        id: { in: liveOrders.map((order) => order.id) } } })).toEqual(liveIntents);
      expect(await prisma.orderFill.findMany({ where: {
        orderId: { in: liveOrders.map((order) => order.id) } } })).toEqual(liveFills);
      expect(await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } }))
        .toEqual(backtestRun);
      expect(await prisma.backtestTrade.findMany({ where: { backtestRunId: run.id } }))
        .toEqual(backtestTrades);
      expect(await prisma.backtestReport.findMany({ where: { backtestRunId: run.id } }))
        .toEqual(backtestReports);
      expect(await prisma.backtestContribution.findMany({
        where: { backtestRunId: run.id }, orderBy: { addSequence: 'asc' },
      })).toEqual(backtestFills);
    } finally {
      const cleanupErrors: Error[] = [];
      const cleanup = async (name: string, run: () => Promise<unknown>) => {
        try { await run(); } catch (error) {
          cleanupErrors.push(new Error(`${name}: ${String(error)}`, { cause: error }));
        }
      };
      if (botId) await cleanup('deactivate owned bot', () =>
        prisma.bot.updateMany({ where: { id: botId }, data: { isActive: false } }));
      if (liveBotId) await cleanup('deactivate owned LIVE bot', () =>
        prisma.bot.updateMany({ where: { id: liveBotId }, data: { isActive: false } }));
      if (positionId) {
        const ownedPositionId = positionId;
        await cleanup('clear owned runtime state', () =>
          runtimePositionStateStore.deletePositionRuntimeState(ownedPositionId));
      }
      if (livePositionId) {
        const ownedLivePositionId = livePositionId;
        await cleanup('clear owned LIVE runtime state', () =>
          runtimePositionStateStore.deletePositionRuntimeState(ownedLivePositionId));
      }
      await cleanup('truncate dedicated user dataset', () =>
        prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`);
      clearRuntimeTickerStore();
      clearRuntimeSignalMarketDataStore();
      vi.unstubAllGlobals();
      if (previousPaperFeeRate === undefined) delete process.env.RUNTIME_PAPER_TAKER_FEE_RATE;
      else process.env.RUNTIME_PAPER_TAKER_FEE_RATE = previousPaperFeeRate;
      if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
      else process.env.NODE_ENV = previousNodeEnv;
      if (cleanupErrors.length > 0) throw new AggregateError(cleanupErrors, 'Parity proof cleanup failed');
    }
  }, 60_000);

  resumeIt('resumes PAPER and mock LIVE from shared Redis', async () => {
    const database = new URL(process.env.DATABASE_URL ?? '');
    const redis = new URL(process.env.REDIS_URL ?? '');
    if (database.pathname !== '/soar_position_parity_008_test' ||
        database.hostname !== '127.0.0.1' || !database.port || database.port === '5432' ||
        redis.hostname !== '127.0.0.1' || !redis.port || redis.port === '6379' ||
        process.env.NODE_ENV !== 'test' ||
        Number(process.env.GATE_THREE_MODE_OPEN_PID) === process.pid) {
      throw new Error('Three-mode resume requires a separate process and dedicated local resources');
    }
    const paperId = process.env.GATE_THREE_MODE_PAPER_POSITION_ID;
    const liveId = process.env.GATE_THREE_MODE_LIVE_POSITION_ID;
    const baseTime = Number(process.env.GATE_THREE_MODE_BASE_TIME);
    if (!paperId || !liveId || !Number.isFinite(baseTime))
      throw new Error('Three-mode resume identity or clock missing');
    vi.stubGlobal('fetch', async () => { throw new Error('unexpected network transport'); });
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    try {
      const paper = await prisma.position.findUniqueOrThrow({ where: { id: paperId } });
      const live = await prisma.position.findUniqueOrThrow({ where: { id: liveId } });
      expect([paper.status, live.status]).toEqual(['OPEN', 'OPEN']);
      const tracker = await runtimePositionStateStore.getTrustedPositionRuntimeState(liveId);
      expect(tracker?.trailingLossActiveLevelIndex).toBe(0);
      expect(live.entryPrice * (1 + tracker!.trailingLossLimitPercent!))
        .toBeCloseTo(32, 6);
      const automation = new RuntimePositionAutomationService({
        getCanonicalPositionState: async (id) => {
          const position = await prisma.position.findUnique({ where: { id } });
          return position ? { quantity: position.quantity,
            averageEntryPrice: position.entryPrice } : null;
        },
        getDurableDcaProgress: (input) => loadDurableDcaProgress(input),
        executeDca: async () => { throw new Error('DCA replay after confirmed fill'); },
        resolveLifecyclePrice: ({ fallbackPrice }) => fallbackPrice,
      });
      const tick = () => automation.handleTickerEvent({ type: 'ticker', exchange: 'GATEIO',
        marketType: 'FUTURES', symbol, eventTime: baseTime + 6 * 60_000 + 59_999,
        lastPrice: 24.99, priceChangePercent24h: 0 });
      await tick();
      await checkFinalNoSignalCandle(6, baseTime, [paper.botId!, live.botId!]);
      const paperClosed = await prisma.position.findUniqueOrThrow({ where: { id: paperId } });
      const liveClosed = await prisma.position.findUniqueOrThrow({ where: { id: liveId } });
      expect(paperClosed).toMatchObject({ status: 'CLOSED', closeReason: 'TSL' });
      expect(liveClosed).toMatchObject({ status: 'CLOSED', closeReason: 'TSL' });
      expect(await prisma.order.count({ where: { positionId: paperId } })).toBe(3);
      expect(await prisma.order.count({ where: { positionId: liveId } })).toBe(3);
      expect(venue.submits).toHaveLength(1);
      await tick();
      expect(await prisma.order.count({ where: { positionId: paperId } })).toBe(3);
      expect(await prisma.order.count({ where: { positionId: liveId } })).toBe(3);
      expect(venue.submits).toHaveLength(1);
      await automation.handleTickerEvent({ type: 'ticker', exchange: 'GATEIO',
        marketType: 'FUTURES', symbol, eventTime: baseTime + 7 * 60_000 + 59_999,
        lastPrice: prices[7], priceChangePercent24h: 0 });
      await checkFinalNoSignalCandle(7, baseTime, [paper.botId!, live.botId!]);
      expect(await prisma.order.count({ where: { positionId: paperId } })).toBe(3);
      expect(await prisma.order.count({ where: { positionId: liveId } })).toBe(3);
      expect(venue.submits).toHaveLength(1);
      expect(venue.lookups).toHaveLength(0);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
      vi.unstubAllGlobals();
    }
  }, 30_000);
});
