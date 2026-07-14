import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  prisma: {
    position: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('../../prisma/client', () => ({
  prisma: mocks.prisma,
}));

import { listRuntimeManagedPositions } from './runtimeSessionPositionsRead.repository';

describe('listRuntimeManagedPositions.repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('forwards the scoped query into prisma position findMany with runtime ordering and returns the rows', async () => {
    const where = {
      managementMode: 'BOT_MANAGED',
      status: 'OPEN',
      OR: [{ botId: 'bot-1' }, { botId: null, walletId: 'wallet-1' }],
    } as const;
    const rows = [
      {
        id: 'position-1',
        origin: 'LIVE',
        managementMode: 'BOT_MANAGED',
        syncState: 'SYNCED',
        continuityState: 'ACTIVE',
        botId: 'bot-1',
        walletId: 'wallet-1',
        symbol: 'BTCUSDT',
        strategyId: 'strategy-1',
        side: 'LONG',
        status: 'OPEN',
        entryPrice: '100',
        quantity: '0.1',
        leverage: 5,
        marginUsed: '10',
        lastExchangeSyncAt: new Date('2026-07-14T00:05:00.000Z'),
        closeReason: null,
        closeInitiator: null,
        stopLoss: '95',
        takeProfit: '110',
        openedAt: new Date('2026-07-14T00:00:00.000Z'),
        closedAt: null,
        realizedPnl: '0',
        unrealizedPnl: '2',
      },
    ];

    mocks.prisma.position.findMany.mockResolvedValue(rows);

    await expect(listRuntimeManagedPositions({ where: where as never, limit: 25 })).resolves.toEqual(rows);
    expect(mocks.prisma.position.findMany).toHaveBeenCalledWith({
      where,
      orderBy: [{ openedAt: 'desc' }, { createdAt: 'desc' }],
      take: 25,
      select: {
        id: true,
        origin: true,
        managementMode: true,
        syncState: true,
        continuityState: true,
        botId: true,
        walletId: true,
        symbol: true,
        strategyId: true,
        side: true,
        status: true,
        entryPrice: true,
        quantity: true,
        leverage: true,
        marginUsed: true,
        lastExchangeSyncAt: true,
        closeReason: true,
        closeInitiator: true,
        stopLoss: true,
        takeProfit: true,
        openedAt: true,
        closedAt: true,
        realizedPnl: true,
        unrealizedPnl: true,
      },
    });
  });
});
