# Task

## Header
- ID: PMPLC-12
- Title: Keep underfilled runtime close from closing full position
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-04, PMPLC-11
- Priority: P0
- Iteration: 12
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime close orchestration marks a position closed after a filled close order.
If an adapter reports `FILLED` while `filledQuantity` is still below the local
open position quantity, closing the whole position would hide remaining
exchange exposure and corrupt realized PnL/operator state.

## Goal
Fail closed on underfilled runtime close confirmations by keeping the close in
submitted/waiting state instead of closing the local position.

## Scope
- `apps/api/src/modules/engine/executionOrchestrator.service.ts`
- `apps/api/src/modules/engine/executionOrchestrator.helpers.ts`
- `apps/api/src/modules/engine/executionOrchestrator.service.test.ts`
- Planning/context documentation for the completed slice.

## Success Signal
- User or operator problem: local state must not say a position is closed while
  a residual quantity can still be open on the venue.
- Expected product or reliability outcome: runtime close settlement fails
  closed when close fill quantity is incomplete.
- How success will be observed: regression proves an underfilled `FILLED`
  close order does not call `closePosition` or create a close trade.
- Post-launch learning needed: no

## Deliverable For This Stage
Verified code and documentation update for the completed fix slice.

## Constraints
- Do not add partial-position settlement as a new subsystem.
- Do not close a position until close fill quantity covers local open quantity.
- Preserve existing submitted/waiting fill behavior.
- Keep `executionOrchestrator.service.ts` within guardrail line budget.

## Implementation Plan
1. Add a close quantity completeness check with a small numeric tolerance.
2. If a close order is underfilled, write a submitted/waiting event, mark
   dedupe submitted, and return `submitted`.
3. Do not call `closePosition` or create a close trade for incomplete fills.
4. Extract existing execution helper functions to keep the orchestrator below
   the production monolith guardrail.
5. Add focused regression coverage.
6. Run focused runtime tests, typecheck, guardrails, lint, and diff check.

## Acceptance Criteria
- Underfilled close confirmation returns `submitted`.
- Underfilled close confirmation does not close the position.
- Underfilled close confirmation does not create a close trade.
- Dedupe remains submitted so later reconciliation/fill confirmation can finish
  the lifecycle.
- Guardrails pass after the helper extraction.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations satisfied for this tiny runtime
  close-safety slice.
- [x] Focused runtime tests pass.
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
  - `pnpm --filter api exec vitest run src/modules/engine/executionOrchestrator.service.test.ts --run` PASS (`18/18`).
  - `pnpm --filter api exec vitest run src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run` PASS (`54/54`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run quality:guardrails` PASS after helper extraction.
  - `pnpm run lint` PASS.
  - `git diff --check` PASS with CRLF warnings only.
- Blocked validation:
  - `pnpm --filter api exec vitest run src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts --run` could not complete because local Postgres was unavailable at `localhost:5432`; the two non-DB suites in that command passed (`54/54`) and the DB-backed exchange-events suite failed during cleanup before exercising assertions.
- Manual checks: reviewed focused diff for close-settlement safety, dedupe
  behavior, and guardrail compliance.
- Screenshots/logs: not applicable.
- High-risk checks: money-impacting residual exposure state covered by
  orchestrator regression.

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/reference/position-management-pnl-lifecycle-contract.md`,
  `docs/architecture/reference/assistant-runtime-contract.md`.
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
- Rollback note: revert this slice to restore previous close-on-filled behavior.
- Observability or alerting impact: underfilled close writes an existing
  submitted/waiting runtime event.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: a `FILLED` close order with lower `filledQuantity` could close the
  entire local position.
- Gaps: no regression covered residual quantity after a supposedly filled close.
- Inconsistencies: submitted/partial order statuses were safe, but underfilled
  filled payloads were not.
- Architecture constraints: live order/position reconciliation must not hide
  remaining exchange exposure.

### 2. Select One Priority Task
- Selected task: fail closed on underfilled runtime close confirmations.
- Priority rationale: prevents local closed state and realized PnL from
  diverging from possible venue exposure.
- Why other candidates were deferred: full partial close settlement is larger
  and should be a separate approved vertical slice.

### 3. Plan Implementation
- Files or surfaces to modify: execution orchestrator, extracted helper,
  orchestrator tests, planning/context docs.
- Logic: compare close fill quantity to local open quantity before settlement.
- Edge cases: small numeric tolerance, filled order with partial quantity,
  dedupe submitted state, waiting-fill event.

### 4. Execute Implementation
- Implementation notes: reused the existing submitted/waiting path semantics
  rather than introducing partial-position accounting.

### 5. Verify and Test
- Validation performed: focused orchestrator suite, runtime automation suite,
  API typecheck, guardrails, lint, diff check.
- Result: PASS for available non-DB validations; DB-backed exchange-events
  suite blocked by unavailable local Postgres.

### 6. Self-Review
- Simpler option considered: computing realized PnL for the partial fill would
  require partial close state support and is outside this tiny slice.
- Technical debt introduced: no
- Scalability assessment: helper extraction keeps the service under guardrails
  and makes the close completeness check reusable.
- Refinements made: moved fee/price/quantity helpers into
  `executionOrchestrator.helpers.ts` to satisfy production monolith budget.

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
- DB schema and migrations verified: blocked by unavailable local Postgres for
  exchange-events e2e suite.
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: yes

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: LIVE/PAPER runtime operator.
- Existing workaround or pain: underfilled close could hide residual exposure.
- Smallest useful slice: keep incomplete close in waiting state.
- Success metric or signal: regression and focused suites pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: runtime protection close settlement.
- SLI: runtime close correctness test pass rate.
- SLO: relevant regression suites pass before release.
- Error budget posture: healthy for covered scope; DB e2e validation pending
  when local Postgres is available.
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: existing runtime submitted event.
- Smoke command or manual smoke: focused vitest suites.
- Rollback or disable path: revert this slice.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: trading execution and position data.
- Trust boundaries: exchange/order adapter to local runtime state.
- Permission or ownership checks: existing ownership checks retained.
- Abuse cases: malformed or incomplete fill payload must not close local state.
- Secret handling: no changes.
- Security tests or scans: not applicable.
- Fail-closed behavior: incomplete close fill remains submitted.
- Residual risk: full partial-close accounting remains a separate future slice.

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report
- Task summary: Runtime close orchestration now refuses to close the local
  position when close fill quantity is below the open position quantity.
- Files changed:
  - `apps/api/src/modules/engine/executionOrchestrator.service.ts`
  - `apps/api/src/modules/engine/executionOrchestrator.helpers.ts`
  - `apps/api/src/modules/engine/executionOrchestrator.service.test.ts`
  - `history/tasks/position-management-underfilled-close-fail-closed-task-2026-05-06.md`
- How tested: focused runtime vitest suites, API typecheck, guardrails, lint,
  and diff check; DB-backed exchange-events suite blocked by unavailable
  local Postgres.
- What is incomplete: DB-backed exchange-events validation should be rerun when
  Postgres is available.
- Next steps: continue with the next smallest money-impacting v1 gap from the
  active PMPLC queue.
- Decisions made: incomplete close fill remains submitted rather than creating
  partial close accounting in this slice.
