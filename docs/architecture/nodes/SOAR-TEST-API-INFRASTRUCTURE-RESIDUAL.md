---
id: SOAR-TEST-API-INFRASTRUCTURE-RESIDUAL
name: "API infrastructure residual tests"
type: test
status: verified_local
layer: testing
module: api
feature: api-platform-safety
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# API infrastructure residual tests

| Field | Value |
| --- | --- |
| Description | Residual API infrastructure tests for health readiness metrics security headers utility crypto and worker health ownership heartbeat config. |
| File path | apps/api/src/router/health-readiness.test.ts |
| Related files | apps/api/src/router/metrics.test.ts, apps/api/src/router/security-headers.test.ts, apps/api/src/router/workers-health-readiness.test.ts, apps/api/src/router/workers-runtime-freshness.test.ts, apps/api/src/utils/apiError.test.ts, apps/api/src/utils/crypto.test.ts, apps/api/src/workers/marketStreamWorkerConfig.test.ts, apps/api/src/workers/workerHeartbeat.test.ts, apps/api/src/workers/workerOwnership.test.ts |
| Parent | [[SOAR-FEATURE-API-PLATFORM-SAFETY]] |
| Children |  |
| Depends on | [[SOAR-ROUTER-API-ROOT]], [[SOAR-LIB-ERRORS]], [[SOAR-FEATURE-MARKET-DATA-STREAM-ADAPTERS]] |
| Used by | [[SOAR-FEATURE-API-PLATFORM-SAFETY]] |
| UI related |  |
| API related | [[SOAR-ROUTER-API-ROOT]] |
| Database related |  |
| Tests related | [[SOAR-TEST-API-PLATFORM-SAFETY]], [[SOAR-TEST-MARKET-DATA-STREAM-ADAPTERS]] |
| Docs related | [[SOAR-DOC-API-ROOT]], [[SOAR-DOC-TESTING]] |
| Agent related |  |
| Notes | Residual API infrastructure proof. |

## Relations

- verified_by <- [[SOAR-FEATURE-API-PLATFORM-SAFETY]] (verified_local)
- verified_by <- [[SOAR-FEATURE-MARKET-DATA-STREAM-ADAPTERS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
