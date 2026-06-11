import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { hasFlag, main, readArgValue, runCheck } from './runQaRepeatableSmokeE2e.mjs';

test('argument helpers read flag presence and values from an injected argv array', () => {
  const argv = ['--checks', 'web,api', '--today', '2026-06-08', '--stop-on-fail'];

  assert.equal(hasFlag('--stop-on-fail', argv), true);
  assert.equal(hasFlag('--continue-on-fail', argv), false);
  assert.equal(readArgValue('--checks', argv), 'web,api');
  assert.equal(readArgValue('--missing', argv), '');
  assert.equal(readArgValue('--stop-on-fail', argv), '');
});

test('runCheck returns a stable PASS result with injected process execution', () => {
  let tick = 0;
  const calls = [];

  const result = runCheck(
    {
      label: 'Web smoke pack',
      command: 'pnpm',
      args: ['run', 'test:go-live:web'],
    },
    {
      platform: 'win32',
      now: () => new Date('2026-06-08T00:00:00.000Z'),
      nowMs: () => {
        tick += 125;
        return tick;
      },
      spawnSyncImpl: (command, args, options) => {
        calls.push({ command, args, options });
        return { status: 0, stdout: 'ok', stderr: '' };
      },
    },
  );

  assert.deepEqual(calls, [
    {
      command: 'pnpm',
      args: ['run', 'test:go-live:web'],
      options: {
        shell: true,
        stdio: 'pipe',
        encoding: 'utf8',
      },
    },
  ]);
  assert.equal(result.status, 'PASS');
  assert.equal(result.durationMs, 125);
  assert.equal(result.command, 'pnpm run test:go-live:web');
  assert.equal(result.stdout, 'ok');
});

test('main writes repeatable smoke artifacts and continues after failures by default', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'soar-qa-repeatable-'));
  const stdout = [];
  const stderr = [];
  const exits = [];
  const calls = [];

  try {
    const result = await main({
      argv: ['--checks', 'web,api', '--today', '2026-06-08', '--artifact-prefix', 'luc-2995-proof'],
      cwd: dir,
      date: new Date('2026-06-08T10:00:00.000Z'),
      stdout: { write: (message) => stdout.push(message) },
      stderr: { write: (message) => stderr.push(message) },
      exit: (code) => exits.push(code),
      runCheckFn: (checkConfig) => {
        calls.push(checkConfig.label);
        return {
          label: checkConfig.label,
          command: [checkConfig.command, ...checkConfig.args].join(' '),
          startedAt: '2026-06-08T10:00:00.000Z',
          finishedAt: '2026-06-08T10:00:01.000Z',
          durationMs: calls.length * 1000,
          exitCode: checkConfig.label.startsWith('API') ? 1 : 0,
          status: checkConfig.label.startsWith('API') ? 'FAIL' : 'PASS',
          stdout: '',
          stderr: checkConfig.label.startsWith('API') ? 'db unavailable' : '',
        };
      },
    });

    const jsonPath = path.join(dir, 'history', 'artifacts', 'luc-2995-proof-2026-06-08.json');
    const evidencePath = path.join(dir, 'history', 'evidence', 'luc-2995-proof-2026-06-08.md');
    const summary = JSON.parse(await readFile(jsonPath, 'utf8'));
    const evidence = await readFile(evidencePath, 'utf8');

    assert.equal(result.status, 'FAIL');
    assert.deepEqual(exits, [1]);
    assert.deepEqual(calls, ['Web smoke pack', 'API smoke pack']);
    assert.equal(summary.continueOnFail, true);
    assert.deepEqual(summary.totals, { checks: 2, passed: 1, failed: 1 });
    assert.match(evidence, /Result: FAIL/);
    assert.match(stdout.join(''), /Wrote artifact/);
    assert.match(stderr.join(''), /Failed checks: 1/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('main stops after the first failure when requested', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'soar-qa-repeatable-stop-'));
  const calls = [];

  try {
    const result = await main({
      argv: ['--checks', 'web,api', '--stop-on-fail'],
      cwd: dir,
      date: new Date('2026-06-08T10:00:00.000Z'),
      stdout: { write: () => {} },
      stderr: { write: () => {} },
      exit: () => {},
      runCheckFn: (checkConfig) => {
        calls.push(checkConfig.label);
        return {
          label: checkConfig.label,
          command: [checkConfig.command, ...checkConfig.args].join(' '),
          startedAt: '2026-06-08T10:00:00.000Z',
          finishedAt: '2026-06-08T10:00:01.000Z',
          durationMs: 1000,
          exitCode: 1,
          status: 'FAIL',
          stdout: '',
          stderr: 'failed',
        };
      },
    });

    assert.equal(result.status, 'FAIL');
    assert.deepEqual(calls, ['Web smoke pack']);
    assert.equal(result.summary.continueOnFail, false);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('main fails closed for unsupported checks without writing artifacts', async () => {
  const exits = [];
  const stderr = [];

  const result = await main({
    argv: ['--checks', 'web,unknown'],
    stdout: { write: () => {} },
    stderr: { write: (message) => stderr.push(message) },
    exit: (code) => exits.push(code),
  });

  assert.deepEqual(exits, [1]);
  assert.deepEqual(result.unknownChecks, ['unknown']);
  assert.match(stderr.join(''), /Unsupported checks: unknown/);
});
