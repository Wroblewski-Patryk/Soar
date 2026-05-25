---
id: SOAR-PAGE-ADMIN-SUBSCRIPTIONS
name: "Admin subscriptions page"
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

# Admin subscriptions page

| Field | Value |
| --- | --- |
| Description | Admin subscription plan management route. |
| File path | apps/web/src/app/admin/subscriptions/page.tsx |
| Related files | apps/web/src/features/admin/subscriptions/pages/AdminSubscriptionsPage.tsx |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-COMP-ADMIN-SUBSCRIPTIONS-PAGE]] |
| Used by | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| UI related | [[SOAR-COMP-ADMIN-SUBSCRIPTIONS-PAGE]] |
| API related | [[SOAR-API-ADMIN-SUBSCRIPTION-PLANS-LIST]], [[SOAR-API-ADMIN-SUBSCRIPTION-PLAN-UPDATE]] |
| Database related | [[SOAR-DB-SUBSCRIPTION-PLAN]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-WEB]] |
| Docs related | [[SOAR-DOC-WEB-ADMIN]] |
| Agent related |  |
| Notes | Admin plan catalog UI. |

## Relations

- renders_with -> [[SOAR-COMP-ADMIN-LAYOUT-SHELL]] (verified_local)
- renders -> [[SOAR-COMP-ADMIN-SUBSCRIPTIONS-PAGE]] (verified_local)
- has_entrypoint <- [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] (verified_local)
- redirects_to <- [[SOAR-PAGE-ADMIN-ROOT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
