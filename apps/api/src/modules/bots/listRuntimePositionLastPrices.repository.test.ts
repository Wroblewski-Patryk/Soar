import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  prisma: {
    botRuntimeSymbolStat: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('../../prisma/client', () => ({
  prisma: mocks.prisma,
}));

import { listRuntimePositionLastPrices } from './runtimeSessionPositionsRead.repository';

describe('listRuntimePositionLastPrices.repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('forwards the scoped query into prisma botRuntimeSymbolStat findMany with the exact projection and returns the rows', async () => {
    const where = {
      botId: 'bot-1',
      symbol: { in: ['BTCUSDT', 'ETHUSDT'] },
    } as const;
    const rows = [
      {
        symbol: 'BTCUSDT',
        lastPrice: '100000',
        snapshotAt: new Date('2026-07-14T00:05:00.000Z'),
      },
      {
        symbol: 'ETHUSDT',
        lastPrice: '5000',
        snapshotAt: new Date('2026-07-14T00:05:30.000Z'),
      },
    ];

    mocks.prisma.botRuntimeSymbolStat.findMany.mockResolvedValue(rows);

    await expect(listRuntimePositionLastPrices(where as never)).resolves.toEqual(rows);
    expect(mocks.prisma.botRuntimeSymbolStat.findMany).toHaveBeenCalledWith({
      where,
      select: {
        symbol: true,
        lastPrice: true,
        snapshotAt: true,
      },
    });
  });
});
