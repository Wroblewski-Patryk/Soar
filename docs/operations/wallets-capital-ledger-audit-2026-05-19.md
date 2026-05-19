# Wallets And Capital Ledger Audit - 2026-05-19

## Metadata

| Field | Value |
| --- | --- |
| Audit ID | `AUD-14` |
| Registry family | Wallets And Capital Ledger |
| Stage | verification |
| Environment | local |
| Status | current local / current historical production-safe wallet CRUD proof |
| Production journey | not run |
| LIVE exchange mutation | not run |
| Exchange-side mutation | not run |
| Existing production data mutation | not run |

## Scope

This audit compares the current wallet implementation with the documented
architecture/module contract for:

- wallet CRUD, ownership, mode normalization, and active-bot edit/delete guards,
- `PAPER` and `LIVE` wallet validation,
- API-key binding and exchange compatibility,
- authenticated balance preview and rate-limited preview boundary,
- paper reset checkpoint and fail-closed reset guards,
- wallet-first bot write contract,
- runtime capital source and monitoring summary truth,
- wallet performance summary, equity timeline, cashflow events, ledger
  completeness, and unclassified adjustment visibility,
- Web wallet list/create/edit/preview route and component states.

Canonical references:

- `docs/analysis/reusable-audit-registry.md`
- `docs/modules/api-wallets.md`
- `docs/modules/web-wallets.md`
- `docs/architecture/reference/wallet-source-of-truth-contract.md`
- `.agents/state/module-confidence-ledger.md`
- `.agents/state/requirements-verification-matrix.md`
- `.agents/state/risk-register.md`

## Evidence Run

| Proof | Result | Evidence |
| --- | --- | --- |
| Focused Web wallets/capital pack | PASS | `corepack pnpm --filter web exec vitest run src/app/dashboard/wallets/page.test.tsx src/app/dashboard/wallets/list/page.test.tsx src/app/dashboard/wallets/create/page.test.tsx src/app/dashboard/wallets/[id]/page.test.tsx src/app/dashboard/wallets/[id]/edit/page.test.tsx src/app/dashboard/wallets/[id]/preview/page.test.tsx src/features/wallets/components/WalletsListTable.test.tsx src/features/wallets/components/WalletCreateEditForm.test.tsx src/features/wallets/components/WalletPreviewPanel.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-wallet.test.tsx`; `10` files, `23` tests. |
| Focused API wallets/capital pack | PASS | `corepack pnpm --filter api exec vitest run src/modules/wallets/wallets.service.test.ts src/modules/wallets/wallets.e2e.test.ts src/modules/wallets/wallets.crud.e2e.test.ts src/modules/wallets/walletCashflowClassifier.service.test.ts src/modules/engine/runtimeCapitalContext.service.test.ts src/modules/bots/bots.monitoring-aggregate.e2e.test.ts src/modules/bots/bots.wallet-contract.e2e.test.ts`; `7` files, `84` tests. |
| Local DB/Redis lifecycle | PASS | `corepack pnpm run go-live:infra:up` before DB-backed API tests and `corepack pnpm run go-live:infra:down` after proof. |

## Architecture-To-Code Parity

| Contract Area | Current Implementation Truth | Parity |
| --- | --- | --- |
| Wallet routes and rate limits | `wallets.routes.ts` exposes list, metadata, preview-balance, performance summary, equity timeline, cashflow events, get, create, update, reset-paper, and delete. Read/write/preview rate limiters match module docs. | aligned |
| Wallet as execution context source | Bot wallet contract tests verify deprecated bot mode/capital/API-key fields are ignored and execution fields derive from the wallet. Shared wallet assignment with compatible context is covered. | aligned |
| Mode and capability validation | API service normalizes `PAPER` wallets by clearing live allocation/API-key fields and enforces `LIVE_EXECUTION` or `PAPER_PRICING_FEED` capability. | aligned |
| LIVE API-key binding | API validates owned API key and exchange match for `LIVE` wallets and preview. | aligned |
| Balance preview | LIVE create/preview uses authenticated read support and records live balance snapshot/cashflow baseline when available. Unsupported or failed preview paths fail closed. | aligned |
| Paper reset | Dedicated `POST /dashboard/wallets/:id/reset-paper` path is `PAPER`-only and blocks active bots, open positions, and active open orders. Reset writes `paperResetAt` without deleting history. | aligned |
| Capital runtime truth | Runtime capital tests and monitoring aggregate tests cover PAPER reset checkpoint, LIVE allocation modes, reserved margin, and capital-source exposure. | aligned |
| Ledger model | Wallet service implements contributed capital, bot PnL, fees/funding, unclassified adjustment, performance summary, equity timeline, and cashflow event reads. Web preview surfaces `COMPLETE`, `PARTIAL`, and `UNAVAILABLE` states. | aligned |
| Web wallet UX states | Route/component tests cover list/create/edit/preview shells, table API-key status, form validation/mode fields, reset success/error states, preview summary/timeline/cashflow, partial ledger, and unavailable ledger fail-closed state. | aligned |

## Findings

| ID | Severity | Status | Finding | Evidence | Next Action |
| --- | --- | --- | --- | --- | --- |
| `AUD-WAL-004` | P1 | open freshness follow-up | Fresh production-safe wallet proof was not rerun in this local audit pass. Historical disposable wallet create/update/readback/cleanup proof remains accepted for the 2026-05-14 deployment target. | `docs/operations/prod-fixture-action-proof-457bce05-2026-05-14.md`; this audit's local Web/API packs. | Refresh production-safe disposable wallet proof after future deployments. |
| `AUD-WAL-005` | P1 | explicit exclusion | LIVE exchange mutation and broader LIVE-money ledger proof remain outside this audit. The local contract validates LIVE configuration, preview, allocation, runtime capital, and ledger semantics without performing exchange-side mutation. | Wallet API/Web packs; wallet source-of-truth contract. | Keep LIVE mutation approval-gated and plan separate safe LIVE proof only with explicit user approval. |
| `AUD-WAL-006` | P2 | open follow-up | API module docs still list explicit audit log entries for wallet create/update/delete as an open follow-up. This belongs mainly to `AUD-17`, but it affects wallet audit-trail completeness. | `docs/modules/api-wallets.md` section 9. | Track under logs/audit-trail audit and decide whether wallet command events must be emitted before broader release claims. |

## Result

`AUD-14` is current locally for wallet CRUD, wallet-first capital context,
PAPER/LIVE validation, API-key binding, balance preview, PAPER reset guards,
runtime capital source truth, and ledger UI/API states.

No code behavior was changed. No production journey, LIVE mutation,
exchange-side mutation, or existing production data mutation was performed.
