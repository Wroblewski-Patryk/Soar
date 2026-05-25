---
id: SOAR-TEST-SUBSCRIPTIONS-ADMIN-WEB
name: "Subscriptions/Admin Web tests"
type: test
status: verified_local
layer: testing
module: web-admin
feature: subscriptions-admin
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Subscriptions/Admin Web tests

| Field | Value |
| --- | --- |
| Description | Admin subscriptions/users layout and profile subscription Web tests. |
| File path | apps/web/src/features/admin/subscriptions/pages/AdminSubscriptionsPage.test.tsx |
| Related files | apps/web/src/features/admin/users/pages/AdminUsersPage.test.tsx, apps/web/src/features/admin/layout/AdminLayoutShell.test.tsx, apps/web/src/features/profile/components/Subscription.test.tsx |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-COMP-ADMIN-SUBSCRIPTIONS-PAGE]], [[SOAR-COMP-ADMIN-USERS-PAGE]], [[SOAR-COMP-ADMIN-LAYOUT-SHELL]], [[SOAR-COMP-PROFILE-SUBSCRIPTION]] |
| Used by | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| UI related | [[SOAR-PAGE-ADMIN-SUBSCRIPTIONS]], [[SOAR-PAGE-ADMIN-USERS]], [[SOAR-PAGE-PROFILE]] |
| API related | [[SOAR-API-ADMIN-USERS-LIST]], [[SOAR-API-ADMIN-SUBSCRIPTION-PLANS-LIST]], [[SOAR-API-PROFILE-SUBSCRIPTION-GET]] |
| Database related | [[SOAR-DB-SUBSCRIPTION-PLAN]], [[SOAR-DB-USER-SUBSCRIPTION]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-WEB-ADMIN]] |
| Agent related |  |
| Notes | Primary frontend admin/subscription proof. |

## Relations

- verifies -> [[SOAR-COMP-ADMIN-SUBSCRIPTIONS-PAGE]] (verified_local)
- verified_by <- [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
