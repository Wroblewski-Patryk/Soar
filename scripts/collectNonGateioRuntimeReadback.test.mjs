import assert from 'node:assert/strict';
import http from 'node:http';
import test from 'node:test';

import {
  assertOptions,
  fetchJson,
  hash,
  normalizeBaseUrl,
  readArgValue,
  safeNumber,
  summarizeAggregate,
  summarizeBot,
  summarizeSession,
} from './collectNonGateioRuntimeReadback.mjs';

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

test('readback helpers normalize non-secret options and redact ids', () => {
  assert.equal(readArgValue('--base-url', ['--base-url', 'https://api.example.test']), 'https://api.example.test');
  assert.equal(normalizeBaseUrl(' https://api.example.test/// '), 'https://api.example.test');
  assert.equal(hash('bot-123')?.length, 12);
  assert.equal(hash(''), null);
  assert.equal(safeNumber(42), 42);
  assert.equal(safeNumber(Number.NaN), null);

  assert.deepEqual(summarizeBot({
    id: 'bot-123',
    name: 'Binance Paper',
    mode: 'PAPER',
    exchange: 'BINANCE',
    marketType: 'FUTURES',
    isActive: 1,
    liveOptIn: 0,
  }), {
    idHash: hash('bot-123'),
    name: 'Binance Paper',
    mode: 'PAPER',
    exchange: 'BINANCE',
    marketType: 'FUTURES',
    isActive: true,
    liveOptIn: false,
  });
});

test('readback summarizers preserve counts and reject unsafe numeric values', () => {
  const session = summarizeSession({
    id: 'session-1',
    status: 'RUNNING',
    mode: 'PAPER',
    symbolsTracked: 3,
    eventsCount: 9,
  });
  assert.equal(session.idHash, hash('session-1'));
  assert.equal(session.status, 'RUNNING');
  assert.equal(session.heartbeatAgeSeconds, null);

  const aggregate = summarizeAggregate({
    sessionDetail: { id: 'session-1', status: 'RUNNING' },
    symbolStats: {
      items: [{}, {}],
      summary: { totalSignals: 7, openPositionCount: Number.NaN },
    },
    positions: {
      total: 4,
      openCount: 2,
      closedCount: 2,
      openOrdersCount: 1,
      historyItems: [{}, {}, {}],
      openItems: [{}],
      summary: { realizedPnl: 1.5, unrealizedPnl: -0.2, feesPaid: '3' },
    },
    trades: { total: 5, items: [{}, {}], feesPaid: 0.04 },
  });

  assert.equal(aggregate.symbolStats.items, 2);
  assert.equal(aggregate.symbolStats.totalSignals, 7);
  assert.equal(aggregate.symbolStats.openPositionCount, null);
  assert.equal(aggregate.positions.historyItems, 3);
  assert.equal(aggregate.positions.feesPaid, null);
  assert.equal(aggregate.trades.items, 2);
});

test('assertOptions fails closed without read-only auth material', () => {
  assert.throws(
    () => assertOptions({ baseUrl: 'https://api.example.test', webBaseUrl: 'https://web.example.test' }),
    /Missing auth token or login credentials/,
  );
  assert.doesNotThrow(() =>
    assertOptions({
      baseUrl: 'https://api.example.test',
      webBaseUrl: 'https://web.example.test',
      authToken: 'token',
    }),
  );
});

test('fetchJson parses JSON and reports HTTP failures without leaking headers', async () => {
  const server = http.createServer((request, response) => {
    if (request.url === '/ok') {
      response.writeHead(200, { 'content-type': 'application/json' });
      response.end(JSON.stringify({ status: 'ok' }));
      return;
    }
    response.writeHead(503, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ message: 'service unavailable' }));
  });
  const port = await listen(server);
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    assert.deepEqual(await fetchJson(`${baseUrl}/ok`, { timeoutMs: 500 }), { status: 'ok' });
    await assert.rejects(
      () => fetchJson(`${baseUrl}/fail`, { headers: { Authorization: 'Bearer secret' }, timeoutMs: 500 }),
      /HTTP 503: service unavailable/,
    );
  } finally {
    await closeServer(server);
  }
});
