#!/usr/bin/env node

import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();

const ignoredDirectories = new Set([
  '.git',
  '.next',
  '.turbo',
  'coverage',
  'dist',
  'node_modules',
  'output',
  'outputs',
  'tmp',
]);

const scanRules = [
  {
    id: 'TODO',
    severity: 'P2',
    pattern: /\bTODO\b/,
    description: 'TODO marker left in a scanned source file.',
  },
  {
    id: 'FIXME',
    severity: 'P1',
    pattern: /\bFIXME\b/,
    description: 'FIXME marker left in a scanned source file.',
  },
  {
    id: 'HACK',
    severity: 'P1',
    pattern: /\bHACK\b/,
    description: 'HACK marker left in a scanned source file.',
  },
  {
    id: 'NOT_IMPLEMENTED',
    severity: 'P0',
    pattern: /not implemented|notimplemented|unsupported placeholder/i,
    description: 'Potential unimplemented or placeholder runtime behavior.',
  },
  {
    id: 'PLACEHOLDER_SOURCE',
    severity: 'P2',
    pattern: /placeholder adapter|placeholder exchange|placeholder mode|unsupported placeholder|abstraction placeholder/i,
    description: 'Potential product placeholder or placeholder-adapter reference in active source code.',
  },
  {
    id: 'FAKE_SOURCE',
    severity: 'P1',
    pattern: /\bfake\b/i,
    description: 'Fake-data reference in active source code.',
  },
];

const toPosixPath = (value) => value.split(path.sep).join('/');
const relativePath = (targetPath) => toPosixPath(path.relative(repoRoot, targetPath));
const approvedLegacyDashboardRedirects = new Set(['/dashboard/orders', '/dashboard/positions']);
const approvedRuntimeOwnedWebFeatures = new Set(['orders', 'positions']);
const protectedQueueBlockerPatterns = [
  'CONTROLLED-LIVE-SESSION-PROOF',
  'PROD-UI-AUDIT-PLAN',
  'V1-PROTECTED-ACCESS-READINESS',
  'LIVEIMPORT-03',
  'BOTMULTI-09',
];

const fileExists = async (targetPath) => {
  try {
    const entry = await stat(targetPath);
    return entry.isFile();
  } catch {
    return false;
  }
};

const directoryExists = async (targetPath) => {
  try {
    const entry = await stat(targetPath);
    return entry.isDirectory();
  } catch {
    return false;
  }
};

const walkFiles = async (targetPath, predicate = () => true) => {
  if (!(await directoryExists(targetPath))) {
    return [];
  }

  const files = [];
  const stack = [targetPath];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      if (ignoredDirectories.has(entry.name)) {
        continue;
      }

      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }

      if (entry.isFile() && predicate(fullPath, entry.name)) {
        files.push(fullPath);
      }
    }
  }

  return files.sort((a, b) => relativePath(a).localeCompare(relativePath(b)));
};

const readTextIfExists = async (targetPath) => {
  if (!(await fileExists(targetPath))) {
    return '';
  }
  return readFile(targetPath, 'utf8');
};

