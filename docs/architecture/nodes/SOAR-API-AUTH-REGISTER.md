---
id: SOAR-API-AUTH-REGISTER
name: "POST /auth/register"
type: api_route
status: verified_local
layer: backend
module: api-auth
feature: auth-session
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# POST /auth/register

| Field | Value |
| --- | --- |
| Description | Public register endpoint that validates account creation and persists a user. |
| File path | apps/api/src/modules/auth/auth.routes.ts |
| Related files | apps/api/src/modules/auth/auth.controller.ts, apps/api/src/modules/auth/auth.service.ts |
| Parent | [[SOAR-FEATURE-AUTH-SESSION]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-AUTH]], [[SOAR-SERVICE-AUTH]], [[SOAR-TYPES-AUTH]] |
| Used by | [[SOAR-COMP-REGISTER-FORM]] |
| UI related | [[SOAR-COMP-REGISTER-FORM]] |
| API related | [[SOAR-CONTROLLER-AUTH]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-API-AUTH-SESSION-DEEP]] |
| Docs related | [[SOAR-DOC-API-AUTH]] |
| Agent related |  |
| Notes | Register API route. |

## Relations

- routes_to -> [[SOAR-CONTROLLER-AUTH]] (verified_local)
- calls <- [[SOAR-SERVICE-WEB-AUTH]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
