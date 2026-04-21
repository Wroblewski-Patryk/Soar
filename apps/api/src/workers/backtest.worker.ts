import { bootstrapWorker } from './workerBootstrap';
import { getQueueTuning } from '../queue/queueTuning';
import { resolveWorkerOwnershipConfig } from './workerOwnership';

const ownership = resolveWorkerOwnershipConfig();

bootstrapWorker(
  ownership.backtest === 'worker'
    ? {
        workerName: 'backtest',
        queueName: process.env.WORKER_BACKTEST_QUEUE ?? 'backtest',
        queueTuning: getQueueTuning('backtest'),
      }
    : {
        workerName: 'backtest',
      }
);
