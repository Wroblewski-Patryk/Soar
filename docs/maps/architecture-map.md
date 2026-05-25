---
type: docs_map
status: canonical
area: architecture
last_verified: 2026-05-23
graph_role: map
---

# Architecture Map

## Primary Path

1. [Architecture source of truth](../architecture/architecture-source-of-truth.md)
2. [Architecture Documentation](../architecture/architecture-documentation.md)
3. [Codebase map](../architecture/codebase-map.md)
4. [Traceability matrix](../architecture/traceability-matrix.md)
5. [Architecture evidence graph system](../architecture/architecture-evidence-graph-system.md)
6. [Module registry](../modules/module-registry.md)
7. [Pipeline registry](../pipelines/pipeline-registry.md)

## Numbered Architecture Set

Read the numbered files in order when making architecture-sensitive changes:

`01_overview-and-principles.md` -> `02_system-topology.md` ->
`03_domain-model.md` -> `04_runtime-contexts.md` ->
`05_strategy-signal-and-decision-flow.md` -> `06_execution-lifecycle.md` ->
`07_modes-parity-and-data.md` -> `08_operator-surfaces-and-routing.md` ->
`09_integrations-deployment-and-runtime-services.md` ->
`10_safety-entitlements-and-risk.md` -> `11_assistant-runtime.md` ->
`12_documentation-governance.md`.

## Supporting Memory

| Path | Use |
| --- | --- |
| `docs/contracts/contract-memory.md` | Agent-readable contract entrypoint. |
| `docs/flows/flow-memory.md` | Agent-readable flow entrypoint. |
| `docs/architecture/reference/` | Specific runtime, exchange, safety, and assistant contracts. |
| `docs/architecture/registry/*.csv` | CSV node registries for graph-backed architecture evidence. |
| `docs/architecture/relations/dependencies.csv` | Directed dependency and consumer edges. |
| `docs/architecture/chains/chains.csv` | Function-chain execution mappings. |
| `docs/graphs/architecture-graph.json` | Generated JSON graph export for future graph UI or audits. |

## Use This Map When

- deciding whether implementation fits approved architecture;
- tracing a feature from UI to API, runtime, data, tests, and operations;
- updating source of truth after a behavior or ownership change;
- resolving conflicts between old history and current behavior.
