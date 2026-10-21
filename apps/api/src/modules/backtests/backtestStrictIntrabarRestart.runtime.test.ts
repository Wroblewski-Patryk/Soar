import { randomUUID } from 'node:crypto';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { resolve } from 'node:path';
import { createClient } from 'redis';
import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../../prisma/client';
import { resetBacktestDataGatewayCacheForTests,
  setDbCandleDelegateForTests } from './backtestDataGateway';
import { backtestRunQueue, createRun, getRunTimeline } from './backtests.service';
import { deleteOwnedBacktestRunCascade } from './backtests.repository';
import { GetBacktestTimelineQuerySchema } from './backtests.types';
import { STRICT_PROOF_CANDLE_COUNT } from './backtestStrictIntrabarProcessFixture';

const proof = vi.hoisted(() => ({ start: 0 }));

vi.mock('../exchange/exchangePublicMarketData.service', async () => {
  const { strictProofCandles } = await import('./backtestStrictIntrabarProcessFixture');
  return {
    fetchExchangePublicRecentCandles: vi.fn(async ({ since, limit }: {
      since: number; limit: number;
    }) => strictProofCandles(proof.start, 'baseline')
      .filter((candle) => candle.openTime >= since).slice(0, limit)
      .map((candle) => ({ ...candle, raw: [] }))),
    fetchExchangePublicFundingRateHistory: vi.fn(async () => []),
    fetchExchangePublicOpenInterestHistory: vi.fn(async () => []),
  };
});

vi.mock('../exchange/binancePublicRest.service', async () => {
  const { strictProofPage, strictProofRows } =
    await import('./backtestStrictIntrabarProcessFixture');
  return { fetchBinancePublicRestJson: vi.fn(async ({ path, searchParams }: {
    path: string; searchParams: URLSearchParams;
  }) => {
    if (path !== '/fapi/v1/aggTrades') return [];
    const fromId = searchParams.get('fromId');
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');
    return strictProofPage(strictProofRows(proof.start, 'baseline'), {
      limit: Number(searchParams.get('limit')),
      ...(fromId !== null ? { fromId: Number(fromId) } :
        { startTime: Number(startTime), endTime: Number(endTime) }),
    });
  }) };
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const until = async (predicate: () => Promise<boolean>, timeoutMs = 30_000) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await predicate()) return;
    await wait(50);
  }
  throw new Error('Timed out waiting for strict intrabar process recovery');
};

type ProofProcess = {
  child: ChildProcessWithoutNullStreams;
  events: string[];
  waitFor: (marker: string) => Promise<void>;
};

