---
id: SOAR-API-MARKET-STREAM-EVENTS
name: "GET /dashboard/market-stream/events"
type: api_route
status: verified_local
layer: backend
module: api-market-stream
feature: api-support-routes
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, api_route, backend, verified_local]
---

# GET /dashboard/market-stream/events

| Field | Value |
| --- | --- |
| Description | Authenticated SSE market-stream endpoint with bounded symbol subscriptions and heartbeat handling. |
| File path | apps/api/src/modules/market-stream/marketStream.routes.ts |
| Related files | apps/api/src/modules/market-stream/marketStreamFanout.ts, apps/api/src/modules/market-stream/exchangePollingStream.service.ts |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-MARKET-STREAM-FANOUT]], [[SOAR-SERVICE-MARKET-STREAM]] |
| Used by | [[SOAR-ROUTER-DASHBOARD]], [[SOAR-FEATURE-MARKETS]] |
| UI related |  |
| API related | [[SOAR-SERVICE-MARKET-STREAM-FANOUT]] |
| Database related |  |
| Tests related | [[SOAR-TEST-MARKET-STREAM-API]] |
| Docs related | [[SOAR-DOC-API-MARKET-STREAM]] |
| Agent related |  |
| Notes | SSE support route for live market data fanout. |

## Relations

- subscribes_to -> [[SOAR-SERVICE-MARKET-STREAM-FANOUT]] (verified_local)
- verified_by -> [[SOAR-TEST-MARKET-STREAM-API]] (verified_local)
- documented_by -> [[SOAR-DOC-API-MARKET-STREAM]] (verified_local)
- observes -> [[SOAR-WORKER-MARKET-STREAM-SUBSCRIPTIONS]] (verified_local)
- mounts <- [[SOAR-ROUTER-DASHBOARD]] (verified_local)
- observes <- [[SOAR-COMP-LIVE-MARKET-BAR]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
