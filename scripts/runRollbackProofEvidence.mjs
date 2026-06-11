#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const evidenceDir = path.resolve(process.cwd(), 'history', 'evidence');
const artifactsDir = path.resolve(process.cwd(), 'history', 'artifacts');
const SECRET_CLI_FLAGS = new Set([
  '--auth-token',
  '--auth-password',
  '--ops-basic-password',
  '--ops-auth-header-value',
]);

const isDirectRun = () => process.argv[1] === fileURLToPath(import.meta.url);

export const parseArgs = (argv = process.argv.slice(2), env = process.env) => {
  const args = argv;
  const options = {
    profile: 'prod',
    baseUrl: env.ROLLBACK_GUARD_API_BASE_URL ?? '',
    authToken: env.ROLLBACK_GUARD_AUTH_TOKEN ?? '',
    authEmail: env.ROLLBACK_GUARD_AUTH_EMAIL ?? '',
    authPassword: env.ROLLBACK_GUARD_AUTH_PASSWORD ?? '',
    opsBasicUser: env.ROLLBACK_GUARD_OPS_BASIC_USER ?? '',
    opsBasicPassword: env.ROLLBACK_GUARD_OPS_BASIC_PASSWORD ?? '',
    opsAuthHeaderName: env.ROLLBACK_GUARD_OPS_AUTH_HEADER_NAME ?? '',
    opsAuthHeaderValue: env.ROLLBACK_GUARD_OPS_AUTH_HEADER_VALUE ?? '',
    today: '',
    expectedSha: '',
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      return options;
    }
    if (SECRET_CLI_FLAGS.has(arg)) {
      throw new Error(`${arg} is secret-bearing and must be provided through ROLLBACK_GUARD_* environment variables`);
    }
    if (arg === '--profile') options.profile = (args[index + 1] ?? options.profile).toLowerCase();
    if (arg === '--base-url') options.baseUrl = args[index + 1] ?? options.baseUrl;
    if (arg === '--auth-email') options.authEmail = args[index + 1] ?? options.authEmail;
    if (arg === '--ops-basic-user') options.opsBasicUser = args[index + 1] ?? options.opsBasicUser;
    if (arg === '--ops-auth-header-name') options.opsAuthHeaderName = args[index + 1] ?? options.opsAuthHeaderName;
    if (arg === '--today') options.today = args[index + 1] ?? options.today;
    if (arg === '--expected-sha') options.expectedSha = args[index + 1] ?? options.expectedSha;
  }

  return options;
};

export const printUsage = (deps = {}) => {
  const { consoleImpl = console } = deps;
  consoleImpl.log(
    [
      'Usage: node scripts/runRollbackProofEvidence.mjs [--profile <stage|prod>] --base-url <url> [--auth-email <email>] [--ops-basic-user <user>] [--ops-auth-header-name <name>] [--today <yyyy-mm-dd>]',
      '',
      'Env:',
      '  ROLLBACK_GUARD_API_BASE_URL',
      '  ROLLBACK_GUARD_AUTH_TOKEN, or ROLLBACK_GUARD_AUTH_EMAIL plus ROLLBACK_GUARD_AUTH_PASSWORD',
      '  ROLLBACK_GUARD_OPS_BASIC_USER plus ROLLBACK_GUARD_OPS_BASIC_PASSWORD',
      '  ROLLBACK_GUARD_OPS_AUTH_HEADER_NAME plus ROLLBACK_GUARD_OPS_AUTH_HEADER_VALUE',
      '',
      'Secret-bearing values must be provided through ROLLBACK_GUARD_* environment variables.',
    ].join('\n')
  );
};

