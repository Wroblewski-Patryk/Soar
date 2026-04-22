#!/usr/bin/env node

import { spawnSync } from 'node:child_process';

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    baseUrl: process.env.RELEASE_GATE_API_BASE_URL ?? 'http://localhost:3001',
    authToken: process.env.RELEASE_GATE_AUTH_TOKEN ?? '',
    authEmail: process.env.RELEASE_GATE_AUTH_EMAIL ?? '',
    authPassword: process.env.RELEASE_GATE_AUTH_PASSWORD ?? '',
    opsBasicUser: process.env.RELEASE_GATE_OPS_BASIC_USER ?? '',
    opsBasicPassword: process.env.RELEASE_GATE_OPS_BASIC_PASSWORD ?? '',
    opsAuthHeaderName: process.env.RELEASE_GATE_OPS_AUTH_HEADER_NAME ?? '',
    opsAuthHeaderValue: process.env.RELEASE_GATE_OPS_AUTH_HEADER_VALUE ?? '',
    skipLocalQuality: false,
    skipGoLiveSmoke: false,
    skipDeploySmoke: false,
    skipRuntimeFreshness: false,
    skipRollbackGuard: false,
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
    if (arg === '--auth-token') options.authToken = args[index + 1] ?? options.authToken;
    if (arg === '--auth-email') options.authEmail = args[index + 1] ?? options.authEmail;
    if (arg === '--auth-password') options.authPassword = args[index + 1] ?? options.authPassword;
    if (arg === '--ops-basic-user') options.opsBasicUser = args[index + 1] ?? options.opsBasicUser;
    if (arg === '--ops-basic-password') options.opsBasicPassword = args[index + 1] ?? options.opsBasicPassword;
    if (arg === '--ops-auth-header-name') {
      options.opsAuthHeaderName = args[index + 1] ?? options.opsAuthHeaderName;
    }
    if (arg === '--ops-auth-header-value') {
      options.opsAuthHeaderValue = args[index + 1] ?? options.opsAuthHeaderValue;
    }
    if (arg === '--skip-local-quality') options.skipLocalQuality = true;
    if (arg === '--skip-go-live-smoke') options.skipGoLiveSmoke = true;
    if (arg === '--skip-deploy-smoke') options.skipDeploySmoke = true;
    if (arg === '--skip-runtime-freshness') options.skipRuntimeFreshness = true;
    if (arg === '--skip-rollback-guard') options.skipRollbackGuard = true;
    if (arg === '--dry-run') options.dryRun = true;
  }

  return options;
};

const printUsage = () => {
  console.log(
    [
      'Usage: node scripts/runV1ReleaseGate.mjs [options]',
      '',
      'Options:',
      '  --base-url <url>                 Target API base URL for deploy/runtime gates',
      '  --auth-token <token>            Admin JWT for protected OPS endpoints',
      '  --auth-email <email>            Admin email for automatic token fetch',
      '  --auth-password <password>      Admin password for automatic token fetch',
      '  --ops-basic-user <user>         Optional extra OPS basic-auth user',
      '  --ops-basic-password <pass>     Optional extra OPS basic-auth password',
      '  --ops-auth-header-name <name>   Optional extra OPS header name',
      '  --ops-auth-header-value <val>   Optional extra OPS header value',
      '  --skip-local-quality            Skip repository-level quality/type/build/go-live checks',
      '  --skip-go-live-smoke            Skip `pnpm run test:go-live:smoke` inside local-quality block',
      '  --skip-deploy-smoke             Skip post-deploy smoke endpoint checks',
      '  --skip-runtime-freshness        Skip runtime freshness gate',
      '  --skip-rollback-guard           Skip rollback-guard gate',
      '  --dry-run                       Print planned commands without executing them',
      '  --help                          Show this message',
    ].join('\n')
  );
};

