---
id: SOAR-HOOK-CLOSE-RUNTIME-POSITION-ACTION
name: "useCloseRuntimePositionAction"
type: hook
status: verified_local
layer: frontend
module: web-dashboard-home
feature: manual-order
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, hook, frontend, verified_local]
---

# useCloseRuntimePositionAction

| Field | Value |
| --- | --- |
| Description | Dashboard hook for close runtime position action and risk acknowledgement flow. |
| File path | apps/web/src/features/dashboard-home/hooks/useCloseRuntimePositionAction.ts |
| Related files | apps/web/src/features/dashboard-home/hooks/useCloseRuntimePositionAction.test.tsx |
| Parent | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-BOTS-API]], [[SOAR-API-BOT-RUNTIME-CLOSE-POSITION]] |
| Used by | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| UI related | [[SOAR-COMP-HOME-LIVE-WIDGETS]] |
| API related | [[SOAR-API-BOT-RUNTIME-CLOSE-POSITION]] |
| Database related | [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]] |
| Tests related | [[SOAR-TEST-WEB-SHELL-UI]] |
| Docs related | [[SOAR-DOC-WEB-DASHBOARD-HOME]] |
| Agent related |  |
| Notes | Runtime close-position UI action hook. |

## Relations

- calls -> [[SOAR-API-BOT-RUNTIME-CLOSE-POSITION]] (verified_local)
- verified_by -> [[SOAR-TEST-WEB-SHELL-UI]] (verified_local)
- has_ui_action <- [[SOAR-FEATURE-WEB-RESIDUAL-SURFACES]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
