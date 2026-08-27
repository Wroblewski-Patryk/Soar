#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();

const toPosixPath = (value) => value.split(path.sep).join('/');
const relativePath = (targetPath) => toPosixPath(path.relative(repoRoot, targetPath));

const readJson = async (filePath) => JSON.parse(await readFile(filePath, 'utf8'));

const parseArgs = () => {
  const options = {
    today: new Date().toISOString().slice(0, 10),
    index: '',
    scan: '',
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
    if (arg === '--index') {
      options.index = args[index + 1] ?? '';
      index += 1;
      continue;
    }
    if (arg === '--scan') {
      options.scan = args[index + 1] ?? '';
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

  options.index = options.index || `history/audits/project-index-${options.today}.json`;
  options.scan = options.scan || `history/audits/v1-static-issue-scan-${options.today}.json`;
  options.markdownOutput =
    options.markdownOutput || `history/audits/v1-master-state-ledger-${options.today}.md`;
  options.jsonOutput = options.jsonOutput || `history/audits/v1-master-state-ledger-${options.today}.json`;
  return options;
};

const printHelp = () => {
  console.log(`Usage: node scripts/buildV1MasterStateLedger.mjs [options]

Build one consolidated V1 state ledger from the project index and static scan.

Options:
  --today <yyyy-mm-dd>          Evidence date. Defaults to current UTC date.
  --index <path>                Project index JSON path.
  --scan <path>                 Static issue scan JSON path.
  --markdown-output <path>      Markdown output path.
  --json-output <path>          JSON output path.
  --help, -h                    Show this help.
`);
};

const severityRank = { P0: 0, P1: 1, P2: 2 };

const statusToBucket = (status) => {
  if (status === 'PASS' || status === 'PASS_LOCAL') {
    return status === 'PASS_LOCAL' ? 'doneLocalNeedsProdProof' : 'done';
  }
  if (status.startsWith('BLOCKED')) {
    return 'blocked';
  }
  if (status === 'PARTIAL_LOCAL') {
    return 'toProveAndPossiblyFix';
  }
  if (status === 'UNVERIFIED') {
    return 'toProve';
  }
  if (status === 'FAIL') {
    return 'toFix';
  }
  return 'toReview';
};

const categoryToBucket = (finding) => {
  if (finding.category === 'v1-proof-gap') {
    return finding.title.includes('PASS_LOCAL') || finding.title.includes('locally proven')
      ? 'doneLocalNeedsProdProof'
      : 'toProve';
  }
  if (finding.category === 'web-surface-gap' || finding.category === 'web-route-gap') {
    return 'toReviewArchitectureOrFix';
  }
  if (finding.category === 'web-test-gap' || finding.category === 'api-test-gap') {
    return 'toAddTests';
  }
  if (finding.category === 'documented-placeholder') {
    return 'toReviewDocumentationOrImplement';
  }
  if (finding.category === 'queue-open-work') {
    return 'toClassifyQueue';
  }
  if (finding.category === 'source-capability-gate') {
    return 'toReviewCapabilityGate';
  }
  if (finding.category === 'queue-hygiene') {
    return 'toCleanPlanning';
  }
  return 'toReview';
};

const sortFindings = (findings) =>
  [...findings].sort(
    (left, right) =>
      (severityRank[left.severity] ?? 99) - (severityRank[right.severity] ?? 99) ||
      left.category.localeCompare(right.category) ||
      left.title.localeCompare(right.title),
  );

const summarizeBy = (items, key) =>
  items.reduce((accumulator, item) => {
    const value = item[key] ?? 'unknown';
    accumulator[value] = (accumulator[value] ?? 0) + 1;
    return accumulator;
  }, {});

const buildModuleLedger = (projectIndex, findings) => {
  const findingsByModule = new Map();
  for (const finding of findings) {
    const normalized = finding.title.toLowerCase();
    for (const row of projectIndex.v1WorkMap ?? []) {
      if (normalized.includes(row.module.toLowerCase())) {
        const existing = findingsByModule.get(row.module) ?? [];
        existing.push(finding);
        findingsByModule.set(row.module, existing);
      }
    }
  }

  return (projectIndex.v1WorkMap ?? []).map((row) => ({
    module: row.module,
    status: row.status,
    bucket: statusToBucket(row.status),
    priority: row.auditPriority,
    risk: row.risk,
    nextProof: row.nextProof,
    routes: row.routes.map((route) => route.route),
    apiModules: row.api.map((module) => module.name),
    webFeatures: row.web.map((feature) => feature.name),
    candidateTests: row.candidateTests,
    relatedFindings: (findingsByModule.get(row.module) ?? []).map((finding) => finding.id),
  }));
};

const buildLedger = async (options) => {
  const indexPath = path.resolve(repoRoot, options.index);
  const scanPath = path.resolve(repoRoot, options.scan);
  const projectIndex = await readJson(indexPath);
  const scan = await readJson(scanPath);
  const findings = sortFindings(scan.findings ?? []);

  const findingLedger = findings.map((finding) => ({
    ...finding,
    bucket: categoryToBucket(finding),
  }));

  const buckets = findingLedger.reduce((accumulator, finding) => {
    const bucket = finding.bucket;
    accumulator[bucket] = accumulator[bucket] ?? [];
    accumulator[bucket].push(finding.id);
    return accumulator;
  }, {});

  const moduleLedger = buildModuleLedger(projectIndex, findingLedger);
  const nextWorkOrder = moduleLedger
    .filter((row) => !['done'].includes(row.bucket))
    .sort((left, right) => left.priority - right.priority)
    .map((row) => ({
      priority: row.priority,
      module: row.module,
      status: row.status,
      bucket: row.bucket,
      risk: row.risk,
      nextProof: row.nextProof,
    }));
  const concreteNonProofGaps = findingLedger.filter((finding) =>
    ['toReviewArchitectureOrFix', 'toAddTests', 'toReviewDocumentationOrImplement', 'toClassifyQueue'].includes(
      finding.bucket,
    ),
  );
  const status = nextWorkOrder.length === 0 && concreteNonProofGaps.length === 0 ? 'GO' : 'NO-GO';

  return {
    generatedAt: new Date().toISOString(),
    evidenceDate: options.today,
    status,
    sources: {
      projectIndex: relativePath(indexPath),
      staticIssueScan: relativePath(scanPath),
      productActionMatrix: projectIndex.v1Matrix?.source,
    },
    summary: {
      v1MatrixCounts: projectIndex.v1Matrix?.counts ?? {},
      findingCounts: scan.summary ?? {},
      bucketCounts: Object.fromEntries(
        Object.entries(buckets)
          .map(([bucket, ids]) => [bucket, ids.length])
          .sort(([left], [right]) => left.localeCompare(right)),
      ),
      modulesTotal: moduleLedger.length,
      modulesByBucket: summarizeBy(moduleLedger, 'bucket'),
    },
    nextWorkOrder,
    concreteNonProofGaps,
    moduleLedger,
    findingLedger,
  };
};

const tableRows = (rows, mapper) => rows.map(mapper).join('\n');

const renderFindings = (findings) => {
  if (findings.length === 0) {
    return '| Severity | Bucket | Finding | Recommendation |\n| --- | --- | --- | --- |';
  }
  return [
    '| Severity | Bucket | Finding | Recommendation |',
    '| --- | --- | --- | --- |',
    ...findings.map((finding) => {
      const title = finding.title.replace(/\|/g, '\\|');
      const recommendation = String(finding.recommendation ?? '').replace(/\|/g, '\\|').slice(0, 240);
      return `| ${finding.severity} | ${finding.bucket} | ${title} | ${recommendation} |`;
    }),
  ].join('\n');
};

const renderMarkdown = (ledger) => {
  const moduleTable = tableRows(
    ledger.moduleLedger,
    (row) =>
      `| ${row.priority} | ${row.module} | ${row.status} | ${row.bucket} | ${row.risk} | ${row.nextProof.replace(/\|/g, '\\|')} |`,
  );

  const nextTable = tableRows(
    ledger.nextWorkOrder.slice(0, 25),
    (row) =>
      `| ${row.priority} | ${row.module} | ${row.status} | ${row.bucket} | ${row.risk} | ${row.nextProof.replace(/\|/g, '\\|')} |`,
  );

  return `# V1 Master State Ledger

Generated at: ${ledger.generatedAt}
Evidence date: ${ledger.evidenceDate}
Status: \`${ledger.status}\`

## Sources

- Project index: \`${ledger.sources.projectIndex}\`
- Static issue scan: \`${ledger.sources.staticIssueScan}\`
- Product action matrix: \`${ledger.sources.productActionMatrix}\`

## Executive Summary

- V1 status: \`${ledger.status}\`
- Matrix counts: ${JSON.stringify(ledger.summary.v1MatrixCounts)}
- Findings by severity: ${JSON.stringify(ledger.summary.findingCounts.bySeverity ?? {})}
- Findings by bucket: ${JSON.stringify(ledger.summary.bucketCounts)}
- Modules by bucket: ${JSON.stringify(ledger.summary.modulesByBucket)}

## Meaning Of Buckets

- \`toProve\`: implementation may exist, but accepted action-level proof is missing.
- \`toProveAndPossiblyFix\`: partial local proof exists; remaining action families may reveal bugs.
- \`toReviewArchitectureOrFix\`: visible route/feature ownership is unclear or missing.
- \`toAddTests\`: code exists but focused tests are absent.
- \`toReviewDocumentationOrImplement\`: docs still describe placeholder/not-implemented behavior.
- \`toReviewCapabilityGate\`: fail-closed unsupported-exchange behavior must be checked against the V1 capability matrix.
- \`blocked\`: cannot close without auth, approval, or safe operator inputs.
- \`doneLocalNeedsProdProof\`: local proof exists, but final V1 still needs production-safe evidence.

## Next Work Order

| Priority | Module | Status | Bucket | Risk | Next proof |
| ---: | --- | --- | --- | --- | --- |
${nextTable}

## Module Ledger

| Priority | Module | Status | Bucket | Risk | Next proof |
| ---: | --- | --- | --- | --- | --- |
${moduleTable}

## Concrete Non-Proof Gaps

These are stronger candidates for actual implementation, test, documentation,
or planning work than generic missing-proof rows.

${renderFindings(ledger.concreteNonProofGaps)}

## All Findings Ledger

${renderFindings(ledger.findingLedger)}

## How To Use This File

1. Start from \`Next Work Order\`, not from memory.
2. For a module row, inspect its \`moduleLedger\` JSON entry for API modules,
   Web features, routes, and candidate tests.
3. Treat \`toProve\` as audit work first; only fix code after a failing proof
   identifies a concrete defect.
4. Treat \`toReviewArchitectureOrFix\` as a decision point: either formalize
   ownership or implement the missing surface.
5. Do not call V1 complete until every module is \`done\`, accepted
   \`doneLocalNeedsProdProof\` with production evidence, or explicitly
   documented as blocked with an operator plan.
`;
};

const main = async () => {
  const options = parseArgs();
  if (options.help) {
    printHelp();
    return;
  }

  const ledger = await buildLedger(options);
  const markdownPath = path.resolve(repoRoot, options.markdownOutput);
  const jsonPath = path.resolve(repoRoot, options.jsonOutput);

  await writeFile(markdownPath, renderMarkdown(ledger), 'utf8');
  await writeFile(jsonPath, `${JSON.stringify(ledger, null, 2)}\n`, 'utf8');

  console.log(`V1 master state ledger written to ${relativePath(markdownPath)}`);
  console.log(`V1 master state ledger JSON written to ${relativePath(jsonPath)}`);
  console.log(`Status: ${ledger.status}`);
  console.log(`Modules by bucket: ${JSON.stringify(ledger.summary.modulesByBucket)}`);
  console.log(`Findings by bucket: ${JSON.stringify(ledger.summary.bucketCounts)}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
