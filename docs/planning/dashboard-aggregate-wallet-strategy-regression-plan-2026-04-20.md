# Dashboard Aggregate Wallet and Strategy Regression Plan (2026-04-20)

Status: completed (`DAWR-A..DAWR-C` closed on 2026-04-20)  
Execution mode: tiny-commit only (exactly one task per commit)  
Primary audience: execution agent

## Source Analysis Summary
- Dashboard home is aggregate-first (`/runtime-monitoring/aggregate`) while wallet KPI logic expects capital fields available in session payloads.
- Aggregate `positions.summary` currently misses wallet-capital fields consumed by LIVE KPI (`referenceBalance`, `freeCash` aliases), causing `-`/incorrect values in sidebar wallet cards.
- Strategy sidebar refresh logic is fixed, but edge case remains sensitive when `selected.bot.strategyId` is null/mismatched and fallback strategy rendering can appear stale.
- There is documented planning drift risk between canonical queue files and execution-plan checkbox states.

## Scope
- API aggregate contract for wallet-capital summary fields.
- Web dashboard LIVE wallet KPI path (aggregate success path, no unintended session fallback masking).
- Sidebar strategy edge-case regression lock for null/mismatched strategy id.
- Operational drift diagnostics/repair flow usage for strategy mismatch.
- Canonical planning/status synchronization.

## Scope Lock
1. No unrelated UX redesign in dashboard.
2. No runtime strategy semantics rewrite outside this regression.
3. Keep aggregate-first dashboard data-source policy.

## Target Contract
1. Aggregate `positions.summary` exposes the same wallet-capital fields needed by dashboard LIVE KPI as session contract:
   - `referenceBalance`
   - `freeCash`
   - compatible aliases used by web selector/view-model.
2. Dashboard LIVE wallet KPI must render from aggregate payload when aggregate request succeeds.
3. Sidebar strategy card must behave deterministically for `strategyId=null/mismatch` and remain aligned to selected bot runtime context.
4. Planning docs stay synchronized (`mvp-next-commits`, `TASK_BOARD`, `PROJECT_STATE`, `mvp-execution-plan`).

## Execution Groups
1. `DAWR-A (commits DAWR-01..DAWR-03): contract freeze + aggregate API regression/fix`
2. `DAWR-B (commits DAWR-04..DAWR-07): web wallet + strategy edge-case regressions/fixes`
3. `DAWR-C (commits DAWR-08..DAWR-10): ops diagnostics note + planning sync + closure`

---

## Tiny-Commit Queue

### DAWR-01
`docs(contract): freeze aggregate wallet-summary field parity and strategy sidebar edge behavior`
- Scope:
  - Lock API/web contract for aggregate wallet capital fields.
  - Lock sidebar null/mismatch strategy fallback behavior expectations.
- Likely files:
  - `docs/planning/open-decisions.md`
  - `docs/modules/api-bots.md`
  - `docs/modules/web-dashboard-home.md`
- Done when:
  - One canonical contract defines required aggregate summary fields and sidebar edge behavior.

### DAWR-02
`test(api-red): add aggregate regression for LIVE wallet capital fields in positions.summary`
- Scope:
  - Add failing API regression asserting aggregate payload includes capital fields needed by LIVE wallet KPI.
- Likely files:
  - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.test.ts`
- Done when:
  - Test fails on missing `referenceBalance/freeCash` in aggregate summary.

### DAWR-03
`fix(api-aggregate): include referenceBalance/freeCash parity fields in aggregate positions summary`
- Scope:
  - Extend aggregate summary projection with capital fields and aliases used by web.
  - Keep deterministic aggregate ordering/contract.
- Likely files:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- Done when:
  - Aggregate summary contract is parity-aligned with session-level wallet KPI needs.

### DAWR-04
`test(web-red): add LIVE wallet regression for aggregate-success path without session fallback masking`
- Scope:
  - Add failing web regression that proves LIVE wallet KPI must read aggregate fields when aggregate succeeds.
- Likely files:
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.aggregate-wallet.test.tsx`
- Done when:
  - Test catches masked fallback-to-session behavior for LIVE wallet KPI.

### DAWR-05
`fix(web-wallet-kpi): align runtime selection wallet summary mapping to aggregate capital fields`
- Scope:
  - Harden wallet KPI mapping logic for aggregate summary fields/aliases.
  - Preserve PAPER behavior and current fallback semantics for true aggregate failure only.
