import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  asIsoTimestamp,
  main as summarizeMain,
  parseArgs as parseSummaryArgs,
  parseGateLabel,
  parseStatusGeneratedAt,
  resolveDocsRoot as resolveSummaryDocsRoot,
} from './summarizeRcGates.mjs';
import {
  escapeRegExp,
  extractValueAfterLabel,
  getGateLabel,
  main as syncMain,
  parseArgs as parseSyncArgs,
  parseSignoff,
  refreshLatestVerificationDate,
  refreshOutstandingExternalGates,
  refreshExpectedSha,
  resolveDocsRoot as resolveSyncDocsRoot,
  resolveDate,
  setChecklistCheckbox,
} from './syncRcChecklistFromGateStatus.mjs';

const statusFixture = `# RC External Gates

Generated at (UTC): 2026-06-11T03:00:00.000Z

- Gate 1 (backup): PASS
- Gate 2 (production): OPEN
- Gate 3 (incident): pass
- Gate 4 (approval): BLOCKED
`;

test('summarizeRcGates helpers parse gate labels and timestamp freshness inputs', () => {
  assert.equal(parseGateLabel(statusFixture, 1), 'PASS');
  assert.equal(parseGateLabel(statusFixture, 4), 'BLOCKED');
  assert.equal(parseGateLabel(statusFixture, 9), 'UNKNOWN');
  assert.equal(parseStatusGeneratedAt(statusFixture), '2026-06-11T03:00:00.000Z');
  assert.equal(asIsoTimestamp('not-a-date'), null);
  assert.equal(asIsoTimestamp('2026-06-11T03:00:00.000Z'), Date.parse('2026-06-11T03:00:00.000Z'));
});

test('summarizeRcGates resolves docs root and parses injected argv without process state', () => {
  const cwd = path.join(tmpdir(), 'soar-fixture');
  assert.equal(
    resolveSummaryDocsRoot({
      cwd,
      existsSyncImpl: (target) => target.endsWith(path.join('docs', 'operations')),
    }),
    path.join(cwd, 'docs'),
  );

  assert.deepEqual(parseSummaryArgs(['--json', '--status-path', 'status.md'], { cwd, docsRoot: path.join(cwd, 'docs') }), {
    statusPath: path.join(cwd, 'status.md'),
    evidencePath: path.join(cwd, 'history', 'operations', '_artifacts-rc-evidence-check-latest.json'),
    json: true,
  });
});

