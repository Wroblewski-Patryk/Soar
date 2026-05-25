---
id: SOAR-MIDDLEWARE-ERROR-HANDLER
name: "errorHandler middleware"
type: middleware
status: verified_local
layer: backend
module: api-middleware
feature: api-platform-safety
risk_level: 90
completion_percent: 2026-05-24
last_verified_at: verified_local
verification_status: Shared API error boundary.
tags: [soar-map, middleware, backend, verified_local]
---

# errorHandler middleware

| Field | Value |
| --- | --- |
| Description | API error handling middleware for shared error mapping. |
| File path | apps/api/src/middleware/errorHandler.ts |
| Related files | apps/api/src/lib/httpErrorMapper.ts, apps/api/src/lib/errors.ts |
| Parent | [[SOAR-FEATURE-API-PLATFORM-SAFETY]] |
| Children |  |
| Depends on | [[SOAR-LIB-HTTP-ERROR-MAPPER]], [[SOAR-LIB-ERRORS]] |
| Used by | [[SOAR-ROUTER-API-ROOT]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-TEST-API-LIB-SAFETY]] |
| Tests related | [[SOAR-DOC-API-ROOT]] |
| Docs related |  |
| Agent related | [[critical]] |
| Notes |  |

## Relations

- calls -> [[SOAR-LIB-HTTP-ERROR-MAPPER]] (verified_local)
- handled_by <- [[SOAR-ROUTER-API-ROOT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
