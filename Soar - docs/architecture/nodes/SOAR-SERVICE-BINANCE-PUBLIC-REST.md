---
id: SOAR-SERVICE-BINANCE-PUBLIC-REST
name: "Binance public REST service"
type: service
status: verified_local
layer: backend
module: exchange
feature: market-data-stream-adapters
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Binance public REST service

| Field | Value |
| --- | --- |
| Description | Binance public REST adapter used by exchange public market data reads. |
| File path | apps/api/src/modules/exchange/binancePublicRest.service.ts |
| Related files | apps/api/src/modules/exchange/binancePublicRest.service.test.ts |
| Parent | [[SOAR-FEATURE-MARKET-DATA-STREAM-ADAPTERS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-EXCHANGE-PUBLIC-MARKET-DATA]] |
| Used by | [[SOAR-SERVICE-MARKET-DATA]], [[SOAR-SERVICE-MARKET-STREAM]] |
| UI related |  |
| API related | [[SOAR-API-MARKET-CATALOG]] |
| Database related |  |
| Tests related | [[SOAR-TEST-MARKET-DATA-STREAM-ADAPTERS]] |
| Docs related | [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Agent related |  |
| Notes | Binance public read adapter. |

## Relations

- uses <- [[SOAR-SERVICE-MARKET-DATA]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
