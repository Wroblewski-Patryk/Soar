---
id: SOAR-HOOK-COIN-ICON-LOOKUP
name: "useCoinIconLookup"
type: hook
status: verified_local
layer: frontend
module: web-icons
feature: web-residual-surfaces
risk_level: medium
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, hook, frontend, verified_local]
---

# useCoinIconLookup

| Field | Value |
| --- | --- |
| Description | Frontend hook for coin icon lookup state and caching behavior. |
| File path | apps/web/src/features/icons/hooks/useCoinIconLookup.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-WEB-RESIDUAL-SURFACES]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-ICONS]], [[SOAR-API-ICON-LOOKUP]] |
| Used by | [[SOAR-COMP-LIVE-MARKET-BAR]], [[SOAR-COMP-BOTS-MONITORING-TAB]] |
| UI related |  |
| API related | [[SOAR-API-ICON-LOOKUP]] |
| Database related |  |
| Tests related | [[SOAR-TEST-WEB-RESIDUAL-SURFACES]] |
| Docs related | [[SOAR-DOC-WEB-ICONS]] |
| Agent related |  |
| Notes | Web coin icon hook. |

## Relations

- calls -> [[SOAR-SERVICE-WEB-ICONS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
