# Task

## Header
- ID: RUNTIME-AUDIT-52
- Title: Preserve aggregate symbols-tracked count under item limits
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-51
- Priority: P1
- Iteration: 70
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Aggregate `symbolStats.summary` now composes per-session summary truth, but
`sessionDetail.symbolsTracked` still comes from visible aggregate symbol rows.

## Goal
Keep aggregate `sessionDetail.symbolsTracked` truthful when `perSessionLimit`
hides some symbol-stat rows.

## Success Signal
- User or operator problem: dashboard aggregate metadata must not imply the bot
  tracked fewer markets just because the visible symbol list is limited.
- Expected product or reliability outcome: aggregate metadata uses session
  symbol count truth while visible rows remain limited.
- How success will be observed: `perSessionLimit=1` with two session symbol
  stats returns one visible row and `symbolsTracked = 2`.
- Post-launch learning needed: no

## Deliverable For This Stage
Implement one aggregate read-model fix with focused regression coverage.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Definition of Done
- [x] Aggregate `sessionDetail.symbolsTracked` uses per-session tracked symbol
  truth.
- [x] Visible `symbolStats.items` remains limited.
- [x] Relevant aggregate tests, typecheck, guardrails, lint, and diff checks
  pass.

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
- High-risk checks: read-only dashboard metadata path, no trading side effects

## Architecture Evidence (required for architecture-impacting tasks)
- Architecture source reviewed: aggregate read model composes session read-model
  contracts.
- Fits approved architecture: yes
- Mismatch discovered: no
- Decision required from user: no
- Approval reference if architecture changed: not applicable
- Follow-up architecture doc updates: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: `sessionDetail.symbolsTracked` used visible aggregate
  `symbolItems.length`.
- Gaps: aggregate tests did not assert symbols-tracked metadata under
  `perSessionLimit`.
- Inconsistencies: session list already exposes full `symbolsTracked`; aggregate
  metadata was visible-row-based.
- Architecture constraints: reuse session-level metadata instead of querying the
  database again.

### 2. Select One Priority Task
- Selected task: preserve aggregate symbols-tracked count under item limits.
- Priority rationale: TESTER-mode metadata drift directly affects dashboard
  trust and market coverage interpretation.
- Why other candidates were deferred: wallet/capital flicker and LIVE import
  ownership remain larger separate slices.

### 3. Plan Implementation
- Files or surfaces to modify:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
  - canonical context and planning docs
- Logic: compute aggregate `symbolsTracked` from full session metadata, not
  visible symbol items.
- Edge cases: empty aggregate remains zero; multiple sessions add their
  tracked-symbol counts; visible rows remain limited.

### 4. Execute Implementation
- Implementation notes: added a `symbolsTracked` assertion to the aggregate
  hidden-symbol regression; changed aggregate metadata to compose from
  `activeSessions.symbolsTracked`.

### 5. Verify and Test
- Validation performed: focused regression before and after the fix,
  monitoring aggregate e2e, runtime-scope e2e, API typecheck, guardrails, lint,
  and diff check.
- Result: PASS. Pre-fix aggregate metadata returned `symbolsTracked=1` from
  visible rows; after the fix it returns `2` from session metadata.

### 6. Self-Review
- Simpler option considered: keep `symbolItems.length`; rejected because it is
  visible-row-limited.
- Technical debt introduced: no
- Scalability assessment: reuses already-loaded session rows.
- Refinements made: none needed; the existing session-list projection already
  has the correct full count.

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
- Runtime monitoring aggregate metadata.
- Aggregate monitoring E2E regression coverage.
- Canonical planning and context documentation.

## Implementation Plan
1. Add failing assertion for hidden symbol rows and `symbolsTracked`.
2. Compose aggregate symbols-tracked metadata from session metadata.
3. Run focused and relevant validations.
4. Update task, project state, task board, and planning queue.

## Acceptance Criteria
- `symbolStats.items` remains limited.
- `sessionDetail.symbolsTracked` reflects full tracked symbols.
- Existing aggregate tests remain green.

## Result Report

- Task summary: aggregate `sessionDetail.symbolsTracked` now reports full
  session tracked-symbol metadata under visible symbol item limits.
- Files changed:
  - `apps/api/src/modules/bots/runtimeMonitoringAggregateRead.service.ts`
  - `apps/api/src/modules/bots/bots.monitoring-aggregate.e2e.test.ts`
  - `.codex/context/PROJECT_STATE.md`
  - `.codex/context/TASK_BOARD.md`
  - `docs/planning/mvp-next-commits.md`
  - `history/audits/runtime-audit-52-aggregate-symbols-tracked-limit-task-2026-05-03.md`
- How tested: focused failing-then-passing aggregate regression, monitoring
  aggregate e2e (`13/13`), runtime-scope e2e (`13/13`), API typecheck,
  repository guardrails, lint, and `git diff --check`.
- What is incomplete: nothing for this slice.
- Next steps: continue auditing LIVE import, wallet/capital, markets,
  strategies, and position close-management dashboard parity.
- Decisions made: aggregate visible symbol rows remain limited; tracked-symbol
  metadata uses session metadata.
