import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

const scriptUrl = `${pathToFileURL(path.resolve('scripts/runV1StaticIssueScan.mjs')).href}?test=${Date.now()}`;
const originalCwd = process.cwd();
const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'soar-static-issue-scan-'));
process.chdir(tempRoot);
const scanner = await import(scriptUrl);

test.after(async () => {
  process.chdir(originalCwd);
  await rm(tempRoot, { recursive: true, force: true });
});

const writeFixture = async (relativeFilePath, content) => {
  const fullPath = path.join(tempRoot, relativeFilePath);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, content, 'utf8');
  return fullPath;
};

test('parseArgs resolves defaults, overrides, and help without reading process argv', () => {
  assert.deepEqual(scanner.parseArgs(['--today', '2026-06-11']), {
    today: '2026-06-11',
    index: 'history/audits/project-index-2026-06-11.json',
    markdownOutput: 'history/audits/v1-static-issue-scan-2026-06-11.md',
    jsonOutput: 'history/audits/v1-static-issue-scan-2026-06-11.json',
    help: false,
  });

  assert.deepEqual(
    scanner.parseArgs([
      '--today',
      '2026-06-11',
      '--index',
      'index.json',
      '--markdown-output',
      'scan.md',
      '--json-output',
      'scan.json',
      '-h',
    ]),
    {
      today: '2026-06-11',
      index: 'index.json',
      markdownOutput: 'scan.md',
      jsonOutput: 'scan.json',
      help: true,
    }
  );
});

test('path and filesystem helpers stay scoped to the captured repository root', async () => {
  await writeFixture('apps/api/src/modules/example.ts', 'export const value = 1;\n');
  await writeFixture('apps/api/src/modules/example.test.ts', 'test("fixture", () => {});\n');
  await writeFixture('node_modules/ignored.ts', 'export const ignored = true;\n');

  assert.equal(scanner.toPosixPath(`apps${path.sep}api${path.sep}src`), 'apps/api/src');
  assert.equal(scanner.relativePath(path.join(tempRoot, 'apps/api/src/modules/example.ts')), 'apps/api/src/modules/example.ts');
  assert.equal(await scanner.fileExists(path.join(tempRoot, 'apps/api/src/modules/example.ts')), true);
  assert.equal(await scanner.directoryExists(path.join(tempRoot, 'apps/api/src/modules')), true);
  assert.equal(await scanner.readTextIfExists(path.join(tempRoot, 'missing.ts')), '');

  const walked = await scanner.walkFiles(tempRoot, (_fullPath, name) => name.endsWith('.ts'));
  assert.deepEqual(walked.map(scanner.relativePath), [
    'apps/api/src/modules/example.test.ts',
    'apps/api/src/modules/example.ts',
  ]);

  assert.equal(scanner.isProductionSource(path.join(tempRoot, 'apps/api/src/modules/example.ts')), true);
  assert.equal(scanner.isProductionSource(path.join(tempRoot, 'apps/api/src/modules/example.test.ts')), false);
  assert.deepEqual(await scanner.listFilesInDirectory(path.join(tempRoot, 'apps/api/src/modules')), [
    'apps/api/src/modules/example.test.ts',
    'apps/api/src/modules/example.ts',
  ]);
});

test('classification suppresses approved exchange/i18n gates and keeps real markers actionable', () => {
  assert.equal(
    scanner.classifySourceMatch({
      rule: 'NOT_IMPLEMENTED',
      file: 'apps/web/src/i18n/namespaces/dashboard.ts',
      excerpt: 'Feature is not implemented yet',
    }),
    null
  );

  assert.equal(
    scanner.classifySourceMatch({
      rule: 'PLACEHOLDER_SOURCE',
      file: 'apps/web/src/i18n/namespaces/dashboard.ts',
      excerpt: 'placeholder label',
    }),
    null
  );

  assert.deepEqual(
    scanner.classifySourceMatch({
      rule: 'HACK',
      severity: 'P1',
      file: 'apps/api/src/modules/example.ts',
      excerpt: 'HACK: temporary',
    }),
    {
      severity: 'P1',
      category: 'source-marker',
      recommendation: 'Review whether this is test/tooling-only, accepted fail-closed behavior, or unfinished product work.',
    }
  );
});

