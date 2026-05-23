# Task

## Header
- ID: RUNTIME-AUDIT-92
- Title: fix(api-engine): align dedupe linked orders with sync state
- Task Type: fix
- Current Stage: verification
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-91
- Priority: P1
- Iteration: 92
- Operation Mode: BUILDER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime execution dedupe reuses or blocks repeated execution intents by looking
at an existing dedupe row and its linked order. Previous runtime slices aligned
active positions and orders with `syncState=IN_SYNC`, but this linked-order
dedupe path still trusted active order statuses without checking `syncState`.

## Goal
Prevent stale local order rows from keeping runtime execution dedupe in a
submitted or inflight state after reconciliation has marked the order
`ORPHAN_LOCAL`.

## Scope
- `apps/api/src/modules/engine/runtimeExecutionDedupe.service.ts`
- `apps/api/src/modules/engine/runtimeExecutionDedupe.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`
- `docs/planning/mvp-execution-plan.md`

## Implementation Plan
1. Select linked order `syncState` in runtime execution dedupe.
2. Reuse linked `FILLED`, `PENDING`, `OPEN`, or `PARTIALLY_FILLED` orders only
   when the linked order is `IN_SYNC`.
3. Treat a linked non-synced order as stale immediately so the dedupe row is
   reset for a fresh execution attempt.
4. Add focused unit coverage for an `ORPHAN_LOCAL` linked open order that would
   previously block execution.
5. Run focused tests, typecheck, guardrails, lint, and diff check.

## Acceptance Criteria
- A linked open order with `syncState=IN_SYNC` is still reused as submitted.
- A linked filled order with `syncState=IN_SYNC` is still reused as completed.
- A linked open order with `syncState=ORPHAN_LOCAL` does not return submitted or
  inflight and resets the dedupe row for execution.
- No new runtime path bypasses the approved lifecycle contract.

## Definition of Done
- [x] Implementation matches the runtime lifecycle boundary in architecture
  docs.
- [x] Focused tests cover synced and stale linked-order behavior.
- [x] Relevant validation commands pass.
- [x] Context and planning docs are updated with evidence.

## Forbidden
- New systems or duplicate dedupe mechanisms.
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
- Rollback note: revert this commit to restore previous dedupe linked-order
  reuse behavior.
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: runtime execution dedupe linked-order reuse trusts order status
  without `syncState`.
- Gaps: stale `ORPHAN_LOCAL` open orders can keep an execution intent reused or
  inflight even after active order lists and lifecycle ignore them.
- Inconsistencies: dashboard/runtime active truth requires `IN_SYNC`; this
  dedupe lookup did not.
- Architecture constraints: accepted runtime intents still pass lifecycle
  guardrails and must not treat stale local rows as active exchange truth.

### 2. Select One Priority Task
- Selected task: align runtime execution dedupe linked-order lookup with sync
  state.
- Priority rationale: stale dedupe can directly explain paper/live conditions
  being met while no position opens.
- Why other candidates were deferred: order services and lifecycle have broader
  surfaces; this is the smallest runtime-blocking slice.

### 3. Plan Implementation
- Files or surfaces to modify: runtime execution dedupe service, focused tests,
  planning/context docs.
- Logic: require `IN_SYNC` before reusing linked active/filled orders; force
  stale reset when the linked order is non-synced.
- Edge cases: synced open remains submitted; synced filled remains completed;
  stale linked open does not block recent dedupe rows.

### 4. Execute Implementation
- Implementation notes: selected linked order `syncState`, reused linked
  submitted/completed orders only when `syncState=IN_SYNC`, and reset the
  dedupe row immediately when the linked order is stale or local-only.

### 5. Verify and Test
- Validation performed: runtime execution dedupe suite, execution orchestrator
  suite, API typecheck, repository guardrails, lint, and diff check.
- Result: PASS.

### 6. Self-Review
- Simpler option considered: only add `syncState` to active status checks.
- Technical debt introduced: no
- Scalability assessment: keeps a single active-truth contract without adding
  new mechanisms.
- Refinements made: kept synced order reuse semantics unchanged while making
  stale linked orders release the dedupe lock immediately.

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
- Task summary: runtime execution dedupe now treats linked orders as reusable
  active truth only when the order is `IN_SYNC`.
- Files changed:
  `apps/api/src/modules/engine/runtimeExecutionDedupe.service.ts`,
  `apps/api/src/modules/engine/runtimeExecutionDedupe.service.test.ts`, and
  planning/context docs.
- How tested: runtime execution dedupe suite (`9/9`), execution orchestrator
  suite (`17/17`), API typecheck, repository guardrails, lint, and diff check.
- What is incomplete: none.
- Next steps: continue auditing remaining order lifecycle and dashboard parity
  paths for stale active-truth drift.
- Decisions made: non-synced linked orders release runtime dedupe immediately
  because they are not active exchange truth.
