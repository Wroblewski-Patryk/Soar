# Task

## Header
- ID: RUNTIME-SIGNAL-VOTES-01
- Title: Recover runtime strategy votes when indicator conditions are already matched
- Task Type: fix
- Current Stage: planning
- Status: READY
- Owner: Backend Builder
- Depends on: DASHSIGNALS-02
- Priority: P0
- Iteration: 2026-05-02 production operator signal regression
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected for the next implementation slice.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator reported that the active PAPER bot shows concrete strategy
indicator values across its configured market scope, yet no symbols produce
accepted runtime signals. A production read-only check of `Peper bot`
(`073545b5-33cf-4014-9064-d4120a39ea93`) confirmed the inconsistency on
2026-05-02:

- the running session `122f6846-2f8c-4ee6-bfee-9d2621f29c96` had
  `eventsCount=213`, `lastSignalAt=null`, and `summary.totalSignals=0`;
- `DOGEUSDT` exposed `RSI(14) 78.6959 > 51` with `matched=true`;
- the same row still had `lastSignalDirection=null`,
  `lastSignalReason=No votes`, and `totalSignals=0`;
- other rows also showed matched SHORT conditions while still ending as
  `No votes`.

Local engine probing with the same strategy config (`RSI 45/55`) and 150
fresh Binance Futures `DOGEUSDT` `5m` candles returned `LONG`, proving the
indicator math and strategy parser can produce a valid direction when the
decision series is warm enough.

The likely regression shape is that `DASHSIGNALS-02` recovered indicator
candles only for the dashboard/read-model path, while the actual runtime final
candle decision still evaluates against short in-memory series and returns
`direction=null`. The dashboard then substitutes recovered snapshot analysis
for display, creating an operator-visible contradiction: concrete matched
conditions but no strategy vote.

## Goal
Make runtime final-candle strategy evaluation use the same recoverable candle
truth required for dashboard display, so a concrete matched strategy condition
can produce a `LONG` or `SHORT` vote and proceed through the existing
pre-trade/orchestration guardrails.

## Success Signal
- User or operator problem: a paper/live runtime row can show matched strategy
  conditions while the merge result remains `No votes`.
- Expected product or reliability outcome: matched runtime conditions produce
  accepted strategy votes, unless an explicit guardrail blocks execution with a
  recorded reason.
- How success will be observed: production paper bot records non-zero
  `totalSignals` / `lastSignalDirection` after a matched final candle, or
  records a specific pre-trade/orchestration block instead of `No votes`.
- Post-launch learning needed: yes.

## Deliverable For This Stage
This planning artifact, synchronized into canonical queue/context, with
production evidence, suspected root cause, implementation tasks, validation
commands, and rollout/smoke expectations.

## Scope
- `apps/api/src/modules/engine/runtimeSignalMarketDataGateway.ts`
- `apps/api/src/modules/engine/runtimeSignalDecisionEngine.ts`
- `apps/api/src/modules/engine/runtimeFinalCandleDecision.service.ts`
- `apps/api/src/modules/engine/runtimeSignalLoop.service.ts`
- `apps/api/src/modules/engine/runtimeSignalMarketDataGateway.test.ts`
- `apps/api/src/modules/engine/runtimeSignalDecisionEngine.test.ts`
- `apps/api/src/modules/engine/runtimeFinalCandleDecision.service.test.ts`
- `apps/api/src/modules/bots/runtimeSessionSymbolStatsRead.service.ts`
- `apps/api/src/modules/bots/runtimeSymbolStatsReadModel.service.ts`
- production read-only runtime smoke against the active PAPER bot, and then
  LIVE read-only parity once PAPER is fixed.

## Implementation Plan
1. Add a failing backend regression that reproduces the production
   contradiction: a final candle with a short in-memory series, recovered
   indicator candles that make `RSI(14)` pass, and an expected runtime
   `LONG`/`SHORT` vote instead of merge `no_votes`.
