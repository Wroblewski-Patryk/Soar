import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';

import {
  evidenceStamp,
  main,
  nowStamp,
  parseArgs,
  printUsage,
  renderMarkdown,
  run,
} from './runRollbackProofEvidence.mjs';

test('parseArgs handles profile, base URL, date, expected sha, secrets, env defaults, and help', () => {
  assert.deepEqual(
    parseArgs([], {
      ROLLBACK_GUARD_API_BASE_URL: 'https://api.example.test',
      ROLLBACK_GUARD_AUTH_TOKEN: 'env-token',
    }),
    {
      profile: 'prod',
      baseUrl: 'https://api.example.test',
      authToken: 'env-token',
      authEmail: '',
      authPassword: '',
      opsBasicUser: '',
      opsBasicPassword: '',
      opsAuthHeaderName: '',
      opsAuthHeaderValue: '',
      today: '',
      expectedSha: '',
    }
  );

  assert.deepEqual(
    parseArgs([
      '--profile',
      'STAGE',
      '--base-url',
      'https://stage.example.test',
      '--auth-email',
      'ops@example.test',
      '--ops-basic-user',
      'ops',
      '--ops-auth-header-name',
      'x-ops-token',
      '--today',
      '2026-06-08',
      '--expected-sha',
      'abc123',
    ]),
    {
      profile: 'stage',
      baseUrl: 'https://stage.example.test',
      authToken: '',
      authEmail: 'ops@example.test',
      authPassword: '',
      opsBasicUser: 'ops',
      opsBasicPassword: '',
      opsAuthHeaderName: 'x-ops-token',
      opsAuthHeaderValue: '',
      today: '2026-06-08',
      expectedSha: 'abc123',
    }
  );

  assert.equal(parseArgs(['--help']).help, true);
  assert.throws(
    () => parseArgs(['--auth-token', 'secret']),
    /secret-bearing and must be provided through ROLLBACK_GUARD_\*/
  );
});

test('nowStamp and evidenceStamp produce release-safe artifact stamps', () => {
  assert.equal(
    nowStamp(new Date('2026-06-08T01:02:03.456Z')),
    '2026-06-08T01-02-03-456Z'
  );
  assert.equal(evidenceStamp('2026-06-08'), '2026-06-08T00-00-00-000Z');
  assert.equal(
    evidenceStamp('', { nowStampFn: () => '2026-06-08T04-05-06-789Z' }),
    '2026-06-08T04-05-06-789Z'
  );
});

test('printUsage writes rollback proof help through injected console', () => {
  const logs = [];
  printUsage({ consoleImpl: { log: (message) => logs.push(message) } });

  assert.match(logs.join('\n'), /runRollbackProofEvidence\.mjs/);
  assert.match(logs.join('\n'), /ROLLBACK_GUARD_API_BASE_URL/);
  assert.match(logs.join('\n'), /Secret-bearing values/);
});

test('run uses injected spawn behavior and preserves fail-closed shell defaults', () => {
  const calls = [];
  const result = run('node', ['scripts/evaluateRollbackGuard.mjs'], {
    env: { NODE_ENV: 'test' },
    envOverrides: { ROLLBACK_GUARD_AUTH_TOKEN: 'token' },
    platform: 'win32',
    spawnSyncImpl: (command, args, options) => {
      calls.push({ command, args, options });
      return { status: 0, stdout: '{"shouldRollback":false}', stderr: '' };
    },
  });

  assert.equal(result.status, 0);
  assert.deepEqual(calls, [
    {
      command: 'node',
      args: ['scripts/evaluateRollbackGuard.mjs'],
      options: {
        stdio: ['ignore', 'pipe', 'pipe'],
        encoding: 'utf8',
        shell: true,
        env: {
          NODE_ENV: 'test',
          ROLLBACK_GUARD_AUTH_TOKEN: 'token',
        },
      },
    },
  ]);
});

