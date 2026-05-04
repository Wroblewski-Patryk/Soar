# Task

## Header
- ID: RUNTIME-AUDIT-128
- Title: Align dashboard fallback trade metadata
- Task Type: fix
- Current Stage: DONE
- Status: DONE
- Owner: Frontend Builder
- Depends on: RUNTIME-AUDIT-127
- Priority: P1
- Iteration: 128
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The dashboard home runtime component can briefly render local fallback trade
metadata before selected runtime trade metadata is available. Before this task,
that fallback always reported `totalPages=1`, even when there were zero trade
rows. API and aggregate runtime metadata use `totalPages=0` for empty trade
history, so the dashboard could show a small pagination-state drift.

## Goal
Keep dashboard fallback trade metadata aligned with runtime API empty-state
semantics while preserving stable page metadata for non-empty local rows.

## Scope
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Extract fallback runtime trade metadata construction into a small helper.
2. Return `totalPages=0`, `hasPrev=false`, and `hasNext=false` for empty
   fallback trade history.
3. Clamp non-empty fallback pages to the available local page range.
4. Add focused unit coverage for empty and non-empty fallback metadata.
5. Run focused web test, web typecheck, guardrails, lint, and diff review.

## Acceptance Criteria
- Empty dashboard fallback trade history reports `total=0` and
  `totalPages=0`.
- Non-empty fallback metadata clamps out-of-range pages to the last local page.
- Existing selected runtime API metadata remains the preferred source when
  available.

## Definition of Done
- [x] Implementation is scoped to the existing dashboard runtime component.
- [x] Regression coverage locks empty and clamped fallback metadata.
- [x] Relevant validation passed.
- [x] Canonical context and planning docs are updated.

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx` => PASS (`20/20`).
- Typecheck: `pnpm --filter web run typecheck` => PASS.
- Guardrails: `pnpm run quality:guardrails` => PASS.
- Lint: `pnpm run lint` => PASS.
- Diff review: `git diff --check` => PASS.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`, `docs/governance/autonomous-engineering-loop.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, dashboard fallback metadata did not match runtime
  API empty trade-history semantics.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: fallback trade metadata in `HomeLiveWidgets` reported one page for an
  empty local trade-history fallback.
- Gap: component tests did not cover fallback trade metadata construction.
- Architecture constraint: dashboard display state should reflect runtime API
  truth and avoid local-only counter drift.

### 2. Select One Priority Task
- Selected task: align dashboard fallback trade metadata with runtime empty
  aggregate semantics.
- Priority rationale: this is a small display-truth drift in the runtime
  dashboard surface.
- Deferred candidates: remote trade pagination and additional aggregate data
  fetching were kept out of scope.

### 3. Plan Implementation
- Add a typed helper for fallback metadata.
- Preserve selected API metadata as canonical when available.
- Cover empty and out-of-range non-empty fallback cases.

### 4. Execute Implementation
- Added `buildFallbackRuntimeTradeMeta`.
- Replaced the inline fallback object with the helper.
- Added focused helper tests in the existing dashboard component suite.

### 5. Verify and Test
- Focused dashboard component suite passed.
- Web typecheck, guardrails, lint, and diff check passed.

### 6. Self-Review
- Simpler option considered: change only the inline `totalPages` literal.
  Rejected because the helper makes empty and clamped non-empty behavior
  explicit and testable without rendering the full dashboard component.
- Technical debt introduced: no.
- Scalability assessment: keeps existing component ownership and avoids a new
  pagination system.

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
- Task summary: aligned dashboard fallback trade metadata with runtime API
  empty-state semantics.
- Files changed: dashboard home runtime component, focused component test, and
  canonical planning/context docs.
- How tested: focused component test, web typecheck, guardrails, lint, diff
  check.
- What is incomplete: no production deploy performed in this local slice.
- Next steps: continue auditing LIVE/PAPER dashboard parity for position
  lifecycle and runtime management surfaces.
