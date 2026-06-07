#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const repoRoot = process.cwd();
const webAppRoot = path.join(repoRoot, 'apps', 'web', 'src', 'app');
const apiRoot = path.join(repoRoot, 'apps', 'api', 'src');
const apiRouterRoot = path.join(apiRoot, 'router');
const apiModulesRoot = path.join(apiRoot, 'modules');
const traceabilityMatrixPath = path.join(repoRoot, 'docs', 'architecture', 'traceability-matrix.md');
const dashboardRouteMapPath = path.join(repoRoot, 'docs', 'architecture', 'reference', 'dashboard-route-map.md');
const routeEntry = path.join(apiRouterRoot, 'index.ts');

const httpMethods = ['get', 'post', 'put', 'patch', 'delete'];
const rootOpsEndpointPatterns = [
  '/',
  '/health',
  '/ready',
  '/ready/details',
  '/metrics',
  '/alerts',
  '/workers/health',
  '/workers/ready',
  '/workers/runtime-freshness',
];

const toPosix = (value) => value.split(path.sep).join('/');

const pathExists = async (targetPath) => {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
};

const parseArgs = (args = process.argv.slice(2)) => {
  const options = {
    json: false,
    help: false,
    output: '',
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      continue;
    }
    if (arg === '--json') {
      options.json = true;
      continue;
    }
    if (arg === '--output') {
      options.output = args[index + 1] ?? '';
      index += 1;
    }
  }

  if (options.output) {
    options.output = path.resolve(repoRoot, options.output);
  }

  return options;
};

const normalizeRoutePart = (value) => {
  if (!value || value === '/') return '';
  return value.startsWith('/') ? value : `/${value}`;
};

const joinRoute = (basePath, routePath) => {
  const joined = `${normalizeRoutePart(basePath)}${normalizeRoutePart(routePath)}`;
  return joined || '/';
};

const moduleNameForRouteFile = (filePath) => {
  const relative = path.relative(apiModulesRoot, filePath);
  const [topLevel] = relative.split(path.sep);
  return topLevel || 'root';
};

const resolveImportPath = (fromFile, importPath) => {
  if (!importPath.startsWith('.')) return null;
  const base = path.resolve(path.dirname(fromFile), importPath);
  return [
    `${base}.ts`,
    `${base}.tsx`,
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
  ].find((candidatePath) => existsSync(candidatePath)) ?? null;
};

const parseImports = (raw, filePath) => {
  const imports = new Map();
  const defaultImportRegex = /import\s+([A-Za-z_$][\w$]*)\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = defaultImportRegex.exec(raw))) {
    const [, localName, importPath] = match;
    const resolved = resolveImportPath(filePath, importPath);
    if (resolved) imports.set(localName, resolved);
  }
  return imports;
};

export const collectApiRoutes = async ({
  entryFile = routeEntry,
  basePath = '',
  visited = new Set(),
} = {}) => {
  const cacheKey = `${entryFile}|${basePath}`;
  if (visited.has(cacheKey)) return [];
  visited.add(cacheKey);

  const raw = await readFile(entryFile, 'utf8');
  const imports = parseImports(raw, entryFile);
  const routes = [];

  for (const method of httpMethods) {
    const methodRegex = new RegExp(`\\b[A-Za-z_$][\\w$]*\\.${method}\\s*\\(\\s*(['"\`])([^'"\`]+)\\1`, 'g');
    let match;
    while ((match = methodRegex.exec(raw))) {
      routes.push({
        method: method.toUpperCase(),
        path: joinRoute(basePath, match[2]),
        sourceFile: toPosix(path.relative(repoRoot, entryFile)),
        module: entryFile.startsWith(apiModulesRoot) ? moduleNameForRouteFile(entryFile) : 'root',
      });
    }
  }

  const useLineRegex = /\b[A-Za-z_$][\w$]*\.use\s*\(\s*(['"`])([^'"`]+)\1\s*,([^\r\n]*)/;
  for (const line of raw.split(/\r?\n/)) {
    const useMatch = line.match(useLineRegex);
    if (!useMatch) continue;
    const [, , mountPath, args] = useMatch;
    for (const [localName, importedFile] of imports) {
      if (!new RegExp(`\\b${localName}\\b`).test(args)) continue;
      routes.push(
        ...(await collectApiRoutes({
          entryFile: importedFile,
          basePath: joinRoute(basePath, mountPath),
          visited,
        }))
      );
    }
  }

  return routes.sort((left, right) => left.path.localeCompare(right.path) || left.method.localeCompare(right.method));
};

const collectPageFiles = async (rootDir) => {
  const stack = [rootDir];
  const pageFiles = [];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }
      if (entry.isFile() && entry.name === 'page.tsx') {
        pageFiles.push(fullPath);
      }
    }
  }

  return pageFiles.sort((a, b) => a.localeCompare(b));
};

