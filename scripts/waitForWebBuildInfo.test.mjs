import { execFile } from 'node:child_process';
import http from 'node:http';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const withBuildInfoServer = async (payload, fn) => {
  const server = http.createServer((request, response) => {
    if (request.url !== '/api/build-info') {
      response.writeHead(404);
      response.end();
      return;
    }

    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify(payload));
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();

  try {
    return await fn(`http://127.0.0.1:${address.port}/api/build-info`);
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
};

const runWaitScript = (url, extraArgs = []) =>
  execFileAsync(
    process.execPath,
    [
      'scripts/waitForWebBuildInfo.mjs',
      '--build-info-url',
      url,
      '--expected-sha',
      'abc123',
      '--timeout-seconds',
      '1',
      '--interval-seconds',
      '1',
      ...extraArgs,
    ],
    { cwd: process.cwd() }
  );

test('prints usage for help without requiring deploy inputs', async () => {
  const { stdout } = await execFileAsync(
    process.execPath,
    ['scripts/waitForWebBuildInfo.mjs', '--help'],
    { cwd: process.cwd() }
  );

  assert.match(stdout, /Usage: node scripts\/waitForWebBuildInfo\.mjs/);
  assert.match(stdout, /--web-base-url <url>/);
  assert.match(stdout, /--expected-sha <sha>/);
  assert.match(stdout, /--allow-runtime-fallback/);
});

test('uses CLI argument values before conflicting environment fallbacks', async () => {
  await withBuildInfoServer(
    {
      buildId: 'build-cli-args',
      gitSha: 'abc123456789',
      gitRef: 'main',
      metadataSource: 'env',
    },
    async (url) => {
      const { stdout } = await execFileAsync(
        process.execPath,
        [
          'scripts/waitForWebBuildInfo.mjs',
          '--build-info-url',
          url,
          '--expected-sha',
          'abc123',
          '--timeout-seconds',
          '1',
          '--interval-seconds',
          '1',
        ],
        {
          cwd: process.cwd(),
          env: {
            ...process.env,
            WEB_BUILD_INFO_URL: 'http://127.0.0.1:1/api/build-info',
            WEB_BUILD_INFO_EXPECTED_SHA: 'wrong-sha',
            WEB_BUILD_INFO_TIMEOUT_SECONDS: '99',
          },
        }
      );

      assert.match(stdout, /buildId=build-cli-args/);
      assert.match(stdout, /\[wait:web-build-info\] PASS/);
    }
  );
});

test('uses environment fallbacks when CLI deploy inputs are omitted', async () => {
  await withBuildInfoServer(
    {
      buildId: 'build-env-fallbacks',
      gitSha: 'abc123456789',
      gitRef: 'main',
      metadataSource: 'env',
    },
    async (url) => {
      const origin = new URL(url).origin;
      const { stdout } = await execFileAsync(
        process.execPath,
        ['scripts/waitForWebBuildInfo.mjs'],
        {
          cwd: process.cwd(),
          env: {
            ...process.env,
            WEB_BUILD_INFO_BASE_URL: `${origin}///`,
            WEB_BUILD_INFO_EXPECTED_SHA: 'abc123',
            WEB_BUILD_INFO_TIMEOUT_SECONDS: '1',
            WEB_BUILD_INFO_INTERVAL_SECONDS: '1',
          },
        }
      );

      assert.match(stdout, /buildId=build-env-fallbacks/);
      assert.match(stdout, /\[wait:web-build-info\] PASS/);
    }
  );
});

test('waits between build-info polling attempts before a later match passes', async () => {
  let requestCount = 0;
  const server = http.createServer((request, response) => {
    if (request.url !== '/api/build-info') {
      response.writeHead(404);
      response.end();
      return;
    }

    requestCount += 1;
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(
      JSON.stringify({
        buildId: `build-retry-${requestCount}`,
        gitSha: requestCount === 1 ? 'pending000' : 'abc123456789',
        gitRef: 'main',
        metadataSource: 'env',
      })
    );
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const startedAt = Date.now();

  try {
    const { stdout } = await execFileAsync(
      process.execPath,
      [
        'scripts/waitForWebBuildInfo.mjs',
        '--build-info-url',
        `http://127.0.0.1:${address.port}/api/build-info`,
        '--expected-sha',
        'abc123',
        '--timeout-seconds',
        '3',
        '--interval-seconds',
        '1',
      ],
      { cwd: process.cwd() }
    );

    const elapsedMs = Date.now() - startedAt;
    assert.equal(requestCount, 2);
    assert.ok(elapsedMs >= 900, `expected retry sleep, elapsed=${elapsedMs}`);
    assert.ok(elapsedMs < 2500, `expected bounded retry sleep, elapsed=${elapsedMs}`);
    assert.match(stdout, /attempt=1 status=200 gitSha=pending000/);
    assert.match(stdout, /attempt=2 status=200 gitSha=abc123456789/);
    assert.match(stdout, /\[wait:web-build-info\] PASS/);
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  }
});

test('passes when the expected SHA has authoritative build-time deploy metadata', async () => {
  await withBuildInfoServer(
    {
      buildId: 'build-001',
      gitSha: 'abc123456789',
      gitRef: 'main',
      metadataSource: 'env',
    },
    async (url) => {
      const { stdout } = await runWaitScript(url);
      assert.match(stdout, /metadataSource=env/);
      assert.match(stdout, /\[wait:web-build-info\] PASS/);
    }
  );
});

test('fails when a matching SHA comes only from build-time GitHub branch fallback', async () => {
  await withBuildInfoServer(
    {
      buildId: 'build-002',
      gitSha: 'abc123456789',
      gitRef: 'main',
      metadataSource: 'github-branch',
    },
    async (url) => {
      await assert.rejects(runWaitScript(url), /unaccepted metadataSource=github-branch/);
    }
  );
});

test('fails when a matching SHA comes only from runtime GitHub fallback', async () => {
  await withBuildInfoServer(
    {
      buildId: 'build-003',
      gitSha: 'abc123456789',
      gitRef: 'main',
      metadataSource: 'github-branch-runtime',
    },
    async (url) => {
      await assert.rejects(
        runWaitScript(url),
        /unaccepted metadataSource=github-branch-runtime/
      );
    }
  );
});

test('fails when deploy metadata lacks a real production build id', async () => {
  await withBuildInfoServer(
    {
      buildId: 'unknown-production-build',
      gitSha: 'abc123456789',
      gitRef: 'main',
      metadataSource: 'env',
    },
    async (url) => {
      await assert.rejects(runWaitScript(url), /unaccepted buildId=unknown-production-build/);
    }
  );
});
