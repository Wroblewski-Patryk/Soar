#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { evaluateEvidenceReadiness } from './runV1ReleaseGate.mjs';

const DEFAULT_API_BASE_URL = 'https://api.soar.luckysparrow.ch';
const DEFAULT_WEB_BASE_URL = 'https://soar.luckysparrow.ch';
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

const rawArgs = process.argv.slice(2);

const readArgValue = (flag) => {
  const index = rawArgs.indexOf(flag);
  if (index === -1) return '';
  return rawArgs[index + 1] ?? '';
};

const hasFlag = (flag) => rawArgs.includes(flag);

const normalizeBaseUrl = (value) => String(value ?? '').trim().replace(/\/+$/, '');

const printUsage = () => {
  process.stdout.write(
    [
      'Usage: node scripts/runV1FinalPreflight.mjs [options]',
      '',
      'Options:',
      '  --api-base-url <url>       Production API base URL',
      '  --web-base-url <url>       Production Web base URL',
      '  --expected-sha <sha>       Expected deployed Web build-info SHA',
      '  --timeout-seconds <n>      Build-info wait timeout (default: 120)',
      '  --interval-seconds <n>     Build-info wait interval (default: 15)',
      '  --today <yyyy-mm-dd>       Evidence date override',
      '  --json-output <path>       Optional no-secret JSON report path',
      '  --markdown-output <path>   Optional no-secret Markdown report path',
      '  --skip-build-info          Do not call the build-info wait command',
      '  --skip-public-smoke        Do not call public API/Web smoke',
      '  --help                     Show this message',
      '',
      'This command is read-only. It prints env variable names only and does not',
      'create LIVEIMPORT, restore, rollback, sign-off, or final gate artifacts.',
    ].join('\n') + '\n'
  );
};

const resolveGitHead = () => {
  const result = spawnSync('git', ['rev-parse', 'HEAD'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || 'git rev-parse HEAD failed').trim());
  }
  return result.stdout.trim();
};

const resolveOptions = () => {
  if (hasFlag('--help') || hasFlag('-h')) return { help: true };

  const expectedSha = readArgValue('--expected-sha') || process.env.V1_PREFLIGHT_EXPECTED_SHA || '';

  return {
    help: false,
    apiBaseUrl: normalizeBaseUrl(
      readArgValue('--api-base-url') ||
        process.env.V1_PREFLIGHT_API_BASE_URL ||
        DEFAULT_API_BASE_URL
    ),
    webBaseUrl: normalizeBaseUrl(
      readArgValue('--web-base-url') ||
        process.env.V1_PREFLIGHT_WEB_BASE_URL ||
        DEFAULT_WEB_BASE_URL
    ),
    expectedSha: expectedSha.trim() || resolveGitHead(),
    timeoutSeconds:
      readArgValue('--timeout-seconds') || process.env.V1_PREFLIGHT_TIMEOUT_SECONDS || '120',
    intervalSeconds:
      readArgValue('--interval-seconds') || process.env.V1_PREFLIGHT_INTERVAL_SECONDS || '15',
    today: readArgValue('--today') || new Date().toISOString().slice(0, 10),
    jsonOutput: readArgValue('--json-output') || process.env.V1_PREFLIGHT_JSON_OUTPUT || '',
    markdownOutput:
      readArgValue('--markdown-output') || process.env.V1_PREFLIGHT_MARKDOWN_OUTPUT || '',
    skipBuildInfo: hasFlag('--skip-build-info'),
    skipPublicSmoke: hasFlag('--skip-public-smoke'),
  };
};

const hasAnyEnv = (env, names) => names.some((name) => Boolean(env[name]));
const hasAllEnv = (env, names) => names.every((name) => Boolean(env[name]));

