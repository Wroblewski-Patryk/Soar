# Task

## Header
- ID: PMPLC-25
- Title: Cap exchange order-fill rows to local fill progress
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-24
- Priority: P0
- Iteration: 25
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Order-level exchange fill progress is now capped to local order quantity, but
the persisted `OrderFill` row still uses raw `lastFilledQuantity` from the
exchange event. A malformed or over-reported last-fill quantity can therefore
leave child fill truth above the locally accepted order fill progress.

## Goal
Ensure exchange `OrderFill` rows record only the positive local fill progress
introduced by the event, capped by local order truth.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Success Signal
- User or operator problem: order fill rows cannot overstate real accepted
  local fill quantity even if the exchange event over-reports `lastFilledQuantity`.
- Expected product or reliability outcome: order, order-fill, trade, and
  position quantities remain aligned under over-reporting.
- How success will be observed: DB-backed exchange-event regression and focused
  runtime/order pack pass.
- Post-launch learning needed: no

## Deliverable For This Stage
One event-service quantity guard plus DB-backed regression and source-of-truth
updates.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Add a private service helper that resolves recordable last-fill quantity
   from local previous filled quantity, current capped filled quantity, order
   quantity, and exchange `lastFilledQuantity`.
2. Use the resolved quantity for `ensureOrderFillRecord`.
3. Skip creating an `OrderFill` row when the event introduces no positive local
   fill progress.
4. Add a DB-backed regression for over-reported cumulative and last-fill
   quantities on an opening order.
5. Run DB-backed and focused runtime/order validation.

## Acceptance Criteria
- Over-reported `lastFilledQuantity` is capped to local event fill progress.
- Duplicate or stale events with no local fill progress do not create new fill
  rows solely because `lastFilledQuantity` is positive.
- Existing order lifecycle behavior remains unchanged.
- Validation includes DB-backed event service coverage.

## Definition of Done
- [x] DB-backed exchange-event suite passes.
- [x] Focused runtime/order pack passes.
- [x] API typecheck, guardrails, lint, and diff check pass.
- [x] Source-of-truth files are updated.
- [x] No temporary bypass or duplicate lifecycle path is introduced.

## Stage Exit Criteria
- [x] The output matches the declared `Current Stage`.
- [x] Work from later stages was not mixed in without explicit approval.
- [x] Risks and assumptions for this stage are stated clearly.

## Forbidden
- new systems without approval
- duplicated logic or parallel implementations of the same contract
- temporary bypasses, hacks, or workaround-only paths
- architecture changes without explicit approval
- implicit stage skipping

## Validation Evidence
- Tests:
  - PASS `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.service.test.ts --run` (`9/9`)
  - PASS `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run` (`82/82`)
  - PASS `pnpm --filter api run typecheck`
  - PASS `pnpm run quality:guardrails`
  - PASS `pnpm run lint`
  - PASS `git diff --check` with CRLF warnings only
- Manual checks:
  - PASS `Test-NetConnection -ComputerName localhost -Port 5432`
  - PASS `docker ps` shows `cryptosparrow-postgres-1` running on `5432`
- Screenshots/logs: not applicable
- High-risk checks: DB-backed regression proves over-reported last-fill quantity
  is capped in `OrderFill`, position, trade, and order quantities.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/position-management-pnl-lifecycle-contract.md`
  - `DEFINITION_OF_DONE.md`
  - `INTEGRATION_CHECKLIST.md`
  - `NO_TEMPORARY_SOLUTIONS.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none expected

## UX/UI Evidence
- Design source type: not applicable

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert the service helper and DB-backed regression.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `OrderFill.quantity` can still use raw exchange last-fill quantity
  even when order-level filled quantity is capped.
- Gaps: DB-backed event tests do not assert child fill-row cap parity under
  exchange over-reporting.
- Inconsistencies: order/trade/position quantities are bounded, but fill-row
  quantity can exceed accepted local progress.
