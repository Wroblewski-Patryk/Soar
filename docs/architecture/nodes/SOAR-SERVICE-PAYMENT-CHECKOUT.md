---
id: SOAR-SERVICE-PAYMENT-CHECKOUT
name: "Subscription checkout service"
type: service
status: verified_local
layer: backend
module: api-subscriptions
feature: subscriptions-admin
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Subscription checkout service

| Field | Value |
| --- | --- |
| Description | Payment checkout intent orchestration service with provider registry/manual/Stripe boundaries. |
| File path | apps/api/src/modules/subscriptions/payments/paymentCheckout.service.ts |
| Related files | apps/api/src/modules/subscriptions/payments/paymentGateway.registry.ts, apps/api/src/modules/subscriptions/payments/manualPaymentGateway.provider.ts, apps/api/src/modules/subscriptions/payments/stripePaymentGateway.provider.ts |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-SUBSCRIPTIONS]], [[SOAR-DB-SUBSCRIPTION-PLAN]], [[SOAR-DB-USER-SUBSCRIPTION]], [[SOAR-DB-PAYMENT-INTENT]] |
| Used by | [[SOAR-CONTROLLER-PROFILE-SUBSCRIPTION]] |
| UI related |  |
| API related | [[SOAR-API-PROFILE-SUBSCRIPTION-CHECKOUT]] |
| Database related | [[SOAR-DB-SUBSCRIPTION-PLAN]], [[SOAR-DB-USER-SUBSCRIPTION]], [[SOAR-DB-PAYMENT-INTENT]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-API]] |
| Docs related | [[SOAR-DOC-API-SUBSCRIPTIONS]] |
| Agent related |  |
| Notes | Checkout foundation; webhook activation remains future scope. |

## Relations

- uses -> [[SOAR-SERVICE-SUBSCRIPTIONS]] (verified_local)
- writes -> [[SOAR-DB-PAYMENT-INTENT]] (verified_local)
- calls <- [[SOAR-CONTROLLER-PROFILE-SUBSCRIPTION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
