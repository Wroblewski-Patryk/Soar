import { describe, expect, it, vi } from 'vitest';
import { prisma } from '../../prisma/client';
import {
  buildOpenPositionLookupWhere,
  orchestrateRuntimeSignal,
  OrderFlowGateway,
  RuntimeExecutionDedupeGateway,
  PositionFlowGateway,
  RuntimeExecutionEventGateway,
  RuntimeTradeGateway,
} from './executionOrchestrator.service';
import { runtimeTelemetryService } from './runtimeTelemetry.service';

vi.spyOn(prisma.trade, 'aggregate').mockResolvedValue({
  _sum: { fee: 0 },
  _avg: { fee: null },
  _count: { fee: 0 },
  _min: { fee: null },
  _max: { fee: null },
});

const createOrderGateway = (): OrderFlowGateway => ({
  openOrder: vi.fn().mockResolvedValue({
    id: 'order-1',
    userId: 'u1',
    symbol: 'BTCUSDT',
    side: 'BUY',
    type: 'MARKET',
    status: 'FILLED',
    quantity: 0.1,
    filledQuantity: 0.1,
    createdAt: new Date(),
    updatedAt: new Date(),
    submittedAt: new Date(),
    filledAt: new Date(),
    botId: null,
    walletId: null,
    strategyId: null,
    positionId: 'position-1',
    price: null,
    stopPrice: null,
    averageFillPrice: null,
    fee: null,
    feeSource: 'ESTIMATED',
    feePending: false,
    feeCurrency: null,
    effectiveFeeRate: null,
    exchangeOrderId: null,
    exchangeTradeId: null,
    canceledAt: null,
  }),
  closeOrder: vi.fn().mockResolvedValue(null),
  linkOrderToPosition: vi.fn().mockResolvedValue(undefined),
});

const createPositionGateway = (): PositionFlowGateway => ({
  getOpenPositionBySymbol: vi.fn().mockResolvedValue(null),
  createPosition: vi.fn().mockResolvedValue({
    id: 'position-1',
    userId: 'u1',
    externalId: null,
    origin: 'BOT',
    managementMode: 'BOT_MANAGED',
    syncState: 'IN_SYNC',
    symbol: 'BTCUSDT',
    side: 'LONG',
    status: 'OPEN',
    entryPrice: 43000,
    quantity: 0.1,
    leverage: 1,
    openedAt: new Date(),
    closedAt: null,
    realizedPnl: null,
    unrealizedPnl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    botId: null,
    strategyId: null,
    stopLoss: null,
    takeProfit: null,
  }),
  closePosition: vi.fn().mockResolvedValue(undefined),
});

const createEventGateway = (): RuntimeExecutionEventGateway => ({
  writeEvent: vi.fn().mockResolvedValue(undefined),
});

const createTradeGateway = (): RuntimeTradeGateway => ({
  createTrade: vi.fn().mockResolvedValue(undefined),
});

const createDedupeGateway = (): RuntimeExecutionDedupeGateway => ({
  acquire: vi.fn().mockResolvedValue({ outcome: 'execute', dedupeKey: 'dedupe-1' }),
  markSubmitted: vi.fn().mockResolvedValue(undefined),
  markSucceeded: vi.fn().mockResolvedValue(undefined),
  markFailed: vi.fn().mockResolvedValue(undefined),
});

describe('buildOpenPositionLookupWhere', () => {
  it('scopes LIVE lookup by wallet when walletId is available', () => {
    const where = buildOpenPositionLookupWhere({
      userId: 'u1',
      symbol: 'btcusdt',
      mode: 'LIVE',
      botId: 'bot-1',
      walletId: 'wallet-live',
    });

    expect(where).toEqual({
      userId: 'u1',
      symbol: 'BTCUSDT',
      status: 'OPEN',
      walletId: 'wallet-live',
    });
  });

  it('scopes PAPER lookup by bot id', () => {
    const where = buildOpenPositionLookupWhere({
      userId: 'u1',
      symbol: 'ETHUSDT',
      mode: 'PAPER',
      botId: 'bot-paper',
      walletId: 'wallet-paper',
    });

    expect(where).toEqual({
      userId: 'u1',
      symbol: 'ETHUSDT',
      status: 'OPEN',
      botId: 'bot-paper',
    });
  });
});

