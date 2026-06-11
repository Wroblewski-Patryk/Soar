import assert from 'node:assert/strict';
import test from 'node:test';

import {
  fetchWithTimeout,
  isRollbackCriticalAlert,
  main,
  parseArgs,
  printUsage,
} from './evaluateRollbackGuard.mjs';

const createConsoleCapture = () => {
  const lines = [];
  return {
    consoleImpl: {
      log: (...args) => lines.push(args.join(' ')),
    },
    lines,
  };
};

const jsonResponse = (status, payload) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => payload,
});

const createMainDoubles = ({ responses }) => {
  const requests = [];
  const authCalls = [];
  const headerCalls = [];
  return {
    requests,
    authCalls,
    headerCalls,
    resolveOpsAuthTokenImpl: async (options) => {
      authCalls.push(options);
      return { token: 'resolved-token' };
    },
    buildOpsRequestHeadersImpl: (options) => {
      headerCalls.push(options);
      return { Authorization: `Bearer ${options.token}` };
    },
    fetchImpl: async (url, options) => {
      requests.push({ url, options });
      const response = responses.shift();
      if (!response) throw new Error(`unexpected request: ${url}`);
      return response;
    },
  };
};

test('parseArgs reads environment defaults and rejects secret-bearing CLI flags', () => {
  const options = parseArgs(
    [
      '--base-url',
      'https://api.example.invalid///',
      '--auth-email',
      'ops@example.invalid',
      '--ops-auth-header-name',
      'X-Ops',
      '--ops-basic-user',
      'ops-user',
      '--timeout-ms',
      '2500',
    ],
    {
      ROLLBACK_GUARD_AUTH_TOKEN: 'env-token',
      ROLLBACK_GUARD_OPS_AUTH_HEADER_VALUE: 'env-header',
    }
  );

  assert.equal(options.baseUrl, 'https://api.example.invalid///');
  assert.equal(options.authToken, 'env-token');
  assert.equal(options.authEmail, 'ops@example.invalid');
  assert.equal(options.opsAuthHeaderName, 'X-Ops');
  assert.equal(options.opsAuthHeaderValue, 'env-header');
  assert.equal(options.opsBasicUser, 'ops-user');
  assert.equal(options.timeoutMs, 2500);

  assert.throws(
    () => parseArgs(['--auth-token', 'secret-value'], {}),
    /secret-bearing/
  );
});

test('printUsage writes allowed CLI flags without secret values', () => {
  const { consoleImpl, lines } = createConsoleCapture();

  printUsage(consoleImpl);

  const usage = lines.join('\n');
  assert.match(usage, /--base-url/);
  assert.match(usage, /ROLLBACK_GUARD_AUTH_TOKEN/);
  assert.doesNotMatch(usage, /secret-value/);
});

test('fetchWithTimeout injects abort signal and returns the fetch response', async () => {
  const response = jsonResponse(200, { ok: true });
  const result = await fetchWithTimeout(
    'data:application/json,{}',
    { method: 'GET', headers: { X: 'Y' } },
    1000,
    async (url, options) => {
      assert.equal(url, 'data:application/json,{}');
      assert.equal(options.method, 'GET');
      assert.equal(options.headers.X, 'Y');
      assert.equal(options.signal.aborted, false);
      return response;
    }
  );

  assert.equal(result, response);
});

test('isRollbackCriticalAlert classifies only rollback-triggering alert families', () => {
  assert.equal(isRollbackCriticalAlert({ code: 'worker_heartbeat_missing', severity: 'SEV-3' }), true);
  assert.equal(isRollbackCriticalAlert({ code: 'market_data_staleness', severity: 'INFO' }), true);
  assert.equal(isRollbackCriticalAlert({ code: 'runtime_signal_lag_stale', severity: 'WARN' }), true);
  assert.equal(isRollbackCriticalAlert({ code: 'runtime_restarts_repeated', severity: 'sev-1' }), true);
  assert.equal(isRollbackCriticalAlert({ code: 'runtime_reconciliation_drift', severity: 'SEV-1' }), true);
  assert.equal(isRollbackCriticalAlert({ code: 'runtime_restarts_repeated', severity: 'SEV-2' }), false);
  assert.equal(isRollbackCriticalAlert({ code: 'unrelated', severity: 'SEV-1' }), false);
});

test('main reports no rollback when workers, freshness, and alerts are healthy', async () => {
  const doubles = createMainDoubles({
    responses: [
      jsonResponse(200, {
        status: 'ready',
        topologyStatus: 'split',
        requiredWorkerFamilies: ['execution', 'market-data'],
      }),
      jsonResponse(200, { status: 'PASS', checks: [{ name: 'heartbeat', status: 'PASS' }] }),
      jsonResponse(200, { alerts: [{ code: 'runtime_restarts_repeated', severity: 'SEV-2' }] }),
    ],
  });
  const { consoleImpl, lines } = createConsoleCapture();

  const decision = await main({
    args: ['--base-url', 'https://api.example.invalid///'],
    env: {},
    ...doubles,
    consoleImpl,
    exitOnRollback: false,
    now: () => new Date('2026-06-07T12:00:00.000Z'),
  });

  assert.equal(decision.shouldRollback, false);
  assert.equal(decision.checkedAt, '2026-06-07T12:00:00.000Z');
  assert.deepEqual(decision.reasons, []);
  assert.deepEqual(
    doubles.requests.map((request) => request.url),
    [
      'https://api.example.invalid/workers/ready',
      'https://api.example.invalid/workers/runtime-freshness',
      'https://api.example.invalid/alerts',
    ]
  );
  assert.equal(doubles.authCalls[0].baseUrl, 'https://api.example.invalid');
  assert.equal(doubles.headerCalls[0].token, 'resolved-token');
  assert.match(lines.join('\n'), /"shouldRollback": false/);
});

test('main fails closed for protected endpoint errors, degraded workers, stale freshness, and critical alerts', async () => {
  const doubles = createMainDoubles({
    responses: [
      jsonResponse(401, {}),
      jsonResponse(200, { status: 'FAIL', checks: [{ name: 'lag', status: 'FAIL' }] }),
      jsonResponse(200, {
        alerts: [{ code: 'runtime_reconciliation_drift', severity: 'SEV-1' }],
      }),
    ],
  });

  const decision = await main({
    args: [],
    env: {
      ROLLBACK_GUARD_API_BASE_URL: 'https://api.example.invalid',
      ROLLBACK_GUARD_TIMEOUT_MS: '-1',
    },
    ...doubles,
    consoleImpl: createConsoleCapture().consoleImpl,
    exitOnRollback: false,
    now: () => new Date('2026-06-07T12:05:00.000Z'),
  });

  assert.equal(decision.shouldRollback, true);
  assert.deepEqual(decision.reasons, [
    'workers_ready_endpoint_http_401',
    'runtime_freshness_failed',
    'critical_alert:runtime_reconciliation_drift:SEV-1',
  ]);
});

test('main help returns without exiting when exitOnHelp is disabled', async () => {
  const { consoleImpl, lines } = createConsoleCapture();

  const result = await main({
    args: ['--help'],
    consoleImpl,
    exitOnHelp: false,
  });

  assert.deepEqual(result, { help: true });
  assert.match(lines.join('\n'), /Usage:/);
});
