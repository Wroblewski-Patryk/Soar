---
id: SOAR-LIB-LOGGER
name: "API logger library"
type: utility
status: verified_local
layer: backend
module: api-lib
feature: api-platform-safety
risk_level: 90
completion_percent: 2026-05-24
last_verified_at: verified_local
verification_status: API logging primitive.
tags: [soar-map, utility, backend, verified_local]
---

# API logger library

| Field | Value |
| --- | --- |
| Description | Shared API logger utility. |
| File path | apps/api/src/lib/logger.ts |
| Related files | apps/api/src/lib/logger.test.ts |
| Parent | [[SOAR-FEATURE-API-PLATFORM-SAFETY]] |
| Children |  |
| Depends on | [[SOAR-DOC-API-ROOT]] |
| Used by | [[SOAR-MIDDLEWARE-REQUEST-LOGGER]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-TEST-API-LIB-SAFETY]] |
| Tests related | [[SOAR-DOC-API-ROOT]] |
| Docs related |  |
| Agent related | [[high]] |
| Notes |  |

## Relations

- calls <- [[SOAR-MIDDLEWARE-REQUEST-LOGGER]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
