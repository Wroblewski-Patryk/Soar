import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const docsRootName = fs.existsSync(path.join(root, "docs")) ? "docs" : "docs";
const docsRoot = path.join(root, docsRootName);
const registryDir = path.join(docsRoot, "architecture", "registry");
const relationsDir = path.join(docsRoot, "architecture", "relations");
const chainsDir = path.join(docsRoot, "architecture", "chains");
const nodesDir = path.join(docsRoot, "architecture", "nodes");
const graphsDir = path.join(docsRoot, "graphs");
const statusDir = path.join(docsRoot, "status");

const requiredNodeColumns = [
  "id",
  "name",
  "type",
  "status",
  "layer",
  "module",
  "feature",
  "description",
  "file_path",
  "related_files",
  "parent_id",
  "child_ids",
  "depends_on",
  "used_by",
  "ui_related",
  "api_related",
  "database_related",
  "tests_related",
  "docs_related",
  "agent_related",
  "risk_level",
  "completion_percent",
  "last_verified_at",
  "verification_status",
  "notes",
];

const requiredRelationColumns = [
  "id",
  "source_id",
  "target_id",
  "relation_type",
  "status",
  "description",
  "evidence",
  "owner",
  "last_verified_at",
  "notes",
];

const requiredChainColumns = [
  "id",
  "name",
  "feature",
  "status",
  "trigger_node_id",
  "chain_node_ids",
  "tests_related",
  "docs_related",
  "evidence",
  "missing_links",
  "risk_level",
  "last_verified_at",
  "notes",
];

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

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
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
  const text = fs.readFileSync(filePath, "utf8");
  const rows = parseCsv(text);
  if (rows.length === 0) return { headers: [], records: [] };
  const headers = rows[0].map((header) => header.trim());
  const records = rows.slice(1).map((row, rowIndex) => {
    const record = {};
    headers.forEach((header, columnIndex) => {
      record[header] = row[columnIndex] ?? "";
    });
    record.__row = rowIndex + 2;
    return record;
  });
  return { headers, records };
}

function assertColumns(filePath, headers, requiredColumns) {
  const missing = requiredColumns.filter((column) => !headers.includes(column));
  if (missing.length > 0) {
    throw new Error(`${path.relative(root, filePath)} missing columns: ${missing.join(", ")}`);
  }
}

