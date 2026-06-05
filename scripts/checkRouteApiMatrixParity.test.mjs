import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  buildRouteApiMatrixParity,
  collectApiRoutes,
  parseDashboardRouteMap,
  parseTraceabilityMatrix,
} from './checkRouteApiMatrixParity.mjs';

const traceabilityRaw = `
# Traceability Matrix

| Feature | Frontend Entry | Backend Route/API | Service / Module | Database Models | Pipeline | Tests | Related Docs |
|---|---|---|---|---|---|---|---|
| Public entry and offline shell | \`/\`, \`/offline\` | none | app/(public) | n/a | Access/session | route tests | docs/architecture/reference/dashboard-route-map.md |
| Auth session | \`/auth/login\`, \`/auth/register\` | \`/auth/register\`, \`/auth/login\`, \`/auth/me\`, \`/auth/logout\` | api/auth | User | Access/session | auth tests | docs/modules/api-auth.md |
| Bot runtime monitoring | \`/dashboard\`, \`/dashboard/bots*\` | \`/dashboard/bots*\`, \`/dashboard/market-stream/events\` | api/bots | Bot | Runtime | bot tests | docs/modules/api-bots.md |
| Admin subscriptions/users | \`/admin*\` | \`/admin/subscriptions/plans*\`, \`/admin/users*\` | api/admin | User | Admin | admin tests | docs/modules/api-admin.md |
`;

const routeMapRaw = `
# Dashboard Route-to-Feature-to-API Contract

## Canonical Web Route Inventory (V1)
- \`/\`
- \`/auth/login\`
- \`/auth/register\`
- \`/dashboard\`
- \`/dashboard/bots\`
- \`/dashboard/bots/:id/edit\`
- \`/admin\`
- \`/admin/users\`

## Canonical Route Mapping
| Web Route Pattern | Web Feature Ownership | Primary API Contract | Backend Module Ownership | Guardrails |
|---|---|---|---|---|
| \`/auth/login\`, \`/auth/register\` | features/auth | \`/auth/login\`, \`/auth/register\`, \`/auth/me\`, \`/auth/logout\` | api/auth | Public |
| \`/dashboard\` | features/dashboard-home | \`/dashboard/bots*\`, \`/dashboard/market-stream/events\` | api/bots | Auth |
| \`/dashboard/bots*\` | features/bots | \`/dashboard/bots*\` | api/bots | Auth |
| \`/admin/users\` | features/admin/users | \`/admin/users*\` | api/admin/users | Admin |
`;

test('parseTraceabilityMatrix extracts frontend and API route coverage patterns', () => {
  const rows = parseTraceabilityMatrix(traceabilityRaw);

  assert.equal(rows.length, 4);
  assert.deepEqual(rows[1].frontendPatterns, ['/auth/login', '/auth/register']);
  assert.deepEqual(rows[1].apiPatterns, ['/auth/register', '/auth/login', '/auth/me', '/auth/logout']);
});

test('parseDashboardRouteMap extracts inventory and primary API contracts', () => {
  const routeMap = parseDashboardRouteMap(routeMapRaw);

  assert.ok(routeMap.inventoryRoutes.includes('/dashboard/bots/:id/edit'));
  assert.ok(routeMap.mappingRows.some((row) => row.apiPatterns.includes('/dashboard/bots*')));
});

test('buildRouteApiMatrixParity passes when generated web routes and API endpoints are documented by patterns', async () => {
  const result = await buildRouteApiMatrixParity({
    traceabilityRaw,
    routeMapRaw,
    webRoutes: [
      { path: '/', sourceFile: 'apps/web/src/app/(public)/page.tsx' },
      { path: '/auth/login', sourceFile: 'apps/web/src/app/(public)/auth/login/page.tsx' },
      { path: '/dashboard/bots/:id/edit', sourceFile: 'apps/web/src/app/dashboard/bots/[id]/edit/page.tsx' },
      { path: '/admin/users', sourceFile: 'apps/web/src/app/admin/users/page.tsx' },
    ],
    apiRoutes: [
      { method: 'GET', path: '/health', sourceFile: 'apps/api/src/router/index.ts', module: 'root' },
      { method: 'POST', path: '/auth/login', sourceFile: 'apps/api/src/modules/auth/auth.routes.ts', module: 'auth' },
      { method: 'PATCH', path: '/dashboard/bots/abc', sourceFile: 'apps/api/src/modules/bots/bots.routes.ts', module: 'bots' },
      { method: 'GET', path: '/admin/users/abc', sourceFile: 'apps/api/src/modules/admin/users/users.routes.ts', module: 'admin' },
    ],
  });

  assert.equal(result.status, 'PASS');
  assert.equal(result.counts.gaps, 0);
});

test('collectApiRoutes follows mounted router imports that resolve through index files', async () => {
  const fixtureRoot = await mkdtemp(path.join(tmpdir(), 'route-api-matrix-'));
  const nestedDir = path.join(fixtureRoot, 'nested');

  try {
    await mkdir(nestedDir);
    const entryFile = path.join(fixtureRoot, 'router.ts');
    await writeFile(
      entryFile,
      [
        "import nestedRouter from './nested';",
        'router.use("/dashboard/nested", nestedRouter);',
      ].join('\n'),
      'utf8'
    );
    await writeFile(
      path.join(nestedDir, 'index.ts'),
      [
        'nestedRouter.get("/items", handler);',
        'nestedRouter.post("/:id/actions", handler);',
      ].join('\n'),
      'utf8'
    );

    const routes = await collectApiRoutes({ entryFile });

    assert.deepEqual(
      routes.map((route) => `${route.method} ${route.path}`),
      ['POST /dashboard/nested/:id/actions', 'GET /dashboard/nested/items']
    );
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});

test('buildRouteApiMatrixParity fails with actionable gaps when matrix or route map coverage is missing', async () => {
  const result = await buildRouteApiMatrixParity({
    traceabilityRaw,
    routeMapRaw,
    webRoutes: [{ path: '/dashboard/alerts', sourceFile: 'apps/web/src/app/dashboard/alerts/page.tsx' }],
    apiRoutes: [
      {
        method: 'GET',
        path: '/dashboard/alerts/latest',
        sourceFile: 'apps/api/src/modules/alerts/alerts.routes.ts',
        module: 'alerts',
      },
    ],
  });

  assert.equal(result.status, 'FAIL');
  assert.equal(result.gaps.webRoutesMissingInTraceabilityMatrix.length, 1);
  assert.equal(result.gaps.webRoutesMissingInDashboardRouteMap.length, 1);
  assert.equal(result.gaps.apiEndpointsMissingInTraceabilityMatrix.length, 1);
  assert.equal(result.gaps.dashboardApiEndpointsMissingInRouteMap.length, 1);
  assert.match(result.gaps.apiEndpointsMissingInTraceabilityMatrix[0].sourceFile, /alerts\.routes\.ts/);
});
