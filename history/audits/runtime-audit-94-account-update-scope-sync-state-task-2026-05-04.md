# Task

## Header
- ID: RUNTIME-AUDIT-94
- Title: fix(api-orders): scope account updates to synced positions
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-93
- Priority: P1
- Iteration: 94
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
LIVE Binance account updates resolve a local position scope by user, symbol,
side, market, and `status=OPEN`. Previous runtime and dashboard slices aligned
active position truth with `syncState=IN_SYNC`, but this account-update scope
still considered stale local open rows.

## Goal
Ensure LIVE account updates refresh or close only synced active positions and
do not let stale local rows create false ambiguity or receive exchange-account
state updates.

## Scope
- `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`
- `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Add `syncState=IN_SYNC` to LIVE account-update position scope resolution.
2. Add focused coverage where a stale same-symbol local orphan coexists with a
   valid synced position.
3. Verify that account update still refreshes the synced position and ignores
   the stale row.
4. Run exchange-event tests, API typecheck, guardrails, lint, and diff check.

## Acceptance Criteria
- Account updates select only `OPEN` + `IN_SYNC` positions.
- A same-symbol `ORPHAN_LOCAL` open row does not create ambiguous scope.
- The valid synced position still updates from the account event.
- No account update path bypasses market and live-mode filters.

## Definition of Done
- [x] Implementation fits the approved LIVE account-update lifecycle.
- [x] Focused tests cover stale same-symbol local rows.
- [x] Relevant validation commands pass.
- [x] Context and planning docs are updated with evidence.

## Forbidden
- New reconciliation systems or duplicate scope resolvers.
- Temporary bypasses or mock-only behavior.
- Architecture changes without explicit approval.

## Architecture Evidence
- Architecture source reviewed:
  `docs/architecture/reference/runtime-signal-merge-contract.md`,
  `docs/architecture/architecture-source-of-truth.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Follow-up architecture doc updates: none

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this commit to restore previous account-update scope
  behavior.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: account-update scope resolves open positions without `syncState`.
- Gaps: stale local open rows can be updated or can make a valid active scope
  look ambiguous.
- Inconsistencies: dashboard/runtime active position truth requires
  `syncState=IN_SYNC`; this exchange-account path did not.
- Architecture constraints: LIVE account events must update only active synced
  local truth for the matching market.

### 2. Select One Priority Task
- Selected task: align LIVE account-update scope with active position sync
  state.
- Priority rationale: account updates directly affect dashboard-visible
  quantity, entry price, unrealized PnL, and external close state.
- Why other candidates were deferred: order-trade update matching has separate
  exchange-order-id concerns; this scope fix is smaller and isolated.

### 3. Plan Implementation
- Files or surfaces to modify: exchange events service, focused tests,
  planning/context docs.
- Logic: add `syncState=IN_SYNC` beside `status=OPEN` in scope resolution.
- Edge cases: stale local same-symbol row ignored; active synced row updated;
  paper rows remain ignored through existing live wallet/bot filters.

### 4. Execute Implementation
- Implementation notes: account-update scope now requires `syncState=IN_SYNC`;
  test coverage includes a stale same-symbol `ORPHAN_LOCAL` row in a separate
  live bot scope.

### 5. Verify and Test
- Validation performed: exchange-events suite, API typecheck, repository
  guardrails, lint, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: filtering after query.
- Technical debt introduced: no
- Scalability assessment: reuses existing active-truth field and scope
  resolver.
- Refinements made: fixture uses separate live bot scope to respect current DB
  uniqueness constraints.

### 7. Update Documentation and Knowledge
- Docs updated: task evidence, MVP next commits queue, MVP execution plan.
- Context updated: task board and project state.
- Learning journal updated: not applicable.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected in this iteration.
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

## Result Report
- Task summary: LIVE account-update scope now ignores stale local positions.
- Files changed:
  `apps/api/src/modules/orders/orders.exchangeEvents.service.ts`,
  `apps/api/src/modules/orders/orders.exchangeEvents.service.test.ts`, and
  planning/context docs.
- How tested: exchange-events suite (`6/6`), API typecheck, repository
  guardrails, lint, and diff check.
- What is incomplete: none.
- Next steps: continue auditing order-trade update matching and lifecycle paths
  for stale active-truth drift.
- Decisions made: account updates select only `OPEN` and `IN_SYNC` local
  positions.
