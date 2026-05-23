# Task

## Header
- ID: PMPLC-19
- Title: Keep exchange partial fill status monotonic against stale open events
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-18
- Priority: P0
- Iteration: 19
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Exchange user-data events can arrive stale or out of order. PMPLC-18 isolated
the pure fill-progress helper, making another state monotonicity issue visible:
an already `PARTIALLY_FILLED` local order can be regressed to `OPEN` by a later
stale exchange open/new event.

## Goal
Prevent stale exchange open events from hiding existing partial fill progress.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.helpers.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.helpers.test.ts`
- Planning/context documentation for the completed slice.

## Success Signal
- User or operator problem: local order status must not hide known partial fill
  execution.
- Expected product or reliability outcome: exchange fill status remains
  monotonic for partial fills unless a terminal exchange status arrives.
- How success will be observed: no-DB helper regression proves
  `PARTIALLY_FILLED` plus stale `OPEN` remains `PARTIALLY_FILLED`.
- Post-launch learning needed: no

## Deliverable For This Stage
Verified implementation and validation evidence for partial-fill status
monotonicity.

## Constraints
- Do not rewrite exchange event ingestion.
- Do not change terminal `FILLED` idempotency from PMPLC-16/17.
- Preserve terminal exchange statuses such as cancel/reject/expire.
- Keep the change inside the pure helper boundary.

## Implementation Plan
1. Add a helper-level persisted status rule for partial fill progress.
2. Preserve `PARTIALLY_FILLED` when a stale `OPEN` event arrives after local
   partial progress.
3. Add no-DB regression coverage.
4. Run focused tests, API typecheck, guardrails, lint, and diff check.

## Acceptance Criteria
- Existing `PARTIALLY_FILLED` plus incoming `OPEN` stays `PARTIALLY_FILLED`.
- Existing positive fill quantity plus incoming `OPEN` stays
  `PARTIALLY_FILLED`.
- Terminal status handling from PMPLC-16/17 remains unchanged.
- Available validation gates pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations satisfied for this tiny exchange
  status monotonicity slice.
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
  - `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts --run` PASS (`8/8`).
  - `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run` PASS (`67/67`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run lint` PASS.
  - `git diff --check` PASS with CRLF warnings only.
- Manual checks: reviewed the pure helper to confirm stale `OPEN` events no
  longer regress known partial fill status.
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
- Rollback note: revert this helper slice to restore previous exchange status
  mapping behavior.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: stale `OPEN` events could regress `PARTIALLY_FILLED` local status.
- Gaps: no no-DB regression covered partial status monotonicity.
- Inconsistencies: fill quantity was monotonic, but status could still move
  backward from partial to open.
- Architecture constraints: exchange reconciliation must not hide known partial
  fill truth.

### 2. Select One Priority Task
- Selected task: partial-fill status monotonicity in the pure helper.
- Priority rationale: stale exchange event ordering is money-impacting and this
  is the smallest reversible fix.
- Why other candidates were deferred: DB-backed lifecycle tests remain blocked
  by unavailable local Postgres.

### 3. Plan Implementation
- Files or surfaces to modify: pure helper, helper test, planning/context docs.
- Logic: derive persisted status from existing and incoming state without
  regressing known partial progress to open.
- Edge cases: existing partial plus stale open, existing positive fill plus
  stale open, existing filled plus stale partial.

### 4. Execute Implementation
- Implementation notes: updated `resolveExchangeOrderFillProgress` so known
  partial progress persists as `PARTIALLY_FILLED` when a stale `OPEN` event
  arrives.

### 5. Verify and Test
- Validation performed: no-DB helper regression, focused runtime/order suites,
  API typecheck, repository guardrails, lint, and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: handling only existing `PARTIALLY_FILLED`, but an
  existing `OPEN` order with positive fill quantity is also partial truth and
  should remain visible.
- Technical debt introduced: no
- Scalability assessment: the rule stays inside the pure exchange fill helper.
- Refinements made: terminal status handling from PMPLC-16/17 remains
  unchanged.

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
- DB schema and migrations verified: not applicable for pure helper slice
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: yes, helper regression plus focused
  runtime/order suites.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: LIVE runtime operator.
- Existing workaround or pain: stale exchange events could hide partial fills.
- Smallest useful slice: pure helper status monotonicity regression.
- Success metric or signal: focused regression and validation gates pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: live exchange fill reconciliation.
- SLI: exchange fill helper regression pass rate.
- SLO: relevant regression suites pass before release.
- Error budget posture: healthy for covered scope.
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not changed.
- Smoke command or manual smoke: focused vitest suites.
- Rollback or disable path: revert this helper slice.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: exchange execution and position data.
- Trust boundaries: Binance user-data stream to local order lifecycle.
- Permission or ownership checks: unchanged.
- Abuse cases: stale exchange events must not hide known execution truth.
- Secret handling: no changes.
- Security tests or scans: lint and typecheck; no secret or permission path
  changes.
- Fail-closed behavior: stale open exchange events cannot hide known partial
  execution truth.
- Residual risk: DB-backed exchange-event suite still depends on local
  Postgres.

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report
- Task summary: exchange fill progress now keeps partial execution visible when
  stale `OPEN` events arrive.
- Files changed:
  - `apps/api/src/modules/orders/orders.exchangeEvents.helpers.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.helpers.test.ts`
  - `history/tasks/position-management-exchange-partial-status-monotonicity-task-2026-05-06.md`
- How tested: no-DB helper regression, focused runtime/order suites, API
  typecheck, guardrails, lint, and diff check.
- What is incomplete: DB-backed exchange-event lifecycle suites should still be
  rerun when local Postgres is available.
- Next steps: continue with the next smallest money-impacting v1 gap from the
  active planning sources.
- Decisions made: known positive fill progress is partial execution truth even
  if a stale exchange open event arrives later.
