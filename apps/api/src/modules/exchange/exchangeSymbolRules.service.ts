import { Exchange } from '@prisma/client';
import { supportsExchangeCapability } from './exchangeCapabilities';
import { loadExchangePublicMarketMap } from './exchangePublicRead.service';

type TradeMarket = 'FUTURES' | 'SPOT';

type CcxtMarketFilter = Record<string, unknown>;
type CcxtMarketLimits = {
  amount?: {
    min?: number;
  };
  cost?: {
    min?: number;
  };
};
type CcxtMarketPrecision = {
  amount?: number;
};
type CcxtMarket = {
  id?: string;
  symbol?: string;
  active?: boolean;
  quote?: string;
  settle?: string;
  contract?: boolean;
  linear?: boolean;
  inverse?: boolean;
  contractSize?: number;
  limits?: CcxtMarketLimits;
  precision?: CcxtMarketPrecision;
  info?: {
    filters?: CcxtMarketFilter[];
  };
};
type CcxtMarketMap = Record<string, CcxtMarket>;

type LoadMarketMapFn = (input: {
  exchange: Exchange;
  marketType: TradeMarket;
}) => Promise<CcxtMarketMap>;

type ExchangeSymbolRulesDeps = {
  nowMs: () => number;
  loadMarketMap: LoadMarketMapFn;
};

export type ExchangeSymbolRules = {
  minQuantity: number | null;
  minNotional: number | null;
  quantityStep: number | null;
  priceStep?: number | null;
  contractSize: number | null;
  quoteCurrency?: string | null;
  settleCurrency?: string | null;
  isContract?: boolean | null;
  isLinear?: boolean | null;
  isInverse?: boolean | null;
};

const parsedCacheTtlMs = Number.parseInt(
  process.env.EXCHANGE_SYMBOL_RULES_CACHE_TTL_MS ?? '600000',
  10
);
const EXCHANGE_SYMBOL_RULES_CACHE_TTL_MS = Math.max(
  60_000,
  Number.isFinite(parsedCacheTtlMs) && parsedCacheTtlMs > 0 ? parsedCacheTtlMs : 600_000
);

const rulesCache = new Map<
  string,
  {
    fetchedAt: number;
    rulesBySymbol: Map<string, ExchangeSymbolRules | null>;
  }
>();
const inflightLoads = new Map<string, Promise<Map<string, ExchangeSymbolRules | null>>>();

const normalizeSymbol = (value?: string | null) => (value ?? '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
const normalizeCurrency = (value: unknown): string | null =>
  typeof value === 'string' && /^[A-Z0-9]{2,15}$/.test(value.trim().toUpperCase())
    ? value.trim().toUpperCase() : null;

const resolveSymbolKey = (market: CcxtMarket) => {
  const id = normalizeSymbol(market.id);
  if (id) return id;
  const ccxtPair = typeof market.symbol === 'string' ? market.symbol.split(':')[0] : '';
  return normalizeSymbol(ccxtPair);
};

const asPositiveNumber = (value: unknown): number | null => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
};

const pickMaxPositive = (values: Array<number | null>) => {
  const positives = values.filter((value): value is number => typeof value === 'number' && value > 0);
  if (positives.length === 0) return null;
  return Math.max(...positives);
};

const parseFilterRules = (filters: unknown) => {
  if (!Array.isArray(filters)) {
    return {
      minQuantity: null as number | null,
      minNotional: null as number | null,
      quantityStep: null as number | null,
      priceStep: null as number | null,
      contractSize: null as number | null,
    };
  }

  const minQtyCandidates: Array<number | null> = [];
  const minNotionalCandidates: Array<number | null> = [];
  const quantityStepCandidates: Array<number | null> = [];
  const priceStepCandidates: Array<number | null> = [];

  for (const rawFilter of filters) {
    if (!rawFilter || typeof rawFilter !== 'object') continue;
    const filter = rawFilter as Record<string, unknown>;
    const filterType = String(filter.filterType ?? '').toUpperCase();

    if (filterType === 'LOT_SIZE' || filterType === 'MARKET_LOT_SIZE') {
      minQtyCandidates.push(asPositiveNumber(filter.minQty));
      quantityStepCandidates.push(asPositiveNumber(filter.stepSize));
    }

    if (filterType === 'PRICE_FILTER') {
      priceStepCandidates.push(asPositiveNumber(filter.tickSize));
    }

    if (filterType === 'MIN_NOTIONAL' || filterType === 'NOTIONAL') {
      minNotionalCandidates.push(asPositiveNumber(filter.minNotional));
      minNotionalCandidates.push(asPositiveNumber(filter.notional));
    }
  }

  return {
    minQuantity: pickMaxPositive(minQtyCandidates),
    minNotional: pickMaxPositive(minNotionalCandidates),
    quantityStep: pickMaxPositive(quantityStepCandidates),
    priceStep: pickMaxPositive(priceStepCandidates),
  };
};

