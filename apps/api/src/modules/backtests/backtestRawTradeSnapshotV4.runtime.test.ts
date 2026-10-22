import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from 'redis';
import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../../prisma/client';
import { claimBacktestRun } from './backtestRunOwnership.repository';
import { fetchVerifiedIntrabarTimelineCandles,
  BacktestTimelineSourceError } from './backtestIntrabarTimelineSource';
import { readVerifiedRunArchive } from './backtestBinanceFuturesIntrabarArchive';
import { type RawTradeBudget, type RawTradeCandle } from './backtestRawTradeSource';
import { readVerifiedRawTradeSnapshotV4ForRun,
  saveVerifiedRawTradeSnapshotV4ForRun } from './backtestRawTradeSource.repository';

const proofIt = process.env.RUN_011A_RAW_V4_PROOF === '1' ? it : it.skip;
const symbol = 'ETHUSDT';
const day = '2026-10-18';
const startTimeMs = Date.parse('2026-10-18T02:00:00.000Z');
const endTimeMs = startTimeMs + 120 * 60_000;
const budget: RawTradeBudget = {
  maxZipBytes: 29_176_827, maxCsvBytes: 178_044_910,
  maxSelectedTrades: 199_234, maxElapsedMs: 120_000,
};

describe('011A raw trades v4 offline replay (opt-in)', () => {
  proofIt('replays two runs from one blob and fails closed on missing, changed and limited sources',
    async () => {
      const db = new URL(process.env.DATABASE_URL ?? '');
      const redisUrl = new URL(process.env.REDIS_URL ?? '');
      if (db.hostname !== '127.0.0.1' || db.pathname.slice(1) !==
          'soar_011a_raw_foundation_test' || !db.port || db.port === '5432' ||
          redisUrl.hostname !== '127.0.0.1' || !redisUrl.port ||
          redisUrl.port === '6379')
        throw new Error('Requires dedicated loopback PostgreSQL _test and Redis');
      const archive = process.env.RUN_011A_RAW_ARCHIVE_DIR;
      const klineDir = process.env.RUN_011A_KLINES_DIR;
      if (!archive || !klineDir) throw new Error('Official local source paths required');
      const zipBytes = readFileSync(join(archive, `${symbol}-trades-${day}.zip`));
      const checksumBytes = readFileSync(join(archive,
        `${symbol}-trades-${day}.zip.CHECKSUM`));
      const klines = JSON.parse(readFileSync(join(klineDir,
        `${symbol}-klines.json`), 'utf8')) as Array<Array<number | string>>;
      const candles: RawTradeCandle[] = klines.map((row) => ({
        openTime: Number(row[0]), open: Number(row[1]), high: Number(row[2]),
        low: Number(row[3]), close: Number(row[4]), volume: Number(row[5]),
        closeTime: Number(row[6]), tradeCount: Number(row[8]),
      }));
      expect(candles).toHaveLength(120);
      const source = { symbol, day, candles, zipBytes, checksumBytes, budget };
      const redis = createClient({ url: redisUrl.toString() });
      await redis.connect();
      try { expect(await redis.dbSize()).toBe(0); }
      finally { await redis.quit(); }

      const user = await prisma.user.create({ data: {
        email: `raw-v4-${randomUUID()}@example.test`, password: 'local-test-only',
      } });
      const runs = await Promise.all([0, 1].map((index) =>
        prisma.backtestRun.create({ data: {
          userId: user.id, name: `Raw v4 ${index}`, symbol, timeframe: '1m',
        } })));
      const tokens = await Promise.all(runs.map((run) => claimBacktestRun(run.id)));
      expect(tokens.every(Boolean)).toBe(true);
      const snapshots = [];
      for (const [index, run] of runs.entries())
        snapshots.push(await saveVerifiedRawTradeSnapshotV4ForRun({
          ...source, runId: run.id, executionToken: tokens[index]!,
        }));
      expect(snapshots[0]).toEqual(snapshots[1]);
      expect(snapshots[0].version).toBe(4);
      expect(snapshots[0].sources).toHaveLength(1);
      expect(snapshots[0].candles).toHaveLength(120);
      expect(snapshots[0].candleTapeSha256).toHaveLength(120);
      expect(snapshots[0].tapeSha256)
        .toBe('e29f15b7b5a7e9c98dc826f466d7dbafd30bb16aa7c74ff3933f2cf2ef6c3228');
      expect(snapshots[0].candleTapeSha256[15])
        .toBe('2cdcc965941f48eb7b63082ae82ffd98cbcd01123d21cea95e2c29eb722d0c84');
      expect(await prisma.backtestRawTradeSourceBlob.count({
        where: { zipSha256: snapshots[0].sources[0].zipSha256 } })).toBe(1);
      expect(await prisma.backtestRawTradeSourceRef.count({
        where: { runId: { in: runs.map((run) => run.id) } } })).toBe(2);
      expect(await prisma.backtestIntrabarArchive.count({
        where: { runId: { in: runs.map((run) => run.id) } } })).toBe(2);
      expect(await prisma.backtestIntrabarArchiveRaw.count({
        where: { runId: { in: runs.map((run) => run.id) } } })).toBe(0);
      const retry = await saveVerifiedRawTradeSnapshotV4ForRun({
        ...source, runId: runs[0].id, executionToken: tokens[0]!,
      });
      expect(retry).toEqual(snapshots[0]);
      expect(await prisma.backtestIntrabarArchive.count({
        where: { runId: runs[0].id } })).toBe(1);

      vi.stubGlobal('fetch', vi.fn(() => { throw new Error('NETWORK_FORBIDDEN'); }));
      try {
        const timelines = [];
        for (const run of runs) {
          const replay = await readVerifiedRawTradeSnapshotV4ForRun({
            runId: run.id, symbol, startTimeMs, endTimeMs, budget,
            expectedDigest: snapshots[0].replayDigestSha256,
          });
          expect(replay.candles.map((value) => value.tradeCount))
            .toEqual(candles.map((value) => value.tradeCount));
          expect(replay.candles[15].intrabarTicks).toHaveLength(2166);
          expect(replay.candles[15].intrabarTicks[0].sequenceId)
            .toBe(8_867_044_765);
          expect(replay.candles[15].intrabarTicks.at(-1)?.sequenceId)
            .toBe(8_867_046_942);
          timelines.push(await fetchVerifiedIntrabarTimelineCandles({
            runId: run.id, exchange: 'BINANCE', symbol, timeframe: '1m',
            marketType: 'FUTURES', maxCandles: 120,
            startTimeMs, endTimeMs,
            expectedDigest: snapshots[0].replayDigestSha256,
            rawTradeV4Budget: budget,
          }));
        }
        expect(timelines[0]).toEqual(timelines[1]);
        expect(globalThis.fetch).not.toHaveBeenCalled();
        await expect(readVerifiedRunArchive(runs[0].id, symbol,
          startTimeMs, endTimeMs))
          .rejects.toThrow('BACKTEST_INTRABAR_ARCHIVE_SNAPSHOT_CHANGED');
        await expect(fetchVerifiedIntrabarTimelineCandles({
          runId: runs[0].id, exchange: 'BINANCE', symbol, timeframe: '1m',
          marketType: 'FUTURES', maxCandles: 120,
          startTimeMs, endTimeMs, expectedDigest: '0'.repeat(64),
          rawTradeV4Budget: budget,
        })).rejects.toMatchObject({ code: 'SOURCE_CHANGED' } as BacktestTimelineSourceError);
      } finally { vi.unstubAllGlobals(); }

      await expect(readVerifiedRawTradeSnapshotV4ForRun({
        runId: runs[0].id, symbol, startTimeMs, endTimeMs,
        budget: { ...budget, maxZipBytes: zipBytes.length - 1 },
      })).rejects.toThrow('BACKTEST_RAW_SOURCE_LIMIT');
      await expect(readVerifiedRawTradeSnapshotV4ForRun({
        runId: randomUUID(), symbol, startTimeMs, endTimeMs, budget,
      })).rejects.toThrow('BACKTEST_RAW_SOURCE_SNAPSHOT_MISSING');
      await expect(readVerifiedRawTradeSnapshotV4ForRun({
        runId: runs[0].id, symbol, startTimeMs, endTimeMs, budget,
        expectedDigest: '',
      })).rejects.toThrow('BACKTEST_RAW_SOURCE_DIGEST_INVALID');
      const changed = new Uint8Array(zipBytes);
      changed[100] ^= 1;
      await expect(saveVerifiedRawTradeSnapshotV4ForRun({
        ...source, zipBytes: changed, runId: runs[0].id,
        executionToken: tokens[0]!,
      })).rejects.toThrow('BACKTEST_RAW_SOURCE_SOURCE_CHANGED');
      await prisma.backtestIntrabarArchive.update({
        where: { runId_symbol: { runId: runs[0].id, symbol } },
        data: { payload: { ...snapshots[0], tapeSha256: '0'.repeat(64) } },
      });
      await expect(readVerifiedRawTradeSnapshotV4ForRun({
        runId: runs[0].id, symbol, startTimeMs, endTimeMs, budget,
      })).rejects.toThrow('BACKTEST_RAW_SOURCE_SNAPSHOT_CHANGED');
      await prisma.backtestRawTradeSourceRef.delete({
        where: { runId_symbol_day: { runId: runs[1].id, symbol, day } },
      });
      await expect(readVerifiedRawTradeSnapshotV4ForRun({
        runId: runs[1].id, symbol, startTimeMs, endTimeMs, budget,
      })).rejects.toThrow('BACKTEST_RAW_SOURCE_MISSING');
      for (const run of runs) {
        expect(await prisma.backtestReport.count({
          where: { backtestRunId: run.id } })).toBe(0);
        expect(await prisma.backtestTrade.count({
          where: { backtestRunId: run.id } })).toBe(0);
      }
    }, 240_000);
});
