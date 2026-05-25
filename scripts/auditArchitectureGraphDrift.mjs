import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const docsRootName = fs.existsSync(path.join(root, "docs")) ? "docs" : "docs";
const docsRoot = path.join(root, docsRootName);
const registryRoot = path.join(docsRoot, "architecture");
const outputMarkdown = path.join(docsRoot, "status", "architecture-graph-drift.md");
const outputJson = path.join(root, "history", "artifacts", "architecture-graph-drift-2026-05-24.json");
const failOnDrift = process.argv.includes("--fail-on-drift");

function toRepoPath(filePath) {
  const relativePath = path.relative(root, filePath).replaceAll("\\", "/");
  if (relativePath.startsWith(`${docsRootName}/`)) {
    return `docs/${relativePath.slice(`${docsRootName}/`.length)}`;
  }
  return relativePath;
}

function walk(dir, predicate, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next" || entry.name === "dist" || entry.name === "coverage") {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, predicate, results);
    } else if (predicate(fullPath)) {
      results.push(toRepoPath(fullPath));
    }
  }
  return results;
}

function parseCsv(text) {
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

function collectCoveredPaths() {
  const covered = new Set();
  const csvFiles = walk(registryRoot, (filePath) => filePath.endsWith(".csv"));
  const pathPattern = /(?:^|[;\s])((?:apps|docs|history|scripts|libs|\.agents|\.codex|\.github|prisma)\/[^;\s"]+|(?:package\.json|pnpm-workspace\.yaml|pnpm-lock\.yaml|docker-compose(?:\.[^;\s"]+)?\.yml|Dockerfile))/g;

  for (const csvFile of csvFiles) {
    const fullPath = csvFile.startsWith("docs/")
      ? path.join(docsRoot, csvFile.slice("docs/".length))
      : path.join(root, csvFile);
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

function inventory() {
  const apiRoot = path.join(root, "apps", "api", "src");
  const webRoot = path.join(root, "apps", "web", "src");
  const repoRootPredicates = [
    (filePath) => path.basename(filePath) === "package.json",
    (filePath) => path.basename(filePath) === "pnpm-workspace.yaml",
    (filePath) => path.basename(filePath).startsWith("docker-compose") && filePath.endsWith(".yml"),
    (filePath) => filePath.includes(`${path.sep}.github${path.sep}workflows${path.sep}`) && filePath.endsWith(".yml"),
  ];

  return {
    apiRoutes: walk(apiRoot, (filePath) => filePath.endsWith(".routes.ts")),
    apiServices: walk(apiRoot, (filePath) => filePath.endsWith(".service.ts")),
    apiTests: walk(apiRoot, (filePath) => /\.test\.ts$|\.e2e\.test\.ts$/.test(filePath)),
    webPages: walk(path.join(webRoot, "app"), (filePath) => filePath.endsWith(`${path.sep}page.tsx`)),
    webComponents: walk(path.join(webRoot, "features"), (filePath) =>
      filePath.includes(`${path.sep}components${path.sep}`) && /\.(tsx|ts)$/.test(filePath),
    ),
    webHooksAndServices: walk(path.join(webRoot, "features"), (filePath) =>
      (filePath.includes(`${path.sep}hooks${path.sep}`) || filePath.includes(`${path.sep}services${path.sep}`)) &&
      /\.(ts|tsx)$/.test(filePath),
    ),
    webTests: walk(webRoot, (filePath) => /\.test\.(tsx|ts)$/.test(filePath)),
    moduleDocs: walk(path.join(docsRoot, "modules"), (filePath) => filePath.endsWith(".md")),
    architectureDocs: walk(path.join(docsRoot, "architecture"), (filePath) =>
      filePath.endsWith(".md") &&
      !filePath.includes(`${path.sep}nodes${path.sep}`) &&
      !filePath.includes(`${path.sep}chains${path.sep}`),
    ),
    configAndPipelines: walk(root, (filePath) => repoRootPredicates.some((predicate) => predicate(filePath))),
  };
}

function summarizeDrift(items, coveredPaths) {
  const missing = items.filter((item) => !coveredPaths.has(item));
  return {
    total: items.length,
    covered: items.length - missing.length,
    missing: missing.length,
    missingSamples: missing.slice(0, 30),
  };
}

const coveredPaths = collectCoveredPaths();
const inventories = inventory();
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

fs.mkdirSync(path.dirname(outputMarkdown), { recursive: true });
fs.mkdirSync(path.dirname(outputJson), { recursive: true });

const markdown = [
  "# Architecture Graph Drift Audit",
  "",
  "Generated by `pnpm run architecture:graph:drift`.",
  "",
  "This audit compares representative source, test, documentation, config, and pipeline files against paths referenced by architecture graph CSV records. `pnpm run quality:guardrails` runs this audit in strict mode and fails when missing graph path references are found.",
  "",
  "## Summary",
  "",
  `| Total inventoried files | ${total.total} |`,
  `| Covered by graph CSV paths | ${total.covered} |`,
  `| Missing graph path references | ${total.missing} |`,
  "",
  "## Categories",
  "",
  "| Category | Total | Covered | Missing |",
  "| --- | ---: | ---: | ---: |",
  ...Object.entries(categories).map(
    ([name, category]) => `| ${name} | ${category.total} | ${category.covered} | ${category.missing} |`,
  ),
  "",
  "## Missing Samples",
  "",
  ...Object.entries(categories).flatMap(([name, category]) => [
    `### ${name}`,
    "",
    ...(category.missingSamples.length === 0
      ? ["- None."]
      : category.missingSamples.map((item) => `- \`${item}\``)),
    "",
  ]),
].join("\n");

fs.writeFileSync(outputMarkdown, `${markdown}\n`, "utf8");
fs.writeFileSync(
  outputJson,
  `${JSON.stringify({ generatedAt: "2026-05-24", total, categories }, null, 2)}\n`,
  "utf8",
);

console.log(
  `Architecture graph drift audit generated: ${total.covered}/${total.total} covered, ${total.missing} missing.`,
);

if (failOnDrift && total.missing > 0) {
  process.exitCode = 1;
}