const toSymbolRules = (market: CcxtMarket): ExchangeSymbolRules => {
  const filterRules = parseFilterRules(market.info?.filters);
  const minQuantity = pickMaxPositive([
    asPositiveNumber(market.limits?.amount?.min),
    filterRules.minQuantity,
  ]);
  const minNotional = pickMaxPositive([
    asPositiveNumber(market.limits?.cost?.min),
    filterRules.minNotional,
  ]);
  const quantityStep = pickMaxPositive([filterRules.quantityStep]);

  return {
    minQuantity,
    minNotional,
    quantityStep,
    priceStep: filterRules.priceStep,
    contractSize: asPositiveNumber(market.contractSize),
    quoteCurrency: normalizeCurrency(market.quote),
    settleCurrency: normalizeCurrency(market.settle),
    isContract: typeof market.contract === 'boolean' ? market.contract : null,
    isLinear: typeof market.linear === 'boolean' ? market.linear : null,
    isInverse: typeof market.inverse === 'boolean' ? market.inverse : null,
  };
};

const defaultLoadMarketMap: LoadMarketMapFn = (input) =>
  loadExchangePublicMarketMap(input) as Promise<CcxtMarketMap>;

const defaultDeps: ExchangeSymbolRulesDeps = {
  nowMs: () => Date.now(),
  loadMarketMap: defaultLoadMarketMap,
};

const resolveCacheKey = (input: { exchange: Exchange; marketType: TradeMarket }) =>
  `${input.exchange}|${input.marketType}`;

const loadRulesBySymbol = async (
  input: {
    exchange: Exchange;
    marketType: TradeMarket;
  },
  deps: ExchangeSymbolRulesDeps,
  requireCurrentMetadata = false,
) => {
  const cacheKey = resolveCacheKey(input);
  const inflightKey = `${cacheKey}|${requireCurrentMetadata ? 'current' : 'ordinary'}`;
  const now = deps.nowMs();
  const cached = rulesCache.get(cacheKey);
  if (cached && now - cached.fetchedAt < EXCHANGE_SYMBOL_RULES_CACHE_TTL_MS) {
    return cached.rulesBySymbol;
  }

  const inflight = inflightLoads.get(inflightKey);
  if (inflight) {
    return inflight;
  }

  const loadPromise = (async () => {
    try {
      const markets = await deps.loadMarketMap({
        exchange: input.exchange,
        marketType: input.marketType,
      });
      const rulesBySymbol = new Map<string, ExchangeSymbolRules | null>();
      for (const market of Object.values(markets)) {
        if (market.active === false) continue;
        const symbolKey = resolveSymbolKey(market);
        if (!symbolKey) continue;
        // Distinct raw markets can collapse to the same normalized ID. Never
        // select whichever one the exchange happened to list last.
        rulesBySymbol.set(symbolKey, rulesBySymbol.has(symbolKey) ? null : toSymbolRules(market));
      }
      rulesCache.set(cacheKey, {
        fetchedAt: deps.nowMs(),
        rulesBySymbol,
      });
      return rulesBySymbol;
    } catch {
      // Reservation callers cannot use an expired cache as currency proof.
      return requireCurrentMetadata ? new Map<string, ExchangeSymbolRules | null>()
        : (cached?.rulesBySymbol ?? new Map<string, ExchangeSymbolRules | null>());
    } finally {
      inflightLoads.delete(inflightKey);
    }
  })();

  inflightLoads.set(inflightKey, loadPromise);
  return loadPromise;
};

export const getExchangeSymbolRules = async (
  input: {
    exchange: Exchange;
    marketType: TradeMarket;
    symbol: string;
    requireCurrentMetadata?: boolean;
  },
  deps: ExchangeSymbolRulesDeps = defaultDeps
): Promise<ExchangeSymbolRules | null> => {
  if (!supportsExchangeCapability(input.exchange, 'MARKET_CATALOG')) {
    return null;
  }

  const normalizedSymbol = normalizeSymbol(input.symbol);
  if (!normalizedSymbol) return null;

  const rulesBySymbol = await loadRulesBySymbol(
    {
      exchange: input.exchange,
      marketType: input.marketType,
    },
    deps,
    input.requireCurrentMetadata === true,
  );

  return rulesBySymbol.get(normalizedSymbol) ?? null;
};

export const __resetExchangeSymbolRulesCacheForTests = () => {
  rulesCache.clear();
  inflightLoads.clear();
};