test('renderMarkdown summarizes PASS rollback decision checks', () => {
  const markdown = renderMarkdown(
    {
      profile: 'prod',
      endedAt: '2026-06-08T01:01:02.000Z',
      status: 'PASS',
      expectedSha: 'abc123',
      command: 'node scripts/evaluateRollbackGuard.mjs --base-url https://api.example.test',
      baseUrl: 'https://api.example.test',
      checks: {
        commandExitCodeZero: true,
        shouldRollbackFalse: true,
        noCriticalReasons: true,
        freshnessStatusPass: true,
        alertsClear: true,
      },
      decision: {
        shouldRollback: false,
        reasons: [],
        freshness: { status: 'PASS' },
        alerts: [],
      },
    },
    'history/artifacts/rollback.json'
  );

  assert.match(markdown, /# V1 Rollback Proof \(prod\)/);
  assert.match(markdown, /shouldRollbackFalse: PASS/);
  assert.match(markdown, /shouldRollback: false/);
  assert.match(markdown, /Raw JSON: `history\/artifacts\/rollback\.json`/);
});

test('main help path exits without running rollback commands', async () => {
  const logs = [];
  const exits = [];
  const calls = [];

  const result = await main({
    argv: ['--help'],
    consoleImpl: {
      log: (message) => logs.push(message),
      stdout: { write: () => undefined },
      stderr: { write: () => undefined },
    },
    exit: (code) => exits.push(code),
    runCommand: (...args) => calls.push(args),
  });

  assert.deepEqual(exits, [0]);
  assert.deepEqual(calls, []);
  assert.equal(result.help, true);
  assert.match(logs.join('\n'), /runRollbackProofEvidence\.mjs/);
});

test('main writes PASS rollback proof evidence from an injected guard result', async () => {
  const writes = new Map();
  const madeDirs = [];
  const logs = [];
  const stdout = [];
  const stderr = [];
  const exits = [];
  const commandCalls = [];
  const cwd = path.resolve('repo');
  const evidenceDirPath = path.join(cwd, 'history', 'evidence');
  const artifactsDirPath = path.join(cwd, 'history', 'artifacts');

  const result = await main({
    argv: ['--profile', 'prod', '--base-url', 'https://api.example.test', '--today', '2026-06-08', '--expected-sha', 'abc123'],
    artifactsDirPath,
    cwd,
    endedAtIso: () => '2026-06-08T01:01:02.000Z',
    env: {
      ROLLBACK_GUARD_AUTH_TOKEN: 'token',
      ROLLBACK_GUARD_OPS_BASIC_PASSWORD: 'basic-secret',
    },
    evidenceDirPath,
    exit: (code) => exits.push(code),
    mkdirImpl: async (dir) => madeDirs.push(dir),
    runCommand: (command, args, options) => {
      commandCalls.push({ command, args, options });
      return {
        status: 0,
        stdout: JSON.stringify({
          shouldRollback: false,
          reasons: [],
          freshness: { status: 'PASS' },
          alerts: [],
        }),
        stderr: '',
      };
    },
    startedAtIso: () => '2026-06-08T01:00:00.000Z',
    writeFileImpl: async (file, content) => writes.set(file, content),
    consoleImpl: {
      log: (message) => logs.push(message),
      stdout: { write: (message) => stdout.push(message) },
      stderr: { write: (message) => stderr.push(message) },
    },
  });

  assert.deepEqual(madeDirs, [evidenceDirPath, artifactsDirPath]);
  assert.deepEqual(commandCalls, [
    {
      command: 'node',
      args: ['scripts/evaluateRollbackGuard.mjs', '--base-url', 'https://api.example.test'],
      options: {
        env: {
          ROLLBACK_GUARD_AUTH_TOKEN: 'token',
          ROLLBACK_GUARD_OPS_BASIC_PASSWORD: 'basic-secret',
        },
        envOverrides: {
          ROLLBACK_GUARD_AUTH_TOKEN: 'token',
          ROLLBACK_GUARD_AUTH_EMAIL: '',
          ROLLBACK_GUARD_AUTH_PASSWORD: '',
          ROLLBACK_GUARD_OPS_BASIC_USER: '',
          ROLLBACK_GUARD_OPS_BASIC_PASSWORD: 'basic-secret',
          ROLLBACK_GUARD_OPS_AUTH_HEADER_NAME: '',
          ROLLBACK_GUARD_OPS_AUTH_HEADER_VALUE: '',
        },
      },
    },
  ]);
  assert.equal(result.payload.status, 'PASS');
  assert.equal(result.payload.expectedSha, 'abc123');
  assert.equal(result.payload.checks.alertsClear, true);
  assert.deepEqual(exits, []);
  assert.equal(stderr.length, 0);
  assert.match(stdout.join(''), /"shouldRollback":false/);
  assert.match([...writes.keys()].join('\n'), /_artifacts-v1-rollback-proof-prod-2026-06-08T00-00-00-000Z\.json/);
  assert.match([...writes.values()].join('\n'), /Status: \*\*PASS\*\*/);
  assert.match(logs.join('\n'), /Rollback proof report:/);
});

test('main fails closed when rollback guard output is invalid or unsafe', async () => {
  const exits = [];
  const result = await main({
    argv: ['--base-url', 'https://api.example.test', '--today', '2026-06-08'],
    artifactsDirPath: path.resolve('repo/history/artifacts'),
    cwd: path.resolve('repo'),
    endedAtIso: () => '2026-06-08T01:01:02.000Z',
    evidenceDirPath: path.resolve('repo/history/evidence'),
    exit: (code) => exits.push(code),
    mkdirImpl: async () => undefined,
    runCommand: () => ({
      status: 2,
      stdout: JSON.stringify({
        shouldRollback: true,
        reasons: ['stale build'],
        freshness: { status: 'FAIL' },
        alerts: ['critical alert'],
      }),
      stderr: 'rollback required\n',
    }),
    startedAtIso: () => '2026-06-08T01:00:00.000Z',
    writeFileImpl: async () => undefined,
    consoleImpl: {
      log: () => undefined,
      stdout: { write: () => undefined },
      stderr: { write: () => undefined },
    },
  });

  assert.deepEqual(exits, [1]);
  assert.equal(result.status, 1);
  assert.equal(result.payload.status, 'FAIL');
  assert.equal(result.payload.checks.commandExitCodeZero, false);
  assert.equal(result.payload.checks.shouldRollbackFalse, false);
  assert.equal(result.payload.checks.alertsClear, false);
});
