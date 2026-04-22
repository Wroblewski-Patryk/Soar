#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const operationsDir = path.resolve(process.cwd(), 'docs', 'operations');

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    baseUrl: process.env.RELEASE_GATE_API_BASE_URL ?? 'https://stage-api.soar.luckysparrow.ch',
    webBaseUrl: process.env.RELEASE_GATE_WEB_BASE_URL ?? 'https://stage.soar.luckysparrow.ch',
    authToken: process.env.RELEASE_GATE_AUTH_TOKEN ?? '',
    authEmail: process.env.RELEASE_GATE_AUTH_EMAIL ?? '',
    authPassword: process.env.RELEASE_GATE_AUTH_PASSWORD ?? '',
    opsBasicUser: process.env.RELEASE_GATE_OPS_BASIC_USER ?? '',
    opsBasicPassword: process.env.RELEASE_GATE_OPS_BASIC_PASSWORD ?? '',
    opsAuthHeaderName: process.env.RELEASE_GATE_OPS_AUTH_HEADER_NAME ?? '',
    opsAuthHeaderValue: process.env.RELEASE_GATE_OPS_AUTH_HEADER_VALUE ?? '',
    dryRun: false,
    help: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      return options;
    }
    if (arg === '--base-url') options.baseUrl = args[index + 1] ?? options.baseUrl;
    if (arg === '--web-base-url') options.webBaseUrl = args[index + 1] ?? options.webBaseUrl;
    if (arg === '--auth-token') options.authToken = args[index + 1] ?? options.authToken;
    if (arg === '--auth-email') options.authEmail = args[index + 1] ?? options.authEmail;
    if (arg === '--auth-password') options.authPassword = args[index + 1] ?? options.authPassword;
    if (arg === '--ops-basic-user') options.opsBasicUser = args[index + 1] ?? options.opsBasicUser;
    if (arg === '--ops-basic-password') options.opsBasicPassword = args[index + 1] ?? options.opsBasicPassword;
    if (arg === '--ops-auth-header-name') options.opsAuthHeaderName = args[index + 1] ?? options.opsAuthHeaderName;
    if (arg === '--ops-auth-header-value') options.opsAuthHeaderValue = args[index + 1] ?? options.opsAuthHeaderValue;
    if (arg === '--dry-run') options.dryRun = true;
  }

  return options;
};

const printUsage = () => {
  console.log(
    'Usage: node scripts/runV1StageRehearsal.mjs [--base-url <url>] [--web-base-url <url>] [--auth-token <token>] [--auth-email <email>] [--auth-password <password>] [--ops-basic-user <user>] [--ops-basic-password <password>] [--ops-auth-header-name <name>] [--ops-auth-header-value <value>] [--dry-run]'
  );
};

const nowStamp = () => new Date().toISOString().replace(/[:.]/g, '-');

const renderMarkdown = (report, jsonPath) => `# V1 Stage Rehearsal Report

## Context
- Generated (UTC): ${report.generatedAt}
- Status: ${report.status}
- Dry run: ${report.dryRun ? 'yes' : 'no'}
- API base URL: ${report.baseUrl}
- Web base URL: ${report.webBaseUrl}
- Raw JSON: \`${jsonPath}\`

## Coverage
- release gate
- api readiness
- web baseline
- workers baseline
- runtime freshness
- rollback guard

## Command
\`${report.command}\`

## Result
- Exit code: ${report.exitCode}
- Gate report: ${report.gateReportPath ?? '-'}
- Gate JSON artifact: ${report.gateJsonPath ?? '-'}
- Blockers:
${report.blockers.length > 0 ? report.blockers.map((item) => `  - ${item}`).join('\n') : '  - none'}
`;

const main = async () => {
  const options = parseArgs();
  if (options.help) {
    printUsage();
    process.exit(0);
  }

  const stamp = nowStamp();
  const args = [
    'scripts/runV1ReleaseGate.mjs',
    '--environment',
    'stage',
    '--base-url',
    options.baseUrl,
    '--web-base-url',
    options.webBaseUrl,
    '--skip-local-quality',
    '--artifact-stamp',
    stamp,
  ];
  if (options.authToken.trim()) args.push('--auth-token', options.authToken.trim());
  if (options.authEmail.trim()) args.push('--auth-email', options.authEmail.trim());
  if (options.authPassword.trim()) args.push('--auth-password', options.authPassword.trim());
  if (options.opsBasicUser.trim()) args.push('--ops-basic-user', options.opsBasicUser.trim());
  if (options.opsBasicPassword.trim()) args.push('--ops-basic-password', options.opsBasicPassword.trim());
  if (options.opsAuthHeaderName.trim()) args.push('--ops-auth-header-name', options.opsAuthHeaderName.trim());
  if (options.opsAuthHeaderValue.trim()) args.push('--ops-auth-header-value', options.opsAuthHeaderValue.trim());
  if (options.dryRun) args.push('--dry-run');

  const result = spawnSync('node', args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: process.env,
  });

  const gateJsonPath = path.join('docs', 'operations', `_artifacts-v1-release-gate-stage-${stamp}.json`);
  const gateReportPath = path.join('docs', 'operations', `v1-release-gate-stage-${stamp}.md`);
  const exitCode = typeof result.status === 'number' ? result.status : 1;
  const blockers = [];
  let status = exitCode === 0 ? 'PASS' : 'FAILED';
  if (options.dryRun) {
    status = 'BLOCKED';
    blockers.push('stage credentials and target environment were not exercised in this local dry-run');
    blockers.push('fresh stage evidence exists only as rehearsal planning, not as remote execution proof');
  } else if (exitCode !== 0) {
    blockers.push('stage release gate exited non-zero');
  }

  const report = {
    generatedAt: new Date().toISOString(),
    status,
    dryRun: options.dryRun,
    baseUrl: options.baseUrl,
    webBaseUrl: options.webBaseUrl,
    command: ['node', ...args].join(' '),
    exitCode,
    gateJsonPath,
    gateReportPath,
    blockers,
  };

  await mkdir(operationsDir, { recursive: true });
  const jsonFile = path.join(operationsDir, `_artifacts-v1-stage-rehearsal-${stamp}.json`);
  const mdFile = path.join(operationsDir, `v1-stage-rehearsal-${stamp}.md`);
  await writeFile(jsonFile, JSON.stringify(report, null, 2));
  await writeFile(mdFile, renderMarkdown(report, path.relative(process.cwd(), jsonFile)));

  console.log(`[ops:release:v1:stage-rehearsal] JSON artifact: ${path.relative(process.cwd(), jsonFile)}`);
  console.log(`[ops:release:v1:stage-rehearsal] report: ${path.relative(process.cwd(), mdFile)}`);

  process.exit(options.dryRun ? 0 : exitCode);
};

main().catch((error) => {
  console.error(
    '[ops:release:v1:stage-rehearsal] failed:',
    error instanceof Error ? error.message : String(error)
  );
  process.exit(1);
});
