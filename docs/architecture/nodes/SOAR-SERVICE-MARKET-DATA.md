---
id: SOAR-SERVICE-MARKET-DATA
name: "Market data service"
type: service
status: verified_local
layer: backend
module: api-market-data
feature: market-data-stream-adapters
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Market data service

| Field | Value |
| --- | --- |
| Description | Market data service for candle and indicator source data. |
| File path | apps/api/src/modules/market-data/marketData.service.ts |
| Related files | apps/api/src/modules/market-data/marketData.types.ts, apps/api/src/modules/market-data/marketData.service.test.ts |
| Parent | [[SOAR-FEATURE-MARKET-DATA-STREAM-ADAPTERS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-BINANCE-PUBLIC-REST]], [[SOAR-SERVICE-EXCHANGE-PUBLIC-MARKET-DATA]] |
| Used by | [[SOAR-SERVICE-RUNTIME-SIGNAL-LOOP]], [[SOAR-SERVICE-RUNTIME-MARKET-DATA-FALLBACK]] |
| UI related |  |
| API related | [[SOAR-API-MARKET-CATALOG]] |
| Database related |  |
| Tests related | [[SOAR-TEST-MARKET-DATA-STREAM-ADAPTERS]] |
| Docs related | [[SOAR-DOC-API-MARKETS]] |
| Agent related |  |
| Notes | Runtime market-data source service. |

## Relations

- uses -> [[SOAR-SERVICE-BINANCE-PUBLIC-REST]] (verified_local)
- uses -> [[SOAR-SERVICE-EXCHANGE-PUBLIC-MARKET-DATA]] (verified_local)
- verified_by -> [[SOAR-TEST-MARKET-DATA-STREAM-ADAPTERS]] (verified_local)
- has_service <- [[SOAR-FEATURE-MARKET-DATA-STREAM-ADAPTERS]] (verified_local)
- uses <- [[SOAR-SERVICE-INDICATOR-ADAPTER]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
