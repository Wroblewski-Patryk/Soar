import { prisma } from '../prisma/client';
import { metricsStore } from './metrics';
import { parsePositiveInt } from '../lib/env';
import { resolveWorkerTopologySnapshot } from '../workers/workerOwnership';

type FreshnessStatus = 'PASS' | 'FAIL' | 'SKIP';

type FreshnessCheck = {
  status: FreshnessStatus;
  thresholdMs: number | null;
  ageMs: number | null;
  detail: string;
};

type RuntimeFreshnessSnapshot = {
  status: 'PASS' | 'FAIL';
  checkedAt: string;
  checks: {
    workerHeartbeat: FreshnessCheck;
    marketData: FreshnessCheck;
    runtimeSignalLag: FreshnessCheck;
    runtimeSessions: FreshnessCheck & {
      runningCount: number;
      staleSessionIds: string[];
    };
    runtimeDecisionActivity: FreshnessCheck & {
      required: boolean;
      runningCount: number;
      staleSessionIds: string[];
    };
  };
};

const parseEnvDate = (raw: string | undefined) => {
  const normalized = raw?.trim();
  if (!normalized) return null;
  const parsed = Date.parse(normalized);
  if (Number.isNaN(parsed)) return null;
  return parsed;
};

const computeTimeCheck = (input: {
  label: string;
  lastAtMs: number | null;
  nowMs: number;
  thresholdMs: number;
}): FreshnessCheck => {
  if (input.lastAtMs === null) {
    return {
      status: 'FAIL',
      thresholdMs: input.thresholdMs,
      ageMs: null,
      detail: `${input.label} timestamp missing`,
    };
  }

  const ageMs = Math.max(0, input.nowMs - input.lastAtMs);
  const status: FreshnessStatus = ageMs <= input.thresholdMs ? 'PASS' : 'FAIL';
  return {
    status,
    thresholdMs: input.thresholdMs,
    ageMs,
    detail:
      status === 'PASS'
        ? `${input.label} freshness within threshold`
        : `${input.label} stale by ${ageMs - input.thresholdMs}ms`,
  };
};

