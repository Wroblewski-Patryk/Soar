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

vi.mock('../../prisma/client', () => ({
  prisma: {
    bot: {
      findUnique: vi.fn(),
    },
    position: {
      count: vi.fn(),
    },
  },
}));

vi.mock('../bots/runtimeExternalPositionOwner.service', () => ({
  resolveExternalPositionOwnershipIndex: vi.fn(),
  listOwnedExternalSymbolsForBot: vi.fn(),
  getExternalPositionOwnership: vi.fn(),
  parseApiKeyIdFromExternalPositionId: vi.fn((externalId: string | null) =>
    externalId ? externalId.split(':')[0] : null
  ),
}));

import { prisma } from '../../prisma/client';
import {
  getExternalPositionOwnership,
  listOwnedExternalSymbolsForBot,
  resolveExternalPositionOwnershipIndex,
} from '../bots/runtimeExternalPositionOwner.service';
import {
  countOpenPositionsForBotAndSymbols,
  listActiveRuntimeBots,
  listRuntimeManagedExternalPositions,
} from './runtimeSignalLoopDefaults';
import {
  countOpenPositionsForBotAndSymbolsRaw,
  listActiveRuntimeBotsRaw,
  listRuntimeManagedExternalPositionsRaw,
} from './runtimeSignalLoop.repository';

