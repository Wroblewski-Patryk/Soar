#!/usr/bin/env node

import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const operationsDir = path.join(repoRoot, 'docs', 'operations');

const toPosixPath = (value) => value.split(path.sep).join('/');
const relativePath = (targetPath) => toPosixPath(path.relative(repoRoot, targetPath));
const readJson = async (filePath) => JSON.parse(await readFile(filePath, 'utf8'));

const parseArgs = () => {
  const options = {
    today: new Date().toISOString().slice(0, 10),
    ledger: '',
    markdownOutput: '',
    jsonOutput: '',
    help: false,
  };

  const args = process.argv.slice(2);
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      continue;
    }
    if (arg === '--today') {
      options.today = args[index + 1] ?? options.today;
      index += 1;
      continue;
    }
    if (arg === '--ledger') {
      options.ledger = args[index + 1] ?? '';
      index += 1;
      continue;
    }
    if (arg === '--markdown-output') {
      options.markdownOutput = args[index + 1] ?? '';
      index += 1;
      continue;
    }
    if (arg === '--json-output') {
      options.jsonOutput = args[index + 1] ?? '';
      index += 1;
    }
  }

  options.markdownOutput =
    options.markdownOutput || `docs/operations/v1-completion-scorecard-${options.today}.md`;
  options.jsonOutput = options.jsonOutput || `docs/operations/v1-completion-scorecard-${options.today}.json`;
  return options;
};

const printHelp = () => {
  console.log(`Usage: node scripts/buildV1CompletionScorecard.mjs [options]

Build a weighted V1 completion scorecard from the latest master state ledger.

Options:
  --today <yyyy-mm-dd>          Evidence date. Defaults to current UTC date.
  --ledger <path>               Master state ledger JSON path. Defaults to latest ledger.
  --markdown-output <path>      Markdown output path.
  --json-output <path>          JSON output path.
  --help, -h                    Show this help.
`);
};

const latestLedgerPath = async () => {
  const files = await readdir(operationsDir);
  const ledgers = files
    .filter((file) => /^v1-master-state-ledger-\d{4}-\d{2}-\d{2}\.json$/.test(file))
    .sort();
  if (ledgers.length === 0) {
    throw new Error('No v1-master-state-ledger-YYYY-MM-DD.json file found in docs/operations.');
  }
  return path.join(operationsDir, ledgers.at(-1));
};

const riskWeight = (risk) => {
  if (risk.startsWith('P0')) return 5;
  if (risk.startsWith('P1')) return 3;
  if (risk.startsWith('P2')) return 1;
  return 2;
};

const statusScore = {
  PASS: { implementation: 1, evidence: 1, release: 1 },
  PASS_LOCAL: { implementation: 0.9, evidence: 0.65, release: 0.45 },
  PARTIAL_LOCAL: { implementation: 0.65, evidence: 0.35, release: 0.2 },
  UNVERIFIED: { implementation: 0.45, evidence: 0, release: 0 },
  BLOCKED_AUTH: { implementation: 0.35, evidence: 0, release: 0 },
  FAIL: { implementation: 0.1, evidence: 0, release: 0 },
};

const percent = (value) => Number((value * 100).toFixed(1));

const weightedAverage = (rows, scoreKey) => {
  const totals = rows.reduce(
    (accumulator, row) => {
      const weight = riskWeight(row.risk);
      const score = statusScore[row.status]?.[scoreKey] ?? 0;
      accumulator.weighted += weight * score;
      accumulator.total += weight;
      return accumulator;
    },
    { weighted: 0, total: 0 },
  );
  return totals.total === 0 ? 0 : totals.weighted / totals.total;
};

const summarizeRows = (rows) =>
  rows.reduce((accumulator, row) => {
    accumulator[row.status] = (accumulator[row.status] ?? 0) + 1;
    return accumulator;
  }, {});

