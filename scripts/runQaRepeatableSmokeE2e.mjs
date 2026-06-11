#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const defaultRawArgs = process.argv.slice(2);

export const readArgValue = (flag, args = defaultRawArgs) => {
  const index = args.indexOf(flag);
  if (index === -1) return '';
  return args[index + 1] ?? '';
};

export const hasFlag = (flag, args = defaultRawArgs) => args.includes(flag);

const printUsage = (stdout = process.stdout) => {
  stdout.write(
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
};

export const supportedChecks = {
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

export const runCheck = ({ label, command, args }, deps = {}) => {
  const {
    now = () => new Date(),
    nowMs = () => Date.now(),
    platform = process.platform,
    spawnSyncImpl = spawnSync,
  } = deps;
  const startedAt = now().toISOString();
  const startedMs = nowMs();
  const result = spawnSyncImpl(command, args, {
    shell: platform === 'win32',
    stdio: 'pipe',
    encoding: 'utf8',
  });
  const finishedAt = now().toISOString();
  const durationMs = nowMs() - startedMs;
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

export const main = async (deps = {}) => {
  const {
    argv = defaultRawArgs,
    cwd = process.cwd(),
    date = new Date(),
    stdout = process.stdout,
    stderr = process.stderr,
    exit = process.exit,
    mkdirFn = mkdir,
    writeFileFn = writeFile,
    runCheckFn = runCheck,
  } = deps;

  if (hasFlag('--help', argv) || hasFlag('-h', argv)) {
    printUsage(stdout);
    exit(0);
    return { status: 'HELP' };
  }

  const today = readArgValue('--today', argv) || date.toISOString().slice(0, 10);
  const checksArg = (readArgValue('--checks', argv) || 'web,api,backtests').trim();
  const selectedChecks = checksArg
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  const allowContinueOnFail = hasFlag('--stop-on-fail', argv) ? false : true;
  const artifactPrefix = (readArgValue('--artifact-prefix', argv) || 'qa-repeatable-smoke-e2e').trim();
  const artifactBaseName = `${artifactPrefix}-${today}`;
  const artifactDir = path.resolve(cwd, 'history', 'artifacts');
  const evidenceDir = path.resolve(cwd, 'history', 'evidence');

  const unknownChecks = selectedChecks.filter((check) => !supportedChecks[check]);
  if (unknownChecks.length > 0) {
    stderr.write(`[qa-repeatable] Unsupported checks: ${unknownChecks.join(', ')}\n`);
    exit(1);
    return { status: 'FAIL', reason: 'unsupported-checks', unknownChecks };
  }

  const results = [];
  for (const check of selectedChecks) {
    const checkConfig = supportedChecks[check];
    const result = runCheckFn(checkConfig);
    results.push(result);

    const badge = result.status === 'PASS' ? 'PASS' : 'FAIL';
    stdout.write(`[qa-repeatable] ${badge} ${result.label} (${result.durationMs}ms)\n`);

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

  await mkdirFn(artifactDir, { recursive: true });
  await mkdirFn(evidenceDir, { recursive: true });

  const jsonPath = path.join(artifactDir, `${artifactBaseName}.json`);
  await writeFileFn(jsonPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');

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
  await writeFileFn(evidencePath, `${markdownLines.join('\n')}\n`, 'utf8');

  stdout.write(`[qa-repeatable] Wrote artifact: ${path.relative(cwd, jsonPath)}\n`);
  stdout.write(`[qa-repeatable] Wrote evidence: ${path.relative(cwd, evidencePath)}\n`);

  if (failedCount > 0) {
    stderr.write(`[qa-repeatable] Failed checks: ${failedCount}\n`);
    exit(1);
    return { status: 'FAIL', summary, jsonPath, evidencePath };
  }

  stdout.write('[qa-repeatable] All selected checks passed\n');
  return { status: 'PASS', summary, jsonPath, evidencePath };
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
