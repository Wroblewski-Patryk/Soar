import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  canvasEdge,
  canvasNode,
  canvasSafeId,
  countBy,
  docsRel,
  firstNonEmpty,
  link,
  parseCsv,
  posix,
  readCsv,
  rel,
  splitRefs,
  statusOrder,
  table,
  walkFiles,
  wiki,
} from "./buildObsidianVaultLayer.mjs";

test("parseCsv handles quoted cells, escaped quotes, CRLF, and unterminated quotes", () => {
  const rows = parseCsv('name,path,reason\r\n"Obsidian, layer","docs/obsidian/README.md","quoted ""reason"""\r\n\r\n');

  assert.deepEqual(rows, [
    ["name", "path", "reason"],
    ["Obsidian, layer", "docs/obsidian/README.md", 'quoted "reason"'],
  ]);
  assert.throws(() => parseCsv('"unterminated'), /unclosed quoted field/);
});

test("readCsv and path helpers normalize repository and docs-relative paths", () => {
  const rows = readCsv("docs/architecture/relations/priority-test-links.csv");

  assert.equal(
    rows.some((row) => row.entity_path === "scripts/buildObsidianVaultLayer.mjs"),
    true,
  );
  assert.equal(posix(`docs${path.sep}obsidian${path.sep}README.md`), "docs/obsidian/README.md");
  assert.equal(rel(path.join(process.cwd(), "scripts", "buildObsidianVaultLayer.mjs")), "scripts/buildObsidianVaultLayer.mjs");
  assert.equal(docsRel(path.join(process.cwd(), "docs", "obsidian", "README.md")), "obsidian/README.md");
});

test("walkFiles skips generated folders and returns stable repository-relative ordering", async () => {
  const fixtureRoot = await mkdtemp(path.join(tmpdir(), "obsidian-vault-layer-walk-"));

  try {
    await mkdir(path.join(fixtureRoot, "docs", "obsidian"), { recursive: true });
    await mkdir(path.join(fixtureRoot, "docs", ".obsidian"), { recursive: true });
    await mkdir(path.join(fixtureRoot, "docs", "node_modules", "pkg"), { recursive: true });
    await writeFile(path.join(fixtureRoot, "docs", "obsidian", "README.md"), "# Obsidian\n");
    await writeFile(path.join(fixtureRoot, "docs", ".obsidian", "workspace.json"), "{}\n");
    await writeFile(path.join(fixtureRoot, "docs", "node_modules", "pkg", "ignored.md"), "# Ignored\n");

    assert.deepEqual(
      walkFiles(path.join(fixtureRoot, "docs")).map((filePath) => path.relative(fixtureRoot, filePath).split(path.sep).join("/")),
      ["docs/obsidian/README.md"],
    );
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});

test("formatting and count helpers produce deterministic markdown-ready values", () => {
  assert.deepEqual(countBy([{ layer: "web" }, { layer: "" }, { layer: "web" }], "layer"), [
    ["web", 2],
    ["unknown", 1],
  ]);
  assert.equal(firstNonEmpty("", null, "  ", "fallback"), "fallback");
  assert.equal(link("architecture/README.md", "Architecture"), "[Architecture](../architecture/README.md)");
  assert.equal(wiki("obsidian/feature-index.md"), "[[obsidian/feature-index.md|obsidian/feature-index]]");
  assert.equal(statusOrder("critical") < statusOrder("verified"), true);
  assert.match(table([{ Name: "A|B", Count: 1 }]), /A\\\|B/);
  assert.deepEqual(splitRefs("chain-a; chain-b|chain-c"), ["chain-a", "chain-b", "chain-c"]);
});

test("canvas helpers sanitize ids and build Obsidian canvas node and edge records", () => {
  assert.equal(canvasSafeId("A/B C?D".repeat(20)).length, 80);
  assert.equal(canvasSafeId("A/B C?D"), "A-B-C-D");
  assert.deepEqual(canvasNode("node-1", 10, 20, 300, 120, "docs/README.md", "file", "4"), {
    id: "node-1",
    type: "file",
    x: 10,
    y: 20,
    width: 300,
    height: 120,
    color: "4",
    file: "docs/README.md",
  });
  assert.deepEqual(canvasEdge("edge-1", "from", "to", "links"), {
    id: "edge-1",
    fromNode: "from",
    fromSide: "right",
    toNode: "to",
    toSide: "left",
    label: "links",
  });
});
