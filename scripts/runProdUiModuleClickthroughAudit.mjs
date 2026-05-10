#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { resolveOpsAuthToken } from './resolveOpsAuthToken.mjs';

const operationsDir = path.resolve(process.cwd(), 'docs', 'operations');
const rawArgs = process.argv.slice(2);
const args = new Set(rawArgs);

const readArgValue = (flag) => {
  const index = rawArgs.indexOf(flag);
  if (index === -1) return '';
  return rawArgs[index + 1] ?? '';
};

const normalizeBaseUrl = (value) => String(value ?? '').trim().replace(/\/+$/, '');
const normalizePath = (value) => {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  return raw.startsWith('/') ? raw : `/${raw}`;
};

const splitCsv = (value) =>
  String(value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const routeDefinitions = [
  { path: '/', area: 'public', expected: '200' },
  { path: '/auth/login', area: 'public', expected: '200' },
  { path: '/auth/register', area: 'public', expected: '200' },
  { path: '/offline', area: 'public', expected: '200' },
  { path: '/dashboard', area: 'dashboard', expected: 'authenticated' },
  { path: '/dashboard/exchanges', area: 'dashboard', expected: 'redirect:/dashboard/profile#api' },
  { path: '/dashboard/profile', area: 'dashboard', expected: 'authenticated' },
  { path: '/dashboard/wallets', area: 'dashboard', expected: 'redirect:/dashboard/wallets/list' },
  { path: '/dashboard/wallets/list', area: 'dashboard', expected: 'authenticated' },
  { path: '/dashboard/wallets/create', area: 'dashboard', expected: 'authenticated' },
  { path: '/dashboard/markets/list', area: 'dashboard', expected: 'authenticated' },
  { path: '/dashboard/markets/create', area: 'dashboard', expected: 'authenticated' },
  { path: '/dashboard/strategies/list', area: 'dashboard', expected: 'authenticated' },
  { path: '/dashboard/strategies/create', area: 'dashboard', expected: 'authenticated' },
  { path: '/dashboard/backtests/list', area: 'dashboard', expected: 'authenticated' },
  { path: '/dashboard/backtests/create', area: 'dashboard', expected: 'authenticated' },
  { path: '/dashboard/bots', area: 'dashboard', expected: 'authenticated' },
  { path: '/dashboard/bots/create', area: 'dashboard', expected: 'authenticated' },
  { path: '/dashboard/bots/assistant', area: 'dashboard', expected: 'redirect:/dashboard/bots' },
  { path: '/dashboard/bots/runtime', area: 'dashboard', expected: 'redirect:/dashboard/bots' },
  { path: '/dashboard/reports', area: 'dashboard', expected: 'authenticated' },
  { path: '/dashboard/logs', area: 'dashboard', expected: 'authenticated' },
  { path: '/dashboard/orders', area: 'legacy', expected: 'redirect:/dashboard/bots/runtime?legacy=orders' },
  { path: '/dashboard/positions', area: 'legacy', expected: 'redirect:/dashboard/bots/runtime?legacy=positions' },
  { path: '/dashboard/bots/new', area: 'legacy', expected: 'redirect:/dashboard/bots/create' },
  { path: '/admin', area: 'admin', expected: 'redirect:/admin/subscriptions' },
  { path: '/admin/users', area: 'admin', expected: 'admin' },
  { path: '/admin/subscriptions', area: 'admin', expected: 'admin' },
];

const moduleDefinitions = [
  { module: 'auth', route: '/auth/login', requiredAuth: 'none', checks: ['login route reachable'] },
  { module: 'dashboard-home', route: '/dashboard', requiredAuth: 'dashboard', checks: ['home route reachable'] },
  { module: 'profile/exchanges', route: '/dashboard/profile', requiredAuth: 'dashboard', checks: ['profile route reachable'] },
  { module: 'wallets', route: '/dashboard/wallets/list', requiredAuth: 'dashboard', checks: ['wallet list route reachable'] },
  { module: 'markets', route: '/dashboard/markets/list', requiredAuth: 'dashboard', checks: ['market list route reachable'] },
  { module: 'strategies', route: '/dashboard/strategies/list', requiredAuth: 'dashboard', checks: ['strategy list route reachable'] },
  { module: 'backtests', route: '/dashboard/backtests/list', requiredAuth: 'dashboard', checks: ['backtest list route reachable'] },
  { module: 'bots', route: '/dashboard/bots', requiredAuth: 'dashboard', checks: ['bot list route reachable'] },
  { module: 'runtime', route: '/dashboard/bots/runtime', requiredAuth: 'dashboard', checks: ['runtime route reachable'] },
  { module: 'reports', route: '/dashboard/reports', requiredAuth: 'dashboard', checks: ['reports route reachable'] },
  { module: 'logs', route: '/dashboard/logs', requiredAuth: 'dashboard', checks: ['logs route reachable'] },
  { module: 'admin/users', route: '/admin/users', requiredAuth: 'admin', checks: ['admin user route reachable'] },
  { module: 'admin/subscriptions', route: '/admin/subscriptions', requiredAuth: 'admin', checks: ['admin subscriptions route reachable'] },
];

const printUsage = () => {
  process.stdout.write(
    [
      'Usage: node scripts/runProdUiModuleClickthroughAudit.mjs [options]',
      '',
      'Options:',
      '  --web-base-url <url>          Web base URL',
      '  --api-base-url <url>          API base URL',
      '  --expected-sha <sha>          Expected production build-info SHA',
      '  --auth-token <token>          Dashboard user token',
      '  --auth-email <email>          Dashboard user email',
      '  --auth-password <password>    Dashboard user password',
      '  --admin-token <token>         Admin user token',
      '  --admin-email <email>         Admin user email',
      '  --admin-password <password>   Admin user password',
      '  --output-json <path>          JSON artifact path',
      '  --output-md <path>            Markdown report path',
      '  --today <yyyy-mm-dd>          Evidence date',
      '  --dry-run                    Print route manifest without network calls',
      '  --help                       Show this message',
      '',
      'Env:',
      '  PROD_UI_AUDIT_WEB_BASE_URL, PROD_UI_AUDIT_API_BASE_URL,',
      '  PROD_UI_AUDIT_EXPECTED_SHA, PROD_UI_AUDIT_AUTH_TOKEN,',
      '  PROD_UI_AUDIT_AUTH_EMAIL, PROD_UI_AUDIT_AUTH_PASSWORD,',
      '  PROD_UI_AUDIT_ADMIN_TOKEN, PROD_UI_AUDIT_ADMIN_EMAIL,',
      '  PROD_UI_AUDIT_ADMIN_PASSWORD, PROD_UI_AUDIT_OUTPUT_JSON,',
      '  PROD_UI_AUDIT_OUTPUT_MD',
    ].join('\n') + '\n'
  );
};

const resolveOptions = () => {
  const today = readArgValue('--today') || new Date().toISOString().slice(0, 10);
  return {
    webBaseUrl: normalizeBaseUrl(
      readArgValue('--web-base-url') ||
        process.env.PROD_UI_AUDIT_WEB_BASE_URL ||
        'https://soar.luckysparrow.ch'
    ),
    apiBaseUrl: normalizeBaseUrl(
      readArgValue('--api-base-url') ||
        process.env.PROD_UI_AUDIT_API_BASE_URL ||
        'https://api.soar.luckysparrow.ch'
    ),
    expectedSha: readArgValue('--expected-sha') || process.env.PROD_UI_AUDIT_EXPECTED_SHA || '',
    authToken: readArgValue('--auth-token') || process.env.PROD_UI_AUDIT_AUTH_TOKEN || '',
    authEmail: readArgValue('--auth-email') || process.env.PROD_UI_AUDIT_AUTH_EMAIL || '',
    authPassword: readArgValue('--auth-password') || process.env.PROD_UI_AUDIT_AUTH_PASSWORD || '',
    adminToken: readArgValue('--admin-token') || process.env.PROD_UI_AUDIT_ADMIN_TOKEN || '',
    adminEmail: readArgValue('--admin-email') || process.env.PROD_UI_AUDIT_ADMIN_EMAIL || '',
    adminPassword:
      readArgValue('--admin-password') || process.env.PROD_UI_AUDIT_ADMIN_PASSWORD || '',
    outputJson:
      readArgValue('--output-json') ||
      process.env.PROD_UI_AUDIT_OUTPUT_JSON ||
      path.join('docs', 'operations', `_artifacts-prod-ui-module-clickthrough-${today}.json`),
    outputMd:
      readArgValue('--output-md') ||
      process.env.PROD_UI_AUDIT_OUTPUT_MD ||
      path.join('docs', 'operations', `prod-ui-module-clickthrough-${today}.md`),
    extraRoutes: splitCsv(readArgValue('--extra-routes') || process.env.PROD_UI_AUDIT_EXTRA_ROUTES),
    today,
    dryRun: args.has('--dry-run'),
  };
};

const fetchText = async (url, { headers = {}, redirect = 'manual' } = {}) => {
  const response = await fetch(url, {
    method: 'GET',
    redirect,
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
      'Cache-Control': 'no-cache',
      ...headers,
    },
  });
  const text = await response.text().catch(() => '');
  return { response, text };
};

