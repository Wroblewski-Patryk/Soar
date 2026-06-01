import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import { DCA_ADVANCED_STRATEGY_CONFIG } from './bots.e2e.fixtures';
import {
  createMarketGroup,
  createPayload,
  createStrategy,
  registerAndLogin,
  resetBotsE2eState,
  seedRuntimeTicker,
} from './bots.e2e.shared';

const getUserIdByEmail = async (email: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
    select: { id: true },
  });
  return user.id;
};

const createBotWithRuntimeSession = async (params: {
  ownerEmail: string;
  strategyId: string;
}) => {
  const owner = await registerAndLogin(params.ownerEmail);
  const marketGroupId = await createMarketGroup(params.ownerEmail, 'FUTURES');
  const ownerUserId = await getUserIdByEmail(params.ownerEmail);
  const botRes = await owner.post('/dashboard/bots').send(
    createPayload({
      strategyId: params.strategyId,
      marketGroupId,
    })
  );
  expect(botRes.status).toBe(201);
  const botId = botRes.body.id as string;

  const session = await prisma.botRuntimeSession.create({
    data: {
      userId: ownerUserId,
      botId,
      mode: 'PAPER',
      status: 'RUNNING',
      startedAt: new Date('2026-06-01T08:00:00.000Z'),
      lastHeartbeatAt: new Date('2026-06-01T08:05:00.000Z'),
    },
    select: { id: true },
  });

  return { owner, ownerUserId, botId, sessionId: session.id };
};

describe('Runtime close authority route-level pack', () => {
  beforeEach(resetBotsE2eState);

  it('fails closed when riskAck is missing for runtime position close endpoint', async () => {
    const ownerEmail = 'route-pack-risk-ack-owner@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUserId = await getUserIdByEmail(ownerEmail);
    const strategyId = await createStrategy(owner, 'Route Pack Risk Ack Strategy');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const botRes = await owner.post('/dashboard/bots').send(
      createPayload({
        strategyId,
        marketGroupId,
      })
    );
    expect(botRes.status).toBe(201);

    const botId = botRes.body.id as string;
    const walletId = botRes.body.walletId as string;
    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUserId,
        botId,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-06-01T08:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-06-01T08:05:00.000Z'),
      },
      select: { id: true },
    });
    const position = await prisma.position.create({
      data: {
        userId: ownerUserId,
        botId,
        walletId,
        strategyId,
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 68_000,
        quantity: 0.01,
        leverage: 2,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
      },
      select: { id: true },
    });
    seedRuntimeTicker('BTCUSDT', 68_120);

    const closeRes = await owner
      .post(`/dashboard/bots/${botId}/runtime-sessions/${session.id}/positions/${position.id}/close`)
      .send({});

    expect(closeRes.status).toBe(400);
    expect(closeRes.body.error.message).toBe('riskAck must be true to close runtime position');
  });

  it('keeps DCA-first close authority fill-based when pending DCA order is still open', async () => {
    const ownerEmail = 'route-pack-dca-first-owner@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const strategyId = await createStrategy(
      owner,
      'Route Pack DCA-first Strategy',
      DCA_ADVANCED_STRATEGY_CONFIG
    );

    const { botId, ownerUserId, sessionId } = await createBotWithRuntimeSession({
      ownerEmail,
      strategyId,
    });

    const position = await prisma.position.create({
      data: {
        userId: ownerUserId,
        botId,
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        quantity: 0.1,
        entryPrice: 42_000,
        leverage: 5,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
      },
    });

    await prisma.order.create({
      data: {
        userId: ownerUserId,
        botId,
        positionId: position.id,
        symbol: 'BTCUSDT',
        side: 'BUY',
        type: 'MARKET',
        status: 'OPEN',
        quantity: 0.05,
        price: 41_500,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
      },
    });
    seedRuntimeTicker('BTCUSDT', 42_200);

    const closeRes = await owner
      .post(`/dashboard/bots/${botId}/runtime-sessions/${sessionId}/positions/${position.id}/close`)
      .send({ riskAck: true });

    expect(closeRes.status).toBe(200);
    expect(closeRes.body.status).toBe('submitted');
    expect(closeRes.body.orderId).toEqual(expect.any(String));

    const stillOpenPosition = await prisma.position.findUniqueOrThrow({
      where: { id: position.id },
      select: { status: true, closedAt: true },
    });
    expect(stillOpenPosition.status).toBe('OPEN');
    expect(stillOpenPosition.closedAt).toBeNull();
  });
});
