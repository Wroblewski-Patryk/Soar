# Task

## Header
- ID: PMPLC-23
- Title: Cap existing exchange fill progress to local order quantity
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-22
- Priority: P0
- Iteration: 23
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
`PMPLC-22` capped over-reported incoming exchange cumulative fill quantity to
local order quantity. The same helper still normalized existing local fill
progress before requested quantity was known, so a previously persisted
over-reported `filledQuantity` could remain above local order truth.

## Goal
Ensure exchange fill progress never preserves existing local filled quantity
above the local requested order quantity when requested quantity truth is
available.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.helpers.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.helpers.test.ts`
- `.codex/context/PROJECT_STATE.md`
- `.codex/context/TASK_BOARD.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Success Signal
- User or operator problem: a stale or previously over-reported local fill
  quantity cannot inflate order lifecycle above requested order truth.
- Expected product or reliability outcome: exchange fill reconciliation stays
  bounded by local order quantity for both incoming and existing progress.
- How success will be observed: no-DB helper regression and focused
  runtime/order suites pass.
- Post-launch learning needed: no

## Deliverable For This Stage
One helper normalization fix plus regression and source-of-truth updates.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Implementation Plan
1. Normalize requested quantity before existing fill quantity.
2. Apply requested quantity cap to existing local fill progress when requested
   truth is available.
3. Add a regression for previously over-reported existing progress.
4. Run focused validation and repository checks.
5. Update planning/context source-of-truth files.

## Acceptance Criteria
- Existing `filledQuantity` above requested order quantity is capped.
- Incoming over-report cap from `PMPLC-22` remains covered.
- Stale lower cumulative quantity without requested truth remains monotonic.
- Filled lifecycle still applies only when complete local order quantity is
  known or requested truth is unavailable.

## Definition of Done
- [x] Helper regression passes.
- [x] Focused runtime/order suites pass.
- [x] API typecheck, guardrails, lint, and diff check pass.
- [x] Source-of-truth files are updated.
- [x] No temporary bypass or duplicate lifecycle decision is introduced.

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
  - PASS `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts --run` (`14/14`)
  - PASS `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.service.test.ts --run` (`8/8`)
  - PASS `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts --run` (`22/22`)
  - PASS `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.exchangeEvents.service.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run` (`81/81`)
  - PASS `pnpm --filter api run typecheck`
  - PASS `pnpm run quality:guardrails`
  - PASS `pnpm run lint`
  - PASS `git diff --check` with CRLF warnings only
- Manual checks: verified local Postgres availability before DB-backed suite
  with `Test-NetConnection -ComputerName localhost -Port 5432` and
  `docker ps`; reviewed helper/service test diff for no lifecycle bypass.
- Screenshots/logs: not applicable
- High-risk checks: DB-backed exchange-event regression proves inherited
  over-reported filled quantity is capped and does not create lifecycle trade.

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
- Rollback note: revert this helper normalization and regression.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: existing local fill quantity is normalized before requested quantity
  cap is applied, so invalid over-reported local progress can persist.
- Gaps: no helper regression covers inherited overfill local state.
- Inconsistencies: incoming over-report is capped, existing over-report is not.
- Architecture constraints: lifecycle quantity truth must not exceed local order
  truth when that truth is available.

### 2. Select One Priority Task
- Selected task: cap existing exchange fill progress to local order quantity.
- Priority rationale: small BUILDER-mode money-impacting correctness fix.
- Why other candidates were deferred: broader DB-backed event checks remain
  environment-dependent; this helper slice is deterministic and reversible.

### 3. Plan Implementation
- Files or surfaces to modify: helper, helper tests, planning/context docs.
- Logic: compute requested quantity first and reuse it to normalize existing
  local fill quantity.
- Edge cases: over-reported existing progress, stale incoming lower cumulative,
  over-reported incoming cumulative, no requested quantity legacy behavior.

### 4. Execute Implementation
- Implementation notes: moved requested quantity normalization before existing
  fill normalization, capped existing local progress when requested truth is
  available, and added helper plus DB-backed service regressions.

### 5. Verify and Test
- Validation performed: helper regression, DB-backed exchange-event suite,
  focused runtime/order pack, API typecheck, guardrails, lint, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: leave existing local progress monotonic even above
  requested quantity; rejected because that preserves invalid money-impacting
  state.
- Technical debt introduced: no
- Scalability assessment: local helper normalization keeps one canonical
  quantity-bounding decision.
- Refinements made: added DB-backed event-service coverage after verifying the
  local Docker Postgres container was running.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - this task contract
- Context updated:
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
- Learning journal updated: yes, recorded the local Postgres verification
  guardrail.

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
This is a no-DB helper fix. DB-backed exchange-event lifecycle suites remain
dependent on local Postgres availability.

## Production-Grade Required Contract
- `Goal`: cap inherited local fill progress to requested order quantity.
- `Scope`: helper, helper tests, planning/context docs.
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
- Regression check performed: yes, helper and DB-backed event-service suites
  pass.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: LIVE/PAPER runtime operators.
- Existing workaround or pain: no safe workaround; invalid persisted fill
  progress could survive reconciliation.
- Smallest useful slice: pure helper cap plus regression.
- Success metric or signal: validation pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: no, not
  applicable for this small helper fix.
- Critical user journey: exchange event order lifecycle reconciliation.
- SLI: fill progress never exceeds local order quantity when requested truth is
  available.
- SLO: not applicable.
- Error budget posture: not applicable
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not applicable
- Smoke command or manual smoke: focused tests passed.
- Rollback or disable path: revert this helper change.

## AI Testing Evidence
Not applicable; no AI feature touched.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: no, not applicable
  for this small helper fix.
- Data classification: money-impacting order quantity and status data.
- Trust boundaries: external exchange event data and local persisted order
  state.
- Permission or ownership checks: unchanged.
- Abuse cases: over-reported local or exchange quantity must not inflate local
  lifecycle.
- Secret handling: no secrets touched.
- Security tests or scans: not applicable.
- Fail-closed behavior: helper and DB-backed event-service tests passed.
- Residual risk: none known for this slice.

## Result Report
- Task summary: exchange fill progress now caps inherited local filled quantity
  to local order quantity when requested truth is available, matching the
  incoming cumulative cap from `PMPLC-22`.
- Files changed:
  - `apps/api/src/modules/orders/orders.exchangeEvents.helpers.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.helpers.test.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
  - `.codex/context/LEARNING_JOURNAL.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/mvp-execution-plan.md`
  - `history/tasks/position-management-exchange-existing-fill-cap-task-2026-05-06.md`
- How tested: helper regression (`14/14`), DB-backed exchange-event suite
  (`8/8`), combined helper/event suite (`22/22`), focused runtime/order pack
  (`81/81`), API typecheck, guardrails, lint, and diff check.
- What is incomplete: nothing known for this slice.
- Next steps: continue with the next one-task runtime/order safety slice.
- Decisions made: no architecture decision required; reused the existing pure
  helper boundary and added the Postgres verification guardrail.
