import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  prisma: {
    strategy: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('../../prisma/client', () => ({
  prisma: mocks.prisma,
}));

import { listRuntimePositionStrategies } from './runtimeSessionPositionsRead.repository';

describe('listRuntimePositionStrategies.repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('forwards the scoped query into prisma strategy findMany with the exact projection and returns the rows', async () => {
    const where = {
      id: { in: ['strategy-1', 'strategy-2'] },
      userId: 'user-1',
    } as const;
    const rows = [
      {
        id: 'strategy-1',
        config: {
          dca: { levels: [2, 4, 6] },
        },
      },
      {
        id: 'strategy-2',
        config: {
          takeProfit: { levels: [1.5, 3] },
        },
      },
    ];

    mocks.prisma.strategy.findMany.mockResolvedValue(rows);

    await expect(listRuntimePositionStrategies(where as never)).resolves.toEqual(rows);
    expect(mocks.prisma.strategy.findMany).toHaveBeenCalledWith({
      where,
      select: {
        id: true,
        config: true,
      },
    });
  });
});
