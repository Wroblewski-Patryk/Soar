---
id: SOAR-API-AUTH-ME
name: "GET /auth/me"
type: api_route
status: verified
layer: backend
module: api-auth
feature: auth-session
risk_level: high
completion_percent: 100
last_verified_at: 2026-05-14
verification_status: verified
tags: [soar-map, api_route, backend, verified]
---

# GET /auth/me

| Field | Value |
| --- | --- |
| Description | Current-user endpoint used by authenticated bootstrap and stale-session checks. |
| File path | apps/api/src/modules/auth/auth.routes.ts |
| Related files | apps/api/src/modules/auth/auth.controller.ts, apps/api/src/middleware/requireAuth.ts |
| Parent | [[SOAR-FEATURE-AUTH-SESSION]] |
| Children |  |
| Depends on | [[SOAR-DB-USER]] |
| Used by | [[SOAR-FEATURE-DASHBOARD-RUNTIME]] |
| UI related |  |
| API related | [[SOAR-API-AUTH-LOGIN]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-AUTH-SESSION]] |
| Docs related | [[SOAR-DOC-API-AUTH]] |
| Agent related |  |
| Notes | Logout token reuse hardening proof exists in history. |

## Relations

- reads -> [[SOAR-DB-USER]] (verified)
- routes_to -> [[SOAR-CONTROLLER-AUTH]] (verified_local)
- calls <- [[SOAR-CONTEXT-WEB-AUTH]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