test('summarizeRcGates main renders stale evidence summary from fixture files', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'rc-summary-'));
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
    const result = await summarizeMain({
      argv: ['--status-path', statusPath, '--evidence-path', evidencePath, '--json'],
      consoleImpl: { log: (message) => logs.push(message) },
      now: () => new Date('2026-06-11T04:00:00.000Z'),
    });

    assert.equal(result.summary.evidenceFreshness, 'stale_relative_to_status');
    assert.equal(result.summary.missingEvidenceCount, 2);
    assert.equal(result.summary.gates.gate3, 'pass');
    assert.match(logs[0], /"strictPassed": false/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('syncRcChecklist helpers parse signoff and update exact checkbox labels', () => {
  const signoff = `# Signoff
- Engineering sign-off:
  - Name: Ada
- Product sign-off:
  - Name:
- Operations sign-off:
  - Name: Ops
- RC owner with rollback authority:
  - Name: Owner
`;
  assert.deepEqual(parseSignoff(signoff), {
    engineeringSigned: true,
    productSigned: false,
    operationsSigned: true,
    ownerAssigned: true,
  });
  assert.equal(getGateLabel(statusFixture, 3), 'PASS');
  assert.equal(extractValueAfterLabel('Expected SHA: abc123', 'Expected SHA:'), 'abc123');
  assert.equal(escapeRegExp('A+B?'), 'A\\+B\\?');
  assert.equal(setChecklistCheckbox('- [ ] Engineering sign-off.', 'Engineering sign-off.', true), '- [x] Engineering sign-off.');
  assert.match(refreshExpectedSha('### Latest Verification (2026-06-10)\n', 'abc123'), /Expected SHA: `abc123`/);
});

test('syncRcChecklist helpers refresh date, expected SHA, and outstanding gate snapshot text', () => {
  const checklist = `# Checklist
### Latest Verification (2026-06-10)
Expected SHA: \`old\`
## Outstanding External Gates (2026-06-10)
- current snapshot is \`G1=OPEN\`, \`G2=OPEN\`, \`G3=OPEN\`, \`G4=OPEN\` (synced 2026-06-10).
`;

  assert.equal(resolveDate('2026-06-11'), '2026-06-11');
  assert.match(resolveDate('not-a-date'), /^\d{4}-\d{2}-\d{2}$/);
  assert.match(refreshLatestVerificationDate(checklist, '2026-06-11'), /### Latest Verification \(2026-06-11\)/);
  assert.match(refreshExpectedSha(checklist, 'abc123'), /Expected SHA: `abc123`/);
  assert.match(
    refreshOutstandingExternalGates(checklist, '2026-06-11', 'PASS', 'OPEN', 'PASS', 'BLOCKED'),
    /`G1=PASS`, `G2=OPEN`, `G3=PASS`, `G4=BLOCKED` \(synced 2026-06-11\)/,
  );
});

test('syncRcChecklist main writes date, expected SHA, gate snapshot, and signoff checkboxes', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'rc-checklist-'));
  try {
    const statusPath = path.join(dir, 'status.md');
    const signoffPath = path.join(dir, 'signoff.md');
    const checklistPath = path.join(dir, 'checklist.md');
    await writeFile(statusPath, statusFixture);
    await writeFile(
      signoffPath,
      `- Engineering sign-off:
  - Name: Ada
- Product sign-off:
  - Name:
- Operations sign-off:
  - Name: Ops
- RC owner with rollback authority:
  - Name: Owner
`,
    );
    await writeFile(
      checklistPath,
      `# Checklist
### Latest Verification (2026-06-10)
Expected SHA: \`old\`
## Outstanding External Gates (2026-06-10)
- current snapshot is \`G1=OPEN\`, \`G2=OPEN\`, \`G3=OPEN\`, \`G4=OPEN\` (synced 2026-06-10).
- [ ] Queue lag metrics reviewed and within baseline.
- [ ] Incident contacts and escalation chain confirmed.
- [ ] Backup snapshot created and restore path validated.
- [ ] Engineering sign-off.
- [x] Product sign-off.
- [ ] Operations sign-off.
- [ ] RC owner assigned with rollback authority.
`,
    );

    await syncMain({
      argv: [
        '--status-path',
        statusPath,
        '--signoff-path',
        signoffPath,
        '--checklist-path',
        checklistPath,
        '--today',
        '2026-06-11',
        '--expected-sha',
        'abc123',
      ],
      consoleImpl: { log: () => {} },
    });

    const nextChecklist = await readFile(checklistPath, 'utf8');
    assert.match(nextChecklist, /### Latest Verification \(2026-06-11\)/);
    assert.match(nextChecklist, /Expected SHA: `abc123`/);
    assert.match(nextChecklist, /`G1=PASS`, `G2=OPEN`, `G3=PASS`, `G4=BLOCKED`/);
    assert.match(nextChecklist, /- \[ \] Queue lag metrics reviewed and within baseline\./);
    assert.match(nextChecklist, /- \[x\] Incident contacts and escalation chain confirmed\./);
    assert.match(nextChecklist, /- \[x\] Backup snapshot created and restore path validated\./);
    assert.match(nextChecklist, /- \[x\] Engineering sign-off\./);
    assert.match(nextChecklist, /- \[ \] Product sign-off\./);
    assert.match(nextChecklist, /- \[x\] Operations sign-off\./);
    assert.match(nextChecklist, /- \[x\] RC owner assigned with rollback authority\./);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('syncRcChecklist parseArgs uses injected defaults without reading process argv', () => {
  const cwd = path.join(tmpdir(), 'soar-fixture');
  assert.equal(
    resolveSyncDocsRoot({
      cwd,
      existsSyncImpl: (target) => target.endsWith(path.join('docs', 'operations')),
    }),
    path.join(cwd, 'docs'),
  );

  assert.deepEqual(parseSyncArgs(['--today', '2026-06-11', '--expected-sha', 'abc123'], { cwd, docsRoot: path.join(cwd, 'docs') }), {
    statusPath: path.join(cwd, 'docs', 'operations', 'v1-rc-external-gates-status.md'),
    signoffPath: path.join(cwd, 'docs', 'operations', 'v1-rc-signoff-record.md'),
    checklistPath: path.join(cwd, 'docs', 'operations', 'v1-release-candidate-checklist.md'),
    today: '2026-06-11',
    expectedSha: 'abc123',
  });
});
