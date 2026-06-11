#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const packs = [
  {
    name: 'wallets',
    files: ['src/modules/wallets/wallets.e2e.test.ts'],
  },
  {
    name: 'backtests',
    files: ['src/modules/backtests/backtests.e2e.test.ts'],
  },
  {
    name: 'runtime-repository',
    files: ['src/modules/engine/runtimeSignalLoop.repository.test.ts'],
  },
];

export const pnpmArgs = (args) => ['pnpm', ...args];

export const run = (label, args, options = {}) =>
  new Promise((resolve, reject) => {
    const logger = options.console ?? console;
    const spawnProcess = options.spawn ?? spawn;
    logger.log(`[AUD-07] ${label}`);
    const child = spawnProcess('corepack', pnpmArgs(args), {
      cwd: options.cwd ?? process.cwd(),
      env: options.env ?? process.env,
      shell: (options.platform ?? process.platform) === 'win32',
      stdio: 'inherit',
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${label} failed with exit code ${code}`));
    });
  });

export const main = async (options = {}) => {
  const argv = options.argv ?? process.argv;
  const logger = options.console ?? console;
  const runCommand = options.run ?? run;

  if (argv.includes('--list')) {
    for (const pack of packs) {
      logger.log(`${pack.name}: ${pack.files.join(' ')}`);
    }
    return;
  }

  await runCommand('Prisma schema validation', ['--filter', 'api', 'exec', 'prisma', 'validate']);
  await runCommand('Prisma migration status', ['--filter', 'api', 'exec', 'prisma', 'migrate', 'status']);

  for (const pack of packs) {
    await runCommand(`Reset database before ${pack.name}`, [
      '--filter',
      'api',
      'exec',
      'prisma',
      'migrate',
      'reset',
      '--force',
      '--skip-seed',
    ]);
    await runCommand(`Run isolated ${pack.name} DB pack`, [
      '--filter',
      'api',
      'exec',
      'vitest',
      'run',
      ...pack.files,
      '--run',
      '--sequence.concurrent=false',
      '--pool',
      'forks',
      '--poolOptions.forks.singleFork=true',
    ]);
  }

  logger.log('[AUD-07] Isolated DB-backed packs passed sequentially.');
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`[AUD-07] ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  });
}
