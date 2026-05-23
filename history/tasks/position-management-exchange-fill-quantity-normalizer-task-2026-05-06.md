# Task

## Header
- ID: PMPLC-24
- Title: Centralize exchange fill quantity normalization
- Task Type: refactor
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-23
- Priority: P0
- Iteration: 24
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Exchange fill progress now caps both existing and incoming quantities to local
order quantity when that truth is available. The same normalization expression
is duplicated for existing and incoming values inside the helper.

## Goal
Centralize exchange fill quantity normalization into one private helper so the
quantity cap stays a single local decision without behavior changes.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.helpers.ts`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Success Signal
- User or operator problem: future exchange fill changes are less likely to
  update incoming and existing quantity paths inconsistently.
- Expected product or reliability outcome: quantity truth remains bounded by
  local order truth through one reusable helper.
- How success will be observed: helper, DB-backed event, and focused
  runtime/order suites pass.
- Post-launch learning needed: no

## Deliverable For This Stage
One no-behavior-change refactor plus validation and source-of-truth updates.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it
- preserve all PMPLC-16 through PMPLC-23 behavior

## Implementation Plan
1. Add a private `normalizeExchangeFillQuantity` helper.
2. Use it for both existing local fill progress and incoming cumulative fill
   quantity.
3. Keep exported helper contract unchanged.
4. Run helper, DB-backed event, and focused runtime/order validation.
5. Update source-of-truth files.

## Acceptance Criteria
- Existing and incoming fill quantity normalization share one helper.
- Public helper output is unchanged for existing regressions.
- DB-backed exchange-event suite remains green.
- No duplicate lifecycle or quantity decision path is introduced.

## Definition of Done
- [x] Focused helper regression passes.
- [x] DB-backed exchange-event suite passes.
- [x] Focused runtime/order pack passes.
- [x] Typecheck, guardrails, lint, and diff check pass.
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
  - PASS `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts --run` (`22/22`)
  - PASS `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run` (`81/81`)
  - PASS `pnpm --filter api run typecheck`
  - PASS `pnpm run quality:guardrails`
  - PASS `pnpm run lint`
  - PASS `git diff --check` with CRLF warnings only
- Manual checks:
  - PASS `Test-NetConnection -ComputerName localhost -Port 5432`
  - PASS `docker ps` shows `cryptosparrow-postgres-1` running on `5432`
- Screenshots/logs: not applicable
- High-risk checks: helper and DB-backed exchange-event regressions pass with
  requested-quantity cap behavior intact.

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
- Rollback note: revert the helper refactor if quantity regression appears.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: existing and incoming quantity caps duplicate the same expression.
- Gaps: none in behavior found; this is a structure hardening slice.
- Inconsistencies: duplication creates a future drift risk in a money-impacting
  helper.
- Architecture constraints: exchange fill truth must remain bounded by local
  order quantity when available.

### 2. Select One Priority Task
- Selected task: centralize exchange fill quantity normalization.
- Priority rationale: iteration 24 is ARCHITECT mode and this reduces
  duplication in a critical lifecycle helper.
- Why other candidates were deferred: broader behavior changes would exceed one
  tiny architecture slice.

### 3. Plan Implementation
- Files or surfaces to modify: helper and planning/context docs.
- Logic: private normalizer clamps non-finite/negative values to `null` or `0`
  depending call site and caps positive requested quantity.
- Edge cases: no requested quantity, zero requested quantity, negative values,
  over-reported values.

### 4. Execute Implementation
- Implementation notes: added private `normalizeExchangeFillQuantity` and used
  it for both existing local fill progress and incoming cumulative fill
  quantity.

### 5. Verify and Test
- Validation performed: helper plus DB-backed event suite, focused
  runtime/order pack, API typecheck, repository guardrails, lint, and diff
  check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: leave duplicated expressions; rejected because this
  is the exact drift ARCHITECT mode is meant to remove.
- Technical debt introduced: no
- Scalability assessment: private helper keeps the boundary local and avoids a
  new abstraction surface.
- Refinements made: none needed after validation.

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
Postgres availability was checked before planning DB-backed validation, applying
the `2026-05-06` learning journal guardrail.

## Production-Grade Required Contract
- `Goal`: centralize exchange fill quantity normalization.
- `Scope`: helper plus planning/context docs.
- `Implementation Plan`: listed above.
- `Acceptance Criteria`: listed above.
- `Definition of Done`: uses `DEFINITION_OF_DONE.md` evidence.
- `Result Report`: completed below.

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes, exchange event helper path
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: not applicable
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: yes, helper and DB-backed event-service suites
  pass.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: future maintainers of LIVE/PAPER order lifecycle.
- Existing workaround or pain: duplicated quantity cap logic in one helper.
- Smallest useful slice: private normalizer extraction.
- Success metric or signal: validation pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: no, not
  applicable for this local helper refactor.
- Critical user journey: exchange event order lifecycle reconciliation.
- SLI: fill quantity truth remains bounded by local order quantity.
- SLO: not applicable.
- Error budget posture: not applicable
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not applicable
- Smoke command or manual smoke: focused tests passed.
- Rollback or disable path: revert this helper refactor.

## AI Testing Evidence
Not applicable; no AI feature touched.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: no, not applicable
  for this local helper refactor.
- Data classification: money-impacting order quantity and status data.
- Trust boundaries: external exchange event data and local persisted order
  state.
- Permission or ownership checks: unchanged.
- Abuse cases: over-reported quantities remain capped by local order truth.
- Secret handling: no secrets touched.
- Security tests or scans: not applicable.
- Fail-closed behavior: helper and DB-backed event-service tests passed.
- Residual risk: none expected.

## Result Report
- Task summary: centralized exchange fill quantity normalization into one
  private helper and preserved all requested-quantity cap behavior.
- Files changed:
  - `apps/api/src/modules/orders/orders.exchangeEvents.helpers.ts`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `history/tasks/position-management-exchange-fill-quantity-normalizer-task-2026-05-06.md`
- How tested: helper plus DB-backed event suite (`22/22`), focused
  runtime/order pack (`81/81`), API typecheck, guardrails, lint, and diff
  check.
- What is incomplete: nothing known for this slice.
- Next steps: continue with the next one-task runtime/order safety slice.
- Decisions made: no architecture decision required; reused the existing helper
  boundary and applied the Postgres verification guardrail before DB tests.
