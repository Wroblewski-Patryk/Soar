---
id: SOAR-SERVICE-SUBSCRIPTION-ENTITLEMENTS
name: "Subscription entitlements service"
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

# Subscription entitlements service

| Field | Value |
| --- | --- |
| Description | Subscription entitlement schema and guard service for bot limits and LIVE trading access. |
| File path | apps/api/src/modules/subscriptions/subscriptionEntitlements.service.ts |
| Related files | apps/api/src/modules/subscriptions/subscriptionEntitlements.service.test.ts |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-DB-SUBSCRIPTION-PLAN]] |
| Used by | [[SOAR-FEATURE-BOT-SETUP]], [[SOAR-FEATURE-MANUAL-ORDER]], [[SOAR-TYPES-ADMIN-SUBSCRIPTION-PLANS]] |
| UI related |  |
| API related | [[SOAR-API-BOT-CREATE]], [[SOAR-API-BOT-UPDATE]] |
| Database related | [[SOAR-DB-SUBSCRIPTION-PLAN]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ENTITLEMENTS]] |
| Docs related | [[SOAR-DOC-API-SUBSCRIPTIONS]] |
| Agent related |  |
| Notes | Entitlement guard consumed by bot and live-trading flows. |

## Relations

- reads -> [[SOAR-DB-SUBSCRIPTION-PLAN]] (verified_local)
- guards -> [[SOAR-FEATURE-BOT-SETUP]] (verified_local)
- depends_on <- [[SOAR-TYPES-ADMIN-SUBSCRIPTION-PLANS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