const fetchJson = async (url) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
    },
  });
  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = { raw: text.slice(0, 300) };
  }
  return { response, payload };
};

const statusFromFetchError = (route, error) => ({
  ...route,
  url: route.url,
  result: 'FAIL',
  httpStatus: null,
  location: '',
  notes: error instanceof Error ? error.message : String(error),
});

const makeCookieHeaders = (token) => {
  const trimmed = String(token ?? '').trim();
  return trimmed ? { Cookie: `token=${encodeURIComponent(trimmed)}` } : {};
};

const samePathOrRedirect = (routePath, location, expected) => {
  if (!String(expected).startsWith('redirect:')) return false;
  const expectedTarget = expected.slice('redirect:'.length);
  if (!location) return false;
  try {
    const parsed = new URL(location, 'https://placeholder.local');
    return `${parsed.pathname}${parsed.search}${parsed.hash}` === expectedTarget;
  } catch {
    return location === expectedTarget || location.endsWith(expectedTarget);
  }
};

const classifyRoute = ({ route, response, text, location, authAvailable, adminAvailable }) => {
  const status = response.status;
  const expected = route.expected;
  const redirectedToLogin =
    status >= 300 && status < 400 && String(location ?? '').includes('/auth/login');

  if (route.area === 'dashboard' && !authAvailable) {
    return redirectedToLogin
      ? { result: 'BLOCKED_AUTH', notes: 'dashboard auth missing; unauthenticated route fails closed to login' }
      : { result: 'FAIL', notes: 'dashboard auth missing but route did not fail closed to login' };
  }

  if (route.area === 'admin' && !adminAvailable) {
    return redirectedToLogin
      ? { result: 'BLOCKED_AUTH', notes: 'admin auth missing; unauthenticated route fails closed to login' }
      : { result: 'BLOCKED_AUTH', notes: 'admin auth missing; route was not fully audited' };
  }

  if (route.area === 'legacy' && !authAvailable) {
    return redirectedToLogin
      ? { result: 'BLOCKED_AUTH', notes: 'dashboard auth missing; legacy route fails closed before redirect audit' }
      : { result: 'FAIL', notes: 'dashboard auth missing but legacy route did not fail closed to login' };
  }

  if (expected === '200') {
    return status === 200
      ? { result: 'PASS', notes: 'public route reachable' }
      : { result: 'FAIL', notes: `expected HTTP 200, got ${status}` };
  }

  if (String(expected).startsWith('redirect:')) {
    return samePathOrRedirect(route.path, location, expected)
      ? { result: 'PASS', notes: `redirect matched ${expected.slice('redirect:'.length)}` }
      : status === 200 && text.includes('<html')
        ? { result: 'PASS', notes: 'redirect resolved to authenticated page after middleware/app routing' }
        : { result: 'FAIL', notes: `expected ${expected}, got status=${status} location=${location || 'none'}` };
  }

  if (expected === 'authenticated' || expected === 'admin') {
    if (status === 200 && text.includes('<html')) return { result: 'PASS', notes: 'route rendered HTML' };
    if (redirectedToLogin) return { result: 'FAIL', notes: 'auth token did not unlock protected route' };
    return { result: 'FAIL', notes: `expected protected HTML route, got status=${status}` };
  }

  return { result: 'FAIL', notes: `unknown expectation ${expected}` };
};

