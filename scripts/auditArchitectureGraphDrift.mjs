import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const docsRootName = fs.existsSync(path.join(root, "docs")) ? "docs" : "docs";
const docsRoot = path.join(root, docsRootName);
const registryRoot = path.join(docsRoot, "architecture");
const outputMarkdown = path.join(docsRoot, "status", "architecture-graph-drift.md");
const outputJson = path.join(root, "history", "artifacts", "architecture-graph-drift-2026-05-24.json");

export function toRepoPath(filePath, options = {}) {
  const rootPath = options.rootPath ?? root;
  const rootName = options.docsRootName ?? docsRootName;
  const relativePath = path.relative(rootPath, filePath).replaceAll("\\", "/");
  if (relativePath.startsWith(`${rootName}/`)) {
    return `docs/${relativePath.slice(`${rootName}/`.length)}`;
  }
  return relativePath;
}

export function walk(dir, predicate, results = [], options = {}) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next" || entry.name === "dist" || entry.name === "coverage") {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, predicate, results, options);
    } else if (predicate(fullPath)) {
      results.push(toRepoPath(fullPath, options));
    }
  }
  return results;
}

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }

  row.push(cell);
  if (row.some((value) => value.trim() !== "")) rows.push(row);
  if (quoted) throw new Error("CSV parse failed: unclosed quoted field.");
  return rows;
}

export function collectCoveredPaths(options = {}) {
  const rootPath = options.rootPath ?? root;
  const rootName = options.docsRootName ?? docsRootName;
  const docsRootPath = options.docsRootPath ?? path.join(rootPath, rootName);
  const registryRootPath = options.registryRootPath ?? path.join(docsRootPath, "architecture");
  const covered = new Set();
  const csvFiles = walk(registryRootPath, (filePath) => filePath.endsWith(".csv"), [], {
    rootPath,
    docsRootName: rootName,
  });
  const pathPattern = /(?:^|[;\s])((?:apps|docs|history|scripts|libs|\.agents|\.codex|\.github|prisma)\/[^;\s"]+|(?:package\.json|pnpm-workspace\.yaml|pnpm-lock\.yaml|docker-compose(?:\.[^;\s"]+)?\.yml|Dockerfile))/g;

  for (const csvFile of csvFiles) {
    const fullPath = csvFile.startsWith("docs/")
      ? path.join(docsRootPath, csvFile.slice("docs/".length))
      : path.join(rootPath, csvFile);
    const rows = parseCsv(fs.readFileSync(fullPath, "utf8"));
    for (const row of rows.slice(1)) {
      for (const value of row) {
        for (const match of value.matchAll(pathPattern)) {
          covered.add(match[1].replaceAll("\\", "/").replace(/[),.]+$/g, ""));
        }
      }
    }
  }

  return covered;
}

export function inventory(options = {}) {
  const rootPath = options.rootPath ?? root;
  const docsRootPath = options.docsRootPath ?? path.join(rootPath, docsRootName);
  const apiRoot = path.join(rootPath, "apps", "api", "src");
  const webRoot = path.join(rootPath, "apps", "web", "src");
  const repoRootPredicates = [
    (filePath) => path.basename(filePath) === "package.json",
    (filePath) => path.basename(filePath) === "pnpm-workspace.yaml",
    (filePath) => path.basename(filePath).startsWith("docker-compose") && filePath.endsWith(".yml"),
    (filePath) => filePath.includes(`${path.sep}.github${path.sep}workflows${path.sep}`) && filePath.endsWith(".yml"),
  ];

  return {
    apiRoutes: walk(apiRoot, (filePath) => filePath.endsWith(".routes.ts"), [], { rootPath }),
    apiServices: walk(apiRoot, (filePath) => filePath.endsWith(".service.ts"), [], { rootPath }),
    apiTests: walk(apiRoot, (filePath) => /\.test\.ts$|\.e2e\.test\.ts$/.test(filePath), [], { rootPath }),
    webPages: walk(path.join(webRoot, "app"), (filePath) => filePath.endsWith(`${path.sep}page.tsx`), [], { rootPath }),
    webComponents: walk(path.join(webRoot, "features"), (filePath) =>
      filePath.includes(`${path.sep}components${path.sep}`) && /\.(tsx|ts)$/.test(filePath),
      [], { rootPath },
    ),
    webHooksAndServices: walk(path.join(webRoot, "features"), (filePath) =>
      (filePath.includes(`${path.sep}hooks${path.sep}`) || filePath.includes(`${path.sep}services${path.sep}`)) &&
      /\.(ts|tsx)$/.test(filePath),
      [], { rootPath },
    ),
    webTests: walk(webRoot, (filePath) => /\.test\.(tsx|ts)$/.test(filePath), [], { rootPath }),
    moduleDocs: walk(path.join(docsRootPath, "modules"), (filePath) => filePath.endsWith(".md"), [], { rootPath }),
    architectureDocs: walk(path.join(docsRootPath, "architecture"), (filePath) =>
      filePath.endsWith(".md") &&
      !filePath.includes(`${path.sep}nodes${path.sep}`) &&
      !filePath.includes(`${path.sep}chains${path.sep}`),
      [], { rootPath },
    ),
    configAndPipelines: walk(rootPath, (filePath) => repoRootPredicates.some((predicate) => predicate(filePath)), [], {
      rootPath,
    }),
  };
}

