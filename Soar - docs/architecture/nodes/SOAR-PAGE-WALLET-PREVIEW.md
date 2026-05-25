---
id: SOAR-PAGE-WALLET-PREVIEW
name: "Wallet preview page"
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

# Wallet preview page

| Field | Value |
| --- | --- |
| Description | Wallet preview route for ledger-backed summary timeline and cashflow inspection. |
| File path | apps/web/src/app/dashboard/wallets/[id]/preview/page.tsx |
| Related files | apps/web/src/features/wallets/components/WalletPreviewPanel.tsx |
| Parent | [[SOAR-FEATURE-WALLETS]] |
| Children |  |
| Depends on | [[SOAR-COMP-WALLET-PREVIEW-PANEL]], [[SOAR-SERVICE-WEB-WALLETS]] |
| Used by | [[SOAR-FEATURE-WALLETS]] |
| UI related | [[SOAR-COMP-WALLET-PREVIEW-PANEL]] |
| API related | [[SOAR-API-WALLET-PERFORMANCE-SUMMARY]], [[SOAR-API-WALLET-EQUITY-TIMELINE]], [[SOAR-API-WALLET-CASHFLOW-EVENTS]] |
| Database related | [[SOAR-DB-WALLET]], [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-WALLETS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-WALLETS]] |
| Agent related |  |
| Notes | UNAVAILABLE completeness must fail closed in UI. |

## Relations

- contains -> [[SOAR-COMP-WALLET-PREVIEW-PANEL]] (verified_local)
- has_entrypoint <- [[SOAR-FEATURE-WALLETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
