---
id: SOAR-MIDDLEWARE-REQUIRE-AUTH
name: "requireAuth middleware"
type: middleware
status: verified_local
layer: backend
module: api-middleware
feature: api-platform-safety
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, middleware, backend, verified_local]
---

# requireAuth middleware

| Field | Value |
| --- | --- |
| Description | Authentication middleware for protected API routes. |
| File path | apps/api/src/middleware/requireAuth.ts |
| Related files | apps/api/src/middleware/requireAuth.test.ts, apps/api/src/middleware/requireRole.ts |
| Parent | [[SOAR-FEATURE-API-PLATFORM-SAFETY]] |
| Children |  |
| Depends on | [[SOAR-DB-USER]], [[SOAR-API-AUTH-ME]] |
| Used by | [[SOAR-ROUTER-DASHBOARD]], [[SOAR-ROUTER-ADMIN]] |
| UI related |  |
| API related | [[SOAR-API-AUTH-ME]] |
| Database related | [[SOAR-DB-USER]] |
| Tests related | [[SOAR-TEST-API-MIDDLEWARE-SAFETY]] |
| Docs related | [[SOAR-DOC-API-AUTH]] |
| Agent related |  |
| Notes | Auth guard middleware. |

## Relations

- reads -> [[SOAR-DB-USER]] (verified_local)
- verified_by -> [[SOAR-TEST-API-MIDDLEWARE-SAFETY]] (verified_local)
- protected_by <- [[SOAR-ROUTER-API-ROOT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
