import { randomUUID } from 'node:crypto';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { existsSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createClient } from 'redis';
import { describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import { BacktestRunQueue } from './backtestRunQueue';
import {
  BACKTEST_LEASE_MS, commitClaimedBacktestRun, listRecoverableBacktestRunIds,
  updateClaimedBacktestRun,
} from './backtestRunOwnership.repository';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const until = async (predicate: () => Promise<boolean>, timeoutMs: number) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await predicate()) return;
    await wait(250);
  }
  throw new Error('Timed out waiting for natural backtest lease recovery');
};

type ProofProcess = {
  child: ChildProcessWithoutNullStreams;
  events: Array<{ line: string; at: number }>;
  waitFor: (line: string) => Promise<number>;
};

const startProofProcess = (role: string, queueName: string, runId: string,
  releaseFile?: string): ProofProcess => {
  const child = spawn(process.execPath, [
    '--import', 'tsx',
    resolve(process.cwd(), 'src/modules/backtests/backtestProcessProof.worker.ts'),
  ], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      SOAR_BT_PROOF: '1', SOAR_BT_PROOF_ROLE: role,
      SOAR_BT_PROOF_QUEUE: queueName, SOAR_BT_PROOF_RUN_IDS: runId,
      ...(releaseFile ? { SOAR_BT_PROOF_RELEASE_FILE: releaseFile } : {}),
    },
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  const events: ProofProcess['events'] = [];
  let output = '';
  child.stdout.on('data', (chunk: Buffer) => {
    output += chunk.toString();
    while (output.includes('\n')) {
      const end = output.indexOf('\n');
      events.push({ line: output.slice(0, end).trim(), at: Date.now() });
      output = output.slice(end + 1);
    }
  });
  child.stderr.on('data', (chunk: Buffer) =>
    events.push({ line: `STDERR:${chunk.toString().trim()}`, at: Date.now() }));
  return {
    child, events,
    waitFor: async (line) => {
      await until(async () => {
        if (events.some((event) => event.line === line)) return true;
        if (child.exitCode !== null || child.signalCode !== null) {
          throw new Error(`Proof worker exited early: ${events.map((event) => event.line).join(' | ')}`);
        }
        return false;
      }, 30_000);
      return events.find((event) => event.line === line)!.at;
    },
  };
};

const stopProofProcess = async (proof: ProofProcess) => {
  if (proof.child.exitCode !== null || proof.child.signalCode !== null) return;
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timed out stopping proof worker')), 5_000);
    proof.child.once('close', () => { clearTimeout(timer); resolve(); });
    if (!proof.child.kill()) {
      clearTimeout(timer);
      reject(new Error('Could not stop proof worker'));
    }
  });
};

const config = {
  openConditions: { direction: 'long', noMatchAction: 'EXIT',
    indicatorsLong: [{ name: 'MOMENTUM', condition: '>', value: 0, params: { period: 1 } }],
    indicatorsShort: [] },
  close: { mode: 'basic', tp: 20, sl: 20 },
  additional: { dcaEnabled: true, dcaMode: 'basic', dcaTimes: 2,
    dcaSizingBasis: 'usdt_contribution_v1',
    dcaLevels: [{ percent: -30.5, multiplier: 2 }] },
};

const runtimeIt = process.env.RUN_BACKTEST_NATURAL_LEASE_PROOF === '1' ? it : it.skip;

