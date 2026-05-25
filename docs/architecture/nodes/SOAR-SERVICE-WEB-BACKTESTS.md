---
id: SOAR-SERVICE-WEB-BACKTESTS
name: "Web backtests API service"
type: service
status: verified_local
layer: frontend
module: web-backtest
feature: backtests
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, frontend, verified_local]
---

# Web backtests API service

| Field | Value |
| --- | --- |
| Description | Typed frontend API service for backtest run list create delete detail trades report and timeline calls. |
| File path | apps/web/src/features/backtest/services/backtests.service.ts |
| Related files | apps/web/src/features/backtest/types/backtest.type.ts |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-API-BACKTEST-RUN-LIST]], [[SOAR-API-BACKTEST-RUN-GET]], [[SOAR-API-BACKTEST-RUN-TRADES]], [[SOAR-API-BACKTEST-RUN-REPORT]], [[SOAR-API-BACKTEST-RUN-TIMELINE]], [[SOAR-API-BACKTEST-RUN-CREATE]], [[SOAR-API-BACKTEST-RUN-DELETE]] |
| Used by | [[SOAR-COMP-BACKTESTS-LIST-VIEW]], [[SOAR-COMP-BACKTEST-CREATE-FORM]], [[SOAR-COMP-BACKTEST-RUN-DETAILS]] |
| UI related | [[SOAR-COMP-BACKTESTS-LIST-VIEW]], [[SOAR-COMP-BACKTEST-CREATE-FORM]], [[SOAR-COMP-BACKTEST-RUN-DETAILS]] |
| API related | [[SOAR-API-BACKTEST-RUN-LIST]], [[SOAR-API-BACKTEST-RUN-GET]], [[SOAR-API-BACKTEST-RUN-TRADES]], [[SOAR-API-BACKTEST-RUN-REPORT]], [[SOAR-API-BACKTEST-RUN-TIMELINE]], [[SOAR-API-BACKTEST-RUN-CREATE]], [[SOAR-API-BACKTEST-RUN-DELETE]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]] |
| Tests related | [[SOAR-TEST-BACKTESTS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-BACKTESTS]] |
| Agent related |  |
| Notes | Frontend-to-backend backtest contract node. |

## Relations

- calls -> [[SOAR-API-BACKTEST-RUN-LIST]] (verified_local)
- calls -> [[SOAR-API-BACKTEST-RUN-GET]] (verified_local)
- calls -> [[SOAR-API-BACKTEST-RUN-TRADES]] (verified_local)
- calls -> [[SOAR-API-BACKTEST-RUN-REPORT]] (verified_local)
- calls -> [[SOAR-API-BACKTEST-RUN-TIMELINE]] (verified_local)
- calls -> [[SOAR-API-BACKTEST-RUN-CREATE]] (verified_local)
- calls -> [[SOAR-API-BACKTEST-RUN-DELETE]] (verified_local)
- calls -> [[SOAR-API-BACKTEST-RUN-LIST]] (verified_local)
- calls -> [[SOAR-API-BACKTEST-RUN-REPORT]] (verified_local)
- calls <- [[SOAR-COMP-BACKTESTS-LIST-VIEW]] (verified_local)
- calls <- [[SOAR-COMP-BACKTEST-CREATE-FORM]] (verified_local)
- calls <- [[SOAR-COMP-BACKTEST-RUN-DETAILS]] (verified_local)
- calls <- [[SOAR-COMP-PERFORMANCE-REPORTS-VIEW]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
