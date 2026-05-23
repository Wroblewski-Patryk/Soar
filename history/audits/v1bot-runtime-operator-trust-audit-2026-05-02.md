# V1BOT-AUDIT-02 - Runtime Operator Trust Audit

## Header
- ID: V1BOT-AUDIT-02
- Title: qa(runtime+web): audit runtime freshness, action context, and operator trust
- Task Type: research
- Current Stage: analysis
- Status: DONE
- Owner: Review
- Depends on: V1SURF-02, V1DOGE-03
- Priority: P0
- Iteration: 2026-05-02 operator trust audit
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are represented for this analysis-only task.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected: audit runtime operator trust gaps.
- [x] Operation mode matches the audit intent.
- [x] The task is aligned with repository source-of-truth documents.

## Context
After `V1SURF-02`, Bot Monitoring and Dashboard Home share the same web
open-position derivation contract. The next V1 confidence layer is not another
PnL formula split; it is whether the operator can trust that a live-looking
runtime surface is actually live, fresh, and scoped to the selected runtime
context.

Reviewed architecture and source-of-truth context:
- `docs/modules/system-modules.md`
- `docs/architecture/01_overview-and-principles.md`
- `docs/architecture/reference/runtime-signal-merge-contract.md`
- `docs/architecture/reference/assistant-runtime-contract.md`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/LEARNING_JOURNAL.md`
- `history/audits/v1bot-runtime-dashboard-audit-2026-05-02.md`
- `history/tasks/v1surf-02-shared-runtime-position-derivation-task-2026-05-02.md`

## Goal
Identify the next small, safe runtime/dashboard hardening slice that improves
operator trust without changing live execution semantics or introducing a
parallel runtime path.

## Scope
- Web runtime streams:
  - `apps/web/src/features/bots/hooks/useBotsMonitoringController.ts`
  - `apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.ts`
- Web runtime actions:
  - `apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx`
  - `apps/web/src/features/dashboard-home/components/home-live-widgets/runtimeDataTablePresenters.tsx`
  - `apps/web/src/features/dashboard-home/hooks/useCloseRuntimePositionAction.ts`
- API runtime price read model:
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionCommand.service.ts`
- API order action reference:
  - `apps/api/src/modules/orders/orders.service.ts`
  - `apps/api/src/modules/orders/orders.controller.ts`

## Findings

### P0 - Runtime Positions fetches fallback ticker prices but does not feed them into `markPrice`
`runtimeSessionPositionsRead.service.ts` builds `runtimeStatPriceBySymbol` from
runtime snapshots and in-memory ticker data, then creates `lastPriceBySymbol`
and fills missing symbols through `fetchFallbackTickerPrices`. The later
position `marketPrice` calculation, however, passes only
`runtimeStatPriceBySymbol.get(position.symbol)` into
`resolvePreferredRuntimeOrExchangeSyncedPrice`.

Risk: when runtime ticker/stat truth is missing but the fallback market-data
gateway returns a valid price, the positions read model can still expose
`markPrice=null` and leave derived open-position PnL dependent on stale
persisted values or frontend symbol-stat fallback. This is a trust bug because
the service already performed the fallback work but the open-position contract
does not receive the result.

Recommended slice: make fallback ticker prices first-class runtime price
candidates for positions, with observed-at/source metadata explicit enough to
test precedence. Add focused API coverage for missing runtime tick + available
fallback price on an open position.

### P0 - Stream price state is not reset on all runtime context changes
Dashboard Home clears selected trades when bot/session changes, but it does
not clear `liveTickerPrices` when the selected bot/session/status changes.
Bot Monitoring clears `monitorLiveTickerPrices` on bot/session/view-mode
changes, but not on status or applied symbol-filter changes.

Risk: a symbol-keyed stream price can temporarily bleed across selected bots,
sessions, or filter contexts when the same symbol appears in multiple runtime
contexts. `V1SURF-02` correctly made stream prices highest precedence, so stale
stream state now deserves stronger lifecycle boundaries.

Recommended slice: reset live ticker maps when selected runtime identity,
session status, symbol set, or monitoring filter changes. Lock this with web
hook tests for selected-bot switch, `RUNNING -> COMPLETED`, and monitoring
filter/status changes.

### P1 - Bot Monitoring stream eligibility is broader than Dashboard Home
Dashboard Home opens market SSE only for a selected session with
`status === RUNNING`. Bot Monitoring opens SSE whenever the monitoring tab has
a bot id and stream symbols. This includes aggregate and historical contexts
unless the selected data shape happens to remove symbols.

Risk: completed or historical monitoring views can look live-mutated by market
stream prices. Active aggregate live behavior may be useful, but the current
rule is implicit and not covered as a product contract.

Recommended slice: define one `isRuntimeStreamLiveContext` helper for web
runtime surfaces. For session mode, stream only when the selected session is
`RUNNING`; for aggregate mode, stream only when the selected aggregate/status
represents active runtime data. Render or preserve snapshot behavior for
completed historical views.

### P1 - Price source and freshness remain hidden from the web contract
The API internally tracks candidate observed times in positions and symbol
stats, but the public runtime responses still expose only numeric values such
as `markPrice`, `lastPrice`, and PnL fields.

