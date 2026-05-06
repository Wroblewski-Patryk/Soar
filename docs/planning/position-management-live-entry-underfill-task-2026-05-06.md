# Task

## Header
- ID: PMPLC-14
- Title: Keep underfilled LIVE entry from opening full position
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: PMPLC-12, PMPLC-13
- Priority: P0
- Iteration: 14
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The close paths now fail closed for underfilled order confirmations. The LIVE
entry/open path still persisted a `FILLED` live order as fully filled whenever
the adapter status was `FILLED`, even if exchange fill rows summed to less than
the requested order quantity.

## Goal
Prevent underfilled LIVE entry orders from opening or extending a local position
at the requested full quantity.

## Scope
- `apps/api/src/modules/orders/orders.service.ts`
- `apps/api/src/modules/orders/orders.liveFillResolution.test.ts`
- Planning/context documentation for the completed slice.

## Success Signal
- User or operator problem: local position quantity must not be inflated above
  confirmed exchange fill quantity.
- Expected product or reliability outcome: LIVE order creation fails closed
  when adapter status and exchange fill quantity disagree.
- How success will be observed: regression proves `FILLED` with partial fills
  persists as `PARTIALLY_FILLED` and is not complete.
- Post-launch learning needed: no

## Deliverable For This Stage
Verified code and documentation update for the completed fix slice.

## Constraints
- Do not introduce partial-position lifecycle accounting in this slice.
- Preserve legacy full-fill behavior when the adapter provides no fill rows.
- Do not change PAPER immediate-fill behavior.
- Keep the change scoped to live order fill resolution.

## Implementation Plan
1. Add a small resolver for persisted LIVE order fill status and quantity.
2. Use exchange fill quantity when present instead of requested quantity.
3. Treat `FILLED` with below-request exchange fills as `PARTIALLY_FILLED`.
4. Apply immediate lifecycle only when the resolver marks the fill complete.
5. Add no-DB regression coverage for underfilled and legacy no-fill cases.
6. Run focused tests, typecheck, guardrails, lint, and diff check.

## Acceptance Criteria
- LIVE `FILLED` with partial exchange fills persists as `PARTIALLY_FILLED`.
- LIVE underfilled entry does not apply immediate position lifecycle.
- LIVE `FILLED` without fill rows keeps existing full-fill compatibility.
- PAPER fill behavior is unchanged.
- Available validation gates pass.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` expectations satisfied for this tiny live order
  fill-resolution slice.
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
  - `pnpm --filter api exec vitest run src/modules/orders/orders.liveFillResolution.test.ts src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/engine/executionOrchestrator.service.test.ts --run` PASS (`22/22`).
  - `pnpm --filter api exec vitest run src/modules/orders/orders.liveFillResolution.test.ts src/modules/orders/orders.exchangeEvents.helpers.test.ts src/modules/engine/executionOrchestrator.service.test.ts src/modules/engine/runtimePositionAutomation.service.test.ts --run` PASS (`58/58`).
  - `pnpm --filter api run typecheck` PASS.
  - `pnpm run quality:guardrails` PASS.
  - `pnpm run lint` PASS.
  - `git diff --check` PASS with CRLF warnings only.
- Blocked validation:
  - DB-backed order/exchange lifecycle suites remain pending because local
    Postgres at `localhost:5432` is unavailable in this environment.
- Manual checks: reviewed `openOrder` lifecycle gate to confirm underfilled
  LIVE orders do not call immediate position lifecycle.
- Screenshots/logs: not applicable.
- High-risk checks: local position quantity inflation is covered by no-DB
  resolver regression.

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/reference/position-management-pnl-lifecycle-contract.md`,
  `docs/architecture/reference/assistant-runtime-contract.md`.
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
- Rollback note: revert this slice to restore previous live entry
  close-on-status behavior.
- Observability or alerting impact: none in this tiny slice.
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `openOrder` persisted live filled quantity as requested quantity even
  when exchange fills summed lower.
- Gaps: no no-DB regression covered adapter status/fill quantity disagreement.
- Inconsistencies: close paths were fail-closed after PMPLC-12/13 while entry
  path still trusted status over fill quantity.
