import { createHash, randomUUID } from 'node:crypto';
import { createClient } from 'redis';
import { Exchange } from '@prisma/client';
import { strToU8, zipSync } from 'fflate';
import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../../prisma/client';
import { normalizeSymbols } from '../../lib/symbols';
import { normalizeWalletRiskPercent } from '../engine/positionSizing';
import { parseStrategySignalRules } from '../engine/strategySignalEvaluator';
import { createClaimedBacktestRunJob } from './backtestClaimedRun';
import { resolveIndicatorWarmupCandles } from './backtestIndicatorSpecs';
import { simulateInterleavedPortfolio } from './backtestPortfolioSimulation.service';
import { computeAdaptiveMaxCandles, computeSourceWindowMs } from './backtestRange.service';
import { findBacktestRunById } from './backtests.repository';
import { createOptInRawTradeV4JobSource } from './backtestRawTradeV4JobSource';
import { fetchVerifiedIntrabarTimelineCandles } from './backtestIntrabarTimelineSource';
import type { RawTradeBudget, RawTradeCandle } from './backtestRawTradeSource';

const proofIt = process.env.RUN_011A_RAW_V4_JOB_PROOF === '1' ? it : it.skip;
const symbol = 'ETHUSDT';
const day = '2026-10-18';
const startTimeMs = Date.parse('2026-10-18T02:00:00.000Z');
const endTimeMs = startTimeMs + 100 * 60_000;
const strategyConfig = {
  open: { direction: 'long', noMatchAction: 'HOLD',
    indicatorsLong: [{ name: 'MOMENTUM', condition: '>', value: 0.5,
      params: { period: 2 } }], indicatorsShort: [] },
  close: { mode: 'advanced', ttp: [{ percent: 20, arm: 10 }], tsl: [] },
  additional: { dcaEnabled: true, dcaMode: 'advanced', dcaTimes: 1,
    dcaSizingBasis: 'usdt_contribution_v1',
    dcaLevels: [{ percent: 25, multiplier: 1 }] },
};

const fixture = () => {
  const prices = Array.from({ length: 100 }, (_, i) =>
    [0.2, 1, 1, 0.99, 1.24, 1.13][i] ?? 1.13);
  const rows: string[] = [];
  const candles: RawTradeCandle[] = prices.map((price, index) => {
    const openTime = startTimeMs + index * 60_000;
    const first = index === 5 ? 1.25 : price;
    const second = price;
    for (const [offset, tickPrice] of [first, second].entries()) {
      const time = offset === 0 ? openTime + 20_000 : openTime + 59_999;
      rows.push(`${100_000 + index * 2 + offset},${tickPrice},500,${tickPrice * 500},${time},false`);
    }
    return { openTime, closeTime: openTime + 59_999,
      open: first, high: Math.max(first, second), low: Math.min(first, second),
      close: second, volume: 1_000, tradeCount: 2 };
  });
  const csv = strToU8(`id,price,qty,quote_qty,time,is_buyer_maker\n${rows.join('\n')}\n`);
  const basename = `${symbol}-trades-${day}.zip`;
  const zipBytes = zipSync({ [basename.replace('.zip', '.csv')]: csv });
  const checksumBytes = strToU8(`${createHash('sha256').update(zipBytes).digest('hex')}  ${basename}\n`);
  const budget: RawTradeBudget = { maxZipBytes: zipBytes.length,
    maxCsvBytes: csv.length, maxSelectedTrades: 200, maxElapsedMs: 10_000 };
  return { candles, zipBytes, checksumBytes, budget };
};

