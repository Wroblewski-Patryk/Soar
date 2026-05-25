---
id: SOAR-PAGE-WALLET-EDIT
name: "Wallet edit page"
type: page
status: verified_local
layer: frontend
module: web-wallets
feature: wallets
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, page, frontend, verified_local]
---

# Wallet edit page

| Field | Value |
| --- | --- |
| Description | Wallet edit route with existing wallet load update delete and paper reset affordances. |
| File path | apps/web/src/app/dashboard/wallets/[id]/edit/page.tsx |
| Related files | apps/web/src/app/dashboard/wallets/_components/WalletFormPageContent.tsx |
| Parent | [[SOAR-FEATURE-WALLETS]] |
| Children |  |
| Depends on | [[SOAR-COMP-WALLET-FORM-PAGE-CONTENT]], [[SOAR-COMP-WALLET-CREATE-EDIT-FORM]] |
| Used by | [[SOAR-FEATURE-WALLETS]] |
| UI related | [[SOAR-COMP-WALLET-CREATE-EDIT-FORM]] |
| API related | [[SOAR-API-WALLET-GET]], [[SOAR-API-WALLET-UPDATE]], [[SOAR-API-WALLET-DELETE]], [[SOAR-API-WALLET-RESET-PAPER]] |
| Database related | [[SOAR-DB-WALLET]], [[SOAR-DB-BOT]], [[SOAR-DB-POSITION]], [[SOAR-DB-ORDER]] |
| Tests related | [[SOAR-TEST-WALLETS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-WALLETS]] |
| Agent related |  |
| Notes | Paper reset is a dedicated command path, not generic update side effect. |

## Relations

- contains -> [[SOAR-COMP-WALLET-FORM-PAGE-CONTENT]] (verified_local)
- has_entrypoint <- [[SOAR-FEATURE-WALLETS]] (verified_local)
- redirects_to <- [[SOAR-PAGE-WALLET-ID-ROOT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
