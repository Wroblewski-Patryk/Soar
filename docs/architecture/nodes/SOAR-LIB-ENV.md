---
id: SOAR-LIB-ENV
name: "API env library"
type: utility
status: verified_local
layer: backend
module: api-lib
feature: api-platform-safety
risk_level: 90
completion_percent: 2026-05-24
last_verified_at: verified_local
verification_status: Environment loading primitive.
tags: [soar-map, utility, backend, verified_local]
---

# API env library

| Field | Value |
| --- | --- |
| Description | Shared environment variable utility for API runtime configuration. |
| File path | apps/api/src/lib/env.ts |
| Related files | apps/api/src/config/loadEnv.ts |
| Parent | [[SOAR-FEATURE-API-PLATFORM-SAFETY]] |
| Children |  |
| Depends on | [[SOAR-CONFIG-RUNTIME-EXECUTION]] |
| Used by | [[SOAR-CONFIG-CRITICAL-SECRETS-READINESS]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-TEST-API-CONFIG-SAFETY]] |
| Tests related | [[SOAR-DOC-LOCAL-DEVELOPMENT]] |
| Docs related |  |
| Agent related | [[critical]] |
| Notes |  |

## Relations

- uses <- [[SOAR-CONFIG-RUNTIME-EXECUTION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
