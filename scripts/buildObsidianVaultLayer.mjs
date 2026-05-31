#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const docsRoot = path.join(repoRoot, "docs");
const outputRoot = path.join(docsRoot, "obsidian");
const mapsRoot = path.join(docsRoot, "maps");
const today = "2026-05-31";

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

function readCsv(relativePath) {
  const filePath = path.join(repoRoot, relativePath);
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

function posix(value) {
  return value.split(path.sep).join("/");
}

function rel(filePath) {
  return posix(path.relative(repoRoot, filePath));
}

function docsRel(filePath) {
  return posix(path.relative(docsRoot, filePath));
}

function walkFiles(root) {
  if (!fs.existsSync(root)) return [];
  const files = [];
  const stack = [root];
  const ignored = new Set([".git", ".obsidian", "node_modules", "dist", ".next", ".turbo"]);

  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (ignored.has(entry.name)) continue;
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(fullPath);
      else if (entry.isFile()) files.push(fullPath);
    }
  }

  return files.sort((left, right) => rel(left).localeCompare(rel(right)));
}

function countBy(records, key) {
  const counts = new Map();
  for (const record of records) {
    const value = record[key] || "unknown";
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]));
}

function table(rows) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${headers.map((header) => String(row[header] ?? "").replaceAll("|", "\\|")).join(" | ")} |`),
  ];
  return lines.join("\n");
}

function link(file, label = file) {
  return `[${label}](../${file})`;
}

function wiki(file, label = file.replace(/\.md$/, "")) {
  return `[[${file}|${label}]]`;
}

function firstNonEmpty(...values) {
  return values.find((value) => String(value ?? "").trim()) ?? "";
}

function statusOrder(value) {
  return {
    critical: 0,
    high: 1,
    medium: 2,
    none: 3,
    verified: 4,
  }[value] ?? 9;
}

function canvasSafeId(value) {
  return String(value).replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80);
}

function write(relativeOutputPath, content) {
  const filePath = path.join(docsRoot, relativeOutputPath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${content.trimEnd()}\n`, "utf8");
  return filePath;
}

function canvasNode(id, x, y, width, height, textOrFile, type = "text", color = undefined) {
  const base = { id, type, x, y, width, height };
  if (color) base.color = color;
  if (type === "file") return { ...base, file: textOrFile };
  return { ...base, text: textOrFile };
}

function canvasEdge(id, fromNode, toNode, label) {
  return { id, fromNode, fromSide: "right", toNode, toSide: "left", label };
}

function writeCanvas(relativeOutputPath, nodes, edges) {
  write(relativeOutputPath, JSON.stringify({ nodes, edges }, null, 2));
}

const docsFiles = walkFiles(docsRoot).filter((file) => !file.includes(`${path.sep}.obsidian${path.sep}`));
const markdownFiles = docsFiles.filter((file) => file.endsWith(".md"));
const csvFiles = docsFiles.filter((file) => file.endsWith(".csv"));
const jsonFiles = docsFiles.filter((file) => file.endsWith(".json"));
const canvasFiles = docsFiles.filter((file) => file.endsWith(".canvas") && !docsRel(file).startsWith("obsidian/_inbox/"));

const nodes = readCsv("docs/architecture/registry/nodes.csv");
const chains = readCsv("docs/architecture/chains/chains.csv");
const userActions = readCsv("docs/architecture/indices/user-action-index.csv");
const functionChains = readCsv("docs/architecture/indices/function-chain-evidence-index.csv");
const webJourneys = readCsv("docs/architecture/indices/web-journey-index.csv");
const apiSurfaces = readCsv("docs/architecture/indices/api-surface-evidence-index.csv");

