---
id: SOAR-TEST-MARKET-STREAM-API
name: "Market stream API tests"
type: test
status: verified_local
layer: testing
module: api-market-stream
feature: api-support-routes
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Market stream API tests

| Field | Value |
| --- | --- |
| Description | Market stream SSE route e2e tests. |
| File path | apps/api/src/modules/market-stream/marketStream.routes.e2e.test.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-API-MARKET-STREAM-EVENTS]], [[SOAR-SERVICE-MARKET-STREAM-FANOUT]] |
| Used by | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| UI related |  |
| API related | [[SOAR-API-MARKET-STREAM-EVENTS]] |
| Database related |  |
| Tests related | [[SOAR-TEST-API-SUPPORT-ROUTES]] |
| Docs related | [[SOAR-DOC-API-MARKET-STREAM]] |
| Agent related |  |
| Notes | Primary market-stream route proof. |

## Relations

- verified_by <- [[SOAR-API-MARKET-STREAM-EVENTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
