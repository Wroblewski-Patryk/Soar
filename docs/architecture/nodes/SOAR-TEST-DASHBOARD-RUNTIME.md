---
id: SOAR-TEST-DASHBOARD-RUNTIME
name: "Dashboard runtime tests"
type: test
status: partially_verified
layer: testing
module: dashboard-runtime
feature: dashboard-runtime
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-23
verification_status: partially_verified
tags: [soar-map, test, testing, partially_verified]
---

# Dashboard runtime tests

| Field | Value |
| --- | --- |
| Description | Focused dashboard runtime component and runtime read-model tests. |
| File path | apps/web/src/features/dashboard-home/components/HomeLiveWidgets.runtime-table-audit.test.tsx |
| Related files | apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx, apps/api/src/modules/bots |
| Parent | [[SOAR-FEATURE-DASHBOARD-RUNTIME]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-DASHBOARD-RUNTIME]] |
| Used by | [[SOAR-FEATURE-DASHBOARD-RUNTIME]] |
| UI related | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| API related | [[SOAR-API-BOT-RUNTIME-POSITIONS]] |
| Database related | [[SOAR-DB-RUNTIME-SESSION]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-WEB-DASHBOARD-HOME]] |
| Agent related |  |
| Notes | Needs fresh authenticated browser journey after public reachability is restored. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
