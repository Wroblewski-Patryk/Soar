---
id: SOAR-COMP-WALLET-CREATE-EDIT-FORM
name: "WalletCreateEditForm"
type: component
status: verified_local
layer: frontend
module: web-wallets
feature: wallets
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, component, frontend, verified_local]
---

# WalletCreateEditForm

| Field | Value |
| --- | --- |
| Description | Mode-aware wallet form with metadata constraints LIVE balance preview and paper reset confirmation. |
| File path | apps/web/src/features/wallets/components/WalletCreateEditForm.tsx |
| Related files | apps/web/src/features/wallets/components/wallet-create-edit-form/state.ts, apps/web/src/features/wallets/components/wallet-create-edit-form/actions.ts, apps/web/src/features/wallets/components/wallet-create-edit-form/sections.tsx |
| Parent | [[SOAR-FEATURE-WALLETS]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-WALLETS]] |
| Used by | [[SOAR-PAGE-WALLET-CREATE]], [[SOAR-PAGE-WALLET-EDIT]] |
| UI related | [[SOAR-PAGE-WALLET-CREATE]], [[SOAR-PAGE-WALLET-EDIT]] |
| API related | [[SOAR-API-WALLET-METADATA]], [[SOAR-API-WALLET-PREVIEW-BALANCE]], [[SOAR-API-WALLET-CREATE]], [[SOAR-API-WALLET-UPDATE]], [[SOAR-API-WALLET-RESET-PAPER]] |
| Database related | [[SOAR-DB-WALLET]] |
| Tests related | [[SOAR-TEST-WALLETS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-WALLETS]] |
| Agent related |  |
| Notes | Form prevents stale cross-mode payload leakage. |

## Relations

- calls -> [[SOAR-SERVICE-WEB-WALLETS]] (verified_local)
- contains <- [[SOAR-COMP-WALLET-FORM-PAGE-CONTENT]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
