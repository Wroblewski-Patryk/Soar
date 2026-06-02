import { describe, beforeEach, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import { buildDcaExecutionDedupeKey } from '../engine/runtimeExecutionDedupe.service';
import { upsertRuntimeTicker } from '../engine/runtimeTickerStore';
import {
  createMarketGroup,
  createPayload,
  createStrategy,
  registerAndLogin,
  resetBotsE2eState,
} from './bots.e2e.shared';

const seedTicker = (symbol: string, price: number) =>
  upsertRuntimeTicker({
    type: 'ticker',
    exchange: 'BINANCE',
    marketType: 'FUTURES',
    symbol,
    markPrice: price,
    lastPrice: price,
    eventTime: Date.now(),
    priceChangePercent24h: 0,
  });

describe('Runtime close route DCA-first authority pack', () => {
  beforeEach(resetBotsE2eState);

  it('keeps close authority fill-based when pending DCA exists (route-level)', async () => {
    const email = 'route-close-dca-pending-owner@example.com';
    const owner = await registerAndLogin(email);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email } });

    const strategyId = await createStrategy(owner, 'Route Close DCA Pending Strategy');
    const marketGroupId = await createMarketGroup(email, 'FUTURES');
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
        userId: ownerUser.id,
        botId,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt: new Date('2026-04-12T11:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-12T11:02:00.000Z'),
      },
      select: { id: true },
    });

    const position = await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId,
        walletId,
        strategyId,
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 64_000,
        quantity: 0.03,
        leverage: 5,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
      },
      select: { id: true },
    });

    const pendingDcaOrder = await prisma.order.create({
      data: {
        userId: ownerUser.id,
        botId,
        positionId: position.id,
        walletId,
        strategyId,
        symbol: 'BTCUSDT',
        side: 'BUY',
        type: 'MARKET',
        status: 'OPEN',
        quantity: 0.01,
        price: 63_500,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
      },
      select: { id: true },
    });
    await prisma.runtimeExecutionDedupe.create({
      data: {
        dedupeKey: buildDcaExecutionDedupeKey({
          userId: ownerUser.id,
          botId,
          symbol: 'BTCUSDT',
          positionId: position.id,
          dcaLevelIndex: 0,
          positionSide: 'LONG',
        }),
        dedupeVersion: 'v1',
        commandType: 'DCA',
        userId: ownerUser.id,
        botId,
        symbol: 'BTCUSDT',
        status: 'PENDING',
        commandFingerprint: {
          positionId: position.id,
          dcaLevelIndex: 0,
          positionSide: 'LONG',
        },
        orderId: pendingDcaOrder.id,
        positionId: position.id,
        ttlExpiresAt: new Date(Date.now() + 60_000),
      },
    });

    seedTicker('BTCUSDT', 64_100);

    const closeRes = await owner
      .post(`/dashboard/bots/${botId}/runtime-sessions/${session.id}/positions/${position.id}/close`)
      .send({ riskAck: true });

    expect(closeRes.status).toBe(200);
    expect(closeRes.body.status).toBe('submitted');
    expect(typeof closeRes.body.orderId).toBe('string');

    const stillOpen = await prisma.position.findUniqueOrThrow({
      where: { id: position.id },
      select: { status: true, closedAt: true },
    });
    expect(stillOpen.status).toBe('OPEN');
    expect(stillOpen.closedAt).toBeNull();
  });

  it('allows close when no pending DCA exists (route-level)', async () => {
    const email = 'route-close-dca-exhausted-owner@example.com';
    const owner = await registerAndLogin(email);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email } });

    const strategyId = await createStrategy(owner, 'Route Close DCA Exhausted Strategy');
    const marketGroupId = await createMarketGroup(email, 'FUTURES');
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
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-04-12T11:10:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-12T11:12:00.000Z'),
      },
      select: { id: true },
    });

    const position = await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId,
        walletId,
        strategyId,
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 64_000,
        quantity: 0.03,
        leverage: 2,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
      },
      select: { id: true },
    });

    seedTicker('BTCUSDT', 64_200);

    const closeRes = await owner
      .post(`/dashboard/bots/${botId}/runtime-sessions/${session.id}/positions/${position.id}/close`)
      .send({ riskAck: true });

    expect(closeRes.status).toBe(200);
    expect(closeRes.body.status).toBe('closed');
    expect(closeRes.body.positionId).toBe(position.id);
    expect(typeof closeRes.body.orderId).toBe('string');

    const closed = await prisma.position.findUniqueOrThrow({
      where: { id: position.id },
      select: { status: true, closedAt: true },
    });
    expect(closed.status).toBe('CLOSED');
    expect(closed.closedAt).not.toBeNull();
  });
});