const buildAuthArgs = (options) => {
  const args = [];
  if (options.authToken.trim()) args.push('--auth-token', options.authToken.trim());
  if (options.authEmail.trim()) args.push('--auth-email', options.authEmail.trim());
  if (options.authPassword.trim()) args.push('--auth-password', options.authPassword.trim());
  if (options.opsBasicUser.trim()) args.push('--ops-basic-user', options.opsBasicUser.trim());
  if (options.opsBasicPassword.trim()) args.push('--ops-basic-password', options.opsBasicPassword.trim());
  if (options.opsAuthHeaderName.trim()) args.push('--ops-auth-header-name', options.opsAuthHeaderName.trim());
  if (options.opsAuthHeaderValue.trim()) args.push('--ops-auth-header-value', options.opsAuthHeaderValue.trim());
  return args;
};

const buildSteps = (options) => {
  const authArgs = buildAuthArgs(options);
  const steps = [];

  if (!options.skipLocalQuality) {
    steps.push({ label: 'repository guardrails', command: 'pnpm', args: ['run', 'quality:guardrails'] });
    steps.push({ label: 'repository typecheck', command: 'pnpm', args: ['run', 'typecheck'] });
    steps.push({ label: 'repository build', command: 'pnpm', args: ['run', 'build'] });
    if (!options.skipGoLiveSmoke) {
      steps.push({ label: 'go-live smoke pack', command: 'pnpm', args: ['run', 'test:go-live:smoke'] });
    }
  }

  if (!options.skipDeploySmoke) {
    steps.push({
      label: 'post-deploy smoke gate',
      command: 'pnpm',
      args: ['run', 'ops:deploy:smoke', '--', '--base-url', options.baseUrl, ...authArgs],
    });
  }

  if (!options.skipRuntimeFreshness) {
    steps.push({
      label: 'runtime freshness gate',
      command: 'pnpm',
      args: ['run', 'ops:deploy:runtime-freshness', '--', '--base-url', options.baseUrl, ...authArgs],
    });
  }

  if (!options.skipRollbackGuard) {
    steps.push({
      label: 'rollback guard gate',
      command: 'pnpm',
      args: ['run', 'ops:deploy:rollback-guard', '--', '--base-url', options.baseUrl, ...authArgs],
    });
  }

  return steps;
};

const formatCommand = (command, args) =>
  [command, ...args.map((value) => (/\s/.test(value) ? `"${value}"` : value))].join(' ');

const runStep = (step, dryRun) => {
  console.log(`[ops:release:v1:gate] ${step.label}`);
  console.log(`  ${formatCommand(step.command, step.args)}`);
  if (dryRun) return;

  const result = spawnSync(step.command, step.args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: process.env,
  });
  if (result.status !== 0) {
    throw new Error(`${step.label} failed with exit code ${result.status ?? 1}`);
  }
};

const main = () => {
  const options = parseArgs();
  if (options.help) {
    printUsage();
    process.exit(0);
  }

  const steps = buildSteps(options);
  console.log('[ops:release:v1:gate] execution plan');
  console.log(`- baseUrl: ${options.baseUrl}`);
  console.log(`- dryRun: ${options.dryRun ? 'true' : 'false'}`);
  console.log(`- localQuality: ${options.skipLocalQuality ? 'skipped' : 'enabled'}`);
  console.log(`- goLiveSmoke: ${options.skipGoLiveSmoke ? 'skipped' : 'enabled'}`);
  console.log(`- deploySmoke: ${options.skipDeploySmoke ? 'skipped' : 'enabled'}`);
  console.log(`- runtimeFreshness: ${options.skipRuntimeFreshness ? 'skipped' : 'enabled'}`);
  console.log(`- rollbackGuard: ${options.skipRollbackGuard ? 'skipped' : 'enabled'}`);

  for (const step of steps) {
    runStep(step, options.dryRun);
  }

  console.log(options.dryRun ? '[ops:release:v1:gate] dry-run complete' : '[ops:release:v1:gate] all gates passed');
};

main();
