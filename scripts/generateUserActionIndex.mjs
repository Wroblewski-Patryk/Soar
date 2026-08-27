import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const today = "2026-05-25";
const docsRootName = fs.existsSync(path.join(root, "docs")) ? "docs" : "docs";
const docsRoot = path.join(root, docsRootName);
const architectureRoot = path.join(docsRoot, "architecture");
const registryDir = path.join(architectureRoot, "registry");
const relationsDir = path.join(architectureRoot, "relations");
const chainsDir = path.join(architectureRoot, "chains");
const indicesDir = path.join(architectureRoot, "indices");
const graphsDir = path.join(docsRoot, "graphs");
const statusDir = path.join(docsRoot, "status");
const artifactsDir = path.join(root, "history", "artifacts");
const failOnCriticalGaps = process.argv.includes("--fail-on-critical-gaps");

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

function readCsv(filePath) {
  const rows = parseCsv(fs.readFileSync(filePath, "utf8"));
  const headers = rows[0] ?? [];
  return rows.slice(1).map((row) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = row[index] ?? "";
    });
    return record;
  });
}

function splitRefs(value) {
  return String(value || "")
    .split(/[;|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

function writeCsv(filePath, rows, headers) {
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
  ];
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function list(values) {
  return unique(values).join("; ");
}

function actionIdFor(node, prefix) {
  return `${prefix}-${node.id.replace(/^SOAR-/, "")}`;
}

function routeHint(node) {
  const filePath = node.file_path || "";
  const match = filePath.match(/apps\/web\/src\/app\/(.+)\/page\.tsx$/);
  if (!match) return filePath;
  const route = match[1]
    .split("/")
    .filter((segment) => !/^\(.+\)$/.test(segment))
    .map((segment) => (segment.startsWith("[") && segment.endsWith("]") ? ":id" : segment))
    .join("/");
  return `/${route}`;
}

function statusRank(status) {
  const ranks = {
    verified: 0,
    verified_local: 1,
    partially_verified: 2,
    implemented: 3,
    implemented_not_verified: 4,
    in_progress: 5,
    blocked: 6,
    broken: 7,
    missing: 8,
  };
  return ranks[status] ?? 4;
}

function weakestStatus(statuses) {
  return statuses.filter(Boolean).sort((a, b) => statusRank(b) - statusRank(a))[0] || "missing";
}

function includesAny(text, terms) {
  const lower = String(text || "").toLowerCase();
  return terms.some((term) => new RegExp(`(^|[^a-z0-9])${term}([^a-z0-9]|$)`, "i").test(lower));
}

function inferActionKind(node, apiIds) {
  const combined = `${node.id} ${node.name} ${node.description} ${apiIds.join(" ")}`;
  if (includesAny(combined, ["delete", "cancel", "close", "reset"])) return "destructive_submit";
  if (includesAny(combined, ["create", "update", "submit", "open", "upsert", "import", "attach", "manual"])) return "mutation_submit";
  if (node.type === "page") return "route_visit";
  return "ui_interaction";
}

function inferSafetyBoundary(node, apiIds) {
  const combined = `${node.id} ${node.name} ${node.description} ${node.file_path} ${apiIds.join(" ")}`;
  const boundaries = [];
  if (includesAny(combined, ["app/(public)", "public", "login", "register", "landing"])) boundaries.push("public");
  if (includesAny(combined, ["dashboard", "admin", "profile", "wallet", "bot", "runtime"])) boundaries.push("protected");
  if (includesAny(combined, ["live", "exchange", "order", "position", "cancel", "close"])) boundaries.push("money_or_exchange");
  if (includesAny(combined, ["delete", "cancel", "close", "reset"])) boundaries.push("destructive");
  else if (includesAny(combined, ["create", "update", "submit", "open", "upsert", "import", "attach"])) boundaries.push("mutation");
  else boundaries.push("read_or_navigation");
  return unique(boundaries).join("; ");
}

function gapSeverity(gaps) {
  if (gaps.some((gap) => /no_tests|mutation_without_api|missing_action_node/.test(gap))) return "critical";
  if (gaps.some((gap) => /protected|production|browser|live|money|partial|local_only/.test(gap))) return "high";
  if (gaps.length > 0) return "medium";
  return "none";
}

function proofStatus(statuses, evidence) {
  const weakest = weakestStatus(statuses);
  if (weakest === "verified" && /prod|production|browser|clickthrough/i.test(evidence)) return "verified_with_runtime_evidence";
  if (weakest === "verified") return "verified_from_registry";
  if (weakest === "verified_local") return "verified_local_only";
  if (weakest === "partially_verified") return "partially_verified";
  return weakest;
}

function rowForAction({ node, actionSource, pages, chains, nodesById, relations }) {
  const directApiIds = splitRefs(node.api_related);
  const relationApiIds = relations
    .filter((relation) => relation.source_id === node.id && /call|api|submit|read|write/i.test(relation.relation_type))
    .map((relation) => relation.target_id)
    .filter((id) => nodesById.get(id)?.type === "api_route");
  const apiIds = unique([...directApiIds, ...relationApiIds]);
  const pageRefs = pages.filter((page) => {
    const refs = [
      ...splitRefs(page.ui_related),
      ...splitRefs(page.child_ids),
      ...splitRefs(page.depends_on),
      ...splitRefs(page.used_by),
      page.id === node.id ? page.id : "",
    ];
    const pageApiIds = splitRefs(page.api_related);
    const sharedApi = apiIds.some((apiId) => pageApiIds.includes(apiId));
    const sharedFeature = page.feature && page.feature === node.feature;
    const pageFiles = splitRefs(page.file_path).concat(splitRefs(page.related_files));
    const nodeFiles = splitRefs(node.file_path).concat(splitRefs(node.related_files));
    const sharedFile = nodeFiles.some((fileRef) => pageFiles.includes(fileRef));
    return (
      refs.includes(node.id) ||
      splitRefs(node.used_by).includes(page.id) ||
      splitRefs(node.parent_id).includes(page.id) ||
      sharedFile ||
      (sharedFeature && sharedApi)
    );
  });
  const candidatePage = node.type === "page" ? node : pageRefs[0];
  const chainRefs = chains.filter((chain) => {
    const chainIds = splitRefs(chain.chain_node_ids);
    return chainIds.includes(node.id) || apiIds.some((apiId) => chainIds.includes(apiId));
  });
  const chainNodes = unique(chainRefs.flatMap((chain) => splitRefs(chain.chain_node_ids))).map((id) => nodesById.get(id)).filter(Boolean);
  const backendFunctions = chainNodes.filter((chainNode) =>
    ["controller", "service", "validation", "validator", "utility", "worker", "middleware"].includes(chainNode.type),
  );
  const dataModels = unique([
    ...splitRefs(node.database_related),
    ...chainNodes.filter((chainNode) => chainNode.type === "database_model").map((chainNode) => chainNode.id),
  ]);
  const tests = unique([
    ...splitRefs(node.tests_related),
    ...chainRefs.flatMap((chain) => splitRefs(chain.tests_related)),
    ...chainNodes.flatMap((chainNode) => splitRefs(chainNode.tests_related)),
  ]);
  const docs = unique([
    ...splitRefs(node.docs_related),
    ...chainRefs.flatMap((chain) => splitRefs(chain.docs_related)),
    ...chainNodes.flatMap((chainNode) => splitRefs(chainNode.docs_related)),
  ]);
  const evidence = unique([
    ...chainRefs.map((chain) => chain.evidence),
    node.related_files,
    node.file_path,
  ]).join("; ");
  const actionKind = inferActionKind(node, apiIds);
  const safetyBoundary = inferSafetyBoundary(node, apiIds);
  const statuses = [node.verification_status || node.status, ...chainRefs.map((chain) => chain.status)];
  const gaps = [];

  if (actionSource === "inferred_route_visit" && splitRefs(node.ui_related).length === 0 && !/redirect|offline|public landing/i.test(node.description)) {
    gaps.push("no_explicit_ui_action_controls");
  }
  if (actionSource === "explicit_ui_element" && pageRefs.length === 0) gaps.push("no_page_entrypoint_relation");
  if (apiIds.length === 0 && /submit|mutation|destructive/.test(actionKind)) gaps.push("mutation_without_api");
  if (tests.length === 0) gaps.push("no_tests");
  if (chainRefs.length === 0 && node.type !== "page") gaps.push("not_in_function_chain");
  if (chainRefs.length === 0 && node.type === "page" && !/redirect|offline|public landing/i.test(node.description)) gaps.push("not_in_function_chain");
  if ((node.verification_status || node.status) === "partially_verified") gaps.push("partial_registry_status");
  if ((node.verification_status || node.status) === "verified_local") gaps.push("local_only_without_fresh_browser_or_production_proof");
  if (/protected|money_or_exchange|destructive/.test(safetyBoundary) && !/prod|production|browser|clickthrough/i.test(evidence)) {
    gaps.push("protected_or_money_path_needs_fresh_browser_or_production_proof");
  }

  return {
    id: actionIdFor(node, actionSource === "explicit_ui_element" ? "SOAR-ACTION" : "SOAR-ACTION-VISIT"),
    source_node_id: node.id,
    action_source: actionSource,
    action_kind: actionKind,
    route_or_entrypoint: candidatePage ? routeHint(candidatePage) : routeHint(node),
    label_or_selector_hint: node.name || node.id,
    feature: node.feature,
    module: node.module,
    safety_boundary: safetyBoundary,
    page_nodes: list(pageRefs.map((page) => page.id).concat(node.type === "page" ? [node.id] : [])),
    ui_nodes: node.type === "page" ? splitRefs(node.ui_related).join("; ") : node.id,
    api_routes: list(apiIds),
    function_chains: list(chainRefs.map((chain) => chain.id)),
    backend_functions: list(backendFunctions.map((backendNode) => backendNode.id)),
    data_models: list(dataModels),
    tests: list(tests),
    docs: list(docs),
    evidence,
    proof_status: proofStatus(statuses, evidence),
    gaps: gaps.join("; "),
    gap_severity: gapSeverity(gaps),
    risk_level: node.risk_level,
    last_verified_at: node.last_verified_at,
    next_validation: gaps.length > 0
      ? "Run or add browser/API proof for this action before claiming end-to-end behavior."
      : "Re-run linked tests and journey proof after touching this action path.",
  };
}

function main() {
  fs.mkdirSync(indicesDir, { recursive: true });
  fs.mkdirSync(graphsDir, { recursive: true });
  fs.mkdirSync(statusDir, { recursive: true });
  fs.mkdirSync(artifactsDir, { recursive: true });

  const nodes = readCsv(path.join(registryDir, "nodes.csv"));
  const explicitUi = readCsv(path.join(registryDir, "ui_elements.csv"));
  const relations = readCsv(path.join(relationsDir, "dependencies.csv"));
  const chains = readCsv(path.join(chainsDir, "chains.csv"));
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  for (const ui of explicitUi) {
    if (!nodesById.has(ui.id)) nodesById.set(ui.id, ui);
  }

  const pages = nodes.filter((node) => node.type === "page");
  const uiElements = unique([
    ...nodes.filter((node) => node.type === "ui_element").map((node) => node.id),
    ...explicitUi.map((node) => node.id),
  ]).map((id) => nodesById.get(id)).filter(Boolean);

  const rows = [
    ...pages.map((node) => rowForAction({ node, actionSource: "inferred_route_visit", pages, chains, nodesById, relations })),
    ...uiElements.map((node) => rowForAction({ node, actionSource: "explicit_ui_element", pages, chains, nodesById, relations })),
  ].sort((a, b) => a.id.localeCompare(b.id));

  const summary = {
    generatedAt: today,
    counts: {
      actions: rows.length,
      routeVisitActions: rows.filter((row) => row.action_source === "inferred_route_visit").length,
      explicitUiActions: rows.filter((row) => row.action_source === "explicit_ui_element").length,
      criticalGaps: rows.filter((row) => row.gap_severity === "critical").length,
      highGaps: rows.filter((row) => row.gap_severity === "high").length,
      mediumGaps: rows.filter((row) => row.gap_severity === "medium").length,
    },
  };

  const headers = [
    "id",
    "source_node_id",
    "action_source",
    "action_kind",
    "route_or_entrypoint",
    "label_or_selector_hint",
    "feature",
    "module",
    "safety_boundary",
    "page_nodes",
    "ui_nodes",
    "api_routes",
    "function_chains",
    "backend_functions",
    "data_models",
    "tests",
    "docs",
    "evidence",
    "proof_status",
    "gaps",
    "gap_severity",
    "risk_level",
    "last_verified_at",
    "next_validation",
  ];

  writeCsv(path.join(indicesDir, "user-action-index.csv"), rows, headers);

  const payload = { summary, actions: rows };
  fs.writeFileSync(path.join(graphsDir, "user-action-index.json"), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(artifactsDir, `user-action-index-${today}.json`), `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  const topGaps = rows
    .filter((row) => row.gaps)
    .sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, none: 3 };
      return (order[a.gap_severity] ?? 3) - (order[b.gap_severity] ?? 3);
    })
    .slice(0, 40);

  const markdown = [
    "# User Action Evidence Index",
    "",
    `Last generated: ${today}`,
    "",
    "This generated index maps user-visible web entrypoints and explicit UI controls to API routes, function chains, backend functions, data models, tests, docs, evidence, safety boundaries, and proof gaps.",
    "",
    "## Generated Files",
    "",
    "- `docs/architecture/indices/user-action-index.csv`",
    "- `docs/graphs/user-action-index.json`",
    `- \`history/artifacts/user-action-index-${today}.json\``,
    "",
    "## Summary",
    "",
    "| Metric | Count |",
    "| --- | ---: |",
    `| Actions | ${summary.counts.actions} |`,
    `| Route visit/read actions | ${summary.counts.routeVisitActions} |`,
    `| Explicit UI actions | ${summary.counts.explicitUiActions} |`,
    `| Critical gaps | ${summary.counts.criticalGaps} |`,
    `| High gaps | ${summary.counts.highGaps} |`,
    `| Medium gaps | ${summary.counts.mediumGaps} |`,
    "",
    "## Gap Semantics",
    "",
    "- `critical`: the action is missing tests or a mutating action has no API mapping.",
    "- `high`: the action is protected, money-facing, destructive, local-only, or partially verified and still needs fresh browser or production proof.",
    "- `medium`: the action is structurally useful but needs tighter explicit UI control or chain mapping.",
    "- `none`: no generated gap found from current records. Re-run journey proof after code changes.",
    "",
    "## Highest Priority Gaps",
    "",
    "| Severity | Action | Route / entrypoint | Boundary | Proof | Gaps |",
    "| --- | --- | --- | --- | --- | --- |",
    ...topGaps.map((row) =>
      `| ${row.gap_severity} | ${row.id} | ${row.route_or_entrypoint} | ${row.safety_boundary.replaceAll("|", "\\|")} | ${row.proof_status} | ${String(row.gaps).replaceAll("|", "\\|")} |`,
    ),
    "",
    "## Use",
    "",
    "When a UI change is made, locate the affected action row, inspect `api_routes`, `function_chains`, `backend_functions`, `data_models`, and `tests`, then run the listed proof path. Do not close a protected or money-facing action as verified from unit tests alone.",
    "",
  ].join("\n");

  fs.writeFileSync(path.join(statusDir, "user-action-index.md"), markdown, "utf8");

  console.log(
    `User action index generated: ${summary.counts.actions} actions, ${summary.counts.criticalGaps} critical gaps, ${summary.counts.highGaps} high gaps, ${summary.counts.mediumGaps} medium gaps.`,
  );

  if (failOnCriticalGaps && summary.counts.criticalGaps > 0) {
    process.exitCode = 1;
  }
}

main();
