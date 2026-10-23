import { Exchange, Order, TradeMarket } from '@prisma/client';
import { isMatchingGateFuturesEconomics } from '../exchange/gateFuturesEconomics';

const parseFeeRate = (value: string | undefined) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed;
};

export const resolveRuntimeTakerFeeRate = (mode: 'PAPER' | 'LIVE') => {
  const modeSpecific = parseFeeRate(
    mode === 'LIVE' ? process.env.RUNTIME_LIVE_TAKER_FEE_RATE : process.env.RUNTIME_PAPER_TAKER_FEE_RATE
  );
  if (modeSpecific != null) return modeSpecific;
  const global = parseFeeRate(process.env.RUNTIME_TAKER_FEE_RATE);
  if (global != null) return global;
  return 0.0004;
};

export const computeTradeFee = (price: number, quantity: number, feeRate: number, contractSize: number) => {
  if (!Number.isFinite(price) || !Number.isFinite(quantity) || !Number.isFinite(feeRate) ||
      !Number.isFinite(contractSize)) return 0;
  if (price <= 0 || quantity <= 0 || feeRate <= 0 || contractSize <= 0) return 0;
  return price * quantity * contractSize * feeRate;
};

type FeeUnitEvidence = Pick<Order, 'symbol' | 'contractSize' | 'gateFuturesEconomics'>;

export const resolveEstimatedFeeContractSize = (input: {
  market: { exchange: Exchange | 'UNSCOPED_PAPER'; marketType: TradeMarket };
  order: FeeUnitEvidence;
  position?: FeeUnitEvidence;
}): number => {
  if (input.market.exchange !== 'GATEIO') return 1;
  if (input.market.marketType !== 'FUTURES') return 1;
  const requireVerifiedUnit = (evidence: FeeUnitEvidence): number => {
    const unit = evidence.contractSize;
    if (typeof unit !== 'number' || !Number.isFinite(unit) || unit <= 0 ||
        evidence.symbol !== input.order.symbol ||
        (unit !== 1 || evidence.gateFuturesEconomics != null) &&
          !isMatchingGateFuturesEconomics(evidence.gateFuturesEconomics, unit, evidence.symbol)) {
      throw new Error('RUNTIME_GATE_FUTURES_FEE_UNIT_UNSAFE');
    }
    return unit;
  };
  const orderUnit = requireVerifiedUnit(input.order);
  if (input.position && requireVerifiedUnit(input.position) !== orderUnit) {
    throw new Error('RUNTIME_GATE_FUTURES_FEE_UNIT_UNSAFE');
  }
  return orderUnit;
};

const isPositiveFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

export const resolveOrderExecutionPrice = (
  order: Pick<Order, 'averageFillPrice' | 'price'>,
  fallbackPrice: number
) => {
  if (isPositiveFiniteNumber(order.averageFillPrice)) return order.averageFillPrice;
  if (isPositiveFiniteNumber(order.price)) return order.price;
  return fallbackPrice;
};

export const resolveOrderExecutionQuantity = (
  order: Pick<Order, 'filledQuantity' | 'quantity'>,
  fallbackQuantity: number
) => {
  if (isPositiveFiniteNumber(order.filledQuantity)) {
    return Math.min(Math.max(0, order.quantity), order.filledQuantity);
  }
  return fallbackQuantity;
};

export const isCloseQuantityComplete = (filledQuantity: number, positionQuantity: number) => {
  const tolerance = Math.max(1e-9, Math.abs(positionQuantity) * 1e-8);
  return filledQuantity + tolerance >= positionQuantity;
};
