import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  buildDriftAudit,
  collectCoveredPaths,
  formatDriftMarkdown,
  main,
  parseCsv,
  summarizeDrift,
  toRepoPath,
  walk,
  writeDriftAudit,
} from "./auditArchitectureGraphDrift.mjs";

test("parseCsv handles quoted commas, escaped quotes, CRLF, and empty rows", () => {
  const rows = parseCsv('entity_path,test_path,reason\r\n"scripts/auditArchitectureGraphDrift.mjs#parseCsv","scripts/auditArchitectureGraphDrift.test.mjs","quoted, ""reason"""\r\n\r\n');

  assert.deepEqual(rows, [
    ["entity_path", "test_path", "reason"],
    [
      "scripts/auditArchitectureGraphDrift.mjs#parseCsv",
      "scripts/auditArchitectureGraphDrift.test.mjs",
      'quoted, "reason"',
    ],
  ]);
  assert.throws(() => parseCsv('"unterminated'), /unclosed quoted field/);
});

test("walk normalizes repo paths and skips generated dependency directories", async () => {
  const fixtureRoot = await mkdtemp(path.join(tmpdir(), "architecture-drift-walk-"));

  try {
    await mkdir(path.join(fixtureRoot, "apps", "api", "src"), { recursive: true });
    await mkdir(path.join(fixtureRoot, "node_modules", "pkg"), { recursive: true });
    await mkdir(path.join(fixtureRoot, ".paperclip", "worktrees", "copied", "apps", "api", "src"), { recursive: true });
    await writeFile(path.join(fixtureRoot, "apps", "api", "src", "health.routes.ts"), "router.get('/health');\n");
    await writeFile(path.join(fixtureRoot, "node_modules", "pkg", "ignored.routes.ts"), "ignored\n");
    await writeFile(
      path.join(fixtureRoot, ".paperclip", "worktrees", "copied", "apps", "api", "src", "copied.routes.ts"),
      "ignored\n",
    );

    assert.equal(
      toRepoPath(path.join(fixtureRoot, "docs", "modules", "api-root.md"), { rootPath: fixtureRoot }),
      "docs/modules/api-root.md",
    );
    assert.deepEqual(walk(fixtureRoot, (filePath) => filePath.endsWith(".routes.ts"), [], { rootPath: fixtureRoot }), [
      "apps/api/src/health.routes.ts",
    ]);
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});

test("buildDriftAudit counts covered and missing representative paths from CSV registries", async () => {
  const fixtureRoot = await mkdtemp(path.join(tmpdir(), "architecture-drift-audit-"));

  try {
    await mkdir(path.join(fixtureRoot, "apps", "api", "src", "modules", "status"), { recursive: true });
    await mkdir(path.join(fixtureRoot, "apps", "web", "src", "app", "dashboard"), { recursive: true });
    await mkdir(path.join(fixtureRoot, "docs", "architecture", "relations"), { recursive: true });
    await mkdir(path.join(fixtureRoot, "docs", "modules"), { recursive: true });
    await writeFile(path.join(fixtureRoot, "apps", "api", "src", "modules", "status", "status.routes.ts"), "router.get('/status');\n");
    await writeFile(path.join(fixtureRoot, "apps", "api", "src", "modules", "status", "status.service.ts"), "export {}\n");
    await writeFile(path.join(fixtureRoot, "apps", "web", "src", "app", "dashboard", "page.tsx"), "export default function Page() {}\n");
    await writeFile(path.join(fixtureRoot, "docs", "modules", "api-status.md"), "# Status\n");
    await writeFile(path.join(fixtureRoot, "package.json"), "{}\n");
    await writeFile(
      path.join(fixtureRoot, "docs", "architecture", "relations", "priority-test-links.csv"),
      [
        "entity_path,test_path,reason",
        "apps/api/src/modules/status/status.routes.ts,apps/api/src/modules/status/status.routes.test.ts,LUC-2646 fixture route coverage",
        "apps/web/src/app/dashboard/page.tsx,apps/web/src/app/dashboard/page.test.tsx,LUC-2646 fixture page coverage",
        "docs/modules/api-status.md,scripts/auditArchitectureGraphDrift.test.mjs,LUC-2646 fixture doc coverage",
        "package.json,scripts/auditArchitectureGraphDrift.test.mjs,LUC-2646 fixture config coverage",
      ].join("\n"),
    );

    const coveredPaths = collectCoveredPaths({ rootPath: fixtureRoot });
    assert.equal(coveredPaths.has("apps/api/src/modules/status/status.routes.ts"), true);
    assert.equal(coveredPaths.has("docs/modules/api-status.md"), true);

    const result = buildDriftAudit({ rootPath: fixtureRoot });

    assert.equal(result.total.total, 5);
    assert.equal(result.total.covered, 4);
    assert.equal(result.total.missing, 1);
    assert.deepEqual(result.categories.apiServices.missingSamples, [
      "apps/api/src/modules/status/status.service.ts",
    ]);
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});

test("summarizeDrift and formatDriftMarkdown expose missing samples", () => {
  const summary = summarizeDrift(["covered.ts", "missing.ts"], new Set(["covered.ts"]));

  assert.deepEqual(summary, {
    total: 2,
    covered: 1,
    missing: 1,
    missingSamples: ["missing.ts"],
  });
  assert.match(
    formatDriftMarkdown({
      total: summary,
      categories: { apiServices: summary },
    }),
    /Missing graph path references \| 1/,
  );
});

test("writeDriftAudit writes markdown and json outputs, and strict main sets exitCode on drift", async () => {
  const fixtureRoot = await mkdtemp(path.join(tmpdir(), "architecture-drift-main-"));

  try {
    await mkdir(path.join(fixtureRoot, "apps", "api", "src", "modules", "status"), { recursive: true });
    await mkdir(path.join(fixtureRoot, "docs", "architecture", "relations"), { recursive: true });
    await writeFile(path.join(fixtureRoot, "apps", "api", "src", "modules", "status", "status.service.ts"), "export {}\n");
    await writeFile(
      path.join(fixtureRoot, "docs", "architecture", "relations", "priority-test-links.csv"),
      "entity_path,test_path,reason\n",
    );

    const outputMarkdown = path.join(fixtureRoot, "history", "architecture-graph-drift.md");
    const outputJson = path.join(fixtureRoot, "history", "architecture-graph-drift.json");
    const result = main(["--fail-on-drift"], { rootPath: fixtureRoot, outputMarkdown, outputJson });

    assert.equal(result.total.missing, 1);
    assert.equal(process.exitCode, 1);
    assert.match(await readFile(outputMarkdown, "utf8"), /Architecture Graph Drift Audit/);
    assert.equal(JSON.parse(await readFile(outputJson, "utf8")).total.missing, 1);

    process.exitCode = undefined;
    writeDriftAudit({ generatedAt: "test", total: { total: 0, covered: 0, missing: 0 }, categories: {} }, {
      outputMarkdown,
      outputJson,
    });
    assert.equal(JSON.parse(await readFile(outputJson, "utf8")).generatedAt, "test");
  } finally {
    process.exitCode = undefined;
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});
