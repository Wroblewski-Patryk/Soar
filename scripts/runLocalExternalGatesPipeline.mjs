#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import {
  buildOpsRequestHeaders,
  resolveOpsAuthLayerOptions,
} from './buildOpsRequestHeaders.mjs';
import { resolveOpsAuthToken } from './resolveOpsAuthToken.mjs';

const ALLOWED_ENVIRONMENTS = new Set(['local', 'stage', 'production']);
const ALLOWED_DB_PROFILES = new Set(['local', 'stage', 'prod']);
const SECRET_CLI_FLAGS = new Set([
  '--auth-token',
  '--auth-password',
  '--ops-basic-password',
  '--ops-auth-header-value',
]);

const normalizeEnvironment = (value) => {
  const normalized = String(value ?? '').trim().toLowerCase();
  if (ALLOWED_ENVIRONMENTS.has(normalized)) return normalized;
  return 'local';
};

const normalizeDbProfile = (value) => {
  const normalized = String(value ?? '').trim().toLowerCase();
  if (ALLOWED_DB_PROFILES.has(normalized)) return normalized;
  return 'local';
};

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    baseUrl: process.env.SLO_BASE_URL ?? 'http://localhost:4001',
    durationMinutes: process.env.SLO_DURATION_MINUTES ?? '5',
    intervalSeconds: process.env.SLO_INTERVAL_SECONDS ?? '15',
    authToken: process.env.SLO_AUTH_TOKEN ?? '',
    authEmail: process.env.SLO_AUTH_EMAIL ?? '',
    authPassword: process.env.SLO_AUTH_PASSWORD ?? '',
    opsAuthHeaderName: process.env.SLO_OPS_AUTH_HEADER_NAME ?? '',
    opsAuthHeaderValue: process.env.SLO_OPS_AUTH_HEADER_VALUE ?? '',
    opsBasicUser: process.env.SLO_OPS_BASIC_USER ?? '',
    opsBasicPassword: process.env.SLO_OPS_BASIC_PASSWORD ?? '',
    environment: normalizeEnvironment(process.env.SLO_ENVIRONMENT ?? 'local'),
    dbProfile: normalizeDbProfile(process.env.RC_GATES_DB_PROFILE ?? 'local'),
    allowLocalProductionEvidence: false,
    skipDbCheck: false,
    allowOffline: false,
    skipSloCollect: false,
    skipWindowReport: false,
    skipChecklistSync: false,
    skipEvidenceCheck: false,
    strictEvidenceCheck: false,
    requireProductionGate2: false,
    evidenceOutput: 'docs/operations/_artifacts-rc-evidence-check-latest.json',
    windowDays: [7, 30],
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      return options;
    }
    if (SECRET_CLI_FLAGS.has(arg)) {
      throw new Error(`${arg} is secret-bearing and must be provided through SLO_* environment variables`);
    }
    if (arg === '--base-url') options.baseUrl = args[index + 1] ?? options.baseUrl;
    if (arg === '--duration-minutes') options.durationMinutes = args[index + 1] ?? options.durationMinutes;
    if (arg === '--interval-seconds') options.intervalSeconds = args[index + 1] ?? options.intervalSeconds;
    if (arg === '--auth-email') options.authEmail = args[index + 1] ?? options.authEmail;
    if (arg === '--ops-auth-header-name') {
      options.opsAuthHeaderName = args[index + 1] ?? options.opsAuthHeaderName;
    }
    if (arg === '--ops-basic-user') options.opsBasicUser = args[index + 1] ?? options.opsBasicUser;
    if (arg === '--environment') options.environment = normalizeEnvironment(args[index + 1] ?? options.environment);
    if (arg === '--db-profile') options.dbProfile = normalizeDbProfile(args[index + 1] ?? options.dbProfile);
    if (arg === '--allow-local-production-evidence') options.allowLocalProductionEvidence = true;
    if (arg === '--skip-db-check') options.skipDbCheck = true;
    if (arg === '--allow-offline') options.allowOffline = true;
    if (arg === '--skip-slo-collect') options.skipSloCollect = true;
    if (arg === '--skip-window-report') options.skipWindowReport = true;
    if (arg === '--skip-checklist-sync') options.skipChecklistSync = true;
    if (arg === '--skip-evidence-check') options.skipEvidenceCheck = true;
    if (arg === '--strict-evidence-check') options.strictEvidenceCheck = true;
    if (arg === '--require-production-gate2') options.requireProductionGate2 = true;
    if (arg === '--evidence-output') options.evidenceOutput = args[index + 1] ?? options.evidenceOutput;
    if (arg === '--window-days') {
      const raw = args[index + 1] ?? '';
      options.windowDays = raw
        .split(',')
        .map((value) => Number.parseInt(value.trim(), 10))
        .filter((value) => Number.isFinite(value) && value > 0);
    }
  }

  return options;
};

