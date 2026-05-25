---
id: SOAR-TEST-API-MIDDLEWARE-SAFETY
name: "API middleware safety tests"
type: test
status: verified_local
layer: testing
module: api-middleware
feature: api-platform-safety
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# API middleware safety tests

| Field | Value |
| --- | --- |
| Description | Rate limit request logger auth ops network and trusted origin middleware tests. |
| File path | apps/api/src/middleware/rateLimit.test.ts |
| Related files | apps/api/src/middleware/requestLogger.test.ts, apps/api/src/middleware/requireAuth.test.ts, apps/api/src/middleware/requireOpsNetwork.test.ts, apps/api/src/middleware/requireTrustedOrigin.test.ts |
| Parent | [[SOAR-FEATURE-API-PLATFORM-SAFETY]] |
| Children |  |
| Depends on | [[SOAR-MIDDLEWARE-RATE-LIMIT]], [[SOAR-MIDDLEWARE-REQUEST-LOGGER]], [[SOAR-MIDDLEWARE-REQUIRE-AUTH]], [[SOAR-MIDDLEWARE-OPS-NETWORK]], [[SOAR-MIDDLEWARE-TRUSTED-ORIGIN]] |
| Used by | [[SOAR-FEATURE-API-PLATFORM-SAFETY]] |
| UI related |  |
| API related | [[SOAR-ROUTER-API-ROOT]] |
| Database related |  |
| Tests related | [[SOAR-TEST-API-PLATFORM-SAFETY]] |
| Docs related | [[SOAR-DOC-API-ROOT]] |
| Agent related |  |
| Notes | Middleware proof node. |

## Relations

- verified_by <- [[SOAR-MIDDLEWARE-REQUIRE-AUTH]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
