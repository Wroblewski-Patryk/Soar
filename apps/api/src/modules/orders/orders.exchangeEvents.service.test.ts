import { beforeEach, describe, expect, it } from 'vitest';

import { prisma } from '../../prisma/client';
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

  it('applies account update to refresh canonical open-position quantities and pnl', async () => {
    const user = await prisma.user.create({
      data: { email: 'exchange-event-account@example.com', password: 'hashed' },
    });
    const position = await prisma.position.create({
      data: {
        userId: user.id,
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
  });

  it('closes locally open exchange-synced position when account update confirms zero quantity', async () => {
    const user = await prisma.user.create({
      data: { email: 'exchange-event-account-close@example.com', password: 'hashed' },
    });
    const position = await prisma.position.create({
      data: {
        userId: user.id,
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
  });
});