const parseArgs = () => {
  const options = {
    today: new Date().toISOString().slice(0, 10),
    index: '',
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

  options.index = options.index || `docs/operations/project-index-${options.today}.json`;
  options.markdownOutput =
    options.markdownOutput || `docs/operations/v1-static-issue-scan-${options.today}.md`;
  options.jsonOutput = options.jsonOutput || `docs/operations/v1-static-issue-scan-${options.today}.json`;
  return options;
};

const printHelp = () => {
  console.log(`Usage: node scripts/runV1StaticIssueScan.mjs [options]

Build a static V1 inconsistency scan from the local repository and project index.

Options:
  --today <yyyy-mm-dd>          Evidence date. Defaults to current UTC date.
  --index <path>                Project index JSON path.
  --markdown-output <path>      Markdown output path.
  --json-output <path>          JSON output path.
  --help, -h                    Show this help.
`);
};

const isProductionSource = (filePath) => {
  const rel = relativePath(filePath);
  if (!/\.(ts|tsx|mjs|js)$/.test(rel)) {
    return false;
  }
  if (/(\.test|\.spec)\.(ts|tsx|mjs|js)$/.test(rel)) {
    return false;
  }
  if (rel.includes('/test/') || rel.includes('/__tests__/') || rel.includes('/dist/')) {
    return false;
  }
  if (rel.includes('/__fixtures__/') || rel === 'scripts/runV1StaticIssueScan.mjs') {
    return false;
  }
  return (
    rel.startsWith('apps/api/src/') ||
    rel.startsWith('apps/web/src/') ||
    rel.startsWith('apps/api/scripts/') ||
    rel.startsWith('scripts/')
  );
};

const scanSourceMarkers = async () => {
  const files = await walkFiles(repoRoot, isProductionSource);
  const matches = [];

  for (const filePath of files) {
    const rel = relativePath(filePath);
    const text = await readTextIfExists(filePath);
    const lines = text.split(/\r?\n/);

    for (const [lineIndex, line] of lines.entries()) {
      for (const rule of scanRules) {
        if (!rule.pattern.test(line)) {
          continue;
        }
        matches.push({
          rule: rule.id,
          severity: rule.severity,
          description: rule.description,
          file: rel,
          line: lineIndex + 1,
          excerpt: line.trim().slice(0, 240),
        });
      }
    }
  }

  return {
    scannedFiles: files.length,
    matches,
  };
};

const listFilesInDirectory = async (directoryPath) => {
  const files = await walkFiles(directoryPath, (_fullPath, name) => /\.(ts|tsx|mjs|js|md)$/.test(name));
  return files.map(relativePath);
};

const collectSurfaceFindings = async (projectIndex) => {
  const findings = [];

  for (const feature of projectIndex.webFeatures ?? []) {
    if (approvedRuntimeOwnedWebFeatures.has(feature.name)) {
      continue;
    }

    if (feature.fileCount === 0) {
      findings.push({
        id: `WEB_FEATURE_EMPTY_${feature.name.toUpperCase()}`,
        severity: 'P1',
        category: 'web-surface-gap',
        title: `Web feature '${feature.name}' has no active TS/TSX files`,
        evidence: `feature=${feature.name}`,
        recommendation: 'Confirm whether this is intentionally rendered through Dashboard Home or implement/retire the feature surface.',
      });
      continue;
    }

    if ((feature.testFiles ?? []).length === 0 && ['orders', 'positions'].includes(feature.name)) {
      findings.push({
        id: `WEB_FEATURE_NO_TESTS_${feature.name.toUpperCase()}`,
        severity: 'P1',
        category: 'web-test-gap',
        title: `Web feature '${feature.name}' has no focused tests`,
        evidence: `feature=${feature.name}, files=${feature.fileCount}`,
        recommendation: 'Add focused UI/action tests or document why the route is owned by another feature.',
      });
    }
  }

  for (const module of projectIndex.apiModules ?? []) {
    if ((module.testFiles ?? []).length === 0 && !['users'].includes(module.name)) {
      findings.push({
        id: `API_MODULE_NO_TESTS_${module.name.toUpperCase()}`,
        severity: 'P1',
        category: 'api-test-gap',
        title: `API module '${module.name}' has no focused tests`,
        evidence: `module=${module.name}, files=${module.fileCount}`,
        recommendation: 'Add focused API tests or document why coverage belongs to another module.',
      });
    }
  }

  const routeSet = new Set((projectIndex.nextRoutes ?? []).map((route) => route.route));
  for (const expectedRoute of ['/dashboard/orders', '/dashboard/positions']) {
    if (approvedLegacyDashboardRedirects.has(expectedRoute)) {
      continue;
    }

    if (!routeSet.has(expectedRoute)) {
      findings.push({
        id: `WEB_ROUTE_MISSING_${expectedRoute.replace(/[^A-Za-z0-9]/g, '_').toUpperCase()}`,
        severity: 'P1',
        category: 'web-route-gap',
        title: `Expected dashboard route '${expectedRoute}' has no page.tsx`,
        evidence: `route=${expectedRoute}`,
        recommendation: 'Confirm whether the action surface intentionally lives on Dashboard Home or add the route/page proof.',
      });
    }
  }

  const moduleDocs = [
    'docs/modules/web-orders.md',
    'docs/modules/web-positions.md',
    'docs/modules/api-subscriptions.md',
  ];
  for (const docPath of moduleDocs) {
    const text = await readTextIfExists(path.join(repoRoot, docPath));
    if (/placeholder|not implemented|directory structure only/i.test(text)) {
      findings.push({
        id: `DOC_PLACEHOLDER_${docPath.replace(/[^A-Za-z0-9]/g, '_').toUpperCase()}`,
        severity: docPath.includes('api-subscriptions') ? 'P2' : 'P1',
        category: 'documented-placeholder',
        title: `Module doc still describes placeholder or not-implemented behavior`,
        evidence: docPath,
        recommendation: 'Either implement the documented surface or update the doc to the canonical owner and proof path.',
      });
    }
  }

  return findings;
};

const collectV1Findings = (projectIndex) => {
  const findings = [];
  for (const row of projectIndex.v1WorkMap ?? []) {
    if (row.status === 'PASS' || row.status === 'PASS_LOCAL') {
      if (row.status === 'PASS_LOCAL' && row.module === 'Bots') {
        findings.push({
          id: 'V1_BOTS_PROD_CLICKTHROUGH_OPEN',
          severity: 'P1',
          category: 'v1-proof-gap',
          title: 'Bots is locally proven but still lacks production-safe clickthrough',
          evidence: row.nextProof,
          recommendation: 'Run or add non-destructive production clickthrough on throwaway fixtures before final V1 claim.',
        });
      }
      continue;
    }

    findings.push({
      id: `V1_${row.module.replace(/[^A-Za-z0-9]/g, '_').toUpperCase()}_${row.status}`,
      severity: row.risk.startsWith('P0') ? 'P0' : row.risk.startsWith('P1') ? 'P1' : 'P2',
      category: 'v1-proof-gap',
      title: `${row.module} remains ${row.status}`,
      evidence: row.nextProof,
      recommendation: `Execute the mapped proof path from project index priority ${row.auditPriority}.`,
    });
  }
  return findings;
};

const classifySourceMatch = (match) => {
  const excerptLower = match.excerpt.toLowerCase();
  if (
    match.rule === 'NOT_IMPLEMENTED' &&
    (match.excerpt.includes('ExchangeNotImplementedError') ||
      (match.file.includes('/i18n/namespaces/') &&
        (excerptLower.includes('not implemented yet') ||
          excerptLower.includes('nie jest jeszcze') ||
          excerptLower.includes('noch nicht'))))
  ) {
    return null;
  }

  if (
    match.rule === 'PLACEHOLDER_SOURCE' &&
    match.file.includes('/i18n/namespaces/') &&
    (excerptLower.includes('placeholder') || excerptLower.includes('platzhalter'))
  ) {
    return null;
  }

  if (
    match.rule === 'NOT_IMPLEMENTED' &&
    (match.excerpt.includes('ExchangeNotImplementedError') ||
      match.file.includes('/i18n/namespaces/'))
  ) {
    return {
      severity: 'P2',
      category: 'source-capability-gate',
      recommendation:
        'Triage as accepted fail-closed capability gating unless the V1 matrix row expects this exchange operation to be supported.',
    };
  }

  if (match.rule === 'PLACEHOLDER_SOURCE' && match.file.includes('/i18n/namespaces/')) {
    return {
      severity: 'P2',
      category: 'source-capability-gate',
      recommendation:
        'Triage against the exchange capability matrix; this may be accepted copy for unsupported placeholder adapters.',
    };
  }

  return {
    severity: match.severity,
    category: 'source-marker',
    recommendation: 'Review whether this is test/tooling-only, accepted fail-closed behavior, or unfinished product work.',
  };
};

const collectQueueFindings = (projectIndex) => {
  const unchecked = projectIndex.uncheckedTasks ?? [];
  const noneMarkers = unchecked.filter((task) => task.text.includes('(none)'));
  const realUnchecked = unchecked.filter((task) => !task.text.includes('(none)'));
  const protectedBlocked = realUnchecked.filter((task) =>
    protectedQueueBlockerPatterns.some((pattern) => task.text.includes(pattern)),
  );
  const unclassifiedUnchecked = realUnchecked.filter(
    (task) => !protectedBlocked.includes(task),
  );
  const findings = [];

  if (noneMarkers.length > 0) {
    findings.push({
      id: 'QUEUE_NONE_MARKERS_INDEXED_AS_UNCHECKED',
      severity: 'P2',
      category: 'queue-hygiene',
      title: 'Queue scan still sees unchecked `(none)` markers',
      evidence: noneMarkers.map((task) => `${task.source}:${task.line}`).join(', '),
      recommendation: 'Ignore these in execution selection or change queue formatting so scan output is cleaner.',
    });
  }

  if (unclassifiedUnchecked.length > 0) {
    findings.push({
      id: 'QUEUE_OPEN_ITEMS_EXIST',
      severity: 'P1',
      category: 'queue-open-work',
      title: `${unclassifiedUnchecked.length} unchecked queue markers remain`,
      evidence: unclassifiedUnchecked.slice(0, 8).map((task) => `${task.source}:${task.line} ${task.text}`).join(' | '),
      recommendation: 'Classify each as executable, blocked by auth/approval, or historical carryover.',
    });
  }

  if (protectedBlocked.length > 0) {
    findings.push({
      id: 'QUEUE_PROTECTED_BLOCKERS_OPEN',
      severity: 'P2',
      category: 'queue-blocked',
      title: `${protectedBlocked.length} protected/auth queue markers remain open`,
      evidence: protectedBlocked.slice(0, 8).map((task) => `${task.source}:${task.line} ${task.text}`).join(' | '),
      recommendation: 'Keep these open until approved protected auth, production-safe fixtures, or required approvals are available.',
    });
  }

  return findings;
};

const summarizeBy = (items, key) =>
  items.reduce((accumulator, item) => {
    const value = item[key] ?? 'unknown';
    accumulator[value] = (accumulator[value] ?? 0) + 1;
    return accumulator;
  }, {});

const buildScan = async (options) => {
  const indexPath = path.resolve(repoRoot, options.index);
  const projectIndex = JSON.parse(await readTextIfExists(indexPath));
  const [sourceMarkers, surfaceFindings] = await Promise.all([
    scanSourceMarkers(),
    collectSurfaceFindings(projectIndex),
  ]);

  const sourceFindings = sourceMarkers.matches.flatMap((match) => {
    const classification = classifySourceMatch(match);
    if (!classification) {
      return [];
    }
    return [
      {
        id: `SOURCE_${match.rule}_${match.file.replace(/[^A-Za-z0-9]/g, '_')}_${match.line}`,
        severity: classification.severity,
        category: classification.category,
        title: `${match.rule} marker in ${match.file}:${match.line}`,
        evidence: match.excerpt,
        recommendation: classification.recommendation,
        location: {
          file: match.file,
          line: match.line,
        },
      },
    ];
  });

  const findings = [
    ...collectV1Findings(projectIndex),
    ...surfaceFindings,
    ...collectQueueFindings(projectIndex),
    ...sourceFindings,
  ];

  return {
    generatedAt: new Date().toISOString(),
    evidenceDate: options.today,
    projectIndex: relativePath(indexPath),
    summary: {
      totalFindings: findings.length,
      bySeverity: summarizeBy(findings, 'severity'),
      byCategory: summarizeBy(findings, 'category'),
      sourceFilesScanned: sourceMarkers.scannedFiles,
      sourceMarkers: sourceMarkers.matches.length,
    },
    findings,
  };
};

const renderFindingsTable = (findings) => {
  if (findings.length === 0) {
    return '| Severity | Category | Finding | Evidence | Recommendation |\n| --- | --- | --- | --- | --- |\n';
  }

  return [
    '| Severity | Category | Finding | Evidence | Recommendation |',
    '| --- | --- | --- | --- | --- |',
    ...findings.map((finding) => {
      const evidence = String(finding.evidence ?? '').replace(/\|/g, '\\|').slice(0, 240);
      const recommendation = String(finding.recommendation ?? '').replace(/\|/g, '\\|').slice(0, 220);
      return `| ${finding.severity} | ${finding.category} | ${finding.title.replace(/\|/g, '\\|')} | ${evidence} | ${recommendation} |`;
    }),
  ].join('\n');
};

const renderMarkdown = (scan) => {
  const topFindings = scan.findings.filter((finding) => ['P0', 'P1'].includes(finding.severity));
  const p2Findings = scan.findings.filter((finding) => finding.severity === 'P2');

  return `# V1 Static Issue Scan

Generated at: ${scan.generatedAt}
Evidence date: ${scan.evidenceDate}
Project index: \`${scan.projectIndex}\`

## Purpose

This is a static inconsistency scan. It identifies proof gaps, surface gaps,
queue drift, and source markers. It does not prove runtime behavior and does
not replace browser/API/DB/exchange action audits.

## Summary

- Total findings: ${scan.summary.totalFindings}
- By severity: ${JSON.stringify(scan.summary.bySeverity)}
- By category: ${JSON.stringify(scan.summary.byCategory)}
- Production/source files scanned for markers: ${scan.summary.sourceFilesScanned}
- Source marker matches: ${scan.summary.sourceMarkers}

## P0/P1 Findings

${renderFindingsTable(topFindings)}

## P2 Findings

${renderFindingsTable(p2Findings)}

## Interpretation

1. \`v1-proof-gap\` means the V1 matrix row lacks accepted action proof; it is
   not automatically a code bug.
2. \`web-surface-gap\`, \`web-route-gap\`, and \`documented-placeholder\` are
   stronger candidates for implementation/documentation drift.
3. \`source-marker\` findings require human triage because some placeholders
   are valid fail-closed behavior or deterministic fallback contracts.
4. Approved exchange capability gates are skipped as open source findings when
   they match the canonical fail-closed exchange capability matrix.
5. Start fixes from P0/P1 findings that overlap the V1 Audit Work Map priority:
   Dashboard Home, Bot Runtime, Auth, Profile API Keys, then Bots production
   clickthrough.
`;
};

const main = async () => {
  const options = parseArgs();
  if (options.help) {
    printHelp();
    return;
  }

  const scan = await buildScan(options);
  const markdownPath = path.resolve(repoRoot, options.markdownOutput);
  const jsonPath = path.resolve(repoRoot, options.jsonOutput);

  await writeFile(markdownPath, renderMarkdown(scan), 'utf8');
  await writeFile(jsonPath, `${JSON.stringify(scan, null, 2)}\n`, 'utf8');

  console.log(`V1 static issue scan written to ${relativePath(markdownPath)}`);
  console.log(`V1 static issue scan JSON written to ${relativePath(jsonPath)}`);
  console.log(`Findings: ${scan.summary.totalFindings}`);
  console.log(`By severity: ${JSON.stringify(scan.summary.bySeverity)}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
