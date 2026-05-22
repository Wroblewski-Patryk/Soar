#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const operationsDir = path.resolve(process.cwd(), 'docs', 'operations');
const SECRET_CLI_FLAGS = new Set([
  '--auth-token',
  '--auth-password',
  '--ops-basic-password',
  '--ops-auth-header-value',
]);

export const parseArgs = (argv = process.argv.slice(2), env = process.env) => {
  const args = argv;
  const options = {
    baseUrl: env.RELEASE_GATE_API_BASE_URL ?? 'https://stage-api.soar.luckysparrow.ch',
    webBaseUrl: env.RELEASE_GATE_WEB_BASE_URL ?? 'https://stage.soar.luckysparrow.ch',
    authToken: env.RELEASE_GATE_AUTH_TOKEN ?? '',
    authEmail: env.RELEASE_GATE_AUTH_EMAIL ?? '',
    authPassword: env.RELEASE_GATE_AUTH_PASSWORD ?? '',
    opsBasicUser: env.RELEASE_GATE_OPS_BASIC_USER ?? '',
    opsBasicPassword: env.RELEASE_GATE_OPS_BASIC_PASSWORD ?? '',
    opsAuthHeaderName: env.RELEASE_GATE_OPS_AUTH_HEADER_NAME ?? '',
    opsAuthHeaderValue: env.RELEASE_GATE_OPS_AUTH_HEADER_VALUE ?? '',
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
    if (SECRET_CLI_FLAGS.has(arg)) {
      throw new Error(
        `${arg} is secret-bearing and must be provided through RELEASE_GATE_* environment variables`
      );
    }
    if (arg === '--auth-email') options.authEmail = args[index + 1] ?? options.authEmail;
    if (arg === '--ops-basic-user') options.opsBasicUser = args[index + 1] ?? options.opsBasicUser;
    if (arg === '--ops-auth-header-name') options.opsAuthHeaderName = args[index + 1] ?? options.opsAuthHeaderName;
    if (arg === '--dry-run') options.dryRun = true;
  }

  return options;
};

const printUsage = () => {
  console.log(
    'Usage: node scripts/runV1StageRehearsal.mjs [--base-url <url>] [--web-base-url <url>] [--auth-email <email>] [--ops-basic-user <user>] [--ops-auth-header-name <name>] [--dry-run]\n\nSecret-bearing values must be provided through RELEASE_GATE_AUTH_TOKEN, RELEASE_GATE_AUTH_PASSWORD, RELEASE_GATE_OPS_BASIC_PASSWORD, and RELEASE_GATE_OPS_AUTH_HEADER_VALUE.'
  );
};

const nowStamp = () => new Date().toISOString().replace(/[:.]/g, '-');

export const buildReleaseGateInvocation = (options) => {
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
    options.stamp,
  ];
  if (options.dryRun) args.push('--dry-run');

  const childEnv = {
    ...process.env,
    RELEASE_GATE_API_BASE_URL: options.baseUrl,
    RELEASE_GATE_WEB_BASE_URL: options.webBaseUrl,
  };
  const envMappings = [
    ['RELEASE_GATE_AUTH_TOKEN', options.authToken],
    ['RELEASE_GATE_AUTH_EMAIL', options.authEmail],
    ['RELEASE_GATE_AUTH_PASSWORD', options.authPassword],
    ['RELEASE_GATE_OPS_BASIC_USER', options.opsBasicUser],
    ['RELEASE_GATE_OPS_BASIC_PASSWORD', options.opsBasicPassword],
    ['RELEASE_GATE_OPS_AUTH_HEADER_NAME', options.opsAuthHeaderName],
    ['RELEASE_GATE_OPS_AUTH_HEADER_VALUE', options.opsAuthHeaderValue],
  ];
  for (const [key, value] of envMappings) {
    const normalized = String(value ?? '').trim();
    if (normalized) childEnv[key] = normalized;
  }

  return {
    args,
    childEnv,
    command: ['node', ...args].join(' '),
  };
};

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
  const invocation = buildReleaseGateInvocation({ ...options, stamp });

  const result = spawnSync('node', invocation.args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: invocation.childEnv,
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
    command: invocation.command,
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

const isEntrypoint = () => {
  const entry = process.argv[1];
  if (!entry) return false;
  return path.resolve(entry) === path.resolve(fileURLToPath(import.meta.url));
};

if (isEntrypoint()) {
  main().catch((error) => {
    console.error(
      '[ops:release:v1:stage-rehearsal] failed:',
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  });
}
