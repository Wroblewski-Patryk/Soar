import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import test from 'node:test';

import { handleWorkerExit, main, prefixLog, shutdown } from './dev-workers.mjs';

const createChild = () => {
  const child = new EventEmitter();
  child.stdout = new EventEmitter();
  child.stderr = new EventEmitter();
  child.killed = false;
  child.kill = () => {
    child.killed = true;
  };
  return child;
};

const createExitRecorder = () => {
  const codes = [];
  return {
    exit: (code) => {
      codes.push(code);
      throw Object.assign(new Error(`exit:${code}`), { code });
    },
    codes,
  };
};

test('prefixLog writes non-empty stdout and stderr lines with worker prefix', () => {
  const stdoutLines = [];
  const stderrLines = [];
  const streams = {
    stdout: { write: (value) => stdoutLines.push(value) },
    stderr: { write: (value) => stderrLines.push(value) },
  };

  prefixLog('execution', Buffer.from('ready\n\nprocessing\r\n'), false, streams);
  prefixLog('market-stream', 'stream error\n', true, streams);

  assert.deepEqual(stdoutLines, [
    '[worker/execution] ready\n',
    '[worker/execution] processing\n',
  ]);
  assert.deepEqual(stderrLines, ['[worker/market-stream] stream error\n']);
});

test('shutdown kills only live child processes and exits with zero', () => {
  const liveChild = createChild();
  const alreadyKilled = createChild();
  alreadyKilled.killed = true;
  const recorder = createExitRecorder();

  assert.throws(
    () => shutdown([liveChild, alreadyKilled], { exit: recorder.exit }),
    /exit:0/
  );

  assert.equal(liveChild.killed, true);
  assert.equal(alreadyKilled.killed, true);
  assert.deepEqual(recorder.codes, [0]);
});

test('handleWorkerExit preserves successful exits and fails closed on non-zero worker exits', () => {
  const first = createChild();
  const second = createChild();
  const stderrLines = [];
  const recorder = createExitRecorder();

  assert.equal(
    handleWorkerExit('execution', 0, [first, second], {
      stderr: { write: (value) => stderrLines.push(value) },
      exit: recorder.exit,
    }),
    0
  );
  assert.equal(first.killed, false);
  assert.equal(second.killed, false);

  assert.throws(
    () =>
      handleWorkerExit('market-stream', 4, [first, second], {
        stderr: { write: (value) => stderrLines.push(value) },
        exit: recorder.exit,
      }),
    /exit:4/
  );

  assert.equal(first.killed, true);
  assert.equal(second.killed, true);
  assert.deepEqual(recorder.codes, [4]);
  assert.deepEqual(stderrLines, ['[worker/market-stream] exited with code 4\n']);
});

test('main spawns configured workers, prefixes child streams, and registers shutdown signals', () => {
  const spawned = [];
  const children = [];
  const signalHandlers = new Map();
  const stdoutLines = [];
  const stderrLines = [];
  const recorder = createExitRecorder();

  const result = main({
    commands: [
      { name: 'execution', args: ['--filter', 'api', 'dev:worker:execution'] },
      { name: 'market-stream', args: ['--filter', 'api', 'dev:worker:market-stream'] },
    ],
    root: 'C:/repo',
    platform: 'win32',
    spawnImpl: (command, args, options) => {
      const child = createChild();
      spawned.push({ command, args, options });
      return child;
    },
    processImpl: {
      on: (name, handler) => signalHandlers.set(name, handler),
      exit: recorder.exit,
    },
    stdout: { write: (value) => stdoutLines.push(value) },
    stderr: { write: (value) => stderrLines.push(value) },
    workerChildren: children,
  });

  assert.equal(result.children, children);
  assert.deepEqual(
    spawned.map(({ command, args, options }) => ({ command, args, shell: options.shell })),
    [
      {
        command: 'pnpm',
        args: ['--filter', 'api', 'dev:worker:execution'],
        shell: true,
      },
      {
        command: 'pnpm',
        args: ['--filter', 'api', 'dev:worker:market-stream'],
        shell: true,
      },
    ]
  );
  assert.deepEqual([...signalHandlers.keys()], ['SIGINT', 'SIGTERM']);

  children[0].stdout.emit('data', Buffer.from('online\n'));
  children[1].stderr.emit('data', Buffer.from('retrying\n'));
  assert.deepEqual(stdoutLines, ['[worker/execution] online\n']);
  assert.deepEqual(stderrLines, ['[worker/market-stream] retrying\n']);

  assert.throws(() => signalHandlers.get('SIGINT')(), /exit:0/);
  assert.equal(children[0].killed, true);
  assert.equal(children[1].killed, true);
  assert.deepEqual(recorder.codes, [0]);
});
