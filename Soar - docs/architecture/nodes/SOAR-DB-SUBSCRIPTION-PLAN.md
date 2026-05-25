---
id: SOAR-DB-SUBSCRIPTION-PLAN
name: "SubscriptionPlan model"
type: database_model
status: verified_local
layer: data
module: subscriptions
feature: subscriptions-admin
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, database_model, data, verified_local]
---

# SubscriptionPlan model

| Field | Value |
| --- | --- |
| Description | SubscriptionPlan model for plan catalog price limits features and entitlement JSON. |
| File path | apps/api/prisma/schema.prisma |
| Related files |  |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-DOC-DATA-MODEL]] |
| Used by | [[SOAR-SERVICE-SUBSCRIPTIONS]], [[SOAR-SERVICE-SUBSCRIPTION-ENTITLEMENTS]], [[SOAR-SERVICE-ADMIN-SUBSCRIPTION-PLANS]], [[SOAR-SERVICE-ADMIN-USERS]] |
| UI related | [[SOAR-COMP-ADMIN-SUBSCRIPTIONS-PAGE]], [[SOAR-COMP-PROFILE-SUBSCRIPTION]] |
| API related | [[SOAR-API-ADMIN-SUBSCRIPTION-PLANS-LIST]], [[SOAR-API-PROFILE-SUBSCRIPTION-GET]] |
| Database related | [[SOAR-DB-USER-SUBSCRIPTION]], [[SOAR-DB-PAYMENT-INTENT]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-API]], [[SOAR-TEST-SUBSCRIPTIONS-ENTITLEMENTS]] |
| Docs related | [[SOAR-DOC-DATA-MODEL]] |
| Agent related |  |
| Notes | Plan catalog persistence. |

## Relations

- reads_writes <- [[SOAR-SERVICE-ADMIN-SUBSCRIPTION-PLANS]] (verified_local)
- reads_writes <- [[SOAR-SERVICE-SUBSCRIPTIONS]] (verified_local)
- reads <- [[SOAR-SERVICE-SUBSCRIPTION-ENTITLEMENTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
