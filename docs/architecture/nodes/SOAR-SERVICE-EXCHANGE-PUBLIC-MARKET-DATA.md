---
id: SOAR-SERVICE-EXCHANGE-PUBLIC-MARKET-DATA
name: "Exchange public market data service"
type: service
status: verified_local
layer: backend
module: exchange
feature: exchange-adapter
risk_level: high
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Exchange public market data service

| Field | Value |
| --- | --- |
| Description | Public ticker candle and derivative series reader through exchange-owned connectors. |
| File path | apps/api/src/modules/exchange/exchangePublicMarketData.service.ts |
| Related files | apps/api/src/modules/exchange/ccxtPublicMarketDataNormalizer.ts |
| Parent | [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-EXCHANGE-CONNECTOR-FACTORY]] |
| Used by | [[SOAR-FEATURE-RUNTIME-DCA-PNL]], [[SOAR-SERVICE-RUNTIME-AUTOMATION]] |
| UI related |  |
| API related | [[SOAR-SERVICE-RUNTIME-AUTOMATION]] |
| Database related |  |
| Tests related | [[SOAR-TEST-EXCHANGE-PUBLIC-MARKET-DATA]] |
| Docs related | [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Agent related |  |
| Notes | Prevents reusing Binance market data for other exchanges. |

## Relations

- uses -> [[SOAR-SERVICE-EXCHANGE-CONNECTOR-FACTORY]] (verified_local)
- uses <- [[SOAR-SERVICE-RUNTIME-AUTOMATION]] (verified_local)
- uses <- [[SOAR-SERVICE-MARKET-DATA]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
