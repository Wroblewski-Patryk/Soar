import { Exchange, TradeMarket } from '@prisma/client';
import { createPublicExchangeConnector } from '../exchange/exchangeConnectorFactory.service';
import { SymbolTradingRules } from '../orders/orders.quantityRules';
import { RuntimeDcaPolicyError } from './runtimeDcaPolicy';

const invalidRules = () => new RuntimeDcaPolicyError({
  code: 'DCA_ORDER_RULES_INVALID',
  message: 'Runtime USDT DCA quantity cannot be confirmed against venue amount, notional and precision rules',
});

const resolveAmountStep = (precision: number, mode: SymbolTradingRules['amountPrecisionMode']) => {
  if (mode === 'TICK_SIZE') return precision;
  if (mode === 'DECIMAL_PLACES') return Number.isInteger(precision) ? 10 ** -precision : NaN;
  if (mode !== undefined) return NaN;
  // Existing synthetic fixtures omitted the mode and used this legacy convention.
  return precision >= 1 ? 10 ** -Math.trunc(precision)
    : precision > 0 ? precision : 1;
};

export const resolveRuntimeDcaOrderQuantity = (input: {
  quantity: number;
  markPrice: number;
  marketType: TradeMarket;
  rules: SymbolTradingRules;
}) => {
  const { quantity, markPrice, rules } = input;
  if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(markPrice) || markPrice <= 0
    || rules.amountPrecision == null || !Number.isFinite(rules.amountPrecision)
    || rules.amountPrecision < 0
    || rules.minAmount == null || !Number.isFinite(rules.minAmount) || rules.minAmount <= 0
    || rules.minNotional == null || !Number.isFinite(rules.minNotional) || rules.minNotional <= 0
    || (input.marketType === 'FUTURES' && rules.contractSize == null)
    || (rules.contractSize != null && (!Number.isFinite(rules.contractSize)
      || Math.abs(rules.contractSize - 1) > 1e-12))) {
    throw invalidRules();
  }
  const precision = rules.amountPrecision;
  // Live CCXT rules always carry an explicit mode or null; null fails closed.
  const step = resolveAmountStep(precision, rules.amountPrecisionMode);
  // Floor the requested contribution: rounding to nearest could spend more than the target.
  if (!Number.isFinite(step) || step <= 0) throw invalidRules();
  const steps = Math.floor(quantity / step + 1e-10);
  if (!Number.isSafeInteger(steps)) throw invalidRules();
  let normalized = Number((steps * step).toPrecision(15));
  if (normalized > quantity) normalized = Number((normalized - step).toPrecision(15));
  if (!Number.isFinite(normalized) || normalized <= 0 || normalized > quantity
    || normalized < rules.minAmount
    || normalized * markPrice < rules.minNotional) {
    throw invalidRules();
  }
  return normalized;
};

export const getRuntimeDcaOrderRules = async (input: {
  exchange: Exchange;
  marketType: TradeMarket;
  symbol: string;
}): Promise<SymbolTradingRules> => {
  const connector = createPublicExchangeConnector(input);
  try {
    return await connector.getSymbolTradingRules(input.symbol);
  } finally {
    await connector.disconnect().catch(() => undefined);
  }
};
