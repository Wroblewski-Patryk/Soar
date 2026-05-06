# Task

## Header
- ID: PMPLC-10
- Title: Reserve entry margin in tracked replay balance
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-06, PMPLC-09
- Priority: P0
- Iteration: 10
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Single-symbol backtest replay uses tracked wallet balance to decide whether DCA
adds are fundable. After DCA fill-price parity, the remaining issue was that
tracked balance reserved DCA margin but not entry margin, and close settlement
did not return reserved margin to the tracked account.

## Goal
Make tracked replay balance behave like free cash plus reserved margin for the
single-symbol replay lifecycle.

## Scope
- `apps/api/src/modules/backtests/backtestReplayCore.ts`
- `apps/api/src/modules/backtests/backtestReplayCore.test.ts`
- Planning/context documentation for the completed slice.

## Success Signal
- User or operator problem: replay must not allow DCA from funds already
  reserved by the entry position.
- Expected product or reliability outcome: tracked replay affordability stays
  aligned with portfolio accounting and fail-closed money handling.
- How success will be observed: regression proves entry margin is reserved
  before DCA affordability is checked.
- Post-launch learning needed: no

## Deliverable For This Stage
Verified code and documentation update for the completed fix slice.

## Constraints
- Use existing replay accounting structure.
- Do not add a new wallet or ledger subsystem.
- Do not alter live execution behavior.
- Keep the slice limited to tracked replay balance semantics.

## Implementation Plan
1. Add `marginUsed` to the single-symbol open replay position state.
2. Reserve entry margin when opening a tracked-balance replay position.
3. Add DCA margin to `marginUsed` when a DCA add executes.
4. Return reserved margin during close/final settlement and bound losses
   against free cash plus returned margin.
5. Add a regression where entry reserve makes a DCA add unaffordable.
6. Run focused tests and repository quality gates.

## Acceptance Criteria
- Entry margin is subtracted from finite tracked balance.
- DCA affordability checks use remaining free cash.
- Close/final settlement returns reserved margin to tracked balance.
- Failed entry margin checks do not increment trade sequence.
- Focused regression and quality gates pass.

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
  - `pnpm --filter api exec vitest run src/modules/backtests/backtestReplayCore.test.ts --run` PASS (`29/29`).
  - `pnpm --filter api exec vitest run src/modules/backtests/backtestReplayCore.test.ts src/modules/backtests/backtests.contract-remediation.test.ts src/modules/engine/positionManagement.service.test.ts --run` PASS (`61/61`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run lint` PASS.
  - `git diff --check` PASS with CRLF warnings only.
- Manual checks: reviewed focused diff for accounting symmetry and sequence
  correctness.
- Screenshots/logs: not applicable.
- High-risk checks: money-impacting tracked-balance reserve behavior covered
  by regression.

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
- Rollback note: revert this slice to restore previous replay-only tracked
  balance behavior.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: single-symbol replay reserved DCA margin but not entry margin.
- Gaps: close settlement did not return reserved margin to tracked balance.
- Inconsistencies: tracked DCA affordability could see already-reserved entry
  funds as available.
- Architecture constraints: money-impacting lifecycle simulation must fail
  closed and preserve accounting parity.

### 2. Select One Priority Task
- Selected task: reserve entry margin and return reserved margin in tracked
  replay balance.
- Priority rationale: replay affordability affects DCA execution and operator
  confidence in backtest results.
- Why other candidates were deferred: live protection-order work remains a
  larger separate vertical slice.

### 3. Plan Implementation
- Files or surfaces to modify: replay core, replay core tests, planning/context
  docs.
- Logic: maintain `marginUsed` on the open replay position and settle with
  free cash plus returned margin.
- Edge cases: insufficient entry funds, insufficient DCA funds after entry,
  DCA margin accumulation, isolated liquidation, final-candle close.

### 4. Execute Implementation
- Implementation notes: reused existing settlement helper and extended it with
  returned margin instead of adding a new ledger path.

### 5. Verify and Test
- Validation performed: focused replay suite, wider backtest/runtime suite,
  API typecheck, guardrails, lint, diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only subtracting entry margin would leave close
  settlement wrong, so the slice also returns reserved margin on settlement.
- Technical debt introduced: no
- Scalability assessment: local state remains simple and mirrors portfolio
  replay semantics.
- Refinements made: trade sequence now increments only after entry margin is
  successfully reserved.

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
- Existing workaround or pain: replay could fund DCA from margin already
  reserved by the entry.
- Smallest useful slice: reserve entry margin and return reserved margin in
  tracked replay.
- Success metric or signal: regression and focused suites pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: strategy backtest and replay lifecycle analysis.
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
- Abuse cases: false replay DCA execution can mislead operator decisions.
- Secret handling: no changes.
- Security tests or scans: not applicable.
- Fail-closed behavior: insufficient entry or DCA funds are skipped.
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
- Task summary: Single-symbol replay now reserves entry margin, accumulates
  DCA margin, and returns reserved margin during settlement when finite tracked
  balance is enabled.
- Files changed:
  - `apps/api/src/modules/backtests/backtestReplayCore.ts`
  - `apps/api/src/modules/backtests/backtestReplayCore.test.ts`
  - `docs/planning/position-management-replay-tracked-balance-reserve-task-2026-05-06.md`
- How tested: focused and widened vitest suites, API typecheck, guardrails,
  lint, and diff check.
- What is incomplete: no known incomplete work in this slice.
- Next steps: continue with the next smallest money-impacting v1 gap from the
  active PMPLC queue.
- Decisions made: tracked replay balance represents free cash while open
  position margin is held in `marginUsed`.
