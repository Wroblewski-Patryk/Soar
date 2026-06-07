import assert from 'node:assert/strict';
import http from 'node:http';
import test from 'node:test';

import {
  fetchWithTimeout,
  main,
  parseArgs,
} from './checkPostDeployRuntimeFreshness.mjs';

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

const startFreshnessServer = async ({ handler }) => {
  const server = http.createServer((request, response) => {
    if (request.url === '/workers/runtime-freshness') {
      handler(request, response);
      return;
    }
    sendJson(response, 404, { error: 'not_found' });
  });

  const port = await listen(server);
  return {
    server,
    baseUrl: `http://127.0.0.1:${port}`,
  };
};

const createConsoleCapture = () => {
  const lines = [];
  return {
    consoleImpl: {
      log: (...args) => lines.push(args.join(' ')),
    },
    lines,
  };
};

test('parseArgs rejects secret-bearing CLI values so tokens stay in environment variables', () => {
  assert.throws(
    () => parseArgs(['--auth-token', 'secret']),
    /--auth-token is secret-bearing/
  );
});

test('fetchWithTimeout aborts slow runtime freshness calls', async () => {
  const target = await startFreshnessServer({
    handler: (_request, response) => {
      setTimeout(() => sendJson(response, 200, { status: 'PASS' }), 250);
    },
  });

  try {
    await assert.rejects(
      () => fetchWithTimeout(`${target.baseUrl}/workers/runtime-freshness`, {}, 25),
      /aborted|AbortError/i
    );
  } finally {
    await closeServer(target.server);
  }
});

test('main requests the runtime freshness endpoint and reports PASS without secrets', async () => {
  let seenAuthorization = '';
  const target = await startFreshnessServer({
    handler: (request, response) => {
      seenAuthorization = request.headers.authorization ?? '';
      sendJson(response, 200, {
        status: 'PASS',
        checks: {
          workerHeartbeat: { status: 'PASS' },
        },
      });
    },
  });
  const { consoleImpl, lines } = createConsoleCapture();

  try {
    const result = await main({
      args: ['--base-url', target.baseUrl, '--timeout-ms', '500'],
      env: {
        DEPLOY_FRESHNESS_AUTH_TOKEN: 'test-token',
      },
      consoleImpl,
      exitOnHelp: false,
    });

    assert.equal(result.status, 'PASS');
    assert.equal(seenAuthorization, 'Bearer test-token');
    assert.match(lines.join('\n'), /\[ops:deploy:runtime-freshness\] PASS/);
    assert.doesNotMatch(lines.join('\n'), /test-token/);
  } finally {
    await closeServer(target.server);
  }
});

test('main fails closed when the runtime freshness endpoint reports FAIL', async () => {
  const target = await startFreshnessServer({
    handler: (_request, response) => {
      sendJson(response, 503, {
        status: 'FAIL',
        checks: {
          marketData: { status: 'FAIL' },
        },
      });
    },
  });

  try {
    await assert.rejects(
      () =>
        main({
          args: ['--base-url', target.baseUrl, '--timeout-ms', '500'],
          env: {},
          consoleImpl: createConsoleCapture().consoleImpl,
          exitOnHelp: false,
        }),
      /runtime freshness request failed with HTTP 503/
    );
  } finally {
    await closeServer(target.server);
  }
});
