---
id: SOAR-FEATURE-WALLETS
name: "Wallet management"
type: feature
status: verified_local
layer: fullstack
module: wallets
feature: wallets
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, feature, fullstack, verified_local]
---

# Wallet management

| Field | Value |
| --- | --- |
| Description | Wallet lifecycle balance preview paper reset ledger analytics and trading-context prerequisite for bot creation. |
| File path | docs/modules/api-wallets.md |
| Related files | docs/modules/web-wallets.md |
| Parent |  |
| Children | [[SOAR-PAGE-WALLETS-LIST]], [[SOAR-PAGE-WALLET-CREATE]], [[SOAR-PAGE-WALLET-EDIT]], [[SOAR-PAGE-WALLET-PREVIEW]], [[SOAR-API-WALLET-LIST]], [[SOAR-API-WALLET-CREATE]], [[SOAR-API-WALLET-PREVIEW-BALANCE]] |
| Depends on | [[SOAR-FEATURE-EXCHANGE-ADAPTER]], [[SOAR-DB-WALLET]] |
| Used by | [[SOAR-FEATURE-BOT-RUNTIME]], [[SOAR-FEATURE-MANUAL-ORDER]] |
| UI related | [[SOAR-COMP-WALLETS-LIST-TABLE]], [[SOAR-COMP-WALLET-CREATE-EDIT-FORM]], [[SOAR-COMP-WALLET-PREVIEW-PANEL]] |
| API related | [[SOAR-API-WALLET-LIST]], [[SOAR-API-WALLET-METADATA]], [[SOAR-API-WALLET-PREVIEW-BALANCE]], [[SOAR-API-WALLET-CREATE]], [[SOAR-API-WALLET-UPDATE]], [[SOAR-API-WALLET-RESET-PAPER]] |
| Database related | [[SOAR-DB-WALLET]], [[SOAR-DB-BOT]], [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]] |
| Tests related | [[SOAR-TEST-WALLETS-API]], [[SOAR-TEST-WALLETS-WEB]], [[SOAR-TEST-WALLET-LEDGER]] |
| Docs related | [[SOAR-DOC-API-WALLETS]], [[SOAR-DOC-WEB-WALLETS]] |
| Agent related | [[SOAR-AGENT-COORDINATOR]] |
| Notes | Backfilled as a fullstack architecture evidence chain; production LIVE mutation proof remains separate. |

## Relations

- has_entrypoint -> [[SOAR-PAGE-WALLETS-LIST]] (verified_local)
- has_entrypoint -> [[SOAR-PAGE-WALLET-CREATE]] (verified_local)
- has_entrypoint -> [[SOAR-PAGE-WALLET-EDIT]] (verified_local)
- has_entrypoint -> [[SOAR-PAGE-WALLET-PREVIEW]] (verified_local)
- verified_by -> [[SOAR-TEST-WALLETS-API]] (verified_local)
- verified_by -> [[SOAR-TEST-WALLETS-WEB]] (verified_local)
- verified_by -> [[SOAR-TEST-WALLET-LEDGER]] (verified_local)
- documented_by -> [[SOAR-DOC-API-WALLETS]] (verified_local)
- documented_by -> [[SOAR-DOC-WEB-WALLETS]] (verified_local)
- unblocks -> [[SOAR-FEATURE-BOT-RUNTIME]] (verified_local)
- context_for -> [[SOAR-FEATURE-MANUAL-ORDER]] (verified_local)
- enables <- [[SOAR-FEATURE-PROFILE-API-KEYS]] (verified_local)
- depends_on <- [[SOAR-SERVICE-BOT-ACTIVATION-POLICY]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