- Architecture constraints: persisted money-impacting records must not exceed
  local order quantity truth.

### 2. Select One Priority Task
- Selected task: cap exchange `OrderFill` rows to local fill progress.
- Priority rationale: iteration 25 is TESTER mode and this is an adversarial
  over-reporting case in the money-impacting event path.
- Why other candidates were deferred: broader lifecycle repair work would
  exceed one small, reversible task.

### 3. Plan Implementation
- Files or surfaces to modify: event service, DB-backed event test, planning
  and context docs.
- Logic: compute previous accepted fill, current accepted fill, and record only
  the positive delta capped by exchange last-fill quantity.
- Edge cases: over-reported last fill, duplicate event with no progress, stale
  event with no progress, normal partial/full fill.

### 4. Execute Implementation
- Implementation notes: added private
  `resolveRecordableExchangeLastFillQuantity` and used it for
  `ensureOrderFillRecord` so child fill rows record only positive accepted local
  fill progress.

### 5. Verify and Test
- Validation performed: DB-backed event suite, focused runtime/order pack, API
  typecheck, repository guardrails, lint, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: leave raw exchange fill row untouched; rejected
  because child money records would disagree with accepted order truth.
- Technical debt introduced: no
- Scalability assessment: private service helper keeps the guard local to fill
  persistence without changing exported contracts.
- Refinements made: added DB-backed assertion that order, fill, position, and
  trade quantities all remain capped under over-reporting.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - this task contract
- Context updated:
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- Learning journal updated: not applicable

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
Postgres availability was checked before DB-backed validation using the
learning journal guardrail from `2026-05-06`.

## Production-Grade Required Contract
- `Goal`: cap persisted exchange `OrderFill` rows to accepted local fill
  progress.
- `Scope`: event service, DB-backed event test, planning/context docs.
- `Implementation Plan`: listed above.
- `Acceptance Criteria`: listed above.
- `Definition of Done`: uses `DEFINITION_OF_DONE.md` evidence.
- `Result Report`: completed below.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes, DB-backed exchange event service path
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: yes, DB-backed event-service suite passes.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: LIVE/PAPER runtime operators and downstream
  reporting using fill rows.
- Existing workaround or pain: no safe workaround; bad external quantity could
  persist into child fill rows.
- Smallest useful slice: service helper plus DB-backed regression.
- Success metric or signal: validation pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: no, not
  applicable for this event-service guard.
- Critical user journey: exchange event order lifecycle reconciliation.
- SLI: order-fill quantity does not exceed accepted local event fill progress.
- SLO: not applicable.
- Error budget posture: not applicable
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not applicable
- Smoke command or manual smoke: focused tests passed.
- Rollback or disable path: revert this service helper change.

## AI Testing Evidence
Not applicable; no AI feature touched.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: no, not applicable
  for this event-service guard.
- Data classification: money-impacting order and fill quantity data.
- Trust boundaries: external exchange event payload to local persisted records.
- Permission or ownership checks: unchanged.
- Abuse cases: over-reported last-fill quantity must not inflate fill rows.
- Secret handling: no secrets touched.
- Security tests or scans: not applicable.
- Fail-closed behavior: DB-backed event-service tests passed.
- Residual risk: none expected.

## Result Report
- Task summary: exchange order-trade events now cap persisted `OrderFill`
  quantity to accepted local fill progress instead of trusting raw exchange
  `lastFilledQuantity`.
- Files changed:
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `docs/planning/position-management-exchange-orderfill-quantity-cap-task-2026-05-06.md`
- How tested: DB-backed exchange-event suite (`9/9`), focused runtime/order pack
  (`82/82`), API typecheck, guardrails, lint, and diff check.
- What is incomplete: nothing known for this slice.
- Next steps: continue with the next one-task runtime/order safety slice.
- Decisions made: no architecture decision required; applied the existing
  Postgres verification guardrail before DB-backed validation.