const normalizeRouteFromPage = (appRoot, pageFile) => {
  const relative = path.relative(appRoot, pageFile);
  const segments = relative.split(path.sep);
  if (segments.at(-1) === 'page.tsx') segments.pop();
  const visibleSegments = segments
    .filter((segment) => !(segment.startsWith('(') && segment.endsWith(')')))
    .map((segment) => (segment.startsWith('[') && segment.endsWith(']') ? `:${segment.slice(1, -1)}` : segment));
  return visibleSegments.length === 0 ? '/' : `/${visibleSegments.join('/')}`;
};

const collectWebRoutes = async ({ appRoot = webAppRoot } = {}) => {
  const pageFiles = await collectPageFiles(appRoot);
  return pageFiles
    .map((filePath) => ({
      path: normalizeRouteFromPage(appRoot, filePath),
      sourceFile: toPosix(path.relative(repoRoot, filePath)),
    }))
    .sort((left, right) => left.path.localeCompare(right.path));
};

const splitMarkdownTableRow = (line) =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());

const extractRouteTokens = (value) => {
  const tokens = new Set();
  const codeRegex = /`([^`]*\/[^`]*)`/g;
  let match;
  while ((match = codeRegex.exec(value))) {
    for (const part of match[1].split(/,\s*/)) {
      if (part.startsWith('/')) tokens.add(part.trim());
    }
  }
  const bareRegex = /(?:^|[\s,(])((?:\/[A-Za-z0-9:_*.-]+)+\*?)/g;
  while ((match = bareRegex.exec(value))) {
    tokens.add(match[1].trim());
  }
  return [...tokens].filter(Boolean);
};

export const parseTraceabilityMatrix = (raw) => {
  const rows = [];
  for (const line of raw.split(/\r?\n/)) {
    if (!line.startsWith('|') || line.includes('---')) continue;
    const cells = splitMarkdownTableRow(line);
    if (cells.length < 7 || cells[0] === 'Feature') continue;
    rows.push({
      feature: cells[0],
      frontendPatterns: extractRouteTokens(cells[1]),
      apiPatterns: extractRouteTokens(cells[2]),
      raw: line,
    });
  }
  return rows;
};

export const parseDashboardRouteMap = (raw) => {
  const inventoryRoutes = [];
  const mappingRows = [];
  let inInventory = false;

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed === '## Canonical Web Route Inventory (V1)') {
      inInventory = true;
      continue;
    }
    if (inInventory && trimmed.startsWith('## ')) {
      inInventory = false;
    }
    if (inInventory && trimmed.startsWith('- `')) {
      inventoryRoutes.push(trimmed.slice(3, trimmed.lastIndexOf('`')).trim());
      continue;
    }

    if (!line.startsWith('|') || line.includes('---')) continue;
    const cells = splitMarkdownTableRow(line);
    if (cells.length < 5 || cells[0] === 'Web Route Pattern') continue;
    mappingRows.push({
      webPatterns: extractRouteTokens(cells[0]),
      apiPatterns: extractRouteTokens(cells[2]),
      raw: line,
    });
  }

  return {
    inventoryRoutes: [...new Set(inventoryRoutes)].sort((a, b) => a.localeCompare(b)),
    mappingRows,
  };
};

