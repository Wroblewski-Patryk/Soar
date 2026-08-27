#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { resolveOpsAuthToken } from './resolveOpsAuthToken.mjs';

const rawArgs = process.argv.slice(2);
const args = new Set(rawArgs);

const readArgValue = (flag) => {
  const index = rawArgs.indexOf(flag);
  if (index === -1) return '';
  return rawArgs[index + 1] ?? '';
};

const normalizeBaseUrl = (value) => String(value ?? '').trim().replace(/\/+$/, '');

const printUsage = () => {
  process.stdout.write(
    [
      'Usage: node scripts/runProdSecurityExchangeProof.mjs [options]',
      '',
      'Options:',
      '  --web-base-url <url>',
      '  --api-base-url <url>',
      '  --expected-sha <sha>',
      '  --auth-token <token>',
      '  --auth-email <email>',
      '  --auth-password <password>',
      '  --output-json <path>',
      '  --output-md <path>',
      '  --today <yyyy-mm-dd>',
      '  --i-understand-production-security-exchange-proof',
      '',
      'Env:',
      '  PROD_SECURITY_EXCHANGE_WEB_BASE_URL, PROD_SECURITY_EXCHANGE_API_BASE_URL,',
      '  PROD_SECURITY_EXCHANGE_EXPECTED_SHA, PROD_SECURITY_EXCHANGE_AUTH_TOKEN,',
      '  PROD_SECURITY_EXCHANGE_AUTH_EMAIL, PROD_SECURITY_EXCHANGE_AUTH_PASSWORD,',
      '  PROD_SECURITY_EXCHANGE_OUTPUT_JSON, PROD_SECURITY_EXCHANGE_OUTPUT_MD',
    ].join('\n') + '\n'
  );
};

const resolveOptions = () => {
  const today = readArgValue('--today') || new Date().toISOString().slice(0, 10);
  const expectedSha = readArgValue('--expected-sha') || process.env.PROD_SECURITY_EXCHANGE_EXPECTED_SHA || '';
  const shortSha = expectedSha ? expectedSha.slice(0, 8) : 'current';
  return {
    webBaseUrl: normalizeBaseUrl(
      readArgValue('--web-base-url') ||
        process.env.PROD_SECURITY_EXCHANGE_WEB_BASE_URL ||
        'https://soar.luckysparrow.ch'
    ),
    apiBaseUrl: normalizeBaseUrl(
      readArgValue('--api-base-url') ||
        process.env.PROD_SECURITY_EXCHANGE_API_BASE_URL ||
        'https://api.soar.luckysparrow.ch'
    ),
    expectedSha,
    authToken: readArgValue('--auth-token') || process.env.PROD_SECURITY_EXCHANGE_AUTH_TOKEN || '',
    authEmail: readArgValue('--auth-email') || process.env.PROD_SECURITY_EXCHANGE_AUTH_EMAIL || '',
    authPassword: readArgValue('--auth-password') || process.env.PROD_SECURITY_EXCHANGE_AUTH_PASSWORD || '',
    outputJson:
      readArgValue('--output-json') ||
      process.env.PROD_SECURITY_EXCHANGE_OUTPUT_JSON ||
      path.join(
        'docs',
        'operations',
        `_artifacts-prod-security-exchange-proof-${shortSha}-${today}.json`
      ),
    outputMd:
      readArgValue('--output-md') ||
      process.env.PROD_SECURITY_EXCHANGE_OUTPUT_MD ||
      path.join('docs', 'operations', `prod-security-exchange-proof-${shortSha}-${today}.md`),
    today,
    approved: args.has('--i-understand-production-security-exchange-proof'),
  };
};

const readJson = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { rawPreview: text.slice(0, 160) };
  }
};

