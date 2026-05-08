import { Exchange } from '@prisma/client';

import { normalizeSymbol } from '../../lib/symbols';
import { assertExchangeCapability } from './exchangeCapabilities';
import { loadExchangePublicMarketMap } from './exchangePublicRead.service';

type TradeMarket = 'FUTURES' | 'SPOT';

export type PublicMarketEntry = {
  symbol: string;
  displaySymbol: string;
  baseAsset: string;
  quoteAsset: string;
  quoteVolume24h: number;
  lastPrice: number | null;
};

type MarketLike = {
  id?: string;
  symbol?: string;
  base?: string;
  quote?: string;
  active?: boolean;
};

type ExchangeTickerPayload = {
  symbol?: string;
  quoteVolume?: string;
  lastPrice?: string;
};

type ExchangeMarketCatalogDeps = {
  loadMarketMap: typeof loadExchangePublicMarketMap;
  fetchJson: (input: string) => Promise<unknown>;
};

const CATALOG_CACHE_TTL_MS = 5 * 60 * 1000;

const TEST_MARKETS: Record<TradeMarket, PublicMarketEntry[]> = {
  SPOT: [
    { symbol: 'BTCUSDT', displaySymbol: 'BTC/USDT', baseAsset: 'BTC', quoteAsset: 'USDT', quoteVolume24h: 3500000000, lastPrice: 68000 },
    { symbol: 'ETHUSDT', displaySymbol: 'ETH/USDT', baseAsset: 'ETH', quoteAsset: 'USDT', quoteVolume24h: 2100000000, lastPrice: 3600 },
    { symbol: 'SOLUSDT', displaySymbol: 'SOL/USDT', baseAsset: 'SOL', quoteAsset: 'USDT', quoteVolume24h: 900000000, lastPrice: 150 },
    { symbol: 'BTCEUR', displaySymbol: 'BTC/EUR', baseAsset: 'BTC', quoteAsset: 'EUR', quoteVolume24h: 100000000, lastPrice: 62000 },
  ],
  FUTURES: [
    { symbol: 'BTCUSDT', displaySymbol: 'BTC/USDT', baseAsset: 'BTC', quoteAsset: 'USDT', quoteVolume24h: 4500000000, lastPrice: 68050 },
    { symbol: 'ETHUSDT', displaySymbol: 'ETH/USDT', baseAsset: 'ETH', quoteAsset: 'USDT', quoteVolume24h: 2600000000, lastPrice: 3610 },
    { symbol: 'SOLUSDT', displaySymbol: 'SOL/USDT', baseAsset: 'SOL', quoteAsset: 'USDT', quoteVolume24h: 1300000000, lastPrice: 151 },
    { symbol: 'XRPUSDT', displaySymbol: 'XRP/USDT', baseAsset: 'XRP', quoteAsset: 'USDT', quoteVolume24h: 760000000, lastPrice: 0.65 },
  ],
};

let catalogCache: Record<string, { fetchedAt: number; entries: PublicMarketEntry[] } | null> = {};

const normalizeAsset = (value: string | undefined) => normalizeSymbol(value);

const toPublicMarketEntry = (market: MarketLike): PublicMarketEntry | null => {
  const id = normalizeAsset(market.id);
  const baseAsset = normalizeAsset(market.base);
  const quoteAsset = normalizeAsset(market.quote);
  if (!id || !baseAsset || !quoteAsset) return null;

  return {
    symbol: id,
    displaySymbol: market.symbol?.trim() || `${baseAsset}/${quoteAsset}`,
    baseAsset,
    quoteAsset,
    quoteVolume24h: 0,
    lastPrice: null,
  };
};

const buildCatalogCacheKey = (exchange: Exchange, marketType: TradeMarket) =>
  `${exchange}:${marketType}`;

const buildTickerEndpoint = (exchange: Exchange, marketType: TradeMarket) => {
  if (exchange !== 'BINANCE') return null;
  return marketType === 'FUTURES'
    ? 'https://fapi.binance.com/fapi/v1/ticker/24hr'
    : 'https://api.binance.com/api/v3/ticker/24hr';
};

const resolveCatalogSource = (exchange: Exchange) => `${exchange}_PUBLIC`;

const defaultDeps: ExchangeMarketCatalogDeps = {
  loadMarketMap: loadExchangePublicMarketMap,
  fetchJson: async (input) => {
    const response = await fetch(input);
    if (!response.ok) throw new Error(`Market catalog ticker fetch failed: ${response.status}`);
    return response.json();
  },
};

