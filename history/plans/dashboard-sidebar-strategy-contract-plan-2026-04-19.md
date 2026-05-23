# Dashboard Sidebar Strategy Contract Plan (2026-04-19)

Status: completed (`SBSC-A..SBSC-C` closed on 2026-04-19)  
Execution mode: tiny-commit only (exactly one task per commit)  
Primary audience: implementation agent

## Scope
- Dashboard sidebar section only:
  - `Status / Mode / Win rate`
  - `Selected bot`
  - `Market` card
  - `Strategy` card
- No unrelated dashboard modules.
- No changes to bot preview UX in this wave.

## Problem Statement
- After switching selected bot, `Market` card updates correctly.
- `Strategy` card appears unchanged.
- Production/API analysis indicates mismatch between read models:
  - `GET /dashboard/bots` exposes `strategyId` from one projection.
  - `GET /dashboard/bots/:id/runtime-graph` exposes primary strategy from runtime topology.
- Sidebar strategy card resolves from runtime topology (`runtime-graph`), so UI can look “stuck” when projections disagree.

## Root Cause (from code and API analysis)
1. Sidebar refresh is not blocked; selected-bot re-render works.
2. `listBots` and `runtime-graph` can return different strategy context for the same bot.
3. Current list mapping may prefer legacy `botStrategies` before canonical `marketGroupStrategyLinks`, creating strategy drift in dashboard contexts.

## Product/Contract Decision (for implementation)
1. Source of truth for sidebar `Market + Strategy` is **runtime topology**:
  - canonical active+enabled `marketGroupStrategyLinks` from runtime graph.
2. `listBots.strategyId` must be projection-compatible with runtime topology primary strategy.
3. Legacy `botStrategies` remains compatibility fallback only, and must not override canonical runtime strategy in dashboard contexts.

## Execution Groups
1. `SBSC-A (commits SBSC-01..SBSC-03): decision freeze + API projection mismatch regression + canonical-first mapper fix`
2. `SBSC-B (commits SBSC-04..SBSC-06): drift detection/repair path + sidebar switch regression locks`
3. `SBSC-C (commits SBSC-07..SBSC-08): closure validation + canonical sync`

---

## Tiny-Commit Queue

### SBSC-01
`docs(contract): freeze sidebar strategy source-of-truth and projection parity rules`
- Scope:
  - Lock source-of-truth and fallback order for `Market + Strategy` in dashboard sidebar.
  - State that `listBots.strategyId` must align with runtime topology primary strategy.
- Likely files:
  - `docs/planning/open-decisions.md`
  - `docs/modules/web-dashboard-home.md`
  - `docs/modules/api-bots.md`
- Done when:
  - One unambiguous contract is documented for sidebar strategy data origin.

### SBSC-02
`test(api-red): add regression for listBots.strategyId vs runtime-graph primary strategy mismatch`
- Scope:
  - Reproduce mismatch for bot set with divergent legacy/canonical strategy links.
  - Assert expected parity under decided contract.
- Likely files:
  - `apps/api/src/modules/bots/bots.runtime-scope.e2e.test.ts`
  - `apps/api/src/modules/bots/bots.e2e.test.ts`
- Done when:
  - Regression fails on current mismatch behavior.

### SBSC-03
`fix(api-projection): make listBots/getBot strategy projection canonical-first and runtime-graph compatible`
- Scope:
  - Update bot response mapper/projection precedence:
    - canonical enabled runtime links first,
    - legacy links only fallback.
  - Keep ownership and existing API contract shape.
- Likely files:
  - `apps/api/src/modules/bots/botResponseMapper.service.ts`
  - `apps/api/src/modules/bots/bots.repository.ts`
  - `apps/api/src/modules/bots/botsCommand.service.ts` (if projection includes need expansion)
- Done when:
  - `listBots.strategyId` aligns with runtime graph primary strategy for same bot.

### SBSC-04
`feat(api-audit): add deterministic drift audit for bots with legacy/canonical strategy divergence`
- Scope:
  - Add maintenance diagnostics to identify bots where:
    - list projection strategy and runtime topology strategy differ.
  - Output intended for operator/debug workflow.
- Likely files:
  - `apps/api/src/modules/bots/botsRuntimeRead.repository.ts`
  - `docs/operations/` artifact note (if script/report generated)
- Done when:
  - Drift is queryable/reproducible without manual production probing.

### SBSC-05
`fix(api-drift-repair): add safe reconciliation path to align legacy linkage with canonical strategy when requested`
- Scope:
  - Add controlled repair path (service-level or script) that syncs stale legacy links to canonical strategy selection.
  - Must be idempotent and ownership-scoped.
- Likely files:
  - `apps/api/src/modules/bots/botLegacyStrategyLink.service.ts`
  - `apps/api/src/modules/bots/botsCommand.service.ts`
- Done when:
  - Existing drifted bots can be reconciled safely and deterministically.

### SBSC-06
`test(web-regression): lock sidebar strategy/market switch parity for two bots with different strategies`
- Scope:
  - Add web regression ensuring selected-bot switch updates both `Market` and `Strategy` cards per contract.
  - Include scenario where two bots differ only by strategy context.
- Likely files:
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/RuntimeSidebarSection.test.tsx` (if present/new)
- Done when:
  - Sidebar regression fails on mismatch and passes after fix.

### SBSC-07
`qa(focused-pack): run api+web sidebar parity regressions and typechecks`
- Suggested commands:
  - `pnpm --filter api run test -- src/modules/bots/bots.runtime-scope.e2e.test.ts src/modules/bots/bots.e2e.test.ts --run`
  - `pnpm --filter web run test -- src/features/dashboard-home/components/HomeLiveWidgets.test.tsx --run`
  - `pnpm --filter api run typecheck`
  - `pnpm --filter web run typecheck`
- Done when:
  - Focused packs are green for sidebar parity scope.

### SBSC-08
`docs(closure): publish sidebar strategy contract closure and sync queue/context`
- Scope:
  - Sync status in queue/context.
  - Link evidence artifacts and closed acceptance criteria.
- Likely files:
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- Done when:
  - Closure is evidence-backed and next queue is explicit.

---

## Stage DoD

### Stage A DoD (`SBSC-A`)
- Contract is frozen.
- API regression reproduces mismatch.
- Canonical-first projection fix is in place.

### Stage B DoD (`SBSC-B`)
- Drift can be identified deterministically.
- Safe reconciliation path exists for drifted bots.
- Sidebar switch regression guarantees Market + Strategy consistency.

### Stage C DoD (`SBSC-C`)
- Focused packs pass.
- Canonical queue/context fully synchronized.

## Risks and Rollback

### Stage A Risk / Rollback
- Risk:
  - Projection precedence change may affect downstream assumptions that read legacy strategy first.
- Rollback:
  - Revert `SBSC-03` only while keeping red tests and contract docs.

### Stage B Risk / Rollback
- Risk:
  - Drift-repair path could over-correct if executed without strict ownership scoping.
- Rollback:
  - Keep audit (`SBSC-04`) and disable repair path by reverting `SBSC-05`.

### Stage C Risk / Rollback
- Risk:
  - Web tests may still pass with mocked data that does not represent API drift.
- Rollback:
  - Strengthen fixture realism in `SBSC-06` before closure, do not force-close phase.

## Acceptance Criteria
1. After `Selected bot` switch, `Strategy` card shows data consistent with locked source-of-truth.
2. `Market` and `Strategy` cards cannot come from conflicting projections.
3. Regression detects scenario where two bots have different strategies but sidebar would show same strategy.
