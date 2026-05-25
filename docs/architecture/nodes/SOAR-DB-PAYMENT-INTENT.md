---
id: SOAR-DB-PAYMENT-INTENT
name: "PaymentIntent model"
type: database_model
status: verified_local
layer: data
module: subscriptions
feature: subscriptions-admin
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, database_model, data, verified_local]
---

# PaymentIntent model

| Field | Value |
| --- | --- |
| Description | PaymentIntent model for checkout intent lifecycle and provider references. |
| File path | apps/api/prisma/schema.prisma |
| Related files |  |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-DB-USER]], [[SOAR-DB-SUBSCRIPTION-PLAN]], [[SOAR-DB-USER-SUBSCRIPTION]] |
| Used by | [[SOAR-SERVICE-PAYMENT-CHECKOUT]] |
| UI related | [[SOAR-COMP-PROFILE-SUBSCRIPTION]] |
| API related | [[SOAR-API-PROFILE-SUBSCRIPTION-CHECKOUT]] |
| Database related | [[SOAR-DB-SUBSCRIPTION-PLAN]], [[SOAR-DB-USER-SUBSCRIPTION]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-API]] |
| Docs related | [[SOAR-DOC-DATA-MODEL]] |
| Agent related |  |
| Notes | Checkout intent persistence. |

## Relations

- writes <- [[SOAR-SERVICE-PAYMENT-CHECKOUT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
