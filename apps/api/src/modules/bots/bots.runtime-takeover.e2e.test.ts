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
        externalId: `${apiKey.id}:BTCUSDT:LONG`,
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

  it('shows only exact api-key-and-symbol owned imported rows for each competing live bot', async () => {
    const ownerEmail = 'bot-runtime-exact-imported-ownership@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const apiKey = await prisma.apiKey.create({
      data: {
        userId: ownerUser.id,
        label: 'Runtime Exact Ownership Key',
        exchange: 'BINANCE',
        apiKey: 'runtime_exact_ownership_key',
        apiSecret: 'runtime_exact_ownership_secret',
        syncExternalPositions: true,
        manageExternalPositions: false,
      },
      select: { id: true },
    });

    const btcWalletId = await createWalletForContext(ownerEmail, {
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      apiKeyId: apiKey.id,
    });
    const ethWalletId = await createWalletForContext(ownerEmail, {
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      apiKeyId: apiKey.id,
    });

    await prisma.wallet.updateMany({
      where: { id: { in: [btcWalletId, ethWalletId] } },
      data: { manageExternalPositions: true },
    });

    const btcStrategyId = await createStrategy(owner, 'Runtime Exact BTC Strategy');
    const ethStrategyId = await createStrategy(owner, 'Runtime Exact ETH Strategy');
    const btcMarketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const ethMarketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');

    await prisma.symbolGroup.update({
      where: { id: btcMarketGroupId },
      data: { symbols: ['BTCUSDT'] },
    });
    await prisma.symbolGroup.update({
      where: { id: ethMarketGroupId },
      data: { symbols: ['ETHUSDT'] },
    });

    const btcBotRes = await owner.post('/dashboard/bots').send({
      ...createPayload({
        strategyId: btcStrategyId,
        marketGroupId: btcMarketGroupId,
      }),
      name: 'BTC Ownership Bot',
      walletId: btcWalletId,
      isActive: true,
      liveOptIn: true,
      consentTextVersion: 'mvp-v1',
    });
    expect(btcBotRes.status).toBe(201);
    const btcBotId = btcBotRes.body.id as string;

    const ethBotRes = await owner.post('/dashboard/bots').send({
      ...createPayload({
        strategyId: ethStrategyId,
        marketGroupId: ethMarketGroupId,
      }),
      name: 'ETH Ownership Bot',
      walletId: ethWalletId,
      isActive: true,
      liveOptIn: true,
      consentTextVersion: 'mvp-v1',
    });
    expect(ethBotRes.status).toBe(201);
    const ethBotId = ethBotRes.body.id as string;

    const startedAt = new Date('2026-04-10T03:00:00.000Z');
    const btcSession = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId: btcBotId,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt,
        lastHeartbeatAt: new Date('2026-04-10T03:05:00.000Z'),
      },
    });
    const ethSession = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId: ethBotId,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt,
        lastHeartbeatAt: new Date('2026-04-10T03:05:00.000Z'),
      },
    });

    await prisma.position.createMany({
      data: [
        {
          userId: ownerUser.id,
          botId: null,
          walletId: null,
          strategyId: null,
          symbol: 'BTCUSDT',
          side: 'LONG',
          status: 'OPEN',
          entryPrice: 69000,
          quantity: 0.03,
          leverage: 3,
          openedAt: new Date('2026-04-10T03:02:00.000Z'),
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          syncState: 'IN_SYNC',
          externalId: `${apiKey.id}:BTCUSDT:LONG`,
        },
        {
          userId: ownerUser.id,
          botId: null,
          walletId: null,
          strategyId: null,
          symbol: 'ETHUSDT',
          side: 'SHORT',
          status: 'OPEN',
          entryPrice: 3200,
          quantity: 0.2,
          leverage: 2,
          openedAt: new Date('2026-04-10T03:03:00.000Z'),
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          syncState: 'IN_SYNC',
          externalId: `${apiKey.id}:ETHUSDT:SHORT`,
        },
      ],
    });

    const btcPositionsRes = await owner.get(
      `/dashboard/bots/${btcBotId}/runtime-sessions/${btcSession.id}/positions`
    );
    expect(btcPositionsRes.status).toBe(200);
    expect(btcPositionsRes.body.openItems).toHaveLength(1);
    expect(btcPositionsRes.body.openItems[0].symbol).toBe('BTCUSDT');

    const ethPositionsRes = await owner.get(
      `/dashboard/bots/${ethBotId}/runtime-sessions/${ethSession.id}/positions`
    );
    expect(ethPositionsRes.status).toBe(200);
    expect(ethPositionsRes.body.openItems).toHaveLength(1);
    expect(ethPositionsRes.body.openItems[0].symbol).toBe('ETHUSDT');
  });
});
