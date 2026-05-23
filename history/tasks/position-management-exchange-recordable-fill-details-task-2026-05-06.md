# Task

## Header
- ID: PMPLC-27
- Title: Centralize exchange recordable fill details
- Task Type: refactor
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-26
- Priority: P0
- Iteration: 27
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
PMPLC-25 and PMPLC-26 closed money-impacting exchange fill issues by capping
`OrderFill.quantity` to accepted local fill progress and scaling event fee to
that accepted quantity. The current service computes those two pieces through
separate private helpers even though they represent one recordability decision.

## Goal
Keep exchange event quantity and fee recordability aligned by resolving them
through one private decision helper, without changing runtime behavior.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`
- `history/tasks/position-management-exchange-recordable-fill-details-task-2026-05-06.md`

## Success Signal
- User or operator problem: exchange fill child rows and fees must not drift
  when exchange reports a fill above locally accepted quantity.
- Expected product or reliability outcome: one local decision produces both
  recordable fill quantity and proportional fee.
- How success will be observed: existing DB-backed and focused runtime/order
  suites keep passing with unchanged behavior.
- Post-launch learning needed: no

## Deliverable For This Stage
Implementation plus verification evidence for a single ARCHITECT-mode refactor
slice.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Verify local Postgres before DB-backed validation.
2. Replace separate recordable quantity and fee helpers with one private helper.
3. Keep existing service call sites and persistence behavior unchanged.
4. Run the DB-backed exchange-event suite and focused runtime/order pack.
5. Run typecheck, guardrails, lint, and diff check.
6. Update context and planning truth.

## Acceptance Criteria
- [x] Recordable exchange fill quantity and fee are resolved together.
- [x] Existing order, order-fill, trade, and position behavior remains covered.
- [x] DB-backed exchange-event tests pass against local Postgres.
- [x] Repository guardrails pass.

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
  - `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.service.test.ts --run`
    PASS (`9/9`)
  - `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run`
    PASS (`82/82`)
  - `pnpm --filter api run typecheck` PASS
  - `pnpm run quality:guardrails` PASS
  - `pnpm run lint` PASS
  - `git diff --check` PASS with existing CRLF warnings only
- Manual checks: Postgres availability confirmed before validation.
- Screenshots/logs: not applicable
- High-risk checks: DB-backed exchange-event reconciliation and focused
  fail-closed runtime/order regression pack passed.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/governance/autonomous-engineering-loop.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
  - `docs/architecture/reference/assistant-runtime-contract.md`
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
- Rollback note: revert this refactor if exchange event reconciliation regresses.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: recordable exchange fill quantity and fee were separate helper
  decisions despite representing one accepted-fill persistence decision.
- Gaps: no behavior gap after PMPLC-26, but structure allowed future drift.
- Inconsistencies: quantity/fee naming was parallel rather than unified.
- Architecture constraints: money-impacting exchange reconciliation must be
  deterministic, fail-closed, and covered by DB-backed tests.

### 2. Select One Priority Task
- Selected task: centralize recordable exchange fill details.
- Priority rationale: iteration 27 is ARCHITECT mode, and this reduces drift
  risk in a money-impacting exchange persistence path.
- Why other candidates were deferred: broader lifecycle or UI work would exceed
  one tiny reversible slice.

### 3. Plan Implementation
- Files or surfaces to modify: exchange event service plus planning/context
  docs.
- Logic: one private helper returns `{ quantity, fee }`, preserving raw fee
  behavior when no positive last fill quantity exists and proportional scaling
  when the accepted quantity is capped below exchange `lastFilledQuantity`.
- Edge cases: missing fee, missing last fill quantity, no fill-progress delta,
  capped quantity, full accepted last fill quantity.

### 4. Execute Implementation
- Implementation notes: replaced separate recordable last-fill quantity and fee
  helpers with `resolveRecordableExchangeFillDetails`, then updated the event
  handler to use the returned `quantity` and `fee` together.

### 5. Verify and Test
- Validation performed: local Postgres check, DB-backed exchange-event suite,
  focused runtime/order pack, API typecheck, repository guardrails, lint, and
  diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: leaving two helpers in place; rejected because it
  keeps one business decision split across two paths.
- Technical debt introduced: no
- Scalability assessment: private helper remains local to the service and does
  not introduce a new public abstraction.
- Refinements made: kept fee behavior unchanged for missing last-fill quantity
  and no-progress cases, then verified with DB-backed service tests.

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
- Local Postgres was verified before DB-backed validation:
  `Test-NetConnection -ComputerName localhost -Port 5432` returned
  `TcpTestSucceeded: True`, and `cryptosparrow-postgres-1` was running.

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
- Refresh/restart behavior verified: DB-backed service replay tests passed
- Regression check performed: yes

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: live and paper trading operators
- Existing workaround or pain: none acceptable
- Smallest useful slice: private helper consolidation with existing tests
- Success metric or signal: no regression in exchange event reconciliation
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: not applicable
- Critical user journey: exchange order trade update reconciliation
- SLI: correct persisted order, fill, trade, and position state
- SLO: deterministic processing for every accepted exchange fill event
- Error budget posture: healthy
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not changed
- Smoke command or manual smoke: DB-backed exchange-event suite
- Rollback or disable path: revert this refactor

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
- Data classification: user trading and order data
- Trust boundaries: exchange event input remains untrusted and normalized by
  existing service logic
- Permission or ownership checks: existing user/order lookup retained
- Abuse cases: over-reported exchange last fill quantity with finite fee
- Secret handling: unchanged
- Security tests or scans: repository guardrails, lint, and typecheck passed
- Fail-closed behavior: existing malformed and underfilled exchange event tests
  remain in focused validation pack
- Residual risk: low after validation

## Result Report

- Task summary: centralized recordable exchange fill quantity and fee
  resolution in one private service helper.
- Files changed:
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `history/tasks/position-management-exchange-recordable-fill-details-task-2026-05-06.md`
- How tested: local Postgres availability check, DB-backed exchange-event
  suite (`9/9`), focused runtime/order suites (`82/82`), API typecheck,
  repository guardrails, lint, and diff check.
- What is incomplete: nothing for this slice.
- Next steps: continue with the next tiny PMPLC/V1 runtime hardening task.
- Decisions made: keep the helper private to avoid introducing a new public
  architecture surface for service-local recordability details.
