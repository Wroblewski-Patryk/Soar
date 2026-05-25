---
id: SOAR-MIDDLEWARE-OPS-NETWORK
name: "requireOpsNetwork middleware"
type: middleware
status: verified_local
layer: backend
module: api-middleware
feature: api-platform-safety
risk_level: 90
completion_percent: 2026-05-24
last_verified_at: verified_local
verification_status: Ops network protection middleware.
tags: [soar-map, middleware, backend, verified_local]
---

# requireOpsNetwork middleware

| Field | Value |
| --- | --- |
| Description | Ops network guard middleware for protected operational surfaces. |
| File path | apps/api/src/middleware/requireOpsNetwork.ts |
| Related files | apps/api/src/middleware/requireOpsNetwork.test.ts |
| Parent | [[SOAR-FEATURE-API-PLATFORM-SAFETY]] |
| Children |  |
| Depends on | [[SOAR-CONFIG-RUNTIME-EXECUTION]] |
| Used by | [[SOAR-ROUTER-API-ROOT]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-TEST-API-MIDDLEWARE-SAFETY]] |
| Tests related | [[SOAR-DOC-API-ROOT]] |
| Docs related |  |
| Agent related | [[critical]] |
| Notes |  |

## Relations

- uses -> [[SOAR-CONFIG-RUNTIME-EXECUTION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
