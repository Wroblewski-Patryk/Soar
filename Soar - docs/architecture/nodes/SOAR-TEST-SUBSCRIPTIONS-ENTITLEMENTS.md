---
id: SOAR-TEST-SUBSCRIPTIONS-ENTITLEMENTS
name: "Subscription entitlement tests"
type: test
status: verified_local
layer: testing
module: api-subscriptions
feature: subscriptions-admin
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Subscription entitlement tests

| Field | Value |
| --- | --- |
| Description | Subscription entitlement and bot guard tests. |
| File path | apps/api/src/modules/subscriptions/subscriptionEntitlements.service.test.ts |
| Related files | apps/api/src/modules/bots/bots.subscription-entitlements.e2e.test.ts |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-SUBSCRIPTION-ENTITLEMENTS]], [[SOAR-FEATURE-BOT-SETUP]] |
| Used by | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]], [[SOAR-FEATURE-BOT-SETUP]] |
| UI related |  |
| API related | [[SOAR-API-BOT-CREATE]], [[SOAR-API-BOT-UPDATE]] |
| Database related | [[SOAR-DB-SUBSCRIPTION-PLAN]], [[SOAR-DB-USER-SUBSCRIPTION]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-API-SUBSCRIPTIONS]] |
| Agent related |  |
| Notes | Entitlement guard proof. |

## Relations

- verified_by <- [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
