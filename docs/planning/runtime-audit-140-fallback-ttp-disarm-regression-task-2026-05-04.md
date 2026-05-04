# Task

## Header
- ID: RUNTIME-AUDIT-140
- Title: Lock fallback TTP disarm behavior
- Task Type: test
- Current Stage: DONE
- Status: DONE
- Owner: QA/Test
- Depends on: RUNTIME-AUDIT-139
- Priority: P1
- Iteration: 140
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`RUNTIME-AUDIT-139` wired fallback TTP display into the selected dashboard view
model. Because this display can influence operator trust in protected profit,
the disarm path must be locked at the dashboard integration layer as well as in
the low-level trailing-stop helper.

## Goal
Ensure fallback TTP protection is removed from the dashboard row when live PnL
drops below the first trailing take-profit disarm floor.

## Scope
- `apps/web/src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Add a rerender regression for a selected open position with trailing
   take-profit levels.
2. Verify fallback TTP is visible when armed.
3. Rerender with live PnL below the disarm floor and verify fallback TTP display
   clears.
4. Keep dynamic-stop columns visible from planned row truth, while protected
   value itself clears.

## Acceptance Criteria
- Armed fallback TTP displays on the selected runtime row.
- Falling below disarm floor clears `fallbackTtpProtectedPercent`.
- `resolveDynamicTtpDisplay` returns `null` after disarm.
- The dynamic stop columns can remain visible when planned TTP row truth exists.

## Definition of Done
- [x] Dashboard integration regression exists.
- [x] Relevant validation passed.
- [x] Canonical context and planning docs are updated.
- [x] No runtime behavior was changed unnecessarily.

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.test.ts` => PASS (`7/7`).
- Typecheck: `pnpm --filter web run typecheck` => PASS.
- Guardrails: `pnpm run quality:guardrails` => PASS.
- Lint: `pnpm run lint` => PASS.
- Diff review: `git diff --check` => PASS.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`, `docs/governance/autonomous-engineering-loop.md`, `DEFINITION_OF_DONE.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no implementation mismatch; coverage gap found.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: dashboard fallback TTP display was newly wired in R139.
- Gap: dashboard-level coverage did not yet prove fallback TTP clears when the
  live PnL drops below disarm floor.
- Architecture constraint: money-impacting dashboard display must not overstate
  protected profit.

### 2. Select One Priority Task
- Selected task: lock fallback TTP disarm behavior.
- Priority rationale: R140 is TESTER mode and the highest-risk follow-up is a
  stale protected-profit display.
- Deferred candidates: backend dynamic stop persistence audit remains out of
  scope.

### 3. Plan Implementation
- Add one focused rerender test around the selected runtime view model.
- Reuse existing helper behavior through the dashboard integration.
- Run web validation gates.

### 4. Execute Implementation
- Added a regression where TTP is armed at 9% live PnL and clears after price
  rerender drops live PnL below the 3% disarm floor.

### 5. Verify and Test
- Focused runtime view-model suite passed.
- Web typecheck, guardrails, lint, and diff check passed.

### 6. Self-Review
- Simpler option considered: rely only on `trailingStopDisplay` unit tests.
  Rejected because R139 introduced stateful dashboard integration using a ref.
- Technical debt introduced: no.
- Scalability assessment: the regression protects the user-facing dashboard
  display contract.

### 7. Update Documentation and Knowledge
- Docs updated: this task file, task board, project state, MVP queue, MVP
  execution plan.
- Context updated: yes.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs and context were updated.

## Result Report
- Task summary: added dashboard integration coverage proving fallback TTP
  clears after live PnL drops below the disarm floor.
- Files changed: focused runtime view-model test and canonical planning/context
  docs.
- How tested: focused runtime view-model test, web typecheck, guardrails, lint,
  diff check.
- What is incomplete: no production deploy performed in this local slice.
- Next steps: continue auditing LIVE/PAPER money-impacting position-management
  display and control contracts.
