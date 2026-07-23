import process from 'node:process';
import {
  buildOpsRequestHeaders,
  resolveOpsAuthLayerOptions,
} from './buildOpsRequestHeaders.mjs';
import { resolveOpsAuthToken } from './resolveOpsAuthToken.mjs';

const rawArgs = process.argv.slice(2);
const args = new Set(rawArgs);

const readArgValue = (flag) => {
  const index = rawArgs.indexOf(flag);
  if (index === -1) return '';
  return rawArgs[index + 1] ?? '';
};

if (args.has('--help') || args.has('-h')) {
  process.stdout.write(
    [
      'Usage: node scripts/deploySmokeCheck.mjs [--base-url <url>] [--api-base-url <url>] [--web-base-url <url>] [--expected-sha <sha>] [--no-workers|--skip-workers] [--auth-token <token>] [--auth-email <email>] [--auth-password <password>] [--ops-basic-user <user>] [--ops-basic-password <password>] [--ops-auth-header-name <name>] [--ops-auth-header-value <value>]',
      '',
      'Env:',
      '  SMOKE_API_BASE_URL       (default: http://localhost:3001)',
      '  SMOKE_WEB_BASE_URL       (default: http://localhost:3002)',
      '  SMOKE_TIMEOUT_MS         (default: 8000)',
      '  SMOKE_TRANSIENT_RETRIES  (default: 1; retries fetch abort/timeout failures only)',
      '  SMOKE_AUTH_TOKEN         (optional bearer token for protected OPS endpoints)',
      '  SMOKE_AUTH_EMAIL         (optional admin email used to auto-login and obtain token)',
      '  SMOKE_AUTH_PASSWORD      (optional admin password used to auto-login and obtain token)',
      '  SMOKE_OPS_BASIC_USER     (optional private OPS basic-auth username)',
      '  SMOKE_OPS_BASIC_PASSWORD (optional private OPS basic-auth password)',
      '  SMOKE_OPS_AUTH_HEADER_NAME  (optional extra private OPS header name)',
      '  SMOKE_OPS_AUTH_HEADER_VALUE (optional extra private OPS header value)',
      '  SMOKE_REQUIRE_WORKERS    (default: true)',
    ].join('\n') + '\n',
  );
  process.exit(0);
}

const apiBase = (
  readArgValue('--base-url') ||
  readArgValue('--api-base-url') ||
  process.env.SMOKE_API_BASE_URL ||
  'http://localhost:3001'
).replace(/\/+$/, '');
const webBase = (readArgValue('--web-base-url') || process.env.SMOKE_WEB_BASE_URL || 'http://localhost:3002').replace(
  /\/+$/,
  '',
);
const timeoutMs = Number(process.env.SMOKE_TIMEOUT_MS || 8000);
const transientRetryCount = Math.max(0, Number(process.env.SMOKE_TRANSIENT_RETRIES || 1));
const expectedSha = (readArgValue('--expected-sha') || process.env.SMOKE_EXPECTED_SHA || '').trim();
const authTokenArg = readArgValue('--auth-token');
const authEmailArg = readArgValue('--auth-email');
const authPasswordArg = readArgValue('--auth-password');
const configuredAuthToken = (authTokenArg || process.env.SMOKE_AUTH_TOKEN || '').trim();
const configuredAuthEmail = (authEmailArg || process.env.SMOKE_AUTH_EMAIL || '').trim();
const configuredAuthPassword = (authPasswordArg || process.env.SMOKE_AUTH_PASSWORD || '').trim();
const configuredOpsBasicUser = (readArgValue('--ops-basic-user') || process.env.SMOKE_OPS_BASIC_USER || '').trim();
const configuredOpsBasicPassword = (
  readArgValue('--ops-basic-password') || process.env.SMOKE_OPS_BASIC_PASSWORD || ''
).trim();
const configuredOpsAuthHeaderName = (
  readArgValue('--ops-auth-header-name') || process.env.SMOKE_OPS_AUTH_HEADER_NAME || ''
).trim();
const configuredOpsAuthHeaderValue = (
  readArgValue('--ops-auth-header-value') || process.env.SMOKE_OPS_AUTH_HEADER_VALUE || ''
).trim();
const skipWorkers = args.has('--no-workers') || args.has('--skip-workers');
const requireWorkers =
  !skipWorkers && String(process.env.SMOKE_REQUIRE_WORKERS || 'true').toLowerCase() !== 'false';
const authLayer = resolveOpsAuthLayerOptions({
  opsAuthHeaderName: configuredOpsAuthHeaderName,
  opsAuthHeaderValue: configuredOpsAuthHeaderValue,
  opsBasicUser: configuredOpsBasicUser,
  opsBasicPassword: configuredOpsBasicPassword,
});
const resolvedAuth = await resolveOpsAuthToken({
  baseUrl: apiBase,
  authToken: configuredAuthToken,
  authEmail: configuredAuthEmail,
  authPassword: configuredAuthPassword,
  ...authLayer,
  contextLabel: 'ops:deploy:smoke',
});
const authHeaders = buildOpsRequestHeaders({
  token: resolvedAuth.token,
  ...authLayer,
});

