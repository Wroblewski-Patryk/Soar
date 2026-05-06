import { beforeEach, describe, expect, it } from 'vitest';

import { prisma } from '../../prisma/client';
import { applyLiveExchangeOrderTradeUpdateEvent } from './orders.exchangeEvents.service';

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

describe('orders.exchangeEvents fee backfill', () => {
  beforeEach(async () => {
    await cleanupDb();
  });

  it('keeps fee pending when a partial fee backfill leaves another fill unresolved', async () => {
    const user = await prisma.user.create({
      data: { email: 'exchange-event-partial-fee-backfill-still-pending@example.com', password: 'hashed' },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'live-wallet-partial-fee-backfill-still-pending',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'live-bot-partial-fee-backfill-still-pending',
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
        symbol: 'ETHUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 3_000,
        quantity: 1,
        leverage: 5,
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
        side: 'BUY',
        type: 'MARKET',
        status: 'FILLED',
        quantity: 1,
        filledQuantity: 1,
        averageFillPrice: 3_000,
        fee: 0.2,
        feeSource: 'EXCHANGE_FILL',
        feePending: true,
        feeCurrency: 'USDT',
        exchangeOrderId: 'event-partial-fee-backfill-still-pending',
        exchangeTradeId: 'trade-partial-fee-backfill-still-pending-3',
        submittedAt: new Date('2026-05-06T11:00:00.000Z'),
        filledAt: new Date('2026-05-06T11:00:03.000Z'),
      },
    });

    await Promise.all(
      [
        { exchangeTradeId: 'trade-partial-fee-backfill-still-pending-1', feeCost: null, quantity: 0.3 },
        { exchangeTradeId: 'trade-partial-fee-backfill-still-pending-2', feeCost: null, quantity: 0.3 },
        { exchangeTradeId: 'trade-partial-fee-backfill-still-pending-3', feeCost: 0.2, quantity: 0.4 },
      ].map((fill) =>
        prisma.orderFill.create({
          data: {
            userId: user.id,
            botId: bot.id,
            orderId: order.id,
            positionId: position.id,
            symbol: 'ETHUSDT',
            side: 'BUY',
            exchangeTradeId: fill.exchangeTradeId,
            price: 3_000,
            quantity: fill.quantity,
            notional: fill.quantity * 3_000,
            feeCost: fill.feeCost,
            feeCurrency: fill.feeCost === null ? null : 'USDT',
            feeRate: null,
            executedAt: new Date('2026-05-06T11:00:03.000Z'),
            raw: {},
          },
        }),
      ),
    );
    await prisma.trade.create({
      data: {
        userId: user.id,
        botId: bot.id,
        walletId: wallet.id,
        orderId: order.id,
        positionId: position.id,
        symbol: 'ETHUSDT',
        side: 'BUY',
        lifecycleAction: 'OPEN',
        price: 3_000,
        quantity: 1,
        fee: 0.2,
        feeSource: 'EXCHANGE_FILL',
        feePending: true,
        feeCurrency: 'USDT',
        exchangeTradeId: 'trade-partial-fee-backfill-still-pending-3',
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
      },
    });

    await applyLiveExchangeOrderTradeUpdateEvent({
      userId: user.id,
      event: {
        eventType: 'ORDER_TRADE_UPDATE',
        marketType: 'FUTURES',
        eventTime: 4_000,
        transactionTime: 4_001,
        symbol: 'ETHUSDT',
        side: 'BUY',
        orderType: 'MARKET',
        orderStatus: 'FILLED',
        executionType: 'TRADE',
        exchangeOrderId: 'event-partial-fee-backfill-still-pending',
        clientOrderId: 'client-partial-fee-backfill-still-pending',
        averagePrice: 3_000,
        cumulativeFilledQuantity: 1,
        lastFilledQuantity: 0.3,
        lastFilledPrice: 3_000,
        fee: 0.1,
        feeCurrency: 'USDT',
        exchangeTradeId: 'trade-partial-fee-backfill-still-pending-1',
        raw: {},
      },
    });

    const updatedOrder = await prisma.order.findUniqueOrThrow({
      where: { id: order.id },
    });
    expect(updatedOrder.fee).toBeCloseTo(0.3, 10);
    expect(updatedOrder.feeSource).toBe('EXCHANGE_FILL');
    expect(updatedOrder.feePending).toBe(true);
    const fills = await prisma.orderFill.findMany({
      where: { orderId: order.id },
      orderBy: { exchangeTradeId: 'asc' },
    });
    expect(fills).toHaveLength(3);
    expect(fills[0]?.feeCost).toBeCloseTo(0.1, 10);
    expect(fills[1]?.feeCost).toBeNull();
    expect(fills[2]?.feeCost).toBeCloseTo(0.2, 10);
    const trade = await prisma.trade.findFirstOrThrow({
      where: { orderId: order.id },
    });
    expect(trade.fee).toBeCloseTo(0.3, 10);
    expect(trade.feeSource).toBe('EXCHANGE_FILL');
    expect(trade.feePending).toBe(true);
  });
});
