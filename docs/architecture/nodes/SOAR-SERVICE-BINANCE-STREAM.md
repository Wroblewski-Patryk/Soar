---
id: SOAR-SERVICE-BINANCE-STREAM
name: "Binance stream service"
type: service
status: verified_local
layer: backend
module: api-market-stream
feature: market-data-stream-adapters
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Binance stream service

| Field | Value |
| --- | --- |
| Description | Binance stream adapter for market stream updates. |
| File path | apps/api/src/modules/market-stream/binanceStream.service.ts |
| Related files | apps/api/src/modules/market-stream/binanceStream.service.test.ts, apps/api/src/modules/market-stream/binanceStream.types.ts |
| Parent | [[SOAR-FEATURE-MARKET-DATA-STREAM-ADAPTERS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-MARKET-STREAM]], [[SOAR-SERVICE-BINANCE-PUBLIC-REST]] |
| Used by | [[SOAR-SERVICE-MARKET-STREAM-FANOUT]], [[SOAR-WORKER-MARKET-STREAM-SUBSCRIPTIONS]] |
| UI related |  |
| API related | [[SOAR-API-MARKET-STREAM-EVENTS]] |
| Database related |  |
| Tests related | [[SOAR-TEST-MARKET-DATA-STREAM-ADAPTERS]] |
| Docs related | [[SOAR-DOC-API-MARKET-STREAM]] |
| Agent related |  |
| Notes | Binance stream source. |

## Relations

- feeds -> [[SOAR-SERVICE-MARKET-STREAM]] (verified_local)
- verified_by -> [[SOAR-TEST-MARKET-DATA-STREAM-ADAPTERS]] (verified_local)
- uses <- [[SOAR-SERVICE-MARKET-STREAM]] (verified_local)
- subscribes_to <- [[SOAR-WORKER-MARKET-STREAM-SUBSCRIPTIONS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