const fetchTickerMap = async (
  params: { exchange: Exchange; marketType: TradeMarket },
  deps: ExchangeMarketCatalogDeps
): Promise<Map<string, { quoteVolume24h: number; lastPrice: number | null }>> => {
  const endpoint = buildTickerEndpoint(params.exchange, params.marketType);
  if (!endpoint) return new Map();

  try {
    const payload = (await deps.fetchJson(endpoint)) as ExchangeTickerPayload[];
    if (!Array.isArray(payload)) return new Map();

    const map = new Map<string, { quoteVolume24h: number; lastPrice: number | null }>();
    for (const item of payload) {
      const symbol = normalizeAsset(item.symbol);
      if (!symbol) continue;
      const quoteVolume24h = Number.parseFloat(item.quoteVolume ?? '0');
      const lastPriceRaw = Number.parseFloat(item.lastPrice ?? '');
      map.set(symbol, {
        quoteVolume24h: Number.isFinite(quoteVolume24h) ? quoteVolume24h : 0,
        lastPrice: Number.isFinite(lastPriceRaw) ? lastPriceRaw : null,
      });
    }

    return map;
  } catch {
    return new Map();
  }
};

export const listSupportedExchangePublicMarkets = async (
  params: {
    exchange: Exchange;
    marketType: TradeMarket;
  },
  deps: ExchangeMarketCatalogDeps = defaultDeps
): Promise<PublicMarketEntry[]> => {
  assertExchangeCapability(params.exchange, 'MARKET_CATALOG');

  if (process.env.NODE_ENV === 'test') {
    return TEST_MARKETS[params.marketType];
  }

  const cacheKey = buildCatalogCacheKey(params.exchange, params.marketType);
  const now = Date.now();
  const currentCache = catalogCache[cacheKey];
  if (currentCache && now - currentCache.fetchedAt < CATALOG_CACHE_TTL_MS) {
    return currentCache.entries;
  }

  try {
    const [marketsMap, tickerMap] = await Promise.all([
      deps.loadMarketMap(params),
      fetchTickerMap(params, deps),
    ]);

    const map = new Map<string, PublicMarketEntry>();
    for (const market of Object.values(marketsMap as Record<string, MarketLike>)) {
      if (market.active === false) continue;
      const baseEntry = toPublicMarketEntry(market);
      if (!baseEntry) continue;
      const ticker = tickerMap.get(baseEntry.symbol);
      map.set(baseEntry.symbol, {
        ...baseEntry,
        quoteVolume24h: ticker?.quoteVolume24h ?? 0,
        lastPrice: ticker?.lastPrice ?? null,
      });
    }

    const entries = [...map.values()].sort((a, b) => a.symbol.localeCompare(b.symbol));
    catalogCache[cacheKey] = { fetchedAt: now, entries };
    return entries;
  } catch (error) {
    if (currentCache?.entries.length) return currentCache.entries;
    if (params.exchange === 'BINANCE') return TEST_MARKETS[params.marketType];
    throw error;
  }
};

export const getSupportedExchangeMarketCatalog = async (
  requestedBaseCurrency: string | undefined,
  marketType: TradeMarket = 'FUTURES',
  exchange: Exchange = 'BINANCE',
  deps: ExchangeMarketCatalogDeps = defaultDeps
) => {
  const entries = await listSupportedExchangePublicMarkets(
    {
      exchange,
      marketType,
    },
    deps
  );
  const baseCurrencies = [...new Set(entries.map((entry) => entry.quoteAsset))].sort((a, b) =>
    a.localeCompare(b)
  );

  const normalizedRequested = normalizeAsset(requestedBaseCurrency);
  const resolvedBaseCurrency = baseCurrencies.includes(normalizedRequested)
    ? normalizedRequested
    : (baseCurrencies.includes('USDT') ? 'USDT' : baseCurrencies[0] ?? 'USDT');

  const markets = entries
    .filter((entry) => entry.quoteAsset === resolvedBaseCurrency)
    .sort((a, b) => a.symbol.localeCompare(b.symbol));

  return {
    source: resolveCatalogSource(exchange),
    exchange,
    marketType,
    baseCurrency: resolvedBaseCurrency,
    baseCurrencies,
    totalAvailable: entries.length,
    totalForBaseCurrency: markets.length,
    markets,
  };
};

export const resetExchangeMarketCatalogCacheForTests = () => {
  catalogCache = {};
};
