#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rawArgs = process.argv.slice(2);

const readArgValue = (flag) => {
  const index = rawArgs.indexOf(flag);
  if (index === -1) return '';
  return rawArgs[index + 1] ?? '';
};

const hasFlag = (flag) => rawArgs.includes(flag);

if (hasFlag('--help') || hasFlag('-h')) {
  process.stdout.write(
    [
      'Usage: node scripts/runQaRepeatableSmokeE2e.mjs [options]',
      '',
      'Options:',
      '  --checks <list>       Comma list: web,api,backtests (default: web,api,backtests)',
      '  --artifact-prefix <x> Prefix for history artifacts (default: qa-repeatable-smoke-e2e)',
      '  --today <yyyy-mm-dd>  Evidence date override (default: current date)',
      '  --continue-on-fail    Continue all checks and report all failures (default: true)',
      '  --stop-on-fail        Stop at first failure',
      '  --help                Show this message',
    ].join('\n') + '\n',
  );
  process.exit(0);
}

const today = readArgValue('--today') || new Date().toISOString().slice(0, 10);
const checksArg = (readArgValue('--checks') || 'web,api,backtests').trim();
const selectedChecks = checksArg
  .split(',')
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean);

const allowContinueOnFail = hasFlag('--stop-on-fail') ? false : true;
const artifactPrefix = (readArgValue('--artifact-prefix') || 'qa-repeatable-smoke-e2e').trim();
const artifactBaseName = `${artifactPrefix}-${today}`;
const artifactDir = path.resolve(process.cwd(), 'history', 'artifacts');
const evidenceDir = path.resolve(process.cwd(), 'history', 'evidence');

const supportedChecks = {
  web: {
    label: 'Web smoke pack',
    command: 'pnpm',
    args: ['run', 'test:go-live:web'],
  },
  api: {
    label: 'API smoke pack',
    command: 'pnpm',
    args: ['run', 'test:go-live:api'],
  },
  backtests: {
    label: 'Focused backtests e2e',
    command: 'pnpm',
    args: ['--filter', 'api', 'exec', 'vitest', 'run', 'src/modules/backtests/backtests.e2e.test.ts', '--run'],
  },
};

const unknownChecks = selectedChecks.filter((check) => !supportedChecks[check]);
if (unknownChecks.length > 0) {
  process.stderr.write(`[qa-repeatable] Unsupported checks: ${unknownChecks.join(', ')}\n`);
  process.exit(1);
}

const runCheck = ({ label, command, args }) => {
  const startedAt = new Date().toISOString();
  const startedMs = Date.now();
  const result = spawnSync(command, args, {
    shell: process.platform === 'win32',
    stdio: 'pipe',
    encoding: 'utf8',
  });
  const finishedAt = new Date().toISOString();
  const durationMs = Date.now() - startedMs;
  const exitCode = typeof result.status === 'number' ? result.status : 1;

  return {
    label,
    command: [command, ...args].join(' '),
    startedAt,
    finishedAt,
    durationMs,
    exitCode,
    status: exitCode === 0 ? 'PASS' : 'FAIL',
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
};

const results = [];
for (const check of selectedChecks) {
  const checkConfig = supportedChecks[check];
  const result = runCheck(checkConfig);
  results.push(result);

  const badge = result.status === 'PASS' ? 'PASS' : 'FAIL';
  process.stdout.write(`[qa-repeatable] ${badge} ${result.label} (${result.durationMs}ms)\n`);

  if (result.status === 'FAIL' && !allowContinueOnFail) {
    break;
  }
}

const failedCount = results.filter((row) => row.status === 'FAIL').length;
const summary = {
  issue: 'LUC-43',
  date: today,
  artifactName: artifactBaseName,
  selectedChecks,
  continueOnFail: allowContinueOnFail,
  totals: {
    checks: results.length,
    passed: results.filter((row) => row.status === 'PASS').length,
    failed: failedCount,
  },
  results,
};

await mkdir(artifactDir, { recursive: true });
await mkdir(evidenceDir, { recursive: true });

const jsonPath = path.join(artifactDir, `${artifactBaseName}.json`);
await writeFile(jsonPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');

const markdownLines = [
  `# LUC-43 Repeatable Smoke/E2E Evidence (${today})`,
  '',
  `- Command: \`pnpm run qa:smoke-e2e:repeatable -- --checks ${selectedChecks.join(',')}\``,
  `- Result: ${failedCount === 0 ? 'PASS' : 'FAIL'}`,
  `- JSON artifact: \`history/artifacts/${artifactBaseName}.json\``,
  '',
  '## Check Summary',
  '',
  '| Check | Status | Duration ms | Command |',
  '| --- | --- | ---: | --- |',
  ...results.map((row) => `| ${row.label} | ${row.status} | ${row.durationMs} | \`${row.command}\` |`),
  '',
  '## Failure Notes',
  failedCount === 0 ? '- none' : '- See JSON artifact stderr/stdout fields for exact failure output.',
];

const evidencePath = path.join(evidenceDir, `${artifactBaseName}.md`);
await writeFile(evidencePath, `${markdownLines.join('\n')}\n`, 'utf8');

process.stdout.write(`[qa-repeatable] Wrote artifact: ${path.relative(process.cwd(), jsonPath)}\n`);
process.stdout.write(`[qa-repeatable] Wrote evidence: ${path.relative(process.cwd(), evidencePath)}\n`);

if (failedCount > 0) {
  process.stderr.write(`[qa-repeatable] Failed checks: ${failedCount}\n`);
  process.exit(1);
}

process.stdout.write('[qa-repeatable] All selected checks passed\n');
