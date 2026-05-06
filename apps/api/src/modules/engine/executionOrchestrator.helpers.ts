import { Order } from '@prisma/client';

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

export const computeTradeFee = (price: number, quantity: number, feeRate: number) => {
  if (!Number.isFinite(price) || !Number.isFinite(quantity) || !Number.isFinite(feeRate)) return 0;
  if (price <= 0 || quantity <= 0 || feeRate <= 0) return 0;
  return price * quantity * feeRate;
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
