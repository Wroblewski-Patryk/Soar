#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const isDirectRun = () => process.argv[1] === fileURLToPath(import.meta.url);

export const run = (label, command, args, deps = {}) => {
  const {
    consoleImpl = console,
    platform = process.platform,
    spawnSyncImpl = spawnSync,
  } = deps;

  consoleImpl.log(`[ops:rc:gates:refresh:summary:strict] ${label}`);
  return spawnSyncImpl(command, args, {
    stdio: 'inherit',
    shell: platform === 'win32',
  });
};

export const parseArgs = (argv = process.argv.slice(2)) => {
  const options = {
    requireProductionGate2: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') options.help = true;
    if (arg === '--require-production-gate2') options.requireProductionGate2 = true;
  }

  return options;
};

export const main = (deps = {}) => {
  const {
    argv = process.argv.slice(2),
    consoleImpl = console,
    exit = process.exit,
    parseArgsFn = parseArgs,
    runCommand = run,
  } = deps;

  const options = parseArgsFn(argv);
  if (options.help) {
    consoleImpl.log(
      'Usage: node scripts/runRcRefreshSummaryStrict.mjs [--require-production-gate2]'
    );
    exit(0);
    return { status: 0, help: true };
  }

  const refreshCommand = options.requireProductionGate2
    ? 'ops:rc:gates:refresh:strict:prod'
    : 'ops:rc:gates:refresh:strict';
  const strictResult = runCommand('refresh strict', 'pnpm', ['run', refreshCommand]);
  const summaryResult = runCommand('summary', 'pnpm', ['run', 'ops:rc:gates:summary']);
  const exitCode = typeof strictResult.status === 'number' ? strictResult.status : 1;
  exit(exitCode);
  return {
    status: exitCode,
    refreshCommand,
    strictResult,
    summaryResult,
  };
};

if (isDirectRun()) {
  main();
}
