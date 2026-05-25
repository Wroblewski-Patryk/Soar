---
id: SOAR-API-AUTH-LOGOUT
name: "POST /auth/logout"
type: api_route
status: verified_local
layer: backend
module: api-auth
feature: auth-session
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# POST /auth/logout

| Field | Value |
| --- | --- |
| Description | Public logout endpoint that clears session cookie state. |
| File path | apps/api/src/modules/auth/auth.routes.ts |
| Related files | apps/api/src/modules/auth/auth.controller.ts, apps/api/src/modules/auth/auth.cookie.ts |
| Parent | [[SOAR-FEATURE-AUTH-SESSION]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-AUTH]], [[SOAR-SERVICE-AUTH-COOKIE]] |
| Used by | [[SOAR-CONTEXT-WEB-AUTH]] |
| UI related |  |
| API related | [[SOAR-CONTROLLER-AUTH]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-API-AUTH-SESSION-DEEP]] |
| Docs related | [[SOAR-DOC-API-AUTH]] |
| Agent related |  |
| Notes | Logout API route. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-AUTH]] (verified_local)
- calls <- [[SOAR-CONTEXT-WEB-AUTH]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
