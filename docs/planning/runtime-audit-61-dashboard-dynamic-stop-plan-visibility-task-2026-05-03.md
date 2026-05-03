# Task

## Header
- ID: RUNTIME-AUDIT-61
- Title: Align dashboard dynamic-stop plan visibility
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Frontend Builder
- Depends on: RUNTIME-AUDIT-60
- Priority: P1
- Iteration: 79
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Bots monitoring treats row-level dynamic-stop truth as present when a row has a
dynamic TTP/TSL value or planned trailing levels. Dashboard home only checks
dynamic stop values. A pre-arm position with TTP/TSL plans can therefore show
columns in Bots monitoring but hide them on dashboard home when the backend
strategy-mode flag is false.

## Goal
Use one shared frontend row-truth helper so dashboard home and Bots monitoring
render TTP/TSL columns consistently for dynamic values and planned trailing
levels.

## Scope
- `apps/web/src/features/bots/utils/runtimeSurfaceTruth.ts`
- `apps/web/src/features/bots/components/BotsManagement.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.ts`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
- Canonical planning/context docs for this iteration.

## Success Signal
- User or operator problem: dashboard home can hide TTP/TSL for pre-arm
  positions even though Bots monitoring shows the same row as protected by
  planned trailing levels.
- Expected outcome: both surfaces use identical dynamic-stop row truth.
- How success will be observed: web regression shows dashboard home renders TTP
  and TSL when a row has planned trailing levels and `showDynamicStopColumns`
  is false.

## Deliverable For This Stage
Released shared row-truth helper and dashboard-home regression.

## Constraints
- reuse existing runtime surface helper module
- do not introduce a parallel visibility model
- do not change backend payload contracts
- keep copy and layout unchanged

## Implementation Plan
1. Add a shared `hasRuntimeDynamicStopRowTruth` helper.
2. Reuse it in Bots monitoring and dashboard home dynamic column gates.
3. Add a dashboard-home regression for planned TTP/TSL levels with backend
   flag false.
4. Run focused web tests, typecheck, lint, guardrails, and diff review.

## Acceptance Criteria
- Dashboard home renders TTP/TSL when planned trailing levels exist.
- Bots monitoring still uses the same row-truth criteria.
- Relevant web checks remain green.

## Definition of Done
- [x] Focused dashboard-home web test passes.
- [x] Web typecheck passes.
- [x] Repository guardrails and lint pass.
- [x] Diff review confirms scope is limited to frontend dynamic-stop visibility parity.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated visibility logic
- backend contract changes
- unrelated UI polish

## Validation Evidence
- Tests:
  - `pnpm --filter web exec vitest run src/features/bots/utils/runtimeSurfaceTruth.test.ts src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/bots/components/BotsManagement.test.tsx` PASS (`33/33`)
  - `pnpm --filter web run typecheck` PASS
  - `pnpm run lint` PASS
  - `pnpm run quality:guardrails` PASS
  - `git diff --check` PASS
- Manual checks: code review confirmed scope is limited to shared frontend
  dynamic-stop visibility parity.
- Screenshots/logs: not applicable
- High-risk checks: display-only frontend parity, no trading side effects.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/reference/dynamic-stop-display-contract.md`,
  `docs/modules/api-bots.md`, `.codex/context/TASK_BOARD.md`,
  `.codex/context/PROJECT_STATE.md`.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Rollback note: revert this commit to restore prior dashboard-home
  dynamic-stop visibility behavior.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: dashboard home checks only dynamic values while Bots monitoring also
  checks planned trailing levels.
- Gaps: existing dashboard test covers armed dynamic values, not pre-arm plans.
- Inconsistencies: same position can show TTP/TSL on one surface and hide them
  on another.
- Architecture constraints: row truth is the frontend visibility authority.

### 2. Select One Priority Task
- Selected task: align dashboard dynamic-stop plan visibility.
- Priority rationale: directly matches the user's TTP visibility complaint.

### 3. Plan Implementation
- Files or surfaces to modify: shared helper, two consumers, one regression,
  planning/context docs.
- Logic: treat dynamic values, protected percents, and planned TTP/TSL levels
  as row truth.
- Edge cases: backend flag false, pre-arm levels present, no dynamic price yet.

### 4. Execute Implementation
- Implementation notes: added `hasRuntimeDynamicStopRowTruth` and reused it in
  dashboard home and Bots monitoring dynamic-stop column gates.

### 5. Verify and Test
- Validation performed: focused web regression pack, web typecheck, lint,
  repository guardrails, and diff review.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: patch dashboard home only.
- Technical debt introduced: no
- Scalability assessment: shared helper avoids another visibility drift.
- Refinements made: helper covers dynamic stop prices, derived protected
  percentages, and planned TTP/TSL levels.

### 7. Update Documentation and Knowledge
- Docs updated: this task file, task board, project state, next-commits queue.
- Context updated: task board, project state, and next-commits queue.
- Learning journal updated: not applicable.

## Result Report
- Task summary: dashboard home and Bots monitoring now share one row-truth
  helper for dynamic-stop column visibility.
- Files changed:
  - `apps/web/src/features/bots/utils/runtimeSurfaceTruth.ts`
  - `apps/web/src/features/bots/utils/runtimeSurfaceTruth.test.ts`
  - `apps/web/src/features/bots/components/BotsManagement.tsx`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.ts`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/runtime-audit-61-dashboard-dynamic-stop-plan-visibility-task-2026-05-03.md`
- How tested: focused web regression pack (`33/33`), web typecheck, lint,
  repository guardrails, and diff review.
- What is incomplete: nothing in this slice.
- Next steps: continue one-task runtime audit for the next dashboard LIVE/PAPER
  drift candidate.
- Decisions made: planned trailing levels are row truth for frontend column
  visibility even before dynamic TTP/TSL stop prices are armed.
