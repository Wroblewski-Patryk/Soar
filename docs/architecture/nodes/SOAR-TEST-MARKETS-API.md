---
id: SOAR-TEST-MARKETS-API
name: "Markets API tests"
type: test
status: verified_local
layer: testing
module: api-markets
feature: markets
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Markets API tests

| Field | Value |
| --- | --- |
| Description | Markets API e2e tests for universe CRUD catalog filtering symbol composition active-bot guards and backtest-history delete protection. |
| File path | apps/api/src/modules/markets/markets.e2e.test.ts |
| Related files | apps/api/src/modules/backtests/backtests.e2e.test.ts |
| Parent | [[SOAR-FEATURE-MARKETS]] |
| Children |  |
| Depends on | [[SOAR-API-MARKET-UNIVERSE-LIST]], [[SOAR-API-MARKET-CATALOG]], [[SOAR-API-MARKET-UNIVERSE-CREATE]], [[SOAR-API-MARKET-UNIVERSE-UPDATE]], [[SOAR-API-MARKET-UNIVERSE-DELETE]], [[SOAR-SERVICE-MARKETS]] |
| Used by | [[SOAR-FEATURE-MARKETS]] |
| UI related |  |
| API related | [[SOAR-API-MARKET-UNIVERSE-LIST]], [[SOAR-API-MARKET-CATALOG]], [[SOAR-API-MARKET-UNIVERSE-CREATE]], [[SOAR-API-MARKET-UNIVERSE-UPDATE]], [[SOAR-API-MARKET-UNIVERSE-DELETE]] |
| Database related | [[SOAR-DB-MARKET-UNIVERSE]], [[SOAR-DB-SYMBOL-GROUP]], [[SOAR-DB-BOT]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-API-MARKETS]] |
| Agent related |  |
| Notes | Primary API proof node. |

## Relations

- verified_by <- [[SOAR-FEATURE-MARKETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
