const isPositiveFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

export const computePositionAddUpdate = (input: {
  currentQuantity: number;
  currentEntryPrice: number;
  addedQuantity: number;
  fillPrice: number;
}) => {
  const currentQuantity = Math.max(0, input.currentQuantity);
  const addedQuantity = Math.max(0, input.addedQuantity);
  const nextQuantity = currentQuantity + addedQuantity;

  if (!isPositiveFiniteNumber(input.fillPrice) || nextQuantity <= 0) {
    return {
      nextQuantity: currentQuantity,
      nextEntryPrice: input.currentEntryPrice,
    };
  }

  const currentNotional = Math.max(0, input.currentEntryPrice) * currentQuantity;
  const addedNotional = input.fillPrice * addedQuantity;

  return {
    nextQuantity,
    nextEntryPrice: (currentNotional + addedNotional) / nextQuantity,
  };
};
