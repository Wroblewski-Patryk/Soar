---
type: architecture_contract
status: in_progress
area: architecture
last_verified: 2026-05-24
graph_role: local_hub
---

# Architecture Evidence Graph System

## Purpose

Soar uses an Obsidian-first architecture evidence graph to map project elements
as first-class records instead of relying on prose-only documentation.

The goal is a living proof system:

- every meaningful feature, route, service, component, test, document, data
  model, workflow, event, agent, prompt, and configuration surface has a stable
  node;
- every node links to its dependencies, consumers, tests, docs, parent/child
  records, and evidence;
- function chains describe end-to-end execution from UI trigger to backend,
  data, side effects, tests, and documentation;
- missing records or missing evidence are treated as confidence gaps.

This system extends the existing `codebase-map.md`, `traceability-matrix.md`,
module docs, requirement matrix, and module-confidence ledger. It does not
replace them.

## Source Of Truth

CSV registries are the machine-readable source of truth:

- `docs/architecture/registry/nodes.csv`
- `docs/architecture/registry/features.csv`
- `docs/architecture/registry/functions.csv`
- `docs/architecture/registry/components.csv`
- `docs/architecture/registry/api_routes.csv`
- `docs/architecture/registry/ui_elements.csv`
- `docs/architecture/registry/tests.csv`
- `docs/architecture/registry/agents.csv`
- `docs/architecture/registry/prompts.csv`
- `docs/architecture/registry/events.csv`
- `docs/architecture/registry/workflows.csv`
- `docs/architecture/registry/pages.csv`
- `docs/architecture/relations/dependencies.csv`
- `docs/architecture/chains/chains.csv`

Generated Obsidian and export files:

- `docs/architecture/nodes/*.md`
- `docs/architecture/chains/*.md`
- `docs/graphs/architecture-graph.json`
- `docs/graphs/architecture-graph.md`
- `docs/graphs/architecture-awareness.json`
- `docs/graphs/architecture-awareness.csv`
- `docs/graphs/architecture-graph.mmd`
- `docs/status/architecture-awareness-report.md`
- `docs/status/architecture-map-status.md`
- `docs/status/architecture-graph-drift.md`

Regenerate and validate the graph with:

```powershell
pnpm run architecture:graph:generate
pnpm run architecture:graph:drift
pnpm run architecture:graph:drift:strict
pnpm run architecture:journey:index
pnpm run architecture:journey:index:strict
```

`architecture:graph:drift` inventories representative routes, services, tests,
Web pages, Web components, module docs, architecture docs, config, and pipeline
files, then reports which paths are not referenced by graph CSV records.
`architecture:graph:drift:strict` fails on any missing graph path reference and
is part of `pnpm run quality:guardrails`.

`architecture:journey:index` generates the operator-facing verification maps
that answer whether a function is only connected, locally proven, browser
proven, production proven, or still blocked. It writes:

- `docs/architecture/indices/function-chain-evidence-index.csv`
- `docs/architecture/indices/web-journey-index.csv`
- `docs/architecture/indices/api-surface-evidence-index.csv`
- `docs/architecture/indices/user-action-index.csv`
- `docs/graphs/function-journey-index.json`
- `docs/graphs/user-action-index.json`
- dated machine output under `history/artifacts/function-journey-index-*.json`
- dated machine output under `history/artifacts/user-action-index-*.json`
- a human status summary at `docs/status/function-journey-index.md`
- a human status summary at `docs/status/user-action-index.md`

`architecture:journey:index:strict` fails only on critical structural gaps
such as missing chain nodes, missing tests, or missing API routes. High gaps
are still reported because they usually represent honest proof boundaries:
local-only proof, missing authenticated browser proof, missing protected
production proof, or approval-gated LIVE mutation evidence.

Use `pnpm run architecture:journey:triage -- --query <route|api|action|chain>`
to start a repair from a user-visible failure. The triage output reports the
matching user action, route or entrypoint, safety boundary, proof state, linked
API routes, function chains, backend functions, data models, tests, docs,
evidence, and next validation. A UI change is not fully known until its action
row has been followed through those linked records and any protected or
money-facing proof boundary has either fresh browser/production evidence or a
recorded accepted limitation.

## Record Contract

Every node record must include:

| Field | Required | Meaning |
| --- | --- | --- |
| `id` | yes | Stable unique identifier. |
| `name` | yes | Human-readable name. |
| `type` | yes | `feature`, `page`, `component`, `hook`, `api_route`, `service`, `database_model`, `test`, `documentation`, `workflow`, `event`, `agent`, `prompt`, or another explicit type. |
| `status` | yes | Implementation state. |
| `layer` | yes | `frontend`, `backend`, `data`, `testing`, `documentation`, `agent-system`, `fullstack`, etc. |
| `module` | yes | Owning module or project area. |
| `feature` | yes | Parent feature or capability. |
| `description` | yes | What this node owns. |
| `file_path` | yes | Primary repo path or canonical doc path. |
| `related_files` | no | Supporting files separated by semicolons. |
| `parent_id` | no | Parent graph node. |
| `child_ids` | no | Child graph nodes separated by semicolons. |
| `depends_on` | no | Required upstream nodes. |
| `used_by` | no | Downstream consumers. |
| `ui_related` | no | Related UI nodes. |
| `api_related` | no | Related API nodes. |
| `database_related` | no | Related data nodes. |
| `tests_related` | no | Related test nodes. |
| `docs_related` | no | Related documentation nodes. |
| `agent_related` | no | Related agent/prompt nodes. |
| `risk_level` | yes | `low`, `medium`, `high`, or `critical`. |
| `completion_percent` | yes | Evidence-backed completion estimate, not optimism. |
| `last_verified_at` | yes | ISO date of last meaningful verification. |
| `verification_status` | yes | Evidence state. |
| `notes` | no | Caveats and residual risk. |

