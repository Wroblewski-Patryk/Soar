---
id: SOAR-FEATURE-SUBSCRIPTIONS-ADMIN
name: "Subscriptions and Admin feature"
type: feature
status: verified_local
layer: fullstack
module: subscriptions
feature: subscriptions-admin
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, feature, fullstack, verified_local]
---

# Subscriptions and Admin feature

| Field | Value |
| --- | --- |
| Description | Subscription catalog entitlement checkout and admin user/plan management feature. |
| File path | docs/modules/api-subscriptions.md |
| Related files | docs/modules/api-admin.md, docs/modules/web-admin.md |
| Parent |  |
| Children | [[SOAR-PAGE-ADMIN-SUBSCRIPTIONS]], [[SOAR-PAGE-ADMIN-USERS]], [[SOAR-COMP-PROFILE-SUBSCRIPTION]], [[SOAR-API-ADMIN-USERS-LIST]], [[SOAR-API-ADMIN-SUBSCRIPTION-PLANS-LIST]], [[SOAR-SERVICE-SUBSCRIPTIONS]], [[SOAR-SERVICE-SUBSCRIPTION-ENTITLEMENTS]] |
| Depends on | [[SOAR-FEATURE-AUTH-SESSION]], [[SOAR-DB-USER]] |
| Used by | [[SOAR-FEATURE-BOT-SETUP]], [[SOAR-FEATURE-PROFILE-API-KEYS]] |
| UI related | [[SOAR-PAGE-ADMIN-SUBSCRIPTIONS]], [[SOAR-PAGE-ADMIN-USERS]], [[SOAR-COMP-PROFILE-SUBSCRIPTION]] |
| API related | [[SOAR-API-ADMIN-USERS-LIST]], [[SOAR-API-ADMIN-USERS-UPDATE]], [[SOAR-API-ADMIN-SUBSCRIPTION-PLANS-LIST]], [[SOAR-API-ADMIN-SUBSCRIPTION-PLAN-UPDATE]], [[SOAR-API-PROFILE-SUBSCRIPTION-GET]], [[SOAR-API-PROFILE-SUBSCRIPTION-CHECKOUT]] |
| Database related | [[SOAR-DB-SUBSCRIPTION-PLAN]], [[SOAR-DB-USER-SUBSCRIPTION]], [[SOAR-DB-PAYMENT-INTENT]], [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-API]], [[SOAR-TEST-SUBSCRIPTIONS-ENTITLEMENTS]], [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-WEB]] |
| Docs related | [[SOAR-DOC-API-SUBSCRIPTIONS]], [[SOAR-DOC-API-ADMIN]], [[SOAR-DOC-WEB-ADMIN]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Dedicated Admin/Subscriptions chain backfilled across admin/profile UI API routes controllers schemas services DB tests and docs. |

## Relations

- has_entrypoint -> [[SOAR-PAGE-ADMIN-SUBSCRIPTIONS]] (verified_local)
- has_entrypoint -> [[SOAR-PAGE-ADMIN-USERS]] (verified_local)
- verified_by -> [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-API]] (verified_local)
- verified_by -> [[SOAR-TEST-SUBSCRIPTIONS-ENTITLEMENTS]] (verified_local)
- verified_by -> [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-WEB]] (verified_local)
- documented_by -> [[SOAR-DOC-API-ADMIN]] (verified_local)
- documented_by -> [[SOAR-DOC-API-SUBSCRIPTIONS]] (verified_local)
- documented_by -> [[SOAR-DOC-WEB-ADMIN]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
