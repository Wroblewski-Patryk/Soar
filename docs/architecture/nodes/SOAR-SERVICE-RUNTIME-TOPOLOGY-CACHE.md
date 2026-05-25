---
id: SOAR-SERVICE-RUNTIME-TOPOLOGY-CACHE
name: "Runtime topology cache service"
type: service
status: verified_local
layer: backend
module: api-engine
feature: engine-runtime-core
risk_level: critical
completion_percent: 80
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Runtime topology cache service

| Field | Value |
| --- | --- |
| Description | Runtime topology cache service for bot strategy market and exchange execution context. |
| File path | apps/api/src/modules/engine/runtimeTopologyCache.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-ENGINE-RUNTIME-CORE]] |
| Children |  |
| Depends on | [[SOAR-DB-BOT]], [[SOAR-DB-STRATEGY]], [[SOAR-DB-MARKET-UNIVERSE]], [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Used by | [[SOAR-SERVICE-RUNTIME-SCAN-LOOP]], [[SOAR-SERVICE-RUNTIME-SIGNAL-LOOP]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-STRATEGY]], [[SOAR-DB-MARKET-UNIVERSE]] |
| Tests related | [[SOAR-TEST-ENGINE-RUNTIME-CORE]] |
| Docs related | [[SOAR-DOC-EXECUTION-LIFECYCLE]] |
| Agent related |  |
| Notes | Runtime context cache. |

## Relations

- uses <- [[SOAR-SERVICE-RUNTIME-SIGNAL-LOOP]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
