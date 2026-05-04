# Task

## Header
- ID: RUNTIME-AUDIT-138
- Title: Clamp manual total pages when rows are visible
- Task Type: fix
- Current Stage: DONE
- Status: DONE
- Owner: Frontend Builder
- Depends on: RUNTIME-AUDIT-137
- Priority: P1
- Iteration: 138
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Manual pagination preserves explicit `totalPages=0` for empty runtime metadata.
After the row-total display clamps, a remaining contradiction was possible:
manual metadata could report zero pages while the table rendered rows.

## Goal
Keep zero-page manual metadata valid for empty tables only, while visible rows
always imply at least one display page.

## Scope
- `apps/web/src/ui/components/DataTable.tsx`
- `apps/web/src/ui/components/DataTable.test.tsx`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Preserve explicit zero manual pages when no rows are present.
2. Clamp manual `totalPages` to at least one when rows are present.
3. Add a focused regression that verifies `Page 1/1` for visible rows with
   stale zero-page metadata.

## Acceptance Criteria
- Empty manual metadata still supports `totalPages=0`.
- Manual tables with visible rows never report zero pages.
- Existing row-total display clamps remain unchanged.

## Definition of Done
- [x] Implementation is scoped to the shared manual pagination display contract.
- [x] Regression coverage locks visible-row zero-page metadata.
- [x] Relevant validation passed.
- [x] Canonical context and planning docs are updated.

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/ui/components/DataTable.test.tsx` => PASS (`9/9`).
- Typecheck: `pnpm --filter web run typecheck` => PASS.
- Guardrails: `pnpm run quality:guardrails` => PASS.
- Lint: `pnpm run lint` => PASS.
- Diff review: `git diff --check` => PASS.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`, `docs/governance/autonomous-engineering-loop.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, zero-page metadata could contradict visible rows.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: manual tables could render rows while pagination summary displayed
  `Page 1/0`.
- Gap: existing zero-page coverage protected empty metadata only.
- Architecture constraint: dashboard table metadata must not contradict visible
  runtime evidence.

### 2. Select One Priority Task
- Selected task: clamp manual total pages when rows are visible.
- Priority rationale: R138 is ARCHITECT mode and this closes the shared table
  pagination contract after the row-total invariant work.
- Deferred candidates: full server-side pagination redesign remains out of
  scope.

### 3. Plan Implementation
- Adjust manual `totalPages` calculation to branch on visible row presence.
- Add focused coverage for stale zero-page metadata with visible rows.
- Run shared table and standard web validation gates.

### 4. Execute Implementation
- Introduced `externalTotalPagesValue`.
- Preserved zero pages only for empty manual rows.
- Added regression coverage for visible rows with zero external pages.

### 5. Verify and Test
- Focused shared table suite passed.
- Web typecheck, guardrails, lint, and diff check passed.

### 6. Self-Review
- Simpler option considered: leave external `totalPages` fully authoritative.
  Rejected because the shared component already renders rows, so zero pages
  would be self-contradictory UI.
- Technical debt introduced: no.
- Scalability assessment: keeps the invariant centralized for all manual table
  callers.

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
- Task summary: manual pagination now preserves `totalPages=0` for empty
  tables only and reports at least one page when rows are visible.
- Files changed: shared data table, focused table test, and canonical
  planning/context docs.
- How tested: focused shared table test, web typecheck, guardrails, lint, diff
  check.
- What is incomplete: no production deploy performed in this local slice.
- Next steps: continue auditing LIVE/PAPER dashboard parity for remaining
  runtime display and management contracts.
