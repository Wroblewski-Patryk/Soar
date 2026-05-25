---
id: SOAR-WORKFLOW-MARKET-DATA-STREAM-ADAPTERS-CHAIN
name: "Market data stream adapters workflow"
type: workflow
status: verified_local
layer: backend
module: api-market-data
feature: market-data-stream-adapters
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, workflow, backend, verified_local]
---

# Market data stream adapters workflow

| Field | Value |
| --- | --- |
| Description | Workflow from exchange public data through market data indicator adapter stream fanout worker and imported position hydrator tests and docs. |
| File path | docs/architecture/chains/chains.csv |
| Related files | docs/architecture/chains/CHAIN-MARKET-DATA-STREAM-ADAPTERS.md |
| Parent | [[SOAR-FEATURE-MARKET-DATA-STREAM-ADAPTERS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-BINANCE-PUBLIC-REST]], [[SOAR-SERVICE-BINANCE-USER-DATA-STREAM]], [[SOAR-SERVICE-CCXT-SPOT-CONNECTOR]], [[SOAR-SERVICE-MARKET-DATA]], [[SOAR-SERVICE-INDICATOR-ADAPTER]], [[SOAR-SERVICE-BINANCE-STREAM]], [[SOAR-WORKER-MARKET-STREAM-SUBSCRIPTIONS]], [[SOAR-SERVICE-IMPORTED-POSITION-HISTORY-HYDRATOR]] |
| Used by | [[SOAR-AGENT-COORDINATOR]] |
| UI related |  |
| API related | [[SOAR-API-MARKET-CATALOG]], [[SOAR-API-MARKET-STREAM-EVENTS]], [[SOAR-API-POSITION-LIVE-STATUS]] |
| Database related | [[SOAR-DB-POSITION]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-MARKET-DATA-STREAM-ADAPTERS]] |
| Docs related | [[SOAR-DOC-API-MARKETS]], [[SOAR-DOC-API-MARKET-STREAM]], [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Backfill workflow node for market data stream adapter drift slice. |

## Relations

- No explicit relations recorded yet.

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
