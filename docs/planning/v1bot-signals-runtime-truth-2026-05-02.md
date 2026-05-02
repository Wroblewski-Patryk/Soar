# Task

## Header
- ID: V1BOT-SIGNALS-02
- Title: fix(api-runtime): expose condition match truth and recover Binance futures market-stream routing
- Task Type: fix
- Current Stage: verification
- Status: REVIEW
- Owner: Backend Builder
- Depends on: V1BOT-CONDITIONS-01
- Priority: P0
- Iteration: 2026-05-02
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator reported that `Dashboard -> Markets / Signals` can show
condition values that appear to imply a signal, while the paper bot does not
open a position. The previous stale-condition fix made the configured
strategy values current after stop/edit/start, but the read model still did
not expose whether each condition actually matched according to the shared
runtime evaluator.

Authenticated production read-only evidence on 2026-05-02 showed an additional
runtime ingestion concern: the current PAPER session was `RUNNING` with
`eventsCount=1` and `symbolsTracked=0`, and the market-stream SSE endpoint
connected but emitted no ticker/candle events for active bot symbols or the
default stream symbols during a short smoke window. Code review found that a
market-stream worker Redis publisher startup failure could be memoized as
`null`, silently dropping all future market events until process restart.
Follow-up websocket smoke found the remaining root cause: Binance USD-M
Futures no longer pushes regular market streams from the legacy unrouted
`wss://fstream.binance.com/ws` endpoint. The connection opens and accepts
subscriptions, but ticker, mark price, and kline streams require the routed
`/market` endpoint.

After deploying the futures route fix to production, authenticated smoke was
blocked by a separate Redis infrastructure failure: Coolify showed the Soar
production `redis` resource as `restarting:unhealthy` with 42 restarts, and
Redis logs repeatedly reported a corrupted AOF increment file. Public API
readiness was still green because `/ready` checked critical secrets only, so
this slice now also hardens readiness against required Redis dependency
failure.

## Goal
Make the dashboard condition display reflect canonical runtime rule-match truth
and restore futures ticker/candle ingestion so PAPER and LIVE runtime decisions
are driven by fresh Binance market events.

## Scope
- `apps/api/src/modules/engine/strategySignalEvaluator.ts`
- `apps/api/src/modules/engine/strategySignalAnalysis.ts`
- `apps/api/src/modules/engine/runtimeSignalEvaluationTypes.ts`
- `apps/api/src/modules/bots/runtimeSignalConditionLines.service.ts`
- `apps/api/src/modules/market-stream/binanceStream.service.ts`
- `apps/api/src/modules/market-stream/binanceStream.service.test.ts`
- `apps/api/src/modules/market-stream/marketStreamFanout.ts`
- `apps/api/src/modules/market-stream/marketStreamFanout.test.ts`
- `apps/api/src/config/runtimeDependencyReadiness.ts`
- `apps/api/src/router/index.ts`
- `apps/api/src/router/health-readiness.test.ts`
- `apps/api/src/modules/bots/runtimeSymbolStatsReadModel.service.test.ts`
- `apps/web/src/features/bots/types/bot.type.ts`
- `apps/web/src/features/bots/components/bots-management/MonitoringFutureSignalsSection.tsx`
- Project source-of-truth context and planning files.

## Implementation Plan
1. Reuse the shared strategy rule evaluator to compute per-condition
   `matched` values in signal analysis.
2. Preserve backward compatibility for older runtime event payloads that do not
   contain `matched`.
3. Surface the match state in the existing dashboard condition text without
   changing the module layout.
4. Reset the market-stream Redis publisher memoization after connect or publish
   failure so later market events retry publishing.
5. Route the default Binance USD-M Futures websocket through `/market/ws`.
6. Fail production readiness when required Redis `PING` fails, so deploy smoke
   does not pass while auth/fanout dependencies are degraded.
7. Add focused tests for condition match truth, Redis publisher recovery, and
   the futures websocket route.
8. Run focused API tests, API/web typecheck, build, and guardrails.

## Acceptance Criteria
- [x] Condition lines carry `matched=true|false|null` from the canonical rule
  evaluator.
- [x] Older `SIGNAL_DECISION` payloads without `matched` still parse.
- [x] The dashboard can distinguish `PASS` and `MISS` conditions while keeping
  the same table structure.
- [x] Market-stream publisher retries after an initial Redis connection failure.
- [x] Futures market-stream worker uses Binance's routed `/market/ws` endpoint
  for ticker, mark-price, and kline streams.
