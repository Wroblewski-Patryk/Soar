import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  buildScorecard,
  latestLedgerPath,
  main,
  parseArgs,
  percent,
  printHelp,
  readJson,
  relativePath,
  renderMarkdown,
  renderTable,
  riskWeight,
  summarizeRows,
  toPosixPath,
  weightedAverage,
} from './buildV1CompletionScorecard.mjs';

const withTempDir = async (callback) => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'soar-v1-scorecard-'));
  try {
    return await callback(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
};

const writeLedger = async (dir, overrides = {}) => {
  const ledgerPath = path.join(dir, 'v1-master-state-ledger-test.json');
  const ledger = {
    moduleLedger: [
      {
        module: 'Dashboard Home',
        priority: 1,
        risk: 'P0 operator truth surface',
        status: 'PASS',
        bucket: 'done',
        nextProof: 'Accepted local and release proof',
      },
      {
        module: 'Bot Runtime',
        priority: 2,
        risk: 'P0 runtime truth',
        status: 'BLOCKED_AUTH',
        bucket: 'blocked',
        nextProof: 'Protected auth proof | production readback',
      },
      {
        module: 'Reports',
        priority: 14,
        risk: 'P2 operator reporting',
        status: 'PASS_LOCAL',
        bucket: 'local-proof',
        nextProof: 'Production clickthrough',
      },
    ],
    concreteNonProofGaps: [{ id: 'GAP-1', title: 'Repair confirmed release evidence gap' }],
    ...overrides,
  };
  await writeFile(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`, 'utf8');
  return ledgerPath;
};

test('parses V1 completion scorecard CLI options and default outputs', () => {
  const defaults = parseArgs(['--today', '2026-06-07']);
  assert.equal(defaults.today, '2026-06-07');
  assert.equal(defaults.markdownOutput, 'history/releases/v1-completion-scorecard-2026-06-07.md');
  assert.equal(defaults.jsonOutput, 'history/releases/v1-completion-scorecard-2026-06-07.json');

  const options = parseArgs([
    '--today',
    '2026-06-08',
    '--ledger',
    'tmp/ledger.json',
    '--markdown-output',
    'tmp/scorecard.md',
    '--json-output',
    'tmp/scorecard.json',
    '--help',
  ]);

  assert.equal(options.today, '2026-06-08');
  assert.equal(options.ledger, 'tmp/ledger.json');
  assert.equal(options.markdownOutput, 'tmp/scorecard.md');
  assert.equal(options.jsonOutput, 'tmp/scorecard.json');
  assert.equal(options.help, true);
});

test('scores rows with risk weights, percentages, and status summaries', () => {
  const rows = [
    { risk: 'P0 critical', status: 'PASS' },
    { risk: 'P1 important', status: 'PARTIAL_LOCAL' },
    { risk: 'P2 useful', status: 'UNVERIFIED' },
    { risk: 'unknown', status: 'MISSING' },
  ];

  assert.equal(riskWeight('P0 critical'), 5);
  assert.equal(riskWeight('P1 important'), 3);
  assert.equal(riskWeight('P2 useful'), 1);
  assert.equal(riskWeight('unclassified'), 2);
  assert.equal(percent(0.4567), 45.7);
  assert.equal(weightedAverage([], 'release'), 0);
  assert.equal(percent(weightedAverage(rows, 'implementation')), 67.3);
  assert.deepEqual(summarizeRows(rows), {
    PASS: 1,
    PARTIAL_LOCAL: 1,
    UNVERIFIED: 1,
    MISSING: 1,
  });
});

test('builds a fail-closed scorecard with escaped markdown work rows', async () => {
  await withTempDir(async (dir) => {
    const ledgerPath = await writeLedger(dir);
    const scorecard = await buildScorecard({ today: '2026-06-07', ledger: ledgerPath });

    assert.equal(scorecard.status, 'NO-GO');
    assert.equal(scorecard.sourceLedger, toPosixPath(path.relative(process.cwd(), ledgerPath)));
    assert.equal(scorecard.summary.p0Total, 2);
    assert.equal(scorecard.summary.p0NotReleaseReady, 1);
    assert.deepEqual(scorecard.summary.blockedModules, ['Bot Runtime']);
    assert.equal(scorecard.summary.concreteNonProofGaps, 1);
    assert.equal(scorecard.summary.implementationEstimatePercent, 69.5);
    assert.equal(scorecard.summary.evidenceCoveragePercent, 51.4);
    assert.equal(scorecard.summary.releaseReadinessPercent, 49.5);
    assert.equal(scorecard.phaseReadiness.at(-1).status, 'BLOCKED');
    assert.equal(scorecard.nextWorkOrder[0].module, 'Bot Runtime');

    const markdown = renderMarkdown(scorecard);
    assert.match(markdown, /Status: `NO-GO`/);
    assert.match(markdown, /Protected auth proof \\| production readback/);
  });
});

test('builds GO scorecard only when release gates are fully closed', async () => {
  await withTempDir(async (dir) => {
    const ledgerPath = await writeLedger(dir, {
      moduleLedger: [
        {
          module: 'Dashboard Home',
          priority: 1,
          risk: 'P0 operator truth surface',
          status: 'PASS',
          bucket: 'done',
          nextProof: 'Accepted release proof',
        },
      ],
      concreteNonProofGaps: [],
    });

    const scorecard = await buildScorecard({ today: '2026-06-07', ledger: ledgerPath });
    assert.equal(scorecard.status, 'GO');
    assert.equal(scorecard.summary.releaseReadinessPercent, 100);
    assert.equal(scorecard.phaseReadiness.at(-1).status, 'DONE');
  });
});

test('renders table rows and resolves latest ledger path from canonical audits', async () => {
  const table = renderTable([{ value: 'one' }, { value: 'two' }], (row) => `| ${row.value} |`);
  assert.equal(table, '| one |\n| two |');
  assert.match(relativePath(path.resolve('scripts/buildV1CompletionScorecard.mjs')), /scripts\/buildV1CompletionScorecard\.mjs$/);

  const ledgerPath = await latestLedgerPath();
  assert.match(path.basename(ledgerPath), /^v1-master-state-ledger-\d{4}-\d{2}-\d{2}\.json$/);
});

test('reads JSON ledgers and prints CLI help text directly', async () => {
  await withTempDir(async (dir) => {
    const ledgerPath = await writeLedger(dir, { concreteNonProofGaps: [] });
    const ledger = await readJson(ledgerPath);
    assert.equal(ledger.moduleLedger.length, 3);

    const originalLog = console.log;
    const messages = [];
    console.log = (message) => messages.push(String(message));
    try {
      printHelp();
    } finally {
      console.log = originalLog;
    }

    assert.match(messages.join('\n'), /Usage: node scripts\/buildV1CompletionScorecard\.mjs/);
    assert.match(messages.join('\n'), /--ledger <path>/);
  });
});

test('main writes markdown and JSON scorecards to explicit temporary outputs', async () => {
  await withTempDir(async (dir) => {
    const ledgerPath = await writeLedger(dir);
    const markdownOutput = path.join(dir, 'scorecard.md');
    const jsonOutput = path.join(dir, 'scorecard.json');

    await main([
      '--today',
      '2026-06-07',
      '--ledger',
      ledgerPath,
      '--markdown-output',
      markdownOutput,
      '--json-output',
      jsonOutput,
    ]);

    const markdown = await readFile(markdownOutput, 'utf8');
    const json = JSON.parse(await readFile(jsonOutput, 'utf8'));

    assert.match(markdown, /# V1 Completion Scorecard/);
    assert.equal(json.status, 'NO-GO');
    assert.equal(json.evidenceDate, '2026-06-07');
  });
});
