import { createHash, randomUUID } from 'node:crypto';
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { Exchange } from '@prisma/client';
import { createClient } from 'redis';
import { describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import { marketSequenceStrategyConfig } from './backtest011aMarketWitness.config';
import { fetchVerifiedIntrabarTimelineCandles } from './backtestIntrabarTimelineSource';
import { BacktestRunQueue } from './backtestRunQueue';
import { BACKTEST_LEASE_MS, commitClaimedBacktestRun,
  updateClaimedBacktestRun } from './backtestRunOwnership.repository';
import { readVerifiedRawTradeSnapshotV4ForRun } from './backtestRawTradeSource.repository';

const proofIt = process.env.RUN_011A_ALICE_RAW_V4_NATURAL_QUEUE_PROOF === '1'
  ? it : it.skip;
const symbol = 'ALICEUSDT';
const day = '2026-10-18';
const startTimeMs = Date.parse('2026-10-18T02:41:00.000Z');
const endTimeMs = Date.parse('2026-10-18T04:21:00.000Z');
const dcaTime = Date.parse('2026-10-18T02:46:47.639Z');
const ttpTime = Date.parse('2026-10-18T02:46:57.282Z');
const zipSha =
  'c90445e1b22111d993aef687d4bbea29bdb11de60c28e0219f035166a5486502';
const tapeSha =
  'cbe297350b5752f44ab499193b0dd108a5a43f561c5539f42821dae209a8806b';
const budget = { maxZipBytes: 399_792, maxCsvBytes: 1_694_239,
  maxSelectedTrades: 1_730, maxElapsedMs: 30_000 };
const wait = (ms: number) => new Promise((done) => setTimeout(done, ms));
const until = async (predicate: () => Promise<boolean>, timeoutMs: number) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await predicate()) return;
    await wait(250);
  }
  throw new Error('ALICE raw v4 queue proof timed out');
};

type ProofProcess = {
  child: ChildProcessWithoutNullStreams;
  events: Array<{ line: string; at: number }>;
  waitFor: (line: string, timeoutMs?: number) => Promise<number>;
};
const startWorker = (role: 'hold' | 'resume' | 'retry',
  queueName: string, runId: string, releaseFile?: string): ProofProcess => {
  const child = spawn(process.execPath, ['--import', 'tsx',
    resolve(process.cwd(),
      'src/modules/backtests/backtestRawTradeV4AliceNaturalQueue.worker.ts'),
  ], { cwd: process.cwd(), env: { ...process.env,
    WORKER_BACKTEST_QUEUE: queueName,
    SOAR_011A_ALICE_RAW_QUEUE_RUN_ID: runId,
    SOAR_011A_ALICE_RAW_QUEUE_ROLE: role,
    ...(releaseFile ? { SOAR_011A_ALICE_RAW_QUEUE_RELEASE_FILE: releaseFile } : {}),
  }, stdio: ['pipe', 'pipe', 'pipe'] });
  const events: ProofProcess['events'] = [];
  let buffer = '';
  child.stdout.on('data', (chunk: Buffer) => {
    buffer += chunk.toString();
    while (buffer.includes('\n')) {
      const end = buffer.indexOf('\n');
      events.push({ line: buffer.slice(0, end).trim(), at: Date.now() });
      buffer = buffer.slice(end + 1);
    }
  });
  child.stderr.on('data', (chunk: Buffer) =>
    events.push({ line: `STDERR:${chunk.toString().trim()}`, at: Date.now() }));
  return { child, events, waitFor: async (line, timeoutMs = 30_000) => {
    await until(async () => {
      if (events.some((event) => event.line === line)) return true;
      if (child.exitCode !== null || child.signalCode !== null)
        throw new Error(`ALICE worker exited early: ${events.map((event) =>
          event.line).join(' | ')}`);
      return false;
    }, timeoutMs);
    return events.find((event) => event.line === line)!.at;
  } };
};
const killOwnWorker = async (proof: ProofProcess) => {
  if (proof.child.exitCode !== null || proof.child.signalCode !== null) return;
  await new Promise<void>((done, reject) => {
    const timer = setTimeout(() => reject(new Error('Own ALICE worker did not stop')),
      5_000);
    proof.child.once('close', () => { clearTimeout(timer); done(); });
    if (!proof.child.kill('SIGKILL')) {
      clearTimeout(timer);
      reject(new Error('Could not kill own ALICE worker'));
    }
  });
};

