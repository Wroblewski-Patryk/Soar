---
id: SOAR-SERVICE-EXCHANGE-REGISTRY
name: "Exchange registry and connectors"
type: service
status: verified
layer: backend
module: exchange
feature: exchange-adapter
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-23
verification_status: verified_local
tags: [soar-map, service, backend, verified]
---

# Exchange registry and connectors

| Field | Value |
| --- | --- |
| Description | Exchange connector registry and operation capability resolution. |
| File path | apps/api/src/modules/exchange |
| Related files | apps/api/src/modules/exchange/exchangeAdapterRegistry.service.ts |
| Parent | [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Children |  |
| Depends on | [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Used by | [[SOAR-SERVICE-ORDERS]], [[SOAR-FEATURE-RUNTIME-DCA-PNL]] |
| UI related |  |
| API related | [[SOAR-SERVICE-ORDERS]] |
| Database related |  |
| Tests related | [[SOAR-TEST-EXCHANGE-ADAPTER]] |
| Docs related | [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Agent related |  |
| Notes | Directory node until individual connector backfill is complete. |

## Relations

- owns <- [[SOAR-FEATURE-EXCHANGE-ADAPTER]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
