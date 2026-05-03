# Task

## Header
- ID: RUNTIME-AUDIT-51
- Title: Preserve aggregate symbol-stats summaries under item limits
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-50
- Priority: P1
- Iteration: 69
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Session symbol-stats now keep visible `items` limited while returning full
summary truth. The aggregate monitoring read model still reduced
`symbolStats.summary` from visible aggregate items.

## Goal
Keep aggregate `symbolStats.summary` and aggregate header signal counters
truthful when `perSessionLimit` hides some session symbol-stat rows.

## Success Signal
- User or operator problem: dashboard aggregate signal totals must not shrink
  when the table shows only one symbol.
- Expected product or reliability outcome: aggregate summary composes
  per-session summary truth while visible symbol rows remain limited.
- How success will be observed: `perSessionLimit=1` with two symbol-stat rows
  returns one visible item and full `summary.totalSignals`.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement one backend aggregate read-model fix with focused regression coverage.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Aggregate symbol-stats summary composes per-session summary truth.
- [x] Aggregate visible symbol-stat items remain limited.
- [x] Relevant runtime aggregate tests, typecheck, guardrails, lint, and diff
  checks pass.

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
- Tests: failing-then-passing focused aggregate regression; monitoring
  aggregate e2e (`13/13`); runtime-scope e2e (`13/13`); API typecheck; lint;
  repository guardrails
- Manual checks: `git diff --check`
- Screenshots/logs: not applicable
- High-risk checks: read-only dashboard aggregation path, no trading side
  effects

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: runtime monitoring aggregate composes existing
  session read-model contracts.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: aggregate `symbolStats.summary` was reduced from visible aggregate
  item rows.
- Gaps: no aggregate regression asserted full symbol summary truth under
  `perSessionLimit`.
- Inconsistencies: session symbol-stats summary was full, aggregate summary was
  still visible-item-based.
- Architecture constraints: compose session truth instead of adding duplicate DB
  queries in the aggregate service.

### 2. Select One Priority Task
- Selected task: preserve aggregate symbol-stats summaries under item limits.
- Priority rationale: directly affects dashboard signal totals and aggregate
  header counters.
- Why other candidates were deferred: LIVE import ownership and wallet flicker
  remain separate slices.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
  - canonical context and planning docs
- Logic: keep aggregate `symbolStats.items` as visible merged rows, but build
  `symbolStats.summary` from per-session `symbolStats.summary`.
- Edge cases: empty aggregate remains zero; visible items remain deterministic;
  aggregate header signal counters reuse the corrected summary.

### 4. Execute Implementation
- Implementation notes: added aggregate regression coverage for hidden
  symbol-stat summary rows under `perSessionLimit=1`; changed aggregate
  `symbolStats.summary` composition to reduce per-session summaries while
  leaving visible `symbolStats.items` unchanged.

### 5. Verify and Test
- Validation performed: focused regression before and after the fix,
  monitoring aggregate e2e, runtime-scope e2e, API typecheck, guardrails, lint,
  and diff check.
- Result: PASS. Pre-fix aggregate summary returned `totalSignals=2` from the
  visible BTC row; after the fix it returns `5` from BTC+ETH per-session
  summary truth.

### 6. Self-Review
- Simpler option considered: keep reducing visible items; rejected because it
  repeats the row-limit drift.
- Technical debt introduced: no
- Scalability assessment: reuses already-loaded session responses and avoids
  new database work.
- Refinements made: aggregate header signal counters now inherit the corrected
  summary because they already read `symbolSummary`.

### 7. Update Documentation and Knowledge
- Docs updated: this task doc, planning queue
- Context updated: project state and task board
- Learning journal updated: not applicable

## Review Checklist (mandatory)
- [x] Process self-audit completed before implementation.
- [x] Autonomous loop evidence covers all seven steps.
- [x] Exactly one priority task was selected for this iteration.
- [x] Operation mode was selected according to iteration rotation.
- [x] Current stage is declared and respected.
- [x] Architecture alignment confirmed.
- [x] Existing systems were reused where applicable.
- [x] No workaround paths were introduced.
- [x] No logic duplication was introduced.
- [x] Definition of Done evidence is attached.
- [x] Relevant validations were run.
- [x] Docs or context were updated if repository truth changed.

## Scope
- Runtime monitoring aggregate symbol-stats read model.
- Aggregate monitoring E2E regression coverage.
- Canonical planning and context documentation.

## Implementation Plan
1. Add failing aggregate regression for hidden symbol-stat summary rows with
   `perSessionLimit=1`.
2. Compose aggregate summary from session summaries while preserving visible
   item behavior.
3. Run focused and relevant validations.
4. Update task, project state, task board, and planning queue.

## Acceptance Criteria
- `symbolStats.items` still respects `perSessionLimit`.
- `symbolStats.summary.totalSignals` and aggregate header signal totals include
  hidden symbols.
- Existing aggregate tests remain green.

## Result Report

- Task summary: aggregate symbol-stats summary and aggregate header signal
  counters now compose full per-session summary truth under visible item
  limits.
- Files changed:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `docs/planning/runtime-audit-51-aggregate-symbol-stats-summary-limit-task-2026-05-03.md`
- How tested: focused failing-then-passing aggregate regression, monitoring
  aggregate e2e (`13/13`), runtime-scope e2e (`13/13`), API typecheck,
  repository guardrails, lint, and `git diff --check`.
- What is incomplete: nothing for this slice.
- Next steps: continue auditing dashboard parity around LIVE import,
  wallet/capital, markets, strategies, and position close-management state.
- Decisions made: aggregate visible symbol rows remain limited; aggregate
  summary uses per-session summary truth.
