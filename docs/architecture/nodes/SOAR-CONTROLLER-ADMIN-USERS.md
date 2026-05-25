---
id: SOAR-CONTROLLER-ADMIN-USERS
name: "Admin users controller"
type: controller
status: verified_local
layer: backend
module: api-admin
feature: subscriptions-admin
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, controller, backend, verified_local]
---

# Admin users controller

| Field | Value |
| --- | --- |
| Description | Admin users controller for list update and guard error mapping. |
| File path | apps/api/src/modules/admin/users/users.controller.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-TYPES-ADMIN-USERS]], [[SOAR-SERVICE-ADMIN-USERS]] |
| Used by | [[SOAR-API-ADMIN-USERS-LIST]], [[SOAR-API-ADMIN-USERS-UPDATE]] |
| UI related |  |
| API related | [[SOAR-API-ADMIN-USERS-LIST]], [[SOAR-API-ADMIN-USERS-UPDATE]] |
| Database related | [[SOAR-DB-USER]], [[SOAR-DB-USER-SUBSCRIPTION]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-API]] |
| Docs related | [[SOAR-DOC-API-ADMIN]] |
| Agent related |  |
| Notes | Controller maps admin user management requests. |

## Relations

- validates_with -> [[SOAR-TYPES-ADMIN-USERS]] (verified_local)
- calls -> [[SOAR-SERVICE-ADMIN-USERS]] (verified_local)
- routes_to <- [[SOAR-API-ADMIN-USERS-LIST]] (verified_local)
- routes_to <- [[SOAR-API-ADMIN-USERS-UPDATE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
