import { createHash, randomUUID } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import { fetchVerifiedDailyUsdMArchive,
  readVerifiedRunArchive } from './backtestBinanceFuturesIntrabarArchive';

const stable = (value: unknown): string => {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value !== null && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) =>
      `${JSON.stringify(key)}:${stable(record[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
};
const fetchCandles = async (start: number, count: number) => {
  const response = await fetch(
    `https://fapi.binance.com/fapi/v1/klines?symbol=ALICEUSDT&interval=1m` +
    `&startTime=${start}&endTime=${start + count * 60_000 - 1}&limit=${count}`,
    { signal: AbortSignal.timeout(20_000) });
  expect(response.ok).toBe(true);
  const rows = await response.json() as Array<Array<string | number>>;
  expect(rows).toHaveLength(count);
  return rows.map((row) => ({
    openTime: Number(row[0]), closeTime: Number(row[6]),
    open: Number(row[1]), high: Number(row[2]), low: Number(row[3]),
    close: Number(row[4]), volume: Number(row[5]),
  }));
};

const runtimeIt = process.env.RUN_BACKTEST_RAW_ARCHIVE_LEGACY_PROOF === '1'
  ? it : it.skip;
describe('additive raw-archive migration', () => {
  runtimeIt('replays stored v1/v2 rows as legacy without raw bytes', async () => {
    const db = new URL(process.env.DATABASE_URL ?? '');
    if (db.pathname.slice(1) !== 'soar_011a_archived_process_test' ||
        db.hostname !== '127.0.0.1' || !db.port || db.port === '5432')
      throw new Error('Requires the dedicated isolated archive test database');
    const user = await prisma.user.create({ data: {
      email: `archive-legacy-${randomUUID()}@example.test`,
      password: 'local-test-only',
    } });
    const runIds: string[] = [];
    try {
      for (const [windowStart, count, version] of [
        [Date.parse('2026-10-18T00:02:00.000Z'), 2, 1],
        [Date.parse('2026-10-17T23:50:00.000Z'), 20, 2],
      ] as const) {
        const candles = await fetchCandles(windowStart, count);
        const { snapshot } = await fetchVerifiedDailyUsdMArchive({
          symbol: 'ALICEUSDT', candles,
        });
        const legacy = version === 1
          ? { version: 1, symbol: snapshot.symbol,
              day: snapshot.archives[0].day,
              archiveUrl: snapshot.archives[0].archiveUrl,
              zipSha256: snapshot.archives[0].zipSha256,
              startTimeMs: snapshot.startTimeMs, endTimeMs: snapshot.endTimeMs,
              candles: snapshot.candles, rows: snapshot.rows }
          : { version: 2, symbol: snapshot.symbol,
              archives: snapshot.archives.map(({ day, archiveUrl, zipSha256 }) =>
                ({ day, archiveUrl, zipSha256 })),
              startTimeMs: snapshot.startTimeMs, endTimeMs: snapshot.endTimeMs,
              candles: snapshot.candles, rows: snapshot.rows };
        const run = await prisma.backtestRun.create({ data: {
          userId: user.id, name: `Legacy archive v${version}`,
          symbol: 'ALICEUSDT', timeframe: '1m',
        } });
        runIds.push(run.id);
        await prisma.backtestIntrabarArchive.create({ data: {
          runId: run.id, symbol: 'ALICEUSDT',
          payload: legacy as Prisma.InputJsonValue,
          payloadSha256: createHash('sha256').update(stable(legacy)).digest('hex'),
        } });
        const replay = await readVerifiedRunArchive(run.id, 'ALICEUSDT',
          snapshot.startTimeMs, snapshot.endTimeMs);
        expect(replay).toHaveLength(count);
        expect(replay?.every((candle) => candle.intrabarProvenance.archiveProof ===
          'LEGACY_SNAPSHOT')).toBe(true);
        expect(await prisma.backtestIntrabarArchiveRaw.count({
          where: { runId: run.id },
        })).toBe(0);
      }
    } finally {
      for (const runId of runIds)
        await prisma.backtestRun.delete({ where: { id: runId } });
      await prisma.user.delete({ where: { id: user.id } });
    }
  }, 90_000);
});
