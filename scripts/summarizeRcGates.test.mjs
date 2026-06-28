import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  asIsoTimestamp,
  main,
  parseArgs,
  parseGateLabel,
  parseStatusGeneratedAt,
  resolveDocsRoot,
} from './summarizeRcGates.mjs';

const statusFixture = `# RC External Gates

Generated at (UTC): 2026-06-11T03:00:00.000Z

- Gate 1 (backup): PASS
- Gate 2 (production): OPEN
- Gate 3 (incident): pass
- Gate 4 (approval): BLOCKED
`;

test('parseGateLabel and parseStatusGeneratedAt read RC gate markdown deterministically', () => {
  assert.equal(parseGateLabel(statusFixture, 1), 'PASS');
  assert.equal(parseGateLabel(statusFixture, 3), 'pass');
  assert.equal(parseGateLabel(statusFixture, 9), 'UNKNOWN');
  assert.equal(parseStatusGeneratedAt(statusFixture), '2026-06-11T03:00:00.000Z');
  assert.equal(asIsoTimestamp('not-a-date'), null);
  assert.equal(asIsoTimestamp('2026-06-11T03:00:00.000Z'), Date.parse('2026-06-11T03:00:00.000Z'));
});

test('parseArgs resolves docs defaults from injected cwd', () => {
  const cwd = path.join(tmpdir(), 'soar-rc-summary');
  assert.equal(
    resolveDocsRoot({
      cwd,
      existsSyncImpl: (target) => target.endsWith(path.join('docs', 'operations')),
    }),
    path.join(cwd, 'docs'),
  );

  assert.deepEqual(parseArgs(['--json', '--status-path', 'status.md'], { cwd, docsRoot: path.join(cwd, 'docs') }), {
    statusPath: path.join(cwd, 'status.md'),
    evidencePath: path.join(cwd, 'history', 'operations', '_artifacts-rc-evidence-check-latest.json'),
    json: true,
  });
});

test('main summarizes stale evidence without running protected gates', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'soar-rc-summary-'));
  try {
    const statusPath = path.join(dir, 'status.md');
    const evidencePath = path.join(dir, 'evidence.json');
    await writeFile(statusPath, statusFixture);
    await writeFile(
      evidencePath,
      JSON.stringify({
        generatedAt: '2026-06-11T02:00:00.000Z',
        counts: { missing: 2 },
        strictPassed: false,
        gate2Policy: 'require-production-gate2',
      }),
    );

    const logs = [];
    const result = await main({
      argv: ['--status-path', statusPath, '--evidence-path', evidencePath, '--json'],
      consoleImpl: { log: (message) => logs.push(message) },
      now: () => new Date('2026-06-11T04:00:00.000Z'),
    });

    assert.equal(result.summary.evidenceFreshness, 'stale_relative_to_status');
    assert.equal(result.summary.missingEvidenceCount, 2);
    assert.match(logs.join('\n'), /"strictPassed": false/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
