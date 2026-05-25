---
id: SOAR-SERVICE-RUNTIME-METRICS
name: "Runtime metrics service"
type: service
status: verified_local
layer: backend
module: api-engine
feature: engine-runtime-core
risk_level: high
completion_percent: 80
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Runtime metrics service

| Field | Value |
| --- | --- |
| Description | Runtime metrics service for engine runtime observability and monitoring counters. |
| File path | apps/api/src/modules/engine/runtimeMetrics.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-ENGINE-RUNTIME-CORE]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-RUNTIME-TELEMETRY]] |
| Used by | [[SOAR-SERVICE-RUNTIME-SCAN-LOOP]], [[SOAR-SERVICE-RUNTIME-SIGNAL-LOOP]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related |  |
| Tests related | [[SOAR-TEST-ENGINE-RUNTIME-CORE]] |
| Docs related | [[SOAR-DOC-EXECUTION-LIFECYCLE]] |
| Agent related |  |
| Notes | Runtime metrics source. |

## Relations

- feeds -> [[SOAR-SERVICE-RUNTIME-TELEMETRY]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
