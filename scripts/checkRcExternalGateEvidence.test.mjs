import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  capture,
  extractEvidenceValues,
  main,
  parseArgs,
  parseGateLabel,
  parseSignoffFields,
  resolveDocsRoot,
} from './checkRcExternalGateEvidence.mjs';

const withTempDir = async (callback) => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'soar-rc-external-gate-evidence-'));
  try {
    return await callback(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
};

const createConsoleCapture = () => {
  const lines = [];
  return {
    consoleImpl: {
      log: (...args) => lines.push(args.join(' ')),
    },
    lines,
  };
};

const statusMarkdown = `
# V1 RC External Gates Status

- Gate 1 (Backup Snapshot and Restore Validation): PASS
- Gate 2 (Production Smoke Approval): LOCAL_PASS pending protected smoke
- Gate 3 (Incident Contacts and Escalation Confirmation): PASS
- Gate 4 (Final RC Sign-off): PASS
`;

const completeRunbookMarkdown = `
# V1 RC External Gates Runbook

## Gate 1: Backup Snapshot and Restore Validation

Evidence to record:
- Snapshot artifact: history/evidence/snapshot.md
- Restore validation: history/evidence/restore.md

## Gate 3: Incident Contacts and Escalation Confirmation

Evidence to record:
- Primary contact: ops@example.invalid
- Escalation route: docs/operations/service-reliability-and-observability.md
`;

const completeSignoffMarkdown = `
# V1 RC Signoff Record

- Engineering sign-off:
  - Name: Eng Owner
- Product sign-off:
  - Name: Product Owner
- Operations sign-off:
  - Name: Ops Owner
- RC owner with rollback authority:
  - Name: Release Owner
- RC status: \`APPROVED\`
`;

const writeEvidenceFiles = async (dir, { status = statusMarkdown, runbook = completeRunbookMarkdown, signoff = completeSignoffMarkdown } = {}) => {
  const statusPath = path.join(dir, 'status.md');
  const runbookPath = path.join(dir, 'runbook.md');
  const signoffPath = path.join(dir, 'signoff.md');
  await Promise.all([
    writeFile(statusPath, status),
    writeFile(runbookPath, runbook),
    writeFile(signoffPath, signoff),
  ]);
  return { statusPath, runbookPath, signoffPath };
};

test('resolveDocsRoot returns the docs directory that owns operations docs', async () => {
  await withTempDir(async (dir) => {
    await mkdir(path.join(dir, 'docs', 'operations'), { recursive: true });
    await writeFile(path.join(dir, 'docs', 'operations', 'README.md'), 'ops');

    assert.equal(resolveDocsRoot(dir), path.join(dir, 'docs'));
  });
});

test('parseArgs resolves custom evidence paths and production gate policy', () => {
  const options = parseArgs(
    [
      '--status-path',
      'status.md',
      '--runbook-path',
      'runbook.md',
      '--signoff-path',
      'signoff.md',
      '--json',
      '--output',
      'out.json',
      '--strict',
      '--require-production-gate2',
    ],
    'C:/tmp/soar-rc-check'
  );

  assert.equal(options.statusPath, path.resolve('C:/tmp/soar-rc-check', 'status.md'));
  assert.equal(options.runbookPath, path.resolve('C:/tmp/soar-rc-check', 'runbook.md'));
  assert.equal(options.signoffPath, path.resolve('C:/tmp/soar-rc-check', 'signoff.md'));
  assert.equal(options.output, path.resolve('C:/tmp/soar-rc-check', 'out.json'));
  assert.equal(options.json, true);
  assert.equal(options.strict, true);
  assert.equal(options.requireProductionGate2, true);
});

test('extractEvidenceValues captures filled and missing evidence fields', () => {
  const evidence = extractEvidenceValues(
    `
## Gate 1: Backup Snapshot and Restore Validation

Evidence to record:
- Snapshot artifact: history/evidence/snapshot.md
- Restore validation:

## Gate 3: Incident Contacts and Escalation Confirmation
`,
    '## Gate 1: Backup Snapshot and Restore Validation'
  );

  assert.deepEqual(evidence, [
    { label: 'Snapshot artifact', value: 'history/evidence/snapshot.md', filled: true },
    { label: 'Restore validation', value: '', filled: false },
  ]);
});

test('parseGateLabel, capture, and parseSignoffFields read gate status and sign-off names', () => {
  assert.equal(parseGateLabel(statusMarkdown, 2), 'LOCAL_PASS pending protected smoke');
  assert.equal(capture(completeSignoffMarkdown, /- RC status:\s*`([^`]+)`/i), 'APPROVED');
  assert.deepEqual(parseSignoffFields(completeSignoffMarkdown), {
    engineering: 'Eng Owner',
    product: 'Product Owner',
    operations: 'Ops Owner',
    owner: 'Release Owner',
    rcStatus: 'APPROVED',
  });
});

test('main passes local gate2 policy, writes JSON output, and reports no missing evidence', async () => {
  await withTempDir(async (dir) => {
    const { statusPath, runbookPath, signoffPath } = await writeEvidenceFiles(dir);
    const outputPath = path.join(dir, 'rc-evidence.json');
    const { consoleImpl, lines } = createConsoleCapture();

    const result = await main({
      args: [
        '--status-path',
        statusPath,
        '--runbook-path',
        runbookPath,
        '--signoff-path',
        signoffPath,
        '--output',
        outputPath,
      ],
      consoleImpl,
      exitOnHelp: false,
      exitOnStrictFailure: false,
    });

    assert.equal(result.strictPassed, true);
    assert.equal(result.gate2Policy, 'PASS_OR_LOCAL_PASS');
    assert.equal(result.counts.missing, 0);
    assert.match(lines.join('\n'), /Missing evidence: none/);

    const written = JSON.parse(await readFile(outputPath, 'utf8'));
    assert.equal(written.strictPassed, true);
    assert.equal(written.counts.gate1EvidenceFields, 2);
  });
});

test('main strict mode fails closed when required evidence or production gate2 is missing', async () => {
  await withTempDir(async (dir) => {
    const { statusPath, runbookPath, signoffPath } = await writeEvidenceFiles(dir, {
      status: statusMarkdown.replace('LOCAL_PASS pending protected smoke', 'OPEN'),
      runbook: completeRunbookMarkdown.replace('history/evidence/restore.md', ''),
      signoff: completeSignoffMarkdown.replace('Ops Owner', ''),
    });

    await assert.rejects(
      () =>
        main({
          args: [
            '--status-path',
            statusPath,
            '--runbook-path',
            runbookPath,
            '--signoff-path',
            signoffPath,
            '--strict',
            '--require-production-gate2',
          ],
          consoleImpl: createConsoleCapture().consoleImpl,
          exitOnHelp: false,
          exitOnStrictFailure: false,
        }),
      (error) => {
        assert.match(error.message, /RC external gate evidence is incomplete/);
        assert.match(error.result.missing.join('\n'), /Gate2 status is not PASS/);
        assert.match(error.result.missing.join('\n'), /Gate1 evidence missing: Restore validation/);
        assert.match(error.result.missing.join('\n'), /Gate4 sign-off missing: Operations name/);
        return true;
      }
    );
  });
});
