import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  escapeRegExp,
  extractValueAfterLabel,
  getGateLabel,
  main,
  parseArgs,
  parseSignoff,
  refreshExpectedSha,
  refreshLatestVerificationDate,
  refreshOutstandingExternalGates,
  resolveDate,
  resolveDocsRoot,
  setChecklistCheckbox,
} from './syncRcChecklistFromGateStatus.mjs';

const statusFixture = `# RC External Gates

- Gate 1 (backup): PASS
- Gate 2 (production): OPEN
- Gate 3 (incident): pass
- Gate 4 (approval): BLOCKED
`;

test('parser helpers read gate labels, signoff names, and exact checkbox labels', () => {
  const signoff = `- Engineering sign-off:
  - Name: Ada
- Product sign-off:
  - Name:
- Operations sign-off:
  - Name: Ops
- RC owner with rollback authority:
  - Name: Owner
`;
  assert.equal(getGateLabel(statusFixture, 3), 'PASS');
  assert.deepEqual(parseSignoff(signoff), {
    engineeringSigned: true,
    productSigned: false,
    operationsSigned: true,
    ownerAssigned: true,
  });
  assert.equal(extractValueAfterLabel('Expected SHA: abc123', 'Expected SHA:'), 'abc123');
  assert.equal(escapeRegExp('A+B?'), 'A\\+B\\?');
  assert.equal(setChecklistCheckbox('- [ ] Engineering sign-off.', 'Engineering sign-off.', true), '- [x] Engineering sign-off.');
});

test('markdown mutators refresh verification date, expected SHA, and gate snapshot', () => {
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

test('parseArgs resolves injected docs defaults', () => {
  const cwd = path.join(tmpdir(), 'soar-rc-checklist');
  assert.equal(
    resolveDocsRoot({
      cwd,
      existsSyncImpl: (target) => target.endsWith(path.join('docs', 'operations')),
    }),
    path.join(cwd, 'docs'),
  );
  assert.equal(
    parseArgs(['--today', '2026-06-11'], { cwd, docsRoot: path.join(cwd, 'docs') }).checklistPath,
    path.join(cwd, 'docs', 'operations', 'v1-release-candidate-checklist.md'),
  );
});

test('main updates checklist from fixture files without protected operations', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'soar-rc-checklist-'));
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

    await main({
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
    assert.match(nextChecklist, /Expected SHA: `abc123`/);
    assert.match(nextChecklist, /- \[x\] Backup snapshot created and restore path validated\./);
    assert.match(nextChecklist, /- \[ \] Product sign-off\./);
    assert.match(nextChecklist, /- \[x\] RC owner assigned with rollback authority\./);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
