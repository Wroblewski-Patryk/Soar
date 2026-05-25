---
id: SOAR-SERVICE-PROFILE-BASIC
name: "Profile basic service"
type: service
status: verified_local
layer: backend
module: api-profile
feature: api-support-routes
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Profile basic service

| Field | Value |
| --- | --- |
| Description | Profile basic read update and delete service over the user model. |
| File path | apps/api/src/modules/profile/basic/basic.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-DB-USER]] |
| Used by | [[SOAR-CONTROLLER-PROFILE-BASIC]] |
| UI related |  |
| API related | [[SOAR-API-PROFILE-BASIC-GET]], [[SOAR-API-PROFILE-BASIC-UPDATE]], [[SOAR-API-PROFILE-BASIC-DELETE]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-PROFILE-BASIC-API]] |
| Docs related | [[SOAR-DOC-API-PROFILE]] |
| Agent related |  |
| Notes | Owns user profile mutation boundary. |

## Relations

- reads_writes -> [[SOAR-DB-USER]] (verified_local)
- calls <- [[SOAR-CONTROLLER-PROFILE-BASIC]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
