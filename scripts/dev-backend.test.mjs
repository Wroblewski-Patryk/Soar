import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import net from 'node:net';
import test from 'node:test';

import {
  checkTcpPort,
  dockerAvailable,
  handleExit,
  main,
  parseDatabaseUrl,
  readEnvValue,
  redis,
  run,
  runPrisma,
  shutdown,
} from './dev-backend.mjs';

const listen = (server) =>
  new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.off('error', reject);
      resolve(server.address().port);
    });
  });

const closeServer = (server) =>
  new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });

const createChild = () => {
  const child = new EventEmitter();
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

test('readEnvValue reads quoted values and returns undefined when the env file is unavailable', () => {
  const content = [
    'DATABASE_URL="postgresql://user:pass@db.internal:15432/app?schema=public"',
    "REDIS_URL='redis://cache.internal:16379'",
  ].join('\n');

  assert.equal(
    readEnvValue('DATABASE_URL', {
      envPath: 'unused.env',
      readFile: () => content,
    }),
    'postgresql://user:pass@db.internal:15432/app?schema=public'
  );
  assert.equal(
    readEnvValue('REDIS_URL', {
      envPath: 'unused.env',
      readFile: () => content,
    }),
    'redis://cache.internal:16379'
  );
  assert.equal(
    readEnvValue('MISSING', {
      envPath: 'unused.env',
      readFile: () => {
        throw new Error('no file');
      },
    }),
    undefined
  );
});

test('parseDatabaseUrl and redis normalize valid and malformed connection URLs', () => {
  assert.deepEqual(
    parseDatabaseUrl('postgresql://postgres:password@db.local:15432/soar?schema=public'),
    { host: 'db.local', port: 15432 }
  );
  assert.deepEqual(parseDatabaseUrl('not a database url'), {
    host: 'localhost',
    port: 5432,
  });
  assert.deepEqual(redis('redis://cache.local:16379'), {
    host: 'cache.local',
    port: 16379,
  });
  assert.deepEqual(redis('invalid redis url'), {
    host: 'localhost',
    port: 6379,
  });
});

test('checkTcpPort resolves true on connect and false on connection failure', async () => {
  const server = net.createServer((socket) => socket.end());
  const port = await listen(server);

  try {
    assert.equal(await checkTcpPort('127.0.0.1', port, 250), true);
  } finally {
    await closeServer(server);
  }

  assert.equal(await checkTcpPort('127.0.0.1', port, 100), false);
});

test('dockerAvailable and run use injected process seams without invoking real commands', () => {
  const calls = [];
  const spawnSyncImpl = (command, args, options) => {
    calls.push({ command, args, options });
    return { status: 0 };
  };

  assert.equal(
    dockerAvailable({
      cwd: 'C:/repo',
      platform: 'win32',
      spawnSyncImpl,
    }),
    true
  );
  run('pnpm', ['--version'], {
    cwd: 'C:/repo',
    platform: 'linux',
    spawnSyncImpl,
    exit: (code) => {
      throw new Error(`unexpected exit ${code}`);
    },
  });

  assert.deepEqual(calls.map((call) => call.command), ['docker', 'pnpm']);
  assert.equal(calls[0].options.shell, true);
  assert.equal(calls[1].options.shell, false);
});

test('run exits with the failing command status', () => {
  const recorder = createExitRecorder();

  assert.throws(
    () =>
      run('pnpm', ['bad'], {
        spawnSyncImpl: () => ({ status: 7 }),
        exit: recorder.exit,
      }),
    /exit:7/
  );
  assert.deepEqual(recorder.codes, [7]);
});

test('runPrisma classifies missing CLI and locked engine fallback paths', () => {
  const stderrLines = [];
  const consoleLines = [];
  const recorder = createExitRecorder();

  assert.throws(
    () =>
      runPrisma(['generate'], {
        spawnSyncImpl: () => ({
          status: 1,
          stdout: '',
          stderr: 'Command "prisma" not found',
        }),
        stderr: { write: (value) => stderrLines.push(value) },
        consoleImpl: {
          error: (value) => consoleLines.push(value),
          warn: (value) => consoleLines.push(value),
        },
        exit: recorder.exit,
      }),
    /exit:1/
  );
  assert.match(consoleLines.join('\n'), /Prisma CLI not found/);

  assert.doesNotThrow(() =>
    runPrisma(['generate'], {
      allowEngineLockFallback: true,
      spawnSyncImpl: () => ({
        status: 1,
        stdout: '',
        stderr: 'EPERM query_engine-windows.dll.node',
      }),
      stderr: { write: (value) => stderrLines.push(value) },
      consoleImpl: {
        error: (value) => consoleLines.push(value),
        warn: (value) => consoleLines.push(value),
      },
      exit: (code) => {
        throw new Error(`unexpected exit ${code}`);
      },
    })
  );
  assert.match(consoleLines.join('\n'), /Skipping hard regenerate/);
});

test('shutdown and handleExit terminate child processes only on failing exits', () => {
  const apiChild = createChild();
  const workersChild = createChild();

  shutdown(apiChild, workersChild);
  assert.equal(apiChild.killed, true);
  assert.equal(workersChild.killed, true);

  const recorder = createExitRecorder();
  let shutdownCalled = 0;
  assert.equal(
    handleExit('api', 0, {
      shutdownImpl: () => {
        shutdownCalled += 1;
      },
      exit: recorder.exit,
    }),
    0
  );
  assert.equal(shutdownCalled, 0);

  assert.throws(
    () =>
      handleExit('workers', 3, {
        consoleImpl: { error: () => {} },
        shutdownImpl: () => {
          shutdownCalled += 1;
        },
        exit: recorder.exit,
      }),
    /exit:3/
  );
  assert.equal(shutdownCalled, 1);
});

test('main runs the local helper path with injected ready services and disabled workers', async () => {
  const commands = [];
  const prismaCommands = [];
  const spawned = [];
  const listeners = [];

  const result = await main({
    env: {
      DATABASE_URL: 'postgresql://postgres:password@127.0.0.1:15432/soar',
      REDIS_URL: 'redis://127.0.0.1:16379',
      BACKEND_DEV_START_WORKERS: 'false',
    },
    consoleImpl: { log: () => {}, error: () => {} },
    readEnvValueImpl: () => undefined,
    checkTcpPortImpl: async () => true,
    dockerAvailableImpl: () => {
      throw new Error('docker should not be checked when services are ready');
    },
    runImpl: (...args) => commands.push(args),
    runPrismaImpl: (...args) => prismaCommands.push(args),
    spawnImpl: (command, args) => {
      spawned.push({ command, args });
      return createChild();
    },
    processImpl: {
      on: (name) => listeners.push(name),
      exit: (code) => {
        throw new Error(`unexpected exit ${code}`);
      },
    },
    root: 'C:/repo',
  });

  assert.equal(commands.length, 0);
  assert.deepEqual(prismaCommands.map(([args]) => args.join(' ')), [
    'migrate reset --force',
    'generate',
    'migrate deploy',
  ]);
  assert.deepEqual(spawned, [{ command: 'pnpm', args: ['--filter', 'api', 'dev'] }]);
  assert.deepEqual(listeners, ['SIGINT', 'SIGTERM']);
  assert.equal(result.workersChild, null);
});

test('main shutdown signal handler terminates api and worker children', async () => {
  const signalHandlers = new Map();
  const children = [];

  await main({
    env: {
      DATABASE_URL: 'postgresql://postgres:password@127.0.0.1:15432/soar',
      REDIS_URL: 'redis://127.0.0.1:16379',
    },
    consoleImpl: { log: () => {}, error: () => {} },
    readEnvValueImpl: () => undefined,
    checkTcpPortImpl: async () => true,
    dockerAvailableImpl: () => {
      throw new Error('docker should not be checked when services are ready');
    },
    runImpl: () => {
      throw new Error('docker compose should not run');
    },
    runPrismaImpl: () => {},
    spawnImpl: () => {
      const child = createChild();
      children.push(child);
      return child;
    },
    processImpl: {
      on: (name, handler) => signalHandlers.set(name, handler),
      exit: (code) => {
        throw new Error(`unexpected exit ${code}`);
      },
    },
  });

  assert.equal(children.length, 2);
  assert.equal(typeof signalHandlers.get('SIGINT'), 'function');
  signalHandlers.get('SIGINT')();
  assert.equal(children[0].killed, true);
  assert.equal(children[1].killed, true);
});

test('main fails closed when services are unavailable and Docker is unavailable', async () => {
  const recorder = createExitRecorder();

  await assert.rejects(
    () =>
      main({
        env: {},
        consoleImpl: { log: () => {}, error: () => {} },
        readEnvValueImpl: () => undefined,
        checkTcpPortImpl: async () => false,
        dockerAvailableImpl: () => false,
        runImpl: () => {
          throw new Error('docker compose should not run');
        },
        runPrismaImpl: () => {
          throw new Error('prisma should not run');
        },
        spawnImpl: () => {
          throw new Error('api should not start');
        },
        processImpl: {
          on: () => {},
          exit: recorder.exit,
        },
      }),
    /exit:1/
  );
  assert.deepEqual(recorder.codes, [1]);
});
