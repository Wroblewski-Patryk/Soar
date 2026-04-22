#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const VALID_ENVIRONMENTS = new Set(['local', 'stage', 'prod']);
const operationsDir = path.resolve(process.cwd(), 'docs', 'operations');

const EVIDENCE_FAMILIES = {
  activationAudit: {
    label: 'activation evidence audit',
    requiredIn: new Set(['stage', 'prod']),
    matcher: /^v1-production-activation-evidence-audit-(\d{4}-\d{2}-\d{2})\.md$/,
  },
  activationPlan: {
    label: 'activation execution plan',
    requiredIn: new Set(['stage', 'prod']),
    matcher: /^v1-production-activation-and-evidence-plan-(\d{4}-\d{2}-\d{2})\.md$/,
    searchDirType: 'planning',
  },
  rcExternalGateStatus: {
    label: 'RC external gates status',
    requiredIn: new Set(['prod']),
    matcher: /^v1-rc-external-gates-status\.md$/,
    datePattern: /Generated at \(UTC\):\s*(\d{4}-\d{2}-\d{2})T/i,
  },
  rcSignoffRecord: {
    label: 'RC sign-off record',
    requiredIn: new Set(['prod']),
    matcher: /^v1-rc-signoff-record\.md$/,
    datePattern: /Date \(UTC\):\s*`?(\d{4}-\d{2}-\d{2})T/i,
  },
  rcChecklist: {
    label: 'RC checklist verification block',
    requiredIn: new Set(['prod']),
    matcher: /^v1-release-candidate-checklist\.md$/,
    datePattern: /Latest Verification \((\d{4}-\d{2}-\d{2})\)/i,
  },
  backupRestoreDrill: {
    label: 'backup/restore drill evidence',
    requiredIn: new Set(['prod']),
    matcher: /^v1-restore-drill-prod-(\d{4}-\d{2}-\d{2})T.*\.md$/,
    datePattern: /Generated at \(UTC\):\s*(\d{4}-\d{2}-\d{2})T/i,
    passPattern: /Status:\s*\*\*PASS\*\*/i,
  },
  rollbackProof: {
    label: 'rollback proof pack',
    requiredIn: new Set(['prod']),
    matcher: /^v1-rollback-proof-prod-(\d{4}-\d{2}-\d{2})T.*\.md$/,
    datePattern: /Generated at \(UTC\):\s*(\d{4}-\d{2}-\d{2})T/i,
    passPattern: /Status:\s*\*\*PASS\*\*/i,
  },
};

const nowStamp = (now = new Date()) => now.toISOString().replace(/[:.]/g, '-');

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    baseUrl: process.env.RELEASE_GATE_API_BASE_URL ?? 'http://localhost:3001',
    webBaseUrl: process.env.RELEASE_GATE_WEB_BASE_URL ?? '',
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
    environment: 'local',
    evidenceDir: operationsDir,
    today: new Date().toISOString().slice(0, 10),
    artifactStamp: '',
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
    if (arg === '--ops-auth-header-name') {
      options.opsAuthHeaderName = args[index + 1] ?? options.opsAuthHeaderName;
    }
    if (arg === '--ops-auth-header-value') {
      options.opsAuthHeaderValue = args[index + 1] ?? options.opsAuthHeaderValue;
    }
    if (arg === '--environment') options.environment = args[index + 1] ?? options.environment;
    if (arg === '--evidence-dir') options.evidenceDir = args[index + 1] ?? options.evidenceDir;
    if (arg === '--today') options.today = args[index + 1] ?? options.today;
    if (arg === '--artifact-stamp') options.artifactStamp = args[index + 1] ?? options.artifactStamp;
    if (arg === '--skip-local-quality') options.skipLocalQuality = true;
    if (arg === '--skip-go-live-smoke') options.skipGoLiveSmoke = true;
    if (arg === '--skip-deploy-smoke') options.skipDeploySmoke = true;
    if (arg === '--skip-runtime-freshness') options.skipRuntimeFreshness = true;
    if (arg === '--skip-rollback-guard') options.skipRollbackGuard = true;
    if (arg === '--dry-run') options.dryRun = true;
  }

  if (!VALID_ENVIRONMENTS.has(options.environment)) {
    throw new Error(`Unsupported --environment "${options.environment}". Expected one of: local, stage, prod.`);
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
      '  --web-base-url <url>             Target web base URL for deploy smoke (optional)',
      '  --environment <local|stage|prod> Evidence/readiness scope (default: local)',
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
      '  --evidence-dir <path>           Override evidence root for readiness evaluation',
      '  --today <YYYY-MM-DD>            Override freshness day for tests/replays',
      '  --artifact-stamp <stamp>        Force artifact timestamp suffix',
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

export const buildSteps = (options) => {
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
    const stepArgs = ['run', 'ops:deploy:smoke', '--', '--base-url', options.baseUrl, ...authArgs];
    if (options.webBaseUrl.trim()) {
      stepArgs.push('--web-base-url', options.webBaseUrl.trim());
    }
    steps.push({
      label: 'post-deploy smoke gate',
      command: 'pnpm',
      args: stepArgs,
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

const resolveSearchDirs = (family, evidenceDir) => {
  if (family.searchDirType === 'planning') {
    return [path.resolve(evidenceDir, '..', 'planning')];
  }
  return [evidenceDir];
};

const findLatestMatchingFile = async (family, evidenceDir) => {
  let bestMatch = null;
  for (const searchDir of resolveSearchDirs(family, evidenceDir)) {
    let dirEntries = [];
    try {
      dirEntries = await readDirSafe(searchDir);
    } catch {
      continue;
    }
    for (const entry of dirEntries) {
      if (!entry.isFile()) continue;
      const match = family.matcher.exec(entry.name);
      if (!match) continue;
      const absolutePath = path.join(searchDir, entry.name);
      // Use the full filename so same-day artifacts still sort by their
      // timestamp suffix instead of collapsing to one YYYY-MM-DD bucket.
      const datedKey = entry.name;
      if (!bestMatch || datedKey > bestMatch.sortKey) {
        bestMatch = {
          absolutePath,
          relativePath: path.relative(process.cwd(), absolutePath),
          sortKey: datedKey,
        };
      }
    }
  }
  return bestMatch;
};

const readDirSafe = async (target) => {
  const { readdir } = await import('node:fs/promises');
  return readdir(target, { withFileTypes: true });
};

const readFreshnessDate = async (family, evidence) => {
  if (!evidence) return '';
  if (family.datePattern) {
    const raw = await readFile(evidence.absolutePath, 'utf8');
    const match = family.datePattern.exec(raw);
    return match?.[1] ?? '';
  }
  const fileMatch = family.matcher.exec(path.basename(evidence.absolutePath));
  return fileMatch?.[1] ?? '';
};

export const evaluateEvidenceReadiness = async ({ environment, evidenceDir, today }) => {
  const evidence = [];
  const blockers = [];

  for (const [familyKey, family] of Object.entries(EVIDENCE_FAMILIES)) {
    const required = family.requiredIn.has(environment);
    if (!required) {
      evidence.push({
        key: familyKey,
        label: family.label,
        state: 'skipped',
        required: false,
        reason: `not required for ${environment}`,
        path: null,
        date: null,
      });
      continue;
    }

    const match = await findLatestMatchingFile(family, evidenceDir);
    if (!match) {
      const row = {
        key: familyKey,
        label: family.label,
        state: 'missing',
        required: true,
        reason: 'no matching artifact found',
        path: null,
        date: null,
      };
      evidence.push(row);
      blockers.push(`${familyKey}:missing`);
      continue;
    }

    const freshnessDate = await readFreshnessDate(family, match);
    let state = freshnessDate === today ? 'fresh' : 'stale';
    let reason =
      state === 'fresh' ? `fresh for ${today}` : `expected ${today}, found ${freshnessDate || 'unknown'}`;

    if (state === 'fresh' && family.passPattern) {
      const raw = await readFile(match.absolutePath, 'utf8');
      if (!family.passPattern.test(raw)) {
        state = 'failed';
        reason = 'artifact is fresh but does not report PASS';
      }
    }

    const row = {
      key: familyKey,
      label: family.label,
      state,
      required: true,
      reason,
      path: match.relativePath,
      date: freshnessDate || null,
    };
    evidence.push(row);
    if (state !== 'fresh') blockers.push(`${familyKey}:${state}`);
  }

  return {
    ready: blockers.length === 0,
    blockers,
    evidence,
  };
};

const runStep = (step, dryRun) => {
  const startedAt = new Date().toISOString();
  console.log(`[ops:release:v1:gate] ${step.label}`);
  console.log(`  ${formatCommand(step.command, step.args)}`);
  if (dryRun) {
    return {
      ...step,
      startedAt,
      endedAt: startedAt,
      durationMs: 0,
      status: 'skipped',
      exitCode: 0,
    };
  }

  const startedMs = Date.now();
  const result = spawnSync(step.command, step.args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: process.env,
  });
  const endedAt = new Date().toISOString();
  const exitCode = typeof result.status === 'number' ? result.status : 1;
  return {
    ...step,
    startedAt,
    endedAt,
    durationMs: Date.now() - startedMs,
    status: exitCode === 0 ? 'passed' : 'failed',
    exitCode,
  };
};

const renderMarkdown = (report, jsonPath) => {
  const evidenceRows = report.evidence
    .map(
      (row) =>
        `| ${row.label} | ${row.state} | ${row.required ? 'yes' : 'no'} | ${row.date ?? '-'} | ${row.path ?? '-'} | ${row.reason} |`
    )
    .join('\n');
  const stepRows = report.steps
    .map(
      (step) =>
        `| ${step.label} | \`${formatCommand(step.command, step.args)}\` | ${step.status} | ${step.exitCode} | ${step.durationMs ?? 0} |`
    )
    .join('\n');

  return `# V1 Release Gate Report (${report.environment})

## Context
- Generated (UTC): ${report.generatedAt}
- Scope: ${report.environment}
- Dry run: ${report.dryRun ? 'yes' : 'no'}
- Readiness: ${report.readiness}
- Base API URL: ${report.baseUrl}
- Base Web URL: ${report.webBaseUrl || '-'}
- Raw JSON: \`${jsonPath}\`

## Evidence Classification
| Family | State | Required | Date | Path | Notes |
| --- | --- | --- | --- | --- | --- |
${evidenceRows}

## Execution Steps
| Step | Command | Status | Exit | Duration (ms) |
| --- | --- | --- | --- | --- |
${stepRows}

## Blockers
${report.blockers.length > 0 ? report.blockers.map((item) => `- ${item}`).join('\n') : '- none'}
`;
};

