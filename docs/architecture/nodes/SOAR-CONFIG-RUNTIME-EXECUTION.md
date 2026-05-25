---
id: SOAR-CONFIG-RUNTIME-EXECUTION
name: "Runtime execution config"
type: config
status: verified_local
layer: backend
module: api-config
feature: api-platform-safety
risk_level: 90
completion_percent: 2026-05-24
last_verified_at: verified_local
verification_status: Runtime execution config node.
tags: [soar-map, config, backend, verified_local]
---

# Runtime execution config

| Field | Value |
| --- | --- |
| Description | Runtime execution mode and readiness configuration. |
| File path | apps/api/src/config/runtimeExecution.ts |
| Related files | apps/api/src/config/runtimeExecution.test.ts, apps/api/src/config/runtime.ts, apps/api/src/config/runtimeDependencyReadiness.ts, apps/api/src/config/loadEnv.ts |
| Parent | [[SOAR-FEATURE-API-PLATFORM-SAFETY]] |
| Children |  |
| Depends on | [[SOAR-CONFIG-CRITICAL-SECRETS-READINESS]] |
| Used by | [[SOAR-SERVICE-RUNTIME-AUTOMATION]], [[SOAR-ROUTER-API-ROOT]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-TEST-API-CONFIG-SAFETY]] |
| Tests related | [[SOAR-DOC-LOCAL-DEVELOPMENT]] |
| Docs related |  |
| Agent related | [[critical]] |
| Notes |  |

## Relations

- uses -> [[SOAR-CONFIG-CRITICAL-SECRETS-READINESS]] (verified_local)
- uses -> [[SOAR-LIB-ENV]] (verified_local)
- verified_by -> [[SOAR-TEST-API-CONFIG-SAFETY]] (verified_local)
- has_source <- [[SOAR-FEATURE-API-PLATFORM-SAFETY]] (verified_local)
- uses <- [[SOAR-MIDDLEWARE-OPS-NETWORK]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
