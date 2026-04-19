import {
  normalizeSymbols,
  resolveMarketUniverseSymbols,
  resolveUniverseSymbols,
} from '../../lib/symbols';

export { normalizeSymbols, resolveUniverseSymbols };

export const resolveEffectiveSymbolGroupSymbols = (params: {
  symbols?: string[] | null;
  marketUniverse?: { whitelist?: string[] | null; blacklist?: string[] | null } | null;
}) => {
  const whitelist = params.marketUniverse?.whitelist;
  const blacklist = params.marketUniverse?.blacklist;
  if (Array.isArray(whitelist) && Array.isArray(blacklist)) {
    const resolvedFromUniverse = resolveMarketUniverseSymbols({
      filterResultSymbols: [],
      whitelist,
      blacklist,
    });
    if (resolvedFromUniverse.length > 0) {
      return resolvedFromUniverse;
    }
  }
  return normalizeSymbols(params.symbols ?? []);
};
