import { randomUUID } from 'node:crypto';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { existsSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
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

const isOwnedTerminalWaiter = (
  waiter: WaitingReportBackend, databaseName: string, applicationName: string,
) => waiter.datname === databaseName && waiter.application_name === applicationName &&
  waiter.query.includes('BacktestReport');

const requireOneOwnedTerminalWaiter = (
  waiters: WaitingReportBackend[], databaseName: string, applicationName: string,
) => {
  const owned = waiters.filter((waiter) =>
    isOwnedTerminalWaiter(waiter, databaseName, applicationName));
  if (owned.length !== 1) {
    throw new Error(`Expected exactly one owned 007F report backend; found ${owned.length}`);
  }
  return owned[0];
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

  runtimeIt('rolls back an interrupted terminal 007 transaction before recovery', async () => {
    const databaseName = new URL(process.env.DATABASE_URL ?? '').pathname.slice(1);
    if (!databaseName.endsWith('_test')) throw new Error('Refusing to mutate a non-test database');
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
    try {
      await redis.connect();
      const identityClient = new PrismaClient({
        datasources: { db: { url: workerDatabaseUrl.toString() } },
      });
      try {
        const identity = await identityClient.$queryRaw<Array<{
          datname: string; application_name: string;
        }>>`SELECT current_database() AS datname,
                  current_setting('application_name') AS application_name`;
        expect(identity).toEqual([{
          datname: databaseName, application_name: workerApplicationName,
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
          PERFORM pg_advisory_xact_lock(7007, 15);
          RAISE EXCEPTION '007F terminal barrier must not commit';
          RETURN NEW;
        END;
        $$`;
      await prisma.$executeRaw`
        CREATE TRIGGER soar_007f_report_gate
        AFTER INSERT OR UPDATE ON "BacktestReport"
        FOR EACH ROW EXECUTE FUNCTION soar_007f_report_gate()`;
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
      first.child.kill();
      await firstClosed;
      // A blocked backend can outlive a dead client. Recheck the exact database,
      // per-worker application name, PID and lock before terminating it.
      const ownedAfterKill = (await waitingReportQueries()).filter((waiter) =>
        isOwnedTerminalWaiter(waiter, databaseName, workerApplicationName));
      if (ownedAfterKill.length > 1) {
        throw new Error('Ambiguous 007F worker backend after process death');
      }
      if (ownedAfterKill.length === 1) {
        expect(requireOneOwnedTerminalWaiter(ownedAfterKill,
          databaseName, workerApplicationName).pid).toBe(blockedBackendPid);
        const terminated = await prisma.$queryRaw<Array<{ terminated: boolean }>>`
          SELECT pg_terminate_backend(${blockedBackendPid}::int) AS terminated
          WHERE EXISTS (
            SELECT 1 FROM pg_stat_activity AS activity
            JOIN pg_locks AS lock ON lock.pid = activity.pid
            WHERE activity.pid = ${blockedBackendPid}::int
              AND activity.datname = ${databaseName}
              AND activity.application_name = ${workerApplicationName}
              AND activity.query LIKE '%BacktestReport%'
              AND lock.locktype = 'advisory'
              AND lock.classid = 7007::oid AND lock.objid = 15::oid
              AND NOT lock.granted
          )`;
        if (terminated.length > 0) expect(terminated[0].terminated).toBe(true);
      }
      await waitUntil(async () => !(await waitingReportQueries()).some((waiter) =>
        isOwnedTerminalWaiter(waiter, databaseName, workerApplicationName)));
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
      await prisma.$executeRaw`DROP TRIGGER soar_007f_report_gate ON "BacktestReport"`;
      await prisma.$executeRaw`DROP FUNCTION soar_007f_report_gate()`;

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
    } finally {
      for (const process of processes) {
        if (process.child.exitCode === null && process.child.signalCode === null) {
          const closed = new Promise((resolve) => process.child.once('close', resolve));
          process.child.kill();
          await closed;
        }
      }
      releaseLock();
      if (lockHolder) await lockHolder.catch(() => undefined);
      if (foreignWaiter) await foreignWaiter.catch(() => undefined);
      await waitUntil(async () => !(await waitingReportQueries()).some((waiter) =>
        waiter.datname === databaseName));
      await prisma.$executeRaw`DROP TRIGGER IF EXISTS soar_007f_report_gate ON "BacktestReport"`;
      await prisma.$executeRaw`DROP FUNCTION IF EXISTS soar_007f_report_gate()`;
      const barrierObjects = await prisma.$queryRaw<Array<{
        triggers: number; functions: number;
      }>>`
        SELECT (SELECT COUNT(*)::int FROM pg_trigger
                  WHERE tgname = 'soar_007f_report_gate') AS triggers,
               (SELECT COUNT(*)::int FROM pg_proc
                  WHERE proname = 'soar_007f_report_gate') AS functions`;
      expect(barrierObjects).toEqual([{ triggers: 0, functions: 0 }]);
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
});
