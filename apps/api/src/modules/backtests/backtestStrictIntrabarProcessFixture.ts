// Test-only, deterministic 1m tape shared by separate proof processes.
export const STRICT_PROOF_CANDLE_COUNT = 100;
export type StrictProofSourceVariant = 'baseline' | 'changed' | 'gap';

const priceAt = (index: number, variant: StrictProofSourceVariant) => {
  const prices = [0.99, 1, 1, 1.3, 0.5];
  return variant === 'changed' && index === 3 ? 1.31 : prices[index] ?? 0.5;
};

export const strictProofCandles = (start: number, variant: StrictProofSourceVariant) =>
  Array.from({ length: STRICT_PROOF_CANDLE_COUNT }, (_, index) => {
    const openTime = start + index * 60_000;
    const price = priceAt(index, variant);
    return { openTime, closeTime: openTime + 59_999,
      open: price, high: price, low: price, close: price, volume: 2 };
  });

export const strictProofRows = (start: number, variant: StrictProofSourceVariant) =>
  Array.from({ length: STRICT_PROOF_CANDLE_COUNT * 2 }, (_, index) => {
    const candleIndex = Math.floor(index / 2);
    const id = 100_000 + index;
    return { a: id, p: String(priceAt(candleIndex, variant)), q: '1',
      f: 200_000 + index, l: 200_000 + index,
      T: start + candleIndex * 60_000 + 1 + (index % 2), m: false };
  }).filter((row) => variant !== 'gap' || row.a !== 100_007);

export const strictProofPage = (rows: ReturnType<typeof strictProofRows>, query: {
  fromId?: number; startTime?: number; endTime?: number; limit: number;
}) => rows.filter((row) => query.fromId !== undefined ? row.a >= query.fromId :
  row.T >= (query.startTime ?? 0) && row.T <= (query.endTime ?? 0))
  .slice(0, query.limit);
