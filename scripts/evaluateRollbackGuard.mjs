#!/usr/bin/env node
import {
  buildOpsRequestHeaders,
  resolveOpsAuthLayerOptions,
} from './buildOpsRequestHeaders.mjs';
import { resolveOpsAuthToken } from './resolveOpsAuthToken.mjs';

const SECRET_CLI_FLAGS = new Set([
  '--auth-token',
  '--auth-password',
  '--ops-basic-password',
  '--ops-auth-header-value',
]);

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    baseUrl: process.env.ROLLBACK_GUARD_API_BASE_URL ?? 'http://localhost:3001',
    authToken: process.env.ROLLBACK_GUARD_AUTH_TOKEN ?? '',
    authEmail: process.env.ROLLBACK_GUARD_AUTH_EMAIL ?? '',
    authPassword: process.env.ROLLBACK_GUARD_AUTH_PASSWORD ?? '',
    opsAuthHeaderName: process.env.ROLLBACK_GUARD_OPS_AUTH_HEADER_NAME ?? '',
    opsAuthHeaderValue: process.env.ROLLBACK_GUARD_OPS_AUTH_HEADER_VALUE ?? '',
    opsBasicUser: process.env.ROLLBACK_GUARD_OPS_BASIC_USER ?? '',
    opsBasicPassword: process.env.ROLLBACK_GUARD_OPS_BASIC_PASSWORD ?? '',
    timeoutMs: Number.parseInt(process.env.ROLLBACK_GUARD_TIMEOUT_MS ?? '10000', 10),
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      return options;
    }
    if (SECRET_CLI_FLAGS.has(arg)) {
      throw new Error(`${arg} is secret-bearing and must be provided through ROLLBACK_GUARD_* environment variables`);
    }
    if (arg === '--base-url') options.baseUrl = args[index + 1] ?? options.baseUrl;
    if (arg === '--auth-email') options.authEmail = args[index + 1] ?? options.authEmail;
    if (arg === '--ops-auth-header-name') {
      options.opsAuthHeaderName = args[index + 1] ?? options.opsAuthHeaderName;
    }
    if (arg === '--ops-basic-user') options.opsBasicUser = args[index + 1] ?? options.opsBasicUser;
    if (arg === '--timeout-ms') {
      options.timeoutMs = Number.parseInt(args[index + 1] ?? String(options.timeoutMs), 10);
    }
  }

  return options;
};

const printUsage = () => {
  console.log(
    'Usage: node scripts/evaluateRollbackGuard.mjs [--base-url <url>] [--auth-email <email>] [--ops-basic-user <user>] [--ops-auth-header-name <name>] [--timeout-ms <ms>]\n\nSecret-bearing values must be provided through ROLLBACK_GUARD_AUTH_TOKEN, ROLLBACK_GUARD_AUTH_PASSWORD, ROLLBACK_GUARD_OPS_BASIC_PASSWORD, and ROLLBACK_GUARD_OPS_AUTH_HEADER_VALUE.'
  );
};

const fetchWithTimeout = async (url, options, timeoutMs) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

const isRollbackCriticalAlert = (alert) => {
  const code = String(alert?.code ?? '');
  const severity = String(alert?.severity ?? '').toUpperCase();
  if (code === 'worker_heartbeat_missing') return true;
  if (code === 'market_data_staleness') return true;
  if (code === 'runtime_signal_lag_stale') return true;
  if (code === 'runtime_restarts_repeated' && severity === 'SEV-1') return true;
  if (code === 'runtime_reconciliation_drift' && severity === 'SEV-1') return true;
  return false;
};

const main = async () => {
  const options = parseArgs();
  if (options.help) {
    printUsage();
    process.exit(0);
  }

  const baseUrl = options.baseUrl.replace(/\/+$/, '');
  const timeoutMs = Number.isFinite(options.timeoutMs) && options.timeoutMs > 0 ? options.timeoutMs : 10000;
  const authLayer = resolveOpsAuthLayerOptions({
    opsAuthHeaderName: options.opsAuthHeaderName,
    opsAuthHeaderValue: options.opsAuthHeaderValue,
    opsBasicUser: options.opsBasicUser,
    opsBasicPassword: options.opsBasicPassword,
  });
  const resolvedAuth = await resolveOpsAuthToken({
    baseUrl,
    authToken: options.authToken,
    authEmail: options.authEmail,
    authPassword: options.authPassword,
    ...authLayer,
    contextLabel: 'ops:deploy:rollback-guard',
  });
  const headers = buildOpsRequestHeaders({
    token: resolvedAuth.token,
    ...authLayer,
  });

  const decision = {
    checkedAt: new Date().toISOString(),
    shouldRollback: false,
    reasons: [],
    freshness: null,
    alerts: [],
  };

  const freshnessResponse = await fetchWithTimeout(
    `${baseUrl}/workers/runtime-freshness`,
    { method: 'GET', headers },
    timeoutMs
  );
  if (!freshnessResponse.ok) {
    decision.shouldRollback = true;
    decision.reasons.push(`runtime_freshness_endpoint_http_${freshnessResponse.status}`);
  } else {
    const freshnessPayload = await freshnessResponse.json();
    decision.freshness = {
      status: freshnessPayload?.status ?? 'UNKNOWN',
      checks: freshnessPayload?.checks ?? null,
    };
    if (String(freshnessPayload?.status ?? '').toUpperCase() !== 'PASS') {
      decision.shouldRollback = true;
      decision.reasons.push('runtime_freshness_failed');
    }
  }

  const alertsResponse = await fetchWithTimeout(`${baseUrl}/alerts`, { method: 'GET', headers }, timeoutMs);
  if (!alertsResponse.ok) {
    decision.shouldRollback = true;
    decision.reasons.push(`alerts_endpoint_http_${alertsResponse.status}`);
  } else {
    const alertsPayload = await alertsResponse.json();
    const alerts = Array.isArray(alertsPayload?.alerts) ? alertsPayload.alerts : [];
    decision.alerts = alerts;
    const criticalAlerts = alerts.filter(isRollbackCriticalAlert);
    if (criticalAlerts.length > 0) {
      decision.shouldRollback = true;
      decision.reasons.push(
        ...criticalAlerts.map(
          (alert) => `critical_alert:${alert.code}:${String(alert.severity ?? '').toUpperCase()}`
        )
      );
    }
  }

  console.log(JSON.stringify(decision, null, 2));
  if (decision.shouldRollback) {
    process.exit(1);
  }
};

main().catch((error) => {
  console.error(
    '[ops:deploy:rollback-guard] failed:',
    error instanceof Error ? error.message : String(error)
  );
  process.exit(1);
});
