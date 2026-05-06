# Task

## Header
- ID: PMPLC-28
- Title: Preserve LIVE exchange fee pending truth when fee is absent
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-27
- Priority: P0
- Iteration: 28
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
LIVE fee truth is exchange-derived. The architecture allows temporary estimated
or missing fees only when they remain traceable through `feePending`. Exchange
order-trade event reconciliation could mark a fully filled order as no longer
fee-pending even when the event did not contain finite fee truth.

## Goal
Keep `Order.feePending` and `Trade.feePending` true after a confirmed LIVE fill
when the exchange event does not provide a finite fee.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- `docs/planning/position-management-exchange-fee-pending-truth-task-2026-05-06.md`

## Success Signal
- User or operator problem: missing exchange fees must not be hidden as settled.
- Expected product or reliability outcome: exact LIVE fee absence remains
  operator-visible and reconcilable.
- How success will be observed: regression test fails before the fix and passes
  after the fix; focused runtime/order validations remain green.
- Post-launch learning needed: no

## Deliverable For This Stage
Implementation plus verification evidence for one fee-truth hardening slice.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Add a DB-backed regression for a full LIVE exchange fill without fee truth.
2. Confirm the test fails on current behavior.
3. Keep fee pending closed only when a finite recordable event fee exists.
4. Propagate the order's pending fee state into lifecycle trades created by the
   exchange event handler.
5. Run DB-backed exchange-event tests, focused runtime/order pack, typecheck,
   guardrails, lint, and diff check.
6. Update context and planning truth.

