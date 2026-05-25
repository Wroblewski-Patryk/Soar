---
id: SOAR-TEST-API-AUTH-SERVICE
name: "API auth service tests"
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

# API auth service tests

| Field | Value |
| --- | --- |
| Description | Auth service tests. |
| File path | apps/api/src/modules/auth/auth.service.test.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-AUTH-SESSION]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-AUTH]] |
| Used by | [[SOAR-FEATURE-AUTH-SESSION]] |
| UI related |  |
| API related | [[SOAR-API-AUTH-LOGIN]], [[SOAR-API-AUTH-REGISTER]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-API-AUTH-SESSION-DEEP]] |
| Docs related | [[SOAR-DOC-API-AUTH]] |
| Agent related |  |
| Notes | Auth service proof. |

## Relations

- verified_by <- [[SOAR-SERVICE-AUTH]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
