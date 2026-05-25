---
id: SOAR-FEATURE-MARKETS
name: "Market universe authoring"
type: feature
status: verified_local
layer: fullstack
module: markets
feature: markets
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, feature, fullstack, verified_local]
---

# Market universe authoring

| Field | Value |
| --- | --- |
| Description | Market universe CRUD exchange catalog symbol composition active-bot guard and backtest-history reference protection. |
| File path | docs/modules/api-markets.md |
| Related files | docs/modules/web-markets.md |
| Parent |  |
| Children | [[SOAR-PAGE-MARKETS-LIST]], [[SOAR-PAGE-MARKET-CREATE]], [[SOAR-PAGE-MARKET-EDIT]], [[SOAR-COMP-MARKET-UNIVERSE-FORM]], [[SOAR-API-MARKET-UNIVERSE-LIST]], [[SOAR-API-MARKET-UNIVERSE-CREATE]], [[SOAR-API-MARKET-UNIVERSE-UPDATE]], [[SOAR-API-MARKET-CATALOG]] |
| Depends on | [[SOAR-FEATURE-EXCHANGE-ADAPTER]], [[SOAR-DB-MARKET-UNIVERSE]] |
| Used by | [[SOAR-FEATURE-BOT-SETUP]], [[SOAR-FEATURE-BOT-RUNTIME]], [[SOAR-FEATURE-STRATEGIES]] |
| UI related | [[SOAR-COMP-MARKET-UNIVERSES-TABLE]], [[SOAR-COMP-MARKET-UNIVERSE-FORM]], [[SOAR-COMP-MARKET-SEARCHABLE-MULTISELECT]] |
| API related | [[SOAR-API-MARKET-UNIVERSE-LIST]], [[SOAR-API-MARKET-UNIVERSE-GET]], [[SOAR-API-MARKET-CATALOG]], [[SOAR-API-MARKET-UNIVERSE-CREATE]], [[SOAR-API-MARKET-UNIVERSE-UPDATE]], [[SOAR-API-MARKET-UNIVERSE-DELETE]] |
| Database related | [[SOAR-DB-MARKET-UNIVERSE]], [[SOAR-DB-SYMBOL-GROUP]], [[SOAR-DB-BOT]], [[SOAR-DB-BOT-MARKET-GROUP]] |
| Tests related | [[SOAR-TEST-MARKETS-API]], [[SOAR-TEST-MARKETS-WEB]] |
| Docs related | [[SOAR-DOC-API-MARKETS]], [[SOAR-DOC-WEB-MARKETS]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Backfilled market universe authoring separately from bot setup topology. |

## Relations

- has_entrypoint -> [[SOAR-PAGE-MARKETS-LIST]] (verified_local)
- has_entrypoint -> [[SOAR-PAGE-MARKET-CREATE]] (verified_local)
- has_entrypoint -> [[SOAR-PAGE-MARKET-EDIT]] (verified_local)
- feeds -> [[SOAR-FEATURE-BOT-SETUP]] (verified_local)
- feeds -> [[SOAR-FEATURE-BOT-RUNTIME]] (verified_local)
- verified_by -> [[SOAR-TEST-MARKETS-API]] (verified_local)
- verified_by -> [[SOAR-TEST-MARKETS-WEB]] (verified_local)
- documented_by -> [[SOAR-DOC-API-MARKETS]] (verified_local)
- documented_by -> [[SOAR-DOC-WEB-MARKETS]] (verified_local)
- depends_on <- [[SOAR-FEATURE-BACKTESTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
