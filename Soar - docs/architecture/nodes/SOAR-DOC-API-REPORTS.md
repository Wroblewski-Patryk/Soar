---
id: SOAR-DOC-API-REPORTS
name: "API reports module documentation"
type: documentation
status: verified_local
layer: documentation
module: api-reports
feature: reports
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, documentation, documentation, verified_local]
---

# API reports module documentation

| Field | Value |
| --- | --- |
| Description | Reports API module documentation covering cross-mode endpoint data sources ownership and testing proof. |
| File path | docs/modules/api-reports.md |
| Related files | docs/modules/api-backtests.md |
| Parent | [[SOAR-FEATURE-REPORTS]] |
| Children |  |
| Depends on | [[SOAR-DOC-API-BACKTESTS]] |
| Used by | [[SOAR-FEATURE-REPORTS]] |
| UI related |  |
| API related | [[SOAR-API-REPORTS-CROSS-MODE-PERFORMANCE]] |
| Database related | [[SOAR-DB-BACKTEST-REPORT]], [[SOAR-DB-TRADE]], [[SOAR-DB-BOT]] |
| Tests related | [[SOAR-TEST-REPORTS-API]] |
| Docs related | [[SOAR-DOC-API-BACKTESTS]] |
| Agent related |  |
| Notes | Canonical API reports module doc. |

## Relations

- documented_by <- [[SOAR-FEATURE-REPORTS]] (verified_local)
- depends_on <- [[SOAR-DOC-WEB-REPORTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
