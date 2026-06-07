import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile, mkdir } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  collectMissing,
  collectPageFiles,
  directoryExists,
  fileExists,
  listDirectoryNames,
  main,
  normalizeRouteFromPage,
  parseArgs,
  parseCanonicalRoutes,
  parseModuleRows,
  printHelp,
  resolveRepoPath,
  toPosixPath,
} from './checkDocsParity.mjs';

const withTempDir = async (callback) => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'soar-docs-parity-'));
  try {
    return await callback(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
};

test('parses docs parity CLI options and resolves output paths', () => {
  const defaults = parseArgs([]);
  assert.deepEqual(defaults, {
    json: false,
    output: '',
    help: false,
  });

  const options = parseArgs(['--json', '--output', 'tmp/docs-parity.json', '--help']);
  assert.equal(options.json, true);
  assert.equal(options.help, true);
  assert.match(options.output, /tmp[\\/]docs-parity\.json$/);
});

test('normalizes repository paths and POSIX path output', () => {
  assert.equal(toPosixPath(['apps', 'web', 'src'].join(path.sep)), 'apps/web/src');
  assert.match(resolveRepoPath('docs/modules/example.md'), /docs[\\/]modules[\\/]example\.md$/);
  assert.match(resolveRepoPath('apps/api/src/modules'), /apps[\\/]api[\\/]src[\\/]modules$/);
});

test('checks files, directories, and sorted directory names', async () => {
  await withTempDir(async (dir) => {
    await mkdir(path.join(dir, 'zeta'));
    await mkdir(path.join(dir, 'alpha'));
    const filePath = path.join(dir, 'note.md');
    await writeFile(filePath, 'note', 'utf8');

    assert.equal(await directoryExists(dir), true);
    assert.equal(await directoryExists(filePath), false);
    assert.equal(await fileExists(filePath), true);
    assert.equal(await fileExists(path.join(dir, 'missing.md')), false);
    assert.deepEqual(await listDirectoryNames(dir), ['alpha', 'zeta']);
  });
});

test('collects page files and converts app pages to canonical routes', async () => {
  await withTempDir(async (dir) => {
    const appRoot = path.join(dir, 'app');
    const rootPage = path.join(appRoot, 'page.tsx');
    const groupedPage = path.join(appRoot, '(dashboard)', 'bots', '[botId]', 'page.tsx');
    await mkdir(path.dirname(rootPage), { recursive: true });
    await mkdir(path.dirname(groupedPage), { recursive: true });
    await writeFile(rootPage, 'export default function Page() { return null; }', 'utf8');
    await writeFile(groupedPage, 'export default function Page() { return null; }', 'utf8');
    await writeFile(path.join(appRoot, '(dashboard)', 'layout.tsx'), 'ignored', 'utf8');

    const pageFiles = await collectPageFiles(appRoot);
    assert.deepEqual(pageFiles, [rootPage, groupedPage].sort((a, b) => a.localeCompare(b)));
    assert.equal(normalizeRouteFromPage(appRoot, rootPage), '/');
    assert.equal(normalizeRouteFromPage(appRoot, groupedPage), '/bots/:botId');
  });
});

test('parses module rows and canonical route inventory from docs markdown', () => {
  const moduleRows = parseModuleRows(`
| Layer | Module | Source | Target | Status | Planned task |
| api | bots | \`apps/api/src/modules/bots\` | \`docs/modules/api/bots.md\` | Published | none |
| web | dashboard | \`apps/web/src/features/dashboard\` | \`docs/modules/web/dashboard.md\` | Draft | LUC-X |
| bad | row | without | code | fences | ignored |
`);

  assert.deepEqual(moduleRows, [
    {
      layer: 'api',
      module: 'bots',
      sourcePath: 'apps/api/src/modules/bots',
      targetDocPath: 'docs/modules/api/bots.md',
      status: 'Published',
      plannedTask: 'none',
    },
    {
      layer: 'web',
      module: 'dashboard',
      sourcePath: 'apps/web/src/features/dashboard',
      targetDocPath: 'docs/modules/web/dashboard.md',
      status: 'Draft',
      plannedTask: 'LUC-X',
    },
  ]);

  const routes = parseCanonicalRoutes(`
## Other Section
- \`/ignored\`
## Canonical Web Route Inventory (V1)
- \`/dashboard\`
- \`/dashboard/bots/:botId\`
- \`/dashboard\`
## Later Section
- \`/after\`
`);

  assert.deepEqual(routes, ['/dashboard', '/dashboard/bots/:botId']);
});

test('collects missing parity items and prints CLI help', () => {
  assert.deepEqual(collectMissing(['api', 'web', 'ai'], new Set(['api', 'web'])), ['ai']);

  const originalLog = console.log;
  const messages = [];
  console.log = (message) => messages.push(String(message));
  try {
    printHelp();
  } finally {
    console.log = originalLog;
  }

  assert.match(messages.join('\n'), /Usage: node scripts\/checkDocsParity\.mjs/);
});

test('main remains CLI-compatible while returning JSON result for focused proof', async () => {
  await withTempDir(async (dir) => {
    const outputPath = path.join(dir, 'docs-parity-result.json');
    const result = await main(['--json', '--output', outputPath], { exitOnFailure: false });
    const written = JSON.parse(await readFile(outputPath, 'utf8'));

    assert.equal(result.status, 'PASS');
    assert.equal(written.status, 'PASS');
    assert.equal(result.counts.apiModulesOnDisk, result.counts.apiModulesDocumented);
    assert.equal(result.counts.webFeaturesOnDisk, result.counts.webFeaturesDocumented);
    assert.equal(result.counts.routesOnDisk, result.counts.routesDocumented);
    assert.deepEqual(result.mismatches.apiModulesMissingInDocs, []);
    assert.deepEqual(result.mismatches.missingPublishedDeepDiveDocs, []);
  });
});

test('CLI executes the checker when invoked directly', () => {
  const result = spawnSync(process.execPath, ['scripts/checkDocsParity.mjs'], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Docs parity status: PASS/);
  assert.match(result.stdout, /Inventory counts => API: 22\/22, Web: 16\/16, Routes: 39\/39/);
});
