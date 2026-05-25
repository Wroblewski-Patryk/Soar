---
id: SOAR-SERVICE-RUNTIME-MARKET-DATA-FALLBACK
name: "Runtime market data fallback service"
type: service
status: verified_local
layer: backend
module: api-bots
feature: runtime-support-services
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Runtime market data fallback service

| Field | Value |
| --- | --- |
| Description | Fallback market-data support for runtime display and decisions. |
| File path | apps/api/src/modules/bots/runtimeMarketDataFallback.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-EXCHANGE-PUBLIC-MARKET-DATA]] |
| Used by | [[SOAR-SERVICE-RUNTIME-AUTOMATION]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related |  |
| Tests related | [[SOAR-TEST-RUNTIME-SUPPORT-SERVICES]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Fallback support service for runtime market data. |

## Relations

- calls <- [[SOAR-SERVICE-RUNTIME-MARKET-TRUTH-STATE]] (verified_local)
- uses <- [[SOAR-SERVICE-RUNTIME-LIFECYCLE-MARK-PRICE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
