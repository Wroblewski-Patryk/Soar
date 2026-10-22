import { createHash, randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from 'redis';
import { Exchange } from '@prisma/client';
import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../../prisma/client';
import { normalizeSymbols } from '../../lib/symbols';
import { normalizeWalletRiskPercent } from '../engine/positionSizing';
import { parseStrategySignalRules } from '../engine/strategySignalEvaluator';
import { createClaimedBacktestRunJob } from './backtestClaimedRun';
import { resolveIndicatorWarmupCandles } from './backtestIndicatorSpecs';
import { simulateInterleavedPortfolio } from './backtestPortfolioSimulation.service';
import { computeAdaptiveMaxCandles, computeSourceWindowMs } from './backtestRange.service';
import { findBacktestRunById,
  findOwnedStrategySignalConfig } from './backtests.repository';
import { createOptInRawTradeV4JobSource } from './backtestRawTradeV4JobSource';
import { fetchVerifiedIntrabarTimelineCandles } from './backtestIntrabarTimelineSource';
import type { RawTradeBudget, RawTradeCandle } from './backtestRawTradeSource';

const proofIt = process.env.RUN_011A_RAW_V4_OFFICIAL_JOB_PROOF === '1' ? it : it.skip;
const symbol = 'ETHUSDT';
const day = '2026-10-18';
const startTimeMs = Date.parse('2026-10-18T02:00:00.000Z');
const endTimeMs = Date.parse('2026-10-18T04:00:00.000Z');
const expectedZipSha =
  '8fbf2b1aa01570d117bd53f8c69457e694ee1d8d7e6cbb5f76fdbaf261e2dcb7';
const expectedTapeSha =
  'e29f15b7b5a7e9c98dc826f466d7dbafd30bb16aa7c74ff3933f2cf2ef6c3228';
const budget: RawTradeBudget = { maxZipBytes: 29_176_827,
  maxCsvBytes: 178_044_910, maxSelectedTrades: 199_234,
  maxElapsedMs: 120_000 };
// Frozen in position-parity-011a-v4-official-eth-job-plan-2026-10-22.md.
const strategyConfig = {
  open: { direction: 'long', noMatchAction: 'HOLD',
    indicatorsLong: [{ name: 'MOMENTUM', condition: '>', value: -100,
      params: { period: 2 } }], indicatorsShort: [] },
  close: { mode: 'basic', tp: 0.1, sl: 0.1 },
  additional: { dcaEnabled: false, dcaTimes: 0 },
};

const maxDrawdownFromPnlSeries = (pnls: number[]) => {
  let equity = 0;
  let peak = 0;
  let maxDrawdown = 0;
  for (const pnl of pnls) {
    equity += pnl;
    if (equity > peak) peak = equity;
    const drawdown = peak > 0 ? (peak - equity) / peak : 0;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }
  return maxDrawdown;
};

describe('011A official ETH raw v4 full BACKTEST job (opt-in)', () => {
  proofIt('completes a durable job on verified public raw trades and retries offline',
    async () => {
      const db = new URL(process.env.DATABASE_URL ?? '');
      const redisUrl = new URL(process.env.REDIS_URL ?? '');
      if (db.hostname !== '127.0.0.1' || db.pathname.slice(1) !==
          'soar_011a_raw_foundation_test' || !db.port || db.port === '5432' ||
          redisUrl.hostname !== '127.0.0.1' || !redisUrl.port || redisUrl.port === '6379' ||
          process.env.RUN_011A_RAW_V4_JOB_PROOF !== '1')
        throw new Error('Requires opt-in and dedicated loopback PostgreSQL _test/Redis');
      const archiveDir = process.env.RUN_011A_RAW_ARCHIVE_DIR;
      const klineDir = process.env.RUN_011A_KLINES_DIR;
      if (!archiveDir || !klineDir) throw new Error('Official local source paths required');
      const zipBytes = readFileSync(join(archiveDir, `${symbol}-trades-${day}.zip`));
      const checksumBytes = readFileSync(join(archiveDir,
        `${symbol}-trades-${day}.zip.CHECKSUM`));
      const klineBytes = readFileSync(join(klineDir, `${symbol}-klines.json`));
      expect(zipBytes.length).toBe(budget.maxZipBytes);
      expect(createHash('sha256').update(zipBytes).digest('hex')).toBe(expectedZipSha);
      expect(new TextDecoder().decode(checksumBytes).trim())
        .toBe(`${expectedZipSha}  ${symbol}-trades-${day}.zip`);
      expect(createHash('sha256').update(klineBytes).digest('hex'))
        .toBe('9334eb8e2f94a34e8a45c9dfdba6544a0ee7d8f5129b85d2055cd6d19f2acc3f');
      const rows = JSON.parse(klineBytes.toString()) as Array<Array<string | number>>;
      const candles: RawTradeCandle[] = rows.map((row) => ({
        openTime: Number(row[0]), open: Number(row[1]), high: Number(row[2]),
        low: Number(row[3]), close: Number(row[4]), volume: Number(row[5]),
        closeTime: Number(row[6]), tradeCount: Number(row[8]),
      }));
      expect(candles).toHaveLength(120);
      expect(candles[0].openTime).toBe(startTimeMs);
      expect(candles.at(-1)?.closeTime).toBe(endTimeMs - 1);
      expect(candles.reduce((sum, candle) => sum + candle.tradeCount, 0))
        .toBe(budget.maxSelectedTrades);
      const redis = createClient({ url: redisUrl.toString() });
      await redis.connect();
      try { expect(await redis.dbSize()).toBe(0); }
      finally { await redis.quit(); }

      const user = await prisma.user.create({ data: {
        email: `raw-v4-official-job-${randomUUID()}@example.test`,
        password: 'local-test-only',
      } });
      const strategy = await prisma.strategy.create({ data: {
        userId: user.id, name: 'Frozen official ETH raw v4 job', interval: '1m',
        leverage: 1, walletRisk: 10, config: strategyConfig,
      } });
      const run = await prisma.backtestRun.create({ data: {
        userId: user.id, strategyId: strategy.id,
        name: 'Official ETH raw v4 full job', symbol, timeframe: '1m',
        seedConfig: { symbols: [symbol], exchange: 'BINANCE',
          marketType: 'FUTURES', leverage: 1, marginMode: 'ISOLATED',
          initialBalance: 1_000, feeRate: 0.0004, slippageRate: 0,
          maxCandles: 120, startAt: new Date(startTimeMs).toISOString(),
          endAt: new Date(endTimeMs).toISOString(),
          intrabarSource: 'BINANCE_USDM_TRADES_V4_TEST_ONLY' },
      } });
      const loadSource = vi.fn(async () => ({ candles, zipBytes, checksumBytes }));
      const rawSource = createOptInRawTradeV4JobSource({ budget, loadSource });
      let sourceReady = false;
      let replayTickCount = 0;
      const job = createClaimedBacktestRunJob({
        findBacktestRunById, uniqueSorted: normalizeSymbols,
        computeAdaptiveMaxCandles, resolveIndicatorWarmupCandles,
        normalizeWalletRiskPercent, parseStrategySignalRules,
        findOwnedStrategySignalConfig,
        fetchKlines: async () => { throw new Error('RAW_V4_OHLC_FALLBACK_FORBIDDEN'); },
        fetchVerifiedRawTradeV4ForRun: async (...args) => {
          const replay = await rawSource(...args);
          const snapshot = await prisma.backtestIntrabarArchive.findUniqueOrThrow({
            where: { runId_symbol: { runId: run.id, symbol } },
          });
          expect((snapshot.payload as { version: number }).version).toBe(4);
          expect((snapshot.payload as { tapeSha256: string }).tapeSha256)
            .toBe(expectedTapeSha);
          expect(await prisma.backtestRawTradeSourceRef.count({
            where: { runId: run.id, symbol },
          })).toBe(1);
          sourceReady = true;
          return replay;
        },
        fetchSupplementalSeries: async () => ({ fundingRates: [],
          openInterest: [], orderBook: [] }),
        simulateInterleavedPortfolio: (input) => {
          expect(sourceReady).toBe(true);
          const tape = input.candlesBySymbol.get(symbol) ?? [];
          replayTickCount = tape.reduce((sum, candle) =>
            sum + (candle.intrabarTicks?.length ?? 0), 0);
          expect(replayTickCount).toBe(199_234);
          return simulateInterleavedPortfolio(input);
        },
        computeSourceWindowMs, maxDrawdownFromPnlSeries,
      });
      vi.stubGlobal('fetch', vi.fn(() => { throw new Error('NETWORK_FORBIDDEN'); }));
      try {
        await job(run.id);
        const completed = await prisma.backtestRun.findUniqueOrThrow({
          where: { id: run.id },
        });
        expect(completed.status).toBe('COMPLETED');
        const digest = (completed.seedConfig as Record<string, any>)
          .intrabarSourceDigestBySymbol[symbol] as string;
        expect(digest).toMatch(/^[0-9a-f]{64}$/);
        const report = await prisma.backtestReport.findUniqueOrThrow({
          where: { backtestRunId: run.id },
        });
        expect((report.metrics as any).runLifecycle).toMatchObject({
          state: 'COMPLETED', reportReady: true,
        });
        const trades = await prisma.backtestTrade.findMany({
          where: { backtestRunId: run.id }, orderBy: { openedAt: 'asc' },
        });
        const contributions = await prisma.backtestContribution.findMany({
          where: { backtestRunId: run.id },
        });
        expect(report.totalTrades).toBe(trades.length);
        expect(report.netPnl).not.toBeNull();
        expect(report.netPnl).toBeCloseTo(
          trades.reduce((sum, trade) => sum + trade.pnl, 0), 8);
        expect(trades.every((trade) => typeof trade.fee === 'number' &&
          Number.isFinite(trade.fee) && trade.fee >= 0 &&
          Number.isFinite(trade.pnl))).toBe(true);
        expect((report.metrics as any).positionContributionCount)
          .toBe(contributions.length);
        expect(contributions.every((item) => item.kind === 'ENTRY')).toBe(true);
        const sourceAgain = await rawSource(run.id, Exchange.BINANCE, symbol,
          '1m', 'FUTURES', 120, endTimeMs, startTimeMs, digest);
        expect(sourceAgain.digest).toBe(digest);
        expect(sourceAgain.candles).toHaveLength(120);
        const timeline = await fetchVerifiedIntrabarTimelineCandles({
          runId: run.id, exchange: Exchange.BINANCE, symbol, timeframe: '1m',
          marketType: 'FUTURES', maxCandles: 120, startTimeMs, endTimeMs,
          expectedDigest: digest, rawTradeV4Budget: budget,
        });
        expect(timeline).toHaveLength(120);
        expect(timeline[15].intrabarTicks).toHaveLength(2166);
        expect(loadSource).toHaveBeenCalledTimes(1);
        expect(globalThis.fetch).not.toHaveBeenCalled();
        await job(run.id);
        expect(await prisma.backtestReport.count({
          where: { backtestRunId: run.id },
        })).toBe(1);
        expect(await prisma.backtestTrade.count({
          where: { backtestRunId: run.id },
        })).toBe(trades.length);
        expect(await prisma.backtestContribution.count({
          where: { backtestRunId: run.id },
        })).toBe(contributions.length);
        expect(await prisma.backtestIntrabarArchive.count({
          where: { runId: run.id, symbol },
        })).toBe(1);
        console.log('OFFICIAL_V4_JOB_PROOF', JSON.stringify({
          runId: run.id, status: completed.status, digest,
          tradeCount: trades.length, contributionCount: contributions.length,
          feeTotal: trades.reduce((sum, trade) => sum + (trade.fee ?? 0), 0),
          netPnl: report.netPnl, replayTickCount,
          sourceLoads: loadSource.mock.calls.length,
        }));
      } finally { vi.unstubAllGlobals(); }
    }, 240_000);
});
