---
id: SOAR-TEST-API-PLATFORM-SAFETY
name: "API platform safety tests"
type: test
status: verified_local
layer: testing
module: api-platform
feature: api-platform-safety
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# API platform safety tests

| Field | Value |
| --- | --- |
| Description | Aggregate config middleware and shared-library safety tests for API platform behavior. |
| File path | apps/api/src/config/criticalSecretsReadiness.test.ts |
| Related files | apps/api/src/config/proxyTrust.test.ts, apps/api/src/config/runtimeExecution.test.ts, apps/api/src/middleware/rateLimit.test.ts, apps/api/src/middleware/requestLogger.test.ts, apps/api/src/middleware/requireAuth.test.ts, apps/api/src/middleware/requireOpsNetwork.test.ts, apps/api/src/middleware/requireTrustedOrigin.test.ts, apps/api/src/lib/errors.test.ts, apps/api/src/lib/httpErrorMapper.test.ts, apps/api/src/lib/logger.test.ts, apps/api/src/lib/symbols.test.ts |
| Parent | [[SOAR-FEATURE-API-PLATFORM-SAFETY]] |
| Children |  |
| Depends on | [[SOAR-CONFIG-CRITICAL-SECRETS-READINESS]], [[SOAR-MIDDLEWARE-REQUIRE-AUTH]], [[SOAR-LIB-ERRORS]], [[SOAR-LIB-SYMBOLS]] |
| Used by | [[SOAR-FEATURE-API-PLATFORM-SAFETY]] |
| UI related |  |
| API related | [[SOAR-ROUTER-API-ROOT]] |
| Database related |  |
| Tests related | [[SOAR-TEST-API-CONFIG-SAFETY]], [[SOAR-TEST-API-MIDDLEWARE-SAFETY]], [[SOAR-TEST-API-LIB-SAFETY]] |
| Docs related | [[SOAR-DOC-API-ROOT]], [[SOAR-DOC-TESTING]] |
| Agent related |  |
| Notes | Aggregate proof for API platform safety layer. |

## Relations

- verified_by <- [[SOAR-FEATURE-API-PLATFORM-SAFETY]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
