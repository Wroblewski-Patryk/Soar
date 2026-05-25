---
id: SOAR-SERVICE-MARKET-STREAM
name: "Market stream service"
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

# Market stream service

| Field | Value |
| --- | --- |
| Description | Exchange polling stream service layer for symbols and event distribution. |
| File path | apps/api/src/modules/market-stream/exchangePollingStream.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-API-SUPPORT-ROUTES]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-EXCHANGE-PUBLIC-MARKET-DATA]] |
| Used by | [[SOAR-SERVICE-MARKET-STREAM-FANOUT]] |
| UI related |  |
| API related | [[SOAR-API-MARKET-STREAM-EVENTS]] |
| Database related |  |
| Tests related | [[SOAR-TEST-MARKET-STREAM-API]] |
| Docs related | [[SOAR-DOC-API-MARKET-STREAM]] |
| Agent related |  |
| Notes | Backend live-data support boundary. |

## Relations

- uses -> [[SOAR-SERVICE-BINANCE-STREAM]] (verified_local)
- calls <- [[SOAR-SERVICE-MARKET-STREAM-FANOUT]] (verified_local)
- feeds <- [[SOAR-SERVICE-BINANCE-STREAM]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