const patternToRegex = (pattern) => {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  const withParams = escaped
    .replace(/\*/g, '.*')
    .replace(/:[A-Za-z0-9_]+/g, '[^/]+');
  return new RegExp(`^${withParams}(?:/.*)?$`);
};

const routeMatchesPattern = (routePath, pattern) => {
  const normalizedPattern = pattern.replace(/\/$/, '') || '/';
  const normalizedRoute = routePath.replace(/\/$/, '') || '/';
  if (!normalizedPattern.includes('*') && !normalizedPattern.includes(':')) {
    if (normalizedRoute === normalizedPattern) return true;
    const segmentCount = normalizedPattern.split('/').filter(Boolean).length;
    return segmentCount >= 2 && normalizedRoute.startsWith(`${normalizedPattern}/`);
  }
  return patternToRegex(normalizedPattern).test(normalizedRoute);
};

const routeCoveredByPatterns = (routePath, patterns) =>
  patterns.some((pattern) => routeMatchesPattern(routePath, pattern));

const firstCoveringRow = (routePath, rows, key) =>
  rows.find((row) => routeCoveredByPatterns(routePath, row[key]));

const uniquePatternsFromRows = (rows, key) =>
  [...new Set(rows.flatMap((row) => row[key]))].sort((left, right) => left.localeCompare(right));

export const buildRouteApiMatrixParity = async ({
  traceabilityRaw,
  routeMapRaw,
  webRoutes,
  apiRoutes,
} = {}) => {
  const matrixRows = parseTraceabilityMatrix(
    traceabilityRaw ?? (await readFile(traceabilityMatrixPath, 'utf8'))
  );
  const routeMap = parseDashboardRouteMap(
    routeMapRaw ?? (await readFile(dashboardRouteMapPath, 'utf8'))
  );
  const actualWebRoutes = webRoutes ?? (await collectWebRoutes());
  const actualApiRoutes = apiRoutes ?? (await collectApiRoutes());

  const matrixFrontendRows = matrixRows.filter((row) => row.frontendPatterns.length > 0);
  const matrixApiRows = matrixRows.filter((row) => row.apiPatterns.length > 0);
  const routeMapApiRows = routeMap.mappingRows.filter((row) => row.apiPatterns.length > 0);
  const routeMapApiPatterns = uniquePatternsFromRows(routeMapApiRows, 'apiPatterns');

  const routeMapInventorySet = new Set(routeMap.inventoryRoutes);
  const rootOpsEndpointSet = new Set(rootOpsEndpointPatterns);

  const webRouteGaps = actualWebRoutes
    .filter((route) => !firstCoveringRow(route.path, matrixFrontendRows, 'frontendPatterns'))
    .map((route) => ({
      route: route.path,
      sourceFile: route.sourceFile,
      missingIn: 'docs/architecture/traceability-matrix.md Frontend Entry',
    }));

  const routeMapInventoryGaps = actualWebRoutes
    .filter((route) => !routeMapInventorySet.has(route.path))
    .map((route) => ({
      route: route.path,
      sourceFile: route.sourceFile,
      missingIn: 'docs/architecture/reference/dashboard-route-map.md canonical inventory',
    }));

  const apiEndpointGaps = actualApiRoutes
    .filter((route) => !rootOpsEndpointSet.has(route.path))
    .filter((route) => !firstCoveringRow(route.path, matrixApiRows, 'apiPatterns'))
    .map((route) => ({
      method: route.method,
      route: route.path,
      module: route.module,
      sourceFile: route.sourceFile,
      missingIn: 'docs/architecture/traceability-matrix.md Backend Route/API',
    }));

  const routeMapApiGaps = actualApiRoutes
    .filter((route) => route.path.startsWith('/dashboard/') || route.path.startsWith('/admin/'))
    .filter((route) => !firstCoveringRow(route.path, routeMapApiRows, 'apiPatterns'))
    .map((route) => ({
      method: route.method,
      route: route.path,
      module: route.module,
      sourceFile: route.sourceFile,
      missingIn: 'docs/architecture/reference/dashboard-route-map.md Primary API Contract',
    }));

  const routeMapTraceabilityGaps = routeMap.inventoryRoutes
    .filter((route) => !firstCoveringRow(route, matrixFrontendRows, 'frontendPatterns'))
    .map((route) => ({
      route,
      sourceFile: 'docs/architecture/reference/dashboard-route-map.md',
      missingIn: 'docs/architecture/traceability-matrix.md Frontend Entry',
    }));

  const routeMapApiTraceabilityGaps = routeMapApiPatterns
    .filter((pattern) => !routeCoveredByPatterns(pattern, uniquePatternsFromRows(matrixApiRows, 'apiPatterns')))
    .map((pattern) => ({
      route: pattern,
      sourceFile: 'docs/architecture/reference/dashboard-route-map.md',
      missingIn: 'docs/architecture/traceability-matrix.md Backend Route/API',
    }));

  const gaps = {
    webRoutesMissingInTraceabilityMatrix: webRouteGaps,
    webRoutesMissingInDashboardRouteMap: routeMapInventoryGaps,
    apiEndpointsMissingInTraceabilityMatrix: apiEndpointGaps,
    dashboardApiEndpointsMissingInRouteMap: routeMapApiGaps,
    routeMapRoutesMissingInTraceabilityMatrix: routeMapTraceabilityGaps,
    routeMapApiContractsMissingInTraceabilityMatrix: routeMapApiTraceabilityGaps,
  };
  const hasFailures = Object.values(gaps).some((bucket) => bucket.length > 0);

  return {
    generatedAt: new Date().toISOString(),
    status: hasFailures ? 'FAIL' : 'PASS',
    scope:
      'Generated guardrail comparing Next page routes, Express API endpoints, and architecture route docs with traceability-matrix.md and dashboard-route-map.md coverage patterns.',
    counts: {
      webRoutes: actualWebRoutes.length,
      apiEndpoints: actualApiRoutes.length,
      traceabilityRows: matrixRows.length,
      dashboardRouteMapInventoryRoutes: routeMap.inventoryRoutes.length,
      gaps: Object.values(gaps).reduce((total, bucket) => total + bucket.length, 0),
    },
    gaps,
  };
};

