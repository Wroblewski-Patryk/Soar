---
id: SOAR-SERVICE-WEB-ICONS
name: "Web icons service"
type: service
status: verified_local
layer: frontend
module: web-icons
feature: web-residual-surfaces
risk_level: medium
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, frontend, verified_local]
---

# Web icons service

| Field | Value |
| --- | --- |
| Description | Frontend icons API service for coin icon lookup. |
| File path | apps/web/src/features/icons/services/icons.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-WEB-RESIDUAL-SURFACES]] |
| Children |  |
| Depends on | [[SOAR-API-ICON-LOOKUP]] |
| Used by | [[SOAR-HOOK-COIN-ICON-LOOKUP]], [[SOAR-COMP-LIVE-MARKET-BAR]] |
| UI related |  |
| API related | [[SOAR-API-ICON-LOOKUP]] |
| Database related |  |
| Tests related | [[SOAR-TEST-WEB-RESIDUAL-SURFACES]] |
| Docs related | [[SOAR-DOC-WEB-ICONS]] |
| Agent related |  |
| Notes | Web icon lookup service. |

## Relations

- calls -> [[SOAR-API-ICON-LOOKUP]] (verified_local)
- calls <- [[SOAR-HOOK-COIN-ICON-LOOKUP]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