2. Move the approved candle recovery behavior from dashboard-only read-model
   usage into engine/runtime ownership, or expose a shared engine helper that
   both paths use. Runtime candles must remain authoritative on overlap.
3. Ensure `RuntimeSignalDecisionEngine.evaluateStrategy` can request or receive
   an indicator-ready series before returning `direction=null` for unavailable
   indicator input.
4. Preserve fail-closed semantics: if candles cannot be recovered, record a
   diagnostic reason such as `indicator_input_unavailable` rather than making
   a fake vote.
5. Keep merge/pre-trade/orchestration behavior unchanged after a real vote is
   produced. Existing max-position, manual/external-management, wallet-budget,
   exchange-min-order, dedupe, and no-flip guardrails must still own execution
   blocking.
6. Add read-model regression coverage that prevents a row with concrete
   `matched=true` snapshot lines and stale `No votes` latest decision from
   looking like an impossible final decision without an explicit diagnostic.
7. Run focused engine/runtime tests, API typecheck, API build, and repository
   guardrails.
8. Deploy and run production read-only smoke:
   - check `/health` and `/ready`;
   - inspect the active PAPER bot session;
   - verify that a matched final-candle condition produces
     `lastSignalDirection=LONG|SHORT` and increments `totalSignals`, or that a
     later guardrail records a concrete block reason;
   - verify LIVE bot read-only signal rows no longer show matched conditions
     paired with `No votes`.

## Acceptance Criteria
- A strategy condition that evaluates `matched=true` on an indicator-ready
  final-candle series cannot merge as `no_votes`.
- Runtime decision evaluation and dashboard signal display use one consistent
  candle-recovery contract.
- `No votes` remains valid only when strategy rules are absent, malformed,
  interval-ineligible, or indicator input is explicitly unavailable.
- No order execution code path is bypassed; accepted votes still pass through
  existing pre-trade and orchestration guards.
- Production PAPER evidence proves the reported bot no longer has
  `matched=true` + `lastSignalReason=No votes` for the same final decision.

## Definition of Done
- [ ] `DEFINITION_OF_DONE.md` is satisfied for this runtime slice.
- [ ] Focused regression fails before the fix and passes after the fix.
- [ ] Runtime and dashboard condition truth are parity-locked.
- [ ] API typecheck, API build, and repository guardrails pass.
- [ ] Production read-only smoke evidence is recorded after deploy.
- [ ] `.codex/context/TASK_BOARD.md`, `.codex/context/PROJECT_STATE.md`, and
  relevant planning docs are updated with result evidence.
- [ ] `.codex/context/LEARNING_JOURNAL.md` records the recurring pitfall if
  the root cause is confirmed as read-model/runtime recovery drift.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Treating dashboard snapshot-only truth as an execution signal.
- Opening positions from read-model code.
- Adding a temporary forced-signal path.
- Hiding the contradiction by changing only UI opacity, labels, or counters.
- Duplicating indicator math in a new local-only implementation.
- Weakening existing pre-trade, wallet, no-flip, max-position, or LIVE exchange
  validation guardrails.

## Validation Evidence
- Tests: not run for implementation yet; this is a planning-stage artifact.
- Manual checks:
  - production API read-only session inspection confirmed `DOGEUSDT`
    `matched=true` with `lastSignalReason=No votes` and `totalSignals=0`;
  - local engine probe with 150 Binance Futures `DOGEUSDT` `5m` candles and
    the same `RSI 45/55` strategy returned `LONG`.
- Screenshots/logs: operator-provided dashboard DOM showed `Signals: 0` with
  concrete RSI values; production API readback captured the same contradiction.
- High-risk checks: no runtime mutation performed during analysis.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
  - `docs/architecture/architecture-source-of-truth.md`
  - `DEFINITION_OF_DONE.md`
  - `INTEGRATION_CHECKLIST.md`
  - `NO_TEMPORARY_SOLUTIONS.md`