const startProofProcess = (runId: string, role: 'hold' | 'resume',
  variant: 'baseline' | 'changed' | 'gap'): ProofProcess => {
  const child = spawn(process.execPath, ['--import', 'tsx',
    resolve(process.cwd(), 'src/modules/backtests/backtestStrictIntrabarProcessProof.worker.ts'),
  ], {
    cwd: process.cwd(),
    env: { ...process.env, SOAR_STRICT_PROCESS_PROOF: '1',
      SOAR_STRICT_PROOF_RUN_ID: runId, SOAR_STRICT_PROOF_ROLE: role,
      SOAR_STRICT_PROOF_SOURCE_VARIANT: variant },
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  const events: string[] = [];
  let buffer = '';
  child.stdout.on('data', (chunk: Buffer) => {
    buffer += chunk.toString();
    while (buffer.includes('\n')) {
      const at = buffer.indexOf('\n');
      events.push(buffer.slice(0, at).trim());
      buffer = buffer.slice(at + 1);
    }
  });
  child.stderr.on('data', (chunk: Buffer) =>
    events.push(`STDERR:${chunk.toString().trim()}`));
  return { child, events, waitFor: async (marker) => until(async () => {
    if (events.includes(marker)) return true;
    if (child.exitCode !== null || child.signalCode !== null)
      throw new Error(`Proof process exited early: ${events.join(' | ')}`);
    return false;
  }) };
};

const stopProofProcess = async (proof: ProofProcess) => {
  if (proof.child.exitCode !== null || proof.child.signalCode !== null) return;
  await new Promise<void>((resolveStop, reject) => {
    const timer = setTimeout(() => reject(new Error('Proof process did not stop')), 5_000);
    proof.child.once('close', () => { clearTimeout(timer); resolveStop(); });
    if (!proof.child.kill('SIGKILL')) {
      clearTimeout(timer);
      reject(new Error('Could not kill proof process'));
    }
  });
};

const strategyConfig = {
  openConditions: { direction: 'long',
    indicatorsLong: [{ name: 'MOMENTUM', condition: '>', value: 0,
      params: { period: 1 } }], indicatorsShort: [] },
  close: { mode: 'basic', tp: 20, sl: 99 },
  additional: { dcaEnabled: false, dcaTimes: 0 },
};

const runtimeIt = process.env.RUN_BACKTEST_STRICT_INTRABAR_PROCESS_PROOF === '1' ? it : it.skip;

describe('strict historical intrabar restart in separate worker processes', () => {
  runtimeIt.each(['baseline', 'changed', 'gap'] as const)(
    'recovers the same strict run after OS interruption: %s', async (variant) => {
      const db = new URL(process.env.DATABASE_URL ?? '');
      const redisUrl = new URL(process.env.REDIS_URL ?? '');
      const queueName = process.env.WORKER_BACKTEST_QUEUE ?? '';
      if (db.pathname.slice(1) !== 'soar_011a_restart_test' ||
          db.hostname !== '127.0.0.1' || db.port === '5432' || !db.port ||
          redisUrl.hostname !== '127.0.0.1' || redisUrl.port === '6379' || !redisUrl.port ||
          process.env.WORKER_BACKTEST_OWNERSHIP !== 'worker' ||
          !queueName.startsWith('backtest-011a-process-'))
        throw new Error('Requires own isolated PostgreSQL, Redis and worker queue');
      proof.start = Math.floor(Date.now() / 60_000) * 60_000 -
        (STRICT_PROOF_CANDLE_COUNT + 3) * 60_000;
      resetBacktestDataGatewayCacheForTests();
      setDbCandleDelegateForTests({ findMany: async () => [],
        createMany: async () => ({ count: 0 }) });
      const user = await prisma.user.create({ data: {
        email: `strict-restart-${variant}-${randomUUID()}@example.test`, password: 'test-only',
      } });
      const redis = createClient({ url: redisUrl.toString() });
      const processes: ProofProcess[] = [];
      const pendingKey = `soar:queue:${queueName}:pending`;
      const processingKey = `soar:queue:${queueName}:processing`;
      const dedupeKey = `soar:queue:${queueName}:dedupe`;
      let strategyId: string | null = null;
      let runId: string | null = null;
      try {
        await redis.connect();
        const strategy = await prisma.strategy.create({ data: {
          userId: user.id, name: 'Strict restart source proof', interval: '1m',
          leverage: 1, walletRisk: 10, config: strategyConfig,
        } });
        strategyId = strategy.id;
        const created = await createRun(user.id, {
          name: `Strict process ${variant}`, symbol: 'BTCUSDT', timeframe: '1m',
          strategyId: strategy.id,
          startAt: new Date(proof.start),
          endAt: new Date(proof.start + STRICT_PROOF_CANDLE_COUNT * 60_000),
          seedConfig: { maxCandles: STRICT_PROOF_CANDLE_COUNT, initialBalance: 10,
            feeRate: 0, slippageRate: 0,
            intrabarSource: 'BINANCE_USDM_AGGTRADES_REQUIRED' },
        });
        if (!created) throw new Error('createRun returned null');
        runId = created.id;
        expect(await redis.lRange(pendingKey, 0, -1)).toEqual([runId]);
        const first = startProofProcess(runId, 'hold', 'baseline');
        processes.push(first);
        await first.waitFor('DIGEST_PERSISTED_HOLD');
        const held = await prisma.backtestRun.findUniqueOrThrow({ where: { id: runId } });
        const oldToken = held.executionToken;
        const firstDigest = (held.seedConfig as Record<string, any>)
          .intrabarSourceDigestBySymbol?.BTCUSDT;
        expect(held.status).toBe('RUNNING');
        expect(oldToken).toBeTruthy();
        expect(held.executionLeaseExpiresAt?.getTime()).toBeGreaterThan(Date.now());
        expect(firstDigest).toMatch(/^[0-9a-f]{64}$/);
        expect(await redis.lRange(processingKey, 0, -1)).toEqual([runId]);
        expect(await redis.sIsMember(dedupeKey, runId)).toBe(true);
        expect(await prisma.backtestTrade.count({ where: { backtestRunId: runId } })).toBe(0);
        expect(await prisma.backtestContribution.count({ where: { backtestRunId: runId } })).toBe(0);
        await stopProofProcess(first);

        // Test-only fast-forward on this disposable run. The replacement worker
        // discovers the expired claim itself; no new run or manual enqueue.
        await prisma.backtestRun.update({ where: { id: runId }, data: {
          executionLeaseExpiresAt: new Date(Date.now() - 1_000),
        } });
        const second = startProofProcess(runId, 'resume', variant);
        processes.push(second);
        await second.waitFor('JOB_RETURNED');
        await until(async () => (await redis.lRange(pendingKey, 0, -1)).length === 0 &&
          (await redis.lRange(processingKey, 0, -1)).length === 0 &&
          !(await redis.sIsMember(dedupeKey, runId!)));
        const finalRun = await prisma.backtestRun.findUniqueOrThrow({ where: { id: runId } });
        expect(finalRun.executionToken).toBeNull();
        expect(finalRun.id).toBe(runId);
        expect(await prisma.backtestRun.count({ where: { userId: user.id } })).toBe(1);
        expect(second.events.filter((event) => event === 'JOB_INVOKED')).toHaveLength(1);
        expect(second.child.pid).not.toBe(first.child.pid);
        const reports = await prisma.backtestReport.findMany({ where: { backtestRunId: runId } });
        const trades = await prisma.backtestTrade.findMany({ where: { backtestRunId: runId } });
        const contributions = await prisma.backtestContribution.findMany({
          where: { backtestRunId: runId },
        });
        expect(reports).toHaveLength(1);
        if (variant === 'baseline') {
          expect(finalRun.status).toBe('COMPLETED');
          expect((finalRun.seedConfig as Record<string, any>)
            .intrabarSourceDigestBySymbol.BTCUSDT).toBe(firstDigest);
          expect(second.events.filter((event) => event === 'SIMULATE')).toHaveLength(1);
          expect(trades).toHaveLength(1);
          expect(contributions).toHaveLength(1);
          expect(reports[0].netPnl).toBeCloseTo(trades[0].pnl!, 6);
          expect((reports[0].metrics as any).runLifecycle).toMatchObject({
            state: 'COMPLETED', reportReady: true,
          });
          const timeline = await getRunTimeline(user.id, runId,
            GetBacktestTimelineQuerySchema.parse({ symbol: 'BTCUSDT' }));
          expect(timeline?.status).toBe('COMPLETED');
          expect(timeline?.events.filter((event) => event.type === 'ENTRY')).toHaveLength(1);
          const timelineClose = timeline?.events.filter((event) => event.type === 'TP');
          expect(timelineClose).toHaveLength(1);
          expect(trades[0].exitReason).toBe('TP');
          expect(timelineClose?.[0].price).toBeCloseTo(trades[0].exitPrice!, 6);
          expect(timelineClose?.[0].pnl).toBeCloseTo(reports[0].netPnl!, 6);
        } else {
          expect(finalRun.status).toBe('FAILED');
          expect((finalRun.seedConfig as Record<string, any>).error).toContain(
            variant === 'changed' ? 'BACKTEST_INTRABAR_SOURCE_CHANGED_ON_RETRY' :
              'BACKTEST_INTRABAR_SOURCE_SEQUENCE_GAP');
          expect(trades).toHaveLength(0);
          expect(contributions).toHaveLength(0);
          expect(reports[0].netPnl).toBeNull();
          expect((reports[0].metrics as any).runLifecycle).toMatchObject({
            state: 'FAILED', reportReady: false,
          });
          expect(second.events).not.toContain('SIMULATE');
          await expect(getRunTimeline(user.id, runId,
            GetBacktestTimelineQuerySchema.parse({ symbol: 'BTCUSDT' })))
            .rejects.toMatchObject({ code: 'RUN_NOT_COMPLETED' });
        }
      } finally {
        for (const processProof of processes) await stopProofProcess(processProof);
        await backtestRunQueue.stopWorker();
        if (redis.isOpen) {
          await redis.del([pendingKey, processingKey, dedupeKey]);
          await redis.quit();
        }
        if (runId) await deleteOwnedBacktestRunCascade(user.id, runId);
        if (strategyId) await prisma.strategy.delete({ where: { id: strategyId } });
        await prisma.user.delete({ where: { id: user.id } });
        resetBacktestDataGatewayCacheForTests();
      }
    }, 120_000);
});
