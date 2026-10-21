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
import { executeRuntimeDca, RuntimePositionAutomationService } from './runtimePositionAutomation.service';
import { loadDurableDcaProgress } from './runtimeDurableDcaProgress';
import { runtimePositionStateStore } from './runtimePositionState.store';
import { orchestrateRuntimeSignal } from './executionOrchestrator.service';
import { processRuntimeFinalCandleDecision } from './runtimeFinalCandleDecision.service';
import { resolveRuntimeDcaFundsExhausted } from './runtimeCapitalContext.service';
import { clearRuntimeSignalMarketDataStore } from './runtimeSignalMarketDataGateway';
import { clearRuntimeTickerStore } from './runtimeTickerStore';

// Only the order fill and balance seams are synthetic; the LIVE intent/order/fill
// transaction path remains real. Any other exchange transport is a tripwire.
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
      if (input.exchange !== 'BINANCE' || input.marketType !== 'FUTURES')
        throw new Error('unexpected exchange balance lookup');
      return { total: { USDT: 10 }, free: { USDT: 9 } };
    } };
});
vi.mock('../exchange/exchangeConnectorFactory.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../exchange/exchangeConnectorFactory.service')>();
  return { ...actual, createPublicExchangeConnector: () => {
    throw new Error('unexpected public exchange transport');
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
          if (venue.submits.includes(id)) throw new Error('duplicate venue submit');
          venue.submits.push(id);
          const hash = createHash('sha256').update(id).digest('hex').slice(0, 20);
          const exchangeOrderId = `mock-binance-futures-${hash}`;
          const exchangeTradeId = `mock-fill-${hash}`;
          const notional = order.price * order.quantity;
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

const enabled = process.env.RUN_THREE_MODE_NEGATIVE_TSL_PARITY_PROOF === '1';
const stage = process.env.THREE_MODE_NEGATIVE_TSL_STAGE;
if (enabled && stage !== 'open' && stage !== 'resume')
  throw new Error('Three-mode parity proof requires open or resume stage');
const proofIt = enabled && stage === 'open' ? it : it.skip;
const resumeIt = enabled && stage === 'resume' ? it : it.skip;
const symbol = 'BTCUSDT';
const leverage = 1;
const feeRate = 0.0004;
const initialBalance = 10;
const walletRisk = 10;
const strategyConfig = {
  open: { direction: 'long', noMatchAction: 'EXIT',
    indicatorsLong: [{ name: 'MOMENTUM', condition: '>', value: 0, params: { period: 1 } }],
    indicatorsShort: [] },
  close: { mode: 'advanced', tp: 99, sl: 99,
    ttp: [], tsl: [{ percent: -50, arm: 25 }, { percent: -25, arm: 12 }] },
  additional: { dcaEnabled: true, dcaMode: 'advanced', dcaSizingBasis: 'usdt_contribution_v1',
    dcaTimes: 1, dcaLevels: [{ percent: -70, multiplier: 1 }],
    orderType: 'MARKET', marginMode: 'ISOLATED' },
};
const syntheticRules = { minAmount: 0.00000001, minNotional: 0.01,
  amountPrecision: 8, contractSize: 1 };

const resumeBothInFreshProcess = (paperPositionId: string, livePositionId: string,
  baseTime: number) =>
  new Promise<void>((resolve, reject) => {
    const runtimeUrl = new URL(process.env.DATABASE_URL ?? '');
    runtimeUrl.pathname = '/postgres';
    const child = spawn(process.execPath, [
      resolvePath(process.cwd(), 'node_modules/vitest/vitest.mjs'), 'run',
      'src/modules/engine/runtimeThreeModeNegativeDcaTslParity.e2e.test.ts',
      '-t', 'resumes PAPER and mock LIVE from shared Redis', '--reporter=dot',
    ], {
      cwd: process.cwd(),
      env: { ...process.env, NODE_ENV: 'test', DATABASE_URL: runtimeUrl.toString(),
        TEST_DATABASE_URL: process.env.DATABASE_URL,
        THREE_MODE_NEGATIVE_TSL_STAGE: 'resume',
        THREE_MODE_PAPER_POSITION_ID: paperPositionId,
        THREE_MODE_LIVE_POSITION_ID: livePositionId,
        THREE_MODE_OPEN_PID: String(process.pid),
        THREE_MODE_BASE_TIME: String(baseTime) },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let output = '';
    const timeout = setTimeout(() => child.kill(), 30_000);
    child.stdout.on('data', (chunk: Buffer) => { output += chunk.toString(); });
    child.stderr.on('data', (chunk: Buffer) => { output += chunk.toString(); });
    child.on('error', reject);
    child.on('close', (code) => {
      clearTimeout(timeout);
      if (code === 0) resolve();
      else reject(new Error(`Three-mode resume process exited ${code}: ${output}`));
    });
  });

describe('BACKTEST/PAPER/Binance internal mock LIVE negative DCA and TSL parity', () => {
  proofIt('persists one shared HOLD, DCA and TSL cycle across three modes', async () => {
    const databaseUrl = new URL(process.env.DATABASE_URL ?? '');
    if (databaseUrl.pathname.slice(1) !== 'soar_position_parity_006_test' ||
        databaseUrl.hostname !== '127.0.0.1' || !databaseUrl.port ||
        databaseUrl.port === '5432') {
      throw new Error('Position parity proof requires its own local soar_position_parity_006_test database');
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
        userId: user.id, name: 'Parity universe', marketType: 'FUTURES',
        baseCurrency: 'USDT', whitelist: [], blacklist: [],
      } });
      const group = await prisma.symbolGroup.create({ data: {
        userId: user.id, marketUniverseId: universe.id,
        name: 'Parity symbols', symbols: [symbol],
      } });
      const wallet = await prisma.wallet.create({ data: {
        userId: user.id, name: 'Parity PAPER wallet', mode: 'PAPER',
        exchange: 'BINANCE', marketType: 'FUTURES', baseCurrency: 'USDT',
        paperInitialBalance: initialBalance,
      } });
      const botResponse = await agent.post('/dashboard/bots').send({
        name: 'Parity PAPER bot', walletId: wallet.id, strategyId,
        marketGroupId: group.id, isActive: true, liveOptIn: false,
        consentTextVersion: null,
      });
      expect(botResponse.status).toBe(201);
      botId = botResponse.body.id as string;

      const baseTime = Date.now();
      // PAPER uses finalized candles for the entry decision and tickers for lifecycle fills;
      // BACKTEST uses the same indexed close prices as historical fill marks.
      const prices = [99, 100, 100, 49, 57, 25, 24.99, 20];
      const candlesFor = (prices: number[]) => Array.from({ length: 100 }, (_, index) => {
        const price = prices[index] ?? prices.at(-1)!;
        const openTime = baseTime + index * 60_000;
        return { openTime, closeTime: openTime + 59_999,
          open: price, high: price, low: price, close: price, volume: 1_000 };
      });
      const emitCandle = (index: number, price: number) => {
        const openTime = baseTime + index * 60_000;
        return loop.processCandleEvent({
          type: 'candle', exchange: 'BINANCE', marketType: 'FUTURES', symbol,
          interval: '1m', eventTime: openTime + 59_999, openTime,
          closeTime: openTime + 59_999, open: price, high: price,
          low: price, close: price, volume: 1_000, isFinal: true,
        });
      };
      await emitCandle(0, prices[0]);
      await emitCandle(1, prices[1]);
      await emitCandle(2, prices[2]);
      await loop.processTickerEvent({ type: 'ticker', exchange: 'BINANCE',
        marketType: 'FUTURES', symbol, eventTime: baseTime + 2 * 60_000 + 59_999,
        lastPrice: prices[2], priceChangePercent24h: 1 });
      const opened = await prisma.position.findFirstOrThrow({
        where: { botId, symbol, status: 'OPEN' },
      });
      positionId = opened.id;
      expect(opened.entryPrice * opened.quantity / leverage).toBeCloseTo(1, 4);
      await emitCandle(3, prices[3]);
      expect((await prisma.position.findUniqueOrThrow({ where: { id: opened.id } })).status)
        .toBe('OPEN');
      expect(await prisma.signal.count({ where: { botId, symbol, direction: 'EXIT' } })).toBe(0);

      vi.stubGlobal('fetch', async () => { throw new Error('unexpected network transport'); });
      process.env.NODE_ENV = 'development';
      const key = await prisma.apiKey.create({ data: { userId: user.id,
        label: 'local synthetic only', exchange: 'BINANCE',
        apiKey: 'local-fake-only', apiSecret: 'local-fake-only' } });
      const liveWallet = await prisma.wallet.create({ data: { userId: user.id,
        name: 'Three-mode internal LIVE wallet', mode: 'LIVE', exchange: 'BINANCE',
        marketType: 'FUTURES', baseCurrency: 'USDT', apiKeyId: key.id } });
      const liveUniverse = await prisma.marketUniverse.create({ data: { userId: user.id,
        name: 'Three-mode LIVE universe', exchange: 'BINANCE', marketType: 'FUTURES',
        baseCurrency: 'USDT', whitelist: [symbol], blacklist: [] } });
      const liveGroup = await prisma.symbolGroup.create({ data: { userId: user.id,
        marketUniverseId: liveUniverse.id, name: 'Three-mode LIVE symbols', symbols: [symbol] } });
      const liveBot = await prisma.bot.create({ data: { userId: user.id,
        name: 'Three-mode internal LIVE bot', mode: 'LIVE', exchange: 'BINANCE',
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
      const session = await prisma.botRuntimeSession.create({ data: {
        userId: user.id, botId: liveBot.id, mode: 'LIVE', metadata: { proofOpenPid: process.pid },
      } });
      const liveEntry = await orchestrateRuntimeSignal({ userId: user.id,
        botId: liveBot.id, walletId: liveWallet.id, botMarketGroupId: assignment.id,
        strategyId, strategyLeverage: leverage, strategyInterval: '1m',
        runtimeSessionId: session.id, symbol, direction: 'LONG',
        quantity: opened.quantity, markPrice: prices[2], mode: 'LIVE',
        candleOpenTime: baseTime + 2 * 60_000,
        candleCloseTime: baseTime + 2 * 60_000 + 59_999 });
      expect(liveEntry.status).toBe('opened');
      if (liveEntry.status !== 'opened') throw new Error('internal LIVE entry did not fill');
      livePositionId = liveEntry.positionId;
      const routeBot = { id: liveBot.id, userId: user.id, mode: 'LIVE',
        exchange: 'BINANCE', marketType: 'FUTURES', walletId: liveWallet.id,
        runtimeContext: { symbolGroupId: liveGroup.id, strategyId,
          maxOpenPositions: 1, symbols: [symbol], strategy: {
            strategyId, strategyInterval: '1m', strategyLeverage: leverage,
            walletRisk, strategyConfig, priority: 1, weight: 1,
          } } };
      const noSignalCreate = vi.fn(async () => undefined);
      const noSignalOrchestrate = vi.fn(async () => liveEntry);
      await processRuntimeFinalCandleDecision({ type: 'candle', exchange: 'BINANCE',
        marketType: 'FUTURES', symbol, interval: '1m',
        eventTime: baseTime + 3 * 60_000 + 59_999,
        openTime: baseTime + 3 * 60_000, closeTime: baseTime + 3 * 60_000 + 59_999,
        open: prices[3], high: prices[3], low: prices[3], close: prices[3],
        volume: 1_000, isFinal: true }, {
        nowMs: Date.now, minDirectionalScore: 1, runtimeSignalQuantity: opened.quantity,
        signalDecisionDedupeRetentionMs: 21_600_000,
        processedDecisionWindows: new Map(),
        listActiveBotsFromTopologyCacheWithMetrics: async () => [routeBot],
        listRuntimeManagedExternalPositions: async () => [],
        resolveRuntimeRoutesForEvent: () => [{ bot: routeBot }],
        ensureRuntimeSession: async () => session.id,
        countOpenPositionsForBotAndSymbols: async () => prisma.position.count({ where: {
          botId: liveBot.id, status: 'OPEN', symbol } }),
        analyzePreTradeFn: async () => ({ allowed: true, reasons: [], metrics: {} }),
        createSignal: noSignalCreate,
        evaluateStrategy: () => ({ direction: null, conditionLines: [], indicatorSummary: null }),
        orchestrateFn: noSignalOrchestrate,
      } as unknown as Parameters<typeof processRuntimeFinalCandleDecision>[1]);
      expect(noSignalCreate).not.toHaveBeenCalled();
      expect(noSignalOrchestrate).not.toHaveBeenCalled();
      expect(await prisma.position.count({ where: { id: liveEntry.positionId, status: 'OPEN' } }))
        .toBe(1);
      expect(await prisma.signal.count({ where: { botId: liveBot.id, direction: 'EXIT' } }))
        .toBe(0);

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
      const send = (service: RuntimePositionAutomationService, index: number, price: number) =>
        service.handleTickerEvent({ type: 'ticker', exchange: 'BINANCE',
          marketType: 'FUTURES', symbol, eventTime: baseTime + index * 60_000 + 59_999,
          lastPrice: price, priceChangePercent24h: 0 });
      // Exercise the shared Redis tracker across process restart, as production does.
      const firstService = createAutomation();
      await send(firstService, 3, prices[3]);
      expect((await prisma.position.findUniqueOrThrow({ where: { id: opened.id } })).status)
        .toBe('OPEN');
      const armed = await runtimePositionStateStore.getPositionRuntimeState(opened.id);
      expect(armed?.trailingLossActiveLevelIndex).toBe(0);
      expect(armed?.trailingLossLimitPercent).toBeCloseTo(-0.76, 5);
      await send(firstService, 4, prices[4]);
      expect((await prisma.position.findUniqueOrThrow({ where: { id: opened.id } })).status)
        .toBe('OPEN');
      expect((await runtimePositionStateStore.getPositionRuntimeState(opened.id))
        ?.trailingLossLimitPercent).toBeCloseTo(-0.68, 5);
      await send(firstService, 5, prices[5]);
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

      await resumeBothInFreshProcess(opened.id, liveEntry.positionId, baseTime);
      const paperClosed = await prisma.position.findUniqueOrThrow({ where: { id: opened.id } });
      expect(paperClosed.status).toBe('CLOSED');
      expect(paperClosed.closeReason).toBe('TSL');
      expect(await prisma.position.count({ where: { botId } })).toBe(1);
      expect(await prisma.signal.count({ where: { botId, symbol, direction: 'EXIT' } })).toBe(0);
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
      const paperQuantity = paperBasis.reduce((sum, trade) => sum + trade.quantity, 0);
      const paperAverage = paperBasis.reduce((sum, trade) => sum + trade.price * trade.quantity, 0)
        / paperQuantity;
      expect(paperClosed.quantity).toBeCloseTo(paperQuantity, 7);
      expect(paperClosed.entryPrice).toBeCloseTo(paperAverage, 7);
      const paperContributions = paperBasis.map((trade) => trade.price * trade.quantity / leverage);
      paperContributions.forEach((amount, index) => expect(amount)
        .toBeCloseTo([1, 1][index], 4));
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
      expect(metrics.positionContributionUsdtTotal).toBeCloseTo(2, 6);
      expect(metrics.lifecycleEventCounts).toMatchObject({ ENTRY: 1, DCA: 1,
        EXIT: 0, SL: 0, TP: 0, TTP: 0, TSL: 1 });
      backtestFills.forEach((fill, index) => {
        expect(fill.contributionUsdt).toBeCloseTo(paperContributions[index], 4);
        expect(fill.quantity).toBeCloseTo(paperBasis[index].quantity, 6);
        expect(fill.price).toBeCloseTo(paperBasis[index].price, 6);
      });
      expect(backtestTrades[0].quantity).toBeCloseTo(paperQuantity, 6);
      expect(paperCloses[0].quantity).toBeCloseTo(paperQuantity, 6);
      // PAPER rounds each fill to the venue's 8-decimal quantity precision.
      expect(backtestTrades[0].entryPrice).toBeCloseTo(paperAverage, 4);
      expect(backtestTrades[0].exitPrice).toBeCloseTo(paperCloses[0].price, 6);
      expect(backtestTrades[0].fee).toBeCloseTo(paperFees, 5);
      expect(backtestTrades[0].pnl + (backtestTrades[0].fee ?? 0)).toBeCloseTo(paperGross, 5);
      expect(backtestTrades[0].pnl).toBeCloseTo(paperClosed.realizedPnl ?? NaN, 5);
      expect(backtestReports[0].netPnl).toBeCloseTo(paperClosed.realizedPnl ?? NaN, 5);
      expect(backtestTrades[0].fee).toBeCloseTo(0.0013, 5);
      expect(backtestReports[0].netPnl).toBeCloseTo(-0.7518, 5);
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
    if (database.pathname !== '/soar_position_parity_006_test' ||
        database.hostname !== '127.0.0.1' || !database.port || database.port === '5432' ||
        redis.hostname !== '127.0.0.1' || !redis.port || redis.port === '6379' ||
        process.env.NODE_ENV !== 'test' ||
        Number(process.env.THREE_MODE_OPEN_PID) === process.pid) {
      throw new Error('Three-mode resume requires a separate process and dedicated local resources');
    }
    const paperId = process.env.THREE_MODE_PAPER_POSITION_ID;
    const liveId = process.env.THREE_MODE_LIVE_POSITION_ID;
    const baseTime = Number(process.env.THREE_MODE_BASE_TIME);
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
      const tick = () => automation.handleTickerEvent({ type: 'ticker', exchange: 'BINANCE',
        marketType: 'FUTURES', symbol, eventTime: baseTime + 6 * 60_000 + 59_999,
        lastPrice: 24.99, priceChangePercent24h: 0 });
      await tick();
      const paperClosed = await prisma.position.findUniqueOrThrow({ where: { id: paperId } });
      const liveClosed = await prisma.position.findUniqueOrThrow({ where: { id: liveId } });
      expect(paperClosed).toMatchObject({ status: 'CLOSED', closeReason: 'TSL' });
      expect(liveClosed).toMatchObject({ status: 'CLOSED', closeReason: 'TSL' });
      expect(await prisma.order.count({ where: { positionId: paperId } })).toBe(3);
      expect(await prisma.order.count({ where: { positionId: liveId } })).toBe(3);
      expect(venue.submits).toHaveLength(1);
      expect(venue.lookups).toHaveLength(0);
      await tick();
      expect(await prisma.order.count({ where: { positionId: paperId } })).toBe(3);
      expect(await prisma.order.count({ where: { positionId: liveId } })).toBe(3);
      expect(venue.submits).toHaveLength(1);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
      vi.unstubAllGlobals();
    }
  }, 30_000);
});
