#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const operationsDir = path.resolve(process.cwd(), 'history', 'operations');
const SECRET_CLI_FLAGS = new Set([
  '--auth-token',
  '--auth-password',
  '--ops-basic-password',
  '--ops-auth-header-value',
]);

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    profile: 'prod',
    baseUrl: '',
    authToken: process.env.ROLLBACK_GUARD_AUTH_TOKEN ?? '',
    authEmail: process.env.ROLLBACK_GUARD_AUTH_EMAIL ?? '',
    authPassword: process.env.ROLLBACK_GUARD_AUTH_PASSWORD ?? '',
    opsBasicUser: process.env.ROLLBACK_GUARD_OPS_BASIC_USER ?? '',
    opsBasicPassword: process.env.ROLLBACK_GUARD_OPS_BASIC_PASSWORD ?? '',
    opsAuthHeaderName: process.env.ROLLBACK_GUARD_OPS_AUTH_HEADER_NAME ?? '',
    opsAuthHeaderValue: process.env.ROLLBACK_GUARD_OPS_AUTH_HEADER_VALUE ?? '',
    today: '',
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
  }

  return options;
};

const printUsage = () => {
  console.log(
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

const nowStamp = () => new Date().toISOString().replace(/[:.]/g, '-');
const evidenceStamp = (today) => {
  const normalized = String(today ?? '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return `${normalized}T00-00-00-000Z`;
  return nowStamp();
};

const run = (command, args, envOverrides = {}) =>
  spawnSync(command, args, {
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
    shell: process.platform === 'win32',
    env: {
      ...process.env,
      ...envOverrides,
    },
  });

const renderMarkdown = (payload, jsonPath) => `# V1 Rollback Proof (${payload.profile})

- Generated at (UTC): ${payload.endedAt}
- Status: **${payload.status}**
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

const main = async () => {
  const options = parseArgs();
  if (options.help) {
    printUsage();
    process.exit(0);
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

  const startedAt = new Date().toISOString();
  const result = run('node', commandArgs, authEnv);
  const endedAt = new Date().toISOString();

  const stdout = String(result.stdout ?? '').trim();
  const stderr = String(result.stderr ?? '').trim();
  if (stdout) process.stdout.write(`${stdout}\n`);
  if (stderr) process.stderr.write(`${stderr}\n`);

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

  await mkdir(operationsDir, { recursive: true });
  const stamp = evidenceStamp(options.today);
  const jsonFile = path.join(operationsDir, `_artifacts-v1-rollback-proof-${options.profile}-${stamp}.json`);
  const mdFile = path.join(operationsDir, `v1-rollback-proof-${options.profile}-${stamp}.md`);

  const payload = {
    status,
    profile: options.profile,
    baseUrl: options.baseUrl.trim(),
    startedAt,
    endedAt,
    command: `node ${commandArgs.join(' ')}`,
    checks,
    decision,
    stdoutPreview: stdout.slice(0, 4000),
    stderrPreview: stderr.slice(0, 2000),
  };

  await writeFile(jsonFile, `${JSON.stringify(payload, null, 2)}\n`);
  await writeFile(mdFile, renderMarkdown(payload, path.relative(process.cwd(), jsonFile)));

  console.log(`Rollback proof JSON artifact: ${path.relative(process.cwd(), jsonFile)}`);
  console.log(`Rollback proof report: ${path.relative(process.cwd(), mdFile)}`);

  if (status !== 'PASS') {
    process.exit(1);
  }
};

main().catch((error) => {
  console.error(
    '[ops:deploy:rollback-proof] failed:',
    error instanceof Error ? error.message : String(error)
  );
  process.exit(1);
});
