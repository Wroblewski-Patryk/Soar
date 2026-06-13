import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

const scriptUrl = pathToFileURL(path.resolve('scripts/runProdUiModuleClickthroughAudit.mjs'));

const importHarness = async (argv = [], env = {}) => {
  const originalArgv = process.argv;
  const originalEnv = { ...process.env };

  process.argv = ['node', 'scripts/runProdUiModuleClickthroughAudit.test.mjs', ...argv];
  process.env.PROD_UI_AUDIT_WEB_BASE_URL = ' https://soar.example.test/// ';
  process.env.PROD_UI_AUDIT_API_BASE_URL = ' https://api.soar.example.test/// ';
  process.env.PROD_UI_AUDIT_EXPECTED_SHA = 'abcdef1234567890';
  process.env.PROD_UI_AUDIT_AUTH_TOKEN = 'dashboard-token';
  process.env.PROD_UI_AUDIT_ADMIN_TOKEN = 'admin-token';
  process.env.PROD_UI_AUDIT_ADMIN_EMAIL = 'REPLACE_ME_PROD_UI_AUDIT_ADMIN_EMAIL';
  process.env.PROD_UI_AUDIT_ADMIN_PASSWORD = 'REPLACE_ME_PROD_UI_AUDIT_ADMIN_PASSWORD';
  process.env.PROD_UI_AUDIT_EXTRA_ROUTES = 'dashboard/custom, /admin/custom';
  process.env.PROD_UI_AUDIT_OUTPUT_JSON = 'history/artifacts/prod-ui-audit.json';
  process.env.PROD_UI_AUDIT_OUTPUT_MD = 'history/evidence/prod-ui-audit.md';
  Object.assign(process.env, env);

  try {
    const module = await import(`${scriptUrl.href}?case=${Date.now()}-${Math.random()}`);
    return {
      module,
      cleanup: async () => {
        process.argv = originalArgv;
        process.env = originalEnv;
      },
    };
  } catch (error) {
    process.argv = originalArgv;
    process.env = originalEnv;
    throw error;
  }
};

const response = (status, headers = {}) => ({
  status,
  headers: {
    get: (name) => headers[String(name).toLowerCase()] ?? null,
  },
});

test('argument and option helpers normalize production UI audit inputs without running the CLI', async () => {
  const harness = await importHarness([
    '--today',
    '2026-06-07',
    '--web-base-url',
    ' https://web.local/// ',
    '--api-base-url',
    ' https://api.local/// ',
    '--expected-sha',
    '1234567890',
    '--auth-token',
    'cli-dashboard-token',
    '--admin-token',
    'cli-admin-token',
    '--extra-routes',
    'dashboard/extra, /admin/extra',
    '--dry-run',
  ]);
  try {
    const {
      normalizeBaseUrl,
      normalizePath,
      readArgValue,
      resolveCredentialFallback,
      resolveOptions,
      splitCsv,
    } = harness.module;

    assert.equal(readArgValue('--expected-sha'), '1234567890');
    assert.equal(readArgValue('--missing'), '');
    assert.equal(normalizeBaseUrl(' https://soar.local/// '), 'https://soar.local');
    assert.equal(normalizePath('dashboard'), '/dashboard');
    assert.equal(normalizePath('/dashboard'), '/dashboard');
    assert.equal(normalizePath('   '), '');
    assert.deepEqual(splitCsv(' /a, b ,, c '), ['/a', 'b', 'c']);
    assert.equal(
      resolveCredentialFallback({
        token: 'cli-token',
        cliValue: 'ops@example.test',
        envValue: 'REPLACE_ME_PROD_UI_AUDIT_ADMIN_EMAIL',
      }),
      '',
    );
    assert.equal(
      resolveCredentialFallback({
        token: '',
        cliValue: '',
        envValue: 'admin@example.test',
      }),
      'admin@example.test',
    );

    assert.deepEqual(resolveOptions(), {
      webBaseUrl: 'https://web.local',
      apiBaseUrl: 'https://api.local',
      expectedSha: '1234567890',
      authToken: 'cli-dashboard-token',
      authEmail: '',
      authPassword: '',
      adminToken: 'cli-admin-token',
      adminEmail: '',
      adminPassword: '',
      outputJson: 'history/artifacts/prod-ui-audit.json',
      outputMd: 'history/evidence/prod-ui-audit.md',
      extraRoutes: ['dashboard/extra', '/admin/extra'],
      today: '2026-06-07',
      dryRun: true,
    });
  } finally {
    await harness.cleanup();
  }
});

