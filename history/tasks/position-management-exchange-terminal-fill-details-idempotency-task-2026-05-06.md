# Task

## Header
- ID: PMPLC-17
- Title: Keep stale exchange events from overwriting terminal fill details
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-16
- Priority: P0
- Iteration: 17
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
PMPLC-16 made duplicate exchange `FILLED` events skip position lifecycle and
kept filled quantity monotonic. The same stale or duplicate event can still
arrive after a local order is already terminal `FILLED` and overwrite terminal
fill facts such as average fill price, filled timestamp, fee, or trade id.

## Goal
Preserve terminal fill details for already-filled local orders when stale or
duplicate exchange events arrive without advancing fill progress.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.helpers.test.ts`
- Planning/context documentation for the completed slice.

## Success Signal
- User or operator problem: stale exchange events must not rewrite the audit
  truth of an already completed local order.
- Expected product or reliability outcome: terminal fill details remain stable
  unless an event advances fill progress.
- How success will be observed: no-DB helper regression proves duplicate or
  stale events skip terminal fill-detail refresh.
- Post-launch learning needed: no

## Deliverable For This Stage
Verified implementation and validation evidence for terminal fill-detail
idempotency.

## Constraints
- Do not rewrite exchange event ingestion.
- Do not introduce a new persistence path.
- Preserve first-time `FILLED` event detail updates.
- Keep DB-backed lifecycle suites documented as blocked while local Postgres is
  unavailable.

## Implementation Plan
1. Extend the exchange fill-progress helper with a terminal detail-refresh
   decision.
2. Preserve existing terminal fields when the helper says fill details should
   not refresh.
3. Add no-DB regression coverage for duplicate/stale terminal events and
   first-time terminal events.
4. Run focused tests, API typecheck, guardrails, lint, and diff check.

## Acceptance Criteria
- First-time `FILLED` event may update terminal fill details.
- Duplicate `FILLED` event for an already-filled order does not refresh terminal
  fill details.
- Stale lower cumulative event for an already-filled order does not refresh
  terminal fill details or reduce local fill progress.
- Available validation gates pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations satisfied for this tiny exchange
  idempotency slice.
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
  - `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts --run` PASS (`6/6`).
  - `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run` PASS (`65/65`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run lint` PASS.
  - `git diff --check` PASS with CRLF warnings only.
- Blocked validation:
  - DB-backed exchange-event lifecycle suites remain pending because local
    Postgres at `localhost:5432` is unavailable in this environment.
- Manual checks: reviewed `applyLiveExchangeOrderTradeUpdateEvent` to confirm
  terminal fill details are refreshed only when the fill-progress helper allows
  it.
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
- Rollback note: revert this slice to restore previous exchange-event terminal
  detail update behavior.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: stale or duplicate exchange events could still overwrite terminal
  fill details after PMPLC-16 blocked lifecycle reapplication.
- Gaps: no no-DB regression covered terminal fill-detail stability.
- Inconsistencies: lifecycle idempotency was explicit while terminal field
  idempotency remained implicit.
- Architecture constraints: exchange reconciliation must preserve accurate
  audit and lifecycle truth without stale events rewriting it.

### 2. Select One Priority Task
- Selected task: terminal fill-detail idempotency for already-filled exchange
  orders.
- Priority rationale: terminal execution facts are money/audit impacting.
- Why other candidates were deferred: DB-backed lifecycle confirmation remains
  blocked by local Postgres availability.

### 3. Plan Implementation
- Files or surfaces to modify: exchange event service, helper tests,
  planning/context docs.
- Logic: refresh terminal fill details only before terminal completion or when
  fill progress advances.
- Edge cases: first-time filled event, duplicate filled event, stale lower
  cumulative event.

### 4. Execute Implementation
- Implementation notes: extended `resolveExchangeOrderFillProgress` with
  `shouldRefreshTerminalFillDetails` and reused that decision around terminal
  fill fields in the exchange order update.

### 5. Verify and Test
- Validation performed: no-DB helper regression, focused runtime/order suites,
  API typecheck, repository guardrails, lint, and diff check.
- Result: PASS for available validations; DB-backed suites remain blocked by
  unavailable local Postgres.

### 6. Self-Review
- Simpler option considered: only preserving `filledAt`, but stale events can
  also rewrite price and fee truth, so the terminal detail decision covers the
  affected execution fields together.
- Technical debt introduced: no
- Scalability assessment: the helper keeps terminal fill idempotency explicit
  and no-DB testable.
- Refinements made: allowed detail refresh when cumulative progress advances,
  preserving a future correction path without reapplying lifecycle.

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
  DB-backed exchange-event lifecycle suites.
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: yes, no-DB helper regression plus focused
  runtime/order suites.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: LIVE runtime operator.
- Existing workaround or pain: stale exchange events could rewrite completed
  order audit fields.
- Smallest useful slice: pure helper decision plus no-DB regression.
- Success metric or signal: focused regression and validation gates pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: live exchange fill reconciliation.
- SLI: exchange terminal fill-detail idempotency regression pass rate.
- SLO: relevant regression suites pass before release.
- Error budget posture: healthy for covered scope.
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not changed.
- Smoke command or manual smoke: focused vitest suites.
- Rollback or disable path: revert this slice.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: exchange execution and position data.
- Trust boundaries: Binance user-data stream to local order/position lifecycle.
- Permission or ownership checks: existing order ownership checks retained.
- Abuse cases: stale exchange events must not rewrite terminal execution truth.
- Secret handling: no changes.
- Security tests or scans: lint and typecheck; no secret or permission path
  changes.
- Fail-closed behavior: stale or duplicate terminal exchange events cannot
  rewrite completed execution truth.
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
- Task summary: terminal exchange fill details now refresh only before
  completion or when cumulative fill progress advances.
- Files changed:
  - `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.helpers.test.ts`
  - `history/tasks/position-management-exchange-terminal-fill-details-idempotency-task-2026-05-06.md`
- How tested: no-DB helper regression, focused runtime/order suites, API
  typecheck, guardrails, lint, and diff check.
- What is incomplete: DB-backed exchange-event lifecycle suites should be rerun
  when local Postgres is available.
- Next steps: continue with the next smallest money-impacting v1 gap from the
  active planning sources.
- Decisions made: stale/duplicate terminal exchange events preserve completed
  fill truth; cumulative progress advancement may refresh details without
  reapplying lifecycle.
