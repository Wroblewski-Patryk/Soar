# Task

## Header
- ID: RUNTIME-AUDIT-127
- Title: Preserve dashboard aggregate trade total before local filters
- Task Type: fix
- Current Stage: DONE
- Status: DONE
- Owner: Frontend Builder
- Depends on: RUNTIME-AUDIT-126
- Priority: P1
- Iteration: 127
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The dashboard home runtime controller receives aggregate trade metadata from
the API. The local dashboard trade-table transformation then filters, sorts,
and paginates the loaded rows. Before this task, the unfiltered dashboard view
replaced the API aggregate total with `items.length`, which could under-report
trade history when the API total was greater than the returned item window.

## Goal
Keep the unfiltered dashboard runtime trade-history count aligned with API
aggregate truth, while preserving local counts after local filters or sorting
are applied.

## Scope
- `apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.ts`
- `apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.test.tsx`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Detect active local trade filters in the dashboard runtime controller.
2. Preserve `baseTrades.total` when no local filters or sort are applied.
3. Keep local `sorted.length` totals when filters or sort are active, because
   those operations are performed over the currently loaded client-side rows.
4. Add a focused controller regression for API total greater than returned
   items.
5. Run focused web test, web typecheck, guardrails, lint, and diff review.

## Acceptance Criteria
- Unfiltered dashboard aggregate trade history keeps the API-provided total.
- Local filtered/sorted trade history still reports the local transformed
  result count.
- Returned table items remain the loaded window; this task does not introduce a
  new fetch/pagination system.

## Definition of Done
- [x] Implementation is scoped to the existing dashboard runtime controller.
- [x] Regression coverage locks API-total preservation.
- [x] Relevant validation passed.
- [x] Canonical context and planning docs are updated.

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/features/dashboard-home/hooks/useHomeLiveWidgetsController.test.tsx` => PASS (`2/2`).
- Typecheck: `pnpm --filter web run typecheck` => PASS.
- Guardrails: `pnpm run quality:guardrails` => PASS.
- Lint: `pnpm run lint` => PASS.
- Diff review: `git diff --check` => PASS.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`, `docs/governance/autonomous-engineering-loop.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, dashboard local transformation under-reported API
  aggregate trade total before local filters.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: `applyAggregateTradeQuery` computed `total` from loaded `items.length`
  even before local filters/sort.
- Gap: controller tests did not cover API total greater than returned item
  count.
- Architecture constraint: dashboard should reflect API aggregate truth unless
  the operator applies a local transformation.

### 2. Select One Priority Task
- Selected task: preserve API aggregate trade total in the unfiltered dashboard
  runtime view.
- Priority rationale: trade-history counters are dashboard truth and should not
  silently drift from the aggregate endpoint.
- Deferred candidates: deeper remote pagination for hidden trade windows is a
  larger feature and was kept out of this small slice.

### 3. Plan Implementation
- Add a small filter detector and preserve API totals only when no local filter
  or sort is active.
- Edge cases: empty filters, symbol/date filters, local sort, API total smaller
  than loaded item count.

### 4. Execute Implementation
- Added `hasActiveTradeFilters`.
- Changed unfiltered total resolution to `Math.max(baseTrades.total,
  sorted.length)`.
- Added a focused controller regression.

### 5. Verify and Test
- Focused controller suite passed.
- Web typecheck, guardrails, lint, and diff check passed.

### 6. Self-Review
- Simpler option considered: always use API total. Rejected because local
  filters/sort operate over loaded rows and should report the transformed local
  count.
- Technical debt introduced: no.
- Scalability assessment: preserves current client-side transform behavior and
  leaves remote pagination as an explicit future slice if needed.

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
- Task summary: preserved API aggregate trade totals before local dashboard
  filters/sort are applied.
- Files changed: dashboard home runtime controller, focused controller test, and
  canonical planning/context docs.
- How tested: focused controller test, web typecheck, guardrails, lint, diff
  check.
- What is incomplete: no production deploy performed in this local slice.
- Next steps: continue auditing dashboard/runtime parity for LIVE and PAPER
  position lifecycle surfaces.
