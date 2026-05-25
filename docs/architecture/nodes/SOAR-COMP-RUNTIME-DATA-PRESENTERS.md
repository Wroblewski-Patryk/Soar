---
id: SOAR-COMP-RUNTIME-DATA-PRESENTERS
name: "runtimeDataTablePresenters"
type: component
status: partially_verified
layer: frontend
module: web-dashboard-home
feature: dashboard-runtime
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-23
verification_status: partially_verified
tags: [soar-map, component, frontend, partially_verified]
---

# runtimeDataTablePresenters

| Field | Value |
| --- | --- |
| Description | Runtime table presenter helpers for position order history and action rendering. |
| File path | apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.tsx |
| Related files |  |
| Parent | [[SOAR-COMP-RUNTIME-DATA-SECTION]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-BOTS-API]] |
| Used by | [[SOAR-COMP-RUNTIME-DATA-SECTION]] |
| UI related | [[SOAR-COMP-RUNTIME-DATA-SECTION]] |
| API related | [[SOAR-API-ORDER-CANCEL]], [[SOAR-API-ORDER-CLOSE]] |
| Database related |  |
| Tests related | [[SOAR-TEST-DASHBOARD-RUNTIME]], [[SOAR-TEST-WEB-MANUAL-ORDER]] |
| Docs related | [[SOAR-DOC-WEB-DASHBOARD-HOME]] |
| Agent related |  |
| Notes | Backfill should split individual table columns and actions if UI risk grows. |

## Relations

- uses -> [[SOAR-UTIL-RUNTIME-TRADE-META]] (verified_local)
- uses <- [[SOAR-COMP-RUNTIME-DATA-SECTION]] (partially_verified)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
