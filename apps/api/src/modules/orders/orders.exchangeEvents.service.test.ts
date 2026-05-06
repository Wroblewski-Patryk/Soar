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
    const staleLocalOrder = await prisma.order.create({
      data: {
        userId: user.id,
        botId: bot.id,
        walletId: wallet.id,
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'ORPHAN_LOCAL',
        symbol: 'BTCUSDT',
        side: 'BUY',
        type: 'MARKET',
        status: 'OPEN',
        quantity: 0.1,
        filledQuantity: 0,
        exchangeOrderId: 'event-order-open-1',
        submittedAt: new Date('2026-04-26T20:01:00.000Z'),
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
    const staleOrderAfterEvent = await prisma.order.findUniqueOrThrow({
      where: { id: staleLocalOrder.id },
    });
    expect(staleOrderAfterEvent.status).toBe('OPEN');
    expect(staleOrderAfterEvent.filledQuantity).toBe(0);
    expect(staleOrderAfterEvent.positionId).toBeNull();
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

  it('caps previously over-reported local filled quantity during exchange event reconciliation', async () => {
    const user = await prisma.user.create({
      data: { email: 'exchange-event-existing-overfill@example.com', password: 'hashed' },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'live-wallet-existing-overfill',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'live-bot-existing-overfill',
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
        symbol: 'ETHUSDT',
        side: 'BUY',
        type: 'MARKET',
        status: 'FILLED',
        quantity: 2,
        filledQuantity: 2.5,
        exchangeOrderId: 'event-existing-overfill-1',
        submittedAt: new Date('2026-04-26T20:05:00.000Z'),
      },
    });

    const result = await applyLiveExchangeOrderTradeUpdateEvent({
      userId: user.id,
      event: {
        eventType: 'ORDER_TRADE_UPDATE',
        marketType: 'FUTURES',
        eventTime: 1_100,
        transactionTime: 1_101,
        symbol: 'ETHUSDT',
        side: 'BUY',
        orderType: 'MARKET',
        orderStatus: 'FILLED',
        executionType: 'TRADE',
        exchangeOrderId: 'event-existing-overfill-1',
        clientOrderId: 'client-existing-overfill-1',
        averagePrice: 3_000,
        cumulativeFilledQuantity: 2.5,
        lastFilledQuantity: 0.5,
        lastFilledPrice: 3_000,
        fee: 0.025,
        feeCurrency: 'USDT',
        exchangeTradeId: 'trade-existing-overfill-1',
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
    expect(updatedOrder.filledQuantity).toBe(2);
    expect(updatedOrder.positionId).toBeNull();
    await expect(prisma.trade.findFirstOrThrow({ where: { orderId: order.id } })).rejects.toThrow();
  });

  it('caps exchange order-fill row quantity to accepted local fill progress', async () => {
    const user = await prisma.user.create({
      data: { email: 'exchange-event-fill-row-overreport@example.com', password: 'hashed' },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'live-wallet-fill-row-overreport',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'live-bot-fill-row-overreport',
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
        symbol: 'ETHUSDT',
        side: 'BUY',
        type: 'MARKET',
        status: 'OPEN',
        quantity: 2,
        filledQuantity: 0,
        exchangeOrderId: 'event-fill-row-overreport-1',
        submittedAt: new Date('2026-04-26T20:06:00.000Z'),
      },
    });

    const result = await applyLiveExchangeOrderTradeUpdateEvent({
      userId: user.id,
      event: {
        eventType: 'ORDER_TRADE_UPDATE',
        marketType: 'FUTURES',
        eventTime: 1_200,
        transactionTime: 1_201,
        symbol: 'ETHUSDT',
        side: 'BUY',
        orderType: 'MARKET',
        orderStatus: 'FILLED',
        executionType: 'TRADE',
        exchangeOrderId: 'event-fill-row-overreport-1',
        clientOrderId: 'client-fill-row-overreport-1',
        averagePrice: 3_000,
        cumulativeFilledQuantity: 2.5,
        lastFilledQuantity: 2.5,
        lastFilledPrice: 3_000,
        fee: 0.02,
        feeCurrency: 'USDT',
        exchangeTradeId: 'trade-fill-row-overreport-1',
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
    expect(updatedOrder.filledQuantity).toBe(2);
    const fill = await prisma.orderFill.findFirstOrThrow({
      where: { orderId: order.id },
    });
    expect(fill.quantity).toBe(2);
    expect(fill.notional).toBe(6_000);
    expect(fill.feeCost).toBeCloseTo(0.016, 10);
    const position = await prisma.position.findUniqueOrThrow({
      where: { id: updatedOrder.positionId! },
    });
    expect(position.quantity).toBe(2);
    const trade = await prisma.trade.findFirstOrThrow({
      where: { orderId: order.id },
    });
    expect(trade.quantity).toBe(2);
    expect(trade.fee).toBeCloseTo(0.016, 10);
    expect(updatedOrder.fee).toBeCloseTo(0.016, 10);
  });

  it('restores exchange-filled LIVE orders fee-pending when the event has no fee truth', async () => {
    const user = await prisma.user.create({
      data: { email: 'exchange-event-filled-fee-pending@example.com', password: 'hashed' },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'live-wallet-filled-fee-pending',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'live-bot-filled-fee-pending',
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
        symbol: 'ETHUSDT',
        side: 'BUY',
        type: 'MARKET',
        status: 'OPEN',
        quantity: 1,
        filledQuantity: 0,
        fee: null,
        feeSource: 'ESTIMATED',
        feePending: false,
        exchangeOrderId: 'event-filled-fee-pending-1',
        submittedAt: new Date('2026-04-26T20:07:00.000Z'),
      },
    });

    const result = await applyLiveExchangeOrderTradeUpdateEvent({
      userId: user.id,
      event: {
        eventType: 'ORDER_TRADE_UPDATE',
        marketType: 'FUTURES',
        eventTime: 1_300,
        transactionTime: 1_301,
        symbol: 'ETHUSDT',
        side: 'BUY',
        orderType: 'MARKET',
        orderStatus: 'FILLED',
        executionType: 'TRADE',
        exchangeOrderId: 'event-filled-fee-pending-1',
        clientOrderId: 'client-filled-fee-pending-1',
        averagePrice: 3_000,
        cumulativeFilledQuantity: 1,
        lastFilledQuantity: 1,
        lastFilledPrice: 3_000,
        fee: null,
        feeCurrency: null,
        exchangeTradeId: 'trade-filled-fee-pending-1',
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
    expect(updatedOrder.status).toBe('FILLED');
    expect(updatedOrder.fee).toBeNull();
    expect(updatedOrder.feeSource).toBe('ESTIMATED');
    expect(updatedOrder.feePending).toBe(true);
    const trade = await prisma.trade.findFirstOrThrow({
      where: { orderId: order.id },
    });
    expect(trade.lifecycleAction).toBe('OPEN');
    expect(trade.fee).toBeNull();
    expect(trade.feeSource).toBe('ESTIMATED');
    expect(trade.feePending).toBe(true);
    const fill = await prisma.orderFill.findFirstOrThrow({
      where: { orderId: order.id },
    });
    expect(fill.feeCost).toBeNull();
  });

  it('aggregates exchange fill fees across partial and final fills', async () => {
    const user = await prisma.user.create({
      data: { email: 'exchange-event-aggregate-fill-fees@example.com', password: 'hashed' },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'live-wallet-aggregate-fill-fees',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'live-bot-aggregate-fill-fees',
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
        symbol: 'ETHUSDT',
        side: 'BUY',
        type: 'MARKET',
        status: 'OPEN',
        quantity: 2,
        filledQuantity: 0,
        fee: null,
        feeSource: 'ESTIMATED',
        feePending: true,
        exchangeOrderId: 'event-aggregate-fill-fees-1',
        submittedAt: new Date('2026-04-26T20:08:00.000Z'),
      },
    });

    await applyLiveExchangeOrderTradeUpdateEvent({
      userId: user.id,
      event: {
        eventType: 'ORDER_TRADE_UPDATE',
        marketType: 'FUTURES',
        eventTime: 1_400,
        transactionTime: 1_401,
        symbol: 'ETHUSDT',
        side: 'BUY',
        orderType: 'MARKET',
        orderStatus: 'PARTIALLY_FILLED',
        executionType: 'TRADE',
        exchangeOrderId: 'event-aggregate-fill-fees-1',
        clientOrderId: 'client-aggregate-fill-fees-1',
        averagePrice: 3_000,
        cumulativeFilledQuantity: 1,
        lastFilledQuantity: 1,
        lastFilledPrice: 3_000,
        fee: 0.01,
        feeCurrency: 'USDT',
        exchangeTradeId: 'trade-aggregate-fill-fees-1',
        raw: {},
      },
    });

    const result = await applyLiveExchangeOrderTradeUpdateEvent({
      userId: user.id,
      event: {
        eventType: 'ORDER_TRADE_UPDATE',
        marketType: 'FUTURES',
        eventTime: 1_500,
        transactionTime: 1_501,
        symbol: 'ETHUSDT',
        side: 'BUY',
        orderType: 'MARKET',
        orderStatus: 'FILLED',
        executionType: 'TRADE',
        exchangeOrderId: 'event-aggregate-fill-fees-1',
        clientOrderId: 'client-aggregate-fill-fees-1',
        averagePrice: 3_000,
        cumulativeFilledQuantity: 2,
        lastFilledQuantity: 1,
        lastFilledPrice: 3_000,
        fee: 0.02,
        feeCurrency: 'USDT',
        exchangeTradeId: 'trade-aggregate-fill-fees-2',
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
    expect(updatedOrder.fee).toBeCloseTo(0.03, 10);
    expect(updatedOrder.feeSource).toBe('EXCHANGE_FILL');
    expect(updatedOrder.feePending).toBe(false);
    const fills = await prisma.orderFill.findMany({
      where: { orderId: order.id },
      orderBy: { exchangeTradeId: 'asc' },
    });
    expect(fills).toHaveLength(2);
    expect(fills[0]?.feeCost).toBeCloseTo(0.01, 10);
    expect(fills[1]?.feeCost).toBeCloseTo(0.02, 10);
    const trade = await prisma.trade.findFirstOrThrow({
      where: { orderId: order.id },
    });
    expect(trade.lifecycleAction).toBe('OPEN');
    expect(trade.fee).toBeCloseTo(0.03, 10);
  });

  it('keeps fee pending while exact exchange fee belongs only to a partial fill', async () => {
    const user = await prisma.user.create({
      data: { email: 'exchange-event-partial-fill-fee-pending@example.com', password: 'hashed' },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'live-wallet-partial-fill-fee-pending',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'live-bot-partial-fill-fee-pending',
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
        symbol: 'ETHUSDT',
        side: 'BUY',
        type: 'MARKET',
        status: 'OPEN',
        quantity: 1,
        filledQuantity: 0,
        averageFillPrice: null,
        fee: null,
        feeSource: 'ESTIMATED',
        feePending: false,
        exchangeOrderId: 'event-partial-fill-fee-pending-1',
        submittedAt: new Date('2026-04-26T20:08:30.000Z'),
      },
    });

    await applyLiveExchangeOrderTradeUpdateEvent({
      userId: user.id,
      event: {
        eventType: 'ORDER_TRADE_UPDATE',
        marketType: 'FUTURES',
        eventTime: 1_650,
        transactionTime: 1_651,
        symbol: 'ETHUSDT',
        side: 'BUY',
        orderType: 'MARKET',
        orderStatus: 'PARTIALLY_FILLED',
        executionType: 'TRADE',
        exchangeOrderId: 'event-partial-fill-fee-pending-1',
        clientOrderId: 'client-partial-fill-fee-pending-1',
        averagePrice: 3_000,
        cumulativeFilledQuantity: 0.5,
        lastFilledQuantity: 0.5,
        lastFilledPrice: 3_000,
        fee: 0.01,
        feeCurrency: 'USDT',
        exchangeTradeId: 'trade-partial-fill-fee-pending-1',
        raw: {},
      },
    });

    const updatedOrder = await prisma.order.findUniqueOrThrow({
      where: { id: order.id },
    });
    expect(updatedOrder.status).toBe('PARTIALLY_FILLED');
    expect(updatedOrder.filledQuantity).toBeCloseTo(0.5, 10);
    expect(updatedOrder.fee).toBeCloseTo(0.01, 10);
    expect(updatedOrder.feeSource).toBe('EXCHANGE_FILL');
    expect(updatedOrder.feePending).toBe(true);
    const fills = await prisma.orderFill.findMany({
      where: { orderId: order.id },
    });
    expect(fills).toHaveLength(1);
    expect(fills[0]?.feeCost).toBeCloseTo(0.01, 10);
    const trades = await prisma.trade.findMany({
      where: { orderId: order.id },
    });
    expect(trades).toHaveLength(0);
  });

  it('backfills missing fee truth for an already recorded exchange fill', async () => {
    const user = await prisma.user.create({
      data: { email: 'exchange-event-fill-fee-backfill@example.com', password: 'hashed' },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'live-wallet-fill-fee-backfill',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'live-bot-fill-fee-backfill',
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
        fee: null,
        feeSource: 'ESTIMATED',
        feePending: true,
        exchangeOrderId: 'event-fill-fee-backfill-1',
        exchangeTradeId: 'trade-fill-fee-backfill-1',
        submittedAt: new Date('2026-04-26T20:09:00.000Z'),
        filledAt: new Date('2026-04-26T20:09:01.000Z'),
      },
    });
    await prisma.orderFill.create({
      data: {
        userId: user.id,
        botId: bot.id,
        orderId: order.id,
        positionId: position.id,
        symbol: 'ETHUSDT',
        side: 'BUY',
        exchangeTradeId: 'trade-fill-fee-backfill-1',
        price: 3_000,
        quantity: 1,
        notional: 3_000,
        feeCost: null,
        feeCurrency: null,
        feeRate: null,
        executedAt: new Date('2026-04-26T20:09:01.000Z'),
        raw: {},
      },
    });
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
        fee: null,
        feeSource: 'ESTIMATED',
        feePending: true,
        feeCurrency: null,
        exchangeTradeId: 'trade-fill-fee-backfill-1',
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
      },
    });

    const result = await applyLiveExchangeOrderTradeUpdateEvent({
      userId: user.id,
      event: {
        eventType: 'ORDER_TRADE_UPDATE',
        marketType: 'FUTURES',
        eventTime: 1_600,
        transactionTime: 1_601,
        symbol: 'ETHUSDT',
        side: 'BUY',
        orderType: 'MARKET',
        orderStatus: 'FILLED',
        executionType: 'TRADE',
        exchangeOrderId: 'event-fill-fee-backfill-1',
        clientOrderId: 'client-fill-fee-backfill-1',
        averagePrice: 3_000,
        cumulativeFilledQuantity: 1,
        lastFilledQuantity: 1,
        lastFilledPrice: 3_000,
        fee: 0.04,
        feeCurrency: 'USDT',
        exchangeTradeId: 'trade-fill-fee-backfill-1',
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
    expect(updatedOrder.fee).toBeCloseTo(0.04, 10);
    expect(updatedOrder.feeSource).toBe('EXCHANGE_FILL');
    expect(updatedOrder.feePending).toBe(false);
    expect(updatedOrder.feeCurrency).toBe('USDT');
    const fills = await prisma.orderFill.findMany({
      where: { orderId: order.id },
    });
    expect(fills).toHaveLength(1);
    expect(fills[0]?.feeCost).toBeCloseTo(0.04, 10);
    expect(fills[0]?.feeCurrency).toBe('USDT');
    const trades = await prisma.trade.findMany({
      where: { orderId: order.id },
    });
    expect(trades).toHaveLength(1);
    expect(trades[0]?.fee).toBeCloseTo(0.04, 10);
    expect(trades[0]?.feeSource).toBe('EXCHANGE_FILL');
    expect(trades[0]?.feePending).toBe(false);
  });

  it('keeps stale terminal fee events from changing fees for unknown exchange fills', async () => {
    const user = await prisma.user.create({
      data: { email: 'exchange-event-stale-fee-unknown-fill@example.com', password: 'hashed' },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'live-wallet-stale-fee-unknown-fill',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'live-bot-stale-fee-unknown-fill',
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
        fee: 0.04,
        feeSource: 'EXCHANGE_FILL',
        feePending: false,
        feeCurrency: 'USDT',
        exchangeOrderId: 'event-stale-fee-unknown-fill-1',
        exchangeTradeId: 'trade-stale-fee-known-fill-1',
        submittedAt: new Date('2026-04-26T20:09:00.000Z'),
        filledAt: new Date('2026-04-26T20:09:01.000Z'),
      },
    });
    await prisma.orderFill.create({
      data: {
        userId: user.id,
        botId: bot.id,
        orderId: order.id,
        positionId: position.id,
        symbol: 'ETHUSDT',
        side: 'BUY',
        exchangeTradeId: 'trade-stale-fee-known-fill-1',
        price: 3_000,
        quantity: 1,
        notional: 3_000,
        feeCost: 0.04,
        feeCurrency: 'USDT',
        feeRate: null,
        executedAt: new Date('2026-04-26T20:09:01.000Z'),
        raw: {},
      },
    });
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
        fee: 0.04,
        feeSource: 'EXCHANGE_FILL',
        feePending: false,
        feeCurrency: 'USDT',
        exchangeTradeId: 'trade-stale-fee-known-fill-1',
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
      },
    });

    const result = await applyLiveExchangeOrderTradeUpdateEvent({
      userId: user.id,
      event: {
        eventType: 'ORDER_TRADE_UPDATE',
        marketType: 'FUTURES',
        eventTime: 1_700,
        transactionTime: 1_701,
        symbol: 'ETHUSDT',
        side: 'BUY',
        orderType: 'MARKET',
        orderStatus: 'FILLED',
        executionType: 'TRADE',
        exchangeOrderId: 'event-stale-fee-unknown-fill-1',
        clientOrderId: 'client-stale-fee-unknown-fill-1',
        averagePrice: 3_000,
        cumulativeFilledQuantity: 1,
        lastFilledQuantity: 1,
        lastFilledPrice: 3_000,
        fee: 0.09,
        feeCurrency: 'USDT',
        exchangeTradeId: 'trade-stale-fee-unknown-fill-1',
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
    expect(updatedOrder.fee).toBeCloseTo(0.04, 10);
    expect(updatedOrder.feeSource).toBe('EXCHANGE_FILL');
    expect(updatedOrder.feePending).toBe(false);
    const fills = await prisma.orderFill.findMany({
      where: { orderId: order.id },
    });
    expect(fills).toHaveLength(1);
    expect(fills[0]?.exchangeTradeId).toBe('trade-stale-fee-known-fill-1');
    expect(fills[0]?.feeCost).toBeCloseTo(0.04, 10);
    const trades = await prisma.trade.findMany({
      where: { orderId: order.id },
    });
    expect(trades).toHaveLength(1);
    expect(trades[0]?.exchangeTradeId).toBe('trade-stale-fee-known-fill-1');
    expect(trades[0]?.fee).toBeCloseTo(0.04, 10);
  });

  it('keeps fee pending when stale unknown exchange fill fee is rejected', async () => {
    const user = await prisma.user.create({
      data: { email: 'exchange-event-stale-fee-pending@example.com', password: 'hashed' },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'live-wallet-stale-fee-pending',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'live-bot-stale-fee-pending',
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
        fee: 0.04,
        feeSource: 'ESTIMATED',
        feePending: true,
        feeCurrency: 'USDT',
        exchangeOrderId: 'event-stale-fee-pending-1',
        exchangeTradeId: 'trade-stale-fee-pending-known-1',
        submittedAt: new Date('2026-04-26T20:09:00.000Z'),
        filledAt: new Date('2026-04-26T20:09:01.000Z'),
      },
    });
    await prisma.orderFill.create({
      data: {
        userId: user.id,
        botId: bot.id,
        orderId: order.id,
        positionId: position.id,
        symbol: 'ETHUSDT',
        side: 'BUY',
        exchangeTradeId: 'trade-stale-fee-pending-known-1',
        price: 3_000,
        quantity: 1,
        notional: 3_000,
        feeCost: null,
        feeCurrency: null,
        feeRate: null,
        executedAt: new Date('2026-04-26T20:09:01.000Z'),
        raw: {},
      },
    });
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
        fee: 0.04,
        feeSource: 'ESTIMATED',
        feePending: true,
        feeCurrency: 'USDT',
        exchangeTradeId: 'trade-stale-fee-pending-known-1',
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
      },
    });

    await applyLiveExchangeOrderTradeUpdateEvent({
      userId: user.id,
      event: {
        eventType: 'ORDER_TRADE_UPDATE',
        marketType: 'FUTURES',
        eventTime: 1_800,
        transactionTime: 1_801,
        symbol: 'ETHUSDT',
        side: 'BUY',
        orderType: 'MARKET',
        orderStatus: 'FILLED',
        executionType: 'TRADE',
        exchangeOrderId: 'event-stale-fee-pending-1',
        clientOrderId: 'client-stale-fee-pending-1',
        averagePrice: 3_000,
        cumulativeFilledQuantity: 1,
        lastFilledQuantity: 1,
        lastFilledPrice: 3_000,
        fee: 0.09,
        feeCurrency: 'USDT',
        exchangeTradeId: 'trade-stale-fee-pending-unknown-1',
        raw: {},
      },
    });

    const updatedOrder = await prisma.order.findUniqueOrThrow({
      where: { id: order.id },
    });
    expect(updatedOrder.fee).toBeCloseTo(0.04, 10);
    expect(updatedOrder.feeSource).toBe('ESTIMATED');
    expect(updatedOrder.feePending).toBe(true);
    const fills = await prisma.orderFill.findMany({
      where: { orderId: order.id },
    });
    expect(fills).toHaveLength(1);
    expect(fills[0]?.exchangeTradeId).toBe('trade-stale-fee-pending-known-1');
    expect(fills[0]?.feeCost).toBeNull();
    const trade = await prisma.trade.findFirstOrThrow({
      where: { orderId: order.id },
    });
    expect(trade.feeSource).toBe('ESTIMATED');
    expect(trade.feePending).toBe(true);
  });

  it('restores fee pending when stale unknown exchange fill fee is rejected after local drift', async () => {
    const user = await prisma.user.create({
      data: { email: 'exchange-event-stale-fee-pending-recovery@example.com', password: 'hashed' },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'live-wallet-stale-fee-pending-recovery',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'live-bot-stale-fee-pending-recovery',
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
        fee: 0.04,
        feeSource: 'ESTIMATED',
        feePending: false,
        feeCurrency: 'USDT',
        exchangeOrderId: 'event-stale-fee-pending-recovery-1',
        exchangeTradeId: 'trade-stale-fee-pending-recovery-known-1',
        submittedAt: new Date('2026-04-26T20:09:00.000Z'),
        filledAt: new Date('2026-04-26T20:09:01.000Z'),
      },
    });
    await prisma.orderFill.create({
      data: {
        userId: user.id,
        botId: bot.id,
        orderId: order.id,
        positionId: position.id,
        symbol: 'ETHUSDT',
        side: 'BUY',
        exchangeTradeId: 'trade-stale-fee-pending-recovery-known-1',
        price: 3_000,
        quantity: 1,
        notional: 3_000,
        feeCost: null,
        feeCurrency: null,
        feeRate: null,
        executedAt: new Date('2026-04-26T20:09:01.000Z'),
        raw: {},
      },
    });
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
        fee: 0.04,
        feeSource: 'ESTIMATED',
        feePending: false,
        feeCurrency: 'USDT',
        exchangeTradeId: 'trade-stale-fee-pending-recovery-known-1',
        origin: 'BOT',
        managementMode: 'BOT_MANAGED',
      },
    });

    await applyLiveExchangeOrderTradeUpdateEvent({
      userId: user.id,
      event: {
        eventType: 'ORDER_TRADE_UPDATE',
        marketType: 'FUTURES',
        eventTime: 1_900,
        transactionTime: 1_901,
        symbol: 'ETHUSDT',
        side: 'BUY',
        orderType: 'MARKET',
        orderStatus: 'FILLED',
        executionType: 'TRADE',
        exchangeOrderId: 'event-stale-fee-pending-recovery-1',
        clientOrderId: 'client-stale-fee-pending-recovery-1',
        averagePrice: 3_000,
        cumulativeFilledQuantity: 1,
        lastFilledQuantity: 1,
        lastFilledPrice: 3_000,
        fee: 0.09,
        feeCurrency: 'USDT',
        exchangeTradeId: 'trade-stale-fee-pending-recovery-unknown-1',
        raw: {},
      },
    });

    const updatedOrder = await prisma.order.findUniqueOrThrow({
      where: { id: order.id },
    });
    expect(updatedOrder.fee).toBeCloseTo(0.04, 10);
    expect(updatedOrder.feeSource).toBe('ESTIMATED');
    expect(updatedOrder.feePending).toBe(true);
    const fills = await prisma.orderFill.findMany({
      where: { orderId: order.id },
    });
    expect(fills).toHaveLength(1);
    expect(fills[0]?.exchangeTradeId).toBe('trade-stale-fee-pending-recovery-known-1');
    expect(fills[0]?.feeCost).toBeNull();
    const trade = await prisma.trade.findFirstOrThrow({
      where: { orderId: order.id },
    });
    expect(trade.feeSource).toBe('ESTIMATED');
    expect(trade.feePending).toBe(true);
  });

  it('clears drifted fee pending when exact exchange fee is already settled', async () => {
    const user = await prisma.user.create({
      data: { email: 'exchange-event-settled-fee-pending-drift@example.com', password: 'hashed' },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'live-wallet-settled-fee-pending-drift',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'live-bot-settled-fee-pending-drift',
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
        fee: 0.04,
        feeSource: 'EXCHANGE_FILL',
        feePending: true,
        feeCurrency: 'USDT',
        exchangeOrderId: 'event-settled-fee-pending-drift-1',
        exchangeTradeId: 'trade-settled-fee-pending-drift-1',
        submittedAt: new Date('2026-04-26T20:09:00.000Z'),
        filledAt: new Date('2026-04-26T20:09:01.000Z'),
      },
    });
    await prisma.orderFill.create({
      data: {
        userId: user.id,
        botId: bot.id,
        orderId: order.id,
        positionId: position.id,
        symbol: 'ETHUSDT',
        side: 'BUY',
        exchangeTradeId: 'trade-settled-fee-pending-drift-1',
        price: 3_000,
        quantity: 1,
        notional: 3_000,
        feeCost: 0.04,
        feeCurrency: 'USDT',
        feeRate: null,
        executedAt: new Date('2026-04-26T20:09:01.000Z'),
        raw: {},
      },
    });

    await applyLiveExchangeOrderTradeUpdateEvent({
      userId: user.id,
      event: {
        eventType: 'ORDER_TRADE_UPDATE',
        marketType: 'FUTURES',
        eventTime: 2_000,
        transactionTime: 2_001,
        symbol: 'ETHUSDT',
        side: 'BUY',
        orderType: 'MARKET',
        orderStatus: 'FILLED',
        executionType: 'TRADE',
        exchangeOrderId: 'event-settled-fee-pending-drift-1',
        clientOrderId: 'client-settled-fee-pending-drift-1',
        averagePrice: 3_000,
        cumulativeFilledQuantity: 1,
        lastFilledQuantity: 1,
        lastFilledPrice: 3_000,
        fee: null,
        feeCurrency: null,
        exchangeTradeId: 'trade-settled-fee-pending-drift-1',
        raw: {},
      },
    });

    const updatedOrder = await prisma.order.findUniqueOrThrow({
      where: { id: order.id },
    });
    expect(updatedOrder.fee).toBeCloseTo(0.04, 10);
    expect(updatedOrder.feeSource).toBe('EXCHANGE_FILL');
    expect(updatedOrder.feePending).toBe(false);
    const fills = await prisma.orderFill.findMany({
      where: { orderId: order.id },
    });
    expect(fills).toHaveLength(1);
    expect(fills[0]?.feeCost).toBeCloseTo(0.04, 10);
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

  it('does not apply linked-position DCA lifecycle to local orphan positions', async () => {
    const user = await prisma.user.create({
      data: { email: 'exchange-event-stale-linked-dca@example.com', password: 'hashed' },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'live-wallet-stale-linked-dca',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'live-bot-stale-linked-dca',
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
        syncState: 'ORPHAN_LOCAL',
        symbol: 'BTCUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 62_000,
        quantity: 0.1,
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
        symbol: 'BTCUSDT',
        side: 'BUY',
        type: 'MARKET',
        status: 'OPEN',
        quantity: 0.05,
        filledQuantity: 0,
        exchangeOrderId: 'event-order-stale-linked-dca-1',
        submittedAt: new Date('2026-04-29T11:00:00.000Z'),
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
        ttlExpiresAt: new Date('2026-04-30T11:00:00.000Z'),
      },
    });

    const result = await applyLiveExchangeOrderTradeUpdateEvent({
      userId: user.id,
      event: {
        eventType: 'ORDER_TRADE_UPDATE',
        marketType: 'FUTURES',
        eventTime: 5_500,
        transactionTime: 5_501,
        symbol: 'BTCUSDT',
        side: 'BUY',
        orderType: 'MARKET',
        orderStatus: 'FILLED',
        executionType: 'TRADE',
        exchangeOrderId: 'event-order-stale-linked-dca-1',
        clientOrderId: 'client-stale-linked-dca-1',
        averagePrice: 63_500,
        cumulativeFilledQuantity: 0.05,
        lastFilledQuantity: 0.05,
        lastFilledPrice: 63_500,
        fee: 0.03,
        feeCurrency: 'USDT',
        exchangeTradeId: 'trade-stale-linked-dca-1',
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
    const unchangedPosition = await prisma.position.findUniqueOrThrow({
      where: { id: position.id },
    });
    expect(unchangedPosition.quantity).toBe(0.1);
    expect(unchangedPosition.entryPrice).toBe(62_000);
    expect(unchangedPosition.syncState).toBe('ORPHAN_LOCAL');
    const dcaTrade = await prisma.trade.findFirst({
      where: { orderId: order.id, lifecycleAction: 'DCA' },
    });
    expect(dcaTrade).toBeNull();
    const updatedDedupe = await prisma.runtimeExecutionDedupe.findUniqueOrThrow({
      where: { dedupeKey },
    });
    expect(updatedDedupe.status).toBe('PENDING');
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
