#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const VALID_ENVIRONMENTS = new Set(['local', 'stage', 'prod']);
const repoRoot = process.cwd();
const resolveDocsRoot = () => {
  const docsRoot = path.resolve(repoRoot, 'docs');
  const migratedDocsRoot = path.resolve(repoRoot, 'Soar - docs');
  if (existsSync(path.join(docsRoot, 'operations')) || !existsSync(migratedDocsRoot)) {
    return docsRoot;
  }
  return migratedDocsRoot;
};
const currentOperationsDir = path.join(resolveDocsRoot(), 'operations');
const historyOperationsDir = path.resolve(process.cwd(), 'history', 'operations');
const SECRET_CLI_FLAGS = new Set([
  '--auth-token',
  '--auth-password',
  '--ops-basic-password',
  '--ops-auth-header-value',
]);

const EVIDENCE_FAMILIES = {
  activationAudit: {
    label: 'activation evidence audit',
    requiredIn: new Set(['stage', 'prod']),
    matcher: /^v1-production-activation-evidence-audit-(\d{4}-\d{2}-\d{2})\.md$/,
    searchDirType: 'historyAudits',
    passPattern: /Status:\s*\*\*(?:READY|PASS)\*\*/i,
    failedPassReason: 'artifact is fresh but does not report activation status READY or PASS',
    requiresExpectedSha: true,
  },
  activationPlan: {
    label: 'activation execution plan',
    requiredIn: new Set(['stage', 'prod']),
    matcher: /^v1-production-activation-and-evidence-plan-(\d{4}-\d{2}-\d{2})\.md$/,
    searchDirType: 'historyPlans',
    passPattern: /Status:\s*\*\*(?:READY|PASS)\*\*/i,
    failedPassReason: 'artifact is fresh but does not report activation status READY or PASS',
    requiresExpectedSha: true,
  },
  rcExternalGateStatus: {
    label: 'RC external gates status',
    requiredIn: new Set(['prod']),
    matcher: /^v1-rc-external-gates-status\.md$/,
    searchDirType: 'currentOperations',
    datePattern: /Generated at \(UTC\):\s*(\d{4}-\d{2}-\d{2})T/i,
    passPatterns: [
      /- Gate 1 \(.+?\):\s+PASS/i,
      /- Gate 2 \(.+?\):\s+PASS/i,
      /- Gate 3 \(.+?\):\s+PASS/i,
      /- Gate 4 \(.+?\):\s+PASS/i,
      /Gate 4 approved status found:\s+yes/i,
    ],
    failedPassPatternsReason: 'artifact is fresh but does not show all RC gates PASS',
    requiresExpectedSha: true,
  },
  rcSignoffRecord: {
    label: 'RC sign-off record',
    requiredIn: new Set(['prod']),
    matcher: /^v1-rc-signoff-record\.md$/,
    searchDirType: 'currentOperations',
    datePattern: /Date \(UTC\):\s*`?(\d{4}-\d{2}-\d{2})T/i,
    passPattern: /RC status:\s*`?APPROVED`?/i,
    failedPassReason: 'artifact is fresh but does not report RC status APPROVED',
    requiresExpectedSha: true,
  },
  rcChecklist: {
    label: 'RC checklist verification block',
    requiredIn: new Set(['prod']),
    matcher: /^v1-release-candidate-checklist\.md$/,
    searchDirType: 'currentOperations',
    datePattern: /Latest Verification \((\d{4}-\d{2}-\d{2})\)/i,
    passPattern: /G1=PASS`,\s*`G2=PASS`,\s*`G3=PASS`,\s*`G4=PASS`/i,
    failedPassReason: 'artifact is fresh but does not show all RC gates PASS',
    requiresExpectedSha: true,
  },
  liveImportReadback: {
    label: 'LIVEIMPORT-03 runtime readback',
    requiredIn: new Set(['prod']),
    matcher: /^liveimport-03-prod-readback-(\d{4}-\d{2}-\d{2})\.json$/,
    searchDirType: 'historyArtifacts',
    passPatterns: [
      /"botsWithRuntimeReadback":\s*[1-9]\d*/i,
      /"missingSymbols":\s*\[\s*\]/i,
      /"tokenCaptured":\s*false/i,
    ],
    failedPassPatternsReason:
      'artifact is fresh but does not satisfy required runtime readback checks',
    requiresExpectedSha: true,
  },
  prodUiClickthrough: {
    label: 'production UI clickthrough',
    requiredIn: new Set(['prod']),
    matcher: /^prod-ui-module-clickthrough-(?:[a-z0-9]+-)?(\d{4}-\d{2}-\d{2})\.md$/i,
    searchDirType: 'historyPlans',
    datePattern: /Evidence date:\s*(\d{4}-\d{2}-\d{2})/i,
    passPatterns: [
      /Result:\s*\*\*PASS\*\*/i,
      /`\/dashboard\/bots`/i,
      /`\/dashboard\/bots\/create`/i,
      /Dashboard auth:\s+(?!missing)/i,
    ],
    failedPassPatternsReason:
      'artifact is fresh but does not satisfy authenticated production UI clickthrough checks',
    requiresExpectedSha: true,
  },
  backupRestoreDrill: {
    label: 'backup/restore drill evidence',
    requiredIn: new Set(['prod']),
    matcher: /^v1-restore-drill-prod-(\d{4}-\d{2}-\d{2})T.*\.md$/,
    searchDirType: 'historyEvidence',
    datePattern: /Generated at \(UTC\):\s*(\d{4}-\d{2}-\d{2})T/i,
    passPattern: /Status:\s*\*\*PASS\*\*/i,
    requiresExpectedSha: true,
  },
  rollbackProof: {
    label: 'rollback proof pack',
    requiredIn: new Set(['prod']),
    matcher: /^v1-rollback-proof-prod-(\d{4}-\d{2}-\d{2})T.*\.md$/,
    searchDirType: 'historyEvidence',
    datePattern: /Generated at \(UTC\):\s*(\d{4}-\d{2}-\d{2})T/i,
    passPattern: /Status:\s*\*\*PASS\*\*/i,
    requiresExpectedSha: true,
  },
};

