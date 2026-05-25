---
id: SOAR-CONFIG-CRITICAL-SECRETS-READINESS
name: "Critical secrets readiness config"
type: config
status: verified_local
layer: backend
module: api-config
feature: api-platform-safety
risk_level: 90
completion_percent: 2026-05-24
last_verified_at: verified_local
verification_status: Critical configuration safety node.
tags: [soar-map, config, backend, verified_local]
---

# Critical secrets readiness config

| Field | Value |
| --- | --- |
| Description | Runtime critical secrets readiness checks for fail-closed API startup and operations. |
| File path | apps/api/src/config/criticalSecretsReadiness.ts |
| Related files | apps/api/src/config/criticalSecretsReadiness.test.ts |
| Parent | [[SOAR-FEATURE-API-PLATFORM-SAFETY]] |
| Children |  |
| Depends on | [[SOAR-CONFIG-RUNTIME-EXECUTION]] |
| Used by | [[SOAR-ROUTER-API-ROOT]] |
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
