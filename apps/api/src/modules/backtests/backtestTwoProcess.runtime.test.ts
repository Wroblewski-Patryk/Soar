import { randomUUID } from 'node:crypto';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { resolve } from 'node:path';
import { createClient } from 'redis';
import { describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import { BacktestRunQueue } from './backtestRunQueue';

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

const startProofProcess = (role: string, queueName: string, runIds: string[]): ProofProcess => {
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

describe('real backtest worker process proof', () => {
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
      await prisma.backtestTrade.deleteMany({ where: { backtestRunId: run.id } });
      await prisma.backtestReport.deleteMany({ where: { backtestRunId: run.id } });
      await prisma.backtestRun.deleteMany({ where: { id: run.id } });
      if (orphanRunId) {
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
      await prisma.backtestTrade.deleteMany({ where: { backtestRunId: { in: runIds } } });
      await prisma.backtestReport.deleteMany({ where: { backtestRunId: { in: runIds } } });
      await prisma.backtestRun.deleteMany({ where: { id: { in: runIds } } });
      await prisma.user.delete({ where: { id: user.id } });
    }
  }, 60_000);
});