describe('011A public ALICE raw v4 natural queue recovery (opt-in)', () => {
  proofIt('SIGKILL before result, automatic natural lease recovery and retry',
    async () => {
      const db = new URL(process.env.DATABASE_URL ?? '');
      const redisUrl = new URL(process.env.REDIS_URL ?? '');
      if (db.hostname !== '127.0.0.1' || db.port !== '62436' ||
          db.pathname !== '/soar_011a_alice_raw_natural_test' ||
          redisUrl.hostname !== '127.0.0.1' || redisUrl.port !== '62439' ||
          process.env.RUN_011A_RAW_V4_JOB_PROOF !== '1' ||
          BACKTEST_LEASE_MS !== 600_000)
        throw new Error('Requires exact own _test/Redis and default lease');
      const sourceDir = process.env.RUN_011A_ALICE_RAW_SOURCE_DIR;
      if (!sourceDir) throw new Error('Frozen ALICE source directory required');
      const basename = `${symbol}-trades-${day}.zip`;
      const zipBytes = readFileSync(join(sourceDir, basename));
      const checksumBytes = readFileSync(join(sourceDir, `${basename}.CHECKSUM`));
      const klineBytes = readFileSync(join(sourceDir,
        'ALICEUSDT-klines-0241-0421.json'));
      expect(zipBytes.length).toBe(budget.maxZipBytes);
      expect(createHash('sha256').update(zipBytes).digest('hex')).toBe(zipSha);
      expect(checksumBytes.toString().trim()).toBe(`${zipSha}  ${basename}`);
      expect(createHash('sha256').update(klineBytes).digest('hex'))
        .toBe('4738f1e447658e153413b01b32c07ad6f5d1791993e83404e611631caa698133');
      const rows = JSON.parse(klineBytes.toString()) as Array<Array<string | number>>;
      expect(rows).toHaveLength(100);
      expect(Number(rows[0][0])).toBe(startTimeMs);
      expect(Number(rows.at(-1)?.[6])).toBe(endTimeMs - 1);
      expect(rows.reduce((sum, row) => sum + Number(row[8]), 0)).toBe(1_730);

      const queueName = `backtest-011a-alice-raw-v4-natural-${randomUUID()}`;
      const releaseFile = join(tmpdir(), `soar-011a-alice-${randomUUID()}.release`);
      const redis = createClient({ url: redisUrl.toString() });
      const producer = new BacktestRunQueue(async () => undefined, {
        backend: 'redis', queueName, redisUrl: redisUrl.toString(),
      });
      const pendingKey = `soar:queue:${queueName}:pending`;
      const processingKey = `soar:queue:${queueName}:processing`;
      const dedupeKey = `soar:queue:${queueName}:dedupe`;
      const workers: ProofProcess[] = [];
      await redis.connect();
      expect(await redis.dbSize()).toBe(0);
      expect(await prisma.backtestRawTradeSourceBlob.count({
        where: { zipSha256: zipSha },
      })).toBe(0);
      const user = await prisma.user.create({ data: {
        email: `raw-v4-alice-natural-${randomUUID()}@example.test`,
        password: 'local-test-only',
      } });
      const strategy = await prisma.strategy.create({ data: {
        userId: user.id, name: 'Fixed ALICE raw natural recovery', interval: '1m',
        leverage: 1, walletRisk: 10, config: marketSequenceStrategyConfig,
      } });
      const run = await prisma.backtestRun.create({ data: {
        userId: user.id, strategyId: strategy.id,
        name: 'Fixed ALICE raw v4 natural queue recovery', symbol, timeframe: '1m',
        seedConfig: { symbols: [symbol], exchange: 'BINANCE',
          marketType: 'FUTURES', leverage: 1, marginMode: 'ISOLATED',
          initialBalance: 1_000, feeRate: 0.0004, slippageRate: 0,
          maxCandles: 100, startAt: new Date(startTimeMs).toISOString(),
          endAt: new Date(endTimeMs).toISOString(),
          intrabarSource: 'BINANCE_USDM_TRADES_V4_TEST_ONLY' },
      } });
      try {
        await producer.enqueue(run.id);
        await producer.stopWorker();
        expect(await redis.lRange(pendingKey, 0, -1)).toEqual([run.id]);
        const first = startWorker('hold', queueName, run.id);
        workers.push(first);
        await first.waitFor('SNAPSHOT_PERSISTED_BEFORE_SIMULATION');
        expect(first.events.filter((event) => event.line === 'SOURCE_LOADED_ONCE'))
          .toHaveLength(1);
        expect(first.events.filter((event) => event.line === 'JOB_INVOKED'))
          .toHaveLength(1);
        expect(first.events.some((event) => event.line === 'SIMULATE')).toBe(false);
        const held = await prisma.backtestRun.findUniqueOrThrow({
          where: { id: run.id },
        });
        const firstToken = held.executionToken;
        const leaseExpiresAt = held.executionLeaseExpiresAt?.getTime();
        expect(held.status).toBe('RUNNING');
        expect(firstToken).toBeTruthy();
        expect(leaseExpiresAt).toBeGreaterThan(Date.now() + BACKTEST_LEASE_MS - 30_000);
        const heldDigest = (held.seedConfig as Record<string, any>)
          .intrabarSourceDigestBySymbol?.[symbol] as string;
        expect(heldDigest).toMatch(/^[0-9a-f]{64}$/);
        const snapshot = await prisma.backtestIntrabarArchive.findUniqueOrThrow({
          where: { runId_symbol: { runId: run.id, symbol } },
        });
        expect((snapshot.payload as { version: number }).version).toBe(4);
        expect((snapshot.payload as { tapeSha256: string }).tapeSha256)
          .toBe(tapeSha);
        const refs = await prisma.backtestRawTradeSourceRef.findMany({
          where: { runId: run.id, symbol },
        });
        expect(refs).toHaveLength(1);
        expect(refs[0]).toMatchObject({ zipSha256: zipSha,
          tapeSha256: tapeSha, selectedTradeCount: 1_730 });
        const blob = await prisma.backtestRawTradeSourceBlob.findUniqueOrThrow({
          where: { zipSha256: zipSha },
        });
        expect(Buffer.from(blob.zipBytes)).toEqual(zipBytes);
        expect(Buffer.from(blob.checksumBytes)).toEqual(checksumBytes);
        expect(await prisma.backtestReport.count({
          where: { backtestRunId: run.id },
        })).toBe(0);
        expect(await prisma.backtestTrade.count({
          where: { backtestRunId: run.id },
        })).toBe(0);
        expect(await prisma.backtestContribution.count({
          where: { backtestRunId: run.id },
        })).toBe(0);
        expect(await redis.lRange(pendingKey, 0, -1)).toEqual([]);
        expect(await redis.lRange(processingKey, 0, -1)).toEqual([run.id]);
        expect(await redis.sIsMember(dedupeKey, run.id)).toBe(true);
        await killOwnWorker(first);
        expect(first.child.signalCode).toBe('SIGKILL');

        const second = startWorker('resume', queueName, run.id, releaseFile);
        workers.push(second);
        await second.waitFor('READY');
        expect(second.child.pid).not.toBe(first.child.pid);
        let lastPreExpiryReadAt = 0;
        let lastProgressAt = 0;
        const recoveryDeadline = leaseExpiresAt! + 90_000;
        while (!second.events.some((event) =>
          event.line === 'RECOVERY_CLAIMED_BEFORE_SIMULATION')) {
          const now = Date.now();
          if (now > recoveryDeadline)
            throw new Error(`ALICE raw recovery exceeded natural lease: ${
              second.events.map((event) => event.line).join(' | ')}`);
          if (now < leaseExpiresAt! - 1_000) {
            expect(second.events.some((event) => event.line === 'JOB_INVOKED'))
              .toBe(false);
            if (now - lastPreExpiryReadAt >= 30_000) {
              const current = await prisma.backtestRun.findUniqueOrThrow({
                where: { id: run.id },
              });
              expect(current.status).toBe('RUNNING');
              expect(current.executionToken).toBe(firstToken);
              expect(await redis.lRange(processingKey, 0, -1))
                .toEqual([run.id]);
              expect(await redis.sIsMember(dedupeKey, run.id)).toBe(true);
              lastPreExpiryReadAt = now;
            }
          }
          if (now - lastProgressAt >= 30_000) {
            console.log('ALICE_RAW_V4_NATURAL_WAIT', JSON.stringify({
              runId: run.id, remainingMs: Math.max(0, leaseExpiresAt! - now),
            }));
            lastProgressAt = now;
          }
          await wait(1_000);
        }
        const recoveredAt = second.events.find((event) =>
          event.line === 'RECOVERY_CLAIMED_BEFORE_SIMULATION')!.at;
        const jobInvokedAt = second.events.find((event) =>
          event.line === 'JOB_INVOKED')!.at;
        expect(lastPreExpiryReadAt).toBeGreaterThan(0);
        expect(jobInvokedAt).toBeGreaterThanOrEqual(leaseExpiresAt!);
        expect(recoveredAt).toBeGreaterThanOrEqual(leaseExpiresAt!);
        expect(recoveredAt - leaseExpiresAt!).toBeLessThanOrEqual(90_000);
        const takenOver = await prisma.backtestRun.findUniqueOrThrow({
          where: { id: run.id },
        });
        expect(takenOver.status).toBe('RUNNING');
        expect(takenOver.executionToken).toBeTruthy();
        expect(takenOver.executionToken).not.toBe(firstToken);
        expect(await updateClaimedBacktestRun(run.id, firstToken!, {
          name: 'STALE_TOKEN_MUST_NOT_WRITE',
        })).toBe(false);
        expect(await commitClaimedBacktestRun({
          runId: run.id, token: firstToken!, userId: user.id,
          status: 'COMPLETED', seedConfig: { stale: true },
          trades: [], contributions: [],
          report: { backtestRunId: run.id,
            create: { userId: user.id, backtestRunId: run.id,
              metrics: { stale: true } },
            update: { metrics: { stale: true } } },
        })).toBe(false);
        expect(await prisma.backtestReport.count({
          where: { backtestRunId: run.id },
        })).toBe(0);
        writeFileSync(releaseFile, 'release');
        await second.waitFor('JOB_RETURNED');
        await until(async () =>
          (await redis.lRange(pendingKey, 0, -1)).length === 0 &&
          (await redis.lRange(processingKey, 0, -1)).length === 0 &&
          !(await redis.sIsMember(dedupeKey, run.id)), 30_000);
        expect(second.events.filter((event) => event.line === 'JOB_INVOKED'))
          .toHaveLength(1);
        expect(second.events.filter((event) => event.line === 'SIMULATE'))
          .toHaveLength(1);
        expect(second.events.filter((event) => event.line ===
          'RAW_DCA_TTP_CONFIRMED')).toHaveLength(1);
        expect(second.events.some((event) => event.line === 'SOURCE_LOADED_ONCE'))
          .toBe(false);
        const completed = await prisma.backtestRun.findUniqueOrThrow({
          where: { id: run.id },
        });
        expect(completed.status).toBe('COMPLETED');
        expect(completed.executionToken).toBeNull();
        expect(completed.executionLeaseExpiresAt).toBeNull();
        expect((completed.seedConfig as Record<string, any>)
          .intrabarSourceDigestBySymbol[symbol]).toBe(heldDigest);
        const reports = await prisma.backtestReport.findMany({
          where: { backtestRunId: run.id },
        });
        const trades = await prisma.backtestTrade.findMany({
          where: { backtestRunId: run.id }, orderBy: { openedAt: 'asc' },
        });
        const contributions = await prisma.backtestContribution.findMany({
          where: { backtestRunId: run.id },
          orderBy: [{ tradeSequence: 'asc' }, { addSequence: 'asc' }],
        });
        expect(reports).toHaveLength(1);
        expect(reports[0].totalTrades).toBe(5);
        expect((reports[0].metrics as any).runLifecycle).toMatchObject({
          state: 'COMPLETED', reportReady: true,
        });
        expect(trades).toHaveLength(5);
        expect(contributions).toHaveLength(9);
        expect(contributions.filter((item) => item.kind === 'DCA')).toHaveLength(4);
        const targetDca = contributions.filter((item) =>
          item.kind === 'DCA' && item.tradeSequence === 1 &&
          item.candleIndex === 5 && item.timestamp.getTime() === dcaTime &&
          item.price === 0.1454);
        expect(targetDca).toHaveLength(1);
        const targetTtp = trades.filter((trade) => trade.exitReason === 'TTP' &&
          trade.closedAt.getTime() === ttpTime && trade.exitPrice === 0.1454);
        expect(targetTtp).toHaveLength(1);
        const feeTotal = trades.reduce((sum, trade) => sum + (trade.fee ?? 0), 0);
        expect(feeTotal).toBeCloseTo(0.72035, 8);
        expect(reports[0].netPnl).toBeCloseTo(-0.16687, 8);
        expect(reports[0].netPnl).toBeCloseTo(
          trades.reduce((sum, trade) => sum + trade.pnl, 0), 8);
        expect((reports[0].metrics as any).positionContributionCount).toBe(9);
        expect((reports[0].metrics as any).dcaContributionUsdtTotal).toBeCloseTo(
          contributions.filter((item) => item.kind === 'DCA')
            .reduce((sum, item) => sum + item.contributionUsdt, 0), 8);
        const finalSnapshot = await prisma.backtestIntrabarArchive.findUniqueOrThrow({
          where: { runId_symbol: { runId: run.id, symbol } },
        });
        expect(finalSnapshot.payloadSha256).toBe(snapshot.payloadSha256);
        expect(await prisma.backtestRawTradeSourceRef.count({
          where: { runId: run.id, symbol },
        })).toBe(1);
        const offline = await readVerifiedRawTradeSnapshotV4ForRun({
          runId: run.id, symbol, startTimeMs, endTimeMs,
          budget, expectedDigest: heldDigest,
        });
        expect(offline.candles).toHaveLength(100);
        const timeline = await fetchVerifiedIntrabarTimelineCandles({
          runId: run.id, exchange: Exchange.BINANCE, symbol, timeframe: '1m',
          marketType: 'FUTURES', maxCandles: 100, startTimeMs, endTimeMs,
          expectedDigest: heldDigest, rawTradeV4Budget: budget,
        });
        expect(timeline[5].intrabarTicks?.find((tick) =>
          tick.sequenceId === 394_796_061)).toMatchObject({
          eventTime: dcaTime, price: 0.1454,
        });
        expect(timeline[5].intrabarTicks?.find((tick) =>
          tick.sequenceId === 394_796_067)).toMatchObject({
          eventTime: ttpTime, price: 0.1454,
        });
        await killOwnWorker(second);
        await producer.enqueue(run.id); // Deliberate retry only after completion.
        await producer.stopWorker();
        const third = startWorker('retry', queueName, run.id);
        workers.push(third);
        await third.waitFor('JOB_RETURNED');
        await until(async () =>
          (await redis.lRange(pendingKey, 0, -1)).length === 0 &&
          (await redis.lRange(processingKey, 0, -1)).length === 0 &&
          !(await redis.sIsMember(dedupeKey, run.id)), 30_000);
        expect(third.events.filter((event) => event.line === 'JOB_INVOKED'))
          .toHaveLength(1);
        expect(third.events.some((event) => event.line === 'SIMULATE' ||
          event.line === 'SOURCE_LOADED_ONCE')).toBe(false);
        expect(await prisma.backtestRun.findUniqueOrThrow({
          where: { id: run.id },
        })).toEqual(completed);
        expect(await prisma.backtestReport.findMany({
          where: { backtestRunId: run.id },
        })).toEqual(reports);
        expect(await prisma.backtestTrade.findMany({
          where: { backtestRunId: run.id }, orderBy: { openedAt: 'asc' },
        })).toEqual(trades);
        expect(await prisma.backtestContribution.findMany({
          where: { backtestRunId: run.id },
          orderBy: [{ tradeSequence: 'asc' }, { addSequence: 'asc' }],
        })).toEqual(contributions);
        expect(await redis.dbSize()).toBe(0);
        console.log('ALICE_RAW_V4_NATURAL_QUEUE_PROOF', JSON.stringify({
          runId: run.id, firstPid: first.child.pid, secondPid: second.child.pid,
          thirdPid: third.child.pid, leaseExpiresAt,
          jobInvokedAt, recoveredAt, recoveryAfterLeaseMs: recoveredAt - leaseExpiresAt!,
          status: completed.status, reportId: reports[0].id,
          tradeCount: trades.length, contributionCount: contributions.length,
          feeTotal, netPnl: reports[0].netPnl, dcaRawId: 394_796_061,
          ttpRawId: 394_796_067,
        }));
      } finally {
        for (const worker of workers) await killOwnWorker(worker);
        if (existsSync(releaseFile)) unlinkSync(releaseFile);
        await producer.stopWorker();
        if (redis.isOpen) await redis.quit();
      }
    }, BACKTEST_LEASE_MS + 240_000);
});
