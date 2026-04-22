import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./runtimeSignalLoop.repository', () => ({
  listActiveRuntimeBotsRaw: vi.fn(),
  listRuntimeManagedExternalPositionsRaw: vi.fn(),
  countOpenPositionsForBotAndSymbolsRaw: vi.fn(),
  createRuntimeSignalRecord: vi.fn(),
}));

vi.mock('../bots/runtimeSymbolCatalogResolver.service', () => ({
  resolveEffectiveSymbolGroupSymbolsWithCatalog: vi.fn(async (group: { symbols: string[] }) => group.symbols),
}));

import { listActiveRuntimeBots } from './runtimeSignalLoopDefaults';
import { listActiveRuntimeBotsRaw } from './runtimeSignalLoop.repository';

describe('listActiveRuntimeBots', () => {
  beforeEach(() => {
    vi.mocked(listActiveRuntimeBotsRaw).mockReset();
  });

  it('excludes LIVE bots without liveOptIn from runtime topology', async () => {
    vi.mocked(listActiveRuntimeBotsRaw).mockResolvedValue([
      {
        id: 'bot-paper',
        userId: 'user-1',
        walletId: null,
        mode: 'PAPER',
        liveOptIn: false,
        exchange: 'BINANCE',
        paperStartBalance: 1000,
        marketType: 'FUTURES',
        botMarketGroups: [],
      },
      {
        id: 'bot-live-disabled',
        userId: 'user-1',
        walletId: 'wallet-1',
        mode: 'LIVE',
        liveOptIn: false,
        exchange: 'BINANCE',
        paperStartBalance: 1000,
        marketType: 'FUTURES',
        botMarketGroups: [],
      },
      {
        id: 'bot-live-enabled',
        userId: 'user-1',
        walletId: 'wallet-2',
        mode: 'LIVE',
        liveOptIn: true,
        exchange: 'BINANCE',
        paperStartBalance: 1000,
        marketType: 'FUTURES',
        botMarketGroups: [],
      },
    ] as any);

    const topology = await listActiveRuntimeBots();

    expect(topology.map((bot) => bot.id)).toEqual(['bot-paper', 'bot-live-enabled']);
  });
});