export const prerequisiteGroups = [
  {
    key: 'liveimport auth',
    ok: (env) =>
      hasAnyEnv(env, ['LIVEIMPORT_READBACK_AUTH_TOKEN']) ||
      hasAllEnv(env, ['LIVEIMPORT_READBACK_AUTH_EMAIL', 'LIVEIMPORT_READBACK_AUTH_PASSWORD']),
    required: [
      'LIVEIMPORT_READBACK_AUTH_TOKEN',
      'or LIVEIMPORT_READBACK_AUTH_EMAIL + LIVEIMPORT_READBACK_AUTH_PASSWORD',
    ],
  },
  {
    key: 'rollback guard auth',
    ok: (env) =>
      hasAnyEnv(env, ['ROLLBACK_GUARD_AUTH_TOKEN']) ||
      hasAllEnv(env, ['ROLLBACK_GUARD_AUTH_EMAIL', 'ROLLBACK_GUARD_AUTH_PASSWORD']),
    required: [
      'ROLLBACK_GUARD_AUTH_TOKEN',
      'or ROLLBACK_GUARD_AUTH_EMAIL + ROLLBACK_GUARD_AUTH_PASSWORD',
    ],
  },
  {
    key: 'production UI dashboard auth',
    ok: (env) =>
      hasAnyEnv(env, ['PROD_UI_AUDIT_AUTH_TOKEN']) ||
      hasAllEnv(env, ['PROD_UI_AUDIT_AUTH_EMAIL', 'PROD_UI_AUDIT_AUTH_PASSWORD']),
    required: [
      'PROD_UI_AUDIT_AUTH_TOKEN',
      'or PROD_UI_AUDIT_AUTH_EMAIL + PROD_UI_AUDIT_AUTH_PASSWORD',
    ],
  },
  {
    key: 'production UI admin auth',
    ok: (env) =>
      hasAnyEnv(env, ['PROD_UI_AUDIT_ADMIN_TOKEN']) ||
      hasAllEnv(env, ['PROD_UI_AUDIT_ADMIN_EMAIL', 'PROD_UI_AUDIT_ADMIN_PASSWORD']),
    required: [
      'PROD_UI_AUDIT_ADMIN_TOKEN',
      'or PROD_UI_AUDIT_ADMIN_EMAIL + PROD_UI_AUDIT_ADMIN_PASSWORD',
    ],
  },
  {
    key: 'production DB restore context',
    ok: (env) =>
      hasAllEnv(env, ['PROD_DB_CHECK_CONTAINER', 'PROD_DB_CHECK_USER', 'PROD_DB_CHECK_NAME']) ||
      hasAllEnv(env, [
        'PRODUCTION_DB_CHECK_CONTAINER',
        'PRODUCTION_DB_CHECK_USER',
        'PRODUCTION_DB_CHECK_NAME',
      ]),
    required: [
      'PROD_DB_CHECK_CONTAINER + PROD_DB_CHECK_USER + PROD_DB_CHECK_NAME',
      'or PRODUCTION_DB_CHECK_CONTAINER + PRODUCTION_DB_CHECK_USER + PRODUCTION_DB_CHECK_NAME',
    ],
  },
];

export const optionalGroups = [
  {
    key: 'liveimport private OPS layer',
    ok: (env) =>
      hasAllEnv(env, [
        'LIVEIMPORT_READBACK_OPS_BASIC_USER',
        'LIVEIMPORT_READBACK_OPS_BASIC_PASSWORD',
      ]) ||
      hasAllEnv(env, [
        'LIVEIMPORT_READBACK_OPS_AUTH_HEADER_NAME',
        'LIVEIMPORT_READBACK_OPS_AUTH_HEADER_VALUE',
      ]),
    accepted: [
      'LIVEIMPORT_READBACK_OPS_BASIC_USER + LIVEIMPORT_READBACK_OPS_BASIC_PASSWORD',
      'or LIVEIMPORT_READBACK_OPS_AUTH_HEADER_NAME + LIVEIMPORT_READBACK_OPS_AUTH_HEADER_VALUE',
    ],
  },
  {
    key: 'rollback private OPS layer',
    ok: (env) =>
      hasAllEnv(env, ['ROLLBACK_GUARD_OPS_BASIC_USER', 'ROLLBACK_GUARD_OPS_BASIC_PASSWORD']) ||
      hasAllEnv(env, ['ROLLBACK_GUARD_OPS_AUTH_HEADER_NAME', 'ROLLBACK_GUARD_OPS_AUTH_HEADER_VALUE']),
    accepted: [
      'ROLLBACK_GUARD_OPS_BASIC_USER + ROLLBACK_GUARD_OPS_BASIC_PASSWORD',
      'or ROLLBACK_GUARD_OPS_AUTH_HEADER_NAME + ROLLBACK_GUARD_OPS_AUTH_HEADER_VALUE',
    ],
  },
];

