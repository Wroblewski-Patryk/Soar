import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  prisma: {
    position: {
      aggregate: vi.fn(),
    },
  },
}));

vi.mock('../../prisma/client', () => ({
  prisma: mocks.prisma,
}));

import { sumRuntimeManagedPositionRealizedPnl } from './runtimeSessionPositionsRead.repository';

describe('sumRuntimeManagedPositionRealizedPnl.repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('forwards the scoped where clause into prisma position aggregate and returns the realizedPnl sum payload', async () => {
    const where = {
      managementMode: 'BOT_MANAGED',
      status: 'CLOSED',
      OR: [{ botId: 'bot-1' }, { botId: null, walletId: 'wallet-1' }],
    } as const;
    const aggregate = {
      _sum: {
        realizedPnl: '48.25',
      },
    };

    mocks.prisma.position.aggregate.mockResolvedValue(aggregate);

    await expect(sumRuntimeManagedPositionRealizedPnl(where as never)).resolves.toEqual(aggregate);
    expect(mocks.prisma.position.aggregate).toHaveBeenCalledWith({
      where,
      _sum: {
        realizedPnl: true,
      },
    });
  });
});
