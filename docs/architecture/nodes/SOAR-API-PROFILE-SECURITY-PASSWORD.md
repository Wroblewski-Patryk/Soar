---
id: SOAR-API-PROFILE-SECURITY-PASSWORD
name: "PATCH /dashboard/profile/security/password"
type: api_route
status: verified_local
layer: backend
module: api-profile
feature: api-support-routes
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# PATCH /dashboard/profile/security/password

| Field | Value |
| --- | --- |
| Description | Authenticated password-change route with security rate limiting. |
| File path | apps/api/src/modules/profile/security/security.routes.ts |
| Related files | apps/api/src/modules/profile/security/security.controller.ts, apps/api/src/modules/profile/security/security.service.ts, apps/api/src/modules/profile/security/security.types.ts |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-PROFILE-SECURITY]], [[SOAR-TYPES-PROFILE-SECURITY]], [[SOAR-SERVICE-PROFILE-SECURITY]] |
| Used by | [[SOAR-ROUTER-DASHBOARD]] |
| UI related |  |
| API related | [[SOAR-SERVICE-PROFILE-SECURITY]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-PROFILE-SECURITY-API]] |
| Docs related | [[SOAR-DOC-API-PROFILE]] |
| Agent related |  |
| Notes | Security-sensitive profile mutation route. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-PROFILE-SECURITY]] (verified_local)
- verified_by -> [[SOAR-TEST-PROFILE-SECURITY-API]] (verified_local)
- documented_by -> [[SOAR-DOC-API-PROFILE]] (verified_local)
- mounts <- [[SOAR-ROUTER-DASHBOARD]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-PROFILE-SECURITY]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
