#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REQUIRED_KEYS = [
  'SOURCE_COMMIT',
  'SOURCE_BRANCH',
  'COOLIFY_BRANCH',
  'SERVICE_FQDN_API_3001',
  'SERVICE_FQDN_WEB_3002',
  'DATABASE_URL',
  'REDIS_URL',
  'JWT_SECRET',
  'API_KEY_ENCRYPTION_KEYS',
  'API_KEY_ENCRYPTION_ACTIVE_VERSION',
  'WORKER_MODE',
  'WORKER_MARKET_DATA_OWNERSHIP',
  'WORKER_BACKTEST_OWNERSHIP',
  'WORKER_MARKET_DATA_QUEUE',
  'WORKER_BACKTEST_QUEUE',
  'WORKER_EXECUTION_QUEUE',
];

const RECOMMENDED_KEYS = [
  'SERVER_URL',
  'CLIENT_URL',
  'CORS_ORIGINS',
  'NEXT_PUBLIC_API_BASE_URL',
  'COOKIE_DOMAIN',
  'COOKIE_SAME_SITE',
  'API_NODE_OPTIONS',
  'WEB_NODE_OPTIONS',
  'WORKER_NODE_OPTIONS',
  'MARKET_STREAM_NODE_OPTIONS',
  'MARKET_STREAM_MARKET_TYPE',
  'MARKET_STREAM_INTERVALS',
  'MARKET_STREAM_SYMBOLS',
  'RUNTIME_SCAN_INTERVAL_MS',
  'RUNTIME_SCAN_MAX_SYMBOLS',
  'RUNTIME_SIGNAL_LOOP_BOOTSTRAP_INTERVAL_MS',
];

const PLACEHOLDER_RE = /(?:^|[_=:])CHANGEME|CHANGEME_|_CHANGEME|example\.com|EXPECTED_GIT_SHA/i;
const SECRETISH_RE = /(?:SECRET|PASSWORD|TOKEN|KEY|DATABASE_URL|REDIS_URL|AUTH)/i;

const rawArgs = process.argv.slice(2);

const hasFlag = (flag) => rawArgs.includes(flag);

const readArgValue = (flag) => {
  const index = rawArgs.indexOf(flag);
  if (index === -1) return '';
  return rawArgs[index + 1] ?? '';
};

export const parseDotEnv = (content) => {
  const values = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const equalsIndex = line.indexOf('=');
    if (equalsIndex === -1) continue;
    const key = line.slice(0, equalsIndex).trim();
    let value = line.slice(equalsIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }
  return values;
};

const loadEnv = ({ envFile }) => {
  if (!envFile) return { ...process.env };
  const absolutePath = path.resolve(process.cwd(), envFile);
  return parseDotEnv(fs.readFileSync(absolutePath, 'utf8'));
};

const isPlaceholderValue = (value) => PLACEHOLDER_RE.test(String(value ?? ''));

export const evaluateCoolifyStackEnv = ({
  env,
  allowPlaceholders = false,
  requiredKeys = REQUIRED_KEYS,
  recommendedKeys = RECOMMENDED_KEYS,
} = {}) => {
  const missingRequired = [];
  const placeholderRequired = [];
  const missingRecommended = [];
  const presentRequired = [];

  for (const key of requiredKeys) {
    const value = env[key];
    if (!value) {
      missingRequired.push(key);
      continue;
    }
    presentRequired.push(key);
    if (!allowPlaceholders && isPlaceholderValue(value)) {
      placeholderRequired.push(key);
    }
  }

  for (const key of recommendedKeys) {
    if (!env[key]) missingRecommended.push(key);
  }

  const status =
    missingRequired.length === 0 && placeholderRequired.length === 0 ? 'PASS' : 'FAIL';

  return {
    status,
    presentRequiredCount: presentRequired.length,
    requiredCount: requiredKeys.length,
    missingRequired,
    placeholderRequired,
    missingRecommended,
    secretHandling: 'values redacted; only variable names are reported',
  };
};

export const formatCoolifyStackEnvReport = (result) => {
  const lines = [
    '[coolify-stack-env] summary',
    `- status: ${result.status}`,
    `- required present: ${result.presentRequiredCount}/${result.requiredCount}`,
    `- secret handling: ${result.secretHandling}`,
  ];

  if (result.missingRequired.length > 0) {
    lines.push('- missing required variable names:');
    result.missingRequired.forEach((key) => lines.push(`  - ${key}`));
  }

  if (result.placeholderRequired.length > 0) {
    lines.push('- required variable names still using placeholder values:');
    result.placeholderRequired.forEach((key) => lines.push(`  - ${key}`));
  }

  if (result.missingRecommended.length > 0) {
    lines.push('- missing recommended variable names:');
    result.missingRecommended.forEach((key) => lines.push(`  - ${key}`));
  }

  const secretishMissing = [
    ...result.missingRequired,
    ...result.placeholderRequired,
    ...result.missingRecommended,
  ].filter((key) => SECRETISH_RE.test(key));
  if (secretishMissing.length > 0) {
    lines.push('- note: secret-like values were not printed');
  }

  return `${lines.join('\n')}\n`;
};

const printUsage = () => {
  process.stdout.write(`Usage: node scripts/checkCoolifyStackEnv.mjs [--env-file <path>] [--allow-placeholders] [--json]

Checks whether the Coolify Service Stack has the variable names needed for a
safe Soar stack deployment. Values are never printed.
`);
};

const main = () => {
  if (hasFlag('--help') || hasFlag('-h')) {
    printUsage();
    return;
  }

  const envFile = readArgValue('--env-file');
  const result = evaluateCoolifyStackEnv({
    env: loadEnv({ envFile }),
    allowPlaceholders: hasFlag('--allow-placeholders'),
  });

  if (hasFlag('--json')) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else {
    process.stdout.write(formatCoolifyStackEnvReport(result));
  }

  if (result.status !== 'PASS') process.exit(1);
};

const isDirectRun = process.argv[1]
  ? path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

if (isDirectRun) {
  main();
}
