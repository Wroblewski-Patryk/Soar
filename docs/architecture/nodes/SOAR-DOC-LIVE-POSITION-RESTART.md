---
id: SOAR-DOC-LIVE-POSITION-RESTART
name: "LIVE position restart continuity contract"
type: documentation
status: verified_local
layer: documentation
module: architecture
feature: positions
risk_level: 90
completion_percent: 2026-05-24
last_verified_at: verified_local
verification_status: Continuity source for reconciliation graph.
tags: [soar-map, documentation, documentation, verified_local]
---

# LIVE position restart continuity contract

| Field | Value |
| --- | --- |
| Description | Architecture contract for restart-safe LIVE imported and recovered position continuity. |
| File path | docs/architecture/reference/live-position-restart-continuity-contract.md |
| Related files |  |
| Parent | [[SOAR-FEATURE-POSITIONS]] |
| Children |  |
| Depends on | [[SOAR-DOC-API-POSITIONS]] |
| Used by | [[SOAR-SERVICE-LIVE-POSITION-RECONCILIATION]] |
| UI related |  |
| API related |  |
| Database related |  |
| Tests related |  |
| Docs related |  |
| Agent related | [[critical]] |
| Notes |  |

## Relations

- governed_by <- [[SOAR-SERVICE-LIVE-POSITION-RECONCILIATION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