export const nowStamp = (date = new Date()) => date.toISOString().replace(/[:.]/g, '-');
export const evidenceStamp = (today, deps = {}) => {
  const { nowStampFn = nowStamp } = deps;
  const normalized = String(today ?? '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return `${normalized}T00-00-00-000Z`;
  return nowStampFn();
};

export const run = (command, args, deps = {}) => {
  const {
    env = process.env,
    envOverrides = {},
    platform = process.platform,
    spawnSyncImpl = spawnSync,
  } = deps;

  return spawnSyncImpl(command, args, {
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
    shell: platform === 'win32',
    env: {
      ...env,
      ...envOverrides,
    },
  });
};

export const renderMarkdown = (payload, jsonPath) => `# V1 Rollback Proof (${payload.profile})

- Generated at (UTC): ${payload.endedAt}
- Status: **${payload.status}**
- Expected SHA: \`${payload.expectedSha || 'not provided'}\`
- Command: \`${payload.command}\`
- Base URL: \`${payload.baseUrl}\`
- Rollback playbook: \`docs/operations/deployment-rollback-playbook.md\`
- Raw JSON: \`${jsonPath}\`

## Contract Checks
- commandExitCodeZero: ${payload.checks.commandExitCodeZero ? 'PASS' : 'FAIL'}
- shouldRollbackFalse: ${payload.checks.shouldRollbackFalse ? 'PASS' : 'FAIL'}
- noCriticalReasons: ${payload.checks.noCriticalReasons ? 'PASS' : 'FAIL'}
- freshnessStatusPass: ${payload.checks.freshnessStatusPass ? 'PASS' : 'FAIL'}
- alertsClear: ${payload.checks.alertsClear ? 'PASS' : 'FAIL'}

## Decision Summary
- shouldRollback: ${payload.decision?.shouldRollback ? 'true' : 'false'}
- reasons: ${payload.decision?.reasons?.length ? payload.decision.reasons.join(', ') : 'none'}
- freshness status: ${payload.decision?.freshness?.status ?? 'n/a'}
- alerts count: ${Array.isArray(payload.decision?.alerts) ? payload.decision.alerts.length : 0}
`;

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
    parseArgsFn = parseArgs,
    renderMarkdownFn = renderMarkdown,
    runCommand = run,
    startedAtIso = () => new Date().toISOString(),
    writeFileImpl = writeFile,
  } = deps;

  const options = parseArgsFn(argv, env);
  if (options.help) {
    printUsage({ consoleImpl });
    exit(0);
    return { status: 0, help: true };
  }

  if (!options.baseUrl.trim()) {
    throw new Error(
      'Missing required --base-url for rollback proof execution. Set --base-url or ROLLBACK_GUARD_API_BASE_URL.'
    );
  }

  const commandArgs = ['scripts/evaluateRollbackGuard.mjs', '--base-url', options.baseUrl.trim()];
  const authEnv = {
    ROLLBACK_GUARD_AUTH_TOKEN: options.authToken.trim(),
    ROLLBACK_GUARD_AUTH_EMAIL: options.authEmail.trim(),
    ROLLBACK_GUARD_AUTH_PASSWORD: options.authPassword.trim(),
    ROLLBACK_GUARD_OPS_BASIC_USER: options.opsBasicUser.trim(),
    ROLLBACK_GUARD_OPS_BASIC_PASSWORD: options.opsBasicPassword.trim(),
    ROLLBACK_GUARD_OPS_AUTH_HEADER_NAME: options.opsAuthHeaderName.trim(),
    ROLLBACK_GUARD_OPS_AUTH_HEADER_VALUE: options.opsAuthHeaderValue.trim(),
  };

  const startedAt = startedAtIso();
  const result = runCommand('node', commandArgs, { env, envOverrides: authEnv });
  const endedAt = endedAtIso();

  const stdout = String(result.stdout ?? '').trim();
  const stderr = String(result.stderr ?? '').trim();
  if (stdout) consoleImpl.stdout?.write?.(`${stdout}\n`);
  if (stderr) consoleImpl.stderr?.write?.(`${stderr}\n`);

  let decision = null;
  try {
    decision = JSON.parse(stdout);
  } catch {
    decision = null;
  }

  const checks = {
    commandExitCodeZero: result.status === 0,
    shouldRollbackFalse: decision?.shouldRollback === false,
    noCriticalReasons: Array.isArray(decision?.reasons) ? decision.reasons.length === 0 : false,
    freshnessStatusPass: String(decision?.freshness?.status ?? '').toUpperCase() === 'PASS',
    alertsClear: Array.isArray(decision?.alerts) ? decision.alerts.length === 0 : false,
  };
  const status = Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL';

  await mkdirImpl(evidenceDirPath, { recursive: true });
  await mkdirImpl(artifactsDirPath, { recursive: true });
  const stamp = evidenceStamp(options.today);
  const jsonFile = path.join(artifactsDirPath, `_artifacts-v1-rollback-proof-${options.profile}-${stamp}.json`);
  const mdFile = path.join(evidenceDirPath, `v1-rollback-proof-${options.profile}-${stamp}.md`);

  const payload = {
    status,
    profile: options.profile,
    expectedSha: options.expectedSha.trim() || null,
    baseUrl: options.baseUrl.trim(),
    startedAt,
    endedAt,
    command: `node ${commandArgs.join(' ')}`,
    checks,
    decision,
    stdoutPreview: stdout.slice(0, 4000),
    stderrPreview: stderr.slice(0, 2000),
  };

  await writeFileImpl(jsonFile, `${JSON.stringify(payload, null, 2)}\n`);
  await writeFileImpl(mdFile, renderMarkdownFn(payload, path.relative(cwd, jsonFile)));

  consoleImpl.log(`Rollback proof JSON artifact: ${path.relative(cwd, jsonFile)}`);
  consoleImpl.log(`Rollback proof report: ${path.relative(cwd, mdFile)}`);

  if (status !== 'PASS') {
    exit(1);
  }
  return { status: status === 'PASS' ? 0 : 1, payload, jsonFile, mdFile };
};

if (isDirectRun()) {
  main().catch((error) => {
    console.error(
      '[ops:deploy:rollback-proof] failed:',
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  });
}
