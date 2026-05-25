---
id: SOAR-API-PROFILE-BASIC-DELETE
name: "DELETE /dashboard/profile/basic"
type: api_route
status: verified_local
layer: backend
module: api-profile
feature: api-support-routes
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# DELETE /dashboard/profile/basic

| Field | Value |
| --- | --- |
| Description | Authenticated profile account-delete route exposed by the basic profile module. |
| File path | apps/api/src/modules/profile/basic/basic.routes.ts |
| Related files | apps/api/src/modules/profile/basic/basic.controller.ts, apps/api/src/modules/profile/basic/basic.service.ts |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-PROFILE-BASIC]], [[SOAR-SERVICE-PROFILE-BASIC]] |
| Used by | [[SOAR-ROUTER-DASHBOARD]] |
| UI related |  |
| API related | [[SOAR-SERVICE-PROFILE-BASIC]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-PROFILE-BASIC-API]] |
| Docs related | [[SOAR-DOC-API-PROFILE]] |
| Agent related |  |
| Notes | Destructive profile route requires explicit proof before broader claims. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-PROFILE-BASIC]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
