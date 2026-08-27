---
id: SOAR-COMP-WALLET-FORM-PAGE-CONTENT
name: "WalletFormPageContent"
type: component
status: verified_local
layer: frontend
module: web-wallets
feature: wallets
risk_level: high
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# WalletFormPageContent

| Field | Value |
| --- | --- |
| Description | Route-level wrapper for wallet create and edit flows. |
| File path | apps/web/src/app/dashboard/wallets/_components/WalletFormPageContent.tsx |
| Related files |  |
| Parent | [[SOAR-FEATURE-WALLETS]] |
| Children |  |
| Depends on | [[SOAR-COMP-WALLET-CREATE-EDIT-FORM]], [[SOAR-SERVICE-WEB-WALLETS]] |
| Used by | [[SOAR-PAGE-WALLET-CREATE]], [[SOAR-PAGE-WALLET-EDIT]] |
| UI related | [[SOAR-PAGE-WALLET-CREATE]], [[SOAR-PAGE-WALLET-EDIT]] |
| API related | [[SOAR-API-WALLET-GET]], [[SOAR-API-WALLET-METADATA]], [[SOAR-API-WALLET-CREATE]], [[SOAR-API-WALLET-UPDATE]] |
| Database related | [[SOAR-DB-WALLET]] |
| Tests related | [[SOAR-TEST-WALLETS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-WALLETS]] |
| Agent related |  |
| Notes | Shared page composition for create/edit. |

## Relations

- contains -> [[SOAR-COMP-WALLET-CREATE-EDIT-FORM]] (verified_local)
- contains <- [[SOAR-PAGE-WALLET-CREATE]] (verified_local)
- contains <- [[SOAR-PAGE-WALLET-EDIT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
