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

test('passes when the expected SHA has build-time deploy metadata', async () => {
  await withBuildInfoServer(
    {
      buildId: 'build-001',
      gitSha: 'abc123456789',
      gitRef: 'main',
      metadataSource: 'github-branch',
    },
    async (url) => {
      const { stdout } = await runWaitScript(url);
      assert.match(stdout, /metadataSource=github-branch/);
      assert.match(stdout, /\[wait:web-build-info\] PASS/);
    }
  );
});

test('fails when a matching SHA comes only from runtime GitHub fallback', async () => {
  await withBuildInfoServer(
    {
      buildId: 'build-002',
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
