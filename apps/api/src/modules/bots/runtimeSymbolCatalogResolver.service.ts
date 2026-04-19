import { Exchange } from '@prisma/client';
import {
  resolveMarketUniverseContractSymbolsFromCatalog,
  resolveMinQuoteVolumeFilter,
} from '../markets/marketCatalogSymbolResolver.service';
import {
  resolveEffectiveSymbolGroupSymbols,
} from './runtimeSymbolUniverse.service';

export const resolveEffectiveSymbolGroupSymbolsWithCatalog = async (
  params: {
    symbols?: string[] | null;
    marketUniverse?: {
      exchange?: Exchange | null;
      marketType?: 'FUTURES' | 'SPOT' | null;
      baseCurrency?: string | null;
      filterRules?: unknown;
      whitelist?: string[] | null;
      blacklist?: string[] | null;
    } | null;
  },
  cache: Map<string, string[]>
) => {
  const directSymbols = resolveEffectiveSymbolGroupSymbols(params);
  const universe = params.marketUniverse;
  if (universe?.exchange && universe.marketType && universe.baseCurrency) {
    const volumeFilter = resolveMinQuoteVolumeFilter(universe.filterRules);
    if (!volumeFilter.enabled) {
      return directSymbols;
    }

    return resolveMarketUniverseContractSymbolsFromCatalog(
      {
        exchange: universe.exchange,
        marketType: universe.marketType,
        baseCurrency: universe.baseCurrency,
        filterRules: universe.filterRules,
        whitelist: universe.whitelist ?? [],
        blacklist: universe.blacklist ?? [],
      },
      cache
    );
  }

  return directSymbols;
};
