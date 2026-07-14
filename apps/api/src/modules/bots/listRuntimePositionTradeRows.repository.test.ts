import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  prisma: {
    trade: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('../../prisma/client', () => ({
  prisma: mocks.prisma,
}));

import { listRuntimePositionTradeRows } from './runtimeSessionPositionsRead.repository';

describe('listRuntimePositionTradeRows.repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('forwards the scoped query into prisma trade findMany with runtime ordering, optional take, and the exact projection', async () => {
    const where = {
      positionId: 'position-1',
      OR: [{ botId: 'bot-1' }, { walletId: 'wallet-1' }],
    } as const;
    const rows = [
      {
        id: 'trade-1',
        botId: 'bot-1',
        walletId: 'wallet-1',
        strategyId: 'strategy-1',
        orderId: 'order-1',
        positionId: 'position-1',
        symbol: 'BTCUSDT',
        side: 'BUY',
        lifecycleAction: 'ENTRY',
        price: '100000',
        quantity: '0.1000',
        fee: '10.00',
        realizedPnl: null,
        executedAt: new Date('2026-07-14T00:02:00.000Z'),
      },
    ];

    mocks.prisma.trade.findMany.mockResolvedValue(rows);

    await expect(
      listRuntimePositionTradeRows({ where: where as never, take: 10 }),
    ).resolves.toEqual(rows);
    expect(mocks.prisma.trade.findMany).toHaveBeenCalledWith({
      where,
      orderBy: [{ executedAt: 'asc' }, { createdAt: 'asc' }],
      take: 10,
      select: {
        id: true,
        botId: true,
        walletId: true,
        strategyId: true,
        orderId: true,
        positionId: true,
        symbol: true,
        side: true,
        lifecycleAction: true,
        price: true,
        quantity: true,
        fee: true,
        realizedPnl: true,
        executedAt: true,
      },
    });
  });
});
