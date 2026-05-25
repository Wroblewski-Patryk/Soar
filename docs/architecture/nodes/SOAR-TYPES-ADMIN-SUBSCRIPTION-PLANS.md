---
id: SOAR-TYPES-ADMIN-SUBSCRIPTION-PLANS
name: "Admin subscription plan DTO schemas"
type: validation
status: verified_local
layer: backend
module: api-admin
feature: subscriptions-admin
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, validation, backend, verified_local]
---

# Admin subscription plan DTO schemas

| Field | Value |
| --- | --- |
| Description | Admin subscription plan code and update schemas with entitlement validation. |
| File path | apps/api/src/modules/admin/subscriptionPlans/subscriptionPlans.types.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-SUBSCRIPTION-ENTITLEMENTS]] |
| Used by | [[SOAR-CONTROLLER-ADMIN-SUBSCRIPTION-PLANS]] |
| UI related |  |
| API related | [[SOAR-API-ADMIN-SUBSCRIPTION-PLAN-UPDATE]] |
| Database related | [[SOAR-DB-SUBSCRIPTION-PLAN]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-API]] |
| Docs related | [[SOAR-DOC-API-ADMIN]] |
| Agent related |  |
| Notes | Admin plan validation boundary. |

## Relations

- depends_on -> [[SOAR-SERVICE-SUBSCRIPTION-ENTITLEMENTS]] (verified_local)
- validates_with <- [[SOAR-CONTROLLER-ADMIN-SUBSCRIPTION-PLANS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