test('classifyRoute covers public, protected, legacy redirect, and failure branches', async () => {
  const harness = await importHarness();
  try {
    const { classifyRoute } = harness.module;

    assert.deepEqual(
      classifyRoute({
        route: { path: '/', area: 'public', expected: '200' },
        response: response(200),
        text: '<html>ok</html>',
        location: '',
        authAvailable: false,
        adminAvailable: false,
      }),
      { result: 'PASS', notes: 'public route reachable' },
    );

    assert.deepEqual(
      classifyRoute({
        route: { path: '/dashboard', area: 'dashboard', expected: 'authenticated' },
        response: response(302),
        text: '',
        location: '/auth/login',
        authAvailable: false,
        adminAvailable: false,
      }),
      { result: 'BLOCKED_AUTH', notes: 'dashboard auth missing; unauthenticated route fails closed to login' },
    );

    assert.deepEqual(
      classifyRoute({
        route: { path: '/dashboard/orders', area: 'legacy', expected: 'redirect:/dashboard/bots/runtime?legacy=orders' },
        response: response(302),
        text: '',
        location: 'https://soar.example.test/dashboard/bots/runtime?legacy=orders',
        authAvailable: true,
        adminAvailable: false,
      }),
      { result: 'PASS', notes: 'redirect matched /dashboard/bots/runtime?legacy=orders' },
    );

    assert.deepEqual(
      classifyRoute({
        route: { path: '/dashboard', area: 'dashboard', expected: 'authenticated' },
        response: response(200),
        text: '<html>dashboard</html>',
        location: '',
        authAvailable: true,
        adminAvailable: false,
      }),
      { result: 'PASS', notes: 'route rendered HTML' },
    );

    assert.deepEqual(
      classifyRoute({
        route: { path: '/unknown', area: 'public', expected: 'wat' },
        response: response(418),
        text: '',
        location: '',
        authAvailable: true,
        adminAvailable: true,
      }),
      { result: 'FAIL', notes: 'unknown expectation wat' },
    );
  } finally {
    await harness.cleanup();
  }
});

test('route helpers produce deterministic redaction-safe local audit rows', async () => {
  const harness = await importHarness();
  try {
    const {
      makeCookieHeaders,
      routeToUrl,
      samePathOrRedirect,
      statusFromFetchError,
    } = harness.module;

    assert.deepEqual(makeCookieHeaders(' token value '), { Cookie: 'token=token%20value' });
    assert.deepEqual(makeCookieHeaders('   '), {});
    assert.equal(routeToUrl('https://soar.example.test', 'dashboard'), 'https://soar.example.test/dashboard');
    assert.equal(samePathOrRedirect('/x', 'https://soar.example.test/dashboard#api', 'redirect:/dashboard#api'), true);
    assert.deepEqual(statusFromFetchError({ path: '/x', area: 'public', url: 'u' }, new Error('network down')), {
      path: '/x',
      area: 'public',
      url: 'u',
      result: 'FAIL',
      httpStatus: null,
      location: '',
      notes: 'network down',
    });
  } finally {
    await harness.cleanup();
  }
});

test('auditRoute, buildModuleRows, summarizeArea, renderMarkdown, and help path avoid live network', async () => {
  const harness = await importHarness(['--help']);
  const originalFetch = globalThis.fetch;
  const originalWrite = process.stdout.write;
  let output = '';
  try {
    const { auditRoute, buildModuleRows, fetchJson, fetchText, main, printUsage, renderMarkdown, summarizeArea } = harness.module;

    globalThis.fetch = async (url, options) => ({
      status: url.endsWith('/api/build-info') ? 200 : 302,
      ok: true,
      headers: response(302, { location: '/auth/login' }).headers,
      text: async () => (url.endsWith('/api/build-info') ? '{"gitSha":"abcdef"}' : '<html>login</html>'),
    });

    const textResult = await fetchText('https://soar.example.test/dashboard', { headers: { Cookie: 'token=redacted' } });
    assert.equal(textResult.response.status, 302);
    const jsonResult = await fetchJson('https://soar.example.test/api/build-info');
    assert.deepEqual(jsonResult.payload, { gitSha: 'abcdef' });

    const audited = await auditRoute({
      route: { path: '/dashboard', area: 'dashboard', expected: 'authenticated' },
      options: { webBaseUrl: 'https://soar.example.test' },
      dashboardToken: '',
      adminToken: '',
    });
    assert.equal(audited.result, 'BLOCKED_AUTH');
    assert.equal(audited.location, '/auth/login');

    const modules = buildModuleRows([audited, { path: '/auth/login', result: 'PASS', notes: 'ok' }]);
    assert.equal(modules.find((row) => row.module === 'auth').result, 'PASS');
    assert.equal(modules.find((row) => row.module === 'dashboard-home').result, 'BLOCKED_AUTH');
    assert.equal(summarizeArea([audited, { ...audited, result: 'FAIL' }], 'dashboard'), 'BLOCKED_AUTH:1, FAIL:1');

    const markdown = renderMarkdown(
      {
        status: 'BLOCKED_AUTH',
        today: '2026-06-07',
        generatedAt: '2026-06-07T00:00:00.000Z',
        expectedSha: 'abcdef',
        buildInfo: { gitSha: 'abcdef1234' },
        auth: { dashboard: 'missing', admin: 'missing' },
        summary: { public: 'PASS:1', dashboard: 'BLOCKED_AUTH:1', admin: '', legacy: '' },
        blockers: ['dashboard auth missing'],
        routes: [audited],
        modules,
      },
      'history/artifacts/prod-ui-audit.json',
    );
    assert.match(markdown, /Production UI Module Clickthrough Audit/);
    assert.match(markdown, /dashboard auth missing/);
    assert.doesNotMatch(markdown, /dashboard-token|admin-token/);

    process.stdout.write = (chunk) => {
      output += String(chunk);
      return true;
    };
    printUsage();
    assert.match(output, /Usage: node scripts\/runProdUiModuleClickthroughAudit\.mjs/);
    output = '';

    await main();
    assert.match(output, /PROD_UI_AUDIT_AUTH_TOKEN/);
  } finally {
    globalThis.fetch = originalFetch;
    process.stdout.write = originalWrite;
    await harness.cleanup();
  }
});
