---
id: SOAR-PAGE-ADMIN-USERS
name: "Admin users page"
type: page
status: verified_local
layer: frontend
module: web-admin
feature: subscriptions-admin
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, page, frontend, verified_local]
---

# Admin users page

| Field | Value |
| --- | --- |
| Description | Admin user role and plan assignment route. |
| File path | apps/web/src/app/admin/users/page.tsx |
| Related files | apps/web/src/features/admin/users/pages/AdminUsersPage.tsx |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-COMP-ADMIN-USERS-PAGE]] |
| Used by | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| UI related | [[SOAR-COMP-ADMIN-USERS-PAGE]] |
| API related | [[SOAR-API-ADMIN-USERS-LIST]], [[SOAR-API-ADMIN-USERS-UPDATE]] |
| Database related | [[SOAR-DB-USER]], [[SOAR-DB-USER-SUBSCRIPTION]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-WEB]] |
| Docs related | [[SOAR-DOC-WEB-ADMIN]] |
| Agent related |  |
| Notes | Admin user role and subscription assignment UI. |

## Relations

- renders_with -> [[SOAR-COMP-ADMIN-LAYOUT-SHELL]] (verified_local)
- renders -> [[SOAR-COMP-ADMIN-USERS-PAGE]] (verified_local)
- has_entrypoint <- [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
