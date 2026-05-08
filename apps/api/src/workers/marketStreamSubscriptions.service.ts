import { Exchange } from '@prisma/client';

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
  exchange?: Exchange;
  marketType: 'FUTURES' | 'SPOT';
  envSymbols: string[];
  envIntervals: string[];
}) => {
  const bots = await prisma.bot.findMany({
    where: {
      isActive: true,
      mode: { in: ['PAPER', 'LIVE'] },
      marketType: params.marketType,
      strategyId: { not: null },
      symbolGroupId: { not: null },
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
      strategy: {
        select: {
          interval: true,
        },
      },
    },
  });

  const symbols = new Set<string>(normalizeSymbols(params.envSymbols));
  const intervals = new Set<string>(params.envIntervals);
  const catalogSymbolsCache = new Map<string, string[]>();

  for (const bot of bots) {
    const universeExchange = bot.symbolGroup?.marketUniverse?.exchange ?? null;
    if (params.exchange && universeExchange && universeExchange !== params.exchange) {
      continue;
    }
    if (params.exchange && params.exchange !== 'BINANCE' && universeExchange !== params.exchange) {
      continue;
    }

    const directSymbols = bot.symbolGroup
      ? await resolveEffectiveSymbolGroupSymbolsWithCatalog(bot.symbolGroup, catalogSymbolsCache)
      : [];
    for (const symbol of directSymbols) {
      if (typeof symbol !== 'string' || symbol.trim().length === 0) continue;
      symbols.add(normalizeSymbol(symbol));
    }

    const directInterval = normalizeInterval(bot.strategy?.interval);
    if (directInterval) {
      intervals.add(directInterval);
    }
  }

  return {
    symbols: [...symbols].sort(),
    candleIntervals: [...intervals].sort(),
  } satisfies StreamSubscriptions;
};
