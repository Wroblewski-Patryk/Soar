---
type: docs_index
status: canonical
area: documentation
last_verified: 2026-05-23
graph_role: primary_hub
---

# Soar Documentation Map

Updated: 2026-05-23

This is the main entrypoint for current Soar documentation. Use it to choose
the right map, then move into the specific folder. Historical task files, old
plans, audits, proof artifacts, release packets, and raw outputs live in
[History](../history/history-overview.md), not in canonical docs.
Guard note: history is evidence, not active owner.

## Choose A Map

| Need | Go to |
| --- | --- |
| Product intent, scope, roadmap, limits | [Product Map](./maps/product-map.md) |
| System shape, contracts, modules, architecture truth | [Architecture Map](./maps/architecture-map.md) |
| Trading runtime, execution lifecycle, safety, parity | [Runtime Map](./maps/runtime-map.md) |
| Deploy, smoke, rollback, release gates, operator proof | [Release And Operations Map](./maps/release-ops-map.md) |
| Coordinator startup, active state, validation, historical lookup | [Agent Work Map](./maps/agent-work-map.md) |

## Choose A Work Route

Use these routes when you are not only browsing, but trying to do work.

| Situation | Start With | Then Check | Close By Updating |
| --- | --- | --- | --- |
| New coordinator chat or continuation nudge | [Agent Work Map](./maps/agent-work-map.md) | `.agents/state/active-mission.md`, `.codex/context/TASK_BOARD.md`, `.agents/state/next-steps.md` | active mission, task board, project state |
| Product or scope question | [Product Map](./maps/product-map.md) | `docs/planning/open-decisions.md`, delivery map, known limits | product docs or open decisions |
| Architecture or ownership change | [Architecture Map](./maps/architecture-map.md) | numbered architecture set, reference contracts, module registry | architecture, module docs, traceability |
| Feature-chain or impact analysis | [Architecture Evidence Graph System](./architecture/architecture-evidence-graph-system.md) | `docs/architecture/registry/*.csv`, `docs/architecture/relations/dependencies.csv`, `docs/architecture/chains/chains.csv` | CSV graph registries, generated nodes, status export |
| Runtime, trading, money, or safety change | [Runtime Map](./maps/runtime-map.md) | lifecycle/parity/safety contracts, module confidence ledger | architecture references, runtime modules, evidence |
| Release, deploy, rollback, or production proof | [Release And Operations Map](./maps/release-ops-map.md) | operations runbooks, current focus, release history | operations docs, system health, release evidence |
| Need proof for a claim | [Agent Work Map](./maps/agent-work-map.md) | `history/evidence/`, `history/releases/`, `history/audits/` | task record and relevant state file |
| Need to add or move documentation | [Contributing Docs](./CONTRIBUTING-DOCS.md) | [Repository structure policy](./governance/repository-structure-policy.md) | nearest semantic area hub |

## Current Source Of Truth

Use these folders as current truth. Links point to folder entrypoints so the
Obsidian graph forms local clusters instead of one global superhub.

| Path | Role | Primary entry |
| --- | --- | --- |
| `docs/product/` | Product scope, vision, glossary, and known limits. | [Product docs](./product/product-documentation.md) |
| `docs/architecture/` | Canonical runtime, ownership, data, parity, and safety truth. | [Architecture docs](./architecture/architecture-documentation.md) |
| `docs/modules/` | Implementation-facing module ownership, dependencies, routes, and tests. | [Module docs](./modules/module-documentation.md) |
| `docs/pipelines/` | End-to-end system flows across UI, API, services, data, workers, and tests. | [Pipeline docs](./pipelines/pipeline-registry.md) |
| `docs/planning/` | Active queue, durable plans, and unresolved decisions. | [Planning docs](./planning/planning-documentation.md) |
| `docs/operations/` | Living deployment, smoke, rollback, incident, reliability, and operator runbooks. | [Operations docs](./operations/operations-documentation.md) |
| `docs/security/` | Secure development, risk, API key, and secrets policy. | [Security docs](./security/security-documentation.md) |
| `docs/ux/` | Dashboard design system, quality bars, parity evidence, and anti-patterns. | [UX docs](./ux/ux-documentation.md) |
| `docs/governance/` | Repository, agent, and delivery rules. | [Governance docs](./governance/governance-documentation.md) |

## Active Agent Memory

Active work state is outside `docs/`:

| Path | Role |
| --- | --- |
| `.agents/state/active-mission.md` | Current mission router. |
| `.agents/state/current-focus.md` | Current release and work focus. |
| `.agents/state/next-steps.md` | Next executable work. |
| `.agents/state/module-confidence-ledger.md` | Module confidence reality map. |
| `.codex/context/TASK_BOARD.md` | Execution queue. |
| `.codex/context/PROJECT_STATE.md` | High-level current project state. |

## Graph Guidance

For Obsidian graph view:

- Treat `docs/maps/*` as the current-system graph backbone.
- Treat semantic area files, such as `architecture-documentation.md`,
  `module-registry.md`, or `operations-documentation.md`, as local cluster
  hubs.
- Filter out `history/` when you want the current architecture and product map.
- Turn `history/` back on only when reconstructing proof lineage.
- Prefer named area hubs over broad search when starting work.

## Useful Documentation Standard

A current doc is useful only if a future reader can answer:

- what source owns this truth;
- which code, route, module, workflow, or operation it affects;
- what evidence proves the current status;
- what must be updated if the truth changes.

If a file mainly answers "what happened before", move it to `history/` or link
to the historical record from the current owner doc.

## Maintenance Rule

Every feature, route, module, database model, pipeline, deployment behavior, or
test coverage change must update the matching traceability and registry docs in
the same task. See `docs/CONTRIBUTING-DOCS.md`.