const requestJson = async ({
  apiBaseUrl,
  token = '',
  method = 'GET',
  route,
  body,
  origin,
  cookieToken = token,
}) => {
  const response = await fetch(`${apiBaseUrl}${route}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'content-type': 'application/json' } : {}),
      ...(cookieToken ? { Cookie: `token=${encodeURIComponent(cookieToken)}` } : {}),
      ...(origin ? { Origin: origin } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await readJson(response);
  return { response, payload };
};

const assertStatus = (label, actual, expected) => {
  const expectedValues = Array.isArray(expected) ? expected : [expected];
  if (!expectedValues.includes(actual)) {
    throw new Error(`${label} expected HTTP ${expectedValues.join('/')} but got ${actual}`);
  }
};

const toStep = (name, status, extra = {}) => ({ name, status, ...extra });

const hasNoStoreHeaders = (response) => {
  const cacheControl = response.headers.get('cache-control') || '';
  const pragma = response.headers.get('pragma') || '';
  return cacheControl.toLowerCase().includes('no-store') && pragma.toLowerCase().includes('no-cache');
};

const hasSecurityHeaders = (response) => {
  return Boolean(response.headers.get('x-content-type-options')) &&
    Boolean(response.headers.get('x-frame-options'));
};

const payloadContainsKeyMaterial = (value) => {
  const text = JSON.stringify(value ?? {});
  return /apiSecret|api_secret|secretKey|privateKey|token=|set-cookie|authorization|KEY_PLACEHOLDER|SECRET_PLACEHOLDER/i.test(
    text
  );
};

const readCatalogMarkets = (payload) => {
  if (Array.isArray(payload?.markets)) return payload.markets;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload)) return payload;
  return [];
};

const renderMarkdown = (payload, jsonPath) => {
  const steps = payload.steps
    .map((step) => `| ${step.name} | ${step.status} | ${step.httpStatus ?? '-'} | ${step.notes ?? '-'} |`)
    .join('\n');
  const blockers = payload.blockers.map((item) => `- ${item}`).join('\n') || '- none';

  return `# Production Security And Exchange Proof

## Status
- Result: **${payload.status}**
- Environment: production
- Evidence date: ${payload.today}
- Generated at (UTC): ${payload.generatedAt}
- Expected SHA: \`${payload.expectedSha || 'not provided'}\`
- Observed build-info SHA: \`${payload.buildInfo.gitSha || 'n/a'}\`
- Raw JSON: \`${jsonPath}\`

## Scope

This proof is read-only or fail-closed only. It does not submit LIVE orders,
cancel LIVE orders, close positions, mutate exchange-side state, or persist raw
credentials in artifacts.

Covered modules in this slice: Exchange Adapter and Security/Privacy.

## Steps
| Step | Result | HTTP | Notes |
| --- | --- | --- | --- |
${steps}

## Blockers
${blockers}

## Redaction Notes
- Auth tokens, passwords, cookies, private headers, raw API-key values, API
  secrets, and response bodies that may contain secrets are not written to this
  artifact.
- Payloads are summarized only as booleans/counts/status codes.
`;
};

const main = async () => {
  if (args.has('--help') || args.has('-h')) {
    printUsage();
    return;
  }

  const options = resolveOptions();
  if (!options.approved) {
    throw new Error('missing --i-understand-production-security-exchange-proof approval flag');
  }

  const generatedAt = new Date().toISOString();
  const steps = [];
  const blockers = [];
  let fatalError = null;

  const buildInfoResponse = await fetch(`${options.webBaseUrl}/api/build-info`, {
    headers: { Accept: 'application/json', 'Cache-Control': 'no-cache' },
  });
  const buildInfoPayload = await readJson(buildInfoResponse);
  const buildInfo = {
    status: buildInfoResponse.status,
    ok: buildInfoResponse.ok,
    gitSha: buildInfoPayload?.gitSha ?? '',
  };
  const buildMatches = options.expectedSha
    ? String(buildInfo.gitSha).startsWith(options.expectedSha)
    : buildInfo.ok;
  steps.push(
    toStep('build-info freshness', buildMatches ? 'PASS' : 'FAIL', {
      httpStatus: buildInfo.status,
      notes: buildMatches ? 'deployed build matches expected SHA' : 'deployed build mismatch',
    })
  );
  if (!buildMatches) throw new Error('build-info does not match expected SHA');

  const auth = await resolveOpsAuthToken({
    baseUrl: options.apiBaseUrl,
    authToken: options.authToken,
    authEmail: options.authEmail,
    authPassword: options.authPassword,
    contextLabel: 'prod-security-exchange-proof',
  });
  if (!auth.token) throw new Error('production security/exchange proof auth missing');
  steps.push(toStep('auth token resolved', 'PASS', { notes: `${auth.source}:present` }));

  try {
    const health = await requestJson({ apiBaseUrl: options.apiBaseUrl, route: '/health' });
    assertStatus('health', health.response.status, 200);
    if (!hasSecurityHeaders(health.response)) throw new Error('/health missing expected security headers');
    steps.push(toStep('security headers present', 'PASS', { httpStatus: health.response.status }));

    const publicReady = await requestJson({ apiBaseUrl: options.apiBaseUrl, route: '/ready' });
    assertStatus('ready public', publicReady.response.status, 200);
    if (publicReady.payload?.status !== 'ready') throw new Error('/ready did not report ready');
    steps.push(toStep('public readiness minimal response', 'PASS', { httpStatus: publicReady.response.status }));

    const noAuthDashboard = await requestJson({ apiBaseUrl: options.apiBaseUrl, route: '/dashboard/profile/basic' });
    assertStatus('unauthenticated protected route', noAuthDashboard.response.status, 401);
    if (payloadContainsKeyMaterial(noAuthDashboard.payload)) {
      throw new Error('unauthenticated protected route payload contained key material');
    }
    steps.push(toStep('unauthenticated protected route fail-closed', 'PASS', {
      httpStatus: noAuthDashboard.response.status,
    }));

    const noAuthOps = await requestJson({ apiBaseUrl: options.apiBaseUrl, route: '/ready/details' });
    assertStatus('unauthenticated ops diagnostics', noAuthOps.response.status, 401);
    if (noAuthOps.payload?.missing || noAuthOps.payload?.issues) {
      throw new Error('unauthenticated ops diagnostics exposed readiness internals');
    }
    steps.push(toStep('unauthenticated ops diagnostics fail-closed', 'PASS', {
      httpStatus: noAuthOps.response.status,
    }));

    const noAuthMetrics = await requestJson({ apiBaseUrl: options.apiBaseUrl, route: '/metrics' });
    assertStatus('unauthenticated metrics', noAuthMetrics.response.status, 401);
    steps.push(toStep('unauthenticated metrics fail-closed', 'PASS', { httpStatus: noAuthMetrics.response.status }));

    const authenticatedProfile = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: '/dashboard/profile/basic',
    });
    assertStatus('authenticated profile read', authenticatedProfile.response.status, 200);
    if (!hasNoStoreHeaders(authenticatedProfile.response)) {
      throw new Error('authenticated profile response missing no-store headers');
    }
    if (payloadContainsKeyMaterial(authenticatedProfile.payload)) {
      throw new Error('authenticated profile payload contained key material');
    }
    steps.push(toStep('authenticated no-store profile read', 'PASS', {
      httpStatus: authenticatedProfile.response.status,
    }));

    const apiKeysList = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: '/dashboard/profile/apiKeys',
    });
    assertStatus('profile api keys list', apiKeysList.response.status, 200);
    if (payloadContainsKeyMaterial(apiKeysList.payload)) {
      throw new Error('profile api keys list exposed raw key material');
    }
    const apiKeyCount = Array.isArray(apiKeysList.payload) ? apiKeysList.payload.length : 0;
    steps.push(toStep('profile api key list redaction', 'PASS', {
      httpStatus: apiKeysList.response.status,
      notes: `items=${apiKeyCount}`,
    }));

    const untrustedOrigin = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      method: 'POST',
      route: '/dashboard/profile/apiKeys/test',
      origin: 'https://evil.example',
      body: {
        exchange: 'BINANCE',
        apiKey: 'KEY_PLACEHOLDER',
        apiSecret: 'SECRET_PLACEHOLDER',
      },
    });
    assertStatus('untrusted origin state change', untrustedOrigin.response.status, 403);
    steps.push(toStep('untrusted origin state change fail-closed', 'PASS', {
      httpStatus: untrustedOrigin.response.status,
    }));

    const unsupportedProbe = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      method: 'POST',
      route: '/dashboard/profile/apiKeys/test',
      body: {
        exchange: 'COINBASE',
        apiKey: 'KEY_PLACEHOLDER',
        apiSecret: 'SECRET_PLACEHOLDER',
      },
    });
    assertStatus('unsupported exchange probe', unsupportedProbe.response.status, 501);
    const unsupportedDetails = unsupportedProbe.payload?.error?.details;
    if (unsupportedDetails?.exchange !== 'COINBASE' || unsupportedDetails?.capability !== 'API_KEY_PROBE') {
      throw new Error('unsupported exchange probe did not expose expected fail-closed capability details');
    }
    if (payloadContainsKeyMaterial(unsupportedProbe.payload)) {
      throw new Error('unsupported exchange probe payload contained key material');
    }
    steps.push(toStep('unsupported exchange probe fail-closed', 'PASS', {
      httpStatus: unsupportedProbe.response.status,
      notes: 'COINBASE API_KEY_PROBE unsupported',
    }));

    const binanceCatalog = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: '/dashboard/markets/catalog?exchange=BINANCE&marketType=FUTURES&baseCurrency=USDT',
    });
    assertStatus('binance market catalog', binanceCatalog.response.status, 200);
    const binanceItems = readCatalogMarkets(binanceCatalog.payload);
    if (binanceItems.length === 0) throw new Error('Binance catalog returned no items');
    steps.push(toStep('binance futures catalog read-only', 'PASS', {
      httpStatus: binanceCatalog.response.status,
      notes: `items=${binanceItems.length}`,
    }));

    const gateioCatalog = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: '/dashboard/markets/catalog?exchange=GATEIO&marketType=FUTURES&baseCurrency=USDT',
    });
    assertStatus('gateio market catalog', gateioCatalog.response.status, 200);
    const gateioItems = readCatalogMarkets(gateioCatalog.payload);
    if (gateioItems.length === 0) throw new Error('Gate.io catalog returned no items');
    const hasUnderscoreCanonicalSymbol = gateioItems.some((item) => {
      const symbol = typeof item?.symbol === 'string' ? item.symbol : '';
      return symbol.includes('_');
    });
    if (hasUnderscoreCanonicalSymbol) {
      throw new Error('Gate.io catalog returned non-canonical underscore symbol');
    }
    steps.push(toStep('gateio futures catalog canonical read-only', 'PASS', {
      httpStatus: gateioCatalog.response.status,
      notes: `items=${gateioItems.length}`,
    }));

    const readyDetails = await requestJson({
      apiBaseUrl: options.apiBaseUrl,
      token: auth.token,
      route: '/ready/details',
    });
    assertStatus('authenticated ops readiness details', readyDetails.response.status, 200);
    if (readyDetails.payload?.status !== 'ready') throw new Error('/ready/details did not report ready');
    steps.push(toStep('authenticated ops readiness details', 'PASS', {
      httpStatus: readyDetails.response.status,
      notes: `noOrderGuard=${Boolean(readyDetails.payload?.runtimeSafety?.liveNoOrderGuard?.active)}`,
    }));
  } catch (error) {
    fatalError = error instanceof Error ? error.message : String(error);
    blockers.push(fatalError);
  }

  if (fatalError) steps.push(toStep('proof execution stopped', 'FAIL', { notes: fatalError }));
  const status = blockers.length > 0 ? 'PARTIAL' : 'PASS';
  const payload = {
    status,
    today: options.today,
    generatedAt,
    environment: 'production',
    webBaseUrl: options.webBaseUrl,
    apiBaseUrl: options.apiBaseUrl,
    expectedSha: options.expectedSha,
    buildInfo,
    steps,
    blockers,
  };

  await mkdir(path.dirname(path.resolve(process.cwd(), options.outputJson)), { recursive: true });
  await mkdir(path.dirname(path.resolve(process.cwd(), options.outputMd)), { recursive: true });
  await writeFile(options.outputJson, `${JSON.stringify(payload, null, 2)}\n`);
  await writeFile(options.outputMd, renderMarkdown(payload, path.relative(process.cwd(), options.outputJson)));

  process.stdout.write(`[prod-security-exchange-proof] JSON report: ${options.outputJson}\n`);
  process.stdout.write(`[prod-security-exchange-proof] Markdown report: ${options.outputMd}\n`);
  process.stdout.write(`[prod-security-exchange-proof] status=${status}\n`);
  if (status !== 'PASS') process.exit(1);
};

main().catch((error) => {
  console.error(
    '[prod-security-exchange-proof] failed:',
    error instanceof Error ? error.message : String(error)
  );
  process.exit(1);
});
