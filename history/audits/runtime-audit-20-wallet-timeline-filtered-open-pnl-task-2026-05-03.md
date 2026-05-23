# RUNTIME-AUDIT-20 Wallet Timeline Filtered Open PnL Task - 2026-05-03

## Header
- ID: RUNTIME-AUDIT-20
- Title: Do not attach current open PnL to filtered historical wallet timeline
- Task Type: fix
- Current Stage: release
- Status: DONE
- Owner: QA/Test
- Depends on: RUNTIME-AUDIT-19
- Priority: P1
- Iteration: 38
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`RUNTIME-AUDIT-19` correctly attaches current open PnL to the latest wallet
equity timeline point. Follow-up review found that filtered historical windows
can make the latest returned point non-current, so attaching current open PnL
there would misstate historical wallet performance.

## Goal
Keep current open PnL on the latest overall wallet snapshot only, not on the
latest point of a filtered historical response.

## Scope
- `apps/api/src/modules/wallets/wallets.service.ts`
- `apps/api/src/modules/wallets/wallets.e2e.test.ts`
- `docs/modules/api-wallets.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Add a failing regression for `GET /equity-timeline?to=` that returns only a
   historical snapshot while current open PnL exists.
2. Resolve the latest overall wallet snapshot id alongside filtered timeline
   snapshots.
3. Attach current open PnL only when a returned point is that latest overall
   snapshot.
4. Run focused wallet tests and quality gates.
5. Sync docs/context.

## Acceptance Criteria
- Unfiltered latest timeline point includes current open PnL.
- Filtered historical latest returned point does not include current open PnL.
- No historical open PnL is guessed.

## Definition of Done
- [x] Regression fails before fix and passes after fix.
- [x] Focused wallet tests pass.
- [x] Typecheck, lint, guardrails, and diff review pass.
- [x] Source-of-truth docs are updated.

## Forbidden
- Historical open-PnL reconstruction without persisted evidence.
- Frontend-only correction.
- User-wide or symbol-wide aggregation.

## Validation Evidence
- Tests:
  - Initial focused regression failed as expected: filtered historical
    timeline point returned current `botOpenPnl=12.5` / `botPnl=12.5` instead
    of `0`.
  - PASS:
    `pnpm --filter api run test -- --run src/modules/wallets/wallets.e2e.test.ts --sequence.concurrent=false`
    (`16/16`).
  - PASS: `pnpm --filter api run typecheck`.
  - PASS: `pnpm run quality:guardrails`.
  - PASS: `pnpm run lint`.
  - PASS: `git diff --check`.
- Manual checks: code-path and regression review only; no production mutation
  performed.
- High-risk checks: current open PnL is attached only when the returned point
  matches the selected wallet's latest overall snapshot id.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: filtered timeline can mark a historical point as latest returned.
- Gap: current open PnL attachment uses returned array index rather than latest
  overall snapshot identity.
- Architecture constraint: timeline history must stay ledger-backed.

### 2. Select One Priority Task
- Selected task: `RUNTIME-AUDIT-20`.
- Priority rationale: prevents dashboard chart/detail history from overstating
  past wallet equity when filtered.

### 3. Plan Implementation
- Compare returned snapshot id with latest overall selected-wallet snapshot id.

### 4. Execute Implementation
- Implementation notes: `getWalletEquityTimeline(...)` now loads the latest
  overall selected-wallet snapshot id and compares each returned filtered
  snapshot against that id before applying current open PnL.

### 5. Verify and Test
- Validation performed: failing-then-passing focused wallet regression, API
  typecheck, guardrails, lint, and diff review.
- Result: PASS.

### 6. Self-Review
- Technical debt introduced: no.
- Architecture alignment: yes; filtered historical timeline points stay
  historical and no historical open PnL is guessed.

### 7. Update Documentation and Knowledge
- Docs updated: `docs/modules/api-wallets.md`,
  `docs/planning/mvp-next-commits.md`, and
  `docs/planning/mvp-execution-plan.md`.
- Context updated: `.codex/context/TASK_BOARD.md` and
  `.codex/context/PROJECT_STATE.md`.

## Result Report
- Task summary: filtered wallet equity timeline responses no longer attach
  current open PnL to historical latest returned points.
- Files changed: wallet service, wallet e2e test, wallet module docs, planning
  queue, execution plan, task board, and project state.
- How tested: focused wallets e2e (`16/16`), API typecheck, repository
  guardrails, lint, and diff review.
- What is incomplete: nothing in this slice.
