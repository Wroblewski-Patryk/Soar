import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  collectRoutes,
  docPathForModule,
  joinRoute,
  moduleNameForRouteFile,
  normalizeRoutePart,
  parseArgs,
  parseImports,
  resolveImportPath,
  routeMentionVariants,
  toPosix,
} from './auditApiEndpointDocsParity.mjs';

test('parseArgs resolves date, output directory, json, and help options', () => {
  const options = parseArgs([
    '--date',
    '2026-06-07',
    '--out-dir',
    'history/artifacts/luc-2639-api-endpoint-docs-parity',
    '--json',
    '--help',
  ]);

  assert.equal(options.date, '2026-06-07');
  assert.equal(options.json, true);
  assert.equal(options.help, true);
  assert.match(toPosix(options.outDir), /history\/artifacts\/luc-2639-api-endpoint-docs-parity$/);
});

test('route helpers normalize mounted Express route paths', () => {
  assert.equal(normalizeRoutePart(''), '');
  assert.equal(normalizeRoutePart('/'), '');
  assert.equal(normalizeRoutePart('dashboard'), '/dashboard');
  assert.equal(joinRoute('/dashboard', '/bots/:id/'), '/dashboard/bots/:id/');
  assert.deepEqual(routeMentionVariants({ path: '/dashboard/bots/:id/' }), [
    '/dashboard/bots/:id',
    '/dashboard/bots*',
  ]);
});

test('module and docs helpers map API route files to canonical module docs', () => {
  assert.equal(
    moduleNameForRouteFile(path.join(process.cwd(), 'apps', 'api', 'src', 'modules', 'profile', 'profile.routes.ts')),
    'profile'
  );
  assert.equal(toPosix(path.relative(process.cwd(), docPathForModule('root'))), 'docs/modules/api-root.md');
  assert.equal(toPosix(path.relative(process.cwd(), docPathForModule('admin'))), 'docs/modules/api-admin.md');
  assert.equal(toPosix(path.relative(process.cwd(), docPathForModule('bots'))), 'docs/modules/api-bots.md');
});

test('parseImports and resolveImportPath follow existing relative route imports', async () => {
  const fixtureRoot = await mkdtemp(path.join(tmpdir(), 'api-endpoint-docs-parity-'));
  const nestedDir = path.join(fixtureRoot, 'nested');

  try {
    await mkdir(nestedDir);
    const entryFile = path.join(fixtureRoot, 'router.ts');
    const childFile = path.join(nestedDir, 'index.ts');
    await writeFile(
      entryFile,
      ["import nestedRouter from './nested';", "import ignored from 'external-package';"].join('\n'),
      'utf8'
    );
    await writeFile(childFile, 'nestedRouter.get("/items", handler);', 'utf8');

    assert.equal(resolveImportPath(entryFile, './nested'), childFile);
    assert.equal(resolveImportPath(entryFile, 'external-package'), null);
    assert.deepEqual([...parseImports(await readFile(entryFile, 'utf8'), entryFile)], [['nestedRouter', childFile]]);
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});

test('collectRoutes walks mounted routers and preserves source files', async () => {
  const fixtureRoot = await mkdtemp(path.join(tmpdir(), 'api-endpoint-docs-parity-'));
  const nestedDir = path.join(fixtureRoot, 'nested');

  try {
    await mkdir(nestedDir);
    const entryFile = path.join(fixtureRoot, 'router.ts');
    await writeFile(
      entryFile,
      [
        "import nestedRouter from './nested';",
        'router.get("/health", handler);',
        'router.use("/dashboard/nested", nestedRouter);',
      ].join('\n'),
      'utf8'
    );
    await writeFile(
      path.join(nestedDir, 'index.ts'),
      [
        'nestedRouter.post("/:id/actions", handler);',
        'nestedRouter.patch("/items/:itemId", handler);',
      ].join('\n'),
      'utf8'
    );

    const routes = await collectRoutes(entryFile);

    assert.deepEqual(
      routes.map((route) => `${route.method} ${route.path}`),
      [
        'GET /health',
        'POST /dashboard/nested/:id/actions',
        'PATCH /dashboard/nested/items/:itemId',
      ]
    );
    assert.ok(routes.every((route) => route.sourceFile.endsWith('.ts')));
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});
