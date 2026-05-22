import request from 'supertest';
import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { app } from '../../index';
import { prisma } from '../../prisma/client';
import { signAuthToken } from '../auth/auth.jwt';

const createAuthenticatedClient = async (email: string) => {
  const user = await prisma.user.create({
    data: {
      email,
      password: 'test-password-hash',
    },
    select: { id: true, email: true, role: true, sessionVersion: true },
  });
  const token = signAuthToken(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionVersion: user.sessionVersion,
    },
    '7d'
  );
  return {
    userId: user.id,
    get: (path: string) => request(app).get(path).set('Authorization', `Bearer ${token}`),
  };
};

const createBacktestReport = async (userId: string, overrides: {
  name: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  netPnl: number;
  grossProfit: number;
  grossLoss: number;
}) => {
  const run = await prisma.backtestRun.create({
    data: {
      userId,
      name: overrides.name,
      symbol: 'BTCUSDT',
      timeframe: '1h',
      status: 'COMPLETED',
    },
  });

  return prisma.backtestReport.create({
    data: {
      userId,
      backtestRunId: run.id,
      totalTrades: overrides.totalTrades,
      winningTrades: overrides.winningTrades,
      losingTrades: overrides.losingTrades,
      netPnl: overrides.netPnl,
      grossProfit: overrides.grossProfit,
      grossLoss: overrides.grossLoss,
    },
  });
};

const createBot = async (params: { userId: string; name: string; mode: 'PAPER' | 'LIVE' }) =>
  prisma.bot.create({
    data: {
      userId: params.userId,
      name: params.name,
      mode: params.mode,
      symbolGroupId: null,
      strategyId: null,
    },
    select: { id: true },
  });

const createTrade = async (params: {
  userId: string;
  botId: string;
  realizedPnl: number | null;
  executionMode?: 'PAPER' | 'LIVE';
}) =>
  prisma.trade.create({
    data: {
      userId: params.userId,
      botId: params.botId,
      executionMode: params.executionMode,
      symbol: 'BTCUSDT',
      side: 'BUY',
      price: 100,
      quantity: 1,
      realizedPnl: params.realizedPnl,
    },
  });

describe('Reports API contract', () => {
  it('rejects unauthenticated cross-mode performance access', async () => {
    const res = await request(app).get('/dashboard/reports/cross-mode-performance');
    expect(res.status).toBe(401);
  });

  it('returns cross-mode performance scoped to the authenticated user', async () => {
    const suffix = randomUUID();
    const ownerEmail = `reports-owner-${suffix}@example.com`;
    const otherEmail = `reports-other-${suffix}@example.com`;
    const owner = await createAuthenticatedClient(ownerEmail);
    const other = await createAuthenticatedClient(otherEmail);
    const ownerId = owner.userId;
    const otherId = other.userId;

    await createBacktestReport(ownerId, {
      name: 'owner-report',
      totalTrades: 3,
      winningTrades: 2,
      losingTrades: 1,
      netPnl: 42,
      grossProfit: 50,
      grossLoss: -8,
    });
    await createBacktestReport(otherId, {
      name: 'other-report',
      totalTrades: 100,
      winningTrades: 100,
      losingTrades: 0,
      netPnl: 999,
      grossProfit: 999,
      grossLoss: 0,
    });

    const ownerPaperBot = await createBot({ userId: ownerId, name: 'owner-paper-report-bot', mode: 'PAPER' });
    const ownerLiveBot = await createBot({ userId: ownerId, name: 'owner-live-report-bot', mode: 'LIVE' });
    const otherPaperBot = await createBot({ userId: otherId, name: 'other-paper-report-bot', mode: 'PAPER' });

    await createTrade({ userId: ownerId, botId: ownerPaperBot.id, realizedPnl: 10 });
    await createTrade({ userId: ownerId, botId: ownerPaperBot.id, realizedPnl: -5 });
    await createTrade({ userId: ownerId, botId: ownerLiveBot.id, realizedPnl: 7 });
    await createTrade({ userId: ownerId, botId: ownerLiveBot.id, realizedPnl: null });
    await createTrade({ userId: otherId, botId: otherPaperBot.id, realizedPnl: 999 });

    const res = await owner.get('/dashboard/reports/cross-mode-performance');
    expect(res.status).toBe(200);
    expect(res.body.modeResolution).toBe('TRADE_EXECUTION_MODE_SNAPSHOT_WITH_BOT_CURRENT_MODE_FALLBACK');
    expect(res.body.rows).toHaveLength(3);

    const backtest = res.body.rows.find((row: { mode: string }) => row.mode === 'BACKTEST');
    const paper = res.body.rows.find((row: { mode: string }) => row.mode === 'PAPER');
    const live = res.body.rows.find((row: { mode: string }) => row.mode === 'LIVE');

    expect(backtest).toMatchObject({
      totalTrades: 3,
      winningTrades: 2,
      losingTrades: 1,
      netPnl: 42,
      grossProfit: 50,
      grossLoss: 8,
    });
    expect(paper).toMatchObject({
      totalTrades: 2,
      winningTrades: 1,
      losingTrades: 1,
      netPnl: 5,
      grossProfit: 10,
      grossLoss: 5,
    });
    expect(live).toMatchObject({
      totalTrades: 2,
      winningTrades: 1,
      losingTrades: 0,
      netPnl: 7,
      grossProfit: 7,
      grossLoss: 0,
    });
  });

  it('prefers immutable trade execution-mode snapshots over the current bot mode', async () => {
    const suffix = randomUUID();
    const owner = await createAuthenticatedClient(`reports-snapshot-${suffix}@example.com`);
    const bot = await createBot({ userId: owner.userId, name: 'mode-switch-report-bot', mode: 'PAPER' });

    await createTrade({ userId: owner.userId, botId: bot.id, executionMode: 'PAPER', realizedPnl: 11 });
    await prisma.bot.update({ where: { id: bot.id }, data: { mode: 'LIVE' } });
    await createTrade({ userId: owner.userId, botId: bot.id, executionMode: 'LIVE', realizedPnl: -3 });

    const res = await owner.get('/dashboard/reports/cross-mode-performance');
    expect(res.status).toBe(200);

    const paper = res.body.rows.find((row: { mode: string }) => row.mode === 'PAPER');
    const live = res.body.rows.find((row: { mode: string }) => row.mode === 'LIVE');

    expect(paper).toMatchObject({
      totalTrades: 1,
      winningTrades: 1,
      losingTrades: 0,
      netPnl: 11,
    });
    expect(live).toMatchObject({
      totalTrades: 1,
      winningTrades: 0,
      losingTrades: 1,
      netPnl: -3,
    });
  });
});