export function summarizeDrift(items, coveredPaths) {
  const missing = items.filter((item) => !coveredPaths.has(item));
  return {
    total: items.length,
    covered: items.length - missing.length,
    missing: missing.length,
    missingSamples: missing.slice(0, 30),
  };
}

export function buildDriftAudit(options = {}) {
  const coveredPaths = collectCoveredPaths(options);
  const inventories = inventory(options);
  const categories = Object.fromEntries(
    Object.entries(inventories).map(([name, items]) => [name, summarizeDrift(items, coveredPaths)]),
  );
  const total = Object.values(categories).reduce(
    (acc, category) => ({
      total: acc.total + category.total,
      covered: acc.covered + category.covered,
      missing: acc.missing + category.missing,
    }),
    { total: 0, covered: 0, missing: 0 },
  );

  return { generatedAt: "2026-05-24", total, categories };
}

export function formatDriftMarkdown(result) {
  return [
    "# Architecture Graph Drift Audit",
    "",
    "Generated by `pnpm run architecture:graph:drift`.",
    "",
    "This audit compares representative source, test, documentation, config, and pipeline files against paths referenced by architecture graph CSV records. `pnpm run quality:guardrails` runs this audit in strict mode and fails when missing graph path references are found.",
    "",
    "## Summary",
    "",
    `| Total inventoried files | ${result.total.total} |`,
    `| Covered by graph CSV paths | ${result.total.covered} |`,
    `| Missing graph path references | ${result.total.missing} |`,
    "",
    "## Categories",
    "",
    "| Category | Total | Covered | Missing |",
    "| --- | ---: | ---: | ---: |",
    ...Object.entries(result.categories).map(
      ([name, category]) => `| ${name} | ${category.total} | ${category.covered} | ${category.missing} |`,
    ),
    "",
    "## Missing Samples",
    "",
    ...Object.entries(result.categories).flatMap(([name, category]) => [
      `### ${name}`,
      "",
      ...(category.missingSamples.length === 0
        ? ["- None."]
        : category.missingSamples.map((item) => `- \`${item}\``)),
      "",
    ]),
  ].join("\n");
}

export function writeDriftAudit(result, options = {}) {
  const markdownPath = options.outputMarkdown ?? outputMarkdown;
  const jsonPath = options.outputJson ?? outputJson;
  fs.mkdirSync(path.dirname(markdownPath), { recursive: true });
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  fs.writeFileSync(markdownPath, `${formatDriftMarkdown(result)}\n`, "utf8");
  fs.writeFileSync(jsonPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
}

export function main(args = process.argv.slice(2), options = {}) {
  const failOnDrift = args.includes("--fail-on-drift");
  const result = buildDriftAudit(options);
  writeDriftAudit(result, options);

  console.log(
    `Architecture graph drift audit generated: ${result.total.covered}/${result.total.total} covered, ${result.total.missing} missing.`,
  );

  if (failOnDrift && result.total.missing > 0) {
    process.exitCode = 1;
  }

  return result;
}

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectRun) {
  main();
}
