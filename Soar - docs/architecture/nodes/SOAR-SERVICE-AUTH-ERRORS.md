---
id: SOAR-SERVICE-AUTH-ERRORS
name: "Auth errors service"
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

# Auth errors service

| Field | Value |
| --- | --- |
| Description | Auth error primitives and mapping for credential and session failures. |
| File path | apps/api/src/modules/auth/auth.errors.ts |
| Related files | apps/api/src/modules/auth/auth.errors.test.ts |
| Parent | [[SOAR-FEATURE-AUTH-SESSION]] |
| Children |  |
| Depends on | [[SOAR-LIB-ERRORS]] |
| Used by | [[SOAR-SERVICE-AUTH]], [[SOAR-CONTROLLER-AUTH]] |
| UI related |  |
| API related | [[SOAR-API-AUTH-LOGIN]], [[SOAR-API-AUTH-REGISTER]] |
| Database related |  |
| Tests related | [[SOAR-TEST-API-AUTH-ERRORS]] |
| Docs related | [[SOAR-DOC-API-AUTH]] |
| Agent related |  |
| Notes | Auth error boundary. |

## Relations

- verified_by -> [[SOAR-TEST-API-AUTH-ERRORS]] (verified_local)
- uses <- [[SOAR-SERVICE-AUTH]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
