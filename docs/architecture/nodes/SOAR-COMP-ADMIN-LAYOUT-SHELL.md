---
id: SOAR-COMP-ADMIN-LAYOUT-SHELL
name: "AdminLayoutShell"
type: component
status: verified_local
layer: frontend
module: web-admin
feature: subscriptions-admin
risk_level: medium
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# AdminLayoutShell

| Field | Value |
| --- | --- |
| Description | Admin layout shell for subscriptions/users navigation. |
| File path | apps/web/src/features/admin/layout/AdminLayoutShell.tsx |
| Related files | apps/web/src/features/admin/layout/AdminLayoutShell.test.tsx |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-PAGE-ADMIN-SUBSCRIPTIONS]], [[SOAR-PAGE-ADMIN-USERS]] |
| Used by | [[SOAR-PAGE-ADMIN-ROOT]], [[SOAR-PAGE-ADMIN-SUBSCRIPTIONS]], [[SOAR-PAGE-ADMIN-USERS]] |
| UI related | [[SOAR-PAGE-ADMIN-SUBSCRIPTIONS]], [[SOAR-PAGE-ADMIN-USERS]] |
| API related |  |
| Database related |  |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-WEB]] |
| Docs related | [[SOAR-DOC-WEB-ADMIN]] |
| Agent related |  |
| Notes | Admin shell navigation proof. |

## Relations

- renders_with <- [[SOAR-PAGE-ADMIN-SUBSCRIPTIONS]] (verified_local)
- renders_with <- [[SOAR-PAGE-ADMIN-USERS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
