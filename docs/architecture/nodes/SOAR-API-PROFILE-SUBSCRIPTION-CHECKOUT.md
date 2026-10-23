---
id: SOAR-API-PROFILE-SUBSCRIPTION-CHECKOUT
name: "POST /dashboard/profile/subscription/checkout-intents"
type: api_route
status: deprecated
layer: backend
module: api-profile
feature: subscriptions-admin
risk_level: high
completion_percent: 0
last_verified_at: 2026-10-19
verification_status: deprecated
tags: [soar-map, api_route, backend, deprecated]
---

# POST /dashboard/profile/subscription/checkout-intents

| Field | Value |
| --- | --- |
| Description | Retired checkout-intent route; POST now returns 404. |
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
| Notes | Historical route record; no current checkout endpoint. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-PROFILE-SUBSCRIPTION]] (deprecated)
- calls <- [[SOAR-SERVICE-WEB-PROFILE-SUBSCRIPTION]] (deprecated)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
