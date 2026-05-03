import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import { DCA_ADVANCED_STRATEGY_CONFIG } from './bots.e2e.fixtures';
import { createStrategy, registerAndLogin, resetBotsE2eState } from './bots.e2e.shared';

describe('Bots runtime strategy context contract', () => {
  beforeEach(resetBotsE2eState);

  it('reads runtime positions from canonical market-group venue before stale direct bot venue', async () => {
    const ownerEmail = 'bot-runtime-position-canonical-venue@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const strategyId = await createStrategy(owner, 'Runtime Position Canonical Venue Strategy');
    const staleUniverse = await prisma.marketUniverse.create({
      data: {
        userId: ownerUser.id,
        name: `Runtime Position Stale Spot Universe ${Date.now()}`,
        exchange: 'BINANCE',
        marketType: 'SPOT',
        baseCurrency: 'USDT',
        whitelist: [],
        blacklist: [],
      },
    });
    const canonicalUniverse = await prisma.marketUniverse.create({
      data: {
        userId: ownerUser.id,
        name: `Runtime Position Canonical Futures Universe ${Date.now()}`,
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: [],
        blacklist: [],
      },
    });
    const staleGroup = await prisma.symbolGroup.create({
      data: {
        userId: ownerUser.id,
        marketUniverseId: staleUniverse.id,
        name: 'Runtime Position Stale Direct Group',
        symbols: ['BTCUSDT'],
      },
    });
    const canonicalGroup = await prisma.symbolGroup.create({
      data: {
        userId: ownerUser.id,
        marketUniverseId: canonicalUniverse.id,
        name: 'Runtime Position Canonical Group',
        symbols: ['ETHUSDT'],
      },
    });
    const liveWallet = await prisma.wallet.create({
      data: {
        userId: ownerUser.id,
        name: 'Runtime Position Canonical Venue Wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: ownerUser.id,
        name: 'Runtime Position Canonical Venue Bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        walletId: liveWallet.id,
        strategyId,
        symbolGroupId: staleGroup.id,
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'v1',
      },
    });
    const botMarketGroup = await prisma.botMarketGroup.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        symbolGroupId: canonicalGroup.id,
        lifecycleStatus: 'ACTIVE',
        executionOrder: 1,
        maxOpenPositions: 2,
        isEnabled: true,
      },
    });
    await prisma.marketGroupStrategyLink.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        botMarketGroupId: botMarketGroup.id,
        strategyId,
        priority: 1,
        weight: 1,
        isEnabled: true,
      },
    });
    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt: new Date('2026-04-29T13:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-29T13:01:00.000Z'),
      },
    });
    await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        walletId: liveWallet.id,
        strategyId,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        symbol: 'ETHUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 3200,
        quantity: 0.5,
        leverage: 10,
        openedAt: new Date('2026-04-29T13:00:30.000Z'),
      },
    });

    const positionsRes = await owner.get(
      `/dashboard/bots/${bot.id}/runtime-sessions/${session.id}/positions`
    );

    expect(positionsRes.status).toBe(200);
    expect(positionsRes.body.openItems).toHaveLength(1);
    expect(positionsRes.body.openItems[0].symbol).toBe('ETHUSDT');
  });

  it('does not surface symbol-fallback DCA or trailing plans when LIVE position lacks canonical strategy context', async () => {
    const ownerEmail = 'bot-runtime-live-strategy-parity-owner@example.com';
    const owner = await registerAndLogin(ownerEmail);
    const ownerUser = await prisma.user.findUniqueOrThrow({ where: { email: ownerEmail } });

    const strategyId = await createStrategy(owner, 'Runtime Live Strategy Truth', DCA_ADVANCED_STRATEGY_CONFIG);
    const universe = await prisma.marketUniverse.create({
      data: {
        userId: ownerUser.id,
        name: `Live Strategy Truth Universe ${Date.now()}`,
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: [],
        blacklist: [],
      },
    });
    const liveWallet = await prisma.wallet.create({
      data: {
        userId: ownerUser.id,
        name: 'Live Strategy Truth Wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const group = await prisma.symbolGroup.create({
      data: {
        userId: ownerUser.id,
        marketUniverseId: universe.id,
        name: 'Live Strategy Truth Group',
        symbols: ['ETHUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: ownerUser.id,
        name: 'Live Strategy Truth Bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        walletId: liveWallet.id,
        strategyId,
        symbolGroupId: group.id,
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'v1',
      },
    });
    const session = await prisma.botRuntimeSession.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        mode: 'LIVE',
        status: 'RUNNING',
        startedAt: new Date('2026-04-29T12:00:00.000Z'),
        lastHeartbeatAt: new Date('2026-04-29T12:05:00.000Z'),
      },
    });
    const position = await prisma.position.create({
      data: {
        userId: ownerUser.id,
        botId: bot.id,
        walletId: liveWallet.id,
        strategyId: null,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        symbol: 'ETHUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 3200,
        quantity: 0.5,
        leverage: 10,
        openedAt: new Date('2026-04-29T12:01:00.000Z'),
      },
    });
    await prisma.trade.createMany({
      data: [
        {
          userId: ownerUser.id,
          botId: bot.id,
          walletId: liveWallet.id,
          positionId: position.id,
          strategyId: null,
          symbol: 'ETHUSDT',
          side: 'BUY',
          lifecycleAction: 'OPEN',
          price: 3200,
          quantity: 0.25,
          fee: 0,
          realizedPnl: 0,
          executedAt: new Date('2026-04-29T12:01:10.000Z'),
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
        },
        {
          userId: ownerUser.id,
          botId: bot.id,
          walletId: liveWallet.id,
          positionId: position.id,
          strategyId: null,
          symbol: 'ETHUSDT',
          side: 'BUY',
          lifecycleAction: 'DCA',
          price: 3150,
          quantity: 0.25,
          fee: 0,
          realizedPnl: 0,
          executedAt: new Date('2026-04-29T12:02:10.000Z'),
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
        },
      ],
    });

    const positionsRes = await owner.get(
      `/dashboard/bots/${bot.id}/runtime-sessions/${session.id}/positions`
    );
    expect(positionsRes.status).toBe(200);
    expect(positionsRes.body.openItems).toHaveLength(1);

    const item = positionsRes.body.openItems[0] as {
      actionable: boolean;
      strategyAutomationContextResolved: boolean;
      dcaPlannedLevels: number[];
      trailingStopLevels: unknown[];
      trailingTakeProfitLevels: unknown[];
    };
    expect(item.actionable).toBe(false);
    expect(item.strategyAutomationContextResolved).toBe(false);
    expect(item.dcaPlannedLevels).toEqual([]);
    expect(item.trailingStopLevels).toEqual([]);
    expect(item.trailingTakeProfitLevels).toEqual([]);
  });
});