## Status Vocabulary

Use only these graph statuses unless a future architecture decision expands the
vocabulary:

- `planned`
- `in_progress`
- `implemented`
- `implemented_not_verified`
- `partially_verified`
- `verified`
- `verified_local`
- `blocked`
- `broken`
- `missing`
- `deprecated`

Brak dowodu oznacza brak zaufania. A node may exist as implemented code, but if
its tests, runtime proof, connection proof, or documentation links are missing,
it remains `implemented_not_verified` or `partially_verified`.

## Function Chain Rule

Every user-facing or runtime-significant function should have a chain in
`docs/architecture/chains/chains.csv`.

The expected shape is:

```text
UI trigger -> component -> hook/action -> API request -> backend route ->
controller/service -> repository/data model -> event/side effect ->
UI update -> tests -> docs
```

Agents must inspect the whole chain before answering "does this function work?"
The correct workflow is:

1. Find the feature node.
2. Follow its chain record.
3. Inspect every node and relation in the chain.
4. Check linked UI, API, data, tests, docs, events, agents, and side effects.
5. Report verified, partially verified, blocked, broken, or missing based on
   evidence.

Local file-only analysis is not sufficient for feature status.

## Missing-Connection Semantics

Treat these as defects in the graph system:

- code exists without a node record;
- a feature node has no chain;
- an API route has no UI/API/test/doc relation where applicable;
- a node has no tests or an explicit `not applicable` note;
- a docs node is missing for current architecture behavior;
- a relation references a missing node;
- a node points to a missing file.

The generator currently fails on missing node references and missing file
references for canonical `nodes.csv`.

## Current Coverage

The 2026-05-24 foundation seed maps representative P0/P1 chains and the current
incremental backfill has expanded into:

- Auth session
- Dashboard runtime monitoring
- Manual order execution
- Runtime DCA exchange-PnL threshold behavior
- Architecture evidence graph system itself
- Positions core read/reconciliation/manual update chain
- Bot Runtime monitoring chain
- Exchange Adapter capability and connector chain
- Wallets lifecycle and analytics chain
- Profile API Keys credential lifecycle chain
- Bot Setup and canonical topology chain
- Strategies authoring and indicator catalog chain
- Markets universe and catalog chain
- Backtests run lifecycle and replay chain
- Reports performance evidence chain
- Logs/Audit Trail evidence chain
- Subscriptions/Admin entitlement and management chain
- AI Assistant foundation and red-team protocol chain
- Operations config and pipeline chain
- API support routes chain
- Runtime support services chain
- API platform safety chain
- Web runtime surfaces chain
- Auth session deep chain
- Engine runtime core chain
- Market data and stream adapters chain
- Residual Web/API evidence and documentation governance indexes

The 2026-05-24 full drift closure covers the current representative drift
inventory: `pnpm run architecture:graph:drift` reports `796/796` inventoried
paths covered and `0` missing. This is architecture graph traceability proof,
not a substitute for fresh runtime journey proof, protected production proof,
external security review, or live exchange-side mutation approval.

The same zero-drift requirement is now enforced by the repository guardrail
suite. A future changed source, test, documentation, config, or pipeline path
that is not represented by graph CSV path references must be fixed before
`pnpm run quality:guardrails` can pass.

The 2026-05-25 function journey index layer maps the current graph into
`27` function-chain evidence rows, `36` web journey rows, and `96` API surface
rows. The first generated run reports `0` critical structural gaps and `28`
high proof gaps. This means the current graph is structurally connected enough
to guide debugging, while still clearly separating local proof from fresh
authenticated browser, protected production, external security, and
approval-gated LIVE mutation proof.

The 2026-05-25 user action index layer adds `39` action rows: `36` inferred
route visit/read actions and `3` explicit UI actions from graph UI-element
records. The generated run reports `0` critical action gaps and `37` high
proof gaps. This is the current bridge from "the user touched this part of the
Web app" to "these API routes, backend functions, data models, tests, docs,
and proof boundaries must be checked." The high count is intentional until
fresh authenticated browser or protected production proof exists for the
protected routes.

## Maintenance Rule

Every new or changed function must update the graph in the same task:

1. Add or update CSV node records.
2. Add or update relation rows.
3. Add or update function-chain rows.
4. Regenerate graph files.
5. Update requirement/module confidence when behavior or proof changed.
6. Record residual missing links as `missing`, `blocked`, or
   `implemented_not_verified`, never as implicit success.
