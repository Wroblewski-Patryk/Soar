# Task

## Header
- ID: RUNTIME-AUDIT-115
- Title: Include carried open positions in runtime symbol stats
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: QA/Test
- Depends on: RUNTIME-AUDIT-114
- Priority: P1
- Iteration: 115
- Operation Mode: TESTER

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime session position reads count open positions that existed by the session
window end. Runtime symbol-stats live rows currently require open positions to
have `openedAt >= session.startedAt`, so positions opened before the session but
still active during it can be missing from symbol summary open PnL/counts.

## Goal
Make runtime symbol-stats open-position metrics use the same carried-position
window semantics as the session positions endpoint.

## Success Signal
- User or operator problem: dashboard symbol stats can show no open position or
  missing open PnL while the positions panel shows an active carried position.
- Expected product or reliability outcome: symbol stats and positions panels
  agree for positions active during the session window.
- How success will be observed: focused unit test verifies open-position window
  scope is `openedAt <= windowEnd`.
- Post-launch learning needed: no

## Deliverable For This Stage
Closed implementation, verification, documentation, and commit-ready evidence
for carried open-position symbol-stats parity.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionWindow.ts`
- `apps/api/src/modules/bots/botsRuntimeRead.repository.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Add a pure helper for runtime session open-position window semantics.
2. Use it in symbol-stats live open-position reads.
3. Add focused unit coverage for carried open-position scope.
4. Run targeted bot runtime read tests plus typecheck, guardrails, lint, and
   diff review.
5. Update task, project state, and queue docs.

## Acceptance Criteria
- Symbol-stats open-position rows include positions opened before session start
  when they are still active by `windowEnd`.
- The query remains bounded by user, bot, symbol, status, sync state, and
  management mode.
- Closed-position window semantics from RUNTIME-AUDIT-114 remain unchanged.

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
- Tests: `pnpm --filter api exec vitest run src/modules/bots/runtimeSessionPositionsRead.service.test.ts` (`6/6`), `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`, `pnpm run lint`
- Manual checks: diff review
- Screenshots/logs: not applicable
- High-risk checks: ownership scope unchanged

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
- Rollback note: revert this commit to restore previous symbol-stats live row
  scope
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: symbol-stats live open-position reads require `openedAt >=
  session.startedAt`.
- Gaps: carried open positions can be visible in positions read but absent from
  symbol-stats open PnL/counts.
- Inconsistencies: session positions use `openedAt <= windowEnd`; symbol stats
  use `gte/lte`.
- Architecture constraints: dashboard read models must reflect session-window
  truth without changing execution behavior.

### 2. Select One Priority Task
- Selected task: include carried open positions in runtime symbol stats.
- Priority rationale: directly affects dashboard parity for active positions.
- Why other candidates were deferred: broader LIVE imported ownership parity in
  symbol stats is a larger slice and should be audited separately.

### 3. Plan Implementation
- Files or surfaces to modify: session position window helper, runtime read
  repository, focused unit test, planning/context docs.
- Logic: open rows active during a session window require `openedAt <=
  windowEnd`.
- Edge cases: positions opened before session start, active sessions with
  current `windowEnd`, finished sessions with `finishedAt`.

### 4. Execute Implementation
- Implementation notes: added `buildRuntimeSessionOpenPositionWindow` and used
  it in symbol-stats live open-position reads so carried positions are included
  by `openedAt <= windowEnd`.

### 5. Verify and Test
- Validation performed: focused runtime session position unit test, API
  typecheck, guardrails, lint, and diff review.
- Result: passed.

### 6. Self-Review
- Simpler option considered: inline `openedAt: { lte: windowEnd }`, but the
  shared helper keeps open/closed window semantics visible and testable.
- Technical debt introduced: no
- Scalability assessment: minimal query widening to the intended active-window
  semantics, still bounded by user, bot, symbol, status, sync state, and
  management mode.
- Refinements made: kept the larger LIVE imported ownership audit out of this
  slice.

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
This is a read-model parity fix only. It does not change orders, positions,
execution, or exchange integration.

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
- User or operator affected: dashboard operator reviewing runtime symbol stats
- Existing workaround or pain: symbol stats can under-report active carried
  positions.
- Smallest useful slice: open-position window parity.
- Success metric or signal: focused unit test passes and symbol stats query
  uses carried-position scope.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: bot runtime session dashboard symbol stats.
- SLI: symbol stats open metrics match positions active in the session window.
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
- Trust boundaries: existing userId, botId, and symbol scopes.
- Permission or ownership checks: unchanged.
- Abuse cases: no cross-user or cross-bot reads introduced.
- Secret handling: none.
- Security tests or scans: typecheck and focused unit assertion.
- Fail-closed behavior: scope remains bounded by bot/user/symbol and active
  position state.
- Residual risk: DB-backed e2e remains dependent on local PostgreSQL
  availability.

## Result Report

- Task summary: runtime symbol-stats open-position live rows now include
  positions opened before session start when they remain active by window end.
- Files changed: runtime read repository, session position window helper,
  focused unit test, planning/context docs.
- How tested: focused runtime session position test (`6/6`), API typecheck,
  guardrails, lint, and diff review.
- What is incomplete: DB-backed e2e was not run because previous local
  PostgreSQL-backed suites have been unavailable in this environment.
- Next steps: continue auditing remaining runtime/dashboard parity drifts,
  especially LIVE imported ownership in symbol stats.
- Decisions made: use shared window helper and defer broader ownership-scope
  work to a separate slice.