export const evaluatePrerequisiteGroups = (env = process.env) => ({
  required: prerequisiteGroups.map((group) => ({
    key: group.key,
    ok: group.ok(env),
    required: group.required,
  })),
  optional: optionalGroups.map((group) => ({
    key: group.key,
    ok: group.ok(env),
    accepted: group.accepted,
  })),
});

const evidenceByKey = (evidence) =>
  new Map((evidence?.evidence ?? []).map((row) => [row.key, row]));

export const isPrerequisiteSatisfiedByEvidence = (groupKey, evidence) => {
  if (groupKey !== 'production DB restore context') return false;
  return evidenceByKey(evidence).get('backupRestoreDrill')?.state === 'fresh';
};

export const annotatePrerequisitesForEvidence = (prerequisites, evidence) => ({
  required: prerequisites.required.map((group) => {
    const satisfiedByEvidence =
      !group.ok && isPrerequisiteSatisfiedByEvidence(group.key, evidence);
    return {
      ...group,
      satisfiedByEvidence,
      blocking: !group.ok && !satisfiedByEvidence,
    };
  }),
  optional: prerequisites.optional.map((group) => ({
    ...group,
    satisfiedByEvidence: false,
    blocking: false,
  })),
});

export const buildPrerequisiteBlockers = (prerequisites) =>
  prerequisites.required
    .filter((group) => group.blocking ?? !group.ok)
    .map((group) => `env:${group.key}`);

