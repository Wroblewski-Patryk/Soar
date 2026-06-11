import { spawnSync } from 'node:child_process';
import net from 'node:net';
import { pathToFileURL } from 'node:url';

const localPrismaCommand =
  process.platform === 'win32'
    ? '.\\node_modules\\.bin\\prisma.CMD'
    : './node_modules/.bin/prisma';

export const resolveTarget = (args = process.argv.slice(2)) => {
  const targetArg = args.find((arg) => arg.startsWith('--target='));
  const rawTarget = targetArg?.split('=')[1] ?? 'full';
  const target = rawTarget === 'server' ? 'api' : rawTarget;
  return { rawTarget, target };
};

export const run = (command, commandArgs, options = {}) => {
  const result = (options.spawnSync ?? spawnSync)(command, commandArgs, {
    stdio: options.captureOutput ? 'pipe' : 'inherit',
    shell: (options.platform ?? process.platform) === 'win32',
    encoding: options.captureOutput ? 'utf8' : undefined,
    cwd: options.cwd,
  });
  return {
    exitCode: typeof result.status === 'number' ? result.status : 1,
    stdout: typeof result.stdout === 'string' ? result.stdout : '',
    stderr: typeof result.stderr === 'string' ? result.stderr : '',
  };
};

export const canConnect = (port, host = '127.0.0.1', timeoutMs = 1_500) =>
  new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(value);
    };
    socket.setTimeout(timeoutMs);
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
    socket.connect(port, host);
  });

export const localInfraIsReachable = async (options = {}) => {
  const canConnectImpl = options.canConnect ?? canConnect;
  const [postgresOk, redisOk] = await Promise.all([canConnectImpl(5432), canConnectImpl(6379)]);
  return { postgresOk, redisOk, allOk: postgresOk && redisOk };
};

export const extractFailedMigrationName = (output) => {
  const explicitName = /Migration name:\s*([A-Za-z0-9_]+)/.exec(output);
  if (explicitName?.[1]) return explicitName[1];

  const p3009Name = /The `([^`]+)` migration started/i.exec(output);
  if (p3009Name?.[1]) return p3009Name[1];

  const applyingName = /Applying migration `([^`]+)`/i.exec(output);
  return applyingName?.[1] ?? '';
};

export const printLocalMigrationGuidance = (output, logger = console) => {
  if (!output.includes('P3009') && !output.includes('P3018')) return '';
  const failedMigration = extractFailedMigrationName(output);
  logger.error('\n[go-live-smoke] Prisma migrate deploy is blocked by failed migrations in the local target database.');
  if (failedMigration) {
    logger.error(`[go-live-smoke] Failed migration detected: \`${failedMigration}\`.`);
  }
  logger.error('[go-live-smoke] Resolve the failed local migration state first, then rerun the smoke wrapper.');
  logger.error('[go-live-smoke] On this repo/workstation the known failure shape is local schema-history drift, not a newly confirmed V1 product bug.');
  logger.error('[go-live-smoke] Recovery options:');
  logger.error('[go-live-smoke]  1) destructive local reset: `docker compose down -v` and recreate local infra');
  logger.error(
    '[go-live-smoke]  2) non-destructive local recovery only after confirming the failed migration objects already exist: `cd apps/api && .\\\\node_modules\\\\.bin\\\\prisma.CMD migrate resolve --applied <failed_migration>`'
  );
  logger.error('[go-live-smoke] After recovery, rerun `pnpm run test:go-live:smoke` to verify the full local path.');
  return failedMigration;
};

export const main = async (options = {}) => {
  const args = options.argv ?? process.argv.slice(2);
  const logger = options.console ?? console;
  const processImpl = options.process ?? process;
  const runCommand = options.run ?? run;
  const localInfraIsReachableImpl = options.localInfraIsReachable ?? localInfraIsReachable;
  const prismaCommand = options.localPrismaCommand ?? localPrismaCommand;
  const { rawTarget, target } = resolveTarget(args);

  if (!['api', 'full'].includes(target)) {
    logger.error(`Unsupported target "${rawTarget}". Use --target=api or --target=full.`);
    processImpl.exit?.(1);
    return { exitCode: 1, target, rawTarget, error: 'unsupported-target' };
  }

  let exitCode = 0;
  let infraStarted = false;
  let infraReused = false;
  let stop = false;

  try {
    const infraUp = runCommand('pnpm', ['run', 'go-live:infra:up'], { captureOutput: true });
    if (infraUp.exitCode !== 0) {
      const infraStatus = await localInfraIsReachableImpl();
      if (!infraStatus.allOk) {
        processImpl.stdout?.write?.(infraUp.stdout);
        processImpl.stderr?.write?.(infraUp.stderr);
        exitCode = infraUp.exitCode;
        stop = true;
      } else {
        infraReused = true;
        logger.warn(
          '[go-live-smoke] Reusing already-running local Postgres/Redis because docker compose startup failed but both ports are reachable (5432, 6379).'
        );
      }
    } else {
      processImpl.stdout?.write?.(infraUp.stdout);
      processImpl.stderr?.write?.(infraUp.stderr);
      infraStarted = true;
    }

    if (!stop) {
      const migrateDeploy = runCommand(prismaCommand, ['migrate', 'deploy'], {
        captureOutput: true,
        cwd: 'apps/api',
      });
      processImpl.stdout?.write?.(migrateDeploy.stdout);
      processImpl.stderr?.write?.(migrateDeploy.stderr);
      if (migrateDeploy.exitCode !== 0) {
        printLocalMigrationGuidance(`${migrateDeploy.stdout}\n${migrateDeploy.stderr}`, logger);
        exitCode = migrateDeploy.exitCode;
        stop = true;
      }
    }

    if (!stop) {
      exitCode = runCommand('pnpm', ['run', 'test:go-live:api']).exitCode;
      if (exitCode !== 0) {
        stop = true;
      }
    }

    if (!stop && target === 'full') {
      exitCode = runCommand('pnpm', ['run', 'test:go-live:client']).exitCode;
      if (exitCode !== 0) {
        stop = true;
      }
    }
  } finally {
    if (infraStarted && !infraReused) {
      const downCode = runCommand('pnpm', ['run', 'go-live:infra:down']).exitCode;
      if (exitCode === 0 && downCode !== 0) {
        exitCode = downCode;
      }
    }
  }

  processImpl.exit?.(exitCode);
  return { exitCode, target, rawTarget, infraStarted, infraReused };
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error('[go-live-smoke] failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
