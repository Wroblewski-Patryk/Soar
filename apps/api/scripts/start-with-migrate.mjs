import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const runMigrations = ({
  env = process.env,
  cwd = process.cwd(),
  spawnSyncImpl = spawnSync,
  existsSyncImpl = existsSync,
  exit = process.exit,
  log = console.log,
  error = console.error,
} = {}) => {
  if (env.API_AUTO_MIGRATE === 'false') {
    log('[api/start] API_AUTO_MIGRATE=false, skipping prisma migrate deploy');
    return;
  }

  if (!env.DATABASE_URL) {
    error('[api/start] DATABASE_URL is required when API_AUTO_MIGRATE is enabled');
    exit(1);
    return;
  }

  const prismaCliCandidates = [
    resolve(cwd, 'node_modules/prisma/build/index.js'),
    resolve(cwd, '../../node_modules/prisma/build/index.js'),
  ];
  const prismaCliPath = prismaCliCandidates.find((candidate) => existsSyncImpl(candidate));
  const schemaPath = resolve(cwd, 'prisma/schema.prisma');

  if (!prismaCliPath) {
    error('[api/start] Prisma CLI not found in node_modules; cannot run migrations');
    exit(1);
    return;
  }

  log('[api/start] Running prisma migrate deploy...');
  const migrate = spawnSyncImpl(
    process.execPath,
    [prismaCliPath, 'migrate', 'deploy', '--schema', schemaPath],
    {
      stdio: 'inherit',
      env,
    }
  );

  if (migrate.status !== 0) {
    error(`[api/start] prisma migrate deploy failed with code ${migrate.status ?? 1}`);
    exit(migrate.status ?? 1);
    return;
  }

  log('[api/start] prisma migrate deploy finished successfully');
};

export const forwardSignal = (api, signal) => {
  if (!api.killed) {
    api.kill(signal);
  }
};

export const startApi = () => {
  console.log('[api/start] Starting API server...');
  const api = spawn(process.execPath, ['dist/index.js'], {
    stdio: 'inherit',
    env: process.env,
  });

  process.on('SIGINT', () => forwardSignal(api, 'SIGINT'));
  process.on('SIGTERM', () => forwardSignal(api, 'SIGTERM'));

  api.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });
};

export const main = () => {
  runMigrations();
  startApi();
};

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main();
}
