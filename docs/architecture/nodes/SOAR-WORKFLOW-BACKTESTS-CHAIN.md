---
id: SOAR-WORKFLOW-BACKTESTS-CHAIN
name: "Backtests run lifecycle workflow"
type: workflow
status: verified_local
layer: fullstack
module: backtests
feature: backtests
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, workflow, fullstack, verified_local]
---

# Backtests run lifecycle workflow

| Field | Value |
| --- | --- |
| Description | Workflow from backtest list/create/detail UI through Web service API routes controller DTO service queue job replay data gateway fill model report lifecycle DB tests and docs. |
| File path | docs/architecture/chains/chains.csv |
| Related files | docs/architecture/chains/CHAIN-BACKTESTS.md |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-BACKTESTS]] |
| Used by | [[SOAR-AGENT-COORDINATOR]] |
| UI related | [[SOAR-PAGE-BACKTESTS-LIST]], [[SOAR-PAGE-BACKTEST-CREATE]], [[SOAR-PAGE-BACKTEST-DETAIL]], [[SOAR-COMP-BACKTEST-CREATE-FORM]], [[SOAR-COMP-BACKTEST-RUN-DETAILS]] |
| API related | [[SOAR-API-BACKTEST-RUN-LIST]], [[SOAR-API-BACKTEST-RUN-GET]], [[SOAR-API-BACKTEST-RUN-TRADES]], [[SOAR-API-BACKTEST-RUN-REPORT]], [[SOAR-API-BACKTEST-RUN-TIMELINE]], [[SOAR-API-BACKTEST-RUN-CREATE]], [[SOAR-API-BACKTEST-RUN-DELETE]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]], [[SOAR-DB-BACKTEST-TRADE]], [[SOAR-DB-BACKTEST-REPORT]], [[SOAR-DB-STRATEGY]], [[SOAR-DB-MARKET-UNIVERSE]] |
| Tests related | [[SOAR-TEST-BACKTESTS-API]], [[SOAR-TEST-BACKTEST-REPLAY]], [[SOAR-TEST-BACKTESTS-WEB]] |
| Docs related | [[SOAR-DOC-API-BACKTESTS]], [[SOAR-DOC-WEB-BACKTESTS]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Backfill workflow node for Backtests slice. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
