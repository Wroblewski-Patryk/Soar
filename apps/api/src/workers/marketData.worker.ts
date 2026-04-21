import { bootstrapWorker } from './workerBootstrap';
import { getQueueTuning } from '../queue/queueTuning';
import { resolveWorkerOwnershipConfig } from './workerOwnership';

const ownership = resolveWorkerOwnershipConfig();

bootstrapWorker(
  ownership.marketData === 'worker'
    ? {
        workerName: 'market-data',
        queueName: process.env.WORKER_MARKET_DATA_QUEUE ?? 'market-data',
        queueTuning: getQueueTuning('market-data'),
      }
    : {
        workerName: 'market-data',
      }
);
