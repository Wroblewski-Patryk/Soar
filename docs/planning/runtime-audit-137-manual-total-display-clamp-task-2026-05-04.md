# Task

## Header
- ID: RUNTIME-AUDIT-137
- Title: Clamp manual table total display without reported totals
- Task Type: fix
- Current Stage: DONE
- Status: DONE
- Owner: Frontend Builder
- Depends on: RUNTIME-AUDIT-136
- Priority: P1
- Iteration: 137
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`RUNTIME-AUDIT-136` protected manual pagination when callers provide
`reportedTotalRows`. Manual-pagination callers can still rely only on
`totalRows`, so stale or inconsistent external metadata could report fewer rows
than the table renders.

## Goal
Make the table footer display at least the visible row count even when manual
pagination does not use `reportedTotalRows`.

## Scope
- `apps/web/src/ui/components/DataTable.tsx`
- `apps/web/src/ui/components/DataTable.test.tsx`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Clamp the non-reported display total to `Math.max(sortedRows.length,
   totalRowsCount)`.
2. Add a manual-pagination regression where `totalRows=0` but one row is
   rendered and no `reportedTotalRows` prop exists.
3. Run focused shared table tests and standard web validation gates.

## Acceptance Criteria
- Manual pagination without `reportedTotalRows` cannot display fewer rows than
  it renders.
- Empty manual metadata with no rows still reports zero rows and zero pages.
- Existing reported-total behavior remains unchanged.

## Definition of Done
- [x] Implementation is scoped to the shared table display total invariant.
- [x] Regression coverage locks the manual no-reported-total path.
- [x] Relevant validation passed.
- [x] Canonical context and planning docs are updated.

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/ui/components/DataTable.test.tsx` => PASS (`8/8`).
- Typecheck: `pnpm --filter web run typecheck` => PASS.
- Guardrails: `pnpm run quality:guardrails` => PASS.
- Lint: `pnpm run lint` => PASS.
- Diff review: `git diff --check` => PASS.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`, `docs/governance/autonomous-engineering-loop.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, manual pagination display could still contradict
  rendered rows when only `totalRows` metadata was stale.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: manual pagination with visible rows and stale `totalRows=0` could show
  `Rows: 0` unless `reportedTotalRows` was also supplied.
- Gap: R136 covered the reported-total branch but not the default manual total
  display branch.
- Architecture constraint: shared UI must not display dashboard totals that
  contradict rendered runtime data.

### 2. Select One Priority Task
- Selected task: clamp manual total display without reported totals.
- Priority rationale: this completes the shared table invariant across both
  reported and non-reported manual metadata paths.
- Deferred candidates: server-side pagination redesign remains out of scope.

### 3. Plan Implementation
- Update the shared display total fallback.
- Add one focused regression test.
- Run shared and web validation gates.

### 4. Execute Implementation
- Changed the non-reported branch of `reportedRowsCount` to clamp against
  `sortedRows.length`.
- Added a manual-pagination regression with stale zero total metadata.

### 5. Verify and Test
- Focused shared table suite passed.
- Web typecheck, guardrails, lint, and diff check passed.

### 6. Self-Review
- Simpler option considered: require all manual callers to pass
  `reportedTotalRows`. Rejected because the invariant belongs in the shared
  component and current callers already have a `totalRows` contract.
- Technical debt introduced: no.
- Scalability assessment: protects all manual table callers uniformly.

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
- Task summary: manual-pagination table footer totals now clamp to visible rows
  even without explicit reported totals.
- Files changed: shared data table, focused table test, and canonical
  planning/context docs.
- How tested: focused shared table test, web typecheck, guardrails, lint, diff
  check.
- What is incomplete: no production deploy performed in this local slice.
- Next steps: continue auditing LIVE/PAPER dashboard parity for remaining
  runtime display and management contracts.
