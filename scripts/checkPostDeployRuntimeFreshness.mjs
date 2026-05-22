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
    baseUrl: process.env.DEPLOY_FRESHNESS_API_BASE_URL ?? 'http://localhost:3001',
    authToken: process.env.DEPLOY_FRESHNESS_AUTH_TOKEN ?? '',
    authEmail: process.env.DEPLOY_FRESHNESS_AUTH_EMAIL ?? '',
    authPassword: process.env.DEPLOY_FRESHNESS_AUTH_PASSWORD ?? '',
    opsAuthHeaderName: process.env.DEPLOY_FRESHNESS_OPS_AUTH_HEADER_NAME ?? '',
    opsAuthHeaderValue: process.env.DEPLOY_FRESHNESS_OPS_AUTH_HEADER_VALUE ?? '',
    opsBasicUser: process.env.DEPLOY_FRESHNESS_OPS_BASIC_USER ?? '',
    opsBasicPassword: process.env.DEPLOY_FRESHNESS_OPS_BASIC_PASSWORD ?? '',
    timeoutMs: Number.parseInt(process.env.DEPLOY_FRESHNESS_TIMEOUT_MS ?? '10000', 10),
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      return options;
    }
    if (SECRET_CLI_FLAGS.has(arg)) {
      throw new Error(`${arg} is secret-bearing and must be provided through DEPLOY_FRESHNESS_* environment variables`);
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
    'Usage: node scripts/checkPostDeployRuntimeFreshness.mjs [--base-url <url>] [--auth-email <email>] [--ops-basic-user <user>] [--ops-auth-header-name <name>] [--timeout-ms <ms>]\n\nSecret-bearing values must be provided through DEPLOY_FRESHNESS_AUTH_TOKEN, DEPLOY_FRESHNESS_AUTH_PASSWORD, DEPLOY_FRESHNESS_OPS_BASIC_PASSWORD, and DEPLOY_FRESHNESS_OPS_AUTH_HEADER_VALUE.'
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

const main = async () => {
  const options = parseArgs();
  if (options.help) {
    printUsage();
    process.exit(0);
  }

  const baseUrl = options.baseUrl.replace(/\/+$/, '');
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
    contextLabel: 'ops:deploy:runtime-freshness',
  });
  const target = `${baseUrl}/workers/runtime-freshness`;
  const headers = buildOpsRequestHeaders({
    token: resolvedAuth.token,
    ...authLayer,
  });

  const response = await fetchWithTimeout(
    target,
    {
      method: 'GET',
      headers,
    },
    Number.isFinite(options.timeoutMs) && options.timeoutMs > 0 ? options.timeoutMs : 10000
  );

  if (!response.ok) {
    throw new Error(`runtime freshness request failed with HTTP ${response.status}`);
  }

  const payload = await response.json();
  const status = String(payload?.status ?? 'UNKNOWN').toUpperCase();
  if (status !== 'PASS') {
    console.log('[ops:deploy:runtime-freshness] status:', status);
    console.log(
      '[ops:deploy:runtime-freshness] checks:',
      JSON.stringify(payload?.checks ?? {}, null, 2)
    );
    throw new Error('runtime freshness gate failed');
  }

  console.log('[ops:deploy:runtime-freshness] PASS');
  console.log(
    '[ops:deploy:runtime-freshness] checks:',
    JSON.stringify(payload?.checks ?? {}, null, 2)
  );
};

main().catch((error) => {
  console.error(
    '[ops:deploy:runtime-freshness] failed:',
    error instanceof Error ? error.message : String(error)
  );
  process.exit(1);
});
