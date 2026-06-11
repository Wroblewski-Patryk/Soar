import { spawn, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const rootDir = process.cwd();
const apiDir = path.join(rootDir, 'apps', 'api');
const apiEnvPath = path.join(rootDir, 'apps', 'api', '.env');

const readEnvValue = (key, { envPath = apiEnvPath, readFile = readFileSync } = {}) => {
  try {
    const content = readFile(envPath, 'utf8');
    const line = content
      .split(/\r?\n/)
      .find((item) => item.trim().startsWith(`${key}=`));
    if (!line) return undefined;
    const raw = line.slice(line.indexOf('=') + 1).trim();
    return raw.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
  } catch {
    return undefined;
  }
};

const run = (command, args, options = {}) => {
  const {
    cwd = rootDir,
    platform = process.platform,
    spawnSyncImpl = spawnSync,
    exit = process.exit,
    ...spawnOptions
  } = options;
  const result = spawnSyncImpl(command, args, {
    stdio: 'inherit',
    cwd,
    shell: platform === 'win32',
    ...spawnOptions,
  });
  if (typeof result.status === 'number' && result.status !== 0) {
    exit(result.status);
  }
};

const runPrisma = (args, options = {}) => {
  const {
    allowEngineLockFallback = false,
    cwd = apiDir,
    platform = process.platform,
    spawnSyncImpl = spawnSync,
    stdout = process.stdout,
    stderr = process.stderr,
    consoleImpl = console,
    exit = process.exit,
  } = options;
  const result = spawnSyncImpl('pnpm', ['exec', 'prisma', ...args], {
    cwd,
    shell: platform === 'win32',
    encoding: 'utf8',
    stdio: 'pipe',
  });

  if (result.stdout) stdout.write(result.stdout);
  if (result.stderr) stderr.write(result.stderr);

  if ((result.status ?? 1) !== 0) {
    const combined = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
    if (combined.includes('Command "prisma" not found')) {
      consoleImpl.error(
        '[backend/dev] Prisma CLI not found in apps/api.\n' +
          'Run `pnpm install` in repository root and retry.'
      );
      exit(result.status ?? 1);
      return;
    }

    if (combined.includes('EPERM') && combined.includes('query_engine-windows.dll.node')) {
      if (allowEngineLockFallback) {
        consoleImpl.warn(
          '[backend/dev] Prisma engine file is locked on Windows.\n' +
            'Skipping hard regenerate and continuing with existing Prisma client.'
        );
        return;
      }
      consoleImpl.error(
        '[backend/dev] Prisma engine file is locked on Windows.\n' +
          'Close running Node/api processes and retry this command.'
      );
    }
    exit(result.status ?? 1);
  }
};

const checkTcpPort = (host, port, timeoutMs = 2000) =>
  new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;

    const finalize = (value) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(value);
    };

    socket.setTimeout(timeoutMs);
    socket.once('connect', () => finalize(true));
    socket.once('timeout', () => finalize(false));
    socket.once('error', () => finalize(false));
    socket.connect(port, host);
  });

const parseDatabaseUrl = (databaseUrl) => {
  try {
    const parsed = new URL(databaseUrl);
    return {
      host: parsed.hostname || 'localhost',
      port: Number(parsed.port || '5432'),
    };
  } catch {
    return {
      host: 'localhost',
      port: 5432,
    };
  }
};

const dockerAvailable = ({
  cwd = rootDir,
  platform = process.platform,
  spawnSyncImpl = spawnSync,
} = {}) => {
  const check = spawnSyncImpl('docker', ['info'], {
    stdio: 'ignore',
    cwd,
    shell: platform === 'win32',
  });
  return check.status === 0;
};

const redis = (redisUrl) => {
  try {
    const parsed = new URL(redisUrl);
    return { host: parsed.hostname || 'localhost', port: Number(parsed.port || '6379') };
  } catch {
    return { host: 'localhost', port: 6379 };
  }
};

const shutdown = (apiChild, workersChild = null) => {
  if (workersChild && !workersChild.killed) workersChild.kill();
  if (apiChild && !apiChild.killed) apiChild.kill();
};

