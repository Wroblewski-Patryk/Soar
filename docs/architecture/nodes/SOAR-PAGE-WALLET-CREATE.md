---
id: SOAR-PAGE-WALLET-CREATE
name: "Wallet create page"
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

# Wallet create page

| Field | Value |
| --- | --- |
| Description | Wallet create route using the shared create/edit form and metadata-backed constraints. |
| File path | apps/web/src/app/dashboard/wallets/create/page.tsx |
| Related files | apps/web/src/app/dashboard/wallets/_components/WalletFormPageContent.tsx |
| Parent | [[SOAR-FEATURE-WALLETS]] |
| Children |  |
| Depends on | [[SOAR-COMP-WALLET-FORM-PAGE-CONTENT]], [[SOAR-COMP-WALLET-CREATE-EDIT-FORM]] |
| Used by | [[SOAR-FEATURE-WALLETS]] |
| UI related | [[SOAR-COMP-WALLET-CREATE-EDIT-FORM]] |
| API related | [[SOAR-API-WALLET-METADATA]], [[SOAR-API-WALLET-CREATE]], [[SOAR-API-WALLET-PREVIEW-BALANCE]] |
| Database related | [[SOAR-DB-WALLET]] |
| Tests related | [[SOAR-TEST-WALLETS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-WALLETS]] |
| Agent related |  |
| Notes | Create flow blocks unsupported exchange mode combinations before save. |

## Relations

- contains -> [[SOAR-COMP-WALLET-FORM-PAGE-CONTENT]] (verified_local)
- has_entrypoint <- [[SOAR-FEATURE-WALLETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
