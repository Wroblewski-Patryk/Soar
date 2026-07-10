import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  assertLatestSloObservationPassed,
  buildStatusWithOfflineFallback,
  canReachApi,
  expectedShaArgs,
  findLatestSloObservationArtifact,
  hasSloInputs,
  main,
  normalizeDbProfile,
  normalizeEnvironment,
  parseArgs,
  printUsage,
  run,
  runDocsParityChecks,
} from './runLocalExternalGatesPipeline.mjs';

test('parseArgs normalizes environment, db profile, windows, and secret-bearing flags', () => {
  assert.equal(normalizeEnvironment(' PRODUCTION '), 'production');
  assert.equal(normalizeEnvironment('invalid'), 'local');
  assert.equal(normalizeDbProfile(' PROD '), 'prod');
  assert.equal(normalizeDbProfile('invalid'), 'local');
  assert.deepEqual(expectedShaArgs('abc123'), ['--expected-sha', 'abc123']);
  assert.deepEqual(expectedShaArgs(''), []);

  assert.deepEqual(
    parseArgs({
      argv: [
        '--base-url',
        'http://api.local',
        '--environment',
        'stage',
        '--db-profile',
        'prod',
        '--window-days',
        '3, 9, nope',
        '--strict-evidence-check',
        '--require-production-gate2',
      ],
      env: {
        SLO_DURATION_MINUTES: '2',
        SLO_INTERVAL_SECONDS: '8',
      },
    }),
    {
      baseUrl: 'http://api.local',
      durationMinutes: '2',
      intervalSeconds: '8',
      authToken: '',
      authEmail: '',
      authPassword: '',
      opsAuthHeaderName: '',
      opsAuthHeaderValue: '',
      opsBasicUser: '',
      opsBasicPassword: '',
      environment: 'stage',
      dbProfile: 'prod',
      allowLocalProductionEvidence: false,
      skipDbCheck: false,
      allowOffline: false,
      skipSloCollect: false,
      skipWindowReport: false,
      skipChecklistSync: false,
      skipEvidenceCheck: false,
      strictEvidenceCheck: true,
      requireProductionGate2: true,
      expectedSha: '',
      evidenceOutput: 'history/artifacts/_artifacts-rc-evidence-check-latest.json',
      windowDays: [3, 9],
    },
  );

  assert.throws(
    () => parseArgs({ argv: ['--auth-token', 'secret'], env: {} }),
    /secret-bearing/,
  );
});

test('run uses injected spawn behavior through platform defaults', () => {
  const calls = [];
  const logs = [];

  run(
    'check missing external evidence',
    'pnpm',
    ['run', 'x'],
    {
      TEST_ENV: '1',
    },
    {
      platform: 'win32',
      processEnv: { BASE_ENV: 'base' },
      consoleImpl: { log: (message) => logs.push(message) },
      spawnSyncImpl: (command, args, options) => {
        calls.push({ command, args, options });
        return { status: 0 };
      },
    },
  );

  assert.deepEqual(logs, ['[ops:rc:gates:local] check missing external evidence']);
  assert.deepEqual(calls, [
    {
      command: 'pnpm',
      args: ['run', 'x'],
      options: {
        stdio: 'inherit',
        shell: true,
        env: { BASE_ENV: 'base', TEST_ENV: '1' },
      },
    },
  ]);
});

test('SLO input helpers detect and validate latest observation artifacts', async () => {
  const originalCwd = process.cwd();
  const dir = await mkdtemp(path.join(os.tmpdir(), 'soar-local-external-gates-'));
  try {
    process.chdir(dir);
    assert.equal(await hasSloInputs(), false);
    assert.equal(await findLatestSloObservationArtifact(), null);

    await mkdir(path.join(dir, 'history', 'operations'), { recursive: true });
    await writeFile(
      path.join(dir, 'history', 'operations', '_artifacts-slo-window-2026-06-06.json'),
      JSON.stringify({ summary: { evaluation: { overallStatus: 'FAIL', failedObjectives: ['latency'] } } }),
    );
    await writeFile(
      path.join(dir, 'history', 'operations', '_artifacts-slo-window-2026-06-07.json'),
      JSON.stringify({ summary: { evaluation: { overallStatus: 'PASS', failedObjectives: [] } } }),
    );

    assert.equal(await hasSloInputs(), true);
    assert.match(await findLatestSloObservationArtifact(), /_artifacts-slo-window-2026-06-07\.json$/);
    await assertLatestSloObservationPassed();
  } finally {
    process.chdir(originalCwd);
    await rm(dir, { recursive: true, force: true });
  }
});

