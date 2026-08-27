---
id: SOAR-COMP-ADMIN-USERS-PAGE
name: "AdminUsersPage"
type: component
status: verified_local
layer: frontend
module: web-admin
feature: subscriptions-admin
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# AdminUsersPage

| Field | Value |
| --- | --- |
| Description | Admin page for user listing role mutation and subscription assignment confirmation. |
| File path | apps/web/src/features/admin/users/pages/AdminUsersPage.tsx |
| Related files | apps/web/src/features/admin/users/pages/AdminUsersPage.test.tsx |
| Parent | [[SOAR-PAGE-ADMIN-USERS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-ADMIN-USERS]] |
| Used by | [[SOAR-PAGE-ADMIN-USERS]] |
| UI related | [[SOAR-PAGE-ADMIN-USERS]] |
| API related | [[SOAR-API-ADMIN-USERS-LIST]], [[SOAR-API-ADMIN-USERS-UPDATE]] |
| Database related | [[SOAR-DB-USER]], [[SOAR-DB-USER-SUBSCRIPTION]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-WEB]] |
| Docs related | [[SOAR-DOC-WEB-ADMIN]] |
| Agent related |  |
| Notes | Component owns user role/plan confirmation flows. |

## Relations

- calls -> [[SOAR-SERVICE-WEB-ADMIN-USERS]] (verified_local)
- renders <- [[SOAR-PAGE-ADMIN-USERS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
