---
id: SOAR-COMP-ADMIN-SUBSCRIPTIONS-PAGE
name: "AdminSubscriptionsPage"
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

# AdminSubscriptionsPage

| Field | Value |
| --- | --- |
| Description | Admin page for reading and updating subscription plan pricing entitlements and active status. |
| File path | apps/web/src/features/admin/subscriptions/pages/AdminSubscriptionsPage.tsx |
| Related files | apps/web/src/features/admin/subscriptions/pages/AdminSubscriptionsPage.test.tsx |
| Parent | [[SOAR-PAGE-ADMIN-SUBSCRIPTIONS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-ADMIN-SUBSCRIPTIONS]] |
| Used by | [[SOAR-PAGE-ADMIN-SUBSCRIPTIONS]] |
| UI related | [[SOAR-PAGE-ADMIN-SUBSCRIPTIONS]] |
| API related | [[SOAR-API-ADMIN-SUBSCRIPTION-PLANS-LIST]], [[SOAR-API-ADMIN-SUBSCRIPTION-PLAN-UPDATE]] |
| Database related | [[SOAR-DB-SUBSCRIPTION-PLAN]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-WEB]] |
| Docs related | [[SOAR-DOC-WEB-ADMIN]] |
| Agent related |  |
| Notes | Component owns plan list edit and action-error states. |

## Relations

- calls -> [[SOAR-SERVICE-WEB-ADMIN-SUBSCRIPTIONS]] (verified_local)
- renders <- [[SOAR-PAGE-ADMIN-SUBSCRIPTIONS]] (verified_local)
- verifies <- [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-WEB]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
