# Task

## Header
- ID: RUNTIME-AUDIT-134
- Title: Include open-order symbols in runtime icon lookup
- Task Type: fix
- Current Stage: DONE
- Status: DONE
- Owner: Frontend Builder
- Depends on: RUNTIME-AUDIT-133
- Priority: P2
- Iteration: 134
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime open-order columns render asset symbols with the same icon resolver as
open positions and trades. The runtime icon lookup source included signal,
open-position, trade, and base-currency symbols, but omitted symbols that only
appear in open orders.

## Goal
Make open-order rows visually consistent with the rest of the runtime dashboard
by including open-order symbols in the shared runtime icon lookup input.

## Scope
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.open-orders-source.test.tsx`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Add `selected.positions.openOrders` symbols to `runtimeIconSymbols`.
2. Keep the existing normalized unique sorted lookup hook as the source of
   icon de-duplication.
3. Extend the open-orders source regression test to assert icon lookup receives
   symbols that exist only in open orders.

## Acceptance Criteria
- Open-order-only symbols are included in the runtime icon lookup input.
- Existing open-position, trade, signal, and base-currency icon behavior is
  unchanged.
- The dashboard open-orders regression covers the missing symbol source.

## Definition of Done
- [x] Implementation is scoped to the existing runtime icon symbol collection.
- [x] No new icon lookup path or duplicate resolver is introduced.
- [x] Relevant validation passed.
- [x] Canonical context and planning docs are updated.

## Validation Evidence
- Tests: `pnpm --filter web exec vitest run src/features/dashboard-home/components/HomeLiveWidgets.open-orders-source.test.tsx` => PASS (`1/1`).
- Typecheck: `pnpm --filter web run typecheck` => PASS.
- Guardrails: `pnpm run quality:guardrails` => PASS.
- Lint: `pnpm run lint` => PASS.
- Diff review: `git diff --check` => PASS.

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`, `docs/governance/autonomous-engineering-loop.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes, open-order rows used the runtime icon resolver but
  were not part of the runtime icon lookup source set.
- Decision required from user: no.
- Follow-up architecture doc updates: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: open-order-only symbols could render without available icon metadata.
- Gap: tests covered open-order source labels and totals, but not open-order
  participation in shared runtime asset metadata lookup.
- Architecture constraint: dashboard display should reuse shared icon lookup
  and resolver paths.

### 2. Select One Priority Task
- Selected task: include open-order symbols in runtime icon lookup.
- Priority rationale: small visible dashboard parity drift in the position
  management surface.
- Deferred candidates: broader visual review of all runtime table columns.

### 3. Plan Implementation
- Add open-order symbols to the existing runtime symbol set.
- Reuse `useCoinIconLookup` normalization and de-duplication.
- Extend the existing open-orders dashboard test.

### 4. Execute Implementation
- Updated `runtimeIconSymbols` to include `selected.positions.openOrders`.
- Added a regression assertion that lookup receives open-order-only symbols.

### 5. Verify and Test
- Focused dashboard open-orders test passed.
- Web typecheck, guardrails, lint, and diff check passed.

### 6. Self-Review
- Simpler option considered: resolve icons lazily per open-order cell. Rejected
  because it would duplicate lookup ownership and bypass the shared hook.
- Technical debt introduced: no.
- Scalability assessment: keeps all runtime visible symbols in one lookup set.

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
- Task summary: open-order-only symbols are now included in runtime dashboard
  icon lookup.
- Files changed: runtime dashboard widget, focused open-orders test, and
  canonical planning/context docs.
- How tested: focused dashboard open-orders test, web typecheck, guardrails,
  lint, diff check.
- What is incomplete: no production deploy performed in this local slice.
- Next steps: continue auditing LIVE/PAPER dashboard parity for remaining
  position lifecycle display and management surfaces.
