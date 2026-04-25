import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import {
  createMarketGroup,
  createPayload,
  createStrategy,
  createWalletForContext,
  registerAndLogin,
  resetBotsE2eState,
} from './bots.e2e.shared';

describe('Bots runtime takeover visibility', () => {
  beforeEach(resetBotsE2eState);

  it('shows owned exchange-synced LIVE positions only for the wallet-managed bot when competing symbol scope is manual-only', async () => {
    const ownerEmail = 'bot-runtime-wallet-managed-ownership@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const apiKey = await prisma.apiKey.create({
      data: {
        userId: ownerUser.id,
        label: 'Runtime Wallet Ownership Key',
        exchange: 'BINANCE',
        apiKey: 'runtime_wallet_ownership_key',
        apiSecret: 'runtime_wallet_ownership_secret',
        syncExternalPositions: true,
        manageExternalPositions: false,
      },
      select: { id: true },
    });

    const managedWalletId = await createWalletForContext(ownerEmail, {
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      apiKeyId: apiKey.id,
    });
    const manualOnlyWalletId = await createWalletForContext(ownerEmail, {
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      apiKeyId: apiKey.id,
    });

    await prisma.wallet.update({
      where: { id: managedWalletId },
      data: { manageExternalPositions: true },
    });
    await prisma.wallet.update({
      where: { id: manualOnlyWalletId },
      data: { manageExternalPositions: false },
    });

    const strategyManagedId = await createStrategy(owner, 'Runtime Managed Ownership Strategy');
    const strategyManualId = await createStrategy(owner, 'Runtime Manual Ownership Strategy');
    const managedMarketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const manualMarketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');

    await prisma.symbolGroup.update({
      where: { id: managedMarketGroupId },
      data: { symbols: ['BTCUSDT'] },
    });
    await prisma.symbolGroup.update({
      where: { id: manualMarketGroupId },
      data: { symbols: ['BTCUSDT'] },
    });

    const managedBotRes = await owner.post('/dashboard/bots').send({
      ...createPayload({
        strategyId: strategyManagedId,
        marketGroupId: managedMarketGroupId,
      }),
      name: 'Managed Ownership Bot',
      walletId: managedWalletId,
      isActive: true,
      liveOptIn: true,
      consentTextVersion: 'mvp-v1',
    });
    expect(managedBotRes.status).toBe(201);
    const managedBotId = managedBotRes.body.id as string;

    const manualBotRes = await owner.post('/dashboard/bots').send({
      ...createPayload({
        strategyId: strategyManualId,
        marketGroupId: manualMarketGroupId,
      }),
      name: 'Manual Only Ownership Bot',
      walletId: manualOnlyWalletId,
      isActive: true,
      liveOptIn: true,
      consentTextVersion: 'mvp-v1',
    });
    expect(manualBotRes.status).toBe(201);
    const manualBotId = manualBotRes.body.id as string;

    const startedAt = new Date('2026-04-10T02:00:00.000Z');
    const managedSession = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId: managedBotId,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt,
        lastHeartbeatAt: new Date('2026-04-10T02:05:00.000Z'),
      },
    });
    const manualSession = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId: manualBotId,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt,
        lastHeartbeatAt: new Date('2026-04-10T02:05:00.000Z'),
      },
    });

    await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId: null,
        walletId: managedWalletId,
        strategyId: null,
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 69000,
        quantity: 0.03,
        leverage: 3,
        openedAt: new Date('2026-04-10T02:02:00.000Z'),
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        externalId: 'external:managed:btcusdt:long',
      },
    });

    const managedPositionsRes = await owner.get(
      `/dashboard/bots/${managedBotId}/runtime-sessions/${managedSession.id}/positions`
    );
    expect(managedPositionsRes.status).toBe(200);
    expect(managedPositionsRes.body.total).toBe(1);
    expect(managedPositionsRes.body.openItems).toHaveLength(1);
    expect(managedPositionsRes.body.openItems[0].symbol).toBe('BTCUSDT');
    expect(managedPositionsRes.body.openItems[0].origin).toBe('EXCHANGE_SYNC');

    const manualPositionsRes = await owner.get(
      `/dashboard/bots/${manualBotId}/runtime-sessions/${manualSession.id}/positions`
    );
    expect(manualPositionsRes.status).toBe(200);
    expect(manualPositionsRes.body.total).toBe(0);
    expect(manualPositionsRes.body.openItems).toHaveLength(0);
  });
});
