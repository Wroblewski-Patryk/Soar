# Task

## Header
- ID: PMPLC-26
- Title: Scale exchange fill fee to accepted local fill quantity
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-25
- Priority: P0
- Iteration: 26
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`PMPLC-25` capped persisted `OrderFill.quantity` to accepted local fill
progress. The same exchange event can still carry a raw fee value associated
with the over-reported last-fill quantity, which can inflate order, fill-row,
trade, or close-PnL fee truth relative to locally accepted quantity.

## Goal
Scale finite exchange event fee values to the accepted local last-fill quantity
when the event last-fill quantity is capped.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Success Signal
- User or operator problem: over-reported exchange last-fill quantity cannot
  also overstate local fee cost after quantity cap.
- Expected product or reliability outcome: accepted local quantity and fee stay
  proportional in order, fill-row, trade, and PnL records.
- How success will be observed: DB-backed event regression and focused
  runtime/order pack pass.
- Post-launch learning needed: no

## Deliverable For This Stage
One service fee-normalization guard plus DB-backed regression evidence and
source-of-truth updates.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Add a private helper to scale finite exchange event fee by
   `recordableLastFillQuantity / lastFillQuantity` when quantity was capped.
2. Use the scaled event fee for order update, `OrderFill.feeCost`, and created
   trade fee.
3. Keep uncapped and missing-quantity fee behavior unchanged.
4. Extend the DB-backed over-report regression to assert scaled fee parity.
5. Run DB-backed and focused runtime/order validation.

## Acceptance Criteria
- Capped last-fill quantity scales finite fee cost proportionally.
- Normal uncapped event fee behavior is unchanged.
- DB-backed event test proves order, fill-row, position, and trade parity under
  over-reporting.
- No new fee path bypasses existing exchange-event service ownership.

## Definition of Done
- [x] DB-backed exchange-event suite passes.
- [x] Focused runtime/order pack passes.
- [x] API typecheck, guardrails, lint, and diff check pass.
- [x] Source-of-truth files are updated.
- [x] No temporary bypass or duplicate fee path is introduced.

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
  - FAIL then PASS `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.service.test.ts --run`; first run exposed an incorrect expected fee value, final run passed (`9/9`)
  - PASS `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run` (`82/82`)
  - PASS `pnpm --filter api run typecheck`
  - PASS `pnpm run quality:guardrails`
  - PASS `pnpm run lint`
  - PASS `git diff --check` with CRLF warnings only
- Manual checks:
  - PASS `Test-NetConnection -ComputerName localhost -Port 5432`
  - PASS `docker ps` showed `cryptosparrow-postgres-1` running on `5432`
- Screenshots/logs: not applicable
- High-risk checks: DB-backed regression proves order, fill-row, and trade fee
  scale to accepted local quantity under over-reported last-fill input.

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
- Rollback note: revert this service helper and regression.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: capped fill quantities can still keep raw over-reported exchange fee.
- Gaps: DB-backed over-report test did not assert fee parity.
- Inconsistencies: accepted local quantity can be capped while fee remains
  calculated from raw exchange last-fill quantity.
- Architecture constraints: money-impacting records must reflect accepted local
  lifecycle truth, not malformed external over-reporting.

### 2. Select One Priority Task
- Selected task: scale exchange fill fee to accepted local fill quantity.
- Priority rationale: small BUILDER-mode correctness fix after PMPLC-25.
- Why other candidates were deferred: broader fee model changes would exceed
  one tiny event-service slice.

### 3. Plan Implementation
- Files or surfaces to modify: event service, DB-backed event test,
  planning/context docs.
- Logic: scale finite event fee only when both raw last-fill quantity and
  accepted local last-fill quantity are positive and accepted quantity is below
  raw quantity.
- Edge cases: normal uncapped fill, missing fee, zero fee, negative rebates,
  capped over-report.

### 4. Execute Implementation
- Implementation notes: added private `resolveRecordableExchangeFee`, used the
  scaled event fee for order update, `OrderFill.feeCost`, and trade fee, and
  extended the over-report DB-backed regression.

### 5. Verify and Test
- Validation performed: DB-backed event suite, focused runtime/order pack, API
  typecheck, repository guardrails, lint, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: cap only fill-row fee; rejected because order and
  trade fee would still diverge from accepted local quantity.
- Technical debt introduced: no
- Scalability assessment: private service helper keeps the fee normalization in
  the exchange-event persistence boundary.
- Refinements made: corrected the test expectation after the first DB-backed
  run showed the proportional fee should be `0.016` for `2 / 2.5 * 0.02`.

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
- `Goal`: scale finite exchange event fee to accepted local fill quantity when
  last-fill quantity is capped.
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
- User or operator affected: LIVE/PAPER runtime operators and downstream PnL
  reporting.
- Existing workaround or pain: no safe workaround; raw fee could persist after
  quantity cap.
- Smallest useful slice: private fee scaling helper plus DB-backed regression.
- Success metric or signal: validation pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: no, not
  applicable for this event-service guard.
- Critical user journey: exchange event order lifecycle reconciliation.
- SLI: fee cost is proportional to accepted local last-fill quantity.
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
- Data classification: money-impacting order, fill, trade, and fee data.
- Trust boundaries: external exchange event payload to local persisted records.
- Permission or ownership checks: unchanged.
- Abuse cases: over-reported last-fill quantity must not inflate fee records.
- Secret handling: no secrets touched.
- Security tests or scans: not applicable.
- Fail-closed behavior: DB-backed event-service tests passed.
- Residual risk: none expected.

## Result Report
- Task summary: exchange event fee is now scaled to accepted local last-fill
  quantity when exchange last-fill quantity is capped.
- Files changed:
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `docs/planning/position-management-exchange-fill-fee-cap-task-2026-05-06.md`
- How tested: DB-backed exchange-event suite (`9/9`), focused runtime/order pack
  (`82/82`), API typecheck, guardrails, lint, and diff check.
- What is incomplete: nothing known for this slice.
- Next steps: continue with the next one-task runtime/order safety slice.
- Decisions made: no architecture decision required; applied the existing
  Postgres verification guardrail before DB-backed validation.
