import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';

import {
  evidenceStamp,
  main,
  nowStamp,
  parseArgs,
  readLatestByPrefix,
  run,
} from './runRestoreDrillEvidence.mjs';

test('parseArgs handles profile, date, expected sha, passthrough, and help', () => {
  assert.deepEqual(parseArgs([]), {
    profile: 'local',
    passthrough: [],
    today: '',
    expectedSha: '',
  });

  assert.deepEqual(
    parseArgs([
      '--profile',
      'PROD',
      '--today',
      '2026-06-08',
      '--expected-sha',
      'abc123',
      '--dry-run',
    ]),
    {
      profile: 'prod',
      passthrough: ['--dry-run'],
      today: '2026-06-08',
      expectedSha: 'abc123',
    }
  );

  assert.deepEqual(parseArgs(['-h']), {
    profile: 'local',
    passthrough: [],
    today: '',
    expectedSha: '',
    help: true,
  });
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

test('readLatestByPrefix selects the latest matching operation artifact', async () => {
  const operationsDirPath = path.resolve('tmp-ops');
  const latest = await readLatestByPrefix('_artifacts-db-restore-check-', '.txt', {
    operationsDirPath,
    readdirImpl: async () => [
      '_artifacts-db-restore-check-2026-06-07.txt',
      'v1-db-restore-check-2026-06-08.md',
      '_artifacts-db-restore-check-2026-06-08.txt',
      '_artifacts-db-restore-check-2026-06-06.json',
    ],
  });

  assert.equal(latest, path.join(operationsDirPath, '_artifacts-db-restore-check-2026-06-08.txt'));
});

test('run uses injected spawn behavior and preserves fail-closed shell defaults', () => {
  const calls = [];
  const result = run('node', ['scripts/runBackupVerificationProfile.mjs'], {
    env: { NODE_ENV: 'test' },
    platform: 'win32',
    spawnSyncImpl: (command, args, options) => {
      calls.push({ command, args, options });
      return { status: 0, stdout: 'ok', stderr: '' };
    },
  });

  assert.equal(result.status, 0);
  assert.deepEqual(calls, [
    {
      command: 'node',
      args: ['scripts/runBackupVerificationProfile.mjs'],
      options: {
        stdio: ['ignore', 'pipe', 'pipe'],
        encoding: 'utf8',
        shell: true,
        env: { NODE_ENV: 'test' },
      },
    },
  ]);
});

test('main help path exits without running restore drill commands', async () => {
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
  assert.match(logs.join('\n'), /runRestoreDrillEvidence\.mjs/);
});

test('main writes PASS evidence from injected backup verification artifacts', async () => {
  const writes = new Map();
  const madeDirs = [];
  const logs = [];
  const stdout = [];
  const stderr = [];
  const exits = [];
  const commandCalls = [];
  const cwd = path.resolve('repo');
  const operationsDirPath = path.join(cwd, 'history', 'operations');
  const evidenceDirPath = path.join(cwd, 'history', 'evidence');
  const artifactsDirPath = path.join(cwd, 'history', 'artifacts');
  const rawArtifact = path.join(operationsDirPath, '_artifacts-db-restore-check-2026-06-08.txt');
  const reportArtifact = path.join(operationsDirPath, 'v1-db-restore-check-2026-06-08.md');

  const result = await main({
    argv: ['--profile', 'prod', '--today', '2026-06-08', '--expected-sha', 'abc123', '--fast'],
    artifactsDirPath,
    cwd,
    endedAtIso: () => '2026-06-08T01:01:02.000Z',
    evidenceDirPath,
    exit: (code) => exits.push(code),
    mkdirImpl: async (dir) => madeDirs.push(dir),
    operationsDirPath,
    readFileImpl: async (file) => {
      assert.equal(file, rawArtifact);
      return 'RESULT: PASS\n';
    },
    readLatestByPrefixFn: async (prefix) =>
      prefix.startsWith('_artifacts') ? rawArtifact : reportArtifact,
    runCommand: (command, args) => {
      commandCalls.push({ command, args });
      return { status: 0, stdout: 'backup ok\n', stderr: '' };
    },
    startedAtIso: () => '2026-06-08T01:00:00.000Z',
    writeFileImpl: async (file, content) => writes.set(file, content),
    consoleImpl: {
      log: (message) => logs.push(message),
      stdout: { write: (message) => stdout.push(message) },
      stderr: { write: (message) => stderr.push(message) },
    },
  });

  assert.deepEqual(madeDirs, [operationsDirPath, evidenceDirPath, artifactsDirPath]);
  assert.deepEqual(commandCalls, [
    {
      command: 'node',
      args: [
        'scripts/runBackupVerificationProfile.mjs',
        '--profile',
        'prod',
        '--fast',
      ],
    },
  ]);
  assert.deepEqual(stdout, ['backup ok\n']);
  assert.deepEqual(stderr, []);
  assert.deepEqual(exits, []);
  assert.equal(result.payload.status, 'PASS');
  assert.equal(result.payload.expectedSha, 'abc123');
  assert.equal(result.payload.backupRestore.result, 'PASS');
  assert.equal(result.payload.checks.backupRestoreResultPass, true);
  assert.match([...writes.values()].join('\n'), /Status: \*\*PASS\*\*/);
  assert.match(logs.join('\n'), /Restore drill report:/);
});

test('main fails closed when command or restore result evidence fails', async () => {
  const exits = [];
  const result = await main({
    argv: ['--profile', 'local', '--today', '2026-06-08'],
    artifactsDirPath: path.resolve('repo/history/artifacts'),
    cwd: path.resolve('repo'),
    endedAtIso: () => '2026-06-08T01:01:02.000Z',
    evidenceDirPath: path.resolve('repo/history/evidence'),
    exit: (code) => exits.push(code),
    mkdirImpl: async () => undefined,
    operationsDirPath: path.resolve('repo/history/operations'),
    readFileImpl: async () => 'RESULT: FAIL\n',
    readLatestByPrefixFn: async (prefix) =>
      prefix.startsWith('_artifacts') ? path.resolve('repo/history/operations/raw.txt') : null,
    runCommand: () => ({ status: 1, stdout: '', stderr: 'backup failed\n' }),
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
  assert.equal(result.payload.checks.markdownReportPresent, false);
  assert.equal(result.payload.checks.backupRestoreResultPass, false);
});