const nowStamp = (now = new Date()) => now.toISOString().replace(/[:.]/g, '-');

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    baseUrl: process.env.RELEASE_GATE_API_BASE_URL ?? 'http://localhost:3001',
    webBaseUrl: process.env.RELEASE_GATE_WEB_BASE_URL ?? '',
    expectedSha: process.env.RELEASE_GATE_EXPECTED_SHA ?? '',
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
    evidenceDir: historyOperationsDir,
    today: new Date().toISOString().slice(0, 10),
    artifactStamp: '',
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      return options;
    }
    if (SECRET_CLI_FLAGS.has(arg)) {
      throw new Error(`${arg} is secret-bearing and must be provided through RELEASE_GATE_* environment variables`);
    }
    if (arg === '--base-url') options.baseUrl = args[index + 1] ?? options.baseUrl;
    if (arg === '--web-base-url') options.webBaseUrl = args[index + 1] ?? options.webBaseUrl;
    if (arg === '--expected-sha') options.expectedSha = args[index + 1] ?? options.expectedSha;
    if (arg === '--auth-email') options.authEmail = args[index + 1] ?? options.authEmail;
    if (arg === '--ops-basic-user') options.opsBasicUser = args[index + 1] ?? options.opsBasicUser;
    if (arg === '--ops-auth-header-name') {
      options.opsAuthHeaderName = args[index + 1] ?? options.opsAuthHeaderName;
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
  if (options.expectedSha.trim() && !options.webBaseUrl.trim()) {
    throw new Error('Missing --web-base-url when --expected-sha is provided.');
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
      '  --expected-sha <sha>             Expected deployed web build-info SHA prefix',
      '  --environment <local|stage|prod> Evidence/readiness scope (default: local)',
      '  --auth-email <email>            Admin email for automatic token fetch',
      '  --ops-basic-user <user>         Optional extra OPS basic-auth user',
      '  --ops-auth-header-name <name>   Optional extra OPS header name',
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
      '',
      'Secret-bearing values must be provided through RELEASE_GATE_AUTH_TOKEN, RELEASE_GATE_AUTH_PASSWORD,',
      'RELEASE_GATE_OPS_BASIC_PASSWORD, and RELEASE_GATE_OPS_AUTH_HEADER_VALUE.',
    ].join('\n')
  );
};

