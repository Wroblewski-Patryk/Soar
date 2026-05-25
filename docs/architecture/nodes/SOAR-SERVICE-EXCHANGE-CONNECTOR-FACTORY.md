---
id: SOAR-SERVICE-EXCHANGE-CONNECTOR-FACTORY
name: "Exchange connector factory"
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

# Exchange connector factory

| Field | Value |
| --- | --- |
| Description | Factory for public and authenticated exchange connectors with canonical exchange marketType context. |
| File path | apps/api/src/modules/exchange/exchangeConnectorFactory.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-EXCHANGE-REGISTRY]], [[SOAR-SERVICE-CCXT-FUTURES-CONNECTOR]] |
| Used by | [[SOAR-SERVICE-EXCHANGE-AUTH-READ]], [[SOAR-SERVICE-EXCHANGE-PUBLIC-READ]], [[SOAR-SERVICE-LIVE-ORDER-ADAPTER]] |
| UI related |  |
| API related | [[SOAR-SERVICE-EXCHANGE-AUTH-READ]] |
| Database related |  |
| Tests related | [[SOAR-TEST-EXCHANGE-CONNECTOR-FACTORY]] |
| Docs related | [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Agent related |  |
| Notes | Feature modules should consume factory-owned boundaries indirectly. |

## Relations

- uses -> [[SOAR-SERVICE-CCXT-FUTURES-CONNECTOR]] (verified_local)
- uses <- [[SOAR-SERVICE-EXCHANGE-AUTH-READ]] (verified_local)
- uses <- [[SOAR-SERVICE-LIVE-ORDER-ADAPTER]] (verified_local)
- uses <- [[SOAR-SERVICE-EXCHANGE-PUBLIC-READ]] (verified_local)
- uses <- [[SOAR-SERVICE-EXCHANGE-PUBLIC-MARKET-DATA]] (verified_local)
- created_by <- [[SOAR-SERVICE-CCXT-SPOT-CONNECTOR]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
