type RuntimePriceCandidate = {
  price: number | null | undefined;
  observedAtMs?: number | null;
  source?: string | null;
};

type ExchangeSyncedPositionPriceInput = {
  origin: string;
  status: string;
  side: 'LONG' | 'SHORT';
  entryPrice: number;
  quantity: number;
  unrealizedPnl?: number | null;
  lastExchangeSyncAt?: Date | null;
  runtimePriceCandidates?: RuntimePriceCandidate[];
};

const isFinitePositiveNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

const derivePriceFromUnrealizedPnl = (input: {
  side: 'LONG' | 'SHORT';
  entryPrice: number;
  quantity: number;
  unrealizedPnl: number;
}) => {
  if (!isFinitePositiveNumber(input.entryPrice) || !isFinitePositiveNumber(input.quantity)) {
    return null;
  }

  const rawPrice =
    input.side === 'LONG'
      ? input.entryPrice + input.unrealizedPnl / input.quantity
      : input.entryPrice - input.unrealizedPnl / input.quantity;

  return isFinitePositiveNumber(rawPrice) ? rawPrice : null;
};

const selectFreshestRuntimeCandidate = (candidates: RuntimePriceCandidate[]) => {
  return candidates.reduce<RuntimePriceCandidate | null>((current, candidate) => {
    if (!isFinitePositiveNumber(candidate.price)) return current;
    if (
      !current ||
      (candidate.observedAtMs ?? Number.NEGATIVE_INFINITY) >
        (current.observedAtMs ?? Number.NEGATIVE_INFINITY)
    ) {
      return candidate;
    }
    return current;
  }, null);
};

export const resolvePreferredRuntimeOrExchangeSyncedPriceWithSource = (
  input: ExchangeSyncedPositionPriceInput
): { price: number | null; source: string } => {
  const freshestRuntimeCandidate = selectFreshestRuntimeCandidate(
    input.runtimePriceCandidates ?? []
  );
  const runtimeCandidateResult = freshestRuntimeCandidate
    ? {
        price: freshestRuntimeCandidate.price ?? null,
        source: freshestRuntimeCandidate.source ?? 'runtime_candidate',
      }
    : {
        price: null,
        source: 'unavailable',
      };

  if (input.origin !== 'EXCHANGE_SYNC' || input.status !== 'OPEN') {
    return runtimeCandidateResult;
  }

  const exchangeSyncAtMs = input.lastExchangeSyncAt?.getTime() ?? null;
  const derivedExchangePrice =
    typeof input.unrealizedPnl === 'number' && Number.isFinite(input.unrealizedPnl)
      ? derivePriceFromUnrealizedPnl({
          side: input.side,
          entryPrice: input.entryPrice,
          quantity: input.quantity,
          unrealizedPnl: input.unrealizedPnl,
        })
      : null;

  if (derivedExchangePrice == null) {
    return runtimeCandidateResult;
  }

  if (exchangeSyncAtMs == null) {
    return freshestRuntimeCandidate
      ? runtimeCandidateResult
      : { price: derivedExchangePrice, source: 'exchange_unrealized_pnl' };
  }

  const freshestRuntimeObservedAtMs = freshestRuntimeCandidate?.observedAtMs ?? null;
  if (
    freshestRuntimeCandidate &&
    freshestRuntimeObservedAtMs != null &&
    freshestRuntimeObservedAtMs >= exchangeSyncAtMs
  ) {
    return runtimeCandidateResult;
  }

  return { price: derivedExchangePrice, source: 'exchange_unrealized_pnl' };
};

export const resolvePreferredRuntimeOrExchangeSyncedPrice = (
  input: ExchangeSyncedPositionPriceInput
) => resolvePreferredRuntimeOrExchangeSyncedPriceWithSource(input).price;
