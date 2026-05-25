---
id: SOAR-CONTROLLER-ADMIN-SUBSCRIPTION-PLANS
name: "Admin subscription plans controller"
type: controller
status: verified_local
layer: backend
module: api-admin
feature: subscriptions-admin
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, controller, backend, verified_local]
---

# Admin subscription plans controller

| Field | Value |
| --- | --- |
| Description | Admin subscription plan controller for plan catalog read and updates. |
| File path | apps/api/src/modules/admin/subscriptionPlans/subscriptionPlans.controller.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-TYPES-ADMIN-SUBSCRIPTION-PLANS]], [[SOAR-SERVICE-ADMIN-SUBSCRIPTION-PLANS]] |
| Used by | [[SOAR-API-ADMIN-SUBSCRIPTION-PLANS-LIST]], [[SOAR-API-ADMIN-SUBSCRIPTION-PLAN-UPDATE]] |
| UI related |  |
| API related | [[SOAR-API-ADMIN-SUBSCRIPTION-PLANS-LIST]], [[SOAR-API-ADMIN-SUBSCRIPTION-PLAN-UPDATE]] |
| Database related | [[SOAR-DB-SUBSCRIPTION-PLAN]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-API]] |
| Docs related | [[SOAR-DOC-API-ADMIN]] |
| Agent related |  |
| Notes | Controller maps admin plan management requests. |

## Relations

- validates_with -> [[SOAR-TYPES-ADMIN-SUBSCRIPTION-PLANS]] (verified_local)
- calls -> [[SOAR-SERVICE-ADMIN-SUBSCRIPTION-PLANS]] (verified_local)
- routes_to <- [[SOAR-API-ADMIN-SUBSCRIPTION-PLANS-LIST]] (verified_local)
- routes_to <- [[SOAR-API-ADMIN-SUBSCRIPTION-PLAN-UPDATE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
