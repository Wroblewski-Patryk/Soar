# Task

## Header
- ID: RUNTIME-AUDIT-132
- Title: Centralize selected runtime trade-row resolution
- Task Type: refactor
- Current Stage: DONE
- Status: DONE
- Owner: Frontend Builder
- Depends on: RUNTIME-AUDIT-131
- Priority: P1
- Iteration: 132
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`RUNTIME-AUDIT-131` restored snapshot trade rows before the selected trade
query projection is ready. That left the session-id matching and precedence
rules encoded inline inside the runtime selection view model. Because this is a
dashboard truth boundary, the rules should be explicit and directly tested.

## Goal
Make selected runtime trade-row resolution a single small contract with focused
coverage for query precedence, snapshot fallback, and mismatched-session
blocking.

## Scope
- `apps/web/src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Extract selected runtime trade-row resolution into a helper.
2. Keep selected query projection precedence over snapshot rows.
3. Keep matching snapshot fallback when query projection is not ready.
4. Keep mismatched session rows hidden.
5. Add focused helper tests and run dashboard/web validations.

## Acceptance Criteria
- Trade-row precedence is implemented in one helper.
- `selectedTrades` rows win when they match the runtime trade session id.
- Snapshot rows are used only when they match and query rows are unavailable.
- Mismatched session rows stay hidden.

## Definition of Done
- [x] Implementation is scoped to existing dashboard runtime view-model logic.
- [x] Helper coverage locks all trade-row selection branches.
- [x] Relevant validation passed.
- [x] Canonical context and planning docs are updated.

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.test.ts` => PASS (`5/5`).
- Tests: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => PASS (`20/20`).
- Typecheck: `pnpm --filter web run typecheck` => PASS.
- Guardrails: `pnpm run quality:guardrails` => PASS.
- Lint: `pnpm run lint` => PASS.
- Diff review: `git diff --check` => PASS.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`, `docs/governance/autonomous-engineering-loop.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, selected runtime trade-row precedence was inline
  and easy to drift after the snapshot fallback fix.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: query precedence, snapshot fallback, and session-id guard logic were
  encoded inline in the view model.
- Gap: tests covered the fallback but not the full selector contract.
- Architecture constraint: shared dashboard truth rules should be explicit and
  covered rather than duplicated or hidden in nested branches.

### 2. Select One Priority Task
- Selected task: centralize selected runtime trade-row resolution.
- Priority rationale: R132 is ARCHITECT mode and this tightens the dashboard
  runtime truth boundary without changing behavior.
- Deferred candidates: deeper remote trade pagination remains out of scope.

### 3. Plan Implementation
- Add `resolveSelectedRuntimeTradeRows`.
- Reuse the helper in the selected-data projection.
- Add branch tests for precedence, fallback, and mismatch blocking.

### 4. Execute Implementation
- Extracted the helper in the existing view-model module.
- Replaced inline ternary trade-row selection with the helper.
- Added focused helper tests.

### 5. Verify and Test
- Focused view-model and dashboard component suites passed.
- Web typecheck, guardrails, lint, and diff check passed.

### 6. Self-Review
- Simpler option considered: leave the inline ternary after R131. Rejected
  because this iteration is ARCHITECT mode and the inline contract is a small
  future drift source.
- Technical debt introduced: no.
- Scalability assessment: keeps ownership inside the existing dashboard
  runtime view-model module.

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
- Task summary: centralized selected runtime trade-row resolution and covered
  query precedence, snapshot fallback, and mismatched-session blocking.
- Files changed: runtime selection view model, focused view-model test, and
  canonical planning/context docs.
- How tested: focused view-model and dashboard tests, web typecheck,
  guardrails, lint, diff check.
- What is incomplete: no production deploy performed in this local slice.
- Next steps: continue auditing LIVE/PAPER dashboard parity for position
  lifecycle and runtime management surfaces.
