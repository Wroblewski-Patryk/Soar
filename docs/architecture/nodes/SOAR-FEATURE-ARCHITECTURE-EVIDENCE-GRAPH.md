---
id: SOAR-FEATURE-ARCHITECTURE-EVIDENCE-GRAPH
name: "Architecture evidence graph system"
type: feature
status: in_progress
layer: documentation
module: architecture
feature: architecture-map
risk_level: medium
completion_percent: 35
last_verified_at: 2026-05-24
verification_status: implemented_not_verified
tags: [soar-map, feature, documentation, in_progress]
---

# Architecture evidence graph system

| Field | Value |
| --- | --- |
| Description | Obsidian-first living evidence graph mapping features functions components tests docs data dependencies and execution chains. |
| File path | docs/architecture/architecture-evidence-graph-system.md |
| Related files | docs/architecture/registry/nodes.csv, docs/architecture/relations/dependencies.csv, docs/architecture/chains/chains.csv |
| Parent |  |
| Children | [[SOAR-DOC-TRACEABILITY]], [[SOAR-DOC-CODEBASE-MAP]] |
| Depends on | [[SOAR-DOC-TRACEABILITY]], [[SOAR-DOC-CODEBASE-MAP]] |
| Used by |  |
| UI related | [[SOAR-DOC-TRACEABILITY]] |
| API related |  |
| Database related |  |
| Tests related | [[SOAR-TEST-ARCHITECTURE-GRAPH]] |
| Docs related | [[SOAR-DOC-ARCHITECTURE-GRAPH-SYSTEM]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | First seed only; full repository backfill is required. |

## Relations

- extends -> [[SOAR-DOC-TRACEABILITY]] (in_progress)
- extends -> [[SOAR-DOC-CODEBASE-MAP]] (in_progress)
- verified_by -> [[SOAR-TEST-ARCHITECTURE-GRAPH]] (in_progress)
- documents -> [[SOAR-DOC-MODULE-GOVERNANCE-INDEX]] (verified_local)
- documents -> [[SOAR-DOC-ARCHITECTURE-GOVERNANCE-INDEX]] (verified_local)
- documents -> [[SOAR-DOC-ARCHITECTURE-CONTRACT-INDEX]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
