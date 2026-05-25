---
id: SOAR-LIB-HTTP-ERROR-MAPPER
name: "HTTP error mapper library"
type: utility
status: verified_local
layer: backend
module: api-lib
feature: api-platform-safety
risk_level: 90
completion_percent: 2026-05-24
last_verified_at: verified_local
verification_status: HTTP error mapping boundary.
tags: [soar-map, utility, backend, verified_local]
---

# HTTP error mapper library

| Field | Value |
| --- | --- |
| Description | Shared HTTP error mapping utility used by API error handling. |
| File path | apps/api/src/lib/httpErrorMapper.ts |
| Related files | apps/api/src/lib/httpErrorMapper.test.ts |
| Parent | [[SOAR-FEATURE-API-PLATFORM-SAFETY]] |
| Children |  |
| Depends on | [[SOAR-LIB-ERRORS]] |
| Used by | [[SOAR-MIDDLEWARE-ERROR-HANDLER]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-TEST-API-LIB-SAFETY]] |
| Tests related | [[SOAR-DOC-API-ROOT]] |
| Docs related |  |
| Agent related | [[critical]] |
| Notes |  |

## Relations

- uses -> [[SOAR-LIB-ERRORS]] (verified_local)
- calls <- [[SOAR-MIDDLEWARE-ERROR-HANDLER]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
