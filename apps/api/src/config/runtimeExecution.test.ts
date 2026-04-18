import { describe, expect, it } from 'vitest';
import { readLiveOrderingConfig, readRuntimeSignalLoopConfig } from './runtimeExecution';

describe('runtimeExecution config', () => {
  it('reads runtime signal loop defaults', () => {
    const config = readRuntimeSignalLoopConfig({});

    expect(config.signalQuantity).toBe(0.01);
    expect(config.signalDecisionDedupeRetentionMs).toBe(21_600_000);
    expect(config.minDirectionalScore).toBe(1);
    expect(config.tickerFreshnessFallbackMs).toBe(90_000);
    expect(config.sessionWatchdogIntervalMs).toBe(15_000);
    expect(config.stallDetectorEnabled).toBe(true);
    expect(config.stallNoEventMs).toBe(300_000);
    expect(config.stallNoHeartbeatMs).toBe(60_000);
    expect(config.autoRestartEnabled).toBe(true);
    expect(config.autoRestartCooldownMs).toBe(30_000);
    expect(config.autoRestartMaxAttempts).toBe(5);
    expect(config.autoRestartWindowMs).toBe(300_000);
    expect(config.seriesQueueMaxPending).toBe(64);
  });

  it('reads runtime signal loop overrides with existing min clamps', () => {
    const config = readRuntimeSignalLoopConfig({
      RUNTIME_SIGNAL_QUANTITY: '0.25',
      RUNTIME_SIGNAL_DEDUPE_RETENTION_MS: '120000',
      RUNTIME_SIGNAL_MIN_DIRECTIONAL_SCORE: '2.5',
      RUNTIME_SIGNAL_TICKER_FRESHNESS_MS: '1000',
      RUNTIME_SESSION_WATCHDOG_INTERVAL_MS: '1000',
      RUNTIME_STALL_DETECTOR_ENABLED: 'false',
      RUNTIME_STALL_NO_EVENT_MS: '1000',
      RUNTIME_STALL_NO_HEARTBEAT_MS: '1000',
      RUNTIME_AUTO_RESTART_ENABLED: 'false',
      RUNTIME_AUTO_RESTART_COOLDOWN_MS: '1000',
      RUNTIME_AUTO_RESTART_MAX_ATTEMPTS: '0',
      RUNTIME_AUTO_RESTART_WINDOW_MS: '1000',
      RUNTIME_SIGNAL_SERIES_QUEUE_MAX_PENDING: '0',
    });

    expect(config.signalQuantity).toBe(0.25);
    expect(config.signalDecisionDedupeRetentionMs).toBe(120_000);
    expect(config.minDirectionalScore).toBe(2.5);
    expect(config.tickerFreshnessFallbackMs).toBe(30_000);
    expect(config.sessionWatchdogIntervalMs).toBe(5_000);
    expect(config.stallDetectorEnabled).toBe(false);
    expect(config.stallNoEventMs).toBe(60_000);
    expect(config.stallNoHeartbeatMs).toBe(10_000);
    expect(config.autoRestartEnabled).toBe(false);
    expect(config.autoRestartCooldownMs).toBe(5_000);
    expect(config.autoRestartMaxAttempts).toBe(1);
    expect(config.autoRestartWindowMs).toBe(5_000);
    expect(config.seriesQueueMaxPending).toBe(1);
  });

  it('reads live-ordering defaults and env overrides', () => {
    const defaults = readLiveOrderingConfig({});
    expect(defaults.rulesCacheTtlMs).toBe(300_000);
    expect(defaults.exposureCacheTtlMs).toBe(5_000);
    expect(defaults.convergenceCacheTtlMs).toBe(21_600_000);
    expect(defaults.convergenceEnabled).toBe(true);
    expect(defaults.convergenceStrict).toBe(false);
    expect(defaults.targetMarginMode).toBeNull();

    const overrides = readLiveOrderingConfig({
      LIVE_PRETRADE_RULES_CACHE_TTL_MS: '10000',
      LIVE_PRETRADE_EXPOSURE_CACHE_TTL_MS: '7000',
      LIVE_PRETRADE_MARGIN_LEVERAGE_CACHE_TTL_MS: '11000',
      LIVE_PRETRADE_MARGIN_LEVERAGE_CONVERGENCE_ENABLED: 'false',
      LIVE_PRETRADE_MARGIN_LEVERAGE_CONVERGENCE_STRICT: 'true',
      LIVE_PRETRADE_MARGIN_MODE: 'crossed',
    });
    expect(overrides.rulesCacheTtlMs).toBe(10_000);
    expect(overrides.exposureCacheTtlMs).toBe(7_000);
    expect(overrides.convergenceCacheTtlMs).toBe(11_000);
    expect(overrides.convergenceEnabled).toBe(false);
    expect(overrides.convergenceStrict).toBe(true);
    expect(overrides.targetMarginMode).toBe('cross');
  });
});
