# Dashboard Runtime Data Parity Recovery Plan (2026-04-19)

Status: ready-for-implementation  
Execution mode: tiny-commit only (exactly one task per commit)  
Primary audience: implementation agent

## Source Request (condensed)
- `/dashboard` runtime tabs are inconsistent:
  - `positions`: positions are not opening or signal-driven flow does not execute.
  - `orders`: tab has no table rendering; should show table and empty state like other tabs.
  - `history`: runtime shows positions/trades, dashboard history does not.
- `signals` section still mixes markets outside actively selected bot context.
- Even when signal condition is met, order/position open does not happen.
- `selected bot` section appears partially stale:
  - strategy context does not always refresh with active bot selection.
  - spacing/layout tweaks requested (`mt-3 -> mt-6`, select-row placement between KPI row and markets/strategy row).

## Scope Lock (strict)
1. Only `/dashboard` runtime behavior listed above.
2. No unrelated wallet/profile/markets/form redesign work in this wave.
3. No broad architecture refactor unless required to satisfy the listed runtime contract.
4. Keep existing working behavior unchanged; fix only broken or inconsistent paths.

## Non-Goals
- No new dashboard modules.
- No new bot runtime features beyond restoring current expected behavior.
- No copy/style rewrites outside requested selected-bot spacing/layout updates.

## Target Contract
1. `selected bot` drives markets list and strategy context deterministically.
2. Dashboard `positions` and `history` reflect the same selected-bot runtime/session domain as runtime module.
3. `orders` tab always renders a table container; when no rows, it shows deterministic empty-state table content.
4. If signal condition is met:
  - either order/position opens through runtime path, or
  - runtime emits explicit blocked reason (risk/guardrail/contract) visible for diagnostics.
5. Selected-bot section layout:
  - first row (bot select) appears between KPI row and markets/strategy row,
  - row spacing updated to `mt-6` where currently `mt-3` in that section.

## Execution Groups
1. `DASHR-A (commits DASHR-01..DASHR-04): dashboard tab/view parity + selected-bot section consistency`
2. `DASHR-B (commits DASHR-05..DASHR-08): selected-bot runtime data parity for positions/history/signals scope`
3. `DASHR-C (commits DASHR-09..DASHR-11): signal->order execution diagnostic fix + closure`

---

## Tiny-Commit Queue

### DASHR-01
`docs(contract): freeze dashboard runtime parity contract for positions/orders/history/signals/selected-bot section`
- Scope:
  - Add explicit contract and scope-lock notes to canonical docs.
- Likely files:
  - `docs/planning/open-decisions.md`
  - `docs/modules/web-dashboard-home.md`
- Done when:
  - Expected tab/signal/selected-bot behavior is unambiguous for executor and QA.

### DASHR-02
`test(web-red): add failing coverage for orders-tab table rendering and selected-bot strategy refresh`
- Scope:
  - Reproduce current `orders` placeholder mismatch and strategy stale-state issue.
- Likely files:
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeDataSection.test.tsx` (if present/new)
- Done when:
  - Tests fail against current behavior and define expected UI contract.

### DASHR-03
`fix(web-orders-tab): replace open-orders placeholder with DataTable + deterministic empty state`
- Scope:
  - Render real table for `orders` tab.
  - Keep empty-state behavior visually aligned with `positions/history` table patterns.
- Likely files:
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeDataSection.tsx`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/types.ts`
- Done when:
  - Orders tab shows table in both non-empty and empty states.

### DASHR-04
`fix(web-selected-bot-panel): ensure strategy context refresh and apply requested spacing/layout order`
- Scope:
  - Strategy panel updates on bot switch deterministically.
  - Apply `mt-6` spacing and select-row placement requested in selected-bot section.
- Likely files:
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSidebarSection.tsx`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.ts`
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- Done when:
  - Bot switch updates strategy context immediately; requested layout is applied.

### DASHR-05
`test(api+web-red): reproduce positions/history mismatch between runtime module and dashboard selected snapshot`
- Scope:
  - Add deterministic regression for case where runtime has rows but dashboard tabs are empty/missing.
- Likely files:
  - `apps/api/src/modules/bots/bots.e2e.test.ts`
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
- Done when:
  - Failing tests capture mismatch in selected-bot/session snapshot wiring.

### DASHR-06
`fix(api+web-runtime-parity): align selected session/snapshot mapping for positions and history tabs`
- Scope:
  - Fix selected session/snapshot assembly so dashboard tabs consume same runtime domain as selected bot.
- Likely files:
  - `apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.ts`
- Done when:
  - Positions/history parity holds for selected bot across refresh cycles.

### DASHR-07
`test(api-red-signals-scope): lock selected-bot-only markets/strategy context in signals payload`
- Scope:
  - Add failing regression for signals showing markets/strategy outside selected bot.
- Likely files:
  - `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
