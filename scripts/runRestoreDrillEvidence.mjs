#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const operationsDir = path.resolve(process.cwd(), 'history', 'operations');
const evidenceDir = path.resolve(process.cwd(), 'history', 'evidence');
const artifactsDir = path.resolve(process.cwd(), 'history', 'artifacts');

const isDirectRun = () => process.argv[1] === fileURLToPath(import.meta.url);

export const parseArgs = (argv = process.argv.slice(2)) => {
  const args = argv;
  const options = {
    profile: 'local',
    passthrough: [],
    today: '',
    expectedSha: '',
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      return options;
    }
    if (arg === '--profile') {
      options.profile = (args[index + 1] ?? options.profile).toLowerCase();
      index += 1;
      continue;
    }
    if (arg === '--today') {
      options.today = args[index + 1] ?? options.today;
      index += 1;
      continue;
    }
    if (arg === '--expected-sha') {
      options.expectedSha = args[index + 1] ?? options.expectedSha;
      index += 1;
      continue;
    }
    options.passthrough.push(arg);
  }

  return options;
};

export const nowStamp = (date = new Date()) => date.toISOString().replace(/[:.]/g, '-');
export const evidenceStamp = (today, deps = {}) => {
  const { nowStampFn = nowStamp } = deps;
  const normalized = String(today ?? '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return `${normalized}T00-00-00-000Z`;
  return nowStampFn();
};

export const readLatestByPrefix = async (prefix, ext, deps = {}) => {
  const {
    operationsDirPath = operationsDir,
    readdirImpl = readdir,
  } = deps;

  const files = (await readdirImpl(operationsDirPath))
    .filter((name) => name.startsWith(prefix) && name.endsWith(ext))
    .sort((a, b) => b.localeCompare(a));
  if (files.length === 0) return null;
  return path.join(operationsDirPath, files[0]);
};

export const run = (command, args, deps = {}) => {
  const {
    env = process.env,
    platform = process.platform,
    spawnSyncImpl = spawnSync,
  } = deps;

  return spawnSyncImpl(command, args, {
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
    shell: platform === 'win32',
    env,
  });
};

export const printUsage = (deps = {}) => {
  const { consoleImpl = console } = deps;
  consoleImpl.log(
    'Usage: node scripts/runRestoreDrillEvidence.mjs [--profile <local|stage|prod>] [--today <yyyy-mm-dd>] [-- <extra backup-verify args>]'
  );
};

export const main = async (deps = {}) => {
  const {
    artifactsDirPath = artifactsDir,
    argv = process.argv.slice(2),
    consoleImpl = { ...console, stdout: process.stdout, stderr: process.stderr },
    cwd = process.cwd(),
    endedAtIso = () => new Date().toISOString(),
    env = process.env,
    evidenceDirPath = evidenceDir,
    exit = process.exit,
    mkdirImpl = mkdir,
    operationsDirPath = operationsDir,
    parseArgsFn = parseArgs,
    readFileImpl = readFile,
    readLatestByPrefixFn = readLatestByPrefix,
    runCommand = run,
    startedAtIso = () => new Date().toISOString(),
    writeFileImpl = writeFile,
  } = deps;

  const options = parseArgsFn(argv);
  if (options.help) {
    printUsage({ consoleImpl });
    exit(0);
    return { status: 0, help: true };
  }

  await mkdirImpl(operationsDirPath, { recursive: true });
  await mkdirImpl(evidenceDirPath, { recursive: true });
  await mkdirImpl(artifactsDirPath, { recursive: true });

  const commandArgs = [
    'scripts/runBackupVerificationProfile.mjs',
    '--profile',
    options.profile,
    ...options.passthrough,
  ];
  const startedAt = startedAtIso();
  const result = runCommand('node', commandArgs, { env });
  const endedAt = endedAtIso();

  if (result.stdout) consoleImpl.stdout?.write?.(result.stdout);
  if (result.stderr) consoleImpl.stderr?.write?.(result.stderr);

  const latestRawArtifact = await readLatestByPrefixFn('_artifacts-db-restore-check-', '.txt', {
    operationsDirPath,
  });
  const latestReportArtifact = await readLatestByPrefixFn('v1-db-restore-check-', '.md', {
    operationsDirPath,
  });
  const latestRawContent = latestRawArtifact ? await readFileImpl(latestRawArtifact, 'utf8') : '';
  const latestResultMatch = latestRawContent.match(/RESULT:\s*(PASS|FAIL)/i);
  const latestResult = latestResultMatch?.[1]?.toUpperCase() ?? 'UNKNOWN';

  const checks = {
    commandExitCodeZero: result.status === 0,
    rawArtifactPresent: Boolean(latestRawArtifact),
    markdownReportPresent: Boolean(latestReportArtifact),
    backupRestoreResultPass: latestResult === 'PASS',
  };
  const status = Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL';

  const stamp = evidenceStamp(options.today);
  const jsonOutput = path.join(
    artifactsDirPath,
    `_artifacts-restore-drill-${options.profile}-${stamp}.json`
  );
  const mdOutput = path.join(evidenceDirPath, `v1-restore-drill-${options.profile}-${stamp}.md`);

  const payload = {
    status,
    profile: options.profile,
    expectedSha: options.expectedSha.trim() || null,
    startedAt,
    endedAt,
    command: `node ${commandArgs.join(' ')}`,
    checks,
    backupRestore: {
      result: latestResult,
      rawArtifact: latestRawArtifact ? path.relative(cwd, latestRawArtifact) : null,
      reportArtifact: latestReportArtifact ? path.relative(cwd, latestReportArtifact) : null,
    },
    stdoutPreview: (result.stdout ?? '').trim().slice(0, 4000),
    stderrPreview: (result.stderr ?? '').trim().slice(0, 2000),
  };

  await writeFileImpl(jsonOutput, `${JSON.stringify(payload, null, 2)}\n`);
  const markdown = `# V1 Restore Drill Evidence (${options.profile})

- Generated at (UTC): ${endedAt}
- Status: **${status}**
- Expected SHA: \`${options.expectedSha.trim() || 'not provided'}\`
- Command: \`${payload.command}\`
- Raw artifact: \`${payload.backupRestore.rawArtifact ?? 'n/a'}\`
- Report artifact: \`${payload.backupRestore.reportArtifact ?? 'n/a'}\`

## Contract Checks
- commandExitCodeZero: ${checks.commandExitCodeZero ? 'PASS' : 'FAIL'}
- rawArtifactPresent: ${checks.rawArtifactPresent ? 'PASS' : 'FAIL'}
- markdownReportPresent: ${checks.markdownReportPresent ? 'PASS' : 'FAIL'}
- backupRestoreResultPass: ${checks.backupRestoreResultPass ? 'PASS' : 'FAIL'}

## Output Artifacts
- JSON: \`${path.relative(cwd, jsonOutput)}\`
- Markdown: \`${path.relative(cwd, mdOutput)}\`
`;
  await writeFileImpl(mdOutput, markdown);

  consoleImpl.log(`Restore drill JSON artifact: ${path.relative(cwd, jsonOutput)}`);
  consoleImpl.log(`Restore drill report: ${path.relative(cwd, mdOutput)}`);
  if (status !== 'PASS') {
    exit(1);
  }
  return { status: status === 'PASS' ? 0 : 1, payload, jsonOutput, mdOutput };
};

if (isDirectRun()) {
  main().catch((error) => {
    console.error(
      '[ops:db:restore-drill] failed:',
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  });
}
