# Task

## Header
- ID: RUNTIME-AUDIT-139
- Title: Show fallback TTP protection on dashboard
- Task Type: fix
- Current Stage: DONE
- Status: DONE
- Owner: Frontend Builder
- Depends on: RUNTIME-AUDIT-138
- Priority: P1
- Iteration: 139
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The dashboard had a fallback TTP field and a tested helper for deriving
fallback protected PnL from trailing take-profit levels. The selected runtime
view model still set that field to `null`, and the TTP display resolver only
read backend-derived dynamic stop protection.

## Goal
Show TTP protection on open-position rows when trailing take-profit levels are
armed by live PnL before the backend has returned a dynamic TTP stop price.

## Scope
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Use the existing `resolveFallbackTtpProtectedPercent` helper in the selected
   runtime view model.
2. Keep sticky favorable-move state per open position and prune stale position
   ids.
3. Let the dynamic TTP display resolver read fallback protection when backend
   protection is not available.
4. Add focused coverage for armed trailing take-profit levels without dynamic
   stop price.

## Acceptance Criteria
- Armed trailing take-profit levels produce fallback TTP display values.
- Backend-provided `ttpProtectedPercent` still takes precedence.
- Dynamic stop columns become visible when row truth exists.
- Stale sticky fallback state is pruned to active positions.

## Definition of Done
- [x] Existing trailing-stop helper is reused.
- [x] Dashboard view model populates fallback TTP protection.
- [x] TTP display resolver can render fallback protection.
- [x] Relevant validation passed.
- [x] Canonical context and planning docs are updated.

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.test.ts` => PASS (`6/6`).
- Tests: `pnpm --filter web exec vitest run src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx` => PASS.
- Typecheck: `pnpm --filter web run typecheck` => PASS.
- Guardrails: `pnpm run quality:guardrails` => PASS.
- Lint: `pnpm run lint` => PASS.
- Diff review: `git diff --check` => PASS.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`, `docs/governance/autonomous-engineering-loop.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, dashboard had fallback TTP structures but did not
  populate or display them.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: an open position could satisfy TTP arm conditions while the dashboard
  still displayed `-` in the TTP column until dynamic stop price arrived.
- Gap: the fallback TTP helper existed but was not wired into the selected
  runtime dashboard view model.
- Architecture constraint: dashboard open-position display should reflect
  runtime row truth without duplicating stop logic.

### 2. Select One Priority Task
- Selected task: show fallback TTP protection on dashboard.
- Priority rationale: directly matches operator-reported TTP display drift and
  reuses existing tested systems.
- Deferred candidates: backend dynamic-stop persistence audit remains out of
  scope for this frontend display slice.

### 3. Plan Implementation
- Add sticky fallback TTP state to the selected runtime view model.
- Compute fallback protection from live PnL and trailing take-profit levels.
- Use fallback protection in TTP display resolver.
- Add focused regression coverage.

### 4. Execute Implementation
- Imported and reused `resolveFallbackTtpProtectedPercent` and
  `pruneStickyFavorableMoveMap`.
- Populated `fallbackTtpProtectedPercent` for selected open rows.
- Updated `resolveDynamicTtpDisplay` to fall back to the computed value.

### 5. Verify and Test
- Focused runtime selection view-model test passed.
- Runtime table presenter test, web typecheck, guardrails, lint, and diff
  check passed.

### 6. Self-Review
- Simpler option considered: display planned TTP level directly. Rejected
  because it would duplicate the existing sticky favorable-move fallback logic.
- Technical debt introduced: no.
- Scalability assessment: fallback calculation is centralized in the selected
  view model and display remains a pure resolver.

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
- Task summary: dashboard open positions now show fallback TTP protected
  percent when trailing take-profit levels are armed before dynamic stop price
  arrives.
- Files changed: runtime derivations, runtime selection view model, focused
  test, and canonical planning/context docs.
- How tested: focused runtime view-model test, runtime presenter test, web
  typecheck, guardrails, lint, diff check.
- What is incomplete: no production deploy performed in this local slice.
- Next steps: continue auditing LIVE/PAPER dashboard parity for remaining
  runtime position-management display and control contracts.
