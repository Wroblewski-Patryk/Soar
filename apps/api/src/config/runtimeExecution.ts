import { parsePositiveInt } from '../lib/env';

export type RuntimeSignalLoopConfig = {
  signalQuantity: number;
  signalDecisionDedupeRetentionMs: number;
  minDirectionalScore: number;
  tickerFreshnessFallbackMs: number;
  sessionWatchdogIntervalMs: number;
  stallDetectorEnabled: boolean;
  stallNoEventMs: number;
  stallNoHeartbeatMs: number;
  autoRestartEnabled: boolean;
  autoRestartCooldownMs: number;
  autoRestartMaxAttempts: number;
  autoRestartWindowMs: number;
  seriesQueueMaxPending: number;
};

export type LiveOrderingConfig = {
  rulesCacheTtlMs: number;
  exposureCacheTtlMs: number;
  convergenceCacheTtlMs: number;
  convergenceEnabled: boolean;
  convergenceStrict: boolean;
  targetMarginMode: 'cross' | 'isolated' | null;
};

const parseBoolean = (raw: string | undefined, fallback: boolean) => {
  if (typeof raw !== 'string') return fallback;
  const normalized = raw.trim().toLowerCase();
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;
  return fallback;
};

const parseMarginMode = (raw: string | undefined): 'cross' | 'isolated' | null => {
  if (typeof raw !== 'string') return null;
  const normalized = raw.trim().toLowerCase();
  if (normalized === 'cross' || normalized === 'crossed') return 'cross';
  if (normalized === 'isolated' || normalized === 'isolate') return 'isolated';
  return null;
};

export const readRuntimeSignalLoopConfig = (
  env: NodeJS.ProcessEnv = process.env
): RuntimeSignalLoopConfig => {
  const sessionWatchdogIntervalMs = Math.max(
    5_000,
    Number.parseInt(env.RUNTIME_SESSION_WATCHDOG_INTERVAL_MS ?? '15000', 10)
  );
  const autoRestartCooldownMs = Math.max(
    5_000,
    Number.parseInt(env.RUNTIME_AUTO_RESTART_COOLDOWN_MS ?? '30000', 10)
  );

  return {
    signalQuantity: Number.parseFloat(env.RUNTIME_SIGNAL_QUANTITY ?? '0.01'),
    signalDecisionDedupeRetentionMs: Number.parseInt(
      env.RUNTIME_SIGNAL_DEDUPE_RETENTION_MS ?? '21600000',
      10
    ),
    minDirectionalScore: Number.parseFloat(env.RUNTIME_SIGNAL_MIN_DIRECTIONAL_SCORE ?? '1'),
    tickerFreshnessFallbackMs: Math.max(
      30_000,
      Number.parseInt(env.RUNTIME_SIGNAL_TICKER_FRESHNESS_MS ?? '90000', 10)
    ),
    sessionWatchdogIntervalMs,
    stallDetectorEnabled: env.RUNTIME_STALL_DETECTOR_ENABLED !== 'false',
    stallNoEventMs: Math.max(60_000, Number.parseInt(env.RUNTIME_STALL_NO_EVENT_MS ?? '300000', 10)),
    stallNoHeartbeatMs: Math.max(
      sessionWatchdogIntervalMs * 2,
      Number.parseInt(env.RUNTIME_STALL_NO_HEARTBEAT_MS ?? '60000', 10)
    ),
    autoRestartEnabled: env.RUNTIME_AUTO_RESTART_ENABLED !== 'false',
    autoRestartCooldownMs,
    autoRestartMaxAttempts: Math.max(
      1,
      Number.parseInt(env.RUNTIME_AUTO_RESTART_MAX_ATTEMPTS ?? '5', 10)
    ),
    autoRestartWindowMs: Math.max(
      autoRestartCooldownMs,
      Number.parseInt(env.RUNTIME_AUTO_RESTART_WINDOW_MS ?? '300000', 10)
    ),
    seriesQueueMaxPending: Math.max(
      1,
      Number.parseInt(env.RUNTIME_SIGNAL_SERIES_QUEUE_MAX_PENDING ?? '64', 10)
    ),
  };
};

export const readLiveOrderingConfig = (
  env: NodeJS.ProcessEnv = process.env
): LiveOrderingConfig => ({
  rulesCacheTtlMs: parsePositiveInt(env.LIVE_PRETRADE_RULES_CACHE_TTL_MS, 5 * 60_000),
  exposureCacheTtlMs: parsePositiveInt(env.LIVE_PRETRADE_EXPOSURE_CACHE_TTL_MS, 5_000),
  convergenceCacheTtlMs: parsePositiveInt(
    env.LIVE_PRETRADE_MARGIN_LEVERAGE_CACHE_TTL_MS,
    6 * 60 * 60_000
  ),
  convergenceEnabled: parseBoolean(env.LIVE_PRETRADE_MARGIN_LEVERAGE_CONVERGENCE_ENABLED, true),
  convergenceStrict: parseBoolean(env.LIVE_PRETRADE_MARGIN_LEVERAGE_CONVERGENCE_STRICT, false),
  targetMarginMode: parseMarginMode(env.LIVE_PRETRADE_MARGIN_MODE),
});

export const runtimeSignalLoopConfig = readRuntimeSignalLoopConfig();
export const liveOrderingConfig = readLiveOrderingConfig();
