import { Exchange, TradeMarket } from '@prisma/client';
import { createPublicExchangeConnector } from '../exchange/exchangeConnectorFactory.service';
import { normalizeAmountByPrecision, SymbolTradingRules } from '../orders/orders.quantityRules';
import { RuntimeDcaPolicyError } from './runtimeDcaPolicy';

const invalidRules = () => new RuntimeDcaPolicyError({
  code: 'DCA_ORDER_RULES_INVALID',
  message: 'Runtime USDT DCA quantity cannot be confirmed against venue amount, notional and precision rules',
});

export const assertRuntimeDcaOrderRules = (input: {
  quantity: number;
  markPrice: number;
  rules: SymbolTradingRules;
}) => {
  const { quantity, markPrice, rules } = input;
  if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(markPrice) || markPrice <= 0
    || rules.amountPrecision == null || !Number.isFinite(rules.amountPrecision)
    || rules.amountPrecision < 0
    || rules.minAmount == null || !Number.isFinite(rules.minAmount) || rules.minAmount <= 0
    || rules.minNotional == null || !Number.isFinite(rules.minNotional) || rules.minNotional <= 0
    || (rules.contractSize != null && (!Number.isFinite(rules.contractSize)
      || Math.abs(rules.contractSize - 1) > 1e-12))) {
    throw invalidRules();
  }
  const normalized = rules.amountPrecision === 0 ? Math.round(quantity)
    : normalizeAmountByPrecision(quantity, rules.amountPrecision);
  if (!Number.isFinite(normalized)
    || Math.abs(normalized - quantity) > 1e-10 * Math.max(1, quantity)
    || quantity + 1e-10 < rules.minAmount
    || quantity * markPrice + 1e-9 < rules.minNotional) {
    throw invalidRules();
  }
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
