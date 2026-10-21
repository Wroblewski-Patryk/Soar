import { createHash, randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { app } from '../../index';
import { prisma } from '../../prisma/client';
import { normalizeSymbols } from '../../lib/symbols';
import { normalizeWalletRiskPercent } from './positionSizing';
import { marketSequenceStrategyConfig } from '../backtests/backtest011aMarketWitness.config';
import { fetchVerifiedArchivedIntrabarForRun, fetchVerifiedDailyUsdMArchive,
  readVerifiedRunArchive,
  saveVerifiedRunArchive } from '../backtests/backtestBinanceFuturesIntrabarArchive';
import { digestVerifiedBinanceFuturesIntrabar } from '../backtests/backtestBinanceFuturesIntrabarSource';
import { createClaimedBacktestRunJob } from '../backtests/backtestClaimedRun';
import { resolveIndicatorWarmupCandles } from '../backtests/backtestIndicatorSpecs';
import { simulateInterleavedPortfolio } from '../backtests/backtestPortfolioSimulation.service';
import type { BacktestKlineCandle } from '../backtests/backtestDataGateway';
import { computeAdaptiveMaxCandles, computeSourceWindowMs } from '../backtests/backtestRange.service';
import { getRunTimeline } from '../backtests/backtests.service';
import { GetBacktestTimelineQuerySchema } from '../backtests/backtests.types';
import { ensureSubscriptionCatalog, setActiveSubscriptionForUser } from '../subscriptions/subscriptions.service';
import { evaluateStrategySignalAtIndex,
  parseStrategySignalRules } from './strategySignalEvaluator';
import { clampPeriod } from './sharedIndicatorSeries';
import { RuntimeSignalLoop } from './runtimeSignalLoop.service';
import { listActiveRuntimeBots } from './runtimeSignalLoopDefaults';
import { executeRuntimeDca, RuntimePositionAutomationService } from './runtimePositionAutomation.service';
import { loadDurableDcaProgress } from './runtimeDurableDcaProgress';
import { runtimePositionStateStore } from './runtimePositionState.store';
import { resolveRuntimeDcaFundsExhausted } from './runtimeCapitalContext.service';
import { clearRuntimeSignalMarketDataStore } from './runtimeSignalMarketDataGateway';
import { clearRuntimeTickerStore, upsertRuntimeTicker } from './runtimeTickerStore';

const symbol = 'ALICEUSDT';
const start = Date.parse('2026-10-18T02:41:00.000Z');
const end = start + 100 * 60_000;
const dcaId = 167049972;
const ttpId = 167049977;
const zipSha = '4d0a9b007ae6b7a94073680ab37a968bb592c4529bffec1d68de8ef8f9db151b';
const feeRate = 0.0004;
const rule = { minAmount: 0.00000001, minNotional: 5,
  amountPrecision: 0.00000001, amountPrecisionMode: 'TICK_SIZE' as const,
  contractSize: 1 };
const venue = vi.hoisted(() => ({ submits: [] as string[] }));
vi.mock('../exchange/exchangeAdapterBoundary.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../exchange/exchangeAdapterBoundary.service')>();
  const forbidden = async () => { throw new Error('real exchange transport forbidden'); };
  return { ...actual, submitLiveOrderThroughBoundary: forbidden,
    lookupLiveOrderThroughBoundary: forbidden, cancelLiveOrderThroughBoundary: forbidden,
    fetchSupportedExchangePositionsRaw: forbidden,
    fetchSupportedExchangeOpenOrdersRaw: forbidden,
    fetchSupportedExchangeTradeHistoryRaw: forbidden,
    fetchSupportedExchangeWalletCashflowHistoryRaw: forbidden,
    fetchSupportedExchangeBalanceRaw: async () => ({
      total: { USDT: 1000 }, free: { USDT: 900 },
    }) };
});
vi.mock('../exchange/exchangeConnectorFactory.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../exchange/exchangeConnectorFactory.service')>();
  return { ...actual, createPublicExchangeConnector: () => {
    throw new Error('public exchange connector forbidden after source verification');
  } };
});
vi.mock('../exchange/exchangeSymbolRules.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../exchange/exchangeSymbolRules.service')>();
  return { ...actual, getExchangeSymbolRules: async (input: {
    exchange: string; marketType: string; symbol: string;
  }) => {
    if (input.exchange !== 'BINANCE' || input.marketType !== 'FUTURES' ||
        input.symbol !== 'ALICEUSDT') throw new Error('unexpected symbol rules');
    return { minQuantity: 0.00000001, minNotional: 5,
      quantityStep: 0.00000001, priceStep: 0.0001, contractSize: 1 };
  } };
});
vi.mock('../orders/orders.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../orders/orders.service')>();
  return { ...actual, openOrder: (userId: string,
    payload: Parameters<typeof actual.openOrder>[1]) =>
    actual.openOrder(userId, payload, { executeLiveOrder: async ({ payload: order }) => {
      if (order.mode !== 'LIVE' || !order.clientOrderId || !order.price ||
          order.quantity <= 0 || order.price * order.quantity < 5)
        throw new Error('unexecutable internal mock order');
      if (venue.submits.includes(order.clientOrderId)) throw new Error('duplicate mock submit');
      venue.submits.push(order.clientOrderId);
      const hash = createHash('sha256').update(order.clientOrderId).digest('hex').slice(0, 20);
      const exchangeOrderId = `mock-011-${hash}`;
      const exchangeTradeId = `mock-011-fill-${hash}`;
      const notional = order.price * order.quantity;
      const fee = notional * feeRate;
      return { exchangeOrderId, status: 'FILLED' as const,
        exchangeFilledQuantity: order.quantity, exchangeAverageFillPrice: order.price,
        fee, feeSource: 'EXCHANGE_FILL' as const, feePending: false,
        feeCurrency: 'USDT', exchangeTradeId,
        fills: [{ exchangeTradeId, exchangeOrderId, symbol: order.symbol,
          side: order.side, price: order.price, quantity: order.quantity,
          notional, feeCost: fee, feeCurrency: 'USDT', feeRate,
          executedAt: new Date(), source: 'createOrder' as const,
          raw: { localMock: true } }] };
    }, lookupLiveOrder: async () => { throw new Error('unexpected mock lookup'); } }),
  };
});

