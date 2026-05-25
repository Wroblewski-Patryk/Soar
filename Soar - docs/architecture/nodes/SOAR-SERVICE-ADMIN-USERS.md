---
id: SOAR-SERVICE-ADMIN-USERS
name: "Admin users service"
type: service
status: verified_local
layer: backend
module: api-admin
feature: subscriptions-admin
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Admin users service

| Field | Value |
| --- | --- |
| Description | Admin user list and mutation service with self-demotion last-admin and plan assignment guards. |
| File path | apps/api/src/modules/admin/users/users.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-SUBSCRIPTIONS]], [[SOAR-DB-USER]], [[SOAR-DB-USER-SUBSCRIPTION]], [[SOAR-DB-SUBSCRIPTION-PLAN]] |
| Used by | [[SOAR-CONTROLLER-ADMIN-USERS]] |
| UI related |  |
| API related | [[SOAR-API-ADMIN-USERS-LIST]], [[SOAR-API-ADMIN-USERS-UPDATE]] |
| Database related | [[SOAR-DB-USER]], [[SOAR-DB-USER-SUBSCRIPTION]], [[SOAR-DB-SUBSCRIPTION-PLAN]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-API]] |
| Docs related | [[SOAR-DOC-API-ADMIN]] |
| Agent related |  |
| Notes | Service owns admin role and plan assignment truth. |

## Relations

- uses -> [[SOAR-SERVICE-SUBSCRIPTIONS]] (verified_local)
- reads_writes -> [[SOAR-DB-USER]] (verified_local)
- reads_writes -> [[SOAR-DB-USER-SUBSCRIPTION]] (verified_local)
- calls <- [[SOAR-CONTROLLER-ADMIN-USERS]] (verified_local)
- verifies <- [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-API]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
