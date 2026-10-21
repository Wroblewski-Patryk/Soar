import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { Prisma } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { digestVerifiedBinanceFuturesIntrabar } from './backtestBinanceFuturesIntrabarSource';
import { readVerifiedRunArchive } from './backtestBinanceFuturesIntrabarArchive';
import { resetBacktestDataGatewayCacheForTests,
  setDbCandleDelegateForTests } from './backtestDataGateway';
import { deleteOwnedBacktestRunCascade } from './backtests.repository';
import { getBacktestRunTimeline } from './backtests.controller';
import { createRun, getRunTimeline } from './backtests.service';
import { GetBacktestTimelineQuerySchema } from './backtests.types';

const start = Date.parse('2026-10-18T02:27:00.000Z');
const end = start + 100 * 60_000;
const runtimeIt = process.env.RUN_BACKTEST_ARCHIVE_FLOW_PROOF === '1' ? it : it.skip;
const waitForTerminal = async (runId: string) => {
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const run = await prisma.backtestRun.findUniqueOrThrow({ where: { id: runId } });
    if (['COMPLETED', 'FAILED'].includes(run.status)) return run;
    await new Promise((resolveWait) => setTimeout(resolveWait, 50));
  }
  throw new Error('Archived run did not finish within 20 seconds');
};

describe('archived strict backtest source on a private test database', () => {
  runtimeIt('persists a real checked archive and replays it from a new process', async () => {
    const db = new URL(process.env.DATABASE_URL ?? '');
    if (db.pathname.slice(1) !== 'soar_011a_archive_test' ||
        db.hostname !== '127.0.0.1' || !db.port || db.port === '5432' ||
        process.env.WORKER_BACKTEST_OWNERSHIP !== 'inline')
      throw new Error('Requires the dedicated isolated archive test database');
    resetBacktestDataGatewayCacheForTests();
    setDbCandleDelegateForTests({ findMany: async () => [],
      createMany: async () => ({ count: 0 }) });
    const user = await prisma.user.create({ data: {
      email: `archive-${randomUUID()}@example.test`, password: 'local-test-only',
    } });
    let runId: string | null = null;
    try {
      const created = await createRun(user.id, {
        name: 'Historical archived ALICEUSDT source', symbol: 'ALICEUSDT',
        timeframe: '1m', startAt: new Date(start), endAt: new Date(end),
        seedConfig: { maxCandles: 100, initialBalance: 10,
          intrabarSource: 'BINANCE_USDM_AGGTRADES_REQUIRED' },
      });
      if (!created) throw new Error('createRun returned null');
      runId = created.id;
      const run = await waitForTerminal(runId);
      expect(run.status).toBe('COMPLETED');
      const digest = (run.seedConfig as Record<string, any>)
        .intrabarSourceDigestBySymbol?.ALICEUSDT as string;
      expect(digest).toMatch(/^[0-9a-f]{64}$/);
      const record = await prisma.backtestIntrabarArchive.findUniqueOrThrow({
        where: { runId_symbol: { runId, symbol: 'ALICEUSDT' } },
      });
      expect((record.payload as Record<string, unknown>).version).toBe(3);
      expect((record.payload as { archives: Array<{ zipSha256: string }> }).archives[0].zipSha256)
        .toBe('4d0a9b007ae6b7a94073680ab37a968bb592c4529bffec1d68de8ef8f9db151b');
      const verified = await readVerifiedRunArchive(runId, 'ALICEUSDT', start, end);
      expect(verified).toHaveLength(100);
      expect(digestVerifiedBinanceFuturesIntrabar(verified!, 'ALICEUSDT')).toBe(digest);
      const child = spawnSync(process.execPath, ['--import', 'tsx',
        resolve(process.cwd(), 'src/modules/backtests/backtestArchiveReadProof.worker.ts'),
        runId, 'ALICEUSDT', String(start), String(end)], {
        cwd: process.cwd(), timeout: 20_000,
        env: { ...process.env, SOAR_ARCHIVE_READ_PROOF: '1' }, encoding: 'utf8',
      });
      expect(child.status, child.stderr).toBe(0);
      const proofLine = child.stdout.split(/\r?\n/).find((line) =>
        line.startsWith('{"digest":'));
      expect(proofLine).toBeTruthy();
      expect(JSON.parse(proofLine!)).toMatchObject({ digest, candles: 100 });
      const report = await prisma.backtestReport.findUniqueOrThrow({
        where: { backtestRunId: runId },
      });
      const trades = await prisma.backtestTrade.findMany({
        where: { backtestRunId: runId }, orderBy: { id: 'asc' },
      });
      expect((report.metrics as any).runLifecycle).toMatchObject({
        state: 'COMPLETED', reportReady: true,
      });
      const timeline = await getRunTimeline(user.id, runId,
        GetBacktestTimelineQuerySchema.parse({ symbol: 'ALICEUSDT' }));
      expect(timeline?.status).toBe('COMPLETED');
      expect(timeline?.totalCandles).toBe(100);

      // A changed stored source fails closed before timeline PnL is computed.
      await prisma.backtestIntrabarArchive.update({
        where: { runId_symbol: { runId, symbol: 'ALICEUSDT' } },
        data: { payload: { ...(record.payload as Record<string, unknown>),
          archives: [{ ...((record.payload as { archives: Record<string, unknown>[] })
            .archives[0]), zipSha256: '0'.repeat(64) }],
        } as Prisma.InputJsonValue },
      });
      await expect(getRunTimeline(user.id, runId,
        GetBacktestTimelineQuerySchema.parse({ symbol: 'ALICEUSDT' })))
        .rejects.toMatchObject({ code: 'SOURCE_CHANGED' });
      expect(await prisma.backtestTrade.count({ where: { backtestRunId: runId } }))
        .toBe(report.totalTrades);
      expect((await prisma.backtestReport.findUniqueOrThrow({
        where: { backtestRunId: runId },
      })).netPnl).toBe(report.netPnl);
      await prisma.backtestIntrabarArchive.delete({
        where: { runId_symbol: { runId, symbol: 'ALICEUSDT' } },
      });
      const network = vi.spyOn(globalThis, 'fetch').mockRejectedValue(
        new Error('NETWORK_FORBIDDEN_AFTER_ARCHIVE_REMOVAL'));
      try {
        await expect(getRunTimeline(user.id, runId,
          GetBacktestTimelineQuerySchema.parse({ symbol: 'ALICEUSDT' })))
          .rejects.toMatchObject({ code: 'SOURCE_UNAVAILABLE' });
        const response = { status: vi.fn().mockReturnThis(), json: vi.fn() };
        await getBacktestRunTimeline({ user: { id: user.id }, params: { id: runId },
          query: { symbol: 'ALICEUSDT' } } as any, response as any);
        expect(response.status).toHaveBeenCalledWith(409);
        expect(response.json).toHaveBeenCalledWith({ error: {
          message: 'Verified intrabar timeline unavailable',
          details: { code: 'SOURCE_UNAVAILABLE' },
        } });
        expect(network).not.toHaveBeenCalled();
      } finally { network.mockRestore(); }
      expect(await prisma.backtestTrade.findMany({
        where: { backtestRunId: runId }, orderBy: { id: 'asc' },
      })).toEqual(trades);
      expect(await prisma.backtestReport.findUniqueOrThrow({
        where: { backtestRunId: runId },
      })).toEqual(report);
    } finally {
      if (runId) await deleteOwnedBacktestRunCascade(user.id, runId);
      await prisma.user.delete({ where: { id: user.id } });
      resetBacktestDataGatewayCacheForTests();
    }
  }, 120_000);
});
