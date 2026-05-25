---
id: SOAR-API-ICON-LOOKUP
name: "GET /dashboard/icons/lookup"
type: api_route
status: verified_local
layer: backend
module: api-icons
feature: api-support-routes
risk_level: medium
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# GET /dashboard/icons/lookup

| Field | Value |
| --- | --- |
| Description | Authenticated rate-limited icon lookup endpoint for coin icon metadata. |
| File path | apps/api/src/modules/icons/icons.routes.ts |
| Related files | apps/api/src/modules/icons/icons.controller.ts, apps/api/src/modules/icons/icons.service.ts, apps/api/src/modules/icons/icons.types.ts |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-ICONS]], [[SOAR-SERVICE-ICONS]], [[SOAR-TYPES-ICONS]] |
| Used by | [[SOAR-ROUTER-DASHBOARD]] |
| UI related |  |
| API related | [[SOAR-SERVICE-ICONS]] |
| Database related |  |
| Tests related | [[SOAR-TEST-ICONS-API]] |
| Docs related | [[SOAR-DOC-API-ICONS]] |
| Agent related |  |
| Notes | Support route for icon enrichment. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-ICONS]] (verified_local)
- verified_by -> [[SOAR-TEST-ICONS-API]] (verified_local)
- documented_by -> [[SOAR-DOC-API-ICONS]] (verified_local)
- mounts <- [[SOAR-ROUTER-DASHBOARD]] (verified_local)
- protects <- [[SOAR-MIDDLEWARE-RATE-LIMIT]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-ICONS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