const signalLossProof = process.env.RUN_011_REAL_SOURCE_SIGNAL_LOSS_PROOF === '1';
const enabled = process.env.RUN_011_REAL_SOURCE_THREE_MODE_PROOF === '1' || signalLossProof;
const stage = process.env.RUN_011_REAL_SOURCE_THREE_MODE_STAGE;
const openIt = enabled && stage === 'open' ? it : it.skip;
const resumeIt = enabled && stage === 'resume' ? it : it.skip;
const selectSignalLossWitness = (verified: BacktestKlineCandle[]) => {
  const closes = verified.map((candle) => candle.close);
  const attempts: Array<Record<string, unknown>> = [];
  const period = 2;
  if (clampPeriod(period, 14) !== period)
    throw new Error('frozen MOMENTUM period differs from effective period');
  for (const lossIndex of [3, 4]) {
    const entry = closes[2] - closes[2 - period];
    const loss = closes[lossIndex] - closes[lossIndex - period];
    if (entry === loss) {
      attempts.push({ period, lossIndex, entry, loss, outcome: 'equal_values' });
      continue;
    }
    const threshold = (entry + loss) / 2;
    const condition = entry > loss ? '>' : '<';
    const config = { ...marketSequenceStrategyConfig,
      open: { ...marketSequenceStrategyConfig.open,
        indicatorsLong: [{ name: 'MOMENTUM', condition, value: threshold,
          params: { period } }] } };
    const rules = parseStrategySignalRules(config);
    if (!rules) throw new Error('candidate rules rejected');
    const decisions = [0, 1, 2, 3, 4].map((index) =>
      evaluateStrategySignalAtIndex(rules, verified, index, new Map()));
    if (decisions[0] !== null || decisions[1] !== null ||
        decisions[2] !== 'LONG' || decisions[lossIndex] !== null) {
      attempts.push({ period, lossIndex, entry, loss, threshold, condition,
        decisions, outcome: 'signal_sequence' });
      continue;
    }
    const result = simulateInterleavedPortfolio({ symbols: [symbol],
      candlesBySymbol: new Map([[symbol, verified]]),
      analysisStartIndexBySymbol: new Map([[symbol, 2]]),
      marketType: 'FUTURES', leverage: 1, marginMode: 'ISOLATED',
      strategyConfig: config, walletRiskPercent: 10,
      initialBalance: 1000, fillModelConfig: { feeRate, slippageRate: 0 },
    }).perSymbol[symbol];
    const firstEntry = result.events.find((event) => event.type === 'ENTRY');
    const firstDca = result.events.find((event) => event.type === 'DCA' &&
      event.tradeSequence === firstEntry?.tradeSequence);
    const firstTtp = result.events.find((event) => event.type === 'TTP' &&
      event.tradeSequence === firstEntry?.tradeSequence);
    if (firstEntry?.candleIndex !== 2 ||
        firstDca?.timestamp.getTime() !== Date.parse('2026-10-18T02:46:47.639Z') ||
        firstTtp?.timestamp.getTime() !== Date.parse('2026-10-18T02:46:57.282Z') ||
        firstDca.price !== 0.1454 || firstTtp.price !== 0.1454 ||
        firstDca.candleIndex !== 5 || firstTtp.candleIndex !== 5) {
      attempts.push({ period, lossIndex, entry, loss, threshold, condition,
        decisions, outcome: 'source_pair', firstEntry, firstDca, firstTtp });
      continue;
    }
    attempts.push({ period, lossIndex, entry, loss, threshold, condition,
      decisions, outcome: 'selected' });
    return { config, period, lossIndex, threshold, condition,
      decisions, attempts };
  }
  throw new Error(`No predeclared signal-loss witness: ${JSON.stringify(attempts)}`);
};
const ensureIsolated = () => {
  const db = new URL(process.env.DATABASE_URL ?? '');
  const redis = new URL(process.env.REDIS_URL ?? '');
  if (db.hostname !== '127.0.0.1' || !db.port || db.port === '5432' ||
      db.pathname !== '/soar_position_parity_011_test' ||
      redis.hostname !== '127.0.0.1' || !redis.port || redis.port === '6379')
    throw new Error('011 real source proof requires its own _test and Redis');
};
const sourceTicker = (tick: { eventTime: number; price: number }) => ({
  type: 'ticker' as const, exchange: 'BINANCE' as const,
  marketType: 'FUTURES' as const, symbol, eventTime: tick.eventTime,
  lastPrice: tick.price, priceChangePercent24h: 0,
});
const makeAutomation = (allowDca: boolean) => new RuntimePositionAutomationService({
  getCanonicalPositionState: async (id) => {
    const position = await prisma.position.findUnique({ where: { id } });
    return position ? { quantity: position.quantity,
      averageEntryPrice: position.entryPrice } : null;
  },
  getDurableDcaProgress: (input) => loadDurableDcaProgress(input),
  executeDca: (input) => {
    if (!allowDca) throw new Error('DCA retried after confirmed fill');
    return executeRuntimeDca(input, { getOrderRules: async () => rule,
      resolveFundsExhausted: (context) => resolveRuntimeDcaFundsExhausted(context) });
  },
  resolveLifecyclePrice: ({ fallbackPrice }) => fallbackPrice,
});
const startResume = (paperId: string, liveId: string, runId: string) =>
  new Promise<string>((resolvePromise, reject) => {
    const adminUrl = new URL(process.env.DATABASE_URL ?? '');
    adminUrl.pathname = '/postgres';
    const child = spawn(process.execPath, [
      resolve(process.cwd(), 'node_modules/vitest/vitest.mjs'), 'run',
      'src/modules/engine/runtime011RealSourceThreeMode.e2e.test.ts',
      '-t', 'resumes the real source pair', '--reporter=dot',
    ], { cwd: process.cwd(), env: { ...process.env, NODE_ENV: 'test',
      DATABASE_URL: adminUrl.toString(), TEST_DATABASE_URL: process.env.DATABASE_URL,
      RUN_011_REAL_SOURCE_THREE_MODE_STAGE: 'resume',
      RUN_011_REAL_SOURCE_PAPER_ID: paperId, RUN_011_REAL_SOURCE_LIVE_ID: liveId,
      RUN_011_REAL_SOURCE_BACKTEST_ID: runId,
      RUN_011_REAL_SOURCE_PARENT_PID: String(process.pid),
    }, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '';
    const timer = setTimeout(() => child.kill(), 45_000);
    child.stdout.on('data', (chunk: Buffer) => { output += chunk.toString(); });
    child.stderr.on('data', (chunk: Buffer) => { output += chunk.toString(); });
    child.on('error', reject);
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0 && /Tests\s+1 passed/.test(output)) resolvePromise(output);
      else reject(new Error(`real source resume ${code}: ${output}`));
    });
  });

