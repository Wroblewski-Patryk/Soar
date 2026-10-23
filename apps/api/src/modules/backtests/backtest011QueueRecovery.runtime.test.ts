import { randomUUID } from 'node:crypto';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { resolve } from 'node:path';
import { Prisma } from '@prisma/client';
import { createClient } from 'redis';
import { describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import { evaluateStrategySignalAtIndex,
  parseStrategySignalRules } from '../engine/strategySignalEvaluator';
import { readVerifiedRunArchive } from './backtestBinanceFuturesIntrabarArchive';
import { marketSequenceStrategyConfig } from './backtest011aMarketWitness.config';
import { BACKTEST_LEASE_MS } from './backtestRunOwnership.repository';
import { backtestRunQueue, createRun, getRunTimeline } from './backtests.service';
import { deleteOwnedBacktestRunCascade } from './backtests.repository';
import { GetBacktestTimelineQuerySchema } from './backtests.types';

const start = Date.parse('2026-10-18T02:41:00.000Z');
const end = start + 100 * 60_000;
const digest = '506d8d6a1032cc955e5cf6b4232120aadb918217bb7107af8f8061e6609ec2a8';
const zipSha = '4d0a9b007ae6b7a94073680ab37a968bb592c4529bffec1d68de8ef8f9db151b';
const config = { ...marketSequenceStrategyConfig,
  open: { ...marketSequenceStrategyConfig.open,
    indicatorsLong: [{ name: 'MOMENTUM', condition: '<',
      value: -0.00015000000000001124, params: { period: 2 } }] } };

const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));
const until = async (predicate: () => Promise<boolean>, timeoutMs: number) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await predicate()) return;
    await sleep(250);
  }
  throw new Error('011 queue recovery timed out');
};

type ProofProcess = { child: ChildProcessWithoutNullStreams; events: string[];
  times: Map<string, number>; waitFor: (prefix: string, timeoutMs: number) => Promise<string> };
const startWorker = (runId: string, role: 'hold' | 'resume'): ProofProcess => {
  const child = spawn(process.execPath, ['--import', 'tsx',
    resolve(process.cwd(), 'src/modules/backtests/backtest011QueueRecovery.worker.ts'),
  ], { cwd: process.cwd(), env: { ...process.env,
    SOAR_011_QUEUE_PROOF: '1', SOAR_011_QUEUE_RUN_ID: runId,
    SOAR_011_QUEUE_ROLE: role }, stdio: ['pipe', 'pipe', 'pipe'] });
  const events: string[] = [];
  const times = new Map<string, number>();
  let buffer = '';
  child.stdout.on('data', (chunk: Buffer) => {
    buffer += chunk.toString();
    while (buffer.includes('\n')) {
      const at = buffer.indexOf('\n');
      const event = buffer.slice(0, at).trim();
      events.push(event);
      times.set(event, Date.now());
      buffer = buffer.slice(at + 1);
    }
  });
  child.stderr.on('data', (chunk: Buffer) => events.push(`STDERR:${chunk.toString().trim()}`));
  return { child, events, times, waitFor: async (prefix, timeoutMs) => {
    await until(async () => {
      if (events.some((event) => event.startsWith(prefix))) return true;
      if (child.exitCode !== null || child.signalCode !== null)
        throw new Error(`Worker exited early: ${events.join(' | ')}`);
      return false;
    }, timeoutMs);
    return events.find((event) => event.startsWith(prefix))!;
  } };
};

const killOwnedWorker = async (proof: ProofProcess) => {
  if (proof.child.exitCode !== null || proof.child.signalCode !== null) return;
  await new Promise<void>((done, reject) => {
    const timer = setTimeout(() => reject(new Error('Own worker did not stop')), 5_000);
    proof.child.once('close', () => { clearTimeout(timer); done(); });
    if (!proof.child.kill('SIGKILL')) {
      clearTimeout(timer);
      reject(new Error('Could not kill own proof worker'));
    }
  });
};

