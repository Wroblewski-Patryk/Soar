#!/usr/bin/env node

import { spawn } from 'node:child_process';

const commands = [
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

const run = ([command, args]) =>
  new Promise((resolve, reject) => {
    console.log(`\n> ${[command, ...args].join(' ')}`);
    const child = spawn(command, args, {
      shell: process.platform === 'win32',
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

for (const command of commands) {
  await run(command);
}

console.log('\nKnown-state refresh complete.');
