# Task

## Header
- ID: RUNTIME-AUDIT-135
- Title: Clamp reported table totals to visible rows
- Task Type: fix
- Current Stage: DONE
- Status: DONE
- Owner: Frontend Builder
- Depends on: RUNTIME-AUDIT-134
- Priority: P1
- Iteration: 135
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`RUNTIME-AUDIT-133` added display-only reported totals so runtime tables can
show authoritative API counters while keeping pagination mechanics tied to the
loaded row window. A remaining edge case existed when a stale or inconsistent
reported total was lower than the visible row count.

## Goal
Prevent dashboard table footers from reporting fewer rows than the table is
currently rendering.

## Scope
- `apps/web/src/ui/components/DataTable.tsx`
- `apps/web/src/ui/components/DataTable.test.tsx`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Clamp `reportedTotalRows` against the effective loaded row count used by
   the table.
2. Preserve the ability to display larger API totals without creating fake
   client-side pages.
3. Add a focused regression test for a lower reported total with a visible row.

## Acceptance Criteria
- Reported table total can be larger than loaded rows.
- Reported table total cannot be smaller than loaded rows.
- Pagination mechanics continue to use the existing loaded/manual totals.

## Definition of Done
- [x] Implementation is scoped to the shared table total display contract.
- [x] Regression coverage locks the lower-than-visible case.
- [x] Relevant validation passed.
- [x] Canonical context and planning docs are updated.

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/ui/components/DataTable.test.tsx` => PASS (`6/6`).
- Typecheck: `pnpm --filter web run typecheck` => PASS.
- Guardrails: `pnpm run quality:guardrails` => PASS.
- Lint: `pnpm run lint` => PASS.
- Diff review: `git diff --check` => PASS.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`, `docs/governance/autonomous-engineering-loop.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, a display-only runtime total could contradict
  visible dashboard rows if the reported counter was stale or inconsistent.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: `reportedTotalRows=0` with one visible row would display `Rows: 0`.
- Gap: R133 covered larger reported totals but not lower inconsistent totals.
- Architecture constraint: dashboard display must not contradict visible
  runtime evidence.

### 2. Select One Priority Task
- Selected task: clamp display-only reported table totals to visible rows.
- Priority rationale: R135 is TESTER mode and this closes a direct edge-case
  coverage gap in the shared table contract used by runtime position tables.
- Deferred candidates: broader runtime table visual audit remains out of scope.

### 3. Plan Implementation
- Adjust only `DataTable` reported total calculation.
- Add one focused regression test.
- Run shared table and web validation gates.

### 4. Execute Implementation
- Changed reported total calculation to `Math.max(totalRowsCount,
  externalReportedTotalRows)`.
- Added coverage that visible rows win over a lower reported total.

### 5. Verify and Test
- Focused `DataTable` suite passed.
- Web typecheck, guardrails, lint, and diff check passed.

### 6. Self-Review
- Simpler option considered: clamp totals at each dashboard call site.
  Rejected because the invariant belongs to the shared table display contract.
- Technical debt introduced: no.
- Scalability assessment: keeps all current and future reported-total callers
  protected.

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
- Task summary: display-only reported table totals can no longer be lower than
  the table's effective row count.
- Files changed: shared data table, focused table test, and canonical
  planning/context docs.
- How tested: focused shared table test, web typecheck, guardrails, lint, diff
  check.
- What is incomplete: no production deploy performed in this local slice.
- Next steps: continue auditing LIVE/PAPER dashboard parity for remaining
  position lifecycle display and management surfaces.
