---
id: SOAR-COMP-MONITORING-FUTURE-SIGNALS
name: "MonitoringFutureSignalsSection"
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

# MonitoringFutureSignalsSection

| Field | Value |
| --- | --- |
| Description | Bot monitoring future signals section for strategy signal preview. |
| File path | apps/web/src/features/bots/components/bots-management/MonitoringFutureSignalsSection.tsx |
| Related files | apps/web/src/features/bots/components/bots-management/MonitoringFutureSignalsSection.test.tsx |
| Parent | [[SOAR-COMP-BOTS-MONITORING-TAB]] |
| Children |  |
| Depends on | [[SOAR-UTIL-BOTS-MONITORING-LABELS]], [[SOAR-SERVICE-WEB-BOTS-API]] |
| Used by | [[SOAR-COMP-BOTS-MONITORING-TAB]] |
| UI related | [[SOAR-COMP-BOTS-MONITORING-TAB]] |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-STRATEGY]] |
| Tests related | [[SOAR-TEST-BOTS-MONITORING-FUTURE-SIGNALS]] |
| Docs related | [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Future signals monitoring section. |

## Relations

- uses -> [[SOAR-UTIL-BOTS-MONITORING-LABELS]] (verified_local)
- verified_by -> [[SOAR-TEST-BOTS-MONITORING-FUTURE-SIGNALS]] (verified_local)
- composes <- [[SOAR-COMP-BOTS-MONITORING-TAB]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
