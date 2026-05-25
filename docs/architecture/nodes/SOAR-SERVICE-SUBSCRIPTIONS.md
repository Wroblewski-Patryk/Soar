---
id: SOAR-SERVICE-SUBSCRIPTIONS
name: "Subscriptions service"
type: service
status: verified_local
layer: backend
module: api-subscriptions
feature: subscriptions-admin
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Subscriptions service

| Field | Value |
| --- | --- |
| Description | Subscription catalog bootstrap default assignment and active subscription assignment service. |
| File path | apps/api/src/modules/subscriptions/subscriptions.service.ts |
| Related files | apps/api/src/modules/subscriptions/subscriptions.errors.ts |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-DB-SUBSCRIPTION-PLAN]], [[SOAR-DB-USER-SUBSCRIPTION]], [[SOAR-DB-USER]] |
| Used by | [[SOAR-SERVICE-ADMIN-USERS]], [[SOAR-SERVICE-ADMIN-SUBSCRIPTION-PLANS]], [[SOAR-SERVICE-PROFILE-SUBSCRIPTION]], [[SOAR-SERVICE-PAYMENT-CHECKOUT]] |
| UI related |  |
| API related | [[SOAR-API-ADMIN-USERS-UPDATE]], [[SOAR-API-PROFILE-SUBSCRIPTION-GET]] |
| Database related | [[SOAR-DB-SUBSCRIPTION-PLAN]], [[SOAR-DB-USER-SUBSCRIPTION]], [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-API]], [[SOAR-TEST-SUBSCRIPTIONS-ENTITLEMENTS]] |
| Docs related | [[SOAR-DOC-API-SUBSCRIPTIONS]] |
| Agent related |  |
| Notes | Catalog and assignment source of truth. |

## Relations

- reads_writes -> [[SOAR-DB-SUBSCRIPTION-PLAN]] (verified_local)
- reads_writes -> [[SOAR-DB-USER-SUBSCRIPTION]] (verified_local)
- uses <- [[SOAR-SERVICE-ADMIN-SUBSCRIPTION-PLANS]] (verified_local)
- uses <- [[SOAR-SERVICE-ADMIN-USERS]] (verified_local)
- uses <- [[SOAR-SERVICE-PROFILE-SUBSCRIPTION]] (verified_local)
- uses <- [[SOAR-SERVICE-PAYMENT-CHECKOUT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
