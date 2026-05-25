---
id: SOAR-PAGE-ADMIN-ROOT
name: "Admin root redirect"
type: page
status: verified_local
layer: frontend
module: web-admin
feature: subscriptions-admin
risk_level: medium
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, page, frontend, verified_local]
---

# Admin root redirect

| Field | Value |
| --- | --- |
| Description | Admin root route redirecting to subscription plan management. |
| File path | apps/web/src/app/admin/page.tsx |
| Related files | apps/web/src/app/admin/layout.tsx |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-PAGE-ADMIN-SUBSCRIPTIONS]], [[SOAR-COMP-ADMIN-LAYOUT-SHELL]] |
| Used by | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| UI related | [[SOAR-COMP-ADMIN-LAYOUT-SHELL]] |
| API related | [[SOAR-API-ADMIN-SUBSCRIPTION-PLANS-LIST]] |
| Database related | [[SOAR-DB-SUBSCRIPTION-PLAN]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-WEB]] |
| Docs related | [[SOAR-DOC-WEB-ADMIN]] |
| Agent related |  |
| Notes | Admin index redirects to subscriptions. |

## Relations

- redirects_to -> [[SOAR-PAGE-ADMIN-SUBSCRIPTIONS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
