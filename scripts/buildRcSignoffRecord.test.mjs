import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  approvalLine,
  evaluateSignoff,
  listMissingApproverFields,
  listRecommendedSignoffFields,
  loadGateStatuses,
  main,
  ownerBlock,
  parseArgs,
  parseGateLine,
  render,
  resolveDocsRoot,
  resolveTimestamp,
} from './buildRcSignoffRecord.mjs';

const withTempDir = async (callback) => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'soar-rc-signoff-'));
  try {
    return await callback(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
};

test('parses RC signoff CLI options and timestamp overrides', () => {
  const options = parseArgs([
    '--release-target',
    'v1.2.3',
    '--status-path',
    'tmp/status.md',
    '--output',
    'tmp/signoff.md',
    '--engineering-name',
    'Engineering Owner',
    '--product-name',
    'Product Owner',
    '--operations-name',
    'Ops Owner',
    '--owner-name',
    'Release Owner',
    '--owner-contact',
    'ops@example.test',
    '--today',
    '2026-06-07',
    '--expected-sha',
    'abc123',
  ]);

  assert.equal(options.releaseTarget, 'v1.2.3');
  assert.equal(options.engineeringName, 'Engineering Owner');
  assert.equal(options.ownerContact, 'ops@example.test');
  assert.equal(options.expectedSha, 'abc123');
  assert.equal(resolveTimestamp(options.today), '2026-06-07T00:00:00.000Z');
  assert.equal(path.basename(resolveDocsRoot()), 'docs');
});

test('loads gate statuses from current external gate status lines', async () => {
  await withTempDir(async (dir) => {
    const statusPath = path.join(dir, 'status.md');
    await writeFile(
      statusPath,
      [
        '# Gate Status',
        '- Gate 1 (Backup snapshot + restore validation): PASS',
        '- Gate 2 (Queue-lag baseline review): LOCAL_PASS (local evidence; production pending)',
        '- Gate 3 (Incident contacts + escalation confirmation): BLOCKED (missing contacts)',
        '- Gate 4 (Formal RC sign-offs): OPEN',
      ].join('\n'),
      'utf8',
    );

    assert.equal(parseGateLine('- Gate 2 (Queue-lag baseline review): LOCAL_PASS (local)'), 'LOCAL_PASS');
    assert.equal(parseGateLine('- not a gate'), null);
    assert.deepEqual(await loadGateStatuses(statusPath), {
      statuses: ['PASS', 'LOCAL_PASS', 'BLOCKED', 'OPEN'],
      allPass: false,
    });
  });
});

test('evaluates required and recommended signoff fields fail-closed', () => {
  const baseOptions = {
    engineeringName: 'Engineering Owner',
    productName: 'Product Owner',
    operationsName: '',
    ownerName: 'Release Owner',
    ownerContact: '',
  };
  const gates = { statuses: ['PASS', 'PASS', 'PASS', 'OPEN'] };

  assert.deepEqual(listMissingApproverFields(baseOptions), ['Operations name (--operations-name)']);
  assert.deepEqual(listRecommendedSignoffFields(baseOptions), ['RC owner contact (--owner-contact)']);
  assert.deepEqual(evaluateSignoff(baseOptions, gates), {
    prerequisiteGatesPass: true,
    missingApproverFields: ['Operations name (--operations-name)'],
    missingRecommendedFields: ['RC owner contact (--owner-contact)'],
    rcStatus: 'BLOCKED',
  });

  assert.equal(
    evaluateSignoff({ ...baseOptions, operationsName: 'Ops Owner' }, gates).rcStatus,
    'APPROVED',
  );
  assert.equal(evaluateSignoff({ ...baseOptions, operationsName: 'Ops Owner' }, { statuses: ['PASS', 'OPEN', 'PASS'] }).rcStatus, 'BLOCKED');
});

test('renders approver lines, owner block, and final signoff record content', () => {
  const options = {
    releaseTarget: 'v1.0.0',
    statusPath: path.resolve('docs/operations/v1-rc-external-gates-status.md'),
    expectedSha: 'abc123',
    engineeringName: 'Engineering Owner',
    productName: 'Product Owner',
    operationsName: 'Ops Owner',
    ownerName: 'Release Owner',
    ownerContact: '',
    today: '2026-06-07',
  };
  const gates = { statuses: ['PASS', 'PASS', 'PASS', 'OPEN'] };

  assert.match(approvalLine('Engineering', '', '2026-06-07T00:00:00.000Z'), /Name:\n  - UTC timestamp:/);
  assert.match(ownerBlock('Release Owner', '', '2026-06-07T00:00:00.000Z'), /Contact: TBD/);

  const output = render(options, gates);
  assert.match(output, /# V1 RC Sign-Off Record/);
  assert.match(output, /Expected SHA: `abc123`/);
  assert.match(output, /Gates 1-3 pass: yes/);
  assert.match(output, /RC status: `APPROVED`/);
});

test('main writes a signoff record without executing protected release actions', async () => {
  await withTempDir(async (dir) => {
    const statusPath = path.join(dir, 'status.md');
    const outputPath = path.join(dir, 'signoff.md');
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(
      statusPath,
      [
        '- Gate 1 (Backup snapshot + restore validation): PASS',
        '- Gate 2 (Queue-lag baseline review): PASS',
        '- Gate 3 (Incident contacts + escalation confirmation): PASS',
        '- Gate 4 (Formal RC sign-offs): OPEN',
      ].join('\n'),
      'utf8',
    );

    await main([
      '--status-path',
      statusPath,
      '--output',
      outputPath,
      '--engineering-name',
      'Engineering Owner',
      '--product-name',
      'Product Owner',
      '--operations-name',
      'Ops Owner',
      '--owner-name',
      'Release Owner',
      '--today',
      '2026-06-07',
    ]);

    const written = await readFile(outputPath, 'utf8');
    assert.match(written, /Date \(UTC\): `2026-06-07T00:00:00.000Z`/);
    assert.match(written, /RC status: `APPROVED`/);
  });
});
