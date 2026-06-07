import { bootstrapWorker } from './workerBootstrap';
import { getQueueTuning } from '../queue/queueTuning';
import { livePositionReconciliationLoop } from '../modules/positions/livePositionReconciliation.service';
import { runtimeSignalLoop } from '../modules/engine/runtimeSignalLoop.service';
import { runtimeScanLoop } from '../modules/engine/runtimeScanLoop.service';
import { metricsStore } from '../observability/metrics';

export const resolveRuntimeSignalLoopBootstrapIntervalMs = (env = process.env) =>
  Math.max(5_000, Number.parseInt(env.RUNTIME_SIGNAL_LOOP_BOOTSTRAP_INTERVAL_MS ?? '15000', 10));

type EnsureRuntimeSignalLoopStartedDeps = {
  runtimeSignalLoop: Pick<typeof runtimeSignalLoop, 'start'>;
  metricsStore: Pick<typeof metricsStore, 'recordRuntimeExecutionError'>;
  logError: typeof console.error;
};

export const ensureRuntimeSignalLoopStarted = async (
  deps: EnsureRuntimeSignalLoopStartedDeps = {
    runtimeSignalLoop,
    metricsStore,
    logError: console.error,
  }
) => {
  try {
    await deps.runtimeSignalLoop.start();
  } catch (error) {
    deps.logError('Execution worker failed to start runtimeSignalLoop:', error);
    deps.metricsStore.recordRuntimeExecutionError('runtime_start_failure');
  }
};

export const startExecutionWorker = () => {
  const runtimeSignalLoopBootstrapIntervalMs = resolveRuntimeSignalLoopBootstrapIntervalMs();

  bootstrapWorker({
    workerName: 'execution',
    queueName: process.env.WORKER_EXECUTION_QUEUE ?? 'execution',
    queueTuning: getQueueTuning('execution'),
  });

  livePositionReconciliationLoop.start();
  void ensureRuntimeSignalLoopStarted();
  const runtimeSignalLoopBootstrapTimer = setInterval(() => {
    if (runtimeSignalLoop.isRunning()) return;
    void ensureRuntimeSignalLoopStarted();
  }, runtimeSignalLoopBootstrapIntervalMs);
  runtimeSignalLoopBootstrapTimer.unref?.();
  runtimeScanLoop.start();
};

if (process.env.NODE_ENV !== 'test' && process.env.VITEST !== 'true') {
  startExecutionWorker();
}
