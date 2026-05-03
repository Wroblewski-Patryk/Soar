import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

import { app } from '../../index';
import { prisma } from '../../prisma/client';

const registerAndLogin = async (email: string) => {
  const agent = request.agent(app);
  const res = await agent.post('/auth/register').send({
    email,
    password: 'test1234',
  });
  expect(res.status).toBe(201);
  return agent;
};

const resolveUserIdByEmail = async (email: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
    select: { id: true },
  });
  return user.id;
};

describe('Positions list contract', () => {
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
    await prisma.wallet.deleteMany();
    await prisma.apiKey.deleteMany();
    await prisma.user.deleteMany();
  });

  it('normalizes symbol filters before listing owned positions', async () => {
    const email = 'positions-list-symbol-normalization@example.com';
    const agent = await registerAndLogin(email);
    const userId = await resolveUserIdByEmail(email);

    await prisma.position.create({
      data: {
        userId,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        symbol: 'ETHUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 2500,
        quantity: 0.2,
        leverage: 5,
      },
    });

    const res = await agent.get('/dashboard/positions').query({ symbol: 'ethusdt' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      expect.objectContaining({
        symbol: 'ETHUSDT',
        status: 'OPEN',
      }),
    ]);
  });

  it('excludes stale local rows from active status lists while preserving history access', async () => {
    const email = 'positions-list-active-sync-state@example.com';
    const agent = await registerAndLogin(email);
    const userId = await resolveUserIdByEmail(email);

    const activeOpenPosition = await prisma.position.create({
      data: {
        userId,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 60_000,
        quantity: 0.1,
        leverage: 3,
        openedAt: new Date('2026-05-04T10:00:00.000Z'),
      },
    });
    const staleOpenPosition = await prisma.position.create({
      data: {
        userId,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        syncState: 'ORPHAN_LOCAL',
        continuityState: 'REPAIR_ONLY_CLEANUP',
        symbol: 'ETHUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 2500,
        quantity: 0.2,
        leverage: 2,
        openedAt: new Date('2026-05-04T10:01:00.000Z'),
      },
    });

    const activeRes = await agent.get('/dashboard/positions').query({ status: 'OPEN' });

    expect(activeRes.status).toBe(200);
    expect(activeRes.body.map((position: { id: string }) => position.id)).toEqual([
      activeOpenPosition.id,
    ]);

    const historyRes = await agent.get('/dashboard/positions');

    expect(historyRes.status).toBe(200);
    expect(historyRes.body.map((position: { id: string }) => position.id)).toEqual([
      staleOpenPosition.id,
      activeOpenPosition.id,
    ]);
  });
});
