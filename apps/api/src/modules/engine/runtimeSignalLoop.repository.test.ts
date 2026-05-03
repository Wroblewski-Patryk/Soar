import { afterEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '../../prisma/client';
import {
  countOpenPositionsForBotAndSymbolsRaw,
  listRuntimeManagedExternalPositionsRaw,
} from './runtimeSignalLoop.repository';

describe('runtimeSignalLoop.repository active position predicates', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reads only synced managed external open positions for runtime hydration', async () => {
    const findMany = vi.spyOn(prisma.position, 'findMany').mockResolvedValue([]);

    await listRuntimeManagedExternalPositionsRaw();

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: 'OPEN',
          syncState: 'IN_SYNC',
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
        }),
      })
    );
  });

  it('counts only synced open positions for runtime bot-symbol caps', async () => {
    const count = vi.spyOn(prisma.position, 'count').mockResolvedValue(0);

    await countOpenPositionsForBotAndSymbolsRaw({
      userId: 'user-1',
      botId: 'bot-1',
      normalizedSymbols: ['BTCUSDT'],
    });

    expect(count).toHaveBeenCalledWith({
      where: {
        userId: 'user-1',
        botId: 'bot-1',
        status: 'OPEN',
        syncState: 'IN_SYNC',
        symbol: { in: ['BTCUSDT'] },
      },
    });
  });
});
