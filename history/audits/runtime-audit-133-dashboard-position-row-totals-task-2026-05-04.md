# Task

## Header
- ID: RUNTIME-AUDIT-133
- Title: Preserve dashboard position row totals
- Task Type: fix
- Current Stage: DONE
- Status: DONE
- Owner: Frontend Builder
- Depends on: RUNTIME-AUDIT-132
- Priority: P1
- Iteration: 133
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The dashboard runtime tables already receive authoritative open-position and
open-order counters from the runtime position response. The visible table rows
can be a smaller snapshot window than those counters, which made the table
footer report loaded row length instead of the runtime total.

## Goal
Keep open-position and open-order table totals aligned with runtime API
counters without inventing client-side pages for rows the UI has not loaded.

## Scope
- `apps/web/src/ui/components/DataTable.tsx`
- `apps/web/src/ui/components/DataTable.test.tsx`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.open-orders-source.test.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeDataSection.tsx`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Add an explicit reported-row-total display hook to `DataTable`.
2. Keep pagination mechanics based on loaded rows unless manual pagination is
   enabled.
3. Pass runtime `openCount` and `openOrdersCount` into the dashboard runtime
   open-position and open-order tables.
4. Cover the shared table behavior and a dashboard open-orders mismatch case.

## Acceptance Criteria
- Open-position table footer can report runtime `openCount`.
- Open-orders table footer can report runtime `openOrdersCount`.
- Reported totals do not create fake client-side pagination pages.
- Existing manual pagination behavior for trade history remains unchanged.

## Definition of Done
- [x] Implementation is scoped to existing dashboard table and runtime widget
  contracts.
- [x] Shared table behavior is covered by a focused test.
- [x] Dashboard runtime open-orders count mismatch is covered.
- [x] Relevant validation passed.
- [x] Canonical context and planning docs are updated.

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/ui/components/DataTable.test.tsx` => PASS (`5/5`).
- Tests: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.open-orders-source.test.tsx` => PASS (`1/1`).
- Typecheck: `pnpm --filter web run typecheck` => PASS.
- Guardrails: `pnpm run quality:guardrails` => PASS.
- Lint: `pnpm run lint` => PASS.
- Diff review: `git diff --check` => PASS.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`, `docs/governance/autonomous-engineering-loop.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, dashboard table totals could collapse to loaded
  rows even when runtime counters reported a larger position/order total.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: runtime open-position and open-order counts were available but not
  reflected in table footer totals.
- Gap: table totals could imply fewer runtime rows than API reported.
- Architecture constraint: dashboard display must mirror runtime source of
  truth while avoiding hidden pagination behavior.

### 2. Select One Priority Task
- Selected task: preserve dashboard position and open-order row totals.
- Priority rationale: the user is auditing dashboard truth for live/paper
  position management, and this was another visible counter-vs-table drift.
- Deferred candidates: deeper server-side pagination for open positions/orders
  remains out of scope.

### 3. Plan Implementation
- Add display-only reported totals to the shared table.
- Feed dashboard runtime position counters into open-position and open-order
  table instances.
- Add focused regression coverage.

### 4. Execute Implementation
- Added `reportedTotalRows` to `DataTable`.
- Used reported totals for table footer and summary text only.
- Passed `openCount` and `openOrdersCount` from `HomeLiveWidgets` into
  `RuntimeDataSection`.
- Covered open-orders API-total mismatch in the dashboard test.

### 5. Verify and Test
- Focused shared table and dashboard open-orders tests passed.
- Web typecheck, guardrails, lint, and diff check passed.

### 6. Self-Review
- Simpler option considered: enable manual pagination for open-position and
  open-order tables. Rejected because it would expose pages that are not backed
  by loaded rows or a server-side page contract.
- Technical debt introduced: no.
- Scalability assessment: the new table prop is display-only and keeps
  pagination ownership explicit.

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
- Task summary: dashboard open-position and open-order table totals now use
  runtime API counters while preserving client-side pagination mechanics.
- Files changed: shared data table, runtime dashboard widgets, focused tests,
  and canonical planning/context docs.
- How tested: focused table and dashboard tests, web typecheck, guardrails,
  lint, diff check.
- What is incomplete: no production deploy performed in this local slice.
- Next steps: continue auditing LIVE/PAPER dashboard parity for remaining
  position lifecycle display and control surfaces.
