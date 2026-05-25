---
id: SOAR-SERVICE-RUNTIME-STRATEGY-DISPLAY-BY-SYMBOL
name: "Runtime strategy display by symbol service"
type: service
status: verified_local
layer: backend
module: api-bots
feature: runtime-support-services
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Runtime strategy display by symbol service

| Field | Value |
| --- | --- |
| Description | Builds per-symbol strategy display state for runtime monitoring. |
| File path | apps/api/src/modules/bots/runtimeStrategyDisplayBySymbol.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-RUNTIME-STRATEGY-CONFIG-PARSER]], [[SOAR-SERVICE-RUNTIME-SYMBOL-UNIVERSE]] |
| Used by | [[SOAR-SERVICE-RUNTIME-AGGREGATE]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-SYMBOL-STATS]] |
| Database related |  |
| Tests related | [[SOAR-TEST-RUNTIME-STRATEGY-CONTEXT]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Per-symbol runtime display support. |

## Relations

- calls -> [[SOAR-SERVICE-RUNTIME-STRATEGY-CONFIG-PARSER]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
