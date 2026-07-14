import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  prisma: {
    order: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('../../prisma/client', () => ({
  prisma: mocks.prisma,
}));

import { listRuntimeOpenOrders } from './runtimeSessionPositionsRead.repository';

describe('listRuntimeOpenOrders.repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('forwards the scoped query into prisma order findMany with runtime ordering and returns the rows', async () => {
    const where = {
      managementMode: 'BOT_MANAGED',
      status: { in: ['PENDING', 'OPEN', 'PARTIALLY_FILLED'] },
      OR: [{ botId: 'bot-1' }, { botId: null, walletId: 'wallet-1' }],
    } as const;
    const rows = [
      {
        id: 'order-1',
        origin: 'BOT',
        exchangeOrderId: 'exchange-order-1',
        symbol: 'BTCUSDT',
        side: 'BUY',
        type: 'LIMIT',
        status: 'OPEN',
        quantity: '0.1000',
        filledQuantity: '0.0250',
        price: '100000',
        stopPrice: null,
        submittedAt: new Date('2026-07-14T00:00:05.000Z'),
        createdAt: new Date('2026-07-14T00:00:00.000Z'),
        updatedAt: new Date('2026-07-14T00:01:00.000Z'),
      },
    ];

    mocks.prisma.order.findMany.mockResolvedValue(rows);

    await expect(listRuntimeOpenOrders({ where: where as never, limit: 25 })).resolves.toEqual(rows);
    expect(mocks.prisma.order.findMany).toHaveBeenCalledWith({
      where,
      orderBy: [{ createdAt: 'desc' }, { updatedAt: 'desc' }],
      take: 25,
      select: {
        id: true,
        origin: true,
        exchangeOrderId: true,
        symbol: true,
        side: true,
        type: true,
        status: true,
        quantity: true,
        filledQuantity: true,
        price: true,
        stopPrice: true,
        submittedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });
});
