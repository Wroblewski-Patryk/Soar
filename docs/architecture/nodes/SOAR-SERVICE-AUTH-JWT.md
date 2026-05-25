---
id: SOAR-SERVICE-AUTH-JWT
name: "Auth JWT service"
type: service
status: verified_local
layer: backend
module: api-auth
feature: auth-session
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Auth JWT service

| Field | Value |
| --- | --- |
| Description | JWT helper for signing and verifying auth session tokens. |
| File path | apps/api/src/modules/auth/auth.jwt.ts |
| Related files | apps/api/src/modules/auth/auth.jwt.test.ts |
| Parent | [[SOAR-FEATURE-AUTH-SESSION]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-AUTH-SESSION-TOKEN]] |
| Used by | [[SOAR-SERVICE-AUTH]], [[SOAR-SERVICE-AUTH-COOKIE]], [[SOAR-MIDDLEWARE-REQUIRE-AUTH]] |
| UI related |  |
| API related | [[SOAR-API-AUTH-LOGIN]], [[SOAR-API-AUTH-ME]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-API-AUTH-JWT]] |
| Docs related | [[SOAR-DOC-API-AUTH]] |
| Agent related |  |
| Notes | JWT session helper. |

## Relations

- uses -> [[SOAR-SERVICE-AUTH-SESSION-TOKEN]] (verified_local)
- verified_by -> [[SOAR-TEST-API-AUTH-JWT]] (verified_local)
- uses <- [[SOAR-SERVICE-AUTH]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
