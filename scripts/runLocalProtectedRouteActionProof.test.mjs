import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

const scriptUrl = pathToFileURL(path.resolve('scripts/runLocalProtectedRouteActionProof.mjs'));

const importHarness = async (argv = []) => {
  const originalArgv = process.argv;
  const originalEnv = { ...process.env };
  const dir = await mkdtemp(path.join(os.tmpdir(), 'soar-protected-route-proof-'));
  const browserPath = path.join(dir, 'browser.exe');
  await writeFile(browserPath, '');

  process.argv = ['node', 'scripts/runLocalProtectedRouteActionProof.test.mjs', ...argv, '--browser-path', browserPath];
  process.env.LOCAL_PROTECTED_WEB_BASE_URL = ' http://127.0.0.1:4321/// ';
  process.env.LOCAL_PROTECTED_CDP_PORT = '9777';

  try {
    const module = await import(`${scriptUrl.href}?case=${Date.now()}-${Math.random()}`);
    return {
      module,
      browserPath,
      cleanup: async () => {
        process.argv = originalArgv;
        process.env = originalEnv;
        await rm(dir, { recursive: true, force: true });
      },
    };
  } catch (error) {
    process.argv = originalArgv;
    process.env = originalEnv;
    await rm(dir, { recursive: true, force: true });
    throw error;
  }
};

test('argument and option helpers normalize local protected-route proof inputs without running the CLI', async () => {
  const harness = await importHarness(['--issue', 'LUC-2935', '--today', '2026-06-07', '--dry-run']);
  try {
    const { findBrowserPath, normalizeBaseUrl, readArgValue, resolveOptions, verifyStaticMapping } = harness.module;

    assert.equal(readArgValue('--issue'), 'LUC-2935');
    assert.equal(readArgValue('--missing'), '');
    assert.equal(normalizeBaseUrl(' https://soar.local/// '), 'https://soar.local');
    assert.equal(findBrowserPath(), harness.browserPath);

    assert.deepEqual(resolveOptions(), {
      baseUrl: 'http://127.0.0.1:4321',
      cdpPort: 9777,
      browserPath: harness.browserPath,
      outputJson: path.join(
        'history',
        'artifacts',
        'luc-2935-local-protected-route-action-proof-matrix-2026-06-07.json',
      ),
      outputMd: path.join(
        'history',
        'evidence',
        'luc-2935-local-protected-route-action-proof-matrix-2026-06-07.md',
      ),
      issue: 'LUC-2935',
      startServer: true,
      dryRun: true,
      today: '2026-06-07',
    });
    assert.deepEqual(verifyStaticMapping(), { result: 'PASS', missingActions: [], missingFiles: [] });
  } finally {
    await harness.cleanup();
  }
});

test('CDP helpers evaluate, collect location, navigate, and wait for expected paths', async () => {
  const harness = await importHarness();
  try {
    const { collectLocation, evaluate, navigate, waitForPath } = harness.module;
    const calls = [];
    const paths = ['/dashboard/wallets', '/dashboard/wallets/create'];
    const client = {
      send: async (method, params) => {
        calls.push({ method, params });
        if (method === 'Runtime.evaluate') {
          if (params.expression === 'document.readyState') return { result: { value: 'complete' } };
          const pathname = paths.shift() ?? '/dashboard/wallets/create';
          return {
            result: {
              value: {
                href: `http://127.0.0.1:3217${pathname}`,
                pathname,
                search: '',
                title: 'Soar',
                bodyTextLength: 12,
                bodyTextPreview: 'Fixture body',
              },
            },
          };
        }
        return {};
      },
    };

    assert.equal(await evaluate(client, 'document.readyState'), 'complete');
    assert.equal((await collectLocation(client)).pathname, '/dashboard/wallets');
    await navigate(client, 'http://127.0.0.1:3217/dashboard/wallets', 0);
    assert.equal((await waitForPath(client, '/dashboard/wallets/create', 20)).pathname, '/dashboard/wallets/create');
    assert.ok(calls.some((call) => call.method === 'Page.navigate'));
  } finally {
    await harness.cleanup();
  }
});

