---
id: SOAR-TEST-API-AUTH-SESSION-DEEP
name: "API auth session tests"
type: test
status: verified_local
layer: testing
module: api-auth
feature: auth-session
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# API auth session tests

| Field | Value |
| --- | --- |
| Description | Aggregate auth API e2e cookie JWT error and service tests. |
| File path | apps/api/src/modules/auth/auth.e2e.test.ts |
| Related files | apps/api/src/modules/auth/auth.cookie.test.ts, apps/api/src/modules/auth/auth.errors.test.ts, apps/api/src/modules/auth/auth.jwt.test.ts, apps/api/src/modules/auth/auth.service.test.ts |
| Parent | [[SOAR-FEATURE-AUTH-SESSION]] |
| Children |  |
| Depends on | [[SOAR-API-AUTH-LOGIN]], [[SOAR-API-AUTH-REGISTER]], [[SOAR-API-AUTH-ME]], [[SOAR-API-AUTH-LOGOUT]], [[SOAR-SERVICE-AUTH]], [[SOAR-SERVICE-AUTH-COOKIE]], [[SOAR-SERVICE-AUTH-JWT]], [[SOAR-SERVICE-AUTH-ERRORS]] |
| Used by | [[SOAR-FEATURE-AUTH-SESSION]] |
| UI related |  |
| API related | [[SOAR-API-AUTH-LOGIN]], [[SOAR-API-AUTH-REGISTER]], [[SOAR-API-AUTH-ME]], [[SOAR-API-AUTH-LOGOUT]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-AUTH-SESSION]] |
| Docs related | [[SOAR-DOC-API-AUTH]] |
| Agent related |  |
| Notes | Aggregate API auth proof. |

## Relations

- verified_by <- [[SOAR-FEATURE-AUTH-SESSION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
