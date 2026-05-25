---
id: SOAR-FEATURE-REPORTS
name: "Reports feature"
type: feature
status: verified_local
layer: fullstack
module: reports
feature: reports
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, feature, fullstack, verified_local]
---

# Reports feature

| Field | Value |
| --- | --- |
| Description | Reports read model feature consuming backtest report live trade paper trade and completed backtest report data. |
| File path | docs/modules/api-reports.md |
| Related files | docs/modules/web-reports.md |
| Parent |  |
| Children | [[SOAR-PAGE-REPORTS]], [[SOAR-API-REPORTS-CROSS-MODE-PERFORMANCE]], [[SOAR-SERVICE-REPORTS]] |
| Depends on | [[SOAR-FEATURE-BACKTESTS]], [[SOAR-FEATURE-BOT-RUNTIME]] |
| Used by | [[SOAR-FEATURE-BACKTESTS]], [[SOAR-FEATURE-DASHBOARD-RUNTIME]] |
| UI related | [[SOAR-PAGE-REPORTS]], [[SOAR-COMP-PERFORMANCE-REPORTS-VIEW]] |
| API related | [[SOAR-API-REPORTS-CROSS-MODE-PERFORMANCE]], [[SOAR-API-BACKTEST-RUN-LIST]], [[SOAR-API-BACKTEST-RUN-REPORT]] |
| Database related | [[SOAR-DB-BACKTEST-REPORT]], [[SOAR-DB-BACKTEST-TRADE]], [[SOAR-DB-TRADE]], [[SOAR-DB-BOT]] |
| Tests related | [[SOAR-TEST-REPORTS-API]], [[SOAR-TEST-REPORTS-WEB]] |
| Docs related | [[SOAR-DOC-API-REPORTS]], [[SOAR-DOC-WEB-REPORTS]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Dedicated Reports chain backfilled across page component Web service API route controller aggregation service DB tests and docs. |

## Relations

- has_entrypoint -> [[SOAR-PAGE-REPORTS]] (verified_local)
- depends_on -> [[SOAR-FEATURE-BACKTESTS]] (verified_local)
- depends_on -> [[SOAR-FEATURE-BOT-RUNTIME]] (verified_local)
- reads -> [[SOAR-DB-BACKTEST-TRADE]] (verified_local)
- verified_by -> [[SOAR-TEST-REPORTS-API]] (verified_local)
- verified_by -> [[SOAR-TEST-REPORTS-WEB]] (verified_local)
- documented_by -> [[SOAR-DOC-API-REPORTS]] (verified_local)
- documented_by -> [[SOAR-DOC-WEB-REPORTS]] (verified_local)
- feeds <- [[SOAR-FEATURE-BACKTESTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
