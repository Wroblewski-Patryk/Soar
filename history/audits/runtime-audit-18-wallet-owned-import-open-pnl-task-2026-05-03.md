# RUNTIME-AUDIT-18 Wallet Owned Import Open PnL Task - 2026-05-03

## Header
- ID: RUNTIME-AUDIT-18
- Title: Include owned imported LIVE positions in wallet open PnL
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend
- Depends on: RUNTIME-AUDIT-17
- Priority: P1
- Iteration: 36
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Wallet performance summary aggregates open PnL only from positions with the
selected `walletId`. Imported or recovered `LIVE` positions can be owned by a
wallet API key while still carrying `walletId=null`, so wallet dashboard PnL
can under-report active bot exposure.

## Goal
Make wallet performance summary include open PnL from deterministically owned
imported `LIVE` positions for the selected wallet.

## Scope
- `apps/api/src/modules/wallets/wallets.service.ts`
- `apps/api/src/modules/wallets/wallets.e2e.test.ts`
- `docs/modules/api-wallets.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Add a failing wallet performance-summary regression for an imported `LIVE`
   open position with `walletId=null` and `externalId` prefixed by the wallet
   API key id.
2. Extend the open PnL aggregate to include exact-user, open, API-key-owned
   imported positions for the selected LIVE wallet.
3. Keep non-LIVE and non-owned rows excluded.
4. Run focused wallet tests and relevant API quality gates.
5. Sync module docs and canonical context.

## Acceptance Criteria
- Wallet performance summary includes direct wallet open PnL and owned
  imported `LIVE` open PnL.
- Positions from another user or another API key remain excluded.
- Wallet cashflow, balance snapshots, and equity timeline contracts are not
  changed in this slice.

## Definition of Done
- [x] Regression fails before fix and passes after fix.
- [x] Focused wallet tests pass.
- [x] Typecheck, lint, guardrails, and diff review pass.
- [x] Source-of-truth docs are updated.

## Forbidden
- User-wide or symbol-wide open PnL aggregation.
- New wallet ledger or cashflow systems.
- Exchange API fetch behavior changes.
- Temporary dashboard-only math.

## Validation Evidence
- Tests:
  - Initial focused regression failed as expected: wallet performance summary
    returned `botOpenPnl=0` and `botPnl=0` instead of `12.5`.
  - PASS:
    `pnpm --filter api run test -- --run src/modules/wallets/wallets.e2e.test.ts --sequence.concurrent=false`
    (`15/15`).
  - PASS: `pnpm --filter api run typecheck`.
  - PASS: `pnpm run quality:guardrails`.
  - PASS: `pnpm run lint`.
  - PASS: `git diff --check`.
- Manual checks: code-path and regression review only; no production mutation
  performed.
- High-risk checks: aggregation remains scoped by `userId`, selected
  `walletId`, or selected wallet API-key-owned `externalId` prefix.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: wallet performance open PnL query is wallet-id strict.
- Gap: imported `LIVE` ownership can be API-key based while wallet projection
  stays null.
- Architecture constraint: wallet dashboard must reflect persisted runtime
  truth without duplicating exchange fetches.

### 2. Select One Priority Task
- Selected task: `RUNTIME-AUDIT-18`.
- Priority rationale: dashboard wallet PnL is operator-facing capital truth.

### 3. Plan Implementation
- Use a narrow Prisma OR branch for selected wallet direct rows plus selected
  LIVE wallet API-key-owned imported rows.

### 4. Execute Implementation
- Implementation notes: added `buildWalletOpenPnlWhere(...)` and reused it for
  the wallet performance open-PnL aggregate. The query now keeps direct wallet
  rows and includes selected `LIVE` wallet API-key-owned imported rows with
  `walletId=null`.

### 5. Verify and Test
- Validation performed: failing-then-passing focused wallet regression, API
  typecheck, guardrails, lint, and diff review.
- Result: PASS.

### 6. Self-Review
- Technical debt introduced: no.
- Architecture alignment: yes; this is a derived read-model fix that does not
  create new ledger, cashflow, or exchange-fetch behavior.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/modules/api-wallets.md`,
  `docs/planning/mvp-next-commits.md`, and
  `docs/planning/mvp-execution-plan.md`.
- Context updated: `.codex/context/TASK_BOARD.md` and
  `.codex/context/PROJECT_STATE.md`.

## Result Report
- Task summary: wallet performance summary now includes owned imported `LIVE`
  open PnL for selected wallets while excluding other API keys.
- Files changed: wallet service, wallet e2e test, wallet module docs, planning
  queue, execution plan, task board, and project state.
- How tested: focused wallets e2e (`15/15`), API typecheck, repository
  guardrails, lint, and diff review.
- What is incomplete: nothing in this slice.
