import { describe, expect, it, vi } from 'vitest';
import { ORDER_ERROR_CODES, OrderDomainError } from '../orders/orders.errors';
import { enforceRuntimeOrderLifetimes } from './runtimeOrderLifetime.service';

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
});
