---
id: SOAR-COMP-WALLETS-LIST-TABLE
name: "WalletsListTable"
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

# WalletsListTable

| Field | Value |
| --- | --- |
| Description | Row-only wallet table with inline API-key state and wallet actions. |
| File path | apps/web/src/features/wallets/components/WalletsListTable.tsx |
| Related files |  |
| Parent | [[SOAR-PAGE-WALLETS-LIST]] |
| Children |  |
| Depends on | [[SOAR-SERVICE-WEB-WALLETS]] |
| Used by | [[SOAR-PAGE-WALLETS-LIST]] |
| UI related | [[SOAR-PAGE-WALLETS-LIST]] |
| API related | [[SOAR-API-WALLET-LIST]], [[SOAR-API-WALLET-DELETE]], [[SOAR-API-WALLET-RESET-PAPER]] |
| Database related | [[SOAR-DB-WALLET]] |
| Tests related | [[SOAR-TEST-WALLETS-WEB]] |
| Docs related | [[SOAR-DOC-WEB-WALLETS]] |
| Agent related |  |
| Notes | Inline API-key status is deterministic from apiKeyId. |

## Relations

- calls -> [[SOAR-SERVICE-WEB-WALLETS]] (verified_local)
- contains <- [[SOAR-PAGE-WALLETS-LIST]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