const docsByFolder = [...new Set(markdownFiles.map((file) => docsRel(path.dirname(file)).split("/")[0] || "."))]
  .sort((left, right) => left.localeCompare(right))
  .map((folder) => {
    const folderFiles = markdownFiles.filter((file) => (docsRel(path.dirname(file)).split("/")[0] || ".") === folder);
    const entry = folder === "." ? "README.md" : `${folder}/README.md`;
    const fallback = folderFiles.find((file) => docsRel(file).endsWith(`${folder}-documentation.md`)) ?? folderFiles[0];
    return {
      Folder: folder,
      Files: folderFiles.length,
      Entry: fs.existsSync(path.join(docsRoot, entry)) ? wiki(entry, entry) : wiki(docsRel(fallback), docsRel(fallback)),
    };
  });

const nodeTypeCounts = countBy(nodes, "type").map(([Type, Count]) => ({ Type, Count }));
const nodeLayerCounts = countBy(nodes, "layer").map(([Layer, Count]) => ({ Layer, Count }));
const chainStatusCounts = countBy(chains, "status").map(([Status, Count]) => ({ Status, Count }));
const actionSeverityCounts = countBy(userActions, "gap_severity").map(([Severity, Count]) => ({ Severity, Count }));

const hotChains = functionChains
  .filter((row) => row.gap_severity && row.gap_severity !== "none")
  .sort((left, right) => statusOrder(left.gap_severity) - statusOrder(right.gap_severity) || left.id.localeCompare(right.id))
  .slice(0, 24)
  .map((row) => ({
    Severity: row.gap_severity,
    Chain: row.id,
    Feature: row.feature,
    Status: row.status,
    "Start here": row.entry_pages || row.trigger || row.id,
    "Next proof": row.gaps,
  }));

const hotActions = userActions
  .filter((row) => row.gap_severity && row.gap_severity !== "none")
  .sort((left, right) => statusOrder(left.gap_severity) - statusOrder(right.gap_severity) || left.id.localeCompare(right.id))
  .slice(0, 24)
  .map((row) => ({
    Severity: row.gap_severity,
    Action: row.id,
    Route: row.route_or_entrypoint,
    Boundary: row.safety_boundary,
    "Proof status": row.proof_status,
  }));

const featureAtlas = countBy(nodes, "feature")
  .slice(0, 30)
  .map(([Feature, Count]) => {
    const chainCount = chains.filter((chain) => chain.feature === Feature).length;
    const actionCount = userActions.filter((action) => action.feature === Feature).length;
    const pageCount = webJourneys.filter((journey) => journey.feature === Feature).length;
    const apiCount = apiSurfaces.filter((api) => api.feature === Feature).length;
    return { Feature, Nodes: Count, Chains: chainCount, Actions: actionCount, Pages: pageCount, APIs: apiCount };
  });

const visualMaps = [
  {
    Map: wiki("maps/soar-obsidian-dashboard.canvas", "Dashboard Canvas"),
    Use: "Start here; shows the docs command layer and AI/Paperclip entrypoints.",
  },
  {
    Map: wiki("maps/soar-function-journey.canvas", "Function Journey Canvas"),
    Use: "Shows the evidence flow from product intent to action, chain, API, web, and proof gaps.",
  },
  {
    Map: wiki("maps/soar-chain-map.canvas", "Chain Map"),
    Use: "Shows all generated function chains grouped by feature and status.",
  },
  {
    Map: wiki("maps/soar-action-proof-map.canvas", "Action Proof Map"),
    Use: "Shows high-risk user actions and their proof boundaries.",
  },
  {
    Map: wiki("maps/soar-docs-folder-map.canvas", "Docs Folder Map"),
    Use: "Shows top-level docs folders and their entry notes.",
  },
];

