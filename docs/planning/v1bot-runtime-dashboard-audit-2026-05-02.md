# V1BOT-AUDIT-01 - Bot Runtime And Dashboard Consistency Audit

## Header
- ID: V1BOT-AUDIT-01
- Title: qa(runtime+web): audit bot function truth across Bot Runtime and Dashboard
- Task Type: research
- Current Stage: analysis
- Status: DONE
- Owner: Review
- Depends on: V1DOGE-03, V1BOT-SIGNALS-02
- Priority: P0
- Iteration: 2026-05-02 operator audit
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are represented for this analysis-only task.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected: audit runtime/dashboard consistency.
- [x] Operation mode matches the audit intent.
- [x] The task is aligned with repository source-of-truth documents.

## Context
After the `V1DOGE-03` hotfix, runtime protection decisions and dashboard-home
open-position PnL now share the same high-level price-truth intent. The
operator asked for a broader audit because V1 still feels blocked by small
inconsistencies between bot runtime behavior and dashboard display.

Reviewed architecture sources:
- `docs/modules/system-modules.md`
- `docs/architecture/01_overview-and-principles.md`
- `docs/architecture/reference/runtime-signal-merge-contract.md`
- `docs/architecture/reference/assistant-runtime-contract.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/LEARNING_JOURNAL.md`

## Goal
Identify remaining consistency risks between bot runtime API truth,
`Dashboard -> Bots -> Monitoring`, and `Dashboard Home -> Runtime`, then define
the smallest safe follow-up slices needed for V1 confidence.

## Scope
- API runtime routes and controllers:
  - `apps/api/src/modules/bots/bots.routes.ts`
  - `apps/api/src/modules/bots/bots.controller.ts`
- API runtime read models:
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts`
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/runtimePositionSerialization.service.ts`
- Web bot monitoring:
  - `apps/web/src/features/bots/hooks/useBotsMonitoringController.ts`
  - `apps/web/src/features/bots/components/BotsManagement.tsx`
  - `apps/web/src/features/bots/components/bots-management/BotsMonitoringTab.tsx`
  - `apps/web/src/features/bots/services/botsMonitoringAggregate.service.ts`
  - `apps/web/src/features/bots/utils/runtimeSurfaceTruth.ts`
