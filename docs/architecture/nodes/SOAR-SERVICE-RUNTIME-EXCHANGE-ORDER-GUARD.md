---
id: SOAR-SERVICE-RUNTIME-EXCHANGE-ORDER-GUARD
name: "Runtime exchange order guard service"
type: service
status: verified_local
layer: backend
module: api-engine
feature: engine-runtime-core
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Runtime exchange order guard service

| Field | Value |
| --- | --- |
| Description | Runtime exchange order guard for fail-closed order placement authority. |
| File path | apps/api/src/modules/engine/runtimeExchangeOrderGuard.service.ts |
| Related files | apps/api/src/modules/engine/runtimeExchangeOrderGuard.service.test.ts |
| Parent | [[SOAR-FEATURE-ENGINE-RUNTIME-CORE]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-EXCHANGE-ADAPTER]], [[SOAR-SERVICE-PRETRADE-RISK]] |
| Used by | [[SOAR-SERVICE-RUNTIME-AUTOMATION]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-CLOSE-POSITION]], [[SOAR-API-ORDER-OPEN]] |
| Database related | [[SOAR-DB-ORDER]], [[SOAR-DB-WALLET]] |
| Tests related | [[SOAR-TEST-ENGINE-RUNTIME-CORE]] |
| Docs related | [[SOAR-DOC-EXECUTION-LIFECYCLE]] |
| Agent related |  |
| Notes | Runtime exchange mutation guard. |

## Relations

- checks -> [[SOAR-SERVICE-PRETRADE-RISK]] (verified_local)
- checks -> [[SOAR-FEATURE-EXCHANGE-ADAPTER]] (verified_local)
- verified_by -> [[SOAR-TEST-ENGINE-RUNTIME-CORE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
