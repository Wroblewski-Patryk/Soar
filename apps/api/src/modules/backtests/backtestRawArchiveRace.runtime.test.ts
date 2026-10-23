import { createHash, randomUUID } from 'node:crypto';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { resolve } from 'node:path';
import { createClient } from 'redis';
import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../../prisma/client';
import { digestVerifiedBinanceFuturesIntrabar } from './backtestBinanceFuturesIntrabarSource';
import { readVerifiedRunArchive } from './backtestBinanceFuturesIntrabarArchive';
import { claimBacktestRun } from './backtestRunOwnership.repository';

type Event = { name: string; value: {
  pid?: number; digest?: string; proof?: string; zipShas?: string[]; message?: string;
} };
type Worker = { child: ChildProcessWithoutNullStreams; events: Event[] };
const start = Date.parse('2020-01-01T23:58:00.000Z');
const sleep = (ms: number) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
const until = async (predicate: () => boolean, workers: Worker[], timeoutMs = 20_000) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (predicate()) return;
    const failed = workers.find((worker) => (worker.child.exitCode !== null ||
      worker.child.signalCode !== null) &&
      !event(worker, 'RESULT') && !event(worker, 'ERROR'));
    if (failed) throw new Error(`Worker exited early: ${JSON.stringify(failed.events)}`);
    await sleep(20);
  }
  throw new Error(`Race worker timeout: ${JSON.stringify(workers.map((worker) => worker.events))}`);
};
const event = (worker: Worker, name: string) =>
  worker.events.find((item) => item.name === name)?.value;
const startWorker = (runId: string,
  variant: 'same' | 'changed' | 'bad-checksum',
  role: 'save' | 'save-hold' | 'offline-retry', executionToken: string): Worker => {
  const child = spawn(process.execPath, ['--import', 'tsx',
    resolve(process.cwd(), 'src/modules/backtests/backtestRawArchiveRaceProof.worker.ts'),
  ], { cwd: process.cwd(), env: { ...process.env, SOAR_RAW_RACE_PROOF: '1',
    SOAR_RAW_RACE_RUN_ID: runId, SOAR_RAW_RACE_VARIANT: variant,
    SOAR_RAW_RACE_ROLE: role, SOAR_RAW_RACE_TOKEN: executionToken },
    stdio: ['pipe', 'pipe', 'pipe'] });
  const events: Event[] = [];
  let buffer = '';
  child.stdout.on('data', (chunk: Buffer) => {
    buffer += chunk.toString();
    while (buffer.includes('\n')) {
      const at = buffer.indexOf('\n');
      const line = buffer.slice(0, at);
      buffer = buffer.slice(at + 1);
      const space = line.indexOf(' ');
      const name = line.slice(0, space);
      if (['READY', 'RESULT', 'ERROR', 'OFFLINE_READ', 'SAVED_HOLD'].includes(name))
        events.push({ name, value: JSON.parse(line.slice(space + 1)) });
      else if (line) events.push({ name: 'LOG', value: { message: line } });
    }
  });
  child.stderr.on('data', (chunk: Buffer) => events.push({
    name: 'STDERR', value: { message: chunk.toString() },
  }));
  return { child, events };
};
const killWorker = async (worker: Worker) => {
  if (worker.child.exitCode !== null || worker.child.signalCode !== null) return;
  const closed = new Promise<void>((resolveClose) => worker.child.once('close', () => resolveClose()));
  if (!worker.child.kill('SIGKILL')) throw new Error('SIGKILL failed');
  await closed;
};
const verifyCanonical = async (runId: string, expected: NonNullable<ReturnType<typeof event>>) => {
  const records = await prisma.backtestIntrabarArchive.findMany({
    where: { runId }, include: { rawArchives: { orderBy: { day: 'asc' } } },
  });
  expect(records).toHaveLength(1);
  const record = records[0];
  expect(record.symbol).toBe('BTCUSDT');
  expect(record.rawArchives).toHaveLength(2);
  const payload = record.payload as { version: number;
    archives: Array<{ day: string; zipSha256: string; checksumSha256: string }> };
  expect(payload.version).toBe(3);
  expect(payload.archives.map((archive) => archive.zipSha256)).toEqual(expected.zipShas);
  expect(record.rawArchives.map((raw) => raw.day)).toEqual(['2020-01-01', '2020-01-02']);
  for (const [index, raw] of record.rawArchives.entries()) {
    expect(createHash('sha256').update(raw.zipBytes).digest('hex'))
      .toBe(payload.archives[index].zipSha256);
    expect(createHash('sha256').update(raw.checksumBytes).digest('hex'))
      .toBe(payload.archives[index].checksumSha256);
  }
  vi.stubGlobal('fetch', vi.fn(() => { throw new Error('NETWORK_FORBIDDEN'); }));
  try {
    const replay = await readVerifiedRunArchive(runId, 'BTCUSDT', start,
      start + 4 * 60_000);
    expect(replay?.[0].intrabarProvenance.archiveProof)
      .toBe('PERSISTED_CHECKSUM_REVERIFIED');
    expect(digestVerifiedBinanceFuturesIntrabar(replay!, 'BTCUSDT'))
      .toBe(expected.digest);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  } finally { vi.unstubAllGlobals(); }
  const run = await prisma.backtestRun.findUniqueOrThrow({ where: { id: runId } });
  expect(run.status).toBe('RUNNING');
  expect(await prisma.backtestTrade.count({ where: { backtestRunId: runId } })).toBe(0);
  expect(await prisma.backtestContribution.count({ where: { backtestRunId: runId } })).toBe(0);
  expect(await prisma.backtestReport.count({ where: { backtestRunId: runId } })).toBe(0);
};

