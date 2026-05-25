---
id: SOAR-SERVICE-CCXT-SPOT-CONNECTOR
name: "CCXT spot connector"
type: service
status: verified_local
layer: backend
module: exchange
feature: market-data-stream-adapters
risk_level: high
completion_percent: 85
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# CCXT spot connector

| Field | Value |
| --- | --- |
| Description | CCXT spot connector wrapper for spot exchange public and authenticated reads. |
| File path | apps/api/src/modules/exchange/ccxtSpotConnector.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-MARKET-DATA-STREAM-ADAPTERS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-EXCHANGE-CONNECTOR-FACTORY]] |
| Used by | [[SOAR-SERVICE-EXCHANGE-PUBLIC-READ]], [[SOAR-SERVICE-EXCHANGE-PUBLIC-MARKET-DATA]] |
| UI related |  |
| API related | [[SOAR-API-MARKET-CATALOG]] |
| Database related |  |
| Tests related | [[SOAR-TEST-EXCHANGE-CONNECTOR-FACTORY]] |
| Docs related | [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Agent related |  |
| Notes | Spot connector implementation. |

## Relations

- created_by -> [[SOAR-SERVICE-EXCHANGE-CONNECTOR-FACTORY]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
