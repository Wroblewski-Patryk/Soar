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
const FULL_SHA_RE = /^[0-9a-f]{40}$/i;
const ROUTING_KEYS = new Set([
  'SERVER_URL',
  'CLIENT_URL',
  'CORS_ORIGINS',
  'NEXT_PUBLIC_API_BASE_URL',
  'SERVICE_FQDN_API_3001',
  'SERVICE_FQDN_WEB_3002',
]);
const WEAK_SECRET_VALUES = [
  'change-me',
  'changeme',
  'password',
  'secret',
  'replace-me',
  'replace-with-secret',
  'replace-with-generated-secret',
  'change-me-32-byte-secret',
];

const rawArgs = process.argv.slice(2);

const hasFlag = (flag) => rawArgs.includes(flag);

const readArgValue = (flag) => {
  const index = rawArgs.indexOf(flag);
  if (index === -1) return '';
  const value = rawArgs[index + 1] ?? '';
  if (!value || value.startsWith('--')) {
    throw new Error(`Missing value for ${flag}`);
  }
  return value;
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

const normalizeValue = (value) => String(value ?? '').trim();

const looksWeakSecret = (value, minimumLength) => {
  const normalized = normalizeValue(value).toLowerCase();
  if (normalized.length < minimumLength) return true;
  if (WEAK_SECRET_VALUES.some((weak) => normalized.includes(weak))) return true;
  if (/^(.)\1+$/.test(normalized)) return true;
  return false;
};

const isValidUrl = (value, { protocols }) => {
  try {
    const parsed = new URL(value);
    return protocols.includes(parsed.protocol);
  } catch {
    return false;
  }
};

const parseKeyringVersions = (raw) => {
  const entries = normalizeValue(raw)
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
  const versions = new Set();
  const issues = [];

  for (const entry of entries) {
    const separatorIndex = entry.indexOf(':');
    const version = separatorIndex > 0 ? entry.slice(0, separatorIndex).trim() : '';
    const material = separatorIndex > 0 ? entry.slice(separatorIndex + 1).trim() : '';
    if (!version || !material) {
      issues.push('must contain comma-separated version:key entries');
      continue;
    }
    versions.add(version);
    if (looksWeakSecret(material, 32)) {
      issues.push('must use generated high-entropy key material');
    }
  }

  return { versions, issues };
};

const buildValueIssues = (env, { allowPlaceholders, requiredKeys, recommendedKeys }) => {
  const issues = [];
  const get = (key) => normalizeValue(env[key]);
  const add = (key, reason) => issues.push({ key, reason });
  const shouldSkipPlaceholder = (key) => allowPlaceholders && isPlaceholderValue(get(key));

  if (requiredKeys.includes('SOURCE_COMMIT') && get('SOURCE_COMMIT') && !shouldSkipPlaceholder('SOURCE_COMMIT')) {
    if (!FULL_SHA_RE.test(get('SOURCE_COMMIT'))) {
      add('SOURCE_COMMIT', 'must be a full 40-character git SHA');
    }
  }

  if (requiredKeys.includes('DATABASE_URL') && get('DATABASE_URL') && !shouldSkipPlaceholder('DATABASE_URL')) {
    if (!isValidUrl(get('DATABASE_URL'), { protocols: ['postgresql:', 'postgres:'] })) {
      add('DATABASE_URL', 'must be a valid postgres/postgresql URL');
    }
  }

  if (requiredKeys.includes('REDIS_URL') && get('REDIS_URL') && !shouldSkipPlaceholder('REDIS_URL')) {
    if (!isValidUrl(get('REDIS_URL'), { protocols: ['redis:', 'rediss:'] })) {
      add('REDIS_URL', 'must be a valid redis/rediss URL');
    }
  }

  if (requiredKeys.includes('JWT_SECRET') && get('JWT_SECRET') && !shouldSkipPlaceholder('JWT_SECRET')) {
    if (looksWeakSecret(get('JWT_SECRET'), 32)) {
      add('JWT_SECRET', 'must use generated high-entropy material');
    }
  }

  if (
    requiredKeys.includes('API_KEY_ENCRYPTION_KEYS') &&
    get('API_KEY_ENCRYPTION_KEYS') &&
    !shouldSkipPlaceholder('API_KEY_ENCRYPTION_KEYS')
  ) {
    const { versions, issues: keyringIssues } = parseKeyringVersions(get('API_KEY_ENCRYPTION_KEYS'));
    for (const reason of keyringIssues) add('API_KEY_ENCRYPTION_KEYS', reason);
    const activeVersion = get('API_KEY_ENCRYPTION_ACTIVE_VERSION') || 'v1';
    if (activeVersion && versions.size > 0 && !versions.has(activeVersion)) {
      add('API_KEY_ENCRYPTION_ACTIVE_VERSION', 'must point to a version present in API_KEY_ENCRYPTION_KEYS');
    }
  }

  for (const key of [...requiredKeys, ...recommendedKeys]) {
    const value = get(key);
    if (!value || !ROUTING_KEYS.has(key) || shouldSkipPlaceholder(key)) continue;
    const values = key === 'CORS_ORIGINS' ? value.split(',').map((part) => part.trim()) : [value];
    if (values.some((part) => !isValidUrl(part, { protocols: ['https:'] }))) {
      add(key, 'must be a valid https URL');
    }
  }

  const enumRules = [
    ['WORKER_MODE', ['split']],
    ['WORKER_MARKET_DATA_OWNERSHIP', ['worker']],
    ['WORKER_BACKTEST_OWNERSHIP', ['worker']],
    ['COOKIE_SAME_SITE', ['lax', 'strict', 'none']],
  ];
  for (const [key, allowed] of enumRules) {
    const value = get(key);
    if (!value || shouldSkipPlaceholder(key)) continue;
    if (!allowed.includes(value.toLowerCase())) add(key, `must be one of: ${allowed.join(', ')}`);
  }

  return issues;
};

export const evaluateCoolifyStackEnv = ({
  env,
  allowPlaceholders = false,
  requiredKeys = REQUIRED_KEYS,
  recommendedKeys = RECOMMENDED_KEYS,
} = {}) => {
  const missingRequired = [];
  const placeholderRequired = [];
  const placeholderRecommended = [];
  const missingRecommended = [];
  const presentRequired = [];

  for (const key of requiredKeys) {
    const value = normalizeValue(env[key]);
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
    const value = normalizeValue(env[key]);
    if (!value) {
      missingRecommended.push(key);
      continue;
    }
    if (!allowPlaceholders && isPlaceholderValue(value)) {
      placeholderRecommended.push(key);
    }
  }

  const valueIssues = buildValueIssues(env, { allowPlaceholders, requiredKeys, recommendedKeys });
  const status =
    missingRequired.length === 0 &&
    placeholderRequired.length === 0 &&
    placeholderRecommended.length === 0 &&
    valueIssues.length === 0
      ? 'PASS'
      : 'FAIL';

  return {
    status,
    presentRequiredCount: presentRequired.length,
    requiredCount: requiredKeys.length,
    missingRequired,
    placeholderRequired,
    placeholderRecommended,
    missingRecommended,
    valueIssues,
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

  if (result.placeholderRecommended.length > 0) {
    lines.push('- recommended variable names still using placeholder values:');
    result.placeholderRecommended.forEach((key) => lines.push(`  - ${key}`));
  }

  if (result.valueIssues.length > 0) {
    lines.push('- variable names with deploy-safety shape issues:');
    result.valueIssues.forEach((issue) => lines.push(`  - ${issue.key}: ${issue.reason}`));
  }

  if (result.missingRecommended.length > 0) {
    lines.push('- missing recommended variable names:');
    result.missingRecommended.forEach((key) => lines.push(`  - ${key}`));
  }

  const secretishMissing = [
    ...result.missingRequired,
    ...result.placeholderRequired,
    ...result.placeholderRecommended,
    ...result.missingRecommended,
    ...result.valueIssues.map((issue) => issue.key),
  ].filter((key) => SECRETISH_RE.test(key));
  if (secretishMissing.length > 0) {
    lines.push('- note: secret-like values were not printed');
  }

  return `${lines.join('\n')}\n`;
};

const printUsage = () => {
  process.stdout.write(`Usage: node scripts/checkCoolifyStackEnv.mjs [--stack-env-file <path>] [--allow-placeholders] [--json]

Checks whether the Coolify Service Stack has the variable names needed for a
safe Soar stack deployment. Values are never printed.
`);
};

const main = () => {
  if (hasFlag('--help') || hasFlag('-h')) {
    printUsage();
    return;
  }

  let envFile = '';
  try {
    envFile = readArgValue('--stack-env-file') || readArgValue('--env-file');
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    printUsage();
    process.exit(2);
  }
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
