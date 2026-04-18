import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RuntimeSignalLoopSupervisor } from './runtimeSignalLoopSupervisor';

describe('RuntimeSignalLoopSupervisor', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('detects NO_EVENT stalls from watchdog ticks and calls stall handler', async () => {
    const onStall = vi.fn(async () => undefined);
    const supervisor = new RuntimeSignalLoopSupervisor({
      watchdogIntervalMs: 1_000,
      stallDetectorEnabled: () => true,
      stallNoEventMs: () => 5_000,
      stallNoHeartbeatMs: () => 60_000,
      autoRestartEnabled: () => true,
      autoRestartCooldownMs: () => 5_000,
      autoRestartMaxAttempts: () => 3,
      autoRestartWindowMs: () => 60_000,
      getIsRunning: () => true,
      getLastKnownActiveBotIds: () => ['bot-1'],
      getLastStreamEventAtMs: () => 0,
      getLastSessionSyncSuccessAtMs: () => Date.now(),
      onWatchdogTick: async () => [],
      onWatchdogError: () => undefined,
      onStall,
      onAutoRestart: async () => undefined,
      onAutoRestartError: () => undefined,
      onAutoRestartMaxAttemptsGuard: () => undefined,
    });

    supervisor.startWatchdog();
    await vi.advanceTimersByTimeAsync(6_000);

    expect(onStall).toHaveBeenCalledWith('runtime_stall_no_event', ['bot-1']);
    supervisor.stopWatchdog();
  });

  it('applies auto-restart max-attempt guardrail after repeated failures', async () => {
    const onAutoRestart = vi.fn(async () => {
      throw new Error('restart_failure');
    });
    const onAutoRestartMaxAttemptsGuard = vi.fn();

    const supervisor = new RuntimeSignalLoopSupervisor({
      watchdogIntervalMs: 1_000,
      stallDetectorEnabled: () => true,
      stallNoEventMs: () => 5_000,
      stallNoHeartbeatMs: () => 60_000,
      autoRestartEnabled: () => true,
      autoRestartCooldownMs: () => 1_000,
      autoRestartMaxAttempts: () => 1,
      autoRestartWindowMs: () => 60_000,
      getIsRunning: () => false,
      getLastKnownActiveBotIds: () => [],
      getLastStreamEventAtMs: () => null,
      getLastSessionSyncSuccessAtMs: () => null,
      onWatchdogTick: async () => [],
      onWatchdogError: () => undefined,
      onStall: async () => undefined,
      onAutoRestart,
      onAutoRestartError: () => undefined,
      onAutoRestartMaxAttemptsGuard,
    });

    supervisor.scheduleAutoRestart('runtime_stall_no_event');
    await vi.advanceTimersByTimeAsync(3_500);

    expect(onAutoRestart).toHaveBeenCalledTimes(1);
    expect(onAutoRestartMaxAttemptsGuard).toHaveBeenCalled();
    supervisor.clearAutoRestartState();
  });
});
