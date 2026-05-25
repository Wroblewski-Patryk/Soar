---
id: SOAR-WORKER-MARKET-STREAM-SUBSCRIPTIONS
name: "Market stream subscriptions worker"
type: worker
status: verified_local
layer: backend
module: api-market-stream
feature: market-data-stream-adapters
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, worker, backend, verified_local]
---

# Market stream subscriptions worker

| Field | Value |
| --- | --- |
| Description | Worker service managing market stream subscriptions for live dashboard and runtime consumers. |
| File path | apps/api/src/workers/marketStreamSubscriptions.service.ts |
| Related files | apps/api/src/workers/marketStreamSubscriptions.service.test.ts |
| Parent | [[SOAR-FEATURE-MARKET-DATA-STREAM-ADAPTERS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-MARKET-STREAM]], [[SOAR-SERVICE-BINANCE-STREAM]], [[SOAR-SERVICE-MARKET-STREAM-FANOUT]] |
| Used by | [[SOAR-API-MARKET-STREAM-EVENTS]], [[SOAR-FEATURE-DASHBOARD-RUNTIME]] |
| UI related |  |
| API related | [[SOAR-API-MARKET-STREAM-EVENTS]] |
| Database related |  |
| Tests related | [[SOAR-TEST-MARKET-DATA-STREAM-ADAPTERS]] |
| Docs related | [[SOAR-DOC-API-MARKET-STREAM]] |
| Agent related |  |
| Notes | Market stream worker subscriptions. |

## Relations

- publishes_to -> [[SOAR-SERVICE-MARKET-STREAM-FANOUT]] (verified_local)
- subscribes_to -> [[SOAR-SERVICE-BINANCE-STREAM]] (verified_local)
- verified_by -> [[SOAR-TEST-MARKET-DATA-STREAM-ADAPTERS]] (verified_local)
- observes <- [[SOAR-API-MARKET-STREAM-EVENTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
