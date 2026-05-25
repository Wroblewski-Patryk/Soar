---
id: SOAR-TYPES-PROFILE-BASIC
name: "Profile basic DTO schemas"
type: validation
status: verified_local
layer: backend
module: api-profile
feature: api-support-routes
risk_level: medium
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, validation, backend, verified_local]
---

# Profile basic DTO schemas

| Field | Value |
| --- | --- |
| Description | Profile basic update validation schemas. |
| File path | apps/api/src/modules/profile/basic/basic.types.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-DOC-API-PROFILE]] |
| Used by | [[SOAR-CONTROLLER-PROFILE-BASIC]] |
| UI related |  |
| API related | [[SOAR-API-PROFILE-BASIC-UPDATE]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-PROFILE-BASIC-API]] |
| Docs related | [[SOAR-DOC-API-PROFILE]] |
| Agent related |  |
| Notes | Validation boundary for profile basic updates. |

## Relations

- validates_with <- [[SOAR-CONTROLLER-PROFILE-BASIC]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
