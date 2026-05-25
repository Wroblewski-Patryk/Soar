---
id: SOAR-SERVICE-PRETRADE
name: "PreTrade service"
type: service
status: verified
layer: backend
module: api-engine
feature: manual-order
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-23
verification_status: verified_local
tags: [soar-map, service, backend, verified]
---

# PreTrade service

| Field | Value |
| --- | --- |
| Description | Pre-trade validation and exchange rule guard used before live execution. |
| File path | apps/api/src/modules/engine/preTrade.service.ts |
| Related files | apps/api/src/modules/engine/preTrade.types.ts |
| Parent | [[SOAR-FEATURE-MANUAL-ORDER]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-ORDER-QUANTITY-RULES]], [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Used by | [[SOAR-SERVICE-ORDERS]] |
| UI related |  |
| API related | [[SOAR-SERVICE-ORDERS]] |
| Database related | [[SOAR-DB-WALLET]] |
| Tests related | [[SOAR-TEST-ORDER-SERVICE]], [[SOAR-TEST-ORDER-POSITIONS-E2E]] |
| Docs related | [[SOAR-DOC-EXECUTION-LIFECYCLE]] |
| Agent related |  |
| Notes | Fail-closed before LIVE exchange placement. |

## Relations

- uses -> [[SOAR-SERVICE-ORDER-QUANTITY-RULES]] (verified_local)
- uses -> [[SOAR-SERVICE-EXCHANGE-SYMBOL-RULES]] (verified_local)
- uses <- [[SOAR-SERVICE-ORDERS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
