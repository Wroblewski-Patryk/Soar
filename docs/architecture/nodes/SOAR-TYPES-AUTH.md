---
id: SOAR-TYPES-AUTH
name: "Auth DTO types"
type: type
status: verified_local
layer: backend
module: api-auth
feature: auth-session
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, type, backend, verified_local]
---

# Auth DTO types

| Field | Value |
| --- | --- |
| Description | Auth DTO validation and session response types. |
| File path | apps/api/src/modules/auth/auth.types.ts |
| Related files | apps/api/src/modules/auth/auth.e2e.test.ts |
| Parent | [[SOAR-FEATURE-AUTH-SESSION]] |
| Children |  |
| Depends on | [[SOAR-CONTROLLER-AUTH]], [[SOAR-SERVICE-AUTH]] |
| Used by | [[SOAR-CONTROLLER-AUTH]] |
| UI related |  |
| API related | [[SOAR-API-AUTH-LOGIN]], [[SOAR-API-AUTH-REGISTER]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-API-AUTH-SESSION-DEEP]] |
| Docs related | [[SOAR-DOC-API-AUTH]] |
| Agent related |  |
| Notes | Auth type contract. |

## Relations

- validates_with <- [[SOAR-CONTROLLER-AUTH]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