const buildScorecard = async (options) => {
  const ledgerPath = path.resolve(repoRoot, options.ledger || (await latestLedgerPath()));
  const ledger = await readJson(ledgerPath);
  const rows = ledger.moduleLedger ?? [];
  const p0Rows = rows.filter((row) => row.risk.startsWith('P0'));
  const blockedRows = rows.filter((row) => row.bucket === 'blocked');
  const concreteGaps = ledger.concreteNonProofGaps ?? [];

  const moduleScores = rows.map((row) => ({
    module: row.module,
    priority: row.priority,
    risk: row.risk,
    status: row.status,
    bucket: row.bucket,
    weight: riskWeight(row.risk),
    implementationPercent: percent(statusScore[row.status]?.implementation ?? 0),
    evidencePercent: percent(statusScore[row.status]?.evidence ?? 0),
    releasePercent: percent(statusScore[row.status]?.release ?? 0),
    nextProof: row.nextProof,
  }));

  const score = {
    implementationEstimatePercent: percent(weightedAverage(rows, 'implementation')),
    evidenceCoveragePercent: percent(weightedAverage(rows, 'evidence')),
    releaseReadinessPercent: percent(weightedAverage(rows, 'release')),
  };

  const p0NotReleaseReady = moduleScores.filter((row) => row.risk.startsWith('P0') && row.releasePercent < 100);
  const p1NotReleaseReady = moduleScores.filter((row) => row.risk.startsWith('P1') && row.releasePercent < 100);

  return {
    generatedAt: new Date().toISOString(),
    evidenceDate: options.today,
    status: 'NO-GO',
    sourceLedger: relativePath(ledgerPath),
    scoringModel: {
      warning:
        'Percentages are a planning signal, not release approval. V1 remains NO-GO while any P0 module lacks accepted proof or any release gate is blocked.',
      weights: { P0: 5, P1: 3, P2: 1 },
      statusScore,
    },
    summary: {
      ...score,
      moduleCounts: summarizeRows(rows),
      p0Total: p0Rows.length,
      p0NotReleaseReady: p0NotReleaseReady.length,
      blockedModules: blockedRows.map((row) => row.module),
      concreteNonProofGaps: concreteGaps.length,
    },
    phaseReadiness: [
      {
        phase: 'Map state',
        readinessPercent: 100,
        status: 'DONE',
        note: 'Project index, static scan, and master ledger exist.',
      },
      {
        phase: 'Prove action behavior',
        readinessPercent: score.evidenceCoveragePercent,
        status: score.evidenceCoveragePercent >= 100 ? 'DONE' : 'IN_PROGRESS',
        note: 'Module action proofs are still missing or partial for most rows.',
      },
      {
        phase: 'Repair confirmed failures',
        readinessPercent: concreteGaps.length === 0 ? 100 : 55,
        status: concreteGaps.length === 0 ? 'DONE' : 'IN_PROGRESS',
        note: 'Only repair after proof or static gap triage identifies a concrete defect.',
      },
      {
        phase: 'Production-safe proof',
        readinessPercent: score.releaseReadinessPercent,
        status: score.releaseReadinessPercent >= 100 ? 'DONE' : 'BLOCKED',
        note: 'Production-safe clickthrough, protected auth, SLO, rollback, and runtime readback are not closed.',
      },
      {
        phase: 'Release decision',
        readinessPercent: 0,
        status: 'BLOCKED',
        note: 'Release remains blocked while P0 proof gaps and formal gates are open.',
      },
    ],
    topBlockers: [
      ...p0NotReleaseReady.slice(0, 12).map((row) => ({
        type: 'P0_NOT_RELEASE_READY',
        module: row.module,
        status: row.status,
        nextProof: row.nextProof,
      })),
      ...blockedRows.map((row) => ({
        type: 'BLOCKED_MODULE',
        module: row.module,
        status: row.status,
        nextProof: row.nextProof,
      })),
    ],
    nextWorkOrder: moduleScores
      .filter((row) => row.releasePercent < 100)
      .sort((left, right) => left.priority - right.priority)
      .map((row) => ({
        priority: row.priority,
        module: row.module,
        risk: row.risk,
        status: row.status,
        bucket: row.bucket,
        releasePercent: row.releasePercent,
        nextProof: row.nextProof,
      })),
    moduleScores,
    p1NotReleaseReady,
    concreteNonProofGaps: concreteGaps,
  };
};

