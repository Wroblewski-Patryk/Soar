---
id: SOAR-API-PROFILE-SECURITY-ACCOUNT
name: "DELETE /dashboard/profile/security/account"
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

# DELETE /dashboard/profile/security/account

| Field | Value |
| --- | --- |
| Description | Authenticated account deletion route with session cookie clearing. |
| File path | apps/api/src/modules/profile/security/security.routes.ts |
| Related files | apps/api/src/modules/profile/security/security.controller.ts, apps/api/src/modules/profile/security/security.service.ts |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-PROFILE-SECURITY]], [[SOAR-SERVICE-PROFILE-SECURITY]] |
| Used by | [[SOAR-ROUTER-DASHBOARD]] |
| UI related |  |
| API related | [[SOAR-SERVICE-PROFILE-SECURITY]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-PROFILE-SECURITY-API]] |
| Docs related | [[SOAR-DOC-API-PROFILE]] |
| Agent related |  |
| Notes | Destructive profile security route. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-PROFILE-SECURITY]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-PROFILE-SECURITY]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
