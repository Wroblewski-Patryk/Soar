---
id: SOAR-HOOK-RUNTIME-SELECTION-VIEWMODEL
name: "useRuntimeSelectionViewModel"
type: hook
status: verified_local
layer: frontend
module: web-dashboard-home
feature: dashboard-runtime
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, hook, frontend, verified_local]
---

# useRuntimeSelectionViewModel

| Field | Value |
| --- | --- |
| Description | Runtime selection view-model for selected bot runtime display state. |
| File path | apps/web/src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.ts |
| Related files | apps/web/src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.test.ts |
| Parent | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| Children |  |
| Depends on | [[SOAR-TYPES-DASHBOARD-RUNTIME]], [[SOAR-UTIL-RUNTIME-DERIVATIONS]] |
| Used by | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| UI related | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-DASHBOARD-RUNTIME-RESIDUAL-WEB]] |
| Docs related | [[SOAR-DOC-WEB-DASHBOARD-HOME]] |
| Agent related |  |
| Notes | Selected runtime view-model helper. |

## Relations

- uses -> [[SOAR-TYPES-DASHBOARD-RUNTIME]] (verified_local)
- uses -> [[SOAR-UTIL-RUNTIME-DERIVATIONS]] (verified_local)
- verified_by -> [[SOAR-TEST-DASHBOARD-RUNTIME-RESIDUAL-WEB]] (verified_local)
- uses <- [[SOAR-COMP-HOME-LIVE-WIDGETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
