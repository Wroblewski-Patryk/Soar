# Task

## Header
- ID: ETHDCA-01
- Title: fix(api-runtime): preserve LIVE DCA-first gating for trailing-stop close decisions
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: none
- Priority: P0
- Iteration: 2026-05-02 operator-reported LIVE ETHUSDT close investigation
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The operator reported that a `LIVE ETHUSDT` isolated short appeared to close by
`TSL` at a loss even though the live strategy was expected to have three DCA
levels and only two DCA adds were visible in the exchange history. Screenshots
showed the final reduce-only close at `2026-05-02 23:38:18`, a total closed
quantity of `0.036 ETH`, realized loss, and no visible `TSL` value in the open
position table before close.

Canonical architecture requires DCA-first lifecycle evaluation:

- `docs/architecture/06_execution-lifecycle.md`
- `docs/architecture/reference/position-lifecycle-parity-matrix.md`
- `docs/architecture/reference/live-protection-state-parity-contract.md`

## Goal
Ensure runtime protection close decisions do not lose durable DCA progression
truth when volatile runtime state is missing or rebased, and ensure operator
surfaces can render an armed loss-side `TSL` instead of hiding it.

## Success Signal
- User or operator problem: a LIVE position must not close by `TSL` while a
  configured pending DCA level is still valid and affordable.
- Expected product or reliability outcome: runtime close gating reuses durable
  trade lifecycle truth before evaluating DCA-first protection.
- How success will be observed: focused runtime regression blocks a
  `LIVE SHORT` ETH-like `TSL` close with `currentAdds=2` and
  `dcaLevelCount=3`; dynamic stop serialization renders negative TSL state.
- Post-launch learning needed: yes.

## Deliverable For This Stage
Implementation plus verification evidence for the smallest runtime slice:
durable DCA progress hydration before runtime management evaluation and
negative trailing-loss `TSL` display parity.

## Constraints
- Use existing lifecycle, trade, and runtime-state mechanisms.
- Do not introduce a parallel strategy engine.
- Do not weaken the DCA-first contract.
- Do not add exchange-side order behavior in this slice.
- Keep the change scoped to runtime automation and runtime position
  serialization.

## Definition of Done
- [x] Runtime automation reads durable DCA progress before DCA-first close
  gating.
- [x] ETH-like LIVE short regression proves pending affordable DCA blocks
  `trailing_stop`.
