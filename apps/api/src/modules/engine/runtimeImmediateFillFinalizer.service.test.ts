import { afterEach, describe, expect, it } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { finalizeLiveCloseFill, finalizeRuntimeDcaFill } from './runtimeImmediateFillFinalizer.service';
import { finalizeExchangeCloseFill, finalizeExchangeDcaFill } from '../orders/orders.exchangeEventFinalization.service';
import { runtimeExecutionDedupeService } from './runtimeExecutionDedupe.service';
import { hydrateImportedPositionHistory } from '../positions/importedPositionHistoryHydrator.service';
import {
  livePositionReconciliationDefaultDeps,
  reconcileExternalPositionsFromExchange,
} from '../positions/livePositionReconciliation.service';
import { applyLiveExchangeOrderTradeUpdateEvent } from '../orders/orders.exchangeEvents.service';

const createdUserIds: string[] = [];
const competingClients: PrismaClient[] = [];
const createCompetingClient = () => {
  const client = new PrismaClient();
  competingClients.push(client);
  return client;
};

const createFilledFixture = async (side: 'BUY' | 'SELL') => {
  const user = await prisma.user.create({
    data: { email: `runtime-fill-${side.toLowerCase()}-${Date.now()}@example.com`, password: 'hashed' },
  });
  createdUserIds.push(user.id);
  const position = await prisma.position.create({
    data: { userId: user.id, symbol: 'BTCUSDT', side: 'LONG', status: 'OPEN',
      entryPrice: 100, quantity: 1, syncState: 'IN_SYNC' },
  });
  const order = await prisma.order.create({
    data: { userId: user.id, positionId: position.id, symbol: 'BTCUSDT', side,
      type: 'MARKET', status: 'FILLED', quantity: 1, filledQuantity: 1,
      fee: side === 'BUY' ? 0.1 : 1,
      averageFillPrice: side === 'BUY' ? 90 : 110,
      exchangeOrderId: `exchange-${side.toLowerCase()}-${Date.now()}` },
  });
  await prisma.orderFill.create({
    data: { userId: user.id, orderId: order.id, positionId: position.id,
      symbol: 'BTCUSDT', side, exchangeTradeId: `fill-${order.id}`,
      price: side === 'BUY' ? 90 : 110, quantity: 1,
      notional: side === 'BUY' ? 90 : 110, executedAt: new Date() },
  });
  const dedupe = await prisma.runtimeExecutionDedupe.create({
    data: { dedupeKey: `v1|${side === 'BUY' ? 'DCA' : 'CLOSE'}|${order.id}`,
      dedupeVersion: 'v1', commandType: side === 'BUY' ? 'DCA' : 'CLOSE',
      userId: user.id, symbol: 'BTCUSDT', status: 'PENDING',
      commandFingerprint: { positionId: position.id },
      ttlExpiresAt: new Date(Date.now() + 86_400_000) },
  });
  return { user, position, order, dedupe };
};

afterEach(async () => {
  await Promise.all(competingClients.splice(0).map((client) => client.$disconnect()));
  for (const userId of createdUserIds.splice(0)) {
    await prisma.log.deleteMany({ where: { userId } });
    await prisma.trade.deleteMany({ where: { userId } });
    await prisma.orderFill.deleteMany({ where: { userId } });
    await prisma.order.deleteMany({ where: { userId } });
    await prisma.runtimeExecutionDedupe.deleteMany({ where: { userId } });
    await prisma.position.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
  }
});

