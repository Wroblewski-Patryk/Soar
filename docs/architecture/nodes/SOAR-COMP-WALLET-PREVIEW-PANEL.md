---
id: SOAR-COMP-WALLET-PREVIEW-PANEL
name: "WalletPreviewPanel"
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

# WalletPreviewPanel

| Field | Value |
| --- | --- |
| Description | Wallet analytics preview panel for performance summary equity timeline and cashflow events. |
| File path | apps/web/src/features/wallets/components/WalletPreviewPanel.tsx |
| Related files |  |
| Parent | [[SOAR-PAGE-WALLET-PREVIEW]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-WALLETS]] |
| Used by | [[SOAR-PAGE-WALLET-PREVIEW]] |
| UI related | [[SOAR-PAGE-WALLET-PREVIEW]] |
| API related | [[SOAR-API-WALLET-PERFORMANCE-SUMMARY]], [[SOAR-API-WALLET-EQUITY-TIMELINE]], [[SOAR-API-WALLET-CASHFLOW-EVENTS]] |
| Database related | [[SOAR-DB-WALLET]], [[SOAR-DB-POSITION]] |
| Tests related | [[SOAR-TEST-WALLETS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-WALLETS]] |
| Agent related |  |
| Notes | Completeness states map to summary/chart visibility. |

## Relations

- calls -> [[SOAR-SERVICE-WEB-WALLETS]] (verified_local)
- contains <- [[SOAR-PAGE-WALLET-PREVIEW]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
