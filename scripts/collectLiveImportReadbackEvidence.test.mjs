import assert from 'node:assert/strict';
import http from 'node:http';
import test from 'node:test';

import {
  assertOptions,
  collectAllPositions,
  collectSymbolPositions,
  discoverBots,
  discoverSymbolsFromRuntimeReadback,
  fetchJson,
  hashId,
  main,
  normalizeBaseUrl,
  normalizeSymbol,
  printUsage,
  readArgValue,
  redactBot,
  redactPosition,
  redactSession,
  resolveBuildInfo,
  resolveOptions,
  resolveSession,
  splitCsv,
} from './collectLiveImportReadbackEvidence.mjs';

const listen = (server) =>
  new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.off('error', reject);
      resolve(server.address().port);
    });
  });

const closeServer = (server) =>
  new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });

const sendJson = (response, statusCode, payload) => {
  response.writeHead(statusCode, { 'content-type': 'application/json' });
  response.end(JSON.stringify(payload));
};

const startReadbackServer = async ({ handler }) => {
  const requests = [];
  const server = http.createServer((request, response) => {
    requests.push({
      url: request.url,
      authorization: request.headers.authorization ?? '',
      cookie: request.headers.cookie ?? '',
    });
    handler(request, response);
  });
  const port = await listen(server);
  return {
    server,
    requests,
    baseUrl: `http://127.0.0.1:${port}`,
  };
};

const createConsoleCapture = () => {
  const chunks = [];
  return {
    stdout: {
      write: (value) => {
        chunks.push(String(value));
      },
    },
    text: () => chunks.join(''),
  };
};

const routeReadbackFixture = (request, response) => {
  if (request.url === '/api/build-info') {
    sendJson(response, 200, { gitSha: 'abc123456789', gitRef: 'main' });
    return;
  }
  if (request.url === '/dashboard/bots?marketType=FUTURES') {
    sendJson(response, 200, [
      { id: 'bot-live', name: 'Live Bot', mode: 'LIVE', marketType: 'FUTURES' },
      { id: 'bot-paper', name: 'Paper Bot', mode: 'PAPER', marketType: 'FUTURES' },
    ]);
    return;
  }
  if (request.url === '/dashboard/bots/bot-live') {
    sendJson(response, 200, { id: 'bot-live', name: 'Live Bot', mode: 'LIVE' });
    return;
  }
  if (request.url === '/dashboard/bots/bot-live/runtime-sessions?status=RUNNING&limit=1') {
    sendJson(response, 200, [{ id: 'session-1', status: 'RUNNING', eventsCount: 3 }]);
    return;
  }
  if (request.url === '/dashboard/bots/bot-live/runtime-sessions/session-1') {
    sendJson(response, 200, { id: 'session-1', status: 'RUNNING', eventsCount: 3 });
    return;
  }
  if (request.url === '/dashboard/bots/bot-live/runtime-sessions/session-1/positions?limit=50') {
    sendJson(response, 200, {
      total: 2,
      openCount: 2,
      closedCount: 0,
      openOrdersCount: 1,
      showDynamicStopColumns: true,
      openItems: [
        { id: 'position-1', symbol: 'ethusdt', status: 'OPEN' },
        { id: 'position-2', symbol: 'DOGEUSDT', status: 'OPEN' },
      ],
    });
    return;
  }
  if (
    request.url ===
    '/dashboard/bots/bot-live/runtime-sessions/session-1/positions?symbol=ETHUSDT&limit=50'
  ) {
    sendJson(response, 200, {
      total: 1,
      openCount: 1,
      closedCount: 0,
      openOrdersCount: 0,
      showDynamicStopColumns: true,
      openItems: [
        {
          id: 'position-1',
          symbol: 'ETHUSDT',
          status: 'OPEN',
          side: 'LONG',
          origin: 'IMPORTED',
          strategyId: 'strategy-secret-id',
          dcaPlannedLevels: [{ price: '1' }],
          trailingTakeProfitLevels: [{ price: '2' }],
          trailingStopLevels: [],
        },
      ],
    });
    return;
  }
  if (
    request.url ===
    '/dashboard/bots/bot-live/runtime-sessions/session-1/positions?symbol=DOGEUSDT&limit=50'
  ) {
    sendJson(response, 200, {
      total: 1,
      openCount: 1,
      closedCount: 0,
      openOrdersCount: 0,
      showDynamicStopColumns: false,
      openItems: [{ id: 'position-2', symbol: 'DOGEUSDT', status: 'OPEN' }],
    });
    return;
  }
  if (request.url?.startsWith('/dashboard/bots/bot-live/runtime-sessions/session-1/positions?symbol=')) {
    sendJson(response, 200, {
      total: 0,
      openCount: 0,
      closedCount: 0,
      openOrdersCount: 0,
      showDynamicStopColumns: false,
      openItems: [],
    });
    return;
  }
  sendJson(response, 404, { message: `unexpected ${request.url}` });
};

