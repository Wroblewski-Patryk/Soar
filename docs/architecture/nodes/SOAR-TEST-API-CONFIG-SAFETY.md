---
id: SOAR-TEST-API-CONFIG-SAFETY
name: "API config safety tests"
type: test
status: verified_local
layer: testing
module: api-config
feature: api-platform-safety
risk_level: 90
completion_percent: 2026-05-24
last_verified_at: verified_local
verification_status: Config proof node.
tags: [soar-map, test, testing, verified_local]
---

# API config safety tests

| Field | Value |
| --- | --- |
| Description | Critical secrets proxy trust and runtime execution config tests. |
| File path | apps/api/src/config/criticalSecretsReadiness.test.ts |
| Related files | apps/api/src/config/proxyTrust.test.ts, apps/api/src/config/runtimeExecution.test.ts |
| Parent | [[SOAR-FEATURE-API-PLATFORM-SAFETY]] |
| Children |  |
| Depends on | [[SOAR-CONFIG-CRITICAL-SECRETS-READINESS]], [[SOAR-CONFIG-PROXY-TRUST]], [[SOAR-CONFIG-RUNTIME-EXECUTION]] |
| Used by | [[SOAR-FEATURE-API-PLATFORM-SAFETY]] |
| UI related |  |
| API related |  |
| Database related | [[SOAR-TEST-API-PLATFORM-SAFETY]] |
| Tests related | [[SOAR-DOC-LOCAL-DEVELOPMENT]] |
| Docs related |  |
| Agent related | [[critical]] |
| Notes |  |

## Relations

- verified_by <- [[SOAR-CONFIG-RUNTIME-EXECUTION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
