---
id: SOAR-COMP-HOME-LIVE-WIDGETS
name: "HomeLiveWidgets"
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

# HomeLiveWidgets

| Field | Value |
| --- | --- |
| Description | Dashboard runtime widget composition for selected bot wallet positions orders and manual actions. |
| File path | apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx |
| Related files | apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.ts |
| Parent | [[SOAR-PAGE-DASHBOARD]] |
| Children |  |
| Depends on | [[SOAR-HOOK-MANUAL-ORDER-CONTROLLER]], [[SOAR-API-BOT-RUNTIME-POSITIONS]] |
| Used by | [[SOAR-PAGE-DASHBOARD]] |
| UI related | [[SOAR-PAGE-DASHBOARD]] |
| API related | [[SOAR-API-BOT-RUNTIME-POSITIONS]] |
| Database related |  |
| Tests related | [[SOAR-TEST-DASHBOARD-RUNTIME]] |
| Docs related | [[SOAR-DOC-WEB-DASHBOARD-HOME]] |
| Agent related |  |
| Notes | Primary dashboard node for UI to backend chain analysis. |

## Relations

- calls -> [[SOAR-API-BOT-RUNTIME-POSITIONS]] (partially_verified)
- uses -> [[SOAR-HOOK-MANUAL-ORDER-CONTROLLER]] (verified)
- contains -> [[SOAR-COMP-RUNTIME-DATA-SECTION]] (partially_verified)
- uses -> [[SOAR-SERVICE-WEB-BOTS-API]] (verified_local)
- composes -> [[SOAR-COMP-RUNTIME-SIDEBAR-SECTION]] (verified_local)
- composes -> [[SOAR-COMP-RUNTIME-ONBOARDING-SECTION]] (verified_local)
- composes -> [[SOAR-COMP-RUNTIME-SIGNALS-SECTION]] (verified_local)
- composes -> [[SOAR-COMP-LIVE-MARKET-BAR]] (verified_local)
- uses -> [[SOAR-HOOK-RUNTIME-SELECTION-VIEWMODEL]] (verified_local)
- verified_by -> [[SOAR-TEST-DASHBOARD-RUNTIME-RESIDUAL-WEB]] (verified_local)
- contains <- [[SOAR-PAGE-DASHBOARD]] (partially_verified)
- extends <- [[SOAR-FEATURE-WEB-RUNTIME-SURFACES]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
