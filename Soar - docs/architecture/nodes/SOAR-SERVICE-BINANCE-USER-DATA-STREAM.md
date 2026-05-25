---
id: SOAR-SERVICE-BINANCE-USER-DATA-STREAM
name: "Binance user data stream service"
type: service
status: verified_local
layer: backend
module: exchange
feature: market-data-stream-adapters
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Binance user data stream service

| Field | Value |
| --- | --- |
| Description | Binance user data stream adapter for authenticated exchange account events. |
| File path | apps/api/src/modules/exchange/binanceUserDataStream.service.ts |
| Related files | apps/api/src/modules/exchange/binanceUserDataStream.service.test.ts, apps/api/src/modules/exchange/binanceUserDataStream.types.ts |
| Parent | [[SOAR-FEATURE-MARKET-DATA-STREAM-ADAPTERS]] |
| Children |  |
| Depends on | [[SOAR-FEATURE-EXCHANGE-ADAPTER]], [[SOAR-DB-WALLET]] |
| Used by | [[SOAR-SERVICE-LIVE-POSITION-RECONCILIATION]], [[SOAR-SERVICE-ORDER-EXCHANGE-EVENTS]] |
| UI related |  |
| API related | [[SOAR-API-POSITION-LIVE-STATUS]] |
| Database related | [[SOAR-DB-WALLET]], [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]] |
| Tests related | [[SOAR-TEST-MARKET-DATA-STREAM-ADAPTERS]] |
| Docs related | [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Agent related |  |
| Notes | Authenticated exchange stream adapter. |

## Relations

- implements_adapter -> [[SOAR-FEATURE-EXCHANGE-ADAPTER]] (verified_local)
- feeds -> [[SOAR-SERVICE-LIVE-POSITION-RECONCILIATION]] (verified_local)
- verified_by -> [[SOAR-TEST-MARKET-DATA-STREAM-ADAPTERS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
