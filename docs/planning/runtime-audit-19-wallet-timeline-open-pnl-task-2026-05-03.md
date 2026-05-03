# RUNTIME-AUDIT-19 Wallet Timeline Open PnL Task - 2026-05-03

## Header
- ID: RUNTIME-AUDIT-19
- Title: Align wallet equity timeline latest open PnL with summary
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: Backend
- Depends on: RUNTIME-AUDIT-18
- Priority: P1
- Iteration: 37
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`RUNTIME-AUDIT-18` aligned wallet performance summary with owned imported
`LIVE` open PnL. The adjacent equity timeline read model still emits
`botOpenPnl=0` and `botPnl` without current open PnL for every point, so the
wallet preview can show inconsistent summary cards and timeline details.

## Goal
Make the latest wallet equity timeline point expose the same current open PnL
scope as wallet performance summary.

## Scope
- `apps/api/src/modules/wallets/wallets.service.ts`
- `apps/api/src/modules/wallets/wallets.e2e.test.ts`
- `docs/modules/api-wallets.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Add a failing regression for a selected `LIVE` wallet whose latest timeline
   point should include API-key-owned imported open PnL.
2. Reuse the wallet open-PnL scope from `RUNTIME-AUDIT-18`.
3. Apply current open PnL only to the latest timeline point; historical points
   remain ledger snapshot/cashflow history.
4. Run focused wallet tests and relevant quality gates.
5. Sync docs/context.

## Acceptance Criteria
- Latest timeline point reports owned imported `LIVE` `botOpenPnl`.
- Latest timeline `botPnl` includes realized PnL, fees/funding, and current
  open PnL.
- Earlier timeline points remain historical and do not receive current open
  PnL.
- Another API key's imported position remains excluded.

## Definition of Done
- [x] Regression fails before fix and passes after fix.
- [x] Focused wallet tests pass.
- [x] Typecheck, lint, guardrails, and diff review pass.
- [x] Source-of-truth docs are updated.

## Forbidden
- Reconstructing historical open PnL without persisted historical evidence.
- User-wide or symbol-wide open PnL aggregation.
- Exchange fetch behavior changes.
- Frontend-only timeline math.

## Validation Evidence
- Tests:
  - Initial focused regression failed as expected: latest timeline point
    returned `botOpenPnl=0` and `botPnl=0` instead of `12.5`.
  - PASS:
    `pnpm --filter api run test -- --run src/modules/wallets/wallets.e2e.test.ts --sequence.concurrent=false`
    (`16/16`).
  - PASS: `pnpm --filter api run typecheck`.
  - PASS: `pnpm run quality:guardrails`.
  - PASS: `pnpm run lint`.
  - PASS: `git diff --check`.
- Manual checks: code-path and regression review only; no production mutation
  performed.
- High-risk checks: open PnL scope remains selected-wallet direct rows or
  selected wallet API-key-owned imported `LIVE` rows.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: wallet summary and timeline expose different current open-PnL truth.
- Gap: latest timeline point does not reuse wallet-owned imported open-PnL
  scope.
- Architecture constraint: timeline should remain ledger-backed and must not
  guess historical open PnL.

### 2. Select One Priority Task
- Selected task: `RUNTIME-AUDIT-19`.
- Priority rationale: wallet preview dashboard can show inconsistent values
  in adjacent widgets for the same selected wallet.

### 3. Plan Implementation
- Reuse existing wallet open-PnL where helper and attach current open PnL only
  to the latest returned timeline point.

### 4. Execute Implementation
- Implementation notes: reused `buildWalletOpenPnlWhere(...)` inside
  `getWalletEquityTimeline(...)` and applied current open PnL only to the
  latest returned point.

### 5. Verify and Test
- Validation performed: failing-then-passing focused wallet regression, API
  typecheck, guardrails, lint, and diff review.
- Result: PASS.

### 6. Self-Review
- Technical debt introduced: no.
- Architecture alignment: yes; historical points remain ledger-backed and no
  historical open PnL is guessed.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/modules/api-wallets.md`,
  `docs/planning/mvp-next-commits.md`, and
  `docs/planning/mvp-execution-plan.md`.
- Context updated: `.codex/context/TASK_BOARD.md` and
  `.codex/context/PROJECT_STATE.md`.

## Result Report
- Task summary: wallet equity timeline latest point now reports current owned
  imported `LIVE` open PnL consistently with wallet performance summary.
- Files changed: wallet service, wallet e2e test, wallet module docs, planning
  queue, execution plan, task board, and project state.
- How tested: focused wallets e2e (`16/16`), API typecheck, repository
  guardrails, lint, and diff review.
- What is incomplete: nothing in this slice.
