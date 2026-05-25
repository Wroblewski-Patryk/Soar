---
id: SOAR-TYPES-ADMIN-USERS
name: "Admin users DTO schemas"
type: validation
status: verified_local
layer: backend
module: api-admin
feature: subscriptions-admin
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, validation, backend, verified_local]
---

# Admin users DTO schemas

| Field | Value |
| --- | --- |
| Description | Admin user list params and update role/plan schemas. |
| File path | apps/api/src/modules/admin/users/users.types.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-DOC-API-ADMIN]] |
| Used by | [[SOAR-CONTROLLER-ADMIN-USERS]] |
| UI related |  |
| API related | [[SOAR-API-ADMIN-USERS-LIST]], [[SOAR-API-ADMIN-USERS-UPDATE]] |
| Database related | [[SOAR-DB-USER]], [[SOAR-DB-SUBSCRIPTION-PLAN]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-API]] |
| Docs related | [[SOAR-DOC-API-ADMIN]] |
| Agent related |  |
| Notes | Admin user validation boundary. |

## Relations

- validates_with <- [[SOAR-CONTROLLER-ADMIN-USERS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
