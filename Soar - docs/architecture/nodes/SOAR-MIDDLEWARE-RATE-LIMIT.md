---
id: SOAR-MIDDLEWARE-RATE-LIMIT
name: "rateLimit middleware"
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

# rateLimit middleware

| Field | Value |
| --- | --- |
| Description | API rate limiting middleware for abuse-sensitive routes. |
| File path | apps/api/src/middleware/rateLimit.ts |
| Related files | apps/api/src/middleware/rateLimit.test.ts |
| Parent | [[SOAR-FEATURE-API-PLATFORM-SAFETY]] |
| Children |  |
| Depends on | [[SOAR-DOC-API-ROOT]] |
| Used by | [[SOAR-API-ICON-LOOKUP]], [[SOAR-API-UPLOAD-AVATAR]], [[SOAR-API-PROFILE-SECURITY-PASSWORD]] |
| UI related |  |
| API related | [[SOAR-API-ICON-LOOKUP]], [[SOAR-API-UPLOAD-AVATAR]] |
| Database related |  |
| Tests related | [[SOAR-TEST-API-MIDDLEWARE-SAFETY]] |
| Docs related | [[SOAR-DOC-API-ROOT]] |
| Agent related |  |
| Notes | Abuse protection middleware. |

## Relations

- protects -> [[SOAR-API-ICON-LOOKUP]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