- Done when:
  - Regression fails against leaked scope behavior.

### DASHR-08
`fix(api-signals-scope): enforce selected-bot symbol and strategy context parity for dashboard signals`
- Scope:
  - Tighten API symbol/strategy projection consumed by dashboard signals to selected-bot scope.
- Likely files:
  - `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts`
  - `apps/api/src/modules/bots/runtimeSymbolStatsEnrichment.service.ts`
- Done when:
  - Signals list and strategy lines match selected bot only.

### DASHR-09
`test(api-red-signal-execution): add regression for condition-met but no-order/no-position outcome`
- Scope:
  - Reproduce scenario where condition is met and runtime does not emit order/open action.
  - Assert explicit blocked reason when execution is intentionally prevented.
- Likely files:
  - `apps/api/src/modules/engine/runtimeSignalDecisionEngine.test.ts`
  - `apps/api/src/modules/orders/orders.service.test.ts`
  - `apps/api/src/modules/bots/bots.e2e.test.ts`
- Done when:
  - Failing tests capture execution-path gap clearly.

### DASHR-10
`fix(api-runtime-execution): restore signal->order->position flow or emit explicit blocked diagnostics`
- Scope:
  - Patch runtime execution gating/adapter mismatch that prevents expected open flow.
  - Keep fail-closed behavior; add explicit diagnostics for blocked path.
- Likely files:
  - `apps/api/src/modules/engine/runtimeSignalLoop.service.ts`
  - `apps/api/src/modules/engine/runtimeSignalDecisionEngine.ts`
  - `apps/api/src/modules/orders/orders.service.ts`
- Done when:
  - Condition-met scenarios either open position as expected or provide explicit reason in runtime payload/logs.

### DASHR-11
`qa(closure): run focused dashboard runtime parity pack and sync canonical queue/context`
- Suggested commands:
  - `pnpm --filter api run test -- src/modules/bots/bots.e2e.test.ts src/modules/bots/bots.runtime-scope.e2e.test.ts src/modules/engine/runtimeSignalDecisionEngine.test.ts src/modules/orders/orders.service.test.ts --run`
  - `pnpm --filter web run test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx --run`
  - `pnpm --filter api run typecheck`
  - `pnpm --filter web run typecheck`
  - `pnpm --filter web run build`
  - `pnpm run quality:guardrails`
- Done when:
  - Focused parity suite and closure checks are green and queue/context docs are synced.

---

## Stage DoD

### Stage A DoD (`DASHR-A`)
- Orders tab renders table + empty state consistently.
- Selected-bot strategy context refresh bug is fixed.
- Requested selected-bot section spacing/layout changes are implemented.

### Stage B DoD (`DASHR-B`)
- Dashboard positions/history for selected bot are runtime-parity consistent.
- Signals markets/strategy context are selected-bot scoped only.

### Stage C DoD (`DASHR-C`)
- Condition-met execution path is deterministic and diagnosable.
- Focused API/WEB parity regressions pass.
- Canonical queue/context docs synced.

## Risks and Rollback

### Stage A Risk / Rollback
- Risk:
  - Orders table wiring may drift from runtime payload shape.
- Rollback:
  - Revert `DASHR-03` only; keep red tests from `DASHR-02` as guard.

### Stage B Risk / Rollback
- Risk:
  - Tightened selected-bot scope can hide legacy/fallback symbols unexpectedly.
- Rollback:
  - Revert `DASHR-08` while keeping tests to isolate desired contract.

### Stage C Risk / Rollback
- Risk:
  - Runtime execution fix may alter other guardrails.
- Rollback:
  - Revert `DASHR-10` only and preserve diagnostic assertions from `DASHR-09`.

## Request-to-Task Mapping
- `positions` not opening / signal-driven flow issue: `DASHR-09`, `DASHR-10`
- `orders` no table: `DASHR-02`, `DASHR-03`
- `history` not showing runtime rows: `DASHR-05`, `DASHR-06`
- `signals` wrong markets for selected bot: `DASHR-07`, `DASHR-08`
- selected-bot strategy stale + spacing/layout tweak: `DASHR-04`