const folderEntryRows = docsByFolder.map((row) => ({
  Folder: row.Folder,
  Files: row.Files,
  Entry: row.Entry,
  Role:
    {
      ".": "Root entrypoints and documentation policy.",
      architecture: "Canonical runtime, graph, contracts, and ownership truth.",
      modules: "Implementation-facing module ownership and tests.",
      operations: "Runbooks, deploy, rollback, proof, and operator workflows.",
      product: "Product intent, scope, users, roadmap, and limits.",
      planning: "Plans, open decisions, queues, and work packages.",
      maps: "Human/agent navigation maps and canvas surfaces.",
      obsidian: "Obsidian-first dashboard, AI brief, and cleanup layer.",
      status: "Generated current-state snapshots and proof status.",
      ux: "Design system, quality bar, and visual workflow.",
    }[row.Folder] ?? "Supporting documentation folder.",
}));

write(
  "obsidian/README.md",
  `# Soar Obsidian Layer

Updated: ${today}

This folder is the Obsidian-facing command layer for Soar docs. It does not replace the canonical files; it links them into a usable vault surface for humans and AI agents.

## Start Here

- ${wiki("obsidian/soar-vault-dashboard.md", "Soar Vault Dashboard")}
- ${wiki("obsidian/code-to-docs-atlas.md", "Code To Docs Atlas")}
- ${wiki("obsidian/function-journey-hotlist.md", "Function Journey Hotlist")}
- ${wiki("obsidian/visual-map-index.md", "Visual Map Index")}
- ${wiki("obsidian/paperclip-cleanup-brief.md", "Paperclip Cleanup Brief")}
- ${wiki("obsidian/ai-navigation-brief.md", "AI Navigation Brief")}

## Canvas Maps

${visualMaps.map((row) => `- ${row.Map}`).join("\n")}

## Rule

Treat canonical docs as the source of truth and this folder as the navigation layer. When an item here exposes drift, update the owning canonical document, CSV registry, generated index, or source code.
`,
);

write(
  "obsidian/soar-vault-dashboard.md",
  `# Soar Vault Dashboard

Updated: ${today}

## Purpose

Use this as the first opened note in Obsidian. It connects the repository, generated graph data, user actions, function journeys, and AI operating memory into one surface.

## Fast Routes

| Need | Open |
| --- | --- |
| Current documentation map | ${wiki("documentation-map.md", "Documentation Map")} |
| Engineering traceability hub | ${wiki("soar-documentation-map.md", "Soar Documentation Map")} |
| Obsidian-specific atlas | ${wiki("obsidian/code-to-docs-atlas.md", "Code To Docs Atlas")} |
| Function/action proof gaps | ${wiki("obsidian/function-journey-hotlist.md", "Function Journey Hotlist")} |
| Visual canvas maps | ${wiki("obsidian/visual-map-index.md", "Visual Map Index")} |
| Product intent | ${wiki("maps/product-map.md", "Product Map")} |
| Architecture map | ${wiki("maps/architecture-map.md", "Architecture Map")} |
| Release and ops map | ${wiki("maps/release-ops-map.md", "Release/Ops Map")} |
| Agent work map | ${wiki("maps/agent-work-map.md", "Agent Work Map")} |
| Paperclip cleanup contract | ${wiki("obsidian/paperclip-cleanup-brief.md", "Paperclip Cleanup Brief")} |

## Vault Inventory

- Markdown files: ${markdownFiles.length}
- CSV indexes/registries: ${csvFiles.length}
- JSON graph/status exports: ${jsonFiles.length}
- Canvas maps: ${canvasFiles.length}
- Architecture registry nodes: ${nodes.length}
- Function chains: ${chains.length}
- User action rows: ${userActions.length}
- Web journey rows: ${webJourneys.length}
- API surface rows: ${apiSurfaces.length}

## Folders

${table(docsByFolder)}

## Graph Data

### Node Types

${table(nodeTypeCounts)}

### Node Layers

${table(nodeLayerCounts)}

### Chain Statuses

${table(chainStatusCounts)}

### Action Gap Severity

${table(actionSeverityCounts)}

## Visual Maps

${table(visualMaps)}

## Dataview: Current Project Docs

\`\`\`dataview
TABLE file.folder AS Folder, length(file.outlinks) AS Outlinks, length(file.inlinks) AS Inlinks
FROM "architecture" OR "modules" OR "pipelines" OR "operations" OR "product"
SORT file.folder ASC, file.name ASC
LIMIT 80
\`\`\`

## Dataview: Open Tasks In Docs

\`\`\`dataview
TASK
FROM ""
WHERE !completed
SORT file.path ASC
LIMIT 80
\`\`\`
`,
);

