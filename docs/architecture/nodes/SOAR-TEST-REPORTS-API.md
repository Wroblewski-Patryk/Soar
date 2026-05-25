---
id: SOAR-TEST-REPORTS-API
name: "Reports API tests"
type: test
status: verified_local
layer: testing
module: api-reports
feature: reports
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Reports API tests

| Field | Value |
| --- | --- |
| Description | Reports API e2e and service tests for auth ownership isolation weighted aggregation and execution-mode snapshot semantics. |
| File path | apps/api/src/modules/reports/reports.e2e.test.ts |
| Related files | apps/api/src/modules/reports/reports.service.test.ts |
| Parent | [[SOAR-FEATURE-REPORTS]] |
| Children |  |
| Depends on | [[SOAR-API-REPORTS-CROSS-MODE-PERFORMANCE]], [[SOAR-SERVICE-REPORTS]], [[SOAR-SERVICE-REPORT-MODE-AGGREGATOR]] |
| Used by | [[SOAR-FEATURE-REPORTS]] |
| UI related |  |
| API related | [[SOAR-API-REPORTS-CROSS-MODE-PERFORMANCE]] |
| Database related | [[SOAR-DB-BACKTEST-REPORT]], [[SOAR-DB-TRADE]], [[SOAR-DB-BOT]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-API-REPORTS]] |
| Agent related |  |
| Notes | Primary backend reports proof. |

## Relations

- verifies -> [[SOAR-SERVICE-REPORT-MODE-AGGREGATOR]] (verified_local)
- verified_by <- [[SOAR-FEATURE-REPORTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
