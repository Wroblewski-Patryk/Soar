import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

const scriptUrl = pathToFileURL(path.resolve('scripts/runProdPositionsProof.mjs'));

const importHarness = async (argv = [], env = {}) => {
  const originalArgv = process.argv;
  const originalEnv = { ...process.env };

  process.argv = ['node', 'scripts/runProdPositionsProof.test.mjs', ...argv];
  process.env.PROD_POSITIONS_WEB_BASE_URL = ' https://soar.example.test/// ';
  process.env.PROD_POSITIONS_API_BASE_URL = ' https://api.soar.example.test/// ';
  process.env.PROD_POSITIONS_EXPECTED_SHA = 'abcdef1234567890';
  process.env.PROD_POSITIONS_AUTH_TOKEN = 'synthetic-local-test-token';
  process.env.PROD_POSITIONS_AUTH_EMAIL = 'local@example.test';
  process.env.PROD_POSITIONS_AUTH_PASSWORD = 'synthetic-local-password';
  process.env.PROD_POSITIONS_OUTPUT_JSON = 'history/artifacts/prod-positions.json';
  process.env.PROD_POSITIONS_OUTPUT_MD = 'history/evidence/prod-positions.md';
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

test('argument and option helpers normalize production positions proof inputs without running the CLI', async () => {
  const harness = await importHarness([
    '--today',
    '2026-06-07',
    '--expected-sha',
    '1234567890',
    '--auth-token',
    'positions-token',
    '--output-json',
    'history/artifacts/custom-prod-positions.json',
    '--output-md',
    'history/evidence/custom-prod-positions.md',
    '--i-understand-production-positions-proof',
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
      authToken: 'positions-token',
      authEmail: 'local@example.test',
      authPassword: 'synthetic-local-password',
      outputJson: 'history/artifacts/custom-prod-positions.json',
      outputMd: 'history/evidence/custom-prod-positions.md',
      today: '2026-06-07',
      approved: true,
    });
  } finally {
    await harness.cleanup();
  }
});

test('readJson and requestJson parse responses and preserve short invalid body previews', async () => {
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
        text: async () => '{"id":"position-id"}',
      };
    };

    const result = await requestJson({
      apiBaseUrl: 'https://api.soar.example.test',
      token: 'token value',
      method: 'PATCH',
      route: '/dashboard/positions/position-id/manual-update',
      body: { notes: 'local proof' },
    });

    assert.equal(result.response.status, 201);
    assert.deepEqual(result.payload, { id: 'position-id' });
    assert.equal(calls[0].url, 'https://api.soar.example.test/dashboard/positions/position-id/manual-update');
    assert.equal(calls[0].options.headers.Cookie, 'token=token%20value');
    assert.equal(calls[0].options.headers['content-type'], 'application/json');
    assert.equal(calls[0].options.body, '{"notes":"local proof"}');
  } finally {
    globalThis.fetch = originalFetch;
    await harness.cleanup();
  }
});

test('assertStatus, extractItems, and toStep classify local helper outcomes deterministically', async () => {
  const harness = await importHarness();
  try {
    const { assertStatus, extractItems, toStep } = harness.module;

    assert.doesNotThrow(() => assertStatus('positions list', 200, [200, 409]));
    assert.throws(() => assertStatus('positions list', 500, [200, 409]), /positions list expected HTTP 200\/409 but got 500/);
    assert.deepEqual(extractItems({ items: [{ id: 'a' }] }), [{ id: 'a' }]);
    assert.deepEqual(extractItems([{ id: 'b' }]), [{ id: 'b' }]);
    assert.deepEqual(extractItems({ openItems: [{ id: 'ignored' }] }), []);
    assert.deepEqual(toStep('positions takeover status read', 'PASS', { httpStatus: 200 }), {
      name: 'positions takeover status read',
      status: 'PASS',
      httpStatus: 200,
    });
  } finally {
    await harness.cleanup();
  }
});

test('findCandidate selects an active PAPER Binance runtime symbol without touching production', async () => {
  const harness = await importHarness();
  const originalFetch = globalThis.fetch;
  try {
    const { findCandidate } = harness.module;
    const calls = [];
    const payloads = new Map([
      [
        '/dashboard/bots?marketType=FUTURES',
        {
          items: [
            { id: 'live-bot', mode: 'LIVE', isActive: true, exchange: 'BINANCE', name: 'live skipped' },
            { id: 'paper-bot', mode: 'PAPER', isActive: true, exchange: 'BINANCE', name: 'paper candidate' },
          ],
        },
      ],
      ['/dashboard/bots/paper-bot/runtime-sessions?status=RUNNING&limit=5', { items: [{ id: 'session-1' }] }],
      [
        '/dashboard/bots/paper-bot/runtime-sessions/session-1/positions?limit=200',
        { openItems: [{ symbol: 'BTCUSDT' }] },
      ],
      [
        '/dashboard/bots/paper-bot/runtime-sessions/session-1/symbol-stats?limit=200',
        { items: [{ symbol: 'BTCUSDT' }, { symbol: 'ETHUSDT' }] },
      ],
    ]);

    globalThis.fetch = async (url, options) => {
      calls.push({ url, options });
      const route = new URL(url).pathname + new URL(url).search;
      return {
        status: payloads.has(route) ? 200 : 404,
        text: async () => JSON.stringify(payloads.get(route) ?? { items: [] }),
      };
    };

    const candidate = await findCandidate({
      apiBaseUrl: 'https://api.soar.example.test',
      token: 'positions-token',
    });

    assert.equal(candidate.bot.id, 'paper-bot');
    assert.equal(candidate.session.id, 'session-1');
    assert.equal(candidate.symbol, 'ETHUSDT');
    assert.equal(candidate.openBeforeCount, 1);
    assert.equal(candidate.statsSymbolsCount, 2);
    assert.equal(calls.length, 4);
    assert.equal(calls[0].options.headers.Cookie, 'token=positions-token');
  } finally {
    globalThis.fetch = originalFetch;
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
        selected: {
          botName: 'paper candidate',
          botId: 'bot-1',
          sessionId: 'session-1',
          symbol: 'ETHUSDT',
          orderId: 'order-1',
          positionId: 'position-1',
        },
        steps: [toStep('runtime position close fail-closed without ack', 'PASS', { httpStatus: 400 })],
        cleanup: [toStep('proof position terminal cleanup', 'PASS', { httpStatus: 200, notes: 'status=CLOSED' })],
        blockers: ['selected symbol already has an open position for selected bot'],
      },
      'history/artifacts/prod-positions.json',
    );

    assert.match(markdown, /Production Positions Proof/);
    assert.match(markdown, /runtime position close fail-closed without ack/);
    assert.match(markdown, /proof position terminal cleanup/);
    assert.match(markdown, /Auth tokens, passwords, cookies/);
    assert.doesNotMatch(markdown, /synthetic-local-test-token/);

    printUsage();
    assert.match(output, /Usage: node scripts\/runProdPositionsProof\.mjs/);
    output = '';

    await main();
    assert.match(output, /--i-understand-production-positions-proof/);
    assert.doesNotMatch(output, /synthetic-local-test-token/);
  } finally {
    process.stdout.write = originalWrite;
    await harness.cleanup();
  }
});