const remediationCatalog = {
  'build-info': {
    title: 'Wait for the current HEAD to deploy',
    action: 'Run the existing web build-info wait command before protected evidence collection.',
    command:
      '$expectedSha = git rev-parse HEAD; node scripts/waitForWebBuildInfo.mjs --web-base-url https://soar.luckysparrow.ch --expected-sha $expectedSha --timeout-seconds 900 --interval-seconds 30',
  },
  'public-smoke': {
    title: 'Restore public API/Web reachability',
    action: 'Run the existing public smoke command and fix public health/readiness/web reachability before protected evidence collection.',
    command:
      'node scripts/deploySmokeCheck.mjs --api-base-url https://api.soar.luckysparrow.ch --web-base-url https://soar.luckysparrow.ch --no-workers',
  },
  'env:liveimport auth': {
    title: 'Provide read-only LIVEIMPORT auth',
    action: 'Provide read-only production application auth for protected runtime readback.',
    requiredInputs: [
      'LIVEIMPORT_READBACK_AUTH_TOKEN',
      'or LIVEIMPORT_READBACK_AUTH_EMAIL + LIVEIMPORT_READBACK_AUTH_PASSWORD',
    ],
    command:
      '$expectedSha = git rev-parse HEAD; pnpm run ops:liveimport:readback -- --expected-sha $expectedSha --output docs/operations/liveimport-03-prod-readback-2026-05-08.json',
  },
  'env:rollback guard auth': {
    title: 'Provide rollback guard auth',
    action: 'Provide production auth for protected runtime freshness and alerts checks.',
    requiredInputs: [
      'ROLLBACK_GUARD_AUTH_TOKEN',
      'or ROLLBACK_GUARD_AUTH_EMAIL + ROLLBACK_GUARD_AUTH_PASSWORD',
    ],
    command:
      'pnpm run ops:deploy:rollback-proof -- --profile prod --base-url https://api.soar.luckysparrow.ch',
  },
  'env:production UI dashboard auth': {
    title: 'Provide production UI dashboard auth',
    action: 'Provide approved production app auth for non-destructive dashboard module clickthrough.',
    requiredInputs: [
      'PROD_UI_AUDIT_AUTH_TOKEN',
      'or PROD_UI_AUDIT_AUTH_EMAIL + PROD_UI_AUDIT_AUTH_PASSWORD',
    ],
    command:
      'pnpm run ops:ui:prod-clickthrough -- --expected-sha $expectedSha --today $releaseDate',
  },
  'env:production UI admin auth': {
    title: 'Provide production UI admin auth',
    action: 'Provide approved production admin app auth for non-destructive admin module clickthrough.',
    requiredInputs: [
      'PROD_UI_AUDIT_ADMIN_TOKEN',
      'or PROD_UI_AUDIT_ADMIN_EMAIL + PROD_UI_AUDIT_ADMIN_PASSWORD',
    ],
    command:
      'pnpm run ops:ui:prod-clickthrough -- --expected-sha $expectedSha --today $releaseDate',
  },
  'env:production DB restore context': {
    title: 'Provide production DB restore context',
    action: 'Provide production DB/Coolify context before running the restore drill.',
    requiredInputs: [
      'PROD_DB_CHECK_CONTAINER + PROD_DB_CHECK_USER + PROD_DB_CHECK_NAME',
      'or PRODUCTION_DB_CHECK_CONTAINER + PRODUCTION_DB_CHECK_USER + PRODUCTION_DB_CHECK_NAME',
    ],
    command: 'pnpm run ops:db:restore-drill:prod',
  },
  'evidence:rcExternalGateStatus:failed': {
    title: 'Refresh RC gates after real approval',
    action: 'Run the RC gate refresh/status commands after required protected evidence and sign-off are complete.',
    command:
      'pnpm run ops:rc:gates:prod-pipeline -- --base-url https://api.soar.luckysparrow.ch --duration-minutes 30 --interval-seconds 30',
  },
  'evidence:rcSignoffRecord:failed': {
    title: 'Build final RC sign-off with real approvers',
    action: 'Provide real Engineering, Product, Operations, and RC owner names. Owner contact is recommended for rollback authority handoff.',
    requiredInputs: [
      '--engineering-name "<name>"',
      '--product-name "<name>"',
      '--operations-name "<name>"',
      '--owner-name "<name>"',
      '--owner-contact "<email-or-contact>"',
    ],
    command:
      'pnpm run ops:rc:signoff:build -- --engineering-name "<name>" --product-name "<name>" --operations-name "<name>" --owner-name "<name>" --owner-contact "<email-or-contact>"',
  },
  'evidence:rcChecklist:failed': {
    title: 'Sync RC checklist after Gate 4 approval',
    action: 'After the sign-off record is APPROVED and external gates are refreshed, sync the RC checklist.',
    command: 'pnpm run ops:rc:gates:status; pnpm run ops:rc:checklist:sync',
  },
  'evidence:liveImportReadback:missing': {
    title: 'Collect LIVEIMPORT-03 runtime readback',
    action: 'Run the read-only collector after build-info confirms current HEAD and read-only auth is available.',
    command:
      '$expectedSha = git rev-parse HEAD; pnpm run ops:liveimport:readback -- --expected-sha $expectedSha --output docs/operations/liveimport-03-prod-readback-2026-05-08.json',
  },
  'evidence:prodUiClickthrough:missing': {
    title: 'Run production UI clickthrough to PASS',
    action: 'Run the no-secret production UI audit after dashboard and admin app auth are available.',
    command:
      'pnpm run ops:ui:prod-clickthrough -- --expected-sha $expectedSha --today $releaseDate',
  },
  'evidence:prodUiClickthrough:failed': {
    title: 'Fix production UI clickthrough blocker',
    action: 'Inspect the UI clickthrough artifact, fix the listed auth/build/route blocker, then rerun the audit to PASS.',
    command:
      'pnpm run ops:ui:prod-clickthrough -- --expected-sha $expectedSha --today $releaseDate',
  },
  'evidence:backupRestoreDrill:failed': {
    title: 'Run production restore drill to PASS',
    action: 'Run the production restore drill after production DB/Coolify context is available.',
    command: 'pnpm run ops:db:restore-drill:prod',
  },
  'evidence:rollbackProof:failed': {
    title: 'Run production rollback proof to PASS',
    action: 'Run rollback proof after protected rollback guard auth is available.',
    command:
      'pnpm run ops:deploy:rollback-proof -- --profile prod --base-url https://api.soar.luckysparrow.ch',
  },
};

export const buildRemediationHints = (blockers) =>
  blockers
    .map((blocker) => {
      const hint = remediationCatalog[blocker];
      if (!hint) return null;
      return {
        blocker,
        ...hint,
      };
    })
    .filter(Boolean);

