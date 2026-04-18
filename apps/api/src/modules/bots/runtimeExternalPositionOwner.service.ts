import { prisma } from '../../prisma/client';
import {
  resolveEffectiveSymbolGroupSymbols,
} from './runtimeSymbolUniverse.service';

export type ExternalSymbolOwner = {
  botId: string;
  walletId: string | null;
};

export const resolveExternalPositionOwnerBySymbol = async (
  userId: string
): Promise<Map<string, ExternalSymbolOwner>> => {
  const bots = await prisma.bot.findMany({
    where: {
      userId,
      mode: 'LIVE',
      isActive: true,
      liveOptIn: true,
    },
    select: {
      id: true,
      walletId: true,
      isActive: true,
      createdAt: true,
      botMarketGroups: {
        where: {
          isEnabled: true,
          lifecycleStatus: { in: ['ACTIVE', 'PAUSED'] },
        },
        select: {
          executionOrder: true,
          symbolGroup: {
            select: {
              symbols: true,
              marketUniverse: {
                select: {
                  exchange: true,
                  marketType: true,
                  baseCurrency: true,
                  filterRules: true,
                  whitelist: true,
                  blacklist: true,
                },
              },
            },
          },
        },
      },
      botStrategies: {
        where: { isEnabled: true },
        select: {
          symbolGroup: {
            select: {
              symbols: true,
              marketUniverse: {
                select: {
                  exchange: true,
                  marketType: true,
                  baseCurrency: true,
                  filterRules: true,
                  whitelist: true,
                  blacklist: true,
                },
              },
            },
          },
        },
      },
      marketGroupStrategyLinks: {
        where: { isEnabled: true },
        select: {
          botMarketGroup: {
            select: {
              executionOrder: true,
              symbolGroup: {
                select: {
                  symbols: true,
                  marketUniverse: {
                    select: {
                      exchange: true,
                      marketType: true,
                      baseCurrency: true,
                      filterRules: true,
                      whitelist: true,
                      blacklist: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: [{ isActive: 'desc' }, { createdAt: 'asc' }],
  });

  const ownerBySymbol = new Map<
    string,
    {
      botId: string;
      walletId: string | null;
      isActive: boolean;
      executionOrder: number;
      createdAtMs: number;
    }
  >();

  for (const bot of bots) {
    const liveScopedSymbols = new Set<string>();

    for (const configuredGroup of bot.botMarketGroups) {
      for (const symbol of resolveEffectiveSymbolGroupSymbols({
        symbols: configuredGroup.symbolGroup.symbols,
        marketUniverse: configuredGroup.symbolGroup.marketUniverse,
      })) {
        liveScopedSymbols.add(symbol);
      }
    }

    for (const legacyStrategy of bot.botStrategies) {
      for (const symbol of resolveEffectiveSymbolGroupSymbols({
        symbols: legacyStrategy.symbolGroup.symbols,
        marketUniverse: legacyStrategy.symbolGroup.marketUniverse,
      })) {
        liveScopedSymbols.add(symbol);
      }
    }

    for (const configuredLink of bot.marketGroupStrategyLinks) {
      for (const symbol of resolveEffectiveSymbolGroupSymbols({
        symbols: configuredLink.botMarketGroup.symbolGroup.symbols,
        marketUniverse: configuredLink.botMarketGroup.symbolGroup.marketUniverse,
      })) {
        liveScopedSymbols.add(symbol);
      }
    }

    const executionOrder = Number.MIN_SAFE_INTEGER;
    const createdAtMs = bot.createdAt.getTime();
    for (const symbol of liveScopedSymbols) {
      const existing = ownerBySymbol.get(symbol);
      if (!existing) {
        ownerBySymbol.set(symbol, {
          botId: bot.id,
          walletId: bot.walletId,
          isActive: bot.isActive,
          executionOrder,
          createdAtMs,
        });
        continue;
      }

      const preferCandidate =
        (bot.isActive ? 1 : 0) > (existing.isActive ? 1 : 0) ||
        ((bot.isActive ? 1 : 0) === (existing.isActive ? 1 : 0) &&
          (executionOrder < existing.executionOrder ||
            (executionOrder === existing.executionOrder &&
              (createdAtMs < existing.createdAtMs ||
                (createdAtMs === existing.createdAtMs && bot.id.localeCompare(existing.botId) < 0)))));

      if (preferCandidate) {
        ownerBySymbol.set(symbol, {
          botId: bot.id,
          walletId: bot.walletId,
          isActive: bot.isActive,
          executionOrder,
          createdAtMs,
        });
      }
    }
  }

  if (ownerBySymbol.size > 0) {
    return new Map(
      [...ownerBySymbol.entries()].map(([symbol, owner]) => [
        symbol,
        { botId: owner.botId, walletId: owner.walletId },
      ])
    );
  }

  const fallbackBots = await prisma.bot.findMany({
    where: {
      userId,
      mode: 'LIVE',
      isActive: true,
      liveOptIn: true,
    },
    select: {
      id: true,
      walletId: true,
      isActive: true,
      createdAt: true,
      botMarketGroups: {
        where: {
          isEnabled: true,
          lifecycleStatus: { in: ['ACTIVE', 'PAUSED'] },
        },
        select: {
          executionOrder: true,
          symbolGroup: {
            select: {
              symbols: true,
              marketUniverse: {
                select: {
                  whitelist: true,
                  blacklist: true,
                },
              },
            },
          },
        },
      },
    },
  });

  for (const bot of fallbackBots) {
    for (const group of bot.botMarketGroups) {
      const symbols = resolveEffectiveSymbolGroupSymbols({
        symbols: group.symbolGroup.symbols,
        marketUniverse: group.symbolGroup.marketUniverse,
      });
      if (symbols.length === 0) continue;

      const executionOrder = Number.isFinite(group.executionOrder)
        ? group.executionOrder
        : Number.MAX_SAFE_INTEGER;
      const createdAtMs = bot.createdAt.getTime();
      for (const symbol of symbols) {
        const existing = ownerBySymbol.get(symbol);
        if (!existing) {
          ownerBySymbol.set(symbol, {
            botId: bot.id,
            walletId: bot.walletId,
            isActive: bot.isActive,
            executionOrder,
            createdAtMs,
          });
          continue;
        }

        const preferCandidate =
          (bot.isActive ? 1 : 0) > (existing.isActive ? 1 : 0) ||
          ((bot.isActive ? 1 : 0) === (existing.isActive ? 1 : 0) &&
            (executionOrder < existing.executionOrder ||
              (executionOrder === existing.executionOrder &&
                (createdAtMs < existing.createdAtMs ||
                  (createdAtMs === existing.createdAtMs && bot.id.localeCompare(existing.botId) < 0)))));

        if (preferCandidate) {
          ownerBySymbol.set(symbol, {
            botId: bot.id,
            walletId: bot.walletId,
            isActive: bot.isActive,
            executionOrder,
            createdAtMs,
          });
        }
      }
    }
  }

  return new Map(
    [...ownerBySymbol.entries()].map(([symbol, owner]) => [
      symbol,
      { botId: owner.botId, walletId: owner.walletId },
    ])
  );
};
