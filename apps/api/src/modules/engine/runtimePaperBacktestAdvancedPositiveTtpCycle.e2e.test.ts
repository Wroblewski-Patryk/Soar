import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
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
import { clearRuntimeSignalMarketDataStore } from './runtimeSignalMarketDataGateway';
import { clearRuntimeTickerStore } from './runtimeTickerStore';

const proofIt = process.env.RUN_ADVANCED_POSITION_PARITY_PROOF === '1' ? it : it.skip;
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
    ttp: [{ percent: 20, arm: 10 }], tsl: [] },
  additional: { dcaEnabled: true, dcaMode: 'advanced', dcaSizingBasis: 'usdt_contribution_v1',
    dcaTimes: 1, dcaLevels: [{ percent: 40, multiplier: 1 }] },
};

const resumePaperInFreshProcess = (positionId: string, baseTime: number) =>
  new Promise<void>((resolve, reject) => {
    const source = `
      const { prisma } = require('./src/prisma/client.ts');
      const { executeRuntimeDca, RuntimePositionAutomationService } = require('./src/modules/engine/runtimePositionAutomation.service.ts');
      const { loadDurableDcaProgress } = require('./src/modules/engine/runtimeDurableDcaProgress.ts');
      (async () => {
      const database = new URL(process.env.DATABASE_URL ?? '');
      if (database.pathname !== '/soar_position_parity_004_test') throw new Error('Dedicated test database required');
      const service = new RuntimePositionAutomationService({
        getCanonicalPositionState: async (id) => {
          const position = await prisma.position.findUnique({ where: { id } });
          return position ? { quantity: position.quantity, averageEntryPrice: position.entryPrice } : null;
        },
        getDurableDcaProgress: (input) => loadDurableDcaProgress(input),
        executeDca: (input) => executeRuntimeDca(input, { getOrderRules: async () => ({
          minAmount: 0.00000001, minNotional: 0.01, amountPrecision: 8, contractSize: 1,
        }) }),
        resolveLifecyclePrice: ({ fallbackPrice }) => fallbackPrice,
      });
      const send = (index, price) => service.handleTickerEvent({
        type: 'ticker', exchange: 'BINANCE', marketType: 'FUTURES', symbol: 'BTCUSDT',
        eventTime: Number(process.env.SOAR_PARITY_BASE_TIME) + index * 60_000 + 59_999,
        lastPrice: price, priceChangePercent24h: 0,
      });
      await send(6, 140);
      const beforeClose = await prisma.position.findUniqueOrThrow({
        where: { id: process.env.SOAR_PARITY_POSITION_ID },
      });
      if (beforeClose.status !== 'OPEN') throw new Error('PAPER closed before later TTP tick');
      await send(7, 127);
      await send(7, 127);
      await prisma.$disconnect();
      })().catch((error) => { console.error(error); process.exitCode = 1; });
    `;
    const child = spawn(process.execPath, ['--import', 'tsx', '-e', source], {
      cwd: process.cwd(),
      env: { ...process.env, SOAR_PARITY_POSITION_ID: positionId,
        SOAR_PARITY_BASE_TIME: String(baseTime) },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let output = '';
    const timeout = setTimeout(() => child.kill(), 15_000);
    child.stdout.on('data', (chunk: Buffer) => { output += chunk.toString(); });
    child.stderr.on('data', (chunk: Buffer) => { output += chunk.toString(); });
    child.on('error', reject);
    child.on('close', (code) => {
      clearTimeout(timeout);
      if (code === 0) resolve();
      else reject(new Error(`PAPER resume process exited ${code}: ${output}`));
    });
  });

describe('BACKTEST/PAPER advanced positive DCA and TTP parity', () => {
  proofIt('persists the same HOLD, positive DCA before TTP and fee-adjusted PnL', async () => {
    const databaseUrl = new URL(process.env.DATABASE_URL ?? '');
    if (databaseUrl.pathname.slice(1) !== 'soar_position_parity_004_test' ||
        databaseUrl.hostname !== '127.0.0.1' || !databaseUrl.port ||
        databaseUrl.port === '5432') {
      throw new Error('Position parity proof requires its own local soar_position_parity_004_test database');
    }
    const redisUrl = new URL(process.env.REDIS_URL ?? '');
    if (redisUrl.hostname !== '127.0.0.1' || !redisUrl.port || redisUrl.port === '6379') {
      throw new Error('Position parity proof requires its own local Redis port');
    }
    if (await prisma.user.count() !== 0) {
      throw new Error('Position parity proof requires an empty disposable user dataset');
    }
    const previousPaperFeeRate = process.env.RUNTIME_PAPER_TAKER_FEE_RATE;
    process.env.RUNTIME_PAPER_TAKER_FEE_RATE = String(feeRate);
    clearRuntimeTickerStore();
    clearRuntimeSignalMarketDataStore();
    const loop = new RuntimeSignalLoop();
    let botId: string | undefined;
    let positionId: string | undefined;
    try {
      const agent = request.agent(app);
      const email = `position-parity-${randomUUID()}@example.test`;
      expect((await agent.post('/auth/register').send({ email, password: 'test1234' })).status)
        .toBe(201);
      const user = await prisma.user.findUniqueOrThrow({ where: { email } });
      await ensureSubscriptionCatalog(prisma);
      await setActiveSubscriptionForUser(prisma, {
        userId: user.id, planCode: 'PROFESSIONAL', source: 'ADMIN_OVERRIDE',
        metadata: { reason: 'isolated-backtest-paper-parity-proof' },
      });
      const strategyResponse = await agent.post('/dashboard/strategies').send({
        name: 'BACKTEST/PAPER parity cycle', interval: '1m', leverage, walletRisk,
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
      const prices = [99, 100, 100, 99.9, 130, 140, 140, 127, 100];
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

      const createAutomation = () => new RuntimePositionAutomationService({
        getCanonicalPositionState: async (id) => {
          const position = await prisma.position.findUnique({ where: { id } });
          return position ? { quantity: position.quantity, averageEntryPrice: position.entryPrice }
            : null;
        },
        getDurableDcaProgress: (input) => loadDurableDcaProgress(input),
        // Only external symbol metadata is synthetic; executeRuntimeDca keeps the real policy/fill path.
        executeDca: (input) => executeRuntimeDca(input, { getOrderRules: async () => ({
          minAmount: 0.00000001, minNotional: 0.01, amountPrecision: 8, contractSize: 1,
        }) }),
        resolveLifecyclePrice: ({ fallbackPrice }) => fallbackPrice,
      });
      const send = (service: RuntimePositionAutomationService, index: number, price: number) =>
        service.handleTickerEvent({ type: 'ticker', exchange: 'BINANCE',
          marketType: 'FUTURES', symbol, eventTime: baseTime + index * 60_000 + 59_999,
          lastPrice: price, priceChangePercent24h: 0 });
      const firstService = createAutomation();
      await send(firstService, 4, prices[4]);
      expect((await prisma.position.findUniqueOrThrow({ where: { id: opened.id } })).status)
        .toBe('OPEN');
      await send(firstService, 5, prices[5]);
      const afterDca = await prisma.position.findUniqueOrThrow({ where: { id: opened.id } });
      expect(afterDca.status).toBe('OPEN');
      expect(afterDca.quantity).toBeGreaterThan(opened.quantity);
      expect(afterDca.entryPrice).toBeGreaterThan(opened.entryPrice);
      expect(await prisma.trade.count({ where: { positionId: opened.id, lifecycleAction: 'DCA' } }))
        .toBe(1);
      expect(await prisma.trade.count({ where: { positionId: opened.id, lifecycleAction: 'CLOSE' } }))
        .toBe(0);
      await runtimePositionStateStore.deletePositionRuntimeState(opened.id);
      await resumePaperInFreshProcess(opened.id, baseTime);
      const paperClosed = await prisma.position.findUniqueOrThrow({ where: { id: opened.id } });
      expect(paperClosed.status).toBe('CLOSED');
      expect(paperClosed.closeReason).toBe('TTP');
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
        paperCloses[0].price]).toEqual([prices[2], prices[5], prices[7]]);
      expect([...paperTrades].sort((a, b) => a.executedAt.getTime() - b.executedAt.getTime())
        .map((trade) => trade.lifecycleAction)).toEqual(['OPEN', 'DCA', 'CLOSE']);
      expect(paperCloses[0].closeReason).toBe('TTP');
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

      const candles = candlesFor(prices);
      const run = await prisma.backtestRun.create({ data: {
        userId: user.id, strategyId, name: 'Parity BACKTEST run', symbol, timeframe: '1m',
        seedConfig: { symbols: [symbol], marketType: 'FUTURES', leverage,
          marginMode: 'CROSSED', initialBalance, maxCandles: 100,
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
      expect(backtestTrades[0].exitReason).toBe('TTP');
      expect(backtestTrades[0].fee).toBeGreaterThan(0);
      expect(backtestTrades[0].closedAt.getTime()).toBe(candles[7].closeTime);
      const metrics = backtestReports[0].metrics as {
        lifecycleEventCounts: Record<string, number>;
        positionContributionUsdtTotal: number;
        runLifecycle: { reportReady: boolean };
      };
      expect(metrics.runLifecycle.reportReady).toBe(true);
      expect(metrics.positionContributionUsdtTotal).toBeCloseTo(2, 6);
      expect(metrics.lifecycleEventCounts).toMatchObject({ ENTRY: 1, DCA: 1,
        EXIT: 0, SL: 0, TP: 0, TTP: 1 });
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
      expect(backtestTrades[0].fee).toBeCloseTo(0.00167, 5);
      expect(backtestReports[0].netPnl).toBeCloseTo(0.17547, 5);

      await runtimePositionStateStore.deletePositionRuntimeState(opened.id);
      await send(createAutomation(), 8, prices[8]);
      await createClaimedBacktestRunJob(deps)(run.id);
      expect(await prisma.position.findUniqueOrThrow({ where: { id: opened.id } }))
        .toEqual(paperClosed);
      expect(await prisma.trade.findMany({ where: { positionId: opened.id } }))
        .toEqual(paperTrades);
      expect(await prisma.order.findMany({ where: { positionId: opened.id } }))
        .toEqual(paperOrders);
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
      if (positionId) {
        const ownedPositionId = positionId;
        await cleanup('clear owned runtime state', () =>
          runtimePositionStateStore.deletePositionRuntimeState(ownedPositionId));
      }
      await cleanup('truncate dedicated user dataset', () =>
        prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`);
      clearRuntimeTickerStore();
      clearRuntimeSignalMarketDataStore();
      if (previousPaperFeeRate === undefined) delete process.env.RUNTIME_PAPER_TAKER_FEE_RATE;
      else process.env.RUNTIME_PAPER_TAKER_FEE_RATE = previousPaperFeeRate;
      if (cleanupErrors.length > 0) throw new AggregateError(cleanupErrors, 'Parity proof cleanup failed');
    }
  }, 60_000);
});
