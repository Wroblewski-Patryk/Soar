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
      'Usage: node scripts/deploySmokeCheck.mjs [--base-url <url>] [--api-base-url <url>] [--web-base-url <url>] [--no-workers] [--auth-token <token>] [--auth-email <email>] [--auth-password <password>] [--ops-basic-user <user>] [--ops-basic-password <password>] [--ops-auth-header-name <name>] [--ops-auth-header-value <value>]',
      '',
      'Env:',
      '  SMOKE_API_BASE_URL       (default: http://localhost:3001)',
      '  SMOKE_WEB_BASE_URL       (default: http://localhost:3002)',
      '  SMOKE_TIMEOUT_MS         (default: 8000)',
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
const requireWorkers =
  !args.has('--no-workers') && String(process.env.SMOKE_REQUIRE_WORKERS || 'true').toLowerCase() !== 'false';
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
  { name: 'API /health', url: `${apiBase}/health`, method: 'GET', headers: authHeaders },
  { name: 'API /ready', url: `${apiBase}/ready`, method: 'GET', headers: authHeaders },
  { name: 'WEB /', url: `${webBase}/`, method: 'GET' },
];

if (requireWorkers) {
  checks.push({
    name: 'API /workers/health',
    url: `${apiBase}/workers/health`,
    method: 'GET',
    headers: authHeaders,
  });
}

const runCheck = async (check) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(check.url, {
      method: check.method,
      headers: check.headers,
      signal: controller.signal,
    });
    if (response.status >= 200 && response.status < 400) {
      return { ok: true, detail: `${response.status}` };
    }
    return { ok: false, detail: `status ${response.status}` };
  } catch (error) {
    return { ok: false, detail: error instanceof Error ? error.message : String(error) };
  } finally {
    clearTimeout(timer);
  }
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
