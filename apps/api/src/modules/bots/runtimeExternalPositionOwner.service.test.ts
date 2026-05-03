import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  prisma: {
    bot: {
      findMany: vi.fn(),
    },
  },
  resolveEffectiveSymbolGroupSymbols: vi.fn(),
}));

vi.mock('../../prisma/client', () => ({
  prisma: mocks.prisma,
}));

vi.mock('./runtimeSymbolUniverse.service', () => ({
  resolveEffectiveSymbolGroupSymbols: mocks.resolveEffectiveSymbolGroupSymbols,
}));

import { resolveExternalPositionOwnerBySymbol } from './runtimeExternalPositionOwner.service';
import {
  getExternalPositionOwnership,
  listOwnedExternalSymbolsForBot,
  resolveExternalPositionOwnershipIndex,
} from './runtimeExternalPositionOwner.service';

describe('resolveExternalPositionOwnershipIndex', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.resolveEffectiveSymbolGroupSymbols.mockImplementation(
      ({ symbols }: { symbols?: string[] | null }) => symbols ?? []
    );
  });

  it('marks canonical overlapping symbol ownership as ambiguous for the same api key and symbol', async () => {
    mocks.prisma.bot.findMany.mockResolvedValue([
      {
        id: 'bot-a',
        manageExternalPositions: true,
        walletId: 'wallet-a',
        apiKeyId: 'key-1',
        symbolGroup: {
          symbols: ['BTCUSDT'],
          marketUniverse: null,
        },
      },
      {
        id: 'bot-b',
        manageExternalPositions: true,
        walletId: 'wallet-b',
        apiKeyId: 'key-1',
        symbolGroup: {
          symbols: ['BTCUSDT'],
          marketUniverse: null,
        },
      },
    ]);

    const result = await resolveExternalPositionOwnershipIndex('user-1', 'LIVE');

    expect(
      getExternalPositionOwnership(result, {
        apiKeyId: 'key-1',
        symbol: 'BTCUSDT',
      })
    ).toEqual({
      status: 'AMBIGUOUS',
      botId: null,
      walletId: null,
    });
  });

  it('resolves exact ownership from api key + symbol scope', async () => {
    mocks.prisma.bot.findMany.mockResolvedValue([
      {
        id: 'bot-btc',
        manageExternalPositions: true,
        walletId: 'wallet-btc',
        apiKeyId: 'key-shared',
        symbolGroup: {
          symbols: ['BTCUSDT'],
          marketUniverse: null,
        },
      },
      {
        id: 'bot-eth',
        manageExternalPositions: true,
        walletId: 'wallet-eth',
        apiKeyId: 'key-shared',
        symbolGroup: {
          symbols: ['ETHUSDT'],
          marketUniverse: null,
        },
      },
    ]);

    const result = await resolveExternalPositionOwnershipIndex('user-2', 'LIVE');

    expect(
      getExternalPositionOwnership(result, {
        apiKeyId: 'key-shared',
        symbol: 'BTCUSDT',
      })
    ).toEqual({
      status: 'OWNED',
      botId: 'bot-btc',
      walletId: 'wallet-btc',
    });
    expect(
      getExternalPositionOwnership(result, {
        apiKeyId: 'key-shared',
        symbol: 'ETHUSDT',
      })
    ).toEqual({
      status: 'OWNED',
      botId: 'bot-eth',
      walletId: 'wallet-eth',
    });
  });

  it('uses the wallet api key as canonical LIVE ownership proof when bot api key is legacy-null', async () => {
    mocks.prisma.bot.findMany.mockResolvedValue([
      {
        id: 'bot-wallet-key',
        manageExternalPositions: true,
        walletId: 'wallet-wallet-key',
        apiKeyId: null,
        wallet: {
          apiKeyId: 'wallet-key-1',
        },
        symbolGroup: {
          symbols: ['BTCUSDT'],
          marketUniverse: null,
        },
        botMarketGroups: [],
      },
    ]);

    const result = await resolveExternalPositionOwnershipIndex('user-wallet-key', 'LIVE');

    expect(
      getExternalPositionOwnership(result, {
        apiKeyId: 'wallet-key-1',
        symbol: 'BTCUSDT',
      })
    ).toEqual({
      status: 'OWNED',
      botId: 'bot-wallet-key',
      walletId: 'wallet-wallet-key',
    });
  });

  it('uses active canonical bot market groups before stale direct ownership scope', async () => {
    mocks.prisma.bot.findMany.mockResolvedValue([
      {
        id: 'bot-canonical-groups',
        manageExternalPositions: true,
        walletId: 'wallet-canonical-groups',
        apiKeyId: null,
        wallet: {
          apiKeyId: 'wallet-key-groups',
        },
        symbolGroup: {
          symbols: ['BTCUSDT'],
          marketUniverse: null,
        },
        botMarketGroups: [
          {
            symbolGroup: {
              symbols: ['ETHUSDT'],
              marketUniverse: null,
            },
          },
        ],
      },
    ]);

    const result = await resolveExternalPositionOwnershipIndex('user-canonical-groups', 'LIVE');

    expect(
      getExternalPositionOwnership(result, {
        apiKeyId: 'wallet-key-groups',
        symbol: 'BTCUSDT',
      })
    ).toEqual({
      status: 'UNOWNED',
      botId: null,
      walletId: null,
    });
    expect(
      getExternalPositionOwnership(result, {
        apiKeyId: 'wallet-key-groups',
        symbol: 'ETHUSDT',
      })
    ).toEqual({
      status: 'OWNED',
      botId: 'bot-canonical-groups',
      walletId: 'wallet-canonical-groups',
    });
  });

  it('returns manual-only when linked live scope exists but wallet takeover is disabled', async () => {
    mocks.prisma.bot.findMany.mockResolvedValue([
      {
        id: 'bot-manual-only',
        manageExternalPositions: false,
        walletId: 'wallet-manual-only',
        apiKeyId: 'key-2',
        symbolGroup: {
          symbols: ['SOLUSDT'],
          marketUniverse: null,
        },
      },
    ]);

    const result = await resolveExternalPositionOwnershipIndex('user-3', 'LIVE');

    expect(
      getExternalPositionOwnership(result, {
        apiKeyId: 'key-2',
        symbol: 'SOLUSDT',
      })
    ).toEqual({
      status: 'MANUAL_ONLY',
      botId: null,
      walletId: null,
    });
  });

  it('keeps ownership isolated across different api keys for the same symbol', async () => {
    mocks.prisma.bot.findMany.mockResolvedValue([
      {
        id: 'bot-key-a',
        manageExternalPositions: true,
        walletId: 'wallet-key-a',
        apiKeyId: 'key-a',
        symbolGroup: {
          symbols: ['BTCUSDT'],
          marketUniverse: null,
        },
      },
      {
        id: 'bot-key-b',
        manageExternalPositions: true,
        walletId: 'wallet-key-b',
        apiKeyId: 'key-b',
        symbolGroup: {
          symbols: ['BTCUSDT'],
          marketUniverse: null,
        },
      },
    ]);

    const result = await resolveExternalPositionOwnershipIndex('user-4', 'LIVE');

    expect(
      getExternalPositionOwnership(result, {
        apiKeyId: 'key-a',
        symbol: 'BTCUSDT',
      })
    ).toEqual({
      status: 'OWNED',
      botId: 'bot-key-a',
      walletId: 'wallet-key-a',
    });
    expect(
      getExternalPositionOwnership(result, {
        apiKeyId: 'key-b',
        symbol: 'BTCUSDT',
      })
    ).toEqual({
      status: 'OWNED',
      botId: 'bot-key-b',
      walletId: 'wallet-key-b',
    });
  });

  it('lists exact owned symbols for a bot within one api key scope', async () => {
    mocks.prisma.bot.findMany.mockResolvedValue([
      {
        id: 'bot-owned',
        manageExternalPositions: true,
        walletId: 'wallet-owned',
        apiKeyId: 'key-owned',
        symbolGroup: {
          symbols: ['BTCUSDT', 'ETHUSDT'],
          marketUniverse: null,
        },
      },
      {
        id: 'bot-ambiguous',
        manageExternalPositions: true,
        walletId: 'wallet-ambiguous',
        apiKeyId: 'key-owned',
        symbolGroup: {
          symbols: ['ETHUSDT'],
          marketUniverse: null,
        },
      },
    ]);

    const result = await resolveExternalPositionOwnershipIndex('user-5', 'LIVE');

    expect(
      listOwnedExternalSymbolsForBot(result, {
        apiKeyId: 'key-owned',
        botId: 'bot-owned',
        walletId: 'wallet-owned',
      })
    ).toEqual(['BTCUSDT']);
  });
});

describe('resolveExternalPositionOwnerBySymbol', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.resolveEffectiveSymbolGroupSymbols.mockImplementation(
      ({ symbols }: { symbols?: string[] | null }) => symbols ?? []
    );
  });

  it('collapses multi-api ownership for the same symbol to ambiguous on the legacy symbol-only view', async () => {
    mocks.prisma.bot.findMany.mockResolvedValue([
      {
        id: 'bot-a',
        manageExternalPositions: true,
        walletId: 'wallet-a',
        apiKeyId: 'key-a',
        symbolGroup: {
          symbols: ['BTCUSDT'],
          marketUniverse: null,
        },
      },
      {
        id: 'bot-b',
        manageExternalPositions: true,
        walletId: 'wallet-b',
        apiKeyId: 'key-b',
        symbolGroup: {
          symbols: ['BTCUSDT'],
          marketUniverse: null,
        },
      },
    ]);

    const result = await resolveExternalPositionOwnerBySymbol('user-legacy', 'LIVE');

    expect(result.get('BTCUSDT')).toEqual({
      status: 'AMBIGUOUS',
      botId: null,
      walletId: null,
    });
  });
});
