import assert from 'node:assert/strict';
import test from 'node:test';

import { commands, main, run } from './runKnownStateRefresh.mjs';

test('commands preserve the known-state refresh dependency order', () => {
  assert.deepEqual(
    commands.map(([command, args]) => [command, args.join(' ')]),
    [
      ['pnpm', 'run architecture:graph:generate'],
      ['pnpm', 'run architecture:graph:drift:strict'],
      ['pnpm', 'run architecture:journey:index:strict'],
      ['pnpm', 'run docs:parity:check'],
      ['pnpm', 'run quality:guardrails'],
      ['pnpm', 'run ops:project:index'],
      ['pnpm', 'run ops:project:scan'],
      ['pnpm', 'run ops:project:ledger'],
      ['pnpm', 'run ops:project:scorecard'],
    ],
  );
});

test('run uses injected spawn and Windows shell behavior', async () => {
  const logs = [];
  const calls = [];

  await run(['pnpm', ['run', 'quality:guardrails']], {
    platform: 'win32',
    console: { log: (message) => logs.push(message) },
    spawn: (command, args, options) => {
      calls.push({ command, args, options });
      return {
        on(event, callback) {
          if (event === 'exit') callback(0);
          return this;
        },
      };
    },
  });

  assert.deepEqual(calls, [
    {
      command: 'pnpm',
      args: ['run', 'quality:guardrails'],
      options: {
        shell: true,
        stdio: 'inherit',
      },
    },
  ]);
  assert.deepEqual(logs, ['\n> pnpm run quality:guardrails']);
});

test('run rejects on non-zero child exit', async () => {
  await assert.rejects(
    () =>
      run(['pnpm', ['run', 'docs:parity:check']], {
        console: { log: () => {} },
        spawn: () => ({
          on(event, callback) {
            if (event === 'exit') callback(7);
            return this;
          },
        }),
      }),
    /pnpm run docs:parity:check exited with 7/,
  );
});

test('run rejects on child process error', async () => {
  await assert.rejects(
    () =>
      run(['pnpm', ['run', 'docs:parity:check']], {
        console: { log: () => {} },
        spawn: () => ({
          on(event, callback) {
            if (event === 'error') callback(new Error('spawn failed'));
            return this;
          },
        }),
      }),
    /spawn failed/,
  );
});

test('main runs all known-state commands through injected runner', async () => {
  const calls = [];
  const logs = [];

  await main({
    commands: [
      ['pnpm', ['run', 'a']],
      ['pnpm', ['run', 'b']],
    ],
    console: { log: (message) => logs.push(message) },
    run: async (command) => {
      calls.push(command);
    },
  });

  assert.deepEqual(calls, [
    ['pnpm', ['run', 'a']],
    ['pnpm', ['run', 'b']],
  ]);
  assert.deepEqual(logs, ['\nKnown-state refresh complete.']);
});
