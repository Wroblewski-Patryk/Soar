---
id: SOAR-API-PROFILE-SUBSCRIPTION-GET
name: "GET /dashboard/profile/subscription"
type: api_route
status: verified_local
layer: backend
module: api-profile
feature: subscriptions-admin
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# GET /dashboard/profile/subscription

| Field | Value |
| --- | --- |
| Description | Authenticated current subscription read endpoint. |
| File path | apps/api/src/modules/profile/subscription/subscription.routes.ts |
| Related files | apps/api/src/modules/profile/subscription/subscription.controller.ts, apps/api/src/modules/profile/subscription/subscription.service.ts |
| Parent | [[SOAR-FEATURE-SUBSCRIPTIONS-ADMIN]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-PROFILE-SUBSCRIPTION]], [[SOAR-SERVICE-PROFILE-SUBSCRIPTION]] |
| Used by | [[SOAR-SERVICE-WEB-PROFILE-SUBSCRIPTION]] |
| UI related |  |
| API related | [[SOAR-CONTROLLER-PROFILE-SUBSCRIPTION]] |
| Database related | [[SOAR-DB-SUBSCRIPTION-PLAN]], [[SOAR-DB-USER-SUBSCRIPTION]] |
| Tests related | [[SOAR-TEST-SUBSCRIPTIONS-ADMIN-API]] |
| Docs related | [[SOAR-DOC-API-SUBSCRIPTIONS]] |
| Agent related |  |
| Notes | Profile subscription read route. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-PROFILE-SUBSCRIPTION]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-PROFILE-SUBSCRIPTION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
