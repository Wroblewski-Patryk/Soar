---
id: SOAR-SERVICE-PROFILE-SUBSCRIPTION
name: "Profile subscription service"
type: service
status: verified_local
layer: backend
module: api-profile
feature: subscriptions-admin
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Profile subscription service

| Field | Value |
| --- | --- |
| Description | Profile subscription read service for current plan and active assignment state. |
| File path | apps/api/src/modules/profile/subscription/subscription.service.ts |
| Related files | apps/api/src/modules/profile/subscription/subscription.types.ts |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-SUBSCRIPTIONS]], [[SOAR-DB-SUBSCRIPTION-PLAN]], [[SOAR-DB-USER-SUBSCRIPTION]] |
| Used by | [[SOAR-CONTROLLER-PROFILE-SUBSCRIPTION]] |
| UI related |  |
| API related | [[SOAR-API-PROFILE-SUBSCRIPTION-GET]] |
| Database related | [[SOAR-DB-SUBSCRIPTION-PLAN]], [[SOAR-DB-USER-SUBSCRIPTION]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-API]] |
| Docs related | [[SOAR-DOC-API-SUBSCRIPTIONS]] |
| Agent related |  |
| Notes | Profile subscription read boundary. |

## Relations

- uses -> [[SOAR-SERVICE-SUBSCRIPTIONS]] (verified_local)
- reads -> [[SOAR-DB-USER-SUBSCRIPTION]] (verified_local)
- calls <- [[SOAR-CONTROLLER-PROFILE-SUBSCRIPTION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
