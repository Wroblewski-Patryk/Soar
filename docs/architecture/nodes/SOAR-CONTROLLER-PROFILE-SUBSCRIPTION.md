---
id: SOAR-CONTROLLER-PROFILE-SUBSCRIPTION
name: "Profile subscription controller"
type: controller
status: verified_local
layer: backend
module: api-profile
feature: subscriptions-admin
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, controller, backend, verified_local]
---

# Profile subscription controller

| Field | Value |
| --- | --- |
| Description | Profile subscription controller for current subscription and checkout intent reads. |
| File path | apps/api/src/modules/profile/subscription/subscription.controller.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-PROFILE-SUBSCRIPTION]], [[SOAR-SERVICE-PAYMENT-CHECKOUT]] |
| Used by | [[SOAR-API-PROFILE-SUBSCRIPTION-GET]], [[SOAR-API-PROFILE-SUBSCRIPTION-CHECKOUT]] |
| UI related |  |
| API related | [[SOAR-API-PROFILE-SUBSCRIPTION-GET]], [[SOAR-API-PROFILE-SUBSCRIPTION-CHECKOUT]] |
| Database related | [[SOAR-DB-SUBSCRIPTION-PLAN]], [[SOAR-DB-USER-SUBSCRIPTION]], [[SOAR-DB-PAYMENT-INTENT]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-API]] |
| Docs related | [[SOAR-DOC-API-SUBSCRIPTIONS]] |
| Agent related |  |
| Notes | Profile subscription controller boundary. |

## Relations

- calls -> [[SOAR-SERVICE-PROFILE-SUBSCRIPTION]] (verified_local)
- calls -> [[SOAR-SERVICE-PAYMENT-CHECKOUT]] (verified_local)
- routes_to <- [[SOAR-API-PROFILE-SUBSCRIPTION-GET]] (verified_local)
- routes_to <- [[SOAR-API-PROFILE-SUBSCRIPTION-CHECKOUT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
