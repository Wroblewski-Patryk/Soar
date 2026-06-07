import type { QueueTuning } from '../queue/queueTuning';
import { createModuleLogger } from '../lib/logger';
import { workerHeartbeatClient, type WorkerHeartbeatClient } from './workerHeartbeat';

type WorkerName = 'market-data' | 'backtest' | 'execution' | 'market-stream';

type WorkerBootstrapConfig = {
  workerName: WorkerName;
  heartbeatIntervalMs?: number;
  queueName?: string;
  queueTuning?: QueueTuning;
};

type WorkerLogger = ReturnType<typeof createModuleLogger>;

type WorkerBootstrapDeps = {
  heartbeatClient: Pick<WorkerHeartbeatClient, 'record'>;
  loggers: Record<WorkerName, WorkerLogger>;
  now: () => Date;
  setInterval: typeof setInterval;
  clearInterval: typeof clearInterval;
};

const workerLoggers: Record<WorkerName, WorkerLogger> = {
  'market-data': createModuleLogger('worker.market-data'),
  backtest: createModuleLogger('worker.backtest'),
  execution: createModuleLogger('worker.execution'),
  'market-stream': createModuleLogger('worker.market-stream'),
};

const defaultDeps: WorkerBootstrapDeps = {
  heartbeatClient: workerHeartbeatClient,
  loggers: workerLoggers,
  now: () => new Date(),
  setInterval,
  clearInterval,
};

export const logWorkerEvent = (
  worker: WorkerName,
  event: string,
  extra?: Record<string, unknown>,
  deps: Pick<WorkerBootstrapDeps, 'loggers'> = defaultDeps
) => {
  deps.loggers[worker].info(event, extra);
};

export const createWorkerBootstrap = (deps: WorkerBootstrapDeps = defaultDeps) => {
  return (config: WorkerBootstrapConfig) => {
    const heartbeatIntervalMs = config.heartbeatIntervalMs ?? 15_000;
    logWorkerEvent(
      config.workerName,
      'worker_started',
      {
        heartbeatIntervalMs,
        queueName: config.queueName ?? null,
        queueTuning: config.queueTuning ?? null,
      },
      deps
    );

    const recordHeartbeat = async () => {
      const heartbeatAt = deps.now();
      process.env.WORKER_LAST_HEARTBEAT_AT = heartbeatAt.toISOString();
      await deps.heartbeatClient.record(config.workerName, heartbeatAt);
      logWorkerEvent(config.workerName, 'worker_heartbeat', undefined, deps);
    };

    void recordHeartbeat().catch((error) => {
      deps.loggers[config.workerName].error('worker_heartbeat_record_failed', {
        error: error instanceof Error ? error.message : 'unknown_error',
      });
    });

    const timer = deps.setInterval(() => {
      void recordHeartbeat().catch((error) => {
        deps.loggers[config.workerName].error('worker_heartbeat_record_failed', {
          error: error instanceof Error ? error.message : 'unknown_error',
        });
      });
    }, heartbeatIntervalMs);

    return {
      recordHeartbeat,
      stop: () => deps.clearInterval(timer),
    };
  };
};

export const bootstrapWorker = createWorkerBootstrap();
