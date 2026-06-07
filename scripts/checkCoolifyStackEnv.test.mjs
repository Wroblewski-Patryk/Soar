import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
  evaluateCoolifyStackEnv,
  formatCoolifyStackEnvReport,
  parseDotEnv,
} from './checkCoolifyStackEnv.mjs';

test('parseDotEnv reads unquoted and quoted values', () => {
  const env = parseDotEnv(`
    FOO=bar
    QUOTED="hello world"
    # ignored
  `);

  assert.equal(env.FOO, 'bar');
  assert.equal(env.QUOTED, 'hello world');
});

test('evaluateCoolifyStackEnv fails missing required names without printing values', () => {
  const result = evaluateCoolifyStackEnv({
    env: {
      SOURCE_COMMIT: 'abc123',
    },
    requiredKeys: ['SOURCE_COMMIT', 'DATABASE_URL'],
    recommendedKeys: ['JWT_SECRET'],
  });

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.missingRequired, ['DATABASE_URL']);
  assert.deepEqual(result.missingRecommended, ['JWT_SECRET']);
  assert.deepEqual(result.valueIssues, [
    {
      key: 'SOURCE_COMMIT',
      reason: 'must be a full 40-character git SHA',
    },
  ]);

  const report = formatCoolifyStackEnvReport(result);
  assert.match(report, /DATABASE_URL/);
  assert.doesNotMatch(report, /abc123/);
});

test('evaluateCoolifyStackEnv trims process env values before presence checks', () => {
  const result = evaluateCoolifyStackEnv({
    env: {
      JWT_SECRET: '   ',
    },
    requiredKeys: ['JWT_SECRET'],
    recommendedKeys: [],
  });

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.missingRequired, ['JWT_SECRET']);
});

test('evaluateCoolifyStackEnv rejects invalid deploy-safety value shapes', () => {
  const result = evaluateCoolifyStackEnv({
    env: {
      SOURCE_COMMIT: 'abc123',
      DATABASE_URL: 'https://not-postgres.invalid',
      REDIS_URL: 'postgresql://not-redis.invalid',
      JWT_SECRET: 'short',
      API_KEY_ENCRYPTION_KEYS: 'broken-entry,v1:short',
      API_KEY_ENCRYPTION_ACTIVE_VERSION: 'v2',
      SERVER_URL: 'http://api.soar.luckysparrow.ch',
    },
    requiredKeys: [
      'SOURCE_COMMIT',
      'DATABASE_URL',
      'REDIS_URL',
      'JWT_SECRET',
      'API_KEY_ENCRYPTION_KEYS',
      'API_KEY_ENCRYPTION_ACTIVE_VERSION',
    ],
    recommendedKeys: ['SERVER_URL'],
  });

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(
    result.valueIssues.map((issue) => issue.key),
    [
      'SOURCE_COMMIT',
      'DATABASE_URL',
      'REDIS_URL',
      'JWT_SECRET',
      'API_KEY_ENCRYPTION_KEYS',
      'API_KEY_ENCRYPTION_KEYS',
      'API_KEY_ENCRYPTION_ACTIVE_VERSION',
      'SERVER_URL',
    ]
  );
});

test('evaluateCoolifyStackEnv reports routing, enum, and keyring safety issues without values', () => {
  const result = evaluateCoolifyStackEnv({
    env: {
      API_KEY_ENCRYPTION_KEYS: 'v1:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      API_KEY_ENCRYPTION_ACTIVE_VERSION: 'v3',
      CLIENT_URL: 'ftp://soar.luckysparrow.ch',
      CORS_ORIGINS: 'https://soar.luckysparrow.ch,http://api.soar.luckysparrow.ch',
      COOKIE_SAME_SITE: 'wide-open',
      WORKER_MODE: 'combined',
      WORKER_MARKET_DATA_OWNERSHIP: 'api',
    },
    requiredKeys: [
      'API_KEY_ENCRYPTION_KEYS',
      'API_KEY_ENCRYPTION_ACTIVE_VERSION',
      'WORKER_MODE',
      'WORKER_MARKET_DATA_OWNERSHIP',
    ],
    recommendedKeys: ['CLIENT_URL', 'CORS_ORIGINS', 'COOKIE_SAME_SITE'],
  });

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.valueIssues, [
    {
      key: 'API_KEY_ENCRYPTION_KEYS',
      reason: 'must use generated high-entropy key material',
    },
    {
      key: 'API_KEY_ENCRYPTION_ACTIVE_VERSION',
      reason: 'must point to a version present in API_KEY_ENCRYPTION_KEYS',
    },
    {
      key: 'CLIENT_URL',
      reason: 'must be a valid https URL',
    },
    {
      key: 'CORS_ORIGINS',
      reason: 'must be a valid https URL',
    },
    {
      key: 'WORKER_MODE',
      reason: 'must be one of: split',
    },
    {
      key: 'WORKER_MARKET_DATA_OWNERSHIP',
      reason: 'must be one of: worker',
    },
    {
      key: 'COOKIE_SAME_SITE',
      reason: 'must be one of: lax, strict, none',
    },
  ]);

  const report = formatCoolifyStackEnvReport(result);
  assert.match(report, /variable names with deploy-safety shape issues/);
  assert.doesNotMatch(report, /aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/);
});

test('evaluateCoolifyStackEnv rejects recommended placeholders in strict mode', () => {
  const result = evaluateCoolifyStackEnv({
    env: {
      SOURCE_COMMIT: '0123456789abcdef0123456789abcdef01234567',
      SERVER_URL: 'https://example.com',
    },
    requiredKeys: ['SOURCE_COMMIT'],
    recommendedKeys: ['SERVER_URL'],
  });

  assert.equal(result.status, 'FAIL');
  assert.deepEqual(result.placeholderRecommended, ['SERVER_URL']);
});

