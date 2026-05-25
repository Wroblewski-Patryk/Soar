---
id: SOAR-CONTROLLER-PROFILE-SECURITY
name: "Profile security controller"
type: controller
status: verified_local
layer: backend
module: api-profile
feature: api-support-routes
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, controller, backend, verified_local]
---

# Profile security controller

| Field | Value |
| --- | --- |
| Description | Profile security controller for password and account-deletion behavior. |
| File path | apps/api/src/modules/profile/security/security.controller.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-TYPES-PROFILE-SECURITY]], [[SOAR-SERVICE-PROFILE-SECURITY]] |
| Used by | [[SOAR-API-PROFILE-SECURITY-PASSWORD]], [[SOAR-API-PROFILE-SECURITY-ACCOUNT]] |
| UI related |  |
| API related | [[SOAR-API-PROFILE-SECURITY-PASSWORD]], [[SOAR-API-PROFILE-SECURITY-ACCOUNT]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-PROFILE-SECURITY-API]] |
| Docs related | [[SOAR-DOC-API-PROFILE]] |
| Agent related |  |
| Notes | Controller boundary for sensitive account actions. |

## Relations

- validates_with -> [[SOAR-TYPES-PROFILE-SECURITY]] (verified_local)
- calls -> [[SOAR-SERVICE-PROFILE-SECURITY]] (verified_local)
- routes_to <- [[SOAR-API-PROFILE-SECURITY-PASSWORD]] (verified_local)
- routes_to <- [[SOAR-API-PROFILE-SECURITY-ACCOUNT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
