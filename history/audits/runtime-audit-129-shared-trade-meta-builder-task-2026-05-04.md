# Task

## Header
- ID: RUNTIME-AUDIT-129
- Title: Share dashboard runtime trade metadata builder
- Task Type: refactor
- Current Stage: DONE
- Status: DONE
- Owner: Frontend Builder
- Depends on: RUNTIME-AUDIT-128
- Priority: P1
- Iteration: 129
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
After the dashboard fallback trade metadata fix, the same page normalization,
empty-state, and prev/next semantics existed in both the dashboard component
fallback path and the aggregate trade controller path. Keeping the same runtime
display contract in two places creates a small but real drift risk for future
dashboard/runtime changes.

## Goal
Make dashboard runtime trade metadata construction single-source within the
existing `home-live-widgets` module boundary.

## Scope
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeTradeMeta.ts`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
- `apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Move runtime trade metadata normalization into a shared helper next to the
   runtime widget types.
2. Use the helper from the component fallback path.
3. Use the same helper from the aggregate trade controller query path.
4. Keep existing focused helper coverage and run component/controller suites.
5. Run web typecheck, guardrails, lint, and diff review.

## Acceptance Criteria
- Dashboard fallback trade metadata and aggregate query metadata use the same
  builder.
- Empty trade history still reports `totalPages=0`.
- Non-empty metadata still clamps requested page to the available page range.
- No new data-fetching or pagination system is introduced.

## Definition of Done
- [x] Implementation is scoped to the existing dashboard runtime module.
- [x] Duplicate metadata construction is removed.
- [x] Relevant validation passed.
- [x] Canonical context and planning docs are updated.

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => PASS (`20/20`).
- Tests: `pnpm --filter web exec vitest run src/features/dashboard-home/hooks/useHomeLiveWidgetsController.test.tsx` => PASS (`2/2`).
- Typecheck: `pnpm --filter web run typecheck` => PASS.
- Guardrails: `pnpm run quality:guardrails` => PASS.
- Lint: `pnpm run lint` => PASS.
- Diff review: `git diff --check` => PASS.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`, `docs/governance/autonomous-engineering-loop.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, runtime trade metadata construction was duplicated
  across dashboard component and controller paths.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: component fallback and aggregate controller both encoded the same
  metadata normalization contract.
- Gap: future changes to trade metadata could update one path but not the
  other.
- Architecture constraint: reuse existing approved systems and avoid duplicate
  logic for shared runtime display contracts.

### 2. Select One Priority Task
- Selected task: share runtime trade metadata construction.
- Priority rationale: R129 is an ARCHITECT iteration and this removes a small
  source-of-truth drift in the dashboard runtime surface.
- Deferred candidates: broader pagination architecture and remote trade windows
  remain out of scope.

### 3. Plan Implementation
- Add a helper in `home-live-widgets/runtimeTradeMeta.ts`.
- Import it from both component and controller.
- Keep test coverage focused on helper behavior and controller preservation.

### 4. Execute Implementation
- Added `buildRuntimeTradeMeta`.
- Replaced inline component fallback metadata construction.
- Replaced aggregate controller metadata construction.
- Updated the focused helper tests to import the shared helper.

### 5. Verify and Test
- Focused component and controller suites passed.
- Web typecheck, guardrails, lint, and diff check passed.

### 6. Self-Review
- Simpler option considered: leave the duplicated formulas because tests pass.
  Rejected because this iteration is ARCHITECT mode and the duplicate formula
  is exactly the kind of small drift source that has been causing dashboard
  inconsistencies.
- Technical debt introduced: no.
- Scalability assessment: keeps the helper inside the existing runtime widget
  module instead of creating a new cross-cutting system.

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
- Task summary: moved dashboard runtime trade metadata construction to a shared
  helper used by both fallback and aggregate controller paths.
- Files changed: shared runtime trade metadata helper, dashboard component,
  dashboard controller, focused component test, and canonical planning/context
  docs.
- How tested: focused component and controller tests, web typecheck,
  guardrails, lint, diff check.
- What is incomplete: no production deploy performed in this local slice.
- Next steps: continue auditing LIVE/PAPER dashboard parity for position
  lifecycle and runtime management surfaces.