- Architecture constraints: runtime order/position lifecycle must not invent
  unconfirmed exchange exposure.

### 2. Select One Priority Task
- Selected task: fail closed on underfilled LIVE entry fill resolution.
- Priority rationale: prevents inflated local quantity and downstream margin,
  PnL, and DCA sizing drift.
- Why other candidates were deferred: full partial-fill lifecycle accounting is
  a larger future vertical slice.

### 3. Plan Implementation
- Files or surfaces to modify: order service, no-DB fill-resolution test,
  planning/context docs.
- Logic: derive persisted status and filled quantity from exchange fill truth
  when available.
- Edge cases: partial fills, no fill rows, exact fills, rounding tolerance.

### 4. Execute Implementation
- Implementation notes: kept backward compatibility for adapters that report
  `FILLED` without fill rows, while preferring fill quantity when rows exist.

### 5. Verify and Test
- Validation performed: no-DB resolver regression, exchange helper and runtime
  suites, API typecheck, guardrails, lint, diff check.
- Result: PASS for available validations; DB-backed suites remain blocked by
  unavailable local Postgres.

### 6. Self-Review
- Simpler option considered: always trusting fill rows would break legacy
  adapters that do not provide fill rows, so the resolver only fails closed
  when partial fill truth is actually present.
- Technical debt introduced: no
- Scalability assessment: resolver is explicit and can feed a future partial
  fill lifecycle slice.
- Refinements made: immediate lifecycle now uses the resolved live filled
  quantity only when complete.

### 7. Update Documentation and Knowledge
- Docs updated: this task doc, MVP queue, MVP execution plan.
- Context updated: project state and task board.
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

## Integration Evidence
- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: not applicable
- DB schema and migrations verified: blocked by unavailable local Postgres for
  DB-backed order lifecycle suites.
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: yes, no-DB resolver regression plus branch review.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: LIVE runtime operator.
- Existing workaround or pain: underfilled live entry could inflate local
  position quantity.
- Smallest useful slice: persist underfilled live entry as partial and skip
  immediate position lifecycle.
- Success metric or signal: regression and focused suites pass.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: not applicable

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: live order entry and position creation.
- SLI: live fill-resolution test pass rate.
- SLO: relevant regression suites pass before release.
- Error budget posture: healthy for covered scope; DB lifecycle validation
  pending when local Postgres is available.
- Health/readiness check: not applicable
- Logs, dashboard, or alert route: not changed in this tiny slice.
- Smoke command or manual smoke: focused vitest suites.
- Rollback or disable path: revert this slice.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: exchange execution and position data.
- Trust boundaries: exchange order adapter to local order/position lifecycle.
- Permission or ownership checks: existing order ownership checks retained.
- Abuse cases: incomplete fill data must not inflate local exposure.
- Secret handling: no changes.
- Security tests or scans: not applicable.
- Fail-closed behavior: partial fill truth blocks full local lifecycle.
- Residual risk: full partial-fill lifecycle accounting remains a separate
  future slice.

## AI Testing Evidence
- `AI_TESTING_PROTOCOL.md` reviewed: not applicable
- Memory consistency scenarios: not applicable
- Multi-step context scenarios: not applicable
- Adversarial or role-break scenarios: not applicable
- Prompt injection checks: not applicable
- Data leakage and unauthorized access checks: not applicable
- Result: not applicable

## Result Report
- Task summary: LIVE order creation now persists partial fill truth when
  exchange fill rows are below requested quantity and skips full position
  lifecycle until complete.
- Files changed:
  - `apps/api/src/modules/orders/orders.service.ts`
  - `apps/api/src/modules/orders/orders.liveFillResolution.test.ts`
  - `docs/planning/position-management-live-entry-underfill-task-2026-05-06.md`
- How tested: no-DB resolver regression, focused runtime/order suites, API
  typecheck, guardrails, lint, and diff check.
- What is incomplete: DB-backed order lifecycle suites should be rerun when
  local Postgres is available.
- Next steps: continue with the next smallest money-impacting v1 gap from the
  active PMPLC queue.
- Decisions made: live adapter status is compatible fallback only when no fill
  quantity truth is available.
