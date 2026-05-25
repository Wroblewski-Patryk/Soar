---
id: SOAR-API-PROFILE-SUBSCRIPTION-CHECKOUT
name: "POST /dashboard/profile/subscription/checkout-intents"
type: api_route
status: verified_local
layer: backend
module: api-profile
feature: subscriptions-admin
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# POST /dashboard/profile/subscription/checkout-intents

| Field | Value |
| --- | --- |
| Description | Authenticated subscription checkout intent endpoint. |
| File path | apps/api/src/modules/profile/subscription/subscription.routes.ts |
| Related files | apps/api/src/modules/profile/subscription/subscription.controller.ts, apps/api/src/modules/subscriptions/payments/paymentCheckout.service.ts |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-PROFILE-SUBSCRIPTION]], [[SOAR-SERVICE-PAYMENT-CHECKOUT]] |
| Used by | [[SOAR-SERVICE-WEB-PROFILE-SUBSCRIPTION]] |
| UI related |  |
| API related | [[SOAR-CONTROLLER-PROFILE-SUBSCRIPTION]] |
| Database related | [[SOAR-DB-SUBSCRIPTION-PLAN]], [[SOAR-DB-USER-SUBSCRIPTION]], [[SOAR-DB-PAYMENT-INTENT]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-API]] |
| Docs related | [[SOAR-DOC-API-SUBSCRIPTIONS]] |
| Agent related |  |
| Notes | Profile checkout intent route. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-PROFILE-SUBSCRIPTION]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-PROFILE-SUBSCRIPTION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
