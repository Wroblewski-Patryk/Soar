import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';

import { main, packs, pnpmArgs, run } from './runAud07IsolatedDbPacks.mjs';

const logger = () => {
  const messages = [];
  return {
    messages,
    log: (message) => messages.push(message),
  };
};

test('pnpmArgs prefixes commands with pnpm for corepack execution', () => {
  assert.deepEqual(pnpmArgs(['--filter', 'api', 'exec', 'prisma', 'validate']), [
    'pnpm',
    '--filter',
    'api',
    'exec',
    'prisma',
    'validate',
  ]);
});

test('main lists isolated DB packs without running destructive commands', async () => {
  const output = logger();
  const invoked = [];

  await main({
    argv: ['node', 'scripts/runAud07IsolatedDbPacks.mjs', '--list'],
    console: output,
    run: async (...args) => invoked.push(args),
  });

  assert.deepEqual(invoked, []);
  assert.deepEqual(
    output.messages,
    packs.map((pack) => `${pack.name}: ${pack.files.join(' ')}`),
  );
});

test('main orchestrates schema checks and isolated packs sequentially through injected runner', async () => {
  const output = logger();
  const calls = [];

  await main({
    argv: ['node', 'scripts/runAud07IsolatedDbPacks.mjs'],
    console: output,
    run: async (label, args) => calls.push({ label, args }),
  });

  assert.deepEqual(
    calls.map((call) => call.label),
    [
      'Prisma schema validation',
      'Prisma migration status',
      'Reset database before wallets',
      'Run isolated wallets DB pack',
      'Reset database before backtests',
      'Run isolated backtests DB pack',
      'Reset database before runtime-repository',
      'Run isolated runtime-repository DB pack',
    ],
  );
  assert.deepEqual(calls[0].args, ['--filter', 'api', 'exec', 'prisma', 'validate']);
  assert.deepEqual(calls[1].args, ['--filter', 'api', 'exec', 'prisma', 'migrate', 'status']);
  assert.deepEqual(calls[2].args, [
    '--filter',
    'api',
    'exec',
    'prisma',
    'migrate',
    'reset',
    '--force',
    '--skip-seed',
  ]);
  assert.deepEqual(calls[3].args, [
    '--filter',
    'api',
    'exec',
    'vitest',
    'run',
    'src/modules/wallets/wallets.e2e.test.ts',
    '--run',
    '--sequence.concurrent=false',
    '--pool',
    'forks',
    '--poolOptions.forks.singleFork=true',
  ]);
  assert.equal(output.messages.at(-1), '[AUD-07] Isolated DB-backed packs passed sequentially.');
});

test('run rejects when an injected child command exits non-zero', async () => {
  const output = logger();
  const spawnCalls = [];
  const child = new EventEmitter();

  const promise = run('Failing pack', ['--filter', 'api'], {
    console: output,
    cwd: 'C:/repo',
    env: { NODE_ENV: 'test' },
    platform: 'win32',
    spawn: (command, args, options) => {
      spawnCalls.push({ command, args, options });
      return child;
    },
  });

  child.emit('exit', 7);

  await assert.rejects(promise, /Failing pack failed with exit code 7/);
  assert.deepEqual(spawnCalls, [
    {
      command: 'corepack',
      args: ['pnpm', '--filter', 'api'],
      options: {
        cwd: 'C:/repo',
        env: { NODE_ENV: 'test' },
        shell: true,
        stdio: 'inherit',
      },
    },
  ]);
  assert.deepEqual(output.messages, ['[AUD-07] Failing pack']);
});
