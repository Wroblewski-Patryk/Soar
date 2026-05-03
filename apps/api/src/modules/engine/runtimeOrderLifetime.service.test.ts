import { describe, expect, it, vi } from 'vitest';
import { ORDER_ERROR_CODES, OrderDomainError } from '../orders/orders.errors';
import { prisma } from '../../prisma/client';
import { enforceRuntimeOrderLifetimes, runtimeOrderLifetimeDefaultDeps } from './runtimeOrderLifetime.service';

const createActiveBot = (overrides?: {
  userId?: string;
  botId?: string;
  orderLifetime?: number;
  orderUnit?: 'min' | 'h' | 'd' | 'w';
}) => ({
  id: overrides?.botId ?? 'bot-1',
  userId: overrides?.userId ?? 'user-1',
  walletId: 'wallet-1',
  mode: 'PAPER' as const,
  exchange: 'BINANCE' as const,
  paperStartBalance: 1000,
  marketType: 'FUTURES' as const,
  runtimeContext: {
    symbolGroupId: 'group-1',
    strategyId: 'strategy-1',
    maxOpenPositions: 1,
    symbols: ['BTCUSDT'],
    strategy: {
      strategyId: 'strategy-1',
      strategyInterval: '1m',
      strategyLeverage: 5,
      walletRisk: 1,
      strategyConfig: {
        additional: {
          orderLifetime: overrides?.orderLifetime ?? 15,
          orderUnit: overrides?.orderUnit ?? 'min',
        },
      },
    },
  },
});

