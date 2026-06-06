import { describe, expect, it, vi } from 'vitest';
import { listRuntimeFallbackSymbolsFromEvents } from './botsRuntimeRead.repository';

const mocks = vi.hoisted(() => ({
  findMany: vi.fn(),
}));

vi.mock('../../prisma/client', () => ({
  prisma: {
    botRuntimeEvent: {
      findMany: mocks.findMany,
    },
  },
}));

describe('botsRuntimeRead.repository', () => {
  it('lists recent non-null fallback symbols from runtime events for the selected bot session', async () => {
    mocks.findMany.mockResolvedValueOnce([{ symbol: 'ETHUSDT' }, { symbol: 'BTCUSDT' }]);

    const rows = await listRuntimeFallbackSymbolsFromEvents({
      userId: 'user-1',
      botId: 'bot-1',
      sessionId: 'session-1',
      limit: 2,
    });

    expect(rows.map((row) => row.symbol)).toEqual(['ETHUSDT', 'BTCUSDT']);
    expect(mocks.findMany).toHaveBeenCalledWith({
      where: {
        userId: 'user-1',
        botId: 'bot-1',
        sessionId: 'session-1',
        symbol: { not: null },
      },
      select: { symbol: true },
      orderBy: [{ eventAt: 'desc' }, { createdAt: 'desc' }],
      take: 2,
    });
  });
});
