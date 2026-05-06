# Task

## Header
- ID: PMPLC-20
- Title: Fail closed on exchange FILLED events without fill quantity
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: QA/Test
- Depends on: PMPLC-19
- Priority: P0
- Iteration: 20
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Exchange user-data events can be malformed or incomplete. After PMPLC-19 the
pure helper preserves monotonic partial state, but a `FILLED` event without
positive cumulative fill quantity can still be interpreted as terminal even
when no confirmed quantity exists.

## Goal
Prevent incomplete exchange `FILLED` events from terminalizing an order or
applying lifecycle when no positive cumulative fill quantity is available.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.helpers.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.helpers.test.ts`
- Planning/context documentation for the completed slice.

## Success Signal
- User or operator problem: malformed exchange filled events must not hide an
  unconfirmed fill state.
- Expected product or reliability outcome: exchange order reconciliation fails
  closed unless terminal fill quantity truth is present.
- How success will be observed: no-DB helper regression proves `FILLED` without
  quantity stays open or partial and does not apply filled lifecycle.
- Post-launch learning needed: no

## Deliverable For This Stage
Verified implementation and validation evidence for fail-closed malformed
`FILLED` exchange events.

## Constraints
- Do not rewrite exchange event ingestion.
- Do not change valid `FILLED` events with positive cumulative quantity.
- Preserve already-terminal local `FILLED` idempotency.
- Keep the change inside the pure helper boundary.

## Implementation Plan
1. Add helper logic that requires positive cumulative quantity before treating a
   non-terminal local order as exchange-terminal `FILLED`.
2. Preserve open or partial status when the incoming `FILLED` event lacks
   quantity truth.
3. Add no-DB regression coverage.
4. Run focused tests, API typecheck, guardrails, lint, and diff check.

## Acceptance Criteria
- Existing `OPEN` plus incoming `FILLED` without cumulative quantity remains
  `OPEN`.
- Existing `PARTIALLY_FILLED` plus incoming `FILLED` without cumulative
  quantity remains `PARTIALLY_FILLED`.
- Already local `FILLED` remains idempotent.
- Valid `FILLED` with positive cumulative quantity still applies lifecycle.
- Available validation gates pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations satisfied for this tiny exchange
  fail-closed slice.
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
  - `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts --run` PASS (`10/10`).
  - `pnpm --filter api exec vitest run src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/orders/orders.liveFillResolution.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run` PASS (`69/69`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run lint` PASS.
  - `git diff --check` PASS with CRLF warnings only.
- Manual checks: reviewed the pure helper to confirm `FILLED` without
  cumulative quantity no longer terminalizes non-terminal local orders.
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
- Rollback note: revert this helper slice to restore previous exchange filled
  status behavior for missing cumulative quantity.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `FILLED` without positive cumulative fill quantity could terminalize
  a non-terminal local order.
- Gaps: no no-DB regression covered malformed terminal exchange event payloads.
- Inconsistencies: PMPLC-14/15 fail closed on underfilled live entry, while
  exchange event terminal status could still be accepted without quantity truth.
- Architecture constraints: local lifecycle must not invent confirmed exposure.

### 2. Select One Priority Task
- Selected task: fail closed on exchange `FILLED` without quantity truth.
- Priority rationale: TESTER iteration should cover malformed/out-of-order
  exchange payloads that affect money state.
- Why other candidates were deferred: DB-backed lifecycle tests remain blocked
  by unavailable local Postgres.

### 3. Plan Implementation
- Files or surfaces to modify: pure helper, helper test, planning/context docs.
- Logic: require positive cumulative quantity before non-terminal local orders
  accept incoming terminal fill status.
- Edge cases: open + filled/no quantity, partial + filled/no quantity,
  already-filled + stale missing quantity, valid filled quantity.

### 4. Execute Implementation
- Implementation notes: added an `incomingFilledWithoutQuantity` branch in
  `resolveExchangeOrderFillProgress` that preserves open or partial local truth
  and blocks lifecycle/detail refresh for malformed terminal events.

### 5. Verify and Test
- Validation performed: no-DB helper regression, focused runtime/order suites,
  API typecheck, repository guardrails, lint, and diff check.
- Result: PASS

### 6. Self-Review
- Simpler option considered: only blocking lifecycle, but terminalizing status
  without quantity would still hide incomplete fill truth.
- Technical debt introduced: no
- Scalability assessment: rule stays inside the pure exchange fill helper and
  keeps service behavior deterministic.
- Refinements made: already local `FILLED` idempotency and valid positive
  cumulative `FILLED` behavior remain unchanged.

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
- Existing workaround or pain: malformed exchange terminal events could hide
  incomplete fill truth.
- Smallest useful slice: pure helper fail-closed regression.
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
- Abuse cases: malformed exchange events must not invent terminal fill truth.
- Secret handling: no changes.
- Security tests or scans: lint and typecheck; no secret or permission path
  changes.
- Fail-closed behavior: malformed `FILLED` events without quantity truth cannot
  terminalize local orders or apply lifecycle.
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
- Task summary: exchange `FILLED` events without positive cumulative quantity
  now preserve non-terminal local fill truth and skip lifecycle/detail refresh.
- Files changed:
  - `apps/api/src/modules/orders/orders.exchangeEvents.helpers.ts`
  - `apps/api/src/modules/orders/orders.exchangeEvents.helpers.test.ts`
  - `docs/planning/position-management-exchange-filled-without-quantity-task-2026-05-06.md`
- How tested: no-DB helper regression, focused runtime/order suites, API
  typecheck, guardrails, lint, and diff check.
- What is incomplete: DB-backed exchange-event lifecycle suites should still be
  rerun when local Postgres is available.
- Next steps: continue with the next smallest money-impacting v1 gap from the
  active planning sources.
- Decisions made: exchange terminal status without quantity is insufficient to
  terminalize a non-terminal local order.
