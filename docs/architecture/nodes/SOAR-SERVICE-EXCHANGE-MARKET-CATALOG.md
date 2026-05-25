---
id: SOAR-SERVICE-EXCHANGE-MARKET-CATALOG
name: "Exchange market catalog service"
type: service
status: verified_local
layer: backend
module: exchange
feature: exchange-adapter
risk_level: high
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Exchange market catalog service

| Field | Value |
| --- | --- |
| Description | Exchange market catalog and metadata resolver. |
| File path | apps/api/src/modules/exchange/exchangeMarketCatalog.service.ts |
| Related files | apps/api/src/modules/exchange/exchangeMetadataContract.service.ts |
| Parent | [[SOAR-FEATURE-EXCHANGE-ADAPTER]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-EXCHANGE-PUBLIC-READ]] |
| Used by | [[SOAR-SERVICE-EXCHANGE-SYMBOL-RULES]], [[SOAR-SERVICE-MANUAL-CONTEXT]] |
| UI related |  |
| API related | [[SOAR-API-MANUAL-CONTEXT]] |
| Database related |  |
| Tests related | [[SOAR-TEST-EXCHANGE-MARKET-CATALOG]] |
| Docs related | [[SOAR-DOC-EXCHANGE-OWNERSHIP]] |
| Agent related |  |
| Notes | Market catalog support is distinct from live execution support. |

## Relations

- uses -> [[SOAR-SERVICE-EXCHANGE-PUBLIC-READ]] (verified_local)
- uses <- [[SOAR-SERVICE-WALLETS]] (verified_local)
- uses <- [[SOAR-SERVICE-MARKETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
