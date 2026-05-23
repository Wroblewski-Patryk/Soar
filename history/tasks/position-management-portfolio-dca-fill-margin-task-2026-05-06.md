# Task

## Header
- ID: PMPLC-09
- Title: Use DCA fill price for backtest reserve accounting
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-05, PMPLC-06, PMPLC-07, PMPLC-08
- Priority: P0
- Iteration: 9
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The canonical position-management lifecycle requires backtest replay to preserve
runtime-equivalent DCA state, affordability, and portfolio cash behavior. After
the selected-level and final-margin slices, one remaining drift was found:
backtest DCA state used the candle wick/probe price as the effective DCA fill,
but reserve and affordability accounting still used the candle close.

## Goal
Make DCA event price, DCA affordability checks, and portfolio reserved margin
use the same fill price selected by the DCA probe.

## Scope
- `apps/api/src/modules/backtests/backtestReplayCore.ts`
- `apps/api/src/modules/backtests/backtestPortfolioSimulation.service.ts`
- `apps/api/src/modules/backtests/backtests.contract-remediation.test.ts`
- Planning/context documentation for the completed slice.

## Success Signal
- User or operator problem: portfolio replay must not falsely block later
  symbol entries because an earlier DCA reserved margin at candle close while
  position state filled at a wick/probe price.
- Expected product or reliability outcome: DCA cash accounting stays internally
  consistent and closer to runtime semantics.
- How success will be observed: regression test proves a second symbol can open
  when DCA reserve is computed from the fill price.
- Post-launch learning needed: no

## Deliverable For This Stage
Verified code and documentation update for the completed fix slice.

## Constraints
- Use existing replay position-management helpers.
- Do not introduce a new fill model or parallel accounting path.
- Do not change live execution semantics.
- Keep the slice focused on DCA fill-price reserve parity.

## Implementation Plan
1. Reuse the existing DCA probe price selected by `resolveReplayDcaProbePrice`.
2. Compute estimated DCA margin from the probe result fill price.
3. Compute applied DCA margin and event price from the same fill price.
4. Add a portfolio regression where BTC DCA fill is at a wick and ETH must
   still have enough cash to open.
5. Run focused tests and repository quality gates.

## Acceptance Criteria
- DCA event price matches the probe/fill price.
- Single-symbol replay affordability uses the DCA fill price.
- Portfolio simulation reserve accounting uses the DCA fill price.
- Regression coverage catches false cash exhaustion after wick-priced DCA.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations satisfied for this tiny runtime
  accounting slice.
- [x] Focused backtest/runtime tests pass.
- [x] API typecheck passes.
- [x] Repository guardrails, lint, and diff check pass.
- [x] Source-of-truth docs are updated.

## Forbidden
- New systems without approval.
- Duplicated logic or parallel implementations of the same contract.
- Temporary bypasses, hacks, or workaround-only paths.
- Architecture changes without explicit approval.
- Implicit stage skipping.

## Validation Evidence
- Tests:
  - `pnpm --filter api exec vitest run src/modules/backtests/backtests.contract-remediation.test.ts --run` PASS (`10/10`).
  - `pnpm --filter api exec vitest run src/modules/backtests/backtests.contract-remediation.test.ts src/modules/backtests/backtestReplayCore.test.ts src/modules/engine/positionManagement.service.test.ts --run` PASS (`60/60`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run lint` PASS.
  - `git diff --check` PASS with CRLF warnings only.
- Manual checks: reviewed focused diff for architecture alignment, duplicated
  logic, and accounting consistency.
- Screenshots/logs: not applicable.
- High-risk checks: money-impacting DCA affordability and reserved-margin
  behavior covered by regression.

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/reference/position-management-pnl-lifecycle-contract.md`,
  `docs/architecture/reference/runtime-signal-merge-contract.md`.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this slice to restore previous replay-only accounting.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: DCA state used probe/fill price while affordability and reserve
  accounting used candle close.
- Gaps: portfolio cash contention could reject a later symbol entry even when
  fill-price accounting left enough cash.
- Inconsistencies: DCA event price also reported candle close.
- Architecture constraints: backtest replay must preserve runtime-equivalent
  DCA lifecycle and fail closed on insufficient funds.

### 2. Select One Priority Task
- Selected task: fix DCA fill-price accounting in replay reserve logic.
- Priority rationale: money-impacting replay cash behavior affects trust in
  strategy backtests.
- Why other candidates were deferred: live exchange protection work is larger
  and should remain a separate vertical slice.

### 3. Plan Implementation
- Files or surfaces to modify: replay core, portfolio simulation, contract
  remediation tests, planning/context docs.
- Logic: use the same DCA fill price for event, estimated margin, and applied
  margin.
- Edge cases: wick-priced DCA, selected DCA levels, tracked wallet balance,
  portfolio cash contention.

### 4. Execute Implementation
- Implementation notes: reused the existing DCA probe result and did not add a
  new fill model or accounting abstraction.

### 5. Verify and Test
- Validation performed: focused regression suite, wider replay/runtime DCA
  suite, API typecheck, guardrails, lint, diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: changing only the event price was insufficient
  because the accounting drift was in reserve and affordability.
- Technical debt introduced: no
- Scalability assessment: keeps accounting local to existing replay loop and
  preserves existing helper reuse.
- Refinements made: applied the same fix to single-symbol replay and
  interleaved portfolio replay.

### 7. Update Documentation and Knowledge
- Docs updated: this task doc, MVP queue, MVP execution plan.
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

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: yes

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: strategy/backtest operator.
- Existing workaround or pain: false portfolio cash exhaustion after wick DCA.
- Smallest useful slice: align DCA accounting price with DCA fill price.
- Success metric or signal: regression and focused suites pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: strategy backtest and portfolio replay analysis.
- SLI: replay correctness test pass rate.
- SLO: relevant regression suites pass before release.
- Error budget posture: healthy
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not applicable
- Smoke command or manual smoke: focused vitest suites.
- Rollback or disable path: revert this slice.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: trading simulation/accounting data.
- Trust boundaries: no new external boundary.
- Permission or ownership checks: not applicable.
- Abuse cases: false reserve exhaustion can mislead operator decisions.
- Secret handling: no changes.
- Security tests or scans: not applicable.
- Fail-closed behavior: unaffordable DCA remains skipped.
- Residual risk: live exchange-backed protection orders remain a separate
  future vertical slice.

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report
- Task summary: Backtest replay now uses DCA fill price consistently for DCA
  events, affordability, and reserved-margin accounting.
- Files changed:
  - `apps/api/src/modules/backtests/backtestReplayCore.ts`
  - `apps/api/src/modules/backtests/backtestPortfolioSimulation.service.ts`
  - `apps/api/src/modules/backtests/backtests.contract-remediation.test.ts`
  - `history/tasks/position-management-portfolio-dca-fill-margin-task-2026-05-06.md`
- How tested: focused and widened vitest suites, API typecheck, guardrails,
  lint, and diff check.
- What is incomplete: no known incomplete work in this slice.
- Next steps: continue with the next smallest money-impacting v1 gap from the
  active PMPLC queue.
- Decisions made: DCA reserve accounting must follow the selected DCA fill
  price instead of candle close.
