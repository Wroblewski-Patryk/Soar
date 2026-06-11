import assert from 'node:assert/strict';
import test from 'node:test';

import { main, parseArgs, run } from './runRcRefreshSummaryStrict.mjs';

test('parseArgs detects help and production gate requirements from injected argv', () => {
  assert.deepEqual(parseArgs([]), {
    help: false,
    requireProductionGate2: false,
  });
  assert.deepEqual(parseArgs(['--require-production-gate2', '--help']), {
    help: true,
    requireProductionGate2: true,
  });
  assert.deepEqual(parseArgs(['-h']), {
    help: true,
    requireProductionGate2: false,
  });
});

test('run uses injected spawn behavior with platform shell defaults', () => {
  const calls = [];
  const logs = [];

  const result = run('summary', 'pnpm', ['run', 'ops:rc:gates:summary'], {
    consoleImpl: { log: (message) => logs.push(message) },
    platform: 'win32',
    spawnSyncImpl: (command, args, options) => {
      calls.push({ command, args, options });
      return { status: 0 };
    },
  });

  assert.equal(result.status, 0);
  assert.deepEqual(logs, ['[ops:rc:gates:refresh:summary:strict] summary']);
  assert.deepEqual(calls, [
    {
      command: 'pnpm',
      args: ['run', 'ops:rc:gates:summary'],
      options: {
        stdio: 'inherit',
        shell: true,
      },
    },
  ]);
});

test('main help path exits without running RC refresh commands', () => {
  const logs = [];
  const exits = [];
  const calls = [];

  const result = main({
    argv: ['--help'],
    consoleImpl: { log: (message) => logs.push(message) },
    exit: (code) => exits.push(code),
    runCommand: (...args) => calls.push(args),
  });

  assert.deepEqual(exits, [0]);
  assert.deepEqual(calls, []);
  assert.equal(result.help, true);
  assert.match(logs.join('\n'), /runRcRefreshSummaryStrict\.mjs/);
});

test('main runs local strict refresh then summary and propagates strict status', () => {
  const calls = [];
  const exits = [];

  const result = main({
    argv: [],
    exit: (code) => exits.push(code),
    runCommand: (label, command, args) => {
      calls.push({ label, command, args });
      return { status: label === 'refresh strict' ? 2 : 0 };
    },
  });

  assert.deepEqual(calls, [
    {
      label: 'refresh strict',
      command: 'pnpm',
      args: ['run', 'ops:rc:gates:refresh:strict'],
    },
    {
      label: 'summary',
      command: 'pnpm',
      args: ['run', 'ops:rc:gates:summary'],
    },
  ]);
  assert.deepEqual(exits, [2]);
  assert.equal(result.status, 2);
  assert.equal(result.refreshCommand, 'ops:rc:gates:refresh:strict');
});

test('main selects production strict refresh and fails closed when strict status is missing', () => {
  const calls = [];
  const exits = [];

  const result = main({
    argv: ['--require-production-gate2'],
    exit: (code) => exits.push(code),
    runCommand: (label, command, args) => {
      calls.push({ label, command, args });
      return label === 'refresh strict' ? {} : { status: 0 };
    },
  });

  assert.deepEqual(calls, [
    {
      label: 'refresh strict',
      command: 'pnpm',
      args: ['run', 'ops:rc:gates:refresh:strict:prod'],
    },
    {
      label: 'summary',
      command: 'pnpm',
      args: ['run', 'ops:rc:gates:summary'],
    },
  ]);
  assert.deepEqual(exits, [1]);
  assert.equal(result.status, 1);
  assert.equal(result.refreshCommand, 'ops:rc:gates:refresh:strict:prod');
});
