import { Exchange } from '@prisma/client';
import { getExchangeSymbolRules } from '../exchange/exchangeSymbolRules.service';

type TradeMarket = 'FUTURES' | 'SPOT';

type RuntimeExchangeOrderGuardDeps = {
  getSymbolRules: typeof getExchangeSymbolRules;
};

const defaultDeps: RuntimeExchangeOrderGuardDeps = {
  getSymbolRules: getExchangeSymbolRules,
};

export type RuntimeExchangeOrderGuardResult =
  | {
      allowed: true;
    }
  | {
      allowed: false;
      reason: 'exchange_min_quantity_not_met' | 'exchange_min_notional_not_met';
      details: {
        symbol: string;
        quantity: number;
        price: number;
        notional: number;
        minQuantity: number | null;
        minNotional: number | null;
        contractSize: number | null;
      };
    };

export type RuntimeExchangeOrderRules = {
  minQuantity: number | null;
  minNotional: number | null;
  quantityStep: number | null;
  contractSize: number | null;
};

const isBelowThreshold = (value: number, threshold: number) => {
  const tolerance = Math.max(1e-12, Math.abs(threshold) * 1e-9);
  return value + tolerance < threshold;
};

export const resolveRuntimeExchangeOrderRules = async (
  input: {
    exchange: Exchange;
    marketType: TradeMarket;
    symbol: string;
  },
  deps: RuntimeExchangeOrderGuardDeps = defaultDeps
): Promise<RuntimeExchangeOrderRules | null> =>
  deps
    .getSymbolRules({
      exchange: input.exchange,
      marketType: input.marketType,
      symbol: input.symbol,
    })
    .catch(() => null);

export const validateRuntimeExchangeOrder = async (
  input: {
    exchange: Exchange;
    marketType: TradeMarket;
    symbol: string;
    quantity: number;
    price: number;
  },
  deps: RuntimeExchangeOrderGuardDeps = defaultDeps
): Promise<RuntimeExchangeOrderGuardResult> => {
  const quantity = Math.max(0, Number(input.quantity));
  const price = Math.max(0, Number(input.price));
  if (!Number.isFinite(quantity) || !Number.isFinite(price) || quantity <= 0 || price <= 0) {
    return {
      allowed: true,
    };
  }

  const rules = await resolveRuntimeExchangeOrderRules(input, deps);

  if (!rules) {
    return {
      allowed: true,
    };
  }

  const contractSize =
    typeof rules.contractSize === 'number' && Number.isFinite(rules.contractSize) && rules.contractSize > 0
      ? rules.contractSize
      : 1;
  const notional = quantity * price * contractSize;

  if (typeof rules.minQuantity === 'number' && rules.minQuantity > 0) {
    if (isBelowThreshold(quantity, rules.minQuantity)) {
      return {
        allowed: false,
        reason: 'exchange_min_quantity_not_met',
        details: {
          symbol: input.symbol,
          quantity,
          price,
          notional,
          minQuantity: rules.minQuantity,
          minNotional: rules.minNotional,
          contractSize: rules.contractSize,
        },
      };
    }
  }

  if (typeof rules.minNotional === 'number' && rules.minNotional > 0) {
    if (isBelowThreshold(notional, rules.minNotional)) {
      return {
        allowed: false,
        reason: 'exchange_min_notional_not_met',
        details: {
          symbol: input.symbol,
          quantity,
          price,
          notional,
          minQuantity: rules.minQuantity,
          minNotional: rules.minNotional,
          contractSize: rules.contractSize,
        },
      };
    }
  }

  return {
    allowed: true,
  };
};
