# V1DOGE-03 - LIVE Protection And Dashboard Price Truth

## Header
- ID: V1DOGE-03
- Title: fix(api-runtime+web): align imported LIVE protection and dashboard price truth
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: V1SAFE-A, V1ROE-A, V1MARK-A
- Priority: P0
- Iteration: 2026-05-02 operator hotfix
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration intent.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator reported that a `LIVE DOGEUSDT SHORT` remained open even though
dashboard PnL had fallen below the visible `TTP` protected level. Existing
architecture already requires one shared lifecycle PnL semantics contract and
honest `LIVE` futures mark/exchange truth for runtime protection decisions.

## Goal
Make imported `LIVE EXCHANGE_SYNC` runtime protection decisions use fresh
exchange-sync truth when reconciliation is newer than the runtime tick, while
operator dashboard presentation keeps live market-stream prices ahead of API
snapshots so visible PnL keeps refreshing.

## Scope
- `apps/api/src/modules/engine/runtimeExchangeSyncedPositionPrice.ts`
- `apps/api/src/modules/bots/runtimeExchangeSyncedPositionPrice.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.types.ts`
- `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.ts`
- `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/LEARNING_JOURNAL.md`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Move the existing runtime-versus-exchange-sync price chooser into engine
   ownership and keep the bots read model importing the same contract.
2. Include `status`, `unrealizedPnl`, and `lastExchangeSyncAt` in runtime
   automation position input.
3. Evaluate imported `LIVE EXCHANGE_SYNC` management using exchange-derived
   price when `lastExchangeSyncAt` is newer than the runtime price candidate.
4. Add focused regressions where the runtime tick has not crossed the close
   trigger but fresher exchange-sync PnL has crossed `TTP`, `TP`, `SL`, or
   `TSL`.
5. Keep dashboard-home live rows preferring stream market data over API
   snapshots for display-time `markPrice` and PnL derivation.
6. Run focused runtime/read-model tests, web derivation tests, typechecks, web
   build, and guardrails.

## Acceptance Criteria
- [x] Runtime automation and dashboard read models reuse one exchange-sync
  price preference contract.
- [x] Imported `LIVE` protections close when fresher exchange-sync PnL crosses
  the relevant `TTP`, `TP`, `SL`, or `TSL` trigger.
- [x] Existing dynamic-stop serialization behavior remains unchanged.
- [x] Dashboard-home open-position PnL refresh prefers stream price when
  market data is available.
- [x] Focused runtime/web tests, typechecks, web build, and guardrails pass.

## Definition of Done
- [x] No workaround or display-only close path introduced.
- [x] No duplicate price-selection logic remains in bots/runtime read models.
- [x] Runtime protection behavior is locked by regression coverage.
- [x] Live dashboard refresh behavior is locked by regression coverage.
- [x] Validation evidence is recorded.
- [x] Context and planning files are synchronized.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.service.test.ts -t "exchange-sync PnL truth"` => PASS (`4/4`)
  - `pnpm --filter api exec vitest run src/modules/bots/runtimePositionSerialization.service.test.ts` => PASS (`7/7`)
  - `pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/engine/runtimeLifecycleMarkPrice.service.test.ts src/modules/bots/runtimePositionSerialization.service.test.ts` => PASS (`40/40`)
  - `pnpm --filter api run typecheck` => PASS
  - `pnpm --filter web run test -- src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.test.ts --run` => PASS (`3/3`)
  - `pnpm --filter web run typecheck` => PASS
  - `pnpm --filter web run build` => PASS
  - `pnpm run quality:guardrails` => PASS
- Manual checks: not run against production in this local hotfix slice.
- High-risk checks: regressions prove no hidden UI-only protection behavior; close goes
  through `RuntimePositionAutomationService.closeByExitSignal`.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/architecture-source-of-truth.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
  - existing `V1SAFE`, `V1ROE`, and `V1MARK` planning/closure records
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: not required; this aligns existing price
  truth ownership rather than changing behavior semantics.

## Deployment / Ops Evidence
- Deploy impact: medium
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this tiny runtime slice if production close behavior
  unexpectedly diverges; the rollback restores prior stream-only automation
  price selection.
- Observability or alerting impact: existing runtime protection telemetry is
  preserved.
- Staged rollout or feature flag: none

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issue: dashboard could show exchange-sync PnL below TTP while runtime
  automation still evaluated a stale runtime price candidate; after the runtime
  fix, dashboard-home rows could still look frozen because display derivation
  preferred API `position.markPrice` before stream prices.
- Gap: the bots read model had a reusable price preference contract, but engine
  automation did not share it.
- Inconsistency: imported `LIVE EXCHANGE_SYNC` display and runtime close
  decisions had different freshness needs: runtime protection needs the
  freshest authoritative exchange/runtime candidate, while UI display must
  keep market-stream prices first when present.
- Architecture constraints: keep one lifecycle engine and do not add UI-only or
  alternate close paths.

### 2. Select One Priority Task
- Selected task: close the DOGE protection and live-dashboard refresh freshness
  gap for imported `LIVE` positions.
- Priority rationale: live-money protective close behavior is P0.
- Why other candidates were deferred: production deploy/manual evidence remains
  separate from the code hotfix.

### 3. Plan Implementation
- Files or surfaces to modify: engine price helper, runtime automation select
  fields/types, dashboard-home derivation helper/tests, planning/context docs.
- Logic: prefer exchange-derived price from `unrealizedPnl` when
  `lastExchangeSyncAt` is newer than the runtime price candidate for runtime
  protection; prefer live stream price over API snapshot for dashboard-home
  display when stream data exists.
- Edge cases: preserve non-`EXCHANGE_SYNC` behavior; preserve runtime candidate
  preference when it is newer than exchange sync.

### 4. Execute Implementation
- Implementation notes: moved the read-model helper into engine ownership,
  kept the bots module re-exporting it, and restored dashboard-home display
  precedence to `stream -> API mark -> symbol-stat` for live PnL animation.

### 5. Verify and Test
- Validation performed: focused runtime and dashboard-home regressions, related
  runtime/read-model tests, API/web typechecks, web build, guardrails.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: patching only the DOGE runtime test path or using
  raw `position.unrealizedPnl` directly in automation.
- Technical debt introduced: no
- Scalability assessment: the shared helper is reusable for future runtime
  read/automation consumers.
- Refinements made: avoided importing engine automation from bots ownership by
  moving the shared contract into engine and leaving a compatibility re-export.

### 7. Update Documentation and Knowledge
- Docs updated: this task file, queue/context files.
- Context updated: yes.
- Learning journal updated: yes.

## Result Report
- Task summary: imported `LIVE` runtime automation now uses fresher
  exchange-sync PnL truth for `TTP`, `TP`, `SL`, and `TSL` close decisions, and
  dashboard-home open-position rows prefer live stream prices for refreshing
  visible PnL.
- Files changed: listed in Scope.
- How tested: focused runtime/read-model tests plus API typecheck.
- What is incomplete: production deploy/readback and protected DOGE manual
  verification remain separate operational evidence.
- Next steps: deploy the fix and verify active DOGE protection closes or no
  longer reproduces once fresh exchange-sync PnL crosses the configured
  protection trigger.
