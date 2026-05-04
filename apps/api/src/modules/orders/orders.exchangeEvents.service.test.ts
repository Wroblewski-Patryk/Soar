import { beforeEach, describe, expect, it } from 'vitest';

import { prisma } from '../../prisma/client';
import { buildDcaExecutionDedupeKey } from '../engine/runtimeExecutionDedupe.service';
import { runtimePositionStateStore } from '../engine/runtimePositionState.store';
import {
  applyLiveExchangeAccountUpdateEvent,
  applyLiveExchangeOrderTradeUpdateEvent,
} from './orders.exchangeEvents.service';

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

describe('orders.exchangeEvents.service', () => {
  beforeEach(async () => {
    await cleanupDb();
  });

  it('applies Binance order-trade update to open a position from a pending LIVE order', async () => {
    const user = await prisma.user.create({
      data: { email: 'exchange-event-open@example.com', password: 'hashed' },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'live-wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'live-bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        walletId: wallet.id,
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'v1',
      },
    });
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        botId: bot.id,
        walletId: wallet.id,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        symbol: 'BTCUSDT',
        side: 'BUY',
        type: 'MARKET',
        status: 'OPEN',
        quantity: 0.1,
        filledQuantity: 0,
        exchangeOrderId: 'event-order-open-1',
        submittedAt: new Date('2026-04-26T20:00:00.000Z'),
      },
    });

    const result = await applyLiveExchangeOrderTradeUpdateEvent({
      userId: user.id,
      event: {
        eventType: 'ORDER_TRADE_UPDATE',
        marketType: 'FUTURES',
        eventTime: 1_000,
        transactionTime: 1_001,
        symbol: 'BTCUSDT',
        side: 'BUY',
        orderType: 'MARKET',
        orderStatus: 'FILLED',
        executionType: 'TRADE',
        exchangeOrderId: 'event-order-open-1',
        clientOrderId: 'client-1',
        averagePrice: 63_000,
        cumulativeFilledQuantity: 0.1,
        lastFilledQuantity: 0.1,
        lastFilledPrice: 63_000,
        fee: 0.12,
        feeCurrency: 'USDT',
        exchangeTradeId: 'trade-open-1',
        raw: {},
      },
    });

    expect(result).toEqual(
      expect.objectContaining({
        status: 'applied',
        orderId: order.id,
        orderStatus: 'FILLED',
      })
    );
    const updatedOrder = await prisma.order.findUniqueOrThrow({
      where: { id: order.id },
    });
    expect(updatedOrder.positionId).toBeTruthy();
    expect(updatedOrder.averageFillPrice).toBe(63_000);
    const position = await prisma.position.findUniqueOrThrow({
      where: { id: updatedOrder.positionId! },
    });
    expect(position.status).toBe('OPEN');
    expect(position.entryPrice).toBe(63_000);
    const trade = await prisma.trade.findFirstOrThrow({
      where: { orderId: order.id },
    });
    expect(trade.lifecycleAction).toBe('OPEN');
    expect(trade.exchangeTradeId).toBe('trade-open-1');
    const fill = await prisma.orderFill.findFirstOrThrow({
      where: { orderId: order.id },
    });
    expect(fill.exchangeTradeId).toBe('trade-open-1');
  });

  it('applies Binance order-trade update to close an existing LIVE position from a close order', async () => {
    const user = await prisma.user.create({
      data: { email: 'exchange-event-close@example.com', password: 'hashed' },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'live-wallet-close',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'live-bot-close',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        walletId: wallet.id,
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'v1',
      },
    });
    const position = await prisma.position.create({
      data: {
        userId: user.id,
        botId: bot.id,
        walletId: wallet.id,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 60_000,
        quantity: 0.1,
        leverage: 5,
      },
    });
    await prisma.trade.create({
      data: {
        userId: user.id,
        botId: bot.id,
        walletId: wallet.id,
        orderId: null,
        positionId: position.id,
        symbol: 'BTCUSDT',
        side: 'BUY',
        lifecycleAction: 'OPEN',
        price: 60_000,
        quantity: 0.1,
        fee: 0.1,
        feeSource: 'EXCHANGE_FILL',
        feePending: false,
        feeCurrency: 'USDT',
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
      },
    });
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        botId: bot.id,
        walletId: wallet.id,
        positionId: position.id,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        symbol: 'BTCUSDT',
        side: 'SELL',
        type: 'MARKET',
        status: 'OPEN',
        quantity: 0.1,
        filledQuantity: 0,
        exchangeOrderId: 'event-order-close-1',
        submittedAt: new Date('2026-04-26T20:10:00.000Z'),
      },
    });

    const result = await applyLiveExchangeOrderTradeUpdateEvent({
      userId: user.id,
      event: {
        eventType: 'ORDER_TRADE_UPDATE',
        marketType: 'FUTURES',
        eventTime: 2_000,
        transactionTime: 2_001,
        symbol: 'BTCUSDT',
        side: 'SELL',
        orderType: 'MARKET',
        orderStatus: 'FILLED',
        executionType: 'TRADE',
        exchangeOrderId: 'event-order-close-1',
        clientOrderId: 'client-close-1',
        averagePrice: 61_000,
        cumulativeFilledQuantity: 0.1,
        lastFilledQuantity: 0.1,
        lastFilledPrice: 61_000,
        fee: 0.08,
        feeCurrency: 'USDT',
        exchangeTradeId: 'trade-close-1',
        raw: {},
      },
    });

    expect(result).toEqual(
      expect.objectContaining({
        status: 'applied',
        orderId: order.id,
        positionId: position.id,
        orderStatus: 'FILLED',
      })
    );
    const closedPosition = await prisma.position.findUniqueOrThrow({
      where: { id: position.id },
    });
    expect(closedPosition.status).toBe('CLOSED');
    expect(closedPosition.realizedPnl).toBeCloseTo(99.82, 6);
    expect(closedPosition.closeReason).toBe('MANUAL');
    expect(closedPosition.closeInitiator).toBe('BOT_APP');
    const closeTrade = await prisma.trade.findFirstOrThrow({
      where: { orderId: order.id },
    });
    expect(closeTrade.lifecycleAction).toBe('CLOSE');
    expect(closeTrade.realizedPnl).toBeCloseTo(99.82, 6);
    expect(closeTrade.closeReason).toBe('MANUAL');
    expect(closeTrade.closeInitiator).toBe('BOT_APP');
  });

  it('aggregates close PnL entry fees by position id for imported LIVE fill confirmations', async () => {
    const user = await prisma.user.create({
      data: { email: 'exchange-event-imported-close-fee@example.com', password: 'hashed' },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'live-wallet-imported-close-fee',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'live-bot-imported-close-fee',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        walletId: wallet.id,
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'v1',
      },
    });
    const position = await prisma.position.create({
      data: {
        userId: user.id,
        botId: null,
        walletId: null,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        symbol: 'ETHUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 100,
        quantity: 1,
        leverage: 5,
        externalId: 'api-key-imported:ETHUSDT:LONG',
      },
    });
    await prisma.trade.create({
      data: {
        userId: user.id,
        botId: null,
        walletId: null,
        orderId: null,
        positionId: position.id,
        symbol: 'ETHUSDT',
        side: 'BUY',
        lifecycleAction: 'OPEN',
        price: 100,
        quantity: 1,
        fee: 1.5,
        feeSource: 'EXCHANGE_FILL',
        feePending: false,
        feeCurrency: 'USDT',
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
      },
    });
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        botId: bot.id,
        walletId: wallet.id,
        positionId: position.id,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        symbol: 'ETHUSDT',
        side: 'SELL',
        type: 'MARKET',
        status: 'OPEN',
        quantity: 1,
        filledQuantity: 0,
        exchangeOrderId: 'event-order-imported-close-fee',
        submittedAt: new Date('2026-05-03T10:10:00.000Z'),
      },
    });

    const result = await applyLiveExchangeOrderTradeUpdateEvent({
      userId: user.id,
      event: {
        eventType: 'ORDER_TRADE_UPDATE',
        marketType: 'FUTURES',
        eventTime: 2_000,
        transactionTime: 2_001,
        symbol: 'ETHUSDT',
        side: 'SELL',
        orderType: 'MARKET',
        orderStatus: 'FILLED',
        executionType: 'TRADE',
        exchangeOrderId: 'event-order-imported-close-fee',
        clientOrderId: 'client-imported-close-fee',
        averagePrice: 110,
        cumulativeFilledQuantity: 1,
        lastFilledQuantity: 1,
        lastFilledPrice: 110,
        fee: 0.08,
        feeCurrency: 'USDT',
        exchangeTradeId: 'trade-imported-close-fee',
        raw: {},
      },
    });

    expect(result).toEqual(
      expect.objectContaining({
        status: 'applied',
        orderId: order.id,
        positionId: position.id,
        orderStatus: 'FILLED',
      })
    );
    const closedPosition = await prisma.position.findUniqueOrThrow({
      where: { id: position.id },
    });
    expect(closedPosition.status).toBe('CLOSED');
    expect(closedPosition.realizedPnl).toBeCloseTo(8.42, 6);
    const closeTrade = await prisma.trade.findFirstOrThrow({
      where: { orderId: order.id },
    });
    expect(closeTrade.lifecycleAction).toBe('CLOSE');
    expect(closeTrade.walletId).toBe(wallet.id);
    expect(closeTrade.realizedPnl).toBeCloseTo(8.42, 6);
  });

  it('applies Binance order-trade update to reprice and extend an existing LIVE position as DCA', async () => {
    const user = await prisma.user.create({
      data: { email: 'exchange-event-dca@example.com', password: 'hashed' },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'live-wallet-dca',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'live-bot-dca',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        walletId: wallet.id,
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'v1',
      },
    });
    const position = await prisma.position.create({
      data: {
        userId: user.id,
        botId: bot.id,
        walletId: wallet.id,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 62_000,
        quantity: 0.1,
        leverage: 5,
        continuityState: 'RECOVERING',
        missingSyncCount: 2,
      },
    });
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        botId: bot.id,
        walletId: wallet.id,
        positionId: position.id,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        symbol: 'BTCUSDT',
        side: 'BUY',
        type: 'MARKET',
        status: 'OPEN',
        quantity: 0.05,
        filledQuantity: 0,
        exchangeOrderId: 'event-order-dca-1',
        submittedAt: new Date('2026-04-29T10:00:00.000Z'),
      },
    });
    const dedupeKey = buildDcaExecutionDedupeKey({
      userId: user.id,
      botId: bot.id,
      symbol: 'BTCUSDT',
      positionId: position.id,
      dcaLevelIndex: 0,
      positionSide: 'LONG',
    });
    await prisma.runtimeExecutionDedupe.create({
      data: {
        dedupeKey,
        dedupeVersion: 'v1',
        commandType: 'DCA',
        userId: user.id,
        botId: bot.id,
        symbol: 'BTCUSDT',
        status: 'PENDING',
        commandFingerprint: {
          positionId: position.id,
          dcaLevelIndex: 0,
          positionSide: 'LONG',
        },
        orderId: order.id,
        positionId: position.id,
        ttlExpiresAt: new Date('2026-04-30T10:00:00.000Z'),
      },
    });
    await runtimePositionStateStore.setPositionRuntimeState(position.id, {
      quantity: 0.1,
      averageEntryPrice: 62_000,
      currentAdds: 0,
      trailingAnchorPrice: 62_000,
    });

    const result = await applyLiveExchangeOrderTradeUpdateEvent({
      userId: user.id,
      event: {
        eventType: 'ORDER_TRADE_UPDATE',
        marketType: 'FUTURES',
        eventTime: 5_000,
        transactionTime: 5_001,
        symbol: 'BTCUSDT',
        side: 'BUY',
        orderType: 'MARKET',
        orderStatus: 'FILLED',
        executionType: 'TRADE',
        exchangeOrderId: 'event-order-dca-1',
        clientOrderId: 'client-dca-1',
        averagePrice: 63_500,
        cumulativeFilledQuantity: 0.05,
        lastFilledQuantity: 0.05,
        lastFilledPrice: 63_500,
        fee: 0.03,
        feeCurrency: 'USDT',
        exchangeTradeId: 'trade-dca-1',
        raw: {},
      },
    });

    expect(result).toEqual(
      expect.objectContaining({
        status: 'applied',
        orderId: order.id,
        positionId: position.id,
        orderStatus: 'FILLED',
      })
    );
    const updatedPosition = await prisma.position.findUniqueOrThrow({
      where: { id: position.id },
    });
    expect(updatedPosition.quantity).toBeCloseTo(0.15, 10);
    expect(updatedPosition.entryPrice).toBeCloseTo(62_500, 10);
    expect(updatedPosition.continuityState).toBe('CONFIRMED');
    expect(updatedPosition.missingSyncCount).toBe(0);
    const dcaTrade = await prisma.trade.findFirstOrThrow({
      where: { orderId: order.id },
    });
    expect(dcaTrade.lifecycleAction).toBe('DCA');
    expect(dcaTrade.exchangeTradeId).toBe('trade-dca-1');
    const updatedDedupe = await prisma.runtimeExecutionDedupe.findUniqueOrThrow({
      where: { dedupeKey },
    });
    expect(updatedDedupe.status).toBe('SUCCEEDED');
    const runtimeState = await runtimePositionStateStore.getPositionRuntimeState(position.id);
    expect(runtimeState?.quantity).toBeCloseTo(0.15, 10);
    expect(runtimeState?.averageEntryPrice).toBeCloseTo(62_500, 10);
    expect(runtimeState?.currentAdds).toBe(1);
    expect(runtimeState?.trailingAnchorPrice).toBeCloseTo(62_000, 10);
    expect(runtimeState?.lastDcaPrice).toBeCloseTo(63_500, 10);
    await runtimePositionStateStore.deletePositionRuntimeState(position.id);
  });

  it('applies account update to refresh canonical open-position quantities and pnl', async () => {
    const user = await prisma.user.create({
      data: { email: 'exchange-event-account@example.com', password: 'hashed' },
    });
    const liveWallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'account-update-live-wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
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
    const liveBot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'account-update-live-bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        walletId: liveWallet.id,
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'v1',
      },
    });
    const paperWallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'account-update-paper-wallet',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const untouchedPaperPosition = await prisma.position.create({
      data: {
        userId: user.id,
        walletId: paperWallet.id,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 48_000,
        quantity: 0.25,
        leverage: 3,
        unrealizedPnl: 7,
      },
    });
    const staleLocalPosition = await prisma.position.create({
      data: {
        userId: user.id,
        botId: liveBot.id,
        walletId: null,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'ORPHAN_LOCAL',
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 58_000,
        quantity: 0.2,
        leverage: 10,
        unrealizedPnl: 99,
      },
    });

    const result = await applyLiveExchangeAccountUpdateEvent({
      userId: user.id,
      event: {
        eventType: 'ACCOUNT_UPDATE',
        marketType: 'FUTURES',
        eventTime: 3_000,
        transactionTime: 3_001,
        balances: [],
        positions: [
          {
            symbol: 'BTCUSDT',
            amount: 0.15,
            entryPrice: 62_500,
            unrealizedPnl: 12.34,
            positionSide: 'LONG',
          },
        ],
        raw: {},
      },
    });

    expect(result).toEqual({
      status: 'applied',
      updatedPositions: 1,
    });
    const updatedPosition = await prisma.position.findUniqueOrThrow({
      where: { id: position.id },
    });
    expect(updatedPosition.quantity).toBe(0.15);
    expect(updatedPosition.entryPrice).toBe(62_500);
    expect(updatedPosition.unrealizedPnl).toBe(12.34);
    const stalePositionAfterUpdate = await prisma.position.findUniqueOrThrow({
      where: { id: staleLocalPosition.id },
    });
    expect(stalePositionAfterUpdate.quantity).toBe(0.2);
    expect(stalePositionAfterUpdate.entryPrice).toBe(58_000);
    expect(stalePositionAfterUpdate.unrealizedPnl).toBe(99);
    const paperPositionAfterUpdate = await prisma.position.findUniqueOrThrow({
      where: { id: untouchedPaperPosition.id },
    });
    expect(paperPositionAfterUpdate.quantity).toBe(0.25);
    expect(paperPositionAfterUpdate.entryPrice).toBe(48_000);
    expect(paperPositionAfterUpdate.unrealizedPnl).toBe(7);
  });

  it('closes locally open exchange-synced position when account update confirms zero quantity', async () => {
    const user = await prisma.user.create({
      data: { email: 'exchange-event-account-close@example.com', password: 'hashed' },
    });
    const liveWallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'account-close-live-wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
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
    const paperWallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'account-close-paper-wallet',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const untouchedPaperPosition = await prisma.position.create({
      data: {
        userId: user.id,
        walletId: paperWallet.id,
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
        symbol: 'DOGEUSDT',
        side: 'SHORT',
        status: 'OPEN',
        entryPrice: 0.12,
        quantity: 50,
        leverage: 3,
        unrealizedPnl: 1.5,
      },
    });

    const result = await applyLiveExchangeAccountUpdateEvent({
      userId: user.id,
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
    });

    expect(result).toEqual({
      status: 'applied',
      updatedPositions: 1,
    });
    const closedPosition = await prisma.position.findUniqueOrThrow({
      where: { id: position.id },
    });
    expect(closedPosition.status).toBe('CLOSED');
    expect(closedPosition.closeReason).toBe('EXTERNAL_SYNC_MISSING');
    expect(closedPosition.closeInitiator).toBe('USER_EXCHANGE');
    const paperPositionAfterUpdate = await prisma.position.findUniqueOrThrow({
      where: { id: untouchedPaperPosition.id },
    });
    expect(paperPositionAfterUpdate.status).toBe('OPEN');
    expect(paperPositionAfterUpdate.quantity).toBe(50);
  });
});