- [x] Runtime position serialization renders negative trailing-loss TSL state.
- [x] Focused runtime/serialization tests pass.
- [x] API typecheck passes.
- [x] Repository guardrails pass.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- New strategy systems.
- Display-only DCA or TSL inference as execution truth.
- Temporary bypasses.
- Weakening LIVE fail-closed behavior.
- Architecture changes without explicit approval.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/bots/runtimePositionSerialization.service.test.ts` -> PASS (`38/38`)
  - `pnpm --filter api run typecheck` -> PASS
  - `pnpm --filter api run build` -> PASS
  - `pnpm run quality:guardrails` -> PASS
- Manual checks:
  - Reviewed operator screenshots and mapped exchange rows to the ETH-like
    regression shape.
- Screenshots/logs:
  - User-provided screenshots in task thread.
- High-risk checks:
  - Money-impacting behavior remains fail-closed: pending affordable DCA keeps
    TSL close blocked; unaffordable DCA exception remains unchanged.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/reference/position-lifecycle-parity-matrix.md`
  - `docs/architecture/reference/live-protection-state-parity-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not required; implementation now better
  matches existing architecture.

## Deployment / Ops Evidence
- Deploy impact: medium
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: production readback should inspect latest runtime
  protection close telemetry and ETHUSDT trade history after deploy.
- Rollback note: revert this commit to restore prior volatile runtime-state
  behavior.
- Observability or alerting impact: existing runtime protection close telemetry
  remains in use.
- Staged rollout or feature flag: none.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues:
  - Runtime state can be missing or rebased while durable trade history still
    proves executed DCA adds.
  - Negative `trailingLossLimitPercent` was not rendered as dynamic `TSL`.
- Gaps:
  - The operator table could hide an armed loss-side TSL.
  - Runtime close gating did not explicitly rehydrate durable DCA count before
    evaluating an otherwise volatile position state.
- Inconsistencies:
  - Backtest/read-model paths already reconstruct DCA from durable trade
    lifecycle evidence more explicitly than runtime automation.
- Architecture constraints:
  - DCA-first is mandatory; `TSL` and `SL` must not bypass pending affordable
    DCA.

### 2. Select One Priority Task
- Selected task: `ETHDCA-01`
- Priority rationale: live money-impacting close behavior reported by the
  operator.
- Why other candidates were deferred: exchange-native stop-order convergence
  and production forensic readback are larger follow-up slices.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
  - `apps/api/src/modules/engine/runtimePositionAutomation.types.ts`
  - `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`
  - `apps/api/src/modules/bots/runtimePositionSerialization.service.ts`
  - `apps/api/src/modules/bots/runtimePositionSerialization.service.test.ts`
- Logic:
  - Load durable current-position and same-lifecycle `OPEN`/`DCA` trade legs
    before evaluation.
  - Merge the durable `currentAdds` upward into runtime state only when it is
    stronger than volatile state.
  - Keep DCA affordability and DCA-first protection gates unchanged.
  - Render finite negative `trailingLossLimitPercent` as a valid dynamic TSL.
- Edge cases:
  - Runtime state present and stronger than durable trade progress.
  - Imported/exchange-synced position rebased to canonical quantity/entry.
  - Negative TSL state for loss-side trailing.

### 4. Execute Implementation
- Implementation notes:
  - Added `getDurableDcaProgress` dependency seam.
  - Default implementation reads persisted `Trade` rows for the current
    position and same bot/wallet/strategy/symbol lifecycle, then cuts off
    stale history at the latest opposite-side close.
  - Tests use an injected dependency to keep focused runtime coverage
    deterministic.

### 5. Verify and Test
- Validation performed:
  - Focused runtime/serialization tests.
  - API typecheck.
  - Repository guardrails.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: forcing TSL block only from current runtime state.
- Technical debt introduced: no.
- Scalability assessment: the trade lookup is scoped per open position and
  reuses durable lifecycle truth across current-position and same-context
  replacement rows without introducing a parallel lifecycle model.
- Refinements made: test seam avoids DB-backed runtime unit fragility.

### 7. Update Documentation and Knowledge
- Docs updated:
  - This task file.
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
- Context updated:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
- Learning journal updated: yes.

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
The screenshots alone cannot prove whether production had `dcaFundsExhausted`
or whether the saved advanced config contained two or three effective levels.
The fix nevertheless closes a concrete runtime safety gap: volatile state can
no longer undercount durable DCA progress before DCA-first protection gating.

## Production-Grade Required Contract

- Goal: preserve DCA-first close gating for LIVE runtime protection decisions.
- Scope: runtime automation, runtime position serialization, focused tests,
  planning/context docs.
- Implementation Plan: hydrate durable DCA progress, merge it into runtime
  state, render finite negative TSL state, validate with focused runtime tests.
- Acceptance Criteria:
  - pending affordable DCA blocks ETH-like `trailing_stop`;
  - negative trailing-loss TSL is visible;
  - focused tests/typecheck/guardrails pass.
- Definition of Done: satisfied with evidence above.
- Result Report: see below.

## Integration Evidence

## Product / Discovery Evidence
- Problem validated: partially, from operator screenshots and architecture/code
  analysis.
- User or operator affected: live bot operator.
- Existing workaround or pain: manual post-hoc exchange inspection only.
- Smallest useful slice: local runtime DCA-progress hydration plus display fix.
- Success metric or signal: no repeat TSL close while DCA remains pending and
  affordable.
- Feature flag, staged rollout, or disable path: not applicable.
- Post-launch feedback or metric check: production readback after deploy.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable for this local runtime slice.
- Critical user journey: LIVE bot position protection.
- SLI: correct protection-close decisions.
- SLO: no known DCA-first violations.
- Error budget posture: healthy after local fix; production readback pending.
- Health/readiness check: unchanged.
- Logs, dashboard, or alert route: existing runtime telemetry.
- Smoke command or manual smoke: focused tests listed above.
- Rollback or disable path: revert commit.

- `INTEGRATION_CHECKLIST.md` reviewed: yes.
- Real API/service path used: runtime service path.
- Endpoint and client contract match: not applicable.
- DB schema and migrations verified: no schema change.
- Loading state verified: not applicable.
- Error state verified: fail-closed behavior preserved.
- Refresh/restart behavior verified: durable trade progress now survives
  volatile runtime-state loss for current-position and same-context lifecycle
  trades.
- Regression check performed: yes.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes.
- Data classification: trading lifecycle data, money-impacting behavior.
- Trust boundaries: API/runtime worker and persisted DB trade history.
- Permission or ownership checks: existing runtime position ownership filters
  remain unchanged.
- Abuse cases: stale/volatile runtime state causing premature automated close.
- Secret handling: none touched.
- Security tests or scans: typecheck and guardrails.
- Fail-closed behavior: DCA-first close gating remains restrictive.
- Residual risk: production forensic readback still needed to classify the
  exact ETH close cause.

- `AI_TESTING_PROTOCOL.md` reviewed: not applicable.

## Result Report

- Task summary: runtime automation now hydrates durable DCA progress before
  protection close evaluation; negative loss-side TSL state renders instead of
  disappearing.
- Files changed:
  - `apps/api/src/modules/engine/runtimePositionAutomation.service.ts`
  - `apps/api/src/modules/engine/runtimePositionAutomation.types.ts`
  - `apps/api/src/modules/engine/runtimePositionAutomation.service.test.ts`
  - `apps/api/src/modules/bots/runtimePositionSerialization.service.ts`
  - `apps/api/src/modules/bots/runtimePositionSerialization.service.test.ts`
  - planning/context docs
- How tested:
  - focused tests (`38/38`)
  - API typecheck
  - API build
  - repository guardrails
- What is incomplete:
  - production authenticated ETHUSDT forensic readback after deploy.
- Next steps:
  - deploy and inspect actual ETH position/order/runtime events for
    `currentAdds`, `dcaLevelCount`, `dcaFundsExhausted`, and close reason.
- Decisions made:
  - use persisted `Trade` lifecycle rows as stronger DCA progress truth than
    volatile runtime memory when the durable count is higher.
