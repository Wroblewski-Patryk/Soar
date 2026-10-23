#!/usr/bin/env node

import { spawnSync } from 'node:child_process';

const result = spawnSync('git', ['status', '--porcelain=v1', '--untracked-files=no'], {
  encoding: 'utf8',
  windowsHide: true,
});

if (result.error || result.status !== 0) {
  process.stderr.write(`Could not inspect tracked source files: ${result.error?.message ?? result.stderr.trim()}\n`);
  process.exitCode = 1;
} else if (result.stdout) {
  process.stderr.write(`Tracked source files changed:\n${result.stdout}`);
  process.exitCode = 1;
}
