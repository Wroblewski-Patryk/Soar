import { beforeEach, describe, expect, it } from 'vitest';

import { prisma } from '../../prisma/client';
import {
  backfillClosedImportedPositionHistory,
  deriveImportedLifecycleTrades,
  hydrateImportedPositionHistory,
} from './importedPositionHistoryHydrator.service';
import { finalizeExchangeCloseFill } from '../orders/orders.exchangeEventFinalization.service';
import { applyLiveExchangeOrderTradeUpdateEvent } from '../orders/orders.exchangeEvents.service';

describe('deriveImportedLifecycleTrades', () => {
  it('does not derive financial history from a fill with an unknown fee', () => {
    expect(deriveImportedLifecycleTrades({
      positionSide: 'LONG', positionQuantity: 1,
      trades: [{
        exchangeTradeId: 'unknown-fee', exchangeOrderId: 'order-1',
        symbol: 'DOGEUSDT', side: 'BUY', price: 0.1, quantity: 1,
        notional: 0.1, feeCost: null, feeCurrency: null, feeRate: null,
        executedAt: '2026-04-29T10:00:00.000Z',
      }],
    })).toBeNull();
  });

  it('reconstructs an open lifecycle with dca and partial reduction from canonical fills', () => {
    const derived = deriveImportedLifecycleTrades({
      positionSide: 'LONG',
      positionQuantity: 2,
      trades: [
        {
          exchangeTradeId: 't-1',
          exchangeOrderId: 'o-1',
          symbol: 'DOGEUSDT',
          side: 'BUY',
          price: 0.1,
          quantity: 1,
          notional: 0.1,
          feeCost: 0.001,
          feeCurrency: 'USDT',
          feeRate: 0.001,
          executedAt: '2026-04-29T10:00:00.000Z',
        },
        {
          exchangeTradeId: 't-2',
          exchangeOrderId: 'o-2',
          symbol: 'DOGEUSDT',
          side: 'BUY',
          price: 0.11,
          quantity: 2,
          notional: 0.22,
          feeCost: 0.001,
          feeCurrency: 'USDT',
          feeRate: 0.001,
          executedAt: '2026-04-29T10:01:00.000Z',
        },
        {
          exchangeTradeId: 't-3',
          exchangeOrderId: 'o-3',
          symbol: 'DOGEUSDT',
          side: 'SELL',
          price: 0.12,
          quantity: 1,
          notional: 0.12,
          feeCost: 0.001,
          feeCurrency: 'USDT',
          feeRate: 0.001,
          executedAt: '2026-04-29T10:02:00.000Z',
        },
      ],
    });

    expect(derived?.map((item) => item.lifecycleAction)).toEqual(['OPEN', 'DCA', 'CLOSE']);
    expect(derived?.[2]?.realizedPnl ?? 0).toBeGreaterThan(0);
  });

  it('reconstructs a closed lifecycle when the imported position is already gone on exchange', () => {
    const derived = deriveImportedLifecycleTrades({
      positionSide: 'LONG',
      positionQuantity: 0,
      trades: [
        {
          exchangeTradeId: 't-1',
          exchangeOrderId: 'o-1',
          symbol: 'DOGEUSDT',
          side: 'BUY',
          price: 0.1,
          quantity: 1,
          notional: 0.1,
          feeCost: 0.001,
          feeCurrency: 'USDT',
          feeRate: 0.001,
          executedAt: '2026-04-29T10:00:00.000Z',
        },
        {
          exchangeTradeId: 't-2',
          exchangeOrderId: 'o-2',
          symbol: 'DOGEUSDT',
          side: 'SELL',
          price: 0.12,
          quantity: 1,
          notional: 0.12,
          feeCost: 0.001,
          feeCurrency: 'USDT',
          feeRate: 0.001,
          executedAt: '2026-04-29T10:01:00.000Z',
        },
      ],
    });

    expect(derived?.map((item) => item.lifecycleAction)).toEqual(['OPEN', 'CLOSE']);
    expect(derived?.[1]?.realizedPnl ?? 0).toBeGreaterThan(0);
  });

});