const writeArtifacts = async (report, stamp) => {
  await mkdir(operationsDir, { recursive: true });
  const jsonFile = path.join(operationsDir, `_artifacts-v1-release-gate-${report.environment}-${stamp}.json`);
  const mdFile = path.join(operationsDir, `v1-release-gate-${report.environment}-${stamp}.md`);
  await writeFile(jsonFile, JSON.stringify(report, null, 2));
  await writeFile(mdFile, renderMarkdown(report, path.relative(process.cwd(), jsonFile)));
  return {
    jsonFile,
    mdFile,
  };
};

const main = async () => {
  const options = parseArgs();
  if (options.help) {
    printUsage();
    process.exit(0);
  }

  const evidence = await evaluateEvidenceReadiness({
    environment: options.environment,
    evidenceDir: path.resolve(process.cwd(), options.evidenceDir),
    today: options.today,
  });
  const steps = buildSteps(options);
  console.log('[ops:release:v1:gate] execution plan');
  console.log(`- environment: ${options.environment}`);
  console.log(`- baseUrl: ${options.baseUrl}`);
  console.log(`- webBaseUrl: ${options.webBaseUrl || '-'}`);
  console.log(`- dryRun: ${options.dryRun ? 'true' : 'false'}`);
  console.log(`- localQuality: ${options.skipLocalQuality ? 'skipped' : 'enabled'}`);
  console.log(`- goLiveSmoke: ${options.skipGoLiveSmoke ? 'skipped' : 'enabled'}`);
  console.log(`- deploySmoke: ${options.skipDeploySmoke ? 'skipped' : 'enabled'}`);
  console.log(`- runtimeFreshness: ${options.skipRuntimeFreshness ? 'skipped' : 'enabled'}`);
  console.log(`- rollbackGuard: ${options.skipRollbackGuard ? 'skipped' : 'enabled'}`);
  console.log('[ops:release:v1:gate] evidence');
  for (const row of evidence.evidence) {
    console.log(`- ${row.state.toUpperCase()} ${row.label}${row.path ? ` -> ${row.path}` : ''}`);
  }

  const stepResults = [];
  let failedStep = null;
  for (const step of steps) {
    const result = runStep(step, options.dryRun);
    stepResults.push(result);
    if (result.exitCode !== 0) {
      failedStep = result.label;
      break;
    }
  }

  const blockers = [
    ...evidence.blockers.map((item) => `evidence:${item}`),
    ...(failedStep ? [`step:${failedStep}`] : []),
  ];
  if (options.dryRun && options.environment !== 'local') {
    blockers.push(`mode:${options.environment}_dry_run_requires_remote_execution`);
  }
  const readiness = blockers.length === 0 ? 'ready' : 'not_ready';
  const report = {
    generatedAt: new Date().toISOString(),
    environment: options.environment,
    dryRun: options.dryRun,
    readiness,
    baseUrl: options.baseUrl,
    webBaseUrl: options.webBaseUrl,
    evidence: evidence.evidence,
    blockers,
    steps: stepResults,
  };

  const stamp = options.artifactStamp || nowStamp();
  const artifactPaths = await writeArtifacts(report, stamp);
  console.log(`[ops:release:v1:gate] JSON artifact: ${path.relative(process.cwd(), artifactPaths.jsonFile)}`);
  console.log(`[ops:release:v1:gate] report: ${path.relative(process.cwd(), artifactPaths.mdFile)}`);

  if (options.dryRun) {
    console.log(`[ops:release:v1:gate] dry-run complete with readiness=${readiness}`);
    process.exit(0);
  }

  if (readiness !== 'ready') {
    throw new Error(`release gate ended with readiness=${readiness}`);
  }

  console.log('[ops:release:v1:gate] all gates passed');
};

const isEntrypoint = () => {
  const entry = process.argv[1];
  if (!entry) return false;
  return path.resolve(entry) === path.resolve(fileURLToPath(import.meta.url));
};

if (isEntrypoint()) {
  main().catch((error) => {
    console.error(
      '[ops:release:v1:gate] failed:',
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  });
}
