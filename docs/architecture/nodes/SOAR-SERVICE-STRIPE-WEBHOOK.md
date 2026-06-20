---
id: SOAR-SERVICE-STRIPE-WEBHOOK
name: "Stripe webhook service"
type: service
status: verified_local
layer: backend
module: api-subscriptions
feature: subscriptions-admin
risk_level: critical
completion_percent: 90
last_verified_at: 2026-06-20
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Stripe webhook service

| Field | Value |
| --- | --- |
| Description | Stripe webhook event processing service for checkout activation expiration subscription lifecycle idempotency and audit logging. |
| File path | apps/api/src/modules/subscriptions/payments/stripeWebhook.service.ts |
| Related files | apps/api/src/modules/subscriptions/payments/stripeWebhook.controller.ts, apps/api/src/modules/subscriptions/payments/stripeWebhook.routes.ts |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-SUBSCRIPTIONS]], [[SOAR-DB-SUBSCRIPTION-PLAN]], [[SOAR-DB-USER-SUBSCRIPTION]], [[SOAR-DB-PAYMENT-INTENT]] |
| Used by | [[SOAR-API-STRIPE-WEBHOOK]] |
| UI related |  |
| API related | [[SOAR-API-STRIPE-WEBHOOK]] |
| Database related | [[SOAR-DB-SUBSCRIPTION-PLAN]], [[SOAR-DB-USER-SUBSCRIPTION]], [[SOAR-DB-PAYMENT-INTENT]] |
| Tests related | [[SOAR-TEST-STRIPE-WEBHOOK]] |
| Docs related | [[SOAR-DOC-API-SUBSCRIPTIONS]] |
| Agent related |  |
| Notes | LUC-4945 source registry repair for stripeWebhook service graph coverage after LUC-4939 drift. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
