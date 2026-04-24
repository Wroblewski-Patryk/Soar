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
        walletId: 'wallet-paper',
        mode: 'PAPER',
        liveOptIn: false,
        exchange: 'BINANCE',
        paperStartBalance: 1000,
        marketType: 'FUTURES',
        maxOpenPositions: 1,
        strategyId: null,
        symbolGroupId: null,
        strategy: null,
        symbolGroup: {
          id: 'group-paper',
          symbols: [],
          marketUniverse: {
            exchange: 'BINANCE',
            marketType: 'FUTURES',
            baseCurrency: 'USDT',
            filterRules: null,
            whitelist: [],
            blacklist: [],
          },
        },
        wallet: {
          id: 'wallet-paper',
          mode: 'PAPER',
          exchange: 'BINANCE',
          marketType: 'FUTURES',
          baseCurrency: 'USDT',
          paperInitialBalance: 1500,
        },
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
        maxOpenPositions: 1,
        strategyId: null,
        symbolGroupId: null,
        strategy: null,
        symbolGroup: {
          id: 'group-live-disabled',
          symbols: [],
          marketUniverse: {
            exchange: 'BINANCE',
            marketType: 'FUTURES',
            baseCurrency: 'USDT',
            filterRules: null,
            whitelist: [],
            blacklist: [],
          },
        },
        wallet: {
          id: 'wallet-1',
          mode: 'LIVE',
          exchange: 'BINANCE',
          marketType: 'FUTURES',
          baseCurrency: 'USDT',
          paperInitialBalance: 1000,
        },
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
        maxOpenPositions: 1,
        strategyId: null,
        symbolGroupId: null,
        strategy: null,
        symbolGroup: {
          id: 'group-live-enabled',
          symbols: [],
          marketUniverse: {
            exchange: 'BINANCE',
            marketType: 'FUTURES',
            baseCurrency: 'USDT',
            filterRules: null,
            whitelist: [],
            blacklist: [],
          },
        },
        wallet: {
          id: 'wallet-2',
          mode: 'LIVE',
          exchange: 'BINANCE',
          marketType: 'FUTURES',
          baseCurrency: 'USDT',
          paperInitialBalance: 1000,
        },
      },
    ] as any);

    const topology = await listActiveRuntimeBots();

    expect(topology.map((bot) => bot.id)).toEqual(['bot-paper', 'bot-live-enabled']);
  });

  it('fails closed when wallet and market-universe venue contexts drift apart', async () => {
    vi.mocked(listActiveRuntimeBotsRaw).mockResolvedValue([
      {
        id: 'bot-drift',
        userId: 'user-1',
        walletId: 'wallet-drift',
        mode: 'LIVE',
        liveOptIn: true,
        exchange: 'BINANCE',
        paperStartBalance: 1000,
        marketType: 'FUTURES',
        maxOpenPositions: 1,
        strategyId: null,
        symbolGroupId: null,
        strategy: null,
        symbolGroup: {
          id: 'group-drift',
          symbols: [],
          marketUniverse: {
            exchange: 'BINANCE',
            marketType: 'FUTURES',
            baseCurrency: 'USDT',
            filterRules: null,
            whitelist: [],
            blacklist: [],
          },
        },
        wallet: {
          id: 'wallet-drift',
          mode: 'LIVE',
          exchange: 'BINANCE',
          marketType: 'SPOT',
          baseCurrency: 'USDT',
          paperInitialBalance: 1000,
        },
      },
    ] as any);

    const topology = await listActiveRuntimeBots();

    expect(topology).toEqual([]);
  });
});