describe('011 real source BACKTEST/PAPER/internal mock LIVE parity', () => {
  openIt('uses ordinary LONG and keeps position before the two public source ticks', async () => {
    ensureIsolated();
    if (await prisma.user.count() !== 0) throw new Error('Requires empty disposable _test');
    const klineUrl = `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol}` +
      `&interval=1m&startTime=${start}&endTime=${end - 1}&limit=100`;
    const klineResponse = await fetch(klineUrl, { signal: AbortSignal.timeout(20_000) });
    expect(klineResponse.ok).toBe(true);
    const klineRows = await klineResponse.json() as Array<Array<string | number>>;
    expect(klineRows).toHaveLength(100);
    const klines = klineRows.map((row) => ({
      openTime: Number(row[0]), closeTime: Number(row[6]),
      open: Number(row[1]), high: Number(row[2]), low: Number(row[3]),
      close: Number(row[4]), volume: Number(row[5]),
    }));
    const { snapshot, verified } = await fetchVerifiedDailyUsdMArchive({ symbol,
      candles: klines });
    expect(snapshot.zipSha256).toBe(zipSha);
    expect(verified).toHaveLength(100);
    expect(verified[5].intrabarTicks.find((tick) => tick.sequenceId === dcaId))
      .toMatchObject({ eventTime: Date.parse('2026-10-18T02:46:47.639Z'), price: 0.1454 });
    expect(verified[5].intrabarTicks.find((tick) => tick.sequenceId === ttpId))
      .toMatchObject({ eventTime: Date.parse('2026-10-18T02:46:57.282Z'), price: 0.1454 });
    const digest = digestVerifiedBinanceFuturesIntrabar(verified, symbol);
    expect(digest).toBe('506d8d6a1032cc955e5cf6b4232120aadb918217bb7107af8f8061e6609ec2a8');
    const signalLossWitness = signalLossProof ? selectSignalLossWitness(verified) : null;
    const previousPaperFeeRate = process.env.RUNTIME_PAPER_TAKER_FEE_RATE;
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.RUNTIME_PAPER_TAKER_FEE_RATE = String(feeRate);
    clearRuntimeTickerStore();
    clearRuntimeSignalMarketDataStore();
    let paperId: string | null = null;
    let liveId: string | null = null;
    try {
      const agent = request.agent(app);
      const email = `real-011-${randomUUID()}@example.test`;
      expect((await agent.post('/auth/register').send({ email,
        password: 'test1234' })).status).toBe(201);
      const user = await prisma.user.findUniqueOrThrow({ where: { email } });
      await ensureSubscriptionCatalog(prisma);
      await setActiveSubscriptionForUser(prisma, { userId: user.id,
        planCode: 'PROFESSIONAL', source: 'ADMIN_OVERRIDE',
        metadata: { reason: 'isolated-real-source-011-proof' } });
      const strategyResponse = await agent.post('/dashboard/strategies').send({
        name: '011 real source three mode', interval: '1m', leverage: 1,
        walletRisk: 10, config: signalLossWitness?.config ?? marketSequenceStrategyConfig,
      });
      expect(strategyResponse.status).toBe(201);
      const strategyId = strategyResponse.body.id as string;
      const persisted = await prisma.strategy.findUniqueOrThrow({ where: { id: strategyId } });
      if (!persisted.config || typeof persisted.config !== 'object' ||
          Array.isArray(persisted.config)) throw new Error('saved strategy config missing');
      const rules = parseStrategySignalRules(persisted.config as Record<string, unknown>);
      if (!rules) throw new Error('saved strategy signal rules missing');
      const signalDecisions = [2, 3, 4].map((index) =>
        evaluateStrategySignalAtIndex(rules, verified, index, new Map()));
      if (signalLossWitness) {
        const persistedDecisions = [0, 1, 2, 3, 4].map((index) =>
          evaluateStrategySignalAtIndex(rules, verified, index, new Map()));
        expect(persistedDecisions).toEqual(signalLossWitness.decisions);
        expect(verified[signalLossWitness.lossIndex].closeTime).toBeLessThan(
          Date.parse('2026-10-18T02:46:47.639Z'));
        expect(signalDecisions[signalLossWitness.lossIndex - 2]).toBeNull();
      } else expect(signalDecisions).toEqual(['LONG', 'LONG', 'LONG']);
      const universe = await prisma.marketUniverse.create({ data: {
        userId: user.id, name: '011 PAPER universe', exchange: 'BINANCE',
        marketType: 'FUTURES', baseCurrency: 'USDT', whitelist: [symbol], blacklist: [],
      } });
      const group = await prisma.symbolGroup.create({ data: { userId: user.id,
        marketUniverseId: universe.id, name: '011 PAPER group', symbols: [symbol] } });
      const wallet = await prisma.wallet.create({ data: { userId: user.id,
        name: '011 PAPER wallet', mode: 'PAPER', exchange: 'BINANCE',
        marketType: 'FUTURES', baseCurrency: 'USDT', paperInitialBalance: 1000 } });
      const paperResponse = await agent.post('/dashboard/bots').send({
        name: '011 PAPER bot', walletId: wallet.id, strategyId,
        marketGroupId: group.id, isActive: true, liveOptIn: false,
        consentTextVersion: null,
      });
      expect(paperResponse.status).toBe(201);
      const paperBotId = paperResponse.body.id as string;
      process.env.NODE_ENV = 'development';
      const key = await prisma.apiKey.create({ data: { userId: user.id,
        label: 'local mock only', exchange: 'BINANCE',
        apiKey: 'local-fake-only', apiSecret: 'local-fake-only' } });
      const liveWallet = await prisma.wallet.create({ data: { userId: user.id,
        name: '011 internal mock LIVE wallet', mode: 'LIVE', exchange: 'BINANCE',
        marketType: 'FUTURES', baseCurrency: 'USDT', apiKeyId: key.id } });
      const liveUniverse = await prisma.marketUniverse.create({ data: { userId: user.id,
        name: '011 mock LIVE universe', exchange: 'BINANCE', marketType: 'FUTURES',
        baseCurrency: 'USDT', whitelist: [symbol], blacklist: [] } });
      const liveGroup = await prisma.symbolGroup.create({ data: { userId: user.id,
        marketUniverseId: liveUniverse.id, name: '011 mock LIVE group', symbols: [symbol] } });
      const liveBot = await prisma.bot.create({ data: { userId: user.id,
        name: '011 internal mock LIVE bot', mode: 'LIVE', exchange: 'BINANCE',
        marketType: 'FUTURES', positionMode: 'ONE_WAY', apiKeyId: key.id,
        isActive: true, liveOptIn: true, consentTextVersion: 'mvp-v1',
        maxOpenPositions: 1, walletId: liveWallet.id, strategyId,
        symbolGroupId: liveGroup.id } });
      const assignment = await prisma.botMarketGroup.create({ data: {
        userId: user.id, botId: liveBot.id, symbolGroupId: liveGroup.id,
        lifecycleStatus: 'ACTIVE', executionOrder: 1,
        maxOpenPositions: 1, isEnabled: true } });
      await prisma.marketGroupStrategyLink.create({ data: { userId: user.id,
        botId: liveBot.id, botMarketGroupId: assignment.id, strategyId } });
      expect((await listActiveRuntimeBots()).map((bot) => bot.id))
        .toEqual(expect.arrayContaining([paperBotId, liveBot.id]));

      const backtest = await prisma.backtestRun.create({ data: {
        userId: user.id, strategyId, name: '011 verified source parity', symbol,
        timeframe: '1m',
        seedConfig: { symbols: [symbol], marketType: 'FUTURES', leverage: 1,
          marginMode: 'ISOLATED', initialBalance: 1000, maxCandles: 100,
          startAt: new Date(start).toISOString(), endAt: new Date(end).toISOString(),
          feeRate, slippageRate: 0,
          intrabarSource: 'BINANCE_USDM_AGGTRADES_REQUIRED',
          contextSnapshot: { strategy: { id: strategyId, walletRisk: 10,
            config: persisted.config } } },
      } });
      await saveVerifiedRunArchive(backtest.id, snapshot);
      vi.stubGlobal('fetch', async () => { throw new Error('network after archive forbidden'); });
      const job = createClaimedBacktestRunJob({
        findBacktestRunById: (id) => prisma.backtestRun.findUnique({ where: { id } }),
        uniqueSorted: normalizeSymbols, computeAdaptiveMaxCandles,
        resolveIndicatorWarmupCandles, normalizeWalletRiskPercent,
        parseStrategySignalRules,
        findOwnedStrategySignalConfig: async () => null,
        fetchKlines: async () => { throw new Error('OHLC fallback forbidden'); },
        fetchVerifiedArchivedIntrabarForRun,
        fetchSupplementalSeries: async () => ({ fundingRates: [],
          openInterest: [], orderBook: [] }),
        simulateInterleavedPortfolio, computeSourceWindowMs,
        maxDrawdownFromPnlSeries: () => 0,
      });
      await job(backtest.id);
      const run = await prisma.backtestRun.findUniqueOrThrow({ where: { id: backtest.id } });
      expect(run.status).toBe('COMPLETED');
      expect((run.seedConfig as Record<string, any>)
        .intrabarSourceDigestBySymbol?.ALICEUSDT).toBe(digest);
      const backtestTrades = await prisma.backtestTrade.findMany({
        where: { backtestRunId: backtest.id }, orderBy: { openedAt: 'asc' } });
      const report = await prisma.backtestReport.findUniqueOrThrow({
        where: { backtestRunId: backtest.id } });
      expect(backtestTrades.length).toBeGreaterThan(0);
      expect(report.totalTrades).toBe(backtestTrades.length);
      if (!signalLossWitness) {
        expect(backtestTrades).toHaveLength(5);
        expect(report.netPnl).toBe(-0.16687);
      }
      expect(backtestTrades[0].exitReason).toBe('TTP');
      expect(backtestTrades[0].closedAt.getTime())
        .toBe(Date.parse('2026-10-18T02:46:57.282Z'));
      const timeline = await getRunTimeline(user.id, backtest.id,
        GetBacktestTimelineQuerySchema.parse({ symbol }));
      const secondTimeline = await getRunTimeline(user.id, backtest.id,
        GetBacktestTimelineQuerySchema.parse({ symbol }));
      expect(secondTimeline?.events).toEqual(timeline?.events);
      expect(timeline?.events.some((event) => event.type === 'DCA' &&
        event.timestamp === '2026-10-18T02:46:47.639Z')).toBe(true);
      expect(timeline?.events.some((event) => event.type === 'TTP' &&
        event.timestamp === '2026-10-18T02:46:57.282Z')).toBe(true);

      const loop = new RuntimeSignalLoop();
      const emitFinal = (index: number) => loop.processCandleEvent({
        type: 'candle', exchange: 'BINANCE', marketType: 'FUTURES', symbol,
        interval: '1m', eventTime: verified[index].closeTime,
        ...verified[index], isFinal: true,
      });
      for (let index = 0; index <= 2; index += 1) {
        for (const tick of verified[index].intrabarTicks)
          await loop.processTickerEvent(sourceTicker(tick));
        await emitFinal(index);
      }
      const paper = await prisma.position.findFirst({ where: {
        botId: paperBotId, symbol, status: 'OPEN' } });
      const live = await prisma.position.findFirst({ where: {
        botId: liveBot.id, symbol, status: 'OPEN' } });
      expect(paper, 'ordinary final-candle LONG did not open PAPER').toBeTruthy();
      expect(live, 'ordinary final-candle LONG did not open mock LIVE').toBeTruthy();
      paperId = paper!.id;
      liveId = live!.id;
      expect(await prisma.signal.count({ where: { botId: paperBotId,
        direction: 'EXIT' } })).toBe(0);
      expect(await prisma.signal.count({ where: { botId: liveBot.id,
        direction: 'EXIT' } })).toBe(0);
      const automation = makeAutomation(true);
      for (let index = 3; index <= 4; index += 1) {
        for (const tick of verified[index].intrabarTicks) {
          const event = sourceTicker(tick);
          await automation.handleTickerEvent(event);
          upsertRuntimeTicker(event);
        }
        await emitFinal(index);
        expect((await prisma.position.findUniqueOrThrow({ where: { id: paperId } })).status)
          .toBe('OPEN');
        expect((await prisma.position.findUniqueOrThrow({ where: { id: liveId } })).status)
          .toBe('OPEN');
        if (index === signalLossWitness?.lossIndex) {
          for (const botId of [paperBotId, liveBot.id])
            expect(await prisma.signal.count({ where: { botId, direction: 'EXIT' } })).toBe(0);
        }
      }
      for (const botId of [paperBotId, liveBot.id]) {
        expect(await prisma.signal.count({ where: { botId, direction: 'LONG' } })).toBe(1);
        expect(await prisma.signal.count({ where: { botId, direction: 'EXIT' } })).toBe(0);
      }
      for (const tick of verified[5].intrabarTicks) {
        if (tick.sequenceId > dcaId) break;
        const event = sourceTicker(tick);
        await automation.handleTickerEvent(event);
        upsertRuntimeTicker(event);
        if (tick.sequenceId < dcaId) {
          expect(await prisma.trade.count({ where: { positionId: paperId,
            lifecycleAction: 'DCA' } })).toBe(0);
          expect(await prisma.trade.count({ where: { positionId: liveId,
            lifecycleAction: 'DCA' } })).toBe(0);
        }
      }
      expect(await prisma.trade.count({ where: { positionId: paperId,
        lifecycleAction: 'DCA' } })).toBe(1);
      expect(await prisma.trade.count({ where: { positionId: liveId,
        lifecycleAction: 'DCA' } })).toBe(1);
      expect((await prisma.position.findUniqueOrThrow({ where: { id: paperId } })).status)
        .toBe('OPEN');
      expect((await prisma.position.findUniqueOrThrow({ where: { id: liveId } })).status)
        .toBe('OPEN');
      const resumeOutput = await startResume(paperId, liveId, backtest.id);
      expect(resumeOutput).toContain('PUBLIC_011_RUNTIME_PAIR');
      const resumeLine = resumeOutput.split(/\r?\n/).find((line) =>
        line.includes('PUBLIC_011_RUNTIME_PAIR '));
      expect(resumeLine).toBeDefined();
      const resumed = JSON.parse(resumeLine!.slice(resumeLine!.indexOf(
        'PUBLIC_011_RUNTIME_PAIR ') + 'PUBLIC_011_RUNTIME_PAIR '.length)) as {
        childPid: number; dcaId: number; ttpId: number; ttpTime: string;
        armAggregateId: number;
      };
      expect(resumed.childPid).not.toBe(process.pid);
      expect(resumed).toMatchObject({ dcaId, ttpId,
        ttpTime: '2026-10-18T02:46:57.282Z' });
      expect(resumed.armAggregateId).toBeGreaterThan(dcaId);
      expect(resumed.armAggregateId).toBeLessThan(ttpId);
      const paperClosed = await prisma.position.findUniqueOrThrow({ where: { id: paperId } });
      const liveClosed = await prisma.position.findUniqueOrThrow({ where: { id: liveId } });
      expect([paperClosed.status, liveClosed.status]).toEqual(['CLOSED', 'CLOSED']);
      expect([paperClosed.closeReason, liveClosed.closeReason]).toEqual(['TTP', 'TTP']);
      expect(await prisma.position.count({ where: { botId: paperBotId } })).toBe(1);
      expect(await prisma.position.count({ where: { botId: liveBot.id } })).toBe(1);
      const paperTrades = await prisma.trade.findMany({ where: { positionId: paperId },
        orderBy: { executedAt: 'asc' } });
      const liveTrades = await prisma.trade.findMany({ where: { positionId: liveId },
        orderBy: { executedAt: 'asc' } });
      expect(paperTrades.map((trade) => trade.lifecycleAction)).toEqual(['OPEN','DCA','CLOSE']);
      expect(liveTrades.map((trade) => trade.lifecycleAction)).toEqual(['OPEN','DCA','CLOSE']);
      expect(paperTrades.map((trade) => trade.price))
        .toEqual([verified[2].close, 0.1454, 0.1454]);
      expect(liveTrades.map((trade) => trade.price))
        .toEqual([verified[2].close, 0.1454, 0.1454]);
      const paperOrders = await prisma.order.findMany({ where: { positionId: paperId } });
      const liveOrders = await prisma.order.findMany({ where: { positionId: liveId } });
      const liveIntents = await prisma.liveOrderIntent.findMany({ where: {
        id: { in: liveOrders.map((order) => order.id) } } });
      const liveFills = await prisma.orderFill.findMany({ where: {
        orderId: { in: liveOrders.map((order) => order.id) } } });
      expect([paperOrders.length, liveOrders.length, liveIntents.length,
        liveFills.length]).toEqual([3, 3, 3, 3]);
      expect(new Set(liveIntents.map((intent) => intent.clientOrderId)).size).toBe(3);
      expect(liveOrders.every((order) => order.status === 'FILLED' &&
        order.feeSource === 'EXCHANGE_FILL' && !order.feePending)).toBe(true);
      expect(await prisma.runtimeExecutionDedupe.count({ where: {
        botId: liveBot.id, commandType: 'DCA', status: 'SUCCEEDED' } })).toBe(1);
      expect(await prisma.signal.count({ where: { botId: paperBotId,
        direction: 'EXIT' } })).toBe(0);
      expect(await prisma.signal.count({ where: { botId: liveBot.id,
        direction: 'EXIT' } })).toBe(0);
      const paperFees = paperTrades.reduce((sum, trade) => sum + (trade.fee ?? 0), 0);
      const liveFees = liveTrades.reduce((sum, trade) => sum + (trade.fee ?? 0), 0);
      const paperBasis = paperTrades.slice(0, 2);
      const paperQty = paperBasis.reduce((sum, trade) => sum + trade.quantity, 0);
      const paperAvg = paperBasis.reduce((sum, trade) => sum + trade.price * trade.quantity, 0) / paperQty;
      const paperContributions = paperBasis.map((trade) => trade.price * trade.quantity);
      expect(paperContributions[0]).toBeCloseTo(100, 4);
      expect(paperContributions[1]).toBeCloseTo(paperContributions[0], 4);
      const backtestAdds = await prisma.backtestContribution.findMany({ where: {
        backtestRunId: backtest.id, timestamp: {
          lte: new Date('2026-10-18T02:46:47.639Z') } },
        orderBy: { addSequence: 'asc' } });
      const firstBacktestAdd = backtestAdds.find((add) => add.kind === 'DCA' &&
        add.timestamp.getTime() === Date.parse('2026-10-18T02:46:47.639Z'));
      const firstBacktestEntry = backtestAdds.find((add) => add.kind === 'ENTRY' &&
        add.tradeSequence === firstBacktestAdd?.tradeSequence);
      expect(firstBacktestAdd).toBeDefined();
      expect(firstBacktestEntry).toBeDefined();
      expect(firstBacktestAdd!.contributionUsdt)
        .toBeCloseTo(firstBacktestEntry!.contributionUsdt, 6);
      expect(firstBacktestAdd!.contributionUsdt).toBeCloseTo(paperContributions[1], 4);
      expect(firstBacktestEntry!.contributionUsdt).toBeCloseTo(paperContributions[0], 4);
      expect(paperClosed.quantity).toBeCloseTo(paperQty, 6);
      expect(paperClosed.entryPrice).toBeCloseTo(paperAvg, 6);
      expect(paperClosed.realizedPnl).toBeCloseTo(
        (paperTrades[2].price - paperAvg) * paperQty - paperFees, 4);
      expect(liveClosed.realizedPnl).toBeCloseTo(
        (liveTrades[2].price - liveClosed.entryPrice) * liveClosed.quantity - liveFees, 4);
      expect(liveClosed.realizedPnl).toBeCloseTo(paperClosed.realizedPnl ?? NaN, 4);
      expect(backtestTrades[0].entryPrice).toBeCloseTo(paperAvg, 4);
      expect(backtestTrades[0].exitPrice).toBe(paperTrades[2].price);
      const liveNotionals = liveTrades.map((trade) => {
        const fill = liveFills.find((candidate) => candidate.orderId === trade.orderId);
        expect(fill).toBeDefined();
        expect(fill!.feeCost).toBeCloseTo(fill!.notional * feeRate, 8);
        return fill!.notional;
      });
      expect(liveNotionals[0]).toBeCloseTo(paperContributions[0], 6);
      expect(liveNotionals[1]).toBeCloseTo(paperContributions[1], 6);
      // BACKTEST settles at five decimals; runtime preserves venue-fee precision.
      expect((backtestTrades[0].fee ?? NaN) - paperFees)
        .toBeCloseTo(0.0000049035819344, 8);
      expect(backtestTrades[0].pnl - (paperClosed.realizedPnl ?? NaN))
        .toBeCloseTo(-0.00000595041389956, 8);
      const runBeforeRetry = await prisma.backtestRun.findUniqueOrThrow({
        where: { id: backtest.id } });
      await job(backtest.id);
      expect(await prisma.backtestRun.findUniqueOrThrow({ where: { id: backtest.id } }))
        .toEqual(runBeforeRetry);
      expect(await prisma.backtestTrade.count({ where: { backtestRunId: backtest.id } }))
        .toBe(backtestTrades.length);
      expect(await prisma.backtestReport.count({ where: { backtestRunId: backtest.id } }))
        .toBe(1);
      expect(await prisma.backtestRun.count({ where: { userId: user.id } })).toBe(1);
      process.stdout.write(`PUBLIC_011_THREE_MODE ${JSON.stringify({
        digest, signalDecisions, signalLossWitness: signalLossWitness && {
          period: signalLossWitness.period, lossIndex: signalLossWitness.lossIndex,
          threshold: signalLossWitness.threshold, condition: signalLossWitness.condition,
          attempts: signalLossWitness.attempts },
        backtest: { totalTrades: backtestTrades.length, reportNetPnl: report.netPnl,
          quantity: backtestTrades[0].quantity,
          average: backtestTrades[0].entryPrice, fee: backtestTrades[0].fee,
          pnl: backtestTrades[0].pnl },
        paper: { contributionUsdt: paperContributions,
          quantity: paperClosed.quantity, average: paperClosed.entryPrice,
          fee: paperFees, pnl: paperClosed.realizedPnl },
        mockLive: { quantity: liveClosed.quantity, average: liveClosed.entryPrice,
          fee: liveFees, pnl: liveClosed.realizedPnl },
        parentSubmits: venue.submits.length, liveIntents: liveIntents.length,
        liveFills: liveFills.length, resumePid: resumed.childPid,
        armAggregateId: resumed.armAggregateId,
      })}\n`);
    } finally {
      if (paperId) await runtimePositionStateStore.deletePositionRuntimeState(paperId);
      if (liveId) await runtimePositionStateStore.deletePositionRuntimeState(liveId);
      await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`;
      clearRuntimeTickerStore();
      clearRuntimeSignalMarketDataStore();
      vi.unstubAllGlobals();
      if (previousPaperFeeRate === undefined) delete process.env.RUNTIME_PAPER_TAKER_FEE_RATE;
      else process.env.RUNTIME_PAPER_TAKER_FEE_RATE = previousPaperFeeRate;
      if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
      else process.env.NODE_ENV = previousNodeEnv;
    }
  }, 150_000);

  resumeIt('resumes the real source pair from persisted state and archive', async () => {
    ensureIsolated();
    if (Number(process.env.RUN_011_REAL_SOURCE_PARENT_PID) === process.pid)
      throw new Error('resume must use a distinct process');
    const paperId = process.env.RUN_011_REAL_SOURCE_PAPER_ID;
    const liveId = process.env.RUN_011_REAL_SOURCE_LIVE_ID;
    const runId = process.env.RUN_011_REAL_SOURCE_BACKTEST_ID;
    if (!paperId || !liveId || !runId) throw new Error('missing resume IDs');
    vi.stubGlobal('fetch', async () => { throw new Error('resume network forbidden'); });
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    try {
      const archive = await readVerifiedRunArchive(runId, symbol, start, end);
      if (!archive) throw new Error('persisted source archive missing');
      const paper = await prisma.position.findUniqueOrThrow({ where: { id: paperId } });
      const live = await prisma.position.findUniqueOrThrow({ where: { id: liveId } });
      expect([paper.status, live.status]).toEqual(['OPEN', 'OPEN']);
      const paperState = await runtimePositionStateStore.getTrustedPositionRuntimeState(paperId);
      const liveState = await runtimePositionStateStore.getTrustedPositionRuntimeState(liveId);
      expect(paperState?.currentAdds).toBe(1);
      expect(liveState?.currentAdds).toBe(1);
      expect(paperState?.executedDcaLevelIndices).toEqual([0]);
      expect(liveState?.executedDcaLevelIndices).toEqual([0]);
      const automation = makeAutomation(false);
      let armAggregateId: number | null = null;
      for (const tick of archive[5].intrabarTicks.filter((row) =>
        row.sequenceId! > dcaId && row.sequenceId! <= ttpId)) {
        await automation.handleTickerEvent(sourceTicker(tick));
        if (tick.sequenceId !== ttpId) {
          const paperTracking = await runtimePositionStateStore.getTrustedPositionRuntimeState(paperId);
          const liveTracking = await runtimePositionStateStore.getTrustedPositionRuntimeState(liveId);
          if (paperTracking?.trailingTakeProfitActiveLevelIndex === 0 &&
              liveTracking?.trailingTakeProfitActiveLevelIndex === 0 &&
              armAggregateId === null) armAggregateId = tick.sequenceId!;
        }
        const positions = await prisma.position.findMany({
          where: { id: { in: [paperId, liveId] } } });
        expect(positions.every((position) => position.status ===
          (tick.sequenceId === ttpId ? 'CLOSED' : 'OPEN'))).toBe(true);
      }
      const closeTick = archive[5].intrabarTicks.find((tick) => tick.sequenceId === ttpId)!;
      expect(armAggregateId).not.toBeNull();
      await automation.handleTickerEvent(sourceTicker(closeTick));
      expect(await prisma.order.count({ where: { positionId: paperId } })).toBe(3);
      expect(await prisma.order.count({ where: { positionId: liveId } })).toBe(3);
      expect(venue.submits).toHaveLength(1);
      process.stdout.write(`PUBLIC_011_RUNTIME_PAIR ${JSON.stringify({
        dcaId, ttpId, armAggregateId,
        ttpTime: new Date(closeTick.eventTime).toISOString(),
        paperId, liveId, childPid: process.pid })}\n`);
    } finally {
      process.env.NODE_ENV = previousNodeEnv;
      vi.unstubAllGlobals();
    }
  }, 45_000);
});