write(
  "obsidian/code-to-docs-atlas.md",
  `# Code To Docs Atlas

Updated: ${today}

This atlas summarizes the generated graph surface. It is meant for fast orientation before editing code, writing docs, or delegating cleanup to an autonomous agent.

## Canonical Inputs

| Input | Role |
| --- | --- |
| ${wiki("architecture/registry/nodes.csv", "nodes.csv")} | Source registry for features, pages, APIs, services, data models, tests, docs, and agents. |
| ${wiki("architecture/relations/dependencies.csv", "dependencies.csv")} | Directed relation map between graph nodes. |
| ${wiki("architecture/chains/chains.csv", "chains.csv")} | End-to-end function chains. |
| ${wiki("architecture/indices/function-chain-evidence-index.csv", "function-chain-evidence-index.csv")} | Generated chain proof index. |
| ${wiki("architecture/indices/user-action-index.csv", "user-action-index.csv")} | Generated user action proof index. |
| ${wiki("architecture/indices/web-journey-index.csv", "web-journey-index.csv")} | Generated page/route journey index. |
| ${wiki("architecture/indices/api-surface-evidence-index.csv", "api-surface-evidence-index.csv")} | Generated API evidence index. |

## Feature Atlas

${table(featureAtlas)}

## Useful Commands

| Command | Use |
| --- | --- |
| \`pnpm run architecture:graph:generate\` | Rebuild architecture graph source files. |
| \`pnpm run architecture:graph:drift\` | Check graph drift against the repo. |
| \`pnpm run architecture:journey:index\` | Regenerate function and user-action indexes. |
| \`pnpm run docs:parity:check\` | Check docs parity. |
| \`pnpm run ops:project:index\` | Generate a broad project index in history. |

## How To Navigate

1. Start from a feature in this atlas.
2. Open the matching chain in ${wiki("architecture/chains/README.md", "Architecture Chains")}.
3. Use ${wiki("obsidian/function-journey-hotlist.md", "Function Journey Hotlist")} to see proof gaps.
4. Open linked module docs under ${wiki("modules/README.md", "Modules")}.
5. Touch code only after identifying the owner doc and test/proof path.
`,
);

write(
  "obsidian/function-journey-hotlist.md",
  `# Function Journey Hotlist

Updated: ${today}

This note distills the generated journey indexes into an Obsidian-readable action surface. It should be the main place to choose what to verify or clean next.

## Highest Function Chain Gaps

${table(hotChains)}

## Highest User Action Gaps

${table(hotActions)}

## Interpretation

- Critical or high gaps do not mean the app is broken. They mean the current graph cannot safely prove the behavior at the level claimed.
- Protected, destructive, money-facing, exchange-facing, and production-only paths need stronger proof than local unit tests.
- When a row is fixed, update the graph registry or chain source first, then regenerate indexes.

## Dataview: Related Status Notes

\`\`\`dataview
TABLE file.mtime AS Updated
FROM "status"
SORT file.mtime DESC
\`\`\`
`,
);

