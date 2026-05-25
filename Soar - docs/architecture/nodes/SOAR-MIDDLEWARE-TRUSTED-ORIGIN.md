---
id: SOAR-MIDDLEWARE-TRUSTED-ORIGIN
name: "requireTrustedOrigin middleware"
type: middleware
status: verified_local
layer: backend
module: api-middleware
feature: api-platform-safety
risk_level: 90
completion_percent: 2026-05-24
last_verified_at: verified_local
verification_status: Trusted-origin request guard.
tags: [soar-map, middleware, backend, verified_local]
---

# requireTrustedOrigin middleware

| Field | Value |
| --- | --- |
| Description | Trusted origin middleware for request origin safety. |
| File path | apps/api/src/middleware/requireTrustedOrigin.ts |
| Related files | apps/api/src/middleware/requireTrustedOrigin.test.ts |
| Parent | [[SOAR-FEATURE-API-PLATFORM-SAFETY]] |
| Children |  |
| Depends on | [[SOAR-CONFIG-PROXY-TRUST]] |
| Used by | [[SOAR-ROUTER-API-ROOT]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-TEST-API-MIDDLEWARE-SAFETY]] |
| Tests related | [[SOAR-DOC-API-ROOT]] |
| Docs related |  |
| Agent related | [[critical]] |
| Notes |  |

## Relations

- uses -> [[SOAR-CONFIG-PROXY-TRUST]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