const renderGapLines = (gaps) => {
  const lines = [];
  for (const [key, bucket] of Object.entries(gaps)) {
    if (bucket.length === 0) {
      lines.push(`- ${key}: OK`);
      continue;
    }
    lines.push(`- ${key}: ${bucket.length}`);
    for (const gap of bucket) {
      lines.push(`  * ${gap.method ? `${gap.method} ` : ''}${gap.route} (${gap.sourceFile})`);
    }
  }
  return lines;
};

const main = async () => {
  const options = parseArgs();
  if (options.help) {
    console.log('Usage: node scripts/checkRouteApiMatrixParity.mjs [--json] [--output <file>]');
    process.exit(0);
  }

  const result = await buildRouteApiMatrixParity();

  if (options.output) {
    const outputDir = path.dirname(options.output);
    if (!(await pathExists(outputDir))) {
      await mkdir(outputDir, { recursive: true });
    }
    await writeFile(options.output, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  }

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Route/API matrix parity status: ${result.status}`);
    console.log(
      `Inventory counts => Web routes: ${result.counts.webRoutes}; API endpoints: ${result.counts.apiEndpoints}; traceability rows: ${result.counts.traceabilityRows}; route-map inventory: ${result.counts.dashboardRouteMapInventoryRoutes}; gaps: ${result.counts.gaps}`
    );
    for (const line of renderGapLines(result.gaps)) {
      console.log(line);
    }
  }

  if (result.status !== 'PASS') {
    process.exit(1);
  }
};

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectRun) {
  main().catch((error) => {
    console.error(`route/api matrix parity check failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  });
}
