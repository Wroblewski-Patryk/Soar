import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import test from 'node:test';
import path from 'node:path';

const scriptUrl = pathToFileURL(path.resolve('scripts/runProdFixtureActionProof.mjs'));

const importHarness = async (argv = [], env = {}) => {
  const originalArgv = process.argv;
  const originalEnv = { ...process.env };

  process.argv = ['node', 'scripts/runProdFixtureActionProof.test.mjs', ...argv];
  process.env.PROD_FIXTURE_WEB_BASE_URL = ' https://soar.example.test/// ';
  process.env.PROD_FIXTURE_API_BASE_URL = ' https://api.soar.example.test/// ';
  process.env.PROD_FIXTURE_EXPECTED_SHA = 'abcdef1234567890';
  process.env.PROD_FIXTURE_AUTH_TOKEN = 'synthetic-local-test-token';
  process.env.PROD_FIXTURE_AUTH_EMAIL = 'local@example.test';
  process.env.PROD_FIXTURE_AUTH_PASSWORD = 'synthetic-local-password';
  process.env.PROD_FIXTURE_OUTPUT_JSON = 'history/artifacts/prod-fixture.json';
  process.env.PROD_FIXTURE_OUTPUT_MD = 'history/evidence/prod-fixture.md';
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

test('argument and option helpers normalize production fixture proof inputs without running the CLI', async () => {
  const harness = await importHarness([
    '--today',
    '2026-06-07',
    '--expected-sha',
    '1234567890',
    '--auth-token',
    'fixture-token',
    '--output-json',
    'history/artifacts/custom-prod-fixture.json',
    '--output-md',
    'history/evidence/custom-prod-fixture.md',
    '--i-understand-production-fixture-risk',
  ]);
  try {
    const { normalizeBaseUrl, readArgValue, resolveOptions } = harness.module;

    assert.equal(readArgValue('--expected-sha'), '1234567890');
    assert.equal(readArgValue('--missing'), '');
    assert.equal(normalizeBaseUrl(' https://soar.local/// '), 'https://soar.local');

    assert.deepEqual(resolveOptions(), {
      webBaseUrl: 'https://soar.example.test',
      apiBaseUrl: 'https://api.soar.example.test',
      expectedSha: '1234567890',
      authToken: 'fixture-token',
      authEmail: 'local@example.test',
      authPassword: 'synthetic-local-password',
      outputJson: 'history/artifacts/custom-prod-fixture.json',
      outputMd: 'history/evidence/custom-prod-fixture.md',
      today: '2026-06-07',
      approved: true,
    });
  } finally {
    await harness.cleanup();
  }
});

test('resolveOptions falls back to app-specific Soar production test account refs', async () => {
  const harness = await importHarness([], {
    PROD_FIXTURE_AUTH_EMAIL: '',
    PROD_FIXTURE_AUTH_PASSWORD: '',
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

test('readJson and requestJson parse responses and keep invalid bodies to short previews', async () => {
  const harness = await importHarness();
  const originalFetch = globalThis.fetch;
  try {
    const { readJson, requestJson } = harness.module;

    assert.deepEqual(await readJson({ text: async () => '{"ok":true}' }), { ok: true });
    assert.equal(await readJson({ text: async () => '' }), null);
    assert.deepEqual(await readJson({ text: async () => `${'x'.repeat(180)}-tail` }), {
      rawPreview: 'x'.repeat(160),
    });

    const calls = [];
    globalThis.fetch = async (url, options) => {
      calls.push({ url, options });
      return {
        status: 201,
        text: async () => '{"id":"fixture-id"}',
      };
    };

    const result = await requestJson({
      apiBaseUrl: 'https://api.soar.example.test',
      token: 'token value',
      method: 'POST',
      route: '/dashboard/wallets',
      body: { name: 'fixture' },
    });

    assert.equal(result.response.status, 201);
    assert.deepEqual(result.payload, { id: 'fixture-id' });
    assert.equal(calls[0].url, 'https://api.soar.example.test/dashboard/wallets');
    assert.equal(calls[0].options.headers.Cookie, 'token=token%20value');
    assert.equal(calls[0].options.headers['content-type'], 'application/json');
    assert.equal(calls[0].options.body, '{"name":"fixture"}');
  } finally {
    globalThis.fetch = originalFetch;
    await harness.cleanup();
  }
});

test('assertStatus, toStep, and cleanupDelete record pass, fail, and thrown cleanup outcomes', async () => {
  const harness = await importHarness();
  try {
    const { assertStatus, cleanupDelete, toStep } = harness.module;

    assert.doesNotThrow(() => assertStatus('wallet create', 201, [200, 201]));
    assert.throws(() => assertStatus('wallet create', 500, [200, 201]), /wallet create expected HTTP 200\/201 but got 500/);
    assert.deepEqual(toStep('wallet create', 'PASS', { httpStatus: 201 }), {
      name: 'wallet create',
      status: 'PASS',
      httpStatus: 201,
    });

    const cleanup = [];
    const calls = [];
    await cleanupDelete({
      name: 'wallet cleanup',
      route: '/dashboard/wallets/wallet-id',
      authToken: 'fixture-token',
      apiBaseUrl: 'https://api.soar.example.test',
      cleanup,
      requestJsonImpl: async (request) => {
        calls.push(request);
        return { response: { status: 204 }, payload: null };
      },
    });
    await cleanupDelete({
      name: 'strategy cleanup',
      route: '/dashboard/strategies/strategy-id',
      authToken: 'fixture-token',
      apiBaseUrl: 'https://api.soar.example.test',
      cleanup,
      requestJsonImpl: async () => ({ response: { status: 404 }, payload: null }),
    });
    await cleanupDelete({
      name: 'bot cleanup',
      route: '/dashboard/bots/bot-id',
      authToken: 'fixture-token',
      apiBaseUrl: 'https://api.soar.example.test',
      cleanup,
      requestJsonImpl: async () => {
        throw new Error('network stopped');
      },
    });
    await cleanupDelete({
      name: 'skipped cleanup',
      route: '',
      authToken: 'fixture-token',
      apiBaseUrl: 'https://api.soar.example.test',
      cleanup,
      requestJsonImpl: async () => {
        throw new Error('should not run');
      },
    });

    assert.equal(calls[0].method, 'DELETE');
    assert.equal(calls[0].route, '/dashboard/wallets/wallet-id');
    assert.deepEqual(cleanup, [
      { name: 'wallet cleanup', status: 'PASS', httpStatus: 204 },
      { name: 'strategy cleanup', status: 'FAIL', httpStatus: 404 },
      { name: 'bot cleanup', status: 'FAIL', notes: 'network stopped' },
    ]);
  } finally {
    await harness.cleanup();
  }
});

test('renderMarkdown and sleep produce redacted local proof summaries', async () => {
  const harness = await importHarness();
  try {
    const { renderMarkdown, sleep, toStep } = harness.module;
    const markdown = renderMarkdown(
      {
        status: 'PARTIAL',
        today: '2026-06-07',
        generatedAt: '2026-06-07T00:00:00.000Z',
        expectedSha: '12345678',
        buildInfo: { gitSha: '1234567890abcdef' },
        fixturePrefix: 'Codex V1 Proof 202606070000',
        steps: [toStep('manual paper limit cancel fail-closed without ack', 'PASS', { httpStatus: 400 })],
        cleanup: [toStep('wallet cleanup', 'PASS', { httpStatus: 204 })],
        blockers: ['audit log read passed but latest page did not include probe event'],
      },
      'history/artifacts/prod-fixture.json',
    );

    assert.match(markdown, /Production Fixture Action Proof/);
    assert.match(markdown, /manual paper limit cancel fail-closed without ack/);
    assert.match(markdown, /wallet cleanup/);
    assert.match(markdown, /Auth tokens, passwords, cookies/);
    assert.doesNotMatch(markdown, /synthetic-local-test-token/);

    await sleep(1);
  } finally {
    await harness.cleanup();
  }
});

test('main help path prints usage without requiring production approval or auth', async () => {
  const harness = await importHarness(['--help']);
  const originalWrite = process.stdout.write;
  let output = '';
  try {
    const { main, printUsage } = harness.module;
    process.stdout.write = (chunk) => {
      output += String(chunk);
      return true;
    };

    printUsage();
    assert.match(output, /Usage: node scripts\/runProdFixtureActionProof\.mjs/);
    output = '';

    await main();
    assert.match(output, /--i-understand-production-fixture-risk/);
    assert.doesNotMatch(output, /synthetic-local-test-token/);
  } finally {
    process.stdout.write = originalWrite;
    await harness.cleanup();
  }
});
