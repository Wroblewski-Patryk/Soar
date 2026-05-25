---
id: SOAR-COMP-RUNTIME-SIDEBAR-SECTION
name: "RuntimeSidebarSection"
type: component
status: verified_local
layer: frontend
module: web-dashboard-home
feature: web-runtime-surfaces
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# RuntimeSidebarSection

| Field | Value |
| --- | --- |
| Description | Dashboard runtime sidebar section and presenters for selected runtime context. |
| File path | apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSidebarSection.tsx |
| Related files | apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeSidebarPresenters.ts |
| Parent | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| Children |  |
| Depends on | [[SOAR-UTIL-RUNTIME-FORMATTERS]], [[SOAR-SERVICE-WEB-BOTS-API]] |
| Used by | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| UI related | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-WEB-RUNTIME-SURFACES]] |
| Docs related | [[SOAR-DOC-WEB-DASHBOARD-HOME]] |
| Agent related |  |
| Notes | Dashboard runtime sidebar surface. |

## Relations

- verified_by -> [[SOAR-TEST-DASHBOARD-RUNTIME-RESIDUAL-WEB]] (verified_local)
- composes <- [[SOAR-COMP-HOME-LIVE-WIDGETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
