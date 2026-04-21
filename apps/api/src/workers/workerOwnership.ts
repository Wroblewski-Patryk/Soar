export type OptionalWorkerOwnership = 'inline' | 'worker';

type WorkerOwnershipConfig = {
  backtest: OptionalWorkerOwnership;
  marketData: OptionalWorkerOwnership;
};

const normalizeOwnership = (
  value: string | undefined,
  fallback: OptionalWorkerOwnership
): OptionalWorkerOwnership => {
  const normalized = value?.trim().toLowerCase();
  if (normalized === 'worker') return 'worker';
  if (normalized === 'inline') return 'inline';
  return fallback;
};

export const resolveWorkerOwnershipConfig = (): WorkerOwnershipConfig => ({
  backtest: normalizeOwnership(process.env.WORKER_BACKTEST_OWNERSHIP, 'inline'),
  marketData: normalizeOwnership(process.env.WORKER_MARKET_DATA_OWNERSHIP, 'inline'),
});

