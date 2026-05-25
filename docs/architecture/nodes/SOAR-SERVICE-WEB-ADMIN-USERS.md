---
id: SOAR-SERVICE-WEB-ADMIN-USERS
name: "Web admin users service"
type: service
status: verified_local
layer: frontend
module: web-admin
feature: subscriptions-admin
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, frontend, verified_local]
---

# Web admin users service

| Field | Value |
| --- | --- |
| Description | Typed frontend API service for admin users list and mutation calls. |
| File path | apps/web/src/features/admin/users/services/adminUsers.service.ts |
| Related files | apps/web/src/features/admin/users/types/adminUser.type.ts |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-API-ADMIN-USERS-LIST]], [[SOAR-API-ADMIN-USERS-UPDATE]] |
| Used by | [[SOAR-COMP-ADMIN-USERS-PAGE]] |
| UI related | [[SOAR-COMP-ADMIN-USERS-PAGE]] |
| API related | [[SOAR-API-ADMIN-USERS-LIST]], [[SOAR-API-ADMIN-USERS-UPDATE]] |
| Database related | [[SOAR-DB-USER]], [[SOAR-DB-USER-SUBSCRIPTION]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-WEB]] |
| Docs related | [[SOAR-DOC-WEB-ADMIN]] |
| Agent related |  |
| Notes | Frontend-to-admin-users API contract node. |

## Relations

- calls -> [[SOAR-API-ADMIN-USERS-LIST]] (verified_local)
- calls -> [[SOAR-API-ADMIN-USERS-UPDATE]] (verified_local)
- calls <- [[SOAR-COMP-ADMIN-USERS-PAGE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
