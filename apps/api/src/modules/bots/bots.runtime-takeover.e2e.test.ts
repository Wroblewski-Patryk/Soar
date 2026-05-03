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

  it('keeps selected LIVE bot open orders visible when legacy rows have no wallet projection', async () => {
    const ownerEmail = 'bot-runtime-live-open-order-wallet-null@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const apiKey = await prisma.apiKey.create({
      data: {
        userId: ownerUser.id,
        label: 'Runtime Live Open Order Wallet Null Key',
        exchange: 'BINANCE',
        apiKey: 'runtime_live_open_order_wallet_null_key',
        apiSecret: 'runtime_live_open_order_wallet_null_secret',
        syncExternalPositions: true,
        manageExternalPositions: false,
      },
      select: { id: true },
    });
    const walletId = await createWalletForContext(ownerEmail, {
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      apiKeyId: apiKey.id,
    });
    const strategyId = await createStrategy(owner, 'Runtime Live Open Order Wallet Null Strategy');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    await prisma.symbolGroup.update({
      where: { id: marketGroupId },
      data: { symbols: ['BTCUSDT'] },
    });

    const botRes = await owner.post('/dashboard/bots').send({
      ...createPayload({
        strategyId,
        marketGroupId,
      }),
      name: 'Live Open Order Wallet Null Bot',
      walletId,
      isActive: true,
      liveOptIn: true,
      manageExternalPositions: true,
      consentTextVersion: 'mvp-v1',
    });
    expect(botRes.status).toBe(201);
    const botId = botRes.body.id as string;

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt: new Date('2026-05-03T08:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-05-03T08:05:00.000Z'),
      },
    });

    const order = await prisma.order.create({
      data: {
        userId: ownerUser.id,
        botId,
        walletId: null,
        strategyId,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        symbol: 'BTCUSDT',
        side: 'BUY',
        type: 'MARKET',
        status: 'OPEN',
        quantity: 0.01,
        filledQuantity: 0,
        submittedAt: new Date('2026-05-03T08:01:00.000Z'),
      },
    });

    const positionsRes = await owner.get(
      `/dashboard/bots/${botId}/runtime-sessions/${session.id}/positions`
    );

    expect(positionsRes.status).toBe(200);
    expect(positionsRes.body.total).toBe(0);
    expect(positionsRes.body.openOrdersCount).toBe(1);
    expect(positionsRes.body.openOrders).toEqual([
      expect.objectContaining({
        id: order.id,
        symbol: 'BTCUSDT',
        status: 'OPEN',
      }),
    ]);
  });

  it('shows owned exchange-synced LIVE positions only for the owning LIVE bot when a PAPER bot shares the same symbol', async () => {
    const ownerEmail = 'bot-runtime-live-paper-shared-symbol@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const apiKey = await prisma.apiKey.create({
      data: {
        userId: ownerUser.id,
        label: 'Runtime Live Paper Shared Symbol Key',
        exchange: 'BINANCE',
        apiKey: 'runtime_live_paper_shared_symbol_key',
        apiSecret: 'runtime_live_paper_shared_symbol_secret',
        syncExternalPositions: true,
        manageExternalPositions: false,
      },
      select: { id: true },
    });

    const liveWalletId = await createWalletForContext(ownerEmail, {
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      apiKeyId: apiKey.id,
    });
    const paperWalletId = await createWalletForContext(ownerEmail, {
      mode: 'PAPER',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
    });

    const liveStrategyId = await createStrategy(owner, 'Runtime Live Ownership Strategy');
    const paperStrategyId = await createStrategy(owner, 'Runtime Paper Shared Symbol Strategy');
    const liveMarketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    const paperMarketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');

    await prisma.symbolGroup.update({
      where: { id: liveMarketGroupId },
      data: { symbols: ['BTCUSDT'] },
    });
    await prisma.symbolGroup.update({
      where: { id: paperMarketGroupId },
      data: { symbols: ['BTCUSDT'] },
    });

    const liveBotRes = await owner.post('/dashboard/bots').send({
      ...createPayload({
        strategyId: liveStrategyId,
        marketGroupId: liveMarketGroupId,
      }),
      name: 'Live Ownership Bot',
      walletId: liveWalletId,
      isActive: true,
      liveOptIn: true,
      manageExternalPositions: true,
      consentTextVersion: 'mvp-v1',
    });
    expect(liveBotRes.status).toBe(201);
    const liveBotId = liveBotRes.body.id as string;

    const paperBotRes = await owner.post('/dashboard/bots').send({
      ...createPayload({
        strategyId: paperStrategyId,
        marketGroupId: paperMarketGroupId,
      }),
      name: 'Paper Shared Symbol Bot',
      walletId: paperWalletId,
      isActive: true,
      liveOptIn: false,
      consentTextVersion: null,
    });
    expect(paperBotRes.status).toBe(201);
    const paperBotId = paperBotRes.body.id as string;

    const startedAt = new Date('2026-04-10T02:00:00.000Z');
    const liveSession = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId: liveBotId,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt,
        lastHeartbeatAt: new Date('2026-04-10T02:05:00.000Z'),
      },
    });
    const paperSession = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId: paperBotId,
        mode: 'PAPER',
        status: 'RUNNING',
        startedAt,
        lastHeartbeatAt: new Date('2026-04-10T02:05:00.000Z'),
      },
    });

    await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId: null,
        walletId: liveWalletId,
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

    const livePositionsRes = await owner.get(
      `/dashboard/bots/${liveBotId}/runtime-sessions/${liveSession.id}/positions`
    );
    expect(livePositionsRes.status).toBe(200);
    expect(livePositionsRes.body.total).toBe(1);
    expect(livePositionsRes.body.openItems).toHaveLength(1);
    expect(livePositionsRes.body.openItems[0].symbol).toBe('BTCUSDT');
    expect(livePositionsRes.body.openItems[0].origin).toBe('EXCHANGE_SYNC');

    const paperPositionsRes = await owner.get(
      `/dashboard/bots/${paperBotId}/runtime-sessions/${paperSession.id}/positions`
    );
    expect(paperPositionsRes.status).toBe(200);
    expect(paperPositionsRes.body.total).toBe(0);
    expect(paperPositionsRes.body.openItems).toHaveLength(0);
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
      manageExternalPositions: true,
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
      manageExternalPositions: true,
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

  it('keeps recovered imported LIVE positions visible for the owning bot while marking them non-actionable', async () => {
    const ownerEmail = 'bot-runtime-recovered-visibility@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const apiKey = await prisma.apiKey.create({
      data: {
        userId: ownerUser.id,
        label: 'Runtime recovered visibility key',
        exchange: 'BINANCE',
        apiKey: 'runtime_recovered_visibility_key',
        apiSecret: 'runtime_recovered_visibility_secret',
        syncExternalPositions: true,
        manageExternalPositions: false,
      },
      select: { id: true },
    });

    const walletId = await createWalletForContext(ownerEmail, {
      mode: 'LIVE',
      exchange: 'BINANCE',
      marketType: 'FUTURES',
      baseCurrency: 'USDT',
      apiKeyId: apiKey.id,
    });
    const strategyId = await createStrategy(owner, 'Runtime Recovered Visibility Strategy');
    const marketGroupId = await createMarketGroup(ownerEmail, 'FUTURES');
    await prisma.symbolGroup.update({
      where: { id: marketGroupId },
      data: { symbols: ['DOGEUSDT'] },
    });

    const botRes = await owner.post('/dashboard/bots').send({
      ...createPayload({
        strategyId,
        marketGroupId,
      }),
      name: 'Recovered Visibility Bot',
      walletId,
      isActive: true,
      liveOptIn: true,
      manageExternalPositions: true,
      consentTextVersion: 'mvp-v1',
    });
    expect(botRes.status).toBe(201);
    const botId = botRes.body.id as string;

    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt: new Date('2026-04-28T09:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-28T09:01:00.000Z'),
      },
    });

    await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId,
        walletId,
        strategyId,
        symbol: 'DOGEUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 0.11,
        quantity: 5000,
        leverage: 5,
        openedAt: new Date('2026-04-28T08:55:00.000Z'),
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'DRIFT',
        continuityState: 'RECOVERED_UNACTIONABLE',
        externalId: `${apiKey.id}:DOGEUSDT:LONG`,
      },
    });

    const positionsRes = await owner.get(
      `/dashboard/bots/${botId}/runtime-sessions/${session.id}/positions`
    );
    expect(positionsRes.status).toBe(200);
    expect(positionsRes.body.total).toBe(1);
    expect(positionsRes.body.openItems).toHaveLength(1);
    expect(positionsRes.body.openItems[0].symbol).toBe('DOGEUSDT');
    expect(positionsRes.body.openItems[0].continuityState).toBe('RECOVERED_UNACTIONABLE');
    expect(positionsRes.body.openItems[0].actionable).toBe(false);
  });
});
