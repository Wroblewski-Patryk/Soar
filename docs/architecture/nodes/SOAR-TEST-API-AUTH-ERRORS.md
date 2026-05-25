---
id: SOAR-TEST-API-AUTH-ERRORS
name: "API auth error tests"
type: test
status: verified_local
layer: testing
module: api-auth
feature: auth-session
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# API auth error tests

| Field | Value |
| --- | --- |
| Description | Auth error tests. |
| File path | apps/api/src/modules/auth/auth.errors.test.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-AUTH-SESSION]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-AUTH-ERRORS]] |
| Used by | [[SOAR-FEATURE-AUTH-SESSION]] |
| UI related |  |
| API related | [[SOAR-API-AUTH-LOGIN]], [[SOAR-API-AUTH-REGISTER]] |
| Database related |  |
| Tests related | [[SOAR-TEST-API-AUTH-SESSION-DEEP]] |
| Docs related | [[SOAR-DOC-API-AUTH]] |
| Agent related |  |
| Notes | Auth error proof. |

## Relations

- verified_by <- [[SOAR-SERVICE-AUTH-ERRORS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
