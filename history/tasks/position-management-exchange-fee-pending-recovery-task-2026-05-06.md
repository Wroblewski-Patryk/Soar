# Task

## Header
- ID: PMPLC-29
- Title: Recover exchange fee pending truth for unresolved LIVE fees
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-28
- Priority: P0
- Iteration: 29
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
PMPLC-28 preserved `feePending=true` when a pending LIVE order was filled by an
exchange event without finite fee truth. A narrower historical-drift case
remained: rows that already had `feePending=false` while still carrying
`feeSource=ESTIMATED` and no settled exchange fee stayed falsely settled.

## Goal
Recover `feePending=true` for filled LIVE exchange-event orders when fee truth
is still unresolved, even if the previous local row incorrectly had
`feePending=false`.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- `history/tasks/position-management-exchange-fee-pending-recovery-task-2026-05-06.md`

## Success Signal
- User or operator problem: unresolved LIVE fee truth must not remain hidden by
  a stale false pending flag.
- Expected product or reliability outcome: exchange-event reconciliation heals
  local fee-pending drift when fee truth is absent.
- How success will be observed: DB-backed regression fails before the fix and
  passes after the fix.
- Post-launch learning needed: no

## Deliverable For This Stage
Implementation plus verification evidence for one fee-truth recovery slice.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Strengthen the DB-backed missing-fee regression so the local order starts
   with stale `feePending=false`.
2. Confirm the regression fails before the fix.
3. Treat fee truth as settled only when the row has finite
   `EXCHANGE_FILL` fee, or the current event has finite recordable fee.
4. Set/restore `feePending=true` for unresolved fee truth.
5. Run DB-backed exchange-event tests, focused runtime/order pack, typecheck,
   guardrails, lint, and diff check.
6. Update context and planning truth.

## Acceptance Criteria
- [x] Filled LIVE exchange event without fee restores `Order.feePending=true`
  when the local row has unresolved estimated fee truth.
- [x] Generated lifecycle `Trade` also shows `feePending=true`.
- [x] Existing finite exchange fee events still clear `feePending`.
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
    FAILED as expected: `updatedOrder.feePending` remained `false` for
    `feeSource=ESTIMATED`, `fee=null`, and an exchange fill event with no fee.
  - Post-fix `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.service.test.ts --run`
    PASS (`10/10`)
  - `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run`
    PASS (`83/83`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
  - `git diff --check` PASS with existing CRLF warnings only
- Manual checks: DB-backed suite uses local Postgres.
- Screenshots/logs: not applicable
- High-risk checks: DB-backed exchange-event recovery regression and focused
  runtime/order pack passed.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/06_execution-lifecycle.md`
  - `history/plans/live-fee-i18n-numeric-hardening-plan-2026-04-02.md`
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
- Issues: `feePending=false` could remain false for unresolved estimated LIVE
  fee rows when the exchange event omitted fee.
- Gaps: PMPLC-28 covered preserving an existing pending flag, not recovering
  from stale false pending state.
- Inconsistencies: `feeSource=ESTIMATED` and `fee=null` could coexist with
  `feePending=false`.
- Architecture constraints: temporary estimated or absent LIVE fees must remain
  traceable placeholders until exchange truth is available.

### 2. Select One Priority Task
- Selected task: recover exchange fee pending truth for unresolved LIVE fees.
- Priority rationale: fee truth directly affects money-impacting runtime
  history and PnL trust.
- Why other candidates were deferred: broader reconciliation/backfill jobs are
  larger than one tiny reversible slice.

### 3. Plan Implementation
- Files or surfaces to modify: exchange event service/test plus planning and
  context docs.
- Logic: define settled fee truth as either finite current event fee or finite
  persisted `EXCHANGE_FILL` fee; otherwise restore pending state.
- Edge cases: stale false pending with no fee, existing settled exchange fee,
  current finite exchange fee, generated lifecycle trade propagation.

### 4. Execute Implementation
- Implementation notes: strengthened the missing-fee DB-backed regression to
  start from a stale `feePending=false` row, then updated exchange event
  reconciliation so only finite current event fee or finite persisted
  `EXCHANGE_FILL` fee counts as settled.

### 5. Verify and Test
- Validation performed: pre-fix failing regression, post-fix DB-backed
  exchange-event suite, focused runtime/order pack, API typecheck, repository
  guardrails, lint, and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: only preserving previous `feePending`; rejected
  because it cannot heal drift from stale local rows.
- Technical debt introduced: no
- Scalability assessment: uses existing fields and service-local decision
  logic; no new reconciliation system introduced.
- Refinements made: kept the fix local to exchange-event reconciliation and did
  not alter global lifecycle helper behavior.

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
- Existing workaround or pain: unresolved fee can look settled
- Smallest useful slice: restore pending flag in exchange event reconciliation
- Success metric or signal: no filled LIVE trade hides unresolved fee truth
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: LIVE exchange fill fee reconciliation visibility
- SLI: filled LIVE orders/trades accurately expose unresolved fee pending state
- SLO: no confirmed fill with unresolved fee truth is marked fee-settled
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
- Abuse cases: exchange fill event omits fee while local row claims settled
- Secret handling: unchanged
- Security tests or scans: repository guardrails, lint, and typecheck passed
- Fail-closed behavior: unresolved fee truth is restored to pending
- Residual risk: low after validation

## Result Report

- Task summary: recovered fee-pending truth for unresolved LIVE exchange fees
  even when local rows had drifted to `feePending=false`.
- Files changed:
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `history/tasks/position-management-exchange-fee-pending-recovery-task-2026-05-06.md`
- How tested: pre-fix failing regression, DB-backed exchange-event suite
  (`10/10`), focused runtime/order suites (`83/83`), API typecheck, repository
  guardrails, lint, and diff check.
- What is incomplete: nothing for this slice.
- Next steps: continue with the next tiny PMPLC/V1 runtime hardening task.
- Decisions made: treat fee truth as settled only when current or persisted
  exchange-derived finite fee is available.
