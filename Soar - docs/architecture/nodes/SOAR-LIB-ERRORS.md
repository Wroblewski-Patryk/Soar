---
id: SOAR-LIB-ERRORS
name: "API errors library"
type: utility
status: verified_local
layer: backend
module: api-lib
feature: api-platform-safety
risk_level: 90
completion_percent: 2026-05-24
last_verified_at: verified_local
verification_status: Shared error primitives.
tags: [soar-map, utility, backend, verified_local]
---

# API errors library

| Field | Value |
| --- | --- |
| Description | Shared API error classes and domain error helpers. |
| File path | apps/api/src/lib/errors.ts |
| Related files | apps/api/src/lib/errors.test.ts |
| Parent | [[SOAR-FEATURE-API-PLATFORM-SAFETY]] |
| Children |  |
| Depends on | [[SOAR-DOC-API-ROOT]] |
| Used by | [[SOAR-MIDDLEWARE-ERROR-HANDLER]], [[SOAR-LIB-HTTP-ERROR-MAPPER]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-TEST-API-LIB-SAFETY]] |
| Tests related | [[SOAR-DOC-API-ROOT]] |
| Docs related |  |
| Agent related | [[critical]] |
| Notes |  |

## Relations

- verified_by -> [[SOAR-TEST-API-LIB-SAFETY]] (verified_local)
- uses <- [[SOAR-LIB-HTTP-ERROR-MAPPER]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
