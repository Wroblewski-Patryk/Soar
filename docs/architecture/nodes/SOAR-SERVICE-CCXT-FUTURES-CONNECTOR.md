---
id: SOAR-SERVICE-CCXT-FUTURES-CONNECTOR
name: "CCXT futures connector"
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

# CCXT futures connector

| Field | Value |
| --- | --- |
| Description | CCXT futures connector wrapper for public and authenticated futures operations. |
| File path | apps/api/src/modules/exchange/ccxtFuturesConnector.service.ts |
| Related files | apps/api/src/modules/exchange/ccxtFuturesConnector.client.ts, apps/api/src/modules/exchange/ccxtFuturesConnector.types.ts |
| Parent | [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Children |  |
| Depends on | [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Used by | [[SOAR-SERVICE-EXCHANGE-CONNECTOR-FACTORY]], [[SOAR-SERVICE-LIVE-ORDER-ADAPTER]] |
| UI related |  |
| API related | [[SOAR-SERVICE-LIVE-ORDER-ADAPTER]] |
| Database related |  |
| Tests related | [[SOAR-TEST-CCXT-FUTURES-CONNECTOR]] |
| Docs related | [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Agent related |  |
| Notes | Connector implementation is below exchange-owned boundary. |

## Relations

- uses <- [[SOAR-SERVICE-EXCHANGE-CONNECTOR-FACTORY]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
