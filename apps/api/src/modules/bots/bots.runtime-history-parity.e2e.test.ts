import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import {
  createMarketGroup,
  createPayload,
  createStrategy,
  registerAndLogin,
  resetBotsE2eState,
} from './bots.e2e.shared';

describe('Bots runtime history parity contract', () => {
  beforeEach(resetBotsE2eState);

  it('keeps runtime history parity for carry-over bot-managed positions on completed sessions', async () => {
    const ownerEmail = 'bot-history-parity@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const strategyId = await createStrategy(owner, 'History Carry-over');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const botRes = await owner.post('/dashboard/bots').send(createPayload({ strategyId, marketGroupId }));
    expect(botRes.status).toBe(201);
    const botId = botRes.body.id as string;
    const walletId = botRes.body.walletId as string;

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'COMPLETED',
        startedAt: new Date('2026-04-10T05:00:00.000Z'),
        finishedAt: new Date('2026-04-10T05:10:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-10T05:10:00.000Z'),
      },
      select: { id: true },
    });

    const carryOverPosition = await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId,
        walletId,
        strategyId,
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 68000,
        quantity: 0.01,
        leverage: 2,
        openedAt: new Date('2026-04-10T04:40:00.000Z'),
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
      },
      select: { id: true },
    });

    const carryOverTrade = await prisma.trade.create({
      data: {
        userId: ownerUser.id,
        botId,
        walletId,
        strategyId,
        positionId: carryOverPosition.id,
        symbol: 'BTCUSDT',
        side: 'BUY',
        lifecycleAction: 'OPEN',
        price: 68000,
        quantity: 0.01,
        fee: 0.34,
        executedAt: new Date('2026-04-10T04:41:00.000Z'),
      },
      select: { id: true },
    });

    const positionsRes = await owner.get(`/dashboard/bots/${botId}/runtime-sessions/${session.id}/positions`);
    expect(positionsRes.status).toBe(200);
    expect(positionsRes.body.openItems).toHaveLength(1);

    const tradesRes = await owner.get(`/dashboard/bots/${botId}/runtime-sessions/${session.id}/trades`);
    expect(tradesRes.status).toBe(200);
    expect(tradesRes.body.total).toBeGreaterThanOrEqual(1);
    expect(
      (tradesRes.body.items as Array<{ id: string; symbol: string }>).some(
        (item) => item.id === carryOverTrade.id && item.symbol === 'BTCUSDT'
      )
    ).toBe(true);
  });

  it('keeps PRETRADE_BLOCKED diagnostics visible in runtime session event counters', async () => {
    const ownerEmail = 'bot-runtime-pretrade-blocked-diagnostics@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const strategyId = await createStrategy(owner, 'Pretrade Diagnostics');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const botRes = await owner.post('/dashboard/bots').send(createPayload({ strategyId, marketGroupId }));
    expect(botRes.status).toBe(201);
    const botId = botRes.body.id as string;

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-04-10T06:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-10T06:01:00.000Z'),
      },
      select: { id: true },
    });

    await prisma.botRuntimeEvent.create({
      data: {
        userId: ownerUser.id,
        botId,
        sessionId: session.id,
        eventType: 'PRETRADE_BLOCKED',
        level: 'WARN',
        symbol: 'BTCUSDT',
        message: 'Signal execution blocked by runtime orchestration guardrails',
        payload: {
          reason: 'already_open_same_side',
          direction: 'LONG',
        },
        eventAt: new Date('2026-04-10T06:01:00.000Z'),
      },
    });

    const listRes = await owner.get(`/dashboard/bots/${botId}/runtime-sessions`);
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body).toHaveLength(1);
    expect(listRes.body[0].id).toBe(session.id);
    expect(listRes.body[0].eventsCount).toBe(1);

    const detailRes = await owner.get(`/dashboard/bots/${botId}/runtime-sessions/${session.id}`);
    expect(detailRes.status).toBe(200);
    expect(detailRes.body.id).toBe(session.id);
    expect(detailRes.body.eventsCount).toBe(1);
  });
});