- Likely files:
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.ts`
  - `apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.ts`
- Done when:
  - LIVE wallet KPI renders deterministically from aggregate success payload.

### DAWR-06
`test(web-edge): lock strategy sidebar behavior for selected bot strategyId null/mismatch`
- Scope:
  - Add explicit regression covering strategy edge path and expected fallback source.
- Likely files:
  - `apps/web/src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx`
- Done when:
  - Strategy card behavior is regression-locked for null/mismatch scenarios.

### DAWR-07
`fix(web-sidebar): tighten strategy card source precedence and fallback labeling in edge cases`
- Scope:
  - Keep existing selected-bot refresh behavior.
  - Make edge fallback deterministic and explicit in code path.
- Likely files:
  - `apps/web/src/features/dashboard-home/components/RuntimeSidebarSection.tsx`
- Done when:
  - No apparent stale strategy behavior in null/mismatch edge case.

### DAWR-08
`docs(ops): add strategy-drift diagnostic/repair run step for dashboard regression triage`
- Scope:
  - Document operational use of:
    - `GET /dashboard/bots/strategy-drift`
    - `POST /dashboard/bots/strategy-drift/repair`
- Likely files:
  - `docs/operations/post-deploy-smoke-checklist.md`
  - `docs/modules/api-bots.md`
- Done when:
  - Operators have one explicit drift triage/remediation step.

### DAWR-09
`docs(sync): align execution-plan status with canonical queue/board for closed waves`
- Scope:
  - Synchronize stale status lines/checkboxes in execution plan vs queue/task board.
  - Keep one source-of-truth state.
- Likely files:
  - `docs/planning/mvp-execution-plan.md`
  - `.codex/context/TASK_BOARD.md` (only if needed for parity note)
- Done when:
  - No visible state drift between canonical planning files.

### DAWR-10
`qa(closure): run focused regression pack and sync canonical queue/context`
- Required commands:
  - `pnpm --filter api run test -- --run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
  - `pnpm --filter web run test -- --run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-wallet.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx`
  - `pnpm --filter api run typecheck`
  - `pnpm --filter web run typecheck`
  - `pnpm run quality:guardrails`
- Done when:
  - Regression pack is green and queue/context synchronized.

---

## Stage DoD

### Stage A DoD (`DAWR-A`)
- Aggregate API returns wallet-capital fields required by LIVE KPI.
- API regression locks contract.

### Stage B DoD (`DAWR-B`)
- LIVE wallet KPI renders correctly from aggregate-success path.
- Strategy sidebar null/mismatch behavior is deterministic and tested.

### Stage C DoD (`DAWR-C`)
- Ops drift diagnostic/repair step documented.
- Planning status drift synchronized.
- Closure validation pack green.

## Acceptance Criteria
1. Aggregate payload for selected bot includes wallet-capital fields consumed by LIVE KPI.
2. Dashboard LIVE wallet cards show correct values without hidden session-fallback masking when aggregate succeeds.
3. Strategy sidebar updates deterministically for selected bot, including null/mismatch strategy edge.
4. Strategy drift audit/repair path is operationally documented.
5. Canonical planning files are status-synchronized.

## Closure Evidence
- 2026-04-20: Closed `DAWR-04..DAWR-07` by tightening LIVE wallet aggregate-success fallback behavior in `RuntimeSidebarSection`, adding aggregate-success regression lock in `HomeLiveWidgets.aggregate-wallet.test.tsx`, and adding dedicated sidebar edge tests in `RuntimeSidebarSection.test.tsx` for `strategyId` null/mismatch + canonical precedence.
- 2026-04-20: Closed `DAWR-08..DAWR-10` by documenting strategy-drift triage in ops/module docs, synchronizing canonical queue/context/execution files, and running closure validation pack:
  - `pnpm --filter api run test -- --run src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
  - `pnpm --filter web run test -- --run src/features/dashboard-home/components/HomeLiveWidgets.test.tsx src/features/dashboard-home/components/HomeLiveWidgets.aggregate-wallet.test.tsx src/features/dashboard-home/components/RuntimeSidebarSection.test.tsx`
  - `pnpm --filter api run typecheck`
  - `pnpm --filter web run typecheck`
  - `pnpm run quality:guardrails`
