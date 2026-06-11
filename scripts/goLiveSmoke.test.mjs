import assert from 'node:assert/strict';
import net from 'node:net';
import test from 'node:test';

import {
  canConnect,
  extractFailedMigrationName,
  localInfraIsReachable,
  main,
  printLocalMigrationGuidance,
  resolveTarget,
  run,
} from './goLiveSmoke.mjs';

const commandResult = (exitCode = 0, stdout = '', stderr = '') => ({
  exitCode,
  stdout,
  stderr,
});

const logger = () => {
  const messages = [];
  return {
    messages,
    log: (message) => messages.push(message),
    warn: (message) => messages.push(message),
    error: (message) => messages.push(message),
  };
};

test('resolveTarget keeps full as default and maps server alias to api', () => {
  assert.deepEqual(resolveTarget([]), { rawTarget: 'full', target: 'full' });
  assert.deepEqual(resolveTarget(['--target=server']), { rawTarget: 'server', target: 'api' });
  assert.deepEqual(resolveTarget(['--target=api']), { rawTarget: 'api', target: 'api' });
});

test('run uses injected spawnSync and Windows shell behavior', () => {
  const calls = [];

  const result = run('pnpm', ['run', 'test:go-live:api'], {
    captureOutput: true,
    platform: 'win32',
    spawnSync: (command, args, options) => {
      calls.push({ command, args, options });
      return { status: 3, stdout: 'out', stderr: 'err' };
    },
  });

  assert.deepEqual(calls, [
    {
      command: 'pnpm',
      args: ['run', 'test:go-live:api'],
      options: {
        stdio: 'pipe',
        shell: true,
        encoding: 'utf8',
        cwd: undefined,
      },
    },
  ]);
  assert.deepEqual(result, { exitCode: 3, stdout: 'out', stderr: 'err' });
});

