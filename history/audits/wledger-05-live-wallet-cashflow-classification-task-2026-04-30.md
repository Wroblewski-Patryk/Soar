# WLEDGER-05 LIVE Wallet Cashflow Classification Task

## Header
- ID: WLEDGER-05
- Title: Classify initial and exchange-backed wallet cashflows
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: WLEDGER-02, WLEDGER-03, WLEDGER-04
- Priority: P1

## Context
Balance snapshots alone cannot explain whether wallet value changed because the
user deposited funds, withdrew funds, paid fees/funding, or the bot made money.
The ledger needs deterministic event classification before summary APIs can be
truthful.

## Goal
Classify initial contributed capital and exchange-history wallet movements into
explicit `WalletCashflowEvent` rows without treating raw balance drift as bot
PnL.

## Scope
- `apps/api/src/modules/wallets/walletCashflowClassifier.service.ts`
- `apps/api/src/modules/wallets/wallets.service.ts`
- Focused classifier and wallet tests.

## Implementation Plan
1. Add a classifier for exchange cashflow history rows.
2. Add idempotent upsert by stable exchange event id.
3. Record initial allocated balance as contributed capital.
4. Keep broader replay/backfill wiring for later slices.
5. Validate classification and wallet-create cashflow persistence.

## Acceptance Criteria
- Initial allocated balance creates `INITIAL_BALANCE`.
- Deposits and withdrawals do not become bot PnL.
- Transfers, fees, funding, realized income, and unknown rows map explicitly.
- Stable exchange event ids are idempotent per wallet/source.

## Definition of Done
- [x] Classification service added.
- [x] Initial balance cashflow wired into LIVE wallet creation.
- [x] Focused classifier tests passed.
- [x] Wallet e2e proves initial snapshot and cashflow are both written.
- [x] API typecheck passed.
- [x] Source-of-truth docs/context updated.

## Validation Evidence
- Tests: `pnpm --filter api exec vitest run src/modules/wallets/walletCashflowClassifier.service.test.ts src/modules/wallets/wallets.e2e.test.ts src/modules/engine/runtimeCapitalContext.service.test.ts`
- Manual checks: API typecheck passed.
- High-risk checks: raw balance drift still has no code path into bot PnL.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/reference/live-wallet-cashflow-ledger-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no

## Result Report
- Task summary: added deterministic cashflow classification and initial balance cashflow persistence.
- Files changed: classifier service, wallet create flow, tests, planning/context docs.
- How tested: focused API tests and typecheck.
- What is incomplete: historical exchange replay, bot lifecycle backfill, read APIs, and web analytics remain queued.
- Next steps: WLEDGER-06 wallet performance summary and equity timeline endpoints.
