---
id: SOAR-FEATURE-BOT-RUNTIME
name: "Bot Runtime monitoring"
type: feature
status: verified_local
layer: fullstack
module: bot-runtime
feature: bot-runtime
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, feature, fullstack, verified_local]
---

# Bot Runtime monitoring

| Field | Value |
| --- | --- |
| Description | Bot runtime monitoring graph across bot runtime pages Web service API routes aggregate sessions positions trades symbol stats DB tests and docs. |
| File path | docs/modules/api-bots.md |
| Related files | docs/modules/web-bots.md, docs/architecture/04_runtime-contexts.md |
| Parent |  |
| Children | [[SOAR-PAGE-BOT-RUNTIME]], [[SOAR-COMP-BOTS-MANAGEMENT]], [[SOAR-API-BOT-RUNTIME-AGGREGATE]], [[SOAR-SERVICE-RUNTIME-AGGREGATE]], [[SOAR-SERVICE-RUNTIME-POSITIONS-READ]] |
| Depends on | [[SOAR-FEATURE-DASHBOARD-RUNTIME]], [[SOAR-FEATURE-POSITIONS]], [[SOAR-FEATURE-RUNTIME-DCA-PNL]] |
| Used by | [[SOAR-FEATURE-POSITIONS]], [[SOAR-FEATURE-MANUAL-ORDER]] |
| UI related | [[SOAR-COMP-BOTS-MANAGEMENT]], [[SOAR-COMP-RUNTIME-DATA-SECTION]] |
| API related | [[SOAR-API-BOT-RUNTIME-AGGREGATE]], [[SOAR-API-BOT-RUNTIME-POSITIONS]], [[SOAR-API-BOT-RUNTIME-CLOSE-POSITION]] |
| Database related | [[SOAR-DB-RUNTIME-SESSION]], [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]], [[SOAR-DB-TRADE]] |
| Tests related | [[SOAR-TEST-BOT-RUNTIME-API]], [[SOAR-TEST-BOT-RUNTIME-WEB]] |
| Docs related | [[SOAR-DOC-API-BOTS]], [[SOAR-DOC-WEB-BOTS]] |
| Agent related |  |
| Notes | Backfilled as third P0 money/runtime graph slice. |

## Relations

- verified_by -> [[SOAR-TEST-BOT-RUNTIME-API]] (verified_local)
- verified_by -> [[SOAR-TEST-BOT-RUNTIME-WEB]] (verified_local)
- documented_by -> [[SOAR-DOC-API-BOTS]] (verified_local)
- documented_by -> [[SOAR-DOC-WEB-BOTS]] (verified_local)
- verified_by -> [[SOAR-TEST-API-RESIDUAL-EVIDENCE]] (verified_local)
- unblocks <- [[SOAR-FEATURE-WALLETS]] (verified_local)
- enables <- [[SOAR-FEATURE-PROFILE-API-KEYS]] (verified_local)
- enables <- [[SOAR-FEATURE-BOT-SETUP]] (verified_local)
- feeds <- [[SOAR-FEATURE-STRATEGIES]] (verified_local)
- feeds <- [[SOAR-FEATURE-MARKETS]] (verified_local)
- depends_on <- [[SOAR-FEATURE-REPORTS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