write(
  "obsidian/visual-map-index.md",
  `# Visual Map Index

Updated: ${today}

Use this note when you want to browse Soar as node maps rather than as long markdown files.

## Canvas Maps

${table(visualMaps)}

## Generated Graph Files

| File | Use |
| --- | --- |
| ${wiki("graphs/architecture-graph.md", "architecture-graph.md")} | Mermaid-rendered architecture graph in Markdown. |
| ${wiki("graphs/architecture-graph.mmd", "architecture-graph.mmd")} | Mermaid source for external rendering or editing. |
| ${wiki("graphs/architecture-graph.json", "architecture-graph.json")} | Machine-readable architecture graph export. |
| ${wiki("graphs/function-journey-index.json", "function-journey-index.json")} | Machine-readable journey proof index. |
| ${wiki("graphs/user-action-index.json", "user-action-index.json")} | Machine-readable user action proof index. |

## Folder Entries

${table(folderEntryRows)}

## Obsidian Use

Open the canvas files directly from this note, or use graph view and filter to:

- \`path:architecture\` for architecture and graph node docs;
- \`path:obsidian\` for the command layer;
- \`path:maps\` for curated map entrypoints;
- \`-path:history\` when you want only current source-of-truth docs.
`,
);

write(
  "obsidian/ai-navigation-brief.md",
  `# AI Navigation Brief

Updated: ${today}

## Mission

Help an AI agent understand Soar quickly without flattening the project into vague summaries. The agent must preserve source-of-truth boundaries and update graph records when behavior changes.

## Read Order

1. ${wiki("obsidian/soar-vault-dashboard.md", "Soar Vault Dashboard")}
2. ${wiki("documentation-map.md", "Documentation Map")}
3. ${wiki("soar-documentation-map.md", "Soar Documentation Map")}
4. ${wiki("maps/architecture-map.md", "Architecture Map")}
5. ${wiki("obsidian/code-to-docs-atlas.md", "Code To Docs Atlas")}
6. ${wiki("obsidian/function-journey-hotlist.md", "Function Journey Hotlist")}
7. ${wiki("governance/autonomous-engineering-loop.md", "Autonomous Engineering Loop")}
8. ${wiki("operations/project-control-system.md", "Project Control System")}

## Before Editing

- Identify the affected feature, chain, action, API route, page, module, data model, and tests.
- Check whether the action is protected, destructive, money-facing, or exchange-facing.
- Do not claim production truth from local-only proof.
- Keep history in \`../history\`; keep current truth in \`docs\`.

## After Editing

Run the smallest relevant verification first, then update docs:

1. Source code and tests.
2. Module or architecture owner docs.
3. Graph registry CSVs if ownership, routes, functions, APIs, tests, or docs changed.
4. Generated indexes.
5. Status or planning note if proof remains open.
`,
);

write(
  "obsidian/paperclip-cleanup-brief.md",
  `# Paperclip Cleanup Brief

Updated: ${today}

## Objective

Make Soar easier for a human owner and autonomous softwarehouse agent to inspect, improve, and prove. The target state is not fewer files at all costs; it is a vault where every current doc has a clear owner, every generated artifact is recognizable, and every feature can be followed from user action to code, data, tests, proof, and operations.

## Cleanup Contract

| Area | Expected result |
| --- | --- |
| Docs navigation | Start at ${wiki("obsidian/soar-vault-dashboard.md", "Soar Vault Dashboard")} and reach product, architecture, modules, operations, status, and AI briefs in two clicks. |
| Function journeys | Every important route/action maps to chain, API, backend function, data model, tests, docs, and evidence. |
| Canvas maps | High-level maps show how product, architecture, journeys, operations, and agents relate. |
| Current vs history | Current truth remains in \`docs\`; dated evidence and old task records remain in \`history\`. |
| AI usefulness | Agents get explicit read order, proof rules, and update contract before making changes. |

## Work Queue

- [ ] Refresh generated graph and journey indexes after the next code/documentation change.
- [ ] Add or repair missing page entrypoint relations for high-value user actions.
- [ ] Tighten protected/money-facing proof rows before claiming production readiness.
- [ ] Review large architecture node sets for orphaned docs, duplicate concepts, and stale generated pages.
- [ ] Add richer canvas maps for top product areas once current graph drift is clean.
- [ ] Consider moving dated one-off docs from \`docs/analysis\` or \`docs/operations\` to \`history\` only after confirming they are not current source of truth.

## Safe Delegation Prompt

Use this when delegating to Paperclip:

> Clean Soar documentation as an Obsidian-first project knowledge vault. Preserve canonical truth. Do not delete or move files unless you can prove the file is historical or duplicate. Start from \`docs/obsidian/soar-vault-dashboard.md\`, inspect graph indexes, repair navigation and links, then update source-of-truth docs and generated indexes. Keep production, exchange, destructive, and protected proof claims conservative.
`,
);

