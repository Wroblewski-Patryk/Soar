# Task

## Header
- ID: RUNTIME-AUDIT-130
- Title: Preserve empty manual pagination metadata
- Task Type: fix
- Current Stage: DONE
- Status: DONE
- Owner: Frontend Builder
- Depends on: RUNTIME-AUDIT-129
- Priority: P1
- Iteration: 130
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime trade metadata now correctly uses `totalPages=0` for empty trade
history. The shared `DataTable` still normalized manual pagination
`totalPages` to at least `1`, which could make an empty runtime table display a
page count that does not match the API/controller contract.

## Goal
Keep manual table pagination aligned with externally supplied empty-state
metadata, especially dashboard runtime trade-history metadata.

## Scope
- `apps/web/src/ui/components/DataTable.tsx`
- `apps/web/src/ui/components/DataTable.test.tsx`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Let manual pagination preserve an explicit external `totalPages=0`.
2. Keep effective page display stable at page `1` for empty manual metadata.
3. Clamp manual page navigation against at least page `1` so callbacks never
   receive page `0`.
4. Add a focused `DataTable` regression for empty manual pagination metadata.
5. Run focused table and dashboard tests plus web typecheck, guardrails, lint,
   and diff review.

## Acceptance Criteria
- Manual pagination respects external `totalPages=0`.
- Empty manual pagination does not render previous/next controls.
- Manual page callbacks remain clamped to valid one-based page numbers.
- Non-manual pagination continues to use at least one display page.

## Definition of Done
- [x] Implementation is scoped to shared `DataTable` pagination behavior.
- [x] Regression coverage locks empty manual metadata behavior.
- [x] Relevant validation passed.
- [x] Canonical context and planning docs are updated.

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/ui/components/DataTable.test.tsx` => PASS (`4/4`).
- Tests: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => PASS (`20/20`).
- Typecheck: `pnpm --filter web run typecheck` => PASS.
- Guardrails: `pnpm run quality:guardrails` => PASS.
- Lint: `pnpm run lint` => PASS.
- Diff review: `git diff --check` => PASS.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`, `docs/governance/autonomous-engineering-loop.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, shared table manual pagination overrode external
  runtime empty-state metadata.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: runtime trade metadata reported `totalPages=0`, but `DataTable`
  manual pagination forced total pages to at least `1`.
- Gap: shared table tests did not cover explicit empty manual pagination
  metadata.
- Architecture constraint: dashboard display should reflect upstream runtime
  metadata truth.

### 2. Select One Priority Task
- Selected task: preserve explicit empty manual pagination metadata in
  `DataTable`.
- Priority rationale: R130 is TESTER mode and this closes a missing regression
  around a user-visible dashboard truth surface.
- Deferred candidates: broader remote pagination for runtime trades remains out
  of scope.

### 3. Plan Implementation
- Keep non-manual pagination unchanged.
- Allow manual `totalPages=0`.
- Keep empty manual effective page one-based for stable display and callbacks.

### 4. Execute Implementation
- Updated manual `totalPages` normalization.
- Updated manual page clamping paths.
- Added a focused empty manual pagination regression.

### 5. Verify and Test
- Focused `DataTable` and dashboard component suites passed.
- Web typecheck, guardrails, lint, and diff check passed.

### 6. Self-Review
- Simpler option considered: only hide pagination controls in runtime dashboard.
  Rejected because the mismatch lived in the shared manual pagination contract,
  not in a screen-local branch.
- Technical debt introduced: no.
- Scalability assessment: preserves existing `DataTable` API and only aligns
  manual mode with caller-provided metadata.

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
- Task summary: aligned shared manual table pagination with explicit empty
  runtime metadata.
- Files changed: shared `DataTable`, focused table test, and canonical
  planning/context docs.
- How tested: focused table and dashboard tests, web typecheck, guardrails,
  lint, diff check.
- What is incomplete: no production deploy performed in this local slice.
- Next steps: continue auditing LIVE/PAPER dashboard parity for position
  lifecycle and runtime management surfaces.