const blockerDetailCatalog = {
  'build-info': {
    category: 'deploy_freshness',
    label: 'Deployed build-info freshness',
    severity: 'blocking',
    protectedInputRequired: false,
    finalEvidenceRequired: false,
    operatorActionRequired: true,
    requiredCapabilities: ['coolify_deploy_or_wait'],
  },
  'public-smoke': {
    category: 'public_reachability',
    label: 'Public API/Web smoke',
    severity: 'blocking',
    protectedInputRequired: false,
    finalEvidenceRequired: false,
    operatorActionRequired: true,
    requiredCapabilities: ['public_api_web_reachability'],
  },
  'env:liveimport auth': {
    category: 'protected_prerequisite',
    label: 'LIVEIMPORT read-only auth',
    severity: 'blocking',
    protectedInputRequired: true,
    finalEvidenceRequired: false,
    operatorActionRequired: true,
    requiredCapabilities: ['production_application_auth'],
  },
  'env:rollback guard auth': {
    category: 'protected_prerequisite',
    label: 'Rollback guard auth',
    severity: 'blocking',
    protectedInputRequired: true,
    finalEvidenceRequired: false,
    operatorActionRequired: true,
    requiredCapabilities: ['production_ops_auth'],
  },
  'env:production UI dashboard auth': {
    category: 'protected_prerequisite',
    label: 'Production UI dashboard auth',
    severity: 'blocking',
    protectedInputRequired: true,
    finalEvidenceRequired: false,
    operatorActionRequired: true,
    requiredCapabilities: ['production_application_auth', 'authenticated_ui_clickthrough'],
  },
  'env:production UI admin auth': {
    category: 'protected_prerequisite',
    label: 'Production UI admin auth',
    severity: 'blocking',
    protectedInputRequired: true,
    finalEvidenceRequired: false,
    operatorActionRequired: true,
    requiredCapabilities: ['production_admin_auth', 'authenticated_ui_clickthrough'],
  },
  'env:production DB restore context': {
    category: 'protected_prerequisite',
    label: 'Production DB restore context',
    severity: 'blocking',
    protectedInputRequired: true,
    finalEvidenceRequired: false,
    operatorActionRequired: true,
    requiredCapabilities: ['production_db_coolify_access'],
  },
  'evidence:rcExternalGateStatus:failed': {
    category: 'release_evidence',
    label: 'RC external gates approval',
    severity: 'blocking',
    protectedInputRequired: true,
    finalEvidenceRequired: true,
    operatorActionRequired: true,
    requiredCapabilities: ['production_gate_refresh', 'rc_approval'],
  },
  'evidence:rcSignoffRecord:failed': {
    category: 'release_evidence',
    label: 'RC sign-off approval',
    severity: 'blocking',
    protectedInputRequired: false,
    finalEvidenceRequired: true,
    operatorActionRequired: true,
    requiredCapabilities: ['real_approver_identities', 'rc_approval'],
  },
  'evidence:rcChecklist:failed': {
    category: 'release_evidence',
    label: 'RC checklist sync',
    severity: 'blocking',
    protectedInputRequired: false,
    finalEvidenceRequired: true,
    operatorActionRequired: true,
    requiredCapabilities: ['rc_approval'],
  },
  'evidence:liveImportReadback:missing': {
    category: 'release_evidence',
    label: 'LIVEIMPORT-03 runtime readback',
    severity: 'blocking',
    protectedInputRequired: true,
    finalEvidenceRequired: true,
    operatorActionRequired: true,
    requiredCapabilities: ['production_application_auth', 'protected_runtime_readback'],
  },
  'evidence:prodUiClickthrough:missing': {
    category: 'release_evidence',
    label: 'Production UI clickthrough',
    severity: 'blocking',
    protectedInputRequired: true,
    finalEvidenceRequired: true,
    operatorActionRequired: true,
    requiredCapabilities: ['production_application_auth', 'production_admin_auth', 'authenticated_ui_clickthrough'],
  },
  'evidence:prodUiClickthrough:failed': {
    category: 'release_evidence',
    label: 'Production UI clickthrough',
    severity: 'blocking',
    protectedInputRequired: true,
    finalEvidenceRequired: true,
    operatorActionRequired: true,
    requiredCapabilities: ['production_application_auth', 'production_admin_auth', 'authenticated_ui_clickthrough'],
  },
  'evidence:backupRestoreDrill:failed': {
    category: 'release_evidence',
    label: 'Production restore drill',
    severity: 'blocking',
    protectedInputRequired: true,
    finalEvidenceRequired: true,
    operatorActionRequired: true,
    requiredCapabilities: ['production_db_coolify_access'],
  },
  'evidence:rollbackProof:failed': {
    category: 'release_evidence',
    label: 'Production rollback proof',
    severity: 'blocking',
    protectedInputRequired: true,
    finalEvidenceRequired: true,
    operatorActionRequired: true,
    requiredCapabilities: ['production_ops_auth', 'protected_runtime_freshness'],
  },
};

