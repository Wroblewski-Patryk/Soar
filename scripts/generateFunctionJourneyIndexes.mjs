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

function list(records, selector) {
  return records.map(selector).filter(Boolean).join("; ");
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

function normalizeStatus(status) {
  const known = new Set([
    "verified",
    "verified_local",
    "partially_verified",
    "implemented",
    "implemented_not_verified",
    "in_progress",
    "blocked",
    "broken",
    "missing",
  ]);
  return known.has(status) ? status : "";
}

function weakestStatus(statuses) {
  return statuses.map(normalizeStatus).filter(Boolean).sort((a, b) => statusRank(b) - statusRank(a))[0] || "missing";
}

function gapSeverity(gaps) {
  if (gaps.some((gap) => /broken|missing_chain_node|no_tests|no_api_route/.test(gap))) return "critical";
  if (gaps.some((gap) => /protected|production|live|approval|browser|evidence|partial/.test(gap))) return "high";
  if (gaps.length > 0) return "medium";
  return "none";
}

function isUserFacingChain(chain, nodes) {
  if (/ops|config|pipeline|release-audit-tooling|api-platform-safety/.test(chain.feature)) return false;
  return nodes.some((node) => ["page", "component", "hook", "ui_element"].includes(node.type));
}

function main() {
  fs.mkdirSync(indicesDir, { recursive: true });
  fs.mkdirSync(graphsDir, { recursive: true });
  fs.mkdirSync(statusDir, { recursive: true });
  fs.mkdirSync(artifactsDir, { recursive: true });

  const nodes = readCsv(path.join(registryDir, "nodes.csv"));
  const chains = readCsv(path.join(chainsDir, "chains.csv"));
  const relations = readCsv(path.join(relationsDir, "dependencies.csv"));
  const nodeById = new Map(nodes.map((node) => [node.id, node]));

  const chainRows = chains.map((chain) => {
    const chainIds = splitRefs(chain.chain_node_ids);
    const chainNodes = chainIds.map((id) => nodeById.get(id)).filter(Boolean);
    const missingNodeIds = chainIds.filter((id) => !nodeById.has(id));
    const pageNodes = chainNodes.filter((node) => node.type === "page");
    const uiNodes = chainNodes.filter((node) => ["page", "component", "hook", "ui_element"].includes(node.type));
    const apiNodes = chainNodes.filter((node) => node.type === "api_route");
    const functionNodes = chainNodes.filter((node) =>
      ["service", "controller", "hook", "utility", "validator", "worker", "validation"].includes(node.type),
    );
    const dataNodes = chainNodes.filter((node) => node.type === "database_model");
    const testRefs = new Set(splitRefs(chain.tests_related));
    const docRefs = new Set(splitRefs(chain.docs_related));
    for (const node of chainNodes) {
      splitRefs(node.tests_related).forEach((ref) => testRefs.add(ref));
      splitRefs(node.docs_related).forEach((ref) => docRefs.add(ref));
    }

    const gaps = [];
    if (missingNodeIds.length > 0) gaps.push(`missing_chain_node:${missingNodeIds.join("|")}`);
    if (isUserFacingChain(chain, chainNodes) && pageNodes.length === 0) gaps.push("no_page_entrypoint");
    if (isUserFacingChain(chain, chainNodes) && apiNodes.length === 0) gaps.push("no_api_route");
    if (testRefs.size === 0) gaps.push("no_tests");
    if (docRefs.size === 0) gaps.push("no_docs");
    if (!chain.evidence || /not verified/i.test(chain.evidence)) gaps.push("no_evidence_artifact");
    if (chain.missing_links) gaps.push(`missing_proof:${chain.missing_links}`);
    if (chain.status === "verified_local") gaps.push("production_or_browser_proof_not_implied");
    if (chain.status === "partially_verified") gaps.push("partial_chain_status");

    return {
      id: chain.id,
      feature: chain.feature,
      name: chain.name,
      trigger: chain.trigger_node_id,
      status: chain.status,
      weakest_node_status: weakestStatus(chainNodes.map((node) => node.verification_status || node.status)),
      entry_pages: list(pageNodes, (node) => node.id),
      ui_nodes: list(uiNodes, (node) => node.id),
      api_routes: list(apiNodes, (node) => node.id),
      functions: list(functionNodes, (node) => node.id),
      data_models: list(dataNodes, (node) => node.id),
      tests: Array.from(testRefs).join("; "),
      docs: Array.from(docRefs).join("; "),
      evidence: chain.evidence,
      gaps: gaps.join("; "),
      gap_severity: gapSeverity(gaps),
      risk_level: chain.risk_level,
      last_verified_at: chain.last_verified_at,
      notes: chain.notes,
    };
  });

  const pageRows = nodes
    .filter((node) => node.type === "page")
    .map((page) => {
      const apiRefs = splitRefs(page.api_related);
      const uiRefs = splitRefs(page.ui_related);
      const testRefs = splitRefs(page.tests_related);
      const docRefs = splitRefs(page.docs_related);
      const chainRefs = chainRows.filter((chain) => splitRefs(chain.entry_pages).includes(page.id)).map((chain) => chain.id);
      const gaps = [];
      if (!/redirect/i.test(page.description) && apiRefs.length === 0 && !/public|offline/i.test(page.description)) {
        gaps.push("no_api_relation");
      }
      if (testRefs.length === 0) gaps.push("no_tests");
      if (docRefs.length === 0) gaps.push("no_docs");
      if (chainRefs.length === 0 && !/redirect/i.test(page.description)) gaps.push("not_in_function_chain");
      if (["partially_verified", "implemented_not_verified", "blocked", "broken", "missing"].includes(page.verification_status || page.status)) {
        gaps.push(`page_status:${page.verification_status || page.status}`);
      }

      return {
        id: page.id,
        route_or_file: page.file_path,
        feature: page.feature,
        module: page.module,
        status: page.status,
        verification_status: page.verification_status,
        user_entry_description: page.description,
        ui_nodes: uiRefs.join("; "),
        api_routes: apiRefs.join("; "),
        tests: testRefs.join("; "),
        docs: docRefs.join("; "),
        chains: chainRefs.join("; "),
        gaps: gaps.join("; "),
        gap_severity: gapSeverity(gaps),
        risk_level: page.risk_level,
        last_verified_at: page.last_verified_at,
      };
    });

  const apiRows = nodes
    .filter((node) => node.type === "api_route")
    .map((api) => {
      const consumerRelations = relations.filter((relation) => relation.target_id === api.id);
      const apiRelations = relations.filter((relation) => relation.source_id === api.id);
      const consumers = new Set([
        ...splitRefs(api.used_by),
        ...splitRefs(api.ui_related),
        ...consumerRelations.map((relation) => relation.source_id),
      ].filter(Boolean));
      const tests = splitRefs(api.tests_related);
      const docs = splitRefs(api.docs_related);
      const dataRefs = splitRefs(api.database_related);
      const chainRefs = chainRows.filter((chain) => splitRefs(chain.api_routes).includes(api.id)).map((chain) => chain.id);
      const gaps = [];
      if (consumers.size === 0 && !/router|support/i.test(api.feature)) gaps.push("no_consumer_relation");
      if (tests.length === 0) gaps.push("no_tests");
      if (docs.length === 0) gaps.push("no_docs");
      if (dataRefs.length === 0 && !/icon|stream|upload/i.test(api.feature)) gaps.push("no_data_or_explicit_na");
      if (chainRefs.length === 0) gaps.push("not_in_function_chain");
      if (["partially_verified", "implemented_not_verified", "blocked", "broken", "missing"].includes(api.verification_status || api.status)) {
        gaps.push(`api_status:${api.verification_status || api.status}`);
      }

      return {
        id: api.id,
        route: api.name,
        feature: api.feature,
        module: api.module,
        status: api.status,
        verification_status: api.verification_status,
        consumers: Array.from(consumers).join("; "),
        downstream_relations: list(apiRelations, (relation) => `${relation.relation_type}:${relation.target_id}`),
        data_models: dataRefs.join("; "),
        tests: tests.join("; "),
        docs: docs.join("; "),
        chains: chainRefs.join("; "),
        evidence: api.related_files || api.file_path,
        gaps: gaps.join("; "),
        gap_severity: gapSeverity(gaps),
        risk_level: api.risk_level,
        last_verified_at: api.last_verified_at,
      };
    });

  const summary = {
    generatedAt: today,
    counts: {
      chains: chainRows.length,
      webJourneys: pageRows.length,
      apiRoutes: apiRows.length,
      criticalGaps:
        chainRows.filter((row) => row.gap_severity === "critical").length +
        pageRows.filter((row) => row.gap_severity === "critical").length +
        apiRows.filter((row) => row.gap_severity === "critical").length,
      highGaps:
        chainRows.filter((row) => row.gap_severity === "high").length +
        pageRows.filter((row) => row.gap_severity === "high").length +
        apiRows.filter((row) => row.gap_severity === "high").length,
    },
  };

  writeCsv(path.join(indicesDir, "function-chain-evidence-index.csv"), chainRows, [
    "id",
    "feature",
    "name",
    "trigger",
    "status",
    "weakest_node_status",
    "entry_pages",
    "ui_nodes",
    "api_routes",
    "functions",
    "data_models",
    "tests",
    "docs",
    "evidence",
    "gaps",
    "gap_severity",
    "risk_level",
    "last_verified_at",
    "notes",
  ]);
  writeCsv(path.join(indicesDir, "web-journey-index.csv"), pageRows, [
    "id",
    "route_or_file",
    "feature",
    "module",
    "status",
    "verification_status",
    "user_entry_description",
    "ui_nodes",
    "api_routes",
    "tests",
    "docs",
    "chains",
    "gaps",
    "gap_severity",
    "risk_level",
    "last_verified_at",
  ]);
  writeCsv(path.join(indicesDir, "api-surface-evidence-index.csv"), apiRows, [
    "id",
    "route",
    "feature",
    "module",
    "status",
    "verification_status",
    "consumers",
    "downstream_relations",
    "data_models",
    "tests",
    "docs",
    "chains",
    "evidence",
    "gaps",
    "gap_severity",
    "risk_level",
    "last_verified_at",
  ]);

  const payload = { summary, functionChains: chainRows, webJourneys: pageRows, apiSurfaces: apiRows };
  fs.writeFileSync(path.join(graphsDir, "function-journey-index.json"), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(artifactsDir, `function-journey-index-${today}.json`), `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  const topGaps = [...chainRows, ...pageRows, ...apiRows]
    .filter((row) => row.gaps)
    .sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, none: 3 };
      return (order[a.gap_severity] ?? 3) - (order[b.gap_severity] ?? 3);
    })
    .slice(0, 40);

  const markdown = [
    "# Function Journey Evidence Index",
    "",
    `Last generated: ${today}`,
    "",
    "This index connects user-visible entrypoints, graph function chains, API routes, tests, docs, evidence artifacts, and explicit gaps. It is generated from the architecture graph CSV source of truth and is meant to answer: what works, what is only locally proven, and what still lacks browser or production proof.",
    "",
    "## Generated Files",
    "",
    "- `docs/architecture/indices/function-chain-evidence-index.csv`",
    "- `docs/architecture/indices/web-journey-index.csv`",
    "- `docs/architecture/indices/api-surface-evidence-index.csv`",
    "- `docs/graphs/function-journey-index.json`",
    `- \`history/artifacts/function-journey-index-${today}.json\``,
    "",
    "## Summary",
    "",
    "| Index | Rows |",
    "| --- | ---: |",
    `| Function chains | ${chainRows.length} |`,
    `| Web journeys / pages | ${pageRows.length} |`,
    `| API surfaces | ${apiRows.length} |`,
    `| Critical gaps | ${summary.counts.criticalGaps} |`,
    `| High gaps | ${summary.counts.highGaps} |`,
    "",
    "## Gap Semantics",
    "",
    "- `critical`: missing chain node, missing tests, missing API route, or another defect that prevents confidence.",
    "- `high`: proof is local-only, browser/production/protected evidence is missing, or a chain is partially verified.",
    "- `medium`: docs, consumers, chain membership, or explicit not-applicable evidence should be tightened.",
    "- `none`: no generated gap found from current graph records. This does not replace fresh real journey proof after changes.",
    "",
    "## Highest Priority Gaps",
    "",
    "| Severity | ID | Feature | Status | Gaps |",
    "| --- | --- | --- | --- | --- |",
    ...topGaps.map((row) =>
      `| ${row.gap_severity} | ${row.id} | ${row.feature} | ${row.status || row.verification_status} | ${String(row.gaps).replaceAll("|", "\\|")} |`,
    ),
    "",
    "## Use",
    "",
    "Before fixing a user-reported failure, look up the route/action in `web-journey-index.csv`, follow the linked chain in `function-chain-evidence-index.csv`, then inspect API consumers and proof in `api-surface-evidence-index.csv`. If a path is marked local-only, do not claim production behavior until a matching browser or protected proof exists.",
    "",
  ].join("\n");

  fs.writeFileSync(path.join(statusDir, "function-journey-index.md"), markdown, "utf8");
  console.log(
    `Function journey indexes generated: ${chainRows.length} chains, ${pageRows.length} web journeys, ${apiRows.length} API surfaces, ${summary.counts.criticalGaps} critical gaps, ${summary.counts.highGaps} high gaps.`,
  );

  if (failOnCriticalGaps && summary.counts.criticalGaps > 0) {
    process.exitCode = 1;
  }
}

main();
