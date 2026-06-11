import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import test from 'node:test';

import {
  main,
  prefixLog,
  runStep,
  startRuntime,
  stopAll,
  validateRequiredEnvFiles,
  writeMissingEnvGuidance,
} from './start-local-prod-like.mjs';

const createFakeChild = () => ({
  stdout: new EventEmitter(),
  stderr: new EventEmitter(),
  on: new EventEmitter().on,
  killed: false,
  kill(signal) {
    this.killed = true;
    this.signal = signal;
  },
});

const createObservableChild = () => {
  const emitter = new EventEmitter();
  return {
    stdout: new EventEmitter(),
    stderr: new EventEmitter(),
    killed: false,
    kill(signal) {
      this.killed = true;
      this.signal = signal;
    },
    on: emitter.on.bind(emitter),
    emit: emitter.emit.bind(emitter),
  };
};

test('validateRequiredEnvFiles returns only missing prod-like env paths', () => {
  const missing = validateRequiredEnvFiles({
    envFiles: ['apps/api/.env', 'apps/web/.env.local'],
    existsSync: (envPath) => envPath.endsWith('.env'),
  });

  assert.deepEqual(missing, ['apps/web/.env.local']);
});

test('writeMissingEnvGuidance prints fail-closed bootstrap guidance', () => {
  const stderr = [];

  writeMissingEnvGuidance(['apps/api/.env'], { write: (message) => stderr.push(message) });

  assert.match(stderr.join(''), /\[prod-like\] missing required env file: apps\/api\/\.env/);
  assert.match(stderr.join(''), /Copy-Item apps\/api\/\.env\.example apps\/api\/\.env/);
});

test('runStep spawns shell command and resolves only on zero exit', async () => {
  const calls = [];
  const child = createObservableChild();
  const promise = runStep('build api', 'pnpm', ['--filter', 'api', 'build'], {
    cwd: 'repo',
    env: { NODE_ENV: 'production' },
    stdout: { write: () => {} },
    spawnImpl: (command, args, options) => {
      calls.push({ command, args, options });
      return child;
    },
  });

  child.emit('exit', 0);
  await promise;

  assert.deepEqual(calls, [
    {
      command: 'pnpm',
      args: ['--filter', 'api', 'build'],
      options: {
        cwd: 'repo',
        shell: true,
        stdio: 'inherit',
        env: { NODE_ENV: 'production' },
      },
    },
  ]);
});

test('prefixLog writes non-empty stdout and stderr lines with prod-like labels', () => {
  const stdout = [];
  const stderr = [];

  prefixLog('api', Buffer.from('one\n\n two\n'), false, {
    stdout: { write: (message) => stdout.push(message) },
    stderr: { write: (message) => stderr.push(message) },
  });
  prefixLog('api', Buffer.from('bad\n'), true, {
    stdout: { write: (message) => stdout.push(message) },
    stderr: { write: (message) => stderr.push(message) },
  });

  assert.deepEqual(stdout, ['[prod-like/api] one\n', '[prod-like/api]  two\n']);
  assert.deepEqual(stderr, ['[prod-like/api] bad\n']);
});

test('startRuntime prefixes child output and kills siblings when a child exits unexpectedly', () => {
  const children = [createObservableChild(), createObservableChild()];
  const spawnCalls = [];
  const stdout = [];
  const stderr = [];
  const exits = [];
  const handlers = {};

  startRuntime({
    entries: [
      { name: 'api', command: 'pnpm', args: ['api'] },
      { name: 'web', command: 'pnpm', args: ['web'] },
    ],
    cwd: 'repo',
    env: { NODE_ENV: 'production' },
    stdout: { write: (message) => stdout.push(message) },
    stderr: { write: (message) => stderr.push(message) },
    processImpl: {
      on: (event, handler) => {
        handlers[event] = handler;
      },
      exit: (code) => exits.push(code),
    },
    spawnImpl: (command, args, options) => {
      spawnCalls.push({ command, args, options });
      return children[spawnCalls.length - 1];
    },
  });

  children[0].stdout.emit('data', Buffer.from('ready\n'));
  children[0].emit('exit', 2);

  assert.equal(handlers.SIGINT instanceof Function, true);
  assert.equal(handlers.SIGTERM instanceof Function, true);
  assert.equal(stdout.includes('[prod-like] api/web/workers started\n'), true);
  assert.equal(stdout.includes('[prod-like/api] ready\n'), true);
  assert.match(stderr.join(''), /\[prod-like\/api\] exited with code 2/);
  assert.deepEqual(children.map((child) => child.killed), [true, true]);
  assert.deepEqual(exits, [2]);
  assert.equal(spawnCalls[0].options.shell, true);
});

test('stopAll skips already killed prod-like children and graceful shutdown exits zero', () => {
  const children = [createFakeChild(), createFakeChild()];
  children[1].killed = true;

  stopAll(children, 'SIGINT');

  assert.equal(children[0].signal, 'SIGINT');
  assert.equal(children[1].signal, undefined);

  const stdout = [];
  const exits = [];
  const runtime = startRuntime({
    entries: [{ name: 'api', command: 'pnpm', args: ['api'] }],
    stdout: { write: (message) => stdout.push(message) },
    stderr: { write: () => {} },
    processImpl: { on: () => {}, exit: (code) => exits.push(code) },
    spawnImpl: () => createObservableChild(),
  });

  runtime.gracefulShutdown();
  runtime.gracefulShutdown();

  assert.equal(stdout.filter((line) => line === '[prod-like] shutdown requested\n').length, 1);
  assert.deepEqual(exits, [0]);
});

test('main fails before preflight when required env files are missing', async () => {
  const stderr = [];
  const exits = [];

  const result = await main({
    validateRequiredEnvFilesFn: () => ['apps/api/.env'],
    stderr: { write: (message) => stderr.push(message) },
    exit: (code) => exits.push(code),
  });

  assert.equal(result.status, 'FAIL');
  assert.equal(result.reason, 'missing-env');
  assert.deepEqual(exits, [1]);
  assert.match(stderr.join(''), /missing required env file/);
});

test('main runs both preflight builds before starting prod-like runtime', async () => {
  const steps = [];
  let started = false;

  const result = await main({
    validateRequiredEnvFilesFn: () => [],
    runStepFn: async (label, command, args) => steps.push({ label, command, args }),
    startRuntimeFn: () => {
      started = true;
      return { children: [] };
    },
  });

  assert.equal(result.status, 'STARTED');
  assert.equal(started, true);
  assert.deepEqual(steps, [
    { label: 'build api', command: 'pnpm', args: ['--filter', 'api', 'build'] },
    { label: 'build web', command: 'pnpm', args: ['--filter', 'web', 'build'] },
  ]);
});
