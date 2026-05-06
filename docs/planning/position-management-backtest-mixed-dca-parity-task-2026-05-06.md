# Task

## Header
- ID: PMPLC-05
- Title: fix(api-backtests): preserve mixed DCA lane parity with runtime
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-01, PMPLC-02
- Priority: P1
- Iteration: 5
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The canonical PnL lifecycle contract requires backtests to preserve the same
DCA-first lifecycle semantics as runtime. Runtime now tracks executed DCA level
indices so positive and negative DCA lanes can progress independently. The
backtest replay and portfolio simulations still stored only aggregate
`dcaCount`, and the replay DCA probe used a single adverse candle extreme for
LONG/SHORT positions.

## Goal
Make backtest DCA replay preserve runtime parity for mixed positive/negative
DCA lanes, including intrabar favorable and adverse moves.

## Success Signal
- User or operator problem: strategy backtests could under-report or misorder
  mixed DCA progression compared with runtime behavior.
- Expected product or reliability outcome: backtest reports remain faithful to
  the runtime DCA lifecycle for mixed lanes.
- How success will be observed: focused regression executes adverse-side DCA
  and then favorable-side DCA in one replayed position, ending with the same
  quantity scaling as runtime.
- Post-launch learning needed: no.

## Deliverable For This Stage
Production code plus focused regression coverage and validation evidence.

## Constraints
- Reuse the existing `evaluatePositionManagement` core.
- Do not create a separate backtest DCA engine.
- Keep adapter differences limited to historical candle extremes and simulated
  fills.
- Do not alter strategy validation or UI behavior in this slice.

## Definition of Done
- [x] Backtest replay can execute mixed adverse/favorable DCA lanes.
- [x] Backtest state carries executed DCA level indices.
- [x] Portfolio simulation uses the same replay DCA probe resolver.
- [x] Relevant tests, typecheck, guardrails, lint, and diff check pass.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- Parallel lifecycle logic that diverges from `evaluatePositionManagement`.
- Mock-only or report-only DCA behavior.
- Temporary bypasses around DCA-first close semantics.

