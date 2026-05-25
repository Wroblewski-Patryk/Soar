---
id: SOAR-SERVICE-WEB-PROFILE-SUBSCRIPTION
name: "Web profile subscription service"
type: service
status: verified_local
layer: frontend
module: web-profile
feature: subscriptions-admin
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, frontend, verified_local]
---

# Web profile subscription service

| Field | Value |
| --- | --- |
| Description | Typed frontend API service for profile subscription read and checkout-intent calls. |
| File path | apps/web/src/features/profile/services/subscription.service.ts |
| Related files | apps/web/src/features/profile/types/subscription.type.ts |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-API-PROFILE-SUBSCRIPTION-GET]], [[SOAR-API-PROFILE-SUBSCRIPTION-CHECKOUT]] |
| Used by | [[SOAR-COMP-PROFILE-SUBSCRIPTION]] |
| UI related | [[SOAR-COMP-PROFILE-SUBSCRIPTION]] |
| API related | [[SOAR-API-PROFILE-SUBSCRIPTION-GET]], [[SOAR-API-PROFILE-SUBSCRIPTION-CHECKOUT]] |
| Database related | [[SOAR-DB-SUBSCRIPTION-PLAN]], [[SOAR-DB-USER-SUBSCRIPTION]], [[SOAR-DB-PAYMENT-INTENT]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-WEB]] |
| Docs related | [[SOAR-DOC-API-SUBSCRIPTIONS]] |
| Agent related |  |
| Notes | Frontend-to-profile-subscription API contract node. |

## Relations

- calls -> [[SOAR-API-PROFILE-SUBSCRIPTION-GET]] (verified_local)
- calls -> [[SOAR-API-PROFILE-SUBSCRIPTION-CHECKOUT]] (verified_local)
- calls <- [[SOAR-COMP-PROFILE-SUBSCRIPTION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
