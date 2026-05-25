---
id: SOAR-COMP-BOTS-MONITORING-TAB
name: "BotsMonitoringTab"
type: component
status: verified_local
layer: frontend
module: web-bots
feature: web-runtime-surfaces
risk_level: critical
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# BotsMonitoringTab

| Field | Value |
| --- | --- |
| Description | Selected bot monitoring tab that composes runtime sections future signals protection and portfolio history. |
| File path | apps/web/src/features/bots/components/bots-management/BotsMonitoringTab.tsx |
| Related files | apps/web/src/features/bots/components/bots-management/BotsMonitoringSections.tsx |
| Parent | [[SOAR-COMP-BOTS-MANAGEMENT]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-BOTS-API]], [[SOAR-COMP-BOTS-MONITORING-SECTIONS]] |
| Used by | [[SOAR-COMP-BOTS-MANAGEMENT]] |
| UI related | [[SOAR-COMP-BOTS-MANAGEMENT]] |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]], [[SOAR-API-BOT-RUNTIME-POSITIONS]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-WEB-RUNTIME-SURFACES]] |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Bot monitoring composition surface. |

## Relations

- composes -> [[SOAR-COMP-BOTS-MONITORING-SECTIONS]] (verified_local)
- composes -> [[SOAR-COMP-MONITORING-FUTURE-SIGNALS]] (verified_local)
- composes -> [[SOAR-COMP-BOTS-PORTFOLIO-HISTORY-SECTION]] (verified_local)
- calls -> [[SOAR-SERVICE-WEB-BOTS-API]] (verified_local)
- uses -> [[SOAR-HOOK-BOTS-MONITORING-CONTROLLER]] (verified_local)
- composes <- [[SOAR-COMP-BOTS-MANAGEMENT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
