---
id: SOAR-SERVICE-LIVE-ORDER-ADAPTER
name: "Live order adapter service"
type: service
status: verified_local
layer: backend
module: exchange
feature: exchange-adapter
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Live order adapter service

| Field | Value |
| --- | --- |
| Description | LIVE order submit adapter with retry fill fee metadata and connector-owned execution. |
| File path | apps/api/src/modules/exchange/liveOrderAdapter.service.ts |
| Related files | apps/api/src/modules/exchange/liveOrderAdapter.types.ts |
| Parent | [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-EXCHANGE-CONNECTOR-FACTORY]], [[SOAR-SERVICE-LIVE-FEE-RECONCILIATION]] |
| Used by | [[SOAR-SERVICE-ORDERS]], [[SOAR-SERVICE-EXECUTION-ORCHESTRATOR]] |
| UI related |  |
| API related | [[SOAR-API-ORDER-OPEN]] |
| Database related | [[SOAR-DB-ORDER]], [[SOAR-DB-ORDER-FILL]] |
| Tests related | [[SOAR-TEST-LIVE-ORDER-ADAPTER]] |
| Docs related | [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Agent related |  |
| Notes | Local adapter proof is not production LIVE mutation proof. |

## Relations

- uses -> [[SOAR-SERVICE-EXCHANGE-CONNECTOR-FACTORY]] (verified_local)
- uses -> [[SOAR-SERVICE-LIVE-FEE-RECONCILIATION]] (verified_local)
- uses <- [[SOAR-SERVICE-ORDERS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