describe('listActiveRuntimeBots', () => {
  beforeEach(() => {
    vi.mocked(listActiveRuntimeBotsRaw).mockReset();
    vi.mocked(listRuntimeManagedExternalPositionsRaw).mockReset();
    vi.mocked(countOpenPositionsForBotAndSymbolsRaw).mockReset();
    vi.mocked(prisma.bot.findUnique).mockReset();
    vi.mocked(prisma.position.count).mockReset();
    vi.mocked(resolveExternalPositionOwnershipIndex).mockReset();
    vi.mocked(listOwnedExternalSymbolsForBot).mockReset();
    vi.mocked(getExternalPositionOwnership).mockReset();
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

  it('fails closed when runtime topology exposes multiple canonical venues', async () => {
    vi.mocked(listActiveRuntimeBotsRaw).mockResolvedValue([
      {
        id: 'bot-ambiguous-venues',
        userId: 'user-1',
        walletId: 'wallet-1',
        mode: 'LIVE',
        liveOptIn: true,
        exchange: 'BINANCE',
        paperStartBalance: 1000,
        marketType: 'FUTURES',
        maxOpenPositions: 1,
        strategyId: 'legacy-strategy',
        symbolGroupId: 'legacy-group',
        strategy: null,
        symbolGroup: {
          id: 'legacy-group',
          symbols: ['BTCUSDT'],
          marketUniverse: {
            exchange: 'BINANCE',
            marketType: 'FUTURES',
            baseCurrency: 'USDT',
            filterRules: null,
            whitelist: [],
            blacklist: [],
          },
        },
        botMarketGroups: [
          {
            id: 'canonical-futures',
            symbolGroupId: 'canonical-futures-group',
            maxOpenPositions: 1,
            symbolGroup: {
              id: 'canonical-futures-group',
              symbols: ['BTCUSDT'],
              marketUniverse: {
                exchange: 'BINANCE',
                marketType: 'FUTURES',
                baseCurrency: 'USDT',
                filterRules: null,
                whitelist: [],
                blacklist: [],
              },
            },
            strategyLinks: [
              {
                id: 'link-futures',
                strategyId: 'strategy-futures',
                priority: 1,
                weight: 1,
                strategy: {
                  id: 'strategy-futures',
                  interval: '1m',
                  config: { open: {} },
                  leverage: 3,
                  walletRisk: 1,
                },
              },
            ],
          },
          {
            id: 'canonical-spot',
            symbolGroupId: 'canonical-spot-group',
            maxOpenPositions: 1,
            symbolGroup: {
              id: 'canonical-spot-group',
              symbols: ['ETHUSDT'],
              marketUniverse: {
                exchange: 'BINANCE',
                marketType: 'SPOT',
                baseCurrency: 'USDT',
                filterRules: null,
                whitelist: [],
                blacklist: [],
              },
            },
            strategyLinks: [
              {
                id: 'link-spot',
                strategyId: 'strategy-spot',
                priority: 2,
                weight: 1,
                strategy: {
                  id: 'strategy-spot',
                  interval: '1m',
                  config: { open: {} },
                  leverage: 1,
                  walletRisk: 1,
                },
              },
            ],
          },
        ],
        wallet: {
          id: 'wallet-1',
          mode: 'LIVE',
          exchange: 'BINANCE',
          marketType: 'FUTURES',
          baseCurrency: 'USDT',
          paperInitialBalance: 1000,
        },
      },
    ] as any);

    const topology = await listActiveRuntimeBots();

    expect(topology).toEqual([]);
  });

  it('builds runtime context from canonical enabled strategy links', async () => {
    vi.mocked(listActiveRuntimeBotsRaw).mockResolvedValue([
      {
        id: 'bot-multi',
        userId: 'user-1',
        walletId: 'wallet-1',
        mode: 'PAPER',
        liveOptIn: false,
        exchange: 'BINANCE',
        paperStartBalance: 1000,
        marketType: 'FUTURES',
        maxOpenPositions: 9,
        strategyId: 'legacy-primary',
        symbolGroupId: 'legacy-group',
        strategy: null,
        symbolGroup: null,
        botMarketGroups: [
          {
            id: 'market-group-1',
            symbolGroupId: 'symbol-group-1',
            maxOpenPositions: 3,
            symbolGroup: {
              id: 'symbol-group-1',
              symbols: ['BTCUSDT'],
              marketUniverse: {
                exchange: 'BINANCE',
                marketType: 'FUTURES',
                baseCurrency: 'USDT',
                filterRules: null,
                whitelist: [],
                blacklist: [],
              },
            },
            strategyLinks: [
              {
                id: 'link-primary',
                strategyId: 'strategy-primary',
                priority: 5,
                weight: 2,
                strategy: {
                  id: 'strategy-primary',
                  interval: '1m',
                  config: { open: {} },
                  leverage: 3,
                  walletRisk: 2,
                },
              },
              {
                id: 'link-secondary',
                strategyId: 'strategy-secondary',
                priority: 20,
                weight: 0.5,
                strategy: {
                  id: 'strategy-secondary',
                  interval: '1m',
                  config: { open: {} },
                  leverage: 1,
                  walletRisk: 1,
                },
              },
            ],
          },
        ],
        wallet: {
          id: 'wallet-1',
          mode: 'PAPER',
          exchange: 'BINANCE',
          marketType: 'FUTURES',
          baseCurrency: 'USDT',
          paperInitialBalance: 1000,
        },
      },
    ] as any);

    const topology = await listActiveRuntimeBots();

    expect(topology).toHaveLength(1);
    expect(topology[0]!.runtimeContext).toMatchObject({
      symbolGroupId: 'symbol-group-1',
      strategyId: 'strategy-primary',
      maxOpenPositions: 3,
      symbols: ['BTCUSDT'],
    });
    expect(topology[0]!.runtimeContext?.strategies?.map((strategy) => ({
      strategyId: strategy.strategyId,
      priority: strategy.priority,
      weight: strategy.weight,
    }))).toEqual([
      { strategyId: 'strategy-primary', priority: 5, weight: 2 },
      { strategyId: 'strategy-secondary', priority: 20, weight: 0.5 },
    ]);
  });

  it('counts owned imported LIVE positions in bot scope even when canonical row botId is null', async () => {
    vi.mocked(countOpenPositionsForBotAndSymbolsRaw).mockResolvedValue(0);
    vi.mocked(prisma.bot.findUnique).mockResolvedValue({
      mode: 'LIVE',
      walletId: 'wallet-1',
      apiKeyId: 'key-1',
      wallet: {
        apiKeyId: null,
      },
    } as any);
    vi.mocked(resolveExternalPositionOwnershipIndex).mockResolvedValue(new Map() as any);
    vi.mocked(listOwnedExternalSymbolsForBot).mockReturnValue(['DOGEUSDT']);
    vi.mocked(prisma.position.count).mockResolvedValue(1);

    const count = await countOpenPositionsForBotAndSymbols({
      userId: 'user-1',
      botId: 'bot-1',
      symbols: ['DOGEUSDT'],
    });

    expect(count).toBe(1);
    expect(prisma.position.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: 'user-1',
          botId: null,
          origin: 'EXCHANGE_SYNC',
          managementMode: 'BOT_MANAGED',
          symbol: { in: ['DOGEUSDT'] },
          externalId: { startsWith: 'key-1:' },
        }),
      })
    );
  });

  it('hydrates runtime managed external positions with deterministic owner bot scope', async () => {
    vi.mocked(listRuntimeManagedExternalPositionsRaw).mockResolvedValue([
      {
        userId: 'user-1',
        botId: null,
        walletId: null,
        externalId: 'key-1:BTCUSDT:LONG',
        symbol: 'BTCUSDT',
      },
    ] as any);
    vi.mocked(resolveExternalPositionOwnershipIndex).mockResolvedValue(new Map() as any);
    vi.mocked(getExternalPositionOwnership).mockReturnValue({
      status: 'OWNED',
      botId: 'bot-1',
      walletId: 'wallet-1',
    });

    const positions = await listRuntimeManagedExternalPositions();

    expect(resolveExternalPositionOwnershipIndex).toHaveBeenCalledWith('user-1', 'LIVE');
    expect(getExternalPositionOwnership).toHaveBeenCalledWith(expect.any(Map), {
      apiKeyId: 'key-1',
      symbol: 'BTCUSDT',
    });
    expect(positions).toEqual([
      {
        userId: 'user-1',
        botId: 'bot-1',
        walletId: 'wallet-1',
        symbol: 'BTCUSDT',
      },
    ]);
  });

  it('keeps unresolved runtime managed external positions unowned for bot-scoped guards', async () => {
    vi.mocked(listRuntimeManagedExternalPositionsRaw).mockResolvedValue([
      {
        userId: 'user-1',
        botId: null,
        walletId: null,
        externalId: 'key-1:BTCUSDT:LONG',
        symbol: 'BTCUSDT',
      },
    ] as any);
    vi.mocked(resolveExternalPositionOwnershipIndex).mockResolvedValue(new Map() as any);
    vi.mocked(getExternalPositionOwnership).mockReturnValue({
      status: 'UNOWNED',
      botId: null,
      walletId: null,
    });

    const positions = await listRuntimeManagedExternalPositions();

    expect(positions).toEqual([
      {
        userId: 'user-1',
        botId: null,
        walletId: null,
        symbol: 'BTCUSDT',
      },
    ]);
  });

  it('uses the wallet api key when counting owned imported LIVE positions for wallet-first bots', async () => {
    vi.mocked(countOpenPositionsForBotAndSymbolsRaw).mockResolvedValue(0);
    vi.mocked(prisma.bot.findUnique).mockResolvedValue({
      mode: 'LIVE',
      walletId: 'wallet-1',
      apiKeyId: null,
      wallet: {
        apiKeyId: 'wallet-key-1',
      },
    } as any);
    vi.mocked(resolveExternalPositionOwnershipIndex).mockResolvedValue(new Map() as any);
    vi.mocked(listOwnedExternalSymbolsForBot).mockReturnValue(['ETHUSDT']);
    vi.mocked(prisma.position.count).mockResolvedValue(1);

    const count = await countOpenPositionsForBotAndSymbols({
      userId: 'user-1',
      botId: 'bot-1',
      symbols: ['ETHUSDT', 'DOGEUSDT'],
    });

    expect(count).toBe(1);
    expect(listOwnedExternalSymbolsForBot).toHaveBeenCalledWith(expect.any(Map), {
      apiKeyId: 'wallet-key-1',
      botId: 'bot-1',
      walletId: 'wallet-1',
    });
    expect(prisma.position.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          externalId: { startsWith: 'wallet-key-1:' },
          symbol: { in: ['ETHUSDT'] },
          OR: [{ walletId: 'wallet-1' }, { walletId: null }],
        }),
      })
    );
  });

  it('does not fall back to legacy strategy when canonical market group has no enabled links', async () => {
    vi.mocked(listActiveRuntimeBotsRaw).mockResolvedValue([
      {
        id: 'bot-empty-canonical-links',
        userId: 'user-1',
        walletId: 'wallet-1',
        mode: 'PAPER',
        liveOptIn: false,
        exchange: 'BINANCE',
        paperStartBalance: 1000,
        marketType: 'FUTURES',
        maxOpenPositions: 9,
        strategyId: 'legacy-primary',
        symbolGroupId: 'legacy-group',
        strategy: {
          id: 'legacy-primary',
          interval: '1m',
          config: { open: {} },
          leverage: 2,
          walletRisk: 1,
        },
        symbolGroup: {
          id: 'legacy-group',
          symbols: ['BTCUSDT'],
          marketUniverse: {
            exchange: 'BINANCE',
            marketType: 'FUTURES',
            baseCurrency: 'USDT',
            filterRules: null,
            whitelist: [],
            blacklist: [],
          },
        },
        botMarketGroups: [
          {
            id: 'market-group-1',
            symbolGroupId: 'symbol-group-1',
            maxOpenPositions: 3,
            symbolGroup: {
              id: 'symbol-group-1',
              symbols: ['ETHUSDT'],
              marketUniverse: {
                exchange: 'BINANCE',
                marketType: 'FUTURES',
                baseCurrency: 'USDT',
                filterRules: null,
                whitelist: [],
                blacklist: [],
              },
            },
            strategyLinks: [],
          },
        ],
        wallet: {
          id: 'wallet-1',
          mode: 'PAPER',
          exchange: 'BINANCE',
          marketType: 'FUTURES',
          baseCurrency: 'USDT',
          paperInitialBalance: 1000,
        },
      },
    ] as any);

    const topology = await listActiveRuntimeBots();

    expect(topology).toHaveLength(1);
    expect(topology[0].runtimeContext).toBeNull();
  });
});
