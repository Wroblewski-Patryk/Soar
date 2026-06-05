#!/usr/bin/env node

import { spawn } from 'node:child_process';
import path from 'node:path';

const [, , command, ...rawArgs] = process.argv;
const args = rawArgs[0] === '--' ? rawArgs.slice(1) : rawArgs;

if (!command || !['build', 'start'].includes(command)) {
  console.error('Usage: node scripts/runWebNextProductionCommand.mjs <build|start> [...args]');
  process.exit(1);
}

const repoRoot = path.resolve(import.meta.dirname, '..');
const webDir = path.join(repoRoot, 'apps', 'web');
const nextCli = path.join(webDir, 'node_modules', 'next', 'dist', 'bin', 'next');

const env = {
  ...process.env,
  NODE_ENV: 'production',
};

const run = (cmd, cmdArgs) =>
  new Promise((resolve, reject) => {
    const child = spawn(cmd, cmdArgs, {
      cwd: webDir,
      env,
      stdio: 'inherit',
      shell: false,
    });

    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`${cmd} ${cmdArgs.join(' ')} exited with signal ${signal}`));
        return;
      }

      if (code) {
        reject(new Error(`${cmd} ${cmdArgs.join(' ')} exited with code ${code}`));
        return;
      }

      resolve();
    });
  });

try {
  if (command === 'build') {
    await run(process.execPath, [path.join(repoRoot, 'scripts', 'writeWebBuildMetadata.mjs')]);
  }

  const startArgs = command === 'start'
    ? [
        ...(!args.includes('-p') && !args.includes('--port') ? ['-p', process.env.PORT || '3002'] : []),
        ...(!args.includes('-H') && !args.includes('--hostname') ? ['-H', '0.0.0.0'] : []),
        ...args,
      ]
    : args;

  await run(process.execPath, [nextCli, command, ...startArgs]);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
