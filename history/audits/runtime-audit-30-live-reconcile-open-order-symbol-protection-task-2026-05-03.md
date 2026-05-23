# Task

## Header
- ID: RUNTIME-AUDIT-30
- Title: Protect live local positions while same-symbol exchange orders are open
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-29
- Priority: P1
- Iteration: 48
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
LIVE reconciliation uses exchange position snapshots and open-order snapshots
to decide whether a local bot-managed position is stale. Open-order protection
currently maps order side to a single position side, so a pending `SELL` close
order can fail to protect a local `LONG` position.

## Goal
Prevent LIVE reconciliation from closing a local bot-managed position as stale
while any owned same-symbol exchange order is still open.

## Scope
- `apps/api/src/modules/positions/livePositionReconciliation.service.ts`
- `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: live bot position management can close local state
  while the exchange still has an open same-symbol order in flight.
- Expected product or reliability outcome: live reconciliation waits while
  same-symbol open orders indicate unresolved lifecycle state.
- How success will be observed: regression test proves a stale-looking local
  `LONG` is not closed when the exchange reports an open `SELL` order for the
  same symbol.
- Post-launch learning needed: no

## Deliverable For This Stage
A failing-then-passing live reconciliation regression and scoped fix.

## Constraints
- use existing live reconciliation ownership and open-order snapshot pipeline
- do not change exchange adapter contracts
- do not add new runtime systems
- keep stale local close behavior when no same-symbol open order exists
- fail closed for live money-impacting lifecycle decisions

## Implementation Plan
1. Add a regression where the exchange has no open position, but has an open
   same-symbol `SELL` order and a stale-looking local `LONG` position.
2. Change open-order stale-position protection from order-side identity to
   same-symbol lifecycle protection.
3. Preserve stale closure for unrelated symbols and existing synced-order
   cleanup behavior.
4. Run focused live reconciliation tests, related runtime tests, typecheck,
   guardrails, lint, and diff review.

## Acceptance Criteria
- [x] Same-symbol open exchange orders protect local managed live positions
  from stale closure regardless of order side.
- [x] Unrelated-symbol stale local positions still close after grace.
- [x] Existing synced open-order upsert and stale order cleanup still pass.
- [x] Source-of-truth docs are updated.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` is satisfied for this runtime lifecycle slice.
- [x] Regression test fails before the fix and passes after the fix.
- [x] Relevant validation commands pass.
- [x] Diff review confirms no workaround, duplicate pipeline, or unrelated
  cleanup was introduced.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - FAIL before fix:
    `pnpm --filter api run test -- src/modules/positions/livePositionReconciliation.service.test.ts -t "keeps stale-looking local managed live position" --sequence.concurrent=false`
    closed both BTC and ETH stale-looking local positions; expected only ETH.
  - PASS after fix:
    `pnpm --filter api run test -- src/modules/positions/livePositionReconciliation.service.test.ts -t "keeps stale-looking local managed live position" --sequence.concurrent=false`
  - PASS:
    `pnpm --filter api run test -- src/modules/positions/livePositionReconciliation.service.test.ts --sequence.concurrent=false`
    (`24/24`)
  - PASS:
    `pnpm --filter api run test -- src/modules/bots/bots.runtime-takeover.e2e.test.ts --sequence.concurrent=false`
    (`4/4`)
  - PASS:
    `pnpm --filter api run test -- src/modules/bots/bots.runtime-scope.e2e.test.ts --sequence.concurrent=false`
    (`12/12`)
  - PASS: `pnpm --filter api run typecheck`
  - PASS: `pnpm run quality:guardrails`
  - PASS: `pnpm run lint`
- Manual checks: diff review of live stale-close lifecycle path.
- Screenshots/logs: not applicable
- High-risk checks: money-impacting LIVE stale-close path covered by regression

## Architecture Evidence
- Architecture source reviewed: docs/architecture/01_overview-and-principles.md,
  docs/architecture/reference/runtime-signal-merge-contract.md,
  docs/modules/system-modules.md
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous order-side stale
  protection behavior.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: open-order protection maps order side to a single position side.
- Gaps: no test covers pending opposite-side close order protecting a local
  position during live reconciliation.
- Inconsistencies: lifecycle safety should pause stale local close while the
  exchange has any owned same-symbol open order.
- Architecture constraints: fail-closed money-impacting lifecycle behavior and
  explicit ownership context.

### 2. Select One Priority Task
- Selected task: `RUNTIME-AUDIT-30`.
- Priority rationale: ARCHITECT-mode audit found a lifecycle contract drift in
  live position close management.
- Why other candidates were deferred: broader import/write audits remain, but
  this is a small, high-safety slice.

### 3. Plan Implementation
- Files or surfaces to modify: live reconciliation service/test, task board,
  project state, next commits queue.
- Logic: same-symbol open orders protect both possible local position sides
  from stale closure for that reconciliation cycle.
- Edge cases: opposite-side close order, unrelated stale symbol, no open-order
  snapshot fallback.

### 4. Execute Implementation
- Implementation notes: added a regression covering an owned BTCUSDT open
  `SELL` order with a stale-looking local BTC `LONG` position and an unrelated
  stale ETH `LONG` position. Updated open-order protection to add same-symbol
  protection keys for both `LONG` and `SHORT`, because the open-order snapshot
  contract does not carry reduce-only/intent data.

### 5. Verify and Test
- Validation performed: focused failing-then-passing regression, full live
  reconciliation service test suite, sequential runtime takeover/scope e2e,
  API typecheck, repository guardrails, lint, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: treating only SELL as LONG close and BUY as SHORT
  close was rejected because order intent/reduce-only is not part of the
  snapshot contract.
- Technical debt introduced: no
- Scalability assessment: same-symbol protection is bounded by owned open
  orders and existing owner scope.
- Refinements made: removed an extra helper after guardrails reported the
  production monolith line budget would be exceeded by two lines.

### 7. Update Documentation and Knowledge
- Docs updated: this task document and `docs/planning/mvp-next-commits.md`.
- Context updated: `.codex/context/PROJECT_STATE.md` and
  `.codex/context/TASK_BOARD.md`.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Result Report
- Task summary: LIVE reconciliation now pauses stale local managed position
  closure when an owned exchange open order exists for the same symbol,
  regardless of order side.
- Files changed:
  `apps/api/src/modules/positions/livePositionReconciliation.service.ts`,
  `apps/api/src/modules/positions/livePositionReconciliation.service.test.ts`,
  `.codex/context/PROJECT_STATE.md`, `.codex/context/TASK_BOARD.md`,
  `docs/planning/mvp-next-commits.md`, and this task document.
- How tested: focused failing-then-passing regression, full service suite,
  sequential runtime e2e, API typecheck, guardrails, lint, and diff review.
- What is incomplete: nothing for this slice.
- Next steps: continue the next one-slice audit across live/paper lifecycle and
  dashboard truth surfaces.
- Decisions made: use same-symbol protection because the snapshot contract does
  not expose order intent.
