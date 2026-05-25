---
id: SOAR-TYPES-DASHBOARD-RUNTIME
name: "Dashboard runtime types"
type: type
status: verified_local
layer: frontend
module: web-dashboard-home
feature: dashboard-runtime
risk_level: medium
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, type, frontend, verified_local]
---

# Dashboard runtime types

| Field | Value |
| --- | --- |
| Description | Dashboard runtime shared type definitions for home live widgets. |
| File path | apps/web/src/features/dashboard-home/components/home-live-widgets/types.ts |
| Related files |  |
| Parent | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| Children |  |
| Depends on | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Used by | [[SOAR-COMP-HOME-LIVE-WIDGETS]], [[SOAR-HOOK-RUNTIME-SELECTION-VIEWMODEL]] |
| UI related | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-DASHBOARD-RUNTIME-RESIDUAL-WEB]] |
| Docs related | [[SOAR-DOC-WEB-DASHBOARD-HOME]] |
| Agent related |  |
| Notes | Shared dashboard runtime type seam. |

## Relations

- uses <- [[SOAR-HOOK-RUNTIME-SELECTION-VIEWMODEL]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
