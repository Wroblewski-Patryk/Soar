# Task

## Header
- ID: PMPLC-15
- Title: Lock LIVE entry lifecycle gate for partial fills
- Task Type: test
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: PMPLC-14
- Priority: P0
- Iteration: 15
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
PMPLC-14 made LIVE fill resolution fail closed when exchange fill rows show
less quantity than the requested order. The next highest-risk gap is proving
the actual open-order persistence decision cannot accidentally apply immediate
position lifecycle for that partial LIVE fill.

## Goal
Create a no-DB regression around the open-order lifecycle gate so partial LIVE
fills remain persisted as partial and do not open or extend a local position.

## Scope
- `apps/api/src/modules/orders/orders.service.ts`
- `apps/api/src/modules/orders/orders.liveFillResolution.test.ts`
- Planning/context documentation for the completed slice.

## Success Signal
- User or operator problem: local positions must not inflate from partial LIVE
  entry fills.
- Expected product or reliability outcome: the persistence and lifecycle gate
  decision is testable without a database and remains aligned with exchange
  fill truth.
- How success will be observed: no-DB tests prove partial LIVE fill blocks
  immediate lifecycle while full/no-row compatible paths still work.
- Post-launch learning needed: no

## Deliverable For This Stage
Verified implementation and validation evidence for the no-DB lifecycle gate
regression.

## Constraints
- Do not introduce partial-position lifecycle accounting in this slice.
- Do not alter PAPER immediate-fill behavior.
- Reuse the PMPLC-14 resolver and avoid parallel fill-resolution logic.
- Keep the change scoped to order persistence/lifecycle decision logic.

## Implementation Plan
1. Extract the existing open-order persistence/lifecycle gate decision into a
   pure helper.
2. Make `openOrder` consume that helper instead of duplicating inline logic.
3. Add no-DB tests for partial LIVE fill, compatible no-row LIVE fill, and
   PAPER behavior.
4. Run focused tests, API typecheck, guardrails, lint, and diff check.

## Acceptance Criteria
- Partial LIVE fill returns `PARTIALLY_FILLED`, persisted exchange quantity,
  and `shouldApplyImmediateFillLifecycle=false`.
- Compatible LIVE fill without exchange rows still returns `FILLED` and allows
  lifecycle when a fill price is resolved.
- PAPER MARKET fill decision remains unchanged.
- Available validation gates pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations satisfied for this tiny lifecycle
  gate regression slice.
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
  - `pnpm --filter api exec vitest run src/modules/orders/orders.liveFillResolution.test.ts --run` PASS (`5/5`).
  - `pnpm --filter api exec vitest run src/modules/orders/orders.liveFillResolution.test.ts src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run` PASS (`61/61`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run lint` PASS.
  - `git diff --check` PASS with CRLF warnings only.
- Blocked validation:
  - DB-backed order lifecycle suites remain pending because local Postgres at
    `localhost:5432` is unavailable in this environment.
- Manual checks: reviewed `openOrder` to confirm persisted status, filled
  quantity, lifecycle gate, and lifecycle fill quantity now flow through one
  helper.
- Screenshots/logs: not applicable
- High-risk checks: pending

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/reference/position-management-pnl-lifecycle-contract.md`.
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
- Rollback note: revert this slice to restore inline open-order decision logic.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: the PMPLC-14 resolver was covered, but the combined persistence and
  lifecycle gate decision remained inline in `openOrder`.
- Gaps: no no-DB regression directly proved partial LIVE fill blocks immediate
  lifecycle.
- Inconsistencies: none found in architecture; this is a coverage hardening
  gap.
- Architecture constraints: local lifecycle must be based on observed exchange
  fills and must not invent exposure.

### 2. Select One Priority Task
- Selected task: no-DB regression and helper extraction for the LIVE entry
  lifecycle gate.
- Priority rationale: TESTER iteration should lock the highest-risk adjacent
  behavior after PMPLC-14.
- Why other candidates were deferred: full DB-backed lifecycle coverage is
  blocked by unavailable local Postgres.

### 3. Plan Implementation
- Files or surfaces to modify: order service, fill-resolution test, planning
  and context docs.
- Logic: centralize the persisted status, filled quantity, lifecycle flag, and
  lifecycle fill quantity decision.
- Edge cases: partial LIVE fill, no exchange fill rows, PAPER filled order,
  unresolved fill price.

### 4. Execute Implementation
- Implementation notes: extracted `resolveOpenOrderPersistenceDecision` and
  wired `openOrder` to use it for persisted status, persisted filled quantity,
  immediate lifecycle gating, and lifecycle fill quantity.

### 5. Verify and Test
- Validation performed: focused no-DB regression, focused runtime/order
  suites, API typecheck, repository guardrails, lint, and diff check.
- Result: PASS for available validations; DB-backed suites remain blocked by
  unavailable local Postgres.

### 6. Self-Review
- Simpler option considered: only adding more resolver assertions, but that
  would leave the `openOrder` lifecycle gate decision less directly protected.
- Technical debt introduced: no
- Scalability assessment: the helper gives future partial-fill lifecycle work a
  single decision boundary to extend.
- Refinements made: reused the PMPLC-14 resolver result instead of recomputing
  fill truth.

### 7. Update Documentation and Knowledge
- Docs updated: this task doc, MVP queue, MVP execution plan.
- Context updated: project state and task board.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected for this iteration.
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
  DB-backed order lifecycle suites.
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: yes, no-DB lifecycle gate regression plus
  focused runtime/order suites.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: LIVE runtime operator.
- Existing workaround or pain: partial live entry fill could regress into full
  local lifecycle if the gate decision drifts.
- Smallest useful slice: no-DB helper regression for the lifecycle gate.
- Success metric or signal: focused regression and validation gates pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: live order entry and position creation.
- SLI: live fill-resolution/lifecycle-gate test pass rate.
- SLO: relevant regression suites pass before release.
- Error budget posture: healthy for covered scope.
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not changed.
- Smoke command or manual smoke: focused vitest suites.
- Rollback or disable path: revert this slice.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: exchange execution and position data.
- Trust boundaries: exchange order adapter to local order/position lifecycle.
- Permission or ownership checks: existing order ownership checks retained.
- Abuse cases: incomplete fill data must not open full local exposure.
- Secret handling: no changes.
- Security tests or scans: lint and typecheck; no secret or permission path
  changes.
- Fail-closed behavior: partial LIVE fill truth blocks immediate full position
  lifecycle.
- Residual risk: DB-backed lifecycle suite still depends on local Postgres.

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report
- Task summary: open-order persistence and immediate lifecycle gate decisions
  now share a pure helper with no-DB regression coverage for partial LIVE fills.
- Files changed:
  - `apps/api/src/modules/orders/orders.service.ts`
  - `apps/api/src/modules/orders/orders.liveFillResolution.test.ts`
  - `docs/planning/position-management-live-entry-lifecycle-gate-task-2026-05-06.md`
- How tested: no-DB lifecycle gate regression, focused runtime/order suites,
  API typecheck, guardrails, lint, and diff check.
- What is incomplete: DB-backed order lifecycle suites should be rerun when
  local Postgres is available.
- Next steps: continue with the next smallest money-impacting v1 gap from the
  active planning sources.
- Decisions made: keep one reusable decision boundary for order persistence and
  immediate lifecycle gating.
