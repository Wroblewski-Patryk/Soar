---
id: SOAR-TEST-MARKET-DATA-STREAM-ADAPTERS
name: "Market data and stream adapter tests"
type: test
status: verified_local
layer: testing
module: api-market-data
feature: market-data-stream-adapters
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Market data and stream adapter tests

| Field | Value |
| --- | --- |
| Description | Aggregate market data stream exchange adapter and imported position hydrator tests. |
| File path | apps/api/src/modules/market-data/marketData.service.test.ts |
| Related files | apps/api/src/modules/market-data/indicatorAdapter.service.test.ts, apps/api/src/modules/market-stream/binanceStream.service.test.ts, apps/api/src/modules/market-stream/exchangePollingStream.fanout.test.ts, apps/api/src/modules/market-stream/exchangePollingStream.service.test.ts, apps/api/src/modules/market-stream/marketStream.routes.contract.test.ts, apps/api/src/modules/market-stream/marketStreamFanout.test.ts, apps/api/src/modules/exchange/binancePublicRest.service.test.ts, apps/api/src/modules/exchange/binanceUserDataStream.service.test.ts, apps/api/src/modules/positions/importedPositionHistoryHydrator.service.test.ts, apps/api/src/workers/marketStreamSubscriptions.service.test.ts |
| Parent | [[SOAR-FEATURE-MARKET-DATA-STREAM-ADAPTERS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-MARKET-DATA]], [[SOAR-SERVICE-INDICATOR-ADAPTER]], [[SOAR-SERVICE-BINANCE-STREAM]], [[SOAR-SERVICE-BINANCE-PUBLIC-REST]], [[SOAR-SERVICE-BINANCE-USER-DATA-STREAM]], [[SOAR-WORKER-MARKET-STREAM-SUBSCRIPTIONS]], [[SOAR-SERVICE-IMPORTED-POSITION-HISTORY-HYDRATOR]] |
| Used by | [[SOAR-FEATURE-MARKET-DATA-STREAM-ADAPTERS]] |
| UI related |  |
| API related | [[SOAR-API-MARKET-STREAM-EVENTS]], [[SOAR-API-MARKET-CATALOG]], [[SOAR-API-POSITION-LIVE-STATUS]] |
| Database related | [[SOAR-DB-POSITION]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-MARKET-STREAM-API]], [[SOAR-TEST-MARKETS-API]], [[SOAR-TEST-POSITIONS-RECONCILIATION]] |
| Docs related | [[SOAR-DOC-API-MARKET-STREAM]], [[SOAR-DOC-API-MARKETS]], [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Agent related |  |
| Notes | Aggregate market-data proof. |

## Relations

- verified_by <- [[SOAR-FEATURE-MARKET-DATA-STREAM-ADAPTERS]] (verified_local)
- verified_by <- [[SOAR-SERVICE-MARKET-DATA]] (verified_local)
- verified_by <- [[SOAR-SERVICE-INDICATOR-ADAPTER]] (verified_local)
- verified_by <- [[SOAR-SERVICE-BINANCE-STREAM]] (verified_local)
- verified_by <- [[SOAR-WORKER-MARKET-STREAM-SUBSCRIPTIONS]] (verified_local)
- verified_by <- [[SOAR-SERVICE-BINANCE-USER-DATA-STREAM]] (verified_local)
- verified_by <- [[SOAR-SERVICE-IMPORTED-POSITION-HISTORY-HYDRATOR]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
