# Task

## Header
- ID: V1MONEY-01
- Title: Build V1 money local and paper-safe scenario matrix
- Task Type: release
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: LIVEIMPORT-03A
- Priority: P0
- Iteration: 50
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`V1MONEY-A` in the readiness audit requires a deterministic manual/paper/live
safe scenario matrix before live-money proof. Because this application manages
money, the next V1 step must separate local proof, paper-safe proof, read-only
production proof, and explicit live mutation approval.

## Goal
Create and validate the V1 money-engine scenario matrix for order types,
pre-trade, lifetime, futures price source, close, DCA-first, TP, SL, and TSL
rows.

## Scope
- Local code/test discovery for V1 money-engine rows.
- Focused local validation for order types, pre-trade, lifetime, lifecycle
  mark-price, and close parity.
- Operations scenario matrix.
- Planning/context source-of-truth updates.

## Success Signal
- User or operator problem: V1 money proof needs a safe, reproducible execution
  plan instead of broad live experimentation.
- Expected product or reliability outcome: local money-engine foundations are
  verified, and the remaining proof rows are safely classified.
- How success will be observed: focused tests pass and matrix states the next
  safe evidence slice.
- Post-launch learning needed: no

## Deliverable For This Stage
Verification-stage matrix plus fresh local evidence.

## Constraints
- Do not run live-money mutations.
- Do not mark production-only rows complete from local tests.
- Do not introduce new runtime behavior.
- Do not duplicate architecture or execution logic.

## Acceptance Criteria
- Scenario matrix covers all `V1MONEY-A` rows.
- Local validation covers order types, pre-trade, lifetime, mark-price, and
  close parity.
- Remaining production/paper-safe proof gaps are explicit.
- Canonical planning/context docs are synchronized.

## Definition of Done
- [x] `V1MONEY-A` scenario matrix exists.
- [x] Focused local money-engine validation passes.
- [x] Remaining live/paper/read-only proof gaps are not overstated.
- [x] Source-of-truth docs/context are updated.
- [x] Repository guardrails pass.

## Validation Evidence
- Tests:
  - `pnpm --filter api run test -- src/modules/engine/orderTypes.service.test.ts src/modules/engine/preTrade.service.test.ts src/modules/engine/preTrade.e2e.test.ts src/modules/engine/runtimePositionLifetime.service.test.ts src/modules/engine/runtimeOrderLifetime.service.test.ts src/modules/engine/strategyLifetimePolicy.test.ts src/modules/engine/runtimeLifecycleMarkPrice.service.test.ts src/modules/engine/lifecycleCloseParity.golden.test.ts --run --sequence.concurrent=false --pool forks --poolOptions.forks.singleFork=true` PASS (`49/49`).
  - `pnpm run quality:guardrails` PASS.
  - `git diff --check` PASS.
- Manual checks:
  - Reviewed readiness rows for `V1MONEY-A`.
  - Classified each row as local-covered, paper-safe, read-only production, or
    explicit live-operator evidence.
- Screenshots/logs:
  - `docs/operations/v1money-local-paper-safe-scenario-matrix-2026-05-07.md`
- High-risk checks:
  - No secrets, auth tokens, live orders, deploys, restore actions, or database
    mutations against production were used.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/operations/v1-function-implementation-readiness-audit-2026-05-01.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
  - `docs/architecture/architecture-source-of-truth.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not required

## Deployment / Ops Evidence
- Deploy impact: none
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: no runtime change.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: V1 money rows had a recommended matrix step but no current
  per-scenario evidence routing after the latest production/public refresh.
- Gaps: live close, DCA-first, TP, SL, TSL, futures price source, and pre-trade
  production evidence still require paper-safe/authenticated/operator action.
- Inconsistencies: none in implementation; the gap is evidence routing.
- Architecture constraints: live-money proof must be fail-closed, auditable,
  and operator-approved.

### 2. Select One Priority Task
- Selected task: V1MONEY-01 scenario matrix and local verification.
- Priority rationale: tester iteration 50 should reduce V1 uncertainty without
  taking unsafe live actions.
- Why other candidates were deferred: `LIVEIMPORT-03`, protected manual matrix,
  restore drill, and stage restoration require auth or infrastructure access
  not available in this session.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `docs/operations/v1money-local-paper-safe-scenario-matrix-2026-05-07.md`
  - this task evidence
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
- Logic: discover tests, run local focused pack, then classify evidence gaps.
- Edge cases: local PASS must not be promoted into production PASS.

### 4. Execute Implementation
- Implementation notes: docs/evidence only; no runtime code was changed.

### 5. Verify and Test
- Validation performed: focused API money-engine pack, guardrails, and diff
  check.
- Result: local money-engine foundation passed; remaining rows require
  authenticated or paper-safe execution proof.

### 6. Self-Review
- Simpler option considered: only run tests. Rejected because V1 needs a
  reusable scenario matrix, not an isolated command result.
- Technical debt introduced: no
- Scalability assessment: the matrix gives a repeatable route for the remaining
  live-money evidence without expanding scope.
- Refinements made: kept live-close/TP/SL/TSL rows open instead of overstating
  local evidence.

### 7. Update Documentation and Knowledge
- Docs updated:
  - this task evidence
  - `docs/operations/v1money-local-paper-safe-scenario-matrix-2026-05-07.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
- Context updated:
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
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

## Result Report
- Task summary: created the V1 money local/paper-safe scenario matrix and
  verified the local order-type/pre-trade/lifetime/mark-price foundation.
- Files changed: planning/context/operations docs only.
- How tested: focused API money-engine pack (`49/49`) plus guardrails and diff
  check.
- What is incomplete: authenticated/paper-safe production evidence for
  pre-trade, futures price source, live close, DCA-first, TP, SL, and TSL.
- Next steps: execute the next authenticated read-only or paper-safe evidence
  pass from the matrix.