const run = (label, command, args, env = {}) => {
  console.log(`[ops:rc:gates:local] ${label}`);
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, ...env },
  });
  if (result.status !== 0) {
    throw new Error(`${label} failed with exit code ${result.status ?? 1}`);
  }
};

const hasSloInputs = async () => {
  const operationsDir = path.resolve(process.cwd(), 'docs', 'operations');
  try {
    const entries = await readdir(operationsDir);
    return entries.some(
      (name) =>
        (name.startsWith('_artifacts-slo-window-') && name.endsWith('.json')) ||
        (name.startsWith('v1-slo-window-report-') && name.endsWith('.json'))
    );
  } catch {
    return false;
  }
};

const buildStatusWithOfflineFallback = async (allowOffline) => {
  if (allowOffline) {
    const hasInputs = await hasSloInputs();
    if (!hasInputs) {
      console.log(
        '[ops:rc:gates:local] no SLO artifacts found; using template-only status snapshot (offline mode).'
      );
      run('build RC external gates status (template-only)', 'pnpm', [
        'run',
        'ops:rc:gates:status',
        '--',
        '--template-only',
      ]);
      return;
    }
  }

  try {
    run('build RC external gates status', 'pnpm', ['run', 'ops:rc:gates:status']);
  } catch (error) {
    if (!allowOffline) {
      throw error;
    }
    console.log(
      '[ops:rc:gates:local] unable to build status from SLO artifacts; falling back to template-only snapshot.'
    );
    run('build RC external gates status (template-only)', 'pnpm', [
      'run',
      'ops:rc:gates:status',
      '--',
      '--template-only',
    ]);
  }
};

const canReachApi = async (baseUrl, authToken, authLayer) => {
  try {
    const headers = buildOpsRequestHeaders({
      token: authToken,
      ...authLayer,
    });
    const res = await fetch(`${baseUrl}/health`, { headers });
    return res.ok;
  } catch {
    return false;
  }
};