const buildAuthEnv = (options, prefix) => {
  const env = {};
  const mappings = [
    ['AUTH_TOKEN', options.authToken],
    ['AUTH_EMAIL', options.authEmail],
    ['AUTH_PASSWORD', options.authPassword],
    ['OPS_BASIC_USER', options.opsBasicUser],
    ['OPS_BASIC_PASSWORD', options.opsBasicPassword],
    ['OPS_AUTH_HEADER_NAME', options.opsAuthHeaderName],
    ['OPS_AUTH_HEADER_VALUE', options.opsAuthHeaderValue],
  ];

  for (const [key, value] of mappings) {
    const normalized = String(value ?? '').trim();
    if (normalized) env[`${prefix}_${key}`] = normalized;
  }

  return env;
};

export const buildSteps = (options) => {
  const steps = [];

  if (!options.skipLocalQuality) {
    steps.push({ label: 'repository guardrails', command: 'pnpm', args: ['run', 'quality:guardrails'] });
    steps.push({ label: 'repository typecheck', command: 'pnpm', args: ['run', 'typecheck'] });
    steps.push({ label: 'repository build', command: 'pnpm', args: ['run', 'build'] });
    if (!options.skipGoLiveSmoke) {
      steps.push({ label: 'go-live smoke pack', command: 'pnpm', args: ['run', 'test:go-live:smoke'] });
    }
  }

  if (options.expectedSha.trim()) {
    steps.push({
      label: 'web build-info freshness gate',
      command: 'pnpm',
      args: [
        'run',
        'ops:deploy:wait-web-build-info',
        '--',
        '--web-base-url',
        options.webBaseUrl.trim(),
        '--expected-sha',
        options.expectedSha.trim(),
        '--timeout-seconds',
        '900',
        '--interval-seconds',
        '30',
      ],
    });
  }

  if (!options.skipDeploySmoke) {
    const stepArgs = ['run', 'ops:deploy:smoke', '--', '--base-url', options.baseUrl];
    if (options.webBaseUrl.trim()) {
      stepArgs.push('--web-base-url', options.webBaseUrl.trim());
    }
    steps.push({
      label: 'post-deploy smoke gate',
      command: 'pnpm',
      args: stepArgs,
      env: buildAuthEnv(options, 'SMOKE'),
    });
  }

  if (!options.skipRuntimeFreshness) {
    steps.push({
      label: 'runtime freshness gate',
      command: 'pnpm',
      args: ['run', 'ops:deploy:runtime-freshness', '--', '--base-url', options.baseUrl],
      env: buildAuthEnv(options, 'DEPLOY_FRESHNESS'),
    });
  }

  if (!options.skipRollbackGuard) {
    steps.push({
      label: 'rollback guard gate',
      command: 'pnpm',
      args: ['run', 'ops:deploy:rollback-guard', '--', '--base-url', options.baseUrl],
      env: buildAuthEnv(options, 'ROLLBACK_GUARD'),
    });
  }

  return steps;
};

export const buildExecutionPlanSummary = (options) => ({
  environment: options.environment,
  baseUrl: options.baseUrl,
  webBaseUrl: options.webBaseUrl || '-',
  expectedSha: options.expectedSha || '-',
  dryRun: options.dryRun ? 'true' : 'false',
  localQuality: options.skipLocalQuality ? 'skipped' : 'enabled',
  goLiveSmoke: options.skipLocalQuality || options.skipGoLiveSmoke ? 'skipped' : 'enabled',
  deploySmoke: options.skipDeploySmoke ? 'skipped' : 'enabled',
  runtimeFreshness: options.skipRuntimeFreshness ? 'skipped' : 'enabled',
  rollbackGuard: options.skipRollbackGuard ? 'skipped' : 'enabled',
});

const formatCommand = (command, args) =>
  [command, ...args.map((value) => (/\s/.test(value) ? `"${value}"` : value))].join(' ');

