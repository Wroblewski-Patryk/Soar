# Task

## Header
- ID: RUNTIME-AUDIT-136
- Title: Clamp manual reported table totals to visible rows
- Task Type: fix
- Current Stage: DONE
- Status: DONE
- Owner: Frontend Builder
- Depends on: RUNTIME-AUDIT-135
- Priority: P1
- Iteration: 136
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`RUNTIME-AUDIT-135` made display-only reported totals stay above the table's
effective total. In manual pagination mode, that effective total can come from
external metadata, so a stale `totalRows=0` could still contradict visible
manual rows.

## Goal
Apply the visible-row clamp to manual pagination tables as well as local
pagination tables.

## Scope
- `apps/web/src/ui/components/DataTable.tsx`
- `apps/web/src/ui/components/DataTable.test.tsx`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Clamp reported totals against `sortedRows.length` in addition to external
   and effective totals.
2. Add a manual-pagination regression for visible rows with stale zero totals.
3. Run focused shared table tests and standard web validation gates.

## Acceptance Criteria
- Manual pagination tables cannot report fewer rows than they render.
- Local pagination behavior from R135 remains preserved.
- Larger authoritative reported totals still display correctly.

## Definition of Done
- [x] Implementation is scoped to the shared table reported-total invariant.
- [x] Manual pagination regression coverage is present.
- [x] Relevant validation passed.
- [x] Canonical context and planning docs are updated.

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/ui/components/DataTable.test.tsx` => PASS (`7/7`).
- Typecheck: `pnpm --filter web run typecheck` => PASS.
- Guardrails: `pnpm run quality:guardrails` => PASS.
- Lint: `pnpm run lint` => PASS.
- Diff review: `git diff --check` => PASS.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`, `docs/governance/autonomous-engineering-loop.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, manual pagination could still show a reported
  total lower than visible rows when external metadata was stale.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: R135 covered local table totals but manual pagination could still use
  stale external total metadata as the lower bound.
- Gap: no manual pagination regression covered lower-than-visible reported
  totals.
- Architecture constraint: shared table display should never contradict
  rendered runtime rows.

### 2. Select One Priority Task
- Selected task: clamp manual reported table totals to visible rows.
- Priority rationale: this closes the same dashboard truth invariant for the
  manual-pagination path used by runtime metadata surfaces.
- Deferred candidates: broader runtime table pagination API design remains out
  of scope.

### 3. Plan Implementation
- Adjust the shared reported total formula.
- Add one manual-pagination test.
- Run relevant validation and sync docs.

### 4. Execute Implementation
- Updated reported total calculation to include `sortedRows.length`.
- Added a manual-pagination regression test with stale zero metadata and one
  visible row.

### 5. Verify and Test
- Focused shared table suite passed.
- Web typecheck, guardrails, lint, and diff check passed.

### 6. Self-Review
- Simpler option considered: patch only runtime call sites. Rejected because
  manual pagination is a shared table contract and future callers need the same
  invariant.
- Technical debt introduced: no.
- Scalability assessment: the invariant is centralized and covered.

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
- Task summary: manual-pagination reported totals now stay at least as large
  as visible rows.
- Files changed: shared data table, focused table test, and canonical
  planning/context docs.
- How tested: focused shared table test, web typecheck, guardrails, lint, diff
  check.
- What is incomplete: no production deploy performed in this local slice.
- Next steps: continue auditing LIVE/PAPER dashboard parity for remaining
  runtime display and management contracts.
