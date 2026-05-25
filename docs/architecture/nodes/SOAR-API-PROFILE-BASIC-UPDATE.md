---
id: SOAR-API-PROFILE-BASIC-UPDATE
name: "PATCH /dashboard/profile/basic"
type: api_route
status: verified_local
layer: backend
module: api-profile
feature: api-support-routes
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# PATCH /dashboard/profile/basic

| Field | Value |
| --- | --- |
| Description | Authenticated profile basic update endpoint. |
| File path | apps/api/src/modules/profile/basic/basic.routes.ts |
| Related files | apps/api/src/modules/profile/basic/basic.controller.ts, apps/api/src/modules/profile/basic/basic.service.ts, apps/api/src/modules/profile/basic/basic.types.ts |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-PROFILE-BASIC]], [[SOAR-TYPES-PROFILE-BASIC]], [[SOAR-SERVICE-PROFILE-BASIC]] |
| Used by | [[SOAR-ROUTER-DASHBOARD]] |
| UI related |  |
| API related | [[SOAR-SERVICE-PROFILE-BASIC]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-PROFILE-BASIC-API]] |
| Docs related | [[SOAR-DOC-API-PROFILE]] |
| Agent related |  |
| Notes | Profile basic mutation route. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-PROFILE-BASIC]] (verified_local)
- calls <- [[SOAR-COMP-PROFILE-BASIC-FORM]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
