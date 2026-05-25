---
id: SOAR-MIDDLEWARE-REQUEST-LOGGER
name: "requestLogger middleware"
type: middleware
status: verified_local
layer: backend
module: api-middleware
feature: api-platform-safety
risk_level: 90
completion_percent: 2026-05-24
last_verified_at: verified_local
verification_status: Request logging middleware.
tags: [soar-map, middleware, backend, verified_local]
---

# requestLogger middleware

| Field | Value |
| --- | --- |
| Description | Request logging middleware connected to API logger behavior. |
| File path | apps/api/src/middleware/requestLogger.ts |
| Related files | apps/api/src/middleware/requestLogger.test.ts |
| Parent | [[SOAR-FEATURE-API-PLATFORM-SAFETY]] |
| Children |  |
| Depends on | [[SOAR-LIB-LOGGER]] |
| Used by | [[SOAR-ROUTER-API-ROOT]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-TEST-API-MIDDLEWARE-SAFETY]] |
| Tests related | [[SOAR-DOC-API-ROOT]] |
| Docs related |  |
| Agent related | [[medium]] |
| Notes |  |

## Relations

- calls -> [[SOAR-LIB-LOGGER]] (verified_local)
- observed_by <- [[SOAR-ROUTER-API-ROOT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
