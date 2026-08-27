#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const apiRoot = path.join(repoRoot, 'apps', 'api', 'src');
const apiRouterRoot = path.join(apiRoot, 'router');
const apiModulesRoot = path.join(apiRoot, 'modules');
const docsModulesRoot = path.join(repoRoot, 'docs', 'modules');

const routeEntry = path.join(apiRouterRoot, 'index.ts');

const httpMethods = ['get', 'post', 'put', 'patch', 'delete'];

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    date: new Date().toISOString().slice(0, 10),
    outDir: '',
    json: false,
    help: false,
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
    if (arg === '--date') {
      options.date = args[index + 1] ?? options.date;
      index += 1;
      continue;
    }
    if (arg === '--out-dir') {
      options.outDir = args[index + 1] ?? '';
      index += 1;
    }
  }

  if (!options.outDir) {
    options.outDir = path.join(repoRoot, 'docs', 'operations', `api-endpoint-docs-parity-${options.date}`);
  } else {
    options.outDir = path.resolve(repoRoot, options.outDir);
  }

  return options;
};

const toPosix = (value) => value.split(path.sep).join('/');

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

const docPathForModule = (moduleName) => {
  if (moduleName === 'root') return path.join(docsModulesRoot, 'api-root.md');
  if (moduleName === 'admin') return path.join(docsModulesRoot, 'api-admin.md');
  if (moduleName === 'profile') return path.join(docsModulesRoot, 'api-profile.md');
  if (moduleName === 'strategies') return path.join(docsModulesRoot, 'api-strategies.md');
  return path.join(docsModulesRoot, `api-${moduleName}.md`);
};

