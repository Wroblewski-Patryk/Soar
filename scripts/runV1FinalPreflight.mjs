#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { evaluateEvidenceReadiness } from './runV1ReleaseGate.mjs';

const DEFAULT_API_BASE_URL = 'https://api.soar.luckysparrow.ch';
const DEFAULT_WEB_BASE_URL = 'https://soar.luckysparrow.ch';

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

export const runBuildInfoWait = (options) => {
  if (options.skipBuildInfo) {
    return { ok: true, skipped: true };
  }

  const args = [
    'run',
    'ops:deploy:wait-web-build-info',
    '--',
    '--web-base-url',
    options.webBaseUrl,
    '--expected-sha',
    options.expectedSha,
    '--timeout-seconds',
    String(options.timeoutSeconds),
    '--interval-seconds',
    String(options.intervalSeconds),
  ];
  const result = spawnSync('pnpm', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
  return {
    ok: result.status === 0,
    skipped: false,
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
};

export const runPublicSmoke = (options) => {
  if (options.skipPublicSmoke) {
    return { ok: true, skipped: true };
  }

  const args = [
    'run',
    'ops:deploy:smoke',
    '--',
    '--api-base-url',
    options.apiBaseUrl,
    '--web-base-url',
    options.webBaseUrl,
    '--no-workers',
  ];
  const result = spawnSync('pnpm', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
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

  process.stdout.write('[ops:release:v1:preflight] protected prerequisites\n');
  const prerequisiteStatus = evaluatePrerequisiteGroups(process.env);
  for (const group of prerequisiteStatus.required) {
    if (group.ok) {
      process.stdout.write(`- PASS ${group.key}\n`);
    } else {
      process.stdout.write(`- MISSING ${group.key}: ${group.required.join('; ')}\n`);
      blockers.push(`env:${group.key}`);
    }
  }

  for (const group of prerequisiteStatus.optional) {
    if (group.ok) {
      process.stdout.write(`- PRESENT optional ${group.key}\n`);
    } else {
      process.stdout.write(`- OPTIONAL ${group.key}: ${group.accepted.join('; ')}\n`);
    }
  }

  const evidence = await evaluateEvidenceReadiness({
    environment: 'prod',
    evidenceDir: path.resolve(process.cwd(), 'docs', 'operations'),
    today: options.today,
  });

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

  if (blockers.length > 0) {
    process.stdout.write('[ops:release:v1:preflight] BLOCKED\n');
    for (const blocker of blockers) process.stdout.write(`- ${blocker}\n`);
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
