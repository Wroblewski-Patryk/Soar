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
import { marketSequenceStrategyConfig } from './backtest011aMarketWitness.config';
import { createClaimedBacktestRunJob } from './backtestClaimedRun';
import { resolveIndicatorWarmupCandles } from './backtestIndicatorSpecs';
import { simulateInterleavedPortfolio } from './backtestPortfolioSimulation.service';
import { computeAdaptiveMaxCandles, computeSourceWindowMs } from './backtestRange.service';
import { findBacktestRunById,
  findOwnedStrategySignalConfig } from './backtests.repository';
import { createOptInRawTradeV4JobSource } from './backtestRawTradeV4JobSource';
import { fetchVerifiedIntrabarTimelineCandles } from './backtestIntrabarTimelineSource';
import type { RawTradeBudget, RawTradeCandle } from './backtestRawTradeSource';

const proofIt = process.env.RUN_011A_ALICE_RAW_V4_JOB_PROOF === '1' ? it : it.skip;
const symbol = 'ALICEUSDT';
const day = '2026-10-18';
const startTimeMs = Date.parse('2026-10-18T02:41:00.000Z');
const endTimeMs = Date.parse('2026-10-18T04:21:00.000Z');
const dcaTime = Date.parse('2026-10-18T02:46:47.639Z');
const ttpTime = Date.parse('2026-10-18T02:46:57.282Z');
const dcaRawId = 394_796_061;
const ttpRawId = 394_796_067;
const expectedZipSha =
  'c90445e1b22111d993aef687d4bbea29bdb11de60c28e0219f035166a5486502';
const expectedTapeSha =
  'cbe297350b5752f44ab499193b0dd108a5a43f561c5539f42821dae209a8806b';
const budget: RawTradeBudget = { maxZipBytes: 399_792,
  maxCsvBytes: 1_694_239, maxSelectedTrades: 1_730,
  maxElapsedMs: 30_000 };
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

