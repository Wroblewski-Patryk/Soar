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

import { sumRuntimeManagedPositionQuantity } from './runtimeSessionPositionsRead.repository';

describe('sumRuntimeManagedPositionQuantity.repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('forwards the scoped where clause into prisma position aggregate and returns the quantity sum payload', async () => {
    const where = {
      managementMode: 'BOT_MANAGED',
      status: 'OPEN',
      OR: [{ botId: 'bot-1' }, { botId: null, walletId: 'wallet-1' }],
    } as const;
    const aggregate = {
      _sum: {
        quantity: '2.75',
      },
    };

    mocks.prisma.position.aggregate.mockResolvedValue(aggregate);

    await expect(sumRuntimeManagedPositionQuantity(where as never)).resolves.toEqual(aggregate);
    expect(mocks.prisma.position.aggregate).toHaveBeenCalledWith({
      where,
      _sum: {
        quantity: true,
      },
    });
  });
});
