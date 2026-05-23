# Task

## Header
- ID: RUNTIME-AUDIT-114
- Title: Bound runtime session closed positions by window end
- Task Type: fix
- Current Stage: post-release
- Status: DONE
- Owner: Backend Builder
- Depends on: RUNTIME-AUDIT-113
- Priority: P1
- Iteration: 114
- Operation Mode: ARCHITECT

## Process Self-Audit
- [x] All seven autonomous loop steps are planned.
- [x] No loop step is being skipped.
- [x] Exactly one priority task is selected.
- [x] Operation mode matches the iteration number.
- [x] The task is aligned with repository source-of-truth documents.

## Context
Runtime session position reads use `resolveSessionWindowEnd(session)` for the
session read window. Open positions are bounded by `openedAt <= windowEnd`, but
closed positions only require `closedAt >= session.startedAt`. That lets a
completed session read include later closes after its finished window.

## Goal
Ensure runtime session closed-position and fee reads are bounded by both
session start and window end.

## Success Signal
- User or operator problem: old runtime session dashboards can show closed PnL
  or fees from positions closed after that session ended.
- Expected product or reliability outcome: session dashboard history reflects
  the exact session window.
- How success will be observed: focused unit test verifies the closed-position
  window includes `gte` and `lte`.
- Post-launch learning needed: no

## Deliverable For This Stage
Closed implementation, verification, documentation, and commit-ready evidence
for runtime session closed-position windowing.

## Constraints
- use existing systems and approved mechanisms
- do not introduce new structures without approval
- do not implement workarounds
- do not duplicate logic
- stay within the declared current stage unless explicit approval changes it

## Scope
- `apps/api/src/modules/bots/runtimeSessionPositionWindow.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.ts`
- `apps/api/src/modules/bots/runtimeSessionPositionsRead.service.test.ts`
- `apps/api/src/modules/bots/runtimeSessionTradeFallbackScope.ts`
- `.codex/context/TASK_BOARD.md`
- `.codex/context/PROJECT_STATE.md`
- `docs/planning/mvp-next-commits.md`

## Implementation Plan
1. Add a small helper for the runtime closed-position session window.
2. Apply it to closed position and fee position reads.
3. Add a focused unit test for start/end bounds.
4. Run targeted runtime session position tests plus typecheck, guardrails, lint,
   and diff review.
5. Update task, project state, and queue docs.

## Acceptance Criteria
- Closed runtime session positions require `closedAt >= session.startedAt`.
- Closed runtime session positions require `closedAt <= windowEnd`.
- Fee aggregation uses the same closed-position window.
- Existing PAPER/LIVE ownership scoping remains unchanged.

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
- Tests: `pnpm --filter api exec vitest run src/modules/bots/runtimeSessionPositionsRead.service.test.ts` (`5/5`), `pnpm --filter api run typecheck`, `pnpm run quality:guardrails`, `pnpm run lint`
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
- Rollback note: revert this commit to restore previous session read behavior
- Observability or alerting impact: none
- Staged rollout or feature flag: not applicable

## Autonomous Loop Evidence

### 1. Analyze Current State
- Issues: session closed-position reads bound start but not end.
- Gaps: completed session dashboards can include later closed PnL/fees.
- Inconsistencies: portfolio history uses closed window `gte/lte`; runtime
  session read uses only `gte`.
- Architecture constraints: dashboard read models must reflect canonical runtime
  windows and preserve existing ownership scopes.

### 2. Select One Priority Task
- Selected task: bound runtime session closed positions by window end.
- Priority rationale: dashboard values should be read-window deterministic.
- Why other candidates were deferred: broader symbol-stats and wallet marker
  audits continue in later one-slice iterations.

### 3. Plan Implementation
- Files or surfaces to modify: runtime session positions read service, focused
  unit tests, planning/context docs.
- Logic: centralize closed window shape and use it in closed positions plus fee
  aggregation.
- Edge cases: active sessions use current `windowEnd`; completed sessions use
  `finishedAt`.

### 4. Execute Implementation
- Implementation notes: added a shared runtime session closed-position window
  helper, applied it to closed-position and fee aggregation reads, and moved the
  existing botless LIVE trade fallback helper out of the monolithic service so
  guardrails remain satisfied.

### 5. Verify and Test
- Validation performed: focused runtime session position unit test, API
  typecheck, guardrails, lint, and diff review.
- Result: passed.

### 6. Self-Review
- Simpler option considered: inline `{ gte, lte }` in two query branches, but a
  helper keeps the session-window contract testable and avoids shape drift.
- Technical debt introduced: no
- Scalability assessment: improves large-service decomposition by extracting
  two small pure helpers.
- Refinements made: responded to guardrails by reducing monolith lines instead
  of adding an allowlist.

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
This is a read-model windowing fix only. It does not change execution,
position persistence, ownership, or exchange integration behavior.

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
- User or operator affected: dashboard operator reviewing runtime sessions
- Existing workaround or pain: old sessions can show later closed PnL/fees.
- Smallest useful slice: session closed-position window parity.
- Success metric or signal: focused unit test passes and dashboard read model
  uses start/end bounds.
- Feature flag, staged rollout, or disable path: not applicable
- Post-launch feedback or metric check: no

## Reliability / Observability Evidence
- `docs/operations/service-reliability-and-observability.md` reviewed: yes
- Critical user journey: bot runtime session dashboard positions.
- SLI: session read model returns positions from the requested session window.
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
- Trust boundaries: existing userId, botId, wallet, and ownership scopes.
- Permission or ownership checks: unchanged.
- Abuse cases: no cross-user or cross-bot reads introduced.
- Secret handling: none.
- Security tests or scans: typecheck and focused unit assertion.
- Fail-closed behavior: narrowed time window only.
- Residual risk: DB-backed e2e remains dependent on local PostgreSQL
  availability.

## Result Report

- Task summary: runtime session closed positions and fee aggregation are now
  bounded by both session start and window end.
- Files changed: runtime session position read service, extracted pure helper
  files, focused unit test, planning/context docs.
- How tested: focused runtime session position test (`5/5`), API typecheck,
  guardrails, lint, and diff review.
- What is incomplete: DB-backed e2e was not run because previous local
  PostgreSQL-backed suites have been unavailable in this environment.
- Next steps: continue auditing remaining runtime/dashboard parity drifts.
- Decisions made: extract pure helper files rather than expanding guardrail
  allowlists.
