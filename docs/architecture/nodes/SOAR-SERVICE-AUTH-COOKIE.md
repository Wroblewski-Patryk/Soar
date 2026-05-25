---
id: SOAR-SERVICE-AUTH-COOKIE
name: "Auth cookie service"
type: service
status: verified_local
layer: backend
module: api-auth
feature: auth-session
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Auth cookie service

| Field | Value |
| --- | --- |
| Description | Auth cookie helpers for session token transport and clearing. |
| File path | apps/api/src/modules/auth/auth.cookie.ts |
| Related files | apps/api/src/modules/auth/auth.cookie.test.ts |
| Parent | [[SOAR-FEATURE-AUTH-SESSION]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-AUTH-JWT]] |
| Used by | [[SOAR-CONTROLLER-AUTH]] |
| UI related |  |
| API related | [[SOAR-API-AUTH-LOGIN]], [[SOAR-API-AUTH-LOGOUT]] |
| Database related |  |
| Tests related | [[SOAR-TEST-API-AUTH-COOKIE]] |
| Docs related | [[SOAR-DOC-API-AUTH]] |
| Agent related |  |
| Notes | Cookie/session transport helper. |

## Relations

- verified_by -> [[SOAR-TEST-API-AUTH-COOKIE]] (verified_local)
- uses <- [[SOAR-CONTROLLER-AUTH]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
