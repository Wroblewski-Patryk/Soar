import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

const scriptUrl = pathToFileURL(path.resolve('scripts/runProdAuthSessionBrowserProof.mjs'));

const importHarness = async (argv = [], env = {}) => {
  const originalArgv = process.argv;
  const originalEnv = { ...process.env };
  const dir = await mkdtemp(path.join(os.tmpdir(), 'soar-prod-auth-proof-'));
  const browserPath = path.join(dir, 'browser.exe');
  await writeFile(browserPath, '');

  process.argv = ['node', 'scripts/runProdAuthSessionBrowserProof.test.mjs', ...argv, '--browser-path', browserPath];
  process.env.PROD_AUTH_BROWSER_PATH = browserPath;
  process.env.PROD_AUTH_WEB_BASE_URL = ' https://soar.example.test/// ';
  process.env.PROD_AUTH_API_BASE_URL = ' https://api.soar.example.test/// ';
  process.env.PROD_AUTH_EXPECTED_SHA = 'abcdef1234567890';
  process.env.PROD_AUTH_TOKEN = 'synthetic-local-test-token';
  process.env.PROD_AUTH_EMAIL = 'local@example.test';
  process.env.PROD_AUTH_PASSWORD = 'synthetic-local-password';
  process.env.PROD_AUTH_CDP_PORT = '9444';
  Object.assign(process.env, env);

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

test('argument and option helpers normalize production auth proof inputs without running the CLI', async () => {
  const harness = await importHarness([
    '--today',
    '2026-06-07',
    '--expected-sha',
    '1234567890',
    '--auth-token',
    'fixture-token',
    '--output-json',
    'history/artifacts/prod-auth.json',
    '--output-md',
    'history/evidence/prod-auth.md',
    '--cdp-port',
    '9555',
    '--i-understand-production-auth-proof',
  ]);
  try {
    const { findBrowserPath, normalizeBaseUrl, readArgValue, resolveOptions } = harness.module;

    assert.equal(readArgValue('--expected-sha'), '1234567890');
    assert.equal(readArgValue('--missing'), '');
    assert.equal(normalizeBaseUrl(' https://soar.local/// '), 'https://soar.local');
    assert.equal(findBrowserPath(), harness.browserPath);

    assert.deepEqual(resolveOptions(), {
      webBaseUrl: 'https://soar.example.test',
      apiBaseUrl: 'https://api.soar.example.test',
      expectedSha: '1234567890',
      authToken: 'fixture-token',
      authEmail: 'local@example.test',
      authPassword: 'synthetic-local-password',
      outputJson: 'history/artifacts/prod-auth.json',
      outputMd: 'history/evidence/prod-auth.md',
      browserPath: harness.browserPath,
      port: 9555,
      today: '2026-06-07',
      approved: true,
    });
  } finally {
    await harness.cleanup();
  }
});

test('resolveOptions falls back to app-specific Soar production test account refs', async () => {
  const harness = await importHarness([], {
    PROD_AUTH_EMAIL: '',
    PROD_AUTH_PASSWORD: '',
    SOAR_PROD_TEST_EMAIL: 'soar-test@example.test',
    SOAR_PROD_TEST_PASSWORD: 'soar-test-password',
  });
  try {
    const { resolveOptions } = harness.module;

    const options = resolveOptions();
    assert.equal(options.authEmail, 'soar-test@example.test');
    assert.equal(options.authPassword, 'soar-test-password');
  } finally {
    await harness.cleanup();
  }
});

test('readJson redacts parsing failures to short raw previews', async () => {
  const harness = await importHarness();
  try {
    const { readJson } = harness.module;

    assert.deepEqual(await readJson({ text: async () => '{"ok":true}' }), { ok: true });
    assert.equal(await readJson({ text: async () => '' }), null);

    const invalid = await readJson({ text: async () => `${'x'.repeat(140)}-secret-tail` });
    assert.deepEqual(invalid, { rawPreview: 'x'.repeat(120) });
  } finally {
    await harness.cleanup();
  }
});

test('mocked CDP helpers evaluate, navigate, collect location, clear auth, and set auth cookies', async () => {
  const harness = await importHarness();
  try {
    const { buildAuthApiHeaders, clearAuth, collectLocation, evaluate, navigate, setAuthCookie } = harness.module;
    const calls = [];
    const client = {
      send: async (method, params) => {
        calls.push({ method, params });
        if (method === 'Runtime.evaluate') {
          if (params.expression === 'document.readyState') return { result: { value: 'complete' } };
          return {
            result: {
              value: {
                href: 'https://soar.example.test/dashboard',
                pathname: '/dashboard',
                search: '',
                title: 'Soar',
                bodyTextLength: 150,
              },
            },
          };
        }
        if (method === 'Network.setCookie') return { success: true };
        return {};
      },
    };

    assert.equal(await evaluate(client, 'document.readyState'), 'complete');
    assert.equal((await collectLocation(client)).pathname, '/dashboard');
    await navigate(client, 'https://soar.example.test/dashboard', 0);
    await clearAuth(client);
    await setAuthCookie(client, { webBaseUrl: 'https://app.soar.example.test' }, 'token value');

    assert.ok(calls.some((call) => call.method === 'Page.navigate'));
    assert.ok(calls.some((call) => call.method === 'Network.clearBrowserCookies'));
    assert.ok(
      calls.some(
        (call) =>
          call.method === 'Network.setExtraHTTPHeaders' &&
          call.params.headers.Cookie === 'token=token%20value',
      ),
    );
    assert.ok(
      calls.some(
        (call) =>
          call.method === 'Network.setCookie' &&
          call.params.domain === 'example.test' &&
          call.params.sameSite === 'Lax',
      ),
    );

    assert.deepEqual(
      buildAuthApiHeaders({ webBaseUrl: 'https://soar.example.test' }, 'token value', {
        'Content-Type': 'application/json',
      }),
      {
        Accept: 'application/json',
        Origin: 'https://soar.example.test',
        Cookie: 'token=token%20value',
        Authorization: 'Bearer token value',
        'Content-Type': 'application/json',
      },
    );
  } finally {
    await harness.cleanup();
  }
});

test('setAuthCookie fails closed when host and shared-domain cookie writes both fail', async () => {
  const harness = await importHarness();
  try {
    const { setAuthCookie } = harness.module;
    const client = {
      send: async (method) => (method === 'Network.setCookie' ? { success: false } : {}),
    };

    await assert.rejects(
      () => setAuthCookie(client, { webBaseUrl: 'https://soar.example.test' }, 'fixture-token'),
      /failed to set auth cookie in browser/,
    );
  } finally {
    await harness.cleanup();
  }
});

test('markdown, step, and wait helpers produce redacted local proof summaries', async () => {
  const harness = await importHarness();
  try {
    const { renderMarkdown, toStep, wait } = harness.module;
    const step = toStep('auth me after logout fails closed', 'PASS', { httpStatus: 401, notes: 'fail-closed' });
    assert.deepEqual(step, {
      name: 'auth me after logout fails closed',
      result: 'PASS',
      httpStatus: 401,
      notes: 'fail-closed',
    });

    const markdown = renderMarkdown(
      {
        status: 'PASS',
        today: '2026-06-07',
        generatedAt: '2026-06-07T00:00:00.000Z',
        expectedSha: '12345678',
        buildInfo: { gitSha: '1234567890abcdef' },
        steps: [step],
        blockers: [],
      },
      'history/artifacts/prod-auth.json',
    );

    assert.match(markdown, /Production Auth Session Browser Proof/);
    assert.match(markdown, /auth me after logout fails closed/);
    assert.match(markdown, /Auth tokens, passwords, cookies/);
    assert.doesNotMatch(markdown, /fixture-token/);

    await wait(1);
  } finally {
    await harness.cleanup();
  }
});
