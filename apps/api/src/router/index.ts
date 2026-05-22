import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import dashboardRoutes from './dashboard.routes';
import adminRoutes from './admin.routes';
import uploadRouter from '../modules/upload/upload.routes';
import { metricsStore } from '../observability/metrics';
import { evaluateRuntimeAlerts } from '../observability/alerts';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';
import { requireOpsNetwork } from '../middleware/requireOpsNetwork';
import { applyNoStoreHeaders } from '../middleware/noStoreHeaders';
import { evaluateCriticalSecretsReadiness } from '../config/criticalSecretsReadiness';
import { evaluateRuntimeDependencyReadiness } from '../config/runtimeDependencyReadiness';
import { readRuntimeSignalLoopConfig } from '../config/runtimeExecution';
import { buildRuntimeFreshnessSnapshot } from '../observability/runtimeFreshness';
import { resolveWorkerTopologySnapshot } from '../workers/workerOwnership';
import { workerHeartbeatClient, type WorkerHeartbeatName } from '../workers/workerHeartbeat';

const router = Router();

router.use('/auth', applyNoStoreHeaders, authRoutes);
router.use('/dashboard', applyNoStoreHeaders, dashboardRoutes);
router.use('/admin', applyNoStoreHeaders, adminRoutes);

router.get('/', (_req, res) => {
  res.send('CryptoSparrow API is running');
});

router.get('/health', (_req, res) => {
  return res.status(200).json({
    status: 'ok',
    service: 'api',
    timestamp: new Date().toISOString(),
  });
});

router.get('/ready', async (_req, res) => {
  const readiness = evaluateCriticalSecretsReadiness();
  const dependencies = await evaluateRuntimeDependencyReadiness();
  if (!readiness.ready || !dependencies.ready) {
    return res.status(503).json({
      status: 'not_ready',
      service: 'api',
    });
  }

  return res.status(200).json({
    status: 'ready',
    service: 'api',
  });
});

const requireOpsAccess = [requireAuth, requireRole('ADMIN'), requireOpsNetwork] as const;

const buildRuntimeSafetyDiagnostics = () => {
  const runtimeConfig = readRuntimeSignalLoopConfig();
  return {
    liveNoOrderGuard: {
      globalKillSwitch: runtimeConfig.liveGlobalKillSwitch,
      emergencyStop: runtimeConfig.liveEmergencyStop,
      active: runtimeConfig.liveGlobalKillSwitch || runtimeConfig.liveEmergencyStop,
    },
  };
};

router.get('/ready/details', ...requireOpsAccess, async (_req, res) => {
  const readiness = evaluateCriticalSecretsReadiness();
  const dependencies = await evaluateRuntimeDependencyReadiness();
  const runtimeSafety = buildRuntimeSafetyDiagnostics();
  if (!readiness.ready || !dependencies.ready) {
    return res.status(503).json({
      status: 'not_ready',
      service: 'api',
      missing: readiness.missing,
      issues: [...readiness.issues, ...dependencies.issues],
      runtimeSafety,
    });
  }

  return res.status(200).json({
    status: 'ready',
    service: 'api',
    missing: [],
    issues: [],
    runtimeSafety,
  });
});

router.get('/metrics', ...requireOpsAccess, (_req, res) => {
  return res.status(200).json(metricsStore.snapshot());
});

router.get('/alerts', ...requireOpsAccess, (_req, res) => {
  const nowMs = Date.now();
  const marketDataLastAtRaw = process.env.WORKER_LAST_MARKET_DATA_AT ?? '';
  const workerHeartbeatLastAtRaw = process.env.WORKER_LAST_HEARTBEAT_AT ?? '';
  const marketDataLastAtMs = Number.isNaN(Date.parse(marketDataLastAtRaw))
    ? null
    : Date.parse(marketDataLastAtRaw);
  const workerHeartbeatLastAtMs = Number.isNaN(Date.parse(workerHeartbeatLastAtRaw))
    ? null
    : Date.parse(workerHeartbeatLastAtRaw);

  const alerts = evaluateRuntimeAlerts({
    nowMs,
    marketDataLastAtMs,
    workerHeartbeatLastAtMs,
  });

  return res.status(200).json({ alerts });
});

router.get('/workers/health', ...requireOpsAccess, (_req, res) => {
  const topology = resolveWorkerTopologySnapshot();
  return res.status(200).json({
    status: topology.topologyStatus === 'degraded' ? 'degraded' : 'ok',
    service: 'workers',
    mode: topology.mode,
    environment: topology.environment,
    ownership: topology.ownership,
    topologyStatus: topology.topologyStatus,
    degradedReasons: topology.degradedReasons,
    requiredWorkerFamilies: topology.requiredWorkerFamilies,
    timestamp: new Date().toISOString(),
  });
});