test('collectors convert project-index gaps into static findings', async () => {
  await writeFixture('docs/modules/web-orders.md', 'Canonical orders module.\n');
  await writeFixture('docs/modules/web-positions.md', 'Canonical positions module.\n');
  await writeFixture('docs/modules/api-subscriptions.md', 'directory structure only\n');

  const projectIndex = {
    webFeatures: [
      { name: 'dashboard', fileCount: 0, testFiles: [] },
      { name: 'orders', fileCount: 0, testFiles: [] },
    ],
    apiModules: [
      { name: 'bots', fileCount: 3, testFiles: [] },
      { name: 'users', fileCount: 1, testFiles: [] },
    ],
    nextRoutes: [{ route: '/dashboard' }],
    v1WorkMap: [
      { module: 'Bots', status: 'PASS_LOCAL', risk: 'P1 residual', nextProof: 'prod clickthrough', auditPriority: 1 },
      { module: 'Auth', status: 'BLOCKED', risk: 'P0 auth missing', nextProof: 'auth readback', auditPriority: 2 },
    ],
    uncheckedTasks: [
      { text: '- [ ] (none)', source: '.codex/context/TASK_BOARD.md', line: 10 },
      { text: '- [ ] LIVEIMPORT-03 protected readback', source: '.agents/state/next-steps.md', line: 20 },
      { text: '- [ ] classify queue drift', source: '.agents/state/next-steps.md', line: 21 },
    ],
  };

  const v1Findings = scanner.collectV1Findings(projectIndex);
  const surfaceFindings = await scanner.collectSurfaceFindings(projectIndex);
  const queueFindings = scanner.collectQueueFindings(projectIndex);

  assert.equal(v1Findings.some((finding) => finding.id === 'V1_BOTS_PROD_CLICKTHROUGH_OPEN'), true);
  assert.equal(v1Findings.some((finding) => finding.id === 'V1_AUTH_BLOCKED'), true);
  assert.equal(surfaceFindings.some((finding) => finding.id === 'WEB_FEATURE_EMPTY_DASHBOARD'), true);
  assert.equal(surfaceFindings.some((finding) => finding.id === 'API_MODULE_NO_TESTS_BOTS'), true);
  assert.equal(surfaceFindings.some((finding) => finding.id.includes('DOC_PLACEHOLDER_DOCS_MODULES_API_SUBSCRIPTIONS_MD')), true);
  assert.equal(queueFindings.some((finding) => finding.id === 'QUEUE_NONE_MARKERS_INDEXED_AS_UNCHECKED'), true);
  assert.equal(queueFindings.some((finding) => finding.id === 'QUEUE_PROTECTED_BLOCKERS_OPEN'), true);
  assert.equal(queueFindings.some((finding) => finding.id === 'QUEUE_OPEN_ITEMS_EXIST'), true);
});

test('scanSourceMarkers and buildScan produce deterministic fixture output', async () => {
  await writeFixture('apps/api/src/modules/source-marker.ts', 'export const label = "fake";\n');
  await writeFixture('apps/web/src/__fixtures__/ignored.ts', 'export const ignored = "fake";\n');
  await writeFixture('scripts/example-tool.mjs', 'export const todo = "TODO";\n');
  await writeFixture(
    'history/audits/project-index-2026-06-11.json',
    JSON.stringify({
      webFeatures: [],
      apiModules: [],
      nextRoutes: [],
      v1WorkMap: [],
      uncheckedTasks: [],
    })
  );

  const sourceMarkers = await scanner.scanSourceMarkers();
  assert.equal(sourceMarkers.matches.some((match) => match.file === 'apps/api/src/modules/source-marker.ts'), true);
  assert.equal(sourceMarkers.matches.some((match) => match.file === 'apps/web/src/__fixtures__/ignored.ts'), false);

  const scan = await scanner.buildScan(
    { today: '2026-06-11', index: 'history/audits/project-index-2026-06-11.json' },
    { nowIso: () => '2026-06-11T00:00:00.000Z' }
  );

  assert.equal(scan.generatedAt, '2026-06-11T00:00:00.000Z');
  assert.equal(scan.evidenceDate, '2026-06-11');
  assert.equal(scan.projectIndex, 'history/audits/project-index-2026-06-11.json');
  assert.equal(scan.summary.totalFindings >= 2, true);
  assert.equal(scan.summary.byCategory['source-marker'] >= 2, true);
});

test('renderers and main write Markdown/JSON through injectable outputs', async () => {
  await writeFixture(
    'history/audits/project-index-main.json',
    JSON.stringify({
      webFeatures: [],
      apiModules: [],
      nextRoutes: [],
      v1WorkMap: [],
      uncheckedTasks: [],
    })
  );

  const logs = [];
  const writes = new Map();
  const result = await scanner.main({
    argv: [
      '--today',
      '2026-06-11',
      '--index',
      'history/audits/project-index-main.json',
      '--markdown-output',
      'history/audits/main-scan.md',
      '--json-output',
      'history/audits/main-scan.json',
    ],
    consoleImpl: { log: (message) => logs.push(message) },
    nowIso: () => '2026-06-11T01:02:03.000Z',
    writeFileImpl: async (file, content) => writes.set(scanner.relativePath(file), content),
  });

  const markdown = scanner.renderMarkdown(result.scan);
  assert.match(scanner.renderFindingsTable([]), /Severity/);
  assert.match(markdown, /# V1 Static Issue Scan/);
  assert.match(markdown, /Evidence date: 2026-06-11/);
  assert.equal(writes.has('history/audits/main-scan.md'), true);
  assert.equal(writes.has('history/audits/main-scan.json'), true);
  assert.match(logs.join('\n'), /V1 static issue scan written/);

  const helpLogs = [];
  assert.deepEqual(
    await scanner.main({
      argv: ['--help'],
      consoleImpl: { log: (message) => helpLogs.push(message) },
    }),
    { help: true }
  );
  assert.match(helpLogs.join('\n'), /runV1StaticIssueScan\.mjs/);
});

test('readJsonWithRetry waits for complete JSON instead of accepting empty content', async () => {
  const target = await writeFixture('tmp/retry.json', '');
  const readPromise = scanner.readJsonWithRetry(target, { attempts: 3, delayMs: 5 });
  await writeFile(target, '{"ok":true}\n', 'utf8');

  assert.deepEqual(await readPromise, { ok: true });
});

test('summarizeBy groups missing values as unknown', () => {
  assert.deepEqual(scanner.summarizeBy([{ severity: 'P1' }, { severity: 'P1' }, {}], 'severity'), {
    P1: 2,
    unknown: 1,
  });
});