test('evaluateCoolifyStackEnv accepts a valid production-shaped stack env', () => {
  const env = {
    SOURCE_COMMIT: '0123456789abcdef0123456789abcdef01234567',
    SERVICE_FQDN_API_3001: 'https://api.soar.luckysparrow.ch',
    SERVICE_FQDN_WEB_3002: 'https://soar.luckysparrow.ch',
    DATABASE_URL: 'postgresql://user:pass@postgres:5432/soar',
    REDIS_URL: 'redis://redis:6379',
    JWT_SECRET: 'jwt-primary-generated-material-32-plus',
    API_KEY_ENCRYPTION_KEYS: 'v1:encryption-key-one-generated-material-32-plus',
    API_KEY_ENCRYPTION_ACTIVE_VERSION: 'v1',
    SERVER_URL: 'https://api.soar.luckysparrow.ch',
    CLIENT_URL: 'https://soar.luckysparrow.ch',
    CORS_ORIGINS: 'https://soar.luckysparrow.ch,https://api.soar.luckysparrow.ch',
    NEXT_PUBLIC_API_BASE_URL: 'https://api.soar.luckysparrow.ch',
    WORKER_MODE: 'split',
    WORKER_MARKET_DATA_OWNERSHIP: 'worker',
    WORKER_BACKTEST_OWNERSHIP: 'worker',
  };

  const result = evaluateCoolifyStackEnv({
    env,
    requiredKeys: Object.keys(env).filter(
      (key) => !['SERVER_URL', 'CLIENT_URL', 'CORS_ORIGINS', 'NEXT_PUBLIC_API_BASE_URL'].includes(key)
    ),
    recommendedKeys: ['SERVER_URL', 'CLIENT_URL', 'CORS_ORIGINS', 'NEXT_PUBLIC_API_BASE_URL'],
  });

  assert.equal(result.status, 'PASS');
  assert.deepEqual(result.valueIssues, []);
});

test('CLI rejects stack env file flag without a path', () => {
  const result = spawnSync(
    process.execPath,
    ['scripts/checkCoolifyStackEnv.mjs', '--stack-env-file', '--json'],
    {
      encoding: 'utf8',
    }
  );

  assert.equal(result.status, 2);
  assert.match(result.stderr, /Missing value for --stack-env-file/);
});

test('CLI prints usage without evaluating the process environment', () => {
  const result = spawnSync(process.execPath, ['scripts/checkCoolifyStackEnv.mjs', '--help'], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Usage: node scripts\/checkCoolifyStackEnv\.mjs/);
  assert.equal(result.stderr, '');
});

test('CLI loads a stack env file and emits redacted JSON on success', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'soar-coolify-env-'));
  const envPath = path.join(tempDir, '.env.coolify');
  fs.writeFileSync(
    envPath,
    [
      'SOURCE_COMMIT=0123456789abcdef0123456789abcdef01234567',
      'SOURCE_BRANCH=main',
      'COOLIFY_BRANCH=main',
      'SERVICE_FQDN_API_3001=https://api.soar.luckysparrow.ch',
      'SERVICE_FQDN_WEB_3002=https://soar.luckysparrow.ch',
      'DATABASE_URL=postgresql://user:pass@postgres:5432/soar',
      'REDIS_URL=redis://redis:6379',
      'JWT_SECRET=jwt-primary-generated-material-32-plus',
      'API_KEY_ENCRYPTION_KEYS=v1:encryption-key-one-generated-material-32-plus',
      'API_KEY_ENCRYPTION_ACTIVE_VERSION=v1',
      'WORKER_MODE=split',
      'WORKER_MARKET_DATA_OWNERSHIP=worker',
      'WORKER_BACKTEST_OWNERSHIP=worker',
      'WORKER_MARKET_DATA_QUEUE=market-data',
      'WORKER_BACKTEST_QUEUE=backtest',
      'WORKER_EXECUTION_QUEUE=execution',
    ].join('\n')
  );

  try {
    const result = spawnSync(
      process.execPath,
      ['scripts/checkCoolifyStackEnv.mjs', '--stack-env-file', envPath, '--json'],
      {
        encoding: 'utf8',
      }
    );

    assert.equal(result.status, 0);
    const parsed = JSON.parse(result.stdout);
    assert.equal(parsed.status, 'PASS');
    assert.equal(parsed.secretHandling, 'values redacted; only variable names are reported');
    assert.doesNotMatch(result.stdout, /jwt-primary-generated-material/);
    assert.equal(result.stderr, '');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('evaluateCoolifyStackEnv rejects placeholders unless allowed', () => {
  const env = {
    SOURCE_COMMIT: 'CHANGEME_EXPECTED_GIT_SHA',
    DATABASE_URL: 'postgresql://prod',
  };

  const strictResult = evaluateCoolifyStackEnv({
    env,
    requiredKeys: ['SOURCE_COMMIT', 'DATABASE_URL'],
    recommendedKeys: [],
  });
  assert.equal(strictResult.status, 'FAIL');
  assert.deepEqual(strictResult.placeholderRequired, ['SOURCE_COMMIT']);

  const exampleResult = evaluateCoolifyStackEnv({
    env,
    allowPlaceholders: true,
    requiredKeys: ['SOURCE_COMMIT', 'DATABASE_URL'],
    recommendedKeys: [],
  });
  assert.equal(exampleResult.status, 'PASS');
});
