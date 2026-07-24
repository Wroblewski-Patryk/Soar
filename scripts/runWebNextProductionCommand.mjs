#!/usr/bin/env node

import { copyFile, mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const isDirectRun = () => process.argv[1] === fileURLToPath(import.meta.url);

export const parseArgs = (argv = process.argv.slice(2)) => {
  const [command, ...rawArgs] = argv;
  const args = rawArgs[0] === '--' ? rawArgs.slice(1) : rawArgs;
  return { command, args };
};

export const run = (cmd, cmdArgs, deps = {}) =>
  new Promise((resolve, reject) => {
    const {
      cwd,
      env,
      spawnImpl = spawn,
    } = deps;

    const child = spawnImpl(cmd, cmdArgs, {
      cwd,
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

export const syncBuildMetadataIntoNextOutput = async (webDir, deps = {}) => {
  const {
    mkdirImpl = mkdir,
    copyFileImpl = copyFile,
  } = deps;

  const metadataDir = path.join(webDir, '.build-meta');
  const nextDir = path.join(webDir, '.next');
  await mkdirImpl(nextDir, { recursive: true });
  await copyFileImpl(
    path.join(metadataDir, 'BUILD_META.json'),
    path.join(nextDir, 'BUILD_META.json'),
  );
};

export const main = async (deps = {}) => {
  const {
    argv = process.argv.slice(2),
    consoleImpl = console,
    env = process.env,
    exit = process.exit,
    execPath = process.execPath,
    parseArgsFn = parseArgs,
    repoRoot = path.resolve(import.meta.dirname, '..'),
    runCommand = run,
    syncBuildMetadata = syncBuildMetadataIntoNextOutput,
  } = deps;

  const { command, args } = parseArgsFn(argv);
  if (!command || !['build', 'start'].includes(command)) {
    consoleImpl.error('Usage: node scripts/runWebNextProductionCommand.mjs <build|start> [...args]');
    exit(1);
    return { status: 1, usage: true };
  }

  const webDir = path.join(repoRoot, 'apps', 'web');
  const nextCli = path.join(webDir, 'node_modules', 'next', 'dist', 'bin', 'next');
  const productionEnv = {
    ...env,
    NODE_ENV: 'production',
  };

  if (command === 'build') {
    await runCommand(
      execPath,
      [path.join(repoRoot, 'scripts', 'writeWebBuildMetadata.mjs')],
      { cwd: webDir, env: productionEnv },
    );
  }

  const startArgs = command === 'start'
    ? [
        ...(!args.includes('-p') && !args.includes('--port') ? ['-p', env.PORT || '3002'] : []),
        ...(!args.includes('-H') && !args.includes('--hostname') ? ['-H', '0.0.0.0'] : []),
        ...args,
      ]
    : args;

  try {
    await runCommand(
      execPath,
      [nextCli, command, ...startArgs],
      { cwd: webDir, env: productionEnv },
    );
    if (command === 'build') {
      await syncBuildMetadata(webDir);
    }
    return { status: 0, command, args: startArgs };
  } catch (error) {
    consoleImpl.error(error instanceof Error ? error.message : String(error));
    exit(1);
    return { status: 1, error };
  }
};

if (isDirectRun()) {
  await main();
}