test('buildStatusWithOfflineFallback uses template-only mode when offline inputs are absent', async () => {
  const calls = [];
  const logs = [];

  await buildStatusWithOfflineFallback(true, 'abc123', {
    hasSloInputsFn: async () => false,
    consoleImpl: { log: (message) => logs.push(message) },
    runCommand: (label, command, args) => calls.push({ label, command, args }),
  });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].label, 'build RC external gates status (template-only)');
  assert.deepEqual(calls[0].args, [
    'run',
    'ops:rc:gates:status',
    '--',
    '--template-only',
    '--expected-sha',
    'abc123',
  ]);
  assert.match(logs.join('\n'), /template-only status snapshot/);
});

test('docs parity hook runs mandatory API endpoint and Web route matrix checks', () => {
  const calls = [];

  runDocsParityChecks({
    runCommand: (label, command, args) => calls.push({ label, command, args }),
  });

  assert.deepEqual(calls, [
    {
      label: 'API endpoint docs parity',
      command: 'pnpm',
      args: ['run', 'docs:parity:endpoints:api'],
    },
    {
      label: 'Web route/API matrix parity',
      command: 'pnpm',
      args: ['run', 'docs:parity:route-api-matrix'],
    },
  ]);
});

test('printUsage describes secret-bearing environment variable requirements', () => {
  const logs = [];

  printUsage({ log: (message) => logs.push(message) });

  assert.match(logs.join('\n'), /runLocalExternalGatesPipeline\.mjs/);
  assert.match(logs.join('\n'), /docs:parity:endpoints:api/);
  assert.match(logs.join('\n'), /docs:parity:route-api-matrix/);
  assert.match(logs.join('\n'), /SLO_AUTH_TOKEN/);
  assert.match(logs.join('\n'), /SLO_OPS_AUTH_HEADER_VALUE/);
});

test('canReachApi sends ops auth headers and returns false on request errors', async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return { ok: true };
  };

  assert.equal(
    await canReachApi('http://api.local', 'token-1', {
      opsAuthHeaderName: 'X-Ops',
      opsAuthHeaderValue: 'ops-value',
    }),
    true,
  );
  assert.equal(calls[0].url, 'http://api.local/health');
  assert.equal(calls[0].options.headers.Authorization, 'Bearer token-1');
  assert.equal(calls[0].options.headers['X-Ops'], 'ops-value');

  globalThis.fetch = async () => {
    throw new Error('network unavailable');
  };
  assert.equal(await canReachApi('http://api.local', '', {}), false);
});

test('main orchestrates offline local gates without executing protected smoke or real commands', async () => {
  const calls = [];
  const logs = [];
  const exits = [];

  const result = await main({
    argv: [
      '--skip-db-check',
      '--allow-offline',
      '--strict-evidence-check',
      '--require-production-gate2',
      '--expected-sha',
      'abc123',
      '--evidence-output',
      'history/artifacts/test.json',
    ],
    env: {},
    consoleImpl: {
      log: (message) => logs.push(message),
      error: (...parts) => logs.push(parts.join(' ')),
    },
    processImpl: { exit: (code) => exits.push(code) },
    resolveOpsAuthTokenFn: async () => ({ token: '' }),
    canReachApiFn: async () => false,
    buildStatusWithOfflineFallbackFn: async () => {
      throw new Error('buildStatusWithOfflineFallback should not run in API-unreachable offline branch');
    },
    runCommand: (label, command, args) => calls.push({ label, command, args }),
  });

  assert.deepEqual(exits, []);
  assert.deepEqual(result, { status: 'PASS', mode: 'offline' });
  assert.deepEqual(calls.map((call) => call.label), [
    'API endpoint docs parity',
    'Web route/API matrix parity',
    'build RC external gates status (template-only)',
    'sync RC checklist from gate status',
    'check missing external evidence',
  ]);
  assert.deepEqual(calls[4].args, [
    'run',
    'ops:rc:gates:evidence:check',
    '--',
    '--json',
    '--output',
    'history/artifacts/test.json',
    '--strict',
    '--require-production-gate2',
  ]);
  assert.match(logs.join('\n'), /done \(offline mode\)/);
});
