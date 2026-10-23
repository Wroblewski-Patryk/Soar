import type { CcxtFuturesOrderFill } from './ccxtFuturesConnector.types';

export type GateFuturesEconomicsSnapshot = {
  source: 'GATE_API_V4_CONTRACT_CCXT_MARKET';
  contract: string;
  contractType: 'direct';
  linear: true;
  inverse: false;
  quote: 'USDT';
  settle: 'USDT';
  quantoMultiplier: number;
  contractSize: number;
};

const positiveFinite = (value: unknown): number | null => {
  const parsed = typeof value === 'number' ? value :
    typeof value === 'string' && value.trim() ? Number(value) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export const gateFuturesEconomicsFromMarket = (
  market: Record<string, unknown> | null,
): GateFuturesEconomicsSnapshot | null => {
  const raw = market?.info && typeof market.info === 'object' && !Array.isArray(market.info)
    ? market.info as Record<string, unknown> : null;
  const rawMultiplier = positiveFinite(raw?.quanto_multiplier);
  const parsedMultiplier = positiveFinite(market?.contractSize);
  if (market?.contract !== true || market.linear !== true || market.inverse !== false ||
      market.quote !== 'USDT' || market.settle !== 'USDT' ||
      raw?.type !== 'direct' || typeof raw.name !== 'string' ||
      !/^[A-Z0-9]+_USDT$/.test(raw.name) ||
      (raw.settle_currency != null && raw.settle_currency !== 'USDT') ||
      rawMultiplier == null || parsedMultiplier == null || rawMultiplier !== parsedMultiplier) {
    return null;
  }
  return {
    source: 'GATE_API_V4_CONTRACT_CCXT_MARKET', contract: raw.name,
    contractType: 'direct', linear: true, inverse: false, quote: 'USDT', settle: 'USDT',
    quantoMultiplier: rawMultiplier, contractSize: parsedMultiplier,
  };
};

export const isMatchingGateFuturesEconomics = (value: unknown, contractSize: number, symbol?: string):
  value is GateFuturesEconomicsSnapshot => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const snapshot = value as Record<string, unknown>;
  return snapshot.source === 'GATE_API_V4_CONTRACT_CCXT_MARKET' &&
    typeof snapshot.contract === 'string' && /^[A-Z0-9]+_USDT$/.test(snapshot.contract) &&
    (symbol == null || snapshot.contract.replace(/[^A-Z0-9]/g, '') ===
      symbol.toUpperCase().replace(/[^A-Z0-9]/g, '')) &&
    snapshot.contractType === 'direct' && snapshot.linear === true && snapshot.inverse === false &&
    snapshot.quote === 'USDT' && snapshot.settle === 'USDT' &&
    positiveFinite(snapshot.quantoMultiplier) === contractSize &&
    positiveFinite(snapshot.contractSize) === contractSize;
};

const finiteNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

export const resolveCcxtFillCostEvidence = (input: {
  ccxtCost: unknown; quoteQty: unknown; price: number; quantity: number;
  gateDerivative: boolean; gateContractSize?: number | null; rawFeeCurrency: unknown;
  feeCost: number | null; feeCurrency: string | null;
}) => {
  const reportedCost = finiteNumber(input.ccxtCost);
  const quoteQtyField = finiteNumber(input.quoteQty);
  const hasCcxtCost = reportedCost != null && reportedCost > 0;
  const hasQuoteQtyField = quoteQtyField != null && quoteQtyField > 0;
  const gateUnitFallback = input.gateDerivative &&
    positiveFinite(input.gateContractSize) != null &&
    Number.isFinite(input.price) && input.price > 0 &&
    Number.isFinite(input.quantity) && input.quantity > 0;
  // Gate amount is contracts. Only a verified raw/CCXT unit converts it to
  // quote value; otherwise the adapter refuses the fill before persistence.
  const notional = hasCcxtCost ? reportedCost : hasQuoteQtyField ? quoteQtyField :
    gateUnitFallback ? input.price * input.quantity * input.gateContractSize! :
    input.gateDerivative ? 0 :
      input.price > 0 && input.quantity > 0 ? input.price * input.quantity : 0;
  // Gate CCXT 4.5.89 derives trade.cost through safeTrade; raw trade_value's
  // currency is unspecified in Gate API v4, so this is never quote-cost proof.
  const notionalSource = hasCcxtCost
    ? input.gateDerivative ? 'CCXT_DERIVED_UNVERIFIED' as const
      : 'CCXT_REPORTED_UNVERIFIED' as const
    : hasQuoteQtyField ? 'QUOTE_QTY_FIELD_UNVERIFIED' as const
    : gateUnitFallback ? 'GATE_CONTRACT_UNIT_VERIFIED' as const
    : input.gateDerivative ? 'UNKNOWN' as const : 'LOCAL_FALLBACK_UNVERIFIED' as const;
  const rawFeeCurrency = typeof input.rawFeeCurrency === 'string'
    ? input.rawFeeCurrency.trim().toUpperCase() : null;
  const normalizedFeeCurrency = input.feeCurrency?.trim().toUpperCase() ?? null;
  const feeCurrencySource = input.feeCost == null || !normalizedFeeCurrency
    ? 'UNVERIFIED' as const
    : input.rawFeeCurrency != null && rawFeeCurrency !== normalizedFeeCurrency
      ? 'CURRENCY_CONFLICT' as const
    : rawFeeCurrency ? 'VENUE_FIELD' as const
    : input.gateDerivative ? 'CCXT_SETTLE_INFERRED' as const : 'UNVERIFIED' as const;
  return { notional, notionalSource,
    notionalCurrency: notionalSource === 'GATE_CONTRACT_UNIT_VERIFIED' ? 'USDT' as const : null,
    feeCurrencySource };
};

export const normalizedFillCostEvidence = (fill: CcxtFuturesOrderFill) => {
  if (!fill.notionalSource && !fill.feeCurrencySource) return null;
  const positiveNotional = Number.isFinite(fill.notional) && fill.notional > 0
    ? fill.notional : null;
  return {
    ccxtNotional: fill.notionalSource === 'CCXT_DERIVED_UNVERIFIED' ||
      fill.notionalSource === 'CCXT_REPORTED_UNVERIFIED' ? positiveNotional : null,
    quoteQtyField: fill.notionalSource === 'QUOTE_QTY_FIELD_UNVERIFIED' ? positiveNotional : null,
    notionalSource: fill.notionalSource ?? 'UNKNOWN',
    notionalCurrency: fill.notionalCurrency ?? null,
    feeCurrencySource: fill.feeCurrencySource ?? 'UNVERIFIED',
  };
};
