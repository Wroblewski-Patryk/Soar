import { afterEach, describe, expect, it } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { finalizeLiveCloseFill, finalizeRuntimeDcaFill } from './runtimeImmediateFillFinalizer.service';
import { finalizeExchangeCloseFill, finalizeExchangeDcaFill } from '../orders/orders.exchangeEventFinalization.service';
import { runtimeExecutionDedupeService } from './runtimeExecutionDedupe.service';

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
