# Task

## Header
- ID: PMPLC-22
- Title: Keep exchange-event underfilled entries from applying full lifecycle
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-21
- Priority: P0
- Iteration: 22
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
LIVE order creation already compares requested quantity with exchange fill rows
and keeps below-request `FILLED` responses as `PARTIALLY_FILLED` without
immediate lifecycle. Exchange order-trade event reconciliation must preserve
the same fail-closed behavior when a later event reports a terminal exchange
status with known underfilled cumulative quantity.

## Goal
Prevent exchange `FILLED` events with known cumulative quantity below the local
order quantity from applying filled lifecycle or persisting full-filled order
truth.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.helpers.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.helpers.test.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Success Signal
- User or operator problem: a real exchange event cannot inflate local position
  lifecycle from a known underfilled entry or DCA order.
- Expected product or reliability outcome: LIVE/PAPER order truth remains
  consistent with requested-vs-filled quantity accounting.
- How success will be observed: no-DB helper regression and focused
  runtime/order suites pass.
- Post-launch learning needed: no

## Deliverable For This Stage
One fail-closed exchange-event fill quantity guard with tests and
source-of-truth updates.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it
- preserve existing duplicate/stale event idempotency

## Implementation Plan
1. Extend `resolveExchangeOrderFillProgress` with optional local requested
   quantity.
2. Cap incoming cumulative quantity to requested quantity when requested truth
   is available and prevent terminal lifecycle when known filled quantity is
   below requested quantity.
3. Pass `existingOrder.quantity` from exchange event reconciliation.
4. Add no-DB regressions for underfilled `FILLED` and over-reported cumulative
   quantity.
5. Run focused validation and update source-of-truth docs.

## Acceptance Criteria
- Known underfilled `FILLED` exchange events persist `PARTIALLY_FILLED`.
- Known underfilled `FILLED` exchange events do not apply filled lifecycle.
- Over-reported exchange cumulative quantity is capped to local requested
  quantity without reducing already-known local fill progress.
- Existing duplicate, stale, malformed, and terminal cancel semantics remain
  covered.

## Definition of Done
- [x] API typecheck passes.
- [x] Focused helper and runtime/order suites pass.
- [x] Guardrails, lint, and diff check pass.
- [x] Source-of-truth files are updated.
- [x] No temporary bypass or parallel lifecycle path is introduced.

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
  - PASS `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts --run` (`13/13`)
  - PASS `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run` (`72/72`)
  - PASS `pnpm --filter api run typecheck`
  - PASS `pnpm run quality:guardrails`
  - PASS `pnpm run lint`
  - PASS `git diff --check` with CRLF warnings only
- Manual checks: reviewed helper and service diff for fail-closed underfill
  behavior and no public API surface change.
- Screenshots/logs: not applicable
- High-risk checks: known underfilled `FILLED` event regression passes and
  does not apply filled lifecycle.

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
- Rollback note: revert this helper/service change and regressions if event
  fill reconciliation behaves unexpectedly.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: event fill progress lacks local requested quantity, so a known
  underfilled exchange `FILLED` event can be treated as lifecycle-complete.
- Gaps: no no-DB helper regression locks requested-vs-filled exchange event
  parity with live order creation.
- Inconsistencies: live order creation already fails closed for underfilled
  known fills; event reconciliation should match.
- Architecture constraints: exchange reconciliation must preserve confirmed
  fill truth, not guess full lifecycle, and not bypass position lifecycle
  guards.

### 2. Select One Priority Task
- Selected task: underfilled exchange-event entry/DCA lifecycle guard.
- Priority rationale: money-impacting fail-closed runtime behavior in BUILDER
  mode.
- Why other candidates were deferred: broader DB-backed event suites remain
  blocked by local Postgres availability; this pure helper slice gives
  immediate reproducible coverage.

### 3. Plan Implementation
- Files or surfaces to modify: helper, helper tests, exchange event service,
  planning/context docs.
- Logic: normalize requested quantity, cap incoming cumulative quantity to that
  requested value, treat known terminal underfill as partial, and skip filled
  lifecycle until complete.
- Edge cases: duplicate `FILLED`, stale lower cumulative quantity, malformed
  no-quantity `FILLED`, over-reported cumulative quantity, already overfilled
  local state.

### 4. Execute Implementation
- Implementation notes: extended the pure fill-progress helper with optional
  requested quantity, wired `existingOrder.quantity` from exchange event
  reconciliation, capped over-reported cumulative quantity, and added helper
  regressions for known underfill and over-reporting.

### 5. Verify and Test
- Validation performed: helper regression, focused runtime/order suites,
  typecheck, repository guardrails, lint, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only add a service-level guard; rejected because
  status, lifecycle, and quantity decisions already live in the pure helper.
- Technical debt introduced: no
- Scalability assessment: small optional helper input keeps existing callers
  compatible while letting exchange event service provide order truth.
- Refinements made: kept the lifecycle guard in the existing helper rather than
  adding a second service-only decision path.

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
This task intentionally avoids DB-backed event tests because local Postgres has
been unavailable in prior iterations. The no-DB helper regression covers the
new fail-closed decision deterministically.

## Production-Grade Required Contract
- `Goal`: prevent known underfilled exchange events from applying filled
  lifecycle.
- `Scope`: helper, helper tests, event service, planning/context docs.
- `Implementation Plan`: listed above.
- `Acceptance Criteria`: listed above.
- `Definition of Done`: uses `DEFINITION_OF_DONE.md` evidence.
- `Result Report`: completed below.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes, exchange event reconciliation path
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: yes, helper and focused runtime/order suites pass.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: LIVE/PAPER runtime operators.
- Existing workaround or pain: no visible workaround; risk is silent lifecycle
  over-application.
- Smallest useful slice: pure helper guard plus service input wiring.
- Success metric or signal: validation pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: no, not
  applicable for this small helper/service guard.
- Critical user journey: exchange event order lifecycle reconciliation.
- SLI: known underfilled events do not apply filled lifecycle.
- SLO: not applicable.
- Error budget posture: not applicable
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not applicable
- Smoke command or manual smoke: focused tests passed.
- Rollback or disable path: revert this helper/service change.

## AI Testing Evidence
Not applicable; no AI feature touched.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: no, not applicable
  for this small helper/service guard.
- Data classification: money-impacting order quantity and status data.
- Trust boundaries: external exchange event payload to local lifecycle state.
- Permission or ownership checks: unchanged.
- Abuse cases: malformed or underfilled external event must fail closed.
- Secret handling: no secrets touched.
- Security tests or scans: not applicable.
- Fail-closed behavior: helper tests passed.
- Residual risk: DB-backed event lifecycle suite remains environment-dependent.

## Result Report
- Task summary: exchange event fill progress now uses local requested order
  quantity to keep known underfilled `FILLED` events partial and to block filled
  lifecycle until the local quantity is complete.
- Files changed:
  - `apps/api/src/modules/orders/orders.exchangeEvents.helpers.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.helpers.test.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `history/tasks/position-management-exchange-event-underfilled-entry-task-2026-05-06.md`
- How tested: helper regression (`13/13`), focused runtime/order suites
  (`72/72`), API typecheck, guardrails, lint, and diff check.
- What is incomplete: DB-backed exchange-event lifecycle suite was not run
  because prior iterations established local Postgres is unavailable.
- Next steps: continue with the next one-task runtime/order safety slice.
- Decisions made: no architecture decision required; reused the existing pure
  helper path.