## Validation Evidence
- Tests: `pnpm --filter api exec vitest run src/modules/backtests/backtestReplayCore.test.ts src/modules/engine/positionManagement.service.test.ts --run` PASS (`48/48`).
- Focused backtest suite: `pnpm --filter api exec vitest run src/modules/backtests/backtestReplayCore.test.ts --run` PASS (`26/26`).
- Typecheck: `pnpm --filter api run typecheck` PASS.
- Guardrails: `pnpm run quality:guardrails` PASS.
- Lint: `pnpm run lint` PASS.
- Diff check: `git diff --check` PASS with line-ending warnings only.
- Manual checks: reviewed replay and interleaved portfolio DCA state flow.
- High-risk checks: regression covers negative DCA followed by positive DCA in
  one lifecycle.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/position-management-pnl-lifecycle-contract.md`
- Fits approved architecture: yes.
- Mismatch discovered: yes, resolved in this slice.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none.

## UX/UI Evidence
Not applicable.

## Deployment / Ops Evidence
- Deploy impact: low.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert backtest replay/portfolio DCA probe changes if needed.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: replay DCA probe selected only one candle extreme and missed
  favorable-side intrabar DCA for LONG/SHORT positions.
- Gaps: backtest open-position state did not persist
  `executedDcaLevelIndices`.
- Inconsistencies: runtime mixed-lane DCA could execute a lane that backtest
  considered unavailable or already consumed.
- Architecture constraints: backtests must use the runtime position-management
  decision core wherever possible.

### 2. Select One Priority Task
- Selected task: fix mixed DCA lane parity in backtest replay and portfolio
  simulation.
- Priority rationale: money-impacting simulation/runtime drift can mislead
  strategy decisions before LIVE use.
- Why other candidates were deferred: full exchange-backed protection remains
  larger future work.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `apps/api/src/modules/backtests/backtestReplayCore.ts`
  - `apps/api/src/modules/backtests/backtestPortfolioSimulation.service.ts`
  - `apps/api/src/modules/backtests/backtestReplayCore.test.ts`
- Logic: add a shared replay DCA probe-price resolver that chooses favorable or
  adverse candle extremes by DCA level direction, persist executed DCA indices
  in replay state, and reuse the resolver in portfolio simulation.
- Edge cases: negative lane first then positive lane later; short-side parity
  uses the inverse candle extremes through the shared helper.

### 4. Execute Implementation
- Implementation notes: added `resolveReplayDcaProbePrice`, carried
  `executedDcaLevelIndices`, and updated DCA last price from the core result.

### 5. Verify and Test
- Validation performed: focused backtest suite, runtime position-management
  suite, API typecheck, guardrails, lint, diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: replay-only fix. Portfolio simulation shared the
  same drift, so it was updated to reuse the same helper.
- Technical debt introduced: no.
- Scalability assessment: helper keeps candle-boundary logic outside the
  runtime core while preserving shared lifecycle decisions.
- Refinements made: initial test failed because the strategy opened after
  indicator warmup; the fixture was adjusted to prove DCA after the actual
  open candle.

### 7. Update Documentation and Knowledge
- Docs updated: this task evidence file, MVP planning queue, MVP execution log.
- Context updated: project state and task board.
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
- [x] Docs or context were updated if repository truth changed.
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
Residual risk: this slice covers replay and interleaved portfolio simulation.
Further parity work should audit final-range closure and unaffordable-DCA
policy under multi-symbol balance constraints.

## Production-Grade Required Contract
- Goal: align backtest mixed-lane DCA progression with runtime.
- Scope: backtest replay core, interleaved portfolio simulation, focused tests,
  and planning/context evidence.
- Implementation Plan: inspect architecture, identify drift, add shared helper,
  persist executed DCA indices, add regression, validate.
- Acceptance Criteria: mixed adverse/favorable DCA regression passes and shared
  runtime core remains the authority.
- Definition of Done: satisfied for this money-impacting parity slice.
- Result Report: PMPLC-05 closed locally with focused validation evidence.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: not applicable for internal backtest
  parity slice.
- Real API/service path used: existing backtest replay and portfolio simulation
  code paths.
- Endpoint and client contract match: not applicable.
- DB schema and migrations verified: not applicable.
- Loading state verified: not applicable.
- Error state verified: not applicable.
- Refresh/restart behavior verified: deterministic replay state covered by
  focused tests.
- Regression check performed: focused backtest/runtime suites.

## Product / Discovery Evidence
- Problem validated: yes.
- User or operator affected: strategy authors evaluating DCA behavior before
  running PAPER/LIVE.
- Existing workaround or pain: none acceptable; reports must be truthful.
- Smallest useful slice: replay/portfolio DCA lane parity.
- Success metric or signal: mixed lane regression remains green.
- Feature flag, staged rollout, or disable path: not applicable.
- Post-launch feedback or metric check: no.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not
  applicable.
- Critical user journey: strategy backtest lifecycle reporting.
- SLI: not applicable.
- SLO: not applicable.
- Error budget posture: not applicable.
- Health/readiness check: not applicable.
- Logs, dashboard, or alert route: unchanged.
- Smoke command or manual smoke: focused unit suites.
- Rollback or disable path: revert this slice.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable.
- Data classification: no user data path changed.
- Trust boundaries: internal simulation only.
- Permission or ownership checks: unchanged.
- Abuse cases: misleading simulation output for money-impacting strategy
  decisions.
- Secret handling: unchanged.
- Security tests or scans: not applicable.
- Fail-closed behavior: focused regression fails on mixed-lane parity drift.
- Residual risk: unaffordable-DCA multi-symbol policy still needs a dedicated
  parity audit.

## AI Testing Evidence
Not applicable.
