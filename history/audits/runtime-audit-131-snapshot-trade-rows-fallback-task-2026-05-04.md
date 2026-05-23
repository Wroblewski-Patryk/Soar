# Task

## Header
- ID: RUNTIME-AUDIT-131
- Title: Preserve snapshot trade rows before query projection
- Task Type: fix
- Current Stage: DONE
- Status: DONE
- Owner: Frontend Builder
- Depends on: RUNTIME-AUDIT-130
- Priority: P1
- Iteration: 131
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime snapshots already carry `trades.items`, while the dashboard controller
also derives `selectedTrades` after applying local trade filters, sort, and
pagination. Before this task, the runtime selection view model showed trade
rows only when `selectedTrades` was ready and matched the runtime session id.
That could make the dashboard table briefly drop valid snapshot trade rows even
though the selected runtime snapshot already contained them.

## Goal
Keep dashboard trade rows visible from snapshot truth until the selected trade
query projection is ready.

## Scope
- `apps/web/src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Keep using `selectedTrades.items` when its `sessionId` matches the selected
   runtime trade session.
2. Fall back to `selected.trades.items` when `selectedTrades` is not ready and
   the snapshot trade session id matches.
3. Keep mismatched session data hidden to avoid stale cross-session rows.
4. Add a focused view-model regression for snapshot trade rows with
   `selectedTrades=null`.
5. Run focused dashboard tests plus web typecheck, guardrails, lint, and diff
   review.

## Acceptance Criteria
- Snapshot trade rows remain visible before selected trade query projection is
  ready.
- Matching `selectedTrades` still takes precedence.
- Mismatched session trade rows are not displayed.

## Definition of Done
- [x] Implementation is scoped to the existing runtime selection view model.
- [x] Regression coverage locks snapshot trade-row fallback.
- [x] Relevant validation passed.
- [x] Canonical context and planning docs are updated.

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.test.ts` => PASS (`2/2`).
- Tests: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => PASS (`20/20`).
- Typecheck: `pnpm --filter web run typecheck` => PASS.
- Guardrails: `pnpm run quality:guardrails` => PASS.
- Lint: `pnpm run lint` => PASS.
- Diff review: `git diff --check` => PASS.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`, `docs/governance/autonomous-engineering-loop.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, dashboard selected-data projection ignored matching
  snapshot trade rows until the derived selected trade query was ready.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: `useRuntimeSelectionViewModel` returned an empty trade row list when
  `selectedTrades` was null, even if `selected.trades.items` already matched
  the selected runtime session.
- Gap: view-model tests did not cover snapshot trade-row fallback.
- Architecture constraint: dashboard display should reflect selected runtime
  snapshot truth and avoid transient local projection drift.

### 2. Select One Priority Task
- Selected task: preserve snapshot trade rows before selected trade query
  projection is ready.
- Priority rationale: this directly affects dashboard trade-history visibility.
- Deferred candidates: broader remote trade pagination remains out of scope.

### 3. Plan Implementation
- Add a fallback path that only reads snapshot rows when session ids match.
- Preserve selected query projection precedence.
- Add focused regression coverage.

### 4. Execute Implementation
- Updated trade-row selection in `useRuntimeSelectionViewModel`.
- Added a view-model regression with `selectedTrades=null` and snapshot trades.

### 5. Verify and Test
- Focused view-model and dashboard component suites passed.
- Web typecheck, guardrails, lint, and diff check passed.

### 6. Self-Review
- Simpler option considered: always show `selected.trades.items`. Rejected
  because query projection should still take precedence after filters, sorting,
  or pagination are applied.
- Technical debt introduced: no.
- Scalability assessment: uses existing snapshot/query ownership without a new
  state source.

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
- Task summary: preserved matching snapshot trade rows until selected trade
  query projection is ready.
- Files changed: runtime selection view model, focused view-model test, and
  canonical planning/context docs.
- How tested: focused view-model and dashboard tests, web typecheck,
  guardrails, lint, diff check.
- What is incomplete: no production deploy performed in this local slice.
- Next steps: continue auditing LIVE/PAPER dashboard parity for position
  lifecycle and runtime management surfaces.
