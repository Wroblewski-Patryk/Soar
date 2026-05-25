---
id: SOAR-TEST-WALLETS-WEB
name: "Wallets Web tests"
type: test
status: verified_local
layer: testing
module: web-wallets
feature: wallets
risk_level: critical
completion_percent: 95
last_verified_at: 2026-05-24
verification_status: verified_local
tags: [soar-map, test, testing, verified_local]
---

# Wallets Web tests

| Field | Value |
| --- | --- |
| Description | Wallet page and component tests for list create edit preview and reset confirmation UX. |
| File path | apps/web/src/features/wallets/components/WalletCreateEditForm.test.tsx |
| Related files | apps/web/src/features/wallets/components/WalletsListTable.test.tsx, apps/web/src/features/wallets/components/WalletPreviewPanel.test.tsx, apps/web/src/app/dashboard/wallets/list/page.test.tsx, apps/web/src/app/dashboard/wallets/create/page.test.tsx, apps/web/src/app/dashboard/wallets/[id]/edit/page.test.tsx, apps/web/src/app/dashboard/wallets/[id]/preview/page.test.tsx |
| Parent | [[SOAR-FEATURE-WALLETS]] |
| Children |  |
| Depends on | [[SOAR-COMP-WALLETS-LIST-TABLE]], [[SOAR-COMP-WALLET-CREATE-EDIT-FORM]], [[SOAR-COMP-WALLET-PREVIEW-PANEL]] |
| Used by | [[SOAR-FEATURE-WALLETS]] |
| UI related | [[SOAR-PAGE-WALLETS-LIST]], [[SOAR-PAGE-WALLET-CREATE]], [[SOAR-PAGE-WALLET-EDIT]], [[SOAR-PAGE-WALLET-PREVIEW]] |
| API related | [[SOAR-SERVICE-WEB-WALLETS]] |
| Database related | [[SOAR-DB-WALLET]] |
| Tests related |  |
| Docs related | [[SOAR-DOC-WEB-WALLETS]] |
| Agent related |  |
| Notes | UI tests prove local wallet UX contracts, not production reachability. |

## Relations

- verified_by <- [[SOAR-FEATURE-WALLETS]] (verified_local)

## Evidence Rule

A node without implementation, test, runtime, connection, and documentation evidence remains unreliable until the linked records prove it.
