---
id: SOAR-FEATURE-BOT-SETUP
name: "Bot setup and topology"
type: feature
status: verified_local
layer: fullstack
module: bots
feature: bot-setup
risk_level: critical
completion_percent: 90
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, feature, fullstack, verified_local]
---

# Bot setup and topology

| Field | Value |
| --- | --- |
| Description | Bot lifecycle setup across list create edit delete wallet-first context strategy market-universe topology activation policy and canonical links. |
| File path | docs/modules/api-bots.md |
| Related files | docs/modules/web-bots.md |
| Parent |  |
| Children | [[SOAR-PAGE-BOTS-LIST]], [[SOAR-PAGE-BOT-CREATE]], [[SOAR-PAGE-BOT-EDIT]], [[SOAR-COMP-BOTS-LIST-TABLE]], [[SOAR-COMP-BOT-CREATE-EDIT-FORM]], [[SOAR-API-BOT-LIST]], [[SOAR-API-BOT-CREATE]], [[SOAR-API-BOT-UPDATE]] |
| Depends on | [[SOAR-FEATURE-WALLETS]], [[SOAR-FEATURE-PROFILE-API-KEYS]], [[SOAR-FEATURE-BOT-RUNTIME]] |
| Used by | [[SOAR-FEATURE-BOT-RUNTIME]], [[SOAR-FEATURE-MANUAL-ORDER]] |
| UI related | [[SOAR-COMP-BOTS-LIST-TABLE]], [[SOAR-COMP-BOT-CREATE-EDIT-FORM]] |
| API related | [[SOAR-API-BOT-LIST]], [[SOAR-API-BOT-GET]], [[SOAR-API-BOT-CREATE]], [[SOAR-API-BOT-UPDATE]], [[SOAR-API-BOT-DELETE]], [[SOAR-API-BOT-MARKET-GROUPS-LIST]], [[SOAR-API-BOT-MARKET-GROUP-CREATE]], [[SOAR-API-BOT-MARKET-GROUP-STRATEGY-ATTACH]] |
| Database related | [[SOAR-DB-BOT]], [[SOAR-DB-WALLET]], [[SOAR-DB-API-KEY]], [[SOAR-DB-STRATEGY]], [[SOAR-DB-MARKET-UNIVERSE]], [[SOAR-DB-BOT-MARKET-GROUP]], [[SOAR-DB-MARKET-GROUP-STRATEGY-LINK]] |
| Tests related | [[SOAR-TEST-BOT-SETUP-API]], [[SOAR-TEST-BOT-SETUP-WEB]] |
| Docs related | [[SOAR-DOC-API-BOTS]], [[SOAR-DOC-WEB-BOTS]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Backfilled setup/topology separately from runtime monitoring. |

## Relations

- has_entrypoint -> [[SOAR-PAGE-BOTS-LIST]] (verified_local)
- has_entrypoint -> [[SOAR-PAGE-BOT-CREATE]] (verified_local)
- has_entrypoint -> [[SOAR-PAGE-BOT-EDIT]] (verified_local)
- enables -> [[SOAR-FEATURE-BOT-RUNTIME]] (verified_local)
- verified_by -> [[SOAR-TEST-BOT-SETUP-API]] (verified_local)
- verified_by -> [[SOAR-TEST-BOT-SETUP-WEB]] (verified_local)
- documented_by -> [[SOAR-DOC-API-BOTS]] (verified_local)
- documented_by -> [[SOAR-DOC-WEB-BOTS]] (verified_local)
- feeds <- [[SOAR-FEATURE-STRATEGIES]] (verified_local)
- feeds <- [[SOAR-FEATURE-MARKETS]] (verified_local)
- observes <- [[SOAR-FEATURE-LOGS-AUDIT]] (verified_local)
- guards <- [[SOAR-SERVICE-SUBSCRIPTION-ENTITLEMENTS]] (verified_local)
- extends <- [[SOAR-FEATURE-AI-ASSISTANT-FOUNDATION]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
