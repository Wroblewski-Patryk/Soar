---
id: SOAR-PAGE-WALLETS-LIST
name: "Wallets list page"
type: page
status: verified_local
layer: frontend
module: web-wallets
feature: wallets
risk_level: high
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, page, frontend, verified_local]
---

# Wallets list page

| Field | Value |
| --- | --- |
| Description | Canonical wallet list route with row-only wallet management table and inline API-key status. |
| File path | apps/web/src/app/dashboard/wallets/list/page.tsx |
| Related files | apps/web/src/features/wallets/components/WalletsListTable.tsx |
| Parent | [[SOAR-FEATURE-WALLETS]] |
| Children |  |
| Depends on | [[SOAR-COMP-WALLETS-LIST-TABLE]], [[SOAR-SERVICE-WEB-WALLETS]] |
| Used by | [[SOAR-FEATURE-WALLETS]], [[SOAR-FEATURE-BOT-RUNTIME]] |
| UI related | [[SOAR-COMP-WALLETS-LIST-TABLE]] |
| API related | [[SOAR-API-WALLET-LIST]], [[SOAR-API-WALLET-DELETE]], [[SOAR-API-WALLET-RESET-PAPER]] |
| Database related | [[SOAR-DB-WALLET]] |
| Tests related | [[SOAR-TEST-WALLETS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-WALLETS]] |
| Agent related |  |
| Notes | WalletId-first setup entrypoint for trading context. |

## Relations

- contains -> [[SOAR-COMP-WALLETS-LIST-TABLE]] (verified_local)
- has_entrypoint <- [[SOAR-FEATURE-WALLETS]] (verified_local)
- redirects_to <- [[SOAR-PAGE-WALLETS-ROOT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
