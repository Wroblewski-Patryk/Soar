import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../', import.meta.url));
const dockerfiles = [
  'apps/api/Dockerfile',
  'apps/api/Dockerfile.worker.backtest',
  'apps/api/Dockerfile.worker.execution',
  'apps/api/Dockerfile.worker.market-data',
  'apps/api/Dockerfile.worker.market-stream',
];
const services = [
  'api',
  'workers-backtest',
  'workers-execution',
  'workers-market-data',
  'workers-market-stream',
];
const validSha = 'a'.repeat(40);
const malformedSha = `${validSha}\nEXTRA`;
const shell = process.platform === 'win32' && existsSync('C:/Program Files/Git/usr/bin/sh.exe')
  ? 'C:/Program Files/Git/usr/bin/sh.exe'
  : 'sh';

function guardFromDockerfile(dockerfile) {
  const source = readFileSync(new URL(`../${dockerfile}`, import.meta.url), 'utf8');
  const line = source.split(/\r?\n/).find((candidate) =>
    candidate.startsWith('RUN ') && candidate.includes('SOURCE_COMMIT must be'));
  assert.ok(line, `${dockerfile} must contain a SOURCE_COMMIT validation RUN`);
  return line.slice(4);
}

function runGuard(guard, sourceCommit) {
  const result = spawnSync(shell, ['-c', guard], {
    cwd: repoRoot,
    env: { ...process.env, SOURCE_COMMIT: sourceCommit },
    encoding: 'utf8',
  });
  assert.ifError(result.error);
  return result.status;
}

function composeConfig(sourceCommit) {
  const result = spawnSync('docker', [
    'compose', '--env-file', '.env.docker.example', '-f', 'docker-compose.vps.yml',
    '--profile', 'infra', 'config', '--format', 'json',
  ], {
    cwd: repoRoot,
    env: { ...process.env, SOURCE_COMMIT: sourceCommit },
    encoding: 'utf8',
  });
  assert.ifError(result.error);
  return result;
}

test('the five Dockerfile guards validate the entire SHA value', () => {
  const invalidValues = [
    '',
    'a'.repeat(39),
    'a'.repeat(41),
    `A${'a'.repeat(39)}`,
    `${'a'.repeat(39)}g`,
    `${'a'.repeat(39)}\n`,
    `${validSha}\r`,
    `${validSha} `,
    ` ${validSha}`,
    malformedSha,
  ];

  for (const dockerfile of dockerfiles) {
    const guard = guardFromDockerfile(dockerfile);
    assert.equal(runGuard(guard, validSha), 0, `${dockerfile} must accept a full lowercase SHA`);
    for (const value of invalidValues) {
      assert.notEqual(runGuard(guard, value), 0, `${dockerfile} accepted ${JSON.stringify(value)}`);
    }
  }
});

test('Compose passes the full value to every build and rejects an empty value', () => {
  for (const value of [validSha, malformedSha]) {
    const result = composeConfig(value);
    assert.equal(result.status, 0, result.stderr);
    const config = JSON.parse(result.stdout);
    for (const service of services) {
      assert.equal(config.services[service].build.args.SOURCE_COMMIT, value);
      assert.equal(runGuard(guardFromDockerfile(config.services[service].build.dockerfile), value),
        value === validSha ? 0 : 1);
    }
  }

  assert.notEqual(composeConfig('').status, 0);
});