const routeToUrl = (webBaseUrl, routePath) => `${webBaseUrl}${normalizePath(routePath)}`;

const auditRoute = async ({ route, options, dashboardToken, adminToken }) => {
  const token = route.area === 'admin' ? adminToken : dashboardToken;
  const headers = makeCookieHeaders(token);
  const url = routeToUrl(options.webBaseUrl, route.path);
  try {
    const { response, text } = await fetchText(url, { headers });
    const location = response.headers.get('location') ?? '';
    const classification = classifyRoute({
      route,
      response,
      text,
      location,
      authAvailable: Boolean(dashboardToken),
      adminAvailable: Boolean(adminToken),
    });
    return {
      ...route,
      url,
      result: classification.result,
      httpStatus: response.status,
      location,
      notes: classification.notes,
    };
  } catch (error) {
    return statusFromFetchError({ ...route, url }, error);
  }
};

const buildModuleRows = (routeRows) =>
  moduleDefinitions.map((definition) => {
    const route = routeRows.find((row) => row.path === definition.route);
    if (!route) {
      return {
        ...definition,
        result: 'FAIL',
        notes: 'route was not audited',
      };
    }
    const result =
      route.result === 'PASS'
        ? 'PASS'
        : route.result === 'BLOCKED_AUTH'
          ? 'BLOCKED_AUTH'
          : route.result;
    return {
      ...definition,
      result,
      notes: route.notes,
    };
  });