describe('immediate filled runtime order finalization', () => {
  it('settles an imported runtime close with explicit zero entry and exit fees', async () => {
    const { user, position, order, dedupe } = await createFilledFixture('SELL');
    await prisma.position.update({
      where: { id: position.id }, data: { origin: 'EXCHANGE_SYNC' },
    });
    await hydrateImportedPositionHistory({
      userId: user.id, positionId: position.id, botId: null, walletId: null,
      strategyId: null, symbol: 'BTCUSDT', positionSide: 'LONG',
      positionQuantity: 1, managementMode: 'BOT_MANAGED',
      trades: [{ exchangeTradeId: 'zero-open', exchangeOrderId: 'zero-order',
        symbol: 'BTCUSDT', side: 'BUY', price: 100, quantity: 1, notional: 100,
        feeCost: 0, feeCurrency: 'USDT', feeRate: 0,
        executedAt: '2026-04-29T10:00:00.000Z' }],
    });
    await prisma.order.update({
      where: { id: order.id }, data: {
        fee: 0, feeSource: 'EXCHANGE_FILL', feePending: false,
      },
    });
    expect(await finalizeLiveCloseFill({
      userId: user.id, positionId: position.id, order,
      dedupeKey: dedupe.dedupeKey, fillPrice: 110,
      fillQuantity: 1, exitFee: 0, closedAt: new Date(),
      closeReason: 'SIGNAL_EXIT', closeInitiator: 'BOT_APP',
    })).toEqual({ applied: true, realizedPnl: 10 });
  });

  it('backfills a closed imported BOT position without duplicating its runtime close on replay', async () => {
    const { user, position, order, dedupe } = await createFilledFixture('SELL');
    const apiKeyId = 'imported-runtime-key';
    await prisma.position.update({
      where: { id: position.id }, data: {
        origin: 'EXCHANGE_SYNC', managementMode: 'BOT_MANAGED',
        externalId: `${apiKeyId}:FUTURES:BTCUSDT:LONG`,
      },
    });
    await prisma.order.update({
      where: { id: order.id }, data: {
        origin: 'BOT', exchangeTradeId: null,
        fee: 0.2, feeSource: 'EXCHANGE_FILL', feePending: true,
      },
    });
    await prisma.orderFill.updateMany({
      where: { orderId: order.id },
      data: { exchangeTradeId: 'soar-fill-runtime-close', feeCost: null },
    });
    const openedAt = new Date('2026-04-29T10:00:00.000Z');
    const closedAt = new Date('2026-04-29T11:00:00.000Z');
    const importedInput = {
      userId: user.id, positionId: position.id, botId: null, walletId: null,
      strategyId: null, symbol: 'BTCUSDT', positionSide: 'LONG' as const,
      positionQuantity: 1, managementMode: 'BOT_MANAGED' as const,
    };
    await hydrateImportedPositionHistory({ ...importedInput, trades: [{
      exchangeTradeId: 'venue-open', exchangeOrderId: 'venue-open-order',
      symbol: 'BTCUSDT', side: 'BUY', price: 100, quantity: 1, notional: 100,
      feeCost: null, feeCurrency: 'USDT', feeRate: null,
      executedAt: openedAt.toISOString(),
    }] });
    const runtimeInput = {
      userId: user.id, positionId: position.id, order, dedupeKey: dedupe.dedupeKey,
      fillPrice: 110, fillQuantity: 1, exitFee: 0.2, closedAt,
      closeReason: 'SIGNAL_EXIT' as const, closeInitiator: 'BOT_APP' as const,
    };
    expect(await finalizeLiveCloseFill(runtimeInput)).toEqual({ applied: true, realizedPnl: null });
    expect(await finalizeLiveCloseFill(runtimeInput)).toEqual({ applied: false, realizedPnl: null });
    expect((await prisma.position.findUniqueOrThrow({ where: { id: position.id } })).realizedPnl).toBeNull();
    expect((await prisma.trade.findFirstOrThrow({ where: { orderId: order.id } })).feePending).toBe(true);

    const canonicalHistory = [
      { exchangeTradeId: 'venue-open', exchangeOrderId: 'venue-open-order',
        symbol: 'BTCUSDT', side: 'BUY', price: 100, quantity: 1, notional: 100,
        feeCost: 2, feeCurrency: 'USDT', feeRate: 0.02,
        executedAt: openedAt.toISOString() },
      { exchangeTradeId: 'venue-close', exchangeOrderId: order.exchangeOrderId,
        symbol: 'BTCUSDT', side: 'SELL', price: 110, quantity: 1, notional: 110,
        feeCost: 1, feeCurrency: 'USDT', feeRate: 1 / 110,
        executedAt: closedAt.toISOString() },
    ];
    const reconcile = () => reconcileExternalPositionsFromExchange({
      ...livePositionReconciliationDefaultDeps,
      listSyncedApiKeys: async () => [{
        id: apiKeyId, userId: user.id, exchange: 'BINANCE', marketType: 'FUTURES',
      }],
      resolveOwnershipIndexForUser: async () => new Map(),
      fetchPositionsForApiKey: async () => ({ positions: [] }),
      fetchOpenOrdersForApiKey: async () => [],
      fetchTradeHistoryForApiKeySymbol: async () => canonicalHistory,
      listOpenSyncedPositionsForApiKey: async () => [],
      now: () => closedAt,
    });
    await reconcile();
    await reconcile();
    const trades = await prisma.trade.findMany({
      where: { positionId: position.id }, orderBy: { executedAt: 'asc' },
    });
    expect(trades).toHaveLength(2);
    expect(trades.map((trade) => trade.exchangeTradeId)).toEqual(['venue-open', 'venue-close']);
    expect(trades.find((trade) => trade.orderId === order.id)).toMatchObject({
      origin: 'BOT', fee: 1, feePending: false, realizedPnl: 7,
    });
    expect((await prisma.position.findUniqueOrThrow({ where: { id: position.id } })).realizedPnl).toBe(7);
    expect((await prisma.order.findUniqueOrThrow({ where: { id: order.id } })).feePending).toBe(false);
    expect((await prisma.orderFill.findFirstOrThrow({ where: { orderId: order.id } })).feeCost).toBe(1);

    await applyLiveExchangeOrderTradeUpdateEvent({ userId: user.id, event: {
      eventType: 'ORDER_TRADE_UPDATE', marketType: 'FUTURES',
      eventTime: closedAt.getTime(), transactionTime: closedAt.getTime(),
      symbol: 'BTCUSDT', side: 'SELL', orderType: 'MARKET',
      orderStatus: 'FILLED', executionType: 'TRADE',
      exchangeOrderId: order.exchangeOrderId!, clientOrderId: 'runtime-close-replay',
      averagePrice: 110, cumulativeFilledQuantity: 1,
      lastFilledQuantity: 1, lastFilledPrice: 110,
      fee: null, feeCurrency: 'USDT', exchangeTradeId: 'venue-close', raw: {},
    } });
    expect(await prisma.trade.count({ where: { positionId: position.id } })).toBe(2);
    expect((await prisma.position.findUniqueOrThrow({ where: { id: position.id } })).realizedPnl).toBe(7);
  });

  it('recovers DCA after a crash between position write and Trade, without repeating the add', async () => {
    const { user, position, order, dedupe } = await createFilledFixture('BUY');
    const input = { userId: user.id, positionId: position.id, order, dedupeKey: dedupe.dedupeKey,
      fillPrice: 90, fillQuantity: 1, feePaid: 0.1, mode: 'LIVE' as const };
    await expect(finalizeRuntimeDcaFill({
      ...input, afterPositionWrite: async () => { throw new Error('simulated crash'); },
    })).rejects.toThrow('simulated crash');
    expect((await prisma.position.findUniqueOrThrow({ where: { id: position.id } })).quantity).toBe(1);
    expect(await prisma.trade.count({ where: { orderId: order.id, lifecycleAction: 'DCA' } })).toBe(0);
    expect(await prisma.orderFill.count({ where: { orderId: order.id } })).toBe(1);
    expect((await prisma.runtimeExecutionDedupe.findUniqueOrThrow({ where: { id: dedupe.id } })).status).toBe('PENDING');
    await runtimeExecutionDedupeService.markFailed({
      dedupeKey: dedupe.dedupeKey, errorClass: 'live_execution_unknown',
    });
    expect(await runtimeExecutionDedupeService.acquire({
      dedupeKey: dedupe.dedupeKey, commandType: 'DCA', userId: user.id,
      symbol: 'BTCUSDT', commandFingerprint: { positionId: position.id },
    })).toMatchObject({ outcome: 'execute' });

    await Promise.all([
      finalizeRuntimeDcaFill(input),
      finalizeExchangeDcaFill({
        userId: user.id, orderId: order.id, positionId: position.id,
        fillPrice: 90, fillQuantity: 1, exchangeTradeId: null, eventAt: new Date(),
        client: createCompetingClient(),
      }),
    ]);
    expect((await finalizeRuntimeDcaFill(input)).applied).toBe(false);
    expect((await prisma.position.findUniqueOrThrow({ where: { id: position.id } })).quantity).toBe(2);
    expect(await prisma.trade.count({ where: { orderId: order.id, lifecycleAction: 'DCA' } })).toBe(1);
    expect((await prisma.runtimeExecutionDedupe.findUniqueOrThrow({ where: { id: dedupe.id } })).status).toBe('SUCCEEDED');
  });

  it('recovers CLOSE after a crash between position write and Trade, without repeating the close', async () => {
    const { user, position, order, dedupe } = await createFilledFixture('SELL');
    await prisma.trade.create({ data: {
      userId: user.id, positionId: position.id, symbol: 'BTCUSDT', side: 'BUY',
      lifecycleAction: 'OPEN', price: 100, quantity: 1, fee: 0.5, executionMode: 'LIVE',
    } });
    const input = { userId: user.id, positionId: position.id, order, dedupeKey: dedupe.dedupeKey,
      fillPrice: 110, fillQuantity: 1, exitFee: 1, closedAt: new Date(),
      closeReason: 'SIGNAL_EXIT' as const, closeInitiator: 'BOT_APP' as const };
    await expect(finalizeLiveCloseFill({
      ...input, afterPositionWrite: async () => { throw new Error('simulated crash'); },
    })).rejects.toThrow('simulated crash');
    expect((await prisma.position.findUniqueOrThrow({ where: { id: position.id } })).status).toBe('OPEN');
    expect(await prisma.trade.count({ where: { orderId: order.id, lifecycleAction: 'CLOSE' } })).toBe(0);
    expect(await prisma.orderFill.count({ where: { orderId: order.id } })).toBe(1);
    await prisma.runtimeExecutionDedupe.update({
      where: { id: dedupe.id }, data: { orderId: order.id, positionId: position.id },
    });
    expect(await runtimeExecutionDedupeService.acquire({
      dedupeKey: dedupe.dedupeKey, commandType: 'CLOSE', userId: user.id,
      symbol: 'BTCUSDT', commandFingerprint: { positionId: position.id },
    })).toMatchObject({ outcome: 'execute' });
    await prisma.runtimeExecutionDedupe.update({
      where: { id: dedupe.id }, data: { status: 'SUCCEEDED' },
    });
    expect(await runtimeExecutionDedupeService.acquire({
      dedupeKey: dedupe.dedupeKey, commandType: 'CLOSE', userId: user.id,
      symbol: 'BTCUSDT', commandFingerprint: { positionId: position.id },
    })).toMatchObject({ outcome: 'execute' });

    await Promise.all([
      finalizeLiveCloseFill(input),
      finalizeExchangeCloseFill({
        userId: user.id, orderId: order.id, positionId: position.id,
        fillPrice: 110, fillQuantity: 1, exchangeTradeId: null, eventAt: new Date(),
        closeReason: 'SIGNAL_EXIT', closeInitiator: 'BOT_APP',
        client: createCompetingClient(),
      }),
    ]);
    expect(await finalizeLiveCloseFill(input)).toEqual({ applied: false, realizedPnl: 8.5 });
    expect((await prisma.position.findUniqueOrThrow({ where: { id: position.id } })).status).toBe('CLOSED');
    expect(await prisma.trade.count({ where: { orderId: order.id, lifecycleAction: 'CLOSE' } })).toBe(1);
    await runtimeExecutionDedupeService.markFailed({
      dedupeKey: dedupe.dedupeKey, errorClass: 'telemetry_error_after_commit',
    });
    expect((await prisma.runtimeExecutionDedupe.findUniqueOrThrow({ where: { id: dedupe.id } })).status).toBe('SUCCEEDED');
  });
});
