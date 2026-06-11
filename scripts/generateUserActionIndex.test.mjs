import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  actionIdFor,
  csvEscape,
  gapSeverity,
  includesAny,
  inferActionKind,
  inferSafetyBoundary,
  list,
  main,
  parseCsv,
  proofStatus,
  readCsv,
  rowForAction,
  routeHint,
  splitRefs,
  statusRank,
  unique,
  weakestStatus,
  writeCsv,
} from "./generateUserActionIndex.mjs";

const makeTempRoot = () => fs.mkdtempSync(path.join(os.tmpdir(), "soar-user-action-"));

const writeFixtureCsv = (rootDir, relativePath, rows) => {
  const filePath = path.join(rootDir, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${rows.join("\n")}\n`, "utf8");
  return filePath;
};

test("CSV helpers parse, escape, and roundtrip quoted action metadata", () => {
  const rows = parseCsv('name,note\n"open, bot","line 1\nline ""2"""\n');
  assert.deepEqual(rows, [
    ["name", "note"],
    ["open, bot", 'line 1\nline "2"'],
  ]);

  assert.equal(csvEscape('a,"b"\n'), '"a,""b""\n"');

  const rootDir = makeTempRoot();
  const filePath = path.join(rootDir, "roundtrip.csv");
  writeCsv(filePath, [{ name: "open, bot", note: 'line "2"' }], ["name", "note"]);
  assert.deepEqual(readCsv(filePath), [{ name: "open, bot", note: 'line "2"' }]);
});

test("CSV parser fails closed on unclosed quoted fields", () => {
  assert.throws(() => parseCsv('name\n"unterminated'), /unclosed quoted field/);
});

test("classification helpers infer route, kind, boundary, and proof status", () => {
  const page = {
    id: "SOAR-DASHBOARD-BOT-DETAIL",
    type: "page",
    file_path: "apps/web/src/app/(dashboard)/bots/[id]/page.tsx",
  };

  assert.equal(actionIdFor(page, "SOAR-ACTION-VISIT"), "SOAR-ACTION-VISIT-DASHBOARD-BOT-DETAIL");
  assert.equal(routeHint(page), "/bots/:id");
  assert.deepEqual(splitRefs(" page:a ; api:b| test:c | "), ["page:a", "api:b", "test:c"]);
  assert.deepEqual(unique(["a", "", "a", "b"]), ["a", "b"]);
  assert.equal(list(["a", "", "a", "b"]), "a; b");
  assert.equal(includesAny("manual order submit", ["order"]), true);
  assert.equal(includesAny("preorder checklist", ["order"]), false);
  assert.equal(statusRank("verified"), 0);
  assert.equal(statusRank("unknown-status"), 4);
  assert.equal(weakestStatus(["verified", "blocked", "implemented"]), "blocked");
  assert.equal(weakestStatus(["unknown-status"]), "unknown-status");
  assert.equal(weakestStatus([]), "missing");

  assert.equal(
    inferActionKind({ id: "ui:delete-bot", name: "Delete bot", description: "", type: "ui_element" }, []),
    "destructive_submit",
  );
  assert.equal(
    inferActionKind({ id: "page:dashboard", name: "Dashboard", description: "", type: "page" }, []),
    "route_visit",
  );
  assert.equal(
    inferSafetyBoundary(
      {
        id: "ui:close-live-position",
        name: "Close live position",
        description: "Cancel exchange order",
        file_path: "apps/web/src/app/(dashboard)/positions/page.tsx",
      },
      ["api:orders"],
    ),
    "protected; money_or_exchange; destructive",
  );

  assert.equal(proofStatus(["verified"], "production clickthrough evidence"), "verified_with_runtime_evidence");
  assert.equal(proofStatus(["verified"], "registry row"), "verified_from_registry");
  assert.equal(proofStatus(["verified_local"], "local test"), "verified_local_only");
});

test("rowForAction builds deterministic action rows from page, API, chain, and relation records", () => {
  const page = {
    id: "page:bot-detail",
    type: "page",
    name: "Bot detail",
    feature: "bot-management",
    module: "web",
    status: "implemented",
    verification_status: "verified_local",
    description: "Protected bot detail",
    file_path: "apps/web/src/app/(dashboard)/bots/[id]/page.tsx",
    api_related: "api:update-bot",
    ui_related: "ui:save-bot",
    tests_related: "scripts/generateUserActionIndex.test.mjs",
    docs_related: "docs/status/user-action-index.md",
    database_related: "model:bot",
    child_ids: "ui:save-bot",
    related_files: "apps/web/src/app/(dashboard)/bots/[id]/page.tsx",
    risk_level: "high",
    last_verified_at: "2026-06-07",
  };
  const ui = {
    id: "ui:save-bot",
    type: "ui_element",
    name: "Save bot",
    feature: "bot-management",
    module: "web",
    status: "implemented",
    verification_status: "verified_local",
    description: "Submit bot update",
    file_path: "apps/web/src/features/bots/BotForm.tsx",
    api_related: "",
    tests_related: "",
    docs_related: "",
    database_related: "model:bot",
    used_by: "page:bot-detail",
    parent_id: "page:bot-detail",
    related_files: "apps/web/src/features/bots/BotForm.tsx",
    risk_level: "high",
    last_verified_at: "2026-06-07",
  };
  const api = { id: "api:update-bot", type: "api_route", tests_related: "scripts/generateUserActionIndex.test.mjs" };
  const service = {
    id: "service:update-bot",
    type: "service",
    tests_related: "scripts/generateUserActionIndex.test.mjs",
    docs_related: "docs/status/user-action-index.md",
  };
  const model = { id: "model:bot", type: "database_model" };
  const nodesById = new Map([page, ui, api, service, model].map((node) => [node.id, node]));
  const chains = [
    {
      id: "CHAIN-BOT-UPDATE",
      chain_node_ids: "page:bot-detail|ui:save-bot|api:update-bot|service:update-bot|model:bot",
      tests_related: "scripts/generateUserActionIndex.test.mjs",
      docs_related: "docs/status/user-action-index.md",
      evidence: "history/tasks/luc-2872-local-proof.md",
      status: "verified_local",
    },
  ];
  const relations = [{ source_id: "ui:save-bot", target_id: "api:update-bot", relation_type: "calls" }];

  const row = rowForAction({
    node: ui,
    actionSource: "explicit_ui_element",
    pages: [page],
    chains,
    nodesById,
    relations,
  });

  assert.equal(row.id, "SOAR-ACTION-ui:save-bot");
  assert.equal(row.action_kind, "mutation_submit");
  assert.equal(row.route_or_entrypoint, "/bots/:id");
  assert.equal(row.safety_boundary, "protected; mutation");
  assert.equal(row.page_nodes, "page:bot-detail");
  assert.equal(row.api_routes, "api:update-bot");
  assert.equal(row.function_chains, "CHAIN-BOT-UPDATE");
  assert.equal(row.backend_functions, "service:update-bot");
  assert.equal(row.data_models, "model:bot");
  assert.equal(row.tests, "scripts/generateUserActionIndex.test.mjs");
  assert.equal(row.proof_status, "verified_local_only");
});

test("gapSeverity classifies critical, high, medium, and none action gaps", () => {
  assert.equal(gapSeverity(["no_tests"]), "critical");
  assert.equal(gapSeverity(["protected_or_money_path_needs_fresh_browser_or_production_proof"]), "high");
  assert.equal(gapSeverity(["no_explicit_ui_action_controls"]), "medium");
  assert.equal(gapSeverity([]), "none");
});

test("main generates user action index rows from isolated graph fixtures", () => {
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
      "parent_id",
      "depends_on",
      "child_ids",
    ].join(","),
    "page:bot-detail,page,Bot detail,bot-management,web,implemented,verified_local,Protected bot detail,apps/web/src/app/(dashboard)/bots/[id]/page.tsx,api:update-bot,ui:save-bot,scripts/generateUserActionIndex.test.mjs,docs/status/user-action-index.md,model:bot,,apps/web/src/app/(dashboard)/bots/[id]/page.tsx,high,2026-06-07,,,ui:save-bot",
    "api:update-bot,api_route,Update bot,bot-management,api,implemented,verified,Updates bot,apps/api/src/routes/bots.ts,,,scripts/generateUserActionIndex.test.mjs,docs/status/user-action-index.md,model:bot,ui:save-bot,apps/api/src/routes/bots.ts,high,2026-06-07,,,",
    "service:update-bot,service,Update bot service,bot-management,api,implemented,verified,Persists bot,apps/api/src/services/bots.ts,,,scripts/generateUserActionIndex.test.mjs,docs/status/user-action-index.md,model:bot,api:update-bot,apps/api/src/services/bots.ts,medium,2026-06-07,,,",
    "model:bot,database_model,Bot,bot-management,api,verified,verified,Bot model,apps/api/prisma/schema.prisma,,,scripts/generateUserActionIndex.test.mjs,docs/status/user-action-index.md,,service:update-bot,apps/api/prisma/schema.prisma,medium,2026-06-07,,,",
  ]);
  writeFixtureCsv(rootDir, "docs/architecture/registry/ui_elements.csv", [
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
      "parent_id",
      "depends_on",
      "child_ids",
    ].join(","),
    "ui:save-bot,ui_element,Save bot,bot-management,web,implemented,verified_local,Submit bot update,apps/web/src/features/bots/BotForm.tsx,api:update-bot,,scripts/generateUserActionIndex.test.mjs,docs/status/user-action-index.md,model:bot,page:bot-detail,apps/web/src/features/bots/BotForm.tsx,high,2026-06-07,page:bot-detail,,",
  ]);
  writeFixtureCsv(rootDir, "docs/architecture/relations/dependencies.csv", [
    "source_id,target_id,relation_type",
    "ui:save-bot,api:update-bot,calls",
    "api:update-bot,service:update-bot,calls",
    "service:update-bot,model:bot,writes",
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
    "CHAIN-BOT-UPDATE,bot-management,Bot Update,page:bot-detail,page:bot-detail|ui:save-bot|api:update-bot|service:update-bot|model:bot,scripts/generateUserActionIndex.test.mjs,docs/status/user-action-index.md,history/tasks/luc-2872-local-proof.md,,verified_local,high,2026-06-07,fixture",
  ]);

  const payload = main({ rootDir, today: "2026-06-07", failOnCriticalGaps: false });

  assert.equal(payload.summary.counts.actions, 2);
  assert.equal(payload.summary.counts.routeVisitActions, 1);
  assert.equal(payload.summary.counts.explicitUiActions, 1);
  assert.equal(payload.summary.counts.criticalGaps, 0);

  const saveAction = payload.actions.find((row) => row.id === "SOAR-ACTION-ui:save-bot");
  assert.equal(saveAction.action_kind, "mutation_submit");
  assert.equal(saveAction.route_or_entrypoint, "/bots/:id");
  assert.equal(saveAction.safety_boundary, "protected; mutation");
  assert.equal(saveAction.api_routes, "api:update-bot");
  assert.equal(saveAction.backend_functions, "service:update-bot");
  assert.equal(saveAction.data_models, "model:bot");
  assert.equal(saveAction.proof_status, "verified_local_only");
  assert.match(saveAction.gaps, /local_only_without_fresh_browser_or_production_proof/);

  const generatedIndex = JSON.parse(
    fs.readFileSync(path.join(rootDir, "docs", "graphs", "user-action-index.json"), "utf8"),
  );
  assert.equal(generatedIndex.summary.generatedAt, "2026-06-07");
  assert.equal(
    fs.existsSync(path.join(rootDir, "history", "artifacts", "user-action-index-2026-06-07.json")),
    true,
  );
  assert.match(
    fs.readFileSync(path.join(rootDir, "docs", "status", "user-action-index.md"), "utf8"),
    /User Action Evidence Index/,
  );
});
