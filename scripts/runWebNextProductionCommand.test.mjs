import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';

import { main, parseArgs, run } from './runWebNextProductionCommand.mjs';

test('parseArgs removes the separator before forwarding Next args', () => {
  assert.deepEqual(parseArgs(['start', '--', '-p', '4000']), {
    command: 'start',
    args: ['-p', '4000'],
  });

  assert.deepEqual(parseArgs(['build', '--profile']), {
    command: 'build',
    args: ['--profile'],
  });
});

test('run resolves on zero exit and rejects on signal or non-zero exit', async () => {
  const calls = [];
  await run('node', ['next'], {
    cwd: 'web',
    env: { NODE_ENV: 'production' },
    spawnImpl: (command, args, options) => {
      calls.push({ command, args, options });
      return {
        on: (event, handler) => {
          if (event === 'exit') handler(0, null);
        },
      };
    },
  });

  assert.deepEqual(calls, [
    {
      command: 'node',
      args: ['next'],
      options: {
        cwd: 'web',
        env: { NODE_ENV: 'production' },
        stdio: 'inherit',
        shell: false,
      },
    },
  ]);

  await assert.rejects(
    run('node', ['next'], {
      spawnImpl: () => ({
        on: (event, handler) => {
          if (event === 'exit') handler(2, null);
        },
      }),
    }),
    /exited with code 2/,
  );

  await assert.rejects(
    run('node', ['next'], {
      spawnImpl: () => ({
        on: (event, handler) => {
          if (event === 'exit') handler(null, 'SIGTERM');
        },
      }),
    }),
    /exited with signal SIGTERM/,
  );
});

test('main rejects unsupported commands without spawning Next', async () => {
  const errors = [];
  const exits = [];
  const calls = [];

  const result = await main({
    argv: ['serve'],
    consoleImpl: { error: (message) => errors.push(message) },
    exit: (code) => exits.push(code),
    runCommand: (...args) => calls.push(args),
  });

  assert.equal(result.status, 1);
  assert.equal(result.usage, true);
  assert.deepEqual(exits, [1]);
  assert.deepEqual(calls, []);
  assert.match(errors.join('\n'), /runWebNextProductionCommand\.mjs/);
});

test('main writes build metadata before running the Next production build', async () => {
  const calls = [];
  const repoRoot = path.resolve('repo-root');

  const result = await main({
    argv: ['build', '--debug'],
    env: { PORT: '4100', CUSTOM: 'value' },
    execPath: 'node',
    repoRoot,
    runCommand: async (command, args, options) => {
      calls.push({ command, args, options });
    },
  });

  assert.equal(result.status, 0);
  assert.deepEqual(calls, [
    {
      command: 'node',
      args: [path.join(repoRoot, 'scripts', 'writeWebBuildMetadata.mjs')],
      options: {
        cwd: path.join(repoRoot, 'apps', 'web'),
        env: { PORT: '4100', CUSTOM: 'value', NODE_ENV: 'production' },
      },
    },
    {
      command: 'node',
      args: [
        path.join(repoRoot, 'apps', 'web', 'node_modules', 'next', 'dist', 'bin', 'next'),
        'build',
        '--debug',
      ],
      options: {
        cwd: path.join(repoRoot, 'apps', 'web'),
        env: { PORT: '4100', CUSTOM: 'value', NODE_ENV: 'production' },
      },
    },
  ]);
});

test('main adds production start host and port defaults unless explicitly supplied', async () => {
  const calls = [];

  const result = await main({
    argv: ['start'],
    env: { PORT: '4500', NODE_ENV: 'development' },
    execPath: 'node',
    repoRoot: 'repo',
    runCommand: async (command, args, options) => {
      calls.push({ command, args, options });
    },
  });

  assert.equal(result.status, 0);
  assert.deepEqual(calls[0].args, [
    path.join('repo', 'apps', 'web', 'node_modules', 'next', 'dist', 'bin', 'next'),
    'start',
    '-p',
    '4500',
    '-H',
    '0.0.0.0',
  ]);
  assert.equal(calls[0].options.env.NODE_ENV, 'production');
});

test('main preserves explicit start host and port arguments', async () => {
  const calls = [];

  await main({
    argv: ['start', '--', '--port', '5000', '--hostname', '127.0.0.1'],
    env: {},
    execPath: 'node',
    repoRoot: 'repo',
    runCommand: async (command, args) => {
      calls.push({ command, args });
    },
  });

  assert.deepEqual(calls[0].args, [
    path.join('repo', 'apps', 'web', 'node_modules', 'next', 'dist', 'bin', 'next'),
    'start',
    '--port',
    '5000',
    '--hostname',
    '127.0.0.1',
  ]);
});

test('main fails closed when a spawned production command rejects', async () => {
  const exits = [];
  const errors = [];

  const result = await main({
    argv: ['start'],
    consoleImpl: { error: (message) => errors.push(message) },
    exit: (code) => exits.push(code),
    runCommand: async () => {
      throw new Error('next failed');
    },
  });

  assert.equal(result.status, 1);
  assert.deepEqual(exits, [1]);
  assert.deepEqual(errors, ['next failed']);
});
