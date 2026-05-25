---
id: SOAR-API-ADMIN-SUBSCRIPTION-PLAN-UPDATE
name: "PUT /admin/subscriptions/plans/:code"
type: api_route
status: verified_local
layer: backend
module: api-admin
feature: subscriptions-admin
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# PUT /admin/subscriptions/plans/:code

| Field | Value |
| --- | --- |
| Description | Admin-only subscription plan update endpoint with entitlement validation. |
| File path | apps/api/src/modules/admin/subscriptionPlans/subscriptionPlans.routes.ts |
| Related files | apps/api/src/modules/admin/subscriptionPlans/subscriptionPlans.controller.ts, apps/api/src/modules/admin/subscriptionPlans/subscriptionPlans.service.ts |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-ADMIN-SUBSCRIPTION-PLANS]], [[SOAR-TYPES-ADMIN-SUBSCRIPTION-PLANS]], [[SOAR-SERVICE-ADMIN-SUBSCRIPTION-PLANS]] |
| Used by | [[SOAR-SERVICE-WEB-ADMIN-SUBSCRIPTIONS]] |
| UI related |  |
| API related | [[SOAR-CONTROLLER-ADMIN-SUBSCRIPTION-PLANS]] |
| Database related | [[SOAR-DB-SUBSCRIPTION-PLAN]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-API]] |
| Docs related | [[SOAR-DOC-API-ADMIN]] |
| Agent related |  |
| Notes | Admin plan update route. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-ADMIN-SUBSCRIPTION-PLANS]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-ADMIN-SUBSCRIPTIONS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