## Acceptance Criteria
- [x] Full exchange fill without finite fee keeps `Order.feePending=true`.
- [x] The generated lifecycle `Trade` also keeps `feePending=true`.
- [x] Full exchange fill with finite fee still clears `feePending`.
- [x] Existing exchange event reconciliation behavior remains covered.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations are satisfied for this tiny slice.
- [x] No workaround, fake data, placeholder, or parallel path is introduced.
- [x] Validation evidence is recorded in this task.
- [x] Source-of-truth planning and context files are updated.

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
  - Pre-fix `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.service.test.ts --run`
    FAILED as expected: `updatedOrder.feePending` was `false` for a filled
    exchange event with no fee truth.
  - Post-fix `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.service.test.ts --run`
    PASS (`10/10`)
  - `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run`
    PASS (`83/83`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
  - `git diff --check` PASS with existing CRLF warnings only
- Manual checks: local Postgres availability was already confirmed in this
  execution thread and DB-backed tests are being run against it.
- Screenshots/logs: not applicable
- High-risk checks: DB-backed exchange fee-pending regression and focused
  runtime/order pack passed.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/planning/live-fee-i18n-numeric-hardening-plan-2026-04-02.md`
  - `docs/governance/autonomous-engineering-loop.md`
  - `docs/planning/mvp-next-commits.md`
  - `.codex/context/TASK_BOARD.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: none

## UX/UI Evidence
- Design source type: not applicable
- Design source reference: not applicable
- Canonical visual target: not applicable
- Fidelity target: not applicable
- Stitch used: no
- Experience-quality bar reviewed: not applicable
- Visual-direction brief reviewed: not applicable
- Existing shared pattern reused: not applicable
- New shared pattern introduced: no
- Design-memory entry reused: not applicable
- Design-memory update required: no
- Visual gap audit completed: not applicable
- Background or decorative asset strategy: not applicable
- Canonical asset extraction required: no
- Screenshot comparison pass completed: not applicable
- Remaining mismatches: none
- Required states: not applicable
- Responsive checks: not applicable
- Input-mode checks: not applicable
- Accessibility checks: not applicable
- Parity evidence: not applicable

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this slice if exchange fee reconciliation regresses.
- Observability or alerting impact: improves operator-visible pending fee truth
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: complete exchange fills could clear `feePending` without finite
  exchange fee truth.
- Gaps: no regression covered this missing-fee exchange event branch.
- Inconsistencies: order fee source stayed `ESTIMATED` while pending was
  cleared, hiding the placeholder state.
- Architecture constraints: LIVE fee truth comes from exchange fills/trades;
  delayed or absent fee truth must remain `feePending`.

### 2. Select One Priority Task
- Selected task: preserve fee pending truth for filled exchange events without
  fee.
- Priority rationale: money-impacting fee truth is P0 and the fix is a tiny
  reversible vertical slice.
- Why other candidates were deferred: broader fee reconciliation work would be
  larger than one autonomous iteration.

### 3. Plan Implementation
- Files or surfaces to modify: exchange event service/test plus planning and
  context docs.
- Logic: compute whether the exchange event produced a finite recordable fee,
  clear `feePending` only in that case, and pass the updated order pending flag
  into generated lifecycle trades.
- Edge cases: filled event with no fee, filled event with finite fee, capped fee
  event, close/DCA/open lifecycle trade creation.

### 4. Execute Implementation
- Implementation notes: added a failing DB-backed regression for a full LIVE
  exchange fill without fee truth, then changed the event handler to clear
  `feePending` only when a finite recordable event fee exists. Generated
  lifecycle trades now inherit `updatedOrder.feePending`.

### 5. Verify and Test
- Validation performed: pre-fix failing regression, post-fix DB-backed
  exchange-event suite, focused runtime/order pack, API typecheck, repository
  guardrails, lint, and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: only changing the order flag; rejected because
  runtime history is trade-backed and must show the same pending state.
- Technical debt introduced: no
- Scalability assessment: uses existing `feePending` fields and exchange event
  flow; no new system introduced.
- Refinements made: preserved the existing lifecycle helper behavior globally
  and constrained the fee-pending restoration to the exchange-event missing-fee
  path.

### 7. Update Documentation and Knowledge
- Docs updated: this task, `docs/planning/mvp-next-commits.md`, and
  `docs/planning/mvp-execution-plan.md`.
- Context updated: `.codex/context/PROJECT_STATE.md` and
  `.codex/context/TASK_BOARD.md`.
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
- The pre-fix failing assertion is the acceptance proof for this slice:
  `expected false to be true` at `updatedOrder.feePending`.

## Production-Grade Required Contract

Every task must include these mandatory sections before it can move to `READY`
or `IN_PROGRESS`:

- `Goal`
- `Scope` with exact files, modules, routes, APIs, schemas, docs, or runtime
  surfaces
- `Implementation Plan` with step-by-step execution and validation
- `Acceptance Criteria` with testable conditions
- `Definition of Done` using `DEFINITION_OF_DONE.md`
- `Result Report`

Runtime tasks must be delivered as a vertical slice: UI -> logic -> API -> DB
-> validation -> error handling -> test. Partial implementations,
mock-only paths, placeholders, fake data, and temporary fixes are forbidden.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: yes, no schema change
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: DB-backed exchange-event replay suite passed
- Regression check performed: yes

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: live trading operators and runtime history readers
- Existing workaround or pain: missing fee appears settled
- Smallest useful slice: preserve pending flag and add DB-backed regression
- Success metric or signal: no filled LIVE trade hides absent fee truth
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: LIVE exchange fill fee reconciliation visibility
- SLI: filled LIVE orders/trades accurately expose fee pending state
- SLO: no confirmed fill without fee truth is marked fee-settled
- Error budget posture: healthy
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not changed
- Smoke command or manual smoke: DB-backed exchange-event suite
- Rollback or disable path: revert this slice

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: not applicable
- Data classification: user order, trade, and fee data
- Trust boundaries: exchange event fee data remains untrusted until finite
- Permission or ownership checks: existing user/order lookup retained
- Abuse cases: exchange fill event omits fee while status is terminal
- Secret handling: unchanged
- Security tests or scans: repository guardrails, lint, and typecheck passed
- Fail-closed behavior: absent fee truth remains pending instead of settled
- Residual risk: low after validation

## Result Report

- Task summary: preserved LIVE fee pending truth when exchange fill events omit
  finite fee data.
- Files changed:
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `docs/planning/position-management-exchange-fee-pending-truth-task-2026-05-06.md`
- How tested: pre-fix failing regression, DB-backed exchange-event suite
  (`10/10`), focused runtime/order suites (`83/83`), API typecheck, repository
  guardrails, lint, and diff check.
- What is incomplete: nothing for this slice.
- Next steps: continue with the next tiny PMPLC/V1 runtime hardening task.
- Decisions made: keep the global lifecycle helper unchanged and correct the
  exchange-event missing-fee branch locally.
