#!/usr/bin/env node

import { spawn } from 'node:child_process';

const packs = [
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

const pnpmArgs = (args) => ['pnpm', ...args];

const run = (label, args, options = {}) =>
  new Promise((resolve, reject) => {
    console.log(`[AUD-07] ${label}`);
    const child = spawn('corepack', pnpmArgs(args), {
      cwd: options.cwd ?? process.cwd(),
      env: process.env,
      shell: process.platform === 'win32',
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

const main = async () => {
  if (process.argv.includes('--list')) {
    for (const pack of packs) {
      console.log(`${pack.name}: ${pack.files.join(' ')}`);
    }
    return;
  }

  await run('Prisma schema validation', ['--filter', 'api', 'exec', 'prisma', 'validate']);
  await run('Prisma migration status', ['--filter', 'api', 'exec', 'prisma', 'migrate', 'status']);

  for (const pack of packs) {
    await run(`Reset database before ${pack.name}`, [
      '--filter',
      'api',
      'exec',
      'prisma',
      'migrate',
      'reset',
      '--force',
      '--skip-seed',
    ]);
    await run(`Run isolated ${pack.name} DB pack`, [
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

  console.log('[AUD-07] Isolated DB-backed packs passed sequentially.');
};

main().catch((error) => {
  console.error(`[AUD-07] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
