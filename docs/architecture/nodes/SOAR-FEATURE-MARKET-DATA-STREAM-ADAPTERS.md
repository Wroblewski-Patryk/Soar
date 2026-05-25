---
id: SOAR-FEATURE-MARKET-DATA-STREAM-ADAPTERS
name: "Market data and stream adapters"
type: feature
status: verified_local
layer: backend
module: api-market-data
feature: market-data-stream-adapters
risk_level: critical
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, feature, backend, verified_local]
---

# Market data and stream adapters

| Field | Value |
| --- | --- |
| Description | Exchange public data adapters market-data services stream worker subscriptions and imported position hydration mapping. |
| File path | docs/modules/api-market-data.md |
| Related files | docs/modules/api-market-stream.md, docs/modules/api-exchange.md |
| Parent |  |
| Children | [[SOAR-SERVICE-BINANCE-PUBLIC-REST]], [[SOAR-SERVICE-BINANCE-USER-DATA-STREAM]], [[SOAR-SERVICE-CCXT-SPOT-CONNECTOR]], [[SOAR-SERVICE-MARKET-DATA]], [[SOAR-SERVICE-INDICATOR-ADAPTER]], [[SOAR-SERVICE-BINANCE-STREAM]], [[SOAR-WORKER-MARKET-STREAM-SUBSCRIPTIONS]], [[SOAR-SERVICE-IMPORTED-POSITION-HISTORY-HYDRATOR]] |
| Depends on | [[SOAR-FEATURE-EXCHANGE-ADAPTER]], [[SOAR-FEATURE-MARKETS]] |
| Used by | [[SOAR-FEATURE-ENGINE-RUNTIME-CORE]], [[SOAR-FEATURE-POSITIONS]], [[SOAR-FEATURE-DASHBOARD-RUNTIME]] |
| UI related |  |
| API related | [[SOAR-API-MARKET-CATALOG]], [[SOAR-API-MARKET-STREAM-EVENTS]], [[SOAR-API-POSITION-LIVE-STATUS]] |
| Database related | [[SOAR-DB-POSITION]], [[SOAR-DB-RUNTIME-SESSION]] |
| Tests related | [[SOAR-TEST-MARKET-DATA-STREAM-ADAPTERS]] |
| Docs related | [[SOAR-DOC-API-MARKETS]], [[SOAR-DOC-API-MARKET-STREAM]], [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Backfilled from remaining backend market-data drift. |

## Relations

- has_service -> [[SOAR-SERVICE-MARKET-DATA]] (verified_local)
- verified_by -> [[SOAR-TEST-MARKET-DATA-STREAM-ADAPTERS]] (verified_local)
- documented_by -> [[SOAR-DOC-API-MARKET-STREAM]] (verified_local)
- documented_by -> [[SOAR-DOC-API-MARKETS]] (verified_local)
- documented_by -> [[SOAR-DOC-EXCHANGE-OWNERSHIP]] (verified_local)
- verified_by -> [[SOAR-TEST-API-INFRASTRUCTURE-RESIDUAL]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