const renderTable = (rows, mapper) => rows.map(mapper).join('\n');

const renderMarkdown = (scorecard) => {
  const nextRows = renderTable(
    scorecard.nextWorkOrder,
    (row) =>
      `| ${row.priority} | ${row.module} | ${row.risk} | ${row.status} | ${row.bucket} | ${row.releasePercent}% | ${row.nextProof.replace(/\|/g, '\\|')} |`,
  );

  const phaseRows = renderTable(
    scorecard.phaseReadiness,
    (row) => `| ${row.phase} | ${row.status} | ${row.readinessPercent}% | ${row.note.replace(/\|/g, '\\|')} |`,
  );

  const blockerRows = renderTable(
    scorecard.topBlockers,
    (row) => `| ${row.type} | ${row.module} | ${row.status} | ${row.nextProof.replace(/\|/g, '\\|')} |`,
  );

  return `# V1 Completion Scorecard

Generated at: ${scorecard.generatedAt}
Evidence date: ${scorecard.evidenceDate}
Status: \`${scorecard.status}\`
Source ledger: \`${scorecard.sourceLedger}\`

## Executive Summary

- Implementation estimate: ${scorecard.summary.implementationEstimatePercent}%
- Evidence coverage: ${scorecard.summary.evidenceCoveragePercent}%
- Release readiness: ${scorecard.summary.releaseReadinessPercent}%
- P0 modules not release-ready: ${scorecard.summary.p0NotReleaseReady}/${scorecard.summary.p0Total}
- Blocked modules: ${scorecard.summary.blockedModules.join(', ') || 'none'}
- Concrete non-proof gaps: ${scorecard.summary.concreteNonProofGaps}

Important: percentages are planning signals, not release approval. V1 remains
\`NO-GO\` while any P0 module lacks accepted proof or any release gate is
blocked.

## Phase Readiness

| Phase | Status | Readiness | Note |
| --- | --- | ---: | --- |
${phaseRows}

## Top Blockers

| Type | Module | Status | Next proof |
| --- | --- | --- | --- |
${blockerRows}

## Next Work Order

| Priority | Module | Risk | Status | Bucket | Release readiness | Next proof |
| ---: | --- | --- | --- | --- | ---: | --- |
${nextRows}

## Scoring Model

- Risk weights: P0 = 5, P1 = 3, P2 = 1.
- Implementation estimate answers: "how much appears implemented or partially
  shaped from the ledger?"
- Evidence coverage answers: "how much has accepted local/action proof?"
- Release readiness answers: "how close is this to a safe V1 release decision?"
- \`UNVERIFIED\` and \`BLOCKED_AUTH\` intentionally score zero for release
  readiness even when implementation may exist.
`;
};

const main = async () => {
  const options = parseArgs();
  if (options.help) {
    printHelp();
    return;
  }

  const scorecard = await buildScorecard(options);
  const markdownPath = path.resolve(repoRoot, options.markdownOutput);
  const jsonPath = path.resolve(repoRoot, options.jsonOutput);

  await writeFile(markdownPath, renderMarkdown(scorecard), 'utf8');
  await writeFile(jsonPath, `${JSON.stringify(scorecard, null, 2)}\n`, 'utf8');

  console.log(`V1 completion scorecard written to ${relativePath(markdownPath)}`);
  console.log(`V1 completion scorecard JSON written to ${relativePath(jsonPath)}`);
  console.log(`Status: ${scorecard.status}`);
  console.log(`Implementation estimate: ${scorecard.summary.implementationEstimatePercent}%`);
  console.log(`Evidence coverage: ${scorecard.summary.evidenceCoveragePercent}%`);
  console.log(`Release readiness: ${scorecard.summary.releaseReadinessPercent}%`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
