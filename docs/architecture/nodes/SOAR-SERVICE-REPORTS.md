---
id: SOAR-SERVICE-REPORTS
name: "Reports service"
type: service
status: verified_local
layer: backend
module: api-reports
feature: reports
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Reports service

| Field | Value |
| --- | --- |
| Description | Reports backend service fetching backtest reports PAPER trades and LIVE trades in parallel and returning cross-mode summary rows. |
| File path | apps/api/src/modules/reports/reports.service.ts |
| Related files | apps/api/src/modules/reports/reports.service.test.ts |
| Parent | [[SOAR-FEATURE-REPORTS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-REPORT-MODE-AGGREGATOR]], [[SOAR-DB-BACKTEST-REPORT]], [[SOAR-DB-TRADE]], [[SOAR-DB-BOT]] |
| Used by | [[SOAR-CONTROLLER-REPORTS]] |
| UI related |  |
| API related | [[SOAR-API-REPORTS-CROSS-MODE-PERFORMANCE]] |
| Database related | [[SOAR-DB-BACKTEST-REPORT]], [[SOAR-DB-TRADE]], [[SOAR-DB-BOT]] |
| Tests related | [[SOAR-TEST-REPORTS-API]] |
| Docs related | [[SOAR-DOC-API-REPORTS]] |
| Agent related |  |
| Notes | Service preserves executionMode snapshot semantics with legacy bot.mode fallback. |

## Relations

- uses -> [[SOAR-SERVICE-REPORT-MODE-AGGREGATOR]] (verified_local)
- reads -> [[SOAR-DB-BACKTEST-REPORT]] (verified_local)
- reads -> [[SOAR-DB-TRADE]] (verified_local)
- reads -> [[SOAR-DB-BOT]] (verified_local)
- calls <- [[SOAR-CONTROLLER-REPORTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
