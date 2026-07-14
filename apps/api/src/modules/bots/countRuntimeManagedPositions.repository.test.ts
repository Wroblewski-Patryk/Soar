import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  prisma: {
    position: {
      count: vi.fn(),
    },
  },
}));

vi.mock('../../prisma/client', () => ({
  prisma: mocks.prisma,
}));

import { countRuntimeManagedPositions } from './runtimeSessionPositionsRead.repository';

describe('countRuntimeManagedPositions.repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('forwards the scoped where clause into prisma position count and returns the count', async () => {
    const where = {
      managementMode: 'BOT_MANAGED',
      status: 'OPEN',
      OR: [{ botId: 'bot-1' }, { botId: null, walletId: 'wallet-1' }],
    } as const;

    mocks.prisma.position.count.mockResolvedValue(3);

    await expect(countRuntimeManagedPositions(where as never)).resolves.toBe(3);
    expect(mocks.prisma.position.count).toHaveBeenCalledWith({ where });
  });
});