export const buildRuntimeFreshnessSnapshot = async (
  nowMs = Date.now()
): Promise<RuntimeFreshnessSnapshot> => {
  const workerTopology = resolveWorkerTopologySnapshot();
  const workerHeartbeatThresholdMs = parsePositiveInt(
    process.env.RUNTIME_FRESHNESS_MAX_WORKER_HEARTBEAT_MS,
    60_000
  );
  const marketDataThresholdMs = parsePositiveInt(
    process.env.RUNTIME_FRESHNESS_MAX_MARKET_DATA_STALE_MS,
    120_000
  );
  const signalLagThresholdMs = parsePositiveInt(
    process.env.RUNTIME_FRESHNESS_MAX_SIGNAL_LAG_MS,
    90_000
  );
  const sessionHeartbeatThresholdMs = parsePositiveInt(
    process.env.RUNTIME_FRESHNESS_MAX_SESSION_HEARTBEAT_MS,
    120_000
  );
  const latestSignalThresholdMs = parsePositiveInt(
    process.env.RUNTIME_FRESHNESS_MAX_SIGNAL_AGE_MS,
    300_000
  );
  const requireLatestSignalForRunningSessions =
    process.env.RUNTIME_FRESHNESS_REQUIRE_SIGNAL_FOR_RUNNING_SESSIONS === 'true';

  const [runningSessions, latestCandleCache] = await Promise.all([
    prisma.botRuntimeSession.findMany({
      where: {
        status: 'RUNNING',
      },
      select: {
        id: true,
        botId: true,
        startedAt: true,
        lastHeartbeatAt: true,
      },
    }),
    prisma.marketCandleCache.findFirst({
      select: {
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    }),
  ]);

  const latestSessionHeartbeatMs = runningSessions.reduce<number | null>((current, session) => {
    if (!session.lastHeartbeatAt) return current;
    const next = session.lastHeartbeatAt.getTime();
    if (current === null) return next;
    return Math.max(current, next);
  }, null);
  const marketDataCandidates = [
    parseEnvDate(process.env.WORKER_LAST_MARKET_DATA_AT),
    latestCandleCache?.updatedAt?.getTime() ?? null,
    latestSessionHeartbeatMs,
  ].filter((value): value is number => typeof value === 'number' && Number.isFinite(value));
  const workerHeartbeatLastAtMs =
    parseEnvDate(process.env.WORKER_LAST_HEARTBEAT_AT) ?? latestSessionHeartbeatMs;
  const marketDataLastAtMs =
    marketDataCandidates.length > 0 ? Math.max(...marketDataCandidates) : null;
  const shouldSkipPassiveInlineFreshness =
    workerTopology.topologyStatus === 'local_inline' &&
    runningSessions.length === 0 &&
    workerHeartbeatLastAtMs === null &&
    marketDataLastAtMs === null;

  const workerHeartbeatCheck = shouldSkipPassiveInlineFreshness
    ? {
        status: 'SKIP' as const,
        thresholdMs: workerHeartbeatThresholdMs,
        ageMs: null,
        detail: 'worker heartbeat check skipped in current mode without active runtime demand',
      }
    : computeTimeCheck({
        label: 'worker heartbeat',
        lastAtMs: workerHeartbeatLastAtMs,
        nowMs,
        thresholdMs: workerHeartbeatThresholdMs,
      });

  const marketDataCheck = shouldSkipPassiveInlineFreshness
    ? {
        status: 'SKIP' as const,
        thresholdMs: marketDataThresholdMs,
        ageMs: null,
        detail: 'market data freshness skipped in current mode without active runtime demand',
      }
    : computeTimeCheck({
        label: 'market data',
        lastAtMs: marketDataLastAtMs,
        nowMs,
        thresholdMs: marketDataThresholdMs,
      });

  const runtimeSignalLagMs = Math.max(0, metricsStore.snapshot().runtime.signalLag.lastMs);
  const runtimeSignalLagCheck: FreshnessCheck = {
    status: runtimeSignalLagMs <= signalLagThresholdMs ? 'PASS' : 'FAIL',
    thresholdMs: signalLagThresholdMs,
    ageMs: runtimeSignalLagMs,
    detail:
      runtimeSignalLagMs <= signalLagThresholdMs
        ? 'runtime signal lag within threshold'
        : 'runtime signal lag exceeded threshold',
  };

  const staleSessionIds = runningSessions
    .filter((session) => {
      if (!session.lastHeartbeatAt) return true;
      return nowMs - session.lastHeartbeatAt.getTime() > sessionHeartbeatThresholdMs;
    })
    .map((session) => session.id);

  const runtimeSessionsCheck: RuntimeFreshnessSnapshot['checks']['runtimeSessions'] = {
    status: staleSessionIds.length === 0 ? 'PASS' : 'FAIL',
    thresholdMs: sessionHeartbeatThresholdMs,
    ageMs: null,
    runningCount: runningSessions.length,
    staleSessionIds,
    detail:
      staleSessionIds.length === 0
        ? 'runtime sessions heartbeat healthy'
        : `${staleSessionIds.length} running session(s) stale`,
  };

  const requireDecisionActivity =
    requireLatestSignalForRunningSessions && runningSessions.length > 0;
  const latestRuntimeDecisionEvents = requireDecisionActivity
    ? await prisma.botRuntimeEvent.findMany({
        where: {
          sessionId: {
            in: runningSessions.map((session) => session.id),
          },
          eventType: {
            in: [
              'SIGNAL_DECISION',
              'PRETRADE_BLOCKED',
              'ORDER_SUBMITTED',
              'ORDER_FILLED',
              'POSITION_OPENED',
              'POSITION_CLOSED',
              'DCA_EXECUTED',
            ],
          },
        },
        select: {
          sessionId: true,
          eventAt: true,
        },
        orderBy: [{ eventAt: 'desc' }],
      })
    : [];
  const latestDecisionAtBySessionId = new Map<string, Date>();
  for (const runtimeEvent of latestRuntimeDecisionEvents) {
    if (!latestDecisionAtBySessionId.has(runtimeEvent.sessionId)) {
      latestDecisionAtBySessionId.set(runtimeEvent.sessionId, runtimeEvent.eventAt);
    }
  }
  const staleDecisionSessionIds = requireDecisionActivity
    ? runningSessions
        .filter((session) => {
          const latestDecisionAt = latestDecisionAtBySessionId.get(session.id);
          if (!latestDecisionAt) return true;
          return nowMs - latestDecisionAt.getTime() > latestSignalThresholdMs;
        })
        .map((session) => session.id)
    : [];
  const latestDecisionAgeMs =
    requireDecisionActivity && latestDecisionAtBySessionId.size > 0
      ? Math.max(
          0,
          Math.min(
            ...[...latestDecisionAtBySessionId.values()].map((eventAt) => nowMs - eventAt.getTime())
          )
        )
      : null;
  const runtimeDecisionActivityCheck: RuntimeFreshnessSnapshot['checks']['runtimeDecisionActivity'] = (() => {
    if (!requireDecisionActivity) {
      return {
        status: 'SKIP',
        thresholdMs: latestSignalThresholdMs,
        ageMs: latestDecisionAgeMs,
        required: false,
        runningCount: runningSessions.length,
        staleSessionIds: [],
        detail: 'runtime decision activity freshness check disabled for running sessions',
      };
    }
    if (latestDecisionAtBySessionId.size === 0) {
      return {
        status: 'FAIL',
        thresholdMs: latestSignalThresholdMs,
        ageMs: null,
        required: true,
        runningCount: runningSessions.length,
        staleSessionIds: runningSessions.map((session) => session.id),
        detail: 'runtime decision activity missing for active runtime sessions',
      };
    }
    return {
      status: staleDecisionSessionIds.length === 0 ? 'PASS' : 'FAIL',
      thresholdMs: latestSignalThresholdMs,
      ageMs: latestDecisionAgeMs,
      required: true,
      runningCount: runningSessions.length,
      staleSessionIds: staleDecisionSessionIds,
      detail:
        staleDecisionSessionIds.length === 0
          ? 'runtime decision activity freshness within threshold for active sessions'
          : 'runtime decision activity is stale for one or more active sessions',
    };
  })();

  const checks = {
    workerHeartbeat: workerHeartbeatCheck,
    marketData: marketDataCheck,
    runtimeSignalLag: runtimeSignalLagCheck,
    runtimeSessions: runtimeSessionsCheck,
    runtimeDecisionActivity: runtimeDecisionActivityCheck,
  };
  const statuses = [
    checks.workerHeartbeat.status,
    checks.marketData.status,
    checks.runtimeSignalLag.status,
    checks.runtimeSessions.status,
    checks.runtimeDecisionActivity.status,
  ];
  const status = statuses.includes('FAIL') ? 'FAIL' : 'PASS';

  return {
    status,
    checkedAt: new Date(nowMs).toISOString(),
    checks,
  };
};
