# Task

## Header
- ID: RUNTIME-AUDIT-117
- Title: Restrict carry-over session trades to open anchors
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-116
- Priority: P1
- Iteration: 117
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
The runtime trades panel includes carry-over positions so an imported/open
position can be explained in a later session. Its trade query currently pulls
all trades for carry-over positions with `executedAt <= rangeEnd`, which can
include DCA/fee rows from before the session window.

## Goal
Keep carry-over visibility for imported open anchors while preventing pre-window
DCA/fee history from leaking into the current session trades panel.

## Success Signal
- User or operator problem: session trades can include historical rows and fees
  from before the selected session.
- Expected product or reliability outcome: trades panel reflects session-window
  activity plus only the necessary carry-over open anchor.
- How success will be observed: focused helper tests show carry-over scope adds
  only persisted imported `OPEN` anchors outside the window.
- Post-launch learning needed: no

## Deliverable For This Stage
Closed implementation, verification, documentation, and commit-ready evidence
for carry-over session trade window scope.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Scope
- `apps/api/src/modules/bots/runtimeSessionTradesRead.service.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Add a pure helper for carry-over trade window scope.
2. Use it in the position-linked trade query.
3. Add focused unit coverage for normal and carry-over scopes.
4. Run targeted tests plus typecheck, guardrails, lint, and diff review.
5. Update task, project state, and queue docs.

## Acceptance Criteria
- Normal session trade scope remains `executedAt >= rangeStart && <= rangeEnd`.
- Carry-over mode adds only persisted imported open anchors before the window.
- Pre-window DCA/CLOSE/fee rows are not pulled solely because the position is
  carried over.
- Existing synthetic anchor behavior remains available when no persisted anchor
  trade exists.

## Definition of Done
- [x] `DEFINITION_OF_DONE.md` standards are satisfied for this slice.
- [x] Focused tests pass.
- [x] Typecheck, guardrails, and lint pass.
- [x] Documentation and queue state are updated.

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
- Tests: `pnpm --filter api exec vitest run src/modules/bots/runtimeSessionPositionsRead.service.test.ts` (`10/10`), `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`, `pnpm run lint`
- Manual checks: diff review
- Screenshots/logs: not applicable
- High-risk checks: query scope narrowed only

## Architecture Evidence
- Architecture source reviewed: `docs/architecture/architecture-source-of-truth.md`,
  `docs/architecture/reference/runtime-signal-merge-contract.md`
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
- Rollback note: revert this commit to restore previous carry-over trade query
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: carry-over position trade query includes every pre-window trade up to
  range end.
- Gaps: trades panel can show historical DCA/fee rows outside the session.
- Inconsistencies: positions/symbol-stats windowing is now bounded, while
  trades can still leak older lifecycle rows.
- Architecture constraints: read model should preserve carry-over explanation
  without changing execution or persistence.

### 2. Select One Priority Task
- Selected task: restrict carry-over session trades to open anchors.
- Priority rationale: directly affects dashboard session history and fees.
- Why other candidates were deferred: broader trade ownership refactoring is
  larger and not needed for this slice.

### 3. Plan Implementation
- Files or surfaces to modify: runtime trades service, focused unit test,
  planning/context docs.
- Logic: carry-over query includes in-window trades plus persisted imported
  open-anchor rows only.
- Edge cases: explicit from/to disables carry-over; synthetic anchors still work
  when no persisted trade exists.

### 4. Execute Implementation
- Implementation notes: added `buildRuntimeTradeCarryOverWindowClause` and used
  it for position-linked runtime trade reads, preserving in-window rows and
  only the persisted imported `OPEN` anchor for carry-over positions.

### 5. Verify and Test
- Validation performed: focused runtime session position unit test, API
  typecheck, guardrails, lint, and diff review.
- Result: passed.

### 6. Self-Review
- Simpler option considered: disabling carry-over pre-window trades entirely,
  but that would lose persisted imported open anchors. The selected scope keeps
  the anchor and excludes unrelated historical lifecycle rows.
- Technical debt introduced: no
- Scalability assessment: narrower query reduces row volume for carry-over
  positions.
- Refinements made: kept synthetic anchor behavior unchanged.

### 7. Update Documentation and Knowledge
- Docs updated: task contract, MVP queue, task board, project state.
- Context updated: yes
- Learning journal updated: not applicable

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
- [x] Learning journal was updated if a recurring pitfall was confirmed.

## Notes
Read-model narrowing only. Execution, imports, and persisted trades are
unchanged.

## Production-Grade Required Contract

Every task must include these mandatory sections before it can move to `READY`
or `IN_PROGRESS`: Goal, Scope, Implementation Plan, Acceptance Criteria,
Definition of Done, and Result Report.

## Integration Evidence

- `INTEGRATION_CHECKLIST.md` reviewed: yes
- Real API/service path used: yes
- Endpoint and client contract match: yes
- DB schema and migrations verified: yes
- Loading state verified: not applicable
- Error state verified: not applicable
- Refresh/restart behavior verified: not applicable
- Regression check performed: focused runtime session position unit tests.

## Product / Discovery Evidence
- Problem validated: yes
- User or operator affected: dashboard operator reviewing session trades.
- Existing workaround or pain: historical pre-window fees/trades can appear in
  current session.
- Smallest useful slice: carry-over trade window scope.
- Success metric or signal: focused unit tests pass and trade query is narrowed.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: bot runtime session trades panel.
- SLI: trades panel rows and fees belong to the session window or a carry-over
  open anchor.
- SLO: no change.
- Error budget posture: not applicable
- Health/readiness check: no change.
- Logs, dashboard, or alert route: no change.
- Smoke command or manual smoke: focused unit tests.
- Rollback or disable path: revert this commit.

## AI Testing Evidence
Not applicable.

## Security / Privacy Evidence
- `docs/security/secure-development-lifecycle.md` reviewed: yes
- Data classification: user trading and runtime dashboard data.
- Trust boundaries: existing userId, botId, positionId, and symbol scopes.
- Permission or ownership checks: unchanged.
- Abuse cases: no cross-user or cross-bot reads introduced.
- Secret handling: none.
- Security tests or scans: typecheck and focused unit assertion.
- Fail-closed behavior: scope is narrowed for carry-over positions.
- Residual risk: DB-backed e2e remains dependent on local PostgreSQL
  availability.

## Result Report

- Task summary: runtime trades carry-over query now includes in-window trades
  and only persisted imported open anchors outside the window.
- Files changed: runtime session trades service, focused unit test,
  planning/context docs.
- How tested: focused runtime session position test (`10/10`), API typecheck,
  guardrails, lint, and diff review.
- What is incomplete: DB-backed e2e was not run because previous local
  PostgreSQL-backed suites have been unavailable in this environment.
- Next steps: continue auditing remaining runtime/dashboard parity drifts.
- Decisions made: preserve carry-over open anchors while excluding pre-window
  DCA/CLOSE/fee rows.
