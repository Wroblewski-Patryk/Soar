---
id: SOAR-HOOK-BOTS-MONITORING-CONTROLLER
name: "useBotsMonitoringController"
type: hook
status: verified_local
layer: frontend
module: web-bots
feature: bot-runtime
risk_level: critical
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, hook, frontend, verified_local]
---

# useBotsMonitoringController

| Field | Value |
| --- | --- |
| Description | Controller hook for bot monitoring aggregate refresh and selected runtime state. |
| File path | apps/web/src/features/bots/hooks/useBotsMonitoringController.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-BOT-RUNTIME]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-BOTS-MONITORING-AGGREGATE]], [[SOAR-SERVICE-WEB-BOTS-API]] |
| Used by | [[SOAR-COMP-BOTS-MONITORING-TAB]] |
| UI related | [[SOAR-PAGE-BOT-RUNTIME]] |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]], [[SOAR-API-BOT-RUNTIME-POSITIONS]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-WEB-RESIDUAL-SURFACES]] |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Bots monitoring controller hook. |

## Relations

- calls -> [[SOAR-SERVICE-BOTS-MONITORING-AGGREGATE]] (verified_local)
- uses <- [[SOAR-COMP-BOTS-MONITORING-TAB]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
