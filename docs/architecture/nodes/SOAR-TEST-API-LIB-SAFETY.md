---
id: SOAR-TEST-API-LIB-SAFETY
name: "API shared library tests"
type: test
status: verified_local
layer: testing
module: api-lib
feature: api-platform-safety
risk_level: 90
completion_percent: 2026-05-24
last_verified_at: verified_local
verification_status: Shared-library proof node.
tags: [soar-map, test, testing, verified_local]
---

# API shared library tests

| Field | Value |
| --- | --- |
| Description | Shared errors http error mapper logger and symbols tests. |
| File path | apps/api/src/lib/errors.test.ts |
| Related files | apps/api/src/lib/httpErrorMapper.test.ts, apps/api/src/lib/logger.test.ts, apps/api/src/lib/symbols.test.ts |
| Parent | [[SOAR-FEATURE-API-PLATFORM-SAFETY]] |
| Children |  |
| Depends on | [[SOAR-LIB-ERRORS]], [[SOAR-LIB-HTTP-ERROR-MAPPER]], [[SOAR-LIB-LOGGER]], [[SOAR-LIB-SYMBOLS]] |
| Used by | [[SOAR-FEATURE-API-PLATFORM-SAFETY]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-TEST-API-PLATFORM-SAFETY]] |
| Tests related | [[SOAR-DOC-API-ROOT]] |
| Docs related |  |
| Agent related | [[high]] |
| Notes |  |

## Relations

- verified_by <- [[SOAR-LIB-ERRORS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