writeCanvas(
  "maps/soar-obsidian-dashboard.canvas",
  [
    canvasNode("vault", -760, -80, 360, 180, "obsidian/soar-vault-dashboard.md", "file"),
    canvasNode("docs-map", -280, -260, 320, 160, "documentation-map.md", "file"),
    canvasNode("soar-map", -280, -40, 320, 160, "soar-documentation-map.md", "file"),
    canvasNode("atlas", 160, -260, 340, 160, "obsidian/code-to-docs-atlas.md", "file"),
    canvasNode("hotlist", 160, -40, 340, 160, "obsidian/function-journey-hotlist.md", "file"),
    canvasNode("ai", 600, -260, 320, 160, "obsidian/ai-navigation-brief.md", "file"),
    canvasNode("paperclip", 600, -40, 320, 160, "obsidian/paperclip-cleanup-brief.md", "file"),
    canvasNode("source", -280, 190, 760, 140, "Canonical rule: current truth stays in docs; dated evidence and task history stay in ../history; generated indexes must be refreshed after graph changes."),
  ],
  [
    canvasEdge("e1", "vault", "docs-map", "start"),
    canvasEdge("e2", "vault", "soar-map", "engineering"),
    canvasEdge("e3", "soar-map", "atlas", "graph data"),
    canvasEdge("e4", "atlas", "hotlist", "proof gaps"),
    canvasEdge("e5", "hotlist", "ai", "agent route"),
    canvasEdge("e6", "ai", "paperclip", "delegate"),
    canvasEdge("e7", "source", "atlas", "regenerate"),
  ],
);

writeCanvas(
  "maps/soar-function-journey.canvas",
  [
    canvasNode("product", -920, -100, 300, 150, "maps/product-map.md", "file"),
    canvasNode("journey", -520, -100, 330, 150, "architecture/indices/user-action-index.csv", "file"),
    canvasNode("chains", -100, -100, 330, 150, "architecture/indices/function-chain-evidence-index.csv", "file"),
    canvasNode("api", 320, -220, 330, 150, "architecture/indices/api-surface-evidence-index.csv", "file"),
    canvasNode("web", 320, 20, 330, 150, "architecture/indices/web-journey-index.csv", "file"),
    canvasNode("hotlist", 760, -100, 340, 150, "obsidian/function-journey-hotlist.md", "file"),
    canvasNode("proof", -520, 180, 760, 140, "Proof rule: local tests, browser proof, production readback, and approved live mutations are different evidence levels. Keep them separate in docs and graph rows."),
  ],
  [
    canvasEdge("f1", "product", "journey", "user actions"),
    canvasEdge("f2", "journey", "chains", "function path"),
    canvasEdge("f3", "chains", "api", "API surface"),
    canvasEdge("f4", "chains", "web", "route/page"),
    canvasEdge("f5", "api", "hotlist", "gaps"),
    canvasEdge("f6", "web", "hotlist", "gaps"),
    canvasEdge("f7", "proof", "hotlist", "interpretation"),
  ],
);

const chainMapNodes = [
  canvasNode("index", -520, -180, 340, 150, "obsidian/function-journey-hotlist.md", "file", "4"),
  canvasNode("registry", -520, 40, 340, 150, "architecture/chains/chains.csv", "file", "5"),
];
const chainMapEdges = [canvasEdge("chain-index-registry", "index", "registry", "generated from")];
const chainFeatures = [...new Set(functionChains.map((chain) => chain.feature).filter(Boolean))]
  .sort((left, right) => left.localeCompare(right));
