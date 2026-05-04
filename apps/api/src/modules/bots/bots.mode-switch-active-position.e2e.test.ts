import { describe, expect, it, beforeEach } from 'vitest';

import { prisma } from '../../prisma/client';
import {
  createMarketGroup,
  createPayload,
  createStrategy,
  createWalletForContext,
  registerAndLogin,
  resetBotsE2eState,
} from './bots.e2e.shared';

describe('Bot PAPER to LIVE active position guard', () => {
  beforeEach(resetBotsE2eState);

  it('does not block PAPER -> LIVE mode switch for stale local paper positions', async () => {
    const email = 'bots-mode-switch-stale-paper-positions@example.com';
    const agent = await registerAndLogin(email);
    const strategyId = await createStrategy(agent, 'Mode Switch Stale Guard Strategy');
    const marketGroupId = await createMarketGroup(email, 'FUTURES');
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });

    const createRes = await agent.post('/dashboard/bots').send({
      ...createPayload({ strategyId, marketGroupId }),
      isActive: false,
      liveOptIn: false,
    });
    expect(createRes.status).toBe(201);
    const botId = createRes.body.id as string;
    const paperWalletId = (createRes.body.walletId as string | undefined) ?? null;

    await prisma.position.create({
      data: {
        userId: user.id,
        botId,
        walletId: paperWalletId,
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        syncState: 'ORPHAN_LOCAL',
        continuityState: 'REPAIR_ONLY_CLEANUP',
        entryPrice: 62000,
        quantity: 0.01,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
      },
    });

    const liveApiKey = await prisma.apiKey.create({
      data: {
        userId: user.id,
        label: 'Mode switch stale guard key',
        exchange: 'BINANCE',
        apiKey: 'BINANCE_STALE_KEY',
        apiSecret: 'BINANCE_STALE_SECRET',
        syncExternalPositions: true,
        manageExternalPositions: false,
      },
    });
    const liveWalletId = await createWalletForContext(email, {
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      apiKeyId: liveApiKey.id,
    });

    const switchRes = await agent.put(`/dashboard/bots/${botId}`).send({
      walletId: liveWalletId,
      liveOptIn: true,
      consentTextVersion: 'mvp-v1',
    });

    expect(switchRes.status).toBe(200);
    expect(switchRes.body.mode).toBe('LIVE');
    expect(switchRes.body.walletId).toBe(liveWalletId);
  });
});
