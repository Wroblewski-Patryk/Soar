# Task: Wallets And Capital Ledger Audit - 2026-05-19

## Context

The user requested reusable layer-by-layer discrepancy audits between the
application implementation and architecture/module descriptions. `AUD-14`
covers wallet CRUD, wallet-first capital context, API-key binding, reset guards,
ledger/cashflow/equity truth, and wallet UI states.

## Goal

Refresh `AUD-14` with current local evidence and record any implementation vs
architecture/documentation discrepancies without changing runtime behavior.

## Scope

- `docs/analysis/reusable-audit-registry.md`
- `docs/modules/api-wallets.md`
- `docs/modules/web-wallets.md`
- `docs/architecture/reference/wallet-source-of-truth-contract.md`
- `apps/api/src/modules/wallets/**`
- `apps/api/src/modules/engine/runtimeCapitalContext.service.test.ts`
- `apps/api/src/modules/bots/*wallet*/**`
- `apps/web/src/features/wallets/**`
- `apps/web/src/app/dashboard/wallets/**`

## Constraints

- No production journey.
- No LIVE order/cancel/close.
- No exchange-side mutation.
- No existing production data mutation.
- Keep repository artifacts in English.

## Definition Of Done

- Focused Web wallet/capital proof is run and recorded.
- Focused API wallet/capital proof is run and recorded.
- Architecture-to-code parity is summarized.
- Open gaps are recorded with stable IDs.
- Local DB/Redis infra is stopped after DB-backed tests.
- A reusable Markdown and JSON audit artifact exists.

## Forbidden

- Do not change product behavior during the audit.
- Do not perform LIVE-money or exchange-side mutation.
- Do not overclaim production freshness from local tests.

## Result Report

Completed on 2026-05-19.

Validation:

- `corepack pnpm --filter web exec vitest run src/app/dashboard/wallets/page.test.tsx src/app/dashboard/wallets/list/page.test.tsx src/app/dashboard/wallets/create/page.test.tsx src/app/dashboard/wallets/[id]/page.test.tsx src/app/dashboard/wallets/[id]/edit/page.test.tsx src/app/dashboard/wallets/[id]/preview/page.test.tsx src/features/wallets/components/WalletsListTable.test.tsx src/features/wallets/components/WalletCreateEditForm.test.tsx src/features/wallets/components/WalletPreviewPanel.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-wallet.test.tsx`
  - PASS: `10` files, `23` tests.
- `corepack pnpm --filter api exec vitest run src/modules/wallets/wallets.service.test.ts src/modules/wallets/wallets.e2e.test.ts src/modules/wallets/wallets.crud.e2e.test.ts src/modules/wallets/walletCashflowClassifier.service.test.ts src/modules/engine/runtimeCapitalContext.service.test.ts src/modules/bots/bots.monitoring-aggregate.e2e.test.ts src/modules/bots/bots.wallet-contract.e2e.test.ts`
  - PASS: `7` files, `84` tests.
- `corepack pnpm run go-live:infra:down`
  - PASS: local Postgres/Redis stopped after DB-backed tests.

Artifacts:

- `docs/operations/wallets-capital-ledger-audit-2026-05-19.md`
- `docs/operations/wallets-capital-ledger-audit-2026-05-19.json`

Residual risk:

- Fresh production-safe wallet proof was not rerun.
- LIVE exchange mutation and broader LIVE-money ledger proof remain explicitly
  excluded.
- Explicit wallet command audit-log entries remain a documented follow-up for
  the logs/audit-trail audit family.
