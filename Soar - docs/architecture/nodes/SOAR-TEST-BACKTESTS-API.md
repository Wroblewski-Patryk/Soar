---
id: SOAR-TEST-BACKTESTS-API
name: "Backtests API tests"
type: test
status: verified_local
layer: testing
module: api-backtests
feature: backtests
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Backtests API tests

| Field | Value |
| --- | --- |
| Description | Backtests API and service tests for run lifecycle queue range report timeline contracts and repository behavior. |
| File path | apps/api/src/modules/backtests/backtests.e2e.test.ts |
| Related files | apps/api/src/modules/backtests/backtests.contract-remediation.test.ts, apps/api/src/modules/backtests/backtestRunQueue.test.ts, apps/api/src/modules/backtests/backtestRunJob.test.ts, apps/api/src/modules/backtests/backtestRange.service.test.ts, apps/api/src/modules/reports/reports.service.test.ts |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-API-BACKTEST-RUN-LIST]], [[SOAR-API-BACKTEST-RUN-CREATE]], [[SOAR-API-BACKTEST-RUN-REPORT]], [[SOAR-API-BACKTEST-RUN-TIMELINE]], [[SOAR-SERVICE-BACKTESTS]] |
| Used by | [[SOAR-FEATURE-BACKTESTS]] |
| UI related |  |
| API related | [[SOAR-API-BACKTEST-RUN-LIST]], [[SOAR-API-BACKTEST-RUN-CREATE]], [[SOAR-API-BACKTEST-RUN-REPORT]], [[SOAR-API-BACKTEST-RUN-TIMELINE]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]], [[SOAR-DB-BACKTEST-TRADE]], [[SOAR-DB-BACKTEST-REPORT]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-API-BACKTESTS]] |
| Agent related |  |
| Notes | Primary API proof node. |

## Relations

- verified_by <- [[SOAR-FEATURE-BACKTESTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
