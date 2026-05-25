---
id: SOAR-API-ADMIN-USERS-UPDATE
name: "PATCH /admin/users/:userId"
type: api_route
status: verified_local
layer: backend
module: api-admin
feature: subscriptions-admin
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# PATCH /admin/users/:userId

| Field | Value |
| --- | --- |
| Description | Admin-only user role and subscription assignment endpoint with self/last-admin guards. |
| File path | apps/api/src/modules/admin/users/users.routes.ts |
| Related files | apps/api/src/modules/admin/users/users.controller.ts, apps/api/src/modules/admin/users/users.service.ts |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-ADMIN-USERS]], [[SOAR-TYPES-ADMIN-USERS]], [[SOAR-SERVICE-ADMIN-USERS]] |
| Used by | [[SOAR-SERVICE-WEB-ADMIN-USERS]] |
| UI related |  |
| API related | [[SOAR-CONTROLLER-ADMIN-USERS]] |
| Database related | [[SOAR-DB-USER]], [[SOAR-DB-USER-SUBSCRIPTION]], [[SOAR-DB-SUBSCRIPTION-PLAN]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-API]] |
| Docs related | [[SOAR-DOC-API-ADMIN]] |
| Agent related |  |
| Notes | Admin user mutation route. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-ADMIN-USERS]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-ADMIN-USERS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
