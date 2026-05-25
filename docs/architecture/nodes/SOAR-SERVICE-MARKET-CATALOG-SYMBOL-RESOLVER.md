---
id: SOAR-SERVICE-MARKET-CATALOG-SYMBOL-RESOLVER
name: "Market catalog symbol resolver"
type: service
status: verified_local
layer: backend
module: api-markets
feature: markets
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, backend, verified_local]
---

# Market catalog symbol resolver

| Field | Value |
| --- | --- |
| Description | Market catalog and symbol resolver path for catalog-backed universe preview and symbol-group synchronization. |
| File path | apps/api/src/modules/markets/marketCatalogSymbolResolver.service.ts |
| Related files | apps/api/src/lib/symbols.ts |
| Parent | [[SOAR-FEATURE-MARKETS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-EXCHANGE-MARKET-CATALOG]] |
| Used by | [[SOAR-SERVICE-MARKETS]] |
| UI related |  |
| API related | [[SOAR-API-MARKET-CATALOG]], [[SOAR-API-MARKET-UNIVERSE-UPDATE]] |
| Database related | [[SOAR-DB-MARKET-UNIVERSE]], [[SOAR-DB-SYMBOL-GROUP]] |
| Tests related | [[SOAR-TEST-MARKETS-API]] |
| Docs related | [[SOAR-DOC-API-MARKETS]] |
| Agent related |  |
| Notes | Resolver keeps final symbol composition explicit. |

## Relations

- uses <- [[SOAR-SERVICE-MARKETS]] (verified_local)
- used_by <- [[SOAR-LIB-SYMBOLS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
