import { prisma } from '../prisma/client';
import { normalizeSymbol, normalizeSymbols } from '../lib/symbols';
import { resolveEffectiveSymbolGroupSymbolsWithCatalog } from '../modules/bots/runtimeSymbolCatalogResolver.service';

export type StreamSubscriptions = {
  symbols: string[];
  candleIntervals: string[];
};

const normalizeInterval = (value: string | null | undefined) => {
  if (!value) return null;
  return value.trim().toLowerCase();
};

export const resolveMarketStreamDynamicSubscriptions = async (params: {
  marketType: 'FUTURES' | 'SPOT';
  envSymbols: string[];
  envIntervals: string[];
}) => {
  const bots = await prisma.bot.findMany({
    where: {
      isActive: true,
      mode: { in: ['PAPER', 'LIVE'] },
      marketType: params.marketType,
      botMarketGroups: {
        some: {
          isEnabled: true,
          lifecycleStatus: { in: ['ACTIVE', 'PAUSED'] },
        },
      },
    },
    select: {
      botMarketGroups: {
        where: {
          isEnabled: true,
          lifecycleStatus: { in: ['ACTIVE', 'PAUSED'] },
        },
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
          strategyLinks: {
            where: {
              isEnabled: true,
            },
            select: {
              strategy: {
                select: {
                  interval: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const symbols = new Set<string>(normalizeSymbols(params.envSymbols));
  const intervals = new Set<string>(params.envIntervals);
  const catalogSymbolsCache = new Map<string, string[]>();

  for (const bot of bots) {
    for (const group of bot.botMarketGroups) {
      const groupSymbols = await resolveEffectiveSymbolGroupSymbolsWithCatalog(
        group.symbolGroup,
        catalogSymbolsCache
      );
      for (const symbol of groupSymbols) {
        if (typeof symbol !== 'string' || symbol.trim().length === 0) continue;
        symbols.add(normalizeSymbol(symbol));
      }

      for (const link of group.strategyLinks) {
        const interval = normalizeInterval(link.strategy.interval);
        if (!interval) continue;
        intervals.add(interval);
      }
    }
  }

  return {
    symbols: [...symbols].sort(),
    candleIntervals: [...intervals].sort(),
  } satisfies StreamSubscriptions;
};
