---
id: SOAR-TEST-STRIPE-WEBHOOK
name: "Stripe webhook e2e tests"
type: test
status: verified_local
layer: testing
module: api-subscriptions
feature: subscriptions-admin
risk_level: critical
completion_percent: 90
last_verified_at: 2026-06-20
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Stripe webhook e2e tests

| Field | Value |
| --- | --- |
| Description | DB-backed Stripe webhook proof for checkout activation replay fail-closed and subscription lifecycle reconciliation. |
| File path | apps/api/src/modules/subscriptions/payments/stripeWebhook.e2e.test.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-API-STRIPE-WEBHOOK]], [[SOAR-SERVICE-STRIPE-WEBHOOK]] |
| Used by | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| UI related |  |
| API related | [[SOAR-API-STRIPE-WEBHOOK]], [[SOAR-SERVICE-STRIPE-WEBHOOK]] |
| Database related | [[SOAR-DB-SUBSCRIPTION-PLAN]], [[SOAR-DB-USER-SUBSCRIPTION]], [[SOAR-DB-PAYMENT-INTENT]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-API-SUBSCRIPTIONS]] |
| Agent related |  |
| Notes | LUC-4945 source registry repair tying existing stripeWebhook.e2e.test.ts proof into graph coverage. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
