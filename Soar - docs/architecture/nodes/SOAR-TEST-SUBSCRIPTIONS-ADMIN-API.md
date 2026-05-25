---
id: SOAR-TEST-SUBSCRIPTIONS-ADMIN-API
name: "Subscriptions/Admin API tests"
type: test
status: verified_local
layer: testing
module: api-admin
feature: subscriptions-admin
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Subscriptions/Admin API tests

| Field | Value |
| --- | --- |
| Description | Admin users plan profile subscription checkout and admin access tests. |
| File path | apps/api/src/modules/admin/users/users.e2e.test.ts |
| Related files | apps/api/src/modules/admin/subscriptionPlans/subscriptionPlans.e2e.test.ts, apps/api/src/modules/profile/subscription/subscription.e2e.test.ts |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-API-ADMIN-USERS-LIST]], [[SOAR-API-ADMIN-USERS-UPDATE]], [[SOAR-API-ADMIN-SUBSCRIPTION-PLANS-LIST]], [[SOAR-API-ADMIN-SUBSCRIPTION-PLAN-UPDATE]], [[SOAR-API-PROFILE-SUBSCRIPTION-GET]], [[SOAR-API-PROFILE-SUBSCRIPTION-CHECKOUT]], [[SOAR-SERVICE-SUBSCRIPTIONS]] |
| Used by | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| UI related |  |
| API related | [[SOAR-API-ADMIN-USERS-LIST]], [[SOAR-API-ADMIN-SUBSCRIPTION-PLANS-LIST]], [[SOAR-API-PROFILE-SUBSCRIPTION-GET]] |
| Database related | [[SOAR-DB-SUBSCRIPTION-PLAN]], [[SOAR-DB-USER-SUBSCRIPTION]], [[SOAR-DB-PAYMENT-INTENT]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-API-ADMIN]], [[SOAR-DOC-API-SUBSCRIPTIONS]] |
| Agent related |  |
| Notes | Primary backend admin/subscription proof. |

## Relations

- verifies -> [[SOAR-SERVICE-ADMIN-USERS]] (verified_local)
- verified_by <- [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
