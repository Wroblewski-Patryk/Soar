#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const operationsDir = path.resolve(process.cwd(), 'docs', 'operations');

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
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      return options;
    }
    if (arg === '--profile') options.profile = (args[index + 1] ?? options.profile).toLowerCase();
    if (arg === '--base-url') options.baseUrl = args[index + 1] ?? options.baseUrl;
    if (arg === '--auth-token') options.authToken = args[index + 1] ?? options.authToken;
    if (arg === '--auth-email') options.authEmail = args[index + 1] ?? options.authEmail;
    if (arg === '--auth-password') options.authPassword = args[index + 1] ?? options.authPassword;
    if (arg === '--ops-basic-user') options.opsBasicUser = args[index + 1] ?? options.opsBasicUser;
    if (arg === '--ops-basic-password') options.opsBasicPassword = args[index + 1] ?? options.opsBasicPassword;
    if (arg === '--ops-auth-header-name') options.opsAuthHeaderName = args[index + 1] ?? options.opsAuthHeaderName;
    if (arg === '--ops-auth-header-value') options.opsAuthHeaderValue = args[index + 1] ?? options.opsAuthHeaderValue;
  }

  return options;
};

const printUsage = () => {
  console.log(
    'Usage: node scripts/runRollbackProofEvidence.mjs [--profile <stage|prod>] --base-url <url> [--auth-token <token>] [--auth-email <email>] [--auth-password <password>] [--ops-basic-user <user>] [--ops-basic-password <pass>] [--ops-auth-header-name <name>] [--ops-auth-header-value <value>]'
  );
};

const nowStamp = () => new Date().toISOString().replace(/[:.]/g, '-');

const run = (command, args) =>
  spawnSync(command, args, {
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
    shell: process.platform === 'win32',
    env: process.env,
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
    throw new Error('Missing required --base-url for rollback proof execution.');
  }

  const commandArgs = ['scripts/evaluateRollbackGuard.mjs', '--base-url', options.baseUrl.trim()];
  if (options.authToken.trim()) commandArgs.push('--auth-token', options.authToken.trim());
  if (options.authEmail.trim()) commandArgs.push('--auth-email', options.authEmail.trim());
  if (options.authPassword.trim()) commandArgs.push('--auth-password', options.authPassword.trim());
  if (options.opsBasicUser.trim()) commandArgs.push('--ops-basic-user', options.opsBasicUser.trim());
  if (options.opsBasicPassword.trim()) commandArgs.push('--ops-basic-password', options.opsBasicPassword.trim());
  if (options.opsAuthHeaderName.trim()) commandArgs.push('--ops-auth-header-name', options.opsAuthHeaderName.trim());
  if (options.opsAuthHeaderValue.trim()) commandArgs.push('--ops-auth-header-value', options.opsAuthHeaderValue.trim());

  const startedAt = new Date().toISOString();
  const result = run('node', commandArgs);
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
  const stamp = nowStamp();
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
