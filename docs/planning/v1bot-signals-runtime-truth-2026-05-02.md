# Task

## Header
- ID: V1BOT-SIGNALS-02
- Title: fix(api-runtime): expose condition match truth and recover market-stream publishing
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

## Goal
Make the dashboard condition display reflect canonical runtime rule-match truth
and prevent a transient Redis startup failure in the market-stream worker from
permanently muting market events.

## Scope
- `apps/api/src/modules/engine/strategySignalEvaluator.ts`
- `apps/api/src/modules/engine/strategySignalAnalysis.ts`
- `apps/api/src/modules/engine/runtimeSignalEvaluationTypes.ts`
- `apps/api/src/modules/bots/runtimeSignalConditionLines.service.ts`
- `apps/api/src/modules/market-stream/marketStreamFanout.ts`
- `apps/api/src/modules/market-stream/marketStreamFanout.test.ts`
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
5. Add focused tests for condition match truth and Redis publisher recovery.
6. Run focused API tests, API/web typecheck, build, and guardrails.

## Acceptance Criteria
- [x] Condition lines carry `matched=true|false|null` from the canonical rule
  evaluator.
- [x] Older `SIGNAL_DECISION` payloads without `matched` still parse.
- [x] The dashboard can distinguish `PASS` and `MISS` conditions while keeping
  the same table structure.
- [x] Market-stream publisher retries after an initial Redis connection failure.
- [ ] Full validation gates complete.

## Definition of Done
- [x] Implementation is vertical through runtime evaluator, API read model, web
  type, and operator display.
- [x] No duplicate strategy comparison logic is introduced.
- [x] Runtime market event publishing fails recoverably after transient Redis
  startup failure.
- [x] Focused regression tests pass.
- [ ] Repository guardrails pass.

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- src/modules/market-stream/marketStreamFanout.test.ts src/modules/bots/runtimeSymbolStatsReadModel.service.test.ts src/modules/engine/runtimeSignalLoop.service.test.ts --run` PASS (`50/50`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm --filter web run typecheck` PASS.
- Manual checks:
  - Authenticated production read-only smoke found PAPER current session
    `eventsCount=1`, `symbolsTracked=0`.
  - Authenticated production SSE smoke connected but received no market events
    for sampled symbols within the smoke window.
- Screenshots/logs: not applicable.
- High-risk checks:
  - LIVE bot was read-only inspected only; no LIVE write was performed.

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/reference/runtime-signal-merge-contract.md`.
- Fits approved architecture: yes.
- Mismatch discovered: no.
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
- Health-check impact: none.
- Smoke steps updated: pending.
- Rollback note: revert this commit to return to previous condition payload and
  publisher memoization behavior.
- Observability or alerting impact: market-stream Redis connect/publish
  failures now log explicit errors and retry on future events.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: condition lines lacked match truth; market stream emitted no
  production events during authenticated SSE smoke.
- Gaps: dashboard fallback snapshots could visually look like signals.
- Inconsistencies: Redis publisher startup failure was permanent until process
  restart.
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
  read-model parser, web type/display, market-stream fanout.
- Logic: expose rule match truth from the canonical evaluator and reset failed
  Redis publisher state.
- Edge cases: older runtime event payloads without `matched`; Redis unavailable
  during worker startup; publish failure after initial connection.

### 4. Execute Implementation
- Implementation notes: added `evaluateStrategyRuleAtIndex(...)` wrapper and
  reused it from `buildStrategySignalAnalysis(...)`; added recoverable
  publisher memoization.

### 5. Verify and Test
- Validation performed: focused API tests plus API/web typecheck.
- Result: PASS so far.

### 6. Self-Review
- Simpler option considered: infer match state in the dashboard from formatted
  strings.
- Technical debt introduced: no.
- Scalability assessment: per-line evaluation reuses the same indicator cache
  as analysis, so it avoids duplicate series computation.
- Refinements made: parser stores `matched=null` for legacy payloads.

### 7. Update Documentation and Knowledge
- Docs updated: this task file plus context/planning files.
- Context updated: pending.
- Learning journal updated: not applicable.

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
- [ ] Docs or context were updated if repository truth changed.
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
- Refresh/restart behavior verified: publisher retries on subsequent events.
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
  publisher recovery fix to take effect.

## Result Report
- Task summary: condition lines now include canonical match truth and
  market-stream Redis publisher failures recover on future events.
- Files changed: pending final diff.
- How tested: focused tests and typecheck so far.
- What is incomplete: build, guardrails, deploy/smoke.
- Next steps: finish validation and deploy to production.
- Decisions made: keep dashboard layout unchanged and add explicit textual
  `PASS` / `MISS` state inside existing condition text.
