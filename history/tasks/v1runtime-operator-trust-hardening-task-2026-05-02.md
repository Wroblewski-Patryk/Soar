# V1RUNTIME-TRUST-03 - Runtime Operator Trust Hardening

## Header
- ID: V1RUNTIME-TRUST-03
- Title: fix(api-runtime+web-runtime): harden fallback mark price and live ticker context resets
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder + Frontend Builder
- Depends on: V1BOT-AUDIT-02, V1SURF-02, V1DOGE-03
- Priority: P0
- Iteration: 2026-05-02 operator trust hardening
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected: runtime operator trust hardening.
- [x] Operation mode matches the implementation intent.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`V1BOT-AUDIT-02` found two small V1 trust leaks after the shared open-position
derivation work:
- Runtime Positions fetched fallback ticker prices for missing symbols, but
  did not pass those prices into the open-position `markPrice` resolver.
- Web runtime surfaces now correctly prioritize stream prices, but the
  symbol-keyed live ticker maps needed stricter context reset boundaries.

## Goal
Make runtime open-position price display more reliable when runtime ticker
truth is missing, and prevent stale stream prices from carrying across
selected runtime contexts.

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/bots.runtime-pnl-parity.e2e.test.ts`
- `apps/web/src/features/bots/hooks/useBotsMonitoringController.ts`
- `apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.ts`
- `apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.test.tsx`
- Existing `V1SURF-02` files already touched in the working tree:
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
1. Feed fallback ticker prices into runtime position price candidates without
   changing live close command semantics.
2. Preserve exchange-sync freshness precedence in
   `resolvePreferredRuntimeOrExchangeSyncedPrice`.
3. Reset Dashboard Home live ticker prices when selected bot, session,
   session status, or symbol set changes.
4. Reset Bot Monitoring live ticker prices when bot, session, view mode,
   session status, status filter, applied symbol filter, or symbol set changes.
5. Gate Bot Monitoring market SSE to `RUNNING` runtime contexts, matching the
   Dashboard Home live/snapshot distinction.
6. Add focused API and web regression coverage.
7. Run focused tests, typechecks, builds, and repository guardrails.

## Acceptance Criteria
- [x] Runtime Positions uses fallback ticker price as a mark-price candidate
  when runtime/stat price truth is missing.
- [x] The fallback path does not bypass exchange-sync freshness precedence.
- [x] Dashboard Home clears stale stream prices when selected runtime context
  changes, even for the same symbol.
- [x] Bot Monitoring clears stream prices on status/filter/context changes and
  does not open SSE for non-`RUNNING` runtime contexts.
- [x] Focused API and web regressions cover the new behavior.
- [x] Typecheck, build, and guardrails pass.

## Definition of Done
- [x] No live close or cancel command semantics changed.
- [x] No duplicate runtime price resolver introduced.
- [x] No workaround or temporary bypass introduced.
- [x] Validation evidence is recorded.
- [x] Context and planning files are synchronized.

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- src/modules/bots/bots.runtime-pnl-parity.e2e.test.ts --run` => PASS (`2/2`)
  - `pnpm --filter web run test -- src/features/dashboard-home/hooks/useHomeLiveWidgetsController.test.tsx src/features/bots/utils/runtimeOpenPositionDerivations.test.ts src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.test.ts src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.test.tsx --run` => PASS (`7/7`)
  - `pnpm --filter api run typecheck` => PASS
  - `pnpm --filter web run typecheck` => PASS
  - `pnpm --filter web run build` => PASS
  - `pnpm --filter api run build` => PASS
  - `pnpm run quality:guardrails` => PASS
- Manual checks: static review of runtime position read-model price candidates
  and web stream lifecycle boundaries.
- High-risk checks: no live trading action was executed.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/modules/system-modules.md`
  - `docs/architecture/01_overview-and-principles.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
  - `history/audits/v1bot-runtime-operator-trust-audit-2026-05-02.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: not required; this reuses existing API
  read-model and web runtime surfaces.

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit if runtime open-position mark price or web
  stream refresh regresses; live execution command semantics are unaffected.
- Observability or alerting impact: improves operator read-model freshness
  behavior but does not add new telemetry.
- Staged rollout or feature flag: none

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: fallback price was fetched but not used for position `markPrice`;
  stream prices could outlive selected runtime context changes.
- Gaps: no regression for fallback mark price or selected-bot stream reset.
- Inconsistencies: Bot Monitoring streamed broader contexts than Dashboard
  Home.
- Architecture constraints: keep runtime truth API-owned and preserve command
  service fail-closed behavior.

### 2. Select One Priority Task
- Selected task: implement `V1PRICE-04` and `V1SURF-03` as one deployable
  operator-trust hardening slice.
- Priority rationale: both fixes protect the same visible money-facing runtime
  values and are small enough to validate together.
- Why other candidates were deferred: public price-source/freshness metadata
  remains a separate UI/API contract expansion.

### 3. Plan Implementation
- Files or surfaces to modify: listed in Scope.
- Logic: add fallback candidate, reset stream maps on context boundaries, and
  gate Bot Monitoring SSE to `RUNNING`.
- Edge cases: missing runtime ticker, same symbol across bots, completed
  sessions, aggregate running versus historical contexts.

### 4. Execute Implementation
- Implementation notes: added `fallbackRuntimePriceBySymbol` candidate map,
  passed fallback candidates into the existing preferred price resolver, reset
  Dashboard Home and Bot Monitoring stream maps on context changes, and added a
  hook regression for same-symbol selected-bot switching.

### 5. Verify and Test
- Validation performed: focused API/web tests, API/web typecheck, API/web
  build, and repository guardrails.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only clearing stream maps without fixing backend
  fallback candidate propagation.
- Technical debt introduced: no
- Scalability assessment: future price-source metadata can build on the same
  candidate path and stream lifecycle boundaries.
- Refinements made: stabilized hook test mocks to avoid update-depth warnings.

### 7. Update Documentation and Knowledge
- Docs updated: this task file and queue/context files.
- Context updated: yes.
- Learning journal updated: not applicable; no new recurring pitfall was
  confirmed.

## Result Report
- Task summary: runtime position `markPrice` now receives fallback ticker
  prices as candidates, and web runtime stream prices are reset on selected
  runtime context changes.
- Files changed: listed in Scope.
- How tested: focused API/web tests, API/web typecheck, API/web build,
  repository guardrails.
- What is incomplete: public price-source/freshness metadata remains a future
  operator observability slice.
- Next steps: deploy to VPS and run read-only runtime/dashboard smoke on one
  active PAPER/LIVE bot after build-info advances.