test('fixture API helpers fulfill known dynamic API responses and continue unknown requests', async () => {
  const harness = await importHarness();
  try {
    const { installDynamicFixtureApi, jsonFixtureResponse, resolveDynamicFixtureApi } = harness.module;
    assert.equal(resolveDynamicFixtureApi('http://api.local/auth/me').email, 'luc-2188@example.test');
    assert.equal(resolveDynamicFixtureApi('http://api.local/unknown'), undefined);

    const fixtureResponse = jsonFixtureResponse({ ok: true });
    assert.equal(fixtureResponse.responseCode, 200);
    assert.equal(Buffer.from(fixtureResponse.body, 'base64').toString('utf8'), '{"ok":true}');

    const sends = [];
    let handler;
    const client = {
      send: async (method, params) => {
        sends.push({ method, params });
        return {};
      },
      on: (event, callback) => {
        assert.equal(event, 'Fetch.requestPaused');
        handler = callback;
      },
    };

    await installDynamicFixtureApi(client);
    await handler({ requestId: 'known', request: { url: 'http://api.local/auth/me' } });
    await handler({ requestId: 'unknown', request: { url: 'http://api.local/unknown' } });

    assert.ok(sends.some((call) => call.method === 'Fetch.enable'));
    assert.ok(sends.some((call) => call.method === 'Fetch.fulfillRequest' && call.params.requestId === 'known'));
    assert.ok(sends.some((call) => call.method === 'Fetch.continueRequest' && call.params.requestId === 'unknown'));
  } finally {
    await harness.cleanup();
  }
});

test('document requests can inherit the synthetic auth cookie header during dashboard bootstrap', async () => {
  const harness = await importHarness();
  try {
    const { installDynamicFixtureApi } = harness.module;
    const sends = [];
    let handler;
    const client = {
      syntheticAuthCookieHeader: 'token=luc-2057-local-fixture-token',
      send: async (method, params) => {
        sends.push({ method, params });
        return {};
      },
      on: (event, callback) => {
        assert.equal(event, 'Fetch.requestPaused');
        handler = callback;
      },
    };

    await installDynamicFixtureApi(client);
    await handler({
      requestId: 'doc-1',
      resourceType: 'Document',
      request: {
        url: 'http://127.0.0.1:3217/dashboard',
        headers: { 'User-Agent': 'Chrome' },
      },
    });

    const continueCall = sends.find(
      (call) => call.method === 'Fetch.continueRequest' && call.params.requestId === 'doc-1',
    );
    assert.ok(continueCall);
    assert.deepEqual(
      continueCall.params.headers.find((header) => header.name.toLowerCase() === 'cookie'),
      { name: 'Cookie', value: 'token=luc-2057-local-fixture-token' },
    );
  } finally {
    await harness.cleanup();
  }
});

test('dashboard document requests can be fulfilled with a cookie-bearing local HTML response', async () => {
  const harness = await importHarness();
  const originalFetch = globalThis.fetch;
  try {
    const { installDynamicFixtureApi } = harness.module;
    const sends = [];
    let handler;
    globalThis.fetch = async (url) => ({
      status: 200,
      statusText: 'OK',
      headers: {
        entries: () =>
          Object.entries({
            'content-type': 'text/html; charset=utf-8',
            'cache-control': 'no-store',
          })[Symbol.iterator](),
      },
      text: async () => `<html><body>dashboard ${String(url)}</body></html>`,
    });
    const client = {
      syntheticAuthDocumentBootstrap: 'token=luc-2057-local-fixture-token',
      send: async (method, params) => {
        sends.push({ method, params });
        return {};
      },
      on: (event, callback) => {
        assert.equal(event, 'Fetch.requestPaused');
        handler = callback;
      },
    };

    await installDynamicFixtureApi(client);
    await handler({
      requestId: 'doc-1',
      resourceType: 'Document',
      request: {
        url: 'http://127.0.0.1:3217/dashboard',
        headers: { 'User-Agent': 'Chrome' },
      },
    });

    const fulfillCall = sends.find(
      (call) => call.method === 'Fetch.fulfillRequest' && call.params.requestId === 'doc-1',
    );
    assert.ok(fulfillCall);
    assert.equal(fulfillCall.params.responseCode, 200);
    assert.ok(Buffer.from(fulfillCall.params.body, 'base64').toString('utf8').length > 0);
  } finally {
    await harness.cleanup();
  }
});