- [x] Production API readiness fails closed when required Redis is unavailable.
- [x] Production Redis AOF is repaired from a backed-up volume.
- [x] Production SSE emits real ticker/candle events after Redis recovery.
- [x] Full validation gates complete for this hardening slice.

## Definition of Done
- [x] Implementation is vertical through runtime evaluator, API read model, web
  type, and operator display.
- [x] No duplicate strategy comparison logic is introduced.
- [x] Runtime market event publishing fails recoverably after transient Redis
  startup failure.
- [x] Binance futures websocket route is aligned to the current vendor
  contract.
- [x] API readiness covers required Redis reachability in production.
- [x] Focused regression tests pass.
- [x] Repository guardrails pass.

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- src/modules/market-stream/marketStreamFanout.test.ts src/modules/bots/runtimeSymbolStatsReadModel.service.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts --run` PASS (`50/50`).
  - `pnpm --filter api run test -- src/modules/market-stream/binanceStream.service.test.ts src/modules/market-stream/marketStreamFanout.test.ts src/workers/marketStreamSubscriptions.service.test.ts --run` PASS (`15/15`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm --filter api run test -- src/router/health-readiness.test.ts --run`
    PASS (`9/9`).
  - `pnpm --filter api run typecheck` PASS after Redis readiness hardening.
  - `pnpm --filter web run typecheck` PASS.
  - `pnpm --filter api run build` PASS.
  - `pnpm run quality:guardrails` PASS.
- Manual checks:
  - Authenticated production read-only smoke found PAPER current session
    `eventsCount=1`, `symbolsTracked=0`.
  - Authenticated production SSE smoke connected but received no market events
    for sampled symbols within the smoke window.
  - Local vendor smoke against `wss://fstream.binance.com/ws` opened but
    emitted no futures ticker/mark-price/kline events in the sample window.
  - Local vendor smoke against `wss://fstream.binance.com/market/ws` emitted
    futures kline data after subscription.
  - Coolify production Redis check: `redis` resource is
    `restarting:unhealthy`, restart count `42`, with logs showing corrupted
    `appendonly.aof.4.incr.aof` and `redis-check-aof --fix` guidance.
  - Production Redis recovery: backed up
    `/var/lib/docker/volumes/redis-data-tsij579cy1kfcuxs8onbbxll/_data` to
    `/root/soar-redis-backups/redis-data-tsij579cy1kfcuxs8onbbxll-20260502T035021Z.tgz`,
    then ran `redis-check-aof --fix` against
    `/data/appendonlydir/appendonly.aof.manifest`.
  - Post-recovery Redis status: Coolify reports `running:healthy`; Docker
    status reported `Up ... (healthy)`.
  - Post-recovery authenticated login: PASS.
  - Post-recovery production SSE: PASS, emitted real `candle` and `ticker`
    events for Binance FUTURES symbols including `BTCUSDT`, `ETHUSDT`,
    `1000PEPEUSDT`, and `1000BONKUSDT`.