const main = () => {
  let options;
  try {
    options = parseArgs();
  } catch (error) {
    console.error('[ops:rc:gates:local] failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
  if (options.help) {
    console.log(
      'Usage: node scripts/runLocalExternalGatesPipeline.mjs [--base-url <url>] [--duration-minutes <n>] [--interval-seconds <n>] [--auth-email <email>] [--ops-basic-user <user>] [--ops-auth-header-name <name>] [--environment <local|stage|production>] [--db-profile <local|stage|prod>] [--allow-local-production-evidence] [--skip-db-check] [--skip-slo-collect] [--skip-window-report] [--skip-checklist-sync] [--skip-evidence-check] [--strict-evidence-check] [--require-production-gate2] [--evidence-output <file>] [--window-days <csv>] [--allow-offline]\n\nSecret-bearing values must be provided through SLO_AUTH_TOKEN, SLO_AUTH_PASSWORD, SLO_OPS_BASIC_PASSWORD, and SLO_OPS_AUTH_HEADER_VALUE.'
    );
    process.exit(0);
  }
  const authLayer = resolveOpsAuthLayerOptions({
    opsAuthHeaderName: options.opsAuthHeaderName,
    opsAuthHeaderValue: options.opsAuthHeaderValue,
    opsBasicUser: options.opsBasicUser,
    opsBasicPassword: options.opsBasicPassword,
  });

  Promise.resolve()
    .then(async () => {
      let resolvedAuthToken = String(options.authToken ?? '').trim();
      if (!options.skipSloCollect) {
        const resolvedAuth = await resolveOpsAuthToken({
          baseUrl: options.baseUrl,
          authToken: resolvedAuthToken,
          authEmail: options.authEmail,
          authPassword: options.authPassword,
          ...authLayer,
          contextLabel: 'ops:rc:gates:local-pipeline',
        });
        resolvedAuthToken = resolvedAuth.token;
      }

      if (!options.skipDbCheck) {
        run(`restore-drill evidence (${options.dbProfile} profile)`, 'pnpm', [
          'run',
          'ops:db:restore-drill',
          '--',
          '--profile',
          options.dbProfile,
        ]);
      }

      if (!options.skipSloCollect) {
        const reachable = await canReachApi(options.baseUrl, resolvedAuthToken, authLayer);
        if (!reachable) {
          if (!options.allowOffline) {
            throw new Error(
              `API health check failed for ${options.baseUrl}. Start API or rerun with --allow-offline to generate template-only status.`
            );
          }
          console.log(
            `[ops:rc:gates:local] API unavailable at ${options.baseUrl}; using template-only RC status output.`
          );
          run('build RC external gates status (template-only)', 'pnpm', [
            'run',
            'ops:rc:gates:status',
            '--',
            '--template-only',
          ]);
          if (!options.skipChecklistSync) {
            run('sync RC checklist from gate status', 'pnpm', ['run', 'ops:rc:checklist:sync']);
          }
          if (!options.skipEvidenceCheck) {
            const evidenceArgs = [
              'run',
              'ops:rc:gates:evidence:check',
              '--',
              '--json',
              '--output',
              options.evidenceOutput,
            ];
            if (options.strictEvidenceCheck) {
              evidenceArgs.push('--strict');
            }
            if (options.requireProductionGate2) {
              evidenceArgs.push('--require-production-gate2');
            }
            run('check missing external evidence', 'pnpm', evidenceArgs);
          }
          console.log('[ops:rc:gates:local] done (offline mode)');
          return;
        }

        const sloArgs = [
          'run',
          'ops:slo:collect',
          '--',
          '--base-url',
          options.baseUrl,
          '--duration-minutes',
          String(options.durationMinutes),
          '--interval-seconds',
          String(options.intervalSeconds),
          '--environment',
          String(options.environment),
        ];
        if (options.allowLocalProductionEvidence) {
          sloArgs.push('--allow-local-production-evidence');
        }
        run('SLO observation collector', 'pnpm', sloArgs, {
          ...(resolvedAuthToken ? { SLO_AUTH_TOKEN: resolvedAuthToken } : {}),
          ...(authLayer.opsBasicUser ? { SLO_OPS_BASIC_USER: authLayer.opsBasicUser } : {}),
          ...(authLayer.opsBasicPassword
            ? { SLO_OPS_BASIC_PASSWORD: authLayer.opsBasicPassword }
            : {}),
          ...(authLayer.opsAuthHeaderName
            ? { SLO_OPS_AUTH_HEADER_NAME: authLayer.opsAuthHeaderName }
            : {}),
          ...(authLayer.opsAuthHeaderValue
            ? { SLO_OPS_AUTH_HEADER_VALUE: authLayer.opsAuthHeaderValue }
            : {}),
        });

        if (!options.skipWindowReport) {
          for (const days of options.windowDays) {
            run(`SLO rolling window report (${days}d)`, 'pnpm', [
              'run',
              'ops:slo:window-report',
              '--',
              '--window-days',
              String(days),
            ]);
          }
        }
      }

      await buildStatusWithOfflineFallback(options.allowOffline);
      if (!options.skipChecklistSync) {
        run('sync RC checklist from gate status', 'pnpm', ['run', 'ops:rc:checklist:sync']);
      }
      if (!options.skipEvidenceCheck) {
        const evidenceArgs = [
          'run',
          'ops:rc:gates:evidence:check',
          '--',
          '--json',
          '--output',
          options.evidenceOutput,
        ];
        if (options.strictEvidenceCheck) {
          evidenceArgs.push('--strict');
        }
        if (options.requireProductionGate2) {
          evidenceArgs.push('--require-production-gate2');
        }
        run('check missing external evidence', 'pnpm', evidenceArgs);
      }
      console.log('[ops:rc:gates:local] done');
    })
    .catch((error) => {
      console.error('[ops:rc:gates:local] failed:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    });
};

main();
