import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from 'redis';
import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../../prisma/client';
import { claimBacktestRun } from './backtestRunOwnership.repository';
import { verifyBinanceUsdMRawTradeSource, type RawTradeBudget,
  type RawTradeCandle } from './backtestRawTradeSource';
import { persistVerifiedRawTradeSourceForRun,
  readVerifiedRawTradeSourceForRun } from './backtestRawTradeSource.repository';

const runtimeIt = process.env.RUN_011A_RAW_FOUNDATION_PROOF === '1' ? it : it.skip;
const symbol = 'ETHUSDT';
const day = '2026-10-18';
const sha = '8fbf2b1aa01570d117bd53f8c69457e694ee1d8d7e6cbb5f76fdbaf261e2dcb7';
const budget: RawTradeBudget = {
  maxZipBytes: 29_176_827, maxCsvBytes: 178_044_910,
  maxSelectedTrades: 199_234, maxElapsedMs: 120_000,
};

describe('011A official raw trade foundation (opt-in, isolated DB and Redis)', () => {
  runtimeIt('verifies 120 official candles, shares one immutable blob across two runs and replays offline',
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
      const verified = await verifyBinanceUsdMRawTradeSource(source);
      expect(verified.zipSha256).toBe(sha);
      expect(verified.csvBytes).toBe(178_044_910);
      expect(verified.selectedTradeCount).toBe(199_234);
      expect(verified.observed[14].lastTradeId).toBe(8_867_044_764);
      expect(verified.observed[15].firstTradeId).toBe(8_867_044_765);
      expect(verified.observed.map((value) => value.tradeCount))
        .toEqual(candles.map((value) => value.tradeCount));

      await expect(verifyBinanceUsdMRawTradeSource({ ...source,
        zipBytes: undefined })).rejects.toThrow('BACKTEST_RAW_SOURCE_MISSING');
      await expect(verifyBinanceUsdMRawTradeSource({ ...source,
        budget: { ...budget, maxZipBytes: zipBytes.length - 1 } }))
        .rejects.toThrow('BACKTEST_RAW_SOURCE_LIMIT');
      const changed = new Uint8Array(zipBytes);
      changed[100] ^= 1;
      await expect(verifyBinanceUsdMRawTradeSource({ ...source,
        zipBytes: changed })).rejects.toThrow('BACKTEST_RAW_SOURCE_SOURCE_CHANGED');

      const redis = createClient({ url: redisUrl.toString() });
      await redis.connect();
      try { expect(await redis.dbSize()).toBe(0); }
      finally { await redis.quit(); }

      const user = await prisma.user.create({ data: {
        email: `raw-foundation-${randomUUID()}@example.test`,
        password: 'local-test-only',
      } });
      const runs = await Promise.all([0, 1].map((index) =>
        prisma.backtestRun.create({ data: {
          userId: user.id, name: `Raw foundation ${index}`,
          symbol, timeframe: '1m',
        } })));
      const tokens = await Promise.all(runs.map((run) => claimBacktestRun(run.id)));
      expect(tokens.every(Boolean).valueOf()).toBe(true);
      for (const [index, run] of runs.entries()) {
        const result = await persistVerifiedRawTradeSourceForRun({
          ...source, runId: run.id, executionToken: tokens[index]!,
        });
        expect(result.tapeSha256).toBe(verified.tapeSha256);
      }
      const retry = await persistVerifiedRawTradeSourceForRun({
        ...source, runId: runs[0].id, executionToken: tokens[0]!,
      });
      expect(retry.tapeSha256).toBe(verified.tapeSha256);
      await expect(persistVerifiedRawTradeSourceForRun({
        ...source, runId: runs[0].id, executionToken: randomUUID(),
      })).rejects.toThrow('BACKTEST_RAW_SOURCE_CLAIM_LOST');
      expect(await prisma.backtestRawTradeSourceBlob.count({
        where: { zipSha256: sha } })).toBe(1);
      expect(await prisma.backtestRawTradeSourceRef.count({
        where: { runId: { in: runs.map((run) => run.id) } } })).toBe(2);
      vi.stubGlobal('fetch', vi.fn(() => { throw new Error('NETWORK_FORBIDDEN'); }));
      try {
        for (const run of runs) {
          const replay = await readVerifiedRawTradeSourceForRun({
            runId: run.id, symbol, day, budget,
          });
          expect(replay.tapeSha256).toBe(verified.tapeSha256);
        }
        expect(globalThis.fetch).not.toHaveBeenCalled();
      } finally { vi.unstubAllGlobals(); }
      await expect(readVerifiedRawTradeSourceForRun({
        runId: randomUUID(), symbol, day, budget,
      })).rejects.toThrow('BACKTEST_RAW_SOURCE_MISSING');
      await expect(prisma.$executeRaw`
        UPDATE "BacktestRawTradeSourceBlob" SET "csvBytes" = 1
        WHERE "zipSha256" = ${sha}`)
        .rejects.toThrow(/raw trade source is immutable/);
      for (const run of runs) {
        expect((await prisma.backtestRun.findUniqueOrThrow({
          where: { id: run.id },
        })).status).toBe('RUNNING');
        expect(await prisma.backtestReport.count({
          where: { backtestRunId: run.id },
        })).toBe(0);
      }
    }, 180_000);
});
