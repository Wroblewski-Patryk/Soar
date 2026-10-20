import { randomUUID } from 'node:crypto';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { existsSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';
import { describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import { BacktestRunQueue } from './backtestRunQueue';
import { commitClaimedBacktestRun, updateClaimedBacktestRun } from './backtestRunOwnership.repository';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const waitUntil = async (predicate: () => Promise<boolean>, timeoutMs = 15_000) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await predicate()) return;
    await wait(50);
  }
  throw new Error('Timed out waiting for backtest process proof');
};

type ProofProcess = {
  child: ChildProcessWithoutNullStreams;
  lines: string[];
  waitFor: (line: string) => Promise<void>;
};

const startProofProcess = (
  role: string, queueName: string, runIds: string[], releaseFile?: string,
  databaseUrl?: string,
): ProofProcess => {
  const child = spawn(process.execPath, [
    '--import', 'tsx',
    resolve(process.cwd(), 'src/modules/backtests/backtestProcessProof.worker.ts'),
  ], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      SOAR_BT_PROOF: '1',
      SOAR_BT_PROOF_ROLE: role,
      SOAR_BT_PROOF_QUEUE: queueName,
      SOAR_BT_PROOF_RUN_IDS: runIds.join(','),
      ...(releaseFile ? { SOAR_BT_PROOF_RELEASE_FILE: releaseFile } : {}),
      ...(databaseUrl ? { DATABASE_URL: databaseUrl } : {}),
      REDIS_URL: process.env.REDIS_URL ?? 'redis://127.0.0.1:6379',
    },
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  const lines: string[] = [];
  let output = '';
  child.stdout.on('data', (chunk: Buffer) => {
    output += chunk.toString();
    while (output.includes('\n')) {
      const end = output.indexOf('\n');
      lines.push(output.slice(0, end).trim());
      output = output.slice(end + 1);
    }
  });
  child.stderr.on('data', (chunk: Buffer) => lines.push(`STDERR:${chunk.toString().trim()}`));
  return {
    child,
    lines,
    waitFor: async (line) => {
      await waitUntil(async () => {
        if (lines.includes(line)) return true;
        if (child.exitCode !== null) throw new Error(`Worker exited early: ${lines.join(' | ')}`);
        return false;
      });
    },
  };
};

const runtimeIt = process.env.RUN_BACKTEST_PROCESS_PROOF === '1' ? it : it.skip;

type WaitingReportBackend = {
  pid: number;
  datname: string | null;
  application_name: string;
  query: string;
};

type TerminalCrashProbe = WaitingReportBackend & {
  query_start: Date | null;
  observed_at: Date;
  wait_event_type: string | null;
  wait_event: string | null;
  state: string;
};

const TERMINAL_LOCK_TIMEOUT_MS = 10_000;
const CRASH_BOUNDARY_MARGIN_MS = 1_000;

const requireCrashBeforeDbTimeout = (probe: TerminalCrashProbe, elapsedMs: number) => {
  if (probe.state !== 'active' || probe.wait_event_type !== 'Lock' ||
      probe.wait_event !== 'advisory' ||
      !probe.query_start || !Number.isFinite(elapsedMs) || elapsedMs < 0) {
    throw new Error('007F crash probe lacks an active advisory waiter or valid clock');
  }
  const queryStartMs = probe.query_start.getTime();
  const observedAtMs = probe.observed_at.getTime();
  if (!Number.isFinite(queryStartMs) || !Number.isFinite(observedAtMs) ||
      observedAtMs < queryStartMs) {
    throw new Error('007F crash probe has an invalid database time order');
  }
  // The trigger starts lock_timeout after the report SQL query_start. Using
  // query_start therefore gives an earlier, conservative timeout deadline.
  const remainingAtDbReadMs = queryStartMs + TERMINAL_LOCK_TIMEOUT_MS - observedAtMs;
  if (remainingAtDbReadMs <= elapsedMs + CRASH_BOUNDARY_MARGIN_MS) {
    throw new Error('007F DB timeout could precede the worker crash');
  }
};

const requireDbCloseBeforeTimeout = (probe: TerminalCrashProbe, dbAfterCloseAt: Date) => {
  if (!probe.query_start || !Number.isFinite(dbAfterCloseAt.getTime()) ||
      dbAfterCloseAt.getTime() < probe.observed_at.getTime() ||
      dbAfterCloseAt.getTime() + CRASH_BOUNDARY_MARGIN_MS >=
        probe.query_start.getTime() + TERMINAL_LOCK_TIMEOUT_MS) {
    throw new Error('007F database timeout could precede confirmed worker close');
  }
};

const isOwnedTerminalWaiter = (
  waiter: WaitingReportBackend, databaseName: string, applicationName: string,
) => waiter.datname === databaseName && waiter.application_name === applicationName &&
  waiter.query.includes('BacktestReport');

const requireOneOwnedTerminalWaiter = <T extends WaitingReportBackend>(
  waiters: T[], databaseName: string, applicationName: string,
): T => {
  const owned = waiters.filter((waiter) =>
    isOwnedTerminalWaiter(waiter, databaseName, applicationName));
  if (owned.length !== 1) {
    throw new Error(`Expected exactly one owned 007F report backend; found ${owned.length}`);
  }
  return owned[0];
};

const requireDedicated007fDatabase = () => {
  const databaseName = new URL(process.env.DATABASE_URL ?? '').pathname.slice(1);
  if (!/^soar_007f3(?:_[a-z0-9]+)*_test$/.test(databaseName)) {
    throw new Error('007F proof requires its own disposable soar_007f3 _test database');
  }
  return databaseName;
};

type CleanupStep = { name: string; run: () => Promise<unknown> | void };

const run007fCleanup = async (label: string, steps: CleanupStep[]) => {
  const failures: Error[] = [];
  for (const step of steps) {
    try {
      await step.run();
    } catch (error) {
      failures.push(new Error(`${step.name}: ${String(error)}`, { cause: error }));
    }
  }
  if (failures.length > 0) {
    throw new AggregateError(failures, `007F cleanup failed for ${label}`);
  }
};

const stopProofProcess = async (proofProcess: ProofProcess) => {
  if (proofProcess.child.exitCode !== null || proofProcess.child.signalCode !== null) return;
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timed out stopping owned proof worker')),
      5_000);
    proofProcess.child.once('close', () => {
      clearTimeout(timer);
      resolve();
    });
    try {
      proofProcess.child.kill();
    } catch (error) {
      clearTimeout(timer);
      reject(error);
    }
  });
};

const drop007fTrigger = async () => {
  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SET LOCAL lock_timeout = '3s'`;
    await tx.$executeRaw`DROP TRIGGER IF EXISTS soar_007f_report_gate ON "BacktestReport"`;
  }, { timeout: 10_000 });
};

const drop007fFunction = async () => {
  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SET LOCAL lock_timeout = '3s'`;
    await tx.$executeRaw`DROP FUNCTION IF EXISTS soar_007f_report_gate()`;
  }, { timeout: 10_000 });
};

