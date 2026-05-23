# V1SURF-02 - Shared Runtime Open-Position Derivation

## Header
- ID: V1SURF-02
- Title: fix(web-runtime): share live open-position derivation across Bot Runtime and Dashboard
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Frontend Builder
- Depends on: V1BOT-AUDIT-01, V1DOGE-03
- Priority: P0
- Iteration: 2026-05-02 operator consistency hardening
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration intent.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`V1BOT-AUDIT-01` found that the next V1 consistency risk was frontend drift:
`Dashboard -> Bots -> Monitoring` and `Dashboard Home -> Runtime` both derived
live open-position rows from API snapshots plus SSE prices, but did so through
separate implementations. Dashboard summary KPIs could also use snapshot PnL
while the selected open-position table used stream-live PnL.

## Goal
Use one web derivation contract for runtime open-position display across Bot
Monitoring and Dashboard Home, and make Dashboard summary KPIs reuse the same
selected-bot live unrealized PnL as the table.

## Scope
- `apps/web/src/features/bots/utils/runtimeOpenPositionDerivations.ts`
- `apps/web/src/features/bots/utils/runtimeOpenPositionDerivations.test.ts`
- `apps/web/src/features/bots/components/BotsManagement.tsx`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/types.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.test.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/LEARNING_JOURNAL.md`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Add a shared runtime open-position derivation utility in bot web ownership.
2. Preserve stream-first price precedence: `stream -> position.markPrice -> symbolStats.lastPrice`.
3. Return both Dashboard Home fields (`live*`, `marginNotional`) and Bot
   Monitoring fields (`openPnl`, `pnlMarginPct`, `ttpProtectedPercent`,
   `tslProtectedPercent`) from the same row contract.
4. Rewire `BotsManagement.tsx` and dashboard-home `runtimeDerivations.ts` to
   consume the shared helper.
5. Reuse the selected-bot live unrealized value for dashboard summary
   `unrealized`, `paperDelta`, `paperEquity`, and selected `net`.
6. Add focused tests for helper parity and dashboard summary/table consistency.
7. Run focused web tests, web typecheck, web build, and guardrails.

## Acceptance Criteria
- [x] Bot Monitoring and Dashboard Home consume one shared runtime
  open-position derivation contract.
- [x] Live stream prices keep precedence over API snapshots on both surfaces.
- [x] Backend `unrealizedPnl`/`unrealizedPnlPercent` remains the fallback when
  no stream price is available.
- [x] `LONG`/`SHORT` PnL, margin percent, DCA count, `TTP`, and `TSL` display
  are locked by focused tests.
- [x] Dashboard summary KPIs use the same selected-bot live unrealized PnL as
  the open-position table.
- [x] Web typecheck/build and repository guardrails pass.

## Definition of Done
- [x] No backend or runtime close-path behavior was changed.
- [x] No duplicate frontend open-position derivation remains in the touched
  surfaces.
- [x] Focused regression tests cover the shared contract and summary parity.
- [x] Validation evidence is recorded.
- [x] Context and planning files are synchronized.

## Validation Evidence
- Tests:
  - `pnpm --filter web run test -- src/features/bots/utils/runtimeOpenPositionDerivations.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.test.ts src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx --run` => PASS (`9/9`)
  - `pnpm --filter web run typecheck` => PASS
  - `pnpm --filter web run build` => PASS
  - `pnpm run quality:guardrails` => PASS
- Manual checks: static review of Bot Monitoring and Dashboard Home wiring.
- High-risk checks: no live trading action executed; UI-only derivation slice.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/modules/system-modules.md`
  - `docs/architecture/01_overview-and-principles.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
  - `history/audits/v1bot-runtime-dashboard-audit-2026-05-02.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: not required; this consolidates existing
  presentation derivation without changing runtime truth ownership.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this UI slice if open-position presentation regresses;
  backend runtime decisions are unaffected.
- Observability or alerting impact: none
- Staged rollout or feature flag: none

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: duplicated frontend derivation and summary/table PnL drift.
- Gaps: no shared web helper for runtime open-position display.
- Inconsistencies: selected table could use stream price while paper summary
  values used snapshot fallback.
- Architecture constraints: keep API runtime read model as source of truth and
  do not add alternate close behavior.

### 2. Select One Priority Task
- Selected task: `V1SURF-02`.
- Priority rationale: P0 operator confidence issue for money/runtime display.
- Why other candidates were deferred: price-source metadata and production
  readback are separate follow-up slices.

### 3. Plan Implementation
- Files or surfaces to modify: listed in Scope.
- Logic: create one row derivation helper and consume it from both surfaces.
- Edge cases: stream price, API mark fallback, symbol-stat fallback,
  backend-only PnL fallback, `SHORT`, margin-used override, `TTP` over `TSL`.

### 4. Execute Implementation
- Implementation notes: added `runtimeOpenPositionDerivations.ts`, rewired
  `BotsManagement.tsx`, kept dashboard `runtimeDerivations.ts` as a
  compatibility layer, and made `useRuntimeSelectionViewModel` reuse the same
  selected live unrealized PnL in summary and selected-data calculations.

### 5. Verify and Test
- Validation performed: focused tests, web typecheck, web build, guardrails.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: patching only `paperDelta`/`paperEquity`.
- Technical debt introduced: no
- Scalability assessment: the shared helper gives later price-source metadata a
  single web presentation entrypoint.
- Refinements made: removed an unnecessary hook dependency after build linting
  flagged it.

### 7. Update Documentation and Knowledge
- Docs updated: this task file, queue/context files.
- Context updated: yes.
- Learning journal updated: yes, for the verified local `.next/types` race when
  running `web typecheck` in parallel with `web build`.

## Result Report
- Task summary: Bot Monitoring and Dashboard Home now share one runtime
  open-position derivation contract; Dashboard summary KPIs use the same
  selected-bot live unrealized value as the open-position table.
- Files changed: listed in Scope.
- How tested: focused web tests, typecheck, build, guardrails.
- What is incomplete: authenticated production readback remains a separate
  operational evidence task.
- Next steps: deploy when ready and run protected read-only production
  runtime/dashboard matrix for one `LIVE` bot and one `PAPER` bot.
