import { describe, expect, it, vi } from 'vitest';

import {
  ensureRuntimeSignalLoopStarted,
  resolveRuntimeSignalLoopBootstrapIntervalMs,
} from './execution.worker';

describe('execution.worker runtime signal bootstrap', () => {
  it('starts the runtime signal loop without recording failure metrics', async () => {
    const start = vi.fn(async () => undefined);
    const recordRuntimeExecutionError = vi.fn();
    const logError = vi.fn();

    await ensureRuntimeSignalLoopStarted({
      runtimeSignalLoop: { start },
      metricsStore: { recordRuntimeExecutionError },
      logError,
    });

    expect(start).toHaveBeenCalledTimes(1);
    expect(recordRuntimeExecutionError).not.toHaveBeenCalled();
    expect(logError).not.toHaveBeenCalled();
  });

  it('records runtime_start_failure when the runtime signal loop cannot start', async () => {
    const failure = new Error('loop unavailable');
    const recordRuntimeExecutionError = vi.fn();
    const logError = vi.fn();

    await ensureRuntimeSignalLoopStarted({
      runtimeSignalLoop: { start: vi.fn(async () => Promise.reject(failure)) },
      metricsStore: { recordRuntimeExecutionError },
      logError,
    });

    expect(logError).toHaveBeenCalledWith(
      'Execution worker failed to start runtimeSignalLoop:',
      failure
    );
    expect(recordRuntimeExecutionError).toHaveBeenCalledWith('runtime_start_failure');
  });

  it('keeps a five-second minimum bootstrap retry interval', () => {
    expect(
      resolveRuntimeSignalLoopBootstrapIntervalMs({
        RUNTIME_SIGNAL_LOOP_BOOTSTRAP_INTERVAL_MS: '1000',
      })
    ).toBe(5_000);
    expect(
      resolveRuntimeSignalLoopBootstrapIntervalMs({
        RUNTIME_SIGNAL_LOOP_BOOTSTRAP_INTERVAL_MS: '20000',
      })
    ).toBe(20_000);
  });
});
