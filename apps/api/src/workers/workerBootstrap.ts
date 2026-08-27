import type { QueueTuning } from '../queue/queueTuning';
import { createModuleLogger } from '../lib/logger';
import { workerHeartbeatClient } from './workerHeartbeat';

type WorkerName = 'market-data' | 'backtest' | 'execution' | 'market-stream';

type WorkerBootstrapConfig = {
  workerName: WorkerName;
  heartbeatIntervalMs?: number;
  queueName?: string;
  queueTuning?: QueueTuning;
};

const workerLoggers: Record<WorkerName, ReturnType<typeof createModuleLogger>> = {
  'market-data': createModuleLogger('worker.market-data'),
  backtest: createModuleLogger('worker.backtest'),
  execution: createModuleLogger('worker.execution'),
  'market-stream': createModuleLogger('worker.market-stream'),
};

const logWorkerEvent = (worker: WorkerName, event: string, extra?: Record<string, unknown>) => {
  workerLoggers[worker].info(event, extra);
};

export const bootstrapWorker = (config: WorkerBootstrapConfig) => {
  const heartbeatIntervalMs = config.heartbeatIntervalMs ?? 15_000;
  logWorkerEvent(config.workerName, 'worker_started', {
    heartbeatIntervalMs,
    queueName: config.queueName ?? null,
    queueTuning: config.queueTuning ?? null,
  });

  const recordHeartbeat = async () => {
    const heartbeatAt = new Date();
    process.env.WORKER_LAST_HEARTBEAT_AT = heartbeatAt.toISOString();
    await workerHeartbeatClient.record(config.workerName, heartbeatAt);
    logWorkerEvent(config.workerName, 'worker_heartbeat');
  };

  void recordHeartbeat().catch((error) => {
    workerLoggers[config.workerName].error('worker_heartbeat_record_failed', {
      error: error instanceof Error ? error.message : 'unknown_error',
    });
  });

  const timer = setInterval(() => {
    void recordHeartbeat().catch((error) => {
      workerLoggers[config.workerName].error('worker_heartbeat_record_failed', {
        error: error instanceof Error ? error.message : 'unknown_error',
      });
    });
  }, heartbeatIntervalMs);
};