test('canConnect reports true for a reachable local socket', async () => {
  const server = net.createServer((socket) => socket.end());
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();

  try {
    assert.equal(await canConnect(port, '127.0.0.1', 250), true);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('localInfraIsReachable combines injected Postgres and Redis probes', async () => {
  const probes = [];
  const result = await localInfraIsReachable({
    canConnect: async (port) => {
      probes.push(port);
      return port === 5432;
    },
  });

  assert.deepEqual(probes.sort(), [5432, 6379]);
  assert.deepEqual(result, { postgresOk: true, redisOk: false, allOk: false });
});

test('extractFailedMigrationName supports Prisma failure output shapes', () => {
  assert.equal(
    extractFailedMigrationName('Error P3018\nMigration name: 20260526120000_add_orders'),
    '20260526120000_add_orders',
  );
  assert.equal(
    extractFailedMigrationName('The `20260526120100_add_wallets` migration started at 2026-05-26'),
    '20260526120100_add_wallets',
  );
  assert.equal(
    extractFailedMigrationName('Applying migration `20260526120200_add_positions` failed'),
    '20260526120200_add_positions',
  );
  assert.equal(extractFailedMigrationName('unrelated output'), '');
});

test('printLocalMigrationGuidance emits fail-closed local recovery guidance only for Prisma migration failures', () => {
  const output = logger();

  assert.equal(
    printLocalMigrationGuidance('P3009\nMigration name: 20260526120300_fix_state', output),
    '20260526120300_fix_state',
  );
  assert.match(output.messages.join('\n'), /Prisma migrate deploy is blocked/);
  assert.match(output.messages.join('\n'), /20260526120300_fix_state/);
  assert.match(output.messages.join('\n'), /docker compose down -v/);

  const quiet = logger();
  assert.equal(printLocalMigrationGuidance('ordinary command failure', quiet), '');
  assert.equal(quiet.messages.length, 0);
});

test('main runs api target through injected commands and tears down started infra', async () => {
  const calls = [];
  const exits = [];

  const result = await main({
    argv: ['--target=api'],
    localPrismaCommand: 'prisma-test',
    console: logger(),
    process: {
      stdout: { write: () => {} },
      stderr: { write: () => {} },
      exit: (code) => exits.push(code),
    },
    run: (command, args, options = {}) => {
      calls.push({ command, args, options });
      return commandResult(0, '', '');
    },
  });

  assert.deepEqual(
    calls.map((call) => `${call.command} ${call.args.join(' ')}`),
    [
      'pnpm run go-live:infra:up',
      'prisma-test migrate deploy',
      'pnpm run test:go-live:api',
      'pnpm run go-live:infra:down',
    ],
  );
  assert.equal(calls.some((call) => call.args.includes('test:go-live:client')), false);
  assert.deepEqual(exits, [0]);
  assert.equal(result.exitCode, 0);
  assert.equal(result.infraStarted, true);
});

test('main reuses reachable infra when compose startup fails and then runs full target', async () => {
  const calls = [];
  const output = logger();
  const exits = [];

  const result = await main({
    argv: ['--target=full'],
    console: output,
    process: {
      stdout: { write: () => {} },
      stderr: { write: () => {} },
      exit: (code) => exits.push(code),
    },
    localInfraIsReachable: async () => ({ postgresOk: true, redisOk: true, allOk: true }),
    run: (command, args) => {
      calls.push(`${command} ${args.join(' ')}`);
      if (calls.length === 1) return commandResult(1, 'compose out', 'compose err');
      return commandResult(0, '', '');
    },
  });

  assert.deepEqual(calls, [
    'pnpm run go-live:infra:up',
    `${process.platform === 'win32' ? '.\\node_modules\\.bin\\prisma.CMD' : './node_modules/.bin/prisma'} migrate deploy`,
    'pnpm run test:go-live:api',
    'pnpm run test:go-live:client',
  ]);
  assert.match(output.messages.join('\n'), /Reusing already-running local Postgres\/Redis/);
  assert.deepEqual(exits, [0]);
  assert.equal(result.infraReused, true);
});

test('main stops before migrations when infra startup fails and ports are not reachable', async () => {
  const calls = [];
  const exits = [];

  const result = await main({
    argv: ['--target=api'],
    console: logger(),
    process: {
      stdout: { write: () => {} },
      stderr: { write: () => {} },
      exit: (code) => exits.push(code),
    },
    localInfraIsReachable: async () => ({ postgresOk: false, redisOk: false, allOk: false }),
    run: (command, args) => {
      calls.push(`${command} ${args.join(' ')}`);
      return commandResult(9, 'compose out', 'compose err');
    },
  });

  assert.deepEqual(calls, ['pnpm run go-live:infra:up']);
  assert.deepEqual(exits, [9]);
  assert.equal(result.exitCode, 9);
});

test('main prints local migration guidance and still tears down infra', async () => {
  const calls = [];
  const output = logger();
  const exits = [];

  const result = await main({
    argv: ['--target=api'],
    console: output,
    process: {
      stdout: { write: () => {} },
      stderr: { write: () => {} },
      exit: (code) => exits.push(code),
    },
    run: (command, args) => {
      calls.push(`${command} ${args.join(' ')}`);
      if (calls.length === 2) return commandResult(4, '', 'P3018\nMigration name: 202606010001_failed');
      return commandResult(0, '', '');
    },
  });

  assert.deepEqual(calls, [
    'pnpm run go-live:infra:up',
    `${process.platform === 'win32' ? '.\\node_modules\\.bin\\prisma.CMD' : './node_modules/.bin/prisma'} migrate deploy`,
    'pnpm run go-live:infra:down',
  ]);
  assert.match(output.messages.join('\n'), /202606010001_failed/);
  assert.deepEqual(exits, [4]);
  assert.equal(result.exitCode, 4);
});

test('main rejects unsupported targets before running commands', async () => {
  const output = logger();
  const exits = [];

  const result = await main({
    argv: ['--target=web'],
    console: output,
    process: { exit: (code) => exits.push(code) },
    run: () => {
      throw new Error('run should not execute for unsupported targets');
    },
  });

  assert.deepEqual(exits, [1]);
  assert.equal(result.error, 'unsupported-target');
  assert.match(output.messages.join('\n'), /Unsupported target "web"/);
});