router.get('/workers/ready', ...requireOpsAccess, async (_req, res) => {
  const topology = resolveWorkerTopologySnapshot();
  const marketDataLag = Number.parseInt(process.env.WORKER_MARKET_DATA_QUEUE_LAG ?? '0', 10);
  const backtestLag = Number.parseInt(process.env.WORKER_BACKTEST_QUEUE_LAG ?? '0', 10);
  const executionLag = Number.parseInt(process.env.WORKER_EXECUTION_QUEUE_LAG ?? '0', 10);
  metricsStore.setWorkerQueueLag('marketData', Number.isNaN(marketDataLag) ? 0 : marketDataLag);
  metricsStore.setWorkerQueueLag('backtest', Number.isNaN(backtestLag) ? 0 : backtestLag);
  metricsStore.setWorkerQueueLag('execution', Number.isNaN(executionLag) ? 0 : executionLag);

  if (topology.topologyStatus === 'local_inline') {
    return res.status(200).json({
      status: 'ready',
      service: 'workers',
      mode: topology.mode,
      environment: topology.environment,
      ownership: topology.ownership,
      topologyStatus: topology.topologyStatus,
      degradedReasons: topology.degradedReasons,
      requiredQueues: topology.requiredQueues,
      requiredWorkerFamilies: topology.requiredWorkerFamilies,
      details: 'Inline worker mode is explicitly supported only for local/test environments',
    });
  }
  const requiresSplitTopology = topology.topologyStatus === 'degraded';
  const missing = topology.missingQueues;

  if (missing.length > 0) {
    return res.status(503).json({
      status: 'not_ready',
      service: 'workers',
      mode: topology.mode,
      environment: topology.environment,
      ownership: topology.ownership,
      topologyStatus: topology.topologyStatus,
      degradedReasons: topology.degradedReasons,
      requiredQueues: topology.requiredQueues,
      requiredWorkerFamilies: topology.requiredWorkerFamilies,
      missing,
    });
  }

  if (requiresSplitTopology) {
    return res.status(503).json({
      status: 'not_ready',
      service: 'workers',
      mode: topology.mode,
      environment: topology.environment,
      ownership: topology.ownership,
      topologyStatus: topology.topologyStatus,
      degradedReasons: topology.degradedReasons,
      requiredQueues: topology.requiredQueues,
      requiredWorkerFamilies: topology.requiredWorkerFamilies,
      missing: [],
      details: 'Deployed worker topology deviates from the canonical split-worker contract',
    });
  }

  let heartbeats: Awaited<ReturnType<typeof workerHeartbeatClient.readMany>>;
  try {
    heartbeats = await workerHeartbeatClient.readMany(
      topology.requiredWorkerFamilies as WorkerHeartbeatName[]
    );
  } catch (error) {
    return res.status(503).json({
      status: 'not_ready',
      service: 'workers',
      mode: topology.mode,
      environment: topology.environment,
      ownership: topology.ownership,
      topologyStatus: topology.topologyStatus,
      degradedReasons: topology.degradedReasons,
      requiredQueues: topology.requiredQueues,
      requiredWorkerFamilies: topology.requiredWorkerFamilies,
      missing: [],
      heartbeatStatus: 'unavailable',
      details: error instanceof Error ? error.message : 'worker heartbeat read failed',
    });
  }

  const staleHeartbeats = heartbeats.filter((heartbeat) => heartbeat.status !== 'fresh');
  if (staleHeartbeats.length > 0) {
    return res.status(503).json({
      status: 'not_ready',
      service: 'workers',
      mode: topology.mode,
      environment: topology.environment,
      ownership: topology.ownership,
      topologyStatus: topology.topologyStatus,
      degradedReasons: topology.degradedReasons,
      requiredQueues: topology.requiredQueues,
      requiredWorkerFamilies: topology.requiredWorkerFamilies,
      missing: [],
      heartbeats,
      staleWorkers: staleHeartbeats.map((heartbeat) => heartbeat.worker),
      details: 'Required split-worker heartbeats are missing or stale',
    });
  }

  return res.status(200).json({
    status: 'ready',
    service: 'workers',
    mode: topology.mode,
    environment: topology.environment,
    ownership: topology.ownership,
    topologyStatus: topology.topologyStatus,
    degradedReasons: topology.degradedReasons,
    requiredQueues: topology.requiredQueues,
    requiredWorkerFamilies: topology.requiredWorkerFamilies,
    heartbeats,
  });
});

router.get('/workers/runtime-freshness', ...requireOpsAccess, async (_req, res) => {
  const snapshot = await buildRuntimeFreshnessSnapshot();
  return res.status(snapshot.status === 'PASS' ? 200 : 503).json(snapshot);
});

router.use('/upload', uploadRouter);

export default router;
