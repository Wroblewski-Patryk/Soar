---
id: SOAR-FEATURE-BACKTESTS
name: "Backtest run lifecycle"
type: feature
status: verified_local
layer: fullstack
module: backtests
feature: backtests
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, feature, fullstack, verified_local]
---

# Backtest run lifecycle

| Field | Value |
| --- | --- |
| Description | Backtest run creation queue replay timeline trades report and immutable strategy/market snapshot lifecycle. |
| File path | docs/modules/api-backtests.md |
| Related files | docs/modules/web-backtest.md |
| Parent |  |
| Children | [[SOAR-PAGE-BACKTESTS-LIST]], [[SOAR-PAGE-BACKTEST-CREATE]], [[SOAR-PAGE-BACKTEST-DETAIL]], [[SOAR-COMP-BACKTEST-CREATE-FORM]], [[SOAR-COMP-BACKTEST-RUN-DETAILS]], [[SOAR-API-BACKTEST-RUN-CREATE]], [[SOAR-API-BACKTEST-RUN-TIMELINE]], [[SOAR-API-BACKTEST-RUN-REPORT]] |
| Depends on | [[SOAR-FEATURE-STRATEGIES]], [[SOAR-FEATURE-MARKETS]], [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Used by | [[SOAR-FEATURE-REPORTS]] |
| UI related | [[SOAR-COMP-BACKTESTS-LIST-VIEW]], [[SOAR-COMP-BACKTEST-CREATE-FORM]], [[SOAR-COMP-BACKTEST-RUN-DETAILS]] |
| API related | [[SOAR-API-BACKTEST-RUN-LIST]], [[SOAR-API-BACKTEST-RUN-GET]], [[SOAR-API-BACKTEST-RUN-TRADES]], [[SOAR-API-BACKTEST-RUN-REPORT]], [[SOAR-API-BACKTEST-RUN-TIMELINE]], [[SOAR-API-BACKTEST-RUN-CREATE]], [[SOAR-API-BACKTEST-RUN-DELETE]] |
| Database related | [[SOAR-DB-BACKTEST-RUN]], [[SOAR-DB-BACKTEST-TRADE]], [[SOAR-DB-BACKTEST-REPORT]], [[SOAR-DB-STRATEGY]], [[SOAR-DB-MARKET-UNIVERSE]] |
| Tests related | [[SOAR-TEST-BACKTESTS-API]], [[SOAR-TEST-BACKTEST-REPLAY]], [[SOAR-TEST-BACKTESTS-WEB]] |
| Docs related | [[SOAR-DOC-API-BACKTESTS]], [[SOAR-DOC-WEB-BACKTESTS]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Backfilled backtest run lifecycle separately from reports. |

## Relations

- has_entrypoint -> [[SOAR-PAGE-BACKTESTS-LIST]] (verified_local)
- has_entrypoint -> [[SOAR-PAGE-BACKTEST-CREATE]] (verified_local)
- has_entrypoint -> [[SOAR-PAGE-BACKTEST-DETAIL]] (verified_local)
- depends_on -> [[SOAR-FEATURE-STRATEGIES]] (verified_local)
- depends_on -> [[SOAR-FEATURE-MARKETS]] (verified_local)
- feeds -> [[SOAR-FEATURE-REPORTS]] (verified_local)
- verified_by -> [[SOAR-TEST-BACKTESTS-API]] (verified_local)
- verified_by -> [[SOAR-TEST-BACKTEST-REPLAY]] (verified_local)
- verified_by -> [[SOAR-TEST-BACKTESTS-WEB]] (verified_local)
- documented_by -> [[SOAR-DOC-API-BACKTESTS]] (verified_local)
- documented_by -> [[SOAR-DOC-WEB-BACKTESTS]] (verified_local)
- verified_by -> [[SOAR-TEST-BACKTEST-WEB-UTILITIES]] (verified_local)
- depends_on <- [[SOAR-FEATURE-REPORTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