chainFeatures.forEach((feature, index) => {
  const featureId = `feature-${canvasSafeId(feature)}`;
  const x = -40 + (index % 3) * 430;
  const y = -520 + Math.floor(index / 3) * 300;
  chainMapNodes.push(canvasNode(featureId, x, y, 330, 110, `Feature: ${feature}`, "text", "2"));
  chainMapEdges.push(canvasEdge(`feature-edge-${index}`, "registry", featureId, "groups"));

  functionChains
    .filter((chain) => chain.feature === feature)
    .forEach((chain, chainIndex) => {
      const chainId = `chain-${canvasSafeId(chain.id)}`;
      const color = chain.gap_severity === "none" ? "4" : chain.status === "partially_verified" ? "3" : "1";
      chainMapNodes.push(
        canvasNode(
          chainId,
          x,
          y + 140 + chainIndex * 125,
          330,
          100,
          `${chain.id}\nstatus: ${chain.status}\ngap: ${chain.gap_severity || "none"}`,
          "text",
          color,
        ),
      );
      chainMapEdges.push(canvasEdge(`chain-edge-${chainId}`, featureId, chainId, "chain"));
    });
});

writeCanvas("maps/soar-chain-map.canvas", chainMapNodes, chainMapEdges);

const actionMapNodes = [
  canvasNode("hotlist", -560, -80, 340, 150, "obsidian/function-journey-hotlist.md", "file", "4"),
  canvasNode("actions-csv", -560, 150, 340, 150, "architecture/indices/user-action-index.csv", "file", "5"),
];
const actionMapEdges = [canvasEdge("action-source", "hotlist", "actions-csv", "source")];
hotActions.forEach((action, index) => {
  const actionId = `action-${canvasSafeId(action.Action)}`;
  const x = -80 + (index % 3) * 430;
  const y = -520 + Math.floor(index / 3) * 190;
  const color = action.Severity === "critical" ? "1" : action.Severity === "high" ? "3" : "6";
  actionMapNodes.push(
    canvasNode(
      actionId,
      x,
      y,
      350,
      150,
      `${action.Action}\nroute: ${action.Route}\nboundary: ${action.Boundary}\nproof: ${action["Proof status"]}`,
      "text",
      color,
    ),
  );
  actionMapEdges.push(canvasEdge(`action-edge-${index}`, "actions-csv", actionId, action.Severity));
});

writeCanvas("maps/soar-action-proof-map.canvas", actionMapNodes, actionMapEdges);

const folderMapNodes = [
  canvasNode("dashboard", -620, -80, 360, 150, "obsidian/soar-vault-dashboard.md", "file", "4"),
  canvasNode("readme", -620, 130, 360, 150, "README.md", "file", "5"),
];
const folderMapEdges = [canvasEdge("folder-dashboard-readme", "dashboard", "readme", "docs root")];
folderEntryRows.forEach((folder, index) => {
  const folderId = `folder-${canvasSafeId(folder.Folder)}`;
  const x = -120 + (index % 4) * 370;
  const y = -560 + Math.floor(index / 4) * 190;
  folderMapNodes.push(
    canvasNode(
      folderId,
      x,
      y,
      320,
      130,
      `${folder.Folder}\nfiles: ${folder.Files}\n${folder.Role}`,
      "text",
      folder.Folder === "obsidian" || folder.Folder === "maps" ? "4" : "6",
    ),
  );
  folderMapEdges.push(canvasEdge(`folder-edge-${index}`, "dashboard", folderId, "folder"));
});

writeCanvas("maps/soar-docs-folder-map.canvas", folderMapNodes, folderMapEdges);

console.log(`Obsidian vault layer written to ${rel(outputRoot)}`);
console.log(`Canvas maps written under ${rel(mapsRoot)}`);
