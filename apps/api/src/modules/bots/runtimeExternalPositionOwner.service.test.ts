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
        walletId: 'wallet-a',
        apiKeyId: 'key-1',
        wallet: {
          manageExternalPositions: true,
        },
        symbolGroup: {
          symbols: ['BTCUSDT'],
          marketUniverse: null,
        },
      },
      {
        id: 'bot-b',
        walletId: 'wallet-b',
        apiKeyId: 'key-1',
        wallet: {
          manageExternalPositions: true,
        },
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
        walletId: 'wallet-btc',
        apiKeyId: 'key-shared',
        wallet: {
          manageExternalPositions: true,
        },
        symbolGroup: {
          symbols: ['BTCUSDT'],
          marketUniverse: null,
        },
      },
      {
        id: 'bot-eth',
        walletId: 'wallet-eth',
        apiKeyId: 'key-shared',
        wallet: {
          manageExternalPositions: true,
        },
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

  it('returns manual-only when linked live scope exists but wallet takeover is disabled', async () => {
    mocks.prisma.bot.findMany.mockResolvedValue([
      {
        id: 'bot-manual-only',
        walletId: 'wallet-manual-only',
        apiKeyId: 'key-2',
        wallet: {
          manageExternalPositions: false,
        },
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
        walletId: 'wallet-key-a',
        apiKeyId: 'key-a',
        wallet: {
          manageExternalPositions: true,
        },
        symbolGroup: {
          symbols: ['BTCUSDT'],
          marketUniverse: null,
        },
      },
      {
        id: 'bot-key-b',
        walletId: 'wallet-key-b',
        apiKeyId: 'key-b',
        wallet: {
          manageExternalPositions: true,
        },
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
        walletId: 'wallet-owned',
        apiKeyId: 'key-owned',
        wallet: {
          manageExternalPositions: true,
        },
        symbolGroup: {
          symbols: ['BTCUSDT', 'ETHUSDT'],
          marketUniverse: null,
        },
      },
      {
        id: 'bot-ambiguous',
        walletId: 'wallet-ambiguous',
        apiKeyId: 'key-owned',
        wallet: {
          manageExternalPositions: true,
        },
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
        walletId: 'wallet-a',
        apiKeyId: 'key-a',
        wallet: {
          manageExternalPositions: true,
        },
        symbolGroup: {
          symbols: ['BTCUSDT'],
          marketUniverse: null,
        },
      },
      {
        id: 'bot-b',
        walletId: 'wallet-b',
        apiKeyId: 'key-b',
        wallet: {
          manageExternalPositions: true,
        },
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
