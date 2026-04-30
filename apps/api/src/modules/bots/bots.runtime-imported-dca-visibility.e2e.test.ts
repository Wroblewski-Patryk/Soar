import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../../index';
import { prisma } from '../../prisma/client';
import { DCA_ADVANCED_STRATEGY_CONFIG } from './bots.e2e.fixtures';
import {
  createMarketGroup,
  createPayload,
  createStrategy,
  registerAndLogin,
  resetBotsE2eState,
} from './bots.e2e.shared';

describe('Bots runtime imported DCA visibility', () => {
  beforeEach(resetBotsE2eState);

  it('shows executed DCA count for imported managed runtime positions even when historical OPEN trade is absent', async () => {
    const ownerEmail = 'bot-runtime-imported-dca-owner@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const strategyId = await createStrategy(
      owner,
      'Imported DCA Visibility Strategy',
      DCA_ADVANCED_STRATEGY_CONFIG
    );
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');

    const createRes = await owner
      .post('/dashboard/bots')
      .send(createPayload({ strategyId, marketGroupId }));
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;
    const walletId = createRes.body.walletId as string;

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt: new Date('2026-04-03T10:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-03T10:10:00.000Z'),
      },
    });

    const importedPosition = await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId,
        walletId,
        strategyId,
        externalId: `imported:${Date.now()}`,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        symbol: 'DOGEUSDT',
        side: 'SHORT',
        status: 'OPEN',
        entryPrice: 0.105,
        quantity: 100,
        leverage: 15,
        openedAt: new Date('2026-04-03T10:01:00.000Z'),
        marginUsed: 0.7,
      },
    });

    await prisma.trade.create({
      data: {
        userId: ownerUser.id,
        botId,
        walletId,
        strategyId,
        positionId: importedPosition.id,
        symbol: 'DOGEUSDT',
        side: 'SELL',
        lifecycleAction: 'DCA',
        price: 0.106,
        quantity: 50,
        fee: 0,
        realizedPnl: 0,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        executedAt: new Date('2026-04-03T10:02:00.000Z'),
      },
    });

    const positionsRes = await owner.get(
      `/dashboard/bots/${botId}/runtime-sessions/${session.id}/positions`
    );
    expect(positionsRes.status).toBe(200);
    expect(positionsRes.body.openItems).toHaveLength(1);
    expect(positionsRes.body.openItems[0].symbol).toBe('DOGEUSDT');
    expect(positionsRes.body.openItems[0].dcaCount).toBe(1);
    expect(positionsRes.body.openItems[0].dcaPlannedLevels).toEqual([-10, -20, -30]);
    expect(positionsRes.body.openItems[0].dcaExecutedLevels).toEqual([-10]);
  });
});
