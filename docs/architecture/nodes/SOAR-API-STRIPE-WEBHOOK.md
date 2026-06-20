---
id: SOAR-API-STRIPE-WEBHOOK
name: "POST /webhooks/stripe"
type: api_route
status: verified_local
layer: backend
module: api-subscriptions
feature: subscriptions-admin
risk_level: critical
completion_percent: 90
last_verified_at: 2026-06-20
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# POST /webhooks/stripe

| Field | Value |
| --- | --- |
| Description | Stripe webhook endpoint for checkout and subscription lifecycle reconciliation. |
| File path | apps/api/src/modules/subscriptions/payments/stripeWebhook.routes.ts |
| Related files | apps/api/src/modules/subscriptions/payments/stripeWebhook.controller.ts, apps/api/src/modules/subscriptions/payments/stripeWebhook.service.ts |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-STRIPE-WEBHOOK]], [[SOAR-SERVICE-SUBSCRIPTIONS]], [[SOAR-DB-PAYMENT-INTENT]] |
| Used by | [[SOAR-ROUTER-API-ROOT]] |
| UI related |  |
| API related | [[SOAR-SERVICE-STRIPE-WEBHOOK]] |
| Database related | [[SOAR-DB-SUBSCRIPTION-PLAN]], [[SOAR-DB-USER-SUBSCRIPTION]], [[SOAR-DB-PAYMENT-INTENT]] |
| Tests related | [[SOAR-TEST-STRIPE-WEBHOOK]] |
| Docs related | [[SOAR-DOC-API-SUBSCRIPTIONS]] |
| Agent related |  |
| Notes | LUC-4945 source registry repair for stripeWebhook route graph coverage after LUC-4939 drift. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
