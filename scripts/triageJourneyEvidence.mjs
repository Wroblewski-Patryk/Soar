import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const docsRootName = fs.existsSync(path.join(root, "docs")) ? "docs" : "docs";
const docsRoot = path.join(root, docsRootName);
const indicesDir = path.join(docsRoot, "architecture", "indices");

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

function readCsv(name) {
  const filePath = path.join(indicesDir, name);
  if (!fs.existsSync(filePath)) return [];
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

function argValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : "";
}

function splitRefs(value) {
  return String(value || "")
    .split(/[;|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalize(value) {
  return String(value || "").toLowerCase();
}

function matches(row, query) {
  const haystack = Object.values(row).join(" ").toLowerCase();
  return haystack.includes(query);
}

function printList(label, value) {
  const refs = splitRefs(value);
  console.log(`- ${label}: ${refs.length > 0 ? refs.join(", ") : "none"}`);
}

function main() {
  const query = normalize(argValue("--query") || argValue("--id") || process.argv.slice(2).join(" "));
  if (!query || query === "--help" || query === "-h") {
    console.log("Usage: node scripts/triageJourneyEvidence.mjs --query <route|api|action|chain|file|error-fragment>");
    process.exitCode = query ? 0 : 1;
    return;
  }

  const actions = readCsv("user-action-index.csv");
  const webJourneys = readCsv("web-journey-index.csv");
  const chains = readCsv("function-chain-evidence-index.csv");
  const apis = readCsv("api-surface-evidence-index.csv");

  const actionMatches = actions.filter((row) => matches(row, query));
  const webMatches = webJourneys.filter((row) => matches(row, query));
  const chainMatches = chains.filter((row) => matches(row, query));
  const apiMatches = apis.filter((row) => matches(row, query));
  const firstAction = actionMatches[0];

  console.log(`# Journey Evidence Triage`);
  console.log("");
  console.log(`Query: ${query}`);
  console.log(`Matches: ${actionMatches.length} actions, ${webMatches.length} web journeys, ${chainMatches.length} chains, ${apiMatches.length} APIs`);
  console.log("");

  if (firstAction) {
    console.log("## Primary Action");
    console.log("");
    console.log(`- ID: ${firstAction.id}`);
    console.log(`- Source node: ${firstAction.source_node_id}`);
    console.log(`- Route / entrypoint: ${firstAction.route_or_entrypoint}`);
    console.log(`- Kind: ${firstAction.action_kind}`);
    console.log(`- Safety boundary: ${firstAction.safety_boundary}`);
    console.log(`- Proof status: ${firstAction.proof_status}`);
    console.log(`- Gap severity: ${firstAction.gap_severity}`);
    console.log(`- Gaps: ${firstAction.gaps || "none"}`);
    printList("API routes", firstAction.api_routes);
    printList("Function chains", firstAction.function_chains);
    printList("Backend functions", firstAction.backend_functions);
    printList("Data models", firstAction.data_models);
    printList("Tests", firstAction.tests);
    printList("Docs", firstAction.docs);
    console.log(`- Evidence: ${firstAction.evidence || "none"}`);
    console.log(`- Next validation: ${firstAction.next_validation}`);
    console.log("");
  }

  const relatedApiIds = new Set(actionMatches.flatMap((row) => splitRefs(row.api_routes)));
  const relatedChainIds = new Set(actionMatches.flatMap((row) => splitRefs(row.function_chains)));
  const relatedApis = apis.filter((row) => relatedApiIds.has(row.id));
  const relatedChains = chains.filter((row) => relatedChainIds.has(row.id));

  if (relatedChains.length > 0 || chainMatches.length > 0) {
    console.log("## Related Chains");
    console.log("");
    for (const chain of [...relatedChains, ...chainMatches].slice(0, 10)) {
      console.log(`- ${chain.id}: ${chain.status}, severity=${chain.gap_severity}, gaps=${chain.gaps || "none"}`);
    }
    console.log("");
  }

  if (relatedApis.length > 0 || apiMatches.length > 0) {
    console.log("## Related APIs");
    console.log("");
    for (const api of [...relatedApis, ...apiMatches].slice(0, 10)) {
      console.log(`- ${api.id}: ${api.route}, status=${api.verification_status || api.status}, severity=${api.gap_severity}, gaps=${api.gaps || "none"}`);
    }
    console.log("");
  }

  if (!firstAction && actionMatches.length === 0 && webMatches.length === 0 && chainMatches.length === 0 && apiMatches.length === 0) {
    console.log("No matching indexed journey evidence found. Regenerate indexes, then check whether the route/API/action is missing from graph registry records.");
    process.exitCode = 2;
  }
}

main();
