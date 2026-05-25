---
id: SOAR-SERVICE-MARKET-STREAM-FANOUT
name: "Market stream fanout"
type: service
status: verified_local
layer: backend
module: api-market-stream
feature: api-support-routes
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Market stream fanout

| Field | Value |
| --- | --- |
| Description | Market stream fanout subscription and publish boundary used by the SSE route. |
| File path | apps/api/src/modules/market-stream/marketStreamFanout.ts |
| Related files | apps/api/src/modules/market-stream/exchangePollingStream.service.ts |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-MARKET-STREAM]] |
| Used by | [[SOAR-API-MARKET-STREAM-EVENTS]] |
| UI related |  |
| API related | [[SOAR-API-MARKET-STREAM-EVENTS]] |
| Database related |  |
| Tests related | [[SOAR-TEST-MARKET-STREAM-API]] |
| Docs related | [[SOAR-DOC-API-MARKET-STREAM]] |
| Agent related |  |
| Notes | Fanout is the route-level subscription boundary. |

## Relations

- calls -> [[SOAR-SERVICE-MARKET-STREAM]] (verified_local)
- subscribes_to <- [[SOAR-API-MARKET-STREAM-EVENTS]] (verified_local)
- publishes_to <- [[SOAR-WORKER-MARKET-STREAM-SUBSCRIPTIONS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