test('synthetic auth bootstrap seeds both request headers and a browser cookie', async () => {
  const harness = await importHarness();
  let originalFetch = globalThis.fetch;
  try {
    const { seedSyntheticAuthSession } = harness.module;
    const sends = [];
    const client = {
      send: async (method, params) => {
        sends.push({ method, params });
        return { success: true };
      },
    };

    await seedSyntheticAuthSession(
      client,
      { baseUrl: 'http://127.0.0.1:3217' },
      'luc-2057-local-fixture-token',
    );

    assert.ok(
      sends.some(
        (call) =>
          call.method === 'Network.setExtraHTTPHeaders' &&
          call.params.headers.Cookie === 'token=luc-2057-local-fixture-token',
      ),
    );
    assert.ok(
      sends.some(
        (call) =>
          call.method === 'Network.setCookie' &&
          call.params.name === 'token' &&
          call.params.url === 'http://127.0.0.1:3217',
      ),
    );
    assert.ok(
      sends.some(
        (call) =>
          call.method === 'Runtime.evaluate' &&
          typeof call.params.expression === 'string' &&
          call.params.expression.includes('document.cookie'),
      ),
    );
  } finally {
    globalThis.fetch = originalFetch;
    await harness.cleanup();
  }
});

test('HTTP proof, markdown rendering, wait, and child cleanup stay local and non-mutating', async () => {
  const harness = await importHarness();
  const originalFetch = globalThis.fetch;
  try {
    const { httpRouteProof, renderMarkdown, stopChild, wait } = harness.module;
    globalThis.fetch = async (url, options) => {
      assert.equal(url, 'http://127.0.0.1:3217/dashboard/wallets');
      assert.equal(options.headers.Cookie, 'token=luc-2057-local-fixture-token');
      return {
        status: 200,
        url,
        headers: { get: () => '' },
        text: async () => 'wallet page',
      };
    };

    assert.deepEqual(
      await httpRouteProof(
        { baseUrl: 'http://127.0.0.1:3217' },
        { route: '/dashboard/wallets', expectedPath: '/dashboard/wallets', kind: 'route' },
      ),
      {
        pass: true,
        observedPath: '/dashboard/wallets',
        statusCode: 200,
        bodyTextLength: 11,
        notes: 'route reached expected route through local HTTP fixture-id proof',
      },
    );

    const markdown = renderMarkdown(
      {
        issue: 'LUC-2935',
        status: 'PASS',
        today: '2026-06-07',
        generatedAt: '2026-06-07T00:00:00.000Z',
        dynamicFixtures: { enabled: true, apiInterception: false, fixtureIds: ['luc-2188-wallet'] },
        routes: [
          {
            actionId: 'SOAR-ACTION-VISIT-PAGE-WALLETS-LIST',
            route: '/dashboard/wallets/list',
            result: 'PASS',
            observedPath: '/dashboard/wallets/list',
            notes: 'local proof',
          },
        ],
        sources: [{ path: 'apps/web/src/app/dashboard/wallets/list/page.tsx', present: true }],
        clusters: [{ name: 'wallets', actions: ['a'], apiRoutes: ['GET /dashboard/wallets'], docs: ['docs/modules/web-wallets.md'], existingTests: ['WalletsListTable.test.tsx'] }],
        blockers: [],
      },
      'history/artifacts/luc-2935.json',
    );
    assert.match(markdown, /LUC-2935 Local Protected Route Action Proof Matrix/);
    assert.match(markdown, /SOAR-ACTION-VISIT-PAGE-WALLETS-LIST/);

    await wait(1);
    const child = { killed: false, exitCode: null, killCount: 0, kill() { this.killCount += 1; this.killed = true; } };
    await stopChild(child);
    assert.equal(child.killCount, 1);
  } finally {
    globalThis.fetch = originalFetch;
    await harness.cleanup();
  }
});

test('dashboard cluster static mapping stays verifiable without browser mutations', async () => {
  const harness = await importHarness(['--clusters', 'dashboard', '--dry-run']);
  try {
    const { verifyStaticMapping } = harness.module;
    assert.deepEqual(verifyStaticMapping(), { result: 'PASS', missingActions: [], missingFiles: [] });
  } finally {
    await harness.cleanup();
  }
});