describe('hydrateImportedPositionHistory', () => {
  beforeEach(async () => {
    await prisma.log.deleteMany();
    await prisma.backtestReport.deleteMany();
    await prisma.backtestTrade.deleteMany();
    await prisma.backtestContribution.deleteMany();
    await prisma.backtestRun.deleteMany();
    await prisma.trade.deleteMany();
    await prisma.order.deleteMany();
    await prisma.position.deleteMany();
    await prisma.signal.deleteMany();
    await prisma.botStrategy.deleteMany();
    await prisma.botSubagentConfig.deleteMany();
    await prisma.botAssistantConfig.deleteMany();
    await prisma.marketGroupStrategyLink.deleteMany();
    await prisma.botMarketGroup.deleteMany();
    await prisma.runtimeExecutionDedupe.deleteMany();
    await prisma.botRuntimeEvent.deleteMany();
    await prisma.botRuntimeSymbolStat.deleteMany();
    await prisma.botRuntimeSession.deleteMany();
    await prisma.bot.deleteMany();
    await prisma.symbolGroup.deleteMany();
    await prisma.marketUniverse.deleteMany();
    await prisma.strategy.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.apiKey.deleteMany();
    await prisma.user.deleteMany();
  });

  it('keeps imported entry fee and close PnL unknown until canonical history backfills once', async () => {
    const user = await prisma.user.create({
      data: { email: 'imported-unknown-fee-close@example.com', password: 'hashed' },
    });
    const openedAt = new Date('2026-04-29T10:00:00.000Z');
    const closedAt = new Date('2026-04-29T11:00:00.000Z');
    const position = await prisma.position.create({ data: {
      userId: user.id, symbol: 'ETHUSDT', side: 'LONG', status: 'OPEN',
      quantity: 1, entryPrice: 100, openedAt,
      origin: 'EXCHANGE_SYNC', managementMode: 'MANUAL_MANAGED',
      syncState: 'IN_SYNC', continuityState: 'CONFIRMED',
    } });
    const importInput = {
      userId: user.id, positionId: position.id, botId: null, walletId: null,
      strategyId: null, symbol: 'ETHUSDT', positionSide: 'LONG' as const,
      positionQuantity: 1, managementMode: 'MANUAL_MANAGED' as const,
    };
    const entryTrade = {
      exchangeTradeId: 'venue-open', exchangeOrderId: 'venue-open-order',
      symbol: 'ETHUSDT', side: 'BUY', price: 100, quantity: 1, notional: 100,
      feeCost: null, feeCurrency: 'USDT', feeRate: null,
      executedAt: openedAt.toISOString(),
    };
    await hydrateImportedPositionHistory({ ...importInput, trades: [entryTrade] });
    await hydrateImportedPositionHistory({ ...importInput, trades: [entryTrade] });
    const anchors = await prisma.trade.findMany({ where: { positionId: position.id } });
    expect(anchors).toHaveLength(1);
    expect(anchors[0]).toMatchObject({
      lifecycleAction: 'OPEN', exchangeTradeId: null,
      fee: null, feePending: true,
    });

    const closeOrder = await prisma.order.create({ data: {
      userId: user.id, positionId: position.id, symbol: 'ETHUSDT',
      side: 'SELL', type: 'MARKET', status: 'FILLED', quantity: 1,
      filledQuantity: 1, averageFillPrice: 110, fee: 1,
      feeSource: 'EXCHANGE_FILL', feePending: false,
      origin: 'EXCHANGE_SYNC', managementMode: 'MANUAL_MANAGED',
      exchangeOrderId: 'venue-close-order', filledAt: closedAt,
    } });
    await finalizeExchangeCloseFill({
      userId: user.id, orderId: closeOrder.id, positionId: position.id,
      fillPrice: 110, fillQuantity: 1, exchangeTradeId: 'venue-close',
      eventAt: closedAt, closeReason: 'MANUAL', closeInitiator: 'USER_APP',
    });
    const pendingPosition = await prisma.position.findUniqueOrThrow({ where: { id: position.id } });
    const pendingClose = await prisma.trade.findFirstOrThrow({ where: { orderId: closeOrder.id } });
    expect(pendingPosition.realizedPnl).toBeNull();
    expect(pendingClose.realizedPnl).toBeNull();
    expect(pendingClose.feePending).toBe(true);
    expect((await prisma.trade.aggregate({ where: { positionId: position.id },
      _sum: { fee: true } }))._sum.fee).toBe(1);

    await prisma.orderFill.create({ data: {
      userId: user.id, orderId: closeOrder.id, positionId: position.id,
      symbol: 'ETHUSDT', side: 'SELL', exchangeTradeId: 'venue-close',
      price: 110, quantity: 1, notional: 110, feeCost: null,
      feeCurrency: null, feeRate: null, executedAt: closedAt, raw: {},
    } });
    await applyLiveExchangeOrderTradeUpdateEvent({ userId: user.id, event: {
      eventType: 'ORDER_TRADE_UPDATE', marketType: 'FUTURES',
      eventTime: closedAt.getTime(), transactionTime: closedAt.getTime(),
      symbol: 'ETHUSDT', side: 'SELL', orderType: 'MARKET',
      orderStatus: 'FILLED', executionType: 'TRADE',
      exchangeOrderId: 'venue-close-order', clientOrderId: 'venue-close-client',
      averagePrice: 110, cumulativeFilledQuantity: 1,
      lastFilledQuantity: 1, lastFilledPrice: 110,
      fee: 1, feeCurrency: 'USDT', exchangeTradeId: 'venue-close', raw: {},
    } });
    expect((await prisma.position.findUniqueOrThrow({ where: { id: position.id } })).realizedPnl).toBeNull();
    expect((await prisma.trade.findFirstOrThrow({ where: { orderId: closeOrder.id } })).realizedPnl).toBeNull();
    expect(await prisma.orderFill.count({ where: { orderId: closeOrder.id } })).toBe(1);

    const canonicalHistory = [
      { ...entryTrade, feeCost: 2, feeRate: 0.02 },
      { exchangeTradeId: 'venue-close', exchangeOrderId: 'venue-close-order',
        symbol: 'ETHUSDT', side: 'SELL', price: 110, quantity: 1, notional: 110,
        feeCost: 1, feeCurrency: 'USDT', feeRate: 1 / 110,
        executedAt: closedAt.toISOString() },
    ];
    await backfillClosedImportedPositionHistory({
      ...importInput, trades: canonicalHistory,
    });
    await backfillClosedImportedPositionHistory({
      ...importInput, trades: canonicalHistory,
    });
    const trades = await prisma.trade.findMany({
      where: { positionId: position.id }, orderBy: { executedAt: 'asc' },
    });
    expect(trades).toHaveLength(2);
    expect(trades.map((trade) => trade.exchangeTradeId)).toEqual(['venue-open', 'venue-close']);
    expect(trades.map((trade) => trade.fee)).toEqual([2, 1]);
    expect(trades.every((trade) => !trade.feePending)).toBe(true);
    expect(trades[1]?.realizedPnl).toBe(7);
    expect((await prisma.position.findUniqueOrThrow({ where: { id: position.id } })).realizedPnl).toBe(7);
    expect((await prisma.trade.aggregate({ where: { positionId: position.id },
      _sum: { fee: true } }))._sum.fee).toBe(3);
  });

  it('accepts an explicit zero imported entry fee and computes net close PnL', async () => {
    const user = await prisma.user.create({
      data: { email: 'imported-zero-fee-close@example.com', password: 'hashed' },
    });
    const position = await prisma.position.create({ data: {
      userId: user.id, symbol: 'ETHUSDT', side: 'LONG', status: 'OPEN',
      quantity: 1, entryPrice: 100,
      origin: 'EXCHANGE_SYNC', managementMode: 'MANUAL_MANAGED',
      syncState: 'IN_SYNC', continuityState: 'CONFIRMED',
    } });
    await hydrateImportedPositionHistory({
      userId: user.id, positionId: position.id, botId: null,
      walletId: null, strategyId: null, symbol: 'ETHUSDT',
      positionSide: 'LONG', positionQuantity: 1,
      managementMode: 'MANUAL_MANAGED',
      trades: [{
        exchangeTradeId: 'zero-fee-open', exchangeOrderId: 'zero-fee-order',
        symbol: 'ETHUSDT', side: 'BUY', price: 100, quantity: 1,
        notional: 100, feeCost: 0, feeCurrency: 'USDT', feeRate: 0,
        executedAt: '2026-04-29T10:00:00.000Z',
      }],
    });
    const entry = await prisma.trade.findFirstOrThrow({ where: { positionId: position.id } });
    expect(entry).toMatchObject({ fee: 0, feePending: false, feeSource: 'EXCHANGE_FILL' });
    const closeOrder = await prisma.order.create({ data: {
      userId: user.id, positionId: position.id, symbol: 'ETHUSDT',
      side: 'SELL', type: 'MARKET', status: 'FILLED', quantity: 1,
      filledQuantity: 1, fee: 1, feeSource: 'EXCHANGE_FILL', feePending: false,
      origin: 'EXCHANGE_SYNC', managementMode: 'MANUAL_MANAGED',
      exchangeOrderId: 'zero-fee-close-order',
    } });
    await finalizeExchangeCloseFill({
      userId: user.id, orderId: closeOrder.id, positionId: position.id,
      fillPrice: 110, fillQuantity: 1, exchangeTradeId: 'zero-fee-close',
      eventAt: new Date('2026-04-29T11:00:00.000Z'),
      closeReason: 'MANUAL', closeInitiator: 'USER_APP',
    });
    expect((await prisma.position.findUniqueOrThrow({ where: { id: position.id } })).realizedPnl).toBe(9);
    expect((await prisma.trade.findFirstOrThrow({ where: { orderId: closeOrder.id } })).realizedPnl).toBe(9);
  });

  it('persists imported lifecycle trades and updates openedAt from canonical fill truth', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'imported-hydrator@example.com',
        password: 'test1234',
      },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Hydrator wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const strategy = await prisma.strategy.create({
      data: {
        userId: user.id,
        name: 'Hydrator strategy',
        interval: '5m',
        leverage: 5,
        walletRisk: 1,
        config: {},
      },
    });
    const marketUniverse = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Hydrator universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: [],
        blacklist: [],
      },
    });
    const symbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: marketUniverse.id,
        name: 'Hydrator group',
        symbols: ['DOGEUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Hydrator bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        walletId: wallet.id,
        strategyId: strategy.id,
        symbolGroupId: symbolGroup.id,
      },
    });
    const position = await prisma.position.create({
      data: {
        userId: user.id,
        botId: bot.id,
        walletId: wallet.id,
        strategyId: strategy.id,
        externalId: 'api-key-1:DOGEUSDT:LONG',
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        symbol: 'DOGEUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 0.11,
        quantity: 2,
        leverage: 5,
        openedAt: new Date('2026-04-29T10:05:00.000Z'),
      },
    });

    const result = await hydrateImportedPositionHistory({
      userId: user.id,
      positionId: position.id,
      botId: bot.id,
      walletId: wallet.id,
      strategyId: strategy.id,
      symbol: 'DOGEUSDT',
      positionSide: 'LONG',
      positionQuantity: 2,
      managementMode: 'BOT_MANAGED',
      trades: [
        {
          exchangeTradeId: 't-1',
          exchangeOrderId: 'o-1',
          symbol: 'DOGEUSDT',
          side: 'BUY',
          price: 0.1,
          quantity: 1,
          notional: 0.1,
          feeCost: 0.001,
          feeCurrency: 'USDT',
          feeRate: 0.001,
          executedAt: '2026-04-29T10:00:00.000Z',
        },
        {
          exchangeTradeId: 't-2',
          exchangeOrderId: 'o-2',
          symbol: 'DOGEUSDT',
          side: 'BUY',
          price: 0.11,
          quantity: 2,
          notional: 0.22,
          feeCost: 0.001,
          feeCurrency: 'USDT',
          feeRate: 0.001,
          executedAt: '2026-04-29T10:01:00.000Z',
        },
        {
          exchangeTradeId: 't-3',
          exchangeOrderId: 'o-3',
          symbol: 'DOGEUSDT',
          side: 'SELL',
          price: 0.12,
          quantity: 1,
          notional: 0.12,
          feeCost: 0.001,
          feeCurrency: 'USDT',
          feeRate: 0.001,
          executedAt: '2026-04-29T10:02:00.000Z',
        },
      ],
    });

    expect(result.hydrated).toBe(true);
    expect(result.openedAt?.toISOString()).toBe('2026-04-29T10:00:00.000Z');

    const persistedTrades = await prisma.trade.findMany({
      where: { positionId: position.id },
      orderBy: { executedAt: 'asc' },
      select: {
        exchangeTradeId: true,
        lifecycleAction: true,
      },
    });
    expect(persistedTrades).toEqual([
      { exchangeTradeId: 't-1', lifecycleAction: 'OPEN' },
      { exchangeTradeId: 't-2', lifecycleAction: 'DCA' },
      { exchangeTradeId: 't-3', lifecycleAction: 'CLOSE' },
    ]);

    const updatedPosition = await prisma.position.findUniqueOrThrow({
      where: { id: position.id },
      select: { openedAt: true },
    });
    expect(updatedPosition.openedAt.toISOString()).toBe('2026-04-29T10:00:00.000Z');
  });

  it('persists one imported OPEN anchor trade when canonical exchange trades are not yet derivable', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'imported-hydrator-open-anchor@example.com',
        password: 'test1234',
      },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Hydrator anchor wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const strategy = await prisma.strategy.create({
      data: {
        userId: user.id,
        name: 'Hydrator anchor strategy',
        interval: '5m',
        leverage: 5,
        walletRisk: 1,
        config: {},
      },
    });
    const marketUniverse = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Hydrator anchor universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: [],
        blacklist: [],
      },
    });
    const symbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: marketUniverse.id,
        name: 'Hydrator anchor group',
        symbols: ['BNBUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Hydrator anchor bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        walletId: wallet.id,
        strategyId: strategy.id,
        symbolGroupId: symbolGroup.id,
      },
    });
    const position = await prisma.position.create({
      data: {
        userId: user.id,
        botId: bot.id,
        walletId: wallet.id,
        strategyId: strategy.id,
        externalId: 'api-key-1:BNBUSDT:SHORT',
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        symbol: 'BNBUSDT',
        side: 'SHORT',
        status: 'OPEN',
        entryPrice: 618.46,
        quantity: 0.01,
        leverage: 15,
        openedAt: new Date('2026-04-29T11:05:00.000Z'),
      },
    });

    const result = await hydrateImportedPositionHistory({
      userId: user.id,
      positionId: position.id,
      botId: bot.id,
      walletId: wallet.id,
      strategyId: strategy.id,
      symbol: 'BNBUSDT',
      positionSide: 'SHORT',
      positionQuantity: 0.01,
      managementMode: 'BOT_MANAGED',
      trades: [],
    });

    expect(result).toEqual({
      hydrated: true,
      openedAt: new Date('2026-04-29T11:05:00.000Z'),
    });

    const persistedTrades = await prisma.trade.findMany({
      where: { positionId: position.id },
      select: {
        lifecycleAction: true,
        side: true,
        price: true,
        quantity: true,
        fee: true,
        feeSource: true,
        feePending: true,
        exchangeTradeId: true,
        executedAt: true,
        origin: true,
      },
    });
    expect(persistedTrades).toEqual([
      {
        lifecycleAction: 'OPEN',
        side: 'SELL',
        price: 618.46,
        quantity: 0.01,
        fee: null,
        feeSource: 'ESTIMATED',
        feePending: true,
        exchangeTradeId: null,
        executedAt: new Date('2026-04-29T11:05:00.000Z'),
        origin: 'EXCHANGE_SYNC',
      },
    ]);
  });

  it('replaces a synthetic imported OPEN anchor with real canonical trades once they become available', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'imported-hydrator-open-anchor-replace@example.com',
        password: 'test1234',
      },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Hydrator replace wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const strategy = await prisma.strategy.create({
      data: {
        userId: user.id,
        name: 'Hydrator replace strategy',
        interval: '5m',
        leverage: 5,
        walletRisk: 1,
        config: {},
      },
    });
    const marketUniverse = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Hydrator replace universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: [],
        blacklist: [],
      },
    });
    const symbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: marketUniverse.id,
        name: 'Hydrator replace group',
        symbols: ['DOGEUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Hydrator replace bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        walletId: wallet.id,
        strategyId: strategy.id,
        symbolGroupId: symbolGroup.id,
      },
    });
    const position = await prisma.position.create({
      data: {
        userId: user.id,
        botId: bot.id,
        walletId: wallet.id,
        strategyId: strategy.id,
        externalId: 'api-key-1:DOGEUSDT:LONG',
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'IN_SYNC',
        continuityState: 'CONFIRMED',
        symbol: 'DOGEUSDT',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: 0.11,
        quantity: 2,
        leverage: 5,
        openedAt: new Date('2026-04-29T10:05:00.000Z'),
      },
    });

    const anchorResult = await hydrateImportedPositionHistory({
      userId: user.id,
      positionId: position.id,
      botId: bot.id,
      walletId: wallet.id,
      strategyId: strategy.id,
      symbol: 'DOGEUSDT',
      positionSide: 'LONG',
      positionQuantity: 2,
      managementMode: 'BOT_MANAGED',
      trades: [],
    });
    expect(anchorResult.hydrated).toBe(true);

    const canonicalResult = await hydrateImportedPositionHistory({
      userId: user.id,
      positionId: position.id,
      botId: bot.id,
      walletId: wallet.id,
      strategyId: strategy.id,
      symbol: 'DOGEUSDT',
      positionSide: 'LONG',
      positionQuantity: 2,
      managementMode: 'BOT_MANAGED',
      trades: [
        {
          exchangeTradeId: 't-1',
          exchangeOrderId: 'o-1',
          symbol: 'DOGEUSDT',
          side: 'BUY',
          price: 0.1,
          quantity: 1,
          notional: 0.1,
          feeCost: 0.001,
          feeCurrency: 'USDT',
          feeRate: 0.001,
          executedAt: '2026-04-29T10:00:00.000Z',
        },
        {
          exchangeTradeId: 't-2',
          exchangeOrderId: 'o-2',
          symbol: 'DOGEUSDT',
          side: 'BUY',
          price: 0.11,
          quantity: 2,
          notional: 0.22,
          feeCost: 0.001,
          feeCurrency: 'USDT',
          feeRate: 0.001,
          executedAt: '2026-04-29T10:01:00.000Z',
        },
        {
          exchangeTradeId: 't-3',
          exchangeOrderId: 'o-3',
          symbol: 'DOGEUSDT',
          side: 'SELL',
          price: 0.12,
          quantity: 1,
          notional: 0.12,
          feeCost: 0.001,
          feeCurrency: 'USDT',
          feeRate: 0.001,
          executedAt: '2026-04-29T10:02:00.000Z',
        },
      ],
    });

    expect(canonicalResult.hydrated).toBe(true);
    expect(canonicalResult.openedAt?.toISOString()).toBe('2026-04-29T10:00:00.000Z');

    const persistedTrades = await prisma.trade.findMany({
      where: { positionId: position.id },
      orderBy: { executedAt: 'asc' },
      select: {
        exchangeTradeId: true,
        lifecycleAction: true,
        feeSource: true,
      },
    });
    expect(persistedTrades).toEqual([
      { exchangeTradeId: 't-1', lifecycleAction: 'OPEN', feeSource: 'EXCHANGE_FILL' },
      { exchangeTradeId: 't-2', lifecycleAction: 'DCA', feeSource: 'EXCHANGE_FILL' },
      { exchangeTradeId: 't-3', lifecycleAction: 'CLOSE', feeSource: 'EXCHANGE_FILL' },
    ]);
  });

  it('backfills missing close trade history and canonical closedAt for imported positions closed on exchange', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'imported-hydrator-close@example.com',
        password: 'test1234',
      },
    });
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        name: 'Hydrator close wallet',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
      },
    });
    const strategy = await prisma.strategy.create({
      data: {
        userId: user.id,
        name: 'Hydrator close strategy',
        interval: '5m',
        leverage: 5,
        walletRisk: 1,
        config: {},
      },
    });
    const marketUniverse = await prisma.marketUniverse.create({
      data: {
        userId: user.id,
        name: 'Hydrator close universe',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        baseCurrency: 'USDT',
        whitelist: [],
        blacklist: [],
      },
    });
    const symbolGroup = await prisma.symbolGroup.create({
      data: {
        userId: user.id,
        marketUniverseId: marketUniverse.id,
        name: 'Hydrator close group',
        symbols: ['DOGEUSDT'],
      },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Hydrator close bot',
        mode: 'LIVE',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
        isActive: true,
        liveOptIn: true,
        consentTextVersion: 'mvp-v1',
        walletId: wallet.id,
        strategyId: strategy.id,
        symbolGroupId: symbolGroup.id,
      },
    });
    const position = await prisma.position.create({
      data: {
        userId: user.id,
        botId: bot.id,
        walletId: wallet.id,
        strategyId: strategy.id,
        externalId: 'api-key-1:DOGEUSDT:LONG',
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        syncState: 'ORPHAN_LOCAL',
        continuityState: 'EXTERNAL_CLOSE_CONFIRMED',
        symbol: 'DOGEUSDT',
        side: 'LONG',
        status: 'CLOSED',
        entryPrice: 0.1,
        quantity: 1,
        leverage: 5,
        openedAt: new Date('2026-04-29T10:05:00.000Z'),
        closedAt: new Date('2026-04-29T10:06:00.000Z'),
      },
    });

    await prisma.trade.create({
      data: {
        userId: user.id,
        botId: bot.id,
        walletId: wallet.id,
        strategyId: strategy.id,
        positionId: position.id,
        symbol: 'DOGEUSDT',
        side: 'BUY',
        lifecycleAction: 'OPEN',
        price: 0.1,
        quantity: 1,
        fee: 0.001,
        feeSource: 'EXCHANGE_FILL',
        feePending: false,
        feeCurrency: 'USDT',
        exchangeTradeId: 't-1',
        origin: 'EXCHANGE_SYNC',
        managementMode: 'BOT_MANAGED',
        executedAt: new Date('2026-04-29T10:00:00.000Z'),
      },
    });

    const result = await backfillClosedImportedPositionHistory({
      userId: user.id,
      positionId: position.id,
      botId: bot.id,
      walletId: wallet.id,
      strategyId: strategy.id,
      symbol: 'DOGEUSDT',
      positionSide: 'LONG',
      managementMode: 'BOT_MANAGED',
      trades: [
        {
          exchangeTradeId: 't-1',
          exchangeOrderId: 'o-1',
          symbol: 'DOGEUSDT',
          side: 'BUY',
          price: 0.1,
          quantity: 1,
          notional: 0.1,
          feeCost: 0.001,
          feeCurrency: 'USDT',
          feeRate: 0.001,
          executedAt: '2026-04-29T10:00:00.000Z',
        },
        {
          exchangeTradeId: 't-2',
          exchangeOrderId: 'o-2',
          symbol: 'DOGEUSDT',
          side: 'SELL',
          price: 0.12,
          quantity: 1,
          notional: 0.12,
          feeCost: 0.001,
          feeCurrency: 'USDT',
          feeRate: 0.001,
          executedAt: '2026-04-29T10:07:00.000Z',
        },
      ],
    });

    expect(result.hydrated).toBe(true);
    expect(result.openedAt?.toISOString()).toBe('2026-04-29T10:00:00.000Z');
    expect(result.closedAt?.toISOString()).toBe('2026-04-29T10:07:00.000Z');

    const persistedTrades = await prisma.trade.findMany({
      where: { positionId: position.id },
      orderBy: { executedAt: 'asc' },
      select: {
        exchangeTradeId: true,
        lifecycleAction: true,
        closeInitiator: true,
      },
    });
    expect(persistedTrades).toEqual([
      { exchangeTradeId: 't-1', lifecycleAction: 'OPEN', closeInitiator: null },
      { exchangeTradeId: 't-2', lifecycleAction: 'CLOSE', closeInitiator: 'USER_EXCHANGE' },
    ]);

    const updatedPosition = await prisma.position.findUniqueOrThrow({
      where: { id: position.id },
      select: { openedAt: true, closedAt: true },
    });
    expect(updatedPosition.openedAt.toISOString()).toBe('2026-04-29T10:00:00.000Z');
    expect(updatedPosition.closedAt?.toISOString()).toBe('2026-04-29T10:07:00.000Z');
  });
  it.each([null, 0.01])('does not publish Gate FUTURES history with unsafe contract unit %s', async (contractSize) => {
    const user = await prisma.user.create({ data: {
      email: `gate-imported-unit-${contractSize ?? 'missing'}@example.com`, password: 'hashed',
    } });
    const wallet = await prisma.wallet.create({ data: {
      userId: user.id, name: 'gate-imported-unit', mode: 'LIVE',
      exchange: 'GATEIO', marketType: 'FUTURES', baseCurrency: 'USDT',
    } });
    const position = await prisma.position.create({ data: {
      userId: user.id, walletId: wallet.id, symbol: 'BTCUSDT', side: 'LONG',
      status: 'OPEN', quantity: 100, entryPrice: 100, contractSize,
      origin: 'EXCHANGE_SYNC', managementMode: 'MANUAL_MANAGED',
    } });
    const input = { userId: user.id, positionId: position.id, botId: null,
      walletId: wallet.id, strategyId: null, symbol: 'BTCUSDT',
      positionSide: 'LONG' as const, managementMode: 'MANUAL_MANAGED' as const };
    const entry = { exchangeTradeId: 'gate-entry', exchangeOrderId: 'gate-entry-order',
      symbol: 'BTCUSDT', side: 'BUY', price: 100, quantity: 100, notional: 100,
      feeCost: 0.04, feeCurrency: 'USDT', feeRate: 0.0004,
      executedAt: '2026-10-22T10:00:00.000Z' };
    const close = { exchangeTradeId: 'gate-close', exchangeOrderId: 'gate-close-order',
      symbol: 'BTCUSDT', side: 'SELL', price: 110, quantity: 100, notional: 110,
      feeCost: 0.044, feeCurrency: 'USDT', feeRate: 0.0004,
      executedAt: '2026-10-22T10:01:00.000Z' };
    expect(await hydrateImportedPositionHistory({ ...input, positionQuantity: 100,
      trades: [entry] })).toMatchObject({ hydrated: false });
    expect(await backfillClosedImportedPositionHistory({ ...input, trades: [entry, close] }))
      .toMatchObject({ hydrated: false });
    expect(await prisma.trade.count({ where: { positionId: position.id } })).toBe(0);
    expect(await prisma.position.findUniqueOrThrow({ where: { id: position.id } }))
      .toMatchObject({ realizedPnl: null, status: 'OPEN' });
  });
});