- Fits approved architecture: yes.
- Mismatch discovered: no architecture mismatch yet. The bug appears to be a
  parity drift inside approved runtime/read-model ownership.
- Decision required from user: no.
- Follow-up architecture doc updates: not expected unless implementation shows
  that candle recovery ownership needs a documented contract.

## Deployment / Ops Evidence
- Deploy impact: high, because this touches automated paper/live signal
  generation before order orchestration.
- Env or secret changes: none expected.
- Health-check impact: none expected.
- Smoke steps updated: production runtime signal smoke should explicitly assert
  `matched=true` cannot coexist with `No votes` for the same strategy context.
- Rollback note: revert the implementation commit if signal volume becomes
  unsafe or if guardrails are bypassed; existing bot active flags remain the
  operational disable path.
- Observability or alerting impact: add or preserve runtime event diagnostics
  for unavailable indicator input.
- Staged rollout or feature flag: production-only environment; use PAPER
  read-only verification first, then LIVE read-only parity.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: production PAPER bot displays concrete matched RSI conditions while
  runtime merge records `No votes` and no accepted signals.
- Gaps: candle recovery exists in dashboard/read-model path but is not proven
  in final-candle execution path.
- Inconsistencies: display can show `matched=true`, while `totalSignals=0` and
  `lastSignalDirection=null` persist for the same configured strategy context.
- Architecture constraints: runtime signal merge must stay deterministic and
  fail closed; read-model code must not become an execution source.

### 2. Select One Priority Task
- Selected task: `RUNTIME-SIGNAL-VOTES-01`.
- Priority rationale: a broken strategy-vote path blocks PAPER and may also
  affect LIVE signal generation.
- Why other candidates were deferred: UI opacity/counter cleanup is secondary
  until the runtime vote source is fixed.

### 3. Plan Implementation
- Files or surfaces to modify: engine runtime signal gateway/decision/final
  candle services, focused tests, and the read-model parity test.
- Logic: share recoverable indicator-ready candle series before strategy
  evaluation, then let existing merge/guards decide.
- Edge cases: short candle buffers, REST fallback failure, derivative
  indicators, current forming REST candle, duplicate final-candle dedupe,
  existing open positions, max-position cap, LIVE exchange constraints.

### 4. Execute Implementation
- Implementation notes: pending next stage.

### 5. Verify and Test
- Validation performed: planning-stage read-only production checks and local
  non-mutating engine probe.
- Result: bug confirmed as likely runtime/read-model parity drift.

### 6. Self-Review
- Simpler option considered: make UI mark cards active from `matched=true`
  lines. Rejected because it would hide the execution bug and could claim
  actionable signals that runtime did not accept.
- Technical debt introduced: no.
- Scalability assessment: a shared indicator-ready series contract prevents
  future indicator families from drifting between dashboard and runtime.
- Refinements made: task focuses on runtime vote recovery first; UI polish is
  explicitly deferred.

### 7. Update Documentation and Knowledge
- Docs updated: this planning artifact.
- Context updated: task board and project state should reference this P0 once
  committed.
- Learning journal updated: not yet; update after root cause is fixed and
  confirmed.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected for the next implementation slice.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done expectations are attached for implementation.
- [x] Relevant planning-stage validations were run.
- [x] Docs/context update is planned.
- [x] Learning journal update is deferred until confirmed root cause.

## Result Report
- Task summary: production audit confirmed matched indicator conditions can
  currently end as `No votes`; the next fix must move candle recovery into the
  runtime decision path, not only the dashboard read path.
- Files changed: this planning artifact.
- How tested: production read-only API inspection and local engine probe.
- What is incomplete: implementation, automated regression, deploy, and
  production post-deploy smoke.
- Next steps: implement `RUNTIME-SIGNAL-VOTES-01` as the next P0 runtime slice.
- Decisions made: do not fix by UI-only activation; fix runtime vote input
  parity first.