- Web dashboard runtime:
  - `apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.ts`
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDerivations.ts`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/useRuntimeSelectionViewModel.ts`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.tsx`
- Relevant focused tests and recent validation evidence from `V1DOGE-03`.

## Current Read-Model Map
- API exposes one bot-runtime surface family:
  - `GET /dashboard/bots/:id/runtime-monitoring/aggregate`
  - `GET /dashboard/bots/:id/runtime-sessions`
  - `GET /dashboard/bots/:id/runtime-sessions/:sessionId`
  - `GET /dashboard/bots/:id/runtime-sessions/:sessionId/symbol-stats`
  - `GET /dashboard/bots/:id/runtime-sessions/:sessionId/positions`
  - `POST /dashboard/bots/:id/runtime-sessions/:sessionId/positions/:positionId/close`
  - `GET /dashboard/bots/:id/runtime-sessions/:sessionId/trades`
- `runtimeSessionPositionsRead.service.ts` now resolves open position
  `markPrice`, `unrealizedPnl`, `unrealizedPnlPercent`, DCA counts, dynamic
  `TTP`/`TSL`, and capital summary in one read model.
- `runtimeSessionSymbolStatsRead.service.ts` now uses the same
  runtime-versus-exchange-sync price preference helper for symbol prices and
  open-position metrics.
- `runtimeMonitoringAggregateRead.service.ts` composes the session read models
  instead of re-querying and reinterpreting every field from scratch.
- `Dashboard -> Bots -> Monitoring` consumes the aggregate endpoint by default,
  uses SSE ticker prices plus polling fallback, and recomputes visible open-row
  PnL from live stream prices.
- `Dashboard Home -> Runtime` consumes the aggregate endpoint for active bots,
  uses SSE ticker prices for the selected running bot, and after `V1DOGE-03`
  prefers `stream -> position.markPrice -> symbolStats.lastPrice` for open-row
  display.

## Findings

### P0 - Frontend live-position derivation is duplicated across Bot Runtime and Dashboard
`BotsManagement.tsx` and `runtimeDerivations.ts` both compute live mark price,
open PnL, margin percentage, dynamic `TTP`/`TSL` display, and aggregate open
margin values from API rows plus stream prices. The intent is now similar, but
the implementations are not the same helper and already diverge in fallback
order, naming, and summary usage.

Risk: future operator-facing fixes can land in one surface only. This is the
same class of drift that made the DOGE issue confusing: runtime truth,
Bot Runtime display, and Dashboard display can look close enough to pass a
quick check while one percent or protected floor is stale.

Recommended slice: create one shared web derivation utility for runtime open
position rows and consume it from both `BotsManagement.tsx` and Dashboard Home.
Lock stream-precedence, backend fallback, `LONG`/`SHORT`, `TTP`, `TSL`, DCA,
and margin-percent parity in one focused test file.

### P0 - Dashboard summary KPIs can still mix stream-live and snapshot PnL
`useRuntimeSelectionViewModel.ts` calculates `summary.unrealized` with stream
prices for the selected bot, but `paperDelta` and `paperEquity` still call
`resolveUnrealized(x)`, which rebuilds rows with an empty stream map. During a
live ticker update, Dashboard summary cards can therefore disagree with the
selected open-position table for the same bot.

Risk: operator sees a moving position row but adjacent portfolio or paper
equity totals lag on API snapshot values. This is not a close-path issue, but
it undermines V1 confidence because the dashboard appears internally
inconsistent.

Recommended slice: compute per-snapshot live open rows once in
`useRuntimeSelectionViewModel`, reuse the same unrealized value for
`summary.unrealized`, `paperDelta`, `paperEquity`, and selected-data `net`.

### P1 - Runtime price freshness is not visible in the public web contract
The API read model chooses between runtime ticker, exchange-sync PnL, mark
price, and fallback ticker truth, but the web type only receives `markPrice`,
`unrealizedPnl`, and `unrealizedPnlPercent`. It does not receive a source or
observed-at field for the chosen runtime display price.

Risk: when a position appears frozen, the UI cannot tell whether the value came
from live stream, API runtime tick, exchange sync, or fallback catalog price.
Operators and tests must infer freshness indirectly from polling/SSE behavior.

Recommended slice: add optional `markPriceSource` and `markPriceObservedAt`
metadata to runtime position and symbol-stat responses, then render a compact
source/freshness hint on both runtime surfaces.

### P1 - Bot Monitoring stream eligibility is broader than Dashboard Home
Dashboard Home only opens ticker SSE for a selected `RUNNING` session. Bot
Monitoring opens SSE whenever the monitoring tab has a bot id and symbols,
including aggregate or historical views unless filtered by current state.

Risk: historical/aggregate views can be visually live-mutated by ticker stream
even when the underlying session selection is not a running runtime. That can
be useful for active aggregate monitoring, but it should be explicit and tested
so historical rows do not look like mutable current state by accident.

Recommended slice: align stream eligibility rules around current active
runtime context, or render historical/aggregate live-price behavior explicitly.
Add tests for `RUNNING`, `COMPLETED`, and aggregate `ALL` modes.

### P1 - Protected live readback remains an operational evidence gap
Local validation after `V1DOGE-03` proves `TTP`, `TP`, `SL`, and `TSL` through
the runtime automation service. Public production checks confirmed deploy
freshness and public health, but authenticated protected runtime/DOGE readback
could not be completed from this environment.

Risk: V1 release confidence still lacks a final real-account operator sample
for the exact runtime/dashboard surfaces that triggered the report.

Recommended slice: run an authenticated read-only production matrix for one
active `LIVE` bot and one `PAPER` bot:
- bot list and active selection
- runtime aggregate
- positions open rows
- symbol stats
- close-protection visible fields
- dashboard-home selected runtime view
- market-stream ticker movement for selected symbols

## What Looks Healthy
- No evidence found that the API has two independent runtime-position truth
  paths for current Bot Runtime and Dashboard aggregate reads.
- Runtime protection and API read models now share exchange-sync price
  preference semantics after `V1DOGE-03`.
- DCA continuity, capital source, close attribution, takeover/actionability,
  and dynamic stop columns have targeted backend coverage in the current bot
  runtime test family.
- Bot Monitoring and Dashboard Home both have polling and SSE paths; the
  remaining problem is consistency of derivation and evidence, not lack of a
  refresh mechanism.

## Acceptance Criteria
- [x] API routes and read models were mapped.
- [x] Bot Runtime web derivation path was mapped.
- [x] Dashboard Home runtime derivation path was mapped.
- [x] Remaining V1 consistency risks were prioritized.
- [x] Follow-up implementation slices are small and testable.

## Definition of Done
- [x] Analysis stayed read-only against implementation code.
- [x] No workaround or duplicate runtime path was introduced.
- [x] Findings point to existing files and approved architecture.
- [x] Next fixes are scoped as tiny reversible slices.

## Validation Evidence
- Tests: not run for this analysis-only audit.
- Manual checks: static read-model and web derivation review.
- High-risk checks: no live trading action was executed.

## Architecture Evidence
- Architecture source reviewed: listed in Context.
- Fits approved architecture: yes
- Mismatch discovered: no architecture mismatch; implementation consistency
  gaps remain inside approved modules.
- Decision required from user: no
- Follow-up architecture doc updates: not required unless price freshness
  metadata becomes a canonical API contract.

## Deployment / Ops Evidence
- Deploy impact: none for this audit.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: not in this audit.
- Rollback note: no runtime change.
- Observability or alerting impact: follow-up freshness metadata would improve
  operator observability.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: duplicated frontend derivation, summary/table PnL drift risk,
  insufficient freshness metadata, broader Bot Monitoring SSE eligibility, and
  missing authenticated production readback.
- Gaps: no single shared web helper for open runtime position presentation.
- Inconsistencies: Dashboard summary can mix live-stream and API snapshot PnL.
- Architecture constraints: keep bot runtime truth API-owned and reuse existing
  read models.

### 2. Select One Priority Task
- Selected task: audit bot function truth across API, Bot Runtime, and
  Dashboard surfaces.
- Priority rationale: operator confidence for V1 depends on consistent money
  and protection display.
- Why other candidates were deferred: fixes should be implemented as separate
  small slices after this audit.

### 3. Plan Implementation
- Files or surfaces to modify: none in this analysis stage.
- Logic: map source-of-truth and identify drift.
- Edge cases: LIVE imported positions, stream refresh, historical sessions,
  aggregate mode, dynamic protection display.

### 4. Execute Implementation
- Implementation notes: no product code changed.

### 5. Verify and Test
- Validation performed: static source audit.
- Result: findings documented above.

### 6. Self-Review
- Simpler option considered: patching only dashboard summary PnL immediately.
- Technical debt introduced: no
- Scalability assessment: shared derivation utility is the next sustainable
  route.
- Refinements made: separated code-consistency fixes from production evidence
  tasks.

### 7. Update Documentation and Knowledge
- Docs updated: this audit file.
- Context updated: task board and planning queue.
- Learning journal updated: not applicable; no new recurring pitfall confirmed
  beyond existing `V1DOGE-03` learning.

## Result Report
- Task summary: completed consistency audit for bot runtime API, Bot Runtime
  monitoring, and Dashboard Home runtime display.
- Files changed: this planning audit plus queue/context updates.
- How tested: read-only static audit; no product test run was required.
- What is incomplete: implementation of the P0 web derivation consolidation and
  authenticated production readback.
- Next tiny task: `V1SURF-02 fix(web-runtime): share live open-position
  derivation across Bot Runtime and Dashboard`.