const renderMarkdown = (payload, jsonPath) => {
  const routeRows = payload.routes
    .map(
      (row) =>
        `| \`${row.path}\` | ${row.area} | ${row.result} | ${row.httpStatus ?? '-'} | ${row.location ? `\`${row.location}\`` : '-'} | ${row.notes} |`
    )
    .join('\n');
  const moduleRows = payload.modules
    .map((row) => `| ${row.module} | \`${row.route}\` | ${row.result} | ${row.notes} |`)
    .join('\n');
  const blockers = payload.blockers.map((blocker) => `- ${blocker}`).join('\n') || '- none';

  return `# Production UI Module Clickthrough Audit

## Status
- Result: **${payload.status}**
- Environment: production
- Evidence date: ${payload.today}
- Generated at (UTC): ${payload.generatedAt}
- Expected SHA: \`${payload.expectedSha || 'not provided'}\`
- Observed build-info SHA: \`${payload.buildInfo.gitSha || 'n/a'}\`
- Dashboard auth: ${payload.auth.dashboard}
- Admin auth: ${payload.auth.admin}
- Raw JSON: \`${jsonPath}\`

## Summary
- Public routes: ${payload.summary.public}
- Dashboard routes: ${payload.summary.dashboard}
- Admin routes: ${payload.summary.admin}
- Legacy redirects: ${payload.summary.legacy}

## Blockers
${blockers}

## Route Results
| Route | Area | Result | HTTP | Location | Notes |
| --- | --- | --- | --- | --- | --- |
${routeRows}

## Module Results
| Module | Route | Result | Notes |
| --- | --- | --- | --- |
${moduleRows}

## Safety Notes
- This audit never writes production data and never submits live-money actions.
- Auth tokens, passwords, cookies, private headers, protected row payloads, and
  screenshots are not written to this artifact.
- BLOCKED_AUTH is not a pass; it means valid production app/admin auth is
  required before protected module clickthrough can be accepted as V1 evidence.
`;
};