const fallbackBlockerDetail = (blocker) => {
  if (blocker.startsWith('env:')) {
    return {
      category: 'protected_prerequisite',
      label: blocker.slice('env:'.length),
      severity: 'blocking',
      protectedInputRequired: true,
      finalEvidenceRequired: false,
      operatorActionRequired: true,
      requiredCapabilities: ['protected_operator_input'],
    };
  }

  if (blocker.startsWith('evidence:')) {
    return {
      category: 'release_evidence',
      label: blocker.slice('evidence:'.length),
      severity: 'blocking',
      protectedInputRequired: true,
      finalEvidenceRequired: true,
      operatorActionRequired: true,
      requiredCapabilities: ['release_evidence'],
    };
  }

  return {
    category: 'unknown',
    label: blocker,
    severity: 'blocking',
    protectedInputRequired: false,
    finalEvidenceRequired: false,
    operatorActionRequired: true,
    requiredCapabilities: [],
  };
};

export const buildBlockerDetails = (blockers) => {
  const remediationByBlocker = new Map(
    buildRemediationHints(blockers).map((hint) => [hint.blocker, hint])
  );

  return blockers.map((blocker) => {
    const detail = blockerDetailCatalog[blocker] ?? fallbackBlockerDetail(blocker);
    return {
      blocker,
      ...detail,
      remediationAvailable: remediationByBlocker.has(blocker),
    };
  });
};

export const buildPreflightReport = ({
  options,
  buildInfo,
  publicSmoke,
  prerequisites,
  evidence,
  blockers,
}) => ({
  status: blockers.length > 0 ? 'blocked' : 'ready_for_protected_evidence',
  generatedAt: new Date().toISOString(),
  context: {
    apiBaseUrl: options.apiBaseUrl,
    webBaseUrl: options.webBaseUrl,
    expectedSha: options.expectedSha,
    today: options.today,
    buildInfoSkipped: Boolean(options.skipBuildInfo),
    publicSmokeSkipped: Boolean(options.skipPublicSmoke),
  },
  buildInfo: {
    state: buildInfo.skipped ? 'skipped' : buildInfo.ok ? 'pass' : 'blocked',
    exitCode: Number.isInteger(buildInfo.status) ? buildInfo.status : null,
  },
  publicSmoke: {
    state: publicSmoke.skipped ? 'skipped' : publicSmoke.ok ? 'pass' : 'blocked',
    exitCode: Number.isInteger(publicSmoke.status) ? publicSmoke.status : null,
  },
  prerequisites,
  evidence: evidence.evidence.map((row) => ({
    key: row.key,
    label: row.label,
    state: row.state,
    required: row.required,
    reason: row.reason,
    path: row.path,
    date: row.date,
  })),
  blockers,
  blockerDetails: buildBlockerDetails(blockers),
  remediation: buildRemediationHints(blockers),
  note:
    'Preflight JSON is not final V1 release evidence and contains env names/readiness only, not secret values.',
});

const writeJsonReport = async (outputPath, report) => {
  if (!outputPath) return;
  const absolutePath = path.resolve(process.cwd(), outputPath);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  process.stdout.write(`[ops:release:v1:preflight] JSON report: ${path.relative(process.cwd(), absolutePath)}\n`);
};

const markdownCell = (value) => String(value ?? '-').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');

const renderList = (items) => (items.length > 0 ? items.map((item) => `- ${item}`).join('\n') : '- none');