describe('orchestrateRuntimeSignal', () => {
  it('opens order and position for LONG signal', async () => {
    const orderGateway = createOrderGateway();
    const positionGateway = createPositionGateway();
    const eventGateway = createEventGateway();
    const tradeGateway = createTradeGateway();
    const strategyLookupSpy = vi.spyOn(prisma.strategy, 'findFirst');

    const result = await orchestrateRuntimeSignal(
      {
        userId: 'u1',
        symbol: 'BTCUSDT',
        direction: 'LONG',
        quantity: 0.1,
        markPrice: 43000,
        mode: 'PAPER',
      },
      orderGateway,
      positionGateway,
      eventGateway,
      tradeGateway
    );

    expect(result).toEqual({
      status: 'opened',
      orderId: 'order-1',
      positionId: 'position-1',
    });
    expect(orderGateway.openOrder).toHaveBeenCalledWith(
      'u1',
      expect.objectContaining({ side: 'BUY', type: 'MARKET', riskAck: true, price: 43000 })
    );
    expect(positionGateway.getOpenPositionBySymbol).toHaveBeenCalledWith({
      userId: 'u1',
      symbol: 'BTCUSDT',
      mode: 'PAPER',
      botId: undefined,
      walletId: undefined,
    });
    expect(positionGateway.createPosition).not.toHaveBeenCalled();
    expect(orderGateway.linkOrderToPosition).not.toHaveBeenCalled();
    expect(strategyLookupSpy).not.toHaveBeenCalled();
    expect(tradeGateway.createTrade).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: 'order-1',
        positionId: 'position-1',
        side: 'BUY',
      })
    );
    expect(eventGateway.writeEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'opened',
        symbol: 'BTCUSDT',
      })
    );
  });

  it('returns submitted when order is open and waiting for fill confirmation', async () => {
    const orderGateway = createOrderGateway();
    (orderGateway.openOrder as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'order-live-pending-1',
      userId: 'u1',
      symbol: 'BTCUSDT',
      side: 'BUY',
      type: 'MARKET',
      status: 'OPEN',
      quantity: 0.1,
      filledQuantity: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      submittedAt: new Date(),
      filledAt: null,
      botId: 'bot-live-1',
      walletId: 'wallet-live-1',
      strategyId: 'strategy-live-1',
      positionId: null,
      price: null,
      stopPrice: null,
      averageFillPrice: null,
      fee: null,
      feeSource: 'ESTIMATED',
      feePending: true,
      feeCurrency: null,
      effectiveFeeRate: null,
      exchangeOrderId: 'exchange-order-1',
      exchangeTradeId: null,
      canceledAt: null,
    });
    const positionGateway = createPositionGateway();
    const eventGateway = createEventGateway();
    const tradeGateway = createTradeGateway();

    const result = await orchestrateRuntimeSignal(
      {
        userId: 'u1',
        botId: 'bot-live-1',
        symbol: 'BTCUSDT',
        direction: 'LONG',
        quantity: 0.1,
        markPrice: 43000,
        mode: 'LIVE',
      },
      orderGateway,
      positionGateway,
      eventGateway,
      tradeGateway
    );

    expect(result).toEqual({
      status: 'submitted',
      orderId: 'order-live-pending-1',
    });
    expect(positionGateway.createPosition).not.toHaveBeenCalled();
    expect(tradeGateway.createTrade).not.toHaveBeenCalled();
    expect(eventGateway.writeEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'submitted',
        reason: 'waiting_fill',
        orderId: 'order-live-pending-1',
      })
    );
  });

  it('reuses persisted OPEN execution result and skips duplicate side effects', async () => {
    const orderGateway = createOrderGateway();
    const positionGateway = createPositionGateway();
    const eventGateway = createEventGateway();
    const tradeGateway = createTradeGateway();
    const dedupeGateway = createDedupeGateway();
    (dedupeGateway.acquire as ReturnType<typeof vi.fn>).mockResolvedValue({
      outcome: 'reused',
      dedupeKey: 'v1|OPEN|...',
      reuseStatus: 'completed',
      orderId: 'order-existing',
      positionId: 'position-existing',
    });

    const result = await orchestrateRuntimeSignal(
      {
        userId: 'u1',
        botId: 'bot-1',
        botMarketGroupId: 'group-1',
        symbol: 'BTCUSDT',
        direction: 'LONG',
        strategyInterval: '1m',
        candleOpenTime: 1_000,
        candleCloseTime: 59_000,
        quantity: 0.1,
        markPrice: 43000,
        mode: 'PAPER',
      },
      orderGateway,
      positionGateway,
      eventGateway,
      tradeGateway,
      dedupeGateway
    );

    expect(result).toEqual({
      status: 'opened',
      orderId: 'order-existing',
      positionId: 'position-existing',
    });
    expect(orderGateway.openOrder).not.toHaveBeenCalled();
    expect(positionGateway.createPosition).not.toHaveBeenCalled();
    expect(tradeGateway.createTrade).not.toHaveBeenCalled();
  });

  it('returns submitted when OPEN dedupe reuses order without linked position', async () => {
    const orderGateway = createOrderGateway();
    const positionGateway = createPositionGateway();
    const eventGateway = createEventGateway();
    const tradeGateway = createTradeGateway();
    const dedupeGateway = createDedupeGateway();
    (dedupeGateway.acquire as ReturnType<typeof vi.fn>).mockResolvedValue({
      outcome: 'reused',
      dedupeKey: 'v1|OPEN|...',
      reuseStatus: 'submitted',
      orderId: 'order-existing-open-only',
    });

    const result = await orchestrateRuntimeSignal(
      {
        userId: 'u1',
        botId: 'bot-1',
        botMarketGroupId: 'group-1',
        symbol: 'BTCUSDT',
        direction: 'LONG',
        strategyInterval: '1m',
        candleOpenTime: 1_000,
        candleCloseTime: 59_000,
        quantity: 0.1,
        markPrice: 43000,
        mode: 'LIVE',
      },
      orderGateway,
      positionGateway,
      eventGateway,
      tradeGateway,
      dedupeGateway
    );

    expect(result).toEqual({
      status: 'submitted',
      orderId: 'order-existing-open-only',
    });
    expect(orderGateway.openOrder).not.toHaveBeenCalled();
    expect(positionGateway.createPosition).not.toHaveBeenCalled();
    expect(tradeGateway.createTrade).not.toHaveBeenCalled();
  });

  it('returns ignored when OPEN dedupe is still inflight', async () => {
    const orderGateway = createOrderGateway();
    const positionGateway = createPositionGateway();
    const eventGateway = createEventGateway();
    const tradeGateway = createTradeGateway();
    const dedupeGateway = createDedupeGateway();
    (dedupeGateway.acquire as ReturnType<typeof vi.fn>).mockResolvedValue({
      outcome: 'inflight',
      dedupeKey: 'v1|OPEN|...',
    });

    const result = await orchestrateRuntimeSignal(
      {
        userId: 'u1',
        botId: 'bot-1',
        botMarketGroupId: 'group-1',
        symbol: 'BTCUSDT',
        direction: 'LONG',
        strategyInterval: '1m',
        candleOpenTime: 1_000,
        candleCloseTime: 59_000,
        quantity: 0.1,
        markPrice: 43000,
        mode: 'PAPER',
      },
      orderGateway,
      positionGateway,
      eventGateway,
      tradeGateway,
      dedupeGateway
    );

    expect(result).toEqual({ status: 'ignored', reason: 'dedupe_inflight' });
    expect(orderGateway.openOrder).not.toHaveBeenCalled();
    expect(positionGateway.createPosition).not.toHaveBeenCalled();
    expect(tradeGateway.createTrade).not.toHaveBeenCalled();
  });

  it('returns ignored when EXIT arrives without open position', async () => {
    const orderGateway = createOrderGateway();
    const positionGateway = createPositionGateway();
    const eventGateway = createEventGateway();
    const tradeGateway = createTradeGateway();

    const result = await orchestrateRuntimeSignal(
      {
        userId: 'u1',
        symbol: 'BTCUSDT',
        direction: 'EXIT',
        quantity: 0.1,
        markPrice: 43000,
        mode: 'PAPER',
      },
      orderGateway,
      positionGateway,
      eventGateway,
      tradeGateway
    );

    expect(result).toEqual({ status: 'ignored', reason: 'no_open_position' });
    expect(orderGateway.openOrder).not.toHaveBeenCalled();
    expect(tradeGateway.createTrade).not.toHaveBeenCalled();
    expect(eventGateway.writeEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'ignored',
        reason: 'no_open_position',
      })
    );
  });

  it('closes open position on EXIT signal', async () => {
    const orderGateway = createOrderGateway();
    const positionGateway = createPositionGateway();
    const eventGateway = createEventGateway();
    const tradeGateway = createTradeGateway();
    const dedupeGateway = createDedupeGateway();
    (positionGateway.getOpenPositionBySymbol as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'position-open',
      userId: 'u1',
      externalId: null,
      origin: 'BOT',
      managementMode: 'BOT_MANAGED',
      syncState: 'IN_SYNC',
      symbol: 'BTCUSDT',
      side: 'LONG',
      status: 'OPEN',
      entryPrice: 43000,
      quantity: 0.2,
      leverage: 1,
      openedAt: new Date(),
      closedAt: null,
      realizedPnl: null,
      unrealizedPnl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      botId: null,
      walletId: 'wallet-open',
      strategyId: null,
      stopLoss: null,
      takeProfit: null,
    });
    (orderGateway.openOrder as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'order-1',
      userId: 'u1',
      symbol: 'BTCUSDT',
      side: 'SELL',
      type: 'MARKET',
      status: 'FILLED',
      quantity: 0.2,
      filledQuantity: 0.2,
      createdAt: new Date(),
      updatedAt: new Date(),
      submittedAt: new Date(),
      filledAt: new Date(),
      botId: null,
      walletId: 'wallet-open',
      strategyId: null,
      positionId: 'position-open',
      price: 43000,
      stopPrice: null,
      averageFillPrice: 42950,
      fee: null,
      feeSource: 'ESTIMATED',
      feePending: false,
      feeCurrency: null,
      effectiveFeeRate: null,
      exchangeOrderId: null,
      exchangeTradeId: null,
      canceledAt: null,
    });

    const result = await orchestrateRuntimeSignal(
      {
        userId: 'u1',
        symbol: 'BTCUSDT',
        direction: 'EXIT',
        quantity: 0.1,
        markPrice: 43000,
        mode: 'LIVE',
      },
      orderGateway,
      positionGateway,
      eventGateway,
      tradeGateway,
      dedupeGateway
    );

    expect(result).toEqual({
      status: 'closed',
      orderId: 'order-1',
      positionId: 'position-open',
    });
    expect(orderGateway.openOrder).toHaveBeenCalledWith(
      'u1',
      expect.objectContaining({
        side: 'SELL',
        quantity: 0.2,
        price: 43000,
        mode: 'LIVE',
        walletId: 'wallet-open',
        reduceOnly: true,
      })
    );
    expect(positionGateway.closePosition).toHaveBeenCalledWith(
      'position-open',
      'u1',
      expect.objectContaining({
        realizedPnl: expect.any(Number),
      })
    );
    expect(orderGateway.closeOrder).not.toHaveBeenCalled();
    expect(tradeGateway.createTrade).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: 'order-1',
        positionId: 'position-open',
        side: 'SELL',
        walletId: 'wallet-open',
        price: 42950,
      })
    );
    expect(eventGateway.writeEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'closed',
        positionId: 'position-open',
      })
    );
  });

  it('keeps profitable PAPER LONG exit realizedPnl positive at canonical close price', async () => {
    const orderGateway = createOrderGateway();
    const positionGateway = createPositionGateway();
    const eventGateway = createEventGateway();
    const tradeGateway = createTradeGateway();
    const dedupeGateway = createDedupeGateway();
    (positionGateway.getOpenPositionBySymbol as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'position-long-profit',
      userId: 'u1',
      externalId: null,
      origin: 'BOT',
      managementMode: 'BOT_MANAGED',
      syncState: 'IN_SYNC',
      symbol: 'BTCUSDT',
      side: 'LONG',
      status: 'OPEN',
      entryPrice: 100,
      quantity: 1,
      leverage: 1,
      openedAt: new Date(),
      closedAt: null,
      realizedPnl: null,
      unrealizedPnl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      botId: 'bot-paper',
      walletId: 'wallet-paper',
      strategyId: 'strategy-paper',
      stopLoss: null,
      takeProfit: null,
    });
    (orderGateway.openOrder as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'order-long-profit',
      userId: 'u1',
      symbol: 'BTCUSDT',
      side: 'SELL',
      type: 'MARKET',
      status: 'FILLED',
      quantity: 1,
      filledQuantity: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      submittedAt: new Date(),
      filledAt: new Date(),
      botId: 'bot-paper',
      walletId: 'wallet-paper',
      strategyId: 'strategy-paper',
      positionId: 'position-long-profit',
      price: 109,
      stopPrice: null,
      averageFillPrice: 110,
      fee: null,
      feeSource: 'ESTIMATED',
      feePending: false,
      feeCurrency: null,
      effectiveFeeRate: null,
      exchangeOrderId: null,
      exchangeTradeId: null,
      canceledAt: null,
    });

    await orchestrateRuntimeSignal(
      {
        userId: 'u1',
        walletId: 'wallet-paper',
        strategyId: 'strategy-paper',
        symbol: 'BTCUSDT',
        direction: 'EXIT',
        quantity: 1,
        markPrice: 110,
        mode: 'PAPER',
      },
      orderGateway,
      positionGateway,
      eventGateway,
      tradeGateway,
      dedupeGateway
    );

    expect(positionGateway.closePosition).toHaveBeenCalledWith(
      'position-long-profit',
      'u1',
      expect.objectContaining({
        realizedPnl: 9.956,
      })
    );
    expect(tradeGateway.createTrade).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: 'order-long-profit',
        positionId: 'position-long-profit',
        side: 'SELL',
        price: 110,
        realizedPnl: 9.956,
      })
    );
  });

  it('aggregates entry fees by owned position id when closing an imported LIVE position', async () => {
    const orderGateway = createOrderGateway();
    const positionGateway = createPositionGateway();
    const eventGateway = createEventGateway();
    const tradeGateway = createTradeGateway();
    const dedupeGateway = createDedupeGateway();
    vi.spyOn(runtimeTelemetryService, 'upsertRuntimeSymbolStat').mockResolvedValue(undefined);
    vi.mocked(prisma.trade.aggregate).mockClear();
    vi.mocked(prisma.trade.aggregate).mockResolvedValueOnce({
      _sum: { fee: 1.5 },
      _avg: { fee: null },
      _count: { fee: 1 },
      _min: { fee: 1.5 },
      _max: { fee: 1.5 },
    });
    (positionGateway.getOpenPositionBySymbol as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'position-imported-live',
      userId: 'u1',
      externalId: 'binance:key-live:ETHUSDT',
      origin: 'EXCHANGE_SYNC',
      managementMode: 'BOT_MANAGED',
      syncState: 'IN_SYNC',
      symbol: 'ETHUSDT',
      side: 'LONG',
      status: 'OPEN',
      entryPrice: 100,
      quantity: 1,
      leverage: 1,
      openedAt: new Date(),
      closedAt: null,
      realizedPnl: null,
      unrealizedPnl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      botId: null,
      walletId: null,
      strategyId: null,
      stopLoss: null,
      takeProfit: null,
    });
    (orderGateway.openOrder as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'order-imported-close',
      userId: 'u1',
      symbol: 'ETHUSDT',
      side: 'SELL',
      type: 'MARKET',
      status: 'FILLED',
      quantity: 1,
      filledQuantity: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      submittedAt: new Date(),
      filledAt: new Date(),
      botId: 'bot-live',
      walletId: 'wallet-live',
      strategyId: 'strategy-live',
      positionId: 'position-imported-live',
      price: null,
      stopPrice: null,
      averageFillPrice: 110,
      fee: null,
      feeSource: 'ESTIMATED',
      feePending: false,
      feeCurrency: null,
      effectiveFeeRate: null,
      exchangeOrderId: null,
      exchangeTradeId: null,
      canceledAt: null,
    });

    await orchestrateRuntimeSignal(
      {
        userId: 'u1',
        botId: 'bot-live',
        walletId: 'wallet-live',
        strategyId: 'strategy-live',
        symbol: 'ETHUSDT',
        direction: 'EXIT',
        quantity: 1,
        markPrice: 110,
        mode: 'LIVE',
      },
      orderGateway,
      positionGateway,
      eventGateway,
      tradeGateway,
      dedupeGateway
    );

    expect(prisma.trade.aggregate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId: 'u1',
          positionId: 'position-imported-live',
          side: 'BUY',
        },
      })
    );
    expect(orderGateway.openOrder).toHaveBeenCalledWith(
      'u1',
      expect.objectContaining({
        walletId: 'wallet-live',
        positionId: 'position-imported-live',
        reduceOnly: true,
      })
    );
    expect(positionGateway.closePosition).toHaveBeenCalledWith(
      'position-imported-live',
      'u1',
      expect.objectContaining({
        realizedPnl: 8.456,
      })
    );
    expect(tradeGateway.createTrade).toHaveBeenCalledWith(
      expect.objectContaining({
        positionId: 'position-imported-live',
        walletId: 'wallet-live',
        realizedPnl: 8.456,
      })
    );
  });

  it('keeps profitable PAPER SHORT exit realizedPnl positive at canonical close price', async () => {
    const orderGateway = createOrderGateway();
    const positionGateway = createPositionGateway();
    const eventGateway = createEventGateway();
    const tradeGateway = createTradeGateway();
    const dedupeGateway = createDedupeGateway();
    (positionGateway.getOpenPositionBySymbol as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'position-short-profit',
      userId: 'u1',
      externalId: null,
      origin: 'BOT',
      managementMode: 'BOT_MANAGED',
      syncState: 'IN_SYNC',
      symbol: 'BTCUSDT',
      side: 'SHORT',
      status: 'OPEN',
      entryPrice: 100,
      quantity: 1,
      leverage: 1,
      openedAt: new Date(),
      closedAt: null,
      realizedPnl: null,
      unrealizedPnl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      botId: 'bot-paper',
      walletId: 'wallet-paper',
      strategyId: 'strategy-paper',
      stopLoss: null,
      takeProfit: null,
    });
    (orderGateway.openOrder as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'order-short-profit',
      userId: 'u1',
      symbol: 'BTCUSDT',
      side: 'BUY',
      type: 'MARKET',
      status: 'FILLED',
      quantity: 1,
      filledQuantity: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      submittedAt: new Date(),
      filledAt: new Date(),
      botId: 'bot-paper',
      walletId: 'wallet-paper',
      strategyId: 'strategy-paper',
      positionId: 'position-short-profit',
      price: 91,
      stopPrice: null,
      averageFillPrice: 90,
      fee: null,
      feeSource: 'ESTIMATED',
      feePending: false,
      feeCurrency: null,
      effectiveFeeRate: null,
      exchangeOrderId: null,
      exchangeTradeId: null,
      canceledAt: null,
    });

    await orchestrateRuntimeSignal(
      {
        userId: 'u1',
        walletId: 'wallet-paper',
        strategyId: 'strategy-paper',
        symbol: 'BTCUSDT',
        direction: 'EXIT',
        quantity: 1,
        markPrice: 90,
        mode: 'PAPER',
      },
      orderGateway,
      positionGateway,
      eventGateway,
      tradeGateway,
      dedupeGateway
    );

    expect(positionGateway.closePosition).toHaveBeenCalledWith(
      'position-short-profit',
      'u1',
      expect.objectContaining({
        realizedPnl: 9.964,
      })
    );
    expect(tradeGateway.createTrade).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: 'order-short-profit',
        positionId: 'position-short-profit',
        side: 'BUY',
        price: 90,
        realizedPnl: 9.964,
      })
    );
  });

  it('keeps LIVE close in submitted state until exchange fill is confirmed', async () => {
    const orderGateway = createOrderGateway();
    const positionGateway = createPositionGateway();
    const eventGateway = createEventGateway();
    const tradeGateway = createTradeGateway();
    const dedupeGateway = createDedupeGateway();
    (positionGateway.getOpenPositionBySymbol as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'position-open',
      userId: 'u1',
      externalId: null,
      origin: 'BOT',
      managementMode: 'BOT_MANAGED',
      syncState: 'IN_SYNC',
      symbol: 'BTCUSDT',
      side: 'LONG',
      status: 'OPEN',
      entryPrice: 43000,
      quantity: 0.2,
      leverage: 1,
      openedAt: new Date(),
      closedAt: null,
      realizedPnl: null,
      unrealizedPnl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      botId: null,
      walletId: 'wallet-open',
      strategyId: null,
      stopLoss: null,
      takeProfit: null,
    });
    (orderGateway.openOrder as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'order-close-pending',
      userId: 'u1',
      symbol: 'BTCUSDT',
      side: 'SELL',
      type: 'MARKET',
      status: 'OPEN',
      quantity: 0.2,
      filledQuantity: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      submittedAt: new Date(),
      filledAt: null,
      botId: null,
      walletId: 'wallet-open',
      strategyId: null,
      positionId: 'position-open',
      price: 43000,
      stopPrice: null,
      averageFillPrice: null,
      fee: null,
      feeSource: 'ESTIMATED',
      feePending: true,
      feeCurrency: null,
      effectiveFeeRate: null,
      exchangeOrderId: 'exchange-close-pending',
      exchangeTradeId: null,
      canceledAt: null,
    });

    const result = await orchestrateRuntimeSignal(
      {
        userId: 'u1',
        symbol: 'BTCUSDT',
        direction: 'EXIT',
        quantity: 0.1,
        markPrice: 43000,
        mode: 'LIVE',
      },
      orderGateway,
      positionGateway,
      eventGateway,
      tradeGateway,
      dedupeGateway
    );

    expect(result).toEqual({
      status: 'submitted',
      orderId: 'order-close-pending',
    });
    expect(positionGateway.closePosition).not.toHaveBeenCalled();
    expect(orderGateway.closeOrder).not.toHaveBeenCalled();
    expect(tradeGateway.createTrade).not.toHaveBeenCalled();
    expect(eventGateway.writeEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'submitted',
        reason: 'waiting_fill',
        orderId: 'order-close-pending',
        positionId: 'position-open',
      })
    );
    expect(orderGateway.openOrder).toHaveBeenCalledWith(
      'u1',
      expect.objectContaining({
        reduceOnly: true,
        side: 'SELL',
      })
    );
    expect(dedupeGateway.markSubmitted).toHaveBeenCalledWith(
      expect.objectContaining({
        dedupeKey: expect.any(String),
        orderId: 'order-close-pending',
        positionId: 'position-open',
      })
    );
  });

  it('uses canonical fill price for opened trades when lifecycle provides it', async () => {
    const orderGateway = createOrderGateway();
    const positionGateway = createPositionGateway();
    const eventGateway = createEventGateway();
    const tradeGateway = createTradeGateway();
    (orderGateway.openOrder as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'order-live-filled-1',
      userId: 'u1',
      symbol: 'BTCUSDT',
      side: 'BUY',
      type: 'MARKET',
      status: 'FILLED',
      quantity: 0.1,
      filledQuantity: 0.1,
      createdAt: new Date(),
      updatedAt: new Date(),
      submittedAt: new Date(),
      filledAt: new Date(),
      botId: 'bot-live-1',
      walletId: 'wallet-live-1',
      strategyId: 'strategy-live-1',
      positionId: 'position-live-1',
      price: 43000,
      stopPrice: null,
      averageFillPrice: 43125,
      fee: 1.25,
      feeSource: 'EXCHANGE_FILL',
      feePending: false,
      feeCurrency: 'USDT',
      effectiveFeeRate: 0.001,
      exchangeOrderId: 'exchange-order-1',
      exchangeTradeId: 'exchange-trade-1',
      canceledAt: null,
    });

    await orchestrateRuntimeSignal(
      {
        userId: 'u1',
        symbol: 'BTCUSDT',
        direction: 'LONG',
        quantity: 0.1,
        markPrice: 43000,
        mode: 'LIVE',
      },
      orderGateway,
      positionGateway,
      eventGateway,
      tradeGateway
    );

    expect(tradeGateway.createTrade).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: 'order-live-filled-1',
        positionId: 'position-live-1',
        price: 43125,
        quantity: 0.1,
        fee: 1.25,
        feeSource: 'EXCHANGE_FILL',
      })
    );
  });

  it('ignores opposite direction when open position already exists (no-flip)', async () => {
    const orderGateway = createOrderGateway();
    const positionGateway = createPositionGateway();
    const eventGateway = createEventGateway();
    const tradeGateway = createTradeGateway();
    (positionGateway.getOpenPositionBySymbol as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'position-open',
      userId: 'u1',
      externalId: null,
      origin: 'BOT',
      managementMode: 'BOT_MANAGED',
      syncState: 'IN_SYNC',
      symbol: 'BTCUSDT',
      side: 'LONG',
      status: 'OPEN',
      entryPrice: 43000,
      quantity: 0.2,
      leverage: 1,
      openedAt: new Date(),
      closedAt: null,
      realizedPnl: null,
      unrealizedPnl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      botId: null,
      strategyId: null,
      stopLoss: null,
      takeProfit: null,
    });

    const result = await orchestrateRuntimeSignal(
      {
        userId: 'u1',
        symbol: 'BTCUSDT',
        direction: 'SHORT',
        quantity: 0.1,
        markPrice: 42900,
        mode: 'PAPER',
      },
      orderGateway,
      positionGateway,
      eventGateway,
      tradeGateway
    );

    expect(result).toEqual({ status: 'ignored', reason: 'no_flip_with_open_position' });
    expect(orderGateway.openOrder).not.toHaveBeenCalled();
    expect(positionGateway.createPosition).not.toHaveBeenCalled();
    expect(tradeGateway.createTrade).not.toHaveBeenCalled();
    expect(eventGateway.writeEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'ignored',
        reason: 'no_flip_with_open_position',
      })
    );
  });

  it('ignores runtime action for manual-managed symbol', async () => {
    const orderGateway = createOrderGateway();
    const positionGateway = createPositionGateway();
    const eventGateway = createEventGateway();
    const tradeGateway = createTradeGateway();
    (positionGateway.getOpenPositionBySymbol as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'position-open',
      userId: 'u1',
      externalId: null,
      origin: 'EXCHANGE_SYNC',
      managementMode: 'MANUAL_MANAGED',
      syncState: 'IN_SYNC',
      symbol: 'BTCUSDT',
      side: 'LONG',
      status: 'OPEN',
      entryPrice: 43000,
      quantity: 0.2,
      leverage: 1,
      openedAt: new Date(),
      closedAt: null,
      realizedPnl: null,
      unrealizedPnl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      botId: null,
      strategyId: null,
      stopLoss: null,
      takeProfit: null,
    });

    const result = await orchestrateRuntimeSignal(
      {
        userId: 'u1',
        symbol: 'BTCUSDT',
        direction: 'EXIT',
        quantity: 0.1,
        markPrice: 42900,
        mode: 'LIVE',
      },
      orderGateway,
      positionGateway,
      eventGateway,
      tradeGateway
    );

    expect(result).toEqual({ status: 'ignored', reason: 'manual_managed_symbol' });
    expect(orderGateway.openOrder).not.toHaveBeenCalled();
    expect(positionGateway.closePosition).not.toHaveBeenCalled();
    expect(tradeGateway.createTrade).not.toHaveBeenCalled();
    expect(eventGateway.writeEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'ignored',
        reason: 'manual_managed_symbol',
      })
    );
  });

  it('returns ignored when CLOSE dedupe is still inflight', async () => {
    const orderGateway = createOrderGateway();
    const positionGateway = createPositionGateway();
    const eventGateway = createEventGateway();
    const tradeGateway = createTradeGateway();
    const dedupeGateway = createDedupeGateway();
    (positionGateway.getOpenPositionBySymbol as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'position-open',
      userId: 'u1',
      externalId: null,
      origin: 'BOT',
      managementMode: 'BOT_MANAGED',
      syncState: 'IN_SYNC',
      symbol: 'BTCUSDT',
      side: 'LONG',
      status: 'OPEN',
      entryPrice: 43000,
      quantity: 0.2,
      leverage: 1,
      openedAt: new Date(),
      closedAt: null,
      realizedPnl: null,
      unrealizedPnl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      botId: null,
      strategyId: null,
      stopLoss: null,
      takeProfit: null,
    });
    (dedupeGateway.acquire as ReturnType<typeof vi.fn>).mockResolvedValue({
      outcome: 'inflight',
      dedupeKey: 'v1|CLOSE|...',
    });

    const result = await orchestrateRuntimeSignal(
      {
        userId: 'u1',
        symbol: 'BTCUSDT',
        direction: 'EXIT',
        quantity: 0.2,
        markPrice: 43000,
        mode: 'PAPER',
      },
      orderGateway,
      positionGateway,
      eventGateway,
      tradeGateway,
      dedupeGateway
    );

    expect(result).toEqual({ status: 'ignored', reason: 'dedupe_inflight' });
    expect(orderGateway.openOrder).not.toHaveBeenCalled();
    expect(positionGateway.closePosition).not.toHaveBeenCalled();
    expect(tradeGateway.createTrade).not.toHaveBeenCalled();
  });
});
