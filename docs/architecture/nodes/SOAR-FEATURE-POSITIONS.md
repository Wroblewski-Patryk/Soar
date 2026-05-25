---
id: SOAR-FEATURE-POSITIONS
name: "Positions read and reconciliation"
type: feature
status: verified_local
layer: fullstack
module: positions
feature: positions
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, feature, fullstack, verified_local]
---

# Positions read and reconciliation

| Field | Value |
| --- | --- |
| Description | Position list read manual update exchange snapshot takeover rebind orphan repair and LIVE reconciliation mapping. |
| File path | docs/modules/api-positions.md |
| Related files | docs/modules/web-positions.md, docs/architecture/reference/live-position-restart-continuity-contract.md |
| Parent |  |
| Children | [[SOAR-PAGE-POSITIONS-LEGACY]], [[SOAR-WEB-POSITIONS-SERVICE]], [[SOAR-CONTROLLER-POSITIONS]], [[SOAR-SERVICE-POSITIONS]], [[SOAR-SERVICE-LIVE-POSITION-RECONCILIATION]] |
| Depends on | [[SOAR-FEATURE-MANUAL-ORDER]], [[SOAR-FEATURE-EXCHANGE-ADAPTER]], [[SOAR-DB-POSITION]] |
| Used by | [[SOAR-FEATURE-DASHBOARD-RUNTIME]] |
| UI related | [[SOAR-COMP-RUNTIME-DATA-SECTION]] |
| API related | [[SOAR-API-POSITION-LIST]], [[SOAR-API-POSITION-MANUAL-UPDATE]], [[SOAR-API-POSITION-EXCHANGE-SNAPSHOT]] |
| Database related | [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-POSITIONS-SERVICE]], [[SOAR-TEST-POSITIONS-RECONCILIATION]], [[SOAR-TEST-POSITIONS-SNAPSHOT]], [[SOAR-TEST-POSITIONS-TAKEOVER-ORPHAN]] |
| Docs related | [[SOAR-DOC-API-POSITIONS]], [[SOAR-DOC-WEB-POSITIONS]], [[SOAR-DOC-LIVE-POSITION-RESTART]] |
| Agent related |  |
| Notes | Backfilled as P0 money/runtime graph slice after manual order. |

## Relations

- documented_by -> [[SOAR-DOC-API-POSITIONS]] (verified_local)
- documented_by -> [[SOAR-DOC-WEB-POSITIONS]] (verified_local)
- verified_by -> [[SOAR-TEST-POSITIONS-SERVICE]] (verified_local)
- verified_by -> [[SOAR-TEST-POSITIONS-SNAPSHOT]] (verified_local)
- verified_by -> [[SOAR-TEST-POSITIONS-RECONCILIATION]] (verified_local)
- verified_by -> [[SOAR-TEST-POSITIONS-TAKEOVER-ORPHAN]] (verified_local)
- verified_by -> [[SOAR-TEST-WEB-POSITIONS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
