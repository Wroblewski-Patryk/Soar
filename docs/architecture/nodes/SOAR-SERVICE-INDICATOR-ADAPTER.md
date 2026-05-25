---
id: SOAR-SERVICE-INDICATOR-ADAPTER
name: "Indicator adapter service"
type: service
status: verified_local
layer: backend
module: api-market-data
feature: market-data-stream-adapters
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Indicator adapter service

| Field | Value |
| --- | --- |
| Description | Indicator adapter service for strategy and runtime signal indicator calculations. |
| File path | apps/api/src/modules/market-data/indicatorAdapter.service.ts |
| Related files | apps/api/src/modules/market-data/indicatorAdapter.types.ts, apps/api/src/modules/market-data/indicatorAdapter.service.test.ts |
| Parent | [[SOAR-FEATURE-MARKET-DATA-STREAM-ADAPTERS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-MARKET-DATA]], [[SOAR-FEATURE-STRATEGIES]] |
| Used by | [[SOAR-SERVICE-RUNTIME-SIGNAL-LOOP]], [[SOAR-SERVICE-RUNTIME-SIGNAL-INDICATORS]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]] |
| Database related |  |
| Tests related | [[SOAR-TEST-MARKET-DATA-STREAM-ADAPTERS]] |
| Docs related | [[SOAR-DOC-API-MARKETS]] |
| Agent related |  |
| Notes | Runtime indicator calculation adapter. |

## Relations

- uses -> [[SOAR-SERVICE-MARKET-DATA]] (verified_local)
- verified_by -> [[SOAR-TEST-MARKET-DATA-STREAM-ADAPTERS]] (verified_local)
- uses <- [[SOAR-SERVICE-RUNTIME-SIGNAL-LOOP]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
