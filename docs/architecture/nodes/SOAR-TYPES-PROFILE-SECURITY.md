---
id: SOAR-TYPES-PROFILE-SECURITY
name: "Profile security DTO schemas"
type: validation
status: verified_local
layer: backend
module: api-profile
feature: api-support-routes
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, validation, backend, verified_local]
---

# Profile security DTO schemas

| Field | Value |
| --- | --- |
| Description | Profile password update validation schema. |
| File path | apps/api/src/modules/profile/security/security.types.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-DOC-API-PROFILE]] |
| Used by | [[SOAR-CONTROLLER-PROFILE-SECURITY]] |
| UI related |  |
| API related | [[SOAR-API-PROFILE-SECURITY-PASSWORD]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-PROFILE-SECURITY-API]] |
| Docs related | [[SOAR-DOC-API-PROFILE]] |
| Agent related |  |
| Notes | Validation boundary for profile security mutations. |

## Relations

- validates_with <- [[SOAR-CONTROLLER-PROFILE-SECURITY]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
