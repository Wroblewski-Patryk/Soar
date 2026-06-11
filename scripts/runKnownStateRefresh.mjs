#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const commands = [
  ['pnpm', ['run', 'architecture:graph:generate']],
  ['pnpm', ['run', 'architecture:graph:drift:strict']],
  ['pnpm', ['run', 'architecture:journey:index:strict']],
  ['pnpm', ['run', 'docs:parity:check']],
  ['pnpm', ['run', 'quality:guardrails']],
  ['pnpm', ['run', 'ops:project:index']],
  ['pnpm', ['run', 'ops:project:scan']],
  ['pnpm', ['run', 'ops:project:ledger']],
  ['pnpm', ['run', 'ops:project:scorecard']],
];

export const run = ([command, args], options = {}) =>
  new Promise((resolve, reject) => {
    const logger = options.console ?? console;
    logger.log(`\n> ${[command, ...args].join(' ')}`);
    const child = (options.spawn ?? spawn)(command, args, {
      shell: (options.platform ?? process.platform) === 'win32',
      stdio: 'inherit',
    });
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(' ')} exited with ${code}`));
    });
    child.on('error', reject);
  });

export const main = async (options = {}) => {
  const commandList = options.commands ?? commands;
  const runCommand = options.run ?? run;
  const logger = options.console ?? console;

  for (const command of commandList) {
    await runCommand(command, options);
  }

  logger.log('\nKnown-state refresh complete.');
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error('[ops:project:known-state] failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
