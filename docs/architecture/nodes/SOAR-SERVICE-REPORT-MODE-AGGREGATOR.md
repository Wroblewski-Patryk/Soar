---
id: SOAR-SERVICE-REPORT-MODE-AGGREGATOR
name: "Reports mode aggregation"
type: utility
status: verified_local
layer: backend
module: api-reports
feature: reports
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, utility, backend, verified_local]
---

# Reports mode aggregation

| Field | Value |
| --- | --- |
| Description | Aggregation utility producing weighted win rate net PnL gross profit and gross loss per execution mode. |
| File path | apps/api/src/modules/reports/reports.service.ts |
| Related files | apps/api/src/modules/reports/reports.service.test.ts |
| Parent | [[SOAR-SERVICE-REPORTS]] |
| Children |  |
| Depends on | [[SOAR-DB-BACKTEST-REPORT]], [[SOAR-DB-TRADE]] |
| Used by | [[SOAR-SERVICE-REPORTS]] |
| UI related |  |
| API related | [[SOAR-API-REPORTS-CROSS-MODE-PERFORMANCE]] |
| Database related | [[SOAR-DB-BACKTEST-REPORT]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-REPORTS-API]] |
| Docs related | [[SOAR-DOC-API-REPORTS]] |
| Agent related |  |
| Notes | aggregateModePerformance proof point. |

## Relations

- aggregates -> [[SOAR-DB-BACKTEST-REPORT]] (verified_local)
- aggregates -> [[SOAR-DB-TRADE]] (verified_local)
- uses <- [[SOAR-SERVICE-REPORTS]] (verified_local)
- verifies <- [[SOAR-TEST-REPORTS-API]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
