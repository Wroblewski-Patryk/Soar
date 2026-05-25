---
id: SOAR-SERVICE-RUNTIME-TELEMETRY
name: "Runtime telemetry service"
type: service
status: verified_local
layer: backend
module: api-engine
feature: engine-runtime-core
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Runtime telemetry service

| Field | Value |
| --- | --- |
| Description | Runtime telemetry service for runtime signal and execution observability events. |
| File path | apps/api/src/modules/engine/runtimeTelemetry.service.ts |
| Related files | apps/api/src/modules/engine/runtimeTelemetry.service.test.ts |
| Parent | [[SOAR-FEATURE-ENGINE-RUNTIME-CORE]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-RUNTIME-METRICS]], [[SOAR-DB-RUNTIME-SESSION]] |
| Used by | [[SOAR-SERVICE-RUNTIME-SCAN-LOOP]], [[SOAR-SERVICE-RUNTIME-SIGNAL-LOOP]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-RUNTIME-SESSION]] |
| Tests related | [[SOAR-TEST-ENGINE-RUNTIME-CORE]] |
| Docs related | [[SOAR-DOC-EXECUTION-LIFECYCLE]] |
| Agent related |  |
| Notes | Runtime telemetry source. |

## Relations

- observes -> [[SOAR-DB-RUNTIME-SESSION]] (verified_local)
- verified_by -> [[SOAR-TEST-ENGINE-RUNTIME-CORE]] (verified_local)
- feeds <- [[SOAR-SERVICE-RUNTIME-METRICS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