test('argument and option helpers normalize safe CLI input', () => {
  const rawArgs = ['--base-url', ' https://api.example.test/// ', '--symbols', ' ethusdt, dogeusdt '];
  const options = resolveOptions({ rawArgs, env: { LIVEIMPORT_READBACK_TIMEOUT_MS: '25' } });

  assert.equal(readArgValue('--symbols', rawArgs), ' ethusdt, dogeusdt ');
  assert.equal(normalizeBaseUrl(' https://api.example.test/// '), 'https://api.example.test');
  assert.equal(normalizeSymbol(' ethusdt '), 'ETHUSDT');
  assert.deepEqual(splitCsv(' ethusdt, , dogeusdt '), ['ethusdt', 'dogeusdt']);
  assert.equal(options.baseUrl, 'https://api.example.test');
  assert.deepEqual(options.symbols, ['ETHUSDT', 'DOGEUSDT']);
  assert.equal(options.timeoutMs, 25);
  assert.doesNotThrow(() => assertOptions(options));
  assert.throws(
    () => assertOptions({ baseUrl: 'https://api.example.test', symbols: [], autoDiscoverSymbols: false }),
    /At least one --symbols/
  );
});

test('redactors hash identifiers and preserve only non-secret readback fields', () => {
  assert.equal(hashId('stable-id').length, 12);
  assert.equal(hashId(''), null);

  const bot = redactBot({
    id: 'bot-id',
    name: 'production bot',
    mode: 'LIVE',
    exchange: 'BINANCE',
    walletId: 'wallet-id',
    apiKeyId: 'api-key-id',
    marketGroups: [{ lifecycleStatus: 'ACTIVE', isEnabled: true }],
  });
  const session = redactSession({ id: 'session-id', status: 'RUNNING', eventsCount: 2 });
  const position = redactPosition({
    id: 'position-id',
    symbol: 'ETHUSDT',
    strategyId: 'strategy-id',
    dcaPlannedLevels: [{ price: '1' }],
    trailingTakeProfitLevels: [],
    trailingStopLevels: [{ price: '2' }],
  });

  assert.equal(bot.idHash.length, 12);
  assert.equal(bot.walletIdHash.length, 12);
  assert.equal(bot.apiKeyIdHash.length, 12);
  assert.equal(bot.activeMarketGroups, 1);
  assert.equal(session.idHash.length, 12);
  assert.equal(position.strategyIdHash.length, 12);
  assert.equal(position.dcaPlannedLevelsCount, 1);
  assert.equal(position.trailingStopLevelsCount, 1);
  assert.equal(bot.id, undefined);
  assert.equal(position.strategyId, undefined);
});

test('fetchJson parses successful JSON and fails closed on HTTP errors', async () => {
  const target = await startReadbackServer({
    handler: (request, response) => {
      if (request.url === '/ok') {
        sendJson(response, 200, { ok: true });
        return;
      }
      sendJson(response, 503, { error: { message: 'not ready' } });
    },
  });

  try {
    assert.deepEqual(await fetchJson(`${target.baseUrl}/ok`, { timeoutMs: 500 }), { ok: true });
    await assert.rejects(
      () => fetchJson(`${target.baseUrl}/fail`, { timeoutMs: 500 }),
      /HTTP 503: not ready/
    );
  } finally {
    await closeServer(target.server);
  }
});

