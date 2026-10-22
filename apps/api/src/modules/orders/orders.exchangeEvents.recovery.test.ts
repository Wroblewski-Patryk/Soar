import { randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { afterEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import { runtimePositionStateStore } from '../engine/runtimePositionState.store';
import { NormalizedBinanceOrderTradeUpdateEvent } from '../exchange/binanceUserDataStream.types';
import { applyLiveExchangeOrderTradeUpdateEvent } from './orders.exchangeEvents.service';
import { computeCloseRealizedPnl } from './orders.closedPositionFinancialRefresh';
import { finalizeExchangeCloseFill, finalizeExchangeDcaFill } from './orders.exchangeEventFinalization.service';

const users: string[] = [];
const positions: string[] = [];
const competingClients: PrismaClient[] = [];

const fixture = async (action: 'DCA' | 'CLOSE') => {
  const id = randomUUID();
  const user = await prisma.user.create({
    data: { email: `exchange-event-recovery-${id}@example.com`, password: 'hashed' },
  });
  users.push(user.id);
  const wallet = await prisma.wallet.create({ data: {
    userId: user.id, name: `recovery-${id}`, mode: 'LIVE', exchange: 'BINANCE',
    marketType: 'FUTURES', baseCurrency: 'USDT',
  } });
  const bot = await prisma.bot.create({ data: {
    userId: user.id, walletId: wallet.id, name: `recovery-${id}`, mode: 'LIVE',
    exchange: 'BINANCE', marketType: 'FUTURES', positionMode: 'ONE_WAY',
    isActive: true, liveOptIn: true, consentTextVersion: 'v1',
  } });
  const position = await prisma.position.create({ data: {
    userId: user.id, botId: bot.id, walletId: wallet.id,
    symbol: 'BTCUSDT', side: 'LONG', status: 'OPEN', quantity: 1,
    entryPrice: 100, origin: 'BOT', managementMode: 'BOT_MANAGED',
  } });
  positions.push(position.id);
  await runtimePositionStateStore.setPositionRuntimeState(position.id, {
    quantity: position.quantity, averageEntryPrice: position.entryPrice,
    currentAdds: 0, trailingAnchorPrice: position.entryPrice,
  });
  const order = await prisma.order.create({ data: {
    userId: user.id, botId: bot.id, walletId: wallet.id, positionId: position.id,
    symbol: 'BTCUSDT', side: action === 'DCA' ? 'BUY' : 'SELL',
    type: 'MARKET', status: 'OPEN', quantity: 1, filledQuantity: 0,
    origin: 'BOT', managementMode: 'BOT_MANAGED',
    exchangeOrderId: `exchange-${id}`,
  } });
  const dedupeKey = `v1|${action}|${id}`;
  await prisma.runtimeExecutionDedupe.create({ data: {
    dedupeKey, dedupeVersion: 'v1', commandType: action,
    userId: user.id, botId: bot.id, symbol: 'BTCUSDT',
    status: 'PENDING', orderId: order.id, positionId: position.id,
    commandFingerprint: { positionId: position.id, dcaLevelIndex: 0 },
    ttlExpiresAt: new Date(Date.now() + 86_400_000),
  } });
  const event: NormalizedBinanceOrderTradeUpdateEvent = {
    eventType: 'ORDER_TRADE_UPDATE', marketType: 'FUTURES',
    eventTime: 1_000, transactionTime: 1_001,
    symbol: 'BTCUSDT', side: action === 'DCA' ? 'BUY' : 'SELL',
    orderType: 'MARKET', orderStatus: 'FILLED', executionType: 'TRADE',
    exchangeOrderId: `exchange-${id}`, clientOrderId: `client-${id}`,
    averagePrice: action === 'DCA' ? 90 : 110,
    cumulativeFilledQuantity: 1, lastFilledQuantity: 1,
    lastFilledPrice: action === 'DCA' ? 90 : 110,
    fee: 0.1, feeCurrency: 'USDT', exchangeTradeId: `trade-${id}`, raw: {},
  };
  return { user, position, order, dedupeKey, event };
};

afterEach(async () => {
  await Promise.all(competingClients.splice(0).map((client) => client.$disconnect()));
  for (const positionId of positions.splice(0)) {
    await runtimePositionStateStore.deletePositionRuntimeState(positionId);
  }
  for (const userId of users.splice(0)) {
    await prisma.log.deleteMany({ where: { userId } });
    await prisma.orderFill.deleteMany({ where: { userId } });
    await prisma.trade.deleteMany({ where: { userId } });
    await prisma.runtimeExecutionDedupe.deleteMany({ where: { userId } });
    await prisma.order.deleteMany({ where: { userId } });
    await prisma.position.deleteMany({ where: { userId } });
    await prisma.bot.deleteMany({ where: { userId } });
    await prisma.wallet.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
  }
});

describe('full exchange fill handler recovery', () => {
  it('rolls back Order status when interrupted before writing the fill, then completes on retry', async () => {
    const { user, position, order, dedupeKey, event } = await fixture('DCA');
    await expect(applyLiveExchangeOrderTradeUpdateEvent({
      userId: user.id, event,
      afterOrderUpdate: async () => { throw new Error('simulated crash before fill'); },
    })).rejects.toThrow('simulated crash before fill');
    expect((await prisma.order.findUniqueOrThrow({ where: { id: order.id } })).status).toBe('OPEN');
    expect(await prisma.orderFill.count({ where: { orderId: order.id } })).toBe(0);
    expect(await prisma.trade.count({ where: { orderId: order.id } })).toBe(0);

    const freshClient = new PrismaClient();
    competingClients.push(freshClient);
    await applyLiveExchangeOrderTradeUpdateEvent({ userId: user.id, event, client: freshClient });
    expect((await prisma.position.findUniqueOrThrow({ where: { id: position.id } })).quantity).toBe(2);
    expect(await prisma.orderFill.count({ where: { orderId: order.id } })).toBe(1);
    expect(await prisma.trade.count({ where: { orderId: order.id, lifecycleAction: 'DCA' } })).toBe(1);
    expect((await prisma.runtimeExecutionDedupe.findUniqueOrThrow({ where: { dedupeKey } })).status).toBe('SUCCEEDED');
  });

  it('repairs a legacy FILLED Order left without its fill or DCA effects', async () => {
    const { user, position, order, dedupeKey, event } = await fixture('DCA');
    await prisma.order.update({ where: { id: order.id }, data: {
      status: 'FILLED', filledQuantity: 1, averageFillPrice: 90,
      exchangeTradeId: event.exchangeTradeId,
      filledAt: new Date(event.transactionTime!),
    } });
    const freshClient = new PrismaClient();
    competingClients.push(freshClient);
    await applyLiveExchangeOrderTradeUpdateEvent({ userId: user.id, event, client: freshClient });
    const fill = await prisma.orderFill.findFirstOrThrow({ where: { orderId: order.id } });
    expect(fill.quantity).toBe(1);
    expect((await prisma.position.findUniqueOrThrow({ where: { id: position.id } })).quantity).toBe(2);
    expect(await prisma.trade.count({ where: { orderId: order.id, lifecycleAction: 'DCA' } })).toBe(1);
    expect((await prisma.runtimeExecutionDedupe.findUniqueOrThrow({ where: { dedupeKey } })).status).toBe('SUCCEEDED');
  });

  it('repairs a legacy FILLED CLOSE whose Position was already closed before Trade persisted', async () => {
    const { user, position, order, dedupeKey, event } = await fixture('CLOSE');
    const closedAt = new Date(event.transactionTime!);
    await prisma.order.update({ where: { id: order.id }, data: {
      status: 'FILLED', filledQuantity: 1, averageFillPrice: 110,
      exchangeTradeId: event.exchangeTradeId, filledAt: closedAt,
    } });
    await prisma.position.update({ where: { id: position.id }, data: {
      status: 'CLOSED', closedAt, realizedPnl: 9.9,
      closeReason: 'SIGNAL_EXIT', closeInitiator: 'BOT_APP',
    } });
    await applyLiveExchangeOrderTradeUpdateEvent({ userId: user.id, event });
    expect(await prisma.orderFill.count({ where: { orderId: order.id } })).toBe(1);
    const trade = await prisma.trade.findFirstOrThrow({ where: { orderId: order.id } });
    expect(trade.lifecycleAction).toBe('CLOSE');
    expect(trade.realizedPnl).toBe(9.9);
    expect((await prisma.position.findUniqueOrThrow({ where: { id: position.id } })).status).toBe('CLOSED');
    expect((await prisma.runtimeExecutionDedupe.findUniqueOrThrow({ where: { dedupeKey } })).status).toBe('SUCCEEDED');
  });

  it('repairs a legacy FILLED entry Order with no Position or Trade', async () => {
    const { user, position, order, event } = await fixture('DCA');
    await prisma.order.update({ where: { id: order.id }, data: {
      positionId: null, status: 'FILLED', filledQuantity: 1,
      averageFillPrice: 90, exchangeTradeId: event.exchangeTradeId,
      filledAt: new Date(event.transactionTime!),
    } });
    await prisma.position.delete({ where: { id: position.id } });
    await applyLiveExchangeOrderTradeUpdateEvent({ userId: user.id, event });
    const updatedOrder = await prisma.order.findUniqueOrThrow({ where: { id: order.id } });
    expect(updatedOrder.positionId).toBeTruthy();
    expect(await prisma.orderFill.count({ where: { orderId: order.id } })).toBe(1);
    expect(await prisma.trade.count({ where: { orderId: order.id, lifecycleAction: 'OPEN' } })).toBe(1);
    expect(await prisma.position.count({ where: { id: updatedOrder.positionId! } })).toBe(1);
    expect(await runtimePositionStateStore.getPositionRuntimeState(updatedOrder.positionId!))
      .toMatchObject({ quantity: 1, averageEntryPrice: 90, currentAdds: 0 });
    await runtimePositionStateStore.deletePositionRuntimeState(updatedOrder.positionId!);
    await applyLiveExchangeOrderTradeUpdateEvent({ userId: user.id, event });
    expect(await runtimePositionStateStore.getPositionRuntimeState(updatedOrder.positionId!)).toBeNull();
  });

  it('leaves a lost post-commit protection cache pending without replaying DCA', async () => {
    const { user, position, order, dedupeKey, event } = await fixture('DCA');
    await expect(applyLiveExchangeOrderTradeUpdateEvent({
      userId: user.id, event,
      afterCoreCommit: async () => { throw new Error('simulated crash before dedupe'); },
    })).rejects.toThrow('simulated crash before dedupe');
    expect((await prisma.position.findUniqueOrThrow({ where: { id: position.id } })).quantity).toBe(2);
    expect((await prisma.runtimeExecutionDedupe.findUniqueOrThrow({ where: { dedupeKey } })).status).toBe('PENDING');
    const freshClient = new PrismaClient();
    competingClients.push(freshClient);
    await runtimePositionStateStore.deletePositionRuntimeState(position.id);
    await expect(applyLiveExchangeOrderTradeUpdateEvent({ userId: user.id,
      event, client: freshClient })).rejects.toThrow('RUNTIME_STATE_SYNC_PENDING');
    expect((await prisma.position.findUniqueOrThrow({ where: { id: position.id } })).quantity).toBe(2);
    expect(await prisma.orderFill.count({ where: { orderId: order.id } })).toBe(1);
    expect(await prisma.trade.count({ where: { orderId: order.id } })).toBe(1);
    expect((await prisma.runtimeExecutionDedupe.findUniqueOrThrow({ where: { dedupeKey } })).status).toBe('SUCCEEDED');
    expect(await runtimePositionStateStore.getPositionRuntimeState(position.id)).toBeNull();
  });

  for (const action of ['DCA', 'CLOSE'] as const) {
    it(`serializes two complete ${action} event handlers and applies one fill and lifecycle`, async () => {
      const { user, position, order, dedupeKey, event } = await fixture(action);
      const client = new PrismaClient();
      competingClients.push(client);
      await Promise.all([
        applyLiveExchangeOrderTradeUpdateEvent({ userId: user.id, event }),
        applyLiveExchangeOrderTradeUpdateEvent({ userId: user.id, event, client }),
      ]);
      expect(await prisma.orderFill.count({ where: { orderId: order.id } })).toBe(1);
      expect(await prisma.trade.count({ where: { orderId: order.id } })).toBe(1);
      const updated = await prisma.position.findUniqueOrThrow({ where: { id: position.id } });
      expect(updated.quantity).toBe(action === 'DCA' ? 2 : 1);
      expect(updated.status).toBe(action === 'DCA' ? 'OPEN' : 'CLOSED');
      expect((await prisma.runtimeExecutionDedupe.findUniqueOrThrow({ where: { dedupeKey } })).status).toBe('SUCCEEDED');
    });
  }
  it('records Gate FUTURES partial fill notional in base units and does not finalize an unsupported nonunit order', async () => {
    const user = await prisma.user.create({ data: {
      email: 'gate-nonunit-fill-notional@example.com', password: 'hashed',
    } });
    users.push(user.id);
    const wallet = await prisma.wallet.create({ data: {
      userId: user.id, name: 'gate-nonunit-fill', mode: 'LIVE',
      exchange: 'GATEIO', marketType: 'FUTURES', baseCurrency: 'USDT',
    } });
    const order = await prisma.order.create({ data: {
      userId: user.id, walletId: wallet.id, origin: 'USER',
      managementMode: 'MANUAL_MANAGED', symbol: 'BTCUSDT', side: 'BUY',
      type: 'MARKET', status: 'OPEN', quantity: 200, contractSize: 0.01,
      exchangeOrderId: 'gate-nonunit-fill-order',
    } });
    const partial = {
      eventType: 'ORDER_TRADE_UPDATE', marketType: 'FUTURES', eventTime: 1_000,
      transactionTime: 1_001, symbol: 'BTCUSDT', side: 'BUY', orderType: 'MARKET',
      orderStatus: 'PARTIALLY_FILLED', executionType: 'TRADE',
      exchangeOrderId: 'gate-nonunit-fill-order', clientOrderId: 'gate-nonunit-fill-client',
      averagePrice: 100, cumulativeFilledQuantity: 100, lastFilledQuantity: 100,
      lastFilledPrice: 100, fee: 0.04, feeCurrency: 'USDT',
      exchangeTradeId: 'gate-nonunit-fill-trade-1', raw: {},
    } as const;
    const apply = (event: Parameters<typeof applyLiveExchangeOrderTradeUpdateEvent>[0]['event']) =>
      applyLiveExchangeOrderTradeUpdateEvent({
      userId: user.id, sourceExchange: 'GATEIO', event,
    });

    await apply(partial);
    await apply(partial);
    const fills = await prisma.orderFill.findMany({ where: { orderId: order.id } });
    expect(fills).toHaveLength(1);
    expect(fills[0]).toMatchObject({ quantity: 100, price: 100, notional: 100, feeCost: 0.04 });
    expect(await prisma.order.findUniqueOrThrow({ where: { id: order.id } }))
      .toMatchObject({ status: 'PARTIALLY_FILLED', filledQuantity: 100, positionId: null });
    expect(await prisma.trade.count({ where: { orderId: order.id } })).toBe(0);

    await expect(apply({ ...partial, eventTime: 1_002, transactionTime: 1_003,
      orderStatus: 'FILLED', cumulativeFilledQuantity: 200, lastFilledQuantity: 100,
      exchangeTradeId: 'gate-nonunit-fill-trade-2' }))
      .rejects.toThrow('EXCHANGE_FUTURES_NONUNIT_FINANCIALS_UNSUPPORTED');
    expect(await prisma.orderFill.count({ where: { orderId: order.id } })).toBe(1);
    expect(await prisma.trade.count({ where: { orderId: order.id } })).toBe(0);
  });

  it.each([
    { orderUnit: null, positionUnit: null, code: 'GATE_FUTURES_CONTRACT_UNIT_UNAVAILABLE' },
    { orderUnit: 1, positionUnit: 0.01, code: 'GATE_FUTURES_CONTRACT_UNIT_MISMATCH' },
  ])('rejects Gate FUTURES fill with unsafe saved units: $code', async ({ orderUnit, positionUnit, code }) => {
    const user = await prisma.user.create({ data: {
      email: `gate-unsafe-unit-${code}@example.com`, password: 'hashed',
    } });
    users.push(user.id);
    const wallet = await prisma.wallet.create({ data: {
      userId: user.id, name: code, mode: 'LIVE', exchange: 'GATEIO',
      marketType: 'FUTURES', baseCurrency: 'USDT',
    } });
    const position = positionUnit == null ? null : await prisma.position.create({ data: {
      userId: user.id, walletId: wallet.id, origin: 'USER',
      managementMode: 'MANUAL_MANAGED', symbol: 'BTCUSDT', side: 'LONG',
      status: 'OPEN', quantity: 200, entryPrice: 100, contractSize: positionUnit,
    } });
    const order = await prisma.order.create({ data: {
      userId: user.id, walletId: wallet.id, positionId: position?.id,
      origin: 'USER', managementMode: 'MANUAL_MANAGED', symbol: 'BTCUSDT',
      side: 'BUY', type: 'MARKET', status: 'OPEN', quantity: 200,
      contractSize: orderUnit, exchangeOrderId: `gate-unsafe-${code}`,
    } });
    await expect(applyLiveExchangeOrderTradeUpdateEvent({
      userId: user.id, sourceExchange: 'GATEIO', event: {
        eventType: 'ORDER_TRADE_UPDATE', marketType: 'FUTURES', eventTime: 2_000,
        transactionTime: 2_001, symbol: 'BTCUSDT', side: 'BUY', orderType: 'MARKET',
        orderStatus: 'PARTIALLY_FILLED', executionType: 'TRADE',
        exchangeOrderId: `gate-unsafe-${code}`, clientOrderId: 'gate-unsafe-client',
        averagePrice: 100, cumulativeFilledQuantity: 100, lastFilledQuantity: 100,
        lastFilledPrice: 100, fee: 0.04, feeCurrency: 'USDT',
        exchangeTradeId: `gate-unsafe-trade-${code}`, raw: {},
      },
    })).rejects.toThrow(code);
    expect(await prisma.orderFill.count({ where: { orderId: order.id } })).toBe(0);
    expect(await prisma.trade.count({ where: { orderId: order.id } })).toBe(0);
    expect(await prisma.order.findUniqueOrThrow({ where: { id: order.id } }))
      .toMatchObject({ status: 'OPEN', filledQuantity: 0 });
  });

  it.each([
    { marketType: 'FUTURES' as const, contractSize: 1 },
    { marketType: 'SPOT' as const, contractSize: null },
  ])('preserves Gate $marketType unit-size fill and lifecycle', async ({ marketType, contractSize }) => {
    const user = await prisma.user.create({ data: {
      email: `gate-unit-${marketType}@example.com`, password: 'hashed',
    } });
    users.push(user.id);
    const wallet = await prisma.wallet.create({ data: {
      userId: user.id, name: `gate-${marketType}`, mode: 'LIVE', exchange: 'GATEIO',
      marketType, baseCurrency: 'USDT',
    } });
    const order = await prisma.order.create({ data: {
      userId: user.id, walletId: wallet.id, origin: 'USER',
      managementMode: 'MANUAL_MANAGED', symbol: 'BTCUSDT', side: 'BUY',
      type: 'MARKET', status: 'OPEN', quantity: 1, contractSize,
      exchangeOrderId: `gate-unit-${marketType}`,
    } });
    const event = {
      eventType: 'ORDER_TRADE_UPDATE', marketType, eventTime: 3_000,
      transactionTime: 3_001, symbol: 'BTCUSDT', side: 'BUY', orderType: 'MARKET',
      orderStatus: 'FILLED', executionType: 'TRADE',
      exchangeOrderId: `gate-unit-${marketType}`, clientOrderId: 'gate-unit-client',
      averagePrice: 100, cumulativeFilledQuantity: 1, lastFilledQuantity: 1,
      lastFilledPrice: 100, fee: 0.04, feeCurrency: 'USDT',
      exchangeTradeId: `gate-unit-trade-${marketType}`, raw: {},
    } as const;
    const apply = () => applyLiveExchangeOrderTradeUpdateEvent({
      userId: user.id, sourceExchange: 'GATEIO', event,
    });
    await apply();
    await apply();
    expect(await prisma.orderFill.findMany({ where: { orderId: order.id } }))
      .toEqual([expect.objectContaining({ quantity: 1, price: 100, notional: 100 })]);
    expect(await prisma.order.findUniqueOrThrow({ where: { id: order.id } }))
      .toMatchObject({ status: 'FILLED', filledQuantity: 1 });
    expect(await prisma.trade.count({ where: { orderId: order.id } })).toBe(1);
  });

  it('keeps direct exchange finalizers and fee refresh from publishing nonunit PnL', async () => {
    const user = await prisma.user.create({ data: {
      email: 'gate-nonunit-downstream@example.com', password: 'hashed',
    } });
    users.push(user.id);
    const wallet = await prisma.wallet.create({ data: {
      userId: user.id, name: 'gate-nonunit-downstream', mode: 'LIVE',
      exchange: 'GATEIO', marketType: 'FUTURES', baseCurrency: 'USDT',
    } });
    const position = await prisma.position.create({ data: {
      userId: user.id, walletId: wallet.id, origin: 'USER',
      managementMode: 'MANUAL_MANAGED', symbol: 'BTCUSDT', side: 'LONG',
      status: 'OPEN', quantity: 100, entryPrice: 100, contractSize: 0.01,
    } });
    const order = await prisma.order.create({ data: {
      userId: user.id, walletId: wallet.id, positionId: position.id,
      origin: 'USER', managementMode: 'MANUAL_MANAGED', symbol: 'BTCUSDT',
      side: 'SELL', type: 'MARKET', status: 'FILLED', quantity: 100,
      filledQuantity: 100, contractSize: 0.01,
      exchangeOrderId: 'gate-nonunit-downstream-order',
    } });
    const input = { userId: user.id, orderId: order.id, positionId: position.id,
      fillPrice: 110, fillQuantity: 100, exchangeTradeId: 'gate-nonunit-downstream-trade',
      eventAt: new Date('2026-10-22T10:00:00.000Z') };
    await expect(finalizeExchangeCloseFill({ ...input,
      closeReason: 'MANUAL', closeInitiator: 'USER_APP' }))
      .rejects.toThrow('EXCHANGE_FUTURES_NONUNIT_FINANCIALS_UNSUPPORTED');
    await expect(finalizeExchangeDcaFill(input))
      .rejects.toThrow('EXCHANGE_FUTURES_NONUNIT_FINANCIALS_UNSUPPORTED');
    expect(await prisma.$transaction((tx) => computeCloseRealizedPnl({
      tx, userId: user.id, positionId: position.id, positionSide: 'LONG',
      entryPrice: 100, closePrice: 110, closeQuantity: 100, contractSize: 0.01,
      exitFee: 0.04, exitFeePending: false, imported: false,
    }))).toBeNull();
    expect(await prisma.position.findUniqueOrThrow({ where: { id: position.id } }))
      .toMatchObject({ status: 'OPEN', realizedPnl: null });
    expect(await prisma.trade.count({ where: { orderId: order.id } })).toBe(0);
  });

});
