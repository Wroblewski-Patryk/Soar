import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import {
  buildProtectedInputReadinessMarkdown,
  evaluateProtectedInputReadiness,
  printUsage,
  writeOutput,
} from './checkProtectedInputReadiness.mjs';

const withTempDir = async (callback) => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'soar-protected-input-readiness-'));
  try {
    return await callback(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
};

test('evaluateProtectedInputReadiness reports blocked when no protected names exist', () => {
  const result = evaluateProtectedInputReadiness({
    env: {
      PATH: 'should-not-be-reported',
      NODE_ENV: 'test',
    },
    date: '2026-05-19',
    expectedSha: 'dd1a1faf79f8ac3581ca0a8c983481a3e30327ac',
    gitRef: 'main',
  });

  assert.equal(result.status, 'BLOCKED');
  assert.equal(result.matchingProtectedInputNamesPresent, 0);
  assert.equal(result.observedOutput, 'NO_MATCHING_PROTECTED_INPUT_NAMES_PRESENT');
  assert.equal(result.target.gitSha, 'dd1a1faf79f8ac3581ca0a8c983481a3e30327ac');
});

test('evaluateProtectedInputReadiness counts matching names without exposing values', () => {
  const result = evaluateProtectedInputReadiness({
    env: {
      LIVEIMPORT_READBACK_AUTH_TOKEN: 'secret-token',
      ROLLBACK_GUARD_AUTH_EMAIL: 'ops@example.invalid',
      ROLLBACK_GUARD_AUTH_PASSWORD: 'secret-password',
      PROD_DB_CHECK_CONTAINER: 'prod-db',
    },
    date: '2026-05-19',
  });

  assert.equal(result.status, 'PARTIAL');
  assert.equal(result.matchingProtectedInputNamesPresent, 4);
  assert.equal(
    result.families.find((family) => family.family === 'LIVEIMPORT_READBACK_*')?.matchingNamesPresent,
    1,
  );
  assert.equal(JSON.stringify(result).includes('secret-token'), false);
  assert.equal(JSON.stringify(result).includes('secret-password'), false);
  assert.equal(JSON.stringify(result).includes('ops@example.invalid'), false);
});

test('buildProtectedInputReadinessMarkdown includes counts but not values', () => {
  const result = evaluateProtectedInputReadiness({
    env: {
      PROD_UI_AUDIT_AUTH_TOKEN: 'secret-token',
    },
    date: '2026-05-19',
    expectedSha: 'dd1a1faf79f8ac3581ca0a8c983481a3e30327ac',
    buildInfoCheckedAt: '2026-05-19T04:11:46.793Z',
  });
  const markdown = buildProtectedInputReadinessMarkdown(result);

  assert.match(markdown, /Matching protected input names present: `1`/);
  assert.match(markdown, /\| `PROD_UI_AUDIT_\*` \| present \| 1 \|/);
  assert.equal(markdown.includes('secret-token'), false);
});

test('printUsage describes the no-secret CLI contract', () => {
  const originalLog = console.log;
  const messages = [];
  console.log = (message) => messages.push(String(message));
  try {
    printUsage();
  } finally {
    console.log = originalLog;
  }

  const output = messages.join('\n');
  assert.match(output, /Usage: node scripts\/checkProtectedInputReadiness\.mjs/);
  assert.match(output, /--json-output <path>/);
  assert.match(output, /It never prints or writes\nenvironment variable values/);
});

test('writeOutput creates parent directories and writes exact content', async () => {
  await withTempDir(async (dir) => {
    const outputPath = path.join(dir, 'nested', 'readiness.json');
    await writeOutput(outputPath, '{"status":"BLOCKED"}\n');

    assert.equal(await readFile(outputPath, 'utf8'), '{"status":"BLOCKED"}\n');
  });
});

test('CLI main writes no-secret JSON and markdown reports', async () => {
  await withTempDir(async (dir) => {
    const jsonOutput = path.join(dir, 'protected-input-readiness.json');
    const markdownOutput = path.join(dir, 'protected-input-readiness.md');
    const result = spawnSync(
      process.execPath,
      [
        'scripts/checkProtectedInputReadiness.mjs',
        '--today',
        '2026-06-07',
        '--expected-sha',
        'abcdef1234567890',
        '--git-ref',
        'main',
        '--build-info-checked-at',
        '2026-06-07T08:46:05.612Z',
        '--json-output',
        jsonOutput,
        '--markdown-output',
        markdownOutput,
        '--json',
      ],
      {
        encoding: 'utf8',
        env: {
          PATH: process.env.PATH,
          Path: process.env.Path,
          SystemRoot: process.env.SystemRoot,
          LIVEIMPORT_READBACK_AUTH_TOKEN: 'secret-token',
        },
      },
    );

    assert.equal(result.status, 0);
    assert.match(result.stdout, /"status": "PARTIAL"/);
    assert.equal(result.stdout.includes('secret-token'), false);

    const json = JSON.parse(await readFile(jsonOutput, 'utf8'));
    const markdown = await readFile(markdownOutput, 'utf8');
    assert.equal(json.target.gitSha, 'abcdef1234567890');
    assert.equal(json.matchingProtectedInputNamesPresent, 1);
    assert.equal(JSON.stringify(json).includes('secret-token'), false);
    assert.match(markdown, /Matching protected input names present: `1`/);
    assert.equal(markdown.includes('secret-token'), false);
  });
});
