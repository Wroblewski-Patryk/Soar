import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  buildLedger,
  buildModuleLedger,
  categoryToBucket,
  main,
  parseArgs,
  printHelp,
  readJson,
  relativePath,
  renderFindings,
  renderMarkdown,
  sortFindings,
  statusToBucket,
  summarizeBy,
  tableRows,
  toPosixPath,
} from './buildV1MasterStateLedger.mjs';

const withTempDir = async (callback) => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'soar-v1-ledger-'));
  try {
    return await callback(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
};

const sampleProjectIndex = () => ({
  v1Matrix: {
    source: 'docs/planning/product-action-matrix.md',
    counts: { total: 3, pass: 1, blocked: 1 },
  },
  v1WorkMap: [
    {
      module: 'Dashboard Home',
      status: 'PASS',
      auditPriority: 1,
      risk: 'P0 operator truth surface',
      nextProof: 'Accepted local and release proof',
      routes: [{ route: '/dashboard' }],
      api: [{ name: 'runtime' }],
      web: [{ name: 'DashboardHome' }],
      candidateTests: ['apps/web/src/features/dashboard/DashboardHome.test.tsx'],
    },
    {
      module: 'Bot Runtime',
      status: 'BLOCKED_AUTH',
      auditPriority: 2,
      risk: 'P0 runtime truth',
      nextProof: 'Protected auth proof | production readback',
      routes: [{ route: '/dashboard/bots' }],
      api: [{ name: 'bots' }],
      web: [{ name: 'BotsPage' }],
      candidateTests: ['apps/api/src/modules/bots/bots.service.test.ts'],
    },
    {
      module: 'Reports',
      status: 'PASS_LOCAL',
      auditPriority: 14,
      risk: 'P2 operator reporting',
      nextProof: 'Production clickthrough',
      routes: [],
      api: [],
      web: [],
      candidateTests: [],
    },
  ],
});

const sampleScan = () => ({
  summary: { bySeverity: { P0: 2, P1: 2, P2: 1 } },
  findings: [
    {
      id: 'F-003',
      severity: 'P2',
      category: 'web-test-gap',
      title: 'Dashboard Home has code without focused test',
      recommendation: 'Add web test coverage',
    },
    {
      id: 'F-001',
      severity: 'P0',
      category: 'v1-proof-gap',
      title: 'Bot Runtime production proof is missing',
      recommendation: 'Attach protected production proof',
    },
    {
      id: 'F-002',
      severity: 'P1',
      category: 'documented-placeholder',
      title: 'Reports docs still mention placeholder',
      recommendation: 'Review docs | implementation truth',
    },
  ],
});

const writeInputs = async (dir, { projectIndex = sampleProjectIndex(), scan = sampleScan() } = {}) => {
  const indexPath = path.join(dir, 'project-index.json');
  const scanPath = path.join(dir, 'static-scan.json');
  await writeFile(indexPath, `${JSON.stringify(projectIndex, null, 2)}\n`, 'utf8');
  await writeFile(scanPath, `${JSON.stringify(scan, null, 2)}\n`, 'utf8');
  return { indexPath, scanPath };
};

test('parses V1 master state ledger CLI options and default outputs', () => {
  const defaults = parseArgs(['--today', '2026-06-07']);
  assert.equal(defaults.today, '2026-06-07');
  assert.equal(defaults.index, 'history/audits/project-index-2026-06-07.json');
  assert.equal(defaults.scan, 'history/audits/v1-static-issue-scan-2026-06-07.json');
  assert.equal(defaults.markdownOutput, 'history/audits/v1-master-state-ledger-2026-06-07.md');
  assert.equal(defaults.jsonOutput, 'history/audits/v1-master-state-ledger-2026-06-07.json');

  const options = parseArgs([
    '--today',
    '2026-06-08',
    '--index',
    'tmp/index.json',
    '--scan',
    'tmp/scan.json',
    '--markdown-output',
    'tmp/ledger.md',
    '--json-output',
    'tmp/ledger.json',
    '--help',
  ]);

  assert.equal(options.today, '2026-06-08');
  assert.equal(options.index, 'tmp/index.json');
  assert.equal(options.scan, 'tmp/scan.json');
  assert.equal(options.markdownOutput, 'tmp/ledger.md');
  assert.equal(options.jsonOutput, 'tmp/ledger.json');
  assert.equal(options.help, true);
});

test('maps module statuses and finding categories into release buckets', () => {
  assert.equal(statusToBucket('PASS'), 'done');
  assert.equal(statusToBucket('PASS_LOCAL'), 'doneLocalNeedsProdProof');
  assert.equal(statusToBucket('BLOCKED_AUTH'), 'blocked');
  assert.equal(statusToBucket('PARTIAL_LOCAL'), 'toProveAndPossiblyFix');
  assert.equal(statusToBucket('UNVERIFIED'), 'toProve');
  assert.equal(statusToBucket('FAIL'), 'toFix');
  assert.equal(statusToBucket('UNKNOWN'), 'toReview');

  assert.equal(categoryToBucket({ category: 'v1-proof-gap', title: 'locally proven PASS_LOCAL' }), 'doneLocalNeedsProdProof');
  assert.equal(categoryToBucket({ category: 'v1-proof-gap', title: 'missing proof' }), 'toProve');
  assert.equal(categoryToBucket({ category: 'web-surface-gap', title: 'missing route' }), 'toReviewArchitectureOrFix');
  assert.equal(categoryToBucket({ category: 'web-test-gap', title: 'missing test' }), 'toAddTests');
  assert.equal(categoryToBucket({ category: 'api-test-gap', title: 'missing test' }), 'toAddTests');
  assert.equal(categoryToBucket({ category: 'documented-placeholder', title: 'placeholder' }), 'toReviewDocumentationOrImplement');
  assert.equal(categoryToBucket({ category: 'queue-open-work', title: 'open issue' }), 'toClassifyQueue');
  assert.equal(categoryToBucket({ category: 'source-capability-gate', title: 'capability' }), 'toReviewCapabilityGate');
  assert.equal(categoryToBucket({ category: 'queue-hygiene', title: 'queue' }), 'toCleanPlanning');
  assert.equal(categoryToBucket({ category: 'other', title: 'unknown' }), 'toReview');
});

test('builds module ledger rows with route, API, web, candidate test, and related finding traceability', () => {
  const findings = [
    { id: 'F-001', title: 'Bot Runtime production proof is missing' },
    { id: 'F-002', title: 'Unrelated proof gap' },
  ];

  const rows = buildModuleLedger(sampleProjectIndex(), findings);
  assert.equal(rows.length, 3);
  assert.deepEqual(rows[0], {
    module: 'Dashboard Home',
    status: 'PASS',
    bucket: 'done',
    priority: 1,
    risk: 'P0 operator truth surface',
    nextProof: 'Accepted local and release proof',
    routes: ['/dashboard'],
    apiModules: ['runtime'],
    webFeatures: ['DashboardHome'],
    candidateTests: ['apps/web/src/features/dashboard/DashboardHome.test.tsx'],
    relatedFindings: [],
  });
  assert.deepEqual(rows[1].relatedFindings, ['F-001']);
});

test('sorts findings by severity, category, and title and summarizes by key', () => {
  const sorted = sortFindings(sampleScan().findings);
  assert.deepEqual(
    sorted.map((finding) => finding.id),
    ['F-001', 'F-002', 'F-003'],
  );
  assert.deepEqual(summarizeBy([{ bucket: 'done' }, { bucket: 'done' }, {}], 'bucket'), {
    done: 2,
    unknown: 1,
  });
});

test('builds a fail-closed master ledger with concrete non-proof gaps and escaped markdown', async () => {
  await withTempDir(async (dir) => {
    const { indexPath, scanPath } = await writeInputs(dir);
    const ledger = await buildLedger({
      today: '2026-06-07',
      index: indexPath,
      scan: scanPath,
      markdownOutput: path.join(dir, 'ledger.md'),
      jsonOutput: path.join(dir, 'ledger.json'),
    });

    assert.equal(ledger.status, 'NO-GO');
    assert.equal(ledger.evidenceDate, '2026-06-07');
    assert.equal(ledger.sources.projectIndex, toPosixPath(path.relative(process.cwd(), indexPath)));
    assert.equal(ledger.summary.modulesTotal, 3);
    assert.deepEqual(ledger.summary.modulesByBucket, {
      blocked: 1,
      done: 1,
      doneLocalNeedsProdProof: 1,
    });
    assert.deepEqual(ledger.summary.bucketCounts, {
      toAddTests: 1,
      toProve: 1,
      toReviewDocumentationOrImplement: 1,
    });
    assert.equal(ledger.nextWorkOrder[0].module, 'Bot Runtime');
    assert.equal(ledger.concreteNonProofGaps.length, 2);

    const markdown = renderMarkdown(ledger);
    assert.match(markdown, /Status: `NO-GO`/);
    assert.match(markdown, /Protected auth proof \\| production readback/);
    assert.match(markdown, /Review docs \\| implementation truth/);
  });
});

test('builds GO ledger only when all module and concrete gap gates are closed', async () => {
  await withTempDir(async (dir) => {
    const { indexPath, scanPath } = await writeInputs(dir, {
      projectIndex: {
        v1Matrix: { source: 'docs/planning/product-action-matrix.md', counts: { total: 1, pass: 1 } },
        v1WorkMap: [
          {
            module: 'Dashboard Home',
            status: 'PASS',
            auditPriority: 1,
            risk: 'P0 operator truth surface',
            nextProof: 'Accepted proof',
            routes: [],
            api: [],
            web: [],
            candidateTests: [],
          },
        ],
      },
      scan: { summary: { bySeverity: {} }, findings: [] },
    });

    const ledger = await buildLedger({ today: '2026-06-07', index: indexPath, scan: scanPath });
    assert.equal(ledger.status, 'GO');
    assert.deepEqual(ledger.nextWorkOrder, []);
    assert.deepEqual(ledger.concreteNonProofGaps, []);
  });
});

test('renders findings, table rows, reads JSON, and prints CLI help text directly', async () => {
  await withTempDir(async (dir) => {
    const { indexPath } = await writeInputs(dir);
    const projectIndex = await readJson(indexPath);
    assert.equal(projectIndex.v1WorkMap.length, 3);

    const emptyFindings = renderFindings([]);
    assert.match(emptyFindings, /Severity \| Bucket \| Finding/);

    const longRecommendation = 'x'.repeat(300);
    const findings = renderFindings([
      {
        severity: 'P1',
        bucket: 'toAddTests',
        title: 'Pipe | title',
        recommendation: longRecommendation,
      },
    ]);
    assert.match(findings, /Pipe \\| title/);
    assert.ok(findings.includes('x'.repeat(240)));
    assert.ok(!findings.includes('x'.repeat(241)));

    const table = tableRows([{ value: 'one' }, { value: 'two' }], (row) => `| ${row.value} |`);
    assert.equal(table, '| one |\n| two |');
    assert.match(relativePath(path.resolve('scripts/buildV1MasterStateLedger.mjs')), /scripts\/buildV1MasterStateLedger\.mjs$/);

    const originalLog = console.log;
    const messages = [];
    console.log = (message) => messages.push(String(message));
    try {
      printHelp();
    } finally {
      console.log = originalLog;
    }
    assert.match(messages.join('\n'), /Usage: node scripts\/buildV1MasterStateLedger\.mjs/);
    assert.match(messages.join('\n'), /--index <path>/);
  });
});

test('main writes markdown and JSON ledgers to explicit temporary outputs', async () => {
  await withTempDir(async (dir) => {
    const { indexPath, scanPath } = await writeInputs(dir);
    const markdownOutput = path.join(dir, 'ledger.md');
    const jsonOutput = path.join(dir, 'ledger.json');

    await main([
      '--today',
      '2026-06-07',
      '--index',
      indexPath,
      '--scan',
      scanPath,
      '--markdown-output',
      markdownOutput,
      '--json-output',
      jsonOutput,
    ]);

    const markdown = await readFile(markdownOutput, 'utf8');
    const json = JSON.parse(await readFile(jsonOutput, 'utf8'));

    assert.match(markdown, /# V1 Master State Ledger/);
    assert.equal(json.status, 'NO-GO');
    assert.equal(json.evidenceDate, '2026-06-07');
  });
});
