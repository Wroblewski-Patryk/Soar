# Task

## Header
- ID: PMPLC-04
- Title: test(api-runtime): lock LIVE close order contract before venue protection work
- Task Type: test
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-01, PMPLC-02, PMPLC-03
- Priority: P1
- Iteration: 4
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The PnL position-management lifecycle contract requires DCA-first runtime
semantics across `PAPER`, `LIVE`, and backtests. The LIVE exchange protection
order contract is still a proposed canonical target for future exchange-backed
stop orders. Current LIVE execution should therefore remain runtime-owned for
close decisions and must not silently introduce venue-side hard `TP`/`SL`
behavior before canonical protection-order persistence and reconciliation
exist.

## Goal
Lock the current LIVE runtime close path so it submits a reduce-only market
close order and does not smuggle hard stop/take-profit fields into the order
payload.

## Success Signal
- User or operator problem: accidental venue-side hard `TP`/`SL` could bypass
  pending valid DCA while the app still claims DCA-first lifecycle semantics.
- Expected product or reliability outcome: LIVE close execution remains
  runtime-owned until the approved exchange protection slice is implemented.
- How success will be observed: focused runtime orchestrator test proves the
  close order payload is `MARKET`, `reduceOnly`, and does not include
  `stopPrice`, `stopLoss`, or `takeProfit`.
- Post-launch learning needed: no.

## Deliverable For This Stage
A focused regression test and task evidence proving the current LIVE close
contract is explicit.

## Constraints
- Use existing execution orchestrator tests.
- Do not introduce venue-side protection orders in this slice.
- Do not change runtime execution behavior without a failing implementation
  mismatch.
- Keep exchange-backed protection as a future explicit vertical slice.

## Definition of Done
- [x] LIVE close payload contract is locked by test.
- [x] Architecture evidence is recorded.
- [x] Relevant validation passes.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- New exchange protection system without approval.
- Hidden hard `TP`/`SL` or stop-order behavior in current LIVE close path.
- Temporary bypasses, mock-only behavior, or duplicated close logic.

## Validation Evidence
- Tests: `pnpm --filter api exec vitest run src/modules/engine/executionOrchestrator.service.test.ts --run` PASS (`17/17`).
- Typecheck: `pnpm --filter api run typecheck` PASS.
- Guardrails: `pnpm run quality:guardrails` PASS.
- Lint: `pnpm run lint` PASS.
- Diff check: `git diff --check` PASS with line-ending warnings only.
- Manual checks: code review of `executionOrchestrator.service.ts`,
  `orders.service.ts`, and `exchangeAdapterBoundary.service.ts` confirmed
  current LIVE close uses runtime-owned market reduce-only order submission and
  the boundary maps only app `MARKET`/`LIMIT` orders.
