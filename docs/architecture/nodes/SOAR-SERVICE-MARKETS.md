---
id: SOAR-SERVICE-MARKETS
name: "Markets service"
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

# Markets service

| Field | Value |
| --- | --- |
| Description | Market universe CRUD catalog resolution active-bot guard backtest-history guard and symbol-group sync service. |
| File path | apps/api/src/modules/markets/markets.service.ts |
| Related files | apps/api/src/modules/markets/markets.errors.ts |
| Parent | [[SOAR-FEATURE-MARKETS]] |
| Children |  |
| Depends on | [[SOAR-DB-MARKET-UNIVERSE]], [[SOAR-DB-SYMBOL-GROUP]], [[SOAR-DB-BOT]], [[SOAR-DB-BOT-MARKET-GROUP]], [[SOAR-SERVICE-MARKET-CATALOG-SYMBOL-RESOLVER]], [[SOAR-SERVICE-EXCHANGE-MARKET-CATALOG]] |
| Used by | [[SOAR-CONTROLLER-MARKETS]], [[SOAR-FEATURE-BOT-SETUP]], [[SOAR-FEATURE-BOT-RUNTIME]] |
| UI related |  |
| API related | [[SOAR-API-MARKET-UNIVERSE-LIST]], [[SOAR-API-MARKET-UNIVERSE-GET]], [[SOAR-API-MARKET-CATALOG]], [[SOAR-API-MARKET-UNIVERSE-CREATE]], [[SOAR-API-MARKET-UNIVERSE-UPDATE]], [[SOAR-API-MARKET-UNIVERSE-DELETE]] |
| Database related | [[SOAR-DB-MARKET-UNIVERSE]], [[SOAR-DB-SYMBOL-GROUP]], [[SOAR-DB-BOT]], [[SOAR-DB-BOT-MARKET-GROUP]] |
| Tests related | [[SOAR-TEST-MARKETS-API]] |
| Docs related | [[SOAR-DOC-API-MARKETS]] |
| Agent related |  |
| Notes | Service owns market universe persistence and guard checks. |

## Relations

- uses -> [[SOAR-SERVICE-EXCHANGE-MARKET-CATALOG]] (verified_local)
- uses -> [[SOAR-SERVICE-MARKET-CATALOG-SYMBOL-RESOLVER]] (verified_local)
- reads_writes -> [[SOAR-DB-MARKET-UNIVERSE]] (verified_local)
- reads_writes -> [[SOAR-DB-SYMBOL-GROUP]] (verified_local)
- guards_against -> [[SOAR-DB-BOT]] (verified_local)
- guards_against -> [[SOAR-DB-BOT-MARKET-GROUP]] (verified_local)
- calls <- [[SOAR-CONTROLLER-MARKETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