const verify007fBarrierRemoved = async () => {
  const objects = await prisma.$queryRaw<Array<{ triggers: number; functions: number }>>`
    SELECT (SELECT COUNT(*)::int FROM pg_trigger
              WHERE tgname = 'soar_007f_report_gate') AS triggers,
           (SELECT COUNT(*)::int FROM pg_proc
              WHERE proname = 'soar_007f_report_gate') AS functions`;
  if (objects.length !== 1 || objects[0].triggers !== 0 || objects[0].functions !== 0) {
    throw new Error(`007F trigger/function remain: ${JSON.stringify(objects)}`);
  }
};

const positionCycleConfig = {
  openConditions: { direction: 'long', noMatchAction: 'EXIT',
    indicatorsLong: [{ name: 'MOMENTUM', condition: '>', value: 0, params: { period: 1 } }],
    indicatorsShort: [] },
  close: { mode: 'basic', tp: 99, sl: 20 },
  additional: { dcaEnabled: true, dcaMode: 'basic', dcaTimes: 2,
    dcaSizingBasis: 'usdt_contribution_v1',
    dcaLevels: [{ percent: -30.5, multiplier: 2 }] },
};

describe('real backtest worker process proof', () => {
  it('selects only the owned terminal backend and fails closed on missing or ambiguous identity', () => {
    const own = { pid: 101, datname: 'soar_007f_test',
      application_name: 'soar-007f-owned', query: 'INSERT INTO "BacktestReport"' };
    const foreign = { ...own, pid: 102, application_name: 'soar-007f-foreign' };
    expect(requireOneOwnedTerminalWaiter([foreign, own], own.datname, own.application_name))
      .toEqual(own);
    expect(() => requireOneOwnedTerminalWaiter([foreign], own.datname, own.application_name))
      .toThrow('found 0');
    expect(() => requireOneOwnedTerminalWaiter([own, { ...own, pid: 103 }],
      own.datname, own.application_name)).toThrow('found 2');
  });

  it('rejects terminal crash evidence when PostgreSQL can time out before worker death', () => {
    const queryStart = new Date('2026-10-21T00:00:00.000Z');
    const probe: TerminalCrashProbe = {
      pid: 101, datname: 'soar_007f3_test', application_name: 'soar-007f-owned',
      query: 'INSERT INTO "BacktestReport"', query_start: queryStart,
      observed_at: new Date(queryStart.getTime() + 5_000),
      wait_event_type: 'Lock', wait_event: 'advisory', state: 'active',
    };
    expect(() => requireCrashBeforeDbTimeout(probe, 500)).not.toThrow();
    expect(() => requireCrashBeforeDbTimeout({ ...probe,
      observed_at: new Date(queryStart.getTime() + TERMINAL_LOCK_TIMEOUT_MS + 1),
    }, 0)).toThrow('DB timeout could precede');
    expect(() => requireCrashBeforeDbTimeout(probe, 4_500))
      .toThrow('DB timeout could precede');
    expect(() => requireCrashBeforeDbTimeout({ ...probe, wait_event: null }, 0))
      .toThrow('lacks an active advisory waiter');
    expect(() => requireDbCloseBeforeTimeout(probe,
      new Date(queryStart.getTime() + TERMINAL_LOCK_TIMEOUT_MS + 1)))
      .toThrow('timeout could precede confirmed worker close');
  });

  runtimeIt('recovers a crashed owner and an interrupted acknowledgement with one result', async () => {
    const databaseName = new URL(process.env.DATABASE_URL ?? '').pathname.slice(1);
    if (!databaseName.endsWith('_test')) throw new Error('Refusing to mutate a non-test database');
    const queueName = `backtest-proof-${randomUUID()}`;
    const user = await prisma.user.create({
      data: { email: `bt-process-${randomUUID()}@example.test`, password: 'test-only' },
    });
    const run = await prisma.backtestRun.create({
      data: {
        userId: user.id, name: 'Two process proof', symbol: 'BTCUSDT',
        timeframe: '1m', seedConfig: { symbols: ['BTCUSDT'], marketType: 'FUTURES' },
      },
    });
    let orphanRunId: string | null = null;
    const redis = createClient({ url: process.env.REDIS_URL ?? 'redis://127.0.0.1:6379' });
    const processes: ProofProcess[] = [];
    try {
      await redis.connect();
      const producer = new BacktestRunQueue(async () => undefined, {
        backend: 'redis', queueName,
        redisUrl: process.env.REDIS_URL ?? 'redis://127.0.0.1:6379',
      });
      await producer.enqueue(run.id);
      await producer.stopWorker();

      const first = startProofProcess('hold', queueName, [run.id]);
      processes.push(first);
      await first.waitFor('FETCH_STARTED');

      const second = startProofProcess('ack-hold', queueName, [run.id]);
      processes.push(second);
      await second.waitFor('READY');
      await wait(250);
      expect(second.lines).not.toContain('SIMULATE');
      expect((await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } })).status).toBe('RUNNING');

      first.child.kill();
      await new Promise((resolve) => first.child.once('close', resolve));
      await prisma.backtestRun.update({
        where: { id: run.id },
        data: { executionLeaseExpiresAt: new Date(Date.now() - 1_000) },
      });
      await second.waitFor('COMMITTED_BEFORE_ACK');
      expect(second.lines.filter((line) => line === 'SIMULATE')).toHaveLength(1);

      const saved = await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } });
      expect(saved.status).toBe('COMPLETED');
      expect(await prisma.backtestTrade.count({ where: { backtestRunId: run.id } })).toBe(1);
      expect(await prisma.backtestReport.count({ where: { backtestRunId: run.id } })).toBe(1);

      second.child.kill();
      await new Promise((resolve) => second.child.once('close', resolve));
      const orphan = await prisma.backtestRun.create({
        data: {
          userId: user.id, name: 'Orphan pending proof', symbol: 'BTCUSDT',
          timeframe: '1m', seedConfig: { symbols: ['BTCUSDT'], marketType: 'FUTURES' },
        },
      });
      orphanRunId = orphan.id;
      const cleanup = startProofProcess('normal', queueName, [run.id, orphan.id]);
      processes.push(cleanup);
      await cleanup.waitFor('READY');
      await waitUntil(async () =>
        (await prisma.backtestRun.findUniqueOrThrow({ where: { id: orphan.id } })).status === 'COMPLETED');
      await waitUntil(async () =>
        (await redis.lRange(`soar:queue:${queueName}:processing`, 0, -1)).length === 0 &&
        (await redis.lRange(`soar:queue:${queueName}:pending`, 0, -1)).length === 0 &&
        !(await redis.sIsMember(`soar:queue:${queueName}:dedupe`, run.id)));
      expect(cleanup.lines.filter((line) => line === 'SIMULATE')).toHaveLength(1);
      expect(await prisma.backtestTrade.count({ where: { backtestRunId: orphan.id } })).toBe(1);
      expect(await prisma.backtestReport.count({ where: { backtestRunId: orphan.id } })).toBe(1);
      expect(await prisma.backtestTrade.count({ where: { backtestRunId: run.id } })).toBe(1);
    } finally {
      for (const process of processes) {
        if (process.child.exitCode === null) process.child.kill();
      }
      if (redis.isOpen) {
        await redis.del([
          `soar:queue:${queueName}:pending`,
          `soar:queue:${queueName}:processing`,
          `soar:queue:${queueName}:dedupe`,
        ]);
        await redis.quit();
      }
      await prisma.backtestContribution.deleteMany({ where: { backtestRunId: run.id } });
      await prisma.backtestTrade.deleteMany({ where: { backtestRunId: run.id } });
      await prisma.backtestReport.deleteMany({ where: { backtestRunId: run.id } });
      await prisma.backtestRun.deleteMany({ where: { id: run.id } });
      if (orphanRunId) {
        await prisma.backtestContribution.deleteMany({ where: { backtestRunId: orphanRunId } });
        await prisma.backtestTrade.deleteMany({ where: { backtestRunId: orphanRunId } });
        await prisma.backtestReport.deleteMany({ where: { backtestRunId: orphanRunId } });
        await prisma.backtestRun.deleteMany({ where: { id: orphanRunId } });
      }
      await prisma.user.delete({ where: { id: user.id } });
    }
  }, 60_000);

  runtimeIt('fences a resumed process after takeover and after cancellation', async () => {
    const databaseName = new URL(process.env.DATABASE_URL ?? '').pathname.slice(1);
    if (!databaseName.endsWith('_test')) throw new Error('Refusing to mutate a non-test database');
    const user = await prisma.user.create({
      data: { email: `bt-stale-${randomUUID()}@example.test`, password: 'test-only' },
    });
    const redis = createClient({ url: process.env.REDIS_URL ?? 'redis://127.0.0.1:6379' });
    const processes: ProofProcess[] = [];
    const runIds: string[] = [];
    const queueNames: string[] = [];
    const createRun = async () => {
      const run = await prisma.backtestRun.create({
        data: {
          userId: user.id, name: 'Fencing process proof', symbol: 'BTCUSDT',
          timeframe: '1m', seedConfig: { symbols: ['BTCUSDT'], marketType: 'FUTURES' },
        },
      });
      runIds.push(run.id);
      return run.id;
    };
    const enqueue = async (runId: string, queueName: string) => {
      const producer = new BacktestRunQueue(async () => undefined, {
        backend: 'redis', queueName,
        redisUrl: process.env.REDIS_URL ?? 'redis://127.0.0.1:6379',
      });
      await producer.enqueue(runId);
      await producer.stopWorker();
    };
    try {
      await redis.connect();
      const takeoverRunId = await createRun();
      const takeoverQueue = `backtest-stale-${randomUUID()}`;
      queueNames.push(takeoverQueue);
      await enqueue(takeoverRunId, takeoverQueue);
      const stale = startProofProcess('hold-release', takeoverQueue, [takeoverRunId]);
      processes.push(stale);
      await stale.waitFor('FETCH_STARTED');
      await prisma.backtestRun.update({
        where: { id: takeoverRunId },
        data: { executionLeaseExpiresAt: new Date(Date.now() - 1_000) },
      });
      const replacement = startProofProcess('normal', takeoverQueue, [takeoverRunId]);
      processes.push(replacement);
      await waitUntil(async () =>
        (await prisma.backtestRun.findUniqueOrThrow({ where: { id: takeoverRunId } })).status === 'COMPLETED');
      stale.child.stdin.write('release\n');
      await stale.waitFor('JOB_RETURNED');
      expect(stale.lines).not.toContain('SIMULATE');
      expect(await prisma.backtestTrade.count({ where: { backtestRunId: takeoverRunId } })).toBe(1);
      expect(await prisma.backtestReport.count({ where: { backtestRunId: takeoverRunId } })).toBe(1);

      const canceledRunId = await createRun();
      const canceledQueue = `backtest-cancel-${randomUUID()}`;
      queueNames.push(canceledQueue);
      await enqueue(canceledRunId, canceledQueue);
      const canceledWorker = startProofProcess('hold-release', canceledQueue, [canceledRunId]);
      processes.push(canceledWorker);
      await canceledWorker.waitFor('FETCH_STARTED');
      await prisma.backtestRun.update({
        where: { id: canceledRunId }, data: { status: 'CANCELED' },
      });
      canceledWorker.child.stdin.write('release\n');
      await canceledWorker.waitFor('JOB_RETURNED');
      expect((await prisma.backtestRun.findUniqueOrThrow({ where: { id: canceledRunId } })).status).toBe('CANCELED');
      expect(await prisma.backtestTrade.count({ where: { backtestRunId: canceledRunId } })).toBe(0);
      expect(await prisma.backtestReport.count({ where: { backtestRunId: canceledRunId } })).toBe(0);
    } finally {
      for (const process of processes) {
        if (process.child.exitCode === null) process.child.kill();
      }
      if (redis.isOpen) {
        await redis.del(queueNames.flatMap((name) => [
          `soar:queue:${name}:pending`, `soar:queue:${name}:processing`, `soar:queue:${name}:dedupe`,
        ]));
        await redis.quit();
      }
      await prisma.backtestContribution.deleteMany({ where: { backtestRunId: { in: runIds } } });
      await prisma.backtestTrade.deleteMany({ where: { backtestRunId: { in: runIds } } });
      await prisma.backtestReport.deleteMany({ where: { backtestRunId: { in: runIds } } });
      await prisma.backtestRun.deleteMany({ where: { id: { in: runIds } } });
      await prisma.user.delete({ where: { id: user.id } });
    }
  }, 60_000);

  runtimeIt('recovers ACK loss after a real 007 position cycle without a second simulation', async () => {
    const databaseName = new URL(process.env.DATABASE_URL ?? '').pathname.slice(1);
    if (!databaseName.endsWith('_test')) throw new Error('Refusing to mutate a non-test database');
    const queueName = `backtest-ack-loss-007-${randomUUID()}`;
    const user = await prisma.user.create({
      data: { email: `bt-ack-loss-${randomUUID()}@example.test`, password: 'test-only' },
    });
    const strategy = await prisma.strategy.create({ data: {
      userId: user.id, name: '007 ACK loss strategy', interval: '1m', leverage: 1,
      walletRisk: 10, config: positionCycleConfig,
    } });
    const run = await prisma.backtestRun.create({ data: {
      userId: user.id, strategyId: strategy.id, name: '007 ACK loss cycle',
      symbol: 'BTCUSDT', timeframe: '1m',
      seedConfig: { symbols: ['BTCUSDT'], marketType: 'FUTURES', leverage: 1,
        marginMode: 'CROSSED', initialBalance: 10, maxCandles: 100,
        feeRate: 0, slippageRate: 0,
        contextSnapshot: { strategy: { id: strategy.id, walletRisk: 10,
          config: positionCycleConfig } } },
    } });
    const redis = createClient({ url: process.env.REDIS_URL ?? 'redis://127.0.0.1:6379' });
    const processes: ProofProcess[] = [];
    const pendingKey = `soar:queue:${queueName}:pending`;
    const processingKey = `soar:queue:${queueName}:processing`;
    const dedupeKey = `soar:queue:${queueName}:dedupe`;
    try {
      await redis.connect();
      const producer = new BacktestRunQueue(async () => undefined, {
        backend: 'redis', queueName,
        redisUrl: process.env.REDIS_URL ?? 'redis://127.0.0.1:6379',
      });
      await producer.enqueue(run.id);
      await producer.stopWorker();

      const terminalWorker = startProofProcess('position-cycle-ack-hold', queueName, [run.id]);
      processes.push(terminalWorker);
      await terminalWorker.waitFor('COMMITTED_BEFORE_ACK');
      expect(terminalWorker.lines.filter((line) => line === 'JOB_INVOKED')).toHaveLength(1);
      expect(terminalWorker.lines.filter((line) => line === 'SIMULATE')).toHaveLength(1);

      const committedRun = await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } });
      const committedTrades = await prisma.backtestTrade.findMany({ where: { backtestRunId: run.id } });
      const committedReports = await prisma.backtestReport.findMany({ where: { backtestRunId: run.id } });
      const committedFills = await prisma.backtestContribution.findMany({
        where: { backtestRunId: run.id }, orderBy: { addSequence: 'asc' },
      });
      expect(committedRun.status).toBe('COMPLETED');
      expect(committedRun.executionToken).toBeNull();
      expect(committedTrades).toHaveLength(1);
      expect(committedTrades[0].exitReason).toBe('SL');
      expect(committedTrades[0].entryPrice * committedTrades[0].quantity).toBeCloseTo(9, 6);
      expect(committedReports).toHaveLength(1);
      const metrics = committedReports[0].metrics as {
        lifecycleEventCounts: Record<string, number>;
        positionContributionUsdtTotal: number;
        runLifecycle: { reportReady: boolean };
      };
      expect(metrics.runLifecycle.reportReady).toBe(true);
      expect(metrics.lifecycleEventCounts).toMatchObject({ ENTRY: 1, DCA: 2, EXIT: 0, SL: 1 });
      expect(metrics.positionContributionUsdtTotal).toBeCloseTo(9, 6);
      expect(committedFills.map((fill) => [fill.kind, fill.addSequence, fill.levelIndex,
        fill.triggerPercent, fill.multiplier, fill.price])).toEqual([
        ['ENTRY', 0, null, null, null, 1],
        ['DCA', 1, 0, -30.5, 2, 0.6949],
        ['DCA', 2, 1, -30.5, 2, 0.5375],
      ]);
      committedFills.forEach((fill, index) =>
        expect(fill.contributionUsdt).toBeCloseTo([1, 2, 6][index], 6));
      expect(await redis.lRange(pendingKey, 0, -1)).toEqual([]);
      expect(await redis.lRange(processingKey, 0, -1)).toEqual([run.id]);
      expect(await redis.sIsMember(dedupeKey, run.id)).toBe(true);

      terminalWorker.child.kill();
      await new Promise((resolve) => terminalWorker.child.once('close', resolve));
      expect(await redis.lRange(processingKey, 0, -1)).toEqual([run.id]);
      expect(await redis.sIsMember(dedupeKey, run.id)).toBe(true);

      const recoveryWorker = startProofProcess('position-cycle-recovery', queueName, [run.id]);
      processes.push(recoveryWorker);
      await recoveryWorker.waitFor('READY');
      await waitUntil(async () =>
        (await redis.lRange(processingKey, 0, -1)).length === 0 &&
        (await redis.lRange(pendingKey, 0, -1)).length === 0 &&
        !(await redis.sIsMember(dedupeKey, run.id)));
      await wait(250);
      expect(recoveryWorker.lines).not.toContain('JOB_INVOKED');
      expect(recoveryWorker.lines).not.toContain('SIMULATE');
      expect(await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } }))
        .toEqual(committedRun);
      expect(await prisma.backtestTrade.findMany({ where: { backtestRunId: run.id } }))
        .toEqual(committedTrades);
      expect(await prisma.backtestReport.findMany({ where: { backtestRunId: run.id } }))
        .toEqual(committedReports);
      expect(await prisma.backtestContribution.findMany({
        where: { backtestRunId: run.id }, orderBy: { addSequence: 'asc' },
      })).toEqual(committedFills);
    } finally {
      for (const process of processes) {
        if (process.child.exitCode === null) process.child.kill();
      }
      if (redis.isOpen) {
        await redis.del([pendingKey, processingKey, dedupeKey]);
        await redis.quit();
      }
      await prisma.backtestContribution.deleteMany({ where: { backtestRunId: run.id } });
      await prisma.backtestTrade.deleteMany({ where: { backtestRunId: run.id } });
      await prisma.backtestReport.deleteMany({ where: { backtestRunId: run.id } });
      await prisma.backtestRun.delete({ where: { id: run.id } });
      await prisma.strategy.delete({ where: { id: strategy.id } });
      await prisma.user.delete({ where: { id: user.id } });
    }
  }, 60_000);

  runtimeIt('restarts a real 007 cycle after both DCA candles without stale writes or duplicates', async () => {
    const databaseName = new URL(process.env.DATABASE_URL ?? '').pathname.slice(1);
    if (!databaseName.endsWith('_test')) throw new Error('Refusing to mutate a non-test database');
    const queueName = `backtest-mid-candle-007-${randomUUID()}`;
    const user = await prisma.user.create({
      data: { email: `bt-mid-candle-${randomUUID()}@example.test`, password: 'test-only' },
    });
    const strategy = await prisma.strategy.create({ data: {
      userId: user.id, name: '007 mid-calculation strategy', interval: '1m', leverage: 1,
      walletRisk: 10, config: positionCycleConfig,
    } });
    const run = await prisma.backtestRun.create({ data: {
      userId: user.id, strategyId: strategy.id, name: '007 mid-calculation cycle',
      symbol: 'BTCUSDT', timeframe: '1m',
      seedConfig: { symbols: ['BTCUSDT'], marketType: 'FUTURES', leverage: 1,
        marginMode: 'CROSSED', initialBalance: 10, maxCandles: 100,
        feeRate: 0, slippageRate: 0,
        contextSnapshot: { strategy: { id: strategy.id, walletRisk: 10,
          config: positionCycleConfig } } },
    } });
    const redis = createClient({ url: process.env.REDIS_URL ?? 'redis://127.0.0.1:6379' });
    const processes: ProofProcess[] = [];
    const pendingKey = `soar:queue:${queueName}:pending`;
    const processingKey = `soar:queue:${queueName}:processing`;
    const dedupeKey = `soar:queue:${queueName}:dedupe`;
    const releaseFile = join(tmpdir(), `soar-007e-${randomUUID()}.release`);
    const producer = new BacktestRunQueue(async () => undefined, {
      backend: 'redis', queueName,
      redisUrl: process.env.REDIS_URL ?? 'redis://127.0.0.1:6379',
    });
    try {
      await redis.connect();
      await producer.enqueue(run.id);
      await producer.stopWorker();

      const first = startProofProcess('position-cycle-mid-hold', queueName, [run.id]);
      processes.push(first);
      await first.waitFor('AFTER_BOTH_DCA_BEFORE_SL');
      expect(first.lines.filter((line) => line === 'SIMULATE')).toHaveLength(1);
      const interruptedRun = await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } });
      const firstToken = interruptedRun.executionToken;
      expect(firstToken).toBeTruthy();
      expect(interruptedRun.status).toBe('RUNNING');
      expect((interruptedRun.seedConfig as { liveProgress?: { lastUpdate: string } })
        .liveProgress?.lastUpdate).toBe('simulating_interleaved_portfolio');
      expect(await prisma.backtestTrade.count({ where: { backtestRunId: run.id } })).toBe(0);
      expect(await prisma.backtestReport.count({ where: { backtestRunId: run.id } })).toBe(0);
      expect(await prisma.backtestContribution.count({ where: { backtestRunId: run.id } })).toBe(0);
      expect(await redis.lRange(pendingKey, 0, -1)).toEqual([]);
      expect(await redis.lRange(processingKey, 0, -1)).toEqual([run.id]);
      expect(await redis.sIsMember(dedupeKey, run.id)).toBe(true);

      first.child.kill();
      await new Promise((resolve) => first.child.once('close', resolve));
      expect((await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } })).status)
        .toBe('RUNNING');
      expect(await redis.lRange(processingKey, 0, -1)).toEqual([run.id]);
      expect(await redis.sIsMember(dedupeKey, run.id)).toBe(true);
      await prisma.backtestRun.update({ where: { id: run.id },
        data: { executionLeaseExpiresAt: new Date(Date.now() - 1_000) } });
      const second = startProofProcess('position-cycle-mid-release', queueName, [run.id], releaseFile);
      processes.push(second);
      await second.waitFor('AFTER_BOTH_DCA_BEFORE_SL');
      const takenOverRun = await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } });
      expect(takenOverRun.status).toBe('RUNNING');
      expect(takenOverRun.executionToken).toBeTruthy();
      expect(takenOverRun.executionToken).not.toBe(firstToken);
      expect(await updateClaimedBacktestRun(run.id, firstToken!, {
        name: 'stale-token-must-not-write',
      })).toBe(false);
      expect(await commitClaimedBacktestRun({
        runId: run.id, token: firstToken!, userId: user.id,
        status: 'COMPLETED', seedConfig: { stale: true },
        trades: [], contributions: [],
        report: { backtestRunId: run.id,
          create: { userId: user.id, backtestRunId: run.id, metrics: { stale: true } },
          update: { metrics: { stale: true } } },
      })).toBe(false);
      expect((await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } })).name)
        .toBe(run.name);
      expect(await prisma.backtestTrade.count({ where: { backtestRunId: run.id } })).toBe(0);
      expect(await prisma.backtestReport.count({ where: { backtestRunId: run.id } })).toBe(0);
      expect(await prisma.backtestContribution.count({ where: { backtestRunId: run.id } })).toBe(0);

      writeFileSync(releaseFile, 'release');

      await waitUntil(async () =>
        (await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } })).status === 'COMPLETED',
        20_000);
      await waitUntil(async () =>
        (await redis.lRange(processingKey, 0, -1)).length === 0 &&
        (await redis.lRange(pendingKey, 0, -1)).length === 0 &&
        !(await redis.sIsMember(dedupeKey, run.id)));
      expect(second.lines.filter((line) => line === 'JOB_INVOKED')).toHaveLength(1);
      expect(second.lines.filter((line) => line === 'SIMULATE')).toHaveLength(1);
      const completedRun = await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } });
      const completedTrades = await prisma.backtestTrade.findMany({ where: { backtestRunId: run.id } });
      const completedReports = await prisma.backtestReport.findMany({ where: { backtestRunId: run.id } });
      const completedFills = await prisma.backtestContribution.findMany({
        where: { backtestRunId: run.id }, orderBy: { addSequence: 'asc' },
      });
      expect(completedRun.executionToken).toBeNull();
      expect(completedTrades).toHaveLength(1);
      expect(completedTrades[0].exitReason).toBe('SL');
      expect(completedReports).toHaveLength(1);
      const metrics = completedReports[0].metrics as {
        lifecycleEventCounts: Record<string, number>;
        positionContributionUsdtTotal: number;
        runLifecycle: { reportReady: boolean };
      };
      expect(metrics.runLifecycle.reportReady).toBe(true);
      expect(metrics.lifecycleEventCounts).toMatchObject({ ENTRY: 1, DCA: 2, EXIT: 0, SL: 1 });
      expect(metrics.positionContributionUsdtTotal).toBeCloseTo(9, 6);
      expect(completedFills.map((fill) => [fill.kind, fill.addSequence]))
        .toEqual([['ENTRY', 0], ['DCA', 1], ['DCA', 2]]);
      completedFills.forEach((fill, index) =>
        expect(fill.contributionUsdt).toBeCloseTo([1, 2, 6][index], 6));

      second.child.kill();
      await new Promise((resolve) => second.child.once('close', resolve));
      await producer.enqueue(run.id);
      await producer.stopWorker();
      const third = startProofProcess('position-cycle-recovery', queueName, [run.id]);
      processes.push(third);
      await third.waitFor('JOB_INVOKED');
      await waitUntil(async () =>
        (await redis.lRange(processingKey, 0, -1)).length === 0 &&
        (await redis.lRange(pendingKey, 0, -1)).length === 0 &&
        !(await redis.sIsMember(dedupeKey, run.id)));
      expect(third.lines).not.toContain('SIMULATE');
      expect(await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } }))
        .toEqual(completedRun);
      expect(await prisma.backtestTrade.findMany({ where: { backtestRunId: run.id } }))
        .toEqual(completedTrades);
      expect(await prisma.backtestReport.findMany({ where: { backtestRunId: run.id } }))
        .toEqual(completedReports);
      expect(await prisma.backtestContribution.findMany({
        where: { backtestRunId: run.id }, orderBy: { addSequence: 'asc' },
      })).toEqual(completedFills);
      expect(await prisma.backtestRun.count({ where: { userId: user.id } })).toBe(1);
    } finally {
      for (const process of processes) {
        if (process.child.exitCode === null && process.child.signalCode === null) {
          const closed = new Promise((resolve) => process.child.once('close', resolve));
          process.child.kill();
          await closed;
        }
      }
      if (existsSync(releaseFile)) unlinkSync(releaseFile);
      await producer.stopWorker();
      if (redis.isOpen) {
        await redis.del([pendingKey, processingKey, dedupeKey]);
        await redis.quit();
      }
      await prisma.backtestContribution.deleteMany({ where: { backtestRunId: run.id } });
      await prisma.backtestTrade.deleteMany({ where: { backtestRunId: run.id } });
      await prisma.backtestReport.deleteMany({ where: { backtestRunId: run.id } });
      await prisma.backtestRun.delete({ where: { id: run.id } });
      await prisma.strategy.delete({ where: { id: strategy.id } });
      await prisma.user.delete({ where: { id: user.id } });
    }
  }, 60_000);

  runtimeIt('removes its trigger and function after an injected cleanup waiter timeout', async () => {
    requireDedicated007fDatabase();
    try {
      await prisma.$executeRaw`
        CREATE FUNCTION soar_007f_report_gate() RETURNS trigger LANGUAGE plpgsql AS $$
        BEGIN RETURN NEW; END;
        $$`;
      await prisma.$executeRaw`
        CREATE TRIGGER soar_007f_report_gate
        AFTER INSERT OR UPDATE ON "BacktestReport"
        FOR EACH ROW EXECUTE FUNCTION soar_007f_report_gate()`;
      let cleanupError: unknown;
      try {
        await run007fCleanup('injected waiter timeout', [
          { name: 'wait for waiters', run: async () => {
            throw new Error('injected waiter timeout');
          } },
          { name: 'drop trigger', run: drop007fTrigger },
          { name: 'drop function', run: drop007fFunction },
          { name: 'verify objects removed', run: verify007fBarrierRemoved },
        ]);
      } catch (error) {
        cleanupError = error;
      }
      expect(cleanupError).toBeInstanceOf(AggregateError);
      expect((cleanupError as AggregateError).errors.map(String).join(' | '))
        .toContain('injected waiter timeout');
      await verify007fBarrierRemoved();
    } finally {
      await run007fCleanup('injected-timeout fallback', [
        { name: 'drop trigger', run: drop007fTrigger },
        { name: 'drop function', run: drop007fFunction },
        { name: 'verify objects removed', run: verify007fBarrierRemoved },
      ]);
    }
  }, 60_000);

  runtimeIt('rolls back an interrupted terminal 007 transaction before recovery', async () => {
    const databaseName = requireDedicated007fDatabase();
    const queueName = `backtest-uncommitted-007-${randomUUID()}`;
    const workerApplicationName = `soar-007f-worker-${randomUUID()}`;
    const foreignApplicationName = `soar-007f-foreign-${randomUUID()}`;
    const workerDatabaseUrl = new URL(process.env.DATABASE_URL ?? '');
    workerDatabaseUrl.searchParams.set('application_name', workerApplicationName);
    const user = await prisma.user.create({
      data: { email: `bt-uncommitted-${randomUUID()}@example.test`, password: 'test-only' },
    });
    const strategy = await prisma.strategy.create({ data: {
      userId: user.id, name: '007 uncommitted strategy', interval: '1m', leverage: 1,
      walletRisk: 10, config: positionCycleConfig,
    } });
    const run = await prisma.backtestRun.create({ data: {
      userId: user.id, strategyId: strategy.id, name: '007 uncommitted cycle',
      symbol: 'BTCUSDT', timeframe: '1m',
      seedConfig: { symbols: ['BTCUSDT'], marketType: 'FUTURES', leverage: 1,
        marginMode: 'CROSSED', initialBalance: 10, maxCandles: 100,
        feeRate: 0, slippageRate: 0,
        contextSnapshot: { strategy: { id: strategy.id, walletRisk: 10,
          config: positionCycleConfig } } },
    } });
    const redis = createClient({ url: process.env.REDIS_URL ?? 'redis://127.0.0.1:6379' });
    const processes: ProofProcess[] = [];
    const pendingKey = `soar:queue:${queueName}:pending`;
    const processingKey = `soar:queue:${queueName}:processing`;
    const dedupeKey = `soar:queue:${queueName}:dedupe`;
    const releaseFile = join(tmpdir(), `soar-007f-${randomUUID()}.release`);
    const producer = new BacktestRunQueue(async () => undefined, {
      backend: 'redis', queueName,
      redisUrl: process.env.REDIS_URL ?? 'redis://127.0.0.1:6379',
    });
    const waitingReportQueries = () => prisma.$queryRaw<WaitingReportBackend[]>`
      SELECT activity.pid, activity.datname, activity.application_name, activity.query
      FROM pg_locks AS lock
      JOIN pg_stat_activity AS activity ON activity.pid = lock.pid
      WHERE lock.locktype = 'advisory'
        AND lock.classid = 7007::oid AND lock.objid = 15::oid
        AND NOT lock.granted`;
    let releaseLock: () => void = () => {};
    let lockHolder: Promise<void> | null = null;
    let foreignWaiter: Promise<void> | null = null;
    let bodyError: unknown = null;
    try {
      await redis.connect();
      const identityClient = new PrismaClient({
        datasources: { db: { url: workerDatabaseUrl.toString() } },
      });
      try {
        const identity = await identityClient.$queryRaw<Array<{
          datname: string; application_name: string; statement_timeout: string;
        }>>`SELECT current_database() AS datname,
                  current_setting('application_name') AS application_name,
                  current_setting('statement_timeout') AS statement_timeout`;
        expect(identity).toEqual([{
          datname: databaseName, application_name: workerApplicationName,
          statement_timeout: '0',
        }]);
      } finally {
        await identityClient.$disconnect();
      }
      // This trigger exists only in the isolated _test database. Its AFTER phase
      // runs after the report row write, while the terminal transaction is open.
      // If a blocked backend survives its client, releasing the lock raises
      // rather than allowing an unowned terminal commit.
      await prisma.$executeRaw`
        CREATE FUNCTION soar_007f_report_gate() RETURNS trigger LANGUAGE plpgsql AS $$
        BEGIN
          PERFORM set_config('lock_timeout', '10s', true);
          PERFORM pg_advisory_xact_lock(7007, 15);
          RAISE EXCEPTION '007F terminal barrier must not commit';
          RETURN NEW;
        END;
        $$`;
      await prisma.$executeRaw`
        CREATE TRIGGER soar_007f_report_gate
        AFTER INSERT OR UPDATE ON "BacktestReport"
        FOR EACH ROW EXECUTE FUNCTION soar_007f_report_gate()`;
      const barrierDefinition = await prisma.$queryRaw<Array<{ prosrc: string }>>`
        SELECT prosrc FROM pg_proc WHERE proname = 'soar_007f_report_gate'`;
      expect(barrierDefinition).toHaveLength(1);
      expect(barrierDefinition[0].prosrc)
        .toContain("set_config('lock_timeout', '10s', true)");
      let signalLockHeld: () => void = () => {};
      const lockHeld = new Promise<void>((resolve) => { signalLockHeld = resolve; });
      const releaseLockPromise = new Promise<void>((resolve) => { releaseLock = resolve; });
      lockHolder = prisma.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT pg_advisory_xact_lock(7007, 15)::text`;
        signalLockHeld();
        await releaseLockPromise;
      }, { timeout: 120_000 });
      await Promise.race([lockHeld, lockHolder.then(() => {
        throw new Error('007F advisory lock released before the worker started');
      })]);
      await producer.enqueue(run.id);
      await producer.stopWorker();

      const first = startProofProcess('position-cycle-ack-hold', queueName, [run.id],
        undefined, workerDatabaseUrl.toString());
      processes.push(first);
      await waitUntil(async () => (await waitingReportQueries()).some((waiter) =>
        isOwnedTerminalWaiter(waiter, databaseName, workerApplicationName)));
      const ownedBackend = requireOneOwnedTerminalWaiter(await waitingReportQueries(),
        databaseName, workerApplicationName);
      const blockedBackendPid = ownedBackend.pid;
      foreignWaiter = prisma.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT set_config('application_name', ${foreignApplicationName}, true)`;
        await tx.$queryRaw`SELECT pg_advisory_xact_lock(7007, 15)::text /* BacktestReport */`;
      }, { timeout: 120_000 });
      void foreignWaiter.catch(() => undefined);
      await waitUntil(async () => (await waitingReportQueries()).some((waiter) =>
        waiter.datname === databaseName && waiter.application_name === foreignApplicationName &&
        waiter.query.includes('BacktestReport')));
      const waiting = await waitingReportQueries();
      const foreignBackend = waiting.find((waiter) =>
        waiter.datname === databaseName && waiter.application_name === foreignApplicationName &&
        waiter.query.includes('BacktestReport'));
      expect(foreignBackend).toBeDefined();
      expect(requireOneOwnedTerminalWaiter(waiting, databaseName, workerApplicationName).pid)
        .toBe(blockedBackendPid);
      expect(first.lines.filter((line) => line === 'JOB_INVOKED')).toHaveLength(1);
      expect(first.lines.filter((line) => line === 'SIMULATE')).toHaveLength(1);
      expect(first.lines).not.toContain('COMMITTED_BEFORE_ACK');
      const blockedRun = await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } });
      const firstToken = blockedRun.executionToken;
      expect(firstToken).toBeTruthy();
      expect(blockedRun.status).toBe('RUNNING');
      expect(blockedRun.finishedAt).toBeNull();
      expect((blockedRun.seedConfig as { liveProgress?: { lastUpdate: string } })
        .liveProgress?.lastUpdate).toBe('simulating_interleaved_portfolio');
      expect(await prisma.backtestTrade.count({ where: { backtestRunId: run.id } })).toBe(0);
      expect(await prisma.backtestReport.count({ where: { backtestRunId: run.id } })).toBe(0);
      expect(await prisma.backtestContribution.count({ where: { backtestRunId: run.id } })).toBe(0);
      expect(await redis.lRange(pendingKey, 0, -1)).toEqual([]);
      expect(await redis.lRange(processingKey, 0, -1)).toEqual([run.id]);
      expect(await redis.sIsMember(dedupeKey, run.id)).toBe(true);

      const firstClosed = new Promise((resolve) => first.child.once('close', resolve));
      // This fresh waiter read is the last DB/Redis operation before kill().
      // Bound both the signal and observed Node close before the earliest DB timeout.
      const probeStartedAt = performance.now();
      const crashProbeRows = await prisma.$queryRaw<TerminalCrashProbe[]>`
        SELECT activity.pid, activity.datname, activity.application_name, activity.query,
               activity.query_start, activity.state, activity.wait_event_type,
               activity.wait_event, clock_timestamp() AS observed_at
        FROM pg_locks AS lock
        JOIN pg_stat_activity AS activity ON activity.pid = lock.pid
        WHERE lock.locktype = 'advisory'
          AND lock.classid = 7007::oid AND lock.objid = 15::oid
          AND NOT lock.granted`;
      const crashProbe = requireOneOwnedTerminalWaiter(crashProbeRows,
        databaseName, workerApplicationName);
      expect(crashProbe.pid).toBe(blockedBackendPid);
      requireCrashBeforeDbTimeout(crashProbe, performance.now() - probeStartedAt);
      const killAccepted = first.child.kill();
      await firstClosed;
      if (!killAccepted) throw new Error('007F worker was not killed at the crash boundary');
      requireCrashBeforeDbTimeout(crashProbe, performance.now() - probeStartedAt);
      const afterCloseClock = await prisma.$queryRaw<Array<{ observed_at: Date }>>`
        SELECT clock_timestamp() AS observed_at`;
      requireDbCloseBeforeTimeout(crashProbe, afterCloseClock[0].observed_at);
      // The trigger's transaction-local lock timeout aborts the orphaned transaction.
      // No PostgreSQL backend PID is targeted: PID reuse cannot affect this proof.
      await waitUntil(async () => !(await waitingReportQueries()).some((waiter) =>
        isOwnedTerminalWaiter(waiter, databaseName, workerApplicationName)), 20_000);
      expect((await waitingReportQueries()).some((waiter) =>
        waiter.pid === foreignBackend!.pid && waiter.application_name === foreignApplicationName))
        .toBe(true);
      const rolledBackRun = await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } });
      expect(rolledBackRun).toEqual(blockedRun);
      expect(await prisma.backtestTrade.count({ where: { backtestRunId: run.id } })).toBe(0);
      expect(await prisma.backtestReport.count({ where: { backtestRunId: run.id } })).toBe(0);
      expect(await prisma.backtestContribution.count({ where: { backtestRunId: run.id } })).toBe(0);
      expect(await redis.lRange(processingKey, 0, -1)).toEqual([run.id]);
      expect(await redis.sIsMember(dedupeKey, run.id)).toBe(true);
      releaseLock();
      await lockHolder;
      lockHolder = null;
      await foreignWaiter;
      foreignWaiter = null;
      await run007fCleanup('before 007F recovery', [
        { name: 'drop trigger', run: drop007fTrigger },
        { name: 'drop function', run: drop007fFunction },
        { name: 'verify objects removed', run: verify007fBarrierRemoved },
      ]);

      await prisma.backtestRun.update({ where: { id: run.id },
        data: { executionLeaseExpiresAt: new Date(Date.now() - 1_000) } });
      const second = startProofProcess('position-cycle-mid-release', queueName, [run.id], releaseFile);
      processes.push(second);
      await second.waitFor('AFTER_BOTH_DCA_BEFORE_SL');
      const takenOverRun = await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } });
      expect(takenOverRun.status).toBe('RUNNING');
      expect(takenOverRun.executionToken).toBeTruthy();
      expect(takenOverRun.executionToken).not.toBe(firstToken);
      expect(await updateClaimedBacktestRun(run.id, firstToken!, {
        name: 'stale-token-must-not-write',
      })).toBe(false);
      expect(await commitClaimedBacktestRun({
        runId: run.id, token: firstToken!, userId: user.id,
        status: 'COMPLETED', seedConfig: { stale: true },
        trades: [], contributions: [],
        report: { backtestRunId: run.id,
          create: { userId: user.id, backtestRunId: run.id, metrics: { stale: true } },
          update: { metrics: { stale: true } } },
      })).toBe(false);
      expect((await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } })).name)
        .toBe(run.name);
      expect(await prisma.backtestTrade.count({ where: { backtestRunId: run.id } })).toBe(0);
      expect(await prisma.backtestReport.count({ where: { backtestRunId: run.id } })).toBe(0);
      expect(await prisma.backtestContribution.count({ where: { backtestRunId: run.id } })).toBe(0);
      writeFileSync(releaseFile, 'release');

      await waitUntil(async () =>
        (await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } })).status === 'COMPLETED');
      await waitUntil(async () =>
        (await redis.lRange(processingKey, 0, -1)).length === 0 &&
        (await redis.lRange(pendingKey, 0, -1)).length === 0 &&
        !(await redis.sIsMember(dedupeKey, run.id)));
      expect(second.lines.filter((line) => line === 'SIMULATE')).toHaveLength(1);
      const completedRun = await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } });
      const completedTrades = await prisma.backtestTrade.findMany({ where: { backtestRunId: run.id } });
      const completedReports = await prisma.backtestReport.findMany({ where: { backtestRunId: run.id } });
      const completedFills = await prisma.backtestContribution.findMany({
        where: { backtestRunId: run.id }, orderBy: { addSequence: 'asc' },
      });
      expect(completedRun.executionToken).toBeNull();
      expect(completedTrades).toHaveLength(1);
      expect(completedTrades[0].exitReason).toBe('SL');
      expect(completedReports).toHaveLength(1);
      const metrics = completedReports[0].metrics as {
        lifecycleEventCounts: Record<string, number>;
        positionContributionUsdtTotal: number;
        runLifecycle: { reportReady: boolean };
      };
      expect(metrics.runLifecycle.reportReady).toBe(true);
      expect(metrics.lifecycleEventCounts).toMatchObject({ ENTRY: 1, DCA: 2, EXIT: 0, SL: 1 });
      expect(metrics.positionContributionUsdtTotal).toBeCloseTo(9, 6);
      expect(completedFills.map((fill) => [fill.kind, fill.addSequence]))
        .toEqual([['ENTRY', 0], ['DCA', 1], ['DCA', 2]]);
      completedFills.forEach((fill, index) =>
        expect(fill.contributionUsdt).toBeCloseTo([1, 2, 6][index], 6));

      const secondClosed = new Promise((resolve) => second.child.once('close', resolve));
      second.child.kill();
      await secondClosed;
      await producer.enqueue(run.id);
      await producer.stopWorker();
      const third = startProofProcess('position-cycle-recovery', queueName, [run.id]);
      processes.push(third);
      await third.waitFor('JOB_INVOKED');
      await waitUntil(async () =>
        (await redis.lRange(processingKey, 0, -1)).length === 0 &&
        (await redis.lRange(pendingKey, 0, -1)).length === 0 &&
        !(await redis.sIsMember(dedupeKey, run.id)));
      expect(third.lines).not.toContain('SIMULATE');
      expect(await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } }))
        .toEqual(completedRun);
      expect(await prisma.backtestTrade.findMany({ where: { backtestRunId: run.id } }))
        .toEqual(completedTrades);
      expect(await prisma.backtestReport.findMany({ where: { backtestRunId: run.id } }))
        .toEqual(completedReports);
      expect(await prisma.backtestContribution.findMany({
        where: { backtestRunId: run.id }, orderBy: { addSequence: 'asc' },
      })).toEqual(completedFills);
      expect(await prisma.backtestRun.count({ where: { userId: user.id } })).toBe(1);
    } catch (error) {
      bodyError = error;
      throw error;
    } finally {
      try {
        await run007fCleanup(`${databaseName}/${queueName}`, [
          ...processes.map((proofProcess, index) => ({
            name: `stop proof worker ${index}`, run: () => stopProofProcess(proofProcess),
          })),
          { name: 'release owned advisory lock', run: () => releaseLock() },
          { name: 'await lock holder', run: async () => {
            if (lockHolder) await lockHolder;
          } },
          { name: 'await foreign waiter', run: async () => {
            if (foreignWaiter) await foreignWaiter;
          } },
          { name: 'wait for isolated database waiters', run: () => waitUntil(async () =>
            !(await waitingReportQueries()).some((waiter) => waiter.datname === databaseName),
          20_000) },
          { name: 'drop trigger', run: drop007fTrigger },
          { name: 'drop function', run: drop007fFunction },
          { name: 'verify barrier objects removed', run: verify007fBarrierRemoved },
          { name: 'remove release file', run: () => {
            if (existsSync(releaseFile)) unlinkSync(releaseFile);
          } },
          { name: 'stop queue producer', run: () => producer.stopWorker() },
          { name: 'remove owned Redis keys', run: async () => {
            if (redis.isOpen) await redis.del([pendingKey, processingKey, dedupeKey]);
          } },
          { name: 'close Redis client', run: async () => {
            if (redis.isOpen) await redis.quit();
          } },
          { name: 'delete contributions', run: () => prisma.backtestContribution.deleteMany({
            where: { backtestRunId: run.id },
          }) },
          { name: 'delete trades', run: () => prisma.backtestTrade.deleteMany({
            where: { backtestRunId: run.id },
          }) },
          { name: 'delete report', run: () => prisma.backtestReport.deleteMany({
            where: { backtestRunId: run.id },
          }) },
          { name: 'delete run', run: () => prisma.backtestRun.delete({
            where: { id: run.id },
          }) },
          { name: 'delete strategy', run: () => prisma.strategy.delete({
            where: { id: strategy.id },
          }) },
          { name: 'delete user', run: () => prisma.user.delete({
            where: { id: user.id },
          }) },
          { name: 'verify owned records removed', run: async () => {
            const [runs, users] = await Promise.all([
              prisma.backtestRun.count({ where: { id: run.id } }),
              prisma.user.count({ where: { id: user.id } }),
            ]);
            if (runs !== 0 || users !== 0) {
              throw new Error(`007F records remain: run=${runs}, user=${users}`);
            }
          } },
        ]);
      } catch (cleanupError) {
        if (bodyError) {
          throw new AggregateError([bodyError, cleanupError], '007F body and cleanup failed');
        }
        throw cleanupError;
      }
    }
  }, 60_000);
});