function splitRefs(value) {
  return String(value || "")
    .split(/[|;]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function resolveRepoPath(fileRef) {
  if (fileRef.startsWith("docs/") && docsRootName !== "docs") {
    return path.join(root, docsRootName, fileRef.slice("docs/".length));
  }
  return path.join(root, fileRef);
}

function wikiList(value) {
  const refs = splitRefs(value);
  return refs.length > 0 ? refs.map((ref) => `[[${ref}]]`).join(", ") : "";
}

function csvList(value) {
  const refs = splitRefs(value);
  return refs.length > 0 ? refs.join(", ") : "";
}

function ensureDirs() {
  for (const dir of [nodesDir, graphsDir, statusDir]) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function validateFileReferences(nodes) {
  const missingFiles = [];
  for (const node of nodes) {
    for (const fileRef of splitRefs(node.file_path).concat(splitRefs(node.related_files))) {
      if (!fileRef || fileRef.startsWith("http")) continue;
      const fullPath = resolveRepoPath(fileRef);
      if (!fs.existsSync(fullPath)) {
        missingFiles.push({ id: node.id, file: fileRef });
      }
    }
  }
  return missingFiles;
}

function writeNodeMarkdown(node, inboundRelations, outboundRelations) {
  const frontmatter = [
    "---",
    `id: ${node.id}`,
    `name: ${JSON.stringify(node.name)}`,
    `type: ${node.type}`,
    `status: ${node.status}`,
    `layer: ${node.layer}`,
    `module: ${node.module}`,
    `feature: ${node.feature}`,
    `risk_level: ${node.risk_level}`,
    `completion_percent: ${node.completion_percent}`,
    `last_verified_at: ${node.last_verified_at}`,
    `verification_status: ${node.verification_status}`,
    `tags: [soar-map, ${node.type}, ${node.layer}, ${node.status}]`,
    "---",
    "",
  ];

  const rows = [
    ["Description", node.description],
    ["File path", node.file_path],
    ["Related files", csvList(node.related_files)],
    ["Parent", wikiList(node.parent_id)],
    ["Children", wikiList(node.child_ids)],
    ["Depends on", wikiList(node.depends_on)],
    ["Used by", wikiList(node.used_by)],
    ["UI related", wikiList(node.ui_related)],
    ["API related", wikiList(node.api_related)],
    ["Database related", wikiList(node.database_related)],
    ["Tests related", wikiList(node.tests_related)],
    ["Docs related", wikiList(node.docs_related)],
    ["Agent related", wikiList(node.agent_related)],
    ["Notes", node.notes],
  ];

  const relationLines = outboundRelations
    .map((relation) => `- ${relation.relation_type} -> [[${relation.target_id}]] (${relation.status})`)
    .concat(inboundRelations.map((relation) => `- ${relation.relation_type} <- [[${relation.source_id}]] (${relation.status})`));

  const content = [
    ...frontmatter,
    `# ${node.name}`,
    "",
    "| Field | Value |",
    "| --- | --- |",
    ...rows.map(([field, value]) => `| ${field} | ${String(value || "").replaceAll("|", "\\|")} |`),
    "",
    "## Relations",
    "",
    relationLines.length > 0 ? relationLines.join("\n") : "- No explicit relations recorded yet.",
    "",
    "## Evidence Rule",
    "",
    "A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.",
    "",
  ].join("\n");

  fs.writeFileSync(path.join(nodesDir, `${node.id}.md`), content, "utf8");
}

function writeChainMarkdown(chain) {
  const chainRefs = splitRefs(chain.chain_node_ids);
  const content = [
    "---",
    `id: ${chain.id}`,
    `type: function_chain`,
    `status: ${chain.status}`,
    `feature: ${chain.feature}`,
    `risk_level: ${chain.risk_level}`,
    `last_verified_at: ${chain.last_verified_at}`,
    `tags: [soar-map, function-chain, ${chain.status}]`,
    "---",
    "",
    `# ${chain.name}`,
    "",
    `- Feature: ${chain.feature}`,
    `- Trigger: [[${chain.trigger_node_id}]]`,
    `- Tests: ${wikiList(chain.tests_related) || "not mapped"}`,
    `- Docs: ${wikiList(chain.docs_related) || "not mapped"}`,
    `- Evidence: ${chain.evidence || "not verified"}`,
    `- Missing links: ${chain.missing_links || "none recorded"}`,
    "",
    "## Execution Chain",
    "",
    chainRefs.map((ref, index) => `${index + 1}. [[${ref}]]`).join("\n"),
    "",
    "## Systemic Analysis Rule",
    "",
    "When checking this feature, inspect every node in the chain, every relation, related tests, side effects, docs, and missing evidence before reporting status.",
    "",
  ].join("\n");

  fs.writeFileSync(path.join(chainsDir, `${chain.id}.md`), content, "utf8");
}

function main() {
  ensureDirs();

  const nodeFiles = [
    "nodes.csv",
    "features.csv",
    "functions.csv",
    "components.csv",
    "api_routes.csv",
    "ui_elements.csv",
    "tests.csv",
    "agents.csv",
    "prompts.csv",
    "events.csv",
    "workflows.csv",
    "pages.csv",
  ].map((file) => path.join(registryDir, file));

  for (const file of nodeFiles) {
    const { headers } = readCsv(file);
    assertColumns(file, headers, requiredNodeColumns);
  }

  const { records: nodes } = readCsv(path.join(registryDir, "nodes.csv"));
  const { headers: dependencyHeaders, records: dependencies } = readCsv(path.join(relationsDir, "dependencies.csv"));
  const { headers: chainHeaders, records: chains } = readCsv(path.join(chainsDir, "chains.csv"));
  assertColumns(path.join(relationsDir, "dependencies.csv"), dependencyHeaders, requiredRelationColumns);
  assertColumns(path.join(chainsDir, "chains.csv"), chainHeaders, requiredChainColumns);

  const nodeIds = new Set();
  const duplicateNodeIds = [];
  for (const node of nodes) {
    if (!node.id) throw new Error(`nodes.csv row ${node.__row} has no id`);
    if (nodeIds.has(node.id)) duplicateNodeIds.push(node.id);
    nodeIds.add(node.id);
  }
  if (duplicateNodeIds.length > 0) {
    throw new Error(`Duplicate node ids: ${duplicateNodeIds.join(", ")}`);
  }

  const missingRelationTargets = [];
  for (const relation of dependencies) {
    if (!nodeIds.has(relation.source_id)) missingRelationTargets.push(`${relation.id}:source:${relation.source_id}`);
    if (!nodeIds.has(relation.target_id)) missingRelationTargets.push(`${relation.id}:target:${relation.target_id}`);
  }

  const missingChainTargets = [];
  for (const chain of chains) {
    for (const id of [chain.trigger_node_id, ...splitRefs(chain.chain_node_ids), ...splitRefs(chain.tests_related), ...splitRefs(chain.docs_related)]) {
      if (id && !nodeIds.has(id)) missingChainTargets.push(`${chain.id}:${id}`);
    }
  }

  const missingFiles = validateFileReferences(nodes);
  if (missingRelationTargets.length > 0 || missingChainTargets.length > 0 || missingFiles.length > 0) {
    const details = [
      ...missingRelationTargets.map((item) => `missing relation node ${item}`),
      ...missingChainTargets.map((item) => `missing chain node ${item}`),
      ...missingFiles.map((item) => `missing file for ${item.id}: ${item.file}`),
    ];
    throw new Error(`Architecture graph registry is invalid:\n${details.join("\n")}`);
  }

  for (const node of nodes) {
    const inbound = dependencies.filter((relation) => relation.target_id === node.id);
    const outbound = dependencies.filter((relation) => relation.source_id === node.id);
    writeNodeMarkdown(node, inbound, outbound);
  }

  for (const chain of chains) writeChainMarkdown(chain);

  const graph = {
    generatedAt: new Date().toISOString(),
    source: {
      nodes: path.relative(root, path.join(registryDir, "nodes.csv")).replaceAll("\\", "/"),
      relations: path.relative(root, path.join(relationsDir, "dependencies.csv")).replaceAll("\\", "/"),
      chains: path.relative(root, path.join(chainsDir, "chains.csv")).replaceAll("\\", "/"),
    },
    nodes: nodes.map((node) => {
      const { __row, ...clean } = node;
      return clean;
    }),
    edges: dependencies.map((relation) => {
      const { __row, ...clean } = relation;
      return clean;
    }),
    chains: chains.map((chain) => {
      const { __row, ...clean } = chain;
      return { ...clean, chain_node_ids: splitRefs(chain.chain_node_ids) };
    }),
  };

  fs.writeFileSync(path.join(graphsDir, "architecture-graph.json"), `${JSON.stringify(graph, null, 2)}\n`, "utf8");

  const graphMd = [
    "# Architecture Graph Export",
    "",
    "Generated from CSV source-of-truth registries.",
    "",
    `- Nodes: ${nodes.length}`,
    `- Relations: ${dependencies.length}`,
    `- Function chains: ${chains.length}`,
    "",
    "## Mermaid Preview",
    "",
    "```mermaid",
    "graph TD",
    ...dependencies.map((relation) => `  ${relation.source_id.replaceAll("-", "_")}["${relation.source_id}"] -->|${relation.relation_type}| ${relation.target_id.replaceAll("-", "_")}["${relation.target_id}"]`),
    "```",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(graphsDir, "architecture-graph.md"), graphMd, "utf8");

  const statusMd = [
    "# Architecture Map Status",
    "",
    `Last generated: ${graph.generatedAt}`,
    "",
    "| Metric | Value |",
    "| --- | --- |",
    `| Nodes | ${nodes.length} |`,
    `| Relations | ${dependencies.length} |`,
    `| Function chains | ${chains.length} |`,
    `| Missing relation targets | ${missingRelationTargets.length} |`,
    `| Missing chain targets | ${missingChainTargets.length} |`,
    `| Missing file references | ${missingFiles.length} |`,
    "",
    "## Coverage Truth",
    "",
    "This is the current incremental Soar architecture evidence graph. It establishes the CSV schema, generation path, Obsidian node output, JSON export, systemic chain-analysis rule, and detailed P0/P1 backfills for manual-order, positions core, bot runtime monitoring, exchange adapter capability/connector chains, Wallets lifecycle/analytics, Profile API Keys credential lifecycle, Bot Setup canonical topology, Strategies authoring/indicator catalog, Markets universe/catalog mapping, Backtests run lifecycle/replay mapping, Reports performance evidence mapping, Logs/Audit Trail evidence mapping, Subscriptions/Admin entitlement and management mapping, AI Assistant foundation/red-team protocol mapping, Operations config/pipeline mapping, API support route mapping, runtime support service mapping, API platform safety mapping, Web runtime surface mapping, and Auth session deep mapping. It is not yet a full repository backfill.",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(statusDir, "architecture-map-status.md"), statusMd, "utf8");

  console.log(`Architecture graph generated: ${nodes.length} nodes, ${dependencies.length} relations, ${chains.length} chains.`);
}

main();
