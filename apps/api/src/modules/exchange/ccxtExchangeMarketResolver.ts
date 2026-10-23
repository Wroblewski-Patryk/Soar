import type { CcxtExchangeLikeClient } from './ccxtFuturesConnector.client';
import type { CcxtFuturesConnectorConfig } from './ccxtFuturesConnector.types';
import { gateFuturesEconomicsFromMarket, isMatchingGateFuturesEconomics,
  type GateFuturesEconomicsSnapshot } from './gateFuturesEconomics';

export type GateFillMarketProof = GateFuturesEconomicsSnapshot & { marketSymbol: string };

export const normalizeSymbolKey = (value: string) => value
  .trim()
  .toUpperCase()
  .replace(/[^A-Z0-9]/g, '');

export const normalizeGateContractSymbol = (symbol: string) =>
  normalizeSymbolKey(symbol.split(':', 1)[0]);

export const isConfiguredMarketType = (market: Record<string, unknown>, marketType: CcxtFuturesConnectorConfig['marketType']) => {
  const type = typeof market.type === 'string' ? market.type.toLowerCase() : null;
  if (marketType === 'spot') {
    return market.spot === true || type === 'spot';
  }
  if (marketType === 'swap') {
    return market.swap === true || type === 'swap';
  }
  return market.future === true || market.swap === true || type === 'future' || type === 'swap';
};

const getMarketSymbol = (marketKey: string, market: Record<string, unknown>) =>
  typeof market.symbol === 'string' && market.symbol.trim().length > 0
    ? market.symbol
    : marketKey;

const getMarketId = (marketKey: string, market: Record<string, unknown>) =>
  typeof market.id === 'string' && market.id.trim().length > 0 ? market.id : marketKey;

const marketMatchesSymbol = (marketKey: string, market: Record<string, unknown>, normalizedTarget: string) => {
  const marketSymbol = getMarketSymbol(marketKey, market);
  const marketId = getMarketId(marketKey, market);
  return (
    normalizeSymbolKey(marketKey) === normalizedTarget ||
    normalizeSymbolKey(marketSymbol) === normalizedTarget ||
    normalizeSymbolKey(marketId) === normalizedTarget
  );
};

const gateFillEconomics = (symbol: string, market: Record<string, unknown> | null,
  config: CcxtFuturesConnectorConfig) => {
  if (!['gateio', 'gate'].includes(config.exchangeId) || config.marketType === 'spot') return null;
  const snapshot = gateFuturesEconomicsFromMarket(market);
  const expectedSymbol = normalizeGateContractSymbol(symbol);
  const expectedMarketSymbol = snapshot
    ? `${snapshot.contract.slice(0, -5)}/USDT:USDT` : null;
  return snapshot && market?.id === snapshot.contract &&
    typeof market.symbol === 'string' &&
    market.symbol.toUpperCase() === expectedMarketSymbol &&
    isMatchingGateFuturesEconomics(snapshot, snapshot.contractSize, expectedSymbol)
    ? snapshot : null;
};

export const resolveCcxtExchangeMarket = async (
  client: CcxtExchangeLikeClient,
  config: CcxtFuturesConnectorConfig,
  symbol: string,
  includeGateFillProof = true,
): Promise<{ exchangeSymbol: string; gateFuturesEconomics: GateFillMarketProof | null }> => {
  const marketsRaw = await client.loadMarkets();
  const markets =
    marketsRaw && typeof marketsRaw === 'object'
      ? (marketsRaw as Record<string, Record<string, unknown>>)
      : {};
  const normalizedTarget = normalizeSymbolKey(symbol);
  const resolved = (exchangeSymbol: string, market: Record<string, unknown> | null) => {
    if (!includeGateFillProof || !['gateio', 'gate'].includes(config.exchangeId) ||
        config.marketType === 'spot') {
      return { exchangeSymbol, gateFuturesEconomics: null };
    }
    const anyClient = client as unknown as {
      market?: (id: string) => Record<string, unknown> | undefined;
      markets?: Record<string, Record<string, unknown>>;
    };
    let rulesMarket: Record<string, unknown> | null = null;
    try {
      rulesMarket = (typeof anyClient.market === 'function'
        ? anyClient.market(exchangeSymbol) : undefined) ??
        anyClient.markets?.[exchangeSymbol] ?? null;
    } catch { /* Missing rule metadata leaves the cost fallback closed. */ }
    const loadedProof = gateFillEconomics(symbol, market, config);
    const rulesProof = gateFillEconomics(symbol, rulesMarket, config);
    return { exchangeSymbol, gateFuturesEconomics: loadedProof && rulesProof &&
      loadedProof.contract === rulesProof.contract &&
      loadedProof.contractSize === rulesProof.contractSize
      ? { ...loadedProof, marketSymbol: exchangeSymbol } : null };
  };
  if (!normalizedTarget) return resolved(symbol, null);

  const directMarket = markets[symbol];
  if (
    directMarket &&
    isConfiguredMarketType(directMarket, config.marketType) &&
    typeof directMarket.symbol === 'string' &&
    directMarket.symbol.trim().length > 0
  ) {
    return resolved(directMarket.symbol, directMarket);
  }

  let fallbackSymbol: string | null = null;
  for (const [marketKey, market] of Object.entries(markets)) {
    if (!marketMatchesSymbol(marketKey, market, normalizedTarget)) continue;
    const marketSymbol = getMarketSymbol(marketKey, market);
    if (isConfiguredMarketType(market, config.marketType)) {
      return resolved(marketSymbol, market);
    }
    fallbackSymbol ??= marketSymbol;
  }

  return resolved(fallbackSymbol ?? symbol, null);
};