export const renderPreflightMarkdown = (report, jsonPath = '') => {
  const prerequisiteRows = [...report.prerequisites.required, ...report.prerequisites.optional]
    .map((group) => {
      const names = group.required ?? group.accepted ?? [];
      const state = group.ok
        ? 'pass'
        : group.satisfiedByEvidence
          ? 'satisfied_by_evidence'
          : 'missing';
      return `| ${markdownCell(group.key)} | ${state} | ${markdownCell(names.join('; '))} |`;
    })
    .join('\n');

  const evidenceRows = report.evidence
    .map(
      (row) =>
        `| ${markdownCell(row.label)} | ${markdownCell(row.state)} | ${row.required ? 'yes' : 'no'} | ${markdownCell(row.date)} | ${markdownCell(row.reason)} |`
    )
    .join('\n');

  const blockerRows = report.blockerDetails
    .map(
      (row) =>
        `| ${markdownCell(row.blocker)} | ${markdownCell(row.category)} | ${markdownCell(row.severity)} | ${row.protectedInputRequired ? 'yes' : 'no'} | ${row.finalEvidenceRequired ? 'yes' : 'no'} | ${row.remediationAvailable ? 'yes' : 'no'} |`
    )
    .join('\n');

  const nextActions = report.remediation.map((item) => {
    const inputs =
      Array.isArray(item.requiredInputs) && item.requiredInputs.length > 0
        ? ` Required inputs: ${item.requiredInputs.join('; ')}.`
        : '';
    return `${item.blocker}: ${item.action}${inputs}`;
  });

  return `# V1 Final Preflight Report

## Context
- Generated (UTC): ${report.generatedAt}
- Status: ${report.status}
- API base URL: ${report.context.apiBaseUrl}
- Web base URL: ${report.context.webBaseUrl}
- Expected SHA: ${report.context.expectedSha}
- Evidence date: ${report.context.today}
- Build-info: ${report.buildInfo.state}
- Public smoke: ${report.publicSmoke.state}
- Raw JSON: ${jsonPath || '-'}

## Protected Prerequisites
| Requirement | State | Accepted Inputs |
| --- | --- | --- |
${prerequisiteRows || '| - | - | - |'}

## Release Evidence
| Evidence | State | Required | Date | Notes |
| --- | --- | --- | --- | --- |
${evidenceRows || '| - | - | - | - | - |'}

## Blockers
${renderList(report.blockers)}

## Blocker Details
| Blocker | Category | Severity | Protected Input | Final Evidence | Next Action |
| --- | --- | --- | --- | --- | --- |
${blockerRows || '| - | - | - | - | - | - |'}

## Next Actions
${renderList(nextActions)}

## Note
${report.note}
`;
};

const writeMarkdownReport = async (outputPath, report, jsonOutputPath = '') => {
  if (!outputPath) return;
  const absolutePath = path.resolve(process.cwd(), outputPath);
  const jsonPath = jsonOutputPath ? path.relative(process.cwd(), path.resolve(process.cwd(), jsonOutputPath)) : '';
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, renderPreflightMarkdown(report, jsonPath), 'utf8');
  process.stdout.write(
    `[ops:release:v1:preflight] Markdown report: ${path.relative(process.cwd(), absolutePath)}\n`
  );
};

const runNodeScript = (scriptName, args, runner = spawnSync) =>
  runner(process.execPath, [path.join(SCRIPT_DIR, scriptName), ...args], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });

export const runBuildInfoWait = (options, runner = spawnSync) => {
  if (options.skipBuildInfo) {
    return { ok: true, skipped: true };
  }

  const args = [
    '--web-base-url',
    options.webBaseUrl,
    '--expected-sha',
    options.expectedSha,
    '--timeout-seconds',
    String(options.timeoutSeconds),
    '--interval-seconds',
    String(options.intervalSeconds),
  ];
  const result = runNodeScript('waitForWebBuildInfo.mjs', args, runner);
  return {
    ok: result.status === 0,
    skipped: false,
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
};

export const runPublicSmoke = (options, runner = spawnSync) => {
  if (options.skipPublicSmoke) {
    return { ok: true, skipped: true };
  }

  const args = [
    '--api-base-url',
    options.apiBaseUrl,
    '--web-base-url',
    options.webBaseUrl,
    '--no-workers',
  ];
  const result = runNodeScript('deploySmokeCheck.mjs', args, runner);
  return {
    ok: result.status === 0,
    skipped: false,
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
};

const main = async () => {
  const options = resolveOptions();
  if (options.help) {
    printUsage();
    return;
  }

  const blockers = [];
  process.stdout.write('[ops:release:v1:preflight] context\n');
  process.stdout.write(`- apiBaseUrl: ${options.apiBaseUrl}\n`);
  process.stdout.write(`- webBaseUrl: ${options.webBaseUrl}\n`);
  process.stdout.write(`- expectedSha: ${options.expectedSha}\n`);
  process.stdout.write(`- today: ${options.today}\n`);

  process.stdout.write('[ops:release:v1:preflight] build-info\n');
  const buildInfo = runBuildInfoWait(options);
  if (buildInfo.skipped) {
    process.stdout.write('- SKIPPED by --skip-build-info\n');
  } else if (buildInfo.ok) {
    process.stdout.write('- PASS deployed web build-info matches expected SHA\n');
  } else {
    process.stdout.write('- BLOCKED deployed web build-info did not match expected SHA\n');
    if (buildInfo.stdout) process.stdout.write(buildInfo.stdout);
    if (buildInfo.stderr) process.stdout.write(buildInfo.stderr);
    blockers.push('build-info');
  }

  process.stdout.write('[ops:release:v1:preflight] public smoke\n');
  const publicSmoke = runPublicSmoke(options);
  if (publicSmoke.skipped) {
    process.stdout.write('- SKIPPED by --skip-public-smoke\n');
  } else if (publicSmoke.ok) {
    process.stdout.write('- PASS public API/Web smoke\n');
  } else {
    process.stdout.write('- BLOCKED public API/Web smoke failed\n');
    if (publicSmoke.stdout) process.stdout.write(publicSmoke.stdout);
    if (publicSmoke.stderr) process.stdout.write(publicSmoke.stderr);
    blockers.push('public-smoke');
  }

  const evidence = await evaluateEvidenceReadiness({
    environment: 'prod',
    evidenceDir: path.resolve(process.cwd(), 'docs', 'operations'),
    today: options.today,
  });

  process.stdout.write('[ops:release:v1:preflight] protected prerequisites\n');
  const prerequisiteStatus = annotatePrerequisitesForEvidence(
    evaluatePrerequisiteGroups(process.env),
    evidence
  );
  for (const group of prerequisiteStatus.required) {
    if (group.ok) {
      process.stdout.write(`- PASS ${group.key}\n`);
    } else if (group.satisfiedByEvidence) {
      process.stdout.write(`- SATISFIED ${group.key}: fresh backup/restore drill evidence\n`);
    } else {
      process.stdout.write(`- MISSING ${group.key}: ${group.required.join('; ')}\n`);
    }
  }
  blockers.push(...buildPrerequisiteBlockers(prerequisiteStatus));

  for (const group of prerequisiteStatus.optional) {
    if (group.ok) {
      process.stdout.write(`- PRESENT optional ${group.key}\n`);
    } else {
      process.stdout.write(`- OPTIONAL ${group.key}: ${group.accepted.join('; ')}\n`);
    }
  }

  process.stdout.write('[ops:release:v1:preflight] release evidence\n');
  for (const row of evidence.evidence) {
    process.stdout.write(`- ${row.state.toUpperCase()} ${row.label}: ${row.reason}\n`);
  }
  if (!evidence.ready) {
    for (const blocker of evidence.blockers) blockers.push(`evidence:${blocker}`);
  }

  const report = buildPreflightReport({
    options,
    buildInfo,
    publicSmoke,
    prerequisites: prerequisiteStatus,
    evidence,
    blockers,
  });
  await writeJsonReport(options.jsonOutput, report);
  await writeMarkdownReport(options.markdownOutput, report, options.jsonOutput);

  if (blockers.length > 0) {
    process.stdout.write('[ops:release:v1:preflight] BLOCKED\n');
    for (const blocker of blockers) process.stdout.write(`- ${blocker}\n`);
    const remediation = buildRemediationHints(blockers);
    if (remediation.length > 0) {
      process.stdout.write('[ops:release:v1:preflight] next actions\n');
      for (const item of remediation) {
        process.stdout.write(`- ${item.blocker}: ${item.action}\n`);
      }
    }
    process.exit(1);
  }

  process.stdout.write('[ops:release:v1:preflight] READY_FOR_PROTECTED_EVIDENCE\n');
};

const isEntrypoint = () => {
  const entry = process.argv[1];
  if (!entry) return false;
  return path.resolve(entry) === path.resolve(fileURLToPath(import.meta.url));
};

if (isEntrypoint()) {
  main().catch((error) => {
    console.error(
      '[ops:release:v1:preflight] failed:',
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  });
}
