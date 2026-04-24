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
        symbolGroup: {
          symbols: ['BTCUSDT'],
          marketUniverse: null,
        },
      },
      {
        id: 'bot-b',
        walletId: 'wallet-b',
        symbolGroup: {
          symbols: ['BTCUSDT'],
          marketUniverse: null,
        },
      },
    ]);

    const result = await resolveExternalPositionOwnerBySymbol('user-1', 'LIVE');

    expect(result.get('BTCUSDT')).toEqual({
      status: 'AMBIGUOUS',
      botId: null,
      walletId: null,
    });
  });

  it('resolves ownership from direct symbol-group scope', async () => {
    mocks.prisma.bot.findMany.mockResolvedValue([
      {
        id: 'bot-direct',
        walletId: 'wallet-direct',
        symbolGroup: {
          symbols: ['ETHUSDT'],
          marketUniverse: null,
        },
      },
    ]);

    const result = await resolveExternalPositionOwnerBySymbol('user-2', 'LIVE');

    expect(result.get('ETHUSDT')).toEqual({
      status: 'OWNED',
      botId: 'bot-direct',
      walletId: 'wallet-direct',
    });
  });

  it('skips bots without a direct symbol-group scope', async () => {
    mocks.prisma.bot.findMany.mockResolvedValue([
      {
        id: 'bot-without-scope',
        walletId: 'wallet-without-scope',
        symbolGroup: null,
      },
    ]);

    const result = await resolveExternalPositionOwnerBySymbol('user-3', 'LIVE');

    expect(result.size).toBe(0);
  });
});
