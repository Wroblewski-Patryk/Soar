import { bootstrapWorker } from './workerBootstrap';
import { getQueueTuning } from '../queue/queueTuning';
import { assertDeployedWorkerOwnership, resolveWorkerOwnershipConfig } from './workerOwnership';
import { backtestRunQueue } from '../modules/backtests/backtests.service';

assertDeployedWorkerOwnership('backtest');
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

if (ownership.backtest === 'worker') {
  backtestRunQueue.startWorker();
}
