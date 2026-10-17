import { randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { afterEach, describe, expect, it } from 'vitest';
import { prisma } from '../../prisma/client';
import { runtimePositionStateStore } from '../engine/runtimePositionState.store';
import { NormalizedBinanceOrderTradeUpdateEvent } from '../exchange/binanceUserDataStream.types';
import { applyLiveExchangeOrderTradeUpdateEvent } from './orders.exchangeEvents.service';

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
  });

  it('finishes dedupe after a crash following the database commit without replaying DCA', async () => {
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
    await applyLiveExchangeOrderTradeUpdateEvent({ userId: user.id, event, client: freshClient });
    expect((await prisma.position.findUniqueOrThrow({ where: { id: position.id } })).quantity).toBe(2);
    expect(await prisma.orderFill.count({ where: { orderId: order.id } })).toBe(1);
    expect(await prisma.trade.count({ where: { orderId: order.id } })).toBe(1);
    expect((await prisma.runtimeExecutionDedupe.findUniqueOrThrow({ where: { dedupeKey } })).status).toBe('SUCCEEDED');
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
});
