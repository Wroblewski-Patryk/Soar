---
id: SOAR-DOC-API-MARKETS
name: "API markets module documentation"
type: documentation
status: verified_local
layer: documentation
module: api-markets
feature: markets
risk_level: high
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, documentation, documentation, verified_local]
---

# API markets module documentation

| Field | Value |
| --- | --- |
| Description | Market API deep-dive covering universe CRUD catalog resolution symbol composition active-bot guard and backtest-history guard. |
| File path | docs/modules/api-markets.md |
| Related files | docs/architecture/03_domain-model.md, docs/architecture/04_runtime-contexts.md, docs/architecture/05_strategy-signal-and-decision-flow.md |
| Parent | [[SOAR-FEATURE-MARKETS]] |
| Children |  |
| Depends on | [[SOAR-DOC-DATA-MODEL]] |
| Used by | [[SOAR-FEATURE-MARKETS]] |
| UI related |  |
| API related | [[SOAR-API-MARKET-UNIVERSE-LIST]], [[SOAR-API-MARKET-CATALOG]], [[SOAR-API-MARKET-UNIVERSE-CREATE]], [[SOAR-API-MARKET-UNIVERSE-UPDATE]], [[SOAR-API-MARKET-UNIVERSE-DELETE]] |
| Database related | [[SOAR-DB-MARKET-UNIVERSE]], [[SOAR-DB-SYMBOL-GROUP]] |
| Tests related | [[SOAR-TEST-MARKETS-API]] |
| Docs related | [[SOAR-DOC-DATA-MODEL]] |
| Agent related |  |
| Notes | Canonical API markets module doc. |

## Relations

- documented_by <- [[SOAR-FEATURE-MARKETS]] (verified_local)
- documented_by <- [[SOAR-FEATURE-MARKET-DATA-STREAM-ADAPTERS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