const runtimeIt = process.env.RUN_BACKTEST_RAW_ARCHIVE_RACE_PROOF === '1' ? it : it.skip;
describe('raw v3 concurrent process race', () => {
  runtimeIt('keeps one atomic winner, rejects source conflicts and recovers offline after SIGKILL',
    async () => {
      const db = new URL(process.env.DATABASE_URL ?? '');
      const redisUrl = new URL(process.env.REDIS_URL ?? '');
      if (db.pathname.slice(1) !== 'soar_011a_raw_race_test' ||
          db.hostname !== '127.0.0.1' || !db.port || db.port === '5432' ||
          redisUrl.hostname !== '127.0.0.1' || !redisUrl.port || redisUrl.port === '6379')
        throw new Error('Requires dedicated local PostgreSQL _test and Redis');
      const redis = createClient({ url: redisUrl.toString() });
      const workers: Worker[] = [];
      const runIds: string[] = [];
      const tokens = new Map<string, string>();
      let userId: string | null = null;
      try {
        await redis.connect();
        expect(await redis.dbSize()).toBe(0);
        const user = await prisma.user.create({ data: {
          email: `raw-race-${randomUUID()}@example.test`, password: 'local-test-only',
        } });
        userId = user.id;
        const newRun = async () => {
          const run = await prisma.backtestRun.create({ data: {
            userId: user.id, name: 'Raw race process proof',
            symbol: 'BTCUSDT', timeframe: '1m',
          } });
          runIds.push(run.id);
          const token = await claimBacktestRun(run.id);
          if (!token) throw new Error('Could not claim disposable race run');
          tokens.set(run.id, token);
          return run.id;
        };
        const spawnFor = (runId: string,
          variant: 'same' | 'changed' | 'bad-checksum',
          role: 'save' | 'save-hold' | 'offline-retry',
          token = tokens.get(runId)!) => startWorker(runId, variant, role, token);
        const race = async (runId: string,
          variants: Array<'same' | 'changed'>) => {
          const pair = variants.map((variant) => {
            const worker = spawnFor(runId, variant, 'save');
            workers.push(worker);
            return worker;
          });
          await until(() => pair.every((worker) => !!event(worker, 'READY')), pair);
          expect(new Set(pair.map((worker) => event(worker, 'READY')?.pid)).size).toBe(2);
          for (const worker of pair) worker.child.stdin.write('GO\n');
          await until(() => pair.every((worker) =>
            !!event(worker, 'RESULT') || !!event(worker, 'ERROR')), pair);
          return pair;
        };

        const identical = await race(await newRun(), ['same', 'same']);
        expect(identical.map((worker) => event(worker, 'RESULT')).every(Boolean)).toBe(true);
        expect(identical.map((worker) => event(worker, 'RESULT')?.digest))
          .toEqual([event(identical[0], 'READY')?.digest,
            event(identical[1], 'READY')?.digest]);
        await verifyCanonical(runIds[0], event(identical[0], 'RESULT')!);

        const different = await race(await newRun(), ['same', 'changed']);
        const winner = different.find((worker) => event(worker, 'RESULT'));
        const loser = different.find((worker) => event(worker, 'ERROR'));
        expect(winner).toBeDefined();
        expect(loser).toBeDefined();
        expect(event(loser!, 'ERROR')?.message)
          .toBe('BACKTEST_INTRABAR_ARCHIVE_SOURCE_CHANGED_ON_RETRY');
        expect(event(different[0], 'READY')?.zipShas)
          .not.toEqual(event(different[1], 'READY')?.zipShas);
        await verifyCanonical(runIds[1], event(winner!, 'RESULT')!);

        const corruptRun = await newRun();
        const good = spawnFor(corruptRun, 'same', 'save');
        const bad = spawnFor(corruptRun, 'bad-checksum', 'save');
        workers.push(good, bad);
        await until(() => !!event(good, 'READY') && !!event(bad, 'ERROR'),
          [good, bad]);
        expect(event(bad, 'ERROR')?.message)
          .toBe('BACKTEST_INTRABAR_ARCHIVE_CHECKSUM_MISMATCH');
        expect(await prisma.backtestIntrabarArchive.count({ where: { runId: corruptRun } }))
          .toBe(0);
        expect(await prisma.backtestIntrabarArchiveRaw.count({ where: { runId: corruptRun } }))
          .toBe(0);
        good.child.stdin.write('GO\n');
        await until(() => !!event(good, 'RESULT'), [good]);
        await verifyCanonical(corruptRun, event(good, 'RESULT')!);

        const staleRun = await newRun();
        const stale = spawnFor(staleRun, 'changed', 'save');
        workers.push(stale);
        await until(() => !!event(stale, 'READY'), [stale]);
        await prisma.backtestRun.update({ where: { id: staleRun },
          data: { executionLeaseExpiresAt: new Date(Date.now() - 1_000) } });
        const freshToken = await claimBacktestRun(staleRun);
        expect(freshToken).toBeTruthy();
        const fresh = spawnFor(staleRun, 'same', 'save', freshToken!);
        workers.push(fresh);
        await until(() => !!event(fresh, 'READY'), [fresh]);
        stale.child.stdin.write('GO\n');
        fresh.child.stdin.write('GO\n');
        await until(() => !!event(stale, 'ERROR') && !!event(fresh, 'RESULT'),
          [stale, fresh]);
        expect(event(stale, 'ERROR')?.message)
          .toBe('BACKTEST_INTRABAR_ARCHIVE_CLAIM_LOST');
        await verifyCanonical(staleRun, event(fresh, 'RESULT')!);

        const killRun = await newRun();
        const held = spawnFor(killRun, 'same', 'save-hold');
        workers.push(held);
        await until(() => !!event(held, 'READY'), [held]);
        held.child.stdin.write('GO\n');
        await until(() => !!event(held, 'SAVED_HOLD'), [held]);
        await killWorker(held);
        await prisma.backtestRun.update({ where: { id: killRun },
          data: { executionLeaseExpiresAt: new Date(Date.now() - 1_000) } });
        const retryToken = await claimBacktestRun(killRun);
        expect(retryToken).toBeTruthy();
        const retried = spawnFor(killRun, 'same', 'offline-retry', retryToken!);
        workers.push(retried);
        await until(() => !!event(retried, 'OFFLINE_READ') &&
          !!event(retried, 'READY'), [retried]);
        retried.child.stdin.write('GO\n');
        await until(() => !!event(retried, 'RESULT'), [retried]);
        expect(event(retried, 'OFFLINE_READ')?.digest)
          .toBe(event(held, 'SAVED_HOLD')?.digest);
        await verifyCanonical(killRun, event(held, 'SAVED_HOLD')!);
        expect(await redis.dbSize()).toBe(0);
        process.stdout.write(`RAW_RACE_PROOF ${JSON.stringify({
          identicalPids: identical.map((worker) => event(worker, 'READY')?.pid),
          differentPids: different.map((worker) => event(worker, 'READY')?.pid),
          winnerPid: event(winner!, 'RESULT')?.pid,
          conflict: event(loser!, 'ERROR')?.message,
          corrupt: event(bad, 'ERROR')?.message,
          stalePid: event(stale, 'ERROR')?.pid,
          staleFence: event(stale, 'ERROR')?.message,
          takeoverPid: event(fresh, 'RESULT')?.pid,
          killedPid: event(held, 'SAVED_HOLD')?.pid,
          retryPid: event(retried, 'RESULT')?.pid,
          offlineDigest: event(retried, 'OFFLINE_READ')?.digest,
          persistedProof: event(retried, 'OFFLINE_READ')?.proof,
          canonicalPairs: runIds.length, rawPerPair: 2, redisKeys: await redis.dbSize(),
        })}\n`);
      } finally {
        for (const worker of workers) await killWorker(worker);
        if (runIds.length) await prisma.backtestRun.deleteMany({
          where: { id: { in: runIds } },
        });
        if (userId) await prisma.user.delete({ where: { id: userId } });
        if (redis.isOpen) await redis.quit();
      }
    }, 120_000);
});
