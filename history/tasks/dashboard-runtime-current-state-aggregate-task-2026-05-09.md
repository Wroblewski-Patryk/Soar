# Dashboard Runtime Current-State Aggregate Task 2026-05-09

## Header
- ID: DASH-RUNTIME-CURRENT-AGGREGATE-2026-05-09
- Title: Keep dashboard aggregate current state aligned with running runtime sessions
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: existing runtime monitoring aggregate API
- Priority: P1
- Iteration: 2026-05-09-dashboard-runtime-current-state
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode is set explicitly for this derived runtime correctness iteration.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The dashboard home runtime widgets consume `GET /dashboard/bots/:id/runtime-monitoring/aggregate`
for API-first bot monitoring data. The aggregate read model deliberately mixes
historical completed-session rows with the latest running-session projection for
history and totals, but current open positions, open orders, dynamic-stop
visibility, unrealized PnL, and capital baseline must represent the active
runtime state when a `RUNNING` session exists.

## Goal
Make dashboard current-state data derive from the freshest `RUNNING` aggregate
row when one exists, while preserving historical aggregation across completed
rows for closed history and trade totals.

## Scope
- `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `.agents/state/next-steps.md`

## Implementation Plan
1. Add a helper that selects current aggregate rows: all running rows when any
   running row exists, otherwise all rows.
2. Use the selected current rows for current positions, open orders,
   dynamic-stop columns, unrealized PnL, open counts, and capital summary.
3. Add focused regression coverage proving current rows prefer running sessions
   over fresher completed rows.
4. Run focused API tests and update source-of-truth context.

## Acceptance Criteria
- Current aggregate position/open-order data prefers the freshest running
  session row when running rows exist.
- Completed rows remain available for projected history/trade aggregation.
- Focused API regression tests pass.
- Repository source-of-truth files record the change and next task.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` satisfied for this scoped runtime read-model fix.
- [x] Regression test added for running-current row selection.
- [x] Relevant focused tests pass.
- [x] No new systems, bypasses, fake data, or duplicated read paths introduced.

## Forbidden
- New dashboard data pipelines.
- Mock-only product behavior.
- Exchange adapter or order execution changes.
- Treating production protected UI clickthrough as completed without auth.

## Validation Evidence
- Tests:
  - `apps/api/node_modules/.bin/vitest.CMD run src/modules/bots/runtimeSessionPositionsRead.service.test.ts` => PASS, 18/18.
  - `apps/api/node_modules/.bin/tsc.CMD --noEmit` => PASS.
  - `node scripts/repoGuardrails.mjs` => PASS.
- Manual checks: inspected dashboard hook/API aggregate path and confirmed
  dashboard consumes aggregate `positions.openItems`, `openOrders`,
  `positions.summary`, and `symbolStats` through the existing service contract.
- Screenshots/logs: not applicable; API read-model fix only.
- High-risk checks: live-money execution path not touched.

## Architecture Evidence
- Architecture source reviewed:
  - `docs/architecture/04_runtime-contexts.md`
  - `docs/architecture/06_execution-lifecycle.md`
  - `docs/architecture/reference/runtime-signal-merge-contract.md`
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not expected

## Deployment / Ops Evidence
- Deploy impact: low
- Env or secret changes: none
- Health-check impact: none
- Smoke steps updated: no
- Rollback note: revert this single read-model commit if aggregate current
  state selection regresses.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: current-state selection sorted all aggregate rows by freshness, so a
  non-running row could be selected for dashboard current positions/capital.
- Gaps: no focused helper regression existed for this current-row selector.
- Inconsistencies: history projection already has explicit running-session
  dedupe, but current state had no separate selector.
- Architecture constraints: dashboard runtime context must remain bot-scoped
  and current state must not be guessed from unrelated venue/runtime data.

### 2. Select One Priority Task
- Selected task: fix aggregate current-state row selection.
- Priority rationale: directly affects dashboard truthfulness for active bots.
- Why other candidates were deferred: production clickthrough remains blocked
  on authenticated/admin access and protected evidence inputs.

### 3. Plan Implementation
- Files or surfaces to modify: API aggregate read model, focused API test,
  canonical context docs.
- Logic: prefer running rows for current state; fall back to all rows when no
  running session exists.
- Edge cases: multiple running sessions, no running sessions, capital summary
  present only on selected current rows.

### 4. Execute Implementation
- Implementation notes: added `selectRuntimeAggregateCurrentRows` and switched
  current positions/capital selection to sort only current rows. Historical
  position/trade projection still uses the existing projected rows helper.

### 5. Verify and Test
- Validation performed: focused API helper test, API typecheck, repository
  guardrails.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: sorting all rows by freshness only; rejected
  because it can select completed rows while a bot is currently running.
- Technical debt introduced: no
- Scalability assessment: helper keeps current-state semantics explicit and
  reusable inside the existing aggregate read model.
- Refinements made: kept the helper separate from historical projection logic
  so closed history and current runtime state remain explicit.

### 7. Update Documentation and Knowledge
- Docs updated:
  - `history/tasks/dashboard-runtime-current-state-aggregate-task-2026-05-09.md`
- Context updated:
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/next-steps.md`
- Learning journal updated: not applicable unless a recurring pitfall is
  confirmed.

## Review Checklist
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected for this iteration.
- [x] Operation mode declared.
- [x] Current stage is declared.
- [x] Deliverable for the current stage is complete.
- [x] Architecture alignment confirmed after implementation.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.

## Result Report
- Task summary: Dashboard aggregate current state now prefers running-session
  rows for open positions, open orders, dynamic-stop visibility, unrealized PnL,
  open counts, and capital summary while preserving historical projection for
  closed history and trades.
- Files changed:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
  - `history/tasks/dashboard-runtime-current-state-aggregate-task-2026-05-09.md`
  - `.codex/context/TASK_BOARD.md`
  - `.codex/context/PROJECT_STATE.md`
  - `.agents/state/next-steps.md`
- How tested:
  - `apps/api/node_modules/.bin/vitest.CMD run src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
  - `apps/api/node_modules/.bin/tsc.CMD --noEmit`
  - `node scripts/repoGuardrails.mjs`
- What is incomplete: production authenticated dashboard clickthrough remains
  blocked on production app/admin access.
- Next steps: add an API/Web integration regression that proves the dashboard
  selected snapshot renders the aggregate current-state rows from a running
  bot.
- Decisions made: no architecture change; reuse the existing aggregate API
  path rather than adding a new dashboard data source.