describe('enforceRuntimeOrderLifetimes', () => {
  it('cancels stale open orders through canonical cancel path', async () => {
    const now = new Date('2026-04-24T12:00:00.000Z');
    const listStaleOrders = vi.fn(async () => [
      {
        id: 'order-1',
        userId: 'user-1',
        botId: 'bot-1',
        positionId: null,
        symbol: 'BTCUSDT',
        status: 'OPEN' as const,
        submittedAt: new Date('2026-04-24T11:00:00.000Z'),
        createdAt: new Date('2026-04-24T10:59:00.000Z'),
      },
    ]);
    const acquireCancelDedupe = vi.fn(async () => ({
      outcome: 'execute' as const,
      dedupeKey: 'cancel-key-1',
    }));
    const cancelOrder = vi.fn(async () => ({ id: 'order-1', positionId: null } as any));
    const markCancelDedupeSucceeded = vi.fn(async () => undefined);
    const markCancelDedupeFailed = vi.fn(async () => undefined);

    await enforceRuntimeOrderLifetimes([createActiveBot()], {
      now: () => now,
      listStaleOrders,
      acquireCancelDedupe,
      cancelOrder,
      markCancelDedupeSucceeded,
      markCancelDedupeFailed,
    });

    expect(listStaleOrders).toHaveBeenCalledWith({
      userId: 'user-1',
      botId: 'bot-1',
      olderThanMs: 900000,
      now,
    });
    expect(acquireCancelDedupe).toHaveBeenCalledWith(
      expect.objectContaining({
        commandType: 'CANCEL',
        userId: 'user-1',
        botId: 'bot-1',
        symbol: 'BTCUSDT',
      })
    );
    expect(cancelOrder).toHaveBeenCalledWith('user-1', 'order-1', { riskAck: true });
    expect(markCancelDedupeSucceeded).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: 'order-1',
        positionId: null,
        now,
      })
    );
    expect(markCancelDedupeFailed).not.toHaveBeenCalled();
  });

  it('skips bots whose strategy disables order lifetime', async () => {
    const listStaleOrders = vi.fn(async () => []);

    await enforceRuntimeOrderLifetimes([createActiveBot({ orderLifetime: 0 })], {
      listStaleOrders,
    });

    expect(listStaleOrders).not.toHaveBeenCalled();
  });

  it('treats already-terminal orders as successful cancellation races', async () => {
    const now = new Date('2026-04-24T12:00:00.000Z');
    const listStaleOrders = vi.fn(async () => [
      {
        id: 'order-1',
        userId: 'user-1',
        botId: 'bot-1',
        positionId: 'position-1',
        symbol: 'BTCUSDT',
        status: 'PARTIALLY_FILLED' as const,
        submittedAt: new Date('2026-04-24T11:00:00.000Z'),
        createdAt: new Date('2026-04-24T10:59:00.000Z'),
      },
    ]);
    const acquireCancelDedupe = vi.fn(async () => ({
      outcome: 'execute' as const,
      dedupeKey: 'cancel-key-2',
    }));
    const cancelOrder = vi.fn(async () => {
      throw new OrderDomainError(ORDER_ERROR_CODES.orderNotCancelable, 400);
    });
    const markCancelDedupeSucceeded = vi.fn(async () => undefined);
    const markCancelDedupeFailed = vi.fn(async () => undefined);

    await enforceRuntimeOrderLifetimes([createActiveBot()], {
      now: () => now,
      listStaleOrders,
      acquireCancelDedupe,
      cancelOrder,
      markCancelDedupeSucceeded,
      markCancelDedupeFailed,
    });

    expect(markCancelDedupeSucceeded).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: 'order-1',
        positionId: 'position-1',
        now,
      })
    );
    expect(markCancelDedupeFailed).not.toHaveBeenCalled();
  });

  it('does not retry when cancel dedupe is already inflight or reused', async () => {
    const listStaleOrders = vi.fn(async () => [
      {
        id: 'order-1',
        userId: 'user-1',
        botId: 'bot-1',
        positionId: null,
        symbol: 'BTCUSDT',
        status: 'OPEN' as const,
        submittedAt: new Date('2026-04-24T11:00:00.000Z'),
        createdAt: new Date('2026-04-24T10:59:00.000Z'),
      },
      {
        id: 'order-2',
        userId: 'user-1',
        botId: 'bot-1',
        positionId: null,
        symbol: 'ETHUSDT',
        status: 'PENDING' as const,
        submittedAt: new Date('2026-04-24T11:00:00.000Z'),
        createdAt: new Date('2026-04-24T10:59:00.000Z'),
      },
    ]);
    const acquireCancelDedupe = vi
      .fn()
      .mockResolvedValueOnce({
        outcome: 'inflight' as const,
        dedupeKey: 'cancel-key-1',
      })
      .mockResolvedValueOnce({
        outcome: 'reused' as const,
        dedupeKey: 'cancel-key-2',
        reuseStatus: 'completed' as const,
        orderId: 'order-2',
        positionId: null,
      });
    const cancelOrder = vi.fn(async () => null as any);

    await enforceRuntimeOrderLifetimes([createActiveBot()], {
      listStaleOrders,
      acquireCancelDedupe,
      cancelOrder,
    });

    expect(cancelOrder).not.toHaveBeenCalled();
  });

  it('lists only in-sync stale open orders from the default candidate query', async () => {
    await prisma.trade.deleteMany();
    await prisma.order.deleteMany();
    await prisma.position.deleteMany();
    await prisma.signal.deleteMany();
    await prisma.runtimeExecutionDedupe.deleteMany();
    await prisma.botRuntimeSymbolStat.deleteMany();
    await prisma.botRuntimeEvent.deleteMany();
    await prisma.botRuntimeSession.deleteMany();
    await prisma.log.deleteMany();
    await prisma.botStrategy.deleteMany();
    await prisma.botSubagentConfig.deleteMany();
    await prisma.botAssistantConfig.deleteMany();
    await prisma.marketGroupStrategyLink.deleteMany();
    await prisma.botMarketGroup.deleteMany();
    await prisma.bot.deleteMany();
    await prisma.symbolGroup.deleteMany();
    await prisma.marketUniverse.deleteMany();
    await prisma.wallet.deleteMany();
    await prisma.apiKey.deleteMany();
    await prisma.strategy.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: { email: 'runtime-order-lifetime-sync-state@example.com', password: 'test-password' },
      select: { id: true },
    });
    const bot = await prisma.bot.create({
      data: {
        userId: user.id,
        name: 'Lifetime Candidate Bot',
        mode: 'PAPER',
        exchange: 'BINANCE',
        marketType: 'FUTURES',
        positionMode: 'ONE_WAY',
      },
      select: { id: true },
    });
    const staleSubmittedAt = new Date('2026-05-04T10:00:00.000Z');
    const freshSubmittedAt = new Date('2026-05-04T10:20:00.000Z');
    await prisma.order.createMany({
      data: [
        {
          userId: user.id,
          botId: bot.id,
          symbol: 'BTCUSDT',
          side: 'BUY',
          type: 'LIMIT',
          status: 'OPEN',
          syncState: 'IN_SYNC',
          quantity: 1,
          price: 100,
          submittedAt: staleSubmittedAt,
          createdAt: staleSubmittedAt,
        },
        {
          userId: user.id,
          botId: bot.id,
          symbol: 'ETHUSDT',
          side: 'BUY',
          type: 'LIMIT',
          status: 'OPEN',
          syncState: 'ORPHAN_LOCAL',
          quantity: 1,
          price: 100,
          submittedAt: staleSubmittedAt,
          createdAt: staleSubmittedAt,
        },
        {
          userId: user.id,
          botId: bot.id,
          symbol: 'SOLUSDT',
          side: 'BUY',
          type: 'LIMIT',
          status: 'OPEN',
          syncState: 'IN_SYNC',
          quantity: 1,
          price: 100,
          submittedAt: freshSubmittedAt,
          createdAt: freshSubmittedAt,
        },
      ],
    });

    const candidates = await runtimeOrderLifetimeDefaultDeps.listStaleOrders({
      userId: user.id,
      botId: bot.id,
      olderThanMs: 15 * 60 * 1000,
      now: new Date('2026-05-04T10:30:00.000Z'),
    });

    expect(candidates.map((candidate) => candidate.symbol)).toEqual(['BTCUSDT']);
  });
});
