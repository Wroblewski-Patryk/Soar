import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import path from 'node:path';
import test from 'node:test';

import {
  findMissingWorkerFiles,
  main,
  prefixLog,
  startWorkers,
  stopAll,
  writeMissingWorkerGuidance,
} from './start-workers-prod.mjs';

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

test('findMissingWorkerFiles resolves missing worker dist files', () => {
  const missing = findMissingWorkerFiles({
    distDir: 'dist/workers',
    entries: [
      { name: 'market-data', file: 'marketData.worker.js' },
      { name: 'execution', file: 'execution.worker.js' },
    ],
    existsSync: (workerPath) => workerPath.endsWith('marketData.worker.js'),
  });

  assert.deepEqual(missing, [path.join('dist/workers', 'execution.worker.js')]);
});

test('writeMissingWorkerGuidance prints build-before-start guidance', () => {
  const stderr = [];

  writeMissingWorkerGuidance(['dist/workers/execution.worker.js'], {
    write: (message) => stderr.push(message),
  });

  assert.match(stderr.join(''), /\[workers\/prod\] missing built worker files:/);
  assert.match(stderr.join(''), /dist\/workers\/execution\.worker\.js/);
  assert.match(stderr.join(''), /pnpm --filter api build/);
});

test('prefixLog writes non-empty worker stdout and stderr lines', () => {
  const stdout = [];
  const stderr = [];

  prefixLog('execution', Buffer.from('started\n\nheartbeat\n'), false, {
    stdout: { write: (message) => stdout.push(message) },
    stderr: { write: (message) => stderr.push(message) },
  });
  prefixLog('execution', Buffer.from('failed\n'), true, {
    stdout: { write: (message) => stdout.push(message) },
    stderr: { write: (message) => stderr.push(message) },
  });

  assert.deepEqual(stdout, ['[worker/execution] started\n', '[worker/execution] heartbeat\n']);
  assert.deepEqual(stderr, ['[worker/execution] failed\n']);
});

test('startWorkers spawns all worker scripts and fails closed on unexpected child exit', () => {
  const children = [createObservableChild(), createObservableChild()];
  const spawnCalls = [];
  const stdout = [];
  const stderr = [];
  const exits = [];
  const handlers = {};

  startWorkers({
    distDir: 'dist/workers',
    entries: [
      { name: 'market-data', file: 'marketData.worker.js' },
      { name: 'execution', file: 'execution.worker.js' },
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

  children[1].stderr.emit('data', Buffer.from('boom\n'));
  children[1].emit('exit', null, 'SIGTERM');

  assert.equal(handlers.SIGINT instanceof Function, true);
  assert.equal(handlers.SIGTERM instanceof Function, true);
  assert.deepEqual(spawnCalls.map((call) => call.command), ['node', 'node']);
  assert.deepEqual(spawnCalls.map((call) => call.args[0]), [
    path.join('dist/workers', 'marketData.worker.js'),
    path.join('dist/workers', 'execution.worker.js'),
  ]);
  assert.equal(spawnCalls[0].options.shell, false);
  assert.deepEqual(stdout, []);
  assert.match(stderr.join(''), /\[worker\/execution\] boom/);
  assert.match(stderr.join(''), /\[worker\/execution\] exited with signal SIGTERM/);
  assert.deepEqual(children.map((child) => child.killed), [true, true]);
  assert.deepEqual(exits, [1]);
});

test('stopAll skips already killed worker children and graceful shutdown exits zero once', () => {
  const children = [createFakeChild(), createFakeChild()];
  children[1].killed = true;

  stopAll(children, 'SIGINT');

  assert.equal(children[0].signal, 'SIGINT');
  assert.equal(children[1].signal, undefined);

  const stdout = [];
  const exits = [];
  const runtime = startWorkers({
    entries: [{ name: 'execution', file: 'execution.worker.js' }],
    stdout: { write: (message) => stdout.push(message) },
    stderr: { write: () => {} },
    processImpl: { on: () => {}, exit: (code) => exits.push(code) },
    spawnImpl: () => createObservableChild(),
  });

  runtime.gracefulShutdown();
  runtime.gracefulShutdown();

  assert.equal(stdout.filter((line) => line === '[workers/prod] shutdown requested\n').length, 1);
  assert.deepEqual(exits, [0]);
});

test('main fails before starting workers when dist files are missing', () => {
  const stderr = [];
  const exits = [];

  const result = main({
    findMissingWorkerFilesFn: () => ['dist/workers/execution.worker.js'],
    stderr: { write: (message) => stderr.push(message) },
    exit: (code) => exits.push(code),
  });

  assert.equal(result.status, 'FAIL');
  assert.equal(result.reason, 'missing-workers');
  assert.deepEqual(exits, [1]);
  assert.match(stderr.join(''), /missing built worker files/);
});

test('main starts workers after dist file validation passes', () => {
  let started = false;

  const result = main({
    findMissingWorkerFilesFn: () => [],
    startWorkersFn: () => {
      started = true;
      return { children: [] };
    },
  });

  assert.equal(result.status, 'STARTED');
  assert.equal(started, true);
});
