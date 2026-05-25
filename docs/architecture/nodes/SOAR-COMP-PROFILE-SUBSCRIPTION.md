---
id: SOAR-COMP-PROFILE-SUBSCRIPTION
name: "Profile Subscription component"
type: component
status: verified_local
layer: frontend
module: web-profile
feature: subscriptions-admin
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# Profile Subscription component

| Field | Value |
| --- | --- |
| Description | Profile subscription panel for current plan visibility and checkout intent creation. |
| File path | apps/web/src/features/profile/components/Subscription.tsx |
| Related files | apps/web/src/features/profile/components/Subscription.test.tsx |
| Parent | [[SOAR-PAGE-PROFILE]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-PROFILE-SUBSCRIPTION]] |
| Used by | [[SOAR-PAGE-PROFILE]] |
| UI related | [[SOAR-PAGE-PROFILE]] |
| API related | [[SOAR-API-PROFILE-SUBSCRIPTION-GET]], [[SOAR-API-PROFILE-SUBSCRIPTION-CHECKOUT]] |
| Database related | [[SOAR-DB-SUBSCRIPTION-PLAN]], [[SOAR-DB-USER-SUBSCRIPTION]], [[SOAR-DB-PAYMENT-INTENT]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-WEB]] |
| Docs related | [[SOAR-DOC-API-SUBSCRIPTIONS]] |
| Agent related |  |
| Notes | Profile-facing subscription surface. |

## Relations

- calls -> [[SOAR-SERVICE-WEB-PROFILE-SUBSCRIPTION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