const summarizeArea = (routes, area) => {
  const rows = routes.filter((row) => row.area === area);
  const counts = rows.reduce((acc, row) => {
    acc[row.result] = (acc[row.result] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts)
    .map(([key, value]) => `${key}:${value}`)
    .join(', ');
};

const main = async () => {
  if (args.has('--help') || args.has('-h')) {
    printUsage();
    return;
  }

  const options = resolveOptions();
  const routes = [
    ...routeDefinitions,
    ...options.extraRoutes.map((routePath) => ({
      path: normalizePath(routePath),
      area: 'dashboard',
      expected: 'authenticated',
    })),
  ];

  if (options.dryRun) {
    process.stdout.write(
      JSON.stringify(
        {
          webBaseUrl: options.webBaseUrl,
          apiBaseUrl: options.apiBaseUrl,
          routeCount: routes.length,
          routes: routes.map((route) => route.path),
        },
        null,
        2
      ) + '\n'
    );
    return;
  }

  const generatedAt = new Date().toISOString();
  const buildInfoUrl = `${options.webBaseUrl}/api/build-info`;
  const buildInfoResponse = await fetchJson(buildInfoUrl);
  const buildInfo = {
    status: buildInfoResponse.response.status,
    ok: buildInfoResponse.response.ok,
    gitSha: buildInfoResponse.payload?.gitSha ?? '',
  };
  const buildInfoMatches = options.expectedSha
    ? String(buildInfo.gitSha).startsWith(options.expectedSha)
    : buildInfo.ok;

  let dashboardAuth = { token: '', source: 'none', status: 'missing' };
  let adminAuth = { token: '', source: 'none', status: 'missing' };
  const blockers = [];

  try {
    const resolved = await resolveOpsAuthToken({
      baseUrl: options.apiBaseUrl,
      authToken: options.authToken,
      authEmail: options.authEmail,
      authPassword: options.authPassword,
      contextLabel: 'prod-ui-audit:dashboard',
    });
    dashboardAuth = {
      token: resolved.token,
      source: resolved.source,
      status: resolved.token ? 'provided' : 'missing',
    };
  } catch (error) {
    blockers.push(`dashboard auth failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  try {
    const resolved = await resolveOpsAuthToken({
      baseUrl: options.apiBaseUrl,
      authToken: options.adminToken || options.authToken,
      authEmail: options.adminEmail || options.authEmail,
      authPassword: options.adminPassword || options.authPassword,
      contextLabel: 'prod-ui-audit:admin',
    });
    adminAuth = {
      token: resolved.token,
      source: resolved.source,
      status: resolved.token ? 'provided' : 'missing',
    };
  } catch (error) {
    blockers.push(`admin auth failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  if (!dashboardAuth.token) blockers.push('dashboard auth missing');
  if (!adminAuth.token) blockers.push('admin auth missing');
  if (!buildInfoMatches) blockers.push('build-info does not match expected SHA');

  const auditedRoutes = [];
  for (const route of routes) {
    auditedRoutes.push(
      await auditRoute({
        route,
        options,
        dashboardToken: dashboardAuth.token,
        adminToken: adminAuth.token,
      })
    );
  }

  const modules = buildModuleRows(auditedRoutes);
  const hasFailures = auditedRoutes.some((route) => route.result === 'FAIL') || !buildInfoMatches;
  const hasAuthBlocks = auditedRoutes.some((route) => route.result === 'BLOCKED_AUTH');
  const status = hasFailures ? 'FAIL' : hasAuthBlocks ? 'BLOCKED_AUTH' : 'PASS';

  const payload = {
    status,
    today: options.today,
    generatedAt,
    environment: 'production',
    webBaseUrl: options.webBaseUrl,
    apiBaseUrl: options.apiBaseUrl,
    expectedSha: options.expectedSha,
    buildInfo,
    auth: {
      dashboard: dashboardAuth.token ? `${dashboardAuth.source}:present` : 'missing',
      admin: adminAuth.token ? `${adminAuth.source}:present` : 'missing',
    },
    summary: {
      public: summarizeArea(auditedRoutes, 'public'),
      dashboard: summarizeArea(auditedRoutes, 'dashboard'),
      admin: summarizeArea(auditedRoutes, 'admin'),
      legacy: summarizeArea(auditedRoutes, 'legacy'),
    },
    blockers,
    routes: auditedRoutes,
    modules,
  };

  await mkdir(path.dirname(path.resolve(process.cwd(), options.outputJson)), { recursive: true });
  await mkdir(path.dirname(path.resolve(process.cwd(), options.outputMd)), { recursive: true });
  await writeFile(options.outputJson, `${JSON.stringify(payload, null, 2)}\n`);
  await writeFile(options.outputMd, renderMarkdown(payload, path.relative(process.cwd(), options.outputJson)));

  process.stdout.write(`[ops:ui:prod-clickthrough] JSON report: ${options.outputJson}\n`);
  process.stdout.write(`[ops:ui:prod-clickthrough] Markdown report: ${options.outputMd}\n`);
  process.stdout.write(`[ops:ui:prod-clickthrough] status=${status}\n`);

  if (status !== 'PASS') process.exit(1);
};

main().catch((error) => {
  console.error(
    '[ops:ui:prod-clickthrough] failed:',
    error instanceof Error ? error.message : String(error)
  );
  process.exit(1);
});
