import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  csvEscape,
  gapSeverity,
  isApiDataSourceRelation,
  isUserFacingChain,
  list,
  main,
  normalizeStatus,
  parseCsv,
  readCsv,
  splitRefs,
  statusRank,
  weakestStatus,
  writeCsv,
} from "./generateFunctionJourneyIndexes.mjs";

const makeTempRoot = () => fs.mkdtempSync(path.join(os.tmpdir(), "soar-function-journey-"));

const writeFixtureCsv = (rootDir, relativePath, rows) => {
  const filePath = path.join(rootDir, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, rows.join("\n") + "\n", "utf8");
  return filePath;
};

test("parseCsv/readCsv/writeCsv/csvEscape preserve quoted cells and newlines", () => {
  const rows = parseCsv('name,note\n"alpha, beta","line 1\nline ""2"""\n');
  assert.deepEqual(rows, [
    ["name", "note"],
    ["alpha, beta", 'line 1\nline "2"'],
  ]);

  assert.equal(csvEscape('a,"b"\n'), '"a,""b""\n"');

  const rootDir = makeTempRoot();
  const filePath = path.join(rootDir, "roundtrip.csv");
  writeCsv(filePath, [{ name: "alpha, beta", note: 'line "2"' }], ["name", "note"]);
  assert.deepEqual(readCsv(filePath), [{ name: "alpha, beta", note: 'line "2"' }]);
});

test("parseCsv fails closed on unclosed quoted fields", () => {
  assert.throws(() => parseCsv('name\n"unterminated'), /unclosed quoted field/);
});

test("splitRefs/list/status helpers normalize journey evidence values", () => {
  assert.deepEqual(splitRefs(" page:a ; api:b| test:c | "), ["page:a", "api:b", "test:c"]);
  assert.equal(list([{ id: "a" }, { id: "" }, { id: "b" }], (row) => row.id), "a; b");
  assert.equal(statusRank("verified"), 0);
  assert.equal(statusRank("unknown-status"), 4);
  assert.equal(normalizeStatus("blocked"), "blocked");
  assert.equal(normalizeStatus("unknown-status"), "");
  assert.equal(weakestStatus(["verified", "blocked", "implemented"]), "blocked");
  assert.equal(weakestStatus(["unknown-status"]), "missing");
});

test("gapSeverity classifies critical, high, medium, and none gaps", () => {
  assert.equal(gapSeverity(["no_tests"]), "critical");
  assert.equal(gapSeverity(["production_or_browser_proof_not_implied"]), "high");
  assert.equal(gapSeverity(["no_docs"]), "medium");
  assert.equal(gapSeverity([]), "none");
});

test("relation and chain classifiers identify API data and user-facing chains", () => {
  assert.equal(isApiDataSourceRelation({ relation_type: "reads" }), true);
  assert.equal(isApiDataSourceRelation({ relation_type: "documents" }), false);

  assert.equal(
    isUserFacingChain(
      { feature: "dashboard-runtime" },
      [{ type: "service" }, { type: "page" }],
    ),
    true,
  );
  assert.equal(
    isUserFacingChain(
      { feature: "release-audit-tooling" },
      [{ type: "page" }],
    ),
    false,
  );
});

test("main generates local function journey indexes from isolated graph fixtures", () => {
  const rootDir = makeTempRoot();
  writeFixtureCsv(rootDir, "docs/architecture/registry/nodes.csv", [
    [
      "id",
      "type",
      "name",
      "feature",
      "module",
      "status",
      "verification_status",
      "description",
      "file_path",
      "api_related",
      "ui_related",
      "tests_related",
      "docs_related",
      "database_related",
      "used_by",
      "related_files",
      "risk_level",
      "last_verified_at",
    ].join(","),
    "page:dashboard,page,Dashboard,dashboard,web,implemented,verified_local,Protected dashboard page,apps/web/src/app/dashboard/page.tsx,api:positions,component:table,scripts/generateFunctionJourneyIndexes.test.mjs,docs/status/function-journey-index.md,,component:table,apps/web/src/app/dashboard/page.tsx,high,2026-06-07",
    "component:table,component,Runtime Table,dashboard,web,implemented,verified_local,Runtime table,apps/web/src/features/runtime/Table.tsx,api:positions,,scripts/generateFunctionJourneyIndexes.test.mjs,docs/status/function-journey-index.md,,page:dashboard,apps/web/src/features/runtime/Table.tsx,high,2026-06-07",
    "api:positions,api_route,GET /positions,dashboard,api,implemented,verified_local,Positions route,apps/api/src/routes/positions.ts,,,scripts/generateFunctionJourneyIndexes.test.mjs,docs/status/function-journey-index.md,model:position,component:table,apps/api/src/routes/positions.ts,high,2026-06-07",
    "service:positions,service,Positions service,dashboard,api,implemented,verified,Reads positions,apps/api/src/services/positions.ts,,,scripts/generateFunctionJourneyIndexes.test.mjs,docs/status/function-journey-index.md,model:position,api:positions,apps/api/src/services/positions.ts,medium,2026-06-07",
    "model:position,database_model,Position,dashboard,api,verified,verified,Position model,apps/api/prisma/schema.prisma,,,scripts/generateFunctionJourneyIndexes.test.mjs,docs/status/function-journey-index.md,,service:positions,apps/api/prisma/schema.prisma,medium,2026-06-07",
  ]);
  writeFixtureCsv(rootDir, "docs/architecture/chains/chains.csv", [
    [
      "id",
      "feature",
      "name",
      "trigger_node_id",
      "chain_node_ids",
      "tests_related",
      "docs_related",
      "evidence",
      "missing_links",
      "status",
      "risk_level",
      "last_verified_at",
      "notes",
    ].join(","),
    "CHAIN-DASHBOARD,dashboard,Dashboard Journey,page:dashboard,page:dashboard|component:table|api:positions|service:positions|model:position,scripts/generateFunctionJourneyIndexes.test.mjs,docs/status/function-journey-index.md,history/tasks/luc-2871-local-proof.md,,verified_local,high,2026-06-07,fixture",
  ]);
  writeFixtureCsv(rootDir, "docs/architecture/relations/dependencies.csv", [
    "source_id,target_id,relation_type",
    "api:positions,model:position,reads",
    "component:table,api:positions,calls",
  ]);

  const payload = main({ rootDir, today: "2026-06-07", failOnCriticalGaps: false });

  assert.equal(payload.summary.counts.chains, 1);
  assert.equal(payload.summary.counts.webJourneys, 1);
  assert.equal(payload.summary.counts.apiRoutes, 1);
  assert.equal(payload.summary.counts.criticalGaps, 0);
  assert.equal(payload.functionChains[0].entry_pages, "page:dashboard");
  assert.equal(payload.apiSurfaces[0].data_models, "model:position");
  assert.match(payload.functionChains[0].gaps, /production_or_browser_proof_not_implied/);

  const functionIndex = JSON.parse(
    fs.readFileSync(path.join(rootDir, "docs", "graphs", "function-journey-index.json"), "utf8"),
  );
  assert.equal(functionIndex.summary.generatedAt, "2026-06-07");
  assert.equal(
    fs.existsSync(path.join(rootDir, "history", "artifacts", "function-journey-index-2026-06-07.json")),
    true,
  );
  assert.match(
    fs.readFileSync(path.join(rootDir, "docs", "status", "function-journey-index.md"), "utf8"),
    /Function Journey Evidence Index/,
  );
});
