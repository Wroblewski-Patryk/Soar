---
id: SOAR-SERVICE-BACKTEST-REPORT-LIFECYCLE
name: "Backtest report lifecycle service"
type: service
status: verified_local
layer: backend
module: api-backtests
feature: backtests
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Backtest report lifecycle service

| Field | Value |
| --- | --- |
| Description | Backtest report lifecycle and safe update/upsert service. |
| File path | apps/api/src/modules/backtests/backtestReportLifecycle.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-DB-BACKTEST-REPORT]], [[SOAR-DB-BACKTEST-RUN]] |
| Used by | [[SOAR-SERVICE-BACKTESTS]], [[SOAR-SERVICE-BACKTEST-RUN-JOB]] |
| UI related |  |
| API related | [[SOAR-API-BACKTEST-RUN-REPORT]] |
| Database related | [[SOAR-DB-BACKTEST-REPORT]], [[SOAR-DB-BACKTEST-RUN]] |
| Tests related | [[SOAR-TEST-BACKTESTS-API]] |
| Docs related | [[SOAR-DOC-API-BACKTESTS]] |
| Agent related |  |
| Notes | Report lifecycle boundary. |

## Relations

- reads_writes -> [[SOAR-DB-BACKTEST-REPORT]] (verified_local)
- uses <- [[SOAR-SERVICE-BACKTEST-RUN-JOB]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
