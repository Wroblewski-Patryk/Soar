import { spawnSync } from 'node:child_process';
import net from 'node:net';

const args = process.argv.slice(2);
const targetArg = args.find((arg) => arg.startsWith('--target='));
const rawTarget = targetArg?.split('=')[1] ?? 'full';
const target = rawTarget === 'server' ? 'api' : rawTarget;

if (!['api', 'full'].includes(target)) {
  console.error(`Unsupported target "${rawTarget}". Use --target=api or --target=full.`);
  process.exit(1);
}

const localPrismaCommand =
  process.platform === 'win32'
    ? '.\\node_modules\\.bin\\prisma.CMD'
    : './node_modules/.bin/prisma';

const run = (command, commandArgs, options = {}) => {
  const result = spawnSync(command, commandArgs, {
    stdio: options.captureOutput ? 'pipe' : 'inherit',
    shell: process.platform === 'win32',
    encoding: options.captureOutput ? 'utf8' : undefined,
    cwd: options.cwd,
  });
  return {
    exitCode: typeof result.status === 'number' ? result.status : 1,
    stdout: typeof result.stdout === 'string' ? result.stdout : '',
    stderr: typeof result.stderr === 'string' ? result.stderr : '',
  };
};

const canConnect = (port, host = '127.0.0.1', timeoutMs = 1_500) =>
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

const localInfraIsReachable = async () => {
  const [postgresOk, redisOk] = await Promise.all([canConnect(5432), canConnect(6379)]);
  return { postgresOk, redisOk, allOk: postgresOk && redisOk };
};

const extractFailedMigrationName = (output) => {
  const explicitName = /Migration name:\s*([A-Za-z0-9_]+)/.exec(output);
  if (explicitName?.[1]) return explicitName[1];

  const p3009Name = /The `([^`]+)` migration started/i.exec(output);
  if (p3009Name?.[1]) return p3009Name[1];

  const applyingName = /Applying migration `([^`]+)`/i.exec(output);
  return applyingName?.[1] ?? '';
};

const printLocalMigrationGuidance = (output) => {
  if (!output.includes('P3009') && !output.includes('P3018')) return;
  const failedMigration = extractFailedMigrationName(output);
  console.error('\n[go-live-smoke] Prisma migrate deploy is blocked by failed migrations in the local target database.');
  if (failedMigration) {
    console.error(`[go-live-smoke] Failed migration detected: \`${failedMigration}\`.`);
  }
  console.error('[go-live-smoke] Resolve the failed local migration state first, then rerun the smoke wrapper.');
  console.error('[go-live-smoke] On this repo/workstation the known failure shape is local schema-history drift, not a newly confirmed V1 product bug.');
  console.error('[go-live-smoke] Recovery options:');
  console.error('[go-live-smoke]  1) destructive local reset: `docker compose down -v` and recreate local infra');
  console.error(
    '[go-live-smoke]  2) non-destructive local recovery only after confirming the failed migration objects already exist: `cd apps/api && .\\\\node_modules\\\\.bin\\\\prisma.CMD migrate resolve --applied <failed_migration>`'
  );
  console.error('[go-live-smoke] After recovery, rerun `pnpm run test:go-live:smoke` to verify the full local path.');
};

let exitCode = 0;
let infraStarted = false;
let infraReused = false;

try {
  const infraUp = run('pnpm', ['run', 'go-live:infra:up'], { captureOutput: true });
  if (infraUp.exitCode !== 0) {
    const infraStatus = await localInfraIsReachable();
    if (!infraStatus.allOk) {
      process.stdout.write(infraUp.stdout);
      process.stderr.write(infraUp.stderr);
      process.exit(infraUp.exitCode);
    }
    infraReused = true;
    console.warn(
      '[go-live-smoke] Reusing already-running local Postgres/Redis because docker compose startup failed but both ports are reachable (5432, 6379).'
    );
  } else {
    process.stdout.write(infraUp.stdout);
    process.stderr.write(infraUp.stderr);
    infraStarted = true;
  }

  const migrateDeploy = run(localPrismaCommand, ['migrate', 'deploy'], {
    captureOutput: true,
    cwd: 'apps/api',
  });
  process.stdout.write(migrateDeploy.stdout);
  process.stderr.write(migrateDeploy.stderr);
  if (migrateDeploy.exitCode !== 0) {
    printLocalMigrationGuidance(`${migrateDeploy.stdout}\n${migrateDeploy.stderr}`);
    process.exit(migrateDeploy.exitCode);
  }

  exitCode = run('pnpm', ['run', 'test:go-live:api']).exitCode;
  if (exitCode !== 0) {
    process.exit(exitCode);
  }

  if (target === 'full') {
    exitCode = run('pnpm', ['run', 'test:go-live:client']).exitCode;
    if (exitCode !== 0) {
      process.exit(exitCode);
    }
  }
} finally {
  if (infraStarted && !infraReused) {
    const downCode = run('pnpm', ['run', 'go-live:infra:down']).exitCode;
    if (exitCode === 0 && downCode !== 0) {
      exitCode = downCode;
    }
  }
}

process.exit(exitCode);
