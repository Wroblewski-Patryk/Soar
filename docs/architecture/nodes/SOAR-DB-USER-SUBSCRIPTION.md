---
id: SOAR-DB-USER-SUBSCRIPTION
name: "UserSubscription model"
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

# UserSubscription model

| Field | Value |
| --- | --- |
| Description | UserSubscription model for active user plan assignments and source metadata. |
| File path | apps/api/prisma/schema.prisma |
| Related files |  |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-DB-USER]], [[SOAR-DB-SUBSCRIPTION-PLAN]] |
| Used by | [[SOAR-SERVICE-SUBSCRIPTIONS]], [[SOAR-SERVICE-ADMIN-USERS]], [[SOAR-SERVICE-PROFILE-SUBSCRIPTION]] |
| UI related | [[SOAR-COMP-ADMIN-USERS-PAGE]], [[SOAR-COMP-PROFILE-SUBSCRIPTION]] |
| API related | [[SOAR-API-ADMIN-USERS-LIST]], [[SOAR-API-PROFILE-SUBSCRIPTION-GET]] |
| Database related | [[SOAR-DB-SUBSCRIPTION-PLAN]], [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-API]] |
| Docs related | [[SOAR-DOC-DATA-MODEL]] |
| Agent related |  |
| Notes | User plan assignment persistence. |

## Relations

- reads_writes <- [[SOAR-SERVICE-ADMIN-USERS]] (verified_local)
- reads <- [[SOAR-SERVICE-PROFILE-SUBSCRIPTION]] (verified_local)
- reads_writes <- [[SOAR-SERVICE-SUBSCRIPTIONS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