const resolveImportPath = (fromFile, importPath) => {
  if (!importPath.startsWith('.')) return null;
  const base = path.resolve(path.dirname(fromFile), importPath);
  const candidates = [
    `${base}.ts`,
    `${base}.tsx`,
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
  ];
  return candidates[0];
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

const collectRoutes = async (filePath, basePath = '', visited = new Set()) => {
  const cacheKey = `${filePath}|${basePath}`;
  if (visited.has(cacheKey)) return [];
  visited.add(cacheKey);

  const raw = await readFile(filePath, 'utf8');
  const imports = parseImports(raw, filePath);
  const routes = [];

  for (const method of httpMethods) {
    const methodRegex = new RegExp(`\\b[A-Za-z_$][\\w$]*\\.${method}\\s*\\(\\s*(['"\`])([^'"\`]+)\\1`, 'g');
    let match;
    while ((match = methodRegex.exec(raw))) {
      routes.push({
        method: method.toUpperCase(),
        path: joinRoute(basePath, match[2]),
        sourceFile: toPosix(path.relative(repoRoot, filePath)),
        module: filePath.startsWith(apiModulesRoot) ? moduleNameForRouteFile(filePath) : 'root',
      });
    }
  }

  const useLineRegex = /\b[A-Za-z_$][\w$]*\.use\s*\(\s*(['"`])([^'"`]+)\1\s*,([^\r\n]*)/;
  for (const line of raw.split(/\r?\n/)) {
    const useMatch = line.match(useLineRegex);
    if (!useMatch) continue;
    const [, , mountPath, args] = useMatch;
    for (const [localName, importedFile] of imports) {
      const localRegex = new RegExp(`\\b${localName}\\b`);
      if (!localRegex.test(args)) continue;
      const childRoutes = await collectRoutes(importedFile, joinRoute(basePath, mountPath), visited);
      routes.push(...childRoutes);
    }
  }

  return routes;
};

const routeMentionVariants = (route) => {
  const withoutRoot = route.path === '/' ? '/' : route.path.replace(/\/$/, '');
  const starVariant = withoutRoot.replace(/\/:[^/]+/g, '*');
  const paramlessVariant = withoutRoot.replace(/:[A-Za-z0-9_]+/g, ':id');
  return [...new Set([withoutRoot, paramlessVariant, starVariant])];
};

const readDocText = async (moduleName) => {
  const docPath = docPathForModule(moduleName);
  if (!docPath) return { docPath: null, exists: false, text: '' };
  try {
    return {
      docPath: toPosix(path.relative(repoRoot, docPath)),
      exists: true,
      text: await readFile(docPath, 'utf8'),
    };
  } catch {
    return {
      docPath: toPosix(path.relative(repoRoot, docPath)),
      exists: false,
      text: '',
    };
  }
};

const main = async () => {
  const options = parseArgs();
  if (options.help) {
    console.log('Usage: node scripts/auditApiEndpointDocsParity.mjs [--date yyyy-mm-dd] [--out-dir path] [--json]');
    process.exit(0);
  }

  const routes = (await collectRoutes(routeEntry)).sort((left, right) => {
    const byPath = left.path.localeCompare(right.path);
    return byPath || left.method.localeCompare(right.method);
  });

  const docsByModule = new Map();
  for (const route of routes) {
    if (!docsByModule.has(route.module)) {
      docsByModule.set(route.module, await readDocText(route.module));
    }
  }

  const endpoints = routes.map((route) => {
    const doc = docsByModule.get(route.module);
    const variants = routeMentionVariants(route);
    const documented = doc?.exists ? variants.some((variant) => doc.text.includes(variant)) : false;
    return {
      ...route,
      docsPath: doc?.docPath ?? null,
      documented,
      matchedVariants: documented ? variants.filter((variant) => doc.text.includes(variant)) : [],
    };
  });

  const gaps = endpoints.filter((endpoint) => !endpoint.documented);
  const byModule = {};
  for (const endpoint of endpoints) {
    byModule[endpoint.module] ??= { total: 0, documented: 0, gaps: 0 };
    byModule[endpoint.module].total += 1;
    if (endpoint.documented) byModule[endpoint.module].documented += 1;
    else byModule[endpoint.module].gaps += 1;
  }

  const result = {
    generatedAt: new Date().toISOString(),
    status: gaps.length === 0 ? 'PASS' : 'PARTIAL',
    scope: 'Endpoint-level API docs parity derived from Express router method calls and docs/modules/api-*.md route mentions.',
    counts: {
      endpoints: endpoints.length,
      documented: endpoints.length - gaps.length,
      gaps: gaps.length,
      modules: Object.keys(byModule).length,
    },
    byModule,
    gaps,
    endpoints,
  };

  await mkdir(options.outDir, { recursive: true });
  const jsonPath = path.join(options.outDir, `api-endpoint-docs-parity-${options.date}.json`);
  const mdPath = path.join(options.outDir, `api-endpoint-docs-parity-${options.date}.md`);
  await writeFile(jsonPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');

  const md = [
    `# API Endpoint Docs Parity - ${options.date}`,
    '',
    `Status: ${result.status}`,
    '',
    'Scope: endpoint-level API docs parity derived from Express router method calls and `docs/modules/api-*.md` route mentions.',
    '',
    `- Endpoints: ${result.counts.endpoints}`,
    `- Documented: ${result.counts.documented}`,
    `- Gaps: ${result.counts.gaps}`,
    `- Modules: ${result.counts.modules}`,
    '',
    '## Module Summary',
    '',
    '| Module | Total | Documented | Gaps |',
    '| --- | ---: | ---: | ---: |',
    ...Object.entries(byModule)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([moduleName, summary]) => `| ${moduleName} | ${summary.total} | ${summary.documented} | ${summary.gaps} |`),
    '',
    '## Gaps',
    '',
    gaps.length === 0
      ? 'No endpoint documentation gaps detected.'
      : '| Method | Path | Module | Source | Docs Path |',
    ...(gaps.length === 0
      ? []
      : [
          '| --- | --- | --- | --- | --- |',
          ...gaps.map(
            (gap) =>
              `| ${gap.method} | \`${gap.path}\` | ${gap.module} | \`${gap.sourceFile}\` | ${gap.docsPath ? `\`${gap.docsPath}\`` : ''} |`
          ),
        ]),
    '',
    '## Explicit Limitations',
    '',
    '- This audit checks route mention parity, not full semantic accuracy of every DTO or response body.',
    '- Dynamic route variants are matched conservatively against literal route strings and `*`/`:id` style mentions.',
    '- Root health/ops endpoints are included as `root` and map to `docs/modules/api-root.md`.',
  ].join('\n');

  await writeFile(mdPath, `${md}\n`, 'utf8');

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`API endpoint docs parity status: ${result.status}`);
    console.log(`Endpoints: ${result.counts.endpoints}; documented: ${result.counts.documented}; gaps: ${result.counts.gaps}`);
    console.log(`Wrote ${toPosix(path.relative(repoRoot, mdPath))}`);
    console.log(`Wrote ${toPosix(path.relative(repoRoot, jsonPath))}`);
  }

  if (result.status !== 'PASS') {
    process.exitCode = 2;
  }
};

main().catch((error) => {
  console.error(`api endpoint docs parity audit failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
