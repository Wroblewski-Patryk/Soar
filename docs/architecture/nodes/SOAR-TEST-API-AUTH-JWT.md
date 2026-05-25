---
id: SOAR-TEST-API-AUTH-JWT
name: "API auth JWT tests"
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

# API auth JWT tests

| Field | Value |
| --- | --- |
| Description | Auth JWT tests. |
| File path | apps/api/src/modules/auth/auth.jwt.test.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-AUTH-SESSION]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-AUTH-JWT]], [[SOAR-SERVICE-AUTH-SESSION-TOKEN]] |
| Used by | [[SOAR-FEATURE-AUTH-SESSION]] |
| UI related |  |
| API related | [[SOAR-API-AUTH-LOGIN]], [[SOAR-API-AUTH-ME]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-API-AUTH-SESSION-DEEP]] |
| Docs related | [[SOAR-DOC-API-AUTH]] |
| Agent related |  |
| Notes | JWT proof. |

## Relations

- verified_by <- [[SOAR-SERVICE-AUTH-JWT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
