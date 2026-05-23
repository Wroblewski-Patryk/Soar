# Task

## Header
- ID: PMPLC-13
- Title: Keep exchange-event underfilled close from closing full position
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-12
- Priority: P0
- Iteration: 13
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
After runtime close orchestration was made fail-closed for underfilled close
orders, the exchange user-data reconciliation path still had a separate
close-on-`FILLED` branch. A venue event can report `FILLED` while the
cumulative fill quantity is below the local open position quantity; closing the
whole local position in that case would hide residual exposure.

## Goal
Apply the same underfilled-close safety to exchange order-trade update
reconciliation.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.helpers.test.ts`
- Planning/context documentation for the completed slice.

## Success Signal
- User or operator problem: exchange event reconciliation must not mark a local
  position closed while the reported close fill is smaller than local quantity.
- Expected product or reliability outcome: residual exposure stays visible
  until full close quantity is confirmed or account-update reconciliation
  resolves it.
- How success will be observed: helper regression proves underfilled close is
  incomplete and service branch skips full close settlement.
- Post-launch learning needed: no

## Deliverable For This Stage
Verified code and documentation update for the completed fix slice.

## Constraints
- Do not introduce partial-close accounting in this tiny slice.
- Do not add a new reconciliation subsystem.
- Preserve existing full-close behavior when cumulative fill covers local
  position quantity.
- Avoid relying on DB-backed tests while local Postgres is unavailable.

## Implementation Plan
1. Add an exchange-event close fill completeness helper with tolerance.
2. In the exchange close branch, return after order update when fill quantity
   is below local position quantity.
3. Do not update the position to `CLOSED` or create a close trade for
   underfilled close events.
4. Add no-DB helper regression coverage for underfill and rounding tolerance.
5. Run available focused tests and quality gates.

## Acceptance Criteria
- Underfilled exchange close event does not enter full close settlement branch.
- Full close quantity remains eligible for normal settlement.
- Helper regression covers underfill and small rounding tolerance.
- Available runtime/order tests, typecheck, guardrails, lint, and diff check
  pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations satisfied for this tiny exchange
  reconciliation safety slice.
- [x] Focused no-DB regression tests pass.
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
  - `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run` PASS (`56/56`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run lint` PASS.
  - `git diff --check` PASS with CRLF warnings only.
- Blocked validation:
  - Full `src/modules/orders/orders.exchangeEvents.service.test.ts` remains
    blocked by unavailable local Postgres at `localhost:5432`; this was
    observed in PMPLC-12 when the suite failed during cleanup before
    assertions.
- Manual checks: reviewed exchange close branch to confirm underfilled events
  return before position `CLOSED` update and close trade creation.
- Screenshots/logs: not applicable.
- High-risk checks: residual exposure fail-closed behavior covered by helper
  regression and branch review.

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
- Rollback note: revert this slice to restore previous exchange-event
  close-on-filled behavior.
- Observability or alerting impact: none in this tiny slice.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: exchange order-trade update close branch did not check fill quantity
  against local position quantity before closing the position.
- Gaps: DB-backed e2e coverage exists but could not run without local Postgres;
  no no-DB regression covered the completeness predicate.
- Inconsistencies: orchestrator path was fail-closed after PMPLC-12 while
  exchange-event path still closed on status alone.
- Architecture constraints: live order/position reconciliation must not hide
  remaining exchange exposure.

### 2. Select One Priority Task
- Selected task: fail closed on underfilled exchange close events.
- Priority rationale: prevents local closed state and close trade creation
  while residual venue quantity may remain.
- Why other candidates were deferred: full partial-close accounting remains a
  larger future vertical slice.

### 3. Plan Implementation
- Files or surfaces to modify: exchange-events service, no-DB helper test,
  planning/context docs.
- Logic: compare cumulative close fill quantity to local position quantity
  before close settlement.
- Edge cases: underfill, exact fill, tiny rounding tolerance.

### 4. Execute Implementation
- Implementation notes: kept behavior local to existing exchange-event
  reconciliation and returned the applied order update without closing the
  position when incomplete.

### 5. Verify and Test
- Validation performed: no-DB helper regression, orchestrator/runtime
  automation suites, API typecheck, guardrails, lint, diff check.
- Result: PASS for available validations; DB-backed e2e remains blocked by
  unavailable local Postgres.

### 6. Self-Review
- Simpler option considered: importing the orchestrator helper would create an
  awkward orders-to-engine dependency, so the exchange-event predicate stays
  local and tiny.
- Technical debt introduced: no
- Scalability assessment: predicate is explicit and can be reused by a future
  partial-close vertical slice if approved.
- Refinements made: added a small no-DB regression to keep this safety check
  verifiable without local database availability.

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
- Regression check performed: yes, no-DB helper regression plus branch review.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: LIVE runtime operator.
- Existing workaround or pain: underfilled exchange close could hide residual
  exposure.
- Smallest useful slice: keep incomplete exchange close from full local close.
- Success metric or signal: regression and focused suites pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: exchange event close reconciliation.
- SLI: exchange close safety test pass rate.
- SLO: relevant regression suites pass before release.
- Error budget posture: healthy for covered scope; DB e2e validation pending
  when local Postgres is available.
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not changed in this tiny slice.
- Smoke command or manual smoke: focused vitest suites.
- Rollback or disable path: revert this slice.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: exchange execution and position data.
- Trust boundaries: exchange user-data stream to local reconciliation.
- Permission or ownership checks: existing order/user/wallet/bot scope checks
  retained.
- Abuse cases: incomplete or malformed fill data must not close local state.
- Secret handling: no changes.
- Security tests or scans: not applicable.
- Fail-closed behavior: incomplete close fill returns before full settlement.
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
- Task summary: Exchange order-trade close reconciliation now refuses to close
  the local position when cumulative close fill quantity is below local open
  quantity.
- Files changed:
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.helpers.test.ts`
  - `history/tasks/position-management-exchange-event-underfilled-close-task-2026-05-06.md`
- How tested: no-DB helper regression, focused runtime suites, API typecheck,
  guardrails, lint, and diff check.
- What is incomplete: DB-backed exchange-events service suite should be rerun
  when local Postgres is available.
- Next steps: continue with the next smallest money-impacting v1 gap from the
  active PMPLC queue.
- Decisions made: incomplete exchange close fill does not perform full local
  close settlement in this slice.
