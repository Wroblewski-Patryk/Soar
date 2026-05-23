# Task

## Header
- ID: RUNTIME-AUDIT-36
- Title: Align aggregate header PnL with positions summary
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-35
- Priority: P1
- Iteration: 54
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime monitoring aggregate merges `symbolStats`, `positions`, and `trades`.
The aggregate header summary currently computes `realizedPnl`
from visible trade rows, while the positions section computes them from
position history. Imported or externally closed positions can have canonical
position PnL without local trade rows, causing the dashboard header and
positions section to disagree.

## Goal
Keep runtime monitoring aggregate header PnL aligned with the canonical
positions summary that already reflects imported position lifecycle state.

## Scope
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Success Signal
- User or operator problem: dashboard can show realized PnL in positions but
  zero realized PnL in the aggregate header for imported closed positions.
- Expected product or reliability outcome: aggregate header and positions
  summary report the same realized PnL for the selected runtime view.
- How success will be observed: regression test proves a closed imported
  position with no local trade row contributes to `sessionDetail.summary`.
- Post-launch learning needed: no

## Deliverable For This Stage
A failing-then-passing monitoring aggregate PnL parity regression and scoped
read-model fix.

## Constraints
- reuse existing positions summary already built inside aggregate read-model
- do not synthesize trade rows for closed imported positions in this slice
- do not change symbol stats semantics
- do not change session/trade list pagination
- keep ownership and market scope filters unchanged

## Implementation Plan
1. Add an e2e regression for an imported closed bot-managed position with
   position PnL and no local trades.
2. Align aggregate header `realizedPnl` with `positionsSummary`.
3. Run focused monitoring aggregate e2e, runtime history parity e2e, API
   typecheck, guardrails, lint, and diff review.

## Acceptance Criteria
- [x] Closed imported position PnL appears in `positions.summary.realizedPnl`.
- [x] The same PnL appears in `sessionDetail.summary.realizedPnl`.
- [x] Existing trade-backed fee behavior is unchanged.
- [x] Source-of-truth docs are updated.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` is satisfied for this runtime read-model slice.
- [x] Regression test fails before the fix and passes after the fix.
- [x] Relevant validation commands pass.
- [x] Diff review confirms no workaround, duplicate pipeline, or unrelated
  cleanup was introduced.

## Forbidden
- dashboard-only masking
- synthetic closed-trade generation in this slice
- changing persisted trade or position data
- new systems without approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- src/modules/bots/bots.monitoring-aggregate.e2e.test.ts -t "keeps aggregate header PnL aligned" --sequence.concurrent=false`
    failed before the fix with `sessionDetail.summary.realizedPnl` equal to
    `0` while `positions.summary.realizedPnl` was `37.5`, then passed after
    the fix.
  - `pnpm --filter api run test -- src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --sequence.concurrent=false`
    PASS (`8/8`).
  - `pnpm --filter api run test -- src/modules/bots/bots.runtime-history-parity.e2e.test.ts --sequence.concurrent=false`
    PASS (`6/6`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run lint` PASS.
- Manual checks: diff review confirmed the change is limited to aggregate
  header realized PnL parity and regression coverage.
- Screenshots/logs: not applicable
- High-risk checks: read-model summary only; no trading lifecycle decisions
  changed.

## Architecture Evidence
- Architecture source reviewed: docs/architecture/01_overview-and-principles.md,
  docs/modules/system-modules.md,
  docs/architecture/architecture-source-of-truth.md
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
- Rollback note: revert this commit to restore trade-row-only aggregate header
  PnL.
- Observability or alerting impact: dashboard summary parity improves.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: aggregate header PnL is derived from trade rows while positions
  summary is derived from position rows.
- Gaps: no monitoring aggregate test covers imported closed positions without
  local trade rows.
- Inconsistencies: position section can show realized PnL that the aggregate
  header omits.
- Architecture constraints: dashboard aggregate should reuse canonical
  read-model summaries and avoid duplicate truth.

### 2. Select One Priority Task
- Selected task: `RUNTIME-AUDIT-36`.
- Priority rationale: ARCHITECT-mode audit found duplicate summary truth inside
  one dashboard aggregate payload.
- Why other candidates were deferred: trade-list synthetic close anchors may be
  a later slice, but this header/position parity fix is smaller and reversible.

### 3. Plan Implementation
- Files or surfaces to modify: runtime monitoring aggregate read-model,
  monitoring aggregate e2e, task board, project state, next queue.
- Logic: use `positionsSummary.realizedPnl` for aggregate header summary.
- Edge cases: imported closed position with no trades, normal trade-backed
  close, open position unrealized PnL.

### 4. Execute Implementation
- Implementation notes: aggregate header `sessionDetail.summary.realizedPnl`
  now reuses `positionsSummary.realizedPnl`, which is already built from the
  scoped runtime position read model.

### 5. Verify and Test
- Validation performed: focused failing-then-passing regression, full
  monitoring aggregate e2e, runtime history parity e2e, API typecheck,
  guardrails, lint, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: adding closed synthetic trade rows was rejected as
  broader behavior than needed for this summary parity slice.
- Technical debt introduced: no
- Scalability assessment: removes duplicate summary calculation for realized
  PnL.
- Refinements made: kept fees out of this slice because imported position fees
  are not a persisted `Position` field and should remain trade-backed unless a
  separate fee source is introduced.

### 7. Update Documentation and Knowledge
- Docs updated: task doc and MVP next-commits queue.
- Context updated: task board and project state.
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
- Task summary: runtime monitoring aggregate header realized PnL now matches
  the scoped positions summary, so imported closed positions without local
  trade rows no longer disappear from the aggregate header.
- Files changed:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `docs/planning/mvp-next-commits.md`
- How tested: focused regression, full monitoring aggregate e2e, runtime
  history parity e2e, API typecheck, guardrails, lint, and diff review.
- What is incomplete: nothing for this slice.
- Next steps: continue the runtime dashboard audit with the next smallest
  position/trade/wallet/market/strategy truth drift.
- Decisions made: fees remain trade-backed in this slice because `Position`
  does not persist fees directly.
