import { beforeEach, describe, expect, it } from 'vitest';

import { prisma } from '../../prisma/client';
import {
  backfillClosedImportedPositionHistory,
  deriveImportedLifecycleTrades,
  hydrateImportedPositionHistory,
} from './importedPositionHistoryHydrator.service';

describe('deriveImportedLifecycleTrades', () => {
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
    await prisma.trade.deleteMany();
    await prisma.position.deleteMany();
    await prisma.botRuntimeEvent.deleteMany();
    await prisma.botRuntimeSession.deleteMany();
    await prisma.bot.deleteMany();
    await prisma.symbolGroup.deleteMany();
    await prisma.marketUniverse.deleteMany();
    await prisma.strategy.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.user.deleteMany();
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
        feeSource: true,
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
        feeSource: 'ESTIMATED',
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
});
