import { Exchange } from '@prisma/client';
import {
  normalizeBaseCurrency,
  normalizeSymbols,
  resolveMarketUniverseSymbols,
} from '../../lib/symbols';
import { getMarketCatalog } from './markets.service';

export const resolveMinQuoteVolumeFilter = (filterRules: unknown) => {
  const parsedRules =
    filterRules && typeof filterRules === 'object'
      ? (filterRules as {
          minQuoteVolumeEnabled?: unknown;
          minQuoteVolume24h?: unknown;
          minVolume24h?: unknown;
        })
      : null;
  const enabled = parsedRules?.minQuoteVolumeEnabled === true;
  const minRaw = Number(parsedRules?.minQuoteVolume24h ?? parsedRules?.minVolume24h ?? 0);
  const min = Number.isFinite(minRaw) && minRaw > 0 ? minRaw : 0;
  return { enabled, min };
};

export const resolveCatalogSymbolsForUniverse = async (
  universe: {
    exchange: Exchange;
    marketType: 'FUTURES' | 'SPOT';
    baseCurrency: string;
    filterRules: unknown;
    blacklist: string[];
  },
  cache: Map<string, string[]>
) => {
  const volumeFilter = resolveMinQuoteVolumeFilter(universe.filterRules);
  const blacklistSet = new Set(normalizeSymbols(universe.blacklist));
  const cacheKey = [
    universe.exchange,
    universe.marketType,
    normalizeBaseCurrency(universe.baseCurrency),
    volumeFilter.enabled ? '1' : '0',
    volumeFilter.min.toString(),
  ].join('|');
  const cached = cache.get(cacheKey);
  if (cached) return cached.filter((symbol) => !blacklistSet.has(symbol));

  try {
    const catalog = await getMarketCatalog(
      universe.baseCurrency,
      universe.marketType,
      universe.exchange
    );
    const filteredCatalogSymbols = normalizeSymbols(
      catalog.markets
        .filter((market) =>
          volumeFilter.enabled ? (market.quoteVolume24h ?? 0) >= volumeFilter.min : true
        )
        .map((market) => market.symbol)
    );
    cache.set(cacheKey, filteredCatalogSymbols);

    return filteredCatalogSymbols.filter((symbol) => !blacklistSet.has(symbol));
  } catch {
    cache.set(cacheKey, []);
    return [];
  }
};

export const resolveMarketUniverseContractSymbolsFromCatalog = async (
  universe: {
    exchange: Exchange;
    marketType: 'FUTURES' | 'SPOT';
    baseCurrency: string;
    filterRules: unknown;
    whitelist: string[];
    blacklist: string[];
  },
  cache: Map<string, string[]>
) => {
  const volumeFilter = resolveMinQuoteVolumeFilter(universe.filterRules);
  const filterResultSymbols = volumeFilter.enabled
    ? await resolveCatalogSymbolsForUniverse(
        {
          exchange: universe.exchange,
          marketType: universe.marketType,
          baseCurrency: universe.baseCurrency,
          filterRules: universe.filterRules,
          blacklist: [],
        },
        cache
      )
    : [];

  return resolveMarketUniverseSymbols({
    filterResultSymbols,
    whitelist: universe.whitelist,
    blacklist: universe.blacklist,
  });
};
