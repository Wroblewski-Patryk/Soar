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

describe('resolveExternalPositionOwnerBySymbol', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.resolveEffectiveSymbolGroupSymbols.mockImplementation(
      ({ symbols }: { symbols?: string[] | null }) => symbols ?? []
    );
  });

  it('marks canonical overlapping symbol ownership as ambiguous', async () => {
    mocks.prisma.bot.findMany.mockResolvedValue([
      {
        id: 'bot-a',
        walletId: 'wallet-a',
        botMarketGroups: [
          {
            symbolGroup: {
              symbols: ['BTCUSDT'],
              marketUniverse: null,
            },
          },
        ],
        botStrategies: [],
        marketGroupStrategyLinks: [],
      },
      {
        id: 'bot-b',
        walletId: 'wallet-b',
        botMarketGroups: [
          {
            symbolGroup: {
              symbols: ['BTCUSDT'],
              marketUniverse: null,
            },
          },
        ],
        botStrategies: [],
        marketGroupStrategyLinks: [],
      },
    ]);

    const result = await resolveExternalPositionOwnerBySymbol('user-1', 'LIVE');

    expect(result.get('BTCUSDT')).toEqual({
      status: 'AMBIGUOUS',
      botId: null,
      walletId: null,
    });
  });

  it('prefers canonical ownership over legacy-only candidates', async () => {
    mocks.prisma.bot.findMany.mockResolvedValue([
      {
        id: 'bot-canonical',
        walletId: 'wallet-canonical',
        botMarketGroups: [
          {
            symbolGroup: {
              symbols: ['ETHUSDT'],
              marketUniverse: null,
            },
          },
        ],
        botStrategies: [],
        marketGroupStrategyLinks: [],
      },
      {
        id: 'bot-legacy',
        walletId: 'wallet-legacy',
        botMarketGroups: [],
        botStrategies: [
          {
            symbolGroup: {
              symbols: ['ETHUSDT'],
              marketUniverse: null,
            },
          },
        ],
        marketGroupStrategyLinks: [],
      },
    ]);

    const result = await resolveExternalPositionOwnerBySymbol('user-2', 'LIVE');

    expect(result.get('ETHUSDT')).toEqual({
      status: 'OWNED',
      botId: 'bot-canonical',
      walletId: 'wallet-canonical',
    });
  });

  it('falls back to legacy ownership only when canonical scope is absent', async () => {
    mocks.prisma.bot.findMany.mockResolvedValue([
      {
        id: 'bot-legacy-only',
        walletId: 'wallet-legacy-only',
        botMarketGroups: [],
        botStrategies: [
          {
            symbolGroup: {
              symbols: ['SOLUSDT'],
              marketUniverse: null,
            },
          },
        ],
        marketGroupStrategyLinks: [],
      },
    ]);

    const result = await resolveExternalPositionOwnerBySymbol('user-3', 'LIVE');

    expect(result.get('SOLUSDT')).toEqual({
      status: 'OWNED',
      botId: 'bot-legacy-only',
      walletId: 'wallet-legacy-only',
    });
  });
});
