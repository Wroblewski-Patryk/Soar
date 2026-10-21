import { randomUUID } from 'node:crypto';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { resolve } from 'node:path';
import { createClient } from 'redis';
import { Prisma } from '@prisma/client';
import { describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import { backtestRunQueue, createRun, getRunTimeline } from './backtests.service';
import { deleteOwnedBacktestRunCascade } from './backtests.repository';
import { readVerifiedRunArchive } from './backtestBinanceFuturesIntrabarArchive';
import { marketSequenceStrategyConfig } from './backtest011aMarketWitness.config';
import { BACKTEST_LEASE_MS } from './backtestRunOwnership.repository';
import { GetBacktestTimelineQuerySchema } from './backtests.types';

const start = Date.parse('2026-10-18T02:27:00.000Z');
const end = start + 100 * 60_000;
const adjacentStart = Date.parse('2026-10-18T04:07:00.000Z');
const adjacentEnd = adjacentStart + 100 * 60_000;
const expectedZipSha =
  '4d0a9b007ae6b7a94073680ab37a968bb592c4529bffec1d68de8ef8f9db151b';
const strategyConfig = {
  openConditions: { direction: 'long',
    indicatorsLong: [{ name: 'MOMENTUM', condition: '>', value: -100,
      params: { period: 1 } }], indicatorsShort: [] },
  close: { mode: 'basic', tp: 0.1, sl: 0.1 },
  additional: { dcaEnabled: false, dcaTimes: 0 },
};
const sleep = (ms: number) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
const until = async (predicate: () => Promise<boolean>, timeoutMs = 30_000) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await predicate()) return;
    await sleep(100);
  }
  throw new Error('Timed out waiting for archived backtest process recovery');
};
type ProofProcess = {
  child: ChildProcessWithoutNullStreams;
  events: string[];
  eventTimes: Map<string, number[]>;
  waitFor: (marker: string, timeoutMs?: number) => Promise<void>;
};
const startWorker = (runId: string, role: 'hold' | 'resume'): ProofProcess => {
  const child = spawn(process.execPath, ['--import', 'tsx',
    resolve(process.cwd(), 'src/modules/backtests/backtestArchivedProcessProof.worker.ts'),
  ], {
    cwd: process.cwd(),
    env: { ...process.env, SOAR_ARCHIVED_PROCESS_PROOF: '1',
      SOAR_ARCHIVED_PROCESS_RUN_ID: runId, SOAR_ARCHIVED_PROCESS_ROLE: role },
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  const events: string[] = [];
  const eventTimes = new Map<string, number[]>();
  let buffer = '';
  child.stdout.on('data', (chunk: Buffer) => {
    buffer += chunk.toString();
    while (buffer.includes('\n')) {
      const at = buffer.indexOf('\n');
      const line = buffer.slice(0, at).trim();
      events.push(line);
      eventTimes.set(line, [...eventTimes.get(line) ?? [], Date.now()]);
      buffer = buffer.slice(at + 1);
    }
  });
  child.stderr.on('data', (chunk: Buffer) =>
    events.push(`STDERR:${chunk.toString().trim()}`));
  return { child, events, eventTimes, waitFor: async (marker, timeoutMs) =>
    until(async () => {
      if (events.includes(marker)) return true;
      if (child.exitCode !== null || child.signalCode !== null)
        throw new Error(`Worker exited early: ${events.join(' | ')}`);
      return false;
    }, timeoutMs) };
};
const stopWorker = async (proof: ProofProcess) => {
  if (proof.child.exitCode !== null || proof.child.signalCode !== null) return;
  await new Promise<void>((resolveStop, reject) => {
    const timer = setTimeout(() => reject(new Error('Worker did not stop')), 5_000);
    proof.child.once('close', () => { clearTimeout(timer); resolveStop(); });
    if (!proof.child.kill('SIGKILL')) {
      clearTimeout(timer);
      reject(new Error('Could not SIGKILL worker'));
    }
  });
};

type Variant = 'baseline' | 'changed' | 'missing' | 'market-sequence' |
  'adjacent-sequence';
const runProcessCase = async (variant: Variant, naturalLease: boolean) => {
  const adjacentSequence = variant === 'adjacent-sequence';
  const marketSequence = variant === 'market-sequence' || adjacentSequence;
  const windowStart = adjacentSequence ? adjacentStart : start;
  const windowEnd = adjacentSequence ? adjacentEnd : end;
  const db = new URL(process.env.DATABASE_URL ?? '');
  const redisUrl = new URL(process.env.REDIS_URL ?? '');
  const queueName = process.env.WORKER_BACKTEST_QUEUE ?? '';
  if (db.pathname.slice(1) !== 'soar_011a_archived_process_test' ||
      db.hostname !== '127.0.0.1' || !db.port || db.port === '5432' ||
      redisUrl.hostname !== '127.0.0.1' || !redisUrl.port || redisUrl.port === '6379' ||
      process.env.WORKER_BACKTEST_OWNERSHIP !== 'worker' ||
      !queueName.startsWith('backtest-011a-archived-process-'))
    throw new Error('Requires isolated PostgreSQL, Redis and worker queue');
  const user = await prisma.user.create({ data: {
    email: `archive-process-${variant}-${randomUUID()}@example.test`,
    password: 'local-test-only',
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
      userId: user.id, name: 'Archived process restart proof', interval: '1m',
      leverage: 1, walletRisk: 10,
      config: marketSequence ? marketSequenceStrategyConfig : strategyConfig,
    } });
    strategyId = strategy.id;
    const created = await createRun(user.id, {
      name: `Archived process ${variant}`, symbol: 'ALICEUSDT', timeframe: '1m',
      strategyId: strategy.id, startAt: new Date(windowStart), endAt: new Date(windowEnd),
      seedConfig: { maxCandles: 100, initialBalance: 1_000,
        feeRate: marketSequence ? 0.0004 : 0, slippageRate: 0,
        intrabarSource: 'BINANCE_USDM_AGGTRADES_REQUIRED' },
    });
    if (!created) throw new Error('createRun returned null');
    runId = created.id;
    expect(await redis.lRange(pendingKey, 0, -1)).toEqual([runId]);
    const first = startWorker(runId, 'hold');
    processes.push(first);
    await first.waitFor('ARCHIVE_DIGEST_PERSISTED_HOLD', 60_000);
    expect(first.events.filter((event) => event === 'ARCHIVE_CHECKSUM_FETCH')).toHaveLength(1);
    expect(first.events.filter((event) => event === 'ARCHIVE_ZIP_FETCH')).toHaveLength(1);
    const held = await prisma.backtestRun.findUniqueOrThrow({ where: { id: runId } });
    const firstDigest = (held.seedConfig as Record<string, any>)
      .intrabarSourceDigestBySymbol?.ALICEUSDT;
    expect(held.status).toBe('RUNNING');
    expect(held.executionToken).toBeTruthy();
    expect(firstDigest).toMatch(/^[0-9a-f]{64}$/);
    expect(held.executionLeaseExpiresAt?.getTime()).toBeGreaterThan(Date.now());
    const leaseExpiresAt = held.executionLeaseExpiresAt!.getTime();
    const originalArchive = await prisma.backtestIntrabarArchive.findUniqueOrThrow({
      where: { runId_symbol: { runId, symbol: 'ALICEUSDT' } },
    });
    expect((originalArchive.payload as Record<string, unknown>).zipSha256).toBe(expectedZipSha);
    expect(await redis.lRange(processingKey, 0, -1)).toEqual([runId]);
    expect(await redis.sIsMember(dedupeKey, runId)).toBe(true);
    expect(await prisma.backtestTrade.count({ where: { backtestRunId: runId } })).toBe(0);
    expect(await prisma.backtestReport.count({ where: { backtestRunId: runId } })).toBe(1);
    await stopWorker(first);

    if (variant === 'changed') {
      await prisma.backtestIntrabarArchive.update({
        where: { runId_symbol: { runId, symbol: 'ALICEUSDT' } },
        data: { payload: { ...(originalArchive.payload as Record<string, unknown>),
          zipSha256: '0'.repeat(64) } as Prisma.InputJsonValue },
      });
    } else if (variant === 'missing') {
      await prisma.backtestIntrabarArchive.delete({
        where: { runId_symbol: { runId, symbol: 'ALICEUSDT' } },
      });
    }
    if (!naturalLease) {
      // Only the disposable test run is advanced; no new submit or enqueue.
      await prisma.backtestRun.update({ where: { id: runId }, data: {
        executionLeaseExpiresAt: new Date(Date.now() - 1_000),
      } });
    }
    const second = startWorker(runId, 'resume');
    processes.push(second);
    if (naturalLease) {
      await second.waitFor('READY');
      await sleep(1_000);
      expect(second.events).not.toContain('JOB_INVOKED');
    }
    await second.waitFor('JOB_RETURNED', naturalLease ? BACKTEST_LEASE_MS + 90_000 : 45_000);
    await until(async () => (await redis.lRange(pendingKey, 0, -1)).length === 0 &&
      (await redis.lRange(processingKey, 0, -1)).length === 0 &&
      !(await redis.sIsMember(dedupeKey, runId!)));
    expect(second.child.pid).not.toBe(first.child.pid);
    expect(second.events.filter((event) => event === 'JOB_INVOKED')).toHaveLength(1);
    expect(second.events).not.toContain('ARCHIVE_ZIP_FETCH');
    expect(second.events).not.toContain('ARCHIVE_CHECKSUM_FETCH');
    if (naturalLease)
      expect(second.eventTimes.get('JOB_INVOKED')?.[0]).toBeGreaterThanOrEqual(leaseExpiresAt);
    const final = await prisma.backtestRun.findUniqueOrThrow({ where: { id: runId } });
    expect(final.id).toBe(runId);
    expect(final.executionToken).toBeNull();
    expect(await prisma.backtestRun.count({ where: { userId: user.id } })).toBe(1);
    const trades = await prisma.backtestTrade.findMany({ where: { backtestRunId: runId } });
    const contributions = await prisma.backtestContribution.findMany({
      where: { backtestRunId: runId },
    });
    const reports = await prisma.backtestReport.findMany({ where: { backtestRunId: runId } });
    expect(reports).toHaveLength(1);
    if (variant === 'baseline' || marketSequence) {
      expect(final.status).toBe('COMPLETED');
      expect((final.seedConfig as Record<string, any>)
        .intrabarSourceDigestBySymbol.ALICEUSDT).toBe(firstDigest);
      expect(second.events.filter((event) => event === 'SIMULATE')).toHaveLength(1);
      expect(await prisma.backtestIntrabarArchive.count({ where: { runId } })).toBe(1);
      expect(trades.length).toBeGreaterThan(0);
      expect(reports[0].totalTrades).toBe(trades.length);
      expect(reports[0].netPnl).toBeCloseTo(trades.reduce((sum, trade) =>
        sum + (trade.pnl ?? 0), 0), 6);
      expect((reports[0].metrics as any).runLifecycle).toMatchObject({
        state: 'COMPLETED', reportReady: true,
      });
      const timeline = await getRunTimeline(user.id, runId,
        GetBacktestTimelineQuerySchema.parse({ symbol: 'ALICEUSDT' }));
      expect(timeline?.status).toBe('COMPLETED');
      expect(timeline?.totalCandles).toBe(98);
      expect(timeline?.events.filter((event) =>
        event.type !== 'ENTRY' && event.type !== 'DCA').length).toBe(trades.length);
      expect(trades.filter((trade) => trade.exitReason === 'SIGNAL_EXIT')).toHaveLength(0);
      if (marketSequence) {
        const archived = await readVerifiedRunArchive(runId, 'ALICEUSDT',
          windowStart, windowEnd);
        if (!archived || !timeline) throw new Error('Verified public archive or timeline missing');
        const dcaEvents = timeline.events.filter((event) => event.type === 'DCA');
        const ttpEvents = timeline.events.filter((event) => event.type === 'TTP');
        const pairs = dcaEvents.map((dca) => ({ dca,
          ttp: ttpEvents.find((ttp) => ttp.tradeId === dca.tradeId &&
            Date.parse(ttp.timestamp) > Date.parse(dca.timestamp)) }))
          .filter((candidate) => candidate.ttp);
        process.stdout.write(`PUBLIC_MARKET_SEQUENCE_PROBE ${JSON.stringify({
          windowStart: new Date(windowStart).toISOString(),
          digest: firstDigest, trades: trades.length,
          dcaEvents: dcaEvents.length, ttpEvents: ttpEvents.length,
          pairs: pairs.map(({ dca, ttp }) => ({
            dca: { timestamp: dca.timestamp, candleIndex: dca.candleIndex, price: dca.price },
            ttp: { timestamp: ttp!.timestamp, candleIndex: ttp!.candleIndex,
              price: ttp!.price },
          })),
        })}\n`);
        if (adjacentSequence) {
          expect(dcaEvents).toHaveLength(1);
          expect(ttpEvents).toHaveLength(0);
          expect(pairs).toHaveLength(0);
          expect(trades).toHaveLength(1);
          expect(contributions).toHaveLength(2);
          const dca = dcaEvents[0];
          expect(dca.timestamp).toBe('2026-10-18T04:11:02.745Z');
          expect(dca.price).toBe(0.1463);
          const candle = timeline.candles.find((entry) =>
            entry.candleIndex === dca.candleIndex);
          const sourceIndex = archived.findIndex((entry) =>
            entry.openTime === Date.parse(candle?.openTime ?? ''));
          expect(sourceIndex).toBe(4);
          const source = archived[sourceIndex];
          const sourceTick = source.intrabarTicks.find((tick) =>
            tick.eventTime === Date.parse(dca.timestamp) && tick.price === dca.price);
          expect(sourceTick?.sequenceId).toBe(167050730);
          const laterAggregatesOnDcaCandle = source.intrabarTicks.filter((tick) =>
            (tick.sequenceId ?? -1) > sourceTick!.sequenceId!).length;
          expect(laterAggregatesOnDcaCandle).toBe(7);
          const entry = contributions.find((row) => row.kind === 'ENTRY');
          const add = contributions.find((row) => row.kind === 'DCA');
          expect(entry).toBeDefined();
          expect(add).toBeDefined();
          expect(add!.tradeSequence).toBe(entry!.tradeSequence);
          expect(add!.timestamp.getTime()).toBe(Date.parse(dca.timestamp));
          expect(add!.candleIndex).toBe(sourceIndex);
          expect(add!.levelIndex).toBe(0);
          expect(add!.multiplier).toBe(1);
          expect(add!.contributionUsdt).toBeCloseTo(entry!.contributionUsdt, 6);
          const trade = trades[0];
          const quantity = entry!.quantity + add!.quantity;
          const cost = entry!.contributionUsdt + add!.contributionUsdt;
          const roundSettlement = (value: number) => Math.round(value * 100_000) / 100_000;
          const fee = 0.0004 * trade.quantity * (trade.entryPrice + trade.exitPrice);
          expect(trade.exitReason).toBe('FINAL_CANDLE');
          expect(trade.closedAt.getTime()).toBe(adjacentEnd - 1);
          expect(trade.quantity).toBeCloseTo(quantity, 8);
          expect(trade.entryPrice).toBeCloseTo(cost / quantity, 8);
          expect(trade.fee).toBe(roundSettlement(fee));
          expect(trade.fee).toBe(0.15902);
          expect(trade.pnl).toBeCloseTo(roundSettlement(
            (trade.exitPrice - trade.entryPrice) * trade.quantity) -
            roundSettlement(fee), 8);
          expect(trade.pnl).toBe(-2.62131);
          expect(reports[0].netPnl).toBe(trade.pnl);
          expect(timeline.events.filter((event) =>
            event.type !== 'ENTRY' && event.type !== 'DCA'))
            .toMatchObject([{ type: 'EXIT', timestamp: trade.closedAt.toISOString(),
              price: trade.exitPrice }]);
          const replay = await getRunTimeline(user.id, runId,
            GetBacktestTimelineQuerySchema.parse({ symbol: 'ALICEUSDT' }));
          expect(replay?.events).toEqual(timeline.events);
          process.stdout.write(`PUBLIC_ADJACENT_MARKET_RESULT ${JSON.stringify({
            digest: firstDigest, sourceAggregateId: sourceTick!.sequenceId,
            dcaTime: dca.timestamp, dcaPrice: dca.price,
            laterAggregatesOnDcaCandle,
            entryUsdt: entry!.contributionUsdt, dcaUsdt: add!.contributionUsdt,
            averageEntry: trade.entryPrice, quantity: trade.quantity,
            closeTime: trade.closedAt.toISOString(), closePrice: trade.exitPrice,
            fee: trade.fee, netPnl: trade.pnl, ttpEvents: ttpEvents.length,
          })}\n`);
          return;
        }
        expect(trades).toHaveLength(4);
        expect(dcaEvents).toHaveLength(3);
        expect(ttpEvents).toHaveLength(3);
        expect(reports[0].netPnl).toBeCloseTo(-0.42076, 5);
        expect(pairs).toHaveLength(3);
        expect(pairs.filter(({ dca, ttp }) =>
          ttp!.candleIndex === dca.candleIndex)).toHaveLength(0);
        const accountingSamples: Array<Record<string, number>> = [];
        for (const { dca, ttp: close } of pairs) {
          const ttp = close!;
          expect(ttp.candleIndex).toBeGreaterThan(dca.candleIndex);
          const dcaCandle = timeline.candles.find((entry) =>
            entry.candleIndex === dca.candleIndex);
          const sourceIndex = archived.findIndex((entry) =>
            entry.openTime === Date.parse(dcaCandle?.openTime ?? ''));
          expect(sourceIndex).toBeGreaterThanOrEqual(0);
          const source = archived[sourceIndex];
          const dcaTick = source.intrabarTicks.find((tick) =>
            tick.eventTime === Date.parse(dca.timestamp) && tick.price === dca.price);
          expect(dcaTick?.sequenceId).toBeDefined();
          const add = contributions.find((row) => row.kind === 'DCA' &&
            row.candleIndex === sourceIndex &&
            row.timestamp.getTime() === Date.parse(dca.timestamp));
          expect(add).toBeDefined();
          const entry = contributions.find((row) => row.kind === 'ENTRY' &&
            row.tradeSequence === add?.tradeSequence);
          expect(entry).toBeDefined();
          expect(add!.levelIndex).toBe(0);
          expect(add!.multiplier).toBe(1);
          expect(add!.contributionUsdt).toBeCloseTo(entry!.contributionUsdt, 6);
          const closed = trades.find((row) => row.exitReason === 'TTP' &&
            row.closedAt.getTime() === Date.parse(ttp.timestamp));
          expect(closed).toBeDefined();
          const quantity = entry!.quantity + add!.quantity;
          const cost = entry!.contributionUsdt + add!.contributionUsdt;
          const expectedFee = 0.0004 * closed!.quantity *
            (closed!.entryPrice + closed!.exitPrice);
          const roundSettlement = (value: number) => Math.round(value * 100_000) / 100_000;
          expect(closed!.quantity).toBeCloseTo(quantity, 8);
          expect(closed!.entryPrice).toBeCloseTo(cost / quantity, 8);
          expect(closed!.fee).toBe(roundSettlement(expectedFee));
          expect(closed!.pnl).toBeCloseTo(roundSettlement(
            (closed!.exitPrice - closed!.entryPrice) * closed!.quantity) -
            roundSettlement(expectedFee), 8);
          expect(dca.price).toBe(add!.price);
          expect(ttp.price).toBe(closed!.exitPrice);
          const ttpCandle = timeline.candles.find((entry) =>
            entry.candleIndex === ttp.candleIndex);
          expect(ttp.timestamp).toBe(ttpCandle?.closeTime);
          expect(ttp.price).toBe(ttpCandle?.close);
          accountingSamples.push({
            sourceAggregateId: dcaTick!.sequenceId!,
            laterAggregatesOnDcaCandle: source.intrabarTicks.filter((tick) =>
              (tick.sequenceId ?? -1) > dcaTick!.sequenceId!).length,
            entryUsdt: entry!.contributionUsdt, dcaUsdt: add!.contributionUsdt,
            averageEntry: closed!.entryPrice, quantity: closed!.quantity,
            fee: closed!.fee ?? 0, pnl: closed!.pnl,
          });
        }
        expect(accountingSamples.map((sample) =>
          sample.laterAggregatesOnDcaCandle)).toEqual([0, 8, 0]);
        expect(accountingSamples.map((sample) => sample.sourceAggregateId))
          .toEqual([167049888, 167050085, 167050444]);
        process.stdout.write(`PUBLIC_MARKET_ACCOUNTING ${JSON.stringify({
          reportNetPnl: reports[0].netPnl, samples: accountingSamples,
        })}\n`);
        const replay = await getRunTimeline(user.id, runId,
          GetBacktestTimelineQuerySchema.parse({ symbol: 'ALICEUSDT' }));
        expect(replay?.events).toEqual(timeline.events);
      }
    } else {
      expect(final.status).toBe('FAILED');
      expect((final.seedConfig as Record<string, any>).error).toContain(
        variant === 'changed' ? 'BACKTEST_INTRABAR_ARCHIVE_SNAPSHOT_CHANGED' :
          'BACKTEST_INTRABAR_ARCHIVE_SNAPSHOT_MISSING_ON_RETRY');
      expect(second.events).not.toContain('SIMULATE');
      expect(trades).toHaveLength(0);
      expect(contributions).toHaveLength(0);
      expect(reports[0].netPnl).toBeNull();
      expect((reports[0].metrics as any).runLifecycle).toMatchObject({
        state: 'FAILED', reportReady: false,
      });
      await expect(getRunTimeline(user.id, runId,
        GetBacktestTimelineQuerySchema.parse({ symbol: 'ALICEUSDT' })))
        .rejects.toMatchObject({ code: 'RUN_NOT_COMPLETED' });
    }
  } finally {
    for (const processProof of processes) await stopWorker(processProof);
    await backtestRunQueue.stopWorker();
    if (redis.isOpen) {
      await redis.del([pendingKey, processingKey, dedupeKey]);
      await redis.quit();
    }
    if (runId) await deleteOwnedBacktestRunCascade(user.id, runId);
    if (strategyId) await prisma.strategy.delete({ where: { id: strategyId } });
    await prisma.user.delete({ where: { id: user.id } });
  }
};

const runtimeIt = process.env.RUN_BACKTEST_ARCHIVED_PROCESS_PROOF === '1' ? it : it.skip;
describe('real archived intrabar job recovery across processes', () => {
  runtimeIt.each(['baseline', 'changed', 'missing'] as const)(
    'recovers the same archived run without a second source fetch: %s',
    async (variant) => runProcessCase(variant, false), 120_000);
  const naturalIt = process.env.RUN_BACKTEST_ARCHIVED_NATURAL_LEASE_PROOF === '1' ? it : it.skip;
  naturalIt('waits for the real lease before resuming the same archived run',
    async () => runProcessCase('baseline', true), BACKTEST_LEASE_MS + 180_000);
  const marketIt = process.env.RUN_BACKTEST_REAL_MARKET_SEQUENCE_PROBE === '1' ? it : it.skip;
  marketIt('records separate-candle DCA and TTP for the predeclared public tape',
    async () => runProcessCase('market-sequence', false), 120_000);
  const adjacentIt = process.env.RUN_BACKTEST_ADJACENT_MARKET_SEQUENCE_PROBE === '1'
    ? it : it.skip;
  adjacentIt('records DCA without TTP on predeclared adjacent public tape',
    async () => runProcessCase('adjacent-sequence', false), 120_000);
});
