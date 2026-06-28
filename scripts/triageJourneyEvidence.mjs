import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const isDirectRun = () => process.argv[1] === fileURLToPath(import.meta.url);

export function parseCsv(text) {
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

export function readCsv(name, deps = {}) {
  const { root = process.cwd(), existsSyncImpl = fs.existsSync, readFileSyncImpl = fs.readFileSync } = deps;
  const docsRootName = existsSyncImpl(path.join(root, "docs")) ? "docs" : "docs";
  const docsRoot = path.join(root, docsRootName);
  const indicesDir = path.join(docsRoot, "architecture", "indices");
  const filePath = path.join(indicesDir, name);
  if (!existsSyncImpl(filePath)) return [];
  const rows = parseCsv(readFileSyncImpl(filePath, "utf8"));
  const headers = rows[0] ?? [];
  return rows.slice(1).map((row) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = row[index] ?? "";
    });
    return record;
  });
}

export function argValue(name, argv = process.argv.slice(2)) {
  const index = argv.indexOf(name);
  return index >= 0 ? argv[index + 1] : "";
}

export function splitRefs(value) {
  return String(value || "")
    .split(/[;|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalize(value) {
  return String(value || "").toLowerCase();
}

export function matches(row, query) {
  const haystack = Object.values(row).join(" ").toLowerCase();
  return haystack.includes(query);
}

export function printList(label, value, consoleImpl = console) {
  const refs = splitRefs(value);
  consoleImpl.log(`- ${label}: ${refs.length > 0 ? refs.join(", ") : "none"}`);
}

export function main(deps = {}) {
  const { argv = process.argv.slice(2), consoleImpl = console, readCsvImpl = readCsv, root = process.cwd() } = deps;
  const query = normalize(argValue("--query", argv) || argValue("--id", argv) || argv.join(" "));
  if (!query || query === "--help" || query === "-h") {
    consoleImpl.log("Usage: node scripts/triageJourneyEvidence.mjs --query <route|api|action|chain|file|error-fragment>");
    process.exitCode = query ? 0 : 1;
    return { status: query ? 0 : 1, help: true };
  }

  const actions = readCsvImpl("user-action-index.csv", { root });
  const webJourneys = readCsvImpl("web-journey-index.csv", { root });
  const chains = readCsvImpl("function-chain-evidence-index.csv", { root });
  const apis = readCsvImpl("api-surface-evidence-index.csv", { root });

  const actionMatches = actions.filter((row) => matches(row, query));
  const webMatches = webJourneys.filter((row) => matches(row, query));
  const chainMatches = chains.filter((row) => matches(row, query));
  const apiMatches = apis.filter((row) => matches(row, query));
  const firstAction = actionMatches[0];

  consoleImpl.log(`# Journey Evidence Triage`);
  consoleImpl.log("");
  consoleImpl.log(`Query: ${query}`);
  consoleImpl.log(`Matches: ${actionMatches.length} actions, ${webMatches.length} web journeys, ${chainMatches.length} chains, ${apiMatches.length} APIs`);
  consoleImpl.log("");

  if (firstAction) {
    consoleImpl.log("## Primary Action");
    consoleImpl.log("");
    consoleImpl.log(`- ID: ${firstAction.id}`);
    consoleImpl.log(`- Source node: ${firstAction.source_node_id}`);
    consoleImpl.log(`- Route / entrypoint: ${firstAction.route_or_entrypoint}`);
    consoleImpl.log(`- Kind: ${firstAction.action_kind}`);
    consoleImpl.log(`- Safety boundary: ${firstAction.safety_boundary}`);
    consoleImpl.log(`- Proof status: ${firstAction.proof_status}`);
    consoleImpl.log(`- Gap severity: ${firstAction.gap_severity}`);
    consoleImpl.log(`- Gaps: ${firstAction.gaps || "none"}`);
    printList("API routes", firstAction.api_routes, consoleImpl);
    printList("Function chains", firstAction.function_chains, consoleImpl);
    printList("Backend functions", firstAction.backend_functions, consoleImpl);
    printList("Data models", firstAction.data_models, consoleImpl);
    printList("Tests", firstAction.tests, consoleImpl);
    printList("Docs", firstAction.docs, consoleImpl);
    consoleImpl.log(`- Evidence: ${firstAction.evidence || "none"}`);
    consoleImpl.log(`- Next validation: ${firstAction.next_validation}`);
    consoleImpl.log("");
  }

  const relatedApiIds = new Set(actionMatches.flatMap((row) => splitRefs(row.api_routes)));
  const relatedChainIds = new Set(actionMatches.flatMap((row) => splitRefs(row.function_chains)));
  const relatedApis = apis.filter((row) => relatedApiIds.has(row.id));
  const relatedChains = chains.filter((row) => relatedChainIds.has(row.id));

  if (relatedChains.length > 0 || chainMatches.length > 0) {
    consoleImpl.log("## Related Chains");
    consoleImpl.log("");
    for (const chain of [...relatedChains, ...chainMatches].slice(0, 10)) {
      consoleImpl.log(`- ${chain.id}: ${chain.status}, severity=${chain.gap_severity}, gaps=${chain.gaps || "none"}`);
    }
    consoleImpl.log("");
  }

  if (relatedApis.length > 0 || apiMatches.length > 0) {
    consoleImpl.log("## Related APIs");
    consoleImpl.log("");
    for (const api of [...relatedApis, ...apiMatches].slice(0, 10)) {
      consoleImpl.log(`- ${api.id}: ${api.route}, status=${api.verification_status || api.status}, severity=${api.gap_severity}, gaps=${api.gaps || "none"}`);
    }
    consoleImpl.log("");
  }

  if (!firstAction && actionMatches.length === 0 && webMatches.length === 0 && chainMatches.length === 0 && apiMatches.length === 0) {
    consoleImpl.log("No matching indexed journey evidence found. Regenerate indexes, then check whether the route/API/action is missing from graph registry records.");
    process.exitCode = 2;
    return { status: 2, query, actionMatches, webMatches, chainMatches, apiMatches };
  }

  return { status: 0, query, actionMatches, webMatches, chainMatches, apiMatches, relatedChains, relatedApis };
}

if (isDirectRun()) main();