- Screenshots/logs: not applicable.
- High-risk checks: regression asserts no `stopPrice`, `stopLoss`, or
  `takeProfit` fields are sent in the LIVE close payload.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/position-management-pnl-lifecycle-contract.md`
  - `docs/architecture/reference/live-exchange-protection-order-contract.md`
- Fits approved architecture: yes.
- Mismatch discovered: no.
- Decision required from user: no.
- Approval reference if architecture changed: not applicable.
- Follow-up architecture doc updates: none; the proposed protection-order
  target remains future work.

## UX/UI Evidence
Not applicable.

## Deployment / Ops Evidence
- Deploy impact: none.
- Env or secret changes: none.
- Health-check impact: none.
- Smoke steps updated: no.
- Rollback note: revert the focused test-only change if needed.
- Observability or alerting impact: none.
- Staged rollout or feature flag: not applicable.

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: the proposed future protection-order contract has no active
  exchange-backed stop-order implementation yet.
- Gaps: no regression explicitly locked that LIVE runtime close orders are not
  hard venue-side stop/take-profit orders.
- Inconsistencies: none found in current implementation.
- Architecture constraints: DCA-first remains runtime-owned; exchange
  protection needs explicit persistence, reconciliation, and attribution before
  being introduced.

### 2. Select One Priority Task
- Selected task: lock the LIVE close order payload contract.
- Priority rationale: money-impacting runtime behavior deserves a regression
  barrier before future venue protection work.
- Why other candidates were deferred: full exchange protection is a larger
  vertical slice requiring exchange boundary, persistence, reconciliation, and
  operator surfaces.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `apps/api/src/modules/engine/executionOrchestrator.service.test.ts`
  - planning/context docs
- Logic: strengthen the existing LIVE close test to assert `MARKET`,
  `reduceOnly`, and absence of stop/take-profit payload fields.
- Edge cases: current close attribution and realized-PnL behavior must remain
  unchanged.

### 4. Execute Implementation
- Implementation notes: renamed the existing LIVE close test and added
  payload-shape assertions without changing production code.

### 5. Verify and Test
- Validation performed: focused runtime orchestrator suite, API typecheck,
  repository guardrails, lint, and diff check.
- Result: PASS (`17/17` focused tests; all gates passed).

### 6. Self-Review
- Simpler option considered: docs-only audit. A focused test was better because
  it protects future runtime changes mechanically.
- Technical debt introduced: no.
- Scalability assessment: the test is narrow and should remain valid until the
  explicit exchange-backed protection slice intentionally changes the contract.
- Refinements made: kept assertions on the existing mocked order gateway
  rather than adding a parallel fake system.

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
Residual risk: current LIVE protection remains runtime-triggered market close
only. Native exchange-backed stop protection still requires an explicit future
vertical slice covering order identity/state persistence, reconciliation,
fill-based close attribution, and operator telemetry.

## Production-Grade Required Contract
- Goal: prevent silent LIVE hard-stop drift before canonical protection-order
  implementation exists.
- Scope: runtime execution orchestrator test and planning/context evidence.
- Implementation Plan: audit architecture and current LIVE order path, add
  focused regression assertion, run validation, update docs.
- Acceptance Criteria: focused test passes and docs record residual protection
  gap.
- Definition of Done: satisfied for this test-only money-impacting slice.
- Result Report: PMPLC-04 closed locally with focused validation evidence.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: not applicable for test-only contract
  lock.
- Real API/service path used: existing runtime orchestrator unit surface.
- Endpoint and client contract match: not applicable.
- DB schema and migrations verified: not applicable.
- Loading state verified: not applicable.
- Error state verified: not applicable.
- Refresh/restart behavior verified: not applicable.
- Regression check performed: focused runtime orchestrator suite.

## Product / Discovery Evidence
- Problem validated: yes.
- User or operator affected: LIVE operators using DCA-first strategies.
- Existing workaround or pain: no explicit regression barrier for current
  close-order payload shape.
- Smallest useful slice: test-only contract lock.
- Success metric or signal: future changes cannot silently add hard stop/take
  profit payload fields to runtime LIVE close orders without failing tests.
- Feature flag, staged rollout, or disable path: not applicable.
- Post-launch feedback or metric check: no.

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not
  applicable.
- Critical user journey: runtime LIVE position close.
- SLI: not applicable for test-only slice.
- SLO: not applicable.
- Error budget posture: not applicable.
- Health/readiness check: not applicable.
- Logs, dashboard, or alert route: not changed.
- Smoke command or manual smoke: focused unit suite.
- Rollback or disable path: revert test-only change.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable.
- Data classification: no data path changed.
- Trust boundaries: app runtime to exchange boundary reviewed.
- Permission or ownership checks: not changed.
- Abuse cases: silent venue hard stop/take-profit drift before DCA-first
  semantics are made explicit.
- Secret handling: unchanged.
- Security tests or scans: not applicable.
- Fail-closed behavior: current test fails if hidden hard protection fields are
  added to LIVE close payload.
- Residual risk: exchange-backed protection is not implemented in this slice.

## AI Testing Evidence
Not applicable.