describe('011A raw v4 full BACKTEST job on isolated storage', () => {
  proofIt('persists before simulation, completes DCA to TTP, and retries offline without duplicates',
    async () => {
      const db = new URL(process.env.DATABASE_URL ?? '');
      const redisUrl = new URL(process.env.REDIS_URL ?? '');
      if (db.hostname !== '127.0.0.1' || db.pathname.slice(1) !==
          'soar_011a_raw_foundation_test' || !db.port || db.port === '5432' ||
          redisUrl.hostname !== '127.0.0.1' || !redisUrl.port || redisUrl.port === '6379')
        throw new Error('Requires dedicated loopback PostgreSQL _test and Redis');
      const redis = createClient({ url: redisUrl.toString() });
      await redis.connect();
      try { expect(await redis.dbSize()).toBe(0); }
      finally { await redis.quit(); }
      const source = fixture();
      const user = await prisma.user.create({ data: {
        email: `raw-v4-job-${randomUUID()}@example.test`, password: 'local-test-only',
      } });
      const strategy = await prisma.strategy.create({ data: {
        userId: user.id, name: 'Raw v4 DCA TTP proof', interval: '1m',
        leverage: 1, walletRisk: 10, config: strategyConfig,
      } });
      const loadSource = vi.fn(async () => ({ candles: source.candles,
        zipBytes: source.zipBytes, checksumBytes: source.checksumBytes }));
      const rawSource = createOptInRawTradeV4JobSource({
        budget: source.budget, loadSource,
      });
      const job = createClaimedBacktestRunJob({
        findBacktestRunById, uniqueSorted: normalizeSymbols,
        computeAdaptiveMaxCandles, resolveIndicatorWarmupCandles,
        normalizeWalletRiskPercent, parseStrategySignalRules,
        findOwnedStrategySignalConfig: async () => ({ config: strategyConfig,
          walletRisk: 10 }),
        fetchKlines: async () => { throw new Error('RAW_V4_OHLC_FALLBACK_FORBIDDEN'); },
        fetchVerifiedRawTradeV4ForRun: async (...args) => {
          const replay = await rawSource(...args);
          expect(await prisma.backtestIntrabarArchive.count({
            where: { runId: args[0], symbol },
          })).toBe(1);
          expect(await prisma.backtestRawTradeSourceRef.count({
            where: { runId: args[0], symbol },
          })).toBe(1);
          return replay;
        },
        fetchSupplementalSeries: async () => ({ fundingRates: [],
          openInterest: [], orderBook: [] }),
        simulateInterleavedPortfolio: (input) => {
          // The source must already be committed before any PnL calculation.
          return simulateInterleavedPortfolio(input);
        },
        computeSourceWindowMs,
        maxDrawdownFromPnlSeries: () => 0,
      });
      const run = await prisma.backtestRun.create({ data: {
        userId: user.id, strategyId: strategy.id, name: 'Raw v4 complete job',
        symbol, timeframe: '1m', seedConfig: {
          symbols: [symbol], exchange: 'BINANCE', marketType: 'FUTURES',
          leverage: 1, marginMode: 'ISOLATED', initialBalance: 1_000,
          maxCandles: 100, startAt: new Date(startTimeMs).toISOString(),
          endAt: new Date(endTimeMs).toISOString(),
          intrabarSource: 'BINANCE_USDM_TRADES_V4_TEST_ONLY',
        },
      } });
      vi.stubGlobal('fetch', vi.fn(() => { throw new Error('NETWORK_FORBIDDEN'); }));
      try {
        await job(run.id);
        const completed = await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } });
        expect(completed.status).toBe('COMPLETED');
        const seed = completed.seedConfig as Record<string, any>;
        const digest = seed.intrabarSourceDigestBySymbol[symbol] as string;
        expect(digest).toMatch(/^[0-9a-f]{64}$/);
        const report = await prisma.backtestReport.findUniqueOrThrow({
          where: { backtestRunId: run.id },
        });
        expect((report.metrics as any).runLifecycle).toMatchObject({
          state: 'COMPLETED', reportReady: true,
        });
        expect(report.totalTrades).toBe(1);
        expect(report.netPnl).not.toBeNull();
        expect((report.metrics as any).lifecycleEventCounts).toMatchObject({
          ENTRY: 1, DCA: 1, TTP: 1,
        });
        const trades = await prisma.backtestTrade.findMany({
          where: { backtestRunId: run.id },
        });
        expect(trades).toHaveLength(1);
        expect(trades[0].exitReason).toBe('TTP');
        expect(trades[0].closedAt.getTime()).toBe(startTimeMs + 5 * 60_000 + 59_999);
        expect(trades[0].pnl).toBeCloseTo(3.23864, 6);
        expect(trades[0].fee).toBeCloseTo(0.16136, 6);
        expect(report.netPnl).toBeCloseTo(trades[0].pnl, 8);
        const contributions = await prisma.backtestContribution.findMany({
          where: { backtestRunId: run.id }, orderBy: { addSequence: 'asc' },
        });
        expect(contributions.map((item) => [item.kind, item.price,
          item.contributionUsdt])).toEqual([
          ['ENTRY', 1, 100], ['DCA', 1.25, 100],
        ]);
        expect(await prisma.backtestReport.count({ where: { backtestRunId: run.id } })).toBe(1);
        const replay = await rawSource(run.id, Exchange.BINANCE, symbol, '1m',
          'FUTURES', 100, endTimeMs, startTimeMs, digest);
        expect(replay.digest).toBe(digest);
        expect(replay.candles[5].intrabarTicks).toHaveLength(2);
        expect(loadSource).toHaveBeenCalledTimes(1);
        await job(run.id);
        expect(await prisma.backtestTrade.count({ where: { backtestRunId: run.id } })).toBe(1);
        expect(await prisma.backtestReport.count({ where: { backtestRunId: run.id } })).toBe(1);
        expect(await prisma.backtestContribution.count({
          where: { backtestRunId: run.id },
        })).toBe(2);
        const timeline = await fetchVerifiedIntrabarTimelineCandles({
          runId: run.id, exchange: Exchange.BINANCE, symbol, timeframe: '1m',
          marketType: 'FUTURES', maxCandles: 100, startTimeMs, endTimeMs,
          expectedDigest: digest, rawTradeV4Budget: source.budget,
        });
        expect(timeline[5].intrabarTicks).toHaveLength(2);
        expect(globalThis.fetch).not.toHaveBeenCalled();
      } finally { vi.unstubAllGlobals(); }
    }, 120_000);

  proofIt.each(['disabled', 'missing', 'changed', 'limit'] as const)(
    'fails %s source before simulation with no invented PnL or trades',
    async (variant) => {
      const db = new URL(process.env.DATABASE_URL ?? '');
      if (db.hostname !== '127.0.0.1' || db.pathname.slice(1) !==
          'soar_011a_raw_foundation_test' || !db.port || db.port === '5432')
        throw new Error('Requires dedicated loopback PostgreSQL _test');
      const source = fixture();
      const loadSource = vi.fn(async () => {
        if (variant === 'missing') throw new Error('LOCAL_RAW_SOURCE_MISSING');
        return { candles: source.candles, zipBytes: source.zipBytes,
          checksumBytes: variant === 'changed'
            ? strToU8(`${'0'.repeat(64)}  ${symbol}-trades-${day}.zip\n`)
            : source.checksumBytes };
      });
      const rawSource = createOptInRawTradeV4JobSource({
        budget: variant === 'limit' ? { ...source.budget,
          maxZipBytes: source.zipBytes.length - 1 } : source.budget,
        loadSource,
      });
      const simulate = vi.fn(() => { throw new Error('SIMULATION_MUST_NOT_RUN'); });
      const user = await prisma.user.create({ data: {
        email: `raw-v4-${variant}-${randomUUID()}@example.test`,
        password: 'local-test-only',
      } });
      const run = await prisma.backtestRun.create({ data: {
        userId: user.id, name: `Raw v4 ${variant}`, symbol, timeframe: '1m',
        seedConfig: { symbols: [symbol], exchange: 'BINANCE',
          marketType: 'FUTURES', maxCandles: 100,
          startAt: new Date(startTimeMs).toISOString(),
          endAt: new Date(endTimeMs).toISOString(),
          intrabarSource: 'BINANCE_USDM_TRADES_V4_TEST_ONLY' },
      } });
      const job = createClaimedBacktestRunJob({
        findBacktestRunById, uniqueSorted: normalizeSymbols,
        computeAdaptiveMaxCandles, resolveIndicatorWarmupCandles,
        normalizeWalletRiskPercent, parseStrategySignalRules,
        findOwnedStrategySignalConfig: async () => null,
        fetchKlines: async () => { throw new Error('OHLC_FALLBACK_FORBIDDEN'); },
        fetchVerifiedRawTradeV4ForRun: variant === 'disabled' ? undefined : rawSource,
        fetchSupplementalSeries: async () => ({ fundingRates: [],
          openInterest: [], orderBook: [] }),
        simulateInterleavedPortfolio: simulate,
        computeSourceWindowMs, maxDrawdownFromPnlSeries: () => 0,
      });
      await job(run.id);
      const failed = await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } });
      expect(failed.status).toBe('FAILED');
      expect((failed.seedConfig as Record<string, any>).error).toContain(
        variant === 'disabled' ? 'BACKTEST_INTRABAR_SOURCE_UNSUPPORTED' :
          'BACKTEST_INTRABAR_SOURCE_INCOMPLETE');
      const report = await prisma.backtestReport.findUniqueOrThrow({
        where: { backtestRunId: run.id },
      });
      expect(report.totalTrades).toBe(0);
      expect(report.netPnl).toBeNull();
      expect((report.metrics as any).runLifecycle).toMatchObject({
        state: 'FAILED', reportReady: false,
      });
      expect(await prisma.backtestTrade.count({ where: { backtestRunId: run.id } })).toBe(0);
      expect(simulate).not.toHaveBeenCalled();
      expect(loadSource).toHaveBeenCalledTimes(variant === 'disabled' ? 0 : 1);
    }, 120_000);
});
