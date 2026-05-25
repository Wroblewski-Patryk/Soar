---
id: SOAR-SERVICE-RUNTIME-SYMBOL-CATALOG-RESOLVER
name: "Runtime symbol catalog resolver service"
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

# Runtime symbol catalog resolver service

| Field | Value |
| --- | --- |
| Description | Resolves runtime symbol catalog context from exchange/market universe data. |
| File path | apps/api/src/modules/bots/runtimeSymbolCatalogResolver.service.ts |
| Related files |  |
| Parent | [[SOAR-FEATURE-RUNTIME-SUPPORT-SERVICES]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-EXCHANGE-MARKET-CATALOG]], [[SOAR-DB-MARKET-UNIVERSE]] |
| Used by | [[SOAR-SERVICE-RUNTIME-SYMBOL-UNIVERSE]] |
| UI related |  |
| API related | [[SOAR-API-BOT-RUNTIME-SYMBOL-STATS]] |
| Database related | [[SOAR-DB-MARKET-UNIVERSE]] |
| Tests related | [[SOAR-TEST-RUNTIME-STRATEGY-CONTEXT]] |
| Docs related | [[SOAR-DOC-API-BOTS]] |
| Agent related |  |
| Notes | Runtime symbol catalog support. |

## Relations

- calls <- [[SOAR-SERVICE-RUNTIME-SYMBOL-UNIVERSE]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
