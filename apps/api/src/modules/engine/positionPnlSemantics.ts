const isPositiveFinite = (value: number | null | undefined): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

export const computeUnrealizedPnlFromPrice = (input: {
  side: 'LONG' | 'SHORT';
  entryPrice: number;
  currentPrice: number;
  quantity: number;
}) => {
  const { side, entryPrice, currentPrice, quantity } = input;
  if (!isPositiveFinite(entryPrice) || !isPositiveFinite(currentPrice) || !isPositiveFinite(quantity)) {
    return null;
  }
  return side === 'LONG'
    ? (currentPrice - entryPrice) * quantity
    : (entryPrice - currentPrice) * quantity;
};

export const resolveModeledMarginUsed = (input: {
  entryPrice: number;
  quantity: number;
  leverage: number;
}) => {
  const { entryPrice, quantity, leverage } = input;
  if (!isPositiveFinite(entryPrice) || !isPositiveFinite(quantity)) return null;
  const effectiveLeverage = isPositiveFinite(leverage) ? leverage : 1;
  const marginUsed = (entryPrice * quantity) / effectiveLeverage;
  return isPositiveFinite(marginUsed) ? marginUsed : null;
};

export const resolvePositionPnlFraction = (input: {
  side: 'LONG' | 'SHORT';
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  leverage: number;
  marginUsed?: number | null;
  unrealizedPnl?: number | null;
}) => {
  const effectiveMarginUsed =
    isPositiveFinite(input.marginUsed)
      ? input.marginUsed
      : resolveModeledMarginUsed({
          entryPrice: input.entryPrice,
          quantity: input.quantity,
          leverage: input.leverage,
        });
  if (!isPositiveFinite(effectiveMarginUsed)) return null;
  const unrealizedPnl =
    typeof input.unrealizedPnl === 'number' && Number.isFinite(input.unrealizedPnl)
      ? input.unrealizedPnl
      : computeUnrealizedPnlFromPrice({
          side: input.side,
          entryPrice: input.entryPrice,
          currentPrice: input.currentPrice,
          quantity: input.quantity,
        });
  if (typeof unrealizedPnl !== 'number' || !Number.isFinite(unrealizedPnl)) return null;
  return unrealizedPnl / effectiveMarginUsed;
};

export const computePriceFromPnlFraction = (input: {
  side: 'LONG' | 'SHORT';
  entryPrice: number;
  quantity: number;
  leverage: number;
  pnlFraction: number;
  marginUsed?: number | null;
}) => {
  const { side, entryPrice, quantity, leverage, pnlFraction, marginUsed } = input;
  if (!isPositiveFinite(entryPrice) || !Number.isFinite(pnlFraction)) return null;
  if (isPositiveFinite(marginUsed) && isPositiveFinite(quantity)) {
    const pnlTarget = pnlFraction * marginUsed;
    const priceMove = pnlTarget / quantity;
    const raw = side === 'LONG' ? entryPrice + priceMove : entryPrice - priceMove;
    return isPositiveFinite(raw) ? raw : null;
  }

  const effectiveLeverage = isPositiveFinite(leverage) ? leverage : 1;
  const raw =
    side === 'LONG'
      ? entryPrice * (1 + pnlFraction / effectiveLeverage)
      : entryPrice * (1 - pnlFraction / effectiveLeverage);
  return isPositiveFinite(raw) ? raw : null;
};