describe('natural backtest lease recovery in separate processes', () => {
  runtimeIt('007I waits for the real 10-minute lease and default recovery scan', async () => {
    const databaseUrl = new URL(process.env.DATABASE_URL ?? '');
    const redisUrl = new URL(process.env.REDIS_URL ?? '');
    if (databaseUrl.pathname.slice(1) !== 'soar_007i_natural_lease_test' ||
        databaseUrl.hostname !== '127.0.0.1' || !databaseUrl.port || databaseUrl.port === '5432' ||
        redisUrl.hostname !== '127.0.0.1' || !redisUrl.port || redisUrl.port === '6379') {
      throw new Error('007I requires its own local _test database and Redis ports');
    }
    if (BACKTEST_LEASE_MS !== 10 * 60 * 1_000 || await prisma.user.count() !== 0) {
      throw new Error('007I requires the production lease and an empty disposable user dataset');
    }
    const queueName = `backtest-natural-lease-007i-${randomUUID()}`;
    const releaseFile = join(tmpdir(), `soar-007i-${randomUUID()}.release`);
    const user = await prisma.user.create({
      data: { email: `bt-natural-lease-${randomUUID()}@example.test`, password: 'test-only' },
    });
    const strategy = await prisma.strategy.create({ data: {
      userId: user.id, name: '007I natural lease strategy', interval: '1m',
      leverage: 1, walletRisk: 10, config,
    } });
    const run = await prisma.backtestRun.create({ data: {
      userId: user.id, strategyId: strategy.id, name: '007I natural lease recovery',
      symbol: 'BTCUSDT', timeframe: '1m',
      seedConfig: { symbols: ['BTCUSDT'], marketType: 'FUTURES', leverage: 1,
        marginMode: 'CROSSED', initialBalance: 10, maxCandles: 100,
        feeRate: 0, slippageRate: 0,
        contextSnapshot: { strategy: { id: strategy.id, walletRisk: 10, config } } },
    } });
    const redis = createClient({ url: redisUrl.toString() });
    const producer = new BacktestRunQueue(async () => undefined, {
      backend: 'redis', queueName, redisUrl: redisUrl.toString(),
    });
    const processes: ProofProcess[] = [];
    const pendingKey = `soar:queue:${queueName}:pending`;
    const processingKey = `soar:queue:${queueName}:processing`;
    const dedupeKey = `soar:queue:${queueName}:dedupe`;
    try {
      await redis.connect();
      await producer.enqueue(run.id);
      await producer.stopWorker();
      const first = startProofProcess('position-cycle-natural-lease-hold', queueName, run.id);
      processes.push(first);
      await first.waitFor('AFTER_BOTH_DCA_BEFORE_TP');
      expect(first.events.filter((event) => event.line === 'SIMULATE')).toHaveLength(1);
      const interruptedRun = await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } });
      const firstToken = interruptedRun.executionToken;
      const firstLeaseExpiresAt = interruptedRun.executionLeaseExpiresAt?.getTime();
      expect(interruptedRun.status).toBe('RUNNING');
      expect(firstToken).toBeTruthy();
      expect(firstLeaseExpiresAt).toBeGreaterThan(Date.now() + BACKTEST_LEASE_MS - 30_000);
      expect(await prisma.backtestTrade.count({ where: { backtestRunId: run.id } })).toBe(0);
      expect(await prisma.backtestReport.count({ where: { backtestRunId: run.id } })).toBe(0);
      expect(await prisma.backtestContribution.count({ where: { backtestRunId: run.id } })).toBe(0);
      expect(await redis.lRange(pendingKey, 0, -1)).toEqual([]);
      expect(await redis.lRange(processingKey, 0, -1)).toEqual([run.id]);
      expect(await redis.sIsMember(dedupeKey, run.id)).toBe(true);
      expect(await listRecoverableBacktestRunIds([run.id])).toEqual([]);

      await stopProofProcess(first);
      const second = startProofProcess('position-cycle-natural-lease-release',
        queueName, run.id, releaseFile);
      processes.push(second);
      await second.waitFor('READY');
      expect(second.child.pid).not.toBe(first.child.pid);
      const marker = 'AFTER_BOTH_DCA_BEFORE_TP';
      const recoveryDeadline = firstLeaseExpiresAt! + 90_000;
      let lastPreExpiryReadAt = 0;
      while (!second.events.some((event) => event.line === marker)) {
        if (Date.now() > recoveryDeadline) {
          throw new Error(`007I recovery exceeded natural lease plus 90s: ${second.events.map((event) => event.line).join(' | ')}`);
        }
        if (Date.now() < firstLeaseExpiresAt! - 1_000) {
          const current = await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } });
          expect(current.status).toBe('RUNNING');
          expect(current.executionToken).toBe(firstToken);
          expect(current.executionLeaseExpiresAt?.getTime()).toBe(firstLeaseExpiresAt);
          expect(await redis.lRange(processingKey, 0, -1)).toEqual([run.id]);
          expect(await redis.sIsMember(dedupeKey, run.id)).toBe(true);
          lastPreExpiryReadAt = Date.now();
        }
        await wait(1_000);
      }
      const recoveredAt = second.events.find((event) => event.line === marker)!.at;
      expect(lastPreExpiryReadAt).toBeGreaterThan(0);
      expect(recoveredAt).toBeGreaterThanOrEqual(firstLeaseExpiresAt!);
      expect(recoveredAt - firstLeaseExpiresAt!).toBeLessThanOrEqual(90_000);
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
      expect(await prisma.backtestTrade.count({ where: { backtestRunId: run.id } })).toBe(0);
      expect(await prisma.backtestReport.count({ where: { backtestRunId: run.id } })).toBe(0);
      expect(await prisma.backtestContribution.count({ where: { backtestRunId: run.id } })).toBe(0);
      console.log(`007I natural lease expired at ${new Date(firstLeaseExpiresAt!).toISOString()}; ` +
        `recovery checkpoint ${recoveredAt - firstLeaseExpiresAt!} ms later`);

      writeFileSync(releaseFile, 'release');
      await until(async () =>
        (await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } })).status === 'COMPLETED',
        30_000);
      await until(async () =>
        (await redis.lRange(processingKey, 0, -1)).length === 0 &&
        (await redis.lRange(pendingKey, 0, -1)).length === 0 &&
        !(await redis.sIsMember(dedupeKey, run.id)), 30_000);
      expect(second.events.filter((event) => event.line === 'JOB_INVOKED')).toHaveLength(1);
      expect(second.events.filter((event) => event.line === 'SIMULATE')).toHaveLength(1);
      const completedRun = await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } });
      const trades = await prisma.backtestTrade.findMany({ where: { backtestRunId: run.id } });
      const reports = await prisma.backtestReport.findMany({ where: { backtestRunId: run.id } });
      const fills = await prisma.backtestContribution.findMany({
        where: { backtestRunId: run.id }, orderBy: { addSequence: 'asc' },
      });
      expect(completedRun.executionToken).toBeNull();
      expect(trades).toHaveLength(1);
      expect(trades[0].exitReason).toBe('TP');
      expect(trades[0].exitPrice).toBeCloseTo(0.72, 6);
      expect(reports).toHaveLength(1);
      expect(reports[0].totalTrades).toBe(1);
      expect(reports[0].netPnl).toBeCloseTo(trades[0].pnl!, 6);
      expect(fills.map((fill) => [fill.kind, fill.addSequence, fill.candleIndex,
        fill.price])).toEqual([
        ['ENTRY', 0, 2, 1],
        ['DCA', 1, 3, 0.6949],
        ['DCA', 2, 4, 0.5375],
      ]);
      fills.forEach((fill, index) =>
        expect(fill.contributionUsdt).toBeCloseTo([1, 2, 6][index], 6));
      expect(await prisma.backtestRun.count({ where: { userId: user.id } })).toBe(1);

      await stopProofProcess(second);
      await producer.enqueue(run.id);
      await producer.stopWorker();
      const third = startProofProcess('position-cycle-natural-lease-recovery', queueName, run.id);
      processes.push(third);
      await third.waitFor('JOB_INVOKED');
      expect(third.child.pid).not.toBe(second.child.pid);
      await until(async () =>
        (await redis.lRange(processingKey, 0, -1)).length === 0 &&
        (await redis.lRange(pendingKey, 0, -1)).length === 0 &&
        !(await redis.sIsMember(dedupeKey, run.id)), 30_000);
      expect(third.events.some((event) => event.line === 'SIMULATE')).toBe(false);
      expect(await prisma.backtestRun.findUniqueOrThrow({ where: { id: run.id } }))
        .toEqual(completedRun);
      expect(await prisma.backtestTrade.findMany({ where: { backtestRunId: run.id } }))
        .toEqual(trades);
      expect(await prisma.backtestReport.findMany({ where: { backtestRunId: run.id } }))
        .toEqual(reports);
      expect(await prisma.backtestContribution.findMany({
        where: { backtestRunId: run.id }, orderBy: { addSequence: 'asc' },
      })).toEqual(fills);
    } finally {
      for (const proof of processes) await stopProofProcess(proof);
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
  }, BACKTEST_LEASE_MS + 240_000);
});