const handleExit = (
  name,
  code,
  {
    consoleImpl = console,
    shutdownImpl = () => {},
    exit = process.exit,
  } = {}
) => {
  const normalized = typeof code === 'number' ? code : 0;
  if (normalized !== 0) {
    consoleImpl.error(`[backend/dev] ${name} exited with code ${normalized}`);
    shutdownImpl();
    exit(normalized);
  }
  return normalized;
};

const main = async ({
  env = process.env,
  consoleImpl = console,
  readEnvValueImpl = readEnvValue,
  checkTcpPortImpl = checkTcpPort,
  dockerAvailableImpl = dockerAvailable,
  runImpl = run,
  runPrismaImpl = runPrisma,
  spawnImpl = spawn,
  processImpl = process,
  root = rootDir,
} = {}) => {
  consoleImpl.log('[backend/dev] Preparing local backend environment...');

  const databaseUrl =
    env.DATABASE_URL ||
    readEnvValueImpl('DATABASE_URL') ||
    'postgresql://postgres:password@localhost:5432/cryptosparrow?schema=public';
  const redisUrl = env.REDIS_URL || readEnvValueImpl('REDIS_URL') || 'redis://localhost:6379';

  const db = parseDatabaseUrl(databaseUrl);
  const redisTarget = redis(redisUrl);

  let dbReady = await checkTcpPortImpl(db.host, db.port);
  let redisReady = await checkTcpPortImpl(redisTarget.host, redisTarget.port);

  if (!dbReady || !redisReady) {
    consoleImpl.log('[backend/dev] Database or Redis is not reachable. Trying Docker Compose...');
    if (!dockerAvailableImpl()) {
      consoleImpl.error(
        '[backend/dev] Docker is required to auto-start postgres/redis but Docker is unavailable.\n' +
          'Start Docker Desktop (or run Postgres/Redis manually), then retry.'
      );
      processImpl.exit(1);
      return null;
    }
    runImpl('docker', ['compose', 'up', '-d', 'postgres', 'redis']);
    dbReady = await checkTcpPortImpl(db.host, db.port, 5000);
    redisReady = await checkTcpPortImpl(redisTarget.host, redisTarget.port, 5000);
    if (!dbReady || !redisReady) {
      consoleImpl.error('[backend/dev] Postgres/Redis still unavailable after docker compose up.');
      processImpl.exit(1);
      return null;
    }
  }

  consoleImpl.log('[backend/dev] Resetting database (prisma migrate reset --force)...');
  runPrismaImpl(['migrate', 'reset', '--force']);
  consoleImpl.log('[backend/dev] Running Prisma generate...');
  runPrismaImpl(['generate'], { allowEngineLockFallback: true });
  consoleImpl.log('[backend/dev] Running Prisma migrations...');
  runPrismaImpl(['migrate', 'deploy']);

  consoleImpl.log('[backend/dev] Starting api in watch mode...');
  const apiChild = spawnImpl('pnpm', ['--filter', 'api', 'dev'], {
    stdio: 'inherit',
    cwd: root,
    shell: process.platform === 'win32',
  });

  let workersChild = null;
  if (env.BACKEND_DEV_START_WORKERS !== 'false') {
    consoleImpl.log('[backend/dev] Starting workers (execution + market-stream)...');
    workersChild = spawnImpl('pnpm', ['run', 'workers/dev'], {
      stdio: 'inherit',
      cwd: root,
      shell: process.platform === 'win32',
    });
  } else {
    consoleImpl.log('[backend/dev] Workers auto-start disabled (BACKEND_DEV_START_WORKERS=false).');
  }

  const shutdownImpl = () => shutdown(apiChild, workersChild);

  processImpl.on('SIGINT', shutdownImpl);
  processImpl.on('SIGTERM', shutdownImpl);

  apiChild.on('exit', (code) => {
    handleExit('api', code, {
      consoleImpl,
      shutdownImpl,
      exit: processImpl.exit,
    });
    if (!workersChild || workersChild.killed) processImpl.exit(code ?? 0);
  });

  if (workersChild) {
    workersChild.on('exit', (code) => {
      handleExit('workers', code, {
        consoleImpl,
        shutdownImpl,
        exit: processImpl.exit,
      });
      if (apiChild.killed) processImpl.exit(code ?? 0);
    });
  }

  return { apiChild, workersChild };
};

export {
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
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void main();
}

