---
id: SOAR-COMP-RUNTIME-DATA-SECTION
name: "RuntimeDataSection"
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

# RuntimeDataSection

| Field | Value |
| --- | --- |
| Description | Dashboard runtime tab section that presents positions orders history and related runtime tables. |
| File path | apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeDataSection.tsx |
| Related files | apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.tsx |
| Parent | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| Children | [[SOAR-COMP-RUNTIME-DATA-PRESENTERS]] |
| Depends on | [[SOAR-API-BOT-RUNTIME-POSITIONS]], [[SOAR-SERVICE-WEB-BOTS-API]] |
| Used by | [[SOAR-PAGE-DASHBOARD]] |
| UI related | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| API related | [[SOAR-API-BOT-RUNTIME-POSITIONS]] |
| Database related |  |
| Tests related | [[SOAR-TEST-DASHBOARD-RUNTIME]], [[SOAR-TEST-WEB-MANUAL-ORDER]] |
| Docs related | [[SOAR-DOC-WEB-DASHBOARD-HOME]] |
| Agent related |  |
| Notes | Open Orders UI lives inside the dashboard runtime surface. |

## Relations

- uses -> [[SOAR-COMP-RUNTIME-DATA-PRESENTERS]] (partially_verified)
- uses -> [[SOAR-WEB-POSITIONS-SERVICE]] (verified_local)
- contains <- [[SOAR-COMP-HOME-LIVE-WIDGETS]] (partially_verified)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
