# Dashboard Aggregate Selected-Bot View Plan (2026-04-19)

Status: completed (`DAGG-A..DAGG-C` closed on 2026-04-19)  
Execution mode: tiny-commit only (exactly one task per commit)  
Primary audience: implementation agent

## Source Context
- Production discrepancy documented on 2026-04-19 for bot `7204173d-af68-494a-bca8-95d3c1ba8ef1`:
  - `/dashboard/bots/:id/preview` shows historical closed positions (aggregate scope).
  - `/dashboard` selected bot shows empty `positions/history` because it binds to current session snapshot.
- Existing data is present in older sessions and aggregate endpoint; issue is view contract mismatch.

## Product Decision (locked by requester)
1. `/dashboard` must be an **aggregate runtime view** for the actively selected bot.
2. Data shown in dashboard tables must come from selected-bot aggregate scope:
  - `positions`
  - `orders`
  - `history`
3. No hidden contract divergence vs bot preview for the same selected bot.

## Scope Lock
1. Only dashboard runtime data contract and table rendering parity for selected bot.
2. No unrelated redesign work in other modules.
3. No cross-bot blending: aggregate remains strictly per selected bot.
4. Keep existing bot preview behavior unchanged.

## Target Contract
1. Dashboard runtime source of truth for selected bot is aggregate runtime payload (multi-session).
2. `positions` tab shows aggregate open positions with deterministic empty state.
3. `orders` tab shows aggregate open orders with deterministic empty state.
4. `history` tab includes aggregate closed positions table and aggregate trade history table (or clearly labeled empty states).
5. Switching selected bot immediately re-scopes all three tables to that bot’s aggregate data only.

## Execution Groups
1. `DAGG-A (commits DAGG-01..DAGG-04): contract freeze + dashboard aggregate data-source migration`
2. `DAGG-B (commits DAGG-05..DAGG-08): history positions parity + aggregate API contract hardening`
3. `DAGG-C (commits DAGG-09..DAGG-10): parity regression closure + canonical sync`

---

## Tiny-Commit Queue

### DAGG-01
`docs(contract): freeze /dashboard aggregate selected-bot runtime contract (positions/orders/history)`
- Scope:
  - Document that dashboard runtime tables are aggregate-by-selected-bot by default.
  - Document parity expectation with preview history visibility.
- Likely files:
  - `docs/planning/open-decisions.md`
  - `docs/modules/web-dashboard-home.md`
  - `docs/modules/web-bots.md`
- Done when:
  - No ambiguity remains about aggregate vs session contract on dashboard.

### DAGG-02
`test(web-red): add failing regression for selected-bot aggregate parity when RUNNING session is empty`
- Scope:
  - Reproduce case: current RUNNING session empty, older session has `historyItems > 0`.
  - Assert dashboard selected bot still shows aggregate history positions.
- Likely files:
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
- Done when:
  - Regression fails on current session-only behavior.

### DAGG-03
`feat(web-controller): switch dashboard selected-bot runtime loading to aggregate endpoint`
- Scope:
  - Replace session-centric table payload path in dashboard home controller with aggregate payload per selected bot.
  - Keep selected-bot scope and refresh behavior deterministic.
- Likely files:
  - `apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.ts`
  - `apps/web/src/features/bots/services/bots.service.ts`
  - `apps/web/src/features/bots/services/botsMonitoringAggregate.service.ts` (reuse or extraction)
- Done when:
  - Dashboard tables consume aggregate payload for selected bot.

### DAGG-04
`refactor(web-runtime-viewmodel): align positions/orders/trades derivation to aggregate payload`
- Scope:
  - Ensure runtime selection view model and derived counts/KPIs consume aggregate data consistently.
  - Prevent selected-session guards from nulling valid aggregate rows.