describe('011A fixed ALICE raw-trades v4 full BACKTEST job (opt-in)', () => {
  proofIt('persists the raw witness before DCA to later TTP and retries offline',
    async () => {
      const db = new URL(process.env.DATABASE_URL ?? '');
      const redisUrl = new URL(process.env.REDIS_URL ?? '');
      if (db.hostname !== '127.0.0.1' || db.pathname.slice(1) !==
          'soar_011a_raw_foundation_test' || !db.port || db.port === '5432' ||
          redisUrl.hostname !== '127.0.0.1' || !redisUrl.port || redisUrl.port === '6379' ||
          process.env.RUN_011A_RAW_V4_JOB_PROOF !== '1')
        throw new Error('Requires opt-in and dedicated loopback PostgreSQL _test/Redis');
      const sourceDir = process.env.RUN_011A_ALICE_RAW_SOURCE_DIR;
      if (!sourceDir) throw new Error('Fixed ALICE local source path required');
      const basename = `${symbol}-trades-${day}.zip`;
      const zipBytes = readFileSync(join(sourceDir, basename));
      const checksumBytes = readFileSync(join(sourceDir, `${basename}.CHECKSUM`));
      const klineBytes = readFileSync(join(sourceDir, 'ALICEUSDT-klines-0241-0421.json'));
      expect(zipBytes.length).toBe(budget.maxZipBytes);
      expect(createHash('sha256').update(zipBytes).digest('hex')).toBe(expectedZipSha);
      expect(new TextDecoder().decode(checksumBytes).trim())
        .toBe(`${expectedZipSha}  ${basename}`);
      expect(createHash('sha256').update(klineBytes).digest('hex'))
        .toBe('4738f1e447658e153413b01b32c07ad6f5d1791993e83404e611631caa698133');
      const rows = JSON.parse(klineBytes.toString()) as Array<Array<string | number>>;
      const candles: RawTradeCandle[] = rows.map((row) => ({
        openTime: Number(row[0]), open: Number(row[1]), high: Number(row[2]),
        low: Number(row[3]), close: Number(row[4]), volume: Number(row[5]),
        closeTime: Number(row[6]), tradeCount: Number(row[8]),
      }));
      expect(candles).toHaveLength(100);
      expect(candles[0].openTime).toBe(startTimeMs);
      expect(candles.at(-1)?.closeTime).toBe(endTimeMs - 1);
      expect(candles.reduce((sum, candle) => sum + candle.tradeCount, 0))
        .toBe(budget.maxSelectedTrades);
      const redis = createClient({ url: redisUrl.toString() });
      await redis.connect();
      try { expect(await redis.dbSize()).toBe(0); }
      finally { await redis.quit(); }

      const user = await prisma.user.create({ data: {
        email: `raw-v4-alice-${randomUUID()}@example.test`, password: 'local-test-only',
      } });
      const strategy = await prisma.strategy.create({ data: {
        userId: user.id, name: 'Fixed ALICE raw witness', interval: '1m',
        leverage: 1, walletRisk: 10, config: marketSequenceStrategyConfig,
      } });
      const run = await prisma.backtestRun.create({ data: {
        userId: user.id, strategyId: strategy.id,
        name: 'Fixed ALICE raw v4 witness job', symbol, timeframe: '1m',
        seedConfig: { symbols: [symbol], exchange: 'BINANCE',
          marketType: 'FUTURES', leverage: 1, marginMode: 'ISOLATED',
          initialBalance: 1_000, feeRate: 0.0004, slippageRate: 0,
          maxCandles: 100, startAt: new Date(startTimeMs).toISOString(),
          endAt: new Date(endTimeMs).toISOString(),
          intrabarSource: 'BINANCE_USDM_TRADES_V4_TEST_ONLY' },
      } });
      const loadSource = vi.fn(async () => ({ candles, zipBytes, checksumBytes }));
      const rawSource = createOptInRawTradeV4JobSource({ budget, loadSource });
      let sourceReady = false;
      let pairConfirmed = false;
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
          expect(tape).toHaveLength(100);
          expect(tape.reduce((sum, candle) =>
            sum + (candle.intrabarTicks?.length ?? 0), 0)).toBe(1_730);
          const result = simulateInterleavedPortfolio(input);
          const events = result.perSymbol[symbol].events;
          const dca = events.find((event) => event.type === 'DCA' &&
            event.timestamp.getTime() === dcaTime && event.price === 0.1454);
          const ttp = events.find((event) => event.type === 'TTP' &&
            event.timestamp.getTime() === ttpTime && event.price === 0.1454);
          expect(dca).toBeDefined();
          expect(ttp).toBeDefined();
          expect(dca!.tradeSequence).toBe(ttp!.tradeSequence);
          expect(dca!.candleIndex).toBe(ttp!.candleIndex);
          expect(dca!.candleIndex).toBe(5);
          const ticks = tape[5].intrabarTicks ?? [];
          const dcaMatches = ticks.filter((tick) =>
            tick.eventTime === dcaTime && tick.price === 0.1454);
          const ttpMatches = ticks.filter((tick) =>
            tick.eventTime === ttpTime && tick.price === 0.1454);
          expect(dcaMatches.map((tick) => tick.sequenceId)).toEqual([dcaRawId]);
          expect(ttpMatches.map((tick) => tick.sequenceId)).toEqual([ttpRawId]);
          pairConfirmed = true;
          return result;
        },
        computeSourceWindowMs, maxDrawdownFromPnlSeries,
      });
      vi.stubGlobal('fetch', vi.fn(() => { throw new Error('NETWORK_FORBIDDEN'); }));
      try {
        await job(run.id);
        expect(pairConfirmed).toBe(true);
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
        const dca = contributions.filter((item) => item.kind === 'DCA' &&
          item.timestamp.getTime() === dcaTime && item.price === 0.1454);
        expect(dca).toHaveLength(1);
        expect(dca[0].candleIndex).toBe(5);
        const targetTrade = trades.filter((trade) => trade.exitReason === 'TTP' &&
          trade.closedAt.getTime() === ttpTime && trade.exitPrice === 0.1454);
        expect(targetTrade).toHaveLength(1);
        expect(report.totalTrades).toBe(trades.length);
        expect(report.netPnl).toBeCloseTo(
          trades.reduce((sum, trade) => sum + trade.pnl, 0), 8);
        expect(trades.every((trade) => typeof trade.fee === 'number' &&
          Number.isFinite(trade.fee) && trade.fee >= 0 &&
          Number.isFinite(trade.pnl))).toBe(true);
        expect((report.metrics as any).positionContributionCount)
          .toBe(contributions.length);
        expect((report.metrics as any).dcaContributionUsdtTotal).toBeCloseTo(
          contributions.filter((item) => item.kind === 'DCA')
            .reduce((sum, item) => sum + item.contributionUsdt, 0), 8);
        const replay = await rawSource(run.id, Exchange.BINANCE, symbol,
          '1m', 'FUTURES', 100, endTimeMs, startTimeMs, digest);
        expect(replay.digest).toBe(digest);
        expect(replay.candles).toHaveLength(100);
        const timeline = await fetchVerifiedIntrabarTimelineCandles({
          runId: run.id, exchange: Exchange.BINANCE, symbol, timeframe: '1m',
          marketType: 'FUTURES', maxCandles: 100, startTimeMs, endTimeMs,
          expectedDigest: digest, rawTradeV4Budget: budget,
        });
        expect(timeline[5].intrabarTicks?.find((tick) => tick.sequenceId === dcaRawId))
          .toMatchObject({ eventTime: dcaTime, price: 0.1454 });
        expect(timeline[5].intrabarTicks?.find((tick) => tick.sequenceId === ttpRawId))
          .toMatchObject({ eventTime: ttpTime, price: 0.1454 });
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
        console.log('ALICE_RAW_V4_JOB_PROOF', JSON.stringify({
          runId: run.id, status: completed.status, digest,
          dcaRawId, ttpRawId, tradeCount: trades.length,
          contributionCount: contributions.length,
          feeTotal: trades.reduce((sum, trade) => sum + (trade.fee ?? 0), 0),
          netPnl: report.netPnl, targetTradePnl: targetTrade[0].pnl,
          targetTradeFee: targetTrade[0].fee,
          sourceLoads: loadSource.mock.calls.length,
        }));
      } finally { vi.unstubAllGlobals(); }
    }, 120_000);
});