test('runtime readback helpers discover bots, sessions, symbols, and redacted positions locally', async () => {
  const target = await startReadbackServer({ handler: routeReadbackFixture });
  const options = {
    baseUrl: target.baseUrl,
    botId: '',
    sessionId: '',
    symbols: ['ETHUSDT'],
    timeoutMs: 500,
  };

  try {
    const bots = await discoverBots(options, { Authorization: 'Bearer fake-token' });
    assert.deepEqual(bots.map((bot) => bot.id), ['bot-live']);

    const session = await resolveSession(options, {}, 'bot-live');
    assert.equal(session.id, 'session-1');

    const allPositions = await collectAllPositions(options, {}, 'bot-live', 'session-1');
    assert.deepEqual(discoverSymbolsFromRuntimeReadback(allPositions), ['ETHUSDT', 'DOGEUSDT']);

    const symbols = await collectSymbolPositions(options, {}, 'bot-live', 'session-1');
    assert.equal(symbols[0].symbol, 'ETHUSDT');
    assert.equal(symbols[0].importCompleteness, 'VISIBLE');
    assert.equal(symbols[0].openItems[0].id, undefined);
    assert.equal(symbols[0].openItems[0].strategyIdHash.length, 12);
  } finally {
    await closeServer(target.server);
  }
});

test('resolveBuildInfo reports expected SHA match without hitting production', async () => {
  const target = await startReadbackServer({ handler: routeReadbackFixture });

  try {
    const result = await resolveBuildInfo({
      webBaseUrl: target.baseUrl,
      expectedSha: 'abc123',
      timeoutMs: 500,
    });

    assert.equal(result.matchesExpected, true);
    assert.equal(result.gitRef, 'main');
  } finally {
    await closeServer(target.server);
  }
});

test('main handles help, dry-run, missing auth, and successful local evidence collection', async () => {
  const help = createConsoleCapture();
  await main({ rawArgs: ['--help'], stdout: help.stdout });
  assert.match(help.text(), /Usage: node scripts\/collectLiveImportReadbackEvidence\.mjs/);

  const dryRun = createConsoleCapture();
  await main({
    rawArgs: ['--base-url', 'http://api.local', '--symbols', 'auto', '--dry-run'],
    env: {},
    stdout: dryRun.stdout,
  });
  assert.deepEqual(JSON.parse(dryRun.text()).symbols, 'auto');

  await assert.rejects(
    () =>
      main({
        rawArgs: ['--base-url', 'http://api.local'],
        env: {},
        stdout: createConsoleCapture().stdout,
        resolveAuthToken: async () => ({ token: '', source: 'none' }),
      }),
    /Missing read-only production auth token/
  );

  const target = await startReadbackServer({ handler: routeReadbackFixture });
  const success = createConsoleCapture();
  const writes = [];

  try {
    await main({
      rawArgs: [
        '--base-url',
        target.baseUrl,
        '--web-base-url',
        target.baseUrl,
        '--expected-sha',
        'abc123',
        '--symbols',
        'ETHUSDT,DOGEUSDT',
        '--output',
        'history/artifacts/test-liveimport-readback.json',
      ],
      env: { LIVEIMPORT_READBACK_TIMEOUT_MS: '500' },
      stdout: success.stdout,
      resolveAuthToken: async () => ({ token: 'fake-token', source: 'provided' }),
      writeFileImpl: async (path, body) => writes.push({ path, body }),
      now: () => new Date('2026-06-07T09:40:00.000Z'),
    });

    const evidence = JSON.parse(success.text().split('\n[ops:liveimport:readback] wrote ')[0]);
    assert.equal(evidence.generatedAt, '2026-06-07T09:40:00.000Z');
    assert.equal(evidence.target.buildInfo.matchesExpected, true);
    assert.equal(evidence.summary.botsChecked, 1);
    assert.equal(evidence.summary.botsWithRuntimeReadback, 1);
    assert.deepEqual(evidence.summary.symbolsVisible, ['ETHUSDT', 'DOGEUSDT']);
    assert.equal(evidence.auth.tokenCaptured, false);
    assert.doesNotMatch(success.text(), /fake-token/);
    assert.equal(writes.length, 1);
    assert.equal(writes[0].path, 'history/artifacts/test-liveimport-readback.json');
  } finally {
    await closeServer(target.server);
  }
});

test('main fails closed when expected explicit symbols are not visible', async () => {
  const target = await startReadbackServer({ handler: routeReadbackFixture });

  try {
    await assert.rejects(
      () =>
        main({
          rawArgs: ['--base-url', target.baseUrl, '--symbols', 'BTCUSDT'],
          env: { LIVEIMPORT_READBACK_TIMEOUT_MS: '500' },
          stdout: createConsoleCapture().stdout,
          resolveAuthToken: async () => ({ token: 'fake-token', source: 'provided' }),
        }),
      /No runtime positions readback was collected|Missing runtime readback/
    );
  } finally {
    await closeServer(target.server);
  }
});