const checks = [
  {
    name: expectedSha ? `API /health (gitSha=${expectedSha})` : 'API /health',
    url: `${apiBase}/health`,
    method: 'GET',
    headers: authHeaders,
    expectReleaseSha: expectedSha || null,
  },
  { name: 'API /ready', url: `${apiBase}/ready`, method: 'GET', headers: authHeaders },
  { name: 'WEB /', url: `${webBase}/`, method: 'GET' },
  {
    name: expectedSha ? `WEB /api/build-info (gitSha=${expectedSha})` : 'WEB /api/build-info',
    url: `${webBase}/api/build-info`,
    method: 'GET',
    expectBuildInfoSha: expectedSha || null,
  },
];

if (requireWorkers) {
  checks.push({
    name: 'API /workers/ready',
    url: `${apiBase}/workers/ready`,
    method: 'GET',
    headers: authHeaders,
    expectReadyBody: true,
    expectWorkerReleaseSha: expectedSha || null,
  });
}

const describeTransientError = (error) => {
  if (!(error instanceof Error)) {
    return String(error);
  }
  if (error.name === 'AbortError') {
    return `timeout after ${timeoutMs}ms (${error.message})`;
  }
  return error.message;
};

const isTransientFetchError = (error) =>
  error instanceof Error &&
  (error.name === 'AbortError' ||
    error.name === 'TimeoutError' ||
    error.message === 'fetch failed' ||
    error.message === 'This operation was aborted');

const runCheckAttempt = async (check) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(check.url, {
      method: check.method,
      headers: check.headers,
      signal: controller.signal,
    });
    let body = null;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      body = await response.json().catch(() => null);
    }
    if (response.status >= 200 && response.status < 400) {
      if (
        check.expectReadyBody &&
        body &&
        (body.status === 'degraded' ||
          body.status === 'not_ready' ||
          body.topologyStatus === 'degraded')
      ) {
        return {
          ok: false,
          detail: `${response.status} ${body.status ?? 'unknown'}${body.topologyStatus ? ` topology=${body.topologyStatus}` : ''}`,
        };
      }
      if (check.expectBuildInfoSha) {
        const observedSha = typeof body?.gitSha === 'string' ? body.gitSha.trim() : '';
        if (!observedSha) {
          return { ok: false, detail: `${response.status} missing gitSha` };
        }
        if (observedSha !== check.expectBuildInfoSha) {
          return {
            ok: false,
            detail: `${response.status} gitSha mismatch observed=${observedSha} expected=${check.expectBuildInfoSha}`,
          };
        }
        return { ok: true, detail: `${response.status} gitSha=${observedSha}` };
      }
      if (check.expectReleaseSha) {
        const observedSha = typeof body?.release?.gitSha === 'string' ? body.release.gitSha.trim() : '';
        if (observedSha !== check.expectReleaseSha) {
          return {
            ok: false,
            detail: `${response.status} API release mismatch observed=${observedSha || 'missing'} expected=${check.expectReleaseSha}`,
          };
        }
        return { ok: true, detail: `${response.status} gitSha=${observedSha}` };
      }
      if (check.expectWorkerReleaseSha) {
        const heartbeats = Array.isArray(body?.heartbeats) ? body.heartbeats : [];
        const mismatches = heartbeats.filter(
          (heartbeat) => heartbeat?.releaseSha !== check.expectWorkerReleaseSha
        );
        if (heartbeats.length === 0 || mismatches.length > 0) {
          const workers = mismatches.map((heartbeat) => heartbeat?.worker ?? 'unknown').join(',');
          return {
            ok: false,
            detail: `${response.status} worker release mismatch workers=${workers || 'missing-heartbeats'} expected=${check.expectWorkerReleaseSha}`,
          };
        }
        return { ok: true, detail: `${response.status} workers=${heartbeats.length} gitSha=${check.expectWorkerReleaseSha}` };
      }
      return { ok: true, detail: `${response.status}` };
    }
    return { ok: false, detail: `status ${response.status}` };
  } catch (error) {
    return {
      ok: false,
      detail: describeTransientError(error),
      retryable: isTransientFetchError(error),
    };
  } finally {
    clearTimeout(timer);
  }
};

const runCheck = async (check) => {
  const transientFailures = [];
  const maxAttempts = transientRetryCount + 1;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    // eslint-disable-next-line no-await-in-loop
    const result = await runCheckAttempt(check);
    if (result.ok) {
      if (transientFailures.length === 0) {
        return result;
      }
      return {
        ...result,
        detail: `${result.detail} after ${attempt} attempts (transient retry: ${transientFailures.join('; ')})`,
      };
    }
    if (!result.retryable || attempt === maxAttempts) {
      if (transientFailures.length === 0) {
        return result;
      }
      return {
        ...result,
        detail: `${result.detail} after ${attempt} attempts (transient retry: ${transientFailures.join('; ')})`,
      };
    }
    transientFailures.push(`attempt ${attempt}: ${result.detail}`);
  }
  return { ok: false, detail: 'exhausted smoke check attempts' };
};

const results = [];
for (const check of checks) {
  // eslint-disable-next-line no-await-in-loop
  const result = await runCheck(check);
  results.push({ ...check, ...result });
}

process.stdout.write('[deploy-smoke] summary\n');
for (const row of results) {
  const icon = row.ok ? 'PASS' : 'FAIL';
  process.stdout.write(`- ${icon} ${row.name} -> ${row.detail}\n`);
}

const failed = results.filter((x) => !x.ok);
if (failed.length > 0) {
  process.stderr.write(`[deploy-smoke] failed checks: ${failed.length}\n`);
  process.exit(1);
}

process.stdout.write('[deploy-smoke] all checks passed\n');
