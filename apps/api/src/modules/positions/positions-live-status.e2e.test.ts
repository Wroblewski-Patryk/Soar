import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { app } from '../../index';
import { prisma } from '../../prisma/client';
import { livePositionReconciliationLoop } from './livePositionReconciliation.service';

const registerAndLogin = async (email: string) => {
  const agent = request.agent(app);
  const res = await agent.post('/auth/register').send({
    email,
    password: 'test1234',
  });
  expect(res.status).toBe(201);
  return agent;
};

describe('Positions live status contract', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(async () => {
    await prisma.log.deleteMany();
    await prisma.backtestReport.deleteMany();
    await prisma.backtestTrade.deleteMany();
    await prisma.backtestRun.deleteMany();
    await prisma.trade.deleteMany();
    await prisma.order.deleteMany();
    await prisma.position.deleteMany();
    await prisma.signal.deleteMany();
    await prisma.botStrategy.deleteMany();
    await prisma.botSubagentConfig.deleteMany();
    await prisma.botAssistantConfig.deleteMany();
    await prisma.marketGroupStrategyLink.deleteMany();
    await prisma.botMarketGroup.deleteMany();
    await prisma.runtimeExecutionDedupe.deleteMany();
    await prisma.botRuntimeEvent.deleteMany();
    await prisma.botRuntimeSymbolStat.deleteMany();
    await prisma.botRuntimeSession.deleteMany();
    await prisma.bot.deleteMany();
    await prisma.symbolGroup.deleteMany();
    await prisma.marketUniverse.deleteMany();
    await prisma.strategy.deleteMany();
    await prisma.apiKey.deleteMany();
    await prisma.user.deleteMany();
  });

  it('rejects unauthenticated access', async () => {
    const res = await request(app).get('/dashboard/positions/live-status');
    expect(res.status).toBe(401);
  });

  it('returns reconciliation status for authenticated user', async () => {
    const agent = await registerAndLogin('positions-live-status@example.com');

    const res = await agent.get('/dashboard/positions/live-status');
    expect(res.status).toBe(200);
    expect(res.body.running).toBeTypeOf('boolean');
    expect(res.body.iterations).toBeTypeOf('number');
    expect(res.body).toHaveProperty('workerHeartbeatAt');
  });

  it('scopes reconciliation diagnostics to the authenticated user', async () => {
    const ownerEmail = 'positions-live-status-owner@example.com';
    const otherEmail = 'positions-live-status-other@example.com';
    const ownerAgent = await registerAndLogin(ownerEmail);
    await registerAndLogin(otherEmail);
    const owner = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });
    const other = await prisma.user.findUniqueOrThrow({ where: { email: otherEmail } });

    vi.spyOn(livePositionReconciliationLoop, 'getStatus').mockReturnValue({
      running: true,
      iterations: 7,
      lastRunAt: '2026-05-07T20:00:00.000Z',
      lastDurationMs: 42,
      lastError: null,
      openPositionsSeen: 2,
      lastDiagnosticSummary: {
        CREATED: 1,
        UPDATED: 1,
        SKIPPED_ZERO_SIZE: 0,
        SKIPPED_UNRESOLVED_SIDE: 0,
        SKIPPED_UNRESOLVED_SYMBOL: 0,
        SKIPPED_MISSING_ENTRY_TRUTH: 0,
      },
      lastPositionDiagnostics: [
        {
          apiKeyId: 'owner-key',
          userId: owner.id,
          marketType: 'FUTURES',
          symbol: 'ETHUSDT',
          side: 'LONG',
          outcome: 'CREATED',
          ownershipStatus: 'OWNED',
          managementMode: 'BOT_MANAGED',
          syncState: 'IN_SYNC',
          continuityState: 'CONFIRMED',
          botId: 'owner-bot',
          walletId: 'owner-wallet',
          strategyId: 'owner-strategy',
          botVisible: true,
          reason: null,
        },
        {
          apiKeyId: 'other-key',
          userId: other.id,
          marketType: 'FUTURES',
          symbol: 'BTCUSDT',
          side: 'SHORT',
          outcome: 'UPDATED',
          ownershipStatus: 'OWNED',
          managementMode: 'BOT_MANAGED',
          syncState: 'IN_SYNC',
          continuityState: 'CONFIRMED',
          botId: 'other-bot',
          walletId: 'other-wallet',
          strategyId: 'other-strategy',
          botVisible: true,
          reason: null,
        },
      ],
    });

    const res = await ownerAgent.get('/dashboard/positions/live-status');

    expect(res.status).toBe(200);
    expect(res.body.openPositionsSeen).toBe(1);
    expect(res.body.lastDiagnosticSummary).toMatchObject({
      CREATED: 1,
      UPDATED: 0,
    });
    expect(res.body.lastPositionDiagnostics).toHaveLength(1);
    expect(res.body.lastPositionDiagnostics[0]).toMatchObject({
      apiKeyId: 'owner-key',
      userId: owner.id,
      symbol: 'ETHUSDT',
    });
    expect(JSON.stringify(res.body)).not.toContain('other-key');
    expect(JSON.stringify(res.body)).not.toContain(other.id);
    expect(JSON.stringify(res.body)).not.toContain('BTCUSDT');
  });
});