- Likely files:
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.ts`
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- Done when:
  - `positions/orders/history` derive from one aggregate selected-bot source.

### DAGG-05
`feat(web-history-tab): add aggregate closed-positions table in dashboard history tab`
- Scope:
  - Extend history tab to include closed positions (`positions.historyItems`) table.
  - Keep/align trade-history table in same tab with deterministic ordering and empty states.
- Likely files:
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeDataSection.tsx`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/types.ts`
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
- Done when:
  - User can see closed positions history on dashboard for selected bot aggregate.

### DAGG-06
`test(web-history-parity): lock dashboard history positions/trades parity and selected-bot switch behavior`
- Scope:
  - Add regression coverage for:
    - aggregate closed positions visibility,
    - aggregate trades visibility,
    - immediate selected-bot re-scope.
- Likely files:
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
- Done when:
  - Web regression covers the reported production discrepancy.

### DAGG-07
`test(api-aggregate-red): add regression for aggregate positions/orders/history counts across mixed session statuses`
- Scope:
  - Validate aggregate endpoint returns deterministic totals/items when:
    - RUNNING session has no rows,
    - older COMPLETED session has closed positions/open orders/trades.
- Likely files:
  - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
- Done when:
  - API regression fails on contract drift and protects aggregate semantics.

### DAGG-08
`fix(api-aggregate-contract): harden aggregate response determinism for dashboard tables`
- Scope:
  - If regressions reveal drift, fix sorting, window, and count consistency for:
    - `positions.openItems`
    - `positions.openOrders`
    - `positions.historyItems`
    - `trades.items`
- Likely files:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts`
- Done when:
  - Aggregate response is deterministic and dashboard-ready.

### DAGG-09
`test(e2e/web-parity): add scenario asserting /dashboard and /preview parity for selected bot aggregate history`
- Scope:
  - End-to-end or high-fidelity integration scenario for same bot:
    - preview shows history positions,
    - dashboard selected bot also shows history positions.
- Likely files:
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
  - `apps/web/src/features/bots/components/bots-management/BotsMonitoringTab.test.tsx` (or e2e counterpart)
- Done when:
  - Regression explicitly guards against hidden preview/dashboard divergence.

### DAGG-10
`qa(closure): run focused aggregate parity pack and sync canonical queue/context`
- Suggested commands:
  - `pnpm --filter api run test -- src/modules/bots/bots.monitoring-aggregate.e2e.test.ts --run`
  - `pnpm --filter web run test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/bots/components/bots-management/BotsMonitoringTab.test.tsx --run`
  - `pnpm --filter api run typecheck`
  - `pnpm --filter web run typecheck`
  - `pnpm --filter web run build`
  - `pnpm run quality:guardrails`
- Done when:
  - Focused aggregate parity checks pass and canonical planning/context docs are synchronized.

---

## Stage DoD

### Stage A DoD (`DAGG-A`)
- Dashboard data source for selected bot is aggregate (not single-session only).
- Baseline red tests for reported discrepancy are captured.

### Stage B DoD (`DAGG-B`)
- History tab includes closed positions and trades for selected bot aggregate.
- API aggregate contract is deterministic for positions/orders/history inputs.

### Stage C DoD (`DAGG-C`)
- Dashboard vs preview parity regression exists for selected bot aggregate history.
- Focused closure pack is green and queue/context synced.

## Risks and Rollback

### Stage A Risk / Rollback
- Risk:
  - Aggregate migration may affect refresh cadence or stale indicators.
- Rollback:
  - Revert `DAGG-03`/`DAGG-04` together; keep red tests from `DAGG-02`.

### Stage B Risk / Rollback
- Risk:
  - Adding history positions table may introduce UX duplication/confusion.
- Rollback:
  - Revert `DAGG-05`; keep regression tests and contract docs for controlled redesign.

### Stage C Risk / Rollback
- Risk:
  - API aggregate hardening can alter count semantics if ordering assumptions are wrong.
- Rollback:
  - Revert `DAGG-08` while preserving failing regression evidence from `DAGG-07`.

## Acceptance Criteria
1. For actively selected bot, dashboard `positions/orders/history` tables show aggregate bot data across sessions according to locked contract.
2. No case remains where preview shows closed history positions but dashboard has no place to display them.
3. Regression covers scenario: current RUNNING session empty, older session contains history positions.
