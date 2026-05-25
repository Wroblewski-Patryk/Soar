---
id: SOAR-API-AUTH-LOGIN
name: "POST /auth/login"
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

# POST /auth/login

| Field | Value |
| --- | --- |
| Description | Public login endpoint that issues session cookies after credential validation. |
| File path | apps/api/src/modules/auth/auth.routes.ts |
| Related files | apps/api/src/modules/auth/auth.controller.ts, apps/api/src/modules/auth/auth.service.ts |
| Parent | [[SOAR-FEATURE-AUTH-SESSION]] |
| Children |  |
| Depends on | [[SOAR-DB-USER]] |
| Used by | [[SOAR-COMP-LOGIN-FORM]] |
| UI related |  |
| API related | [[SOAR-API-AUTH-ME]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-AUTH-SESSION]] |
| Docs related | [[SOAR-DOC-API-AUTH]] |
| Agent related |  |
| Notes | No raw credential evidence belongs in graph records. |

## Relations

- reads_writes -> [[SOAR-DB-USER]] (verified)
- routes_to -> [[SOAR-CONTROLLER-AUTH]] (verified_local)
- calls <- [[SOAR-COMP-LOGIN-FORM]] (verified)
- calls <- [[SOAR-SERVICE-WEB-AUTH]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
