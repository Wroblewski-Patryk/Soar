---
id: SOAR-CONTROLLER-PROFILE-BASIC
name: "Profile basic controller"
type: controller
status: verified_local
layer: backend
module: api-profile
feature: api-support-routes
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, controller, backend, verified_local]
---

# Profile basic controller

| Field | Value |
| --- | --- |
| Description | Profile basic controller for read update and delete account behavior. |
| File path | apps/api/src/modules/profile/basic/basic.controller.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-TYPES-PROFILE-BASIC]], [[SOAR-SERVICE-PROFILE-BASIC]] |
| Used by | [[SOAR-API-PROFILE-BASIC-GET]], [[SOAR-API-PROFILE-BASIC-UPDATE]], [[SOAR-API-PROFILE-BASIC-DELETE]] |
| UI related |  |
| API related | [[SOAR-API-PROFILE-BASIC-GET]], [[SOAR-API-PROFILE-BASIC-UPDATE]], [[SOAR-API-PROFILE-BASIC-DELETE]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-PROFILE-BASIC-API]] |
| Docs related | [[SOAR-DOC-API-PROFILE]] |
| Agent related |  |
| Notes | Controller boundary for profile basics. |

## Relations

- validates_with -> [[SOAR-TYPES-PROFILE-BASIC]] (verified_local)
- calls -> [[SOAR-SERVICE-PROFILE-BASIC]] (verified_local)
- routes_to <- [[SOAR-API-PROFILE-BASIC-GET]] (verified_local)
- routes_to <- [[SOAR-API-PROFILE-BASIC-UPDATE]] (verified_local)
- routes_to <- [[SOAR-API-PROFILE-BASIC-DELETE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
