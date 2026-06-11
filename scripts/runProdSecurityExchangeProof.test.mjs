import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

const scriptUrl = pathToFileURL(path.resolve('scripts/runProdSecurityExchangeProof.mjs'));

const importHarness = async (argv = [], env = {}) => {
  const originalArgv = process.argv;
  const originalEnv = { ...process.env };

  process.argv = ['node', 'scripts/runProdSecurityExchangeProof.test.mjs', ...argv];
  process.env.PROD_SECURITY_EXCHANGE_WEB_BASE_URL = ' https://soar.example.test/// ';
  process.env.PROD_SECURITY_EXCHANGE_API_BASE_URL = ' https://api.soar.example.test/// ';
  process.env.PROD_SECURITY_EXCHANGE_EXPECTED_SHA = 'abcdef1234567890';
  process.env.PROD_SECURITY_EXCHANGE_AUTH_TOKEN = 'synthetic-local-test-token';
  process.env.PROD_SECURITY_EXCHANGE_AUTH_EMAIL = 'local@example.test';
  process.env.PROD_SECURITY_EXCHANGE_AUTH_PASSWORD = 'synthetic-local-password';
  process.env.PROD_SECURITY_EXCHANGE_OUTPUT_JSON = 'history/artifacts/prod-security-exchange.json';
  process.env.PROD_SECURITY_EXCHANGE_OUTPUT_MD = 'history/evidence/prod-security-exchange.md';
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

const headers = (values = {}) => ({
  get: (name) => values[String(name).toLowerCase()] ?? null,
});

test('argument and option helpers normalize production security exchange proof inputs without running the CLI', async () => {
  const harness = await importHarness([
    '--today',
    '2026-06-07',
    '--expected-sha',
    '1234567890',
    '--auth-token',
    'security-token',
    '--output-json',
    'history/artifacts/custom-prod-security-exchange.json',
    '--output-md',
    'history/evidence/custom-prod-security-exchange.md',
    '--i-understand-production-security-exchange-proof',
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
      authToken: 'security-token',
      authEmail: 'local@example.test',
      authPassword: 'synthetic-local-password',
      outputJson: 'history/artifacts/custom-prod-security-exchange.json',
      outputMd: 'history/evidence/custom-prod-security-exchange.md',
      today: '2026-06-07',
      approved: true,
    });
  } finally {
    await harness.cleanup();
  }
});

test('readJson and requestJson parse responses and send only redaction-safe request metadata', async () => {
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
        status: 403,
        text: async () => '{"error":"forbidden"}',
      };
    };

    const result = await requestJson({
      apiBaseUrl: 'https://api.soar.example.test',
      token: 'token value',
      method: 'POST',
      route: '/dashboard/profile/apiKeys/test',
      origin: 'https://evil.example',
      body: { exchange: 'COINBASE' },
    });

    assert.equal(result.response.status, 403);
    assert.deepEqual(result.payload, { error: 'forbidden' });
    assert.equal(calls[0].url, 'https://api.soar.example.test/dashboard/profile/apiKeys/test');
    assert.equal(calls[0].options.headers.Cookie, 'token=token%20value');
    assert.equal(calls[0].options.headers.Origin, 'https://evil.example');
    assert.equal(calls[0].options.headers['content-type'], 'application/json');
    assert.equal(calls[0].options.body, '{"exchange":"COINBASE"}');
  } finally {
    globalThis.fetch = originalFetch;
    await harness.cleanup();
  }
});

test('status, header, key-material, catalog, and step helpers classify local outcomes deterministically', async () => {
  const harness = await importHarness();
  try {
    const {
      assertStatus,
      hasNoStoreHeaders,
      hasSecurityHeaders,
      payloadContainsKeyMaterial,
      readCatalogMarkets,
      toStep,
    } = harness.module;

    assert.doesNotThrow(() => assertStatus('security headers', 200, [200, 204]));
    assert.throws(() => assertStatus('security headers', 500, [200, 204]), /security headers expected HTTP 200\/204 but got 500/);
    assert.equal(hasNoStoreHeaders({ headers: headers({ 'cache-control': 'private, no-store', pragma: 'no-cache' }) }), true);
    assert.equal(hasNoStoreHeaders({ headers: headers({ 'cache-control': 'public' }) }), false);
    assert.equal(hasSecurityHeaders({ headers: headers({ 'x-content-type-options': 'nosniff', 'x-frame-options': 'DENY' }) }), true);
    assert.equal(hasSecurityHeaders({ headers: headers({ 'x-content-type-options': 'nosniff' }) }), false);
    assert.equal(payloadContainsKeyMaterial({ apiSecret: 'SECRET_PLACEHOLDER' }), true);
    assert.equal(payloadContainsKeyMaterial({ items: [{ exchange: 'BINANCE', connected: true }] }), false);
    assert.deepEqual(readCatalogMarkets({ markets: [{ symbol: 'BTCUSDT' }] }), [{ symbol: 'BTCUSDT' }]);
    assert.deepEqual(readCatalogMarkets({ items: [{ symbol: 'ETHUSDT' }] }), [{ symbol: 'ETHUSDT' }]);
    assert.deepEqual(readCatalogMarkets([{ symbol: 'SOLUSDT' }]), [{ symbol: 'SOLUSDT' }]);
    assert.deepEqual(readCatalogMarkets({ data: [] }), []);
    assert.deepEqual(toStep('unsupported exchange probe fail-closed', 'PASS', { httpStatus: 501 }), {
      name: 'unsupported exchange probe fail-closed',
      status: 'PASS',
      httpStatus: 501,
    });
  } finally {
    await harness.cleanup();
  }
});

test('renderMarkdown and main help path produce redacted local proof summaries', async () => {
  const harness = await importHarness(['--help']);
  const originalWrite = process.stdout.write;
  let output = '';
  try {
    const { main, printUsage, renderMarkdown, toStep } = harness.module;
    process.stdout.write = (chunk) => {
      output += String(chunk);
      return true;
    };

    const markdown = renderMarkdown(
      {
        status: 'PARTIAL',
        today: '2026-06-07',
        generatedAt: '2026-06-07T00:00:00.000Z',
        expectedSha: '12345678',
        buildInfo: { gitSha: '1234567890abcdef' },
        steps: [toStep('untrusted origin state change fail-closed', 'PASS', { httpStatus: 403 })],
        blockers: ['unsupported exchange probe payload contained key material'],
      },
      'history/artifacts/prod-security-exchange.json',
    );

    assert.match(markdown, /Production Security And Exchange Proof/);
    assert.match(markdown, /untrusted origin state change fail-closed/);
    assert.match(markdown, /Auth tokens, passwords, cookies/);
    assert.doesNotMatch(markdown, /synthetic-local-test-token/);

    printUsage();
    assert.match(output, /Usage: node scripts\/runProdSecurityExchangeProof\.mjs/);
    output = '';

    await main();
    assert.match(output, /--i-understand-production-security-exchange-proof/);
    assert.doesNotMatch(output, /synthetic-local-test-token/);
  } finally {
    process.stdout.write = originalWrite;
    await harness.cleanup();
  }
});
