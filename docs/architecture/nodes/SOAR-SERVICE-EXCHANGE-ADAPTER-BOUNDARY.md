---
id: SOAR-SERVICE-EXCHANGE-ADAPTER-BOUNDARY
name: "Exchange adapter boundary service"
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

# Exchange adapter boundary service

| Field | Value |
| --- | --- |
| Description | Exact operation boundary for supported exchange balance preview positions open orders trade history wallet cashflow and live cancel operations. |
| File path | apps/api/src/modules/exchange/exchangeAdapterBoundary.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-EXCHANGE-EXECUTION-CAPABILITY]], [[SOAR-SERVICE-EXCHANGE-AUTH-READ]], [[SOAR-SERVICE-EXCHANGE-CONNECTOR-FACTORY]] |
| Used by | [[SOAR-SERVICE-ORDERS]], [[SOAR-SERVICE-RUNTIME-POSITION-COMMAND]], [[SOAR-SERVICE-POSITIONS]] |
| UI related |  |
| API related | [[SOAR-API-ORDER-CANCEL]], [[SOAR-API-POSITION-EXCHANGE-SNAPSHOT]] |
| Database related | [[SOAR-DB-WALLET]], [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]] |
| Tests related | [[SOAR-TEST-EXCHANGE-ADAPTER-BOUNDARY]] |
| Docs related | [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Agent related |  |
| Notes | Central boundary for operation support and authenticated connector use. |

## Relations

- governed_by -> [[SOAR-SERVICE-EXCHANGE-EXECUTION-CAPABILITY]] (verified_local)
- uses -> [[SOAR-SERVICE-EXCHANGE-AUTH-READ]] (verified_local)
- uses <- [[SOAR-SERVICE-ORDERS]] (verified_local)
- uses <- [[SOAR-SERVICE-WALLETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