Risk: when an operator reports "dashboard froze", the UI cannot distinguish
stream price, runtime ticker, exchange-sync derived price, fallback ticker, or
stale snapshot. Debugging remains inference-heavy.

Recommended slice: add optional `markPriceSource`, `markPriceObservedAt`,
`lastPriceSource`, and `lastPriceObservedAt` metadata to runtime read models,
then render compact source/freshness hints on Bot Monitoring and Dashboard
Home.

### P2 - Dashboard close/cancel actions are guarded, but the UI contract is still thin
Manual runtime position close uses a bot/session/position route with `riskAck`
and backend ownership/actionability checks. Open-order cancel requires
`riskAck` and rejects terminal order statuses. The web tables disable position
actions for `actionable === false` and disable order cancel while an order is
already canceling.

Risk: backend fail-closed behavior is present, but the dashboard UI does not
yet explain why an active-looking row is not actionable beyond one generic
label. This is lower risk than stale price state because backend guards remain
authoritative.

Recommended slice: after freshness/source work, improve operator affordances
for `RECOVERING`, `RECOVERED_UNACTIONABLE`, completed-session snapshot rows,
and order cancel failures without changing command semantics.

## What Looks Healthy
- `V1SURF-02` removed the highest-risk duplicated frontend PnL derivation.
- Dashboard Home already gates SSE to selected `RUNNING` sessions.
- Runtime position close is backend-owned, requires `riskAck`, validates
  ownership/actionability, and resolves idempotent already-closed results.
- Order cancel requires `riskAck` and rejects terminal statuses.
- No architecture mismatch was found; issues are consistency and visibility
  gaps inside approved runtime/dashboard modules.

## Acceptance Criteria
- [x] Runtime stream lifecycle was reviewed across Bot Monitoring and
  Dashboard Home.
- [x] Position close and order cancel action paths were reviewed.
- [x] API runtime price candidate flow was reviewed.
- [x] Findings were prioritized by operator trust and money-path risk.
- [x] The next implementation slice is small, reversible, and testable.

## Definition of Done
- [x] Analysis stayed read-only against product code.
- [x] No workaround or duplicate runtime path was introduced.
- [x] Findings point to existing files and approved architecture.
- [x] Follow-up slices avoid changing live trading command semantics.

## Validation Evidence
- Tests:
  - `pnpm run quality:guardrails` => PASS
- Manual checks: static source audit of runtime streams, actions, and price
  read-model candidate flow.
- High-risk checks: no live trading action was executed.

## Architecture Evidence
- Architecture source reviewed: listed in Context.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: not required unless freshness metadata
  becomes a canonical runtime API contract.

## Deployment / Ops Evidence
- Deploy impact: none for this audit.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: not in this audit.
- Rollback note: no runtime change.
- Observability or alerting impact: recommended follow-up would improve
  operator freshness observability.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: fallback price not used by position `markPrice`, stream state reset
  gaps, broader Bot Monitoring SSE eligibility, hidden price source/freshness,
  and thin action-state affordances.
- Gaps: no shared web helper for runtime stream eligibility and no public
  price-source metadata.
- Inconsistencies: Dashboard Home and Bot Monitoring differ in live-stream
  eligibility.
- Architecture constraints: API remains runtime truth owner; UI may derive
  presentation from approved read models and stream data only.

### 2. Select One Priority Task
- Selected task: audit runtime freshness and operator trust after `V1SURF-02`.
- Priority rationale: V1 confidence depends on knowing whether money-facing
  values are live, fresh, stale, or fallback.
- Why other candidates were deferred: implementation should be split into one
  price-candidate fix and one stream-lifecycle fix, each with focused tests.

### 3. Plan Implementation
- Files or surfaces to modify: none in this analysis stage.
- Logic: map price and stream candidates, then identify trust leaks.
- Edge cases: same symbol across bots, completed sessions, aggregate mode,
  missing runtime ticker with fallback price available, imported LIVE position.

### 4. Execute Implementation
- Implementation notes: no product code changed.

### 5. Verify and Test
- Validation performed: static source audit and repository guardrails.
- Result: findings documented above; guardrails PASS.

### 6. Self-Review
- Simpler option considered: only adding source labels in UI.
- Technical debt introduced: no
- Scalability assessment: source/freshness metadata and shared stream
  eligibility reduce future runtime/debug drift.
- Refinements made: separated backend fallback-price correctness from web
  stream-state lifecycle.

### 7. Update Documentation and Knowledge
- Docs updated: this audit file, queue/context files.
- Context updated: yes.
- Learning journal updated: not applicable; no new recurring tooling pitfall
  was confirmed.

## Result Report
- Task summary: completed second audit focused on runtime operator trust after
  the shared open-position derivation work.
- Files changed: this planning audit plus queue/context updates.
- How tested: read-only static audit; `pnpm run quality:guardrails` PASS after
  documentation sync.
- What is incomplete: implementation of fallback-price candidate propagation,
  stream-state reset/eligibility tests, and source/freshness metadata.
- Next tiny task: `V1PRICE-04 fix(api-runtime): propagate fallback ticker price into position markPrice candidates`.
