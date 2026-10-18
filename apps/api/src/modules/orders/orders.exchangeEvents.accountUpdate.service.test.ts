import { beforeEach, describe, expect, it } from 'vitest';

import { prisma } from '../../prisma/client';
import { applyLiveExchangeAccountUpdateEvent } from './orders.exchangeEvents.service';

const cleanupDb = async () => {
  await prisma.log.deleteMany();
  await prisma.backtestReport.deleteMany();
  await prisma.backtestTrade.deleteMany();
  await prisma.backtestRun.deleteMany();
  await prisma.orderFill.deleteMany();
  await prisma.trade.deleteMany();
  await prisma.order.deleteMany();
  await prisma.position.deleteMany();
  await prisma.signal.deleteMany();
  await prisma.botRuntimeSymbolStat.deleteMany();
  await prisma.botRuntimeEvent.deleteMany();
  await prisma.botRuntimeSession.deleteMany();
  await prisma.runtimeExecutionDedupe.deleteMany();
  await prisma.botStrategy.deleteMany();
  await prisma.botSubagentConfig.deleteMany();
  await prisma.botAssistantConfig.deleteMany();
  await prisma.marketGroupStrategyLink.deleteMany();
  await prisma.botMarketGroup.deleteMany();
  await prisma.bot.deleteMany();
  await prisma.symbolGroup.deleteMany();
  await prisma.marketUniverse.deleteMany();
  await prisma.strategy.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.user.deleteMany();
};

const createLiveApiKey = (userId: string, label: string) =>
  prisma.apiKey.create({
    data: {
      userId,
      label,
      exchange: 'BINANCE',
      apiKey: `${label}-key`,
      apiSecret: `${label}-secret`,
    },
  });

