export type OptionalWorkerOwnership = 'inline' | 'worker';
export type WorkerMode = 'inline' | 'split';
export type WorkerEnvironment = 'deployed' | 'local' | 'test';
export type WorkerTopologyStatus = 'healthy' | 'local_inline' | 'degraded';
export type WorkerFamily = 'backtest' | 'execution' | 'marketData' | 'marketStream';
export type WorkerOwnershipConfig = Record<WorkerFamily, OptionalWorkerOwnership>;

type WorkerTopologyReason =
  | 'DEPLOYED_INLINE_MODE'
  | 'DEPLOYED_CANONICAL_FAMILY_INLINE_BACKTEST'
  | 'DEPLOYED_CANONICAL_FAMILY_INLINE_EXECUTION'
  | 'DEPLOYED_CANONICAL_FAMILY_INLINE_MARKET_DATA'
  | 'DEPLOYED_CANONICAL_FAMILY_INLINE_MARKET_STREAM';

type WorkerTopologySnapshot = {
  mode: WorkerMode;
  environment: WorkerEnvironment;
  ownership: WorkerOwnershipConfig;
  topologyStatus: WorkerTopologyStatus;
  degradedReasons: WorkerTopologyReason[];
  requiredQueues: string[];
  missingQueues: string[];
  requiredWorkerFamilies: string[];
};

type ResolveWorkerTopologyInput = {
  env?: NodeJS.ProcessEnv;
  nodeEnv?: string | undefined;
};

const WORKER_FAMILY_LABELS: Record<WorkerFamily, string> = {
  backtest: 'backtest',
  execution: 'execution',
  marketData: 'market-data',
  marketStream: 'market-stream',
};

const QUEUE_ENV_BY_FAMILY: Partial<Record<WorkerFamily, string>> = {
  backtest: 'WORKER_BACKTEST_QUEUE',
  execution: 'WORKER_EXECUTION_QUEUE',
  marketData: 'WORKER_MARKET_DATA_QUEUE',
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

export const resolveWorkerMode = (value = process.env.WORKER_MODE): WorkerMode =>
  value?.trim().toLowerCase() === 'split' ? 'split' : 'inline';

export const resolveWorkerEnvironment = (nodeEnv = process.env.NODE_ENV): WorkerEnvironment => {
  if (nodeEnv === 'production') return 'deployed';
  if (nodeEnv === 'test') return 'test';
  return 'local';
};

export const resolveWorkerOwnershipConfig = (
  input: ResolveWorkerTopologyInput = {}
): WorkerOwnershipConfig => {
  const env = input.env ?? process.env;
  const mode = resolveWorkerMode(env.WORKER_MODE);
  return {
    backtest: normalizeOwnership(env.WORKER_BACKTEST_OWNERSHIP, 'inline'),
    execution: mode === 'split' ? 'worker' : 'inline',
    marketData: normalizeOwnership(env.WORKER_MARKET_DATA_OWNERSHIP, 'inline'),
    marketStream: mode === 'split' ? 'worker' : 'inline',
  };
};

const resolveDegradedReasons = (input: {
  mode: WorkerMode;
  environment: WorkerEnvironment;
  ownership: WorkerOwnershipConfig;
}): WorkerTopologyReason[] => {
  if (input.environment !== 'deployed') return [];
  if (input.mode !== 'split') {
    return ['DEPLOYED_INLINE_MODE'];
  }

  const reasons: WorkerTopologyReason[] = [];
  if (input.ownership.marketData !== 'worker') {
    reasons.push('DEPLOYED_CANONICAL_FAMILY_INLINE_MARKET_DATA');
  }
  if (input.ownership.marketStream !== 'worker') {
    reasons.push('DEPLOYED_CANONICAL_FAMILY_INLINE_MARKET_STREAM');
  }
  if (input.ownership.backtest !== 'worker') {
    reasons.push('DEPLOYED_CANONICAL_FAMILY_INLINE_BACKTEST');
  }
  if (input.ownership.execution !== 'worker') {
    reasons.push('DEPLOYED_CANONICAL_FAMILY_INLINE_EXECUTION');
  }
  return reasons;
};

export const resolveWorkerTopologySnapshot = (
  input: ResolveWorkerTopologyInput = {}
): WorkerTopologySnapshot => {
  const env = input.env ?? process.env;
  const mode = resolveWorkerMode(env.WORKER_MODE);
  const environment = resolveWorkerEnvironment(input.nodeEnv ?? process.env.NODE_ENV);
  const ownership = resolveWorkerOwnershipConfig({ env });
  const degradedReasons = resolveDegradedReasons({
    mode,
    environment,
    ownership,
  });
  const topologyStatus: WorkerTopologyStatus =
    degradedReasons.length > 0 ? 'degraded' : mode === 'inline' ? 'local_inline' : 'healthy';
  const requiredQueues = Object.entries(QUEUE_ENV_BY_FAMILY)
    .filter(([family, envName]) => ownership[family as WorkerFamily] === 'worker' && envName)
    .map(([, envName]) => envName as string);
  const missingQueues = requiredQueues.filter((envName) => !env[envName]);
  const requiredWorkerFamilies = (Object.keys(ownership) as WorkerFamily[])
    .filter((family) => ownership[family] === 'worker')
    .map((family) => WORKER_FAMILY_LABELS[family]);

  return {
    mode,
    environment,
    ownership,
    topologyStatus,
    degradedReasons,
    requiredQueues,
    missingQueues,
    requiredWorkerFamilies,
  };
};
