# WLEDGER-04 LIVE Wallet Balance Snapshot Ingestion Task

## Header
- ID: WLEDGER-04
- Title: Persist initial and runtime LIVE wallet balance snapshots
- Task Type: feature
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: WLEDGER-02, WLEDGER-03
- Priority: P1

## Context
The wallet ledger tables exist and the exchange boundary can expose account
history. The next smallest safe slice is to persist exchange-backed balance
evidence at existing balance-read points before adding cashflow classification.

## Goal
Record `WalletBalanceSnapshot` rows for LIVE wallets when the wallet is created
and when runtime capital refreshes authenticated exchange balance.

## Scope
- `apps/api/src/modules/wallets/walletLedger.service.ts`
- `apps/api/src/modules/wallets/wallets.service.ts`
- `apps/api/src/modules/engine/runtimeCapitalContext.service.ts`
- Focused wallet/runtime tests and planning/context docs.

## Implementation Plan
1. Add one reusable wallet-ledger snapshot writer.
2. Persist initial LIVE wallet snapshots inside wallet creation.
3. Persist periodic runtime snapshots only when fresh exchange balance is read.
4. Keep live-balance cache and runtime sizing semantics unchanged.
5. Validate with focused DB-backed wallet e2e and runtime unit tests.

## Acceptance Criteria
- LIVE wallet creation stores the initial account/free/allocated balance.
- Runtime fresh balance refresh stores a periodic balance snapshot.
- Cached runtime balance reads do not create duplicate periodic snapshots.
- PAPER wallets remain untouched.
- Deposit/withdrawal/PnL classification is not mixed into this slice.

## Definition of Done
- [x] Snapshot writer added.
- [x] Wallet creation snapshot added.
- [x] Runtime fresh-balance snapshot added.
- [x] Focused tests passed.
- [x] API typecheck passed.
- [x] Source-of-truth planning/context docs updated.

## Validation Evidence
- Tests: `pnpm --filter api exec vitest run src/modules/engine/runtimeCapitalContext.service.test.ts src/modules/wallets/wallets.e2e.test.ts`
- Manual checks: `pnpm --filter api exec prisma generate`; local schema synced with `pnpm --filter api exec prisma db push --accept-data-loss` because local migration history was already drifted.
- High-risk checks: runtime sizing behavior unchanged; snapshot write uses existing authenticated balance reads.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/reference/live-wallet-cashflow-ledger-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no

## Result Report
- Task summary: persisted initial and runtime wallet balance evidence for LIVE wallets.
- Files changed: wallet ledger service, wallet create flow, runtime capital context, tests, planning/context docs.
- How tested: Prisma generate, local DB schema sync, focused wallet/runtime tests, API typecheck.
- What is incomplete: cashflow classification and wallet analytics APIs remain queued.
- Next steps: WLEDGER-05 cashflow classification.
