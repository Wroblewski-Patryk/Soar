---
id: SOAR-COMP-BOTS-MONITORING-SECTIONS
name: "BotsMonitoringSections"
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

# BotsMonitoringSections

| Field | Value |
| --- | --- |
| Description | Bot monitoring sections for runtime context grouping. |
| File path | apps/web/src/features/bots/components/bots-management/BotsMonitoringSections.tsx |
| Related files | apps/web/src/features/bots/components/bots-management/BotsMonitoringRuntimeStateCell.tsx |
| Parent | [[SOAR-COMP-BOTS-MONITORING-TAB]] |
| Children |  |
| Depends on | [[SOAR-UTIL-BOTS-MONITORING-FORMATTERS]] |
| Used by | [[SOAR-COMP-BOTS-MONITORING-TAB]] |
| UI related | [[SOAR-COMP-BOTS-MONITORING-TAB]] |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-WEB-RUNTIME-SURFACES]] |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Bot monitoring section components. |

## Relations

- composes -> [[SOAR-COMP-BOTS-MONITORING-PROTECTION-CELL]] (verified_local)
- composes -> [[SOAR-COMP-BOTS-MONITORING-ATTRIBUTION-PILLS]] (verified_local)
- uses -> [[SOAR-UTIL-BOTS-MONITORING-FORMATTERS]] (verified_local)
- composes <- [[SOAR-COMP-BOTS-MONITORING-TAB]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