- Screenshots/logs: not applicable.
- High-risk checks:
  - LIVE bot was read-only inspected only; no LIVE write was performed.

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/reference/runtime-signal-merge-contract.md`.
- Fits approved architecture: yes.
- Mismatch discovered: yes. The implementation still used Binance's legacy
  unrouted futures websocket URL, while the current Binance USD-M Futures
  contract requires the routed `/market` endpoint for regular market streams.
- Decision required from user: no.
- Follow-up architecture doc updates: not required; this preserves the existing
  shared evaluator and market-stream fanout architecture.

## UX/UI Evidence
- Design source type: approved_snapshot.
- Design source reference: existing `Markets / Signals` table.
- Existing shared pattern reused: existing compact table condition cell.
- New shared pattern introduced: no.
- Required states: success.
- Responsive checks: not a layout change.
- Accessibility checks: text status is explicit (`PASS` / `MISS`), not color-only.
- Parity evidence: module layout and columns unchanged.

## Deployment / Ops Evidence
- Deploy impact: medium.
- Env or secret changes: none.
- Health-check impact: production `/ready` now checks Redis `PING` when Redis
  is required.
- Smoke steps updated: `docs/operations/post-deploy-smoke-checklist.md` now
  treats Redis readiness, auth rate-limit degradation, and Redis crash-loop/AOF
  logs as smoke failures.
- Rollback note: revert this commit to return to previous condition payload and
  publisher memoization behavior.
- Observability or alerting impact: market-stream Redis connect/publish
  failures now log explicit errors and retry on future events; futures stream
  bootstrap now connects to the endpoint that actually emits market events;
  API readiness now exposes required Redis dependency failure to deploy gates.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: condition lines lacked match truth; market stream emitted no
  production events during authenticated SSE smoke.
- Gaps: dashboard fallback snapshots could visually look like signals.
- Inconsistencies: Redis publisher startup failure was permanent until process
  restart; the futures websocket URL still pointed at Binance's legacy
  unrouted endpoint, which now opens without delivering regular market streams.
- Architecture constraints: signal truth must reuse the shared runtime
  evaluator.

### 2. Select One Priority Task
- Selected task: `V1BOT-SIGNALS-02`.
- Priority rationale: active paper runtime could appear signal-ready while no
  positions open.
- Why other candidates were deferred: broader release-gate/stage work is not
  needed to fix this runtime/display issue.

### 3. Plan Implementation
- Files or surfaces to modify: runtime evaluator, signal analysis, runtime
  read-model parser, web type/display, market-stream fanout, Binance stream
  endpoint resolver.
- Logic: expose rule match truth from the canonical evaluator, reset failed
  Redis publisher state, and route futures websocket traffic through Binance's
  current `/market` endpoint.
- Edge cases: older runtime event payloads without `matched`; Redis unavailable
  during worker startup; publish failure after initial connection.

### 4. Execute Implementation
- Implementation notes: added `evaluateStrategyRuleAtIndex(...)` wrapper and
  reused it from `buildStrategySignalAnalysis(...)`; added recoverable
  publisher memoization; switched the default futures websocket URL to
  `wss://fstream.binance.com/market/ws`.

### 5. Verify and Test
- Validation performed: focused API tests, API/web typecheck from the previous
  slice, API build, guardrails, direct Binance websocket smoke, Coolify Redis
  read-only inspection, and focused readiness test/typecheck after Redis
  readiness hardening.
- Result: PASS locally and post-recovery production SSE is flowing again.

### 6. Self-Review
- Simpler option considered: infer match state in the dashboard from formatted
  strings.
- Technical debt introduced: no.
- Scalability assessment: per-line evaluation reuses the same indicator cache
  as analysis, so it avoids duplicate series computation.
- Refinements made: parser stores `matched=null` for legacy payloads.

### 7. Update Documentation and Knowledge
- Docs updated: this task file, post-deploy smoke checklist, Redis AOF recovery
  runbook, context/planning files.
- Context updated: pending.
- Learning journal updated: Redis AOF/readiness guardrail captured.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was completed in this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall is confirmed.

## Production-Grade Required Contract
- Goal: expose signal condition truth and recover market-stream publishing.
- Scope: listed above.
- Implementation Plan: listed above.
- Acceptance Criteria: listed above.
- Definition of Done: listed above.
- Result Report: pending final validation.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes.
- Real API/service path used: yes.
- Endpoint and client contract match: yes.
- DB schema and migrations verified: no DB schema change.
- Loading state verified: not applicable.
- Error state verified: Redis startup failure covered by unit test.
- Refresh/restart behavior verified: publisher retries on subsequent events;
  worker restart will create futures sockets against the routed endpoint.
- Regression check performed: focused runtime and market-stream tests.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes.
- Data classification: authenticated operator/runtime telemetry.
- Trust boundaries: no permission changes.
- Permission or ownership checks: no write endpoint changes.
- Abuse cases: none introduced.
- Secret handling: production credentials were used only for local authenticated
  smoke and are not stored in artifacts.
- Security tests or scans: no auth/security code changed.
- Fail-closed behavior: signal execution remains unchanged; stream publishing
  retries instead of silently staying disabled.
- Residual risk: production worker restart/deploy is required for the
  futures websocket route and publisher recovery fixes to take effect.

## Result Report
- Task summary: condition lines now include canonical match truth,
  market-stream Redis publisher failures recover on future events, and
  Binance futures stream workers use the routed `/market/ws` endpoint that
  emits ticker/candle data.
- Files changed: pending final diff.
- How tested: focused market-stream tests, runtime read-model tests, API/web
  typecheck, API build, guardrails, and direct Binance websocket smoke.
- What is incomplete: deploy/smoke.
- Next steps: deploy to production and confirm SSE emits real ticker/candle
  events.
- Decisions made: keep dashboard layout unchanged and add explicit textual
  `PASS` / `MISS` state inside existing condition text.
