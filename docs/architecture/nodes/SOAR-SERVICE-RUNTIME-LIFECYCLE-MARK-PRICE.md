---
id: SOAR-SERVICE-RUNTIME-LIFECYCLE-MARK-PRICE
name: "Runtime lifecycle mark price service"
type: service
status: verified_local
layer: backend
module: api-engine
feature: engine-runtime-core
risk_level: critical
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Runtime lifecycle mark price service

| Field | Value |
| --- | --- |
| Description | Runtime lifecycle mark price service for position and order lifecycle valuation. |
| File path | apps/api/src/modules/engine/runtimeLifecycleMarkPrice.service.ts |
| Related files | apps/api/src/modules/engine/runtimeLifecycleMarkPrice.service.test.ts |
| Parent | [[SOAR-FEATURE-ENGINE-RUNTIME-CORE]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-RUNTIME-MARKET-DATA-FALLBACK]], [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Used by | [[SOAR-SERVICE-RUNTIME-ORDER-LIFETIME]], [[SOAR-SERVICE-RUNTIME-POSITION-LIFETIME]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-POSITIONS]] |
| Database related | [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]] |
| Tests related | [[SOAR-TEST-ENGINE-RUNTIME-CORE]] |
| Docs related | [[SOAR-DOC-EXECUTION-LIFECYCLE]] |
| Agent related |  |
| Notes | Lifecycle valuation helper. |

## Relations

- uses -> [[SOAR-SERVICE-RUNTIME-MARKET-DATA-FALLBACK]] (verified_local)
- verified_by -> [[SOAR-TEST-ENGINE-RUNTIME-CORE]] (verified_local)
- uses <- [[SOAR-SERVICE-RUNTIME-ORDER-LIFETIME]] (verified_local)
- uses <- [[SOAR-SERVICE-RUNTIME-POSITION-LIFETIME]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
