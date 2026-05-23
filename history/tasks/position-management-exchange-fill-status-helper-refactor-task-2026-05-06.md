# Task

## Header
- ID: PMPLC-21
- Title: Make exchange fill persisted status decision explicit
- Task Type: refactor
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-20
- Priority: P0
- Iteration: 21
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Exchange order-trade events drive money-impacting position lifecycle updates.
Recent slices made fill progress monotonic and fail-closed, but the persisted
order status decision inside `resolveExchangeOrderFillProgress` is still encoded
as a nested inline branch. In ARCHITECT mode this should be made explicit while
preserving behavior.

## Goal
Make the exchange fill persisted-status decision readable, named, and testable
without introducing a new system or changing lifecycle behavior.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.helpers.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.helpers.test.ts`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Success Signal
- User or operator problem: exchange event state transitions remain auditable
  for money-impacting LIVE/PAPER order reconciliation.
- Expected product or reliability outcome: no hidden status regression or
  lifecycle bypass is introduced while helper intent becomes clearer.
- How success will be observed: focused helper tests, wider focused order/runtime
  tests, typecheck, lint, guardrails, and diff check pass.
- Post-launch learning needed: no

## Deliverable For This Stage
One small refactor plus regression evidence and source-of-truth updates.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it
- preserve exchange fill lifecycle behavior

## Implementation Plan
1. Extract the persisted order status decision into a private pure helper in
   `orders.exchangeEvents.helpers.ts`.
2. Keep the existing exported helper contract unchanged.
3. Add one regression documenting terminal cancellation after partial progress.
4. Run focused and repository validation.
5. Update planning and context source-of-truth files.

## Acceptance Criteria
- `resolveExchangeOrderFillProgress` keeps the same public output shape.
- First fill, duplicate fill, stale lower cumulative quantity, stale `OPEN`,
  malformed `FILLED`, and partial terminal status behavior remain covered.
- No DB dependency is introduced into the helper regression.
- Relevant validations pass or documented blockers are recorded.

## Definition of Done
- [x] Code builds without errors for the touched API scope.
- [x] No temporary path, fake data, or workaround is introduced.
- [x] Existing documented exchange fill behavior is preserved.
- [x] Validation evidence is recorded.
- [x] Source-of-truth files are updated.

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
  - PASS `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts --run` (`11/11`)
  - PASS `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run` (`70/70`)
  - PASS `pnpm --filter api run typecheck`
  - PASS `pnpm run quality:guardrails`
  - PASS `pnpm run lint`
  - PASS `git diff --check` with CRLF warnings only
- Manual checks: reviewed helper diff for no public contract change and no
  lifecycle bypass.
- Screenshots/logs: not applicable
- High-risk checks: fail-closed status behavior remains under automated tests

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/reference/position-management-pnl-lifecycle-contract.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
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
- Rollback note: revert this refactor and regression test if unexpected status
  behavior appears.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: persisted status logic is correct but encoded as a nested branch that
  is hard to audit in a money-impacting reconciliation path.
- Gaps: terminal non-fill statuses after partial progress should be explicitly
  documented by a helper regression.
- Inconsistencies: none found between architecture and implementation.
- Architecture constraints: exchange reconciliation must not bypass lifecycle,
  must preserve known fill truth, and must fail closed when fill quantity truth
  is missing.

### 2. Select One Priority Task
- Selected task: refactor exchange fill persisted-status decision.
- Priority rationale: iteration 21 is ARCHITECT mode and this is a small,
  reversible architecture-readability improvement in a critical path.
- Why other candidates were deferred: DB-backed lifecycle suites remain blocked
  by unavailable local Postgres and broader runtime changes would exceed one
  tiny task.

### 3. Plan Implementation
- Files or surfaces to modify: helper, helper regression, planning/context docs.
- Logic: move inline status decision into a named private pure helper and call
  it from the existing exported resolver.
- Edge cases: already-filled local status, malformed filled event without
  quantity, stale `OPEN` after partial progress, terminal cancel after partial
  progress.

### 4. Execute Implementation
- Implementation notes: added private `resolvePersistedExchangeOrderStatus`
  helper and replaced the nested inline status branch while keeping
  `resolveExchangeOrderFillProgress` output unchanged.

### 5. Verify and Test
- Validation performed: helper regression, focused runtime/order suites,
  typecheck, repository guardrails, lint, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: leave the nested branch unchanged; rejected because
  it keeps core lifecycle semantics harder to audit.
- Technical debt introduced: no
- Scalability assessment: helper remains local, pure, and no-DB.
- Refinements made: added a terminal cancellation after partial progress
  regression to make the preserved behavior explicit.

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
This is a no-behavior-change refactor of an existing pure helper boundary.

## Production-Grade Required Contract

Every task must include these mandatory sections before it can move to `READY`
or `IN_PROGRESS`:

- `Goal`: make exchange fill status decision explicit.
- `Scope`: helper, helper regression, planning/context docs listed above.
- `Implementation Plan`: listed above.
- `Acceptance Criteria`: listed above.
- `Definition of Done`: uses `DEFINITION_OF_DONE.md` evidence.
- `Result Report`: completed below.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes, existing exchange event helper path
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: yes, helper and focused runtime/order suites pass.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: LIVE/PAPER operators relying on order state truth.
- Existing workaround or pain: nested status logic is harder to audit.
- Smallest useful slice: pure helper refactor plus regression.
- Success metric or signal: validation pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: no, not
  applicable for pure helper refactor.
- Critical user journey: exchange event reconciliation.
- SLI: order lifecycle state remains deterministic after exchange events.
- SLO: not applicable for local refactor.
- Error budget posture: not applicable
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not applicable
- Smoke command or manual smoke: focused tests passed
- Rollback or disable path: revert the refactor.

## AI Testing Evidence
Not applicable; no AI feature touched.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: no, not applicable
  for pure helper refactor.
- Data classification: order status/fill quantity, money-impacting runtime data.
- Trust boundaries: external exchange events entering local reconciliation.
- Permission or ownership checks: unchanged.
- Abuse cases: malformed `FILLED` event without quantity remains fail-closed.
- Secret handling: no secrets touched.
- Security tests or scans: not applicable.
- Fail-closed behavior: helper tests passed.
- Residual risk: DB-backed exchange-event lifecycle suites remain dependent on
  local Postgres availability when run.

## Result Report

- Task summary: made exchange fill persisted-status resolution explicit through
  a private pure helper and added a regression for terminal cancellation after
  partial progress.
- Files changed:
  - `apps/api/src/modules/orders/orders.exchangeEvents.helpers.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.helpers.test.ts`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `history/tasks/position-management-exchange-fill-status-helper-refactor-task-2026-05-06.md`
- How tested: helper regression (`11/11`), focused runtime/order suites
  (`70/70`), API typecheck, guardrails, lint, and diff check.
- What is incomplete: DB-backed exchange-event lifecycle suites were not run in
  this slice; local Postgres availability remains the known blocker from prior
  iterations.
- Next steps: continue with the next one-task runtime/order safety slice from
  the active queue.
- Decisions made: no architecture decision required; no behavior change made.
