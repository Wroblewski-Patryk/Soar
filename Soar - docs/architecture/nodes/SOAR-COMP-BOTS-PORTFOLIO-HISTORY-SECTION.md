---
id: SOAR-COMP-BOTS-PORTFOLIO-HISTORY-SECTION
name: "BotsPortfolioHistorySection"
type: component
status: verified_local
layer: frontend
module: web-bots
feature: web-runtime-surfaces
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# BotsPortfolioHistorySection

| Field | Value |
| --- | --- |
| Description | Bot monitoring portfolio history section. |
| File path | apps/web/src/features/bots/components/bots-management/BotsPortfolioHistorySection.tsx |
| Related files | apps/web/src/features/bots/components/BotsManagement.portfolio-history.test.tsx |
| Parent | [[SOAR-COMP-BOTS-MONITORING-TAB]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-BOTS-API]] |
| Used by | [[SOAR-COMP-BOTS-MONITORING-TAB]] |
| UI related | [[SOAR-COMP-BOTS-MONITORING-TAB]] |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-TRADE]], [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-BOTS-PORTFOLIO-HISTORY-WEB]] |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Portfolio history monitoring section. |

## Relations

- verified_by -> [[SOAR-TEST-BOTS-PORTFOLIO-HISTORY-WEB]] (verified_local)
- composes <- [[SOAR-COMP-BOTS-MONITORING-TAB]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
