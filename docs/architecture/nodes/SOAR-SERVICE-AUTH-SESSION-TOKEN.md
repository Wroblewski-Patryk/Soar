---
id: SOAR-SERVICE-AUTH-SESSION-TOKEN
name: "Auth session token helper"
type: service
status: verified_local
layer: backend
module: api-auth
feature: auth-session
risk_level: medium
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Auth session token helper

| Field | Value |
| --- | --- |
| Description | Session token helper used by auth JWT/session handling. |
| File path | apps/api/src/modules/auth/sessionToken.ts |
| Related files | apps/api/src/modules/auth/auth.jwt.test.ts |
| Parent | [[SOAR-FEATURE-AUTH-SESSION]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-AUTH-JWT]] |
| Used by | [[SOAR-SERVICE-AUTH-JWT]] |
| UI related |  |
| API related | [[SOAR-API-AUTH-LOGIN]], [[SOAR-API-AUTH-ME]] |
| Database related |  |
| Tests related | [[SOAR-TEST-API-AUTH-JWT]] |
| Docs related | [[SOAR-DOC-API-AUTH]] |
| Agent related |  |
| Notes | Session token helper. |

## Relations

- uses <- [[SOAR-SERVICE-AUTH-JWT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
