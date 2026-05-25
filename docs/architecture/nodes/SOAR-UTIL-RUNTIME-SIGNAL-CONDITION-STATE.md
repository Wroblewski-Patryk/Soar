---
id: SOAR-UTIL-RUNTIME-SIGNAL-CONDITION-STATE
name: "Dashboard runtime signal condition state"
type: utility
status: verified_local
layer: frontend
module: web-dashboard-home
feature: web-runtime-surfaces
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-25
verification_status: verified_local
tags: [soar-map, utility, frontend, verified_local]
---

# Dashboard runtime signal condition state

| Field | Value |
| --- | --- |
| Description | Helper that derives active strategy-condition LONG/SHORT state from backend condition lines without changing execution state truth. |
| File path | apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeSignalConditionState.ts |
| Related files | apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeSignalConditionState.test.ts |
| Parent | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| Children |  |
| Depends on | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Used by | [[SOAR-COMP-HOME-LIVE-WIDGETS]], [[SOAR-COMP-RUNTIME-SIGNALS-SECTION]] |
| UI related | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-STRATEGY]] |
| Tests related | [[SOAR-TEST-DASHBOARD-RUNTIME-SIGNALS]] |
| Docs related | [[SOAR-DOC-WEB-DASHBOARD-HOME]] |
| Agent related |  |
| Notes | Separates strategy condition activity from accepted execution signal truth. |

## Relations

- verified_by -> [[SOAR-TEST-DASHBOARD-RUNTIME-SIGNALS]] (verified_local)
- uses <- [[SOAR-COMP-RUNTIME-SIGNALS-SECTION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
