---
id: SOAR-ROUTER-ADMIN
name: "Admin API router"
type: router
status: verified_local
layer: backend
module: api-admin
feature: api-support-routes
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, router, backend, verified_local]
---

# Admin API router

| Field | Value |
| --- | --- |
| Description | Admin aggregate router enforcing admin role before admin users and subscription plan modules. |
| File path | apps/api/src/router/admin.routes.ts |
| Related files | apps/api/src/modules/admin/users/users.routes.ts, apps/api/src/modules/admin/subscriptionPlans/subscriptionPlans.routes.ts |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-API-ADMIN-USERS-LIST]], [[SOAR-API-ADMIN-SUBSCRIPTION-PLANS-LIST]] |
| Used by | [[SOAR-ROUTER-API-ROOT]] |
| UI related |  |
| API related | [[SOAR-API-ADMIN-USERS-LIST]], [[SOAR-API-ADMIN-SUBSCRIPTION-PLANS-LIST]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-API]] |
| Docs related | [[SOAR-DOC-API-ADMIN]] |
| Agent related |  |
| Notes | Aggregate admin mount and role boundary. |

## Relations

- mounts -> [[SOAR-API-ADMIN-USERS-LIST]] (verified_local)
- mounts -> [[SOAR-API-ADMIN-SUBSCRIPTION-PLANS-LIST]] (verified_local)
- mounts <- [[SOAR-ROUTER-API-ROOT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
