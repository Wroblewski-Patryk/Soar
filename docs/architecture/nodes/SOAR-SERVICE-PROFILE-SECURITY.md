---
id: SOAR-SERVICE-PROFILE-SECURITY
name: "Profile security service"
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

# Profile security service

| Field | Value |
| --- | --- |
| Description | Profile password and account deletion service over the user model. |
| File path | apps/api/src/modules/profile/security/security.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-DB-USER]] |
| Used by | [[SOAR-CONTROLLER-PROFILE-SECURITY]] |
| UI related |  |
| API related | [[SOAR-API-PROFILE-SECURITY-PASSWORD]], [[SOAR-API-PROFILE-SECURITY-ACCOUNT]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-PROFILE-SECURITY-API]] |
| Docs related | [[SOAR-DOC-API-PROFILE]] |
| Agent related |  |
| Notes | Owns security-sensitive account mutation behavior. |

## Relations

- reads_writes -> [[SOAR-DB-USER]] (verified_local)
- calls <- [[SOAR-CONTROLLER-PROFILE-SECURITY]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
