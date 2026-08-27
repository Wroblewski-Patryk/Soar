---
id: SOAR-COMP-BOTS-MANAGEMENT
name: "BotsManagement runtime monitoring component"
type: component
status: verified_local
layer: frontend
module: web-bots
feature: bot-runtime
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-21
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# BotsManagement runtime monitoring component

| Field | Value |
| --- | --- |
| Description | Bots management component that hosts monitoring tabs and runtime operator state. |
| File path | apps/web/src/features/bots/components/BotsManagement.tsx |
| Related files | apps/web/src/features/bots/components/bots-management/BotsMonitoringRuntimeStateCell.tsx |
| Parent | [[SOAR-FEATURE-BOT-RUNTIME]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-BOTS-API]] |
| Used by | [[SOAR-PAGE-BOT-RUNTIME]] |
| UI related | [[SOAR-PAGE-BOT-RUNTIME]] |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]], [[SOAR-API-BOT-RUNTIME-CLOSE-POSITION]] |
| Database related | [[SOAR-DB-RUNTIME-SESSION]], [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-BOT-RUNTIME-WEB]] |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Visible bot runtime operator surface. |

## Relations

- uses -> [[SOAR-SERVICE-WEB-BOTS-API]] (verified_local)
- renders -> [[SOAR-COMP-BOTS-ASSISTANT-TAB]] (verified_local)
- composes -> [[SOAR-COMP-BOTS-MANAGEMENT-TABS]] (verified_local)
- composes -> [[SOAR-COMP-BOTS-MONITORING-TAB]] (verified_local)
- contains <- [[SOAR-PAGE-BOT-RUNTIME]] (verified_local)
- renders <- [[SOAR-PAGE-BOT-ASSISTANT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
