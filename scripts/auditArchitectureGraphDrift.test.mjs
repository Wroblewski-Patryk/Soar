import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const auditScript = fileURLToPath(new URL("./auditArchitectureGraphDrift.mjs", import.meta.url));

test("strict graph audit remains read-only and rejects missing graph paths", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "soar-graph-drift-"));
  assert.equal(path.dirname(root), os.tmpdir());
  assert.match(path.basename(root), /^soar-graph-drift-/);
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const sourceDir = path.join(root, "apps", "api", "src");
  const graphDir = path.join(root, "docs", "architecture");
  const reportDir = path.join(root, "docs", "status");
  const artifactDir = path.join(root, "history", "artifacts");
  for (const dir of [sourceDir, graphDir, reportDir, artifactDir]) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(path.join(sourceDir, "covered.service.ts"), "export {};\n");
  fs.writeFileSync(path.join(graphDir, "graph.csv"), "id,path\n1,apps/api/src/covered.service.ts\n");
  const reportPath = path.join(reportDir, "architecture-graph-drift.md");
  fs.writeFileSync(reportPath, "Existing tracked report.\n");

  const run = (...args) => spawnSync(process.execPath, [auditScript, ...args], {
    cwd: root, encoding: "utf8", windowsHide: true,
  });
  const covered = run("--fail-on-drift");
  assert.equal(covered.status, 0, covered.stderr);
  assert.match(covered.stdout, /checked: 1\/1 covered, 0 missing/);
  assert.equal(fs.readFileSync(reportPath, "utf8"), "Existing tracked report.\n");
  assert.deepEqual(fs.readdirSync(artifactDir), []);

  fs.writeFileSync(path.join(sourceDir, "missing.service.ts"), "export {};\n");
  const drifted = run("--fail-on-drift");
  assert.equal(drifted.status, 1, drifted.stderr);
  assert.match(drifted.stdout, /checked: 1\/2 covered, 1 missing/);
  assert.equal(fs.readFileSync(reportPath, "utf8"), "Existing tracked report.\n");
  assert.deepEqual(fs.readdirSync(artifactDir), []);

  const generated = run();
  assert.equal(generated.status, 0, generated.stderr);
  assert.match(generated.stdout, /generated: 1\/2 covered, 1 missing/);
  assert.match(fs.readFileSync(reportPath, "utf8"), /Missing graph path references \| 1/);
  assert.equal(fs.readdirSync(artifactDir).length, 1);
});