describe('orders.exchangeEvents.service account updates', () => {
  beforeEach(async () => {
    await cleanupDb();
  });

  it('observes BOT quantity drift without replacing fill-backed accounting or blocking a later fill', async () => {
    const user = await prisma.user.create({
      data: { email: 'exchange-event-bot-drift@example.com', password: 'hashed' },
    });
    const key = await createLiveApiKey(user.id, 'bot-drift-live-key');
    const wallet = await prisma.wallet.create({ data: {
      userId: user.id, name: 'bot-drift-wallet', mode: 'LIVE',
      exchange: 'BINANCE', marketType: 'FUTURES', baseCurrency: 'USDT',
      apiKeyId: key.id,
    } });
    const bot = await prisma.bot.create({ data: {
      userId: user.id, name: 'bot-drift-bot', mode: 'LIVE', exchange: 'BINANCE',
      marketType: 'FUTURES', positionMode: 'ONE_WAY', walletId: wallet.id,
      apiKeyId: key.id, isActive: true, liveOptIn: true,
      consentTextVersion: 'v1',
    } });
    const position = await prisma.position.create({ data: {
      userId: user.id, botId: bot.id, walletId: wallet.id, origin: 'BOT',
      managementMode: 'BOT_MANAGED', syncState: 'IN_SYNC', symbol: 'ETHUSDT',
      side: 'LONG', status: 'OPEN', quantity: 1, entryPrice: 100,
      unrealizedPnl: 0,
    } });
    const event = { eventType: 'ACCOUNT_UPDATE' as const,
      marketType: 'FUTURES' as const, eventTime: 5_000, transactionTime: 5_001,
      balances: [], positions: [{ symbol: 'ETHUSDT', amount: 2,
        entryPrice: 95, unrealizedPnl: 12, positionSide: 'LONG' as const }], raw: {} };

    await expect(applyLiveExchangeAccountUpdateEvent({ userId: user.id,
      sourceApiKeyId: key.id, event })).resolves
      .toEqual({ status: 'applied', updatedPositions: 1 });
    await expect(applyLiveExchangeAccountUpdateEvent({ userId: user.id,
      sourceApiKeyId: key.id, event })).resolves
      .toEqual({ status: 'applied', updatedPositions: 0 });
    expect(await prisma.position.findUniqueOrThrow({ where: { id: position.id } }))
      .toMatchObject({ quantity: 1, entryPrice: 100, unrealizedPnl: 0,
        syncState: 'IN_SYNC', continuityState: 'RECOVERING', missingSyncCount: 1,
        lastExchangeSyncAt: null });

    await applyLiveExchangeAccountUpdateEvent({ userId: user.id,
      sourceApiKeyId: key.id, event: { ...event, eventTime: 5_002,
        transactionTime: 5_002, positions: [{ ...event.positions[0],
          amount: 0, entryPrice: 0, unrealizedPnl: 0 }] } });
    expect(await prisma.position.findUniqueOrThrow({ where: { id: position.id } }))
      .toMatchObject({ quantity: 1, entryPrice: 100, syncState: 'IN_SYNC',
        continuityState: 'RECOVERING', missingSyncCount: 2 });

    await applyLiveExchangeAccountUpdateEvent({ userId: user.id,
      sourceApiKeyId: key.id, event: { ...event, eventTime: 5_003,
        transactionTime: 5_003, positions: [{ ...event.positions[0],
          amount: 3, entryPrice: null }] } });
    expect(await prisma.position.findUniqueOrThrow({ where: { id: position.id } }))
      .toMatchObject({ quantity: 1, entryPrice: 100,
        continuityState: 'RECOVERING', lastAccountQuantity: 3,
        lastAccountEntryPrice: null, missingSyncCount: 3 });
  });

  it('requires source api-key scope before refreshing canonical quantities and pnl', async () => {
    const user = await prisma.user.create({
      data: { email: 'exchange-event-account@example.com', password: 'hashed' },
    });
    const liveApiKey = await createLiveApiKey(user.id, 'account-update-live-key');
    const otherLiveApiKey = await createLiveApiKey(user.id, 'account-update-other-live-key');
    const liveWallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'account-update-live-wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        apiKeyId: liveApiKey.id,
      },
    });
    const otherLiveWallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'account-update-other-live-wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        apiKeyId: otherLiveApiKey.id,
      },
    });
    const position = await prisma.position.create({
      data: {
        userId: user.id,
        walletId: liveWallet.id,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 62_000,
        quantity: 0.1,
        leverage: 10,
        unrealizedPnl: 0,
      },
    });
    const untouchedOtherLivePosition = await prisma.position.create({
      data: {
        userId: user.id,
        walletId: otherLiveWallet.id,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 50_000,
        quantity: 0.33,
        leverage: 4,
        unrealizedPnl: 3,
      },
    });
    const event = {
      eventType: 'ACCOUNT_UPDATE' as const,
      marketType: 'FUTURES' as const,
      eventTime: 3_000,
      transactionTime: 3_001,
      balances: [],
      positions: [
        {
          symbol: 'BTCUSDT',
          amount: 0.15,
          entryPrice: 62_500,
          unrealizedPnl: 12.34,
          positionSide: 'LONG' as const,
        },
      ],
      raw: {},
    };

    await expect(
      applyLiveExchangeAccountUpdateEvent({ userId: user.id, event })
    ).resolves.toEqual({ status: 'applied', updatedPositions: 0 });
    await expect(
      applyLiveExchangeAccountUpdateEvent({ userId: user.id, sourceApiKeyId: liveApiKey.id, event })
    ).resolves.toEqual({ status: 'applied', updatedPositions: 1 });

    const updatedPosition = await prisma.position.findUniqueOrThrow({ where: { id: position.id } });
    expect(updatedPosition.quantity).toBe(0.15);
    expect(updatedPosition.entryPrice).toBe(62_500);
    expect(updatedPosition.unrealizedPnl).toBe(12.34);
    const otherLivePositionAfterUpdate = await prisma.position.findUniqueOrThrow({
      where: { id: untouchedOtherLivePosition.id },
    });
    expect(otherLivePositionAfterUpdate.quantity).toBe(0.33);
    expect(otherLivePositionAfterUpdate.entryPrice).toBe(50_000);
    expect(otherLivePositionAfterUpdate.unrealizedPnl).toBe(3);
  });

  it('marks zero-quantity account update as recovering drift until close fill truth arrives', async () => {
    const user = await prisma.user.create({
      data: { email: 'exchange-event-account-close@example.com', password: 'hashed' },
    });
    const liveApiKey = await createLiveApiKey(user.id, 'account-close-live-key');
    const liveWallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'account-close-live-wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        apiKeyId: liveApiKey.id,
      },
    });
    const position = await prisma.position.create({
      data: {
        userId: user.id,
        walletId: liveWallet.id,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        symbol: 'DOGEUSDT',
        side: 'SHORT',
        status: 'OPEN',
        entryPrice: 0.1,
        quantity: 100,
        leverage: 10,
        unrealizedPnl: 4,
      },
    });

    await expect(
      applyLiveExchangeAccountUpdateEvent({
        userId: user.id,
        sourceApiKeyId: liveApiKey.id,
        event: {
          eventType: 'ACCOUNT_UPDATE',
          marketType: 'FUTURES',
          eventTime: 4_000,
          transactionTime: 4_001,
          balances: [],
          positions: [
            {
              symbol: 'DOGEUSDT',
              amount: 0,
              entryPrice: 0,
              unrealizedPnl: 0,
              positionSide: 'SHORT',
            },
          ],
          raw: {},
        },
      })
    ).resolves.toEqual({ status: 'applied', updatedPositions: 1 });

    const driftPosition = await prisma.position.findUniqueOrThrow({ where: { id: position.id } });
    expect(driftPosition.status).toBe('OPEN');
    expect(driftPosition.syncState).toBe('DRIFT');
    expect(driftPosition.continuityState).toBe('RECOVERING');
    expect(driftPosition.closedAt).toBeNull();
    expect(driftPosition.closeReason).toBeNull();
    expect(driftPosition.closeInitiator).toBeNull();
    expect(driftPosition.unrealizedPnl).toBe(0);
    expect(driftPosition.missingSince?.getTime()).toBe(4_001);
    expect(driftPosition.lastExchangeSeenAt?.getTime()).toBe(4_001);
    expect(driftPosition.lastExchangeSyncAt?.getTime()).toBe(4_001);
    expect(driftPosition.missingSyncCount).toBe(1);
  });
});
