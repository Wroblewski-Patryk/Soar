---
id: SOAR-SERVICE-WEB-WALLETS
name: "Web wallets API service"
type: service
status: verified_local
layer: frontend
module: web-wallets
feature: wallets
risk_level: high
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, service, frontend, verified_local]
---

# Web wallets API service

| Field | Value |
| --- | --- |
| Description | Typed frontend API service for wallet CRUD metadata preview analytics and paper reset calls. |
| File path | apps/web/src/features/wallets/services/wallets.service.ts |
| Related files | apps/web/src/features/wallets/types/wallet.type.ts |
| Parent | [[SOAR-FEATURE-WALLETS]] |
| Children |  |
| Depends on | [[SOAR-API-WALLET-LIST]], [[SOAR-API-WALLET-METADATA]], [[SOAR-API-WALLET-PREVIEW-BALANCE]], [[SOAR-API-WALLET-CREATE]], [[SOAR-API-WALLET-UPDATE]], [[SOAR-API-WALLET-RESET-PAPER]], [[SOAR-API-WALLET-PERFORMANCE-SUMMARY]] |
| Used by | [[SOAR-COMP-WALLETS-LIST-TABLE]], [[SOAR-COMP-WALLET-CREATE-EDIT-FORM]], [[SOAR-COMP-WALLET-PREVIEW-PANEL]] |
| UI related | [[SOAR-COMP-WALLETS-LIST-TABLE]], [[SOAR-COMP-WALLET-CREATE-EDIT-FORM]], [[SOAR-COMP-WALLET-PREVIEW-PANEL]] |
| API related | [[SOAR-API-WALLET-LIST]], [[SOAR-API-WALLET-GET]], [[SOAR-API-WALLET-METADATA]], [[SOAR-API-WALLET-PREVIEW-BALANCE]], [[SOAR-API-WALLET-CREATE]], [[SOAR-API-WALLET-UPDATE]], [[SOAR-API-WALLET-DELETE]], [[SOAR-API-WALLET-RESET-PAPER]], [[SOAR-API-WALLET-PERFORMANCE-SUMMARY]], [[SOAR-API-WALLET-EQUITY-TIMELINE]], [[SOAR-API-WALLET-CASHFLOW-EVENTS]] |
| Database related | [[SOAR-DB-WALLET]] |
| Tests related | [[SOAR-TEST-WALLETS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-WALLETS]] |
| Agent related |  |
| Notes | Frontend-to-backend wallet contract node. |

## Relations

- calls -> [[SOAR-API-WALLET-LIST]] (verified_local)
- calls -> [[SOAR-API-WALLET-METADATA]] (verified_local)
- calls -> [[SOAR-API-WALLET-PREVIEW-BALANCE]] (verified_local)
- calls -> [[SOAR-API-WALLET-CREATE]] (verified_local)
- calls -> [[SOAR-API-WALLET-UPDATE]] (verified_local)
- calls -> [[SOAR-API-WALLET-DELETE]] (verified_local)
- calls -> [[SOAR-API-WALLET-RESET-PAPER]] (verified_local)
- calls -> [[SOAR-API-WALLET-PERFORMANCE-SUMMARY]] (verified_local)
- calls -> [[SOAR-API-WALLET-EQUITY-TIMELINE]] (verified_local)
- calls -> [[SOAR-API-WALLET-CASHFLOW-EVENTS]] (verified_local)
- calls <- [[SOAR-COMP-WALLETS-LIST-TABLE]] (verified_local)
- calls <- [[SOAR-COMP-WALLET-CREATE-EDIT-FORM]] (verified_local)
- calls <- [[SOAR-COMP-WALLET-PREVIEW-PANEL]] (verified_local)
- uses <- [[SOAR-COMP-BOT-CREATE-EDIT-FORM]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