type Variant = 'natural' | 'changed' | 'missing';
const runCase = async (variant: Variant) => {
  const db = new URL(process.env.DATABASE_URL ?? '');
  const redisUrl = new URL(process.env.REDIS_URL ?? '');
  const queueName = process.env.WORKER_BACKTEST_QUEUE ?? '';
  if (db.hostname !== '127.0.0.1' || db.port === '5432' ||
      db.pathname !== '/soar_011_queue_recovery_test' ||
      redisUrl.hostname !== '127.0.0.1' || redisUrl.port === '6379' ||
      process.env.WORKER_BACKTEST_OWNERSHIP !== 'worker' ||
      !queueName.startsWith('backtest-011-queue-') ||
      BACKTEST_LEASE_MS !== 600_000)
    throw new Error('Requires own _test, Redis, queue and default lease');
  const redis = createClient({ url: redisUrl.toString() });
  const pendingKey = `soar:queue:${queueName}:pending`;
  const processingKey = `soar:queue:${queueName}:processing`;
  const dedupeKey = `soar:queue:${queueName}:dedupe`;
  const workers: ProofProcess[] = [];
  let userId: string | null = null;
  let strategyId: string | null = null;
  let runId: string | null = null;
  try {
    await redis.connect();
    const user = await prisma.user.create({ data: {
      email: `011-queue-${variant}-${randomUUID()}@example.test`, password: 'local-only',
    } });
    userId = user.id;
    const strategy = await prisma.strategy.create({ data: { userId,
      name: '011 source signal loss', interval: '1m', leverage: 1,
      walletRisk: 10, config } });
    strategyId = strategy.id;
    const run = await createRun(userId, { name: `011 queue ${variant}`,
      symbol: 'ALICEUSDT', timeframe: '1m', strategyId,
      startAt: new Date(start), endAt: new Date(end),
      seedConfig: { maxCandles: 100, initialBalance: 1_000,
        feeRate: 0.0004, slippageRate: 0,
        intrabarSource: 'BINANCE_USDM_AGGTRADES_REQUIRED' } });
    if (!run) throw new Error('createRun returned null');
    runId = run.id;
    expect(await redis.lRange(pendingKey, 0, -1)).toEqual([runId]);
    const first = startWorker(runId, 'hold');
    workers.push(first);
    const marker = await first.waitFor('SOURCE_DCA_CONFIRMED ', 90_000);
    expect(marker).toBe(`SOURCE_DCA_CONFIRMED ${first.child.pid}`);
    expect(first.events.filter((event) => event === 'ARCHIVE_CHECKSUM_FETCH')).toHaveLength(1);
    expect(first.events.filter((event) => event === 'ARCHIVE_ZIP_FETCH')).toHaveLength(1);
    expect(first.events.filter((event) => event === 'SIMULATE')).toHaveLength(1);
    const held = await prisma.backtestRun.findUniqueOrThrow({ where: { id: runId } });
    const reportBefore = await prisma.backtestReport.findUniqueOrThrow({
      where: { backtestRunId: runId },
    });
    const archived = await prisma.backtestIntrabarArchive.findUniqueOrThrow({
      where: { runId_symbol: { runId, symbol: 'ALICEUSDT' } },
    });
    const savedTape = await readVerifiedRunArchive(runId, 'ALICEUSDT', start, end);
    expect(savedTape).not.toBeNull();
    expect(savedTape![5].intrabarTicks.find((tick) => tick.sequenceId === 167049972))
      .toMatchObject({ eventTime: Date.parse('2026-10-18T02:46:47.639Z'), price: 0.1454 });
    expect(savedTape![5].intrabarTicks.find((tick) => tick.sequenceId === 167049975))
      .toBeDefined();
    expect(savedTape![5].intrabarTicks.find((tick) => tick.sequenceId === 167049977))
      .toMatchObject({ eventTime: Date.parse('2026-10-18T02:46:57.282Z'), price: 0.1454 });
    const rules = parseStrategySignalRules(config);
    if (!rules) throw new Error('Frozen witness rules missing');
    expect([0, 1, 2, 3, 4].map((index) =>
      evaluateStrategySignalAtIndex(rules, savedTape!, index, new Map())))
      .toEqual([null, null, 'LONG', null, null]);
    expect(held.status).toBe('RUNNING');
    expect(held.executionToken).toBeTruthy();
    expect(held.executionLeaseExpiresAt?.getTime()).toBeGreaterThan(Date.now());
    expect((held.seedConfig as Record<string, any>).intrabarSourceDigestBySymbol.ALICEUSDT)
      .toBe(digest);
    expect((archived.payload as Record<string, unknown>).version).toBe(3);
    expect((archived.payload as { archives: Array<{ zipSha256: string }> })
      .archives[0].zipSha256).toBe(zipSha);
    expect(await prisma.backtestTrade.count({ where: { backtestRunId: runId } })).toBe(0);
    expect(await prisma.backtestContribution.count({ where: { backtestRunId: runId } })).toBe(0);
    expect(await redis.lRange(processingKey, 0, -1)).toEqual([runId]);
    expect(await redis.sIsMember(dedupeKey, runId)).toBe(true);
    const expiresAt = held.executionLeaseExpiresAt!.getTime();
    await killOwnedWorker(first);
    expect(first.child.signalCode).toBe('SIGKILL');
    if (variant === 'changed') {
      await prisma.backtestIntrabarArchive.update({
        where: { runId_symbol: { runId, symbol: 'ALICEUSDT' } },
        data: { payload: { ...(archived.payload as Record<string, unknown>),
          archives: [{ ...((archived.payload as { archives: Record<string, unknown>[] })
            .archives[0]), zipSha256: '0'.repeat(64) }],
        } as Prisma.InputJsonValue },
      });
    } else if (variant === 'missing') {
      await prisma.backtestIntrabarArchive.delete({
        where: { runId_symbol: { runId, symbol: 'ALICEUSDT' } },
      });
    }
    if (variant !== 'natural') {
      // Shorten only the disposable failure variants; the success path waits full TTL.
      await prisma.backtestRun.update({ where: { id: runId }, data: {
        executionLeaseExpiresAt: new Date(Date.now() - 1_000),
      } });
    }
    const second = startWorker(runId, 'resume');
    workers.push(second);
    await second.waitFor('READY', 15_000);
    expect(second.child.pid).not.toBe(first.child.pid);
    if (variant === 'natural') {
      await sleep(1_000);
      expect(second.events).not.toContain('JOB_INVOKED');
      expect((await prisma.backtestRun.findUniqueOrThrow({ where: { id: runId } }))
        .executionToken).toBe(held.executionToken);
    }
    await second.waitFor('JOB_RETURNED', variant === 'natural'
      ? BACKTEST_LEASE_MS + 120_000 : 60_000);
    await until(async () => (await redis.lRange(pendingKey, 0, -1)).length === 0 &&
      (await redis.lRange(processingKey, 0, -1)).length === 0 &&
      !(await redis.sIsMember(dedupeKey, runId!)), 30_000);
    expect(second.events.filter((event) => event === 'JOB_INVOKED')).toHaveLength(1);
    expect(second.events).not.toContain('ARCHIVE_ZIP_FETCH');
    expect(second.events).not.toContain('ARCHIVE_CHECKSUM_FETCH');
    if (variant === 'natural')
      expect(second.times.get('JOB_INVOKED')).toBeGreaterThanOrEqual(expiresAt);
    const final = await prisma.backtestRun.findUniqueOrThrow({ where: { id: runId } });
    const report = await prisma.backtestReport.findUniqueOrThrow({
      where: { backtestRunId: runId },
    });
    const trades = await prisma.backtestTrade.findMany({ where: { backtestRunId: runId } });
    const contributions = await prisma.backtestContribution.findMany({
      where: { backtestRunId: runId },
    });
    expect(final.id).toBe(held.id);
    expect(final.executionToken).toBeNull();
    expect(report.id).toBe(reportBefore.id);
    expect(await prisma.backtestRun.count({ where: { userId } })).toBe(1);
    expect(await prisma.backtestReport.count({ where: { backtestRunId: runId } })).toBe(1);
    if (variant === 'natural') {
      expect(final.status).toBe('COMPLETED');
      expect(second.events.filter((event) => event === 'SIMULATE')).toHaveLength(1);
      expect(await prisma.backtestIntrabarArchive.findUniqueOrThrow({
        where: { runId_symbol: { runId, symbol: 'ALICEUSDT' } },
      })).toMatchObject({ runId: archived.runId, symbol: archived.symbol,
        payloadSha256: archived.payloadSha256 });
      expect(trades).toHaveLength(6);
      expect(report.totalTrades).toBe(6);
      expect(report.netPnl).toBeCloseTo(0.01386, 5);
      expect(report.netPnl).toBeCloseTo(trades.reduce((sum, trade) =>
        sum + (trade.pnl ?? 0), 0), 6);
      const timeline = await getRunTimeline(userId, runId,
        GetBacktestTimelineQuerySchema.parse({ symbol: 'ALICEUSDT' }));
      expect(timeline?.events.some((event) => event.type === 'DCA' &&
        event.timestamp === '2026-10-18T02:46:47.639Z')).toBe(true);
      expect(timeline?.events.some((event) => event.type === 'TTP' &&
        event.timestamp === '2026-10-18T02:46:57.282Z')).toBe(true);
      expect(contributions.filter((item) => item.kind === 'DCA').length).toBeGreaterThan(0);
    } else {
      expect(final.status).toBe('FAILED');
      expect((final.seedConfig as Record<string, any>).error).toContain(
        variant === 'changed' ? 'BACKTEST_INTRABAR_ARCHIVE_SNAPSHOT_CHANGED' :
          'BACKTEST_INTRABAR_ARCHIVE_SNAPSHOT_MISSING_ON_RETRY');
      expect(second.events).not.toContain('SIMULATE');
      expect(trades).toHaveLength(0);
      expect(contributions).toHaveLength(0);
      expect(report.netPnl).toBeNull();
    }
  } finally {
    for (const worker of workers) await killOwnedWorker(worker);
    await backtestRunQueue.stopWorker();
    if (redis.isOpen) {
      await redis.del([pendingKey, processingKey, dedupeKey]);
      await redis.quit();
    }
    if (userId && runId) await deleteOwnedBacktestRunCascade(userId, runId);
    if (strategyId) await prisma.strategy.delete({ where: { id: strategyId } });
    if (userId) await prisma.user.delete({ where: { id: userId } });
  }
};

const proofIt = process.env.RUN_011_BACKTEST_QUEUE_RECOVERY_PROOF === '1' ? it : it.skip;
describe('011 real source BACKTEST queue recovery', () => {
  proofIt('natural lease recovers the same run after source DCA',
    async () => runCase('natural'), BACKTEST_LEASE_MS + 210_000);
  proofIt.each(['changed', 'missing'] as const)(
    'fails closed on %s archived source after crash',
    async (variant) => runCase(variant), 120_000);
});
