---
id: SOAR-DOC-API-BACKTESTS
name: "API backtests module documentation"
type: documentation
status: verified_local
layer: documentation
module: api-backtests
feature: backtests
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, documentation, documentation, verified_local]
---

# API backtests module documentation

| Field | Value |
| --- | --- |
| Description | Backtests API deep-dive covering run lifecycle queue replay reports timeline parity and snapshot contracts. |
| File path | docs/modules/api-backtests.md |
| Related files | docs/architecture/05_strategy-signal-and-decision-flow.md, docs/architecture/06_execution-lifecycle.md, docs/architecture/07_modes-parity-and-data.md |
| Parent | [[SOAR-FEATURE-BACKTESTS]] |
| Children |  |
| Depends on | [[SOAR-DOC-DATA-MODEL]] |
| Used by | [[SOAR-FEATURE-BACKTESTS]] |
| UI related |  |
| API related | [[SOAR-API-BACKTEST-RUN-LIST]], [[SOAR-API-BACKTEST-RUN-CREATE]], [[SOAR-API-BACKTEST-RUN-REPORT]], [[SOAR-API-BACKTEST-RUN-TIMELINE]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]], [[SOAR-DB-BACKTEST-TRADE]], [[SOAR-DB-BACKTEST-REPORT]] |
| Tests related | [[SOAR-TEST-BACKTESTS-API]], [[SOAR-TEST-BACKTEST-REPLAY]] |
| Docs related | [[SOAR-DOC-DATA-MODEL]] |
| Agent related |  |
| Notes | Canonical API backtests module doc. |

## Relations

- documented_by <- [[SOAR-FEATURE-BACKTESTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
