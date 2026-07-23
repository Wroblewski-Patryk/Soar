import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import http from 'node:http';
import test from 'node:test';

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

const sendText = (response, statusCode, body) => {
  response.writeHead(statusCode, { 'content-type': 'text/plain' });
  response.end(body);
};

const testSha = 'abcdef0123456789abcdef0123456789abcdef01';

const startSmokeTargets = async ({ healthHandler, workersHandler }) => {
  const api = http.createServer((request, response) => {
    if (request.url === '/health') {
      healthHandler(request, response);
      return;
    }
    if (request.url === '/ready') {
      sendJson(response, 200, { status: 'ready' });
      return;
    }
    if (request.url === '/workers/ready' && workersHandler) {
      workersHandler(request, response);
      return;
    }
    sendJson(response, 404, { error: 'not_found' });
  });

  const web = http.createServer((request, response) => {
    if (request.url === '/') {
      sendText(response, 200, 'ok');
      return;
    }
    if (request.url === '/api/build-info') {
      sendJson(response, 200, { gitSha: testSha });
      return;
    }
    sendJson(response, 404, { error: 'not_found' });
  });

  const [apiPort, webPort] = await Promise.all([listen(api), listen(web)]);
  return {
    api,
    apiBaseUrl: `http://127.0.0.1:${apiPort}`,
    web,
    webBaseUrl: `http://127.0.0.1:${webPort}`,
  };
};

const runSmoke = ({ apiBaseUrl, webBaseUrl }, { includeWorkers = false } = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        'scripts/deploySmokeCheck.mjs',
        '--api-base-url',
        apiBaseUrl,
        '--web-base-url',
        webBaseUrl,
        '--expected-sha',
        testSha,
        ...(includeWorkers ? [] : ['--no-workers']),
      ],
      {
        cwd: new URL('..', import.meta.url),
        env: {
          ...process.env,
          SMOKE_TIMEOUT_MS: '200',
          SMOKE_TRANSIENT_RETRIES: '1',
        },
      },
    );
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.once('error', reject);
    child.once('close', (status) => {
      resolve({ status, stdout, stderr });
    });
  });

test('deploy smoke retries a transient endpoint timeout and records the retry in output', async () => {
  let healthAttempts = 0;
  const targets = await startSmokeTargets({
    healthHandler: (_request, response) => {
      healthAttempts += 1;
      if (healthAttempts === 1) {
        setTimeout(() => sendJson(response, 200, { status: 'ok', release: { gitSha: testSha } }), 450);
        return;
      }
      sendJson(response, 200, { status: 'ok', release: { gitSha: testSha } });
    },
  });

  try {
    const result = await runSmoke(targets);

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.equal(healthAttempts, 2);
    assert.match(result.stdout, /PASS API \/health .* -> 200 gitSha=.* after 2 attempts/);
    assert.match(result.stdout, /transient retry: attempt 1: timeout after 200ms/);
  } finally {
    await Promise.all([closeServer(targets.api), closeServer(targets.web)]);
  }
});

test('deploy smoke does not retry real HTTP status failures', async () => {
  let healthAttempts = 0;
  const targets = await startSmokeTargets({
    healthHandler: (_request, response) => {
      healthAttempts += 1;
      sendJson(response, 500, { status: 'down' });
    },
  });

  try {
    const result = await runSmoke(targets);

    assert.equal(result.status, 1);
    assert.equal(healthAttempts, 1);
    assert.match(result.stdout, /FAIL API \/health .* -> status 500/);
    assert.match(result.stderr, /\[deploy-smoke\] failed checks: 1/);
  } finally {
    await Promise.all([closeServer(targets.api), closeServer(targets.web)]);
  }
});

test('deploy smoke accepts workers only when every heartbeat matches the candidate', async () => {
  const targets = await startSmokeTargets({
    healthHandler: (_request, response) => {
      sendJson(response, 200, { status: 'ok', release: { gitSha: testSha } });
    },
    workersHandler: (_request, response) => {
      sendJson(response, 200, {
        status: 'ready',
        topologyStatus: 'ready',
        heartbeats: ['backtest', 'execution', 'market-data', 'market-stream'].map((worker) => ({
          worker,
          status: 'fresh',
          releaseSha: testSha,
        })),
      });
    },
  });

  try {
    const result = await runSmoke(targets, { includeWorkers: true });

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(result.stdout, /PASS API \/workers\/ready -> 200 workers=4 gitSha=/);
  } finally {
    await Promise.all([closeServer(targets.api), closeServer(targets.web)]);
  }
});

test('deploy smoke rejects a fresh worker heartbeat from another release', async () => {
  const targets = await startSmokeTargets({
    healthHandler: (_request, response) => {
      sendJson(response, 200, { status: 'ok', release: { gitSha: testSha } });
    },
    workersHandler: (_request, response) => {
      sendJson(response, 200, {
        status: 'ready',
        topologyStatus: 'ready',
        heartbeats: [
          { worker: 'backtest', status: 'fresh', releaseSha: testSha },
          { worker: 'execution', status: 'fresh', releaseSha: '1111111111111111111111111111111111111111' },
        ],
      });
    },
  });

  try {
    const result = await runSmoke(targets, { includeWorkers: true });

    assert.equal(result.status, 1);
    assert.match(result.stdout, /FAIL API \/workers\/ready -> 200 worker release mismatch workers=execution/);
  } finally {
    await Promise.all([closeServer(targets.api), closeServer(targets.web)]);
  }
});
