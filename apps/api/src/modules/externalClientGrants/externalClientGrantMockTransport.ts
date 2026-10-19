// Fixed, local test transport. No caller code, exchange adapter, CCXT, or I/O.
import { Prisma } from '@prisma/client';
export const delegatedMockScenarios = [
  'CERTAIN_FILL', 'DELAYED_FILL', 'UNKNOWN', 'INVALID_FILL',
  'HOLD_AFTER_RESULT_JOURNAL', 'HOLD_AFTER_RECONCILE',
] as const;
export type DelegatedMockScenario = typeof delegatedMockScenarios[number];

export const runDelegatedMockTransport = async (input: {
  exchange: 'BINANCE' | 'GATEIO';
  symbol: string; side: 'BUY' | 'SELL'; quantity: string; limitPrice: string;
  clientOrderId: string; scenario: DelegatedMockScenario;
}) => {
  if (input.scenario === 'DELAYED_FILL') {
    await new Promise<void>((resolve) => setTimeout(resolve, 5_000));
  }
  if (input.scenario === 'UNKNOWN') throw new Error('Mock response unavailable');
  const quantity = Number(input.quantity);
  const price = Number(input.limitPrice);
  const exchangeOrderId = `mock-${input.exchange.toLowerCase()}-${input.clientOrderId}`;
  const fillQuantity = input.scenario === 'INVALID_FILL' ? quantity / 2 : quantity;
  return {
    exchangeOrderId, status: 'FILLED' as const,
    exchangeFilledQuantity: quantity, exchangeAverageFillPrice: price,
    fills: [{ exchangeTradeId: `mock-fill-${input.clientOrderId}`, exchangeOrderId,
      symbol: input.symbol, side: input.side, price, quantity: fillQuantity,
      notional: new Prisma.Decimal(input.limitPrice).mul(fillQuantity.toString()).toNumber(),
      feeCost: 0.05, feeCurrency: 'USDT', feeRate: 0.001,
      executedAt: new Date(0), source: 'createOrder' as const, raw: { mock: true } }],
  };
};
