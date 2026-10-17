import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import {
  claimBacktestRun,
  commitClaimedBacktestRun,
  listRecoverableBacktestRunIds,
  renewBacktestRunLease,
  updateClaimedBacktestRun,
} from './backtestRunOwnership.repository';

const withRun = async (test: (runId: string, userId: string) => Promise<void>) => {
  const databaseName = new URL(process.env.DATABASE_URL ?? '').pathname.slice(1);
  if (!databaseName.endsWith('_test')) throw new Error('Refusing to mutate a non-test database');
  const user = await prisma.user.create({
    data: { email: `backtest-lease-${randomUUID()}@example.test`, password: 'test-only' },
  });
  const run = await prisma.backtestRun.create({
    data: {
      userId: user.id,
      name: 'Lease test',
      symbol: 'BTCUSDT',
      timeframe: '1m',
      seedConfig: { symbols: ['BTCUSDT'] },
    },
  });
  try {
    await test(run.id, user.id);
  } finally {
    await prisma.backtestTrade.deleteMany({ where: { backtestRunId: run.id } });
    await prisma.backtestReport.deleteMany({ where: { backtestRunId: run.id } });
    await prisma.backtestRun.deleteMany({ where: { id: run.id } });
    await prisma.user.delete({ where: { id: user.id } });
  }
};

const outcome = (runId: string, userId: string, token: string) => ({
  runId,
  userId,
  token,
  status: 'COMPLETED' as const,
  seedConfig: { symbols: ['BTCUSDT'] },
  trades: [{
    userId,
    backtestRunId: runId,
    symbol: 'BTCUSDT',
    side: 'LONG' as const,
    entryPrice: 100,
    exitPrice: 110,
    quantity: 1,
    openedAt: new Date(0),
    closedAt: new Date(60_000),
    pnl: 10,
  }],
  report: {
    backtestRunId: runId,
    create: { userId, backtestRunId: runId, totalTrades: 1, metrics: { state: 'COMPLETED' } },
    update: { totalTrades: 1, metrics: { state: 'COMPLETED' } },
  },
});

describe('backtest database execution lease', () => {
  it('atomically grants one claim and fences stale progress and terminal writes', async () => {
    await withRun(async (runId, userId) => {
      expect(await listRecoverableBacktestRunIds()).toContain(runId);
      const claims = await Promise.all([claimBacktestRun(runId), claimBacktestRun(runId)]);
      const firstToken = claims[0] ?? claims[1];
      expect(firstToken).toBeDefined();
      expect(claims.filter(Boolean)).toHaveLength(1);
      if (!firstToken) return;

      expect(await renewBacktestRunLease(runId, firstToken)).toBe(true);
      expect(await updateClaimedBacktestRun(runId, 'wrong-token', { notes: 'stale' })).toBe(false);
      await prisma.backtestRun.update({
        where: { id: runId },
        data: { executionLeaseExpiresAt: new Date(Date.now() - 1_000) },
      });
      const secondToken = await claimBacktestRun(runId);
      expect(secondToken).toBeTruthy();
      expect(secondToken).not.toBe(firstToken);
      if (!secondToken) return;

      expect(await updateClaimedBacktestRun(runId, firstToken, { notes: 'stale' })).toBe(false);
      expect(await commitClaimedBacktestRun(outcome(runId, userId, firstToken))).toBe(false);
      expect(await commitClaimedBacktestRun(outcome(runId, userId, secondToken))).toBe(true);
      expect(await commitClaimedBacktestRun(outcome(runId, userId, secondToken))).toBe(false);
      const saved = await prisma.backtestRun.findUniqueOrThrow({ where: { id: runId } });
      expect(saved.status).toBe('COMPLETED');
      expect(saved.notes).toBeNull();
      expect(await prisma.backtestTrade.count({ where: { backtestRunId: runId } })).toBe(1);
      expect(await prisma.backtestReport.count({ where: { backtestRunId: runId } })).toBe(1);
      expect(await listRecoverableBacktestRunIds()).not.toContain(runId);
    });
  });

  it('does not let a claimed worker overwrite cancellation', async () => {
    await withRun(async (runId, userId) => {
      const token = await claimBacktestRun(runId);
      expect(token).toBeTruthy();
      if (!token) return;
      await prisma.backtestRun.update({ where: { id: runId }, data: { status: 'CANCELED' } });
      expect(await commitClaimedBacktestRun(outcome(runId, userId, token))).toBe(false);
      expect(await prisma.backtestTrade.count({ where: { backtestRunId: runId } })).toBe(0);
      expect(await prisma.backtestReport.count({ where: { backtestRunId: runId } })).toBe(0);
    });
  });
});