const resolveSearchDirs = (family, evidenceDir, currentOpsDir, historyRoot) => {
  if (family.searchDirType === 'historyAudits') {
    return [path.join(historyRoot, 'audits'), evidenceDir];
  }
  if (family.searchDirType === 'historyPlans') {
    return [
      path.join(historyRoot, 'plans'),
      path.join(historyRoot, 'planning'),
      path.resolve(evidenceDir, '..', 'planning'),
      evidenceDir,
    ];
  }
  if (family.searchDirType === 'historyArtifacts') {
    return [path.join(historyRoot, 'artifacts'), evidenceDir];
  }
  if (family.searchDirType === 'historyEvidence') {
    return [path.join(historyRoot, 'evidence'), evidenceDir];
  }
  if (family.searchDirType === 'currentOperations') {
    return [currentOpsDir];
  }
  return [evidenceDir];
};

const findLatestMatchingFile = async (family, evidenceDir, currentOpsDir, historyRoot) => {
  let bestMatch = null;
  for (const searchDir of resolveSearchDirs(family, evidenceDir, currentOpsDir, historyRoot)) {
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
      // Prioritize the extracted evidence date, then use the filename to keep
      // deterministic ordering among same-day artifacts with timestamp suffixes.
      const datedKey = `${match[1] ?? ''} ${entry.name}`;
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

const containsExpectedSha = (raw, expectedSha) => raw.includes(expectedSha);

export const evaluateEvidenceReadiness = async ({
  environment,
  evidenceDir,
  today,
  expectedSha = '',
  currentOperationsDir: currentOpsDir = evidenceDir,
  historyRoot = path.resolve(evidenceDir, '..'),
}) => {
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

    const match = await findLatestMatchingFile(family, evidenceDir, currentOpsDir, historyRoot);
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
        reason = family.failedPassReason ?? 'artifact is fresh but does not report PASS';
      }
    }
    if (state === 'fresh' && family.passPatterns) {
      const raw = await readFile(match.absolutePath, 'utf8');
      const missingPatterns = family.passPatterns.filter((pattern) => !pattern.test(raw));
      if (missingPatterns.length > 0) {
        state = 'failed';
        reason =
          family.failedPassPatternsReason ??
          'artifact is fresh but does not satisfy required content checks';
      }
    }
    if (state === 'fresh' && family.requiresExpectedSha && expectedSha) {
      const raw = await readFile(match.absolutePath, 'utf8');
      if (!containsExpectedSha(raw, expectedSha)) {
        state = 'failed';
        reason = 'artifact is fresh but is not tied to the expected deployment SHA';
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
  const reportStep = {
    label: step.label,
    command: step.command,
    args: step.args,
  };
  if (dryRun) {
    return {
      ...reportStep,
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
    env: {
      ...process.env,
      ...(step.env ?? {}),
    },
  });
  const endedAt = new Date().toISOString();
  const exitCode = typeof result.status === 'number' ? result.status : 1;
  return {
    ...reportStep,
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
- Expected SHA: ${report.expectedSha || '-'}
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
  await mkdir(historyOperationsDir, { recursive: true });
  const jsonFile = path.join(historyOperationsDir, `_artifacts-v1-release-gate-${report.environment}-${stamp}.json`);
  const mdFile = path.join(historyOperationsDir, `v1-release-gate-${report.environment}-${stamp}.md`);
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
    expectedSha: options.expectedSha,
    currentOperationsDir,
    historyRoot: path.resolve(process.cwd(), 'history'),
  });
  const steps = buildSteps(options);
  const summary = buildExecutionPlanSummary(options);
  console.log('[ops:release:v1:gate] execution plan');
  console.log(`- environment: ${summary.environment}`);
  console.log(`- baseUrl: ${summary.baseUrl}`);
  console.log(`- webBaseUrl: ${summary.webBaseUrl}`);
  console.log(`- expectedSha: ${summary.expectedSha}`);
  console.log(`- dryRun: ${summary.dryRun}`);
  console.log(`- localQuality: ${summary.localQuality}`);
  console.log(`- goLiveSmoke: ${summary.goLiveSmoke}`);
  console.log(`- deploySmoke: ${summary.deploySmoke}`);
  console.log(`- runtimeFreshness: ${summary.runtimeFreshness}`);
  console.log(`- rollbackGuard: ${summary.rollbackGuard}`);
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
    expectedSha: options.expectedSha,
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
